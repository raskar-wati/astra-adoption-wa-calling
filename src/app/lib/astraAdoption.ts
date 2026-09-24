// Astra Voice Agent adoption — the customer context that decides which nudge a
// workspace sees, and when.
//
// Segments come from the calling-data analysis: workspaces differ less in how
// many calls they get than in how many they manage to answer, and that ratio is
// what decides whether Astra should answer everything or only catch the
// overflow. Segment 1 is deliberately never nudged — calling is incidental to
// those businesses and a pop-up would just be noise.

export type WorkspaceSegment = 1 | 2 | 3;

// Where a workspace sits on the way to having Astra answering calls. Setup
// happens on Astra's side; once that is done the routing switch lives in Wati.
export type AstraStatus =
  | 'not-set-up'      // never signed up — CTA hands off to Astra
  | 'trial'           // 7-day free trial running, routing still off
  | 'subscribed-off'  // set up and paid, not routing calls yet
  | 'subscribed-on';  // answering calls — nudges stop here

export type RoutingMode = 'ai-first' | 'overflow';

// Doubles as the `source` parameter on the hand-off URL, so the trigger that
// earned the click is attributable on Astra's side.
export type NudgeTrigger = 'low_pickup_rate' | 'after_hours' | 'logs_star_icon';

export interface SegmentProfile {
  segment: WorkspaceSegment;
  name: string;
  summary: string;
  /** Inbound calls answered today. */
  answered: number;
  /** All inbound attempts today, including declined and no-agent-online. */
  attempts: number;
  /** Calls that arrived after business hours yesterday evening. */
  afterHoursCalls: number;
  /** The routing mode that actually suits this segment. */
  recommended: RoutingMode;
}

export const SEGMENT_PROFILES: Record<WorkspaceSegment, SegmentProfile> = {
  1: {
    segment: 1,
    name: 'Low intent',
    summary: 'A handful of calls a week — calling is incidental to the business.',
    answered: 2,
    attempts: 6,
    afterHoursCalls: 0,
    recommended: 'overflow',
  },
  2: {
    segment: 2,
    name: 'Engaged but capacity-constrained',
    summary: 'Answers hundreds of calls, still leaks them at peak and overnight.',
    answered: 28,
    attempts: 62,
    afterHoursCalls: 6,
    recommended: 'overflow',
  },
  3: {
    segment: 3,
    name: 'High demand, barely answering',
    summary: 'Call demand structurally exceeds what the team will ever answer.',
    answered: 9,
    attempts: 78,
    afterHoursCalls: 23,
    recommended: 'ai-first',
  },
};

export function pickupRate(p: Pick<SegmentProfile, 'answered' | 'attempts'>): number {
  return p.attempts === 0 ? 1 : p.answered / p.attempts;
}

export function unansweredCount(p: Pick<SegmentProfile, 'answered' | 'attempts'>): number {
  return Math.max(0, p.attempts - p.answered);
}

// --- Trigger thresholds ----------------------------------------------------
// Pickup rate rather than a missed-call count: the missed-call field excludes
// declined, out-of-hours and no-agent-online attempts, so a count-based
// threshold would miss exactly the workspaces this is meant to catch.
export const LOW_PICKUP_THRESHOLD = 0.5;
// Stops a workspace being nudged off one or two unlucky calls.
export const MIN_ATTEMPTS_FLOOR = 10;

// --- Fatigue policy --------------------------------------------------------
// The target workspaces sit below the pickup threshold nearly every day, so
// without these caps the alert would fire daily on precisely the accounts we
// most need to keep on side.
export const FATIGUE = {
  /** At most one interruptive Astra modal per day, across all triggers. */
  sharedCooldownMs: 24 * 60 * 60 * 1000,
  /** Each trigger can only reappear after a week. */
  perTriggerCooldownMs: 7 * 24 * 60 * 60 * 1000,
  /** "Not now" pushes it out a fortnight. */
  snoozeMs: 14 * 24 * 60 * 60 * 1000,
  /** Three dismissals and the modal retires for good. */
  retireAfterDismissals: 3,
};

export interface NudgeRecord {
  lastShownAt: number | null;
  snoozedUntil: number | null;
  dismissals: number;
  retired: boolean;
}

export function emptyNudgeRecord(): NudgeRecord {
  return { lastShownAt: null, snoozedUntil: null, dismissals: 0, retired: false };
}

export type NudgeHistory = Record<NudgeTrigger, NudgeRecord>;

export function emptyNudgeHistory(): NudgeHistory {
  return {
    low_pickup_rate: emptyNudgeRecord(),
    after_hours: emptyNudgeRecord(),
    logs_star_icon: emptyNudgeRecord(),
  };
}

/** Workspaces we never interrupt: segment 1, and anyone already live on Astra. */
export function isNudgeable(segment: WorkspaceSegment, status: AstraStatus): boolean {
  return segment !== 1 && status !== 'subscribed-on';
}

export interface TriggerContext {
  segment: WorkspaceSegment;
  status: AstraStatus;
  profile: SegmentProfile;
  history: NudgeHistory;
  lastModalAt: number | null;
  now: number;
}

/** Why a modal is or isn't showing — surfaced in the dev switcher. */
export interface TriggerVerdict {
  fires: boolean;
  reason: string;
}

function checkFatigue(record: NudgeRecord, lastModalAt: number | null, now: number): TriggerVerdict | null {
  if (record.retired) return { fires: false, reason: 'retired after 3 dismissals' };
  if (record.snoozedUntil && now < record.snoozedUntil) return { fires: false, reason: 'snoozed' };
  if (record.lastShownAt && now - record.lastShownAt < FATIGUE.perTriggerCooldownMs) {
    return { fires: false, reason: 'shown within the last 7 days' };
  }
  if (lastModalAt && now - lastModalAt < FATIGUE.sharedCooldownMs) {
    return { fires: false, reason: 'another Astra modal already shown today' };
  }
  return null;
}

export function evaluateLowPickup(ctx: TriggerContext): TriggerVerdict {
  const { segment, status, profile, history, lastModalAt, now } = ctx;
  if (!isNudgeable(segment, status)) {
    return { fires: false, reason: segment === 1 ? 'segment 1 is never nudged' : 'Astra already answering' };
  }
  if (profile.attempts < MIN_ATTEMPTS_FLOOR) {
    return { fires: false, reason: `under the ${MIN_ATTEMPTS_FLOOR}-attempt floor` };
  }
  if (pickupRate(profile) >= LOW_PICKUP_THRESHOLD) {
    return { fires: false, reason: 'pickup rate is above 50%' };
  }
  return checkFatigue(history.low_pickup_rate, lastModalAt, now) ?? { fires: true, reason: 'pickup below 50%' };
}

export function evaluateAfterHours(ctx: TriggerContext): TriggerVerdict {
  const { segment, status, profile, history, lastModalAt, now } = ctx;
  if (!isNudgeable(segment, status)) {
    return { fires: false, reason: segment === 1 ? 'segment 1 is never nudged' : 'Astra already answering' };
  }
  if (profile.afterHoursCalls <= 0) {
    return { fires: false, reason: 'no after-hours calls last night' };
  }
  return checkFatigue(history.after_hours, lastModalAt, now) ?? { fires: true, reason: 'calls arrived after hours' };
}

/** Hand-off to Astra, carrying the trigger that earned the click. */
export function astraSetupUrl(trigger: NudgeTrigger): string {
  return `https://astra.ai/setup?source=wati_${trigger}`;
}

export const ROUTING_COPY: Record<RoutingMode, { label: string; blurb: string }> = {
  'ai-first': {
    label: 'AI-first',
    blurb: 'Astra answers every inbound call. Your team picks up follow-ups and escalations.',
  },
  overflow: {
    label: 'Overflow protection',
    blurb: 'Your agents ring first. Astra only answers when they are all on another call or it is outside business hours.',
  },
};

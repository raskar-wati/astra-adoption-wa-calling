import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import {
  AstraStatus,
  NudgeHistory,
  NudgeTrigger,
  RoutingMode,
  SEGMENT_PROFILES,
  SegmentProfile,
  TriggerVerdict,
  WorkspaceSegment,
  astraSetupUrl,
  emptyNudgeHistory,
  emptyNudgeRecord,
  evaluateAfterHours,
  evaluateLowPickup,
  FATIGUE,
} from './astraAdoption';

// One place for the workspace context every Astra surface reads: which segment
// this account is, how far along it is with Astra, and what it has already been
// shown. The dev switcher writes to the same state, so changing a segment
// re-renders every nudge at once.

export interface AstraEvent {
  at: number;
  label: string;
  detail?: string;
}

interface AstraAdoptionValue {
  segment: WorkspaceSegment;
  status: AstraStatus;
  routingMode: RoutingMode;
  profile: SegmentProfile;
  history: NudgeHistory;
  events: AstraEvent[];

  /** Which modal, if any, is on screen right now. */
  openNudge: NudgeTrigger | null;
  lowPickup: TriggerVerdict;
  afterHours: TriggerVerdict;

  setSegment: (s: WorkspaceSegment) => void;
  setStatus: (s: AstraStatus) => void;
  setRoutingMode: (m: RoutingMode) => void;

  /** Fired by a surface that wants to interrupt; respects the fatigue policy. */
  requestNudge: (trigger: NudgeTrigger) => void;
  /** Opens the modal regardless of fatigue — the star icon is user-initiated. */
  openNudgeDirectly: (trigger: NudgeTrigger) => void;
  snoozeNudge: (trigger: NudgeTrigger) => void;
  dismissNudge: (trigger: NudgeTrigger) => void;
  closeNudge: () => void;

  /** Channel the inbox should switch to, so a surface is shown in context. */
  pendingChannel: string | null;
  clearPendingChannel: () => void;
  /** Briefly rings the missed-call stars after navigating to them. */
  starHighlight: boolean;
  /** Demo entry point: go to where a surface lives, then show it. */
  showSurface: (trigger: NudgeTrigger) => void;

  /** Hands off to Astra; in the prototype this advances to the free trial. */
  startAstraTrial: (trigger: NudgeTrigger) => void;
  /** Turns routing on from inside Wati — only valid once setup is done. */
  enableAstra: (mode: RoutingMode, trigger: NudgeTrigger) => void;

  resetNudgeHistory: () => void;
}

const AstraAdoptionCtx = createContext<AstraAdoptionValue | null>(null);

export function AstraAdoptionProvider({ children }: React.PropsWithChildren<{}>) {
  const [segment, setSegmentState] = useState<WorkspaceSegment>(3);
  const [status, setStatus] = useState<AstraStatus>('not-set-up');
  const [routingMode, setRoutingMode] = useState<RoutingMode>('ai-first');
  const [history, setHistory] = useState<NudgeHistory>(emptyNudgeHistory);
  const [lastModalAt, setLastModalAt] = useState<number | null>(null);
  const [openNudge, setOpenNudge] = useState<NudgeTrigger | null>(null);
  const [events, setEvents] = useState<AstraEvent[]>([]);
  const [pendingChannel, setPendingChannel] = useState<string | null>(null);
  const [starHighlight, setStarHighlight] = useState(false);

  const profile = SEGMENT_PROFILES[segment];

  const log = useCallback((label: string, detail?: string) => {
    setEvents((prev) => [{ at: Date.now(), label, detail }, ...prev].slice(0, 12));
  }, []);

  // Recomputed per render so the dev switcher can explain why a nudge is or
  // is not firing, not just whether it is.
  const now = Date.now();
  const ctx = { segment, status, profile, history, lastModalAt, now };
  const lowPickup = evaluateLowPickup(ctx);
  const afterHours = evaluateAfterHours(ctx);

  const markShown = useCallback((trigger: NudgeTrigger) => {
    const at = Date.now();
    setHistory((prev) => ({ ...prev, [trigger]: { ...prev[trigger], lastShownAt: at } }));
    setLastModalAt(at);
  }, []);

  const requestNudge = useCallback((trigger: NudgeTrigger) => {
    setOpenNudge((current) => {
      if (current) return current;
      markShown(trigger);
      return trigger;
    });
  }, [markShown]);

  const openNudgeDirectly = useCallback((trigger: NudgeTrigger) => {
    setOpenNudge(trigger);
    log('Nudge opened', trigger);
  }, [log]);

  const closeNudge = useCallback(() => setOpenNudge(null), []);

  const snoozeNudge = useCallback((trigger: NudgeTrigger) => {
    setHistory((prev) => ({
      ...prev,
      [trigger]: { ...prev[trigger], snoozedUntil: Date.now() + FATIGUE.snoozeMs },
    }));
    setOpenNudge(null);
    log('Snoozed 14 days', trigger);
  }, [log]);

  const dismissNudge = useCallback((trigger: NudgeTrigger) => {
    setHistory((prev) => {
      const dismissals = prev[trigger].dismissals + 1;
      return {
        ...prev,
        [trigger]: {
          ...prev[trigger],
          dismissals,
          retired: dismissals >= FATIGUE.retireAfterDismissals,
        },
      };
    });
    setOpenNudge(null);
    log('Dismissed', trigger);
  }, [log]);

  const startAstraTrial = useCallback((trigger: NudgeTrigger) => {
    // The real hand-off opens Astra with the trigger as a source parameter and
    // SSO carries the account across. Here we jump straight to the trial so the
    // whole journey stays demonstrable in one place.
    setStatus('trial');
    setOpenNudge(null);
    log('Handed off to Astra', astraSetupUrl(trigger));
  }, [log]);

  const enableAstra = useCallback((mode: RoutingMode, trigger: NudgeTrigger) => {
    setRoutingMode(mode);
    setStatus('subscribed-on');
    setOpenNudge(null);
    log(`Astra on — ${mode}`, trigger);
  }, [log]);

  const clearPendingChannel = useCallback(() => setPendingChannel(null), []);

  // Every nudge lives on the calling side of the inbox, so showing one means
  // navigating there first — otherwise a modal appears over an unrelated
  // screen and it is not obvious what changed.
  const showSurface = useCallback((trigger: NudgeTrigger) => {
    setPendingChannel('WhatsApp Calls');
    if (trigger === 'logs_star_icon') {
      // Leave the modal closed: the point is to see the star in the call log.
      setStarHighlight(true);
      window.setTimeout(() => setStarHighlight(false), 4000);
      log('Jumped to call log', 'missed-call star');
      return;
    }
    setOpenNudge(trigger);
    markShown(trigger);
    log('Nudge shown', trigger);
  }, [log, markShown]);

  const setSegment = useCallback((s: WorkspaceSegment) => {
    setSegmentState(s);
    setRoutingMode(SEGMENT_PROFILES[s].recommended);
  }, []);

  const resetNudgeHistory = useCallback(() => {
    setHistory(emptyNudgeHistory());
    setLastModalAt(null);
    setOpenNudge(null);
    setEvents([]);
  }, []);

  const value = useMemo<AstraAdoptionValue>(() => ({
    segment, status, routingMode, profile, history, events,
    openNudge, lowPickup, afterHours,
    pendingChannel, clearPendingChannel, starHighlight, showSurface,
    setSegment, setStatus, setRoutingMode,
    requestNudge, openNudgeDirectly, snoozeNudge, dismissNudge, closeNudge,
    startAstraTrial, enableAstra, resetNudgeHistory,
  }), [
    segment, status, routingMode, profile, history, events,
    openNudge, lowPickup.fires, lowPickup.reason, afterHours.fires, afterHours.reason,
    pendingChannel, clearPendingChannel, starHighlight, showSurface,
    setSegment, requestNudge, openNudgeDirectly, snoozeNudge, dismissNudge,
    closeNudge, startAstraTrial, enableAstra, resetNudgeHistory,
  ]);

  return <AstraAdoptionCtx.Provider value={value}>{children}</AstraAdoptionCtx.Provider>;
}

export function useAstraAdoption(): AstraAdoptionValue {
  const ctx = useContext(AstraAdoptionCtx);
  if (!ctx) throw new Error('useAstraAdoption must be used inside AstraAdoptionProvider');
  return ctx;
}

export { emptyNudgeRecord };

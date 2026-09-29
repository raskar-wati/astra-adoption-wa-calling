import {
  AstraStatus,
  ROUTING_COPY,
  RoutingMode,
  SegmentProfile,
  WorkspaceSegment,
  unansweredCount,
} from './astraAdoption';

// What Astra says in its thread. Scripted, not generated: it opens with the
// workspace's own missed calls as the hook, answers a handful of topics, and
// every answer that can steers back to switching Astra on.

export type AstraTopic =
  | 'who'
  | 'how'
  | 'cost'
  | 'after_hours'
  | 'busiest'
  | 'language'
  | 'yes'
  | 'no'
  | 'fallback';

export interface AstraReply {
  lines: string[];
  /** End the reply with the offer card. */
  offer: boolean;
}

export interface AstraScriptContext {
  profile: SegmentProfile;
  segment: WorkspaceSegment;
  status: AstraStatus;
  routingMode: RoutingMode;
}

// The missed callers in the prototype's call log.
const REPEAT_CALLER_SAMPLE = ['Vikram', 'Sofia V', 'Zara Zara'];

// Checked in order, so the specific topics win over a bare "yes" or "no".
const TOPIC_PATTERNS: [AstraTopic, RegExp][] = [
  ['who', /\bwho\b|called|caller|missed|names?/i],
  ['cost', /cost|price|pric|pay|charge|trial|free|subscri|expensive/i],
  ['after_hours', /after.?hours|night|closed|weekend|evening/i],
  ['busiest', /busy|busiest|peak|when\b|time of day/i],
  ['language', /language|hindi|arabic|spanish|speak/i],
  ['how', /how|work|transfer|handoff|hand.?off|human|agent|team/i],
  ['yes', /^(y(es|eah|ep)?|sure|ok(ay)?|go|do it|please|set (it|me) up|turn (it )?on|connect|start|sign me up)\b/i],
  ['no', /^(no|nope|not now|later|maybe later|nah)\b/i],
];

export function detectTopic(text: string): AstraTopic {
  const t = text.trim();
  for (const [topic, re] of TOPIC_PATTERNS) if (re.test(t)) return topic;
  return 'fallback';
}

export function hookLines({ profile, status }: AstraScriptContext): string[] {
  const unanswered = unansweredCount(profile);

  if (status === 'subscribed-on') {
    return [
      `Today I picked up ${unanswered} ${unanswered === 1 ? 'call' : 'calls'} your team couldn't get to.`,
      `Each one is in its chat thread with a transcript and summary, so your team can follow up.`,
      `Ask me anything about today's calls.`,
    ];
  }

  const opener =
    profile.repeatCallers > 0
      ? `${profile.repeatCallers} people called you more than once today and never got through.`
      : `${unanswered} of your ${profile.attempts} calls went unanswered today.`;

  const afterHours = profile.afterHoursCalls > 0 ? ` — ${profile.afterHoursCalls} came in after you closed` : '';

  return [
    opener,
    `That's ${unanswered} missed out of ${profile.attempts}${afterHours}. ${profile.awaitingCallback} of those callers still haven't had a callback.`,
    `Want me to pick these up for you?`,
  ];
}

export function replyFor(topic: AstraTopic, ctx: AstraScriptContext): AstraReply {
  const { profile, segment, status, routingMode } = ctx;
  const isOn = status === 'subscribed-on';
  const mode = isOn ? routingMode : profile.recommended;
  const offer = !isOn;

  switch (topic) {
    case 'who':
      return {
        lines: [
          `The ones who kept trying: ${REPEAT_CALLER_SAMPLE.join(', ').replace(/, ([^,]*)$/, ' and $1')}.`,
          `${profile.awaitingCallback} callers are still waiting on a callback, most of them from ${profile.busiestWindow}.`,
          ...(isOn ? [] : ['If I had been answering, every one of them would have reached someone.']),
        ],
        offer,
      };
    case 'how':
      return {
        lines: [
          ROUTING_COPY[mode].blurb,
          'When a caller needs a person, I transfer them mid-call — and I leave a transcript and summary in the chat thread.',
          ...(segment === 2 && !isOn ? ['Your team keeps answering first. I only pick up what they cannot.'] : []),
        ],
        offer,
      };
    case 'cost':
      return {
        lines: [
          status === 'not-set-up'
            ? "I'm a separate subscription, and you can try me free for 7 days. Setup takes a few minutes on Astra, then you switch me on here in Wati."
            : status === 'trial'
              ? "You're already on your free trial — all that's left is switching me on."
              : status === 'subscribed-off'
                ? "You're already subscribed — I just need switching on."
                : "You're all set — I'm already part of your subscription.",
        ],
        offer,
      };
    case 'after_hours':
      return {
        lines: [
          profile.afterHoursCalls > 0
            ? `${profile.afterHoursCalls} people called after you closed last night. Nobody was there to pick up.`
            : 'Nobody called after hours last night — but when they do, the line just rings out.',
          'I answer around the clock, weekends included.',
        ],
        offer,
      };
    case 'busiest':
      return {
        lines: [`Most calls go unanswered between ${profile.busiestWindow}. That's exactly when I'd take the overflow.`],
        offer,
      };
    case 'language':
      return {
        lines: ['I pick up in whatever language the caller opens with, and switch if they do.'],
        offer,
      };
    case 'yes':
      return isOn
        ? { lines: ["I'm already answering your calls."], offer: false }
        : { lines: ["Great — here's how to get me answering."], offer: true };
    case 'no':
      return {
        lines: [`No problem. I'll keep count here — ${profile.awaitingCallback} callers are still waiting on a callback today.`],
        offer: false,
      };
    case 'fallback':
    default:
      return {
        lines: ["I can't help with that one yet. I can tell you who called, how I'd handle your calls, or what it costs."],
        offer: false,
      };
  }
}

/** What Astra says when the workspace moves along, from inside the thread. */
export function statusChangeLines(status: AstraStatus, ctx: AstraScriptContext): AstraReply | null {
  const label = ROUTING_COPY[ctx.profile.recommended].label;
  if (status === 'trial') {
    return {
      lines: [`Your 7-day trial has started. Once setup on Astra is done, switch me on here and I'll start with ${label}.`],
      offer: true,
    };
  }
  if (status === 'subscribed-on') {
    return {
      lines: [`Done — I'm answering with ${ROUTING_COPY[ctx.routingMode].label}. You'll find a transcript and summary in each caller's chat.`],
      offer: false,
    };
  }
  return null;
}

export interface QuickReply {
  label: string;
  topic: AstraTopic;
}

const QUICK_REPLIES_OFF: QuickReply[] = [
  { label: 'Yes, set it up', topic: 'yes' },
  { label: 'Who called?', topic: 'who' },
  { label: 'How would it work?', topic: 'how' },
  { label: 'What does it cost?', topic: 'cost' },
];

const QUICK_REPLIES_ON: QuickReply[] = [
  { label: 'Who called?', topic: 'who' },
  { label: 'When are we busiest?', topic: 'busiest' },
  { label: 'How do handovers work?', topic: 'how' },
];

/** Suggestions still worth offering — "set it up" stays until it is done. */
export function quickReplies(status: AstraStatus, asked: Set<AstraTopic>): QuickReply[] {
  const pool = status === 'subscribed-on' ? QUICK_REPLIES_ON : QUICK_REPLIES_OFF;
  return pool.filter((q) => q.topic === 'yes' || !asked.has(q.topic));
}

import { SEGMENT_PROFILES, WorkspaceSegment, unansweredCount } from '../lib/astraAdoption';

// WhatsApp Calls Analytics for the last 7 days, derived from the same segment
// profile the call log and nudges read — so a customer's numbers agree
// wherever they appear. Daily figures in the profile are scaled to a week.

export interface CallOverview {
  totalCallVolume: number;
  outboundConnected: number;
  outboundAttempted: number;
  inboundCalls: number;
  missedCalls: number;
  /** Seconds. */
  avgCallDuration: number;
}

export interface AgentPerformance {
  agent: string;
  /** Seconds. */
  avgCallDuration: number;
  outboundAttempted: number;
  outboundConnected: number;
  inboundCalls: number;
}

export interface CallAnalytics {
  overview: CallOverview;
  agents: AgentPerformance[];
}

// How much outbound calling each segment does per day, and how long calls run.
const OUTBOUND_PER_DAY: Record<WorkspaceSegment, { attempted: number; connected: number; avgSeconds: number }> = {
  1: { attempted: 2, connected: 1, avgSeconds: 96 },
  2: { attempted: 44, connected: 31, avgSeconds: 214 },
  3: { attempted: 17, connected: 9, avgSeconds: 161 },
};

// The team from the call log, busiest first. Weights split the answered and
// outbound work between them.
const AGENTS: { name: string; weight: number }[] = [
  { name: 'Melvis', weight: 0.2 },
  { name: 'Rohit', weight: 0.16 },
  { name: 'Maria', weight: 0.14 },
  { name: 'Dylan', weight: 0.12 },
  { name: 'Nia', weight: 0.1 },
  { name: 'Omar', weight: 0.09 },
  { name: 'Tara', weight: 0.08 },
  { name: 'Becca', weight: 0.06 },
  { name: 'Chloe', weight: 0.05 },
];

const DAYS = 7;

export function callAnalyticsFor(segment: WorkspaceSegment): CallAnalytics {
  const p = SEGMENT_PROFILES[segment];
  const out = OUTBOUND_PER_DAY[segment];

  const inboundCalls = p.attempts * DAYS;
  const missedCalls = unansweredCount(p) * DAYS;
  const answered = p.answered * DAYS;
  const outboundAttempted = out.attempted * DAYS;
  const outboundConnected = out.connected * DAYS;

  // Spread agent work so each column adds up to the overview exactly.
  const split = (total: number) => {
    const parts = AGENTS.map((a) => Math.floor(total * a.weight));
    let rest = total - parts.reduce((s, n) => s + n, 0);
    for (let i = 0; rest > 0; i = (i + 1) % parts.length, rest--) parts[i]++;
    return parts;
  };
  const inboundSplit = split(answered);
  const attemptedSplit = split(outboundAttempted);
  const connectedSplit = split(outboundConnected);

  return {
    overview: {
      totalCallVolume: inboundCalls + outboundAttempted,
      outboundConnected,
      outboundAttempted,
      inboundCalls,
      missedCalls,
      avgCallDuration: out.avgSeconds,
    },
    agents: AGENTS.map((a, i) => ({
      agent: a.name,
      // Busier agents keep calls a little shorter.
      avgCallDuration: Math.round(out.avgSeconds * (1.15 - a.weight)),
      outboundAttempted: attemptedSplit[i],
      outboundConnected: Math.min(connectedSplit[i], attemptedSplit[i]),
      inboundCalls: inboundSplit[i],
    })),
  };
}

export function formatDuration(seconds: number): string {
  if (seconds <= 0) return '0s';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

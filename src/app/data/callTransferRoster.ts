// Who a WhatsApp call can be transferred to, from the "Astra & Human call
// transfer UX" reference. The agent on the call is Vijay Kumar (Support).
//
// There is no receiving agent in the prototype, so each target also carries
// how it answers — enough to walk every outcome from one seat: accepted,
// declined, and a ring that runs out.

export type Presence = 'available' | 'oncall' | 'unavailable';

export interface Operator {
  id: string;
  name: string;
  team: string;
  presence: Presence;
}

export interface Team {
  id: string;
  name: string;
  /** Operators rung when the team is chosen (simultaneous ring). */
  members: string[];
}

/** How a target answers the transfer request in the demo. */
export type SimulatedAnswer =
  | { kind: 'accept'; afterSecs: number; by: string }
  | { kind: 'decline'; afterSecs: number; by: string }
  | { kind: 'noanswer' };

export const SELF_ID = 'vijay';

/** The transfer request rings for this long before it counts as not answered. */
export const RING_WINDOW_SECS = 30;

export const OPERATORS: Record<string, Operator> = {
  vijay: { id: 'vijay', name: 'Vijay Kumar', team: 'Support', presence: 'available' },
  meera: { id: 'meera', name: 'Meera Nair', team: 'Payments', presence: 'available' },
  rohan: { id: 'rohan', name: 'Rohan Das', team: 'Payments', presence: 'available' },
  dylan: { id: 'dylan', name: 'Dylan Fox', team: 'Billing', presence: 'oncall' },
  nia: { id: 'nia', name: 'Nia Sharma', team: 'Support', presence: 'unavailable' },
  aarav: { id: 'aarav', name: 'Aarav Menon', team: 'Support', presence: 'available' },
  sana: { id: 'sana', name: 'Sana Iqbal', team: 'Support', presence: 'available' },
  kabir: { id: 'kabir', name: 'Kabir Rao', team: 'Support', presence: 'oncall' },
  tara: { id: 'tara', name: 'Tara Shetty', team: 'Support', presence: 'available' },
  omar: { id: 'omar', name: 'Omar Sheikh', team: 'Support', presence: 'unavailable' },
};

export const TEAMS: Record<string, Team> = {
  payments: { id: 'payments', name: 'Payments', members: ['meera', 'rohan'] },
  billing: { id: 'billing', name: 'Billing', members: ['rohan'] },
  support: { id: 'support', name: 'Support', members: ['aarav', 'sana', 'tara'] },
  escalations: { id: 'escalations', name: 'Escalations', members: [] },
};

const ANSWERS: Record<string, SimulatedAnswer> = {
  'team:payments': { kind: 'accept', afterSecs: 5, by: 'meera' },
  'team:support': { kind: 'accept', afterSecs: 4, by: 'aarav' },
  'team:billing': { kind: 'noanswer' },
  'operator:meera': { kind: 'noanswer' },
  'operator:rohan': { kind: 'accept', afterSecs: 5, by: 'rohan' },
  'operator:aarav': { kind: 'accept', afterSecs: 4, by: 'aarav' },
  'operator:sana': { kind: 'decline', afterSecs: 6, by: 'sana' },
  'operator:tara': { kind: 'accept', afterSecs: 5, by: 'tara' },
};

export type TransferTarget = { type: 'operator' | 'team'; id: string };

export function answerFor(target: TransferTarget): SimulatedAnswer {
  return ANSWERS[`${target.type}:${target.id}`] ?? { kind: 'noanswer' };
}

export function targetName(target: TransferTarget): string {
  return target.type === 'team' ? TEAMS[target.id].name : OPERATORS[target.id].name;
}

/** Operators in a team who can take a call right now. */
export function availableIn(team: Team): number {
  return team.members.filter((m) => OPERATORS[m].presence === 'available').length;
}

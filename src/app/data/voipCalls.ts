// VoIP channel data — independent from WhatsApp calling.
// The VoIP channel connects to an external VoIP API for inbound/outbound
// calls. Call records here map to transcription entries (voip-N) in
// callTranscriptions.ts.

export type VoipCallType = 'incoming' | 'outgoing' | 'missed';

// Who took the call. Absent means a human teammate handled it; 'astra'
// means the AI agent answered and ran the conversation end to end.
export type VoipCallHandler = 'agent' | 'astra';

export interface VoipCall {
  id: string;
  // Absent for numbers nobody has saved yet — the common case on a VoIP line.
  // Render through voipCallerLabel() so those fall back to the number.
  name?: string;
  phoneNumber: string;
  type: VoipCallType;
  status: string;
  duration: string;
  time: string;
  date: string;
  // Initials, only meaningful when the caller is a known contact.
  avatar?: string;
  handledBy?: VoipCallHandler;
  // Teammate who took it. Omitted when Astra handled it, or nobody did.
  agentName?: string;
}

// What to show as the caller's identity in a list row or header.
export function voipCallerLabel(call: VoipCall): string {
  return call.name ?? call.phoneNumber;
}

export const VOIP_CALLS: VoipCall[] = [
  {
    id: 'voip-1',
    name: 'Priya Sharma',
    phoneNumber: '+1 (555) 204-4471',
    type: 'outgoing',
    status: 'Outbound call',
    duration: '6m 42s',
    time: '9:12 AM',
    date: 'Today',
    avatar: 'PS',
    agentName: 'Jordan'
  },
  {
    id: 'voip-2',
    name: 'April Boyer',
    phoneNumber: '+1 (555) 771-3390',
    type: 'incoming',
    status: 'Inbound call',
    duration: '3m 05s',
    time: '11:48 AM',
    date: 'Today',
    avatar: 'AB',
    handledBy: 'astra'
  },
  {
    id: 'voip-6',
    phoneNumber: '+1 (555) 318-2204',
    type: 'incoming',
    status: 'Inbound call',
    duration: '4m 51s',
    time: '2:35 PM',
    date: 'Today',
    handledBy: 'astra'
  },
  {
    id: 'voip-7',
    name: 'Addison Smith',
    phoneNumber: '+1 (555) 662-9015',
    type: 'outgoing',
    status: 'Outbound call',
    duration: '11m 24s',
    time: '4:50 PM',
    date: 'Today',
    avatar: 'AS',
    agentName: 'Maya'
  },
  {
    id: 'voip-3',
    name: 'David Chen',
    phoneNumber: '+1 (555) 456-7890',
    type: 'outgoing',
    status: 'Outbound call',
    duration: '8m 18s',
    time: '4:20 PM',
    date: 'Yesterday',
    avatar: 'DC',
    agentName: 'Nia'
  },
  {
    id: 'voip-8',
    phoneNumber: '+1 (555) 318-2204',
    type: 'missed',
    status: 'Missed call',
    duration: '—',
    time: '10:05 AM',
    date: 'Yesterday',
  },
  {
    id: 'voip-9',
    name: 'Addison Smith',
    phoneNumber: '+1 (555) 662-9015',
    type: 'incoming',
    status: 'Inbound call',
    duration: '1m 39s',
    time: '3:15 PM',
    date: 'Yesterday',
    avatar: 'AS',
    handledBy: 'astra'
  },
  {
    id: 'voip-4',
    name: 'Marcus Allen',
    phoneNumber: '+1 (555) 123-4567',
    type: 'incoming',
    status: 'Inbound call',
    duration: '2m 47s',
    time: '1:05 PM',
    date: 'Feb 1',
    avatar: 'MA',
    agentName: 'Maya'
  },
  {
    id: 'voip-5',
    name: 'Sarah Johnson',
    phoneNumber: '+1 (555) 987-6543',
    type: 'missed',
    status: 'Missed call',
    duration: '—',
    time: '8:32 AM',
    date: 'Feb 1',
    avatar: 'SJ'
  },
  {
    id: 'voip-10',
    phoneNumber: '+1 (555) 840-1157',
    type: 'missed',
    status: 'Missed call',
    duration: '—',
    time: '5:40 PM',
    date: 'Feb 1',
  }
];

export interface VoipContact {
  name: string;
  phoneNumber: string;
  extension: string;
  lineType: string;
  plan: string;
  location: string;
  sipAddress: string;
  totalCalls: number;
  avgDuration: string;
  firstSeen: string;
}

// VoIP-specific contact metadata (keyed by contact name).
export const VOIP_CONTACTS: Record<string, VoipContact> = {
  'Rahul Mehta': {
    name: 'Rahul Mehta',
    phoneNumber: '+1 (555) 318-2204',
    extension: '1096',
    lineType: 'Softphone',
    plan: 'Global bundle',
    location: 'Pune, IN',
    sipAddress: 'rahul.mehta@voip.company.io',
    totalCalls: 11,
    avgDuration: '4m 30s',
    firstSeen: 'Oct 2025'
  },
  'Addison Smith': {
    name: 'Addison Smith',
    phoneNumber: '+1 (555) 662-9015',
    extension: '1134',
    lineType: 'Desk phone',
    plan: 'Global bundle',
    location: 'Toronto, CA',
    sipAddress: 'addison.smith@voip.company.io',
    totalCalls: 17,
    avgDuration: '8m 10s',
    firstSeen: 'Aug 2025'
  },
  'Priya Sharma': {
    name: 'Priya Sharma',
    phoneNumber: '+1 (555) 204-4471',
    extension: '1042',
    lineType: 'Softphone',
    plan: 'Global bundle',
    location: 'Austin, TX',
    sipAddress: 'priya.sharma@voip.company.io',
    totalCalls: 14,
    avgDuration: '5m 20s',
    firstSeen: 'Nov 2025'
  },
  'April Boyer': {
    name: 'April Boyer',
    phoneNumber: '+1 (555) 771-3390',
    extension: '1088',
    lineType: 'Desk phone',
    plan: 'Domestic',
    location: 'Denver, CO',
    sipAddress: 'april.boyer@voip.company.io',
    totalCalls: 6,
    avgDuration: '3m 12s',
    firstSeen: 'Jan 2026'
  },
  'David Chen': {
    name: 'David Chen',
    phoneNumber: '+1 (555) 456-7890',
    extension: '1120',
    lineType: 'SIP trunk',
    plan: 'Global bundle',
    location: 'Berlin, DE',
    sipAddress: 'david.chen@voip.company.io',
    totalCalls: 22,
    avgDuration: '7m 45s',
    firstSeen: 'Sep 2025'
  },
  'Marcus Allen': {
    name: 'Marcus Allen',
    phoneNumber: '+1 (555) 123-4567',
    extension: '1055',
    lineType: 'Softphone',
    plan: 'Domestic',
    location: 'Chicago, IL',
    sipAddress: 'marcus.allen@voip.company.io',
    totalCalls: 9,
    avgDuration: '4m 05s',
    firstSeen: 'Dec 2025'
  },
  'Sarah Johnson': {
    name: 'Sarah Johnson',
    phoneNumber: '+1 (555) 987-6543',
    extension: '1073',
    lineType: 'Desk phone',
    plan: 'Domestic',
    location: 'Seattle, WA',
    sipAddress: 'sarah.johnson@voip.company.io',
    totalCalls: 3,
    avgDuration: '2m 30s',
    firstSeen: 'Feb 2026'
  }
};

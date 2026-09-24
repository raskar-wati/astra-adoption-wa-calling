import React from 'react';
import {
  Phone,
  Hash,
  MapPin,
  Server,
  CreditCard,
  Waypoints,
  PhoneOutgoing,
  PhoneIncoming,
  PhoneMissed,
  Clock,
  Calendar
} from 'lucide-react';
import { VoipCall, voipCallerLabel, VOIP_CONTACTS, VOIP_CALLS } from '../data/voipCalls';
import { VoipAvatar } from './VoipAvatar';

interface VoipContactInfoProps {
  call?: VoipCall;
}

// Independent VoIP contact panel — VoIP line details and call history.
// Not the WhatsApp ContactInfo component.
export function VoipContactInfo({ call }: VoipContactInfoProps) {
  if (!call) {
    return (
      <div className="h-full bg-white border-l border-gray-200 flex flex-col items-center justify-center p-8">
        <div className="text-center space-y-3">
          <div className="w-14 h-14 mx-auto bg-gray-100 rounded-2xl flex items-center justify-center">
            <Waypoints className="w-7 h-7 text-gray-900" />
          </div>
          <p className="text-sm text-gray-500">Select a call to see VoIP contact details.</p>
        </div>
      </div>
    );
  }

  // An unsaved number has no contact record to look up.
  const contact = call.name ? VOIP_CONTACTS[call.name] : undefined;
  // Group history by the line, not the name — that's what identifies a
  // caller here, and it keeps repeat calls from one unsaved number together.
  const history = VOIP_CALLS.filter((c) => c.phoneNumber === call.phoneNumber);

  const rows: { icon: React.ElementType; label: string; value: string }[] = [
    { icon: Phone, label: 'VoIP number', value: contact?.phoneNumber ?? call.phoneNumber },
    { icon: Hash, label: 'Extension', value: contact?.extension ?? '—' },
    { icon: Server, label: 'Line type', value: contact?.lineType ?? '—' },
    { icon: CreditCard, label: 'Plan', value: contact?.plan ?? '—' },
    { icon: MapPin, label: 'Location', value: contact?.location ?? '—' }
  ];

  return (
    <div className="h-full bg-white border-l border-gray-200 flex flex-col overflow-y-auto">
      {/* Identity */}
      <div className="px-6 py-6 border-b border-gray-100 flex flex-col items-center text-center">
        <VoipAvatar name={call.name} size="lg" className="mb-3" />
        <h2 className="font-semibold text-gray-900">{voipCallerLabel(call)}</h2>
        {contact?.sipAddress && (
          <p className="text-xs text-gray-500 mt-0.5 break-all">{contact.sipAddress}</p>
        )}
        <span className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-full bg-gray-100 text-gray-900 text-[11px] font-medium">
          <Waypoints className="w-3 h-3" />
          VoIP contact
        </span>
      </div>

      {/* Line details */}
      <div className="px-6 py-5 border-b border-gray-100">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-4">Line details</h3>
        <div className="space-y-4">
          {rows.map((row) => {
            const Icon = row.icon;
            return (
              <div key={row.label} className="flex items-start gap-3">
                <Icon className="w-4 h-4 text-gray-900 mt-0.5 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-[11px] text-gray-400">{row.label}</p>
                  <p className="text-sm text-gray-800 break-words">{row.value}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Call stats */}
      {contact && (
        <div className="px-6 py-5 border-b border-gray-100">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-4">Call stats</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-gray-100 p-3">
              <p className="text-lg font-semibold text-gray-900">{contact.totalCalls}</p>
              <p className="text-[11px] text-gray-500">Total calls</p>
            </div>
            <div className="rounded-xl bg-gray-100 p-3">
              <p className="text-lg font-semibold text-gray-900">{contact.avgDuration}</p>
              <p className="text-[11px] text-gray-500">Avg duration</p>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
            <Calendar className="w-3.5 h-3.5" />
            First contacted {contact.firstSeen}
          </div>
        </div>
      )}

      {/* Recent history */}
      <div className="px-6 py-5">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-4">Recent calls</h3>
        <div className="space-y-3">
          {history.map((h) => {
            const Icon =
              h.type === 'incoming' ? PhoneIncoming : h.type === 'outgoing' ? PhoneOutgoing : PhoneMissed;
            const iconColor = h.type === 'missed' ? 'text-red-500' : 'text-gray-900';
            return (
              <div key={h.id} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0">
                  <Icon className={`w-4 h-4 ${iconColor}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-gray-800 truncate">{h.status}</p>
                  <p className="text-[11px] text-gray-400">
                    {h.date} · {h.time}
                  </p>
                </div>
                <span className="text-xs text-gray-500 font-mono flex items-center gap-1 flex-shrink-0">
                  <Clock className="w-3 h-3" />
                  {h.duration}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default VoipContactInfo;

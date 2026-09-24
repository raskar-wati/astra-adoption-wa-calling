import React, { useEffect, useRef } from 'react';
import { PhoneForwarded, Phone, PhoneOff } from 'lucide-react';

interface IncomingTransferCardProps {
  transferredBy: string;
  transferredByInitials: string;
  reason: string;
  contactName: string;
  contactPhone: string;
  ringTimeLeft: number;
  ringDuration: number;
  onAccept: () => void;
  onDecline: () => void;
}

// Pulsing ring animation style
const pulseStyle = `
  @keyframes ring-pulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(35, 164, 85, 0.4); }
    50% { box-shadow: 0 0 0 6px rgba(35, 164, 85, 0); }
  }
`;

export function IncomingTransferCard({
  transferredBy,
  transferredByInitials,
  reason,
  contactName,
  contactPhone,
  ringTimeLeft,
  ringDuration,
  onAccept,
  onDecline,
}: IncomingTransferCardProps) {
  const progress = ringTimeLeft / ringDuration;

  // Initials background color derived from name
  const senderColors = { bg: '#EBF3FB', text: '#2563EB' };
  const contactColors = { bg: '#E8F5EE', text: '#23A455' };

  return (
    <>
      <style>{pulseStyle}</style>
      <div
        className="fixed bottom-6 right-6 w-[320px] bg-white rounded-2xl shadow-2xl border border-[#E7E9E8] z-[60] overflow-hidden"
        style={{ animation: 'slideInUp 0.3s ease-out' }}
      >
        {/* Green accent top bar */}
        <div className="h-[3px] bg-[#23A455]" />

        <div className="p-4 flex flex-col gap-3">
          {/* Header */}
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-full bg-[#E8F5EE] flex items-center justify-center shrink-0"
              style={{ animation: 'ring-pulse 1.5s ease-in-out infinite' }}
            >
              <PhoneForwarded className="w-3.5 h-3.5 text-[#23A455]" />
            </div>
            <div className="flex-1">
              <p className="text-[12px] font-semibold text-[#1b1d1c]">Incoming Transfer</p>
              <p className="text-[11px] text-[#9CA3AF]">You have a new call transfer request</p>
            </div>
          </div>

          {/* Sender info */}
          <div className="bg-[#F6F7F6] rounded-xl p-3 flex flex-col gap-2">
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-semibold shrink-0"
                style={{ backgroundColor: senderColors.bg, color: senderColors.text }}
              >
                {transferredByInitials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] text-[#505451]">Transferred by</p>
                <p className="text-[13px] font-semibold text-[#1b1d1c] truncate">{transferredBy}</p>
              </div>
            </div>
            {reason && (
              <p className="text-[12px] text-[#505451] italic leading-[1.4] border-l-2 border-[#23A455] pl-2">
                "{reason}"
              </p>
            )}
          </div>

          {/* Customer info */}
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-semibold shrink-0"
              style={{ backgroundColor: contactColors.bg, color: contactColors.text }}
            >
              {contactName.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-[#1b1d1c] truncate">{contactName}</p>
              <p className="text-[11px] text-[#9CA3AF]">{contactPhone}</p>
            </div>
          </div>

          {/* Ring timer progress bar */}
          <div className="flex flex-col gap-1">
            <div className="h-1 bg-[#E7E9E8] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#23A455] rounded-full transition-all duration-1000 ease-linear"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-[#9CA3AF]">Auto-declines in</span>
              <span className={`text-[11px] font-semibold tabular-nums ${ringTimeLeft <= 5 ? 'text-[#EC3244]' : 'text-[#505451]'}`}>
                {ringTimeLeft}s
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            <button
              onClick={onDecline}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border border-[#E7E9E8] text-[12px] font-medium text-[#505451] hover:bg-[#F6F7F6] hover:border-[#EC3244] hover:text-[#EC3244] transition-colors"
            >
              <PhoneOff className="w-3.5 h-3.5" />
              Decline
            </button>
            <button
              onClick={onAccept}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-[#23A455] text-white text-[12px] font-semibold hover:bg-[#1e9048] transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              Accept
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideInUp {
          from { transform: translateY(16px); opacity: 0; }
          to   { transform: translateY(0);   opacity: 1; }
        }
      `}</style>
    </>
  );
}

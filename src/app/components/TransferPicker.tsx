import React, { useState, useMemo } from 'react';
import { ArrowLeft, Search, PhoneForwarded, Users, User } from 'lucide-react';

export type OperatorPresence = 'available' | 'on-call' | 'unavailable';

export interface OperatorTarget {
  type: 'operator';
  id: string;
  name: string;
  initials: string;
  presence: OperatorPresence;
  unavailableReason?: string;
}

export interface TeamTarget {
  type: 'team';
  id: string;
  name: string;
  available: number;
}

export type TransferTarget = OperatorTarget | TeamTarget;

interface TransferPickerProps {
  onTransfer: (target: TransferTarget, note: string) => void;
  onBack: () => void;
}

const OPERATORS: OperatorTarget[] = [
  { type: 'operator', id: 'op1', name: 'Meera Patel',  initials: 'MP', presence: 'available' },
  { type: 'operator', id: 'op2', name: 'Arjun Kumar',  initials: 'AK', presence: 'on-call' },
  { type: 'operator', id: 'op3', name: 'Neha Singh',   initials: 'NS', presence: 'available' },
  { type: 'operator', id: 'op4', name: 'Vikram Rao',   initials: 'VR', presence: 'unavailable', unavailableReason: 'Offline' },
  { type: 'operator', id: 'op5', name: 'Ritu Joshi',   initials: 'RJ', presence: 'available' },
];

const TEAMS: TeamTarget[] = [
  { type: 'team', id: 'team1', name: 'Support',   available: 3 },
  { type: 'team', id: 'team2', name: 'Sales',     available: 2 },
  { type: 'team', id: 'team3', name: 'Payments',  available: 1 },
  { type: 'team', id: 'team4', name: 'Technical', available: 0 },
];

function PresenceBadge({ presence, reason }: { presence: OperatorPresence; reason?: string }) {
  if (presence === 'available') {
    return (
      <span className="flex items-center gap-1">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#23A455]" />
        <span className="text-[11px] text-[#23A455]">Available</span>
      </span>
    );
  }
  if (presence === 'on-call') {
    return (
      <span className="flex items-center gap-1 bg-[#FFF7EB] rounded-full px-2 py-0.5">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#EB991F]" />
        <span className="text-[11px] text-[#EB991F] font-medium">On call</span>
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1">
      <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#C4C7C5]" />
      <span className="text-[11px] text-[#9CA3AF]">{reason ?? 'Unavailable'}</span>
    </span>
  );
}

export function TransferPicker({ onTransfer, onBack }: TransferPickerProps) {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<TransferTarget | null>(null);
  const [note, setNote] = useState('');

  const q = query.toLowerCase();

  const filteredOperators = useMemo(
    () => OPERATORS.filter(o => o.name.toLowerCase().includes(q)),
    [q]
  );

  const filteredTeams = useMemo(
    () => TEAMS.filter(t => t.name.toLowerCase().includes(q)),
    [q]
  );

  const isSelectable = (target: TransferTarget) => {
    if (target.type === 'operator') return target.presence === 'available';
    return target.available > 0;
  };

  const handleRowClick = (target: TransferTarget) => {
    if (!isSelectable(target)) return;
    setSelected(prev => (prev?.id === target.id ? null : target));
  };

  const getInitialsColor = (initials: string) => {
    const colors = ['#E8F5EE', '#EBF3FB', '#FEF3C7', '#FDF2F8', '#F0FDF4'];
    const textColors = ['#23A455', '#2563EB', '#D97706', '#9333EA', '#16A34A'];
    const idx = initials.charCodeAt(0) % colors.length;
    return { bg: colors[idx], text: textColors[idx] };
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Header */}
      <div className="flex items-center gap-2">
        <button
          onClick={onBack}
          className="p-1 rounded-md hover:bg-[#F6F7F6] transition-colors text-[#505451]"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-2 flex-1">
          <PhoneForwarded className="w-4 h-4 text-[#23A455]" />
          <span className="text-[13px] font-semibold text-[#1b1d1c]">Transfer Call</span>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#9CA3AF]" />
        <input
          type="text"
          placeholder="Search operators or teams..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="w-full pl-8 pr-3 py-1.5 text-[12px] border border-[#E7E9E8] rounded-lg bg-[#F6F7F6] focus:outline-none focus:border-[#23A455] focus:bg-white transition-colors text-[#1b1d1c] placeholder:text-[#9CA3AF]"
        />
      </div>

      {/* List */}
      <div className="overflow-y-auto max-h-[260px] -mx-1 px-1 flex flex-col gap-3">
        {/* Operators section */}
        {filteredOperators.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <User className="w-3 h-3 text-[#9CA3AF]" />
              <span className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">
                Operators
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              {filteredOperators.map(op => {
                const colors = getInitialsColor(op.initials);
                const selectable = op.presence === 'available';
                const isSelected = selected?.id === op.id;
                return (
                  <button
                    key={op.id}
                    onClick={() => handleRowClick(op)}
                    disabled={!selectable}
                    className={`flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-left transition-colors w-full ${
                      isSelected
                        ? 'bg-[#E8F5EE] border border-[#23A455]'
                        : selectable
                        ? 'hover:bg-[#F6F7F6] border border-transparent'
                        : 'opacity-40 cursor-not-allowed border border-transparent'
                    }`}
                  >
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-semibold shrink-0"
                      style={{ backgroundColor: colors.bg, color: colors.text }}
                    >
                      {op.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[12px] text-[#1b1d1c] font-medium truncate">{op.name}</div>
                    </div>
                    <PresenceBadge presence={op.presence} reason={op.unavailableReason} />
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Teams section */}
        {filteredTeams.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <Users className="w-3 h-3 text-[#9CA3AF]" />
              <span className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">
                Teams
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              {filteredTeams.map(team => {
                const selectable = team.available > 0;
                const isSelected = selected?.id === team.id;
                return (
                  <button
                    key={team.id}
                    onClick={() => handleRowClick(team)}
                    disabled={!selectable}
                    className={`flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-left transition-colors w-full ${
                      isSelected
                        ? 'bg-[#E8F5EE] border border-[#23A455]'
                        : selectable
                        ? 'hover:bg-[#F6F7F6] border border-transparent'
                        : 'opacity-40 cursor-not-allowed border border-transparent'
                    }`}
                  >
                    <div className="w-7 h-7 rounded-full bg-[#F0F4FF] flex items-center justify-center shrink-0">
                      <Users className="w-3.5 h-3.5 text-[#4B6BFB]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[12px] text-[#1b1d1c] font-medium">{team.name}</div>
                    </div>
                    <span className={`text-[11px] shrink-0 ${selectable ? 'text-[#23A455]' : 'text-[#9CA3AF]'}`}>
                      {team.available} available
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {filteredOperators.length === 0 && filteredTeams.length === 0 && (
          <div className="text-center py-6 text-[12px] text-[#9CA3AF]">
            No results for "{query}"
          </div>
        )}
      </div>

      {/* Selected target: note + action buttons */}
      {selected && (
        <div className="flex flex-col gap-2 pt-2 border-t border-[#E7E9E8]">
          <div className="text-[11px] text-[#505451]">
            Add a note for{' '}
            <span className="font-medium text-[#1b1d1c]">{selected.name}</span>{' '}
            <span className="text-[#9CA3AF]">(optional)</span>
          </div>
          <textarea
            rows={2}
            placeholder="e.g. billing — failed international payment"
            value={note}
            onChange={e => setNote(e.target.value)}
            className="w-full text-[12px] border border-[#E7E9E8] rounded-lg px-2.5 py-2 resize-none focus:outline-none focus:border-[#23A455] transition-colors text-[#1b1d1c] placeholder:text-[#C4C7C5] bg-[#F6F7F6] focus:bg-white"
          />
          <div className="flex gap-2">
            <button
              onClick={() => setSelected(null)}
              className="flex-1 py-2 rounded-lg border border-[#E7E9E8] text-[12px] text-[#505451] hover:bg-[#F6F7F6] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => onTransfer(selected, note)}
              className="flex-1 py-2 rounded-lg bg-[#23A455] text-white text-[12px] font-medium hover:bg-[#1e9048] transition-colors flex items-center justify-center gap-1.5"
            >
              <PhoneForwarded className="w-3.5 h-3.5" />
              Transfer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

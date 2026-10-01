import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import {
  HandsetIcon, OperatorIcon, RecordingIcon, RingingPhoneIcon, TeamIcon, WaContactAvatar,
} from './callWidgetIcons';
import {
  OPERATORS, RING_WINDOW_SECS, SELF_ID, TEAMS, TransferTarget, answerFor, availableIn, targetName,
} from '../data/callTransferRoster';

// The WhatsApp call widget, following the "Astra & Human call transfer UX"
// reference: on call, then a mid-call transfer — pick an operator or a team,
// leave an optional note, ring them with the customer still live — ending in
// either "Call transferred" or an inline "Transfer unsuccessful" with a retry.
// Only the transferring agent's side is shown; the demo answers for the target.

type Phase = 'oncall' | 'picker' | 'ringing' | 'failed' | 'transferred';

const CUSTOMER = 'Priya Sharma';
const CUSTOMER_FIRST = 'Priya';
const NOTE_LIMIT = 100;

/** Call toasts sit top-centre in dark, as in the reference, clear of the rest of the app's toasts. */
const notify = (message: string) =>
  toast(message, {
    position: 'top-center',
    duration: 5000,
    style: { background: '#1b1d1c', color: '#ffffff', border: 'none', fontSize: '14px' },
  });

const mmss = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

// --- Pieces ------------------------------------------------------------------

function OnCallHeader({ clock }: { clock?: string }) {
  return (
    <div className="flex items-center gap-[8px]">
      <span className="relative size-[8px] shrink-0 rounded-full bg-[#eb991f]">
        <span className="absolute inset-[-3px] rounded-full border-2 border-[#eb991f] animate-[wring_1.8s_cubic-bezier(0.2,0,0,1)_infinite]" />
      </span>
      <span className="text-[12px] font-semibold tracking-[.04em] text-[#eb991f]">ON CALL</span>
      {clock && <span className="ml-auto font-['Roboto_Mono',monospace] text-[12px] text-[#848a86] tabular-nums">{clock}</span>}
    </div>
  );
}

function LineRow() {
  return (
    <div className="mt-[12px] flex justify-between text-[14px] text-[#505451]">
      <span>Support</span>
      <span className="tabular-nums">+9876543210</span>
    </div>
  );
}

function RecordingToggle({ recording, onToggle }: { recording: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="inline-flex items-center gap-[8px] h-[28px] px-[10px] rounded-[8px] bg-white text-[13px] text-[#353735] hover:bg-[#f6f7f6] transition-colors"
    >
      {recording ? (
        <span className="inline-flex items-center gap-[4px]">
          <RecordingIcon />
          <span className="inline-flex">
            Recording
            {[0, 0.2, 0.4].map((d) => (
              <span key={d} className="animate-[wrecdot_1.4s_infinite]" style={{ animationDelay: `${d}s` }}>.</span>
            ))}
          </span>
        </span>
      ) : (
        <span className="inline-flex items-center gap-[4px]">
          <span className="size-[6px] rounded-full bg-[#ef5766]" />
          Record
        </span>
      )}
    </button>
  );
}

/** The customer, the call clock and the recording control. */
function ContactPanel({
  clock, recording, onToggleRecording, compactTop = false, children,
}: React.PropsWithChildren<{ clock: string; recording: boolean; onToggleRecording: () => void; compactTop?: boolean }>) {
  return (
    <div className={`bg-[#ebf7f0] px-[20px] text-center ${compactTop ? 'pt-[32px] pb-[20px]' : 'py-[36px]'}`}>
      <div className="size-[44px] mx-auto mb-[12px] flex items-center justify-center">
        <WaContactAvatar />
      </div>
      <div className="text-[20px] font-bold text-[#1b1d1c]">{CUSTOMER}</div>
      <div className="mt-[2px] text-[14px] text-[#505451] tabular-nums">+91 98765 43210</div>
      <div className="mt-[12px] font-['Roboto_Mono',monospace] text-[16px] text-[#353735] tabular-nums">{clock}</div>
      <div className="mt-[8px]">
        <RecordingToggle recording={recording} onToggle={onToggleRecording} />
      </div>
      {children}
    </div>
  );
}

const SMALL_CONTROL = 'size-[34px] rounded-full flex items-center justify-center transition-colors';

function MicIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#505451" strokeWidth="1.8" aria-hidden>
      <rect x="9" y="3" width="6" height="10" rx="3" /><path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
    </svg>
  );
}
function TransferArrows({ stroke }: { stroke: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.8" aria-hidden>
      <path d="M4 8h13l-3-3M20 16H7l3 3" />
    </svg>
  );
}

/**
 * Mute · transfer · end · message · speaker. The transfer slot changes with
 * the phase: idle, active while the picker is open, and Cancel while ringing,
 * when End call is also locked.
 */
function ControlRow({
  transfer, onTransfer, onEnd,
}: {
  transfer: 'idle' | 'active' | 'cancel';
  onTransfer: () => void;
  onEnd: () => void;
}) {
  const locked = transfer === 'cancel';
  return (
    <div className="mt-[20px] flex items-center justify-center gap-[12px]">
      <button type="button" aria-label="Mute" className={`${SMALL_CONTROL} bg-[#f6f7f6] hover:bg-[#e7e9e8]`}><MicIcon /></button>

      {transfer === 'cancel' ? (
        <button
          type="button"
          onClick={onTransfer}
          title="Cancel transfer"
          aria-label="Cancel transfer"
          className={`${SMALL_CONTROL} border border-[#ec3244] bg-[#feeeeb] hover:bg-[#ffd1cc]`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#b00d20" strokeWidth="2.2" aria-hidden><path d="M6 6l12 12M18 6L6 18" /></svg>
        </button>
      ) : (
        <button
          type="button"
          onClick={onTransfer}
          title={transfer === 'active' ? 'Close transfer picker' : 'Transfer call'}
          aria-label={transfer === 'active' ? 'Close transfer picker' : 'Transfer call'}
          className={`${SMALL_CONTROL} ${transfer === 'active' ? 'bg-[#353735]' : 'bg-[#f6f7f6] hover:bg-[#e7e9e8]'}`}
        >
          <TransferArrows stroke={transfer === 'active' ? '#ffffff' : '#505451'} />
        </button>
      )}

      <button
        type="button"
        onClick={locked ? undefined : onEnd}
        disabled={locked}
        aria-label="End call"
        title={locked ? 'End call is locked while a transfer is in flight' : 'End call'}
        className={`relative size-[42px] rounded-full flex items-center justify-center transition-colors ${
          locked ? 'bg-[#e7e9e8] cursor-not-allowed' : 'bg-[#ec3244] hover:bg-[#d92939]'
        }`}
      >
        <HandsetIcon fill={locked ? '#b7b9b7' : '#ffffff'} className="rotate-[135deg]" />
        {locked && (
          <span className="absolute right-[-2px] bottom-[-2px] size-[16px] rounded-full bg-white border border-[#e7e9e8] flex items-center justify-center">
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#848a86" strokeWidth="2.4" aria-hidden>
              <rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" />
            </svg>
          </span>
        )}
      </button>

      <button type="button" aria-label="Message" className={`${SMALL_CONTROL} bg-[#f6f7f6] hover:bg-[#e7e9e8]`}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#505451" strokeWidth="1.8" aria-hidden><path d="M4 5h16v11H9l-5 4z" /></svg>
      </button>
      <button type="button" aria-label="Mute speaker" title="Mute speaker" className={`${SMALL_CONTROL} bg-[#f6f7f6] hover:bg-[#e7e9e8]`}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#505451" strokeWidth="1.8" aria-hidden>
          <path d="M11 5L6.5 9H3v6h3.5L11 19z" /><path d="M16 9.5l4 5M20 9.5l-4 5" />
        </svg>
      </button>
    </div>
  );
}

// --- Target picker -------------------------------------------------------------

interface Badge { label: string; fg: string; bg: string }
const BADGE = {
  available: { fg: '#186d38', bg: '#ebf7f0' },
  warn: { fg: '#8a5a00', bg: '#fff7eb' },
  away: { fg: '#505451', bg: '#e7e9e8' },
  declined: { fg: '#b00d20', bg: '#feeeeb' },
};

function SectionLabel({ children, className = '' }: React.PropsWithChildren<{ className?: string }>) {
  return <div className={`px-[4px] text-[10px] font-semibold tracking-[.04em] text-[#848a86] ${className}`}>{children}</div>;
}

function TargetRow({
  icon, name, sub, badge, disabled, onPick,
}: { icon: React.ReactNode; name: string; sub?: string; badge: Badge; disabled: boolean; onPick: () => void }) {
  return (
    <button
      type="button"
      onClick={disabled ? undefined : onPick}
      disabled={disabled}
      className={`w-full text-left rounded-[6px] px-[10px] py-[8px] flex items-center gap-[10px] transition-colors ${
        disabled ? 'opacity-55 cursor-not-allowed' : 'hover:bg-white cursor-pointer'
      }`}
    >
      <span className="size-[28px] shrink-0 flex items-center justify-center">{icon}</span>
      <span className="min-w-0 flex-1">
        <span className="block text-[14px] font-semibold text-[#1b1d1c] truncate">{name}</span>
        {sub && <span className="block mt-[1px] text-[10px] text-[#848a86]">{sub}</span>}
      </span>
      <span
        className="shrink-0 text-[10px] font-semibold rounded-full px-[7px] py-[2px] whitespace-nowrap"
        style={{ color: badge.fg, background: badge.bg }}
      >
        {badge.label}
      </span>
    </button>
  );
}

function GroupToggle({ open, label, onToggle }: { open: boolean; label: string; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="mt-[8px] w-full flex items-center gap-[6px] p-[4px] text-[10px] font-semibold tracking-[.04em] text-[#848a86] hover:text-[#353735] transition-colors"
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden>
        <path d={open ? 'M6 15l6-6 6 6' : 'M6 9l6 6 6-6'} />
      </svg>
      {label}
    </button>
  );
}

function BackHeader({ label, onBack, backLabel, htmlFor }: { label: string; onBack: () => void; backLabel: string; htmlFor?: string }) {
  return (
    <div className="flex items-center gap-[8px] mb-[8px]">
      <button type="button" onClick={onBack} title={backLabel} aria-label={backLabel} className="size-[16px] shrink-0 flex items-center justify-center">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#505451" strokeWidth="2" aria-hidden><path d="M15 6l-6 6 6 6" /></svg>
      </button>
      <label htmlFor={htmlFor} className="text-[10px] font-semibold tracking-[.04em] text-[#848a86] leading-none">{label}</label>
    </div>
  );
}

// --- The widget ------------------------------------------------------------------

interface CallWidgetProps {
  onEndCall?: () => void;
}

export function CallWidget({ onEndCall }: CallWidgetProps) {
  const [phase, setPhase] = useState<Phase>('oncall');
  const [callSecs, setCallSecs] = useState(32);
  const [recording, setRecording] = useState(true);

  // Picker
  const [query, setQuery] = useState('');
  const [pending, setPending] = useState<TransferTarget | null>(null);
  const [note, setNote] = useState('');
  const [busyOpen, setBusyOpen] = useState(false);
  const [outsideOpen, setOutsideOpen] = useState(false);

  // Transfer in flight and its outcome
  const [target, setTarget] = useState<TransferTarget | null>(null);
  const [ringSecs, setRingSecs] = useState(0);
  /** Targets that already failed this call, and why — they can't be picked again until the call moves on. */
  const [excluded, setExcluded] = useState<Record<string, 'Declined' | 'No answer'>>({});
  const [lastTarget, setLastTarget] = useState<TransferTarget | null>(null);
  const [failTitle, setFailTitle] = useState('');
  const [transferredTo, setTransferredTo] = useState('');
  const [endedAt, setEndedAt] = useState(0);

  const phaseRef = useRef(phase);
  phaseRef.current = phase;

  // One clock for the call and, while ringing, for the transfer request.
  useEffect(() => {
    const id = window.setInterval(() => {
      if (phaseRef.current === 'transferred') return;
      setCallSecs((s) => s + 1);
      if (phaseRef.current === 'ringing') setRingSecs((r) => r + 1);
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  const failTransfer = useCallback((t: TransferTarget, title: string, reason: 'Declined' | 'No answer') => {
    notify(`${title} ${CUSTOMER_FIRST} is still connected to you.`);
    setExcluded((prev) => ({ ...prev, [`${t.type}:${t.id}`]: reason }));
    setLastTarget(t);
    setFailTitle(title);
    setTarget(null);
    setRingSecs(0);
    setPhase('failed');
  }, []);

  // The demo answers for whoever is being rung.
  useEffect(() => {
    if (phase !== 'ringing' || !target) return;
    const answer = answerFor(target);
    if (answer.kind === 'accept' && ringSecs >= answer.afterSecs) {
      const who = OPERATORS[answer.by].name;
      notify(`Call transferred to ${who}. Chat assignment and contact owner moved too.`);
      setTransferredTo(who);
      setEndedAt(callSecs);
      setTarget(null);
      setPhase('transferred');
    } else if (answer.kind === 'decline' && ringSecs >= answer.afterSecs) {
      failTransfer(target, `${OPERATORS[answer.by].name} declined the transfer.`, 'Declined');
    } else if (ringSecs >= RING_WINDOW_SECS) {
      failTransfer(
        target,
        target.type === 'team' ? `No one in ${TEAMS[target.id].name} answered.` : `${OPERATORS[target.id].name} didn't answer.`,
        'No answer',
      );
    }
  }, [phase, target, ringSecs, callSecs, failTransfer]);

  const toggleRecording = () => {
    notify(recording ? 'Recording stopped for this call.' : 'Recording started.');
    setRecording((r) => !r);
  };

  const openPicker = (keepExcluded: boolean) => {
    if (!keepExcluded) setExcluded({});
    setQuery('');
    setPending(null);
    setNote('');
    setPhase('picker');
  };

  const ring = (t: TransferTarget) => {
    setTarget(t);
    setRingSecs(0);
    setPending(null);
    setPhase('ringing');
  };

  const cancelRing = () => {
    notify(`Transfer cancelled. ${CUSTOMER_FIRST} is still with you.`);
    setTarget(null);
    setRingSecs(0);
    setPhase('oncall');
  };

  const tryAgain = () => {
    if (!lastTarget) { openPicker(true); return; }
    setExcluded((prev) => {
      const next = { ...prev };
      delete next[`${lastTarget.type}:${lastTarget.id}`];
      return next;
    });
    ring(lastTarget);
  };

  // --- Picker lists
  const q = query.trim().toLowerCase();
  const myTeam = OPERATORS[SELF_ID].team;

  const teamRows = useMemo(() => Object.values(TEAMS)
    .filter((t) => !q || t.name.toLowerCase().includes(q))
    .map((t) => {
      const failed = excluded[`team:${t.id}`];
      const free = availableIn(t);
      const disabled = free === 0 || !!failed;
      return {
        team: t,
        disabled,
        badge: { label: failed ?? (free === 0 ? 'No one available' : `${free} available`), ...(disabled ? BADGE.warn : BADGE.available) },
      };
    }), [q, excluded]);

  const operatorRows = useMemo(() => Object.values(OPERATORS)
    .filter((o) => o.id !== SELF_ID)
    .filter((o) => !q || o.name.toLowerCase().includes(q) || o.team.toLowerCase().includes(q))
    .map((o) => {
      const failed = excluded[`operator:${o.id}`];
      const disabled = o.presence !== 'available' || !!failed;
      const badge: Badge = failed
        ? { label: failed, ...BADGE.declined }
        : o.presence === 'oncall'
          ? { label: 'On call', ...BADGE.warn }
          : o.presence === 'unavailable'
            ? { label: 'Away', ...BADGE.away }
            : { label: 'Available', ...BADGE.available };
      return { op: o, disabled, badge };
    }), [q, excluded]);

  const inTeam = operatorRows.filter((r) => r.op.team === myTeam);
  const teamAvailable = inTeam.filter((r) => r.op.presence === 'available');
  const teamBusy = inTeam.filter((r) => r.op.presence !== 'available');
  const outside = operatorRows.filter((r) => r.op.team !== myTeam);

  const pendingOutsideNote =
    pending?.type === 'operator' && OPERATORS[pending.id].team !== myTeam
      ? `${OPERATORS[pending.id].name.split(' ')[0]} is in ${OPERATORS[pending.id].team}. On accept they join this conversation under the default team.`
      : null;

  // --- Ringing copy
  const ringTitle = target ? `Ringing ${targetName(target)}` : '';
  const ringSub = target?.type === 'team'
    ? `${TEAMS[target.id].members.filter((m) => OPERATORS[m].presence === 'available').length} ringing · first to accept takes the call`
    : '';

  const clock = mmss(callSecs);
  const card = 'bg-white border border-[#e7e9e8] rounded-[12px] shadow-[0_20px_25px_-5px_rgba(27,29,28,0.1),0_8px_10px_-6px_rgba(27,29,28,0.1)] p-[20px] font-[\'Inter\',sans-serif] animate-[wrise_180ms_cubic-bezier(0.3,0,0,1)]';

  // --- Call transferred
  if (phase === 'transferred') {
    return (
      <div key="transferred" className={`w-[300px] ${card}`} data-name="Call Widget">
        <div className="flex items-center gap-[8px]">
          <span className="size-[8px] shrink-0 rounded-full bg-[#9ca19d]" />
          <span className="text-[12px] font-semibold tracking-[.04em] text-[#848a86]">CALL TRANSFERRED</span>
        </div>
        <div className="mt-[12px] bg-[#f6f7f6] rounded-[8px] px-[20px] py-[36px] text-center">
          <div className="text-[20px] font-bold text-[#1b1d1c]">{CUSTOMER}</div>
          <div className="text-[12px] text-[#505451]">Transferred to {transferredTo}</div>
          <div className="mt-[8px] font-['Roboto_Mono',monospace] text-[14px] text-[#353735] tabular-nums">{mmss(endedAt)}</div>
        </div>
        <button
          type="button"
          onClick={onEndCall}
          className="mt-[12px] w-full border border-[#e7e9e8] bg-white rounded-[8px] p-[8px] text-[12px] font-semibold text-[#353735] hover:bg-[#f6f7f6] transition-colors"
        >
          Close
        </button>
      </div>
    );
  }

  // --- Target picker and note
  if (phase === 'picker') {
    return (
      <div key="picker" className={`w-[356px] ${card}`} data-name="Call Widget">
        <OnCallHeader clock={clock} />
        <LineRow />
        <div className="mt-[12px] bg-[#f6f7f6] rounded-[8px] p-[16px]">
          {!pending ? (
            <>
              <BackHeader label="TRANSFER TO" onBack={() => setPhase('oncall')} backLabel="Back to call" htmlFor="transfer-search" />
              <div className="flex items-center gap-[8px] bg-white border border-[#e7e9e8] rounded-[8px] px-[10px] py-[8px]">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#848a86" strokeWidth="1.9" aria-hidden><circle cx="11" cy="11" r="6" /><path d="M16 16l4 4" /></svg>
                <input
                  id="transfer-search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search operators or teams"
                  autoFocus
                  className="w-full border-0 outline-none bg-transparent text-[14px] text-[#353735] placeholder:text-[#b7b9b7]"
                />
              </div>
              <div className="mt-[8px] max-h-[268px] overflow-y-auto [&::-webkit-scrollbar]:w-[8px] [&::-webkit-scrollbar-thumb]:bg-[#ced0ce] [&::-webkit-scrollbar-thumb]:rounded-full">
                {teamRows.length > 0 && <SectionLabel className="py-[8px]">TEAMS</SectionLabel>}
                {teamRows.map(({ team, disabled, badge }) => (
                  <TargetRow key={team.id} icon={<TeamIcon />} name={team.name} badge={badge} disabled={disabled} onPick={() => { setPending({ type: 'team', id: team.id }); setNote(''); }} />
                ))}

                {teamAvailable.length > 0 && <SectionLabel className="pt-[10px] pb-[4px]">AVAILABLE OPERATORS</SectionLabel>}
                {teamAvailable.map(({ op, disabled, badge }) => (
                  <TargetRow key={op.id} icon={<OperatorIcon />} name={op.name} sub={op.team} badge={badge} disabled={disabled} onPick={() => { setPending({ type: 'operator', id: op.id }); setNote(''); }} />
                ))}

                {teamBusy.length > 0 && (
                  <GroupToggle open={busyOpen} label={`UNAVAILABLE (${teamBusy.length})`} onToggle={() => setBusyOpen((v) => !v)} />
                )}
                {busyOpen && teamBusy.map(({ op, disabled, badge }) => (
                  <TargetRow key={op.id} icon={<OperatorIcon />} name={op.name} sub={op.team} badge={badge} disabled={disabled} onPick={() => {}} />
                ))}

                {outside.length > 0 && (
                  <GroupToggle open={outsideOpen} label={`OUTSIDE THE TEAM (${outside.length})`} onToggle={() => setOutsideOpen((v) => !v)} />
                )}
                {outsideOpen && outside.map(({ op, disabled, badge }) => (
                  <TargetRow key={op.id} icon={<OperatorIcon />} name={op.name} sub={op.team} badge={badge} disabled={disabled} onPick={() => { setPending({ type: 'operator', id: op.id }); setNote(''); }} />
                ))}

                {teamRows.length === 0 && operatorRows.length === 0 && (
                  <p className="px-[4px] py-[12px] text-[12px] text-[#848a86]">No operators or teams match "{query}".</p>
                )}
              </div>
            </>
          ) : (
            <>
              <BackHeader label="Transfer to" onBack={() => setPending(null)} backLabel="Back to targets" />
              <div className="flex items-center gap-[10px] bg-white border border-[#e7e9e8] rounded-[8px] px-[10px] py-[8px]">
                <span
                  className={`size-[28px] shrink-0 flex items-center justify-center rounded-full text-[10px] font-semibold text-[#186d38] ${pending.type === 'team' ? 'bg-[#ebf7f0]' : ''}`}
                >
                  {pending.type === 'team' ? TEAMS[pending.id].name.slice(0, 2).toUpperCase() : <OperatorIcon />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[14px] font-semibold text-[#1b1d1c]">{targetName(pending)}</span>
                  <span className="block text-[10px] text-[#848a86]">
                    {pending.type === 'team' ? `${availableIn(TEAMS[pending.id])} available` : 'Available'}
                  </span>
                </span>
              </div>

              {pendingOutsideNote && (
                <div className="mt-[8px] flex gap-[8px] bg-[#fff7eb] rounded-[8px] px-[10px] py-[8px] text-[10px] leading-[1.375] text-[#8a5a00]">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 mt-[1px]" aria-hidden><circle cx="12" cy="12" r="9" /><path d="M12 8v5M12 16h.01" /></svg>
                  <span>{pendingOutsideNote}</span>
                </div>
              )}

              <label htmlFor="transfer-note" className="block mt-[12px] mb-[4px] text-[12px] font-semibold text-[#848a86]">
                Internal Note for receiver (Optional)
              </label>
              <div className="relative">
                <textarea
                  id="transfer-note"
                  rows={3}
                  maxLength={NOTE_LIMIT}
                  value={note}
                  onChange={(e) => setNote(e.target.value.slice(0, NOTE_LIMIT))}
                  placeholder="One line on why you are transferring"
                  className="w-full resize-y min-h-[62px] max-h-[180px] text-[14px] leading-[1.375] text-[#353735] bg-white border border-[#e7e9e8] rounded-[8px] px-[10px] pt-[8px] pb-[20px] outline-none placeholder:text-[#b7b9b7] focus:border-[#9ca19d]"
                />
                <span className="absolute right-[10px] bottom-[8px] text-[12px] text-[#848a86] tabular-nums pointer-events-none">
                  {note.length}/{NOTE_LIMIT}
                </span>
              </div>
              <button
                type="button"
                onClick={() => ring(pending)}
                className="mt-[12px] w-full rounded-[8px] p-[10px] bg-[#23a455] hover:bg-[#2bc666] text-[14px] font-semibold text-white transition-colors"
              >
                Transfer to {pending.type === 'team' ? TEAMS[pending.id].name : OPERATORS[pending.id].name.split(' ')[0]}
              </button>
            </>
          )}
        </div>
        <ControlRow transfer="active" onTransfer={() => setPhase('oncall')} onEnd={() => onEndCall?.()} />
      </div>
    );
  }

  // --- On call, ringing, not answered
  return (
    <div key={phase} className={`w-[300px] ${card}`} data-name="Call Widget">
      <OnCallHeader />
      <LineRow />
      <div className="mt-[12px] rounded-[8px] overflow-hidden">
        <ContactPanel
          clock={clock}
          recording={recording}
          onToggleRecording={toggleRecording}
          compactTop={phase === 'ringing'}
        >
          {phase === 'ringing' && (
            <>
              <div className="mt-[16px] flex items-center gap-[8px] bg-white rounded-[8px] px-[10px] py-[8px]">
                <RingingPhoneIcon />
                <span className="flex-1 min-w-0 text-left text-[12px] font-semibold text-[#186d38] truncate">{ringTitle}</span>
                <span className="font-['Roboto_Mono',monospace] text-[12px] font-semibold text-[#186d38] tabular-nums">{mmss(ringSecs)}</span>
              </div>
              {ringSub && <div className="mt-[4px] text-[10px] text-[#505451]">{ringSub}</div>}
            </>
          )}
        </ContactPanel>
        {phase === 'failed' && (
          <div className="p-[12px] text-left text-[14px] leading-[1.5] text-[#353735] bg-[#feeeeb] [text-wrap:pretty]">
            Transfer unsuccessful. {failTitle}
            <button
              type="button"
              onClick={tryAgain}
              className="ml-[4px] px-[2px] rounded-[6px] text-[14px] font-semibold text-[#23a455] hover:text-[#1d8242] transition-colors"
            >
              Try again
            </button>
          </div>
        )}
      </div>

      <ControlRow
        transfer={phase === 'ringing' ? 'cancel' : 'idle'}
        onTransfer={phase === 'ringing' ? cancelRing : () => openPicker(phase === 'failed')}
        onEnd={() => onEndCall?.()}
      />
      {phase === 'ringing' && (
        <div className="mt-[8px] text-center text-[10px] text-[#848a86]">
          Cancel transfer to keep the call. End call is locked until it resolves.
        </div>
      )}
    </div>
  );
}

export default CallWidget;

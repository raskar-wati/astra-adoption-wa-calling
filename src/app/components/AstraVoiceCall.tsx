import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Mic, MicOff, PhoneOff } from 'lucide-react';
import { AstraLogo } from './AstraLogo';

// A voice call with Astra: an orb and two controls, nothing else. The orb is
// Astra's presence on the line — it swells irregularly while Astra speaks and
// settles into a slow breath while it listens, alternating like a real
// conversation, so the call feels alive without a transcript on screen.

type Turn = 'speaking' | 'listening';

// Roughly how long each side holds the floor before handing over.
const TURN_MS: Record<Turn, number> = { speaking: 4200, listening: 2800 };

const pad = (n: number) => String(n).padStart(2, '0');

function AstraOrb({ turn }: { turn: Turn }) {
  const reduce = useReducedMotion();
  const speaking = turn === 'speaking';

  return (
    <div className="relative size-[150px]" aria-hidden>
      {/* Halo — breathes with the turn */}
      <motion.div
        className="absolute inset-[-35%] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(120,160,215,0.32) 0%, rgba(120,160,215,0) 62%)', filter: 'blur(18px)' }}
        animate={reduce ? {} : speaking
          ? { scale: [1, 1.14, 1.04, 1.18, 1], opacity: [0.7, 1, 0.8, 1, 0.7] }
          : { scale: [1, 1.06, 1], opacity: [0.5, 0.7, 0.5] }}
        transition={{ duration: speaking ? 2.2 : 3.4, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* The sphere */}
      <motion.div
        className="absolute inset-0 rounded-full overflow-hidden"
        style={{
          background: 'linear-gradient(162deg, #9cb8df 0%, #bfd2ec 42%, #eef3f9 78%, #ffffff 100%)',
          boxShadow: 'inset 0 -14px 28px rgba(255,255,255,0.95), inset 0 10px 22px rgba(70,110,170,0.22), 0 18px 40px -18px rgba(70,110,170,0.35)',
        }}
        initial={{ scale: 0.6, opacity: 0 }}
        animate={reduce ? { scale: 1, opacity: 1 } : speaking
          ? { scale: [1, 1.045, 0.99, 1.06, 1.01, 1.035, 1], opacity: 1 }
          : { scale: [1, 1.015, 1], opacity: 1 }}
        transition={{
          opacity: { duration: 0.4 },
          scale: { duration: speaking ? 2.4 : 3.4, repeat: Infinity, ease: 'easeInOut' },
        }}
      >
        {/* Colour swirling inside the glass */}
        <motion.div
          className="absolute inset-[-30%]"
          style={{
            background: 'conic-gradient(from 0deg, rgba(91,174,247,0.45), rgba(255,255,255,0) 22%, rgba(54,107,255,0.28) 48%, rgba(255,255,255,0) 70%, rgba(91,174,247,0.45))',
            filter: 'blur(14px)',
          }}
          animate={reduce ? {} : { rotate: 360 }}
          transition={{ duration: speaking ? 7 : 12, repeat: Infinity, ease: 'linear' }}
        />
        {/* A highlight drifting across the surface */}
        <motion.div
          className="absolute size-[62%] rounded-full"
          style={{ left: '12%', top: '42%', background: 'radial-gradient(circle, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0) 70%)', filter: 'blur(8px)' }}
          animate={reduce ? {} : { x: [0, 14, -8, 0], y: [0, -12, 6, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Glass rim */}
        <div className="absolute inset-[5px] rounded-full border border-white/45" />
      </motion.div>
    </div>
  );
}

function CallControl({
  label,
  onClick,
  tone,
  children,
}: React.PropsWithChildren<{ label: string; onClick: () => void; tone: 'end' | 'neutral' }>) {
  return (
    <div className="flex flex-col items-center gap-[10px] w-[72px]">
      <motion.button
        type="button"
        aria-label={label}
        onClick={onClick}
        whileTap={{ scale: 0.92 }}
        className={`size-[56px] rounded-full flex items-center justify-center transition-colors ${
          tone === 'end' ? 'bg-[#d42622] hover:bg-[#bd1f1b] text-white' : 'bg-[#e4e4e7] hover:bg-[#d8d8dc] text-[#2a2a2e]'
        }`}
      >
        {children}
      </motion.button>
      <span className="text-[13px] leading-[16px] text-[#9a9aa0]">{label}</span>
    </div>
  );
}

export function AstraVoiceCall({ onEnd }: { onEnd: () => void }) {
  const [seconds, setSeconds] = useState(0);
  const [muted, setMuted] = useState(false);
  const [turn, setTurn] = useState<Turn>('speaking');

  // Call timer.
  useEffect(() => {
    const id = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => window.clearInterval(id);
  }, []);

  // Astra opens, then the two sides take turns.
  useEffect(() => {
    const id = window.setTimeout(() => setTurn((t) => (t === 'speaking' ? 'listening' : 'speaking')), TURN_MS[turn]);
    return () => window.clearTimeout(id);
  }, [turn]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onEnd(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onEnd]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center font-['Inter',sans-serif]">
      <motion.div
        className="absolute inset-0 bg-black/40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.25 }}
      />
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label="Call with Astra"
        className="relative w-[400px] h-[540px] rounded-[24px] bg-white shadow-2xl flex flex-col"
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
      >
        {/* Who is on the line */}
        <motion.div
          className="pt-[32px] flex flex-col items-center"
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        >
          <div className="flex items-center gap-[8px]">
            <AstraLogo className="size-[24px]" variant="brand" />
            <span className="text-[18px] leading-[24px] font-semibold text-astra-ink">Astra</span>
          </div>
          <p className="mt-[4px] text-[13px] leading-[18px] text-[#6b6b72]">Voice AI agent for WhatsApp calls</p>
        </motion.div>

        <div className="flex-1 flex items-center justify-center">
          <AstraOrb turn={turn} />
        </div>

        <div className="relative flex items-start justify-between px-[56px] pb-[36px]">
          <CallControl label="End call" tone="end" onClick={onEnd}>
            <PhoneOff className="size-[20px]" strokeWidth={1.75} />
          </CallControl>
          <span className="absolute left-1/2 -translate-x-1/2 top-[4px] text-[13px] leading-[16px] text-[#9a9aa0] tabular-nums">
            {pad(Math.floor(seconds / 60))}:{pad(seconds % 60)}
          </span>
          <CallControl label={muted ? 'Unmute' : 'Mute'} tone="neutral" onClick={() => setMuted((m) => !m)}>
            {muted ? <MicOff className="size-[20px]" strokeWidth={1.75} /> : <Mic className="size-[20px]" strokeWidth={1.75} />}
          </CallControl>
        </div>
      </motion.div>
    </div>
  );
}

export default AstraVoiceCall;

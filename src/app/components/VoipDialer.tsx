import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Phone, PhoneOff, Delete, Mic, MicOff, X, Grid3x3, Volume2, Waypoints } from 'lucide-react';
import { toast } from 'sonner';

type DialerStage = 'dialing' | 'connecting' | 'active';

// Time (ms) the outgoing call spends "connecting" before the external API
// reports the far end as answered. Mocked while the backend is a prerequisite.
const CONNECT_DELAY_MS = 2200;

interface KeyDef {
  digit: string;
  letters: string;
}

const KEYPAD: KeyDef[] = [
  { digit: '1', letters: '' },
  { digit: '2', letters: 'ABC' },
  { digit: '3', letters: 'DEF' },
  { digit: '4', letters: 'GHI' },
  { digit: '5', letters: 'JKL' },
  { digit: '6', letters: 'MNO' },
  { digit: '7', letters: 'PQRS' },
  { digit: '8', letters: 'TUV' },
  { digit: '9', letters: 'WXYZ' },
  { digit: '*', letters: '' },
  { digit: '0', letters: '+' },
  { digit: '#', letters: '' },
];

interface VoipDialerProps {
  onClose: () => void;
  initialNumber?: string;
}

function formatDuration(totalSeconds: number): string {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function VoipDialer({ onClose, initialNumber = '' }: VoipDialerProps) {
  const [stage, setStage] = useState<DialerStage>('dialing');
  const [number, setNumber] = useState(initialNumber);
  const [isMuted, setIsMuted] = useState(false);
  const [seconds, setSeconds] = useState(0);

  const digitCount = number.replace(/\D/g, '').length;
  const canCall = digitCount >= 3;

  const pressKey = useCallback((digit: string) => {
    setNumber((prev) => (prev + digit).slice(0, 18));
  }, []);

  const backspace = useCallback(() => {
    setNumber((prev) => prev.slice(0, -1));
  }, []);

  const startCall = useCallback(() => {
    setNumber((prev) => {
      if (prev.replace(/\D/g, '').length < 3) return prev;
      setSeconds(0);
      setIsMuted(false);
      setStage('connecting');
      return prev;
    });
  }, []);

  const endCall = useCallback(() => {
    if (stage === 'active') {
      toast.success(`Call ended · ${formatDuration(seconds)}`);
    } else if (stage === 'connecting') {
      toast('Call cancelled');
    }
    onClose();
  }, [stage, seconds, onClose]);

  // connecting → active (simulated far-end answer)
  useEffect(() => {
    if (stage !== 'connecting') return;
    const timer = setTimeout(() => setStage('active'), CONNECT_DELAY_MS);
    return () => clearTimeout(timer);
  }, [stage]);

  // duration ticker while connected
  useEffect(() => {
    if (stage !== 'active') return;
    const interval = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, [stage]);

  // keyboard support
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        endCall();
        return;
      }
      if (stage !== 'dialing') return;
      if (/^[0-9*#]$/.test(e.key)) {
        pressKey(e.key);
      } else if (e.key === '+') {
        pressKey('+');
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        backspace();
      } else if (e.key === 'Enter' && canCall) {
        startCall();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [stage, canCall, pressKey, backspace, startCall, endCall]);

  const initials = number ? number.slice(-2) : '··';

  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={endCall}
        aria-hidden="true"
      />

      {/* Dialer card */}
      <div className="relative z-10 w-80 rounded-2xl bg-white shadow-2xl border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-gray-900 text-white">
          <div className="flex items-center gap-2 min-w-0">
            <div className="flex items-center justify-center w-7 h-7 rounded-full bg-white/15">
              <Waypoints className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold leading-tight">VoIP Call</p>
              <p className="text-[11px] text-gray-300 leading-tight truncate">
                Outbound · External line
              </p>
            </div>
          </div>
          <button
            onClick={endCall}
            className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/15 transition-colors"
            aria-label="Close dialer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {stage === 'dialing' ? (
          /* ── DIALING (keypad) ── */
          <div className="p-4">
            {/* Number display */}
            <div className="min-h-[52px] flex items-center justify-center px-2 mb-1">
              <span
                className={`font-mono tabular-nums tracking-wide truncate ${
                  number ? 'text-2xl text-gray-900' : 'text-lg text-gray-400'
                }`}
              >
                {number || 'Enter a number'}
              </span>
            </div>
            <p className="text-center text-[11px] text-gray-400 mb-4 h-4">
              {number && !canCall ? 'Enter at least 3 digits' : ' '}
            </p>

            {/* Keypad */}
            <div className="grid grid-cols-3 gap-2.5">
              {KEYPAD.map((key) => (
                <button
                  key={key.digit}
                  onClick={() => pressKey(key.digit)}
                  className="flex flex-col items-center justify-center h-14 rounded-xl bg-gray-50 hover:bg-gray-100 active:bg-gray-200 border border-transparent hover:border-gray-200 transition-colors"
                >
                  <span className="text-xl font-medium text-gray-900 leading-none">
                    {key.digit}
                  </span>
                  {key.letters && (
                    <span className="mt-0.5 text-[9px] font-medium tracking-[0.15em] text-gray-400">
                      {key.letters}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Call row */}
            <div className="grid grid-cols-3 items-center mt-5">
              <div />
              <div className="flex justify-center">
                <button
                  onClick={startCall}
                  disabled={!canCall}
                  className={`w-14 h-14 rounded-full flex items-center justify-center shadow-md transition-all ${
                    canCall
                      ? 'bg-wati-green hover:bg-wati-green-dark text-white cursor-pointer'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                  aria-label="Start call"
                >
                  <Phone className="w-6 h-6" />
                </button>
              </div>
              <div className="flex justify-center">
                {number && (
                  <button
                    onClick={backspace}
                    className="w-11 h-11 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
                    aria-label="Delete last digit"
                  >
                    <Delete className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* ── CONNECTING / ACTIVE ── */
          <div className="flex flex-col items-center px-6 py-7">
            {/* Status */}
            <div className="h-5 mb-4 flex items-center gap-2">
              {stage === 'active' ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-wati-green animate-pulse" />
                  <span className="text-sm font-medium text-gray-900">Connected</span>
                </>
              ) : (
                <span className="text-sm font-medium text-gray-500">Calling…</span>
              )}
            </div>

            {/* Avatar */}
            <div
              className={`w-20 h-20 rounded-full flex items-center justify-center mb-3 ${
                stage === 'connecting' ? 'animate-pulse' : ''
              }`}
              style={{
                background: 'linear-gradient(180deg, #E0E7FF 0%, #C7D2FE 100%)',
              }}
            >
              <span className="text-xl font-mono font-semibold text-gray-900">
                {initials}
              </span>
            </div>

            {/* Number + timer */}
            <p className="text-base font-semibold text-gray-900 font-mono tabular-nums">
              {number}
            </p>
            <p className="mt-1 text-sm font-mono tabular-nums text-gray-500 h-5">
              {stage === 'active' ? formatDuration(seconds) : 'via external API'}
            </p>

            {/* Controls */}
            <div className="flex items-center justify-center gap-5 mt-7">
              <button
                onClick={() => setIsMuted((m) => !m)}
                disabled={stage !== 'active'}
                className={`w-11 h-11 rounded-full flex items-center justify-center transition-colors ${
                  stage !== 'active'
                    ? 'bg-gray-50 text-gray-300 cursor-not-allowed'
                    : isMuted
                    ? 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                aria-label={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              <button
                onClick={endCall}
                className="w-14 h-14 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-md transition-colors"
                aria-label="End call"
              >
                <PhoneOff className="w-6 h-6" />
              </button>

              <button
                disabled={stage !== 'active'}
                className={`w-11 h-11 rounded-full flex items-center justify-center transition-colors ${
                  stage !== 'active'
                    ? 'bg-gray-50 text-gray-300 cursor-not-allowed'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                aria-label="Speaker"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}

export default VoipDialer;

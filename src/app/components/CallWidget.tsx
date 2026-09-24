import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { PhoneForwarded, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import svgPaths from "../imports/svg-2wg1i25jov";
import { TransferPicker, TransferTarget } from './TransferPicker';
import { IncomingTransferCard } from './IncomingTransferCard';

type CallStage = 'call' | 'picking' | 'ringing' | 'success';

const RING_DURATION = 20;
// IncomingTransferCard appears after this many seconds of ringing
const INCOMING_CARD_DELAY_S = 2;

interface CallWidgetProps {
  onEndCall?: () => void;
}

export function CallWidget({ onEndCall }: CallWidgetProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [stage, setStage] = useState<CallStage>('call');
  const [transferTarget, setTransferTarget] = useState<TransferTarget | null>(null);
  const [transferNote, setTransferNote] = useState('');
  const [ringTimeLeft, setRingTimeLeft] = useState(RING_DURATION);
  const [showIncomingCard, setShowIncomingCard] = useState(false);

  const ringIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const incomingCardTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const ringTargetRef = useRef<TransferTarget | null>(null);

  const clearTimers = useCallback(() => {
    if (ringIntervalRef.current) clearInterval(ringIntervalRef.current);
    if (incomingCardTimerRef.current) clearTimeout(incomingCardTimerRef.current);
    ringIntervalRef.current = null;
    incomingCardTimerRef.current = null;
  }, []);

  const handleTransferTimeout = useCallback(() => {
    clearTimers();
    setShowIncomingCard(false);
    setStage('call');
    setTransferTarget(null);
    toast.error(`${ringTargetRef.current?.name ?? 'Target'} didn't answer. Caller stays with you.`);
  }, [clearTimers]);

  const startRinging = useCallback((target: TransferTarget, note: string) => {
    ringTargetRef.current = target;
    setTransferTarget(target);
    setTransferNote(note);
    setRingTimeLeft(RING_DURATION);
    setShowIncomingCard(false);
    setStage('ringing');

    // Show IncomingTransferCard after delay
    incomingCardTimerRef.current = setTimeout(() => {
      setShowIncomingCard(true);
    }, INCOMING_CARD_DELAY_S * 1000);

    // Ring countdown
    ringIntervalRef.current = setInterval(() => {
      setRingTimeLeft(prev => {
        if (prev <= 1) {
          handleTransferTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [handleTransferTimeout]);

  const handleCancelTransfer = useCallback(() => {
    clearTimers();
    setShowIncomingCard(false);
    setStage('call');
    setTransferTarget(null);
  }, [clearTimers]);

  const handleTransferAccepted = useCallback(() => {
    clearTimers();
    setShowIncomingCard(false);
    setStage('success');
    const name = ringTargetRef.current?.name ?? 'operator';
    toast.success(`Call transferred to ${name}. Transcript & AI summary sent to their thread.`);
    setTimeout(() => {
      if (onEndCall) onEndCall();
    }, 2200);
  }, [clearTimers, onEndCall]);

  const handleTransferDeclined = useCallback(() => {
    clearTimers();
    setShowIncomingCard(false);
    setStage('call');
    const name = ringTargetRef.current?.name ?? 'Target';
    setTransferTarget(null);
    toast.error(`${name} declined. Caller stays with you.`);
  }, [clearTimers]);

  const handleEndCall = () => {
    clearTimers();
    if (onEndCall) onEndCall();
  };

  useEffect(() => {
    return () => clearTimers();
  }, [clearTimers]);

  // ─── Width based on stage ────────────────────────────────────────────
  const widgetWidth = stage === 'picking' ? 'w-[360px]' : 'w-[280px]';

  // ─── Render ─────────────────────────────────────────────────────────
  return (
    <>
      <div
        className={`bg-white flex flex-col gap-[12px] items-start p-[20px] relative rounded-[12px] transition-[width] duration-300 ${widgetWidth}`}
        data-name="Call Widget"
      >
        <div aria-hidden="true" className="absolute border border-[#e7e9e8] border-solid inset-0 pointer-events-none rounded-[12px]" />

        {/* ── SUCCESS STATE ── */}
        {stage === 'success' ? (
          <div className="w-full flex flex-col items-center gap-3 py-4">
            <div className="w-14 h-14 rounded-full bg-[#E8F5EE] flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-[#23A455]" />
            </div>
            <div className="text-center flex flex-col gap-1">
              <p className="text-[14px] font-semibold text-[#1b1d1c]">
                Call Transferred
              </p>
              <p className="text-[13px] text-[#505451]">
                to {transferTarget?.name ?? 'operator'}
              </p>
              <p className="text-[11px] text-[#9CA3AF] mt-1">
                Transcript & AI summary sent to their thread
              </p>
            </div>
          </div>

        ) : stage === 'picking' ? (
          /* ── TRANSFER PICKER ── */
          <TransferPicker
            onTransfer={startRinging}
            onBack={() => setStage('call')}
          />

        ) : (
          /* ── NORMAL CALL / RINGING ── */
          <>
            {/* Status header */}
            <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="Frame">
              <div className="content-stretch flex gap-[2px] items-center relative shrink-0 w-full" data-name="Frame">
                <div className="relative shrink-0 size-[20px]" data-name="Frame">
                  <svg className="absolute block inset-0" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
                    <g id="Frame">
                      <circle cx="10" cy="10" fill="var(--fill-0, #FFF7EB)" id="Ellipse" r="7" />
                      <circle cx="10" cy="10" fill="var(--fill-0, #FAC370)" id="Ellipse_2" r="5" />
                      <circle cx="10" cy="10" fill="var(--fill-0, #EB991F)" id="Ellipse_3" r="3" />
                    </g>
                  </svg>
                </div>
                <div className="flex flex-[1_0_0] flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] min-h-px min-w-px not-italic relative text-[#eb991f] text-[12px] uppercase">
                  <p className="leading-[16px] whitespace-pre-wrap">on call</p>
                </div>
                <div className="overflow-clip relative shrink-0 size-[16px]" data-name="Arrow Minimize">
                  <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[12px] top-1/2" data-name="Shape">
                    <svg className="absolute block inset-0" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
                      <path d={svgPaths.p303a9c00} fill="var(--fill-0, #505451)" id="Shape" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="content-stretch flex font-['Inter:regular',sans-serif] gap-[4px] items-start leading-[0] not-italic relative shrink-0 text-[14px] w-full" data-name="Frame">
                <div className="flex flex-[1_0_0] flex-col justify-center min-h-px min-w-px relative text-[#353735]">
                  <p className="leading-[20px] whitespace-pre-wrap">Support</p>
                </div>
                <div className="flex flex-col justify-center relative shrink-0 text-[#505451] whitespace-nowrap">
                  <p className="leading-[20px]">+9876543210</p>
                </div>
              </div>
            </div>

            {/* Contact card */}
            <div className="bg-[#ebf7f0] relative rounded-[8px] shrink-0 w-full" data-name="Frame">
              <div className="flex flex-col items-center size-full">
                <div className="content-stretch flex flex-col gap-[8px] items-center p-[10px] relative w-full">
                  {/* Avatar */}
                  <div className="relative shrink-0 size-[32px]" data-name="Avatars">
                    <svg className="absolute block inset-0" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
                      <path d={svgPaths.p4f1e480} fill="url(#paint0_linear_10105_2562)" id="Vector" />
                      <defs>
                        <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_10105_2562" x1="16" x2="16" y1="0" y2="32">
                          <stop stopColor="#E0FFDE" />
                          <stop offset="1" stopColor="#D0DFCF" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-[74.63%_16.11%_0_16.11%]" data-name="Vector">
                      <svg className="absolute block inset-0" fill="none" preserveAspectRatio="none" viewBox="0 0 21.691 8.11987">
                        <path d={svgPaths.pd235c00} fill="var(--fill-0, #07B723)" id="Vector" />
                      </svg>
                    </div>
                    <div className="absolute inset-[25.97%_32.83%_39.68%_32.82%]" data-name="Vector">
                      <div className="absolute inset-[-9.1%]">
                        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12.9919 12.9919">
                          <path d={svgPaths.p3ca3d680} id="Vector" stroke="var(--stroke-0, #07B723)" strokeMiterlimit="10" strokeWidth="2" />
                        </svg>
                      </div>
                    </div>
                    <div className="absolute bg-white border border-solid border-white inset-[62.5%_0_0_62.5%] rounded-[8px]" data-name="Whatsapp logo">
                      <div className="absolute inset-[calc(4%-0.92px)]" data-name="Vector">
                        <div className="absolute inset-[-9.06%]">
                          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.04 13.04">
                            <path d={svgPaths.p241f0400} fill="var(--fill-0, #2CB742)" id="Vector" stroke="var(--stroke-0, white)" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Name + phone */}
                  <div className="content-stretch flex flex-col gap-[4px] items-center leading-[0] not-italic relative shrink-0 text-center w-full" data-name="Frame">
                    <div className="flex flex-col font-['Inter:semibold',sans-serif] justify-center relative shrink-0 text-[#1b1d1c] text-[16px] w-full">
                      <p className="leading-[24px] whitespace-pre-wrap">Priya Sharma</p>
                    </div>
                    <div className="flex flex-col font-['Inter:regular',sans-serif] h-[17.5px] justify-center relative shrink-0 text-[#505451] text-[12px] w-full">
                      <p className="leading-[16px] whitespace-pre-wrap">+91 98765 43210</p>
                    </div>
                  </div>

                  {/* Timer */}
                  <div className="flex flex-col font-['Roboto_Mono:Regular',sans-serif] font-normal h-[24.5px] justify-center leading-[0] relative shrink-0 text-[#364153] text-[14px] text-center w-full">
                    <p className="leading-[24.5px] whitespace-pre-wrap">00:32</p>
                  </div>

                  {/* Record button */}
                  <button
                    onClick={() => setIsRecording(!isRecording)}
                    className="flex items-center gap-[6px] justify-center relative shrink-0 hover:opacity-80 transition-opacity cursor-pointer bg-white border-0 px-2 py-2 rounded-[6px]"
                    data-name="record-button"
                  >
                    {isRecording ? (
                      <>
                        <div className="size-[6px] bg-[#ec3244] rounded-full" />
                        <div className="flex items-baseline">
                          <span className="text-[14px] font-['Inter:regular',sans-serif] text-[#505451] leading-[20px]">Recording</span>
                          <span className="text-[14px] font-['Inter:regular',sans-serif] text-[#505451] leading-[20px] inline-flex ml-[1px]">
                            <span className="animate-[blink_1.4s_0s_infinite]">.</span>
                            <span className="animate-[blink_1.4s_0.2s_infinite]">.</span>
                          </span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="size-[6px] border-[1.5px] border-[#ec3244] rounded-full" />
                        <span className="text-[14px] font-['Inter:regular',sans-serif] text-[#505451] leading-[20px]">Record</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* ── RINGING CHIP ── */}
            {stage === 'ringing' && (
              <div className="w-full bg-[#FFF7EB] border border-[#FAC370] rounded-lg px-3 py-2 flex items-center gap-2">
                <PhoneForwarded className="w-3.5 h-3.5 text-[#EB991F] shrink-0" />
                <span className="text-[12px] text-[#353735] flex-1 truncate">
                  Ringing <span className="font-medium">{transferTarget?.name}</span>
                  {' · '}
                  <span className="tabular-nums">{ringTimeLeft}s</span>
                </span>
                <button
                  onClick={handleCancelTransfer}
                  className="text-[11px] font-medium text-[#505451] hover:text-[#1b1d1c] shrink-0 transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}

            {/* ── TRANSFER BUTTON (call stage only) ── */}
            {stage === 'call' && (
              <button
                onClick={() => setStage('picking')}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg border border-[#23A455] text-[#23A455] text-[12px] font-medium hover:bg-[#F0FAF4] transition-colors"
              >
                <PhoneForwarded className="w-3.5 h-3.5" />
                Transfer Call
              </button>
            )}

            {/* ── CALL CONTROLS ── */}
            <div className="content-stretch flex flex-col gap-[6px] items-center justify-center relative shrink-0 w-full" data-name="Frame">
              <div className="content-stretch flex gap-[12px] items-center justify-center relative shrink-0 w-full">
                {/* Mic */}
                <button
                  className="bg-[#f6f7f6] relative rounded-[99px] shrink-0 size-[32px] hover:bg-[#e8e9e8] transition-colors cursor-pointer"
                  data-name="mic"
                >
                  <div className="absolute bottom-[23.44%] left-1/4 overflow-clip right-1/4 top-[26.56%]" data-name="Mic">
                    <div className="-translate-x-1/2 -translate-y-1/2 absolute h-[12px] left-1/2 top-1/2 w-[9px]" data-name="Shape">
                      <svg className="absolute block inset-0" fill="none" preserveAspectRatio="none" viewBox="0 0 9 12">
                        <path d={svgPaths.p537d080} fill="var(--fill-0, #505451)" id="Shape" />
                      </svg>
                    </div>
                  </div>
                </button>

                {/* End call — disabled during ringing */}
                <button
                  className={`relative rounded-[16777200px] shrink-0 size-[35px] transition-colors ${
                    stage === 'ringing'
                      ? 'bg-[#ec3244] opacity-30 cursor-not-allowed'
                      : 'bg-[#ec3244] hover:bg-[#d92939] cursor-pointer'
                  }`}
                  data-name="end button"
                  onClick={stage === 'ringing' ? undefined : handleEndCall}
                  disabled={stage === 'ringing'}
                  title={stage === 'ringing' ? 'End Call disabled during transfer' : 'End Call'}
                >
                  <div className="absolute flex items-center justify-center left-[4px] size-[27.321px] top-[4px]" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "18" } as React.CSSProperties}>
                    <div className="flex-none rotate-120">
                      <div className="overflow-clip relative size-[20px]" data-name="Call">
                        <div className="-translate-x-1/2 -translate-y-1/2 absolute h-[15.996px] left-[calc(50%-0.15px)] top-[calc(50%-0.02px)] w-[12.209px]" data-name="Shape">
                          <svg className="absolute block inset-0" fill="none" preserveAspectRatio="none" viewBox="0 0 12.2092 15.9963">
                            <path d={svgPaths.p3e637e0} fill="var(--fill-0, white)" id="Shape" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </button>

                {/* Message */}
                <button
                  className="bg-[#f6f7f6] relative rounded-[99px] shrink-0 size-[32px] hover:bg-[#e8e9e8] transition-colors cursor-pointer"
                  data-name="message"
                >
                  <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[16px] top-[calc(50%+0.5px)]" data-name="SVG">
                    <svg className="absolute block inset-0" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
                      <g id="SVG">
                        <path d={svgPaths.p1bb15080} id="Vector" stroke="var(--stroke-0, #505451)" strokeLinecap="round" strokeLinejoin="round" />
                      </g>
                    </svg>
                  </div>
                </button>
              </div>

              {/* Disabled end-call hint */}
              {stage === 'ringing' && (
                <p className="text-[10px] text-[#9CA3AF] text-center">
                  End Call disabled until transfer resolves
                </p>
              )}
            </div>
          </>
        )}
      </div>

      {/* ── INCOMING TRANSFER CARD (portal) ── */}
      {showIncomingCard && transferTarget && createPortal(
        <IncomingTransferCard
          transferredBy="Vijay Kumar"
          transferredByInitials="VK"
          reason={transferNote}
          contactName="Priya Sharma"
          contactPhone="+91 98765 43210"
          ringTimeLeft={ringTimeLeft}
          ringDuration={RING_DURATION}
          onAccept={handleTransferAccepted}
          onDecline={handleTransferDeclined}
        />,
        document.body
      )}
    </>
  );
}

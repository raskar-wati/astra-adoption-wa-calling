import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { AnimatePresence, animate, motion, useReducedMotion } from 'motion/react';
import { Phone, PhoneMissed, X } from 'lucide-react';
import copilot from '../../assets/nav/copilot.svg';
import panelLeftOpen from '../../assets/nav/panel-left-open.svg';
import { AstraLogo } from './AstraLogo';
import { useAstraAdoption } from '../lib/AstraAdoptionContext';
import { SegmentProfile, pickupRate, unansweredCount } from '../lib/astraAdoption';

// The Wati AI prompt in the global header. Normally a quiet pill; in iteration
// 3 it is also the morning brief. On the day's first load it wakes, grows like
// a dynamic island and tells yesterday's call story one beat at a time — the
// totals, the callers who never got through, and finally Astra, introduced by
// Wati AI because the user already trusts Wati AI and has never heard of Astra.
// Then it folds back into the pill, leaving one line of the story behind.

// --- The story ---------------------------------------------------------------

type Beat =
  | 'idle'      // plain prompt
  | 'wake'      // sparkle glints, a shimmer crosses the pill
  | 'greet'     // opens: good morning, here's yesterday
  | 'stats'     // the numbers count up
  | 'hook'      // the callers who never got through
  | 'astra'     // Wati AI hands over to Astra
  | 'settled'   // whole story on screen, waiting for the user
  | 'residual'; // folded back, one line of the story remains

const ORDER: Beat[] = ['idle', 'wake', 'greet', 'stats', 'hook', 'astra', 'settled', 'residual'];
const atLeast = (beat: Beat, min: Beat) => ORDER.indexOf(beat) >= ORDER.indexOf(min);

// When each beat starts, from the moment the brief begins. Gaps are sized to
// how long the previous beat takes to read, not to a fixed rhythm.
const TIMELINE: [Beat, number][] = [
  ['wake', 0],
  ['greet', 1000],
  ['stats', 2300],
  ['hook', 4300],
  ['astra', 6300],
  ['settled', 7400],
];

/** Pause after first load so the inbox paints before anything moves. */
const START_DELAY_MS = 1500;
/** How long the finished story stays open, untouched. */
const DWELL_MS = 7000;
/** After the pointer leaves an open island. */
const DWELL_AFTER_HOVER_MS = 2500;

function hookCopy(p: SegmentProfile): { strong: string; rest: string } {
  if (p.repeatCallers > 0) {
    return {
      strong: `${p.repeatCallers} people`,
      rest: 'called more than once — and never got through.',
    };
  }
  return {
    strong: `${p.awaitingCallback} callers`,
    rest: "missed yesterday still haven't had a callback.",
  };
}

// --- Motion vocabulary -------------------------------------------------------

const ISLAND_SPRING = { type: 'spring', stiffness: 260, damping: 30, mass: 0.9 } as const;
const EASE_OUT = [0.16, 1, 0.3, 1] as const;

/** Words arrive one by one, each sharpening out of a slight blur. */
function WordReveal({
  parts,
  delay = 0,
  className = '',
}: {
  parts: { text: string; strong?: boolean }[];
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  let i = 0;
  return (
    <p className={className}>
      {parts.map((part, pi) =>
        part.text.split(' ').map((word, wi) => {
          const n = i++;
          return (
            <motion.span
              key={`${pi}-${wi}`}
              className={`inline-block whitespace-pre ${part.strong ? 'font-semibold text-[#1b1d1c]' : ''}`}
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 6, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.45, ease: EASE_OUT, delay: reduce ? 0 : delay + n * 0.035 }}
            >
              {word + ' '}
            </motion.span>
          );
        }),
      )}
    </p>
  );
}

function CountUp({ to, delay = 0, suffix = '' }: { to: number; delay?: number; suffix?: string }) {
  const reduce = useReducedMotion();
  const [value, setValue] = useState(reduce ? to : 0);
  useEffect(() => {
    if (reduce) { setValue(to); return; }
    const controls = animate(0, to, {
      duration: 0.9,
      delay,
      ease: EASE_OUT,
      onUpdate: (v) => setValue(Math.round(v)),
    });
    return () => controls.stop();
  }, [to, delay, reduce]);
  return <span className="tabular-nums">{value}{suffix}</span>;
}

/** Pickup rate as a ring that draws itself in. */
function PickupRing({ rate }: { rate: number }) {
  const low = rate < 0.5;
  return (
    <div className="relative size-[52px] shrink-0">
      <svg viewBox="0 0 52 52" className="size-[52px] -rotate-90">
        <circle cx="26" cy="26" r="22" fill="none" stroke="#eef0ef" strokeWidth="4" />
        <motion.circle
          cx="26" cy="26" r="22" fill="none"
          stroke={low ? '#ef5766' : '#23a455'} strokeWidth="4" strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: Math.max(rate, 0.02) }}
          transition={{ duration: 1.1, ease: EASE_OUT, delay: 0.1 }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-[12px] leading-[16px] font-semibold text-[#1b1d1c]">
        <CountUp to={Math.round(rate * 100)} delay={0.1} suffix="%" />
      </div>
    </div>
  );
}

/** A block that enters the story: rises into place, then stays. */
const enter = (delay = 0) => ({
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, transition: { duration: 0.12 } },
  transition: { duration: 0.5, ease: EASE_OUT, delay },
});

// --- The island --------------------------------------------------------------

export function WatiAIPrompt() {
  const { page, iteration, morningBriefRun, replayMorningBrief, profile, callAstra } = useAstraAdoption();
  const reduce = useReducedMotion();

  const [beat, setBeat] = useState<Beat>('idle');
  const [hovered, setHovered] = useState(false);
  const hoveredOnce = useRef(false);
  const replayFast = useRef(false);
  // Beats still scheduled; closing the island mid-story cancels the rest.
  const beatTimers = useRef<number[]>([]);

  const slotRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [baseWidth, setBaseWidth] = useState(600);
  const [contentHeight, setContentHeight] = useState(36);

  // The brief is a Team Inbox approach; on other pages the prompt stays plain.
  const briefing = iteration === 3 && page === 'inbox';
  const expanded = briefing && atLeast(beat, 'greet') && beat !== 'residual';

  // Track the header slot and the story's natural height, so the island can
  // spring to exactly the size each beat needs.
  useLayoutEffect(() => {
    const slot = slotRef.current;
    const content = contentRef.current;
    if (!slot || !content) return;
    const ro = new ResizeObserver(() => {
      setBaseWidth(slot.offsetWidth);
      setContentHeight(content.offsetHeight + 2); // + border
    });
    ro.observe(slot);
    ro.observe(content);
    return () => ro.disconnect();
  }, []);

  // Play the story whenever a brief is due.
  useEffect(() => {
    if (!briefing || morningBriefRun === 0) { setBeat('idle'); return; }
    setBeat('idle');
    hoveredOnce.current = false;
    const start = replayFast.current ? 150 : START_DELAY_MS;
    replayFast.current = false;
    beatTimers.current = TIMELINE.map(([b, at]) => window.setTimeout(() => setBeat(b), start + (reduce ? 0 : at)));
    return () => beatTimers.current.forEach(window.clearTimeout);
  }, [briefing, morningBriefRun, reduce]);

  const collapse = useCallback(() => {
    beatTimers.current.forEach(window.clearTimeout);
    setBeat((b) => (b === 'idle' ? b : 'residual'));
  }, []);

  // Fold back once the story has been left alone long enough.
  useEffect(() => {
    if (beat !== 'settled' || hovered) return;
    const t = window.setTimeout(collapse, hoveredOnce.current ? DWELL_AFTER_HOVER_MS : DWELL_MS);
    return () => window.clearTimeout(t);
  }, [beat, hovered, collapse]);

  useEffect(() => {
    if (!expanded) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') collapse(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [expanded, collapse]);

  // The brief ends by putting the user on a call with Astra, not on a page about it.
  const talkToAstra = () => {
    collapse();
    callAstra();
  };

  const onPillClick = () => {
    if (briefing && beat === 'residual') {
      replayFast.current = true;
      replayMorningBrief();
    }
  };

  const unanswered = unansweredCount(profile);
  const rate = pickupRate(profile);
  const hook = hookCopy(profile);

  // The pill's own line changes with the story, so the island reads as one
  // object changing state rather than a panel opening beneath a search box.
  const pillLine =
    expanded ? (
      <span key="greet" className="text-[#1b1d1c] font-medium">Good morning</span>
    ) : briefing && beat === 'residual' ? (
      <span key="residual" className="inline-flex items-center gap-[6px] text-[#353735]">
        <span className="size-[6px] rounded-full bg-[#ef5766]" />
        {unanswered} missed calls yesterday
        <span className="text-[#b7b9b7]">·</span>
        <span className="text-astra-blue font-medium">Meet Astra</span>
      </span>
    ) : (
      <span key="placeholder" className="text-[#b7b9b7]">Suggest send-time improvements...</span>
    );

  return (
    <div ref={slotRef} className="relative w-full max-w-[600px] h-[36px]">
      <motion.div
        role={expanded ? 'status' : undefined}
        aria-live="polite"
        onHoverStart={() => { setHovered(true); hoveredOnce.current = true; }}
        onHoverEnd={() => setHovered(false)}
        className="absolute top-0 left-1/2 z-50 bg-white border border-[#e7e9e8] overflow-hidden font-['Inter',sans-serif]"
        style={{ x: '-50%' }}
        initial={false}
        animate={{
          width: expanded ? baseWidth + 48 : baseWidth,
          height: expanded ? contentHeight : 36,
          borderRadius: expanded ? 20 : 18,
          boxShadow: expanded
            ? '0 16px 40px -12px rgba(27,29,28,0.22), 0 4px 10px -6px rgba(27,29,28,0.12)'
            : '0 0 0 0 rgba(27,29,28,0)',
          scale: beat === 'wake' ? [1, 1.02, 1] : 1,
        }}
        transition={{ default: ISLAND_SPRING, scale: { duration: 0.7, ease: 'easeInOut' }, boxShadow: { duration: 0.4 } }}
      >
        <div ref={contentRef}>
          {/* The pill row — always here, it is what the island grows out of */}
          <div
            onClick={onPillClick}
            role={briefing && beat === 'residual' ? 'button' : undefined}
            tabIndex={briefing && beat === 'residual' ? 0 : undefined}
            onKeyDown={(e) => { if (e.key === 'Enter') onPillClick(); }}
            className={`relative w-full h-[34px] flex items-center gap-[8px] px-[12px] text-left ${
              briefing && beat === 'residual' ? 'cursor-pointer' : ''
            }`}
          >
            {/* Wake: a light sweep across the pill */}
            <AnimatePresence>
              {beat === 'wake' && (
                <motion.span
                  key="shimmer"
                  aria-hidden
                  className="absolute inset-y-0 w-1/2 pointer-events-none"
                  style={{ background: 'linear-gradient(90deg, transparent, rgba(0,231,133,0.16), transparent)' }}
                  initial={{ left: '-50%' }}
                  animate={{ left: '100%' }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1, ease: 'easeInOut' }}
                />
              )}
            </AnimatePresence>

            <span className="flex items-center gap-[4px] shrink-0">
              <motion.img
                alt=""
                src={copilot}
                className="size-[16px] max-w-none"
                animate={beat === 'wake' ? { rotate: [0, -18, 24, 0], scale: [1, 1.3, 1.15, 1] } : { rotate: 0, scale: 1 }}
                transition={{ duration: 0.9, ease: 'easeInOut' }}
              />
              <span
                className="text-[14px] leading-[20px] font-semibold bg-clip-text text-transparent whitespace-nowrap"
                style={{ backgroundImage: 'linear-gradient(157.38deg, rgb(35, 164, 85) 0%, rgb(0, 231, 133) 100%)' }}
              >
                Wati AI
              </span>
            </span>
            <span className="bg-[#d9d9d9] h-[16px] w-px shrink-0" />

            <span className="relative flex-1 min-w-0 h-[20px] overflow-hidden text-[14px] leading-[20px]">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={(pillLine as React.ReactElement).key as string}
                  className="absolute inset-0 truncate"
                  initial={{ y: 14, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -14, opacity: 0 }}
                  transition={{ duration: 0.35, ease: EASE_OUT }}
                >
                  {pillLine}
                </motion.span>
              </AnimatePresence>
            </span>

            {expanded ? (
              <button
                type="button"
                aria-label="Close"
                onClick={(e) => { e.stopPropagation(); collapse(); }}
                className="shrink-0 -mr-[4px] p-[4px] rounded-full text-[#848a86] hover:text-[#1b1d1c] hover:bg-black/5 transition-colors"
              >
                <X className="size-[14px]" />
              </button>
            ) : (
              <img alt="" src={panelLeftOpen} className="size-[16px] max-w-none shrink-0 -scale-y-100 rotate-180" />
            )}
          </div>

          {/* The story, one beat at a time */}
          <AnimatePresence>
            {expanded && (
              <motion.div key="story" className="px-[16px] pb-[16px]" exit={{ opacity: 0, transition: { duration: 0.15 } }}>
                <WordReveal
                  className="text-[14px] leading-[20px] text-[#505451] pt-[4px]"
                  parts={[{ text: "Here's how your WhatsApp calls went yesterday." }]}
                  delay={0.15}
                />

                {atLeast(beat, 'stats') && (
                  <motion.div {...enter()} className="mt-[14px] flex items-center gap-[20px]">
                    <PickupRing rate={rate} />
                    {[
                      { label: 'Calls in', value: profile.attempts, tone: 'text-[#1b1d1c]' },
                      { label: 'Answered', value: profile.answered, tone: 'text-[#1b1d1c]' },
                      { label: 'Missed', value: unanswered, tone: 'text-[#ec3244]' },
                    ].map((s, i) => (
                      <motion.div key={s.label} {...enter(0.12 + i * 0.12)} className="min-w-0">
                        <p className={`text-[20px] leading-[24px] font-semibold ${s.tone}`}>
                          <CountUp to={s.value} delay={0.12 + i * 0.12} />
                        </p>
                        <p className="text-[12px] leading-[16px] text-[#848a86] mt-[2px]">{s.label}</p>
                      </motion.div>
                    ))}
                  </motion.div>
                )}

                {atLeast(beat, 'hook') && (
                  <motion.div
                    {...enter()}
                    className="mt-[14px] flex items-start gap-[10px] rounded-[12px] bg-[#fdf2f3] px-[12px] py-[10px]"
                  >
                    <motion.span
                      initial={{ scale: 0.4, rotate: -30 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: 'spring', stiffness: 420, damping: 16, delay: 0.1 }}
                      className="mt-[2px] shrink-0"
                    >
                      <PhoneMissed className="size-[16px] text-[#ec3244]" />
                    </motion.span>
                    <WordReveal
                      className="text-[14px] leading-[20px] text-[#353735]"
                      parts={[{ text: hook.strong, strong: true }, { text: hook.rest }]}
                      delay={0.15}
                    />
                  </motion.div>
                )}

                {atLeast(beat, 'astra') && (
                  <div className="mt-[16px]">
                    {/* Wati AI hands over — the line draws itself before Astra appears */}
                    <motion.div
                      className="h-px bg-[#e7e9e8] origin-left"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.6, ease: EASE_OUT }}
                    />
                    <WordReveal
                      className="mt-[12px] text-[14px] leading-[20px] text-[#505451]"
                      parts={[{ text: "I can't pick up calls." }, { text: 'Astra can.', strong: true }]}
                      delay={0.25}
                    />
                    <motion.div {...enter(0.75)} className="mt-[10px] flex items-center gap-[12px]">
                      <motion.div
                        className="size-[36px] shrink-0 rounded-full bg-[#f3f6ff] border border-astra-blue/20 flex items-center justify-center"
                        initial={{ scale: 0.3, rotate: -120, opacity: 0 }}
                        animate={{ scale: 1, rotate: 0, opacity: 1 }}
                        transition={{ type: 'spring', stiffness: 220, damping: 14, delay: 0.8 }}
                      >
                        <AstraLogo className="size-[22px]" variant="brand" />
                      </motion.div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[14px] leading-[20px] font-semibold text-astra-ink">Astra</p>
                        <p className="text-[12px] leading-[16px] text-[#505451]">
                          A voice agent that answers the calls your team can't — day or night.
                        </p>
                      </div>
                      <motion.div {...enter(1.05)} className="flex items-center gap-[6px] shrink-0">
                        <button
                          type="button"
                          onClick={collapse}
                          className="px-[10px] py-[6px] rounded-[8px] text-[13px] leading-[16px] text-[#505451] hover:bg-black/5 transition-colors"
                        >
                          Later
                        </button>
                        <button
                          type="button"
                          onClick={talkToAstra}
                          className="inline-flex items-center gap-[6px] px-[12px] py-[6px] rounded-[8px] bg-wati-green text-white text-[13px] leading-[16px] font-medium hover:bg-wati-green-dark transition-colors"
                        >
                          <Phone className="size-[13px]" />
                          Talk to Astra
                        </button>
                      </motion.div>
                    </motion.div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

export default WatiAIPrompt;

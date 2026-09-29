import { motion } from 'motion/react';
import { ChevronRight, PhoneMissed } from 'lucide-react';
import { useAstraAdoption } from '../lib/AstraAdoptionContext';
import { unansweredCount } from '../lib/astraAdoption';

// A missed-calls banner that opens the Astra pop-up. Two placements:
//
//  - `call_log_banner`  Team Inbox iteration 4, above the WhatsApp call log. It
//                       only reports what was missed today and never names
//                       Astra — the pitch waits in the pop-up.
//  - `analytics_banner` Top of WhatsApp Calls Analytics. It reports the week,
//                       like the page around it, and says Astra can answer
//                       every incoming call.
type Placement = 'call_log_banner' | 'analytics_banner';

const DAYS_IN_REPORT = 7;

export function MissedCallsBanner({ placement, className = '' }: { placement: Placement; className?: string }) {
  const { profile, status, openNudgeDirectly } = useAstraAdoption();
  const weekly = placement === 'analytics_banner';
  const missed = unansweredCount(profile) * (weekly ? DAYS_IN_REPORT : 1);

  if (status === 'subscribed-on' || missed === 0) return null;

  const title = weekly
    ? `You missed ${missed} ${missed === 1 ? 'call' : 'calls'} in the last 7 days`
    : `${missed} missed ${missed === 1 ? 'call' : 'calls'} today`;

  const detail = weekly
    ? 'Astra can answer every incoming call — day or night.'
    : [
        profile.repeatCallers > 0 && `${profile.repeatCallers} people tried more than once`,
        profile.awaitingCallback > 0 && `${profile.awaitingCallback} still waiting on a callback`,
      ].filter(Boolean).join(' · ');

  const open = () => openNudgeDirectly(placement);

  return (
    <div className={className}>
      {/* The whole card opens the pop-up; on analytics a "Learn how" button makes that explicit. */}
      <motion.div
        onClick={open}
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="group w-full flex items-center gap-[10px] rounded-[8px] bg-[#fdf2f3] border border-[#f9d5d9] px-[12px] py-[10px] text-left cursor-pointer hover:bg-[#fbe8ea] transition-colors"
      >
        <span className="size-[28px] shrink-0 rounded-full bg-white flex items-center justify-center">
          <PhoneMissed className="size-[14px] text-[#ec3244]" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[13px] leading-[18px] font-semibold text-[#1b1d1c]">{title}</span>
          {detail && (
            <span className="block text-[12px] leading-[16px] text-[#505451] truncate">{detail}</span>
          )}
        </span>
        {weekly ? (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); open(); }}
            className="shrink-0 h-[30px] px-[12px] rounded-[6px] bg-white border border-[#e7e9e8] text-[13px] leading-[16px] font-medium text-[#1b1d1c] hover:border-[#9ca19d] transition-colors"
          >
            Learn how
          </button>
        ) : (
          <button
            type="button"
            aria-label="See missed calls"
            onClick={(e) => { e.stopPropagation(); open(); }}
            className="shrink-0"
          >
            <ChevronRight className="size-[16px] text-[#848a86] transition-transform group-hover:translate-x-[2px]" />
          </button>
        )}
      </motion.div>
    </div>
  );
}

export default MissedCallsBanner;

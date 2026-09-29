import { motion } from 'motion/react';
import { ChevronRight, PhoneMissed } from 'lucide-react';
import { useAstraAdoption } from '../lib/AstraAdoptionContext';
import { unansweredCount } from '../lib/astraAdoption';

// Iteration 4: a banner above the WhatsApp call log that only reports what was
// missed today. It does not mention Astra — the numbers make the case, and the
// pitch waits in the pop-up the banner opens.
export function MissedCallsBanner() {
  const { profile, status, openNudgeDirectly } = useAstraAdoption();
  const missed = unansweredCount(profile);

  if (status === 'subscribed-on' || missed === 0) return null;

  const detail = [
    profile.repeatCallers > 0 && `${profile.repeatCallers} people tried more than once`,
    profile.awaitingCallback > 0 && `${profile.awaitingCallback} still waiting on a callback`,
  ].filter(Boolean).join(' · ');

  return (
    <div className="px-3 pb-3">
      <motion.button
        type="button"
        onClick={() => openNudgeDirectly('call_log_banner')}
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="group w-full flex items-center gap-[10px] rounded-[8px] bg-[#fdf2f3] border border-[#f9d5d9] px-[12px] py-[10px] text-left hover:bg-[#fbe8ea] transition-colors"
      >
        <span className="size-[28px] shrink-0 rounded-full bg-white flex items-center justify-center">
          <PhoneMissed className="size-[14px] text-[#ec3244]" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[13px] leading-[18px] font-semibold text-[#1b1d1c]">
            {missed} missed {missed === 1 ? 'call' : 'calls'} today
          </span>
          {detail && (
            <span className="block text-[12px] leading-[16px] text-[#505451] truncate">{detail}</span>
          )}
        </span>
        <ChevronRight className="size-[16px] shrink-0 text-[#848a86] transition-transform group-hover:translate-x-[2px]" />
      </motion.button>
    </div>
  );
}

export default MissedCallsBanner;

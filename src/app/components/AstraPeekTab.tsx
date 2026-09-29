import { motion, useReducedMotion } from 'motion/react';
import { ChevronRight } from 'lucide-react';
import { AstraLogo } from './AstraLogo';
import { useAstraAdoption } from '../lib/AstraAdoptionContext';

// Analytics iteration 2: a tab tucked behind the Missed Calls overview card,
// showing only its top strip. It slides up from behind the card after the page
// settles and lifts a little on hover — the card being peeked at is the
// evidence, the tab is the way out of it. Render it inside a `relative`
// wrapper, before the card, and give the card a higher stacking order.

/** How much of the tab shows above the card's top edge. */
const PEEK_PX = 28;

export function AstraPeekTab() {
  const { status, openNudgeDirectly } = useAstraAdoption();
  const reduce = useReducedMotion();

  if (status === 'subscribed-on') return null;

  return (
    <motion.button
      type="button"
      onClick={() => openNudgeDirectly('analytics_peek')}
      aria-label="Never miss a call with Astra"
      className="absolute left-[8px] right-[8px] top-0 z-0 h-[48px] rounded-t-[10px] bg-[#ebf7f0] border border-b-0 border-[#cdeedb] px-[10px] flex items-start pt-[6px] text-left hover:bg-[#e2f4e9] transition-colors"
      initial={reduce ? { y: -PEEK_PX } : { y: 0 }}
      animate={{ y: -PEEK_PX }}
      whileHover={reduce ? undefined : { y: -PEEK_PX - 3, transition: { type: 'spring', stiffness: 420, damping: 26 } }}
      transition={{ type: 'spring', stiffness: 260, damping: 22, delay: reduce ? 0 : 0.6 }}
    >
      <span className="flex items-center gap-[6px] w-full min-w-0 h-[16px]">
        <AstraLogo className="size-[14px] shrink-0" variant="brand" />
        <span className="flex-1 min-w-0 truncate text-[12px] leading-[16px] font-medium text-[#1b1d1c]">
          Never miss a call with Astra
        </span>
        <ChevronRight className="size-[14px] shrink-0 text-[#23a455]" />
      </span>
    </motion.button>
  );
}

export default AstraPeekTab;

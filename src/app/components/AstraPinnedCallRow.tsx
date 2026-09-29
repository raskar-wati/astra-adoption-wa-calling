import { Pin } from 'lucide-react';
import { AstraLogo } from './AstraLogo';
import { useAstraAdoption } from '../lib/AstraAdoptionContext';
import { unansweredCount } from '../lib/astraAdoption';

// Iteration 2's entry point: Astra sits in the call log as one of the calls,
// pinned above the real ones. Nothing interrupts — the user opens it when the
// numbers in the preview make them curious, and it opens a conversation. It
// wears the log's own styling, selection included, so it reads as part of the
// inbox rather than an ad placed in it; only the avatar says who it is.
export function AstraPinnedCallRow() {
  const { profile, status, astraPageOpen, openAstraPage, pinnedHighlight } = useAstraAdoption();

  const unanswered = unansweredCount(profile);
  const preview =
    status === 'subscribed-on'
      ? "Answering your calls — tap for today's overview"
      : unanswered === 0
        ? 'Every call answered today — see what I can do'
        : `${unanswered} ${unanswered === 1 ? 'call' : 'calls'} went unanswered today — I can pick these up`;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={openAstraPage}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openAstraPage(); } }}
      className={`sticky top-0 z-10 cursor-pointer ${astraPageOpen ? 'bg-[#ebf7f0]' : 'bg-white'} ${
        pinnedHighlight ? 'animate-pulse ring-2 ring-inset ring-[#69e48e]' : ''
      }`}
    >
      {/* Left border indicator for the selected item, as on every call row */}
      {astraPageOpen && <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#69e48e]" />}

      <div className="flex items-start gap-2 px-3 py-4 hover:bg-gray-50/50 transition-colors border-b border-[#e7e9e8]">
        <div className="shrink-0 w-8 h-8 rounded-full bg-white border border-[#e7e9e8] flex items-center justify-center">
          <AstraLogo className="w-5 h-5" variant="brand" />
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-['Inter'] font-bold text-[14px] leading-[20px] text-[#505451] truncate mb-0.5">
            Introducing Astra Agent
          </p>
          <div className="flex items-center justify-between gap-2">
            <p className="font-['Inter'] text-[12px] leading-[16px] text-[#505451] truncate">{preview}</p>
            <Pin className="w-3 h-3 shrink-0 text-[#848a86]" aria-label="Pinned" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AstraPinnedCallRow;

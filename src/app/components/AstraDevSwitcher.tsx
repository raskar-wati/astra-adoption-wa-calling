import { useState } from 'react';
import { FlaskConical, ChevronDown, RotateCcw, ArrowRight } from 'lucide-react';
import { useAstraAdoption } from '../lib/AstraAdoptionContext';
import {
  AdoptionIteration,
  AstraStatus,
  NudgeTrigger,
  PinnedSurface,
  WorkspaceSegment,
  pickupRate,
} from '../lib/astraAdoption';

// Demo scaffolding, not product UI, so it stays monochrome and out of the way.
// Pick the approach, the customer and their Astra status, then jump to a
// surface — each jump navigates to where the surface actually lives.

const SEGMENTS: WorkspaceSegment[] = [1, 2, 3];

const STATUSES: { value: AstraStatus; label: string }[] = [
  { value: 'not-set-up', label: 'Not set up' },
  { value: 'trial', label: 'Trial' },
  { value: 'subscribed-off', label: 'Paid, off' },
  { value: 'subscribed-on', label: 'On' },
];

const ITERATIONS: { value: AdoptionIteration; label: string }[] = [
  { value: 1, label: 'Pop-ups' },
  { value: 2, label: 'Pinned' },
  { value: 3, label: 'Brief' },
  { value: 4, label: 'Banner' },
];

const PINNED_SURFACES: { surface: PinnedSurface; name: string }[] = [
  { surface: 'pinned_row', name: 'Pinned Astra row' },
  { surface: 'education_page', name: 'Astra thread' },
  { surface: 'astra_call', name: 'Call with Astra' },
];

const SURFACES: { trigger: NudgeTrigger; name: string }[] = [
  { trigger: 'low_pickup_rate', name: 'Low pickup alert' },
  { trigger: 'after_hours', name: 'Morning-after nudge' },
  { trigger: 'logs_star_icon', name: 'Missed-call star' },
];

// One labelled row of mutually exclusive options.
function Segmented<T extends string | number>({
  label,
  value,
  options,
  onChange,
  caption,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
  caption?: string;
}) {
  return (
    <div>
      <p className="text-white/40 mb-1">{label}</p>
      <div className="flex gap-0.5 p-0.5 rounded-md bg-white/5">
        {options.map((o) => (
          <button
            key={o.value}
            onClick={() => onChange(o.value)}
            className={`flex-1 px-1.5 py-1 rounded transition-colors whitespace-nowrap ${
              value === o.value ? 'bg-white text-black font-medium' : 'text-white/60 hover:text-white'
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
      {caption && <p className="text-white/40 mt-1">{caption}</p>}
    </div>
  );
}

function SurfaceLink({ name, onClick }: { name: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between px-2 py-1.5 rounded text-white/80 hover:bg-white/10 hover:text-white transition-colors group"
    >
      {name}
      <ArrowRight className="w-3 h-3 text-white/30 group-hover:text-white transition-colors" />
    </button>
  );
}

export function AstraDevSwitcher() {
  const [open, setOpen] = useState(false);
  const {
    iteration, setIteration, showPinnedSurface, replayMorningBrief,
    segment, status, profile,
    setSegment, setStatus, showSurface, showCallLog, resetNudgeHistory,
  } = useAstraAdoption();

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-4 left-4 z-40 inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-black text-white text-[12px] font-medium shadow-lg hover:bg-neutral-800 transition-colors"
      >
        <FlaskConical className="w-3.5 h-3.5" />
        Segment {segment} · {ITERATIONS.find((it) => it.value === iteration)!.label}
      </button>
    );
  }

  // Jump to a surface and get the panel out of the way.
  const go = (fn: () => void) => () => { fn(); setOpen(false); };

  return (
    <div className="fixed bottom-4 left-4 z-40 w-[17rem] rounded-xl bg-black text-white shadow-2xl overflow-hidden text-[12px] leading-[16px]">
      <button
        onClick={() => setOpen(false)}
        className="w-full flex items-center justify-between px-3 py-2.5 border-b border-white/10 hover:bg-white/5 transition-colors"
      >
        <span className="inline-flex items-center gap-1.5 font-medium">
          <FlaskConical className="w-3.5 h-3.5" />
          Demo controls
        </span>
        <ChevronDown className="w-3.5 h-3.5 text-white/60" />
      </button>

      <div className="p-3 space-y-3 max-h-[72vh] overflow-y-auto">
        <Segmented label="Approach" value={iteration} options={ITERATIONS} onChange={setIteration} />

        <Segmented
          label="Customer"
          value={segment}
          options={SEGMENTS.map((s) => ({ value: s, label: `Segment ${s}` }))}
          onChange={setSegment}
          caption={`${profile.name} · ${Math.round(pickupRate(profile) * 100)}% pickup`}
        />

        {iteration !== 3 && (
          <Segmented label="Astra" value={status} options={STATUSES} onChange={setStatus} />
        )}

        <div>
          <p className="text-white/40 mb-1">Show</p>
          <div className="-mx-2">
            {iteration === 4 ? (
              <>
                <SurfaceLink name="Missed-calls banner" onClick={go(showCallLog)} />
                <SurfaceLink name="Astra pop-up" onClick={go(() => showSurface('call_log_banner'))} />
              </>
            ) : iteration === 3 ? (
              <SurfaceLink name="Replay morning brief" onClick={go(replayMorningBrief)} />
            ) : iteration === 2 ? (
              PINNED_SURFACES.map((s) => (
                <SurfaceLink key={s.surface} name={s.name} onClick={go(() => showPinnedSurface(s.surface))} />
              ))
            ) : (
              SURFACES.map((s) => (
                <SurfaceLink key={s.trigger} name={s.name} onClick={go(() => showSurface(s.trigger))} />
              ))
            )}
          </div>
        </div>

        {iteration === 1 && (
          <button
            onClick={resetNudgeHistory}
            className="inline-flex items-center gap-1 text-white/40 hover:text-white transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            Reset nudge history
          </button>
        )}
      </div>
    </div>
  );
}

export default AstraDevSwitcher;

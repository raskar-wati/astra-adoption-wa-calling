import { useState } from 'react';
import { FlaskConical, ChevronDown, RotateCcw, ArrowRight } from 'lucide-react';
import { useAstraAdoption } from '../lib/AstraAdoptionContext';
import {
  AstraStatus,
  NudgeTrigger,
  SEGMENT_PROFILES,
  WorkspaceSegment,
  pickupRate,
  unansweredCount,
} from '../lib/astraAdoption';

// Demo scaffolding, not product UI. Reads as three steps: pick who the customer
// is, pick how far along they are with Astra, then jump to a surface and watch
// it change. Each surface button navigates to where it actually lives, because
// a modal over an unrelated screen does not show you anything.

const SEGMENTS: WorkspaceSegment[] = [1, 2, 3];

const STATUSES: { value: AstraStatus; label: string }[] = [
  { value: 'not-set-up', label: 'Not set up' },
  { value: 'trial', label: 'Free trial' },
  { value: 'subscribed-off', label: 'Subscribed, off' },
  { value: 'subscribed-on', label: 'Astra answering' },
];

const SURFACES: { trigger: NudgeTrigger; name: string; where: string }[] = [
  { trigger: 'low_pickup_rate', name: 'Low pickup alert', where: 'Pop-up over the call log' },
  { trigger: 'after_hours', name: 'Morning-after nudge', where: 'Pop-up on first load of the day' },
  { trigger: 'logs_star_icon', name: 'Missed-call star', where: 'Inline in the call log' },
];

function Step({ n, title, children }: React.PropsWithChildren<{ n: number; title: string }>) {
  return (
    <div>
      <p className="flex items-center gap-1.5 text-white/50 mb-1.5">
        <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-white/10 text-[10px] text-white/70">
          {n}
        </span>
        {title}
      </p>
      {children}
    </div>
  );
}

export function AstraDevSwitcher() {
  const [open, setOpen] = useState(false);
  const {
    segment, status, routingMode, profile, history, events,
    lowPickup, afterHours,
    setSegment, setStatus, showSurface, resetNudgeHistory,
  } = useAstraAdoption();

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-4 left-4 z-40 inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-gray-900 text-white text-xs font-medium shadow-lg hover:bg-black transition-colors"
      >
        <FlaskConical className="w-3.5 h-3.5" />
        Segment {segment}
      </button>
    );
  }

  const verdictFor = (t: NudgeTrigger) =>
    t === 'low_pickup_rate' ? lowPickup : t === 'after_hours' ? afterHours : null;

  return (
    <div className="fixed bottom-4 left-4 z-40 w-[22rem] rounded-xl bg-gray-900 text-white shadow-2xl overflow-hidden text-xs">
      <button
        onClick={() => setOpen(false)}
        className="w-full flex items-center justify-between px-3 py-2.5 bg-black/30 hover:bg-black/40 transition-colors"
      >
        <span className="inline-flex items-center gap-1.5 font-medium">
          <FlaskConical className="w-3.5 h-3.5" />
          Astra adoption — demo controls
        </span>
        <ChevronDown className="w-3.5 h-3.5" />
      </button>

      <div className="p-3 space-y-3.5 max-h-[72vh] overflow-y-auto">
        <Step n={1} title="Who is this customer?">
          <div className="space-y-1">
            {SEGMENTS.map((s) => {
              const p = SEGMENT_PROFILES[s];
              const active = segment === s;
              return (
                <button
                  key={s}
                  onClick={() => setSegment(s)}
                  className={`w-full text-left px-2.5 py-2 rounded-lg transition-colors ${
                    active ? 'bg-wati-green text-white' : 'bg-white/5 hover:bg-white/10 text-white/80'
                  }`}
                >
                  <span className="font-medium">{s}. {p.name}</span>
                  <span className={`block mt-0.5 ${active ? 'text-white/80' : 'text-white/40'}`}>
                    {Math.round(pickupRate(p) * 100)}% pickup · {unansweredCount(p)} unanswered
                    {s === 1 && ' · never nudged'}
                  </span>
                </button>
              );
            })}
          </div>
        </Step>

        <Step n={2} title="How far along are they?">
          <div className="grid grid-cols-2 gap-1">
            {STATUSES.map((s) => (
              <button
                key={s.value}
                onClick={() => setStatus(s.value)}
                className={`px-2 py-1.5 rounded-lg transition-colors ${
                  status === s.value ? 'bg-wati-green text-white' : 'bg-white/5 hover:bg-white/10 text-white/70'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
          <p className="text-white/40 mt-1.5">
            {status === 'not-set-up'
              ? 'CTA hands off to Astra for a 7-day trial.'
              : status === 'subscribed-on'
                ? `Astra is answering (${routingMode}) — nudges stop.`
                : 'CTA turns routing on inside Wati.'}
          </p>
        </Step>

        <Step n={3} title="Show me a surface">
          <div className="space-y-1">
            {SURFACES.map((s) => {
              const verdict = verdictFor(s.trigger);
              const blocked = verdict && !verdict.fires;
              return (
                <button
                  key={s.trigger}
                  onClick={() => { showSurface(s.trigger); setOpen(false); }}
                  className="w-full flex items-center gap-2 text-left px-2.5 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors group"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-white/90 font-medium">{s.name}</p>
                    <p className="text-white/40">{s.where}</p>
                    {blocked && (
                      <p className="text-amber-300/70 mt-0.5">
                        Would not fire on its own — {verdict!.reason}
                      </p>
                    )}
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 shrink-0 text-white/40 group-hover:text-white transition-colors" />
                </button>
              );
            })}
          </div>
          <p className="text-white/40 mt-1.5">
            Takes you to the call log and shows it, whatever the fatigue rules say.
          </p>
        </Step>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-white/50">Nudge history</p>
            <button
              onClick={resetNudgeHistory}
              className="inline-flex items-center gap-1 text-white/60 hover:text-white transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          </div>
          <div className="space-y-0.5 text-white/40">
            {Object.entries(history).map(([key, rec]) => (
              <p key={key}>
                {key}: {rec.dismissals} dismissed{rec.retired ? ' · retired' : ''}
                {rec.snoozedUntil ? ' · snoozed' : ''}
              </p>
            ))}
          </div>
        </div>

        {events.length > 0 && (
          <div>
            <p className="text-white/50 mb-1.5">Events</p>
            <div className="space-y-1">
              {events.map((e, i) => (
                <div key={i} className="px-2.5 py-1.5 rounded-lg bg-white/5">
                  <p className="text-white/80">{e.label}</p>
                  {e.detail && <p className="text-white/40 break-all">{e.detail}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AstraDevSwitcher;

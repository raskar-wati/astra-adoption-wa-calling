import { PhoneMissed, Moon, Sparkles, X, Play } from 'lucide-react';
import { AstraLogo } from './AstraLogo';
import { useAstraAdoption } from '../lib/AstraAdoptionContext';
import {
  NudgeTrigger,
  ROUTING_COPY,
  pickupRate,
  unansweredCount,
} from '../lib/astraAdoption';

// One pop-up template behind all three triggers. What changes per trigger is
// the headline and the evidence; what changes per segment is which routing
// mode is offered — a team already answering most calls is offered overflow
// cover, not "hand every call to the AI".

const TRIGGER_META: Record<NudgeTrigger, { icon: typeof PhoneMissed; eyebrow: string }> = {
  low_pickup_rate: { icon: PhoneMissed, eyebrow: 'Low pickup rate' },
  after_hours: { icon: Moon, eyebrow: 'After-hours calls' },
  logs_star_icon: { icon: Sparkles, eyebrow: 'Stop missing calls' },
  call_log_banner: { icon: PhoneMissed, eyebrow: 'Missed calls' },
};

export function AstraNudgeModal() {
  const {
    openNudge, profile, segment, status, routingMode,
    closeNudge, snoozeNudge, dismissNudge, startAstraTrial, enableAstra, callAstra,
  } = useAstraAdoption();

  if (!openNudge) return null;

  const trigger = openNudge;
  const { icon: Icon, eyebrow } = TRIGGER_META[trigger];
  const mode = profile.recommended;
  const rate = Math.round(pickupRate(profile) * 100);
  const unanswered = unansweredCount(profile);
  const needsSetup = status === 'not-set-up';

  const headline =
    trigger === 'after_hours'
      ? `${profile.afterHoursCalls} people called after you closed`
      : trigger === 'logs_star_icon'
        ? 'Stop missing calls from leads'
        : trigger === 'call_log_banner'
          ? `Astra can pick up the ${unanswered} calls you missed`
        : `You answered ${rate}% of your calls today`;

  const body =
    trigger === 'after_hours'
      ? 'They reached a line nobody was on. Astra answers in their language, around the clock, and hands you the transcript in the morning.'
      : `That is ${unanswered} unanswered ${unanswered === 1 ? 'attempt' : 'attempts'} out of ${profile.attempts}. Every one is a lead that went somewhere else, or a customer left waiting.`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={closeNudge} />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Astra Voice AI"
        className="relative z-10 w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden"
      >
        <div className="flex items-start gap-3 px-6 pt-6">
          <div className="w-10 h-10 rounded-full bg-astra-blue/10 flex items-center justify-center shrink-0">
            <AstraLogo className="w-6 h-6" variant="brand" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="inline-flex items-center gap-1.5 text-[11px] font-medium text-gray-500 uppercase tracking-wide">
              <Icon className="w-3 h-3" />
              {eyebrow}
            </p>
            <h2 className="text-lg font-semibold text-gray-900 leading-snug mt-0.5">{headline}</h2>
          </div>
          <button
            onClick={closeNudge}
            aria-label="Close"
            className="shrink-0 p-1 -m-1 text-gray-400 hover:text-gray-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 pt-3">
          <p className="text-sm text-gray-600 leading-relaxed">{body}</p>
        </div>

        {/* Evidence — the numbers the trigger actually fired on. */}
        <div className="mx-6 mt-4 grid grid-cols-3 gap-px rounded-xl bg-gray-100 overflow-hidden text-center">
          {[
            { value: `${rate}%`, label: 'Pickup rate' },
            { value: unanswered, label: 'Unanswered' },
            { value: profile.afterHoursCalls, label: 'After hours' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white px-2 py-3">
              <p className="text-base font-semibold text-gray-900">{stat.value}</p>
              <p className="text-[11px] text-gray-500 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* The offer, matched to the segment rather than one-size-fits-all. */}
        <div className="mx-6 mt-4 rounded-xl border border-wati-green/30 bg-wati-green/5 px-4 py-3">
          <p className="text-sm font-medium text-gray-900">{ROUTING_COPY[mode].label}</p>
          <p className="text-xs text-gray-600 leading-relaxed mt-1">{ROUTING_COPY[mode].blurb}</p>
          {segment === 2 && (
            <p className="text-[11px] text-gray-500 mt-2">
              Your team keeps answering first — Astra only picks up what they cannot.
            </p>
          )}
        </div>

        <div className="px-6 py-5 mt-1 flex flex-col gap-2">
          {/* The banner pop-up (iteration 4) also lets them hear Astra before committing */}
          <div className="flex gap-2">
            {trigger === 'call_log_banner' && (
              <button
                onClick={() => { closeNudge(); callAstra(); }}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg border border-gray-200 text-gray-800 text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                <Play className="w-3.5 h-3.5" />
                View demo
              </button>
            )}
            {needsSetup ? (
              <button
                onClick={() => startAstraTrial(trigger)}
                className="flex-1 px-4 py-2.5 rounded-lg bg-wati-green text-white text-sm font-medium hover:bg-wati-green-dark transition-colors"
              >
                Start 7-day free trial
              </button>
            ) : (
              <button
                onClick={() => enableAstra(mode, trigger)}
                className="flex-1 px-4 py-2.5 rounded-lg bg-wati-green text-white text-sm font-medium hover:bg-wati-green-dark transition-colors"
              >
                Turn on {ROUTING_COPY[mode].label}
              </button>
            )}
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={() => snoozeNudge(trigger)}
              className="text-xs text-gray-500 hover:text-gray-800 transition-colors"
            >
              Not now
            </button>
            <button
              onClick={() => dismissNudge(trigger)}
              className="text-xs text-gray-400 hover:text-gray-700 transition-colors"
            >
              Don't show this again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AstraNudgeModal;

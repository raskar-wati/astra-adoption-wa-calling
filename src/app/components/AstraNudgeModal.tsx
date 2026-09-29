import { PhoneMissed, Moon, Sparkles, X, Phone, Info } from 'lucide-react';
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
  analytics_banner: { icon: PhoneMissed, eyebrow: 'Missed calls' },
  analytics_peek: { icon: PhoneMissed, eyebrow: 'Missed calls' },
};

// The two banners the user clicked on themselves: no body copy under the
// headline, and a demo to try before starting the trial.
const BANNER_TRIGGERS: NudgeTrigger[] = ['call_log_banner', 'analytics_banner', 'analytics_peek'];

// Opened from the Analytics page, so the pop-up speaks in its 7-day figures.
const WEEKLY_TRIGGERS: NudgeTrigger[] = ['analytics_banner', 'analytics_peek'];

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
  const days = WEEKLY_TRIGGERS.includes(trigger) ? 7 : 1;
  const unanswered = unansweredCount(profile) * days;
  const fromBanner = BANNER_TRIGGERS.includes(trigger);
  const needsSetup = status === 'not-set-up';

  const headline =
    trigger === 'after_hours'
      ? `${profile.afterHoursCalls} people called after you closed`
      : trigger === 'logs_star_icon'
        ? 'Stop missing calls from leads'
        : trigger === 'call_log_banner'
          ? `Astra can pick up the ${unanswered} calls you missed`
          : WEEKLY_TRIGGERS.includes(trigger)
            ? `Astra can pick up the ${unanswered} calls you missed this week`
        : `You answered ${rate}% of your calls today`;

  // The banner pop-up lets its headline stand alone; the banner already said
  // what was missed.
  const body =
    trigger === 'after_hours'
      ? 'They reached a line nobody was on. Astra answers in their language, around the clock, and hands you the transcript in the morning.'
      : fromBanner
        ? null
        : `That is ${unanswered} unanswered ${unanswered === 1 ? 'attempt' : 'attempts'} out of ${profile.attempts}. Every one is a lead that went somewhere else, or a customer left waiting.`;

  // Supporting numbers — the headline states the problem, these back it up.
  const stats = [
    { value: `${rate}%`, label: 'Pickup rate', alert: rate < 50 },
    { value: profile.attempts * days, label: 'Calls in', alert: false },
    { value: profile.afterHoursCalls * days, label: 'After hours', alert: false },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={closeNudge} />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Astra Voice AI"
        className="relative z-10 w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden px-6 pt-5 pb-5"
      >
        {/* 1. Context — who is speaking and why, quietly */}
        <div className="flex items-center justify-between">
          <p className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500">
            <AstraLogo className="w-4 h-4" variant="brand" />
            <span className="text-gray-900">Astra</span>
            <span className="text-gray-300">·</span>
            <Icon className="w-3 h-3" />
            {eyebrow}
          </p>
          <button
            onClick={closeNudge}
            aria-label="Close"
            className="shrink-0 p-1 -m-1 text-gray-400 hover:text-gray-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 2. The message */}
        <h2 className="mt-3 text-[20px] leading-[28px] font-semibold text-gray-900">{headline}</h2>
        {body && <p className="mt-1.5 text-sm text-gray-500 leading-relaxed">{body}</p>}

        {/* 3. Evidence — supporting, so lighter than the headline */}
        <div className="mt-5 grid grid-cols-3 gap-2">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-xl bg-gray-50 px-3 py-2.5">
              <p className={`text-lg leading-6 font-semibold ${stat.alert ? 'text-[#ec3244]' : 'text-gray-900'}`}>
                {stat.value}
              </p>
              <p className="text-[11px] leading-4 text-gray-500 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* How Astra would work here, matched to the segment — a note, not a card */}
        <div className="mt-4 flex items-start gap-2 text-xs text-gray-500 leading-relaxed">
          <Info className="w-3.5 h-3.5 mt-[2px] shrink-0 text-gray-400" />
          <p>
            {ROUTING_COPY[mode].blurb}
            {segment === 2 && ' Your team keeps answering first — Astra only picks up what they cannot.'}
          </p>
        </div>

        {/* 4. The decision */}
        <div className="mt-6 flex gap-2">
          {/* Opened from a banner, it also lets them hear Astra before committing */}
          {fromBanner && (
            <button
              onClick={() => { closeNudge(); callAstra(); }}
              className="flex-1 inline-flex items-center justify-center gap-1.5 h-10 px-4 rounded-lg border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              View demo
            </button>
          )}
          {needsSetup ? (
            <button
              onClick={() => startAstraTrial(trigger)}
              className="flex-1 h-10 px-4 rounded-lg bg-wati-green text-white text-sm font-semibold hover:bg-wati-green-dark transition-colors"
            >
              Start 7-day free trial
            </button>
          ) : (
            <button
              onClick={() => enableAstra(mode, trigger)}
              className="flex-1 h-10 px-4 rounded-lg bg-wati-green text-white text-sm font-semibold hover:bg-wati-green-dark transition-colors"
            >
              Turn on {ROUTING_COPY[mode].label}
            </button>
          )}
        </div>

        {/* 5. The ways out, least prominent */}
        <div className="mt-3 flex items-center justify-between">
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
  );
}

export default AstraNudgeModal;

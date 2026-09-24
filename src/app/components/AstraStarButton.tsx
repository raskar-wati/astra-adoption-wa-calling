import { AstraLogo } from './AstraLogo';
import { useAstraAdoption } from '../lib/AstraAdoptionContext';
import { isNudgeable } from '../lib/astraAdoption';

// The passive counterpart to the modals: a mark beside a call nobody answered.
// It is user-initiated, so it ignores the fatigue caps — it stays available
// after the interruptive nudges have snoozed or retired themselves.
interface AstraStarButtonProps {
  contactName: string;
  className?: string;
}

export function AstraStarButton({ contactName, className = '' }: AstraStarButtonProps) {
  const { segment, status, openNudgeDirectly, starHighlight } = useAstraAdoption();

  if (!isNudgeable(segment, status)) return null;

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        openNudgeDirectly('logs_star_icon');
      }}
      title={`Stop missing calls from ${contactName} — set up Astra`}
      aria-label={`Stop missing calls from ${contactName} — set up Astra`}
      className={`shrink-0 p-1 rounded-md hover:bg-astra-blue/10 transition-colors ${
        starHighlight ? 'ring-2 ring-astra-blue bg-astra-blue/10 animate-pulse' : ''
      } ${className}`}
    >
      <AstraLogo className="w-3.5 h-3.5" variant="brand" />
    </button>
  );
}

export default AstraStarButton;

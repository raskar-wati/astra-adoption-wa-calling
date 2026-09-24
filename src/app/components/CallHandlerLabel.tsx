import { Headset } from 'lucide-react';
import { AstraLogo } from './AstraLogo';
import { VoipCall } from '../data/voipCalls';

// Who took the call. Mirrors how the other channels' rows credit the agent
// (a headset glyph beside the name), with Astra swapping in its own mark.
interface CallHandlerLabelProps {
  call: VoipCall;
  variant?: 'inline' | 'pill';
}

export function CallHandlerLabel({ call, variant = 'inline' }: CallHandlerLabelProps) {
  const isAstra = call.handledBy === 'astra';
  const name = isAstra ? 'Astra' : call.agentName;

  // Nobody picked up — a missed call has no handler to credit.
  if (!name) return null;

  const size = variant === 'pill' ? 'w-3.5 h-3.5' : 'w-4 h-4';
  const Mark = isAstra
    ? <AstraLogo className={size} variant="brand" />
    : <Headset className={variant === 'pill' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />;

  if (variant === 'pill') {
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium shrink-0 ${
          isAstra ? 'bg-astra-blue/10 text-astra-blue-deep' : 'bg-gray-900 text-white'
        }`}
        title={`Handled by ${name}`}
      >
        {Mark}
        {name}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-medium shrink-0 ${
        isAstra ? 'text-astra-blue-deep' : 'text-[#888888]'
      }`}
      title={`Handled by ${name}`}
    >
      {Mark}
      {name}
    </span>
  );
}

export default CallHandlerLabel;

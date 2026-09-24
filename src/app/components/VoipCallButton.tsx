import { Phone } from 'lucide-react';

// Places an outbound VoIP call to a contact. Used from the call list (compact,
// revealed on row hover) and from the call detail header (labelled).
interface VoipCallButtonProps {
  phoneNumber: string;
  contactName: string;
  onCall: (phoneNumber: string) => void;
  variant?: 'icon' | 'labelled';
  className?: string;
}

export function VoipCallButton({
  phoneNumber,
  contactName,
  onCall,
  variant = 'labelled',
  className = '',
}: VoipCallButtonProps) {
  const label = `Call ${contactName}`;

  // In the list this sits on top of a clickable row, so the click must not
  // also select the call.
  const handleClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    onCall(phoneNumber);
  };

  if (variant === 'icon') {
    return (
      <button
        type="button"
        onClick={handleClick}
        title={label}
        aria-label={label}
        className={`w-7 h-7 rounded-full bg-wati-green text-white flex items-center justify-center hover:bg-wati-green-dark transition-colors shadow-sm ${className}`}
      >
        <Phone className="w-3.5 h-3.5" />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      title={label}
      aria-label={label}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-wati-green text-white text-xs font-medium hover:bg-wati-green-dark transition-colors ${className}`}
    >
      <Phone className="w-3.5 h-3.5" />
      Call
    </button>
  );
}

export default VoipCallButton;

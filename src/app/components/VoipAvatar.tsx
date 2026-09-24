import { Waypoints, User } from 'lucide-react';

// Caller avatar for the VoIP channel, shaped like the other channels' rows:
// a round avatar with the channel mark badged over the bottom-right corner.
//
// Each channel tints its avatar with its own colour (WhatsApp's is green), and
// VoIP's theme is the dark one — so this is a dark grey figure on a light disc
// rather than a portrait. A VoIP line also rings mostly from numbers nobody
// has saved, so there is rarely a real face or initials to show.
//
// Sizes are rem-based classes, not pixels: the app runs on a 14px root, so
// `size-8` is 28px here. Hard-coded pixels would drift from every other row.
type VoipAvatarSize = 'sm' | 'md' | 'lg';

const SIZES: Record<VoipAvatarSize, { avatar: string; person: string; badge: string; glyph: string }> = {
  // `size-8` matches the other channels' conversation rows exactly.
  sm: { avatar: 'size-8', person: 'size-4', badge: 'size-3', glyph: 'size-2' },
  md: { avatar: 'size-11', person: 'size-6', badge: 'size-4', glyph: 'size-2.5' },
  lg: { avatar: 'size-16', person: 'size-8', badge: 'size-5', glyph: 'size-3' },
};

interface VoipAvatarProps {
  name?: string;
  size?: VoipAvatarSize;
  className?: string;
}

export function VoipAvatar({ name, size = 'sm', className = '' }: VoipAvatarProps) {
  const s = SIZES[size];

  return (
    <div className={`relative shrink-0 ${s.avatar} ${className}`}>
      <div
        className="w-full h-full rounded-full bg-gray-200 text-gray-600 flex items-center justify-center"
        role="img"
        aria-label={name ?? 'Unsaved number'}
      >
        <User className={s.person} strokeWidth={1.75} />
      </div>

      <div
        className={`absolute -right-px -bottom-px ${s.badge} rounded-full bg-gray-700 text-white flex items-center justify-center ring-2 ring-white`}
      >
        <Waypoints className={s.glyph} />
      </div>
    </div>
  );
}

export default VoipAvatar;

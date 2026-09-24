import { useId } from 'react';

// Astra brand mark, from Astra DSM 2.0. Both variants share the same geometry:
//
//  - `brand`  the official gradient fill. Use it where Astra is being
//             presented as a brand — the nudge it appears in, the badge that
//             credits it for a call.
//  - `mono`   the same shape stroked in currentColor, for places that need a
//             single-colour glyph (inherits from a dark pill, a tinted row).
//
// The gradients need ids unique to each instance: two marks on one page with
// the same id make the second one adopt the first's fill.
interface AstraLogoProps {
  className?: string;
  variant?: 'brand' | 'mono';
}

const PATHS = [
  'M111.633 63.8345L188.392 112.677L210 98.9819V83.9935C210 71.165 203.725 59.2503 193.414 52.5012L187.164 48.4103C175.771 42.983 148.207 34.4668 111.633 63.8345Z',
  'M187.258 48.6271C172.22 40.4101 143.914 43.1243 129.519 52.5488L129.512 52.5528L13.9998 125.598V83.8036C13.9998 70.7639 20.4817 58.6852 31.0651 52.0033L94.0651 12.2283C105.113 5.25326 118.897 5.25384 129.934 12.2489C149.804 24.8428 161.505 32.349 187.258 48.6271Z',
  'M112 160.373L35.6088 111.903L14.0002 125.598V140.313C14.0002 153.29 20.4203 165.32 30.9225 172.022L34.5685 174.349C36.1711 175.372 37.8305 176.276 39.5994 176.922C50.5868 180.941 78.5476 187.234 112 160.373Z',
  'M36.7418 175.373C51.7798 183.59 80.0864 180.876 94.4814 171.451L94.4878 171.447L210 98.4021V140.196C210 153.236 203.518 165.315 192.935 171.997L129.935 211.772C118.887 218.747 105.103 218.746 94.0661 211.751C74.1963 199.157 62.4953 191.651 36.7418 175.373Z',
];

export function AstraLogo({ className = 'w-4 h-4', variant = 'mono' }: AstraLogoProps) {
  const uid = useId().replace(/:/g, '');

  if (variant === 'mono') {
    return (
      <svg viewBox="0 0 224 224" fill="none" className={className} aria-hidden="true">
        {PATHS.map((d, i) => (
          <path
            key={i}
            fillRule="evenodd"
            clipRule="evenodd"
            d={d}
            stroke="currentColor"
            strokeWidth="11.2"
          />
        ))}
      </svg>
    );
  }

  const g = (n: number) => `astra-${uid}-${n}`;

  return (
    <svg viewBox="0 0 224 224" fill="none" className={className} aria-hidden="true">
      {PATHS.map((d, i) => (
        <path key={i} fillRule="evenodd" clipRule="evenodd" d={d} fill={`url(#${g(i)})`} />
      ))}
      <defs>
        <linearGradient id={g(0)} x1="134.87" y1="42.9408" x2="207.976" y2="100.992" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0034C5" stopOpacity="0.97" />
          <stop offset="0.546367" stopColor="#5875EC" />
          <stop offset="1" stopColor="#0034C5" stopOpacity="0.96" />
        </linearGradient>
        <linearGradient id={g(1)} x1="35.7654" y1="84.645" x2="119.851" y2="23.0717" gradientUnits="userSpaceOnUse">
          <stop stopColor="#5BAEF7" stopOpacity="0.9" />
          <stop offset="1" stopColor="#366BFF" />
        </linearGradient>
        <linearGradient id={g(2)} x1="25.4517" y1="125.453" x2="110.045" y2="198.215" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0034C5" stopOpacity="0.96" />
          <stop offset="0.319634" stopColor="#5875EC" />
          <stop offset="1" stopColor="#0034C5" stopOpacity="0.97" />
        </linearGradient>
        <linearGradient id={g(3)} x1="179.266" y1="144.736" x2="107.793" y2="191.109" gradientUnits="userSpaceOnUse">
          <stop stopColor="#5BAEF7" stopOpacity="0.9" />
          <stop offset="1" stopColor="#366BFF" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default AstraLogo;

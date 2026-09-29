import React from 'react';
import { AstraLogo } from './AstraLogo';
import megaphone from '../../assets/nav/megaphone.svg';
import mailInbox from '../../assets/nav/mail-inbox.svg';
import people from '../../assets/nav/people.svg';
import organization from '../../assets/nav/organization.svg';
import cart from '../../assets/nav/cart.svg';
import cursorClick from '../../assets/nav/cursor-click.svg';
import dataPie from '../../assets/nav/data-pie.svg';
import plug from '../../assets/nav/plug.svg';
import settings from '../../assets/nav/settings.svg';
import bookOpen from '../../assets/nav/book-open.svg';
import arrowSquare from '../../assets/nav/arrow-square.svg';

// Wati's product rail (Figma: Wati AI › Wati App shell › Left Nav 1.2). One
// 44px column of modules on the shell background; the module's own panel —
// Team Inbox's channel list here — sits in the content card beside it.

export type AppModule =
  | 'broadcasts' | 'inbox' | 'contacts' | 'astra' | 'flows'
  | 'commerce' | 'ads' | 'analytics' | 'integrations' | 'settings';

interface RailItem {
  id: AppModule;
  label: string;
  icon: React.ReactNode;
}

const img = (src: string) => <img alt="" src={src} className="size-[20px] max-w-none" />;

const TOP_ITEMS: RailItem[] = [
  { id: 'broadcasts', label: 'Broadcasts', icon: img(megaphone) },
  { id: 'inbox', label: 'Team Inbox', icon: img(mailInbox) },
  { id: 'contacts', label: 'Contacts', icon: img(people) },
  // Figma names this slot Astra; its exported SVG is a duplicate of the inbox
  // file, so it uses the Astra DSM mark we already ship.
  { id: 'astra', label: 'Astra', icon: <AstraLogo className="size-[20px] text-[#505451]" variant="mono" /> },
  { id: 'flows', label: 'Flows', icon: img(organization) },
  { id: 'commerce', label: 'Commerce', icon: img(cart) },
  { id: 'ads', label: 'Ads', icon: img(cursorClick) },
  { id: 'analytics', label: 'Analytics', icon: img(dataPie) },
  { id: 'integrations', label: 'Integrations', icon: img(plug) },
  { id: 'settings', label: 'Settings', icon: img(settings) },
];

function RailButton({ label, active, onClick, children }: React.PropsWithChildren<{
  label: string;
  active?: boolean;
  onClick?: () => void;
}>) {
  return (
    <div className="p-[4px]">
      <button
        type="button"
        aria-label={label}
        title={label}
        aria-current={active ? 'page' : undefined}
        onClick={onClick}
        className={`flex items-center justify-center p-[8px] rounded-[6px] transition-colors ${
          active ? 'bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)]' : 'hover:bg-black/5'
        }`}
      >
        {children}
      </button>
    </div>
  );
}

interface SideNavigationProps {
  active: AppModule;
  onNavigate?: (module: AppModule) => void;
}

export function SideNavigation({ active, onNavigate }: SideNavigationProps) {
  return (
    <nav className="w-[44px] shrink-0 flex flex-col justify-between" aria-label="Wati">
      <div className="flex flex-col">
        {TOP_ITEMS.map((item) => (
          <RailButton
            key={item.id}
            label={item.label}
            active={active === item.id}
            onClick={() => onNavigate?.(item.id)}
          >
            {item.icon}
          </RailButton>
        ))}
      </div>
      <div className="flex flex-col">
        <RailButton label="Help docs">{img(bookOpen)}</RailButton>
        <RailButton label="Log out">
          <span className="-rotate-90 flex">{img(arrowSquare)}</span>
        </RailButton>
      </div>
    </nav>
  );
}

export default SideNavigation;

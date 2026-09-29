import React from 'react';
import logomark from '../../assets/nav/logomark.svg';
import logotype from '../../assets/nav/logotype.svg';
import meta from '../../assets/nav/meta.svg';
import wallet from '../../assets/nav/wallet.svg';
import notification from '../../assets/nav/notification.svg';
import announcekit from '../../assets/nav/announcekit.svg';
import person from '../../assets/nav/person.svg';
import { WatiAIPrompt } from './WatiAIPrompt';

// Wati's global header (Figma: Wati AI › Wati App shell › Global Header).
// Brand on the left, the Wati AI prompt in the middle, account and number
// status on the right. Sits on the shell background, above the side rail.

function Separator() {
  return <div className="bg-[#e7e9e8] h-[16px] w-px shrink-0" />;
}

function HeaderIconButton({ label, children }: React.PropsWithChildren<{ label: string }>) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className="flex items-center justify-center size-[32px] rounded-full shrink-0 hover:bg-black/5 transition-colors"
    >
      {children}
    </button>
  );
}

export default function TopNavigation() {
  return (
    <header className="h-[44px] shrink-0 flex items-center gap-[16px] font-['Inter',sans-serif]">
      {/* Brand */}
      <div className="flex items-center min-w-[64px] px-[12px] py-[6px] shrink-0">
        <div className="relative h-[32px] w-[79.641px]">
          <div className="absolute left-0 top-0 size-[32px] overflow-clip">
            <img alt="" src={logomark} className="absolute left-[0.37px] top-[2.48px] h-[27.099px] w-[31.494px] max-w-none" />
          </div>
          <img alt="wati" src={logotype} className="absolute left-[36.35px] top-[5.32px] h-[15.807px] w-[43.295px] max-w-none" />
        </div>
      </div>

      {/* Wati AI prompt — also the iteration 3 morning brief */}
      <div className="flex-1 min-w-0 flex justify-center">
        <WatiAIPrompt />
      </div>

      {/* Account + number status */}
      <div className="flex items-center gap-[8px] self-stretch shrink-0">
        <HeaderIconButton label="Meta">
          <img alt="" src={meta} className="size-[20px] max-w-none" />
        </HeaderIconButton>
        <Separator />
        <HeaderIconButton label="Wallet">
          <img alt="" src={wallet} className="size-[20px] max-w-none" />
        </HeaderIconButton>
        <Separator />
        <HeaderIconButton label="Notifications">
          {/* The asset carries its unread dot outside the 20px box */}
          <span className="relative size-[20px]">
            <span className="absolute inset-[-20%_-20%_0_0]">
              <img alt="" src={notification} className="block size-full max-w-none" />
            </span>
          </span>
        </HeaderIconButton>
        <Separator />
        <div className="flex flex-col items-center justify-center w-[83px] text-[12px] leading-[16px] whitespace-nowrap">
          <p className="font-medium text-[#1b74e3]">CONNECTED</p>
          <p className="font-semibold text-[#23a455]">+1234567890</p>
        </div>
        <Separator />
        <HeaderIconButton label="What's new">
          <img alt="" src={announcekit} className="size-[20px] max-w-none" />
        </HeaderIconButton>
        <Separator />
        <HeaderIconButton label="Account">
          <img alt="" src={person} className="size-[20px] max-w-none" />
        </HeaderIconButton>
      </div>
    </header>
  );
}

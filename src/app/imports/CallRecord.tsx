import svgPaths from "./svg-m0kll2pc9n";

function CallOutbound() {
  return (
    <div className="absolute left-px size-[12px] top-[2px]" data-name="Call Outbound">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Call Outbound">
          <path d={svgPaths.pe3ccb00} fill="var(--fill-0, white)" id="Shape" />
        </g>
      </svg>
    </div>
  );
}

function Call() {
  return (
    <div className="-translate-y-1/2 absolute aspect-[16/16] bg-[#23a455] border border-solid border-white left-1/2 overflow-clip right-0 rounded-[8px] top-[calc(50%+8px)]" data-name="Call">
      <CallOutbound />
    </div>
  );
}

function Avatars() {
  return (
    <div className="relative shrink-0 size-[32px]" data-name="Avatars">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
        <path d={svgPaths.p4f1e480} fill="url(#paint0_linear_10058_723)" id="Vector" />
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_10058_723" x1="16" x2="16" y1="0" y2="32">
            <stop stopColor="#E0FFDE" />
            <stop offset="1" stopColor="#D0DFCF" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-[74.63%_16.11%_0_16.11%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 21.691 8.11987">
          <path d={svgPaths.pd235c00} fill="var(--fill-0, #23A455)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[25.97%_32.83%_39.68%_32.82%]" data-name="Vector">
        <div className="absolute inset-[-9.1%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12.9919 12.9919">
            <path d={svgPaths.p3ca3d680} id="Vector" stroke="var(--stroke-0, #23A455)" strokeMiterlimit="10" strokeWidth="2" />
          </svg>
        </div>
      </div>
      <Call />
    </div>
  );
}

function Headset() {
  return (
    <div className="relative size-[16px]" data-name="Headset">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Headset">
          <path d={svgPaths.p4357980} fill="var(--fill-0, #848A86)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function ChatItemStatusContainer() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-name="Chat Item Status Container">
      <div className="flex items-center justify-center relative shrink-0">
        <div className="-scale-y-100 flex-none rotate-180">
          <Headset />
        </div>
      </div>
      <p className="font-['Inter:regular',sans-serif] leading-[16px] not-italic relative shrink-0 text-[#848a86] text-[12px] text-right">Maria</p>
    </div>
  );
}

function ChatItemName() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[10px] items-center min-h-px min-w-px relative" data-name="Chat Item Name">
      <p className="font-['Inter:bold',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#505451] text-[14px]">Alex Butter</p>
      <div className="flex h-[6px] items-center justify-center relative shrink-0 w-0" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "153" } as React.CSSProperties}>
        <div className="flex-none rotate-90">
          <div className="h-0 relative w-[6px]" data-name="Line">
            <div className="absolute inset-[-1px_0_0_0]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6 1">
                <line id="Line" opacity="0.4" stroke="var(--stroke-0, #1B1D1C)" strokeLinecap="round" x1="0.5" x2="5.5" y1="0.5" y2="0.5" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <ChatItemStatusContainer />
    </div>
  );
}

function ChatItemNameContainer() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full" data-name="Chat Item Name Container">
      <ChatItemName />
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex font-['Inter:regular',sans-serif] gap-[2px] items-center leading-[16px] not-italic relative shrink-0 text-[12px] w-full" data-name="Frame">
      <p className="flex-[1_0_0] min-h-px min-w-px overflow-hidden relative text-[#505451] text-ellipsis whitespace-nowrap">Outbound call</p>
      <p className="relative shrink-0 text-[#848a86] text-right">1:45 PM</p>
    </div>
  );
}

function ChatItemTextContainer() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start min-h-px min-w-px relative self-stretch" data-name="Chat Item Text Container">
      <ChatItemNameContainer />
      <Frame />
    </div>
  );
}

function Call1() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Call">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Call">
          <path d={svgPaths.p1f19c2b0} fill="var(--fill-0, #505451)" id="Shape" />
        </g>
      </svg>
    </div>
  );
}

function CallButton() {
  return (
    <div className="content-stretch flex items-center p-[4px] relative rounded-[8px] shrink-0" data-name="Call button">
      <Call1 />
    </div>
  );
}

export default function CallRecord() {
  return (
    <div className="bg-[#ebf7f0] content-stretch flex gap-[8px] items-start px-[12px] py-[16px] relative size-full" data-name="Call record">
      <div aria-hidden="true" className="absolute border-[#69e48e] border-l-3 border-solid inset-0 pointer-events-none" />
      <Avatars />
      <ChatItemTextContainer />
      <CallButton />
    </div>
  );
}
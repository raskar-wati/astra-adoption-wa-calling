import svgPaths from "./svg-etfg2lzkn3";

function Icons8MissedCall() {
  return (
    <div className="absolute left-px size-[12px] top-px" data-name="icons8-missed-call 1">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="icons8-missed-call 1">
          <path d={svgPaths.p3c155c80} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Call() {
  return (
    <div className="-translate-y-1/2 absolute aspect-[16/16] bg-[#ef5766] border border-solid border-white left-1/2 overflow-clip right-0 rounded-[8px] top-[calc(50%+8px)]" data-name="Call">
      <Icons8MissedCall />
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
      <p className="font-['Inter:regular',sans-serif] leading-[16px] not-italic relative shrink-0 text-[#848a86] text-[12px] text-right">Melvis</p>
    </div>
  );
}

function ChatItemName() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[10px] items-center min-h-px min-w-px relative" data-name="Chat Item Name">
      <p className="font-['Inter:bold',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#505451] text-[14px]">Vikram</p>
      <div className="flex h-[6px] items-center justify-center relative shrink-0 w-0" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "18" } as React.CSSProperties}>
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
      <p className="flex-[1_0_0] min-h-px min-w-px overflow-hidden relative text-[#505451] text-ellipsis whitespace-nowrap">Missed call</p>
      <p className="relative shrink-0 text-[#848a86] text-right">9:10 PM</p>
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

function CallRecord() {
  return (
    <div className="bg-[#ebf7f0] relative shrink-0 w-full" data-name="Call record">
      <div aria-hidden="true" className="absolute border-[#69e48e] border-l-3 border-solid inset-0 pointer-events-none" />
      <div className="content-stretch flex gap-[8px] items-start px-[12px] py-[16px] relative w-full">
        <Avatars />
        <ChatItemTextContainer />
        <CallButton />
      </div>
    </div>
  );
}

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

function Call2() {
  return (
    <div className="-translate-y-1/2 absolute aspect-[16/16] bg-[#23a455] border border-solid border-white left-1/2 overflow-clip right-0 rounded-[8px] top-[calc(50%+8px)]" data-name="Call">
      <CallOutbound />
    </div>
  );
}

function Avatars1() {
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
      <Call2 />
    </div>
  );
}

function Headset1() {
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

function ChatItemStatusContainer1() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-name="Chat Item Status Container">
      <div className="flex items-center justify-center relative shrink-0">
        <div className="-scale-y-100 flex-none rotate-180">
          <Headset1 />
        </div>
      </div>
      <p className="font-['Inter:regular',sans-serif] leading-[16px] not-italic relative shrink-0 text-[#848a86] text-[12px] text-right">Rohit</p>
    </div>
  );
}

function ChatItemName1() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[10px] items-center min-h-px min-w-px relative" data-name="Chat Item Name">
      <p className="font-['Inter:bold',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#505451] text-[14px]">{`Jasmine `}</p>
      <div className="flex h-[6px] items-center justify-center relative shrink-0 w-0" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "18" } as React.CSSProperties}>
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
      <ChatItemStatusContainer1 />
    </div>
  );
}

function ChatItemNameContainer1() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full" data-name="Chat Item Name Container">
      <ChatItemName1 />
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex font-['Inter:regular',sans-serif] gap-[2px] items-center leading-[16px] not-italic relative shrink-0 text-[12px] w-full" data-name="Frame">
      <p className="flex-[1_0_0] min-h-px min-w-px overflow-hidden relative text-[#505451] text-ellipsis whitespace-nowrap">Outbound call</p>
      <p className="relative shrink-0 text-[#848a86] text-right">10:15 AM</p>
    </div>
  );
}

function ChatItemTextContainer1() {
  return (
    <div className="content-stretch flex flex-col gap-[2px] items-start relative shrink-0 w-full" data-name="Chat Item Text Container">
      <ChatItemNameContainer1 />
      <Frame1 />
    </div>
  );
}

function ChatItemDetails() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px min-w-px relative" data-name="Chat Item Details">
      <ChatItemTextContainer1 />
    </div>
  );
}

function Call3() {
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

function CallButton1() {
  return (
    <div className="content-stretch flex items-center p-[4px] relative rounded-[8px] shrink-0" data-name="Call button">
      <Call3 />
    </div>
  );
}

function CallRecord1() {
  return (
    <div className="bg-white content-stretch flex gap-[8px] items-start px-[12px] py-[16px] relative shrink-0 w-[297px]" data-name="Call record">
      <div aria-hidden="true" className="absolute border-[#e7e9e8] border-b border-solid inset-0 pointer-events-none" />
      <Avatars1 />
      <ChatItemDetails />
      <CallButton1 />
    </div>
  );
}

function CallOutbound1() {
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

function Call4() {
  return (
    <div className="-translate-y-1/2 absolute aspect-[16/16] bg-[#23a455] border border-solid border-white left-1/2 overflow-clip right-0 rounded-[8px] top-[calc(50%+8px)]" data-name="Call">
      <CallOutbound1 />
    </div>
  );
}

function Avatars2() {
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
      <Call4 />
    </div>
  );
}

function Headset2() {
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

function ChatItemStatusContainer2() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-name="Chat Item Status Container">
      <div className="flex items-center justify-center relative shrink-0">
        <div className="-scale-y-100 flex-none rotate-180">
          <Headset2 />
        </div>
      </div>
      <p className="font-['Inter:regular',sans-serif] leading-[16px] not-italic relative shrink-0 text-[#848a86] text-[12px] text-right">Maria</p>
    </div>
  );
}

function ChatItemName2() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[10px] items-center min-h-px min-w-px relative" data-name="Chat Item Name">
      <p className="font-['Inter:bold',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#505451] text-[14px]">Alex Butter</p>
      <div className="flex h-[6px] items-center justify-center relative shrink-0 w-0" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "18" } as React.CSSProperties}>
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
      <ChatItemStatusContainer2 />
    </div>
  );
}

function ChatItemNameContainer2() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full" data-name="Chat Item Name Container">
      <ChatItemName2 />
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex font-['Inter:regular',sans-serif] gap-[2px] items-center leading-[16px] not-italic relative shrink-0 text-[12px] w-full" data-name="Frame">
      <p className="flex-[1_0_0] min-h-px min-w-px overflow-hidden relative text-[#505451] text-ellipsis whitespace-nowrap">Unanswered call</p>
      <p className="relative shrink-0 text-[#848a86] text-right">1:45 PM</p>
    </div>
  );
}

function ChatItemTextContainer2() {
  return (
    <div className="content-stretch flex flex-col gap-[2px] items-start relative shrink-0 w-full" data-name="Chat Item Text Container">
      <ChatItemNameContainer2 />
      <Frame2 />
    </div>
  );
}

function ChatItemDetails1() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px min-w-px relative" data-name="Chat Item Details">
      <ChatItemTextContainer2 />
    </div>
  );
}

function Call5() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Call">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Call">
          <path d={svgPaths.p1f19c2b0} fill="var(--fill-0, #CED0CE)" id="Shape" />
        </g>
      </svg>
    </div>
  );
}

function CallButton2() {
  return (
    <div className="bg-white content-stretch flex items-center p-[4px] relative rounded-[8px] shrink-0" data-name="Call button">
      <Call5 />
    </div>
  );
}

function CallRecord2() {
  return (
    <div className="bg-white content-stretch flex gap-[8px] items-start px-[12px] py-[16px] relative shrink-0 w-[297px]" data-name="Call record">
      <div aria-hidden="true" className="absolute border-[#e7e9e8] border-b border-solid inset-0 pointer-events-none" />
      <Avatars2 />
      <ChatItemDetails1 />
      <CallButton2 />
    </div>
  );
}

function Icons8MissedCall1() {
  return (
    <div className="absolute left-px size-[12px] top-px" data-name="icons8-missed-call 1">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="icons8-missed-call 1">
          <path d={svgPaths.p3c155c80} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Call6() {
  return (
    <div className="-translate-y-1/2 absolute aspect-[16/16] bg-[#ef5766] border border-solid border-white left-1/2 overflow-clip right-0 rounded-[8px] top-[calc(50%+8px)]" data-name="Call">
      <Icons8MissedCall1 />
    </div>
  );
}

function Avatars3() {
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
      <Call6 />
    </div>
  );
}

function Headset3() {
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

function ChatItemStatusContainer3() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-name="Chat Item Status Container">
      <div className="flex items-center justify-center relative shrink-0">
        <div className="-scale-y-100 flex-none rotate-180">
          <Headset3 />
        </div>
      </div>
      <p className="font-['Inter:regular',sans-serif] leading-[16px] not-italic relative shrink-0 text-[#848a86] text-[12px] text-right">Dylan</p>
    </div>
  );
}

function ChatItemName3() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[10px] items-center min-h-px min-w-px relative" data-name="Chat Item Name">
      <p className="font-['Inter:bold',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#505451] text-[14px]">Sofia V</p>
      <div className="flex h-[6px] items-center justify-center relative shrink-0 w-0" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "18" } as React.CSSProperties}>
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
      <ChatItemStatusContainer3 />
    </div>
  );
}

function ChatItemNameContainer3() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full" data-name="Chat Item Name Container">
      <ChatItemName3 />
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex font-['Inter:regular',sans-serif] gap-[2px] items-center leading-[16px] not-italic relative shrink-0 text-[12px] w-full" data-name="Frame">
      <p className="flex-[1_0_0] min-h-px min-w-px overflow-hidden relative text-[#505451] text-ellipsis whitespace-nowrap">Missed call</p>
      <p className="relative shrink-0 text-[#848a86] text-right">3:30 PM</p>
    </div>
  );
}

function ChatItemTextContainer3() {
  return (
    <div className="content-stretch flex flex-col gap-[2px] items-start relative shrink-0 w-full" data-name="Chat Item Text Container">
      <ChatItemNameContainer3 />
      <Frame3 />
    </div>
  );
}

function ChatItemDetails2() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px min-w-px relative" data-name="Chat Item Details">
      <ChatItemTextContainer3 />
    </div>
  );
}

function Call7() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Call">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Call">
          <path d={svgPaths.p1f19c2b0} fill="var(--fill-0, #CED0CE)" id="Shape" />
        </g>
      </svg>
    </div>
  );
}

function CallButton3() {
  return (
    <div className="bg-white content-stretch flex items-center p-[4px] relative rounded-[8px] shrink-0" data-name="Call button">
      <Call7 />
    </div>
  );
}

function CallRecord3() {
  return (
    <div className="bg-white content-stretch flex gap-[8px] items-start px-[12px] py-[16px] relative shrink-0 w-[297px]" data-name="Call record">
      <div aria-hidden="true" className="absolute border-[#e7e9e8] border-b border-solid inset-0 pointer-events-none" />
      <Avatars3 />
      <ChatItemDetails2 />
      <CallButton3 />
    </div>
  );
}

function CallInbound() {
  return (
    <div className="absolute left-px size-[12px] top-[2px]" data-name="Call Inbound">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Call Inbound">
          <path d={svgPaths.p21a43400} fill="var(--fill-0, white)" id="Shape" />
        </g>
      </svg>
    </div>
  );
}

function Call8() {
  return (
    <div className="-translate-y-1/2 absolute aspect-[16/16] bg-[#23a455] border border-solid border-white left-1/2 overflow-clip right-0 rounded-[8px] top-[calc(50%+8px)]" data-name="Call">
      <CallInbound />
    </div>
  );
}

function Avatars4() {
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
      <Call8 />
    </div>
  );
}

function Headset4() {
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

function ChatItemStatusContainer4() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-name="Chat Item Status Container">
      <div className="flex items-center justify-center relative shrink-0">
        <div className="-scale-y-100 flex-none rotate-180">
          <Headset4 />
        </div>
      </div>
      <p className="font-['Inter:regular',sans-serif] leading-[16px] not-italic relative shrink-0 text-[#848a86] text-[12px] text-right">Nia</p>
    </div>
  );
}

function ChatItemName4() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[10px] items-center min-h-px min-w-px relative" data-name="Chat Item Name">
      <p className="font-['Inter:bold',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#505451] text-[14px]">Liam Nilson</p>
      <div className="flex h-[6px] items-center justify-center relative shrink-0 w-0" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "18" } as React.CSSProperties}>
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
      <ChatItemStatusContainer4 />
    </div>
  );
}

function ChatItemNameContainer4() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full" data-name="Chat Item Name Container">
      <ChatItemName4 />
    </div>
  );
}

function Frame4() {
  return (
    <div className="content-stretch flex font-['Inter:regular',sans-serif] gap-[2px] items-center leading-[16px] not-italic relative shrink-0 text-[12px] w-full" data-name="Frame">
      <p className="flex-[1_0_0] min-h-px min-w-px overflow-hidden relative text-[#505451] text-ellipsis whitespace-nowrap">Inbound call</p>
      <p className="relative shrink-0 text-[#848a86] text-right">2:00 PM</p>
    </div>
  );
}

function ChatItemTextContainer4() {
  return (
    <div className="content-stretch flex flex-col gap-[2px] items-start relative shrink-0 w-full" data-name="Chat Item Text Container">
      <ChatItemNameContainer4 />
      <Frame4 />
    </div>
  );
}

function ChatItemDetails3() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px min-w-px relative" data-name="Chat Item Details">
      <ChatItemTextContainer4 />
    </div>
  );
}

function Call9() {
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

function CallButton4() {
  return (
    <div className="content-stretch flex items-center p-[4px] relative rounded-[8px] shrink-0" data-name="Call button">
      <Call9 />
    </div>
  );
}

function CallRecord4() {
  return (
    <div className="bg-white content-stretch flex gap-[8px] items-start px-[12px] py-[16px] relative shrink-0 w-[297px]" data-name="Call record">
      <div aria-hidden="true" className="absolute border-[#e7e9e8] border-b border-solid inset-0 pointer-events-none" />
      <Avatars4 />
      <ChatItemDetails3 />
      <CallButton4 />
    </div>
  );
}

function Icons8MissedCall2() {
  return (
    <div className="absolute left-px size-[12px] top-px" data-name="icons8-missed-call 1">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="icons8-missed-call 1">
          <path d={svgPaths.p3c155c80} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Call10() {
  return (
    <div className="-translate-y-1/2 absolute aspect-[16/16] bg-[#ef5766] border border-solid border-white left-1/2 overflow-clip right-0 rounded-[8px] top-[calc(50%+8px)]" data-name="Call">
      <Icons8MissedCall2 />
    </div>
  );
}

function Avatars5() {
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
      <Call10 />
    </div>
  );
}

function Headset5() {
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

function ChatItemStatusContainer5() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-name="Chat Item Status Container">
      <div className="flex items-center justify-center relative shrink-0">
        <div className="-scale-y-100 flex-none rotate-180">
          <Headset5 />
        </div>
      </div>
      <p className="font-['Inter:regular',sans-serif] leading-[16px] not-italic relative shrink-0 text-[#848a86] text-[12px] text-right">Omar</p>
    </div>
  );
}

function ChatItemName5() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[10px] items-center min-h-px min-w-px relative" data-name="Chat Item Name">
      <p className="font-['Inter:bold',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#505451] text-[14px]">Zara Zara</p>
      <div className="flex h-[6px] items-center justify-center relative shrink-0 w-0" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "18" } as React.CSSProperties}>
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
      <ChatItemStatusContainer5 />
    </div>
  );
}

function ChatItemNameContainer5() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full" data-name="Chat Item Name Container">
      <ChatItemName5 />
    </div>
  );
}

function Frame5() {
  return (
    <div className="content-stretch flex font-['Inter:regular',sans-serif] gap-[2px] items-center leading-[16px] not-italic relative shrink-0 text-[12px] w-full" data-name="Frame">
      <p className="flex-[1_0_0] min-h-px min-w-px overflow-hidden relative text-[#505451] text-ellipsis whitespace-nowrap">Missed call</p>
      <p className="relative shrink-0 text-[#848a86] text-right">4:20 PM</p>
    </div>
  );
}

function ChatItemTextContainer5() {
  return (
    <div className="content-stretch flex flex-col gap-[2px] items-start relative shrink-0 w-full" data-name="Chat Item Text Container">
      <ChatItemNameContainer5 />
      <Frame5 />
    </div>
  );
}

function ChatItemDetails4() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px min-w-px relative" data-name="Chat Item Details">
      <ChatItemTextContainer5 />
    </div>
  );
}

function Call11() {
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

function CallButton5() {
  return (
    <div className="content-stretch flex items-center p-[4px] relative rounded-[8px] shrink-0" data-name="Call button">
      <Call11 />
    </div>
  );
}

function CallRecord5() {
  return (
    <div className="bg-white content-stretch flex gap-[8px] items-start px-[12px] py-[16px] relative shrink-0 w-[297px]" data-name="Call record">
      <div aria-hidden="true" className="absolute border-[#e7e9e8] border-b border-solid inset-0 pointer-events-none" />
      <Avatars5 />
      <ChatItemDetails4 />
      <CallButton5 />
    </div>
  );
}

function CallOutbound2() {
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

function Call12() {
  return (
    <div className="-translate-y-1/2 absolute aspect-[16/16] bg-[#23a455] border border-solid border-white left-1/2 overflow-clip right-0 rounded-[8px] top-[calc(50%+8px)]" data-name="Call">
      <CallOutbound2 />
    </div>
  );
}

function Avatars6() {
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
      <Call12 />
    </div>
  );
}

function Headset6() {
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

function ChatItemStatusContainer6() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-name="Chat Item Status Container">
      <div className="flex items-center justify-center relative shrink-0">
        <div className="-scale-y-100 flex-none rotate-180">
          <Headset6 />
        </div>
      </div>
      <p className="font-['Inter:regular',sans-serif] leading-[16px] not-italic relative shrink-0 text-[#848a86] text-[12px] text-right">Tara</p>
    </div>
  );
}

function ChatItemName6() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[10px] items-center min-h-px min-w-px relative" data-name="Chat Item Name">
      <p className="font-['Inter:bold',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#505451] text-[14px]">Eli Goodlink</p>
      <div className="flex h-[6px] items-center justify-center relative shrink-0 w-0" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "18" } as React.CSSProperties}>
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
      <ChatItemStatusContainer6 />
    </div>
  );
}

function ChatItemNameContainer6() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full" data-name="Chat Item Name Container">
      <ChatItemName6 />
    </div>
  );
}

function Frame6() {
  return (
    <div className="content-stretch flex font-['Inter:regular',sans-serif] gap-[2px] items-center leading-[16px] not-italic relative shrink-0 text-[12px] w-full" data-name="Frame">
      <p className="flex-[1_0_0] min-h-px min-w-px overflow-hidden relative text-[#505451] text-ellipsis whitespace-nowrap">Outbound call</p>
      <p className="relative shrink-0 text-[#848a86] text-right">11:00 AM</p>
    </div>
  );
}

function ChatItemTextContainer6() {
  return (
    <div className="content-stretch flex flex-col gap-[2px] items-start relative shrink-0 w-full" data-name="Chat Item Text Container">
      <ChatItemNameContainer6 />
      <Frame6 />
    </div>
  );
}

function ChatItemDetails5() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px min-w-px relative" data-name="Chat Item Details">
      <ChatItemTextContainer6 />
    </div>
  );
}

function Call13() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Call">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Call">
          <path d={svgPaths.p1f19c2b0} fill="var(--fill-0, #CED0CE)" id="Shape" />
        </g>
      </svg>
    </div>
  );
}

function CallButton6() {
  return (
    <div className="bg-white content-stretch flex items-center p-[4px] relative rounded-[8px] shrink-0" data-name="Call button">
      <Call13 />
    </div>
  );
}

function CallRecord6() {
  return (
    <div className="bg-white content-stretch flex gap-[8px] items-start px-[12px] py-[16px] relative shrink-0 w-[297px]" data-name="Call record">
      <div aria-hidden="true" className="absolute border-[#e7e9e8] border-b border-solid inset-0 pointer-events-none" />
      <Avatars6 />
      <ChatItemDetails5 />
      <CallButton6 />
    </div>
  );
}

function Icons8MissedCall3() {
  return (
    <div className="absolute left-px size-[12px] top-px" data-name="icons8-missed-call 1">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="icons8-missed-call 1">
          <path d={svgPaths.p3c155c80} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Call14() {
  return (
    <div className="-translate-y-1/2 absolute aspect-[16/16] bg-[#ef5766] border border-solid border-white left-1/2 overflow-clip right-0 rounded-[8px] top-[calc(50%+8px)]" data-name="Call">
      <Icons8MissedCall3 />
    </div>
  );
}

function Avatars7() {
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
      <Call14 />
    </div>
  );
}

function Headset7() {
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

function ChatItemStatusContainer7() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-name="Chat Item Status Container">
      <div className="flex items-center justify-center relative shrink-0">
        <div className="-scale-y-100 flex-none rotate-180">
          <Headset7 />
        </div>
      </div>
      <p className="font-['Inter:regular',sans-serif] leading-[16px] not-italic relative shrink-0 text-[#848a86] text-[12px] text-right">Becca</p>
    </div>
  );
}

function ChatItemName7() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[10px] items-center min-h-px min-w-px relative" data-name="Chat Item Name">
      <p className="font-['Inter:bold',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#505451] text-[14px]">+91876543210</p>
      <div className="flex h-[6px] items-center justify-center relative shrink-0 w-0" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "18" } as React.CSSProperties}>
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
      <ChatItemStatusContainer7 />
    </div>
  );
}

function ChatItemNameContainer7() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full" data-name="Chat Item Name Container">
      <ChatItemName7 />
    </div>
  );
}

function Frame7() {
  return (
    <div className="content-stretch flex font-['Inter:regular',sans-serif] gap-[2px] items-center leading-[16px] not-italic relative shrink-0 text-[12px] w-full" data-name="Frame">
      <p className="flex-[1_0_0] min-h-px min-w-px overflow-hidden relative text-[#505451] text-ellipsis whitespace-nowrap">Outbound call</p>
      <p className="relative shrink-0 text-[#848a86] text-right">5:50 PM</p>
    </div>
  );
}

function ChatItemTextContainer7() {
  return (
    <div className="content-stretch flex flex-col gap-[2px] items-start relative shrink-0 w-full" data-name="Chat Item Text Container">
      <ChatItemNameContainer7 />
      <Frame7 />
    </div>
  );
}

function ChatItemDetails6() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px min-w-px relative" data-name="Chat Item Details">
      <ChatItemTextContainer7 />
    </div>
  );
}

function Call15() {
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

function CallButton7() {
  return (
    <div className="content-stretch flex items-center p-[4px] relative rounded-[8px] shrink-0" data-name="Call button">
      <Call15 />
    </div>
  );
}

function CallRecord7() {
  return (
    <div className="bg-white content-stretch flex gap-[8px] items-start px-[12px] py-[16px] relative shrink-0 w-[297px]" data-name="Call record">
      <div aria-hidden="true" className="absolute border-[#e7e9e8] border-b border-solid inset-0 pointer-events-none" />
      <Avatars7 />
      <ChatItemDetails6 />
      <CallButton7 />
    </div>
  );
}

function CallInbound1() {
  return (
    <div className="absolute left-px size-[12px] top-[2px]" data-name="Call Inbound">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Call Inbound">
          <path d={svgPaths.p21a43400} fill="var(--fill-0, white)" id="Shape" />
        </g>
      </svg>
    </div>
  );
}

function Call16() {
  return (
    <div className="-translate-y-1/2 absolute aspect-[16/16] bg-[#23a455] border border-solid border-white left-1/2 overflow-clip right-0 rounded-[8px] top-[calc(50%+8px)]" data-name="Call">
      <CallInbound1 />
    </div>
  );
}

function Avatars8() {
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
      <Call16 />
    </div>
  );
}

function Headset8() {
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

function ChatItemStatusContainer8() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-name="Chat Item Status Container">
      <div className="flex items-center justify-center relative shrink-0">
        <div className="-scale-y-100 flex-none rotate-180">
          <Headset8 />
        </div>
      </div>
      <p className="font-['Inter:regular',sans-serif] leading-[16px] not-italic relative shrink-0 text-[#848a86] text-[12px] text-right">Chloe</p>
    </div>
  );
}

function ChatItemName8() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[10px] items-center min-h-px min-w-px relative" data-name="Chat Item Name">
      <p className="font-['Inter:bold',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#505451] text-[14px]">Noah</p>
      <div className="flex h-[6px] items-center justify-center relative shrink-0 w-0" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "18" } as React.CSSProperties}>
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
      <ChatItemStatusContainer8 />
    </div>
  );
}

function ChatItemNameContainer8() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full" data-name="Chat Item Name Container">
      <ChatItemName8 />
    </div>
  );
}

function Frame8() {
  return (
    <div className="content-stretch flex font-['Inter:regular',sans-serif] gap-[2px] items-center leading-[16px] not-italic relative shrink-0 text-[12px] w-full" data-name="Frame">
      <p className="flex-[1_0_0] min-h-px min-w-px overflow-hidden relative text-[#505451] text-ellipsis whitespace-nowrap">Inbound call</p>
      <p className="relative shrink-0 text-[#848a86] text-right">6:30 PM</p>
    </div>
  );
}

function ChatItemTextContainer8() {
  return (
    <div className="content-stretch flex flex-col gap-[2px] items-start relative shrink-0 w-full" data-name="Chat Item Text Container">
      <ChatItemNameContainer8 />
      <Frame8 />
    </div>
  );
}

function ChatItemDetails7() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px min-w-px relative" data-name="Chat Item Details">
      <ChatItemTextContainer8 />
    </div>
  );
}

function Call17() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Call">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Call">
          <path d={svgPaths.p1f19c2b0} fill="var(--fill-0, #CED0CE)" id="Shape" />
        </g>
      </svg>
    </div>
  );
}

function CallButton8() {
  return (
    <div className="bg-white content-stretch flex items-center p-[4px] relative rounded-[8px] shrink-0" data-name="Call button">
      <Call17 />
    </div>
  );
}

function CallRecord8() {
  return (
    <div className="bg-white content-stretch flex gap-[8px] items-start px-[12px] py-[16px] relative shrink-0 w-[297px]" data-name="Call record">
      <div aria-hidden="true" className="absolute border-[#e7e9e8] border-b border-solid inset-0 pointer-events-none" />
      <Avatars8 />
      <ChatItemDetails7 />
      <CallButton8 />
    </div>
  );
}

function Icons8MissedCall4() {
  return (
    <div className="absolute left-px size-[12px] top-px" data-name="icons8-missed-call 1">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="icons8-missed-call 1">
          <path d={svgPaths.p3c155c80} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Call18() {
  return (
    <div className="-translate-y-1/2 absolute aspect-[16/16] bg-[#ef5766] border border-solid border-white left-1/2 overflow-clip right-0 rounded-[8px] top-[calc(50%+8px)]" data-name="Call">
      <Icons8MissedCall4 />
    </div>
  );
}

function Avatars9() {
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
      <Call18 />
    </div>
  );
}

function Headset9() {
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

function ChatItemStatusContainer9() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-name="Chat Item Status Container">
      <div className="flex items-center justify-center relative shrink-0">
        <div className="-scale-y-100 flex-none rotate-180">
          <Headset9 />
        </div>
      </div>
      <p className="font-['Inter:regular',sans-serif] leading-[16px] not-italic relative shrink-0 text-[#848a86] text-[12px] text-right">Dylan</p>
    </div>
  );
}

function ChatItemName9() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[10px] items-center min-h-px min-w-px relative" data-name="Chat Item Name">
      <p className="font-['Inter:bold',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#505451] text-[14px]">Sofia</p>
      <div className="flex h-[6px] items-center justify-center relative shrink-0 w-0" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "18" } as React.CSSProperties}>
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
      <ChatItemStatusContainer9 />
    </div>
  );
}

function ChatItemNameContainer9() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full" data-name="Chat Item Name Container">
      <ChatItemName9 />
    </div>
  );
}

function Frame9() {
  return (
    <div className="content-stretch flex font-['Inter:regular',sans-serif] gap-[2px] items-center leading-[16px] not-italic relative shrink-0 text-[12px] w-full" data-name="Frame">
      <p className="flex-[1_0_0] min-h-px min-w-px overflow-hidden relative text-[#505451] text-ellipsis whitespace-nowrap">Missed call</p>
      <p className="relative shrink-0 text-[#848a86] text-right">3:30 PM</p>
    </div>
  );
}

function ChatItemTextContainer9() {
  return (
    <div className="content-stretch flex flex-col gap-[2px] items-start relative shrink-0 w-full" data-name="Chat Item Text Container">
      <ChatItemNameContainer9 />
      <Frame9 />
    </div>
  );
}

function ChatItemDetails8() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px min-w-px relative" data-name="Chat Item Details">
      <ChatItemTextContainer9 />
    </div>
  );
}

function Call19() {
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

function CallButton9() {
  return (
    <div className="content-stretch flex items-center p-[4px] relative rounded-[8px] shrink-0" data-name="Call button">
      <Call19 />
    </div>
  );
}

function CallRecord9() {
  return (
    <div className="bg-white content-stretch flex gap-[8px] items-start px-[12px] py-[16px] relative shrink-0 w-[297px]" data-name="Call record">
      <div aria-hidden="true" className="absolute border-[#e7e9e8] border-b border-solid inset-0 pointer-events-none" />
      <Avatars9 />
      <ChatItemDetails8 />
      <CallButton9 />
    </div>
  );
}

export default function ChatListContainer() {
  return (
    <div className="content-stretch flex flex-col items-start relative size-full" data-name="Chat List Container">
      <CallRecord />
      <CallRecord1 />
      <CallRecord2 />
      <CallRecord3 />
      <CallRecord4 />
      <CallRecord5 />
      <CallRecord6 />
      <CallRecord7 />
      <CallRecord8 />
      <CallRecord9 />
      <div className="flex items-center justify-center relative shrink-0 w-full">
        <div className="flex-none rotate-180 w-full">
          <div className="h-0 relative w-full" data-name="Line">
            <div className="absolute inset-[-1px_0_0_0]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 297 1">
                <line id="Line" stroke="var(--stroke-0, #F4F1ED)" x2="297" y1="0.5" y2="0.5" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center relative shrink-0 w-full">
        <div className="flex-none rotate-180 w-full">
          <div className="h-0 relative w-full" data-name="Line">
            <div className="absolute inset-[-1px_0_0_0]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 297 1">
                <line id="Line" stroke="var(--stroke-0, #F4F1ED)" x2="297" y1="0.5" y2="0.5" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center relative shrink-0 w-full">
        <div className="flex-none rotate-180 w-full">
          <div className="h-0 relative w-full" data-name="Line">
            <div className="absolute inset-[-1px_0_0_0]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 297 1">
                <line id="Line" stroke="var(--stroke-0, #F4F1ED)" x2="297" y1="0.5" y2="0.5" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center relative shrink-0 w-full">
        <div className="flex-none rotate-180 w-full">
          <div className="h-0 relative w-full" data-name="Line">
            <div className="absolute inset-[-1px_0_0_0]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 297 1">
                <line id="Line" stroke="var(--stroke-0, #F4F1ED)" x2="297" y1="0.5" y2="0.5" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center relative shrink-0 w-full">
        <div className="flex-none rotate-180 w-full">
          <div className="h-0 relative w-full" data-name="Line">
            <div className="absolute inset-[-1px_0_0_0]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 297 1">
                <line id="Line" stroke="var(--stroke-0, #F4F1ED)" x2="297" y1="0.5" y2="0.5" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
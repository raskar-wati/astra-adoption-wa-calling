import svgPaths from "./svg-x39h9bo7e8";

function Frame() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Frame">
          <path d={svgPaths.p405f80} id="Vector" stroke="var(--stroke-0, #353735)" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M4.66667 7.33333H11.3333" id="Vector_2" stroke="var(--stroke-0, #353735)" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M4.66667 10H8.66667" id="Vector_3" stroke="var(--stroke-0, #353735)" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M4.66667 4.66667H10" id="Vector_4" stroke="var(--stroke-0, #353735)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function Frame5() {
  return (
    <div className="bg-white content-stretch flex gap-[4px] h-full items-center overflow-clip px-[8px] py-[12px] relative shrink-0">
      <Frame />
      <p className="font-['Inter:medium',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#353735] text-[14px]">Messages</p>
    </div>
  );
}

function AstraIntelligence() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Astra Intelligence">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Astra Intelligence">
          <path d={svgPaths.p2ae30d00} fill="url(#paint0_linear_10060_938)" id="Union" />
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_10060_938" x1="20.002" x2="-10.0991" y1="-8.7575" y2="4.55813">
            <stop stopColor="#4FC3FF" />
            <stop offset="1" stopColor="#00E785" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function Frame4() {
  return (
    <div className="bg-white relative shrink-0">
      <div className="content-stretch flex gap-[4px] items-center overflow-clip px-[8px] py-[12px] relative rounded-[inherit]">
        <AstraIntelligence />
        <p className="font-['Inter:medium',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#23a455] text-[14px]">Summary</p>
      </div>
      <div aria-hidden="true" className="absolute border-[#23a455] border-b-3 border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Frame1() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Frame">
          <path d={svgPaths.p14020580} id="Vector" stroke="var(--stroke-0, #353735)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.833333" />
          <path d={svgPaths.p28fb3b80} id="Vector_2" stroke="var(--stroke-0, #353735)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.833333" />
          <path d={svgPaths.p4448ef0} id="Vector_3" stroke="var(--stroke-0, #353735)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.833333" />
        </g>
      </svg>
    </div>
  );
}

function Frame6() {
  return (
    <div className="bg-white content-stretch flex gap-[4px] h-full items-center overflow-clip px-[8px] py-[12px] relative shrink-0">
      <Frame1 />
      <p className="font-['Inter:medium',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#353735] text-[14px]">Automations</p>
    </div>
  );
}

function Frame3() {
  return <div className="flex-[1_0_0] h-[2px] min-h-px min-w-px" />;
}

export default function Frame2() {
  return (
    <div className="bg-white relative size-full">
      <div className="content-stretch flex gap-[4px] items-center justify-end px-[12px] relative size-full">
        <div className="flex flex-row items-center self-stretch">
          <Frame5 />
        </div>
        <Frame4 />
        <div className="flex flex-row items-center self-stretch">
          <Frame6 />
        </div>
        <Frame3 />
      </div>
      <div aria-hidden="true" className="absolute border-[#f6f7f6] border-b border-solid inset-0 pointer-events-none" />
    </div>
  );
}
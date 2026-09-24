import svgPaths from "./svg-ubbddr1h3d";

function Frame() {
  return (
    <div className="bg-[#f6f7f6] content-stretch flex items-center p-[8px] relative rounded-[99px] shrink-0" data-name="Frame">
      <div aria-hidden="true" className="absolute border border-[#f6f7f6] border-solid inset-0 pointer-events-none rounded-[99px]" />
      <div className="overflow-clip relative shrink-0 size-[12px]" data-name="Call Outbound">
        <div className="-translate-x-1/2 -translate-y-1/2 absolute h-[8.996px] left-1/2 top-1/2 w-[8.997px]" data-name="Shape">
          <svg className="absolute block inset-0" fill="none" preserveAspectRatio="none" viewBox="0 0 8.99726 8.99613">
            <path d={svgPaths.p119bd880} fill="var(--fill-0, #505451)" id="Shape" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-center min-h-px min-w-px relative" data-name="Frame">
      <p className="font-['Inter:medium',sans-serif] leading-[16px] not-italic relative shrink-0 text-[#353735] text-[12px]">Outbound call</p>
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full" data-name="Frame">
      <Frame3 />
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-center min-h-px min-w-px relative" data-name="Frame">
      <Frame2 />
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[#505451] text-[10px] w-full whitespace-pre-wrap">13 mins</p>
    </div>
  );
}

function Frame9() {
  return (
    <div className="content-stretch flex gap-[4px] items-start relative shrink-0 w-full">
      <Frame />
      <Frame1 />
    </div>
  );
}

function Play() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Play">
      <svg className="absolute block inset-0" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Play">
          <path d={svgPaths.pba36d00} fill="var(--fill-0, #505451)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame5() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0 w-[188px]">
      <Play />
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[#353735] text-[14px]">0:00 / 00:37</p>
      <div className="bg-[#b7b9b7] flex-[1_0_0] min-h-px min-w-px relative rounded-[99px]" data-name="Progress Bar">
        <div className="overflow-clip rounded-[inherit] size-full">
          <div className="content-stretch flex items-start pr-[80px] relative w-full">
            <div className="bg-[#505451] h-[6px] rounded-[4px] shrink-0 w-px" data-name="Progress" />
          </div>
        </div>
      </div>
    </div>
  );
}

function Speaker() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Speaker">
      <svg className="absolute block inset-0" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Speaker">
          <path d={svgPaths.p27545a70} fill="var(--fill-0, #505451)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function MenuVertical() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Menu Vertical">
      <svg className="absolute block inset-0" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Menu Vertical">
          <path d={svgPaths.p17dfcc00} fill="var(--fill-0, #848A86)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame6() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <Speaker />
      <MenuVertical />
    </div>
  );
}

function Frame4() {
  return (
    <div className="bg-[#f6f7f6] content-stretch flex gap-[10px] items-center overflow-clip px-[16px] py-[12px] relative rounded-[100px] shrink-0">
      <Frame5 />
      <Frame6 />
    </div>
  );
}

function Frame7() {
  return (
    <div className="content-stretch flex gap-[4px] items-center p-[4px] relative shrink-0">
      <div className="relative shrink-0 size-[16px]" data-name="file">
        <div className="absolute inset-[10%_17.5%]" data-name="Icon">
          <div className="absolute inset-[-3.91%_-4.81%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.4002 13.8">
              <path d={svgPaths.pd54a40} id="Icon" stroke="var(--stroke-0, #23A455)" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[#23a455] text-[12px]">{`Generate Summary `}</p>
    </div>
  );
}

function Frame8() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <Frame7 />
      <div className="overflow-clip relative shrink-0 size-[16px]" data-name="settings">
        <div className="absolute inset-[37.5%]" data-name="Vector">
          <div className="absolute inset-[-12.5%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5 5">
              <path d={svgPaths.p312e4100} id="Vector" stroke="var(--stroke-0, #848A86)" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
        <div className="absolute inset-[4.17%]" data-name="Vector">
          <div className="absolute inset-[-3.41%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.6667 15.6667">
              <path d={svgPaths.p228c2500} id="Vector" stroke="var(--stroke-0, #848A86)" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SystemMessage() {
  return (
    <div className="bg-[#dcf0e4] content-stretch flex flex-col gap-[4px] items-start p-[8px] relative rounded-bl-[12px] rounded-br-[12px] rounded-tl-[12px] size-full" data-name="System message">
      <Frame9 />
      <Frame4 />
      <Frame8 />
    </div>
  );
}
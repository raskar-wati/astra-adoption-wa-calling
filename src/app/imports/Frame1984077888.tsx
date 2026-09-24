import svgPaths from "./svg-kwbeuflmv3";

function Frame1() {
  return (
    <div className="content-stretch flex items-start pb-[8px] relative shrink-0 w-full">
      <p className="flex-[1_0_0] font-['Inter:regular',sans-serif] leading-[16px] min-h-px min-w-px not-italic relative text-[#353735] text-[12px] whitespace-pre-wrap">Log AI summaries and action items from your chats.</p>
    </div>
  );
}

function Frame() {
  return (
    <div className="bg-gradient-to-b content-stretch flex from-[#173da6] h-[32px] items-center overflow-clip px-[8px] py-[4px] relative rounded-[8px] shrink-0 to-[#091840] to-[200%]">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[12px] text-white">Generate Summary</p>
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-h-px min-w-px overflow-clip py-[4px] relative">
      <p className="font-['Inter:semibold',sans-serif] leading-[22px] min-w-full not-italic relative shrink-0 text-[#1b1d1c] text-[16px] w-[min-content] whitespace-pre-wrap">Transcription Summary</p>
      <Frame1 />
      <Frame />
    </div>
  );
}

function AstraIntelligence() {
  return (
    <div className="relative size-[16px]" data-name="Astra Intelligence">
      <svg className="absolute block inset-0" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Astra Intelligence">
          <path d={svgPaths.p2ae30d00} fill="url(#paint0_linear_10093_55)" id="Union" />
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_10093_55" x1="20.002" x2="-10.0991" y1="-8.7575" y2="4.55813">
            <stop stopColor="#4FC3FF" />
            <stop offset="1" stopColor="#00E785" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function Frame7() {
  return <div className="h-[4px] opacity-40 shrink-0 w-[38px]" style={{ backgroundImage: "linear-gradient(193.385deg, rgb(79, 195, 255) 46.18%, rgb(0, 231, 133) 132.06%)" }} />;
}

function Frame8() {
  return (
    <div className="content-stretch flex gap-[4px] items-center overflow-clip py-[2px] relative shrink-0">
      <div className="flex items-center justify-center relative shrink-0 size-[17.178px]" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "18" } as React.CSSProperties}>
        <div className="flex-none rotate-[4.39deg]">
          <AstraIntelligence />
        </div>
      </div>
      <Frame7 />
    </div>
  );
}

function Frame5() {
  return <div className="h-[8px] opacity-10 shrink-0 w-[167px]" style={{ backgroundImage: "linear-gradient(186.181deg, rgb(79, 195, 255) 46.18%, rgb(0, 231, 133) 132.06%)" }} />;
}

function Frame6() {
  return <div className="h-[8px] opacity-10 shrink-0 w-[101px]" style={{ backgroundImage: "linear-gradient(190.152deg, rgb(79, 195, 255) 46.18%, rgb(0, 231, 133) 132.06%)" }} />;
}

function Frame10() {
  return <div className="h-[4px] opacity-10 shrink-0 w-[63px]" style={{ backgroundImage: "linear-gradient(188.168deg, rgb(79, 195, 255) 46.18%, rgb(0, 231, 133) 132.06%)" }} />;
}

function Frame4() {
  return (
    <div className="bg-white relative rounded-[8px] w-[200px]">
      <div className="content-stretch flex flex-col gap-[8px] items-start overflow-clip p-[12px] relative rounded-[inherit] w-full">
        <Frame8 />
        <Frame5 />
        <Frame6 />
        <Frame10 />
      </div>
      <div aria-hidden="true" className="absolute border border-solid border-white inset-[-1px] pointer-events-none rounded-[9px] shadow-[0px_8px_10px_-6px_rgba(35,164,85,0.1),0px_20px_25px_-5px_rgba(35,164,85,0.1)]" />
    </div>
  );
}

function Frame9() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center overflow-clip p-[8px] relative shrink-0">
      <div className="flex h-[104.229px] items-center justify-center relative shrink-0 w-[206.241px]" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "18" } as React.CSSProperties}>
        <div className="flex-none rotate-[-4.39deg]">
          <Frame4 />
        </div>
      </div>
    </div>
  );
}

export default function Frame3() {
  return (
    <div className="bg-[#ebf7f0] content-stretch flex gap-[16px] items-center overflow-clip px-[16px] py-[12px] relative rounded-[12px] size-full">
      <Frame2 />
      <Frame9 />
    </div>
  );
}
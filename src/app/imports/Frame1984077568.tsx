import svgPaths from "./svg-z6zwjmgta2";

function AstraIntelligence() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Astra Intelligence">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Astra Intelligence">
          <path d={svgPaths.p2ae30d00} fill="url(#paint0_linear_10062_135)" id="Union" />
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_10062_135" x1="20.002" x2="-10.0991" y1="-8.7575" y2="4.55813">
            <stop stopColor="#4FC3FF" />
            <stop offset="1" stopColor="#00E785" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

export default function Frame() {
  return (
    <div className="bg-white content-stretch flex gap-[4px] items-center px-[8px] py-[12px] relative size-full">
      <AstraIntelligence />
      <p className="font-['Inter:medium',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#353735] text-[14px]">Summary</p>
    </div>
  );
}
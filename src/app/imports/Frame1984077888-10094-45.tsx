import imgImage1 from "figma:asset/fb0a213243aaabb6b8bb2f72013bbae83ce5dc66.png";

function Frame1() {
  return (
    <div className="content-stretch flex items-start pb-[8px] relative shrink-0 w-full">
      <p className="flex-[1_0_0] font-['Inter:regular',sans-serif] leading-[16px] min-h-px min-w-px not-italic relative text-[#353735] text-[12px] whitespace-pre-wrap">
        Log AI summaries and action items from your calls.
      </p>
    </div>
  );
}

function Frame() {
  return (
    <div className="bg-gradient-to-b content-stretch flex from-[#173da6] h-[32px] items-center overflow-clip px-[8px] py-[4px] relative rounded-[8px] shrink-0 to-[#091840] to-[200%]">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[12px] text-white">
        Generate Summary
      </p>
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-h-px min-w-px overflow-clip py-[4px] relative">
      <p className="font-['Inter:semibold',sans-serif] leading-[22px] min-w-full not-italic relative shrink-0 text-[#1b1d1c] text-[16px] w-[min-content] whitespace-pre-wrap">
        Transcription Summary
      </p>
      <Frame1 />
      <Frame />
    </div>
  );
}

export default function Frame3() {
  return (
    <div className="bg-[#ebf7f0] content-stretch flex gap-[16px] items-center overflow-clip px-[16px] py-[12px] relative rounded-[12px] size-full">
      <Frame2 />
      <div
        className="h-[93px] relative shrink-0 w-[173px]"
        data-name="image 1"
      >
        <img
          alt=""
          className="absolute inset-0 max-w-none object-cover pointer-events-none size-full"
          src={imgImage1}
        />
      </div>
    </div>
  );
}
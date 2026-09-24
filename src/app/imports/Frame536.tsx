import svgPaths from "./svg-ezcdxy8puc";
import { useState } from "react";

function Frame() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Frame">
          <path d={svgPaths.p3e746280} id="Vector" stroke="var(--stroke-0, #848A86)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d={svgPaths.p2fad1600} id="Vector_2" stroke="var(--stroke-0, #848A86)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d="M2 12.6667H6" id="Vector_3" stroke="var(--stroke-0, #848A86)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d="M2 3.33333H14" id="Vector_4" stroke="var(--stroke-0, #848A86)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
        </g>
      </svg>
    </div>
  );
}

function Text() {
  return (
    <div className="h-[14px] relative shrink-0 w-full" data-name="Text">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[14px] left-0 not-italic text-[#505451] text-[10.5px] top-0 tracking-[0.0923px]">{`7/10/2025 • 11:11 `}</p>
    </div>
  );
}

function Frame11() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start justify-center min-h-px min-w-px overflow-clip py-[4px] relative">
      <p className="font-['Inter:medium',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#505451] text-[14px]">{`Conversation Summary  – The Wellness Co.`}</p>
      <Text />
    </div>
  );
}

function Chevron() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Chevron">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Chevron">
          <path d={svgPaths.p3244c1f8} fill="var(--fill-0, #505451)" id="Shape" />
        </g>
      </svg>
    </div>
  );
}

function Frame5() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center px-[12px] py-[8px] relative w-full">
          <Frame />
          <Frame11 />
          <Chevron />
        </div>
      </div>
    </div>
  );
}

function Frame9({ isSelected, onClick }: { isSelected: boolean; onClick: () => void }) {
  return (
    <div
      className="relative rounded-[8px] shrink-0 w-full cursor-pointer transition-colors duration-150"
      style={{ backgroundColor: isSelected ? '#EBF7F0' : 'white' }}
      onClick={onClick}
    >
      <div className="content-stretch flex items-center overflow-clip relative rounded-[inherit] w-full">
        <Frame5 />
      </div>
      <div aria-hidden="true" className="absolute border border-[#f6f7f6] border-solid inset-0 pointer-events-none rounded-[8px] shadow-[0px_1px_2px_0px_rgba(27,29,28,0.05)]" />
    </div>
  );
}

function Frame1() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Frame">
          <path d={svgPaths.p3e746280} id="Vector" stroke="var(--stroke-0, #848A86)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d={svgPaths.p2fad1600} id="Vector_2" stroke="var(--stroke-0, #848A86)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d="M2 12.6667H6" id="Vector_3" stroke="var(--stroke-0, #848A86)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d="M2 3.33333H14" id="Vector_4" stroke="var(--stroke-0, #848A86)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
        </g>
      </svg>
    </div>
  );
}

function Text1() {
  return (
    <div className="h-[14px] relative shrink-0 w-full" data-name="Text">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[14px] left-0 not-italic text-[#505451] text-[10.5px] top-0 tracking-[0.0923px]">{`10/09/2025 • 12:13 `}</p>
    </div>
  );
}

function Frame12() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start justify-center min-h-px min-w-px overflow-clip py-[4px] relative">
      <p className="font-['Inter:medium',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#505451] text-[14px]">{`Conversation Summary  – The Wellness Co.`}</p>
      <Text1 />
    </div>
  );
}

function Chevron1() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Chevron">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Chevron">
          <path d={svgPaths.p3244c1f8} fill="var(--fill-0, #505451)" id="Shape" />
        </g>
      </svg>
    </div>
  );
}

function Frame10({ isSelected, onClick }: { isSelected: boolean; onClick: () => void }) {
  return (
    <div
      className="relative rounded-[8px] shrink-0 w-full cursor-pointer transition-colors duration-150"
      style={{ backgroundColor: isSelected ? '#EBF7F0' : 'white' }}
      onClick={onClick}
    >
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex gap-[12px] items-center px-[12px] py-[8px] relative w-full">
          <Frame1 />
          <Frame12 />
          <Chevron1 />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#f6f7f6] border-solid inset-0 pointer-events-none rounded-[8px] shadow-[0px_1px_2px_0px_rgba(27,29,28,0.05)]" />
    </div>
  );
}

function Spacer() {
  return <div className="flex-[1_0_0] h-[11px] min-h-px min-w-px" data-name="spacer" />;
}

function Frame2() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Frame">
          <path d={svgPaths.p4c99df0} fill="var(--fill-0, #1F2A37)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function WInputSearch() {
  return (
    <div className="bg-white relative rounded-[5px] shrink-0" data-name="-w-input-search">
      <div className="content-stretch flex gap-[4px] items-center justify-center overflow-clip px-[8px] py-[4px] relative rounded-[inherit]">
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[#7c8188] text-[13px]">5</p>
        <Frame2 />
      </div>
      <div aria-hidden="true" className="absolute border border-[#e3e3e3] border-solid inset-0 pointer-events-none rounded-[5px]" />
    </div>
  );
}

function Frame3() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Frame">
          <path d={svgPaths.p3f713c00} id="Vector" stroke="var(--stroke-0, #666666)" />
        </g>
      </svg>
    </div>
  );
}

function Frame7() {
  return (
    <div className="content-stretch flex gap-[4px] items-center overflow-clip p-[4px] relative shrink-0">
      <Frame3 />
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[#7c8188] text-[13px]">Previous</p>
    </div>
  );
}

function Frame4() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Frame">
          <path d={svgPaths.pce10b60} id="Vector" stroke="var(--stroke-0, #666666)" />
        </g>
      </svg>
    </div>
  );
}

function Frame8() {
  return (
    <div className="content-stretch flex gap-[4px] items-center overflow-clip p-[4px] relative shrink-0">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[#7c8188] text-[13px]">Next</p>
      <Frame4 />
    </div>
  );
}

function WTableActionsCol() {
  return (
    <div className="relative shrink-0 w-full" data-name="-w-table-actions-col">
      <div className="flex flex-row items-center justify-end overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex gap-[8px] items-center justify-end p-[8px] relative w-full">
          <Spacer />
          <p className="font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[#7c8188] text-[13px]">Rows per page</p>
          <WInputSearch />
          <p className="font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[#7c8188] text-[13px]">1 of 1</p>
          <Frame7 />
          <Frame8 />
        </div>
      </div>
    </div>
  );
}

export default function Frame6() {
  const [selectedItem, setSelectedItem] = useState<number | null>(null);

  return (
    <div className="bg-white relative size-full">
      <div className="content-stretch flex flex-col gap-[12px] items-start px-[16px] py-[24px] relative size-full">
        <Frame9 isSelected={selectedItem === 1} onClick={() => setSelectedItem(1)} />
        <Frame10 isSelected={selectedItem === 2} onClick={() => setSelectedItem(2)} />
        <WTableActionsCol />
      </div>
      <div aria-hidden="true" className="absolute border-[#f6f7f6] border-b border-solid inset-0 pointer-events-none" />
    </div>
  );
}
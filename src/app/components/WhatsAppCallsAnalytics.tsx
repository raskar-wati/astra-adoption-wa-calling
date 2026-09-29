import React, { useMemo, useState } from 'react';
import {
  Calendar, ChevronDown, Info, MoreVertical, Phone, PhoneIncoming, PhoneMissed,
  PhoneOff, PhoneOutgoing, RefreshCw, Timer, CalendarClock,
} from 'lucide-react';
import { useAstraAdoption } from '../lib/AstraAdoptionContext';
import { MissedCallsBanner } from './MissedCallsBanner';
import { AstraPeekTab } from './AstraPeekTab';
import { callAnalyticsFor, formatDuration } from '../data/callAnalytics';

// WhatsApp Calls Analytics (Analytics in the product rail): the last 7 days of
// call volume for the workspace's number, and how each agent handled it. Its
// numbers come from the same segment profile as the call log, so the Astra
// nudges planned for this page argue from figures the user has seen elsewhere.

const fmtDate = (d: Date) => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

function FieldLabel({ children }: React.PropsWithChildren) {
  return <p className="text-[12px] leading-[16px] font-medium text-[#1b1d1c] mb-[6px]">{children}</p>;
}

function SelectBox({ children, className = '' }: React.PropsWithChildren<{ className?: string }>) {
  return (
    <button
      type="button"
      className={`h-[36px] flex items-center gap-[8px] px-[10px] rounded-[6px] border border-[#e7e9e8] bg-white text-[14px] leading-[20px] text-[#353735] whitespace-nowrap hover:border-[#9ca19d] transition-colors ${className}`}
    >
      {children}
    </button>
  );
}

function InfoDot({ label }: { label: string }) {
  return (
    <span title={label} className="inline-flex size-[12px] items-center justify-center rounded-full bg-[#848a86] text-white">
      <Info className="size-[10px]" strokeWidth={3} />
    </span>
  );
}

function OverviewCard({ value, label, hint, icon: Icon, behind }: {
  value: React.ReactNode;
  label: string;
  hint: string;
  icon: typeof Phone;
  /** Something tucked behind the card, peeking out above it. */
  behind?: React.ReactNode;
}) {
  return (
    <div className="relative min-w-0">
    {behind}
    <div className="relative z-10 rounded-[8px] bg-[#f6f7f6] px-[14px] py-[14px] h-[88px] flex flex-col justify-between">
      <div className="flex items-start justify-between gap-[8px]">
        <p className="text-[20px] leading-[28px] font-semibold text-[#1b1d1c] tabular-nums">{value}</p>
        <span className="size-[28px] shrink-0 rounded-full bg-white flex items-center justify-center">
          <Icon className="size-[15px] text-[#23a455]" strokeWidth={1.75} />
        </span>
      </div>
      <p className="flex items-center gap-[4px] text-[14px] leading-[20px] text-[#353735] truncate">
        {label}
        <InfoDot label={hint} />
      </p>
    </div>
    </div>
  );
}

export function WhatsAppCallsAnalytics() {
  const { segment, analyticsIteration } = useAstraAdoption();
  const [sampleData, setSampleData] = useState(false);
  const { overview, agents } = useMemo(() => callAnalyticsFor(segment), [segment]);

  const to = new Date();
  const from = new Date(to);
  from.setDate(to.getDate() - 7);

  return (
    <div className="flex-1 min-w-0 h-full overflow-y-auto bg-white font-['Inter',sans-serif]">
      {/* Title */}
      <div className="flex items-center justify-between px-[32px] h-[66px] border-b border-[#e7e9e8]">
        <h1 className="text-[18px] leading-[24px] font-semibold text-[#1b1d1c]">WhatsApp Calls Analytics</h1>
        <label className="flex items-center gap-[10px] text-[13px] leading-[16px] text-[#848a86] cursor-pointer">
          Preview with sample data
          <button
            type="button"
            role="switch"
            aria-checked={sampleData}
            onClick={() => setSampleData((v) => !v)}
            className={`relative w-[40px] h-[22px] rounded-full transition-colors ${sampleData ? 'bg-[#23a455]' : 'bg-[#b7b9b7]'}`}
          >
            <span className={`absolute top-[3px] size-[16px] rounded-full bg-white transition-all ${sampleData ? 'left-[21px]' : 'left-[3px]'}`} />
          </button>
        </label>
      </div>

      {/* Analytics iteration 1: missed calls, and that Astra can answer them */}
      {analyticsIteration === 1 && <MissedCallsBanner placement="analytics_banner" className="mx-[32px] mt-[16px] w-[480px] max-w-[calc(100%-64px)]" />}

      {/* Filters */}
      <div className="flex flex-wrap items-end justify-between gap-[16px] px-[32px] py-[16px] border-b border-[#e7e9e8]">
        <div className="flex items-end gap-[12px]">
          <div>
            <FieldLabel>Period</FieldLabel>
            <SelectBox className="w-[140px] justify-between">
              Last 7 days
              <ChevronDown className="size-[14px] text-[#848a86]" />
            </SelectBox>
          </div>
          <div>
            <FieldLabel>From</FieldLabel>
            <SelectBox>
              <Calendar className="size-[15px] text-[#848a86]" />
              {fmtDate(from)}
              <ChevronDown className="size-[14px] text-[#848a86]" />
            </SelectBox>
          </div>
          <div>
            <FieldLabel>To</FieldLabel>
            <SelectBox>
              <Calendar className="size-[15px] text-[#848a86]" />
              {fmtDate(to)}
              <ChevronDown className="size-[14px] text-[#848a86]" />
            </SelectBox>
          </div>
        </div>

        <div className="flex items-center gap-[8px]">
          <SelectBox className="w-[260px] justify-between">
            <span className="flex items-center gap-[6px] font-medium text-[#1b1d1c]">
              <span className="size-[10px] rounded-full bg-[#23a455]" />
              Default
            </span>
            <span className="flex items-center gap-[8px] text-[#848a86]">
              +17735704742
              <ChevronDown className="size-[14px]" />
            </span>
          </SelectBox>
          <div className="flex">
            <button
              type="button"
              className="h-[36px] flex items-center gap-[8px] px-[14px] rounded-l-[6px] border border-[#23a455] text-[13px] font-medium text-[#23a455] whitespace-nowrap hover:bg-[#23a455]/5 transition-colors"
            >
              <CalendarClock className="size-[15px]" />
              Report Scheduled
            </button>
            <button
              type="button"
              aria-label="Report options"
              className="h-[36px] w-[30px] flex items-center justify-center rounded-r-[6px] border border-l-0 border-[#23a455] text-[#23a455] hover:bg-[#23a455]/5 transition-colors"
            >
              <ChevronDown className="size-[14px]" />
            </button>
          </div>
        </div>
      </div>

      {/* Overview */}
      <section className="px-[32px] pt-[20px] pb-[28px] border-b border-[#e7e9e8]">
        <h2 className="text-[16px] leading-[24px] font-semibold text-[#1b1d1c] mb-[14px]">Overview</h2>
        {/* With a tab peeking above a card, rows need room for it */}
        <div className={`grid grid-cols-3 min-[1320px]:grid-cols-6 gap-x-[10px] ${
          // Missed Calls sits in the second row of three, or the only row of six.
          analyticsIteration === 2 ? 'gap-y-[38px] min-[1320px]:gap-y-[10px] min-[1320px]:pt-[28px]' : 'gap-y-[10px]'
        }`}>
          <OverviewCard value={overview.totalCallVolume} label="Total Call Volume" hint="Inbound calls plus outbound attempts" icon={Phone} />
          <OverviewCard value={overview.outboundConnected} label="Outbound Connected" hint="Outbound calls the customer answered" icon={PhoneOutgoing} />
          <OverviewCard value={overview.outboundAttempted} label="Outbound Attempted" hint="Every outbound call placed" icon={PhoneMissed} />
          <OverviewCard value={overview.inboundCalls} label="Inbound Calls" hint="Every inbound call attempt" icon={PhoneIncoming} />
          <OverviewCard
            value={overview.missedCalls}
            label="Missed Calls"
            hint="Inbound calls nobody answered"
            icon={PhoneOff}
            behind={analyticsIteration === 2 ? <AstraPeekTab /> : undefined}
          />
          <OverviewCard value={formatDuration(overview.avgCallDuration)} label="Avg. Call Duration" hint="Across connected calls" icon={Timer} />
        </div>
      </section>

      {/* Agent performance */}
      <section className="px-[32px] pt-[20px] pb-[32px]">
        <div className="flex items-center justify-between mb-[12px]">
          <h2 className="flex items-center gap-[6px] text-[16px] leading-[24px] font-semibold text-[#1b1d1c]">
            Agent performance
            <Info className="size-[14px] text-[#848a86]" />
          </h2>
          <div className="flex items-center gap-[8px]">
            <button
              type="button"
              aria-label="Refresh"
              className="size-[36px] flex items-center justify-center rounded-[6px] border border-[#23a455] text-[#23a455] hover:bg-[#23a455]/5 transition-colors"
            >
              <RefreshCw className="size-[15px]" />
            </button>
            <SelectBox className="w-[200px] justify-between bg-[#f6f7f6] border-transparent">
              All users
              <ChevronDown className="size-[14px] text-[#848a86]" />
            </SelectBox>
            <button
              type="button"
              aria-label="More"
              className="size-[36px] flex items-center justify-center rounded-[6px] bg-[#f6f7f6] text-[#505451] hover:bg-[#eef0ef] transition-colors"
            >
              <MoreVertical className="size-[16px]" />
            </button>
          </div>
        </div>

        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-[#e7e9e8]">
              {['Agent', 'Avg. Call Duration', 'Outbound Attempted', 'Outbound Connected', 'Inbound Calls'].map((h) => (
                <th key={h} className="px-[16px] py-[18px] text-[14px] leading-[20px] font-semibold text-[#1b1d1c] w-1/5">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {agents.map((a) => (
              <tr key={a.agent} className="border-b border-[#e7e9e8] hover:bg-[#f6f7f6]/60 transition-colors">
                <td className="px-[16px] py-[20px] text-[14px] leading-[20px] text-[#1b1d1c]">{a.agent}</td>
                <td className="px-[16px] py-[20px] text-[14px] leading-[20px] text-[#1b1d1c] tabular-nums">{formatDuration(a.avgCallDuration)}</td>
                <td className="px-[16px] py-[20px] text-[14px] leading-[20px] text-[#1b1d1c] tabular-nums">{a.outboundAttempted}</td>
                <td className="px-[16px] py-[20px] text-[14px] leading-[20px] text-[#1b1d1c] tabular-nums">{a.outboundConnected}</td>
                <td className="px-[16px] py-[20px] text-[14px] leading-[20px] text-[#1b1d1c] tabular-nums">{a.inboundCalls}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export default WhatsAppCallsAnalytics;

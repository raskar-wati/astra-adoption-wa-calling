import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  PhoneMissed,
  Sparkles,
  Download,
  Waypoints,
  Loader2
} from 'lucide-react';
import { AstraLogo } from './AstraLogo';
import { VoipAvatar } from './VoipAvatar';
import { CallHandlerLabel } from './CallHandlerLabel';
import { VoipCallButton } from './VoipCallButton';
import { CALL_TRANSCRIPTIONS } from '../data/callTranscriptions';
import { VoipCall, voipCallerLabel } from '../data/voipCalls';

interface VoipCallDetailProps {
  call?: VoipCall;
  onCallContact?: (phoneNumber: string) => void;
}

// Independent VoIP call detail — shows ONLY the recording + transcription.
// No message/summary/automation tabs and no WhatsApp calling controls.
export function VoipCallDetail({ call, onCallContact }: VoipCallDetailProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [generatedSummary, setGeneratedSummary] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Reset player + generation state when a different call is selected.
  useEffect(() => {
    setIsPlaying(false);
    setGeneratedSummary(null);
    setIsGenerating(false);
  }, [call?.id]);

  // Empty state — no call selected yet.
  if (!call) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-white p-8">
        <div className="max-w-sm text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-gray-100 rounded-2xl flex items-center justify-center">
            <Waypoints className="w-8 h-8 text-gray-900" />
          </div>
          <h3 className="font-semibold text-gray-900 text-lg">Select a call</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            Choose a VoIP call from the list to review its recording and transcription.
          </p>
        </div>
      </div>
    );
  }

  const data = CALL_TRANSCRIPTIONS[call.id];
  // Astra-handled calls speak as Astra, not as a human teammate.
  const isAstra = call.handledBy === 'astra';
  const handlerName = isAstra ? 'Astra' : 'Agent';
  const summary = generatedSummary ?? data?.summary ?? '';

  const handleGenerateSummary = async () => {
    if (!data) return;
    setIsGenerating(true);
    await new Promise((resolve) => setTimeout(resolve, 2500));
    setGeneratedSummary(
      `${call.type === 'incoming' ? 'Inbound' : 'Outbound'} VoIP call with ${call.name} lasting ${call.duration}. ${isAstra ? 'Astra handled the conversation end to end' : 'The conversation was handled professionally'} and the customer's request was addressed. Key points and next steps were captured automatically from the recording.`
    );
    setIsGenerating(false);
  };

  return (
    <div className="flex-1 flex flex-col bg-white min-w-0">
      {/* Header — VoIP call meta, no calling controls */}
      <div className="border-b border-gray-200 px-6 py-4 flex items-center gap-4">
        <VoipAvatar name={call.name} size="md" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h2 className="font-semibold text-gray-900 truncate">{voipCallerLabel(call)}</h2>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100 text-gray-900 text-[11px] font-medium">
              <Waypoints className="w-3 h-3" />
              VoIP
            </span>
            <CallHandlerLabel call={call} variant="pill" />
          </div>
          <p className="text-xs text-gray-500 truncate">{call.phoneNumber}</p>
        </div>
        {onCallContact && (
          <div className="flex-shrink-0">
            <VoipCallButton
              phoneNumber={call.phoneNumber}
              contactName={voipCallerLabel(call)}
              onCall={onCallContact}
            />
          </div>
        )}
      </div>

      {/* Missed call — no recording */}
      {!data ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <div className="max-w-sm text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-red-50 rounded-2xl flex items-center justify-center">
              <PhoneMissed className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="font-semibold text-gray-900 text-lg">No recording available</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              This call was missed at {call.time} on {call.date}, so there is no recording or transcription to review.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto">
          {/* Call meta strip */}
          <div className="flex items-center gap-6 px-6 py-3 border-b border-gray-100 text-xs text-gray-500">
            <span>{data.date ?? call.date}</span>
            <span>{data.time ?? call.time}</span>
            <span className="font-mono text-gray-700">{data.duration}</span>
          </div>

          {/* Recording player */}
          <div className="px-6 py-5 border-b border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-900">Recording</h3>
              <button className="inline-flex items-center gap-1.5 text-xs text-gray-700 hover:text-black font-medium">
                <Download className="w-3.5 h-3.5" />
                Download
              </button>
            </div>
            <div className="flex items-center gap-4 bg-gray-100 rounded-xl px-4 py-3">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-10 h-10 rounded-full flex items-center justify-center text-wati-green hover:text-wati-green-dark transition-colors flex-shrink-0"
              >
                {isPlaying
                  ? <Pause className="w-5 h-5" fill="currentColor" strokeWidth={0} />
                  : <Play className="w-5 h-5 ml-0.5" fill="currentColor" strokeWidth={0} />}
              </button>
              <div className="flex-1">
                <div className="relative h-2 bg-gray-300 rounded-full">
                  <div className="absolute inset-y-0 left-0 bg-wati-green rounded-full" style={{ width: '35%' }} />
                  <div className="absolute top-1/2 left-[35%] -translate-y-1/2 w-3.5 h-3.5 bg-white border-2 border-wati-green rounded-full shadow-sm" />
                </div>
              </div>
              <span className="text-xs text-gray-600 font-mono flex-shrink-0">{data.duration}</span>
            </div>
          </div>

          {/* AI summary */}
          <div className="px-6 py-5 border-b border-gray-100">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-gray-900" />
              <h3 className="text-sm font-semibold text-gray-900">Summary</h3>
            </div>
            {summary ? (
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <p className="text-sm text-gray-800 leading-relaxed">{summary}</p>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-xl border border-dashed border-gray-300 p-5 text-center">
                <p className="text-sm text-gray-600 mb-3">No summary has been generated for this call yet.</p>
                <button
                  onClick={handleGenerateSummary}
                  disabled={isGenerating}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-wati-green text-wati-green text-sm font-medium hover:bg-wati-green/5 transition-colors disabled:opacity-70"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Generating…
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Generate summary
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Transcription */}
          <div className="px-6 py-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Transcription</h3>
            <div className="space-y-4">
              {data.transcript.map((entry) => {
                const isAgent = entry.speaker === 'Agent';
                return (
                  <div key={entry.id} className="flex gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 ${
                        isAgent ? 'bg-gray-200 text-gray-900' : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {isAgent ? (isAstra ? <AstraLogo className="w-4 h-4" /> : 'A') : 'C'}
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-900">
                          {isAgent ? handlerName : entry.speaker}
                        </span>
                        <span className="text-xs text-gray-400 font-mono">{entry.timestamp}</span>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">{entry.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default VoipCallDetail;

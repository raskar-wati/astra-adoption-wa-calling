import React, { useState, useRef, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Phone, 
  Video, 
  MoreHorizontal, 
  Archive,
  ArrowLeft,
  PanelRightOpen,
  PanelRightClose,
  Download,
  Play,
  Pause,
  Info,
  Sparkles,
  Clock,
  ChevronRight
} from 'lucide-react';
import customerAvatar from 'figma:asset/be6e73766eeaba76cb341f8b59d8f0a454fd2458.png';
import TiTopNav from '../imports/TiTopNav';
import svgPathsTab from '../imports/svg-x39h9bo7e8';
import svgPathsCall from '../imports/svg-tf3l034z87';
import svgPathsSummary from '../imports/svg-z6zwjmgta2';
import Frame6 from '../imports/Frame536';
import { CALL_TRANSCRIPTIONS, DEFAULT_TRANSCRIPTION, CallTranscriptEntry } from '../data/callTranscriptions';
import Frame1984077888 from '../imports/Frame1984077888-10094-45';
import InboundCall from '../imports/InboundCall';
import OutboundCall from '../imports/OutboundCall';
import { CallRecordMessage } from './CallRecordMessage';
import { ChatBubble } from './ChatBubble';
import { ChatComposer } from './ChatComposer';

interface Message {
  id: string;
  text: string;
  sender: 'customer' | 'agent';
  timestamp: string;
  type?: 'message' | 'call-record';
  callData?: {
    callType: 'inbound' | 'outbound' | 'missed';
    duration: string;
    audioLength: string;
  };
}

interface ChatInterfaceProps {
  selectedChat: {
    id: string;
    name: string;
    avatar: string;
    lastMessage: string;
    timestamp: string;
    status: string;
    channel: string;
    isOnline: boolean;
    unread: boolean;
    category: string;
  };
  messages: Message[];
  onSendMessage: (message: string) => void;
  onToggleContactInfo: () => void;
  isContactInfoVisible: boolean;
  isMobile: boolean;
  onStartCall?: () => void;
  initialActiveView?: 'messages' | 'summary' | 'transcription' | 'automations';
  initialSelectedCallId?: string;
}

// Mock call transcription data
const MOCK_CALL_TRANSCRIPT: CallTranscriptEntry[] = [
  {
    id: '1',
    speaker: 'Agent',
    text: 'Hello, thank you for calling. How can I assist you today?',
    timestamp: '00:02'
  },
  {
    id: '2',
    speaker: 'Customer',
    text: 'Hi, I\'m calling about my recent order. I haven\'t received it yet and it\'s been over a week.',
    timestamp: '00:08'
  },
  {
    id: '3',
    speaker: 'Agent',
    text: 'I understand your concern. Let me look up your order details. Can you please provide me with your order number?',
    timestamp: '00:15'
  },
  {
    id: '4',
    speaker: 'Customer',
    text: 'Yes, it\'s ORDER-2024-001234.',
    timestamp: '00:23'
  },
  {
    id: '5',
    speaker: 'Agent',
    text: 'Thank you. I can see your order here. It looks like there was a delay in our warehouse. The good news is that your package was shipped yesterday and should arrive within 2-3 business days.',
    timestamp: '00:28'
  },
  {
    id: '6',
    speaker: 'Customer',
    text: 'Okay, that\'s a relief. Will I receive a tracking number?',
    timestamp: '00:45'
  },
  {
    id: '7',
    speaker: 'Agent',
    text: 'Absolutely! I\'m sending you the tracking information right now via email. You should receive it within the next few minutes. Is there anything else I can help you with today?',
    timestamp: '00:52'
  },
  {
    id: '8',
    speaker: 'Customer',
    text: 'No, that covers everything. Thank you so much for your help!',
    timestamp: '01:05'
  },
  {
    id: '9',
    speaker: 'Agent',
    text: 'You\'re very welcome! Have a great day and thank you for choosing our service.',
    timestamp: '01:10'
  }
];

const MOCK_AI_SUMMARY = {
  duration: '1 minute 15 seconds',
  callType: 'Customer Support',
  outcome: 'Resolved',
  keyPoints: [
    'Customer inquired about delayed order (ORDER-2024-001234)',
    'Warehouse delay identified as cause',
    'Package shipped yesterday, 2-3 business days delivery',
    'Tracking information provided via email',
    'Issue successfully resolved'
  ],
  sentiment: 'Positive',
  followUp: 'None required - customer satisfied with resolution'
};

// Simplified icon wrapper for consistent sizing

// Skeleton Loader Component for Summary Generation
function SummarySkeleton() {
  return (
    <div className="relative bg-gradient-to-br from-blue-50 via-white to-green-50 border-b border-blue-100 p-[16px]">
      <h2 className="font-bold text-gray-900 mb-3 text-[16px]">Call Summary</h2>
      
      <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm space-y-3">
        {/* Animated skeleton lines */}
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-md bg-[length:200%_100%] animate-[shimmer_1.5s_infinite]" style={{ width: '100%' }}></div>
          <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-md bg-[length:200%_100%] animate-[shimmer_1.5s_infinite] animation-delay-150" style={{ width: '95%' }}></div>
          <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-md bg-[length:200%_100%] animate-[shimmer_1.5s_infinite] animation-delay-300" style={{ width: '90%' }}></div>
          <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-md bg-[length:200%_100%] animate-[shimmer_1.5s_infinite] animation-delay-450" style={{ width: '85%' }}></div>
        </div>
      </div>
    </div>
  );
}

// Skeleton Loader Component for Transcription Generation
function TranscriptionSkeleton() {
  return (
    <div className="p-4 lg:p-6">
      <div className="space-y-6">
        <h3 className="font-semibold text-gray-900">Call Transcription</h3>
        
        <div className="space-y-4">
          {/* Mock conversation entries with skeleton loaders */}
          {[1, 2, 3, 4].map((index) => (
            <div key={index} className="flex space-x-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
              </div>
              
              <div className="flex-1 space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="h-4 w-16 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded bg-[length:200%_100%] animate-[shimmer_1.5s_infinite]"></div>
                  <div className="h-3 w-12 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded bg-[length:200%_100%] animate-[shimmer_1.5s_infinite]"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded bg-[length:200%_100%] animate-[shimmer_1.5s_infinite]" style={{ width: `${95 - index * 5}%` }}></div>
                  <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded bg-[length:200%_100%] animate-[shimmer_1.5s_infinite]" style={{ width: `${85 - index * 5}%` }}></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Call Transcription View Component
function CallTranscriptionView({ 
  selectedCallId,
  generatedSummaries,
  setGeneratedSummaries,
  generatedTranscriptions,
  setGeneratedTranscriptions,
  generatingSummaries,
  setGeneratingSummaries
}: { 
  selectedCallId?: string;
  generatedSummaries: Record<string, string>;
  setGeneratedSummaries: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  generatedTranscriptions: Record<string, CallTranscriptEntry[]>;
  setGeneratedTranscriptions: React.Dispatch<React.SetStateAction<Record<string, CallTranscriptEntry[]>>>;
  generatingSummaries: Record<string, boolean>;
  setGeneratingSummaries: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [expandedCallId, setExpandedCallId] = useState<string | undefined>(selectedCallId);
  
  // Get the transcription data for the selected call
  const callData = selectedCallId && CALL_TRANSCRIPTIONS[selectedCallId] 
    ? CALL_TRANSCRIPTIONS[selectedCallId] 
    : null;

  // Update expanded call when selectedCallId changes
  useEffect(() => {
    if (selectedCallId) {
      setExpandedCallId(selectedCallId);
    }
  }, [selectedCallId]);

  // Function to generate summary
  const handleGenerateSummary = async (callId: string) => {
    // Start generating the summary
    setGeneratingSummaries(prev => ({ ...prev, [callId]: true }));
    
    // Simulate API call to generate summary and transcription (2.5 seconds)
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    // Generate summary based on the transcription
    const transcription = CALL_TRANSCRIPTIONS[callId];
    if (transcription) {
      const generatedSummary = `Brief ${transcription.callType?.toLowerCase()} call captured at ${transcription.time}. The customer and agent had a brief conversation covering initial inquiries. The interaction was professional and the agent provided assistance according to company standards.`;
      
      setGeneratedSummaries(prev => ({ ...prev, [callId]: generatedSummary }));
      
      // Generate transcription based on the mock data
      const generatedTranscription = MOCK_CALL_TRANSCRIPT;
      setGeneratedTranscriptions(prev => ({ ...prev, [callId]: generatedTranscription }));
    }
    
    setGeneratingSummaries(prev => ({ ...prev, [callId]: false }));
  };

  // Function to generate transcription
  const handleGenerateTranscription = async (callId: string) => {
    // Simulate API call to generate transcription (2.5 seconds)
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    // Generate transcription based on the mock data
    const generatedTranscription = MOCK_CALL_TRANSCRIPT;
    
    setGeneratedTranscriptions({ ...generatedTranscriptions, [callId]: generatedTranscription });
  };

  // Get all available transcriptions (filter CALL_TRANSCRIPTIONS to only include those with data)
  const allTranscriptions = Object.entries(CALL_TRANSCRIPTIONS)
    .filter(([id, data]) => data && data.transcript && data.transcript.length > 0)
    .map(([id, data]) => ({
      id,
      ...data
    }));

  // If no transcription data exists at all, show empty state
  if (allTranscriptions.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-white p-8">
        <div className="max-w-md text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
            <Info className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="font-semibold text-gray-900 text-lg">No Transcription Available</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            Transcription is not available for this call. This may be because the call was missed, went to voicemail, is currently in progress, or was too short to generate a transcription.
          </p>
        </div>
      </div>
    );
  }

  // If only one transcription, show it directly without accordion
  if (allTranscriptions.length === 1) {
    const singleCallData = allTranscriptions[0];
    
    return (
      <div className="flex-1 flex flex-col bg-white">
        {/* Enhanced AI Summary Section - Hero Element */}
        <div className="relative bg-gradient-to-br from-blue-50 via-white to-green-50 border-b border-blue-100 p-[16px]">
          {/* AI Badge */}
          

          {/* Main Title */}
          <h2 className="font-bold text-gray-900 mb-3 text-[16px]">Call Summary</h2>
          
          {/* Summary Content */}
          <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
            <p className="text-base text-gray-800 leading-relaxed">
              {singleCallData.summary}
            </p>
          </div>
        </div>

        {/* Audio Controls */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-9 h-9 p-0 flex items-center justify-center"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
            
            <div className="flex-1 bg-gray-200 rounded-full h-2 relative">
              <div className="bg-primary h-2 rounded-full" style={{ width: '35%' }}></div>
              <div className="absolute top-1/2 left-[35%] transform -translate-y-1/2 w-4 h-4 bg-primary rounded-full border-2 border-white shadow-sm"></div>
            </div>
            
            <span className="text-sm text-gray-600 font-mono">{singleCallData.duration}</span>
          </div>
        </div>

        {/* Transcription Content */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="space-y-6">
            <h3 className="font-semibold text-gray-900">Call Transcription</h3>
            
            <div className="space-y-4">
              {singleCallData.transcript.map((entry: any) => (
                <div key={entry.id} className="flex space-x-4">
                  <div className="flex-shrink-0">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                      entry.speaker === 'Agent' 
                        ? 'bg-primary/10 text-primary' 
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {entry.speaker === 'Agent' ? 'A' : 'C'}
                    </div>
                  </div>
                  
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-sm text-gray-900">{entry.speaker}</span>
                      <span className="text-xs text-gray-500 font-mono">{entry.timestamp}</span>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">{entry.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Multiple transcriptions - show accordion view
  return (
    <div className="flex-1 flex flex-col bg-white overflow-y-auto">
      <div className="p-4 space-y-3">
        {allTranscriptions.map((transcription) => {
          const isExpanded = expandedCallId === transcription.id;
          
          return (
            <div 
              key={transcription.id}
              className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden transition-all duration-200"
            >
              {/* Accordion Header */}
              <div className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors bg-[#ffffff]">
                <button
                  onClick={() => setExpandedCallId(isExpanded ? undefined : transcription.id)}
                  className="flex items-center gap-3 flex-1 text-left"
                >
                  <div className="flex items-center gap-3 flex-1 text-left">
                    {/* Call type icon */}
                    <div className="flex-shrink-0">
                      {transcription.callType === 'Outbound' ? (
                        <div className="w-8 h-8">
                          <OutboundCall />
                        </div>
                      ) : transcription.callType === 'Missed' ? (
                        <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                          <Phone className="w-4 h-4 text-red-600 transform rotate-[135deg]" />
                        </div>
                      ) : (
                        <div className="w-8 h-8">
                          <InboundCall />
                        </div>
                      )}
                    </div>
                    
                    {/* Call info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-[14px]">
                        {transcription.callType} Call
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {transcription.date} • {transcription.time} • {transcription.duration}
                      </p>
                    </div>
                  </div>
                </button>
                
                {/* Download and Chevron */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  {/* Download button */}
                  <div 
                    className="w-8 h-8 p-0 flex items-center justify-center hover:bg-gray-100 rounded cursor-pointer transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log('Download call data for:', transcription.id);
                      // Add download functionality here
                    }}
                  >
                    <Download className="w-4 h-4 text-gray-500" />
                  </div>
                  
                  {/* Chevron */}
                  <button
                    onClick={() => setExpandedCallId(isExpanded ? undefined : transcription.id)}
                    className={`transition-transform duration-200 ${
                      isExpanded ? 'rotate-180' : ''
                    }`}
                  >
                    <ChevronRight className="w-5 h-5 text-gray-400 rotate-90" />
                  </button>
                </div>
              </div>
              
              {/* Accordion Content */}
              {isExpanded && (
                <div className="border-t border-gray-200">
                  {/* Check if summary needs to be generated */}
                  {!transcription.summary && !generatedSummaries[transcription.id] && !generatingSummaries[transcription.id] ? (
                    /* Show Generate Summary Component */
                    <>
                      <div className="p-4" onClick={() => handleGenerateSummary(transcription.id)}>
                        <div className="cursor-pointer hover:opacity-90 transition-opacity">
                          <Frame1984077888 />
                        </div>
                      </div>
                      
                      {/* Audio Controls - Always visible by default */}
                      <div className="bg-white border-b border-gray-200 p-4">
                        <div className="flex items-center space-x-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsPlaying(!isPlaying)}
                            className="w-9 h-9 p-0 flex items-center justify-center"
                          >
                            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                          </Button>
                          
                          <div className="flex-1 bg-gray-200 rounded-full h-2 relative">
                            <div className="bg-primary h-2 rounded-full" style={{ width: '35%' }}></div>
                            <div className="absolute top-1/2 left-[35%] transform -translate-y-1/2 w-4 h-4 bg-primary rounded-full border-2 border-white shadow-sm"></div>
                          </div>
                          
                          <span className="text-sm text-gray-600 font-mono">{transcription.duration}</span>
                        </div>
                      </div>
                    </>
                  ) : generatingSummaries[transcription.id] ? (
                    /* Show Skeleton Loaders while generating */
                    <>
                      <SummarySkeleton />
                      
                      {/* Audio Controls - Always visible */}
                      <div className="bg-white border-b border-gray-200 p-4">
                        <div className="flex items-center space-x-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsPlaying(!isPlaying)}
                            className="w-9 h-9 p-0 flex items-center justify-center"
                          >
                            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                          </Button>
                          
                          <div className="flex-1 bg-gray-200 rounded-full h-2 relative">
                            <div className="bg-primary h-2 rounded-full" style={{ width: '35%' }}></div>
                            <div className="absolute top-1/2 left-[35%] transform -translate-y-1/2 w-4 h-4 bg-primary rounded-full border-2 border-white shadow-sm"></div>
                          </div>
                          
                          <span className="text-sm text-gray-600 font-mono">{transcription.duration}</span>
                        </div>
                      </div>
                      
                      <TranscriptionSkeleton />
                    </>
                  ) : (
                    /* Show Generated or Existing Summary and Transcription */
                    <>
                      <div className="relative bg-gradient-to-br from-blue-50 via-white to-green-50 border-b border-blue-100 p-[16px]">
                        {/* Main Title */}
                        <h2 className="font-bold text-gray-900 mb-3 text-[16px]">Call Summary</h2>
                        
                        {/* Summary Content */}
                        <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
                          <p className="text-base text-gray-800 leading-relaxed">
                            {generatedSummaries[transcription.id] || transcription.summary}
                          </p>
                        </div>
                      </div>

                      {/* Audio Controls */}
                      <div className="bg-white border-b border-gray-200 p-4">
                        <div className="flex items-center space-x-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsPlaying(!isPlaying)}
                            className="w-9 h-9 p-0 flex items-center justify-center"
                          >
                            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                          </Button>
                          
                          <div className="flex-1 bg-gray-200 rounded-full h-2 relative">
                            <div className="bg-primary h-2 rounded-full" style={{ width: '35%' }}></div>
                            <div className="absolute top-1/2 left-[35%] transform -translate-y-1/2 w-4 h-4 bg-primary rounded-full border-2 border-white shadow-sm"></div>
                          </div>
                          
                          <span className="text-sm text-gray-600 font-mono">{transcription.duration}</span>
                        </div>
                      </div>

                      {/* Transcription Content */}
                      <div className="p-4 lg:p-6">
                        <div className="space-y-6">
                          <h3 className="font-semibold text-gray-900">Call Transcription</h3>
                          
                          <div className="space-y-4">
                            {(generatedTranscriptions[transcription.id] || transcription.transcript).map((entry: any) => (
                              <div key={entry.id} className="flex space-x-4">
                                <div className="flex-shrink-0">
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                                    entry.speaker === 'Agent' 
                                      ? 'bg-primary/10 text-primary' 
                                      : 'bg-gray-100 text-gray-700'
                                  }`}>
                                    {entry.speaker === 'Agent' ? 'A' : 'C'}
                                  </div>
                                </div>
                                
                                <div className="flex-1 space-y-1">
                                  <div className="flex items-center space-x-2">
                                    <span className="font-medium text-sm text-gray-900">{entry.speaker}</span>
                                    <span className="text-xs text-gray-500 font-mono">{entry.timestamp}</span>
                                  </div>
                                  <p className="text-sm text-gray-700 leading-relaxed">{entry.text}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function ChatInterface({ 
  selectedChat,
  messages,
  onSendMessage,
  onToggleContactInfo, 
  isContactInfoVisible, 
  isMobile,
  onStartCall,
  initialActiveView,
  initialSelectedCallId
}: ChatInterfaceProps) {
  const [activeView, setActiveView] = useState<'messages' | 'summary' | 'transcription' | 'automations'>(initialActiveView || 'messages');
  const [selectedCallId, setSelectedCallId] = useState<string | undefined>(initialSelectedCallId);
  const [generatedSummaries, setGeneratedSummaries] = useState<Record<string, string>>({});
  const [generatedTranscriptions, setGeneratedTranscriptions] = useState<Record<string, CallTranscriptEntry[]>>({});
  const [generatingSummaries, setGeneratingSummaries] = useState<Record<string, boolean>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Update active view when initialActiveView changes
  useEffect(() => {
    if (initialActiveView) {
      setActiveView(initialActiveView);
    }
  }, [initialActiveView]);

  // Update selectedCallId when initialSelectedCallId changes.
  // Selecting a call record also jumps to the transcription view so the
  // recording + transcript surface in the center content area.
  useEffect(() => {
    if (initialSelectedCallId) {
      setSelectedCallId(initialSelectedCallId);
      setActiveView(initialActiveView || 'transcription');
    }
  }, [initialSelectedCallId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleGenerateSummary = async (callId: string) => {
    // Switch to transcription tab and select the call
    setSelectedCallId(callId);
    setActiveView('transcription');
    
    // Start generating the summary
    setGeneratingSummaries(prev => ({ ...prev, [callId]: true }));
    
    // Simulate API call to generate summary and transcription (2.5 seconds)
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    // Generate summary based on the transcription
    const transcription = CALL_TRANSCRIPTIONS[callId];
    if (transcription) {
      const generatedSummary = `Brief ${transcription.callType?.toLowerCase()} call captured at ${transcription.time}. The customer and agent had a brief conversation covering initial inquiries. The interaction was professional and the agent provided assistance according to company standards.`;
      
      setGeneratedSummaries(prev => ({ ...prev, [callId]: generatedSummary }));
      
      // Generate transcription based on the mock data
      const generatedTranscription = MOCK_CALL_TRANSCRIPT;
      setGeneratedTranscriptions(prev => ({ ...prev, [callId]: generatedTranscription }));
    }
    
    setGeneratingSummaries(prev => ({ ...prev, [callId]: false }));
  };

  const getChannelColor = (channel: string) => {
    switch (channel) {
      case 'WhatsApp':
        return 'bg-green-100 text-green-800';
      case 'Instagram':
        return 'bg-pink-100 text-pink-800';
      case 'Messenger':
        return 'bg-blue-100 text-blue-800';
      case 'SMS':
      case 'RCS':
        return 'bg-orange-100 text-orange-800';
      case 'Broadcast':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open':
        return 'bg-green-100 text-green-800';
      case 'Solved':
        return 'bg-blue-100 text-blue-800';
      case 'Broadcast':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get phone number from contact info or generate a default one
  const getPhoneNumber = () => {
    // In a real app, this would come from contact info
    // For now, generate based on chat ID for variety
    const phoneNumbers: Record<string, string> = {
      '1': '+18765432210',
      '2': '+15551234567', 
      '3': '+19876543210',
      '4': '+15557654321',
      '5': '+919876543210',
      '6': '+919123456789',
      '7': '+15559876543',
      '8': '+15557654321'
    };
    return phoneNumbers[selectedChat.id] || '+1234567890';
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="h-16 flex-shrink-0">
        <TiTopNav 
          onToggleContactInfo={onToggleContactInfo}
          isContactInfoVisible={isContactInfoVisible}
          selectedChat={{ id: selectedChat.id, name: selectedChat.name }}
          onStartCall={onStartCall}
        />
      </div>

      {/* View Toggle */}
      <div className="bg-white relative border-b border-[#f6f7f6]">
        <div className="content-stretch flex gap-[4px] items-center px-[12px] relative h-full">
          {/* Messages Tab */}
          <button
            onClick={() => setActiveView('messages')}
            className={`flex flex-row items-center self-stretch ${
              activeView === 'messages' ? 'relative' : ''
            }`}
          >
            <div className="content-stretch flex gap-[4px] h-full items-center overflow-clip px-[8px] py-[12px] relative shrink-0">
              <div className="relative shrink-0 size-[16px]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
                  <g>
                    <path d={svgPathsTab.p405f80} stroke={activeView === 'messages' ? '#23a455' : '#353735'} strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M4.66667 7.33333H11.3333" stroke={activeView === 'messages' ? '#23a455' : '#353735'} strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M4.66667 10H8.66667" stroke={activeView === 'messages' ? '#23a455' : '#353735'} strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M4.66667 4.66667H10" stroke={activeView === 'messages' ? '#23a455' : '#353735'} strokeLinecap="round" strokeLinejoin="round" />
                  </g>
                </svg>
              </div>
              <p className={`font-['Inter',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[14px] ${
                activeView === 'messages' ? 'text-[#23a455]' : 'text-[#353735]'
              }`}>
                Messages
              </p>
            </div>
            {activeView === 'messages' && (
              <div aria-hidden="true" className="absolute border-[#23a455] border-b-3 border-solid inset-0 pointer-events-none" />
            )}
          </button>

          {/* Summary Tab */}
          <button
            onClick={() => setActiveView('summary')}
            className={`flex flex-row items-center self-stretch ${
              activeView === 'summary' ? 'relative' : ''
            }`}
          >
            <div className="content-stretch flex gap-[4px] items-center overflow-clip px-[8px] py-[12px] relative shrink-0">
              <div className="relative shrink-0 size-[16px]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
                  <g>
                    <path d={svgPathsSummary.p2ae30d00} fill={activeView === 'summary' ? 'url(#paint0_linear_summary)' : '#353735'} />
                  </g>
                  <defs>
                    <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_summary" x1="20.002" x2="-10.0991" y1="-8.7575" y2="4.55813">
                      <stop stopColor="#4FC3FF" />
                      <stop offset="1" stopColor="#00E785" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <p className={`font-['Inter',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[14px] ${
                activeView === 'summary' ? 'text-[#23a455]' : 'text-[#353735]'
              }`}>
                Summary
              </p>
            </div>
            {activeView === 'summary' && (
              <div aria-hidden="true" className="absolute border-[#23a455] border-b-3 border-solid inset-0 pointer-events-none" />
            )}
          </button>

          {/* Transcription Tab */}
          <button
            onClick={() => setActiveView('transcription')}
            className={`flex flex-row items-center self-stretch ${
              activeView === 'transcription' ? 'relative' : ''
            }`}
          >
            <div className="content-stretch flex gap-[4px] items-center overflow-clip px-[8px] py-[12px] relative shrink-0">
              <div className="relative shrink-0 size-[16px]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
                  <g>
                    <path d={svgPathsCall.p1f19c2b0} fill={activeView === 'transcription' ? '#23a455' : '#505451'} />
                  </g>
                </svg>
              </div>
              <p className={`font-['Inter',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[14px] ${
                activeView === 'transcription' ? 'text-[#23a455]' : 'text-[#353735]'
              }`}>
                Transcription
              </p>
            </div>
            {activeView === 'transcription' && (
              <div aria-hidden="true" className="absolute border-[#23a455] border-b-3 border-solid inset-0 pointer-events-none" />
            )}
          </button>

          {/* Automations Tab */}
          <button
            onClick={() => setActiveView('automations')}
            className={`flex flex-row items-center self-stretch ${
              activeView === 'automations' ? 'relative' : ''
            }`}
          >
            <div className="content-stretch flex gap-[4px] h-full items-center overflow-clip px-[8px] py-[12px] relative shrink-0">
              <div className="relative shrink-0 size-[16px]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
                  <g>
                    <path d={svgPathsTab.p14020580} stroke={activeView === 'automations' ? '#23a455' : '#353735'} strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.833333" />
                    <path d={svgPathsTab.p28fb3b80} stroke={activeView === 'automations' ? '#23a455' : '#353735'} strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.833333" />
                    <path d={svgPathsTab.p4448ef0} stroke={activeView === 'automations' ? '#23a455' : '#353735'} strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.833333" />
                  </g>
                </svg>
              </div>
              <p className={`font-['Inter',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[14px] ${
                activeView === 'automations' ? 'text-[#23a455]' : 'text-[#353735]'
              }`}>
                Automations
              </p>
            </div>
            {activeView === 'automations' && (
              <div aria-hidden="true" className="absolute border-[#23a455] border-b-3 border-solid inset-0 pointer-events-none" />
            )}
          </button>

          <div className="flex-[1_0_0] h-[2px] min-h-px min-w-px" />
        </div>
      </div>

      {/* Content Area */}
      {activeView === 'messages' ? (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 lg:p-6 min-h-0" style={{ backgroundColor: '#FFFFFF' }}>
            <div className="space-y-4">
              {messages.length > 0 ? (
                messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sender === 'agent' ? 'justify-end' : 'justify-start'}`}>
                    {msg.type === 'call-record' && msg.callData ? (
                      <CallRecordMessage
                        callType={msg.callData.callType}
                        duration={msg.callData.duration}
                        audioLength={msg.callData.audioLength}
                        callId={msg.id}
                        onGenerateSummary={handleGenerateSummary}
                      />
                    ) : (
                      <ChatBubble sender={msg.sender} channel={selectedChat.channel} timestamp={msg.timestamp}>
                        {msg.text}
                      </ChatBubble>
                    )}
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <div className="text-center">
                    <p className="text-lg mb-2">No messages yet</p>
                    <p className="text-sm">Start a conversation with {selectedChat.name}</p>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Area - Fixed to bottom */}
          <ChatComposer channel={selectedChat.channel} onSend={onSendMessage} phoneNumber={getPhoneNumber()} />
        </>
      ) : activeView === 'summary' ? (
        <div className="flex-1 overflow-y-auto">
          <Frame6 />
        </div>
      ) : (
        <CallTranscriptionView 
          selectedCallId={selectedCallId}
          generatedSummaries={generatedSummaries}
          setGeneratedSummaries={setGeneratedSummaries}
          generatedTranscriptions={generatedTranscriptions}
          setGeneratedTranscriptions={setGeneratedTranscriptions}
          generatingSummaries={generatingSummaries}
          setGeneratingSummaries={setGeneratingSummaries}
        />
      )}
    </div>
  );
}
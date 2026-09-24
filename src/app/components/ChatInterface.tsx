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
import svgPaths from '../imports/svg-mgoudhpi27';
import svgPathsTab from '../imports/svg-x39h9bo7e8';
import svgPathsCall from '../imports/svg-tf3l034z87';
import svgPathsSummary from '../imports/svg-z6zwjmgta2';
import Messenger from '../imports/Messenger';
import Frame6 from '../imports/Frame536';
import { CALL_TRANSCRIPTIONS, DEFAULT_TRANSCRIPTION, CallTranscriptEntry } from '../data/callTranscriptions';
import Frame1984077888 from '../imports/Frame1984077888-10094-45';
import InboundCall from '../imports/InboundCall';
import OutboundCall from '../imports/OutboundCall';
import { CallRecordMessage } from './CallRecordMessage';

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
function IconWrapper({ children, size = "size-5" }: { children: React.ReactNode; size?: string }) {
  return (
    <div className={`relative shrink-0 ${size}`}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        {children}
      </svg>
    </div>
  );
}

// Individual action icons
function ChatbotIcon() {
  return (
    <IconWrapper>
      <g id="Chatbot">
        <g>
          <path
            d={svgPaths.p3098af80}
            stroke="#353735"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.2"
          />
          <path
            d={svgPaths.pa539d80}
            stroke="#353735"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.2"
          />
        </g>
        <g>
          <path
            d={svgPaths.p3c136f80}
            stroke="#353735"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeMiterlimit="10"
            strokeWidth="1.2"
          />
          <path
            d={svgPaths.pcad0880}
            stroke="#353735"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeMiterlimit="10"
            strokeWidth="1.2"
          />
        </g>
        <path d={svgPaths.p23acc2d0} fill="#353735" />
        <line stroke="#353735" strokeWidth="1.2" x1="10.2" x2="10.2" y1="2.4" y2="5.6" />
      </g>
    </IconWrapper>
  );
}

function QuickReplyIcon() {
  return (
    <IconWrapper>
      <path d={svgPaths.p1f302180} fill="#353735" />
    </IconWrapper>
  );
}

function TemplateIcon() {
  return (
    <IconWrapper>
      <g>
        <path
          d={svgPaths.p2c6b0400}
          stroke="#353735"
          strokeLinejoin="round"
          strokeMiterlimit="10"
        />
        <path
          d={svgPaths.p8208d00}
          stroke="#353735"
          strokeLinejoin="round"
          strokeMiterlimit="10"
        />
        <path
          d={svgPaths.p2eaa9f00}
          stroke="#353735"
          strokeLinejoin="round"
          strokeMiterlimit="10"
        />
      </g>
    </IconWrapper>
  );
}

function AttachIcon() {
  return (
    <IconWrapper>
      <path d={svgPaths.p3ef67500} fill="#353735" />
    </IconWrapper>
  );
}

function EmojiIcon() {
  return (
    <div className="relative shrink-0 size-5">
      <div className="absolute inset-[11.458%]">
        <div className="absolute bottom-[-4.054%] left-[-4.054%] right-[-4.054%] top-[-4.054%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
            <path
              d={svgPaths.p192eed80}
              stroke="#353735"
              strokeMiterlimit="10"
              strokeWidth="1.25"
            />
            <path
              d="M6.83333 6H5.16667"
              stroke="#353735"
              strokeLinecap="round"
              strokeMiterlimit="10"
              strokeWidth="1.25"
            />
            <path
              d="M12.25 6H10.5833"
              stroke="#353735"
              strokeLinecap="round"
              strokeMiterlimit="10"
              strokeWidth="1.25"
            />
            <path
              d={svgPaths.p1ec8f320}
              stroke="#353735"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeMiterlimit="10"
              strokeWidth="1.25"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

function StickerIcon() {
  return (
    <div className="relative shrink-0 size-5">
      <div className="absolute bottom-[11.458%] left-[13.542%] right-[9.683%] top-[11.766%]">
        <div className="absolute bottom-[-4.07%] left-[-4.07%] right-[-4.07%] top-[-4.07%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17 17">
            <path
              d={svgPaths.p28b19300}
              stroke="#353735"
              strokeMiterlimit="10"
              strokeWidth="1.25"
            />
            <path
              d={svgPaths.p395db00}
              stroke="#353735"
              strokeMiterlimit="10"
              strokeWidth="1.25"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

// Send button with channel-specific styling
function SendButtonIcon({ channel }: { channel: string }) {
  // SMS and RCS button
  if (channel === 'SMS' || channel === 'RCS') {
    return (
      <div className="bg-[#FD7000] relative rounded-[5px] shrink-0">
        <div className="flex flex-row items-center overflow-clip relative size-full">
          <div className="flex flex-row gap-1.5 items-center px-2.5 py-1.5 relative">
            <div className="relative size-4">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
                <path d="M12.3846 1L3.6154 1C3.1873 1.0012 2.7772 1.1706 2.4745 1.4712C2.1718 1.7718 2.0012 2.1791 2 2.6042L2 8.1042C2.0012 8.5292 2.1718 8.9366 2.4745 9.2371C2.7772 9.5377 3.1873 9.7071 3.6154 9.7083L4.7692 9.7083L4.7692 12L7.4727 9.7616C7.5142 9.7272 7.5666 9.7083 7.6207 9.7083L12.3846 9.7083C12.8127 9.7071 13.2228 9.5377 13.5255 9.2371C13.8282 8.9366 13.9988 8.5292 14 8.1042L14 2.6042C13.9988 2.1791 13.8282 1.7718 13.5255 1.4712C13.2228 1.1706 12.8127 1.0012 12.3846 1Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="font-['Inter:Semi_Bold',_sans-serif] font-semibold text-white text-[14px] leading-[20px]">
              Send
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Instagram button
  if (channel === 'Instagram') {
    return (
      <div className="bg-[#604FC6] relative rounded-[5px] shrink-0">
        <div className="flex flex-row items-center overflow-clip relative size-full">
          <div className="flex flex-row gap-1.5 items-center px-2.5 py-1.5 relative">
            <div className="relative size-4">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
                <g clipPath="url(#clip0_instagram)">
                  <path fillRule="evenodd" clipRule="evenodd" d="M7 9.75C8.933 9.75 10.5 8.183 10.5 6.25C10.5 4.317 8.933 2.75 7 2.75C5.067 2.75 3.5 4.317 3.5 6.25C3.5 8.183 5.067 9.75 7 9.75ZM7 8.5833C8.2886 8.5833 9.3333 7.5386 9.3333 6.25C9.3333 4.9613 8.2886 3.9167 7 3.9167C5.7113 3.9167 4.6667 4.9613 4.6667 6.25C4.6667 7.5386 5.7113 8.5833 7 8.5833Z" fill="white"/>
                  <path d="M10.5013 2.1666C10.1791 2.1666 9.918 2.4278 9.918 2.75C9.918 3.0721 10.1791 3.3333 10.5013 3.3333C10.8235 3.3333 11.0846 3.0721 11.0846 2.75C11.0846 2.4278 10.8235 2.1666 10.5013 2.1666Z" fill="white"/>
                  <path fillRule="evenodd" clipRule="evenodd" d="M0.96351 1.7444C0.58203 2.4931 0.58203 3.4732 0.58203 5.4334V7.0667C0.58203 9.0269 0.58203 10.007 0.96351 10.7556C1.2991 11.4142 1.8345 11.9497 2.4931 12.2852C3.2418 12.6667 4.2219 12.6667 6.182 12.6667H7.8154C9.7755 12.6667 10.7557 12.6667 11.5043 12.2852C12.1629 11.9497 12.6983 11.4142 13.0339 10.7556C13.4154 10.007 13.4154 9.0269 13.4154 7.0667V5.4334C13.4154 3.4732 13.4154 2.4931 13.0339 1.7444C12.6983 1.0858 12.1629 0.55041 11.5043 0.21485C10.7557 -0.16663 9.7755 -0.16663 7.8154 -0.16663H6.182C4.2219 -0.16663 3.2418 -0.16663 2.4931 0.21485C1.8345 0.55041 1.2991 1.0858 0.96351 1.7444ZM7.8154 1H6.182C5.1827 1 4.5033 1.001 3.9782 1.0438C3.4668 1.0856 3.2052 1.1614 3.0227 1.2544C2.5837 1.4781 2.2267 1.835 2.003 2.2741C1.91 2.4565 1.8343 2.7181 1.7925 3.2296C1.7496 3.7547 1.7487 4.434 1.7487 5.4334V7.0667C1.7487 8.0661 1.7496 8.7454 1.7925 9.2705C1.8343 9.782 1.91 10.0436 2.003 10.226C2.2267 10.6651 2.5837 11.022 3.0227 11.2457C3.2052 11.3387 3.4668 11.4145 3.9782 11.4562C4.5033 11.4991 5.1827 11.5 6.182 11.5H7.8154C8.8147 11.5 9.494 11.4991 10.0191 11.4562C10.5307 11.4145 10.7922 11.3387 10.9747 11.2457C11.4137 11.022 11.7707 10.6651 11.9944 10.226C12.0873 10.0436 12.1631 9.782 12.2049 9.2705C12.2478 8.7454 12.2487 8.0661 12.2487 7.0667V5.4334C12.2487 4.434 12.2478 3.7547 12.2049 3.2296C12.1631 2.7181 12.0873 2.4565 11.9944 2.2741C11.7707 1.835 11.4137 1.4781 10.9747 1.2544C10.7922 1.1614 10.5307 1.0856 10.0191 1.0438C9.494 1.001 8.8147 1 7.8154 1Z" fill="white"/>
                </g>
                <defs>
                  <clipPath id="clip0_instagram">
                    <rect width="14" height="14" fill="white"/>
                  </clipPath>
                </defs>
              </svg>
            </div>
            <div className="font-['Inter:Semi_Bold',_sans-serif] font-semibold text-white text-[14px] leading-[20px]">
              Send
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Messenger button
  if (channel === 'Messenger') {
    return (
      <div className="bg-[#1766D4] relative rounded-[5px] shrink-0">
        <div className="flex flex-row items-center overflow-clip relative size-full">
          <div className="flex flex-row gap-1.5 items-center px-2.5 py-1.5 relative">
            <div className="relative size-4">
              <Messenger />
            </div>
            <div className="font-['Inter:Semi_Bold',_sans-serif] font-semibold text-white text-[14px] leading-[20px]">
              Send
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default WhatsApp button
  return (
    <div className="bg-[#23a455] relative rounded-[5px] shrink-0">
      <div className="flex flex-row items-center overflow-clip relative size-full">
        <div className="flex flex-row gap-1.5 items-center px-2.5 py-1.5 relative">
          <div className="relative size-4">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
              <path d={svgPaths.p3cc4a300} fill="white" />
            </svg>
          </div>
          <div className="font-['Inter:Semi_Bold',_sans-serif] font-semibold text-white text-[14px] leading-[20px]">
            Send
          </div>
        </div>
      </div>
    </div>
  );
}

// Action buttons row
function ActionButtons({ onSendMessage, message, channel }: { onSendMessage: () => void; message: string; channel: string }) {
  return (
    <div className="flex flex-row items-center justify-between w-full">
      <div className="flex flex-row gap-3 items-center">
        <ChatbotIcon />
        <QuickReplyIcon />
        <TemplateIcon />
        <AttachIcon />
        <EmojiIcon />
        <StickerIcon />
      </div>
      <button 
        onClick={onSendMessage}
        disabled={!message.trim()}
        className="disabled:opacity-50"
      >
        <SendButtonIcon channel={channel} />
      </button>
    </div>
  );
}

// Channel indicator with WhatsApp icon and channel label
function ChannelIndicator({ channel }: { channel: string }) {
  const getChannelLabel = (channel: string) => {
    switch (channel) {
      case 'WhatsApp':
        return 'WhatsApp';
      case 'Instagram':
        return 'Instagram';
      case 'Messenger':
        return 'Messenger';
      case 'Broadcast':
        return 'Broadcast';
      default:
        return 'Chat';
    }
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'WhatsApp':
        return (
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
            <g id="WhatsApp">
              <path
                clipRule="evenodd"
                d={svgPaths.p2fd5d080}
                fill="white"
                fillRule="evenodd"
              />
              <path
                clipRule="evenodd"
                d={svgPaths.p33ae7500}
                fill="white"
                fillRule="evenodd"
              />
              <path
                clipRule="evenodd"
                d={svgPaths.pabcc840}
                fill="#CFD8DC"
                fillRule="evenodd"
              />
              <path
                clipRule="evenodd"
                d={svgPaths.pa265370}
                fill="#40C351"
                fillRule="evenodd"
              />
              <path
                clipRule="evenodd"
                d={svgPaths.p3ea1cf00}
                fill="white"
                fillRule="evenodd"
              />
            </g>
          </svg>
        );
      case 'Instagram':
        return (
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
            <circle cx="8" cy="8" r="6" fill="#E4405F" />
            <circle cx="8" cy="8" r="3" fill="white" />
            <circle cx="11" cy="5" r="1" fill="white" />
          </svg>
        );
      case 'Messenger':
        return (
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
            <circle cx="8" cy="8" r="6" fill="#0084FF" />
            <path d="M5 9l2-2 2 2 3-3" stroke="white" strokeWidth="1.5" fill="none" />
          </svg>
        );
      default:
        return (
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
            <circle cx="8" cy="8" r="6" fill="#6B7280" />
            <circle cx="8" cy="8" r="2" fill="white" />
          </svg>
        );
    }
  };

  return (
    <div className="relative shrink-0">
      <div className="flex flex-row gap-0.5 items-center">
        <div className="relative size-4">
          {getChannelIcon(channel)}
        </div>
        <div className="font-['Inter:Regular',_sans-serif] font-normal text-[#353735] text-[12px] leading-[16px]">
          {getChannelLabel(channel)}
        </div>
      </div>
    </div>
  );
}

// Back arrow icon
function BackArrow() {
  return (
    <div className="flex items-center justify-center relative shrink-0">
      <div className="flex-none rotate-[180deg]">
        <div className="relative size-4">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
            <path
              d={svgPaths.p117ac380}
              stroke="#848A86"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d={svgPaths.p1a36fd80}
              stroke="#848A86"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

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
  const [message, setMessage] = useState('');
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

  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

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

  // Function to get chat bubble background color based on channel
  const getChatBubbleColor = (channel: string) => {
    switch (channel) {
      case 'Instagram':
        return '#DAD4FF';
      case 'Messenger':
        return '#D9E9FF';
      case 'SMS':
      case 'RCS':
        return '#FDE4CF';
      case 'WhatsApp':
      default:
        return '#DCF0E4';
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
                      <div 
                        className={`max-w-xs lg:max-w-md px-3 lg:px-4 py-2 rounded-lg ${
                          msg.sender === 'agent' 
                            ? 'text-gray-900 rounded-tr-none' 
                            : 'bg-white text-gray-900 border border-gray-200 rounded-tl-none'
                        }`}
                        style={msg.sender === 'agent' ? { backgroundColor: getChatBubbleColor(selectedChat.channel), color: '#333333' } : {}}
                      >
                        <p className="text-[14px]">{msg.text}</p>
                        <p 
                          className={`text-xs mt-1 ${
                            msg.sender === 'agent' ? '' : 'text-gray-500'
                          }`}
                          style={msg.sender === 'agent' ? { color: '#333333', opacity: 0.7 } : {}}
                        >
                          {msg.timestamp}
                        </p>
                      </div>
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
          <div className="flex-shrink-0 bg-white border-t border-gray-100">
            {/* Channel Header */}
            <div className="bg-white relative rounded-tl-[8px] rounded-tr-[8px] shrink-0 w-full border-b border-gray-100">
              <div className="flex flex-row items-end relative size-full">
                {selectedChat.channel !== 'Instagram' && selectedChat.channel !== 'Messenger' && selectedChat.channel !== 'SMS' && selectedChat.channel !== 'RCS' && (
                  <div className="flex flex-row gap-2.5 items-end p-[8px] relative w-full">
                    <div className="flex flex-row gap-1 items-center">
                      <BackArrow />
                      <div className="flex flex-row gap-1 items-center">
                        <ChannelIndicator channel={selectedChat.channel} />
                        <div className="font-['Inter:Regular',_sans-serif] font-normal text-[#848a86] text-[12px] leading-[16px]">
                          {getPhoneNumber()}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Text Input and Action Buttons */}
            <div className="p-4">
              <div className="flex flex-col gap-2">
                {/* Text Input */}
                <div className="flex items-end space-x-2">
                  <div className="flex-1">
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder={`Type your message here or press "/" key for quick replies`}
                      className="w-full px-3 py-2 rounded-lg resize-none focus:outline-none bg-gray-50"
                      rows={1}
                      style={{ minHeight: '40px', maxHeight: '120px' }}
                    />
                  </div>
                </div>
                
                {/* Action Buttons */}
                <ActionButtons onSendMessage={handleSendMessage} message={message} channel={selectedChat.channel} />
              </div>
            </div>
          </div>
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
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import TopNavigation from './components/TopNavigation';
import { SideNavigation } from './components/SideNavigation';
import { Sidebar } from './components/Sidebar';
import { ChatList } from './components/ChatList';
import { ContactInfo } from './components/ContactInfo';
import { ChatInterface } from './components/ChatInterface';
import { Settings } from './components/Settings';
import { DateFilter, DateRange } from './components/DateFilter';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from './components/ui/resizable';
import { CallWidget } from './components/CallWidget';
import { ScorecardBuilder } from './components/scorecard/ScorecardBuilder';
import { VoipDialer } from './components/VoipDialer';
import { AstraAdoptionProvider, useAstraAdoption } from './lib/AstraAdoptionContext';
import { AstraNudgeModal } from './components/AstraNudgeModal';
import { AstraDevSwitcher } from './components/AstraDevSwitcher';
import { AstraConversation } from './components/AstraConversation';
import { AstraVoiceCall } from './components/AstraVoiceCall';
import { VoipCallDetail } from './components/VoipCallDetail';
import { VoipContactInfo } from './components/VoipContactInfo';
import { VOIP_CALLS } from './data/voipCalls';
import { Toaster } from 'sonner';

// Types
interface Chat {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  date: Date;
  status: 'Open' | 'Solved' | 'Broadcast';
  channel: 'WhatsApp' | 'Instagram' | 'Messenger' | 'SMS' | 'RCS' | 'Broadcast';
  isOnline: boolean;
  unread: boolean;
  category: string;
}

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

interface ContactInfoData {
  name: string;
  phoneNumber: string;
  displayName: string;
  username: string;
  source: string;
  attributes: {
    tracking_url: string;
    discount_code: string;
  };
}

interface ChatCounts {
  all: number;
  whatsapp: number;
  whatsappCalling: number;
  voip: number;
  instagram: number;
  messenger: number;
  sms: number;
  rcs: number;
}

// Mock Data
const CHATS: Chat[] = [
  {
    id: '1',
    name: 'Priya Sharma',
    avatar: 'PS',
    lastMessage: 'Hey, I need help with my order',
    timestamp: '2:30 PM',
    date: new Date('2024-02-20T14:30:00'),
    status: 'Open',
    channel: 'WhatsApp',
    isOnline: true,
    unread: true,
    category: 'sales'
  },
  {
    id: '2',
    name: 'Rahul Mehta',
    avatar: 'RM',
    lastMessage: 'Thanks for the update!',
    timestamp: '1:45 PM',
    date: new Date('2024-02-20T13:45:00'),
    status: 'Solved',
    channel: 'Instagram',
    isOnline: false,
    unread: false,
    category: 'support'
  },
  {
    id: '3',
    name: 'Addison Smith',
    avatar: 'AS',
    lastMessage: 'Can we schedule a call?',
    timestamp: '12:15 PM',
    date: new Date('2024-02-20T12:15:00'),
    status: 'Open',
    channel: 'WhatsApp',
    isOnline: true,
    unread: true,
    category: 'support'
  },
  {
    id: '4',
    name: 'Sarah Johnson',
    avatar: 'SJ',
    lastMessage: 'Thank you for your help',
    timestamp: '11:30 AM',
    date: new Date('2024-02-20T11:30:00'),
    status: 'Solved',
    channel: 'WhatsApp',
    isOnline: false,
    unread: false,
    category: 'support'
  },
  {
    id: '5',
    name: 'April Boyer',
    avatar: 'AB',
    lastMessage: 'Missed call',
    timestamp: '1:45 PM',
    date: new Date('2024-02-20T13:45:00'),
    status: 'Open',
    channel: 'WhatsApp',
    isOnline: false,
    unread: true,
    category: 'support'
  },
  {
    id: '6',
    name: 'Marcus Allen',
    avatar: 'MA',
    lastMessage: 'Looking forward to it!',
    timestamp: '10:15 AM',
    date: new Date('2024-02-20T10:15:00'),
    status: 'Open',
    channel: 'WhatsApp',
    isOnline: true,
    unread: false,
    category: 'sales'
  },
  {
    id: '7',
    name: 'David Chen',
    avatar: 'DC',
    lastMessage: 'Perfect, thanks!',
    timestamp: '2:00 PM',
    date: new Date('2024-02-20T14:00:00'),
    status: 'Solved',
    channel: 'WhatsApp',
    isOnline: false,
    unread: false,
    category: 'support'
  }
];

const MESSAGES: Record<string, Message[]> = {
  '1': [
    { 
      id: 'call-1', 
      text: '',
      sender: 'agent', 
      timestamp: '2:25 PM',
      type: 'call-record',
      callData: {
        callType: 'outbound',
        duration: '13 mins',
        audioLength: '00:37'
      }
    },
    { id: '1', text: 'Hey, I need help with my order', sender: 'customer', timestamp: '2:30 PM' },
    { id: '2', text: 'Of course! I\'d be happy to help. What\'s your order number?', sender: 'agent', timestamp: '2:31 PM' }
  ],
  '2': [
    { id: '1', text: 'Thanks for the update!', sender: 'customer', timestamp: '1:45 PM' },
    { id: '2', text: 'You\'re welcome! Let me know if you need anything else.', sender: 'agent', timestamp: '1:46 PM' }
  ]
};

const CONTACT_INFO: Record<string, ContactInfoData> = {
  '1': {
    name: 'Priya Sharma',
    phoneNumber: '+91 98765 43210',
    displayName: 'Priya S',
    username: '@priya_sharma',
    source: 'Instagram',
    attributes: {
      tracking_url: 'https://example.com/track',
      discount_code: 'SAVE20'
    }
  },
  '2': {
    name: 'Rahul Mehta',
    phoneNumber: '+91 87654 32109',
    displayName: 'Rahul M',
    username: '@rahul_mehta',
    source: 'WhatsApp',
    attributes: {
      tracking_url: 'https://example.com/track',
      discount_code: 'FIRST10'
    }
  }
};

function TeamInbox() {
  const {
    iteration, segment, lowPickup, afterHours, requestNudge, pendingChannel, clearPendingChannel,
    astraPageOpen, closeAstraPage, astraCallOpen, endAstraCall,
  } = useAstraAdoption();
  const [selectedView, setSelectedView] = useState<'home' | 'settings'>('home');

  // The demo controls ask for a channel so a surface is shown in context
  // rather than over whatever happened to be open.
  useEffect(() => {
    if (!pendingChannel) return;
    setSelectedChannel(pendingChannel);
    clearPendingChannel();
  }, [pendingChannel, clearPendingChannel]);

  // Contextual nudges arrive where the PRD puts them — in the Team Inbox, while
  // someone is looking at the call log. The morning-after nudge wins when both
  // qualify: it greets you on the first load of the day. requestNudge applies
  // the fatigue policy, so this asking every render costs nothing.
  useEffect(() => {
    // Iteration 2 never interrupts — Astra waits in the call log instead.
    if (iteration !== 1) return;
    const trigger = afterHours.fires ? 'after_hours' : lowPickup.fires ? 'low_pickup_rate' : null;
    if (!trigger) return;
    // Let the inbox paint first; landing on a cold modal reads as an error.
    const id = window.setTimeout(() => requestNudge(trigger), 1200);
    return () => window.clearTimeout(id);
  }, [iteration, afterHours.fires, lowPickup.fires, requestNudge]);
  const [selectedChannel, setSelectedChannel] = useState<string>('All Channels');
  const [selectedChatId, setSelectedChatId] = useState<string | null>('1');
  const [selectedCallId, setSelectedCallId] = useState<string | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState<DateRange>({ from: undefined, to: undefined });
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [showCallWidget, setShowCallWidget] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('All Chats');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [customFilters, setCustomFilters] = useState<any[]>([]);
  const [showScorecardBuilder, setShowScorecardBuilder] = useState(false);
  const [showVoipDialer, setShowVoipDialer] = useState(false);
  const [voipDialerNumber, setVoipDialerNumber] = useState('');

  const filteredChats = useMemo(() => {
    return CHATS.filter(chat => {
      const matchesSearch = chat.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesChannel = selectedChannel === 'All Channels' || chat.channel === selectedChannel;
      const matchesDateRange = 
        (!dateRange.from || chat.date >= dateRange.from) &&
        (!dateRange.to || chat.date <= dateRange.to);
      const matchesStatus = statusFilter.length === 0 || statusFilter.includes(chat.status);
      
      return matchesSearch && matchesChannel && matchesDateRange && matchesStatus;
    });
  }, [searchQuery, selectedChannel, dateRange, statusFilter]);

  const chatCounts: ChatCounts = useMemo(() => ({
    all: CHATS.length,
    whatsapp: CHATS.filter(c => c.channel === 'WhatsApp').length,
    whatsappCalling: 1,
    voip: 0,
    instagram: CHATS.filter(c => c.channel === 'Instagram').length,
    messenger: CHATS.filter(c => c.channel === 'Messenger').length,
    sms: CHATS.filter(c => c.channel === 'SMS').length,
    rcs: CHATS.filter(c => c.channel === 'RCS').length
  }), []);

  const selectedChat = selectedChatId ? CHATS.find(c => c.id === selectedChatId) : null;
  const messages = selectedChatId ? MESSAGES[selectedChatId] || [] : [];
  const contactInfo = selectedChatId ? CONTACT_INFO[selectedChatId] : null;

  // VoIP is an independent channel with its own center + contact panels.
  const isVoip = selectedChannel === 'VoIP';
  const selectedVoipCall = selectedCallId ? VOIP_CALLS.find(c => c.id === selectedCallId) : undefined;

  // Clear any selected call recording when the channel changes so a VoIP
  // call id can't leak into WhatsApp Calls (or vice versa).
  useEffect(() => {
    setSelectedCallId(undefined);
  }, [selectedChannel]);

  const handleSendMessage = useCallback((message: string) => {
    console.log('Sending message:', message);
  }, []);

  const handleEndCall = () => {
    setShowCallWidget(false);
  };

  const handleToggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleCustomFilterDelete = (filterId: string) => {
    setCustomFilters(prev => prev.filter(f => f.id !== filterId));
  };

  const handleCustomFilterApply = (filters: any[], showOldChatsFirst: boolean, saveAsCustom?: boolean, customFilterName?: string) => {
    console.log('Custom filter applied', filters);
  };

  const handleSelectChat = (chat: any) => {
    setSelectedChatId(chat.id);
    // Leaving a call record — return to the messages view
    setSelectedCallId(undefined);
    closeAstraPage();
  };

  const handleSelectCallTranscription = (chat: any, callId: string) => {
    // Select the chat and open the call recording + transcription in the
    // center content area (shared with WhatsApp Calls).
    setSelectedChatId(chat.id);
    setSelectedCallId(callId);
  };

  // Outbound VoIP call to a known contact — opens the dialer prefilled.
  const handleVoipCall = (phoneNumber: string) => {
    setVoipDialerNumber(phoneNumber);
    setShowVoipDialer(true);
  };

  const handleStartCall = () => {
    console.log('Starting call...');
    setShowCallWidget(true);
  };

  return (
    <div className="flex flex-col h-screen bg-[#f5f6fa] overflow-hidden">
      {/* App shell: global header, product rail, then the module in a card */}
      <TopNavigation />
      <div className="flex flex-1 min-h-0">
      <SideNavigation
        active={selectedView === 'settings' ? 'settings' : 'inbox'}
        onNavigate={(m) => {
          if (m === 'settings') setSelectedView('settings');
          if (m === 'inbox') setSelectedView('home');
        }}
      />
      <div className="flex flex-1 min-w-0 mr-[8px] bg-white border border-b-0 border-[#e7e9e8] rounded-t-[8px] overflow-hidden">
      {/* Sidebar */}
      <Sidebar 
        selectedFilter={selectedFilter}
        setSelectedFilter={setSelectedFilter}
        selectedChannel={selectedChannel}
        setSelectedChannel={setSelectedChannel}
        isCollapsed={isSidebarCollapsed}
        chatCounts={chatCounts}
        customFilters={customFilters}
        onCustomFilterDelete={handleCustomFilterDelete}
        onSettingsClick={() => setSelectedView('settings')}
        onOpenScorecardBuilder={() => setShowScorecardBuilder(true)}
        onOpenVoipDialer={() => { setVoipDialerNumber(''); setShowVoipDialer(true); }}
      />

      {/* Main Content */}
      <div className="flex flex-col flex-1 min-w-0">

        {/* Content Area */}
        {selectedView === 'settings' ? (
          <Settings onClose={() => setSelectedView('home')} />
        ) : (
          <ResizablePanelGroup direction="horizontal" className="flex-1">
            {/* Chat List Panel */}
            <ResizablePanel defaultSize={25} minSize={20} maxSize={35}>
              <div className="h-full flex flex-col bg-white border-r border-gray-200">
                <ChatList
                  chats={filteredChats}
                  selectedChat={selectedChat!}
                  onSelectChat={handleSelectChat}
                  isSidebarCollapsed={isSidebarCollapsed}
                  onToggleSidebar={handleToggleSidebar}
                  dateRange={dateRange}
                  onDateRangeChange={setDateRange}
                  onDateFilterClear={() => setDateRange({ from: undefined, to: undefined })}
                  onCustomFilterApply={handleCustomFilterApply}
                  selectedFilter={selectedFilter}
                  selectedChannel={selectedChannel}
                  allChats={CHATS}
                  onSelectCallTranscription={handleSelectCallTranscription}
                  onCallContact={handleVoipCall}
                  onSelectVoipCall={setSelectedCallId}
                />
              </div>
            </ResizablePanel>

            <ResizableHandle />

            {/* Center Content Panel */}
            <ResizablePanel defaultSize={50} minSize={40}>
              {isVoip ? (
                <VoipCallDetail call={selectedVoipCall} onCallContact={handleVoipCall} />
              ) : selectedChannel === 'WhatsApp Calls' && astraPageOpen ? (
                // Keyed on segment so switching customer restarts the thread with their numbers.
                <AstraConversation key={segment} />
              ) : selectedChat ? (
                <ChatInterface
                  selectedChat={selectedChat}
                  messages={messages}
                  onSendMessage={handleSendMessage}
                  onToggleContactInfo={() => {}}
                  isContactInfoVisible={true}
                  isMobile={false}
                  onStartCall={handleStartCall}
                  initialActiveView={selectedCallId ? 'transcription' : undefined}
                  initialSelectedCallId={selectedCallId}
                />
              ) : (
                <div className="h-full flex items-center justify-center bg-gray-50">
                  <p className="text-gray-500">Select a conversation to start messaging</p>
                </div>
              )}
            </ResizablePanel>

            <ResizableHandle />

            {/* Contact Info Panel */}
            <ResizablePanel defaultSize={25} minSize={20} maxSize={35}>
              {isVoip ? (
                <VoipContactInfo call={selectedVoipCall} />
              ) : selectedChat && contactInfo ? (
                <ContactInfo
                  contact={contactInfo}
                  chatId={selectedChatId!}
                />
              ) : (
                <div className="h-full flex items-center justify-center bg-gray-50 border-l border-gray-200">
                  <p className="text-gray-500">No contact selected</p>
                </div>
              )}
            </ResizablePanel>
          </ResizablePanelGroup>
        )}
      </div>

      </div>
      </div>

      {/* Call Widget Overlay */}
      {showCallWidget && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/40 z-40" />
          
          {/* Call Widget */}
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
            <CallWidget onEndCall={handleEndCall} />
          </div>
        </>
      )}

      {/* A call with Astra has its own voice UI */}
      {astraCallOpen && <AstraVoiceCall onEnd={endAstraCall} />}

      {/* Scorecard Builder Overlay */}
      {showScorecardBuilder && (
        <ScorecardBuilder onClose={() => setShowScorecardBuilder(false)} />
      )}

      {/* VoIP Dialer Overlay */}
      {showVoipDialer && (
        <VoipDialer
          initialNumber={voipDialerNumber}
          onClose={() => { setShowVoipDialer(false); setVoipDialerNumber(''); }}
        />
      )}

      <Toaster position="bottom-left" richColors />

      {/* Astra adoption surfaces */}
      <AstraNudgeModal />
      <AstraDevSwitcher />
    </div>
  );
}

export default function App() {
  return (
    <AstraAdoptionProvider>
      <TeamInbox />
    </AstraAdoptionProvider>
  );
}
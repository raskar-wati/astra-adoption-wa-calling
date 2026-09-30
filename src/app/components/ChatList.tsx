import React, { useState, useRef, useEffect } from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Calendar } from './ui/calendar';
import { Search, Filter, Plus, Menu, Calendar as CalendarIcon, ChevronLeft, ChevronRight, X, Phone, Download, Info, PhoneMissed, PhoneIncoming, PhoneOutgoing } from 'lucide-react';
import { DateRange } from './DateFilter';
import { FilterDialog } from './FilterDialog';
import ConversationListUnselected from '../imports/ConversationListUnselected';
import NewMessageIconContainer from '../imports/NewMessageIconContainer';
import WhatsApp from '../imports/WhatsApp';
import { CallDetailPanel } from './CallDetailPanel';
import svgPaths from '../imports/svg-etfg2lzkn3';
import { VoipAvatar } from './VoipAvatar';
import { AstraStarButton } from './AstraStarButton';
import { AstraPinnedCallRow } from './AstraPinnedCallRow';
import { MissedCallsBanner } from './MissedCallsBanner';
import { useAstraAdoption } from '../lib/AstraAdoptionContext';
import { CallHandlerLabel } from './CallHandlerLabel';
import { VoipCallButton } from './VoipCallButton';
import { voipCallerLabel, VOIP_CALLS } from '../data/voipCalls';

// Mock call history data for each contact
const CALL_HISTORY_DATA: Record<string, any[]> = {
  'Addison Smith': [
    {
      id: 'hist-1',
      date: 'Feb 2, 2026',
      time: '2:30 PM',
      type: 'inbound',
      status: 'connected',
      duration: '0m 15s',
      hasTranscription: false,
      notes: 'Currently incoming...'
    },
    {
      id: 'hist-2',
      date: 'Feb 2, 2026',
      time: '10:15 AM',
      type: 'outbound',
      status: 'connected',
      duration: '5m 32s',
      hasTranscription: true
    },
    {
      id: 'hist-3',
      date: 'Feb 1, 2026',
      time: '4:45 PM',
      type: 'inbound',
      status: 'connected',
      duration: '3m 12s',
      hasTranscription: true,
      notes: 'Customer requested callback for technical support'
    },
    {
      id: 'hist-4',
      date: 'Feb 1, 2026',
      time: '9:20 AM',
      type: 'missed',
      status: 'no-answer'
    },
    {
      id: 'hist-5',
      date: 'Jan 31, 2026',
      time: '2:10 PM',
      type: 'outbound',
      status: 'connected',
      duration: '8m 45s',
      hasTranscription: true
    }
  ],
  'Marcus Allen': [
    {
      id: 'hist-6',
      date: 'Feb 2, 2026',
      time: '12:00 PM',
      type: 'outbound',
      status: 'connected',
      duration: '4m 12s',
      hasTranscription: true
    },
    {
      id: 'hist-7',
      date: 'Feb 1, 2026',
      time: '3:30 PM',
      type: 'outbound',
      status: 'no-answer'
    },
    {
      id: 'hist-8',
      date: 'Jan 30, 2026',
      time: '11:15 AM',
      type: 'inbound',
      status: 'connected',
      duration: '2m 30s',
      hasTranscription: true
    }
  ],
  'April Boyer': [
    {
      id: 'hist-9',
      date: 'Feb 1, 2026',
      time: '5:45 PM',
      type: 'missed',
      status: 'no-answer',
      notes: 'Need to call back - important order inquiry'
    },
    {
      id: 'hist-10',
      date: 'Jan 31, 2026',
      time: '1:20 PM',
      type: 'outbound',
      status: 'connected',
      duration: '6m 15s',
      hasTranscription: true
    },
    {
      id: 'hist-11',
      date: 'Jan 30, 2026',
      time: '10:00 AM',
      type: 'inbound',
      status: 'connected',
      duration: '3m 45s',
      hasTranscription: true
    }
  ],
  'Sarah Johnson': [
    {
      id: 'hist-12',
      date: 'Feb 2, 2026',
      time: '11:30 AM',
      type: 'unanswered',
      status: 'no-answer'
    },
    {
      id: 'hist-13',
      date: 'Feb 1, 2026',
      time: '2:15 PM',
      type: 'outbound',
      status: 'voicemail',
      notes: 'Left voicemail regarding account update'
    },
    {
      id: 'hist-14',
      date: 'Jan 29, 2026',
      time: '4:00 PM',
      type: 'inbound',
      status: 'connected',
      duration: '7m 20s',
      hasTranscription: true
    }
  ],
  'David Chen': [
    {
      id: 'hist-15',
      date: 'Feb 2, 2026',
      time: '2:45 PM',
      type: 'outbound',
      status: 'connected',
      duration: '12m 30s',
      hasTranscription: false,
      notes: 'Call in progress...'
    },
    {
      id: 'hist-16',
      date: 'Feb 1, 2026',
      time: '11:00 AM',
      type: 'inbound',
      status: 'connected',
      duration: '5m 15s',
      hasTranscription: true
    },
    {
      id: 'hist-17',
      date: 'Jan 31, 2026',
      time: '3:45 PM',
      type: 'outbound',
      status: 'connected',
      duration: '4m 50s',
      hasTranscription: true
    },
    {
      id: 'hist-18',
      date: 'Jan 30, 2026',
      time: '9:30 AM',
      type: 'missed',
      status: 'no-answer'
    }
  ]
};

// Mock WhatsApp call log. One entry per interaction — a contact who called
// three times appears three times; there is no per-contact drill-in.
// `canCallBack` is false once the contact's calling window has closed, which
// greys out the call-back button.
const MOCK_CALLS = [
  { id: 'call-1', name: 'Vikram', phoneNumber: '+919812345670', type: 'missed' as const, status: 'Missed call', agent: 'Melvis', time: '9:10 PM', canCallBack: true },
  { id: 'call-2', name: 'Jasmine', phoneNumber: '+919823456781', type: 'outgoing' as const, status: 'Outbound call', agent: 'Rohit', time: '10:15 AM', canCallBack: true },
  { id: 'call-3', name: 'Alex Butter', phoneNumber: '+15551234567', type: 'unanswered' as const, status: 'Unanswered call', agent: 'Maria', time: '1:45 PM', canCallBack: false },
  { id: 'call-4', name: 'Sofia V', phoneNumber: '+15559876543', type: 'missed' as const, status: 'Missed call', agent: 'Dylan', time: '3:30 PM', canCallBack: false },
  { id: 'call-5', name: 'Liam Nilson', phoneNumber: '+15554567890', type: 'incoming' as const, status: 'Inbound call', agent: 'Nia', time: '2:00 PM', canCallBack: true },
  { id: 'call-6', name: 'Zara Zara', phoneNumber: '+971501234567', type: 'missed' as const, status: 'Missed call', agent: 'Omar', time: '4:20 PM', canCallBack: true },
  { id: 'call-7', name: 'Eli Goodlink', phoneNumber: '+15557654321', type: 'outgoing' as const, status: 'Outbound call', agent: 'Tara', time: '11:00 AM', canCallBack: false },
  { id: 'call-8', name: '+91876543210', phoneNumber: '+91876543210', type: 'outgoing' as const, status: 'Outbound call', agent: 'Becca', time: '5:50 PM', canCallBack: true },
  { id: 'call-9', name: 'Noah', phoneNumber: '+15553456789', type: 'incoming' as const, status: 'Inbound call', agent: 'Chloe', time: '6:30 PM', canCallBack: false },
];

// Mock VoIP call records (external VoIP API channel). Each maps to a
// transcription entry (voip-N) rendered in the center content area.
interface Call {
  id: string;
  name: string;
  phoneNumber: string;
  type: 'incoming' | 'missed' | 'outgoing' | 'unanswered' | 'active';
  status?: string;
  avatar?: string;
}

interface FilterSegment {
  attribute: string;
  operation: string;
  value: string;
}

interface ChatListProps {
  chats: Array<{
    id: string;
    name: string;
    avatar: string;
    lastMessage: string;
    timestamp: string;
    date: Date;
    status: string;
    channel: string;
    isOnline: boolean;
    unread: boolean;
    category: string;
  }>;
  selectedChat: {
    id: string;
    name: string;
    avatar: string;
    lastMessage: string;
    timestamp: string;
    date: Date;
    status: string;
    channel: string;
    isOnline: boolean;
    unread: boolean;
    category: string;
  };
  onSelectChat: (chat: any) => void;
  isSidebarCollapsed: boolean;
  onToggleSidebar: () => void;
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
  onDateFilterClear: () => void;
  onCustomFilterApply: (filters: FilterSegment[], showOldChatsFirst: boolean, saveAsCustom?: boolean, customFilterName?: string) => void;
  selectedFilter: string;
  selectedChannel: string;
  onSelectCallTranscription?: (chat: any, callId: string) => void;
  onCallContact?: (phoneNumber: string) => void;
  onSelectVoipCall?: (callId: string) => void;
  allChats?: Array<{
    id: string;
    name: string;
    avatar: string;
    lastMessage: string;
    timestamp: string;
    date: Date;
    status: string;
    channel: string;
    isOnline: boolean;
    unread: boolean;
    category: string;
  }>;
}

type PresetKey = 'today' | 'thisweek' | 'thismonth' | 'custom';

interface DatePreset {
  key: PresetKey;
  label: string;
  getRange: () => DateRange;
}

const DATE_PRESETS: DatePreset[] = [
  {
    key: 'today',
    label: 'Today',
    getRange: () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);
      return { from: today, to: endOfDay };
    }
  },
  {
    key: 'thisweek',
    label: 'This week',
    getRange: () => {
      const today = new Date();
      const startOfWeek = new Date(today);
      const day = today.getDay();
      const diff = today.getDate() - day + (day === 0 ? -6 : 1); // Monday as first day
      startOfWeek.setDate(diff);
      startOfWeek.setHours(0, 0, 0, 0);
      
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      endOfWeek.setHours(23, 59, 59, 999);
      
      return { from: startOfWeek, to: endOfWeek };
    }
  },
  {
    key: 'thismonth',
    label: 'This month',
    getRange: () => {
      const today = new Date();
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      startOfMonth.setHours(0, 0, 0, 0);
      
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      endOfMonth.setHours(23, 59, 59, 999);
      
      return { from: startOfMonth, to: endOfMonth };
    }
  },
  {
    key: 'custom',
    label: 'Custom',
    getRange: () => ({ from: undefined, to: undefined })
  }
];

export function ChatList({ 
  chats, 
  selectedChat, 
  onSelectChat, 
  isSidebarCollapsed, 
  onToggleSidebar,
  dateRange,
  onDateRangeChange,
  onDateFilterClear,
  onCustomFilterApply,
  selectedFilter,
  selectedChannel,
  onSelectCallTranscription,
  allChats,
  onCallContact,
  onSelectVoipCall
}: ChatListProps) {
  const [selectedTab, setSelectedTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isCustomFilterOpen, setIsCustomFilterOpen] = useState(false);
  const [customFilters, setCustomFilters] = useState<FilterSegment[]>([]);
  const [showOldChatsFirst, setShowOldChatsFirst] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<PresetKey | null>(null);
  const [tempRange, setTempRange] = useState<DateRange>({ from: undefined, to: undefined });
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isNewMessagePopoverOpen, setIsNewMessagePopoverOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [selectedCallDetail, setSelectedCallDetail] = useState<Call | null>(null);
  const [selectedCallRecordId, setSelectedCallRecordId] = useState<string | null>(null);
  const { iteration, closeAstraPage } = useAstraAdoption();

  // Check if WhatsApp functionality should be available
  const isWhatsAppFeatures = selectedChannel === 'WhatsApp';
  const isWhatsAppCalls = selectedChannel === 'WhatsApp Calls';
  const isVoipCalls = selectedChannel === 'VoIP';

  // Different tabs based on selected channel
  const tabs = isWhatsAppCalls
    ? ['All', 'Missed', 'Incoming']
    : isVoipCalls
    ? ['All', 'Incoming', 'Outgoing', 'Missed']
    : ['All', 'Open', 'Unread'];

  // Focus search input when search is expanded
  useEffect(() => {
    if (isSearchExpanded && searchInputRef.current) {
      // Add a small delay to ensure the animation has started
      const timeoutId = setTimeout(() => {
        searchInputRef.current?.focus();
      }, 150);
      return () => clearTimeout(timeoutId);
    }
  }, [isSearchExpanded]);

  // Handle search expand/collapse
  const handleSearchToggle = () => {
    if (isSearchExpanded) {
      // Closing search - clear query and collapse
      setSearchQuery('');
      setIsSearchExpanded(false);
    } else {
      // Opening search - expand
      setIsSearchExpanded(true);
    }
  };

  // Filter calls for WhatsApp Calls channel
  const filteredCalls = MOCK_CALLS.filter(call => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (!call.name.toLowerCase().includes(query) && 
          !call.phoneNumber.toLowerCase().includes(query)) {
        return false;
      }
    }

    // Tab filter for calls
    switch (selectedTab) {
      case 'All':
        return true;
      case 'Incoming':
        return call.type === 'incoming';
      case 'Outgoing':
        return call.type === 'outgoing';
      case 'Missed':
        return call.type === 'missed';
      default:
        return true;
    }
  });

  // Filter VoIP call records
  const filteredVoipCalls = VOIP_CALLS.filter(call => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (!call.name.toLowerCase().includes(query) &&
          !call.phoneNumber.toLowerCase().includes(query)) {
        return false;
      }
    }
    switch (selectedTab) {
      case 'Incoming':
        return call.type === 'incoming';
      case 'Outgoing':
        return call.type === 'outgoing';
      case 'Missed':
        return call.type === 'missed';
      default:
        return true;
    }
  });

  const filteredChats = chats.filter(chat => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (!chat.name.toLowerCase().includes(query) && 
          !chat.lastMessage.toLowerCase().includes(query)) {
        return false;
      }
    }

    // Tab filter
    switch (selectedTab) {
      case 'All':
        return true;
      case 'Open':
        return chat.status === 'Open';
      case 'Unread':
        return chat.unread;
      default:
        return true;
    }
  });

  const getActivePreset = (): PresetKey | null => {
    if (!dateRange.from || !dateRange.to) return null;

    for (const preset of DATE_PRESETS.slice(0, -1)) { // Exclude 'custom'
      const presetRange = preset.getRange();
      if (presetRange.from && presetRange.to && 
          dateRange.from.getTime() === presetRange.from.getTime() &&
          dateRange.to.getTime() === presetRange.to.getTime()) {
        return preset.key;
      }
    }
    return 'custom';
  };

  const handlePresetClick = (preset: DatePreset) => {
    if (preset.key === 'custom') {
      setSelectedPreset('custom');
    } else {
      const range = preset.getRange();
      onDateRangeChange(range);
      setSelectedPreset(preset.key);
      setIsFilterOpen(false);
    }
  };

  const handleDateSelect = (range: DateRange | undefined) => {
    if (range) {
      setTempRange(range);
      if (range.from && range.to) {
        onDateRangeChange(range);
        setSelectedPreset('custom');
      }
    }
  };

  const handleReset = () => {
    onDateFilterClear();
    setSelectedPreset(null);
    setTempRange({ from: undefined, to: undefined });
    setIsFilterOpen(false);
  };

  const handleCustomFilterApply = (filters: FilterSegment[], showOldFirst: boolean, saveAsCustom?: boolean, customFilterName?: string) => {
    setCustomFilters(filters);
    setShowOldChatsFirst(showOldFirst);
    // Pass to parent component for saving custom filters
    onCustomFilterApply(filters, showOldFirst, saveAsCustom, customFilterName);
  };

  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      if (direction === 'prev') {
        newMonth.setMonth(prev.getMonth() - 1);
      } else {
        newMonth.setMonth(prev.getMonth() + 1);
      }
      return newMonth;
    });
  };

  // Call handlers
  const handleDeclineCall = (callId: string) => {
    console.log(`Declining call from ${callId}`);
    // Here you would implement the decline logic
  };

  const handleExportCalls = () => {
    console.log('Exporting calls data');
    // Here you would implement the export logic
  };

  const handleAnswerCall = (callId: string) => {
    console.log(`Answering call from ${callId}`);
    // Find the corresponding chat and navigate to it
    const call = MOCK_CALLS.find(c => c.id === callId);
    console.log('Found call:', call);
    console.log('Available chats:', chats.map(c => ({ id: c.id, name: c.name, channel: c.channel })));
    
    if (call) {
      // Find the corresponding chat in the chats array
      const correspondingChat = chats.find(chat => chat.name === call.name);
      console.log('Found corresponding chat:', correspondingChat);
      
      if (correspondingChat) {
        // Switch to the appropriate channel first, then select the chat
        if (correspondingChat.channel !== selectedChannel) {
          // We need to switch channels - this should be handled by the parent
          console.log(`Switching from ${selectedChannel} to ${correspondingChat.channel}`);
        }
        console.log('Calling onSelectChat with:', correspondingChat);
        onSelectChat(correspondingChat);
      } else {
        console.log(`No chat found for call from ${call.name}`);
      }
    }
  };

  const handleCallClick = (call: any) => {
    setSelectedCallRecordId(call.id);
    closeAstraPage();
  };

  const handleChatClick = (chat: any) => {
    // Check if this contact has call history with transcriptions
    const callHistory = CALL_HISTORY_DATA[chat.name];
    
    if (callHistory && callHistory.length > 0) {
      // Find the most recent call with transcription
      const mostRecentCallWithTranscription = callHistory.find(call => call.hasTranscription);
      
      if (mostRecentCallWithTranscription && onSelectCallTranscription) {
        // If there's a call with transcription, show it
        onSelectCallTranscription(chat, mostRecentCallWithTranscription.id);
        return;
      }
    }
    
    // Otherwise, just select the chat normally
    onSelectChat(chat);
  };

  const isFilterActive = dateRange.from && dateRange.to;
  const activePreset = getActivePreset();
  const hasCustomFilters = customFilters.length > 0 && customFilters.some(f => 
    (f.attribute && f.attribute !== 'attribute') || f.operation || f.value
  );

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      {/* 56px header — its bottom line continues across every column */}
      <div className="h-[56px] shrink-0 flex items-center justify-between px-4 bg-white border-b border-[#e7e9e8] transition-all duration-300 ease-in-out">
        {!isSearchExpanded ? (
          <>
            {/* Default Header Layout */}
            <div 
              className={`flex items-center space-x-3 transition-all duration-300 ease-in-out ${
                isSearchExpanded 
                  ? 'opacity-0 scale-95 pointer-events-none absolute' 
                  : 'opacity-100 scale-100 pointer-events-auto relative'
              }`}
            >
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 transition-all duration-200"
                onClick={onToggleSidebar}
              >
                <Menu className="w-4 h-4" />
              </Button>
              
              <div className="flex flex-col">
                <h2 className="text-lg font-medium text-gray-900 truncate max-w-[200px] transition-all duration-200" title={isWhatsAppCalls ? 'WhatsApp Calls' : selectedFilter}>
                  {isWhatsAppCalls ? 'WhatsApp Calls' : selectedFilter}
                </h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  {isWhatsAppCalls
                    ? <>{MOCK_CALLS.length} Calls • <span className="font-semibold text-gray-700">{MOCK_CALLS.filter(call => call.type === 'missed').length} Missed</span></>
                    : isVoipCalls
                    ? `${filteredVoipCalls.length} Calls • ${filteredVoipCalls.filter(call => call.type === 'incoming').length} Incoming`
                    : `${filteredChats.length} Chats • ${filteredChats.filter(chat => chat.unread).length} Unread`
                  }
                </p>
              </div>
            </div>
            
            <div 
              className={`flex items-center transition-all duration-300 ease-in-out ${
                isSearchExpanded 
                  ? 'opacity-0 scale-95 pointer-events-none absolute right-4' 
                  : 'opacity-100 scale-100 pointer-events-auto relative'
              } ${isWhatsAppFeatures ? 'space-x-2' : 'space-x-1'}`}
            >
              {/* Search Button - Always available */}
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0 transition-all duration-200"
                onClick={handleSearchToggle}
              >
                <Search className="w-4 h-4 text-gray-500" />
              </Button>

              {/* Filter Button - Only for WhatsApp */}
              {isWhatsAppFeatures && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0 text-gray-500 relative transition-all duration-200"
                  onClick={() => setIsCustomFilterOpen(true)}
                >
                  <Filter className="w-4 h-4" />
                  {hasCustomFilters && (
                    <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></div>
                  )}
                </Button>
              )}
              
              {/* Export Button - Only for WhatsApp Calls */}
              {isWhatsAppCalls && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0 transition-all duration-200"
                >
                  <Download className="w-4 h-4 text-gray-500" />
                </Button>
              )}

              {/* Date Filter Popover - Always available */}
              <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <PopoverTrigger asChild>
                  
                </PopoverTrigger>
                <PopoverContent className="w-[420px] p-0" align="end">
                  <div className="flex">
                    {/* Left side - Presets */}
                    <div className="w-32 p-4 border-r border-gray-100 bg-gray-50/50">
                      <div className="space-y-1">
                        {DATE_PRESETS.map((preset) => (
                          <button
                            key={preset.key}
                            onClick={() => handlePresetClick(preset)}
                            className={`w-full text-left px-2 py-1.5 text-sm rounded-md transition-colors ${
                              (selectedPreset === preset.key || 
                               (activePreset === preset.key && !selectedPreset))
                                ? preset.key === 'custom' 
                                  ? 'bg-green-100 text-green-700' 
                                  : 'bg-green-100 text-green-700'
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>
                      
                      <div className="mt-4 pt-3 border-t border-gray-200">
                        <button
                          onClick={handleReset}
                          className="w-full text-left px-2 py-1.5 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                        >
                          Reset
                        </button>
                      </div>
                    </div>

                    {/* Right side - Calendar */}
                    <div className="flex-1 p-4">
                      {/* Calendar Header */}
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-medium text-gray-900">
                          {formatMonthYear(currentMonth)}
                        </h3>
                        <div className="flex items-center space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigateMonth('prev')}
                            className="h-8 w-8 p-0"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigateMonth('next')}
                            className="h-8 w-8 p-0"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Calendar */}
                      <Calendar
                        mode="range"
                        selected={dateRange.from && dateRange.to ? dateRange : tempRange}
                        onSelect={handleDateSelect}
                        month={currentMonth}
                        onMonthChange={setCurrentMonth}
                        className="rounded-md"
                        classNames={{
                          months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                          month: "space-y-4",
                          caption: "flex justify-center pt-1 relative items-center hidden", // Hide default navigation
                          caption_label: "text-sm font-medium",
                          nav: "space-x-1 flex items-center",
                          nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
                          nav_button_previous: "absolute left-1",
                          nav_button_next: "absolute right-1",
                          table: "w-full border-collapse space-y-1",
                          head_row: "flex",
                          head_cell: "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]",
                          row: "flex w-full mt-2",
                          cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                          day: "h-8 w-8 p-0 font-normal aria-selected:opacity-100 hover:bg-gray-100 rounded-md",
                          day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                          day_today: "bg-accent text-accent-foreground",
                          day_outside: "text-muted-foreground opacity-50",
                          day_disabled: "text-muted-foreground opacity-50",
                          day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
                          day_hidden: "invisible"
                        }}
                      />
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              
              {/* Plus Button - Only for WhatsApp */}
              {isWhatsAppFeatures && (
                <Popover open={isNewMessagePopoverOpen} onOpenChange={setIsNewMessagePopoverOpen}>
                  <PopoverTrigger asChild>
                    <button 
                      className="h-8 w-8 p-0 transition-all duration-200 hover:scale-100 hover:shadow-md rounded-md hover:bg-gray-100 flex items-center justify-center"
                    >
                      <div className="w-6 h-6">
                        <NewMessageIconContainer />
                      </div>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64 p-0" align="end">
                    <div className="p-3">
                      <h4 className="font-regular text-sm text-[rgba(80,84,81,1)] mb-3 text-[12px]">Select a number</h4>
                      <div className="space-y-2">
                        <button
                          onClick={() => {
                            setIsNewMessagePopoverOpen(false);
                            // Handle Support account selection
                          }}
                          className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors text-left"
                        >
                          <div className="w-4 h-4 flex-shrink-0">
                            <WhatsApp />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm text-gray-900">Support</div>
                          </div>
                          <div className="text-sm text-gray-500">+918765431290</div>
                        </button>
                        <button
                          onClick={() => {
                            setIsNewMessagePopoverOpen(false);
                            // Handle Sales account selection
                          }}
                          className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors text-left"
                        >
                          <div className="w-4 h-4 flex-shrink-0">
                            <WhatsApp />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm text-gray-900">Sales</div>
                          </div>
                          <div className="text-sm text-gray-500">+918765431111</div>
                        </button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              )}
            </div>
          </>
        ) : (
          <>
            {/* Expanded Search Layout */}
            <div 
              className={`flex items-center w-full space-x-3 transition-all duration-300 ease-in-out ${
                isSearchExpanded 
                  ? 'opacity-100 scale-100 pointer-events-auto' 
                  : 'opacity-0 scale-95 pointer-events-none absolute'
              }`}
            >
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 flex-shrink-0 transition-all duration-200"
                onClick={onToggleSidebar}
              >
                <Menu className="w-4 h-4" />
              </Button>
              
              {/* Expanded Search Input */}
              <div 
                className={`relative flex-1 transition-all duration-300 ease-in-out ${
                  isSearchExpanded 
                    ? 'transform translate-x-0 opacity-100' 
                    : 'transform translate-x-4 opacity-0'
                }`}
              >
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 transition-all duration-200" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm transition-all duration-300 ease-in-out
                    focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                    ${isSearchExpanded ? 'bg-white' : 'bg-gray-50'}`}
                />
              </div>
              
              {/* Close Search Button */}
              <Button 
                variant="ghost" 
                size="sm" 
                className={`h-8 w-8 p-0 flex-shrink-0 transition-all duration-300 ease-in-out ${
                  isSearchExpanded 
                    ? 'transform translate-x-0 opacity-100 scale-100' 
                    : 'transform translate-x-4 opacity-0 scale-95'
                }`}
                onClick={handleSearchToggle}
              >
                <X className="w-4 h-4 text-gray-500" />
              </Button>
            </div>
          </>
        )}
      </div>


      {/* Filter Tabs */}
      {(
        <div className="flex items-center gap-2 px-4 py-3 bg-white overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {tabs.map((tab) => {
            const isSelected = selectedTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`shrink-0 whitespace-nowrap px-2 py-0.5 rounded-full text-sm font-medium transition-all duration-200 border ${
                  isSelected
                    ? isVoipCalls
                      ? 'bg-wati-green text-white border-wati-green shadow-sm'
                      : 'bg-green-600 text-white border-green-600 shadow-sm'
                    : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200 hover:border-gray-300'
                }`}
              >
                {tab}
              </button>
            );
          })}
          
          {/* Active Date Filter Indicator */}
          {isFilterActive && (
            <div className="flex items-center ml-2">
              <Badge variant="secondary" className="text-xs">
                {activePreset === 'today' && 'Today'}
                {activePreset === 'thisweek' && 'This week'}
                {activePreset === 'thismonth' && 'This month'}
                {activePreset === 'custom' && 'Custom date'}
              </Badge>
            </div>
          )}

          {/* Active Custom Filter Indicator */}
          {hasCustomFilters && (
            <div className="flex items-center ml-2">
              <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                Custom filter
              </Badge>
            </div>
          )}
        </div>
      )}

      {/* Iteration 4: missed-call overview between the filters and the log */}
      {isWhatsAppCalls && iteration === 4 && <MissedCallsBanner placement="call_log_banner" className="px-3 pb-3" />}

      {/* Chat List or Calls List */}
      <div className="flex-1 overflow-y-auto">
        {isWhatsAppCalls ? (
          // One row per call interaction
          <>
            {/* Iteration 2: Astra pinned above the log, where missed calls are looked at */}
            {iteration === 2 && (selectedTab === 'All' || selectedTab === 'Missed') && !searchQuery && (
              <AstraPinnedCallRow />
            )}
            {filteredCalls.map((call) => {
              const agentName = call.agent;
              const callTime = call.time;
              const isSelected = selectedCallRecordId === call.id;
              
              return (
                <div 
                  key={call.id} 
                  className={`relative bg-white ${isSelected ? 'bg-[#ebf7f0]' : ''}`}
                  onClick={() => handleCallClick(call)}
                >
                  {/* Left border indicator for selected items */}
                  {isSelected && (
                    <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#69e48e]" />
                  )}
                  
                  <div className="flex items-start gap-2 px-3 py-4 cursor-pointer hover:bg-gray-50/50 transition-colors border-b border-[#e7e9e8]">
                    {/* Avatar with status indicators */}
                    <div className="relative shrink-0 w-8 h-8">
                      {/* Main avatar */}
                      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
                        <path d={svgPaths.p4f1e480} fill="url(#paint0_linear_10058_723)" id="Vector" />
                        <defs>
                          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_10058_723" x1="16" x2="16" y1="0" y2="32">
                            <stop stopColor="#E0FFDE" />
                            <stop offset="1" stopColor="#D0DFCF" />
                          </linearGradient>
                        </defs>
                      </svg>
                      {/* Online status indicator (green smile) at bottom */}
                      <div className="absolute inset-[74.63%_16.11%_0_16.11%]" data-name="Vector">
                        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 21.691 8.11987">
                          <path d={svgPaths.pd235c00} fill="#23A455" id="Vector" />
                        </svg>
                      </div>
                      {/* User icon */}
                      <div className="absolute inset-[25.97%_32.83%_39.68%_32.82%]" data-name="Vector">
                        <div className="absolute inset-[-9.1%]">
                          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12.9919 12.9919">
                            <path d={svgPaths.p3ca3d680} id="Vector" stroke="#23A455" strokeMiterlimit="10" strokeWidth="2" />
                          </svg>
                        </div>
                      </div>
                      {/* Call status badge */}
                      <div className={`absolute -translate-y-1/2 aspect-[16/16] border border-solid border-white left-1/2 right-0 rounded-lg top-[calc(50%+8px)] w-3 h-3 flex items-center justify-center ${
                        call.type === 'missed' ? 'bg-[#ef5766]' : 'bg-[#23a455]'
                      }`}>
                        {call.type === 'missed' ? (
                          <svg className="w-3 h-3" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
                            <path d={svgPaths.p3c155c80} fill="white" />
                          </svg>
                        ) : call.type === 'outgoing' || call.type === 'unanswered' ? (
                          <svg className="w-3 h-3" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
                            <path d={svgPaths.pe3ccb00} fill="white" />
                          </svg>
                        ) : (
                          <svg className="w-3 h-3" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
                            <path d={svgPaths.p21a43400} fill="white" />
                          </svg>
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      {/* Top row: Name, separator, agent */}
                      <div className="flex items-center gap-2.5 mb-0.5">
                        <div className="flex items-center gap-1">
                          <p className="font-['Inter'] font-bold text-[14px] leading-[20px] text-[#505451] flex-shrink-0">
                            {call.name}
                          </p>
                        </div>
                        
                        {/* Vertical separator */}
                        <div className="flex h-1.5 items-center justify-center w-0">
                          <div className="rotate-90 h-0 w-1.5">
                            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6 1">
                              <line stroke="#1B1D1C" strokeLinecap="round" strokeOpacity="0.4" x1="0.5" x2="5.5" y1="0.5" y2="0.5" />
                            </svg>
                          </div>
                        </div>
                        
                        {/* Agent name with headset icon */}
                        <div className="flex items-center gap-1">
                          <div className="-scale-y-100 rotate-180">
                            <svg className="w-4 h-4" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
                              <path d={svgPaths.p4357980} fill="#848A86" />
                            </svg>
                          </div>
                          <p className="font-['Inter'] font-normal text-[12px] leading-[16px] text-[#848a86]">
                            {agentName}
                          </p>
                        </div>
                      </div>
                      
                      {/* Bottom row: Call type and time */}
                      <div className="flex items-center justify-between gap-0.5">
                        <p className="font-['Inter'] font-normal text-[12px] leading-[16px] text-[#505451] flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
                          {call.status}
                        </p>
                        {(call.type === 'missed' || call.type === 'unanswered') && (
                          <AstraStarButton contactName={call.name} />
                        )}
                        <p className="font-['Inter'] font-normal text-[12px] leading-[16px] text-[#848a86] text-right flex-shrink-0">
                          {callTime}
                        </p>
                      </div>
                    </div>
                    
                    {/* Phone icon button */}
                    <div className="flex items-center pt-0.5">
                      {!call.canCallBack ? (
                        <button 
                          className="p-1 rounded-lg flex items-center justify-center"
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          <svg className="w-4 h-4" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
                            <path d={svgPaths.p1f19c2b0} fill="#CED0CE" />
                          </svg>
                        </button>
                      ) : (
                        <button 
                          className="p-1 rounded-lg flex items-center justify-center"
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          <svg className="w-4 h-4" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
                            <path d={svgPaths.p1f19c2b0} fill="#505451" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            
            {filteredCalls.length === 0 && (
              <div className="flex items-center justify-center h-32 text-gray-500">
                <div className="text-center">
                  <p>No calls found</p>
                  {searchQuery && (
                    <p className="text-sm mt-1">Try adjusting your search terms</p>
                  )}
                </div>
              </div>
            )}
          </>
        ) : isVoipCalls ? (
          // Render VoIP call records (black-accented channel)
          <>
            {filteredVoipCalls.map((call) => {
              const isSelected = selectedCallRecordId === call.id;
              const caller = voipCallerLabel(call);
              return (
                <div key={call.id} className="relative group">
                <button
                  onClick={() => {
                    setSelectedCallRecordId(call.id);
                    // Most VoIP callers are unsaved numbers with no conversation
                    // behind them, so the call itself drives the detail pane.
                    onSelectVoipCall?.(call.id);
                    const correspondingChat = call.name
                      ? (allChats || chats).find(c => c.name === call.name)
                      : undefined;
                    if (correspondingChat && onSelectCallTranscription) {
                      onSelectCallTranscription(correspondingChat, call.id);
                    }
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors border-b border-[#F4F1ED] ${
                    isSelected ? 'bg-gray-100' : 'hover:bg-gray-50'
                  }`}
                >
                  <VoipAvatar name={call.name} size="sm" />

                  {/* Body */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate min-w-0">
                          {caller}
                        </p>
                        <CallHandlerLabel call={call} />
                      </div>
                      <span className="text-xs text-gray-400 shrink-0">{call.time}</span>
                    </div>
                    <div className="flex items-center justify-between gap-2 mt-0.5">
                      <p className={`text-xs truncate ${call.type === 'missed' ? 'text-red-500' : 'text-gray-500'}`}>
                        {call.status}
                      </p>
                      <span className="text-xs text-gray-400 shrink-0">{call.duration}</span>
                    </div>
                  </div>
                </button>
                {onCallContact && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity">
                    <VoipCallButton
                      variant="icon"
                      phoneNumber={call.phoneNumber}
                      contactName={caller}
                      onCall={onCallContact}
                    />
                  </div>
                )}
                </div>
              );
            })}

            {filteredVoipCalls.length === 0 && (
              <div className="flex items-center justify-center h-32 text-gray-500">
                <div className="text-center">
                  <p>No calls found</p>
                  {searchQuery && (
                    <p className="text-sm mt-1">Try adjusting your search terms</p>
                  )}
                </div>
              </div>
            )}
          </>
        ) : (
          // Render regular chats for other channels
          <>
            {filteredChats.map((chat) => (
              <ConversationListUnselected
                key={chat.id}
                chat={chat}
                isSelected={selectedChat.id === chat.id}
                onClick={() => handleChatClick(chat)}
                selectedChannel={selectedChannel}
              />
            ))}
            
            {filteredChats.length === 0 && (
              <div className="flex items-center justify-center h-32 text-gray-500">
                <div className="text-center">
                  <p>No conversations found</p>
                  {searchQuery && (
                    <p className="text-sm mt-1">Try adjusting your search terms</p>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Custom Filter Dialog - Only for WhatsApp */}
      {isWhatsAppFeatures && (
        <FilterDialog
          isOpen={isCustomFilterOpen}
          onClose={() => setIsCustomFilterOpen(false)}
          onApply={handleCustomFilterApply}
        />
      )}

      {/* Call Detail Panel - Only show when NOT viewing contact history inline */}
      {selectedCallDetail && (
        <CallDetailPanel
          isOpen={true}
          onClose={() => setSelectedCallDetail(null)}
          contactName={selectedCallDetail.name}
          phoneNumber={selectedCallDetail.phoneNumber}
          avatar={selectedCallDetail.avatar || selectedCallDetail.name.split(' ').map(n => n[0]).join('')}
          callHistory={CALL_HISTORY_DATA[selectedCallDetail.name] || []}
        />
      )}
    </div>
  );
}
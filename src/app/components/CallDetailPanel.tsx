import React from 'react';
import { X, Phone, Clock, ArrowDownLeft, ArrowUpRight, PhoneOff, PhoneMissed, FileText, MessageSquare } from 'lucide-react';
import { Button } from './ui/button';

interface CallHistoryEntry {
  id: string;
  date: string;
  time: string;
  type: 'inbound' | 'outbound' | 'missed' | 'unanswered';
  status: 'connected' | 'no-answer' | 'busy' | 'voicemail';
  duration?: string;
  hasTranscription?: boolean;
  notes?: string;
}

interface CallDetailPanelProps {
  isOpen: boolean;
  onClose: () => void;
  contactName: string;
  phoneNumber: string;
  avatar: string;
  callHistory: CallHistoryEntry[];
}

export function CallDetailPanel({
  isOpen,
  onClose,
  contactName,
  phoneNumber,
  avatar,
  callHistory
}: CallDetailPanelProps) {
  if (!isOpen) return null;

  // Calculate statistics
  const totalCalls = callHistory.length;
  const connectedCalls = callHistory.filter(c => c.status === 'connected').length;
  const missedCalls = callHistory.filter(c => c.type === 'missed' || c.status === 'no-answer').length;
  const lastCall = callHistory[0];
  
  // Calculate average duration
  const durations = callHistory
    .filter(c => c.duration)
    .map(c => {
      const parts = c.duration!.split('m ');
      const minutes = parseInt(parts[0]) || 0;
      const seconds = parseInt(parts[1]) || 0;
      return minutes * 60 + seconds;
    });
  const avgDuration = durations.length > 0 
    ? Math.floor(durations.reduce((a, b) => a + b, 0) / durations.length)
    : 0;
  const avgMinutes = Math.floor(avgDuration / 60);
  const avgSeconds = avgDuration % 60;

  const getCallIcon = (type: string, status: string) => {
    if (type === 'missed' || status === 'no-answer') {
      return <PhoneMissed className="w-4 h-4" />;
    }
    if (type === 'inbound') {
      return <ArrowDownLeft className="w-4 h-4" />;
    }
    if (type === 'outbound') {
      return <ArrowUpRight className="w-4 h-4" />;
    }
    return <Phone className="w-4 h-4" />;
  };

  const getCallColor = (type: string, status: string) => {
    if (type === 'missed' || status === 'no-answer') {
      return 'text-red-600 bg-red-50';
    }
    if (type === 'inbound') {
      return 'text-green-600 bg-green-50';
    }
    if (type === 'outbound') {
      return 'text-blue-600 bg-blue-50';
    }
    return 'text-gray-600 bg-gray-50';
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'connected':
        return 'Connected';
      case 'no-answer':
        return 'No Answer';
      case 'busy':
        return 'Busy';
      case 'voicemail':
        return 'Voicemail';
      default:
        return status;
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/20 z-40 transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Slide-over Panel */}
      <div className="fixed right-0 top-0 h-full w-[480px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-out flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                <span className="text-white font-semibold text-lg">{avatar}</span>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{contactName}</h2>
                <p className="text-sm text-gray-500">{phoneNumber}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 border-green-200 text-green-700 hover:bg-green-50"
            >
              <Phone className="w-4 h-4 mr-2" />
              Call Back
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Message
            </Button>
          </div>
        </div>

        {/* Call Statistics */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Call Summary
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-2xl font-bold text-gray-900">{totalCalls}</p>
              <p className="text-xs text-gray-500">Total Calls</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">{connectedCalls}</p>
              <p className="text-xs text-gray-500">Connected</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">{missedCalls}</p>
              <p className="text-xs text-gray-500">Missed/Unanswered</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {avgMinutes > 0 ? `${avgMinutes}m ${avgSeconds}s` : `${avgSeconds}s`}
              </p>
              <p className="text-xs text-gray-500">Avg Duration</p>
            </div>
          </div>
        </div>

        {/* Call History Timeline */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
            Call History
          </h3>
          <div className="space-y-4">
            {callHistory.map((call, index) => (
              <div 
                key={call.id}
                className="relative pb-4"
              >
                {/* Timeline connector */}
                {index < callHistory.length - 1 && (
                  <div className="absolute left-5 top-10 bottom-0 w-px bg-gray-200" />
                )}
                
                <div className="flex gap-3">
                  {/* Icon */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${getCallColor(call.type, call.status)}`}>
                    {getCallIcon(call.type, call.status)}
                  </div>
                  
                  {/* Call Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <div>
                        <p className="text-sm font-medium text-gray-900 capitalize">
                          {call.type} Call
                        </p>
                        <p className="text-xs text-gray-500">
                          {call.date} • {call.time}
                        </p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        call.status === 'connected' 
                          ? 'bg-green-100 text-green-700'
                          : call.status === 'no-answer'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {getStatusText(call.status)}
                      </span>
                    </div>
                    
                    {call.duration && (
                      <div className="flex items-center gap-1 text-xs text-gray-600 mb-2">
                        <Clock className="w-3 h-3" />
                        <span>Duration: {call.duration}</span>
                      </div>
                    )}
                    
                    {call.notes && (
                      <p className="text-xs text-gray-600 bg-gray-50 rounded px-2 py-1 mb-2">
                        {call.notes}
                      </p>
                    )}
                    
                    {call.hasTranscription && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-xs text-green-600 hover:text-green-700 hover:bg-green-50"
                      >
                        <FileText className="w-3 h-3 mr-1" />
                        View Transcription
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

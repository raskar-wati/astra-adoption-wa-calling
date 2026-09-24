import React, { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './ui/dialog';
import { Phone, X, PhoneCall, PhoneMissed, Mic, MicOff, Video, VideoOff, Minus, Maximize2 } from 'lucide-react';

interface Call {
  id: string;
  name: string;
  phoneNumber: string;
  type: 'incoming' | 'missed';
  timestamp?: string; // For missed calls
}

interface WhatsAppCallingPopoverProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

interface ActiveCall {
  id: string;
  name: string;
  phoneNumber: string;
  startTime: Date;
}

const CALLS: Call[] = [
  // Incoming calls (active) - Only one call now
  { id: '1', name: 'Priya Sharma', phoneNumber: '+91 98765 43210', type: 'incoming' },
  
  // Missed calls with timestamps
  { id: '4', name: 'Vikram Kumar', phoneNumber: '+91 65432 10987', type: 'missed', timestamp: '2 mins ago' },
  { id: '5', name: 'Arjun Gupta', phoneNumber: '+91 54321 09876', type: 'missed', timestamp: '5 mins ago' },
  { id: '6', name: 'Neha Agarwal', phoneNumber: '+91 43210 98765', type: 'missed', timestamp: '12 mins ago' },
  { id: '7', name: 'Rajesh Verma', phoneNumber: '+91 32109 87654', type: 'missed', timestamp: '1 hour ago' },
  { id: '8', name: 'Deepika Rao', phoneNumber: '+91 21098 76543', type: 'missed', timestamp: '2 hours ago' },
  { id: '9', name: 'Amit Joshi', phoneNumber: '+91 10987 65432', type: 'missed', timestamp: 'Yesterday' }
];

export function WhatsAppCallingPopover({ isOpen, onOpenChange, children }: WhatsAppCallingPopoverProps) {
  const [activeCall, setActiveCall] = useState<ActiveCall | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  const incomingCalls = CALLS.filter(call => call.type === 'incoming');
  const missedCalls = CALLS.filter(call => call.type === 'missed');

  // Update call duration every second when call is active
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeCall) {
      interval = setInterval(() => {
        const now = new Date();
        const duration = Math.floor((now.getTime() - activeCall.startTime.getTime()) / 1000);
        setCallDuration(duration);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeCall]);

  const handleDeclineCall = (callId: string) => {
    console.log(`Declining call from ${callId}`);
    // Here you would implement the decline logic
  };

  const handleAnswerCall = (callId: string) => {
    console.log(`Answering call from ${callId}`);
    const call = CALLS.find(c => c.id === callId);
    if (call) {
      setActiveCall({
        id: call.id,
        name: call.name,
        phoneNumber: call.phoneNumber,
        startTime: new Date()
      });
      setCallDuration(0);
      setIsMinimized(false);
      // Close the popover when call is answered
      onOpenChange(false);
    }
  };

  const handleEndCall = () => {
    setActiveCall(null);
    setCallDuration(0);
    setIsMuted(false);
    setIsVideoOn(false);
    setIsMinimized(false);
  };

  const handleMinimizeCall = () => {
    setIsMinimized(true);
  };

  const handleMaximizeCall = () => {
    setIsMinimized(false);
  };

  const handleCallBack = (callId: string) => {
    console.log(`Calling back ${callId}`);
    // Here you would implement the callback logic
  };

  const formatCallDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <Popover open={isOpen} onOpenChange={onOpenChange}>
        <PopoverTrigger asChild>
          {children}
        </PopoverTrigger>
        <PopoverContent 
          className="w-80 p-0 shadow-lg border border-gray-200" 
          align="start"
          side="right"
          sideOffset={8}
        >
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-primary" />
              <h3 className="font-medium text-gray-900">
                WhatsApp Calls
              </h3>
            </div>
          </div>

          {/* Calls List */}
          <div className="max-h-80 overflow-y-auto">
            {/* Incoming Calls Section */}
            {incomingCalls.length > 0 && (
              <>
                <div className="px-4 py-2 bg-green-50 border-b border-green-100">
                  <p className="text-xs font-medium text-green-700 uppercase tracking-wide">
                    Incoming Calls ({incomingCalls.length})
                  </p>
                </div>
                {incomingCalls.map((call) => (
                  <div 
                    key={call.id} 
                    className="flex items-center justify-between p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {call.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {call.phoneNumber}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-8 h-8 p-0 border-gray-200 hover:bg-gray-50 hover:border-red-300 hover:text-red-500 transition-all duration-200"
                        onClick={() => handleDeclineCall(call.id)}
                      >
                        <X className="w-4 h-4 text-gray-500 hover:text-red-500 transition-colors" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-8 h-8 p-0 border-primary bg-green-50 hover:bg-green-100 text-primary whatsapp-calling-button"
                        onClick={() => handleAnswerCall(call.id)}
                      >
                        <Phone className="w-4 h-4 whatsapp-calling-icon" />
                      </Button>
                    </div>
                  </div>
                ))}
              </>
            )}

            {/* Missed Calls Section */}
            {missedCalls.length > 0 && (
              <>
                <div className="px-4 py-2 bg-red-50 border-b border-red-100">
                  <p className="text-xs font-medium text-red-700 uppercase tracking-wide">
                    Missed Calls ({missedCalls.length})
                  </p>
                </div>
                {missedCalls.map((call) => (
                  <div 
                    key={call.id} 
                    className="flex items-center justify-between p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 cursor-pointer transition-colors"
                    onClick={() => handleCallBack(call.id)}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {call.name}
                        </p>
                        <div className="flex items-center gap-2">
                          <p className="text-xs text-gray-500 truncate">
                            {call.phoneNumber}
                          </p>
                          {call.timestamp && (
                            <>
                              <span className="text-xs text-gray-300">•</span>
                              <p className="text-xs text-red-500">
                                {call.timestamp}
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-8 h-8 p-0 border-primary bg-green-50 hover:bg-green-100 text-primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCallBack(call.id);
                        }}
                      >
                        <Phone className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </PopoverContent>
      </Popover>

      {/* Active Call Modal - Full Size */}
      <Dialog open={!!activeCall && !isMinimized}>
        <DialogContent className="sm:max-w-md w-80 p-0 bg-white border border-gray-200 shadow-xl [&>button]:hidden">
          <DialogTitle className="sr-only">
            {activeCall ? `Active call with ${activeCall.name}` : 'Active call'}
          </DialogTitle>
          <DialogDescription className="sr-only">
            WhatsApp call interface showing call controls and duration
          </DialogDescription>
          
          {/* Call Header with Minimize button - centered at top right */}
          <div className="absolute top-3 right-3 z-10">
            <Button
              variant="ghost"
              size="sm"
              className="w-8 h-8 p-0 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              onClick={handleMinimizeCall}
            >
              <Minus className="w-4 h-4" />
            </Button>
          </div>

          {activeCall && (
            <div className="flex flex-col items-center p-6 space-y-6">
              {/* Call Status */}
              <div className="text-center space-y-1">
                <p className="text-sm text-gray-500">WhatsApp Call</p>
                <div className="flex items-center gap-2 text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <p className="text-sm font-medium">Connected</p>
                </div>
              </div>

              {/* Contact Avatar and Info */}
              <div className="flex flex-col items-center space-y-3">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-xl font-medium text-green-700">
                    {activeCall.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div className="text-center">
                  <h3 className="font-medium text-gray-900">{activeCall.name}</h3>
                  <p className="text-sm text-gray-500">{activeCall.phoneNumber}</p>
                </div>
              </div>

              {/* Call Duration */}
              <div className="text-center">
                <p className="text-lg font-mono text-gray-700">
                  {formatCallDuration(callDuration)}
                </p>
              </div>

              {/* Call Controls */}
              <div className="flex items-center justify-center space-x-4">
                <Button
                  variant="outline"
                  size="sm"
                  className={`w-10 h-10 p-0 rounded-full ${
                    isMuted 
                      ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100' 
                      : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                  }`}
                  onClick={() => setIsMuted(!isMuted)}
                >
                  {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className={`w-10 h-10 p-0 rounded-full ${
                    isVideoOn 
                      ? 'bg-green-50 border-green-200 text-green-600 hover:bg-green-100' 
                      : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                  }`}
                  onClick={() => setIsVideoOn(!isVideoOn)}
                >
                  {isVideoOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                </Button>

                <Button
                  variant="destructive"
                  size="sm"
                  className="w-10 h-10 p-0 rounded-full bg-red-500 hover:bg-red-600"
                  onClick={handleEndCall}
                >
                  <PhoneMissed className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Minimized Call Widget - Bottom Left */}
      {activeCall && isMinimized && (
        <div className="fixed bottom-4 left-4 z-50">
          <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 w-72">
            {/* Minimized Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-700">WhatsApp Call</span>
              </div>
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-6 h-6 p-0 text-gray-500 hover:text-gray-700"
                  onClick={handleMaximizeCall}
                >
                  <Maximize2 className="w-3 h-3" />
                </Button>
              </div>
            </div>

            {/* Minimized Contact Info */}
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-green-700">
                  {activeCall.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-900 truncate">{activeCall.name}</h4>
                <p className="text-xs text-gray-500 truncate">{activeCall.phoneNumber}</p>
              </div>
              <div className="text-xs font-mono text-gray-600">
                {formatCallDuration(callDuration)}
              </div>
            </div>

            {/* Minimized Call Controls */}
            <div className="flex items-center justify-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                className={`w-8 h-8 p-0 rounded-full ${
                  isMuted 
                    ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100' 
                    : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                }`}
                onClick={() => setIsMuted(!isMuted)}
              >
                {isMuted ? <MicOff className="w-3 h-3" /> : <Mic className="w-3 h-3" />}
              </Button>

              <Button
                variant="outline"
                size="sm"
                className={`w-8 h-8 p-0 rounded-full ${
                  isVideoOn 
                    ? 'bg-green-50 border-green-200 text-green-600 hover:bg-green-100' 
                    : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                }`}
                onClick={() => setIsVideoOn(!isVideoOn)}
              >
                {isVideoOn ? <Video className="w-3 h-3" /> : <VideoOff className="w-3 h-3" />}
              </Button>

              <Button
                variant="destructive"
                size="sm"
                className="w-8 h-8 p-0 rounded-full bg-red-500 hover:bg-red-600"
                onClick={handleEndCall}
              >
                <PhoneMissed className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
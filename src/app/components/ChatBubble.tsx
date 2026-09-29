import React from 'react';

// One message in an inbox thread. Outgoing messages (the business side) take
// the channel's tint; incoming ones are white with a border, tail on the left.

// Outgoing bubble tint per channel.
function getChatBubbleColor(channel: string) {
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
}

interface ChatBubbleProps {
  sender: 'customer' | 'agent';
  channel: string;
  timestamp?: string;
}

export function ChatBubble({ sender, channel, timestamp, children }: React.PropsWithChildren<ChatBubbleProps>) {
  const outgoing = sender === 'agent';
  return (
    <div
      className={`max-w-xs lg:max-w-md px-3 lg:px-4 py-2 rounded-lg ${
        outgoing ? 'text-gray-900 rounded-tr-none' : 'bg-white text-gray-900 border border-gray-200 rounded-tl-none'
      }`}
      style={outgoing ? { backgroundColor: getChatBubbleColor(channel), color: '#333333' } : {}}
    >
      <div className="text-[14px]">{children}</div>
      {timestamp && (
        <p
          className={`text-xs mt-1 ${outgoing ? '' : 'text-gray-500'}`}
          style={outgoing ? { color: '#333333', opacity: 0.7 } : {}}
        >
          {timestamp}
        </p>
      )}
    </div>
  );
}

export default ChatBubble;

import React, { useState } from 'react';
import svgPaths from '../imports/svg-mgoudhpi27';
import Messenger from '../imports/Messenger';

// The inbox's reply box: channel line, textarea and the action row with the
// channel-coloured send button. Shared by customer threads and Astra's thread
// so both read as the same WhatsApp conversation.

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

interface ChatComposerProps {
  channel: string;
  onSend: (text: string) => void;
  /** Shown on the channel line above the input; omit to hide that line. */
  phoneNumber?: string;
  placeholder?: string;
}

export function ChatComposer({
  channel,
  onSend,
  phoneNumber,
  placeholder = 'Type your message here or press "/" key for quick replies',
}: ChatComposerProps) {
  const [message, setMessage] = useState('');

  const handleSendMessage = () => {
    if (message.trim()) {
      onSend(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const showChannelLine =
    phoneNumber && channel !== 'Instagram' && channel !== 'Messenger' && channel !== 'SMS' && channel !== 'RCS';

  return (
    <div className="flex-shrink-0 bg-white border-t border-gray-100">
      {/* Channel Header */}
      <div className="bg-white relative rounded-tl-[8px] rounded-tr-[8px] shrink-0 w-full border-b border-gray-100">
        <div className="flex flex-row items-end relative size-full">
          {showChannelLine && (
            <div className="flex flex-row gap-2.5 items-end p-[8px] relative w-full">
              <div className="flex flex-row gap-1 items-center">
                <BackArrow />
                <div className="flex flex-row gap-1 items-center">
                  <ChannelIndicator channel={channel} />
                  <div className="font-['Inter:Regular',_sans-serif] font-normal text-[#848a86] text-[12px] leading-[16px]">
                    {phoneNumber}
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
          <div className="flex items-end space-x-2">
            <div className="flex-1">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={placeholder}
                className="w-full px-3 py-2 rounded-lg resize-none focus:outline-none bg-gray-50"
                rows={1}
                style={{ minHeight: '40px', maxHeight: '120px' }}
              />
            </div>
          </div>

          <ActionButtons onSendMessage={handleSendMessage} message={message} channel={channel} />
        </div>
      </div>
    </div>
  );
}

export default ChatComposer;

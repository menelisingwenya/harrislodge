import { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { Icon } from '@iconify/react';
import { BRAND_CONTACT } from '@/lib/brand';

const pulseAnimation = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.5);
  }
  70% {
    box-shadow: 0 0 0 14px rgba(37, 211, 102, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(37, 211, 102, 0);
  }
`;

const slideUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(16px) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

const FloatWrapper = styled.div`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 999;
  font-family: inherit;
  display: flex;
  flex-direction: column;
  align-items: flex-end;

  @media (max-width: 640px) {
    bottom: 1.25rem;
    right: 1.25rem;
  }
`;

const ChatWidgetCard = styled.div`
  width: 340px;
  max-width: calc(100vw - 2.5rem);
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 12px 36px rgba(0, 41, 33, 0.22), 0 4px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 106, 86, 0.12);
  overflow: hidden;
  margin-bottom: 1rem;
  animation: ${slideUp} 250ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
  transform-origin: bottom right;
`;

const WidgetHeader = styled.div`
  background: linear-gradient(135deg, #005545 0%, #006a56 60%, #087f68 100%);
  color: #ffffff;
  padding: 1.15rem 1.25rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
`;

const HeaderInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;

  .avatar-box {
    width: 42px;
    height: 42px;
    border-radius: 50%;
    background: #ffffff;
    display: grid;
    place-items: center;
    color: #25d366;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    flex-shrink: 0;
  }

  .text-box {
    h4 {
      margin: 0;
      font-size: 0.95rem;
      font-weight: 700;
      color: #ffffff;
      letter-spacing: 0.01em;
    }

    .status-line {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      font-size: 0.76rem;
      color: rgba(255, 255, 255, 0.85);
      margin-top: 0.15rem;

      .dot {
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background: #25d366;
        display: inline-block;
      }
    }
  }
`;

const CloseButton = styled.button`
  background: rgba(255, 255, 255, 0.15);
  border: none;
  color: #ffffff;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: all 180ms ease;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: rotate(90deg);
  }
`;

const WidgetBody = styled.div`
  padding: 1.25rem;
  background: #f8faf9;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ChatBubble = styled.div`
  background: #ffffff;
  padding: 0.85rem 1rem;
  border-radius: 12px 12px 12px 2px;
  font-size: 0.86rem;
  line-height: 1.45;
  color: #1a2e1e;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
  border: 1px solid #e8eee9;

  .time {
    display: block;
    font-size: 0.7rem;
    color: #8fa094;
    text-align: right;
    margin-top: 0.35rem;
  }
`;

const PromptLabel = styled.div`
  font-size: 0.75rem;
  font-weight: 700;
  color: #617366;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: -0.35rem;
`;

const QuickOptionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
`;

const QuickOption = styled.a`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.65rem 0.85rem;
  background: #ffffff;
  border: 1px solid #dbe6e0;
  border-radius: 8px;
  font-size: 0.82rem;
  font-weight: 600;
  color: #005545;
  text-decoration: none;
  transition: all 180ms ease;
  cursor: pointer;

  &:hover {
    background: #eef6f2;
    border-color: #25d366;
    color: #002921;
    transform: translateX(3px);
  }

  .opt-left {
    display: flex;
    align-items: center;
    gap: 0.55rem;
  }
`;

const DirectChatBtn = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.55rem;
  background: #25d366;
  color: #ffffff;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 0.88rem;
  font-weight: 700;
  text-decoration: none;
  box-shadow: 0 4px 14px rgba(37, 211, 102, 0.35);
  transition: all 180ms ease;

  &:hover {
    background: #20ba59;
    box-shadow: 0 6px 18px rgba(37, 211, 102, 0.45);
    transform: translateY(-1px);
    color: #ffffff;
  }
`;

const FloatingTrigger = styled.button<{ $isOpen: boolean }>`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: ${(p) => (p.$isOpen ? '#005545' : '#25D366')};
  color: #ffffff;
  border: none;
  display: grid;
  place-items: center;
  cursor: pointer;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.18), 0 2px 6px rgba(0, 0, 0, 0.1);
  transition: all 250ms cubic-bezier(0.16, 1, 0.3, 1);
  animation: ${(p) => (!p.$isOpen ? pulseAnimation : 'none')} 2.5s infinite;

  &:hover {
    transform: scale(1.08) translateY(-2px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.24);
    background: ${(p) => (p.$isOpen ? '#004134' : '#20ba59')};
  }
`;

export function WhatsAppAssist() {
  const [isOpen, setIsOpen] = useState(false);
  const waNumberClean = '263775477464';
  const waNumberDisplay = BRAND_CONTACT.whatsappNumber || '+263 77547 7464';

  const makeWaUrl = (message: string) => {
    return `https://wa.me/${waNumberClean}?text=${encodeURIComponent(message)}`;
  };

  return (
    <FloatWrapper>
      {isOpen && (
        <ChatWidgetCard role="dialog" aria-label="WhatsApp Assistant">
          <WidgetHeader>
            <HeaderInfo>
              <div className="avatar-box">
                <Icon icon="mdi:whatsapp" width={26} height={26} />
              </div>
              <div className="text-box">
                <h4>Harris Concierge</h4>
                <div className="status-line">
                  <span className="dot" />
                  <span>Online • Quick Response</span>
                </div>
              </div>
            </HeaderInfo>
            <CloseButton onClick={() => setIsOpen(false)} aria-label="Close WhatsApp chat">
              <Icon icon="mdi:close" width={18} height={18} />
            </CloseButton>
          </WidgetHeader>

          <WidgetBody>
            <ChatBubble>
              Hello! 👋 Welcome to <strong>Harris Lodges Zimbabwe</strong>. How may our reservations and guest team assist you today?
              <span className="time">Just now</span>
            </ChatBubble>

            <PromptLabel>Frequently Asked Inquiries</PromptLabel>

            <QuickOptionList>
              <QuickOption
                href={makeWaUrl('Hello Harris Lodge, I would like to inquire about room availability and reservations.')}
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="opt-left">
                  <Icon icon="mdi:bed-outline" width={17} height={17} />
                  <span>Room Bookings &amp; Rates</span>
                </div>
                <Icon icon="mdi:chevron-right" width={16} height={16} />
              </QuickOption>

              <QuickOption
                href={makeWaUrl('Hello Harris Lodge, I would like to request a quote for a conference or corporate event hall.')}
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="opt-left">
                  <Icon icon="mdi:presentation" width={17} height={17} />
                  <span>Conferences &amp; Events</span>
                </div>
                <Icon icon="mdi:chevron-right" width={16} height={16} />
              </QuickOption>

              <QuickOption
                href={makeWaUrl('Hello Harris Lodge, I would like information regarding your 11 lodge locations and check-in times.')}
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="opt-left">
                  <Icon icon="mdi:map-marker-outline" width={17} height={17} />
                  <span>Branch Locations &amp; Info</span>
                </div>
                <Icon icon="mdi:chevron-right" width={16} height={16} />
              </QuickOption>
            </QuickOptionList>

            <DirectChatBtn
              href={makeWaUrl('Hello Harris Lodge, I would like to speak directly with the concierge team.')}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon icon="mdi:whatsapp" width={20} height={20} />
              <span>Chat on WhatsApp ({waNumberDisplay})</span>
            </DirectChatBtn>
          </WidgetBody>
        </ChatWidgetCard>
      )}

      <FloatingTrigger
        $isOpen={isOpen}
        onClick={() => setIsOpen(!isOpen)}
        title="Chat on WhatsApp (+263 77547 7464)"
        aria-label={isOpen ? 'Close WhatsApp Assistant' : 'Chat on WhatsApp (+263 77547 7464)'}
      >
        <Icon icon={isOpen ? 'mdi:close' : 'mdi:whatsapp'} width={isOpen ? 26 : 32} height={isOpen ? 26 : 32} />
      </FloatingTrigger>
    </FloatWrapper>
  );
}

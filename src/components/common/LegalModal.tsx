import { useEffect } from 'react';
import styled from 'styled-components';
import { Icon } from '@iconify/react';
import { harrisTheme } from '@/theme';
import { BRAND_CONTACT } from '@/components/layout/Header';

export type LegalModalTab = 'privacy' | 'terms' | 'management';

interface LegalModalProps {
  isOpen: boolean;
  activeTab: LegalModalTab;
  onClose: () => void;
  onSelectTab: (tab: LegalModalTab) => void;
}

export function LegalModal({ isOpen, activeTab, onClose, onSelectTab }: LegalModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <Overlay $visible={isOpen} onClick={onClose}>
      <ModalContainer $visible={isOpen} onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <div className="header-left">
            <div className="brand-badge">
              <Icon icon="mdi:shield-check" width={18} height={18} />
              <span>Harris Hotel &amp; Lodges Governance</span>
            </div>
            <h2>
              {activeTab === 'privacy' && 'Guest Privacy Policy'}
              {activeTab === 'terms' && 'Terms & Conditions'}
              {activeTab === 'management' && 'Harris Hotel Management Engine'}
            </h2>
          </div>
          <button className="close-btn" onClick={onClose} aria-label="Close dialog">
            <Icon icon="mdi:close" width={22} height={22} />
          </button>
        </ModalHeader>

        <TabBar>
          <TabButton
            $active={activeTab === 'privacy'}
            onClick={() => onSelectTab('privacy')}
          >
            <Icon icon="mdi:lock-outline" width={16} height={16} />
            Privacy Policy
          </TabButton>
          <TabButton
            $active={activeTab === 'terms'}
            onClick={() => onSelectTab('terms')}
          >
            <Icon icon="mdi:file-document-outline" width={16} height={16} />
            Terms &amp; Conditions
          </TabButton>
          <TabButton
            $active={activeTab === 'management'}
            onClick={() => onSelectTab('management')}
          >
            <Icon icon="mdi:cog-transfer-outline" width={16} height={16} />
            Management Engine
          </TabButton>
        </TabBar>

        <ModalBody>
          {activeTab === 'privacy' && (
            <ContentSection>
              <div className="lead-box">
                <p>
                  At <strong>Harris Group of Hotels &amp; Lodges</strong>, guest confidentiality, data security, and trust are paramount.
                  This Privacy Policy outlines our standards for handling personal details collected across our website, booking engines, and lodge properties.
                </p>
              </div>

              <div className="article-block">
                <h3><Icon icon="mdi:database-lock" /> 1. Information We Collect</h3>
                <p>To provide high-tier hospitality and seamless stays, we collect essential guest details:</p>
                <ul>
                  <li><strong>Reservation Details:</strong> Full name, telephone number, email address, preferred branch, arrival/departure dates, and room selection.</li>
                  <li><strong>Identification &amp; Check-In:</strong> Government-issued ID or passport details presented at check-in for national hospitality compliance.</li>
                  <li><strong>Stay Preferences:</strong> Dietary requirements, bed configurations, conference logistics, and special accommodation requests.</li>
                </ul>
              </div>

              <div className="article-block">
                <h3><Icon icon="mdi:shield-account" /> 2. How We Use Your Information</h3>
                <ul>
                  <li>Direct room reservation processing, confirmation dispatch, and guest concierge support.</li>
                  <li>Invoicing, official tax receipt issuance, and transaction records.</li>
                  <li>Real-time front desk synchronization across our branches (North End, Townsend, Five Avenue).</li>
                  <li>Direct WhatsApp or email customer care regarding booking updates or special requests.</li>
                </ul>
              </div>

              <div className="article-block">
                <h3><Icon icon="mdi:lock-check" /> 3. Data Protection &amp; Confidentiality</h3>
                <p>
                  We implement robust digital encryption and strict operational safeguards. We never sell, rent, or distribute guest data to third-party marketing entities.
                  Access is restricted exclusively to authorized hotel management and reservation staff.
                </p>
              </div>

              <div className="contact-box">
                <h4><Icon icon="mdi:help-circle-outline" /> Privacy Inquiries &amp; Guest Data Requests</h4>
                <p>
                  For inquiries or requests regarding your personal records, contact our privacy desk directly at{' '}
                  <a href={`mailto:${BRAND_CONTACT.generalEmail}`}>{BRAND_CONTACT.generalEmail}</a> or call{' '}
                  <a href={`tel:${BRAND_CONTACT.centralPhone}`}>{BRAND_CONTACT.centralPhone}</a>.
                </p>
              </div>
            </ContentSection>
          )}

          {activeTab === 'terms' && (
            <ContentSection>
              <div className="lead-box">
                <p>
                  Welcome to <strong>Harris Group of Hotels &amp; Lodges</strong>. By booking a suite, hall, or using our services across any of our branches, you agree to the following terms and hospitality guidelines.
                </p>
              </div>

              <div className="article-block">
                <h3><Icon icon="mdi:clock-time-four-outline" /> 1. Check-In &amp; Check-Out Schedules</h3>
                <ul>
                  <li><strong>Standard Check-In:</strong> From 14:00 (2:00 PM) on your confirmed arrival date.</li>
                  <li><strong>Standard Check-Out:</strong> By 10:00 (10:00 AM) on your departure date.</li>
                  <li><strong>Early Arrivals &amp; Late Departures:</strong> Available upon request, subject to room availability and prior front-desk confirmation.</li>
                </ul>
              </div>

              <div className="article-block">
                <h3><Icon icon="mdi:credit-card-check-outline" /> 2. Reservations &amp; Payment Policies</h3>
                <ul>
                  <li>All room rates are quoted in USD or equivalent local currency per room per night.</li>
                  <li>Complimentary high-speed fiber Wi-Fi, secure on-site parking, and daily housekeeping are included with all suite bookings.</li>
                  <li>Accepted payment methods include cash, Visa, MasterCard, swipe terminals, and approved bank transfers.</li>
                </ul>
              </div>

              <div className="article-block">
                <h3><Icon icon="mdi:calendar-remove-outline" /> 3. Cancellation &amp; Modification Policy</h3>
                <ul>
                  <li><strong>Individual Room Bookings:</strong> Flexible amendments and cancellations up to 24 hours prior to scheduled arrival without penalty.</li>
                  <li><strong>Conference &amp; Event Halls:</strong> Event cancellations or rescheduling are subject to specific banquet agreements and terms agreed upon at contract signing.</li>
                </ul>
              </div>

              <div className="article-block">
                <h3><Icon icon="mdi:home-heart" /> 4. Guest Conduct &amp; Property Care</h3>
                <ul>
                  <li>All indoor suites are strictly non-smoking. Designated outdoor smoking lounges are available on property.</li>
                  <li>We kindly ask all guests to observe serene quiet hours between 22:00 and 06:00 to ensure tranquil rest for all visitors.</li>
                  <li>Guests are responsible for any intentional damage caused to room furnishings, appliances, or lodge infrastructure.</li>
                </ul>
              </div>

              <div className="contact-box">
                <h4><Icon icon="mdi:phone-in-talk-outline" /> Front Desk Assistance</h4>
                <p>
                  If you have questions concerning your booking terms, please reach our central reservations desk at{' '}
                  <a href={`tel:${BRAND_CONTACT.centralPhone}`}>{BRAND_CONTACT.centralPhone}</a>.
                </p>
              </div>
            </ContentSection>
          )}

          {activeTab === 'management' && (
            <ContentSection>
              <div className="lead-box">
                <p>
                  The <strong>Harris Hotel Management Engine</strong> is our unified digital backbone connecting guest reservations, multi-branch operations, real-time inventory management, and corporate hospitality services.
                </p>
              </div>

              <div className="features-grid">
                <div className="feature-card">
                  <div className="icon-wrapper">
                    <Icon icon="mdi:source-branch" width={24} height={24} />
                  </div>
                  <h4>Multi-Branch Synchronization</h4>
                  <p>Centralized inventory control across North End, Townsend, and Five Avenue properties with real-time room status tracking.</p>
                </div>

                <div className="feature-card">
                  <div className="icon-wrapper">
                    <Icon icon="mdi:whatsapp" width={24} height={24} />
                  </div>
                  <h4>Smart Guest Concierge</h4>
                  <p>Instant dispatch of booking confirmations, directions, and round-the-clock WhatsApp support for in-house guests.</p>
                </div>

                <div className="feature-card">
                  <div className="icon-wrapper">
                    <Icon icon="mdi:account-group-outline" width={24} height={24} />
                  </div>
                  <h4>Conference &amp; Event Engine</h4>
                  <p>Integrated scheduling for corporate summits, boardroom banquets, laser AV coordination, and catering logistics.</p>
                </div>

                <div className="feature-card">
                  <div className="icon-wrapper">
                    <Icon icon="mdi:shield-check-outline" width={24} height={24} />
                  </div>
                  <h4>Enterprise Data Security</h4>
                  <p>Encrypted guest records, audit trails, and strict role-based access for front-office and management staff.</p>
                </div>
              </div>

              <div className="article-block" style={{ marginTop: '1.5rem' }}>
                <h3><Icon icon="mdi:office-building-marker" /> Operational Hubs</h3>
                <p>
                  Powered by Harris Group Hospitality Systems. For business partnerships, institutional bookings, or long-term executive residency arrangements, contact{' '}
                  <a href={`mailto:${BRAND_CONTACT.generalEmail}`}>{BRAND_CONTACT.generalEmail}</a>.
                </p>
              </div>
            </ContentSection>
          )}
        </ModalBody>

        <ModalFooter>
          <div className="brand-copy">&copy; {new Date().getFullYear()} Harris Group of Hotels &amp; Lodges.</div>
          <button className="btn-done" onClick={onClose}>
            Close
          </button>
        </ModalFooter>
      </ModalContainer>
    </Overlay>
  );
}

/* ── STYLES ── */
const Overlay = styled.div<{ $visible: boolean }>`
  position: fixed;
  inset: 0;
  background: rgba(0, 24, 18, 0.78);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.25rem;
  opacity: ${(p) => (p.$visible ? 1 : 0)};
  pointer-events: ${(p) => (p.$visible ? 'auto' : 'none')};
  transition: opacity 260ms cubic-bezier(0.16, 1, 0.3, 1);

  @media (max-width: 768px) {
    padding: 0;
    align-items: flex-end;
  }
`;

const ModalContainer = styled.div<{ $visible: boolean }>`
  width: 100%;
  max-width: 820px;
  max-height: 88vh;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(0, 106, 86, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transform: ${(p) => (p.$visible ? 'scale(1) translateY(0)' : 'scale(0.97) translateY(16px)')};
  transition: transform 280ms cubic-bezier(0.16, 1, 0.3, 1);

  @media (max-width: 768px) {
    max-height: 92vh;
    border-radius: 16px 16px 0 0;
  }
`;

const ModalHeader = styled.header`
  background: #00382E;
  color: #ffffff;
  padding: 1.25rem 1.75rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  .header-left {
    .brand-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      font-size: 0.75rem;
      font-weight: 700;
      color: #D97E26;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      margin-bottom: 0.25rem;
    }

    h2 {
      margin: 0;
      font-size: 1.35rem;
      font-family: 'Playfair Display', Georgia, serif;
      font-weight: 700;
      color: #ffffff;
    }
  }

  .close-btn {
    background: rgba(255, 255, 255, 0.1);
    border: none;
    color: #ffffff;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 0.2s ease, transform 0.2s ease;

    &:hover {
      background: rgba(255, 255, 255, 0.22);
      transform: rotate(90deg);
    }
  }
`;

const TabBar = styled.div`
  display: flex;
  background: #f8faf9;
  border-bottom: 1px solid #e5e7eb;
  padding: 0 1.25rem;
  gap: 0.5rem;
  overflow-x: auto;
`;

const TabButton = styled.button<{ $active: boolean }>`
  background: none;
  border: none;
  border-bottom: 2px solid ${(p) => (p.$active ? '#00382E' : 'transparent')};
  color: ${(p) => (p.$active ? '#00382E' : '#6b7280')};
  font-weight: ${(p) => (p.$active ? 700 : 500)};
  font-size: 0.88rem;
  padding: 0.85rem 1rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  white-space: nowrap;
  transition: all 0.2s ease;

  &:hover {
    color: #00382E;
  }
`;

const ModalBody = styled.div`
  padding: 1.75rem;
  overflow-y: auto;
  flex: 1;
  color: #374151;
  font-size: 0.92rem;
  line-height: 1.65;
`;

const ContentSection = styled.div`
  .lead-box {
    background: #f0fdf4;
    border-left: 3px solid #006A56;
    padding: 1rem 1.25rem;
    border-radius: 0 6px 6px 0;
    margin-bottom: 1.5rem;
    p {
      margin: 0;
      color: #00382E;
      font-size: 0.94rem;
    }
  }

  .article-block {
    margin-bottom: 1.5rem;

    h3 {
      font-size: 1.05rem;
      font-weight: 700;
      color: #00382E;
      margin: 0 0 0.5rem;
      display: flex;
      align-items: center;
      gap: 0.45rem;
    }

    p {
      margin: 0 0 0.6rem;
      color: #4b5563;
    }

    ul {
      margin: 0;
      padding-left: 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 0.45rem;
      color: #4b5563;
    }
  }

  .features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 1.25rem;
    margin: 1rem 0;

    .feature-card {
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;

      .icon-wrapper {
        width: 40px;
        height: 40px;
        border-radius: 6px;
        background: rgba(0, 56, 46, 0.08);
        color: #00382E;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      h4 {
        margin: 0;
        font-size: 0.95rem;
        font-weight: 700;
        color: #00382E;
      }

      p {
        margin: 0;
        font-size: 0.84rem;
        color: #6b7280;
        line-height: 1.5;
      }
    }
  }

  .contact-box {
    background: #fffbeb;
    border: 1px solid #fef3c7;
    border-radius: 8px;
    padding: 1.15rem;
    margin-top: 1.5rem;

    h4 {
      margin: 0 0 0.35rem;
      font-size: 0.92rem;
      font-weight: 700;
      color: #92400e;
      display: flex;
      align-items: center;
      gap: 0.4rem;
    }

    p {
      margin: 0;
      color: #78350f;
      font-size: 0.85rem;

      a {
        color: #b45309;
        font-weight: 600;
        text-decoration: underline;
      }
    }
  }
`;

const ModalFooter = styled.footer`
  background: #f9fafb;
  border-top: 1px solid #e5e7eb;
  padding: 1rem 1.75rem;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .brand-copy {
    font-size: 0.78rem;
    color: #6b7280;
  }

  .btn-done {
    background: #00382E;
    color: #ffffff;
    border: none;
    padding: 0.5rem 1.25rem;
    border-radius: 4px;
    font-size: 0.86rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s ease;

    &:hover {
      background: #006A56;
    }
  }
`;

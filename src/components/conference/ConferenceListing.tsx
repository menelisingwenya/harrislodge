import styled from 'styled-components';
import { harrisTheme } from '@/theme';
import { Card, Button } from '@/components/ui/Primitives';
import { useBranch } from '@/context/BranchContext';
import { formatCurrency } from '@/lib/utils';
import { Icon } from '@iconify/react';

const Wrapper = styled.div``;

const SectionHeader = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const Title = styled.div`
  h2 { margin-bottom: 0.35rem; }
  p { color: ${harrisTheme.colors.slate[500]}; font-size: 0.9375rem; }
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.35fr) minmax(0, 1fr);
  gap: 1.5rem;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
  }
`;

const FeatureCard = styled(Card)`
  padding: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const FeatureMedia = styled.div`
  position: relative;
  min-height: 260px;
  background: linear-gradient(135deg, #022c22 0%, #064e3b 40%, #065f46 100%);
  color: ${harrisTheme.colors.white};
  padding: 2.25rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(circle at 15% 20%, rgba(249, 115, 22, 0.22), transparent 35%),
      radial-gradient(circle at 85% 80%, rgba(52, 211, 153, 0.2), transparent 40%);
    pointer-events: none;
  }

  > * { position: relative; }

  .feature-icon-wrap {
    width: 58px;
    height: 58px;
    border-radius: 1.25rem;
    background: rgba(255, 255, 255, 0.12);
    backdrop-filter: blur(8px);
    color: ${harrisTheme.colors.accentLight};
    display: grid;
    place-items: center;
    border: 1px solid rgba(255, 255, 255, 0.18);
  }

  h3 {
    color: ${harrisTheme.colors.white};
    font-family: ${harrisTheme.fontFamily.display};
    font-size: 1.75rem;
    margin-bottom: 0.5rem;
  }

  p {
    color: rgba(255,255,255,0.78);
    line-height: 1.55;
    max-width: 520px;
  }
`;

const FeatureBody = styled.div`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const StatRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.75rem;
`;

const Stat = styled.div`
  padding: 0.9rem 1rem;
  border-radius: ${harrisTheme.borderRadius.xl};
  background: ${harrisTheme.colors.slate[50]};
  border: 1px solid ${harrisTheme.colors.slate[200]};

  .stat-label {
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: ${harrisTheme.colors.slate[500]};
    margin-bottom: 0.3rem;
  }
  .stat-value {
    font-size: 1.1rem;
    font-weight: 700;
    color: ${harrisTheme.colors.primary};
    font-family: ${harrisTheme.fontFamily.display};
  }
`;

const AmenityGrid = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.5rem;

  li {
    display: inline-flex;
    align-items: center;
    gap: 0.55rem;
    padding: 0.65rem 0.85rem;
    border-radius: ${harrisTheme.borderRadius.lg};
    background: ${harrisTheme.colors.slate[50]};
    border: 1px solid ${harrisTheme.colors.slate[200]};
    font-size: 0.85rem;
    color: ${harrisTheme.colors.slate[700]};
    font-weight: 500;

    svg {
      color: ${harrisTheme.colors.primary};
      flex-shrink: 0;
    }
  }
`;

const SideCard = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const BranchNotice = styled.div`
  padding: 1rem 1.1rem;
  border-radius: ${harrisTheme.borderRadius.xl};
  background: rgba(249, 115, 22, 0.08);
  border: 1px solid rgba(249, 115, 22, 0.25);
  color: ${harrisTheme.colors.accentDark};
  display: flex;
  align-items: flex-start;
  gap: 0.65rem;
  font-size: 0.85rem;
  line-height: 1.5;
`;

export interface ConferenceListingProps {
  onBookConference: () => void;
}

const AMENITIES = [
  { icon: 'mdi:projector-screen', label: 'HD Projector &amp; Screen' },
  { icon: 'mdi:wifi-settings', label: 'Dedicated High-Speed Wi-Fi' },
  { icon: 'mdi:power-plug-outline', label: 'Ample Power Outlets' },
  { icon: 'mdi:air-conditioner', label: 'Climate Controlled' },
  { icon: 'mdi:presentation-play', label: 'Whiteboard &amp; Markers' },
  { icon: 'mdi:seat', label: 'Flexible Seating up to 80' },
  { icon: 'mdi:microphone-variant', label: 'PA &amp; Microphones' },
  { icon: 'mdi:coffee-outline', label: 'Catering-friendly space' },
];

export function ConferenceListing({ onBookConference }: ConferenceListingProps) {
  const { currentBranch } = useBranch();
  const hasConference = !!currentBranch?.has_conference;
  const rate = currentBranch?.conference_rate_per_hour ?? 0;
  const halfDay = rate * 4;
  const fullDay = rate * 8;

  return (
    <Wrapper>
      <SectionHeader>
        <Title>
          <h2>Conference Space — {currentBranch?.name}</h2>
          <p>Hourly billing · Flexible setup · Self-catering policy</p>
        </Title>
        {hasConference && (
          <Button variant="accent" size="lg" onClick={onBookConference}>
            <Icon icon="mdi:calendar-clock-outline" width={18} height={18} />
            Reserve Now
          </Button>
        )}
      </SectionHeader>

      {!hasConference ? (
        <Card $padding="xl" style={{ textAlign: 'center', padding: '3.5rem 1.5rem' }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: '1.5rem',
              background: 'rgba(249,115,22,0.12)',
              color: harrisTheme.colors.accent,
              display: 'grid',
              placeItems: 'center',
              margin: '0 auto 1rem',
            }}
          >
            <Icon icon="mdi:presentation" width={34} height={34} />
          </div>
          <h3 style={{ marginBottom: '0.4rem' }}>Conference unavailable at this branch</h3>
          <p style={{ color: harrisTheme.colors.slate[500], maxWidth: 520, margin: '0 auto', lineHeight: 1.6 }}>
            {currentBranch?.name} does not currently offer conference facilities. Please switch
            to another branch using the branch selector above.
          </p>
        </Card>
      ) : (
        <ContentGrid>
          <FeatureCard>
            <FeatureMedia>
              <div className="feature-icon-wrap">
                <Icon icon="mdi:presentation" width={28} height={28} />
              </div>
              <div>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.35rem 0.75rem',
                    borderRadius: 999,
                    background: 'rgba(255,255,255,0.12)',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    marginBottom: '0.9rem',
                    color: harrisTheme.colors.accentLight,
                    backdropFilter: 'blur(4px)',
                  }}
                >
                  <Icon icon="mdi:certificate-outline" width={14} height={14} />
                  PREMIUM VENUE
                </div>
                <h3>Multi-purpose Conference Area</h3>
                <p>
                  Board meetings, product launches, training workshops, AGMs — our versatile
                  space adapts to your event. Flexible layout and AV included; you handle the
                  catering per our self-catering policy.
                </p>
              </div>
            </FeatureMedia>
            <FeatureBody>
              <StatRow>
                <Stat>
                  <div className="stat-label">Hourly Rate</div>
                  <div className="stat-value">{formatCurrency(rate)}</div>
                </Stat>
                <Stat>
                  <div className="stat-label">4-hour Block</div>
                  <div className="stat-value">{formatCurrency(halfDay)}</div>
                </Stat>
                <Stat>
                  <div className="stat-label">Full Day (8h)</div>
                  <div className="stat-value">{formatCurrency(fullDay)}</div>
                </Stat>
              </StatRow>
              <div>
                <div
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    color: harrisTheme.colors.slate[500],
                    marginBottom: '0.65rem',
                  }}
                >
                  Included Amenities
                </div>
                <AmenityGrid>
                  {AMENITIES.map((a) => (
                    <li key={a.label}>
                      <Icon icon={a.icon} width={16} height={16} />
                      <span dangerouslySetInnerHTML={{ __html: a.label }} />
                    </li>
                  ))}
                </AmenityGrid>
              </div>
            </FeatureBody>
          </FeatureCard>

          <SideCard>
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '0.5rem',
                }}
              >
                <Icon
                  icon="mdi:shield-check-outline"
                  width={18}
                  height={18}
                  color={harrisTheme.colors.primary}
                />
                <h4 style={{ fontSize: '1.05rem' }}>Booking info</h4>
              </div>
              <ul
                style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                }}
              >
                {[
                  { icon: 'mdi:clock-time-three-outline', label: 'Minimum 2-hour booking' },
                  { icon: 'mdi:calendar-refresh-outline', label: 'Free reschedule up to 48h' },
                  { icon: 'mdi:ticket-percent-outline', label: 'Full-day discount available' },
                  { icon: 'mdi:account-group-outline', label: 'Capacity up to 80 guests' },
                ].map((r) => (
                  <li
                    key={r.label}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      fontSize: '0.875rem',
                      color: harrisTheme.colors.slate[600],
                      padding: '0.5rem 0',
                      borderBottom: `1px dashed ${harrisTheme.colors.slate[200]}`,
                    }}
                  >
                    <Icon
                      icon={r.icon}
                      width={16}
                      height={16}
                      style={{ color: harrisTheme.colors.accent }}
                    />
                    {r.label}
                  </li>
                ))}
              </ul>
            </div>

            <BranchNotice>
              <Icon icon="mdi:information-outline" width={18} height={18} style={{ flexShrink: 0, marginTop: 1 }} />
              <div>
                <strong style={{ fontWeight: 700 }}>Self-catering policy</strong>: F&amp;B not
                provided. You may arrange external catering subject to our venue guidelines.
              </div>
            </BranchNotice>

            <div
              style={{
                padding: '1rem',
                borderRadius: harrisTheme.borderRadius.xl,
                background: harrisTheme.colors.primary,
                color: harrisTheme.colors.white,
                marginTop: 'auto',
              }}
            >
              <div style={{ fontSize: '0.8rem', opacity: 0.8, marginBottom: '0.25rem' }}>
                Questions?
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '1rem',
                  fontWeight: 700,
                  fontFamily: harrisTheme.fontFamily.display,
                  marginBottom: '0.15rem',
                }}
              >
                <Icon icon="mdi:phone-in-talk-outline" width={18} height={18} style={{ color: harrisTheme.colors.accentLight }} />
                {currentBranch?.contact_phone ?? 'Contact branch'}
              </div>
              <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>
                {currentBranch?.location} · {currentBranch?.address}
              </div>
            </div>
          </SideCard>
        </ContentGrid>
      )}
    </Wrapper>
  );
}

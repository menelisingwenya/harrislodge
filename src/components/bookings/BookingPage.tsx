import { useState, useMemo, useEffect } from 'react';
import styled from 'styled-components';
import { Icon } from '@iconify/react';
import { harrisTheme } from '@/theme';
import { useBranch } from '@/context/BranchContext';
import { BRAND_CONTACT, BRAND_ASSETS } from '@/lib/brand';
import type { Room } from '@/types/database';

export interface BookingPageProps {
  preselectedRoom?: Room | null;
  initialDates?: { checkIn?: string; checkOut?: string; adults?: number; children?: number; branchId?: string };
  onNavigateHome?: () => void;
  onNavigateSection?: (section: string) => void;
}

interface RoomOption {
  id: string;
  category: 'standard' | 'deluxe' | 'executive' | 'conference';
  name: string;
  subtitle: string;
  image: string;
  pricePerNight: number;
  bedType: string;
  capacity: string;
  size: string;
  highlights: string[];
  amenities: { icon: string; label: string }[];
}

const AVAILABLE_ROOMS: RoomOption[] = [
  {
    id: 'room-standard',
    category: 'standard',
    name: 'Standard Queen Suite',
    subtitle: 'Classic comfort with serene garden views & modern styling',
    image: '/images/harris%20standard.png',
    pricePerNight: 45,
    bedType: '1 Queen Memory Foam Bed',
    capacity: 'Up to 2 Guests',
    size: '28 m²',
    highlights: ['Complimentary High-Speed WiFi', 'En-suite Rainfall Shower', 'Daily Housekeeping'],
    amenities: [
      { icon: 'mdi:television', label: 'Smart HD TV & DSTV' },
      { icon: 'mdi:fridge-outline', label: 'In-Room Mini Fridge' },
      { icon: 'mdi:wifi', label: 'Fiber High-Speed WiFi' },
      { icon: 'mdi:air-conditioner', label: 'Climate Control AC' },
      { icon: 'mdi:coffee', label: 'Tea & Coffee Bar' },
      { icon: 'mdi:shower', label: 'Rainfall Shower' },
    ],
  },
  {
    id: 'room-deluxe',
    category: 'deluxe',
    name: 'Deluxe Executive Suite',
    subtitle: 'Elevated luxury with panoramic terrace & bespoke velvet lounge',
    image: '/images/harris%20deluxe.png',
    pricePerNight: 60,
    bedType: '1 Master King Bed',
    capacity: '2 - 3 Guests',
    size: '42 m²',
    highlights: ['Private Balcony / Terrace', 'Marble Soaking Tub', 'Complimentary Bottled Water'],
    amenities: [
      { icon: 'mdi:television', label: '55" 4K Smart TV' },
      { icon: 'mdi:fridge-outline', label: 'Mini Fridge & Minibar' },
      { icon: 'mdi:wifi', label: 'Ultra-Fast WiFi' },
      { icon: 'mdi:bathtub-outline', label: 'Deep Soaking Tub' },
      { icon: 'mdi:air-conditioner', label: 'Silent Climate AC' },
      { icon: 'mdi:balcony', label: 'Sunset Balcony' },
    ],
  },
  {
    id: 'room-executive',
    category: 'executive',
    name: 'Presidential Executive Villa',
    subtitle: 'Signature VIP residence with meeting nook & dedicated concierge',
    image: '/images/harris%20room.png',
    pricePerNight: 80,
    bedType: 'Master King + Work Study',
    capacity: '3 - 4 Guests',
    size: '65 m²',
    highlights: ['Airport Chauffeured Pickup', 'Dual Marble Bathrooms', 'Executive Lounge Access'],
    amenities: [
      { icon: 'mdi:television', label: '65" OLED Smart TV' },
      { icon: 'mdi:fridge-outline', label: 'Premium In-Suite Fridge' },
      { icon: 'mdi:wifi', label: 'Enterprise WiFi' },
      { icon: 'mdi:desk', label: 'Executive Work Study' },
      { icon: 'mdi:room-service-outline', label: '24/7 VIP Concierge' },
      { icon: 'mdi:silverware-fork-knife', label: 'Artisan Breakfast' },
    ],
  },
  {
    id: 'room-conference',
    category: 'conference',
    name: 'Executive Conference Hall',
    subtitle: 'State-of-the-art corporate summit, banquet & boardroom facility',
    image: '/images/harris%20conference.png',
    pricePerNight: 250,
    bedType: 'Boardroom / U-Shape / Theater',
    capacity: 'Up to 60 Attendees',
    size: '120 m²',
    highlights: ['4K Laser Projectors & AV', 'Polycom Audio Stations', 'Buffet Tea & Catering Space'],
    amenities: [
      { icon: 'mdi:projector', label: '4K Laser Projection' },
      { icon: 'mdi:microphone-outline', label: 'Wireless Audio AV' },
      { icon: 'mdi:wifi', label: 'High-Density WiFi' },
      { icon: 'mdi:air-conditioner', label: 'Full Air Conditioning' },
      { icon: 'mdi:coffee', label: 'Continuous Tea Bar' },
      { icon: 'mdi:security', label: 'Private Event Access' },
    ],
  },
];

/* ── STYLED COMPONENTS ── */

const PageWrapper = styled.div`
  width: 100%;
  background: #F7FAF8;
  min-height: 100vh;
  color: #1A202C;
`;

const HeroBannerSection = styled.section`
  position: relative;
  min-height: 360px;
  background:
    linear-gradient(rgba(0, 30, 24, 0.78), rgba(0, 30, 24, 0.85)),
    url('/images/home/services_bedroom.jpg') center/cover no-repeat;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 4rem 1.5rem 5rem;
  color: #FFFFFF;

  @media (max-width: 768px) {
    min-height: 280px;
    padding: 3rem 1rem 4rem;
  }
`;

const HeroTitle = styled.h1`
  font-family: 'Playfair Display', Georgia, serif;
  font-size: clamp(2.2rem, 4.5vw, 3.4rem);
  font-weight: 700;
  color: #FFFFFF;
  margin-bottom: 0.75rem;
  line-height: 1.15;
`;

const HeroSubtitle = styled.p`
  font-size: 1.05rem;
  color: rgba(255, 255, 255, 0.9);
  max-width: 640px;
  line-height: 1.6;
  margin-bottom: 1.25rem;
`;

const Breadcrumbs = styled.nav`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.88rem;
  color: rgba(255, 255, 255, 0.75);

  .crumb-link {
    color: rgba(255, 255, 255, 0.9);
    cursor: pointer;
    text-decoration: none;
    transition: color 180ms ease;
    &:hover {
      color: #D97E26;
    }
  }

  .separator {
    color: rgba(255, 255, 255, 0.4);
  }

  .current {
    color: #FFAE58;
    font-weight: 600;
  }
`;

const MainContainer = styled.main`
  max-width: 1360px;
  margin: -2.5rem auto 4rem;
  padding: 0 1.5rem;
  position: relative;
  z-index: 10;

  @media (max-width: 640px) {
    padding: 0 1rem;
    margin-top: -1.5rem;
  }
`;

const BookingGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 420px;
  gap: 2rem;
  align-items: start;

  @media (max-width: 1080px) {
    grid-template-columns: 1fr;
  }
`;

const FormSectionCard = styled.div`
  background: #FFFFFF;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  border: 1px solid #E2E8F0;
  margin-bottom: 1.75rem;

  @media (max-width: 640px) {
    padding: 1.25rem;
  }

  .section-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1.25rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid #EDF2F7;

    .step-number {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: #006A56;
      color: #FFFFFF;
      font-weight: 700;
      font-size: 0.9rem;
      display: grid;
      place-items: center;
    }

    h2 {
      font-size: 1.25rem;
      font-weight: 700;
      color: #00382E;
      margin: 0;
      font-family: 'Playfair Display', Georgia, serif;
    }

    .badge {
      margin-left: auto;
      background: rgba(217, 126, 38, 0.12);
      color: #D97E26;
      font-size: 0.75rem;
      font-weight: 600;
      padding: 0.25rem 0.6rem;
      border-radius: 999px;
    }
  }
`;

const BranchSelectorWrap = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 0.75rem;
  margin-top: 1rem;
`;

const BranchCard = styled.button<{ $selected: boolean }>`
  background: ${(p) => (p.$selected ? 'rgba(0, 106, 86, 0.06)' : '#FFFFFF')};
  border: 2px solid ${(p) => (p.$selected ? '#006A56' : '#E2E8F0')};
  border-radius: 8px;
  padding: 0.85rem 1rem;
  text-align: left;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  transition: all 180ms ease;

  &:hover {
    border-color: ${(p) => (p.$selected ? '#006A56' : '#CBD5E1')};
    background: ${(p) => (p.$selected ? 'rgba(0, 106, 86, 0.08)' : '#F8FAFC')};
  }

  .branch-name {
    font-weight: 700;
    font-size: 0.95rem;
    color: ${(p) => (p.$selected ? '#006A56' : '#1A202C')};
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .branch-address {
    font-size: 0.78rem;
    color: #64748B;
  }

  .branch-phone {
    font-size: 0.75rem;
    color: #D97E26;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 0.25rem;
    margin-top: 0.25rem;
  }
`;

const RoomOptionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1.25rem;
  margin-top: 1rem;
`;

const RoomSelectionCard = styled.div<{ $selected: boolean }>`
  border: 2px solid ${(p) => (p.$selected ? '#006A56' : '#E2E8F0')};
  background: ${(p) => (p.$selected ? 'rgba(0, 106, 86, 0.02)' : '#FFFFFF')};
  border-radius: 10px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition: all 200ms ease;
  box-shadow: ${(p) => (p.$selected ? '0 8px 24px rgba(0, 106, 86, 0.12)' : '0 2px 8px rgba(0,0,0,0.04)')};

  &:hover {
    border-color: ${(p) => (p.$selected ? '#006A56' : '#006A56')};
    transform: translateY(-2px);
  }

  .img-wrap {
    height: 150px;
    position: relative;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 300ms ease;
    }

    .price-pill {
      position: absolute;
      bottom: 8px;
      right: 8px;
      background: rgba(0, 41, 33, 0.85);
      backdrop-filter: blur(4px);
      color: #FFAE58;
      font-weight: 700;
      font-size: 0.85rem;
      padding: 0.3rem 0.65rem;
      border-radius: 4px;
    }
  }

  .body {
    padding: 1rem;
    display: flex;
    flex-direction: column;
    flex: 1;

    h3 {
      font-size: 1.05rem;
      font-weight: 700;
      color: #00382E;
      margin: 0 0 0.25rem;
      font-family: 'Playfair Display', Georgia, serif;
    }

    .room-desc {
      font-size: 0.78rem;
      color: #64748B;
      line-height: 1.4;
      margin-bottom: 0.75rem;
    }

    .meta-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.4rem;
      margin-bottom: 1rem;
      font-size: 0.75rem;
      color: #475569;

      span {
        background: #F1F5F9;
        padding: 0.2rem 0.5rem;
        border-radius: 4px;
        display: inline-flex;
        align-items: center;
        gap: 0.25rem;
      }
    }

    .select-btn {
      margin-top: auto;
      padding: 0.6rem;
      border-radius: 6px;
      font-weight: 700;
      font-size: 0.82rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.4rem;
      background: ${(p) => (p.$selected ? '#006A56' : '#F1F5F9')};
      color: ${(p) => (p.$selected ? '#FFFFFF' : '#00382E')};
      transition: all 180ms ease;

      &:hover {
        background: ${(p) => (p.$selected ? '#004D3F' : '#E2E8F0')};
      }
    }
  }
`;

const DatesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;

  label {
    font-size: 0.82rem;
    font-weight: 700;
    color: #00382E;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    display: flex;
    align-items: center;
    gap: 0.35rem;
  }

  input, select, textarea {
    padding: 0.75rem 0.9rem;
    border: 1.5px solid #CBD5E1;
    border-radius: 8px;
    font-size: 0.92rem;
    color: #1E293B;
    background: #FFFFFF;
    transition: all 180ms ease;
    font-family: inherit;

    &:focus {
      outline: none;
      border-color: #006A56;
      box-shadow: 0 0 0 3px rgba(0, 106, 86, 0.15);
    }
  }

  .field-hint {
    font-size: 0.75rem;
    color: #64748B;
  }
`;

const UserFieldsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

/* ── STICKY SUMMARY CARD ── */

const StickySummaryCard = styled.div`
  background: #FFFFFF;
  border-radius: 12px;
  border: 1px solid #CBD5E1;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  position: sticky;
  top: 90px;
  overflow: hidden;

  .header {
    background: #00382E;
    color: #FFFFFF;
    padding: 1.25rem 1.5rem;
    border-bottom: 2px solid #D97E26;

    h3 {
      font-size: 1.2rem;
      font-weight: 700;
      margin: 0 0 0.25rem;
      font-family: 'Playfair Display', Georgia, serif;
    }

    p {
      font-size: 0.8rem;
      color: rgba(255, 255, 255, 0.8);
      margin: 0;
    }
  }

  .body {
    padding: 1.5rem;

    @media (max-width: 640px) {
      padding: 1.25rem;
    }
  }

  .selected-room-banner {
    display: flex;
    gap: 1rem;
    align-items: center;
    background: #F8FAFC;
    border: 1px solid #E2E8F0;
    border-radius: 8px;
    padding: 0.75rem;
    margin-bottom: 1.25rem;

    img {
      width: 64px;
      height: 64px;
      border-radius: 6px;
      object-fit: cover;
    }

    .room-info {
      h4 {
        margin: 0 0 0.2rem;
        font-size: 0.95rem;
        font-weight: 700;
        color: #00382E;
      }
      span {
        font-size: 0.8rem;
        color: #D97E26;
        font-weight: 600;
      }
    }
  }

  .summary-line {
    display: flex;
    justify-content: space-between;
    font-size: 0.88rem;
    color: #475569;
    padding: 0.5rem 0;
    border-bottom: 1px dashed #E2E8F0;

    .value {
      font-weight: 600;
      color: #1E293B;
    }
  }

  .total-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 1rem;
    padding-top: 0.75rem;
    border-top: 2px solid #00382E;

    .label {
      font-weight: 700;
      font-size: 1rem;
      color: #00382E;
      font-family: 'Playfair Display', Georgia, serif;
    }

    .amount {
      font-weight: 800;
      font-size: 1.5rem;
      color: #006A56;
    }
  }

  .actions-container {
    margin-top: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .whatsapp-btn {
    background: #25D366;
    color: #FFFFFF;
    border: none;
    border-radius: 8px;
    padding: 0.9rem 1.25rem;
    font-weight: 700;
    font-size: 0.95rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.6rem;
    cursor: pointer;
    box-shadow: 0 4px 14px rgba(37, 211, 102, 0.35);
    transition: all 180ms ease;

    &:hover {
      background: #1EBE5B;
      transform: translateY(-1px);
      box-shadow: 0 6px 18px rgba(37, 211, 102, 0.45);
    }
  }

  .email-btn {
    background: #D97E26;
    color: #FFFFFF;
    border: none;
    border-radius: 8px;
    padding: 0.9rem 1.25rem;
    font-weight: 700;
    font-size: 0.95rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.6rem;
    cursor: pointer;
    box-shadow: 0 4px 14px rgba(217, 126, 38, 0.3);
    transition: all 180ms ease;

    &:hover {
      background: #B8651B;
      transform: translateY(-1px);
      box-shadow: 0 6px 18px rgba(217, 126, 38, 0.4);
    }
  }

  .guarantee-box {
    margin-top: 1.25rem;
    background: #F0FDF4;
    border: 1px solid #BBF7D0;
    border-radius: 8px;
    padding: 0.75rem 0.9rem;
    font-size: 0.78rem;
    color: #166534;
    display: flex;
    flex-direction: column;
    gap: 0.4rem;

    .item {
      display: flex;
      align-items: center;
      gap: 0.4rem;
    }
  }
`;

const ChannelTabWrap = styled.div`
  display: flex;
  gap: 0.5rem;
  background: #F1F5F9;
  padding: 0.35rem;
  border-radius: 8px;
  margin-bottom: 1.25rem;
`;

const ChannelTab = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: 0.6rem 0.75rem;
  border-radius: 6px;
  border: none;
  font-size: 0.85rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 180ms ease;
  background: ${(p) => (p.$active ? '#FFFFFF' : 'transparent')};
  color: ${(p) => (p.$active ? '#00382E' : '#64748B')};
  box-shadow: ${(p) => (p.$active ? '0 2px 8px rgba(0,0,0,0.06)' : 'none')};
`;

const ConfirmationModalCard = styled.div`
  background: #FFFFFF;
  border-radius: 12px;
  padding: 2rem;
  border: 2px solid #006A56;
  box-shadow: 0 10px 30px rgba(0, 106, 86, 0.15);
  margin-top: 1.5rem;
  text-align: center;

  .check-icon {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: #E8F5E9;
    color: #006A56;
    display: grid;
    place-items: center;
    margin: 0 auto 1rem;
  }

  h3 {
    font-size: 1.4rem;
    font-weight: 700;
    color: #00382E;
    margin: 0 0 0.5rem;
    font-family: 'Playfair Display', Georgia, serif;
  }

  p {
    font-size: 0.92rem;
    color: #475569;
    line-height: 1.6;
    margin-bottom: 1.25rem;
  }

  .ref-pill {
    display: inline-block;
    background: #F1F5F9;
    border: 1px solid #CBD5E1;
    padding: 0.4rem 1rem;
    border-radius: 6px;
    font-family: monospace;
    font-size: 1rem;
    font-weight: 700;
    color: #006A56;
    margin-bottom: 1.5rem;
  }
`;

export function BookingPage({
  preselectedRoom,
  initialDates,
  onNavigateHome,
  onNavigateSection,
}: BookingPageProps) {
  const { branches, currentBranch, setCurrentBranchById } = useBranch();

  // Selected Branch
  const [selectedBranchId, setSelectedBranchId] = useState<string>(() => {
    return initialDates?.branchId || currentBranch?.id || (branches[0]?.id ?? 'branch-northend');
  });

  const activeBranch = useMemo(() => {
    return branches.find((b) => b.id === selectedBranchId) || currentBranch || branches[0];
  }, [branches, selectedBranchId, currentBranch]);

  // Selected Room
  const [selectedRoomId, setSelectedRoomId] = useState<string>(() => {
    if (preselectedRoom) {
      if (preselectedRoom.room_type === 'standard') return 'room-standard';
      if (preselectedRoom.room_type === 'deluxe') return 'room-deluxe';
      if (preselectedRoom.room_type === 'double_executive') return 'room-executive';
      return 'room-standard';
    }
    return 'room-deluxe';
  });

  const activeRoom = useMemo(() => {
    return AVAILABLE_ROOMS.find((r) => r.id === selectedRoomId) || AVAILABLE_ROOMS[0];
  }, [selectedRoomId]);

  // Dates
  const [checkIn, setCheckIn] = useState<string>(() => {
    if (initialDates?.checkIn) return initialDates.checkIn;
    const today = new Date();
    return today.toISOString().split('T')[0];
  });

  const [checkOut, setCheckOut] = useState<string>(() => {
    if (initialDates?.checkOut) return initialDates.checkOut;
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  });

  const [adults, setAdults] = useState<number>(initialDates?.adults || 2);
  const [children, setChildren] = useState<number>(initialDates?.children || 0);

  // Guest Details
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');

  // Channel tab
  const [preferredChannel, setPreferredChannel] = useState<'both' | 'whatsapp' | 'email'>('both');
  const [confirmedBookingRef, setConfirmedBookingRef] = useState<string | null>(null);

  // Total calculation
  const totalNights = useMemo(() => {
    if (!checkIn || !checkOut) return 1;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 1;
  }, [checkIn, checkOut]);

  const estimatedTotal = useMemo(() => {
    return totalNights * activeRoom.pricePerNight;
  }, [totalNights, activeRoom.pricePerNight]);

  // Format booking reference
  const generateRef = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = 'HL-';
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  // Build structured message
  const buildReservationText = (refCode: string) => {
    return `*HARRIS LODGES RESERVATION REQUEST*
----------------------------------------
*Reference:* ${refCode}
*Branch:* ${activeBranch?.name || 'Harris Lodge'}
*Branch Address:* ${activeBranch?.address || activeBranch?.location || 'Bulawayo, Zimbabwe'}
*Room / Suite:* ${activeRoom.name} ($${activeRoom.pricePerNight} / night)

*DATES & GUESTS*
• Check-In: ${checkIn}
• Check-Out: ${checkOut}
• Duration: ${totalNights} Night${totalNights > 1 ? 's' : ''}
• Guests: ${adults} Adult${adults > 1 ? 's' : ''}${children > 0 ? `, ${children} Children` : ''}

*GUEST DETAILS*
• Name: ${guestName.trim() || 'Guest'}
• Phone / WhatsApp: ${guestPhone.trim() || 'Provided upon contact'}
• Email: ${guestEmail.trim() || 'N/A'}
${specialRequests.trim() ? `• Special Requests: ${specialRequests.trim()}` : ''}

*ESTIMATED TOTAL:* $${estimatedTotal} USD
(Direct booking · Pay on arrival or direct bank transfer)
----------------------------------------
Please confirm room availability and finalize this reservation. Thank you!`;
  };

  // WhatsApp Handler
  const handleBookViaWhatsApp = () => {
    if (!guestName.trim()) {
      alert('Please enter your Name before sending your reservation.');
      return;
    }
    const refCode = generateRef();
    setConfirmedBookingRef(refCode);

    const message = buildReservationText(refCode);
    const encoded = encodeURIComponent(message);
    const phoneClean = (activeBranch?.contact_phone || BRAND_CONTACT.whatsappNumber).replace(/[^0-9]/g, '');
    const waUrl = `https://wa.me/${phoneClean || '263775477464'}?text=${encoded}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  // Email Handler
  const handleBookViaEmail = () => {
    if (!guestName.trim()) {
      alert('Please enter your Name before sending your reservation.');
      return;
    }
    const refCode = generateRef();
    setConfirmedBookingRef(refCode);

    const subject = encodeURIComponent(`Reservation Request: ${activeRoom.name} at ${activeBranch?.name || 'Harris Lodge'} [${refCode}]`);
    const body = encodeURIComponent(buildReservationText(refCode));
    const targetEmail = BRAND_CONTACT.generalEmail;
    const mailtoUrl = `mailto:${targetEmail}?subject=${subject}&body=${body}`;

    window.location.href = mailtoUrl;
  };

  return (
    <PageWrapper>
      {/* 1. Page Header Hero */}
      <HeroBannerSection>
        <HeroTitle>Reserve Your Stay</HeroTitle>
        <HeroSubtitle>
          Book directly with Harris Lodges for best rates, bespoke hospitality, and direct confirmation via WhatsApp or Email. No upfront credit card required.
        </HeroSubtitle>
        <Breadcrumbs>
          <span className="crumb-link" onClick={onNavigateHome}>
            Home
          </span>
          <span className="separator">/</span>
          <span className="crumb-link" onClick={() => onNavigateSection?.('rooms')}>
            Rooms &amp; Suites
          </span>
          <span className="separator">/</span>
          <span className="current">Book Now</span>
        </Breadcrumbs>
      </HeroBannerSection>

      {/* 2. Main Booking Container */}
      <MainContainer>
        <BookingGrid>
          {/* LEFT: Booking Configuration Forms */}
          <div>
            {/* Step 1: Select Branch */}
            <FormSectionCard>
              <div className="section-header">
                <div className="step-number">1</div>
                <h2>Select Harris Lodge Branch</h2>
                <span className="badge">12 Locations in Zimbabwe</span>
              </div>
              <p style={{ fontSize: '0.88rem', color: '#64748B', margin: '0 0 1rem' }}>
                Choose which of our tranquil properties in Bulawayo and surrounds you would like to reserve:
              </p>

              <BranchSelectorWrap>
                {branches.map((b) => {
                  const isSelected = b.id === selectedBranchId;
                  return (
                    <BranchCard
                      key={b.id}
                      $selected={isSelected}
                      onClick={() => {
                        setSelectedBranchId(b.id);
                        setCurrentBranchById(b.id);
                      }}
                      type="button"
                    >
                      <div className="branch-name">
                        <span>{b.name}</span>
                        {isSelected && <Icon icon="mdi:check-circle" width={18} height={18} style={{ color: '#006A56' }} />}
                      </div>
                      <div className="branch-address">{b.location || b.address || 'Bulawayo, Zimbabwe'}</div>
                      {b.contact_phone && (
                        <div className="branch-phone">
                          <Icon icon="mdi:phone" width={12} height={12} />
                          <span>{b.contact_phone}</span>
                        </div>
                      )}
                    </BranchCard>
                  );
                })}
              </BranchSelectorWrap>
            </FormSectionCard>

            {/* Step 2: Choose Accommodation Category */}
            <FormSectionCard>
              <div className="section-header">
                <div className="step-number">2</div>
                <h2>Choose Suite or Room</h2>
                <span className="badge">Direct Rates</span>
              </div>
              <p style={{ fontSize: '0.88rem', color: '#64748B', margin: '0 0 1rem' }}>
                Select your preferred room type at <strong>{activeBranch?.name}</strong>:
              </p>

              <RoomOptionsGrid>
                {AVAILABLE_ROOMS.map((room) => {
                  const isSelected = room.id === selectedRoomId;
                  return (
                    <RoomSelectionCard
                      key={room.id}
                      $selected={isSelected}
                      onClick={() => setSelectedRoomId(room.id)}
                    >
                      <div className="img-wrap">
                        <img src={room.image} alt={room.name} />
                        <div className="price-pill">${room.pricePerNight} / night</div>
                      </div>
                      <div className="body">
                        <h3>{room.name}</h3>
                        <p className="room-desc">{room.subtitle}</p>
                        <div className="meta-tags">
                          <span>
                            <Icon icon="mdi:bed-king-outline" width={14} height={14} />
                            {room.bedType}
                          </span>
                          <span>
                            <Icon icon="mdi:account-group-outline" width={14} height={14} />
                            {room.capacity}
                          </span>
                        </div>
                        <button
                          type="button"
                          className="select-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedRoomId(room.id);
                          }}
                        >
                          {isSelected ? (
                            <>
                              <Icon icon="mdi:check-circle" width={16} height={16} />
                              Selected Suite
                            </>
                          ) : (
                            'Select Suite'
                          )}
                        </button>
                      </div>
                    </RoomSelectionCard>
                  );
                })}
              </RoomOptionsGrid>
            </FormSectionCard>

            {/* Step 3: Dates & Occupancy */}
            <FormSectionCard>
              <div className="section-header">
                <div className="step-number">3</div>
                <h2>Dates &amp; Occupancy</h2>
                <span className="badge">{totalNights} Night{totalNights > 1 ? 's' : ''} Stay</span>
              </div>

              <DatesGrid>
                <FormGroup>
                  <label htmlFor="booking-checkin">
                    <Icon icon="mdi:calendar-import" width={16} height={16} style={{ color: '#006A56' }} />
                    Check-In Date
                  </label>
                  <input
                    id="booking-checkin"
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                  />
                  <span className="field-hint">Check-in time from 14:00</span>
                </FormGroup>

                <FormGroup>
                  <label htmlFor="booking-checkout">
                    <Icon icon="mdi:calendar-export" width={16} height={16} style={{ color: '#006A56' }} />
                    Check-Out Date
                  </label>
                  <input
                    id="booking-checkout"
                    type="date"
                    value={checkOut}
                    min={checkIn}
                    onChange={(e) => setCheckOut(e.target.value)}
                  />
                  <span className="field-hint">Check-out time by 11:00</span>
                </FormGroup>

                <FormGroup>
                  <label htmlFor="booking-adults">
                    <Icon icon="mdi:account-outline" width={16} height={16} style={{ color: '#006A56' }} />
                    Adults
                  </label>
                  <select
                    id="booking-adults"
                    value={adults}
                    onChange={(e) => setAdults(Number(e.target.value))}
                  >
                    <option value={1}>1 Adult</option>
                    <option value={2}>2 Adults</option>
                    <option value={3}>3 Adults</option>
                    <option value={4}>4 Adults</option>
                  </select>
                </FormGroup>

                <FormGroup>
                  <label htmlFor="booking-children">
                    <Icon icon="mdi:baby-carriage" width={16} height={16} style={{ color: '#006A56' }} />
                    Children
                  </label>
                  <select
                    id="booking-children"
                    value={children}
                    onChange={(e) => setChildren(Number(e.target.value))}
                  >
                    <option value={0}>0 Children</option>
                    <option value={1}>1 Child</option>
                    <option value={2}>2 Children</option>
                    <option value={3}>3+ Children</option>
                  </select>
                </FormGroup>
              </DatesGrid>
            </FormSectionCard>

            {/* Step 4: Guest Contact Details */}
            <FormSectionCard>
              <div className="section-header">
                <div className="step-number">4</div>
                <h2>Guest Information</h2>
                <span className="badge">Direct Contact</span>
              </div>

              <UserFieldsGrid>
                <FormGroup>
                  <label htmlFor="guest-full-name">Full Name *</label>
                  <input
                    id="guest-full-name"
                    type="text"
                    placeholder="e.g. John Moyo"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <label htmlFor="guest-phone-number">WhatsApp / Phone Number *</label>
                  <input
                    id="guest-phone-number"
                    type="tel"
                    placeholder="e.g. +263 77 123 4567"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    required
                  />
                </FormGroup>
              </UserFieldsGrid>

              <div style={{ marginTop: '1rem' }}>
                <FormGroup>
                  <label htmlFor="guest-email-address">Email Address</label>
                  <input
                    id="guest-email-address"
                    type="email"
                    placeholder="e.g. guest@example.com"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                  />
                </FormGroup>
              </div>

              <div style={{ marginTop: '1rem' }}>
                <FormGroup>
                  <label htmlFor="guest-special-requests">Special Requests / Inquiries (Optional)</label>
                  <textarea
                    id="guest-special-requests"
                    rows={3}
                    placeholder="Airport pickup, early check-in, dietary preferences, conference setup, etc."
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                  />
                </FormGroup>
              </div>
            </FormSectionCard>

            {/* Confirmation Banner if sent */}
            {confirmedBookingRef && (
              <ConfirmationModalCard>
                <div className="check-icon">
                  <Icon icon="mdi:check-bold" width={32} height={32} />
                </div>
                <h3>Reservation Request Initiated</h3>
                <p>
                  Your booking details have been assembled for <strong>{activeBranch?.name}</strong>.
                  Keep your reference code handy for communications with our reception desk.
                </p>
                <div className="ref-pill">Ref: {confirmedBookingRef}</div>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={handleBookViaWhatsApp}
                    style={{
                      background: '#25D366',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '0.65rem 1.25rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                    }}
                  >
                    <Icon icon="mdi:whatsapp" width={18} height={18} />
                    Open WhatsApp Chat
                  </button>
                  <button
                    type="button"
                    onClick={handleBookViaEmail}
                    style={{
                      background: '#D97E26',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '0.65rem 1.25rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                    }}
                  >
                    <Icon icon="mdi:email-outline" width={18} height={18} />
                    Open Email Client
                  </button>
                </div>
              </ConfirmationModalCard>
            )}
          </div>

          {/* RIGHT: Live Summary & Direct Booking CTAs */}
          <div>
            <StickySummaryCard>
              <div className="header">
                <h3>Reservation Summary</h3>
                <p>Direct Lodge Booking · Instant Help</p>
              </div>

              <div className="body">
                <div className="selected-room-banner">
                  <img src={activeRoom.image} alt={activeRoom.name} />
                  <div className="room-info">
                    <h4>{activeRoom.name}</h4>
                    <span>${activeRoom.pricePerNight} / night</span>
                  </div>
                </div>

                <div className="summary-line">
                  <span>Selected Location:</span>
                  <span className="value">{activeBranch?.name}</span>
                </div>

                <div className="summary-line">
                  <span>Check-In:</span>
                  <span className="value">{checkIn}</span>
                </div>

                <div className="summary-line">
                  <span>Check-Out:</span>
                  <span className="value">{checkOut}</span>
                </div>

                <div className="summary-line">
                  <span>Duration:</span>
                  <span className="value">
                    {totalNights} Night{totalNights > 1 ? 's' : ''}
                  </span>
                </div>

                <div className="summary-line">
                  <span>Guests:</span>
                  <span className="value">
                    {adults} Adult{adults > 1 ? 's' : ''}
                    {children > 0 ? `, ${children} Children` : ''}
                  </span>
                </div>

                <div className="total-row">
                  <span className="label">Estimated Total</span>
                  <span className="amount">${estimatedTotal}</span>
                </div>

                <p style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.35rem', textAlign: 'right' }}>
                  *All prices in USD. No card needed today.
                </p>

                {/* Booking Channel Selection */}
                <div style={{ marginTop: '1.25rem' }}>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#00382E', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'block' }}>
                    Choose How to Book:
                  </label>
                  <ChannelTabWrap>
                    <ChannelTab
                      $active={preferredChannel === 'both' || preferredChannel === 'whatsapp'}
                      onClick={() => setPreferredChannel('whatsapp')}
                      type="button"
                    >
                      <Icon icon="mdi:whatsapp" width={18} height={18} style={{ color: '#25D366' }} />
                      WhatsApp
                    </ChannelTab>
                    <ChannelTab
                      $active={preferredChannel === 'email'}
                      onClick={() => setPreferredChannel('email')}
                      type="button"
                    >
                      <Icon icon="mdi:email-outline" width={18} height={18} style={{ color: '#D97E26' }} />
                      Email
                    </ChannelTab>
                  </ChannelTabWrap>
                </div>

                {/* Direct Action Buttons */}
                <div className="actions-container">
                  {(preferredChannel === 'both' || preferredChannel === 'whatsapp') && (
                    <button
                      type="button"
                      className="whatsapp-btn"
                      onClick={handleBookViaWhatsApp}
                      title="Chat and book directly on WhatsApp"
                    >
                      <Icon icon="mdi:whatsapp" width={22} height={22} />
                      <span>Book via WhatsApp</span>
                    </button>
                  )}

                  {(preferredChannel === 'both' || preferredChannel === 'email') && (
                    <button
                      type="button"
                      className="email-btn"
                      onClick={handleBookViaEmail}
                      title="Send your booking request via Email"
                    >
                      <Icon icon="mdi:email-fast-outline" width={22} height={22} />
                      <span>Book via Email</span>
                    </button>
                  )}
                </div>

                <div className="guarantee-box">
                  <div className="item">
                    <Icon icon="mdi:shield-check" width={16} height={16} />
                    <span>Direct Lodge Best Price Guarantee</span>
                  </div>
                  <div className="item">
                    <Icon icon="mdi:credit-card-off-outline" width={16} height={16} />
                    <span>Zero Card Processing Fees · Pay on Arrival</span>
                  </div>
                  <div className="item">
                    <Icon icon="mdi:clock-fast" width={16} height={16} />
                    <span>Instant Concierge Confirmation</span>
                  </div>
                </div>

                {/* Direct Phone Assistance */}
                <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #EDF2F7', textAlign: 'center' }}>
                  <span style={{ fontSize: '0.8rem', color: '#64748B' }}>Prefer to call us directly?</span>
                  <a
                    href={`tel:${activeBranch?.contact_phone || BRAND_CONTACT.centralPhone}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.4rem',
                      color: '#006A56',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      textDecoration: 'none',
                      marginTop: '0.35rem',
                    }}
                  >
                    <Icon icon="mdi:phone" width={16} height={16} style={{ color: '#D97E26' }} />
                    <span>{activeBranch?.contact_phone || BRAND_CONTACT.centralPhone}</span>
                  </a>
                </div>
              </div>
            </StickySummaryCard>
          </div>
        </BookingGrid>
      </MainContainer>
    </PageWrapper>
  );
}

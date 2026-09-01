import { useState, useMemo } from 'react';
import styled from 'styled-components';
import { harrisTheme } from '@/theme';
import { useBranch } from '@/context/BranchContext';
import { formatCurrency } from '@/lib/utils';
import type { Room } from '@/types/database';
import { Icon } from '@iconify/react';

/* ============================================================
   TYPES & INTERFACES
   ============================================================ */

export type RoomFilterCategory = 'all' | 'standard' | 'deluxe' | 'executive' | 'conference';

export interface RoomListingProps {
  onBookRoom: (room?: Room | any) => void;
  onBookConference?: (branchId?: string) => void;
  onNavigate?: (section: 'home' | 'rooms' | 'conference' | 'services' | 'about' | 'contact') => void;
}

export interface RoomDisplayItem {
  id: string;
  category: 'standard' | 'deluxe' | 'executive' | 'conference';
  title: string;
  subtitle?: string;
  image: string;
  gallery: string[];
  reviewsCount: number;
  rating: number;
  price: number;
  priceFormatted?: string;
  priceUnit: string;
  status: string;
  payment: string;
  guestCapacity: string;
  beds: string;
  description: string;
  amenities: string[];
  isAvailable: boolean;
  branchName: string;
  databaseRoom?: Room;
}

/* ============================================================
   STYLED COMPONENTS - SCREENSHOT ACCURATE DESIGN
   ============================================================ */

const PageContainer = styled.div`
  width: 100%;
  background: #FFFFFF;
  min-height: 100vh;
`;

/* ── 1. HERO BANNER & BREADCRUMBS ── */
const HeroSection = styled.section`
  position: relative;
  min-height: 400px;
  background:
    linear-gradient(rgba(0, 30, 24, 0.72), rgba(0, 30, 24, 0.78)),
    url('/images/home/services_bedroom.jpg') center/cover no-repeat;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 4.5rem 1.5rem 6.5rem;
  color: #FFFFFF;

  @media (max-width: 768px) {
    min-height: 320px;
    padding: 3rem 1rem 5rem;
  }
`;

const HeroTitle = styled.h1`
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 3.8rem;
  font-weight: 700;
  color: #FFFFFF;
  margin-bottom: 0.65rem;
  letter-spacing: -0.01em;

  @media (max-width: 768px) {
    font-size: 2.6rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1rem;
  font-style: italic;
  color: rgba(255, 255, 255, 0.88);
  max-width: 600px;
  line-height: 1.6;
  margin-bottom: 1.25rem;
  font-family: ${harrisTheme.fontFamily.sans};
`;

const Breadcrumb = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.88rem;
  letter-spacing: 0.04em;
  color: rgba(255, 255, 255, 0.8);
  font-family: ${harrisTheme.fontFamily.sans};

  .home-link {
    color: rgba(255, 255, 255, 0.9);
    cursor: pointer;
    text-decoration: none;
    transition: color 180ms ease;

    &:hover {
      color: #D97E26;
    }
  }

  .separator {
    color: rgba(255, 255, 255, 0.5);
  }

  .active {
    color: #FFFFFF;
    font-weight: 600;
  }
`;

/* ── 2. FLOATING AVAILABILITY SEARCH BAR (Exact Widget from Screenshot) ── */
const FloatingAvailabilityBar = styled.div`
  position: relative;
  z-index: 20;
  max-width: 1160px;
  margin: -3.5rem auto 3.5rem;
  padding: 0 1.5rem;
`;

const AvailabilityCard = styled.div`
  background: #FFFFFF;
  border-radius: 4px;
  box-shadow: 0 15px 40px -10px rgba(0, 106, 86, 0.14);
  padding: 1.5rem 1.75rem;
  display: grid;
  grid-template-columns: 1.15fr 1.15fr 140px 140px 180px auto;
  gap: 1rem;
  align-items: flex-end;
  border: 1px solid rgba(0, 106, 86, 0.1);

  @media (max-width: 1100px) {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }
  @media (max-width: 640px) {
    padding: 1.25rem 1rem;
    grid-template-columns: 1fr;
    gap: 0.85rem;
  }
`;

const SearchField = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 0.45rem;
  width: 100%;

  label {
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    color: #006A56;
    text-transform: uppercase;
    line-height: 1;
    margin: 0;
    white-space: nowrap;
  }

  .input-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    height: 44px;
    padding: 0 0.85rem;
    border: 1px solid #d5e5e1;
    border-radius: 3px;
    background: #FAFCFB;
    color: #333333;
    font-size: 0.85rem;
    box-sizing: border-box;
    cursor: pointer;
    width: 100%;
    transition: all ${harrisTheme.transitions.base};

    &:hover {
      border-color: #006A56;
    }

    &:focus-within {
      border-color: #006A56;
      background: #FFFFFF;
      box-shadow: 0 0 0 1px #006A56;
    }

    input, select {
      border: none;
      background: transparent;
      outline: none;
      width: 100%;
      height: 100%;
      font-size: 0.85rem;
      color: #333333;
      font-family: inherit;
      cursor: pointer;
    }

    input[type="date"]::-webkit-calendar-picker-indicator {
      display: none !important;
      -webkit-appearance: none !important;
      appearance: none !important;
      opacity: 0;
      width: 0;
      height: 0;
    }

    select {
      appearance: none;
      -webkit-appearance: none;
    }
  }
`;

const CheckAvailBtn = styled.button`
  background: #D97E26;
  color: #FFFFFF;
  padding: 0 1.65rem;
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  border-radius: 2px;
  white-space: nowrap;
  height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  box-sizing: border-box;
  width: 100%;
  transition: all ${harrisTheme.transitions.base};

  &:hover {
    background: #006A56;
    box-shadow: 0 4px 15px rgba(0, 106, 86, 0.35);
  }
`;


/* ── 3. FILTER TABS ROW ── */
const FilterSection = styled.div`
  max-width: 1200px;
  margin: 0 auto 3.5rem;
  padding: 0 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const FilterTabsRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.65rem;
  border-bottom: 1px solid #E8EFEA;
  padding-bottom: 1.25rem;
`;

const FilterTab = styled.button<{ $active?: boolean }>`
  background: ${(p) => (p.$active ? '#006A56' : 'transparent')};
  color: ${(p) => (p.$active ? '#FFFFFF' : '#475569')};
  border: 1px solid ${(p) => (p.$active ? '#006A56' : '#D1DDD8')};
  padding: 0.55rem 1.35rem;
  border-radius: 999px;
  font-size: 0.84rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 180ms ease;
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;

  &:hover {
    background: ${(p) => (p.$active ? '#005545' : '#F1F7F4')};
    color: ${(p) => (p.$active ? '#FFFFFF' : '#002921')};
    border-color: ${(p) => (p.$active ? '#005545' : '#94A3B8')};
  }
`;

const FilterMetaRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
  font-size: 0.88rem;
  color: #64748B;
`;

/* ── 4. ALTERNATING 50/50 ZIGZAG ROOM LISTING ROWS (Matching Screenshot) ── */
const ListingContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto 5rem;
  padding: 0 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0; /* Flush / sleek border-to-border stacking */
`;

const RoomRow = styled.article<{ $reversed?: boolean }>`
  display: grid;
  grid-template-columns: 1fr 1fr;
  background: #FFFFFF;
  border: 1px solid #E6ECE9;
  border-bottom: none;
  overflow: hidden;
  transition: all 300ms ease;

  &:last-of-type {
    border-bottom: 1px solid #E6ECE9;
  }

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
    border-bottom: 1px solid #E6ECE9;
    margin-bottom: 2rem;
  }
`;

const ImageColumn = styled.div<{ $order?: number }>`
  position: relative;
  min-height: 460px;
  overflow: hidden;
  order: ${(p) => p.$order ?? 0};
  background: #F1F5F3;

  @media (max-width: 960px) {
    order: 0;
    min-height: 320px;
    max-height: 400px;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 650ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  ${RoomRow}:hover & img {
    transform: scale(1.04);
  }

  .branch-tag {
    position: absolute;
    top: 1.25rem;
    left: 1.25rem;
    background: rgba(0, 41, 33, 0.82);
    backdrop-filter: blur(6px);
    color: #FFFFFF;
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    padding: 0.35rem 0.8rem;
    border-radius: 2px;
    display: flex;
    align-items: center;
    gap: 0.35rem;
  }
`;

const ContentColumn = styled.div<{ $order?: number }>`
  padding: 4.5rem 4rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  order: ${(p) => p.$order ?? 1};
  background: #FFFFFF;

  @media (max-width: 1100px) {
    padding: 3rem 2.5rem;
  }

  @media (max-width: 960px) {
    order: 1;
    padding: 2.5rem 1.75rem;
  }
`;

const StarRating = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin-bottom: 0.75rem;

  .stars {
    color: #D97E26;
    display: flex;
    gap: 2px;
  }

  .review-text {
    font-size: 0.82rem;
    color: #8E9CA0;
    margin-left: 0.25rem;
  }
`;

const RoomTitle = styled.h2`
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 2.25rem;
  font-weight: 700;
  color: #002921;
  margin-bottom: 0.75rem;
  line-height: 1.2;
  letter-spacing: -0.01em;

  @media (max-width: 768px) {
    font-size: 1.85rem;
  }
`;

const RoomDescription = styled.p`
  font-size: 0.92rem;
  line-height: 1.75;
  color: #475569;
  margin-bottom: 1.35rem;
  font-weight: 400;
  max-width: 480px;
`;

const PriceRow = styled.div`
  margin-bottom: 1.35rem;
  display: flex;
  align-items: baseline;
  gap: 0.45rem;

  .label {
    font-size: 0.82rem;
    color: #64748B;
    text-transform: capitalize;
    font-weight: 400;
  }

  .amount {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 1.95rem;
    font-weight: 700;
    color: #D97E26;
    line-height: 1;
  }

  .unit {
    font-size: 0.8rem;
    font-weight: 700;
    color: #64748B;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
`;

const SpecsGrid = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.65rem 2.5rem;
  padding: 1.25rem 0;
  border-top: 1px solid #EEF3F1;
  border-bottom: 1px solid #EEF3F1;
  margin-bottom: 1.75rem;
  max-width: 440px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
`;

const SpecItem = styled.div`
  display: flex;
  font-size: 0.82rem;
  line-height: 1.4;

  .spec-key {
    font-weight: 700;
    color: #002921;
    letter-spacing: 0.06em;
    min-width: 84px;
    text-transform: uppercase;
    font-size: 0.78rem;
  }

  .spec-val {
    color: #64748B;
    font-weight: 500;
  }
`;

const ActionRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.85rem;
  flex-wrap: wrap;
`;

const BookBtn = styled.button`
  background: #D97E26;
  color: #FFFFFF;
  border: none;
  padding: 0.85rem 1.85rem;
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  border-radius: 0;
  cursor: pointer;
  transition: all 200ms ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #006A56;
    color: #FFFFFF;
  }
`;

const MoreDetailsBtn = styled.button`
  background: transparent;
  color: #002921;
  border: 1px solid #CBD5E1;
  padding: 0.85rem 1.65rem;
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  border-radius: 0;
  cursor: pointer;
  transition: all 200ms ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  &:hover {
    border-color: #006A56;
    color: #006A56;
    background: #F6FAF8;
  }
`;

/* ── 5. LOAD MORE BUTTON (Screenshot Accurate) ── */
const LoadMoreWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 3.5rem;
`;

const LoadMoreBtn = styled.button`
  background: #FFFFFF;
  color: #002921;
  border: 1px solid #CBD5E1;
  padding: 0.95rem 3rem;
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  border-radius: 0;
  cursor: pointer;
  transition: all 250ms ease;

  &:hover {
    border-color: #006A56;
    color: #006A56;
    background: #FAFCFB;
  }
`;

/* ── 6. ROOM DETAILS MODAL ── */
const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 20, 16, 0.72);
  backdrop-filter: blur(4px);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
`;

const ModalCard = styled.div`
  background: #FFFFFF;
  border-radius: 4px;
  max-width: 780px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.3);
  position: relative;
  animation: fadeInModal 220ms ease-out;

  @keyframes fadeInModal {
    from { opacity: 0; transform: translateY(16px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const ModalHeader = styled.div`
  position: relative;
  height: 280px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .close-btn {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: rgba(0, 0, 0, 0.65);
    color: #FFFFFF;
    border: none;
    width: 36px;
    height: 36px;
    border-radius: 999px;
    cursor: pointer;
    display: grid;
    place-items: center;
    transition: background 200ms ease;

    &:hover {
      background: #006A56;
    }
  }

  .modal-badge {
    position: absolute;
    bottom: 1rem;
    left: 1.5rem;
    background: #006A56;
    color: #FFFFFF;
    padding: 0.35rem 0.9rem;
    border-radius: 2px;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
`;

const ModalBody = styled.div`
  padding: 2rem 2.5rem;

  @media (max-width: 640px) {
    padding: 1.5rem;
  }
`;

/* ============================================================
   CURATED ROOMS (Standard, Deluxe, Executive, Conference)
   ============================================================ */

const CURATED_ROOM_ITEMS: RoomDisplayItem[] = [
  {
    id: 'room-standard',
    category: 'standard',
    title: 'Standard Room',
    subtitle: 'Impeccably tailored comfort with bespoke furnishings',
    image: '/images/home/room_standard.jpg',
    gallery: ['/images/home/room_standard.jpg', '/images/home/welcome_beach.jpg'],
    reviewsCount: 14,
    rating: 5,
    price: 40,
    priceFormatted: '$40',
    priceUnit: '/ NIGHT',
    status: 'Available',
    payment: '30% Advanced',
    guestCapacity: '2 Guests',
    beds: '1 Queen Bed',
    description:
      'Impeccably tailored comfort featuring plush queen bedding, modern en-suite rainfall shower, complimentary high-speed fiber Wi-Fi, acoustic double-glazing, and serene surroundings.',
    amenities: [
      'Queen Size Memory Foam Bed',
      'High-Speed Fiber Wi-Fi',
      'Designer En-Suite Rainfall Shower',
      'Smart HD Flat Screen TV',
      'In-Room Mini Fridge',
      'Artisan Tea & Coffee Station',
      'Ergonomic Work Desk & Lamp',
      'Electronic In-Room Safe',
      'Daily Housekeeping Service',
    ],
    isAvailable: true,
    branchName: 'Available across all 12 Harris branches',
  },
  {
    id: 'room-deluxe',
    category: 'deluxe',
    title: 'Deluxe Room',
    subtitle: 'Premier luxury accommodation with panoramic vistas',
    image: '/images/home/room_deluxe.jpg',
    gallery: ['/images/home/room_deluxe.jpg', '/images/home/hero_pool.jpg'],
    reviewsCount: 18,
    rating: 5,
    price: 60,
    priceFormatted: '$60',
    priceUnit: '/ NIGHT',
    status: 'Available',
    payment: '30% Advanced',
    guestCapacity: '2-3 Guests',
    beds: '1 Master King Bed',
    description:
      'Generously proportioned luxury suite offering panoramic views, master king bed, separate velvet seating lounge, marble master bath, and artisan Nespresso coffee bar.',
    amenities: [
      'Master King Bed & Velvet Lounge',
      'Private Balcony with Sunset View',
      'Deep Soaking Marble Bathtub',
      '55" 4K Smart TV & Audio System',
      'In-Room Mini Fridge & Minibar',
      'Nespresso Coffee Bar',
      'Complimentary Bottled Mineral Water',
      'Plush Bathrobes & Spa Slippers',
      '24/7 Dedicated Concierge Service',
    ],
    isAvailable: true,
    branchName: 'Available across all 12 Harris branches',
  },
  {
    id: 'room-executive',
    category: 'executive',
    title: 'Executive Room',
    subtitle: 'Signature VIP residence & private meeting suite',
    image: '/images/home/room_junior_suite.jpg',
    gallery: ['/images/home/room_junior_suite.jpg', '/images/home/services_bedroom.jpg'],
    reviewsCount: 22,
    rating: 5,
    price: 80,
    priceFormatted: '$80',
    priceUnit: '/ NIGHT',
    status: 'Available',
    payment: '30% Advanced',
    guestCapacity: '3-4 Guests',
    beds: '1 King Bed + Executive Study',
    description:
      'Our signature executive suite crafted for diplomats and business travelers. Includes dedicated private work study, lounge seating, VIP concierge access, deep soaking marble bathtub, and bespoke furnishings.',
    amenities: [
      'Master King Bedroom & Lounge',
      'Smart 4K Flat Screen TV',
      'In-Room Mini Fridge & Gourmet Bar',
      'Executive Work Desk & Meeting Nook',
      'Complimentary Airport Chauffeured Transfer',
      'Dual Marble En-suites',
      'VIP Club Lounge Access',
      'Gourmet Breakfast Included',
      'High-Speed Enterprise WiFi (100 Mbps)',
      'Evening Turn-down Service & Chocolates',
    ],
    isAvailable: true,
    branchName: 'Available across all 12 Harris branches',
  },
  {
    id: 'room-conference',
    category: 'conference',
    title: 'Conference Room',
    subtitle: 'High-Tech Corporate Summit & Banquet Facility',
    image: '/images/home/conference_hall.jpg',
    gallery: ['/images/home/conference_hall.jpg', '/images/home/boardroom.jpg'],
    reviewsCount: 16,
    rating: 5,
    price: 250,
    priceFormatted: '$250',
    priceUnit: '/ HOUR',
    status: 'Available',
    payment: 'Direct Booking / Corporate Terms',
    guestCapacity: 'Up to 60 Attendees',
    beds: 'Theater / U-Shape / Boardroom Setup',
    description:
      'A fully air-conditioned executive convention hall equipped with laser 4K projection, high-fidelity wireless microphones, motorized acoustic partitions, and dedicated buffet tea stations for high-profile symposiums.',
    amenities: [
      '4K Ultra-HD Laser Projector & Dual Displays',
      'Wireless Polycom Audio & Video Conferencing',
      'High-Speed Redundant Wi-Fi for Attendees',
      'Executive Leather Ergonomic Chairs',
      'Dedicated Barista & Catering Service',
      'Whiteboards, Flipcharts & Presentation Clickers',
      'Soundproof Acoustic Paneling',
      'On-site AV Technician Support',
    ],
    isAvailable: true,
    branchName: 'Available across signature Harris branches',
  },
];

/* ============================================================
   MAIN ROOM LISTING COMPONENT
   ============================================================ */

export function RoomListing({ onBookRoom, onBookConference, onNavigate }: RoomListingProps) {
  const { branches, currentBranch, setCurrentBranchById, currentBranchRooms } = useBranch();

  // Search Bar State
  const [arrivalDate, setArrivalDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [departureDate, setDepartureDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split('T')[0];
  });
  const [adults, setAdults] = useState(2);
  const [childrenCount, setChildrenCount] = useState(0);
  const [selectedBranch, setSelectedBranch] = useState(currentBranch?.id ?? '');

  // Tab Filter State
  const [activeTab, setActiveTab] = useState<RoomFilterCategory>('all');
  const [visibleLimit, setVisibleLimit] = useState(4);

  // Detail Modal State
  const [detailModalItem, setDetailModalItem] = useState<RoomDisplayItem | null>(null);

  // Filtered List
  const displayItems = useMemo(() => {
    return CURATED_ROOM_ITEMS.filter((item) => {
      if (activeTab === 'all') return true;
      return item.category === activeTab;
    });
  }, [activeTab]);

  const visibleItems = displayItems.slice(0, visibleLimit);

  const handleBookingTrigger = (item: RoomDisplayItem) => {
    if (item.category === 'conference') {
      if (onBookConference) {
        onBookConference(currentBranch?.id);
      } else {
        onBookRoom();
      }
    } else {
      const matchedDbRoom = currentBranchRooms.find(
        (r) =>
          (item.category === 'standard' && (r.room_type === 'standard' || r.room_type === 'upper_standard')) ||
          (item.category === 'deluxe' && r.room_type === 'deluxe') ||
          (item.category === 'executive' && r.room_type === 'double_executive')
      );

      if (matchedDbRoom) {
        onBookRoom(matchedDbRoom);
      } else {
        onBookRoom({
          id: item.id,
          branch_id: currentBranch?.id ?? '00000000-0000-0000-0000-000000000001',
          room_type: item.category === 'executive' ? 'double_executive' : item.category === 'deluxe' ? 'deluxe' : 'standard',
          room_number: item.category === 'standard' ? '101' : item.category === 'deluxe' ? '201' : '301',
          price_per_night: item.price * 100,
          capacity: item.category === 'executive' ? 4 : item.category === 'deluxe' ? 3 : 2,
          is_available: true,
          description: item.description,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        } as Room);
      }
    }
  };

  return (
    <PageContainer>
      {/* ── 1. Hero Banner with Screenshot-Accurate Typography & Breadcrumbs ── */}
      <HeroSection>
        <HeroTitle>Rooms</HeroTitle>
        <HeroSubtitle>
          Indulge in tranquility, timeless elegance, and heartfelt hospitality across our premier destinations.
        </HeroSubtitle>
        <Breadcrumb>
          <span className="home-link" onClick={() => onNavigate?.('home')}>
            Home
          </span>
          <span className="separator">/</span>
          <span className="active">Rooms</span>
        </Breadcrumb>
      </HeroSection>

      {/* ── 2. Floating Availability Search Bar (Exact Screenshot Layout) ── */}
      <FloatingAvailabilityBar>
        <AvailabilityCard>
          <SearchField>
            <label>Arrival Date</label>
            <div
              className="input-wrapper"
              onClick={(e) => {
                const input = e.currentTarget.querySelector('input');
                if (input && 'showPicker' in input) {
                  try { (input as HTMLInputElement).showPicker(); } catch {}
                }
              }}
            >
              <input
                type="date"
                value={arrivalDate}
                onChange={(e) => setArrivalDate(e.target.value)}
              />
              <Icon icon="mdi:calendar-outline" width={18} height={18} style={{ color: '#006A56', flexShrink: 0, pointerEvents: 'none' }} />
            </div>
          </SearchField>

          <SearchField>
            <label>Departure Date</label>
            <div
              className="input-wrapper"
              onClick={(e) => {
                const input = e.currentTarget.querySelector('input');
                if (input && 'showPicker' in input) {
                  try { (input as HTMLInputElement).showPicker(); } catch {}
                }
              }}
            >
              <input
                type="date"
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
              />
              <Icon icon="mdi:calendar-outline" width={18} height={18} style={{ color: '#006A56', flexShrink: 0, pointerEvents: 'none' }} />
            </div>
          </SearchField>

          <SearchField>
            <label>Adults</label>
            <div className="input-wrapper">
              <select value={adults} onChange={(e) => setAdults(Number(e.target.value))}>
                <option value={1}>1 Adult</option>
                <option value={2}>2 Adults</option>
                <option value={3}>3 Adults</option>
                <option value={4}>4 Adults</option>
              </select>
              <Icon icon="mdi:chevron-down" width={18} height={18} style={{ color: '#006A56', flexShrink: 0, pointerEvents: 'none' }} />
            </div>
          </SearchField>

          <SearchField>
            <label>Children</label>
            <div className="input-wrapper">
              <select value={childrenCount} onChange={(e) => setChildrenCount(Number(e.target.value))}>
                <option value={0}>0 Children</option>
                <option value={1}>1 Child</option>
                <option value={2}>2 Children</option>
                <option value={3}>3 Children</option>
              </select>
              <Icon icon="mdi:chevron-down" width={18} height={18} style={{ color: '#006A56', flexShrink: 0, pointerEvents: 'none' }} />
            </div>
          </SearchField>

          <SearchField>
            <label>Branch / Location</label>
            <div className="input-wrapper">
              <Icon icon="mdi:map-marker" width={18} height={18} style={{ color: '#D97E26', flexShrink: 0, pointerEvents: 'none' }} />
              <select
                value={selectedBranch || (currentBranch?.id ?? '')}
                onChange={(e) => {
                  setSelectedBranch(e.target.value);
                  if (e.target.value) {
                    setCurrentBranchById(e.target.value);
                  }
                }}
              >
                {branches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name.replace(/^Harris\s+/i, '')}
                  </option>
                ))}
              </select>
              <Icon icon="mdi:chevron-down" width={18} height={18} style={{ color: '#006A56', flexShrink: 0, pointerEvents: 'none' }} />
            </div>
          </SearchField>

          <CheckAvailBtn onClick={() => onBookRoom()}>
            Check Availability
          </CheckAvailBtn>
        </AvailabilityCard>
      </FloatingAvailabilityBar>

      {/* ── 3. Category Filter Tabs: Standard, Deluxe, Executive ── */}
      <FilterSection>
        <FilterTabsRow>
          <FilterTab
            $active={activeTab === 'all'}
            onClick={() => setActiveTab('all')}
          >
            <Icon icon="mdi:view-grid-outline" width={15} height={15} />
            All Rooms ({CURATED_ROOM_ITEMS.length})
          </FilterTab>
          <FilterTab
            $active={activeTab === 'standard'}
            onClick={() => setActiveTab('standard')}
          >
            <Icon icon="mdi:bed-single-outline" width={15} height={15} />
            Standard
          </FilterTab>
          <FilterTab
            $active={activeTab === 'deluxe'}
            onClick={() => setActiveTab('deluxe')}
          >
            <Icon icon="mdi:bed-king-outline" width={15} height={15} />
            Deluxe
          </FilterTab>
          <FilterTab
            $active={activeTab === 'executive'}
            onClick={() => setActiveTab('executive')}
          >
            <Icon icon="mdi:shield-crown-outline" width={15} height={15} />
            Executive
          </FilterTab>
          <FilterTab
            $active={activeTab === 'conference'}
            onClick={() => setActiveTab('conference')}
          >
            <Icon icon="mdi:presentation" width={15} height={15} />
            Conference &amp; Halls
          </FilterTab>
        </FilterTabsRow>

        <FilterMetaRow>
          <div>
            Showing <strong>{visibleItems.length}</strong> of <strong>{displayItems.length}</strong> rooms &amp; suites
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <Icon icon="mdi:map-marker" width={16} height={16} style={{ color: '#D97E26', flexShrink: 0 }} />
            <span>
              Active Branch:{' '}
              <strong style={{ color: '#006A56' }}>
                {currentBranch?.name ?? 'Harris Group'} {currentBranch?.location ? `(${currentBranch.location})` : ''}
              </strong>
            </span>
          </div>
        </FilterMetaRow>
      </FilterSection>

      {/* ── 4. Alternating Zigzag 50/50 Split Rows (Exact Screenshot Match) ── */}
      <ListingContainer>
        {visibleItems.map((item, index) => {
          // Even index (0, 2, ...): Image Left, Content Right
          // Odd index (1, 3, ...): Content Left, Image Right
          const isEven = index % 2 === 0;

          return (
            <RoomRow key={item.id} $reversed={!isEven}>
              {/* Image Column */}
              <ImageColumn $order={isEven ? 0 : 1}>
                <img src={item.image} alt={item.title} loading="lazy" />
                <div className="branch-tag">
                  <Icon icon="mdi:map-marker" width={12} height={12} style={{ color: '#D97E26' }} />
                  {item.branchName}
                </div>
                <div
                  style={{
                    position: 'absolute',
                    bottom: '1.25rem',
                    left: '1.25rem',
                    background: item.category === 'executive' ? '#006A56' : item.category === 'deluxe' ? '#D97E26' : 'rgba(0, 41, 33, 0.85)',
                    color: '#FFFFFF',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    padding: '0.35rem 0.85rem',
                    borderRadius: '2px',
                    backdropFilter: 'blur(4px)',
                  }}
                >
                  {item.category.toUpperCase()} TIER
                </div>
              </ImageColumn>

              {/* Content Column */}
              <ContentColumn $order={isEven ? 1 : 0}>
                {/* 5 Stars Rating */}
                <StarRating>
                  <div className="stars">
                    {[...Array(item.rating)].map((_, i) => (
                      <Icon key={i} icon="mdi:star" width={17} height={17} />
                    ))}
                  </div>
                  <span className="review-text">{item.reviewsCount} Reviews</span>
                </StarRating>

                {/* Title */}
                <RoomTitle>{item.title}</RoomTitle>

                {/* Description */}
                <RoomDescription>{item.description}</RoomDescription>

                {/* Price Row */}
                <PriceRow>
                  <span className="label">Starts from:</span>
                  <span className="amount">{item.priceFormatted || formatCurrency(item.price)}</span>
                  <span className="unit">{item.priceUnit}</span>
                </PriceRow>

                {/* Key Specs Table */}
                <SpecsGrid>
                  <SpecItem>
                    <span className="spec-key">STATUS:</span>
                    <span className="spec-val" style={{ color: '#006A56', fontWeight: 600 }}>
                      {item.status}
                    </span>
                  </SpecItem>
                  <SpecItem>
                    <span className="spec-key">PAYMENT:</span>
                    <span className="spec-val">{item.payment}</span>
                  </SpecItem>
                  <SpecItem>
                    <span className="spec-key">GUEST:</span>
                    <span className="spec-val">{item.guestCapacity}</span>
                  </SpecItem>
                  <SpecItem>
                    <span className="spec-key">BEDS:</span>
                    <span className="spec-val">{item.beds}</span>
                  </SpecItem>
                </SpecsGrid>

                {/* Action Buttons */}
                <ActionRow>
                  <BookBtn onClick={() => handleBookingTrigger(item)}>
                    BOOK NOW
                  </BookBtn>
                  <MoreDetailsBtn onClick={() => setDetailModalItem(item)}>
                    MORE DETAILS
                  </MoreDetailsBtn>
                </ActionRow>
              </ContentColumn>
            </RoomRow>
          );
        })}

        {/* ── 5. LOAD MORE BUTTON (Screenshot Match) ── */}
        {visibleLimit < displayItems.length ? (
          <LoadMoreWrapper>
            <LoadMoreBtn onClick={() => setVisibleLimit((prev) => prev + 4)}>
              LOAD MORE
            </LoadMoreBtn>
          </LoadMoreWrapper>
        ) : (
          <LoadMoreWrapper>
            <LoadMoreBtn onClick={() => onBookRoom()}>
              RESERVE CUSTOM DATES &amp; SUITES
            </LoadMoreBtn>
          </LoadMoreWrapper>
        )}
      </ListingContainer>

      {/* ── 6. "MORE DETAILS" MODAL ── */}
      {detailModalItem && (
        <ModalOverlay onClick={() => setDetailModalItem(null)}>
          <ModalCard onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <img src={detailModalItem.image} alt={detailModalItem.title} />
              <button
                className="close-btn"
                onClick={() => setDetailModalItem(null)}
                title="Close"
              >
                <Icon icon="mdi:close" width={20} height={20} />
              </button>
              <div className="modal-badge">{detailModalItem.category} Category</div>
            </ModalHeader>
            <ModalBody>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '1rem',
                  flexWrap: 'wrap',
                  gap: '1rem',
                }}
              >
                <div>
                  <h2
                    style={{
                      fontFamily: 'Playfair Display, Georgia, serif',
                      fontSize: '1.8rem',
                      color: '#002921',
                      marginBottom: '0.35rem',
                    }}
                  >
                    {detailModalItem.title}
                  </h2>
                  <div style={{ color: '#D97E26', fontWeight: 600, fontSize: '0.9rem' }}>
                    {detailModalItem.subtitle}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div
                    style={{
                      fontSize: '1.75rem',
                      fontWeight: 700,
                      color: '#D97E26',
                      fontFamily: 'Playfair Display, Georgia, serif',
                    }}
                  >
                    {detailModalItem.priceFormatted || formatCurrency(detailModalItem.price)}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                    {detailModalItem.priceUnit} · taxes included
                  </div>
                </div>
              </div>

              <p
                style={{
                  color: '#475569',
                  lineHeight: 1.65,
                  fontSize: '0.92rem',
                  marginBottom: '1.5rem',
                }}
              >
                {detailModalItem.description}
              </p>

              <h4
                style={{
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  color: '#002921',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  marginBottom: '0.85rem',
                }}
              >
                Key Inclusions &amp; Amenities
              </h4>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '0.65rem 1.25rem',
                  marginBottom: '2rem',
                }}
              >
                {detailModalItem.amenities.map((amenity, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontSize: '0.85rem',
                      color: '#334155',
                    }}
                  >
                    <Icon
                      icon="mdi:check-circle"
                      width={16}
                      height={16}
                      style={{ color: '#006A56', flexShrink: 0 }}
                    />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '1rem',
                  borderTop: '1px solid #EEF3F1',
                  paddingTop: '1.25rem',
                }}
              >
                <MoreDetailsBtn onClick={() => setDetailModalItem(null)}>
                  Close
                </MoreDetailsBtn>
                <BookBtn
                  onClick={() => {
                    const item = detailModalItem;
                    setDetailModalItem(null);
                    handleBookingTrigger(item);
                  }}
                >
                  Book This Accommodation
                </BookBtn>
              </div>
            </ModalBody>
          </ModalCard>
        </ModalOverlay>
      )}
    </PageContainer>
  );
}

/* Re-export EmptyState for backwards-compatibility */
export { EmptyState } from '@/components/ui/Primitives';

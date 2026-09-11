import { useState, useMemo, useEffect } from 'react';
import styled from 'styled-components';
import { Icon } from '@iconify/react';
import { useBranch } from '@/context/BranchContext';
import type { Room } from '@/types/database';

interface LuxuryBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDates?: { checkIn?: string; checkOut?: string };
  initialBranchId?: string;
  preselectedRoom?: Room | null;
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
    image: '/images/home/room_standard.jpg',
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
    image: '/images/home/room_deluxe.jpg',
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
    image: '/images/home/room_junior_suite.jpg',
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
    image: '/images/home/conference_hall.jpg',
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
  transition: opacity 280ms cubic-bezier(0.16, 1, 0.3, 1);

  @media (max-width: 768px) {
    padding: 0;
    align-items: flex-end;
  }
`;

const ModalCard = styled.div<{ $visible: boolean }>`
  width: 100%;
  max-width: 1220px;
  height: 92vh;
  max-height: 900px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(0, 106, 86, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transform: ${(p) => (p.$visible ? 'scale(1) translateY(0)' : 'scale(0.97) translateY(18px)')};
  transition: transform 300ms cubic-bezier(0.16, 1, 0.3, 1), opacity 280ms ease;

  @media (max-width: 768px) {
    height: 100vh;
    max-height: 100vh;
    border-radius: 0;
    transform: ${(p) => (p.$visible ? 'translateY(0)' : 'translateY(100%)')};
  }
`;

const ModalHeader = styled.header`
  background: #00382E;
  color: #ffffff;
  padding: 0.9rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
  flex-shrink: 0;
  gap: 1rem;

  @media (max-width: 640px) {
    padding: 0.75rem 1rem;
  }

  .logo-wrap {
    display: flex;
    align-items: center;
    gap: 1rem;

    img {
      height: 38px;
      width: auto;
      object-fit: contain;
      background: #ffffff;
      padding: 3px 8px;
      border-radius: 6px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    }

    .brand-text {
      h2 {
        font-size: 1.15rem;
        font-weight: 700;
        margin: 0;
        line-height: 1.2;
        color: #ffffff;
        font-family: 'Playfair Display', Georgia, serif;
      }
      span {
        font-size: 0.75rem;
        color: rgba(255, 255, 255, 0.8);
        display: block;
        margin-top: 0.1rem;
      }
    }
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: 0.75rem;

    .property-pill {
      background: rgba(217, 126, 38, 0.2);
      border: 1px solid rgba(217, 126, 38, 0.4);
      color: #FFAE58;
      padding: 0.3rem 0.75rem;
      border-radius: 999px;
      font-size: 0.78rem;
      font-weight: 600;
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;

      @media (max-width: 640px) {
        display: none;
      }
    }

    .btn-close {
      background: rgba(255, 255, 255, 0.12);
      border: none;
      color: #ffffff;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      cursor: pointer;
      display: grid;
      place-items: center;
      transition: all 180ms ease;

      &:hover {
        background: #e11d48;
        transform: rotate(90deg);
      }
    }
  }
`;

const StepsNav = styled.div`
  background: #004D3F;
  padding: 0.6rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  flex-shrink: 0;
  gap: 1rem;
  overflow-x: auto;

  @media (max-width: 640px) {
    padding: 0.5rem 1rem;
  }
`;

const StepItem = styled.div<{ $active: boolean; $completed: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.55rem;
  font-size: 0.85rem;
  font-weight: ${(p) => (p.$active ? 700 : 500)};
  color: ${(p) => (p.$active ? '#FFAE58' : p.$completed ? '#A7F3D0' : 'rgba(255, 255, 255, 0.6)')};
  cursor: pointer;
  white-space: nowrap;

  .step-num {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: ${(p) =>
      p.$active ? '#D97E26' : p.$completed ? '#059669' : 'rgba(255, 255, 255, 0.15)'};
    color: #ffffff;
    display: grid;
    place-items: center;
    font-size: 0.75rem;
    font-weight: 700;
  }
`;

const MainContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  background: #F8FAF9;
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 1.5rem;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
    padding: 1rem;
  }
`;

const FilterSearchBar = styled.div`
  background: #ffffff;
  padding: 1.25rem;
  border-radius: 8px;
  border: 1px solid #E5E9E7;
  box-shadow: 0 2px 10px rgba(0, 106, 86, 0.04);
  margin-bottom: 1.5rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
  gap: 1rem;
  align-items: flex-end;

  .field-group {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;

    label {
      font-size: 0.78rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #006A56;
      display: flex;
      align-items: center;
      gap: 0.3rem;
    }

    .input-box {
      display: flex;
      align-items: center;
      background: #F8FAF9;
      border: 1px solid #D5DFDC;
      border-radius: 4px;
      padding: 0.55rem 0.75rem;
      gap: 0.5rem;
      transition: border-color 180ms ease;

      &:focus-within {
        border-color: #006A56;
        box-shadow: 0 0 0 2px rgba(0, 106, 86, 0.12);
        background: #ffffff;
      }

      input,
      select {
        border: none;
        background: transparent;
        width: 100%;
        font-size: 0.88rem;
        color: #1A2E1E;
        font-weight: 500;
        outline: none;
        cursor: pointer;
      }
    }
  }
`;

const RoomsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const RoomCard = styled.div<{ $selected: boolean }>`
  background: #ffffff;
  border-radius: 8px;
  border: 2px solid ${(p) => (p.$selected ? '#D97E26' : '#E5E9E7')};
  box-shadow: ${(p) =>
    p.$selected
      ? '0 10px 25px rgba(217, 126, 38, 0.18)'
      : '0 4px 15px rgba(0, 106, 86, 0.05)'};
  display: grid;
  grid-template-columns: 240px 1fr auto;
  overflow: hidden;
  transition: all 200ms ease;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }

  .media {
    position: relative;
    height: 100%;
    min-height: 180px;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .badge-tag {
      position: absolute;
      top: 10px;
      left: 10px;
      background: rgba(0, 56, 46, 0.85);
      color: #ffffff;
      font-size: 0.72rem;
      font-weight: 700;
      padding: 0.25rem 0.6rem;
      border-radius: 4px;
      backdrop-filter: blur(4px);
    }
  }

  .details {
    padding: 1.25rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    h3 {
      font-size: 1.2rem;
      color: #00382E;
      font-family: 'Playfair Display', Georgia, serif;
      margin: 0 0 0.35rem;
      font-weight: 700;
    }

    p {
      font-size: 0.84rem;
      color: #4B5563;
      line-height: 1.45;
      margin: 0 0 0.85rem;
    }

    .specs-row {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
      font-size: 0.78rem;
      color: #006A56;
      font-weight: 600;
      margin-bottom: 0.85rem;

      span {
        display: inline-flex;
        align-items: center;
        gap: 0.3rem;
        background: #EEF5F3;
        padding: 0.2rem 0.55rem;
        border-radius: 4px;
      }
    }

    .amenities-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 0.45rem;

      .chip {
        display: inline-flex;
        align-items: center;
        gap: 0.3rem;
        font-size: 0.75rem;
        color: #374151;
        background: #F3F4F6;
        padding: 0.2rem 0.5rem;
        border-radius: 3px;
        border: 1px solid #E5E7EB;

        svg {
          color: #D97E26;
        }
      }
    }
  }

  .action-col {
    padding: 1.25rem;
    background: #FAFCFB;
    border-left: 1px solid #E5E9E7;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: center;
    min-width: 170px;

    @media (max-width: 768px) {
      border-left: none;
      border-top: 1px solid #E5E9E7;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
    }

    .price-wrap {
      text-align: right;
      margin-bottom: 1rem;

      @media (max-width: 768px) {
        text-align: left;
        margin-bottom: 0;
      }

      .amount {
        font-size: 1.45rem;
        font-weight: 800;
        color: #006A56;
        font-family: 'Playfair Display', Georgia, serif;
      }

      .unit {
        font-size: 0.75rem;
        color: #6B7280;
        display: block;
      }
    }

    .btn-select {
      background: ${(p) => (p.$selected ? '#006A56' : '#D97E26')};
      color: #ffffff;
      border: none;
      padding: 0.65rem 1.25rem;
      border-radius: 4px;
      font-size: 0.85rem;
      font-weight: 700;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      transition: all 180ms ease;

      &:hover {
        background: ${(p) => (p.$selected ? '#004D3F' : '#B86717')};
        transform: translateY(-1px);
      }
    }
  }
`;

const SidebarSummary = styled.div`
  background: #ffffff;
  border-radius: 8px;
  border: 1px solid #E5E9E7;
  padding: 1.4rem;
  box-shadow: 0 4px 15px rgba(0, 106, 86, 0.05);
  height: fit-content;
  position: sticky;
  top: 0;

  h3 {
    font-size: 1.15rem;
    font-weight: 700;
    color: #00382E;
    margin: 0 0 1rem;
    font-family: 'Playfair Display', Georgia, serif;
    border-bottom: 2px solid #EEF5F3;
    padding-bottom: 0.5rem;
  }

  .summary-line {
    display: flex;
    justify-content: space-between;
    font-size: 0.85rem;
    color: #4B5563;
    margin-bottom: 0.6rem;

    &.bold {
      font-weight: 700;
      color: #111827;
    }

    &.total {
      margin-top: 1rem;
      padding-top: 0.85rem;
      border-top: 1px solid #E5E7EB;
      font-size: 1.15rem;
      font-weight: 800;
      color: #006A56;
    }
  }

  .btn-continue {
    width: 100%;
    background: #D97E26;
    color: #ffffff;
    border: none;
    padding: 0.85rem;
    border-radius: 4px;
    font-size: 0.95rem;
    font-weight: 700;
    cursor: pointer;
    margin-top: 1.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    transition: all 180ms ease;

    &:hover:not(:disabled) {
      background: #B86717;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(217, 126, 38, 0.3);
    }

    &:disabled {
      background: #D1D5DB;
      cursor: not-allowed;
    }
  }

  .guarantee-note {
    font-size: 0.75rem;
    color: #059669;
    text-align: center;
    margin-top: 0.85rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.3rem;
    font-weight: 600;
  }
`;

const FormSection = styled.div`
  background: #ffffff;
  border-radius: 8px;
  border: 1px solid #E5E9E7;
  padding: 1.75rem;

  h3 {
    font-size: 1.3rem;
    color: #00382E;
    font-family: 'Playfair Display', Georgia, serif;
    margin: 0 0 0.5rem;
  }

  p {
    font-size: 0.88rem;
    color: #6B7280;
    margin: 0 0 1.5rem;
  }

  .form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.25rem;

    @media (max-width: 640px) {
      grid-template-columns: 1fr;
    }
  }

  .full-width {
    grid-column: 1 / -1;
  }

  .input-label {
    font-size: 0.82rem;
    font-weight: 700;
    color: #374151;
    margin-bottom: 0.35rem;
    display: block;
  }

  input,
  select,
  textarea {
    width: 100%;
    padding: 0.7rem 0.85rem;
    border: 1px solid #D1D5DB;
    border-radius: 4px;
    font-size: 0.9rem;
    color: #111827;
    outline: none;
    transition: all 180ms ease;

    &:focus {
      border-color: #006A56;
      box-shadow: 0 0 0 3px rgba(0, 106, 86, 0.12);
    }
  }
`;

const ConfirmationBox = styled.div`
  background: #ffffff;
  border-radius: 8px;
  border: 1px solid #E5E9E7;
  padding: 3rem 2rem;
  text-align: center;
  grid-column: 1 / -1;

  .check-icon {
    width: 72px;
    height: 72px;
    background: #ECFDF5;
    color: #059669;
    border-radius: 50%;
    display: grid;
    place-items: center;
    margin: 0 auto 1.25rem;
    box-shadow: 0 8px 20px rgba(5, 150, 105, 0.18);
  }

  h2 {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 2rem;
    color: #00382E;
    margin-bottom: 0.5rem;
  }

  .lead {
    font-size: 1.05rem;
    color: #4B5563;
    max-width: 500px;
    margin: 0 auto 2rem;
  }

  .voucher-card {
    background: #F8FAF9;
    border: 1px dashed #006A56;
    border-radius: 8px;
    padding: 1.5rem;
    max-width: 480px;
    margin: 0 auto 2rem;
    text-align: left;

    .code-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 0.75rem;
      border-bottom: 1px solid #E5E9E7;
      margin-bottom: 0.75rem;

      .code {
        font-family: monospace;
        font-size: 1.2rem;
        font-weight: 800;
        color: #D97E26;
        background: #FFF7ED;
        padding: 0.2rem 0.6rem;
        border-radius: 4px;
      }
    }
  }

  .actions-row {
    display: flex;
    justify-content: center;
    gap: 1rem;
    flex-wrap: wrap;

    button,
    a {
      padding: 0.75rem 1.5rem;
      border-radius: 4px;
      font-weight: 700;
      font-size: 0.9rem;
      cursor: pointer;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
    }

    .btn-gold {
      background: #D97E26;
      color: #ffffff;
      border: none;
      &:hover {
        background: #B86717;
      }
    }

    .btn-outline {
      background: transparent;
      border: 1px solid #006A56;
      color: #006A56;
      &:hover {
        background: #EEF5F3;
      }
    }
  }
`;

export function LuxuryBookingModal({
  isOpen,
  onClose,
  initialDates,
  initialBranchId,
  preselectedRoom,
}: LuxuryBookingModalProps) {
  const { branches, currentBranch, setCurrentBranchById } = useBranch();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedBranchId, setSelectedBranchId] = useState(
    initialBranchId || currentBranch?.id || 'branch-northend'
  );

  const [checkIn, setCheckIn] = useState(() => {
    if (initialDates?.checkIn) return initialDates.checkIn;
    const d = new Date();
    return d.toISOString().split('T')[0];
  });

  const [checkOut, setCheckOut] = useState(() => {
    if (initialDates?.checkOut) return initialDates.checkOut;
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  });

  const [adults, setAdults] = useState(2);
  const [childrenCount, setChildrenCount] = useState(0);
  const [selectedRoomId, setSelectedRoomId] = useState<string>('room-deluxe');
  const [addBreakfast, setAddBreakfast] = useState(false);

  // Guest details form
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [bookingCode, setBookingCode] = useState('');

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      document.body.style.overflow = 'hidden';
      if (initialBranchId) setSelectedBranchId(initialBranchId);
      if (preselectedRoom) {
        const matched = AVAILABLE_ROOMS.find((r) => r.category === preselectedRoom.room_type);
        if (matched) setSelectedRoomId(matched.id);
      }
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, initialBranchId, preselectedRoom]);

  const nights = useMemo(() => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 1;
  }, [checkIn, checkOut]);

  const activeRoom = useMemo(() => {
    return AVAILABLE_ROOMS.find((r) => r.id === selectedRoomId) || AVAILABLE_ROOMS[0];
  }, [selectedRoomId]);

  const activeBranch = useMemo(() => {
    return branches.find((b) => b.id === selectedBranchId) || branches[0];
  }, [branches, selectedBranchId]);

  const roomSubtotal = activeRoom.pricePerNight * nights;
  const breakfastTotal = addBreakfast ? 10 * adults * nights : 0;
  const totalAmount = roomSubtotal + breakfastTotal;

  const handleConfirmBooking = () => {
    if (!guestName || !guestEmail || !guestPhone) {
      alert('Please fill in your name, email, and phone number to secure your booking.');
      return;
    }
    const randCode = `HL-28423-${Math.floor(1000 + Math.random() * 9000)}`;
    setBookingCode(randCode);
    setStep(3);
  };

  if (!isOpen) return null;

  return (
    <Overlay $visible={isOpen} onClick={onClose}>
      <ModalCard $visible={isOpen} onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <div className="logo-wrap">
            <img src="/images/logo.png" alt="Harris Lodges Logo" />
            <div className="brand-text">
              <h2>Harris Lodges &amp; Luxury Stays</h2>
              <span>Online Reservation &amp; Instant Live Availability</span>
            </div>
          </div>

          <div className="header-actions">
            <div className="property-pill">
              <Icon icon="mdi:shield-check" width={15} height={15} />
              Property #28423 • Best Rate Direct
            </div>
            <button className="btn-close" onClick={onClose} title="Close">
              <Icon icon="mdi:close" width={20} height={20} />
            </button>
          </div>
        </ModalHeader>

        <StepsNav>
          <StepItem
            $active={step === 1}
            $completed={step > 1}
            onClick={() => setStep(1)}
          >
            <span className="step-num">1</span>
            <span>1. Dates &amp; Room Selection</span>
          </StepItem>

          <Icon icon="mdi:chevron-right" width={18} height={18} style={{ color: 'rgba(255,255,255,0.4)' }} />

          <StepItem
            $active={step === 2}
            $completed={step > 2}
            onClick={() => {
              if (activeRoom) setStep(2);
            }}
          >
            <span className="step-num">2</span>
            <span>2. Guest Details &amp; Options</span>
          </StepItem>

          <Icon icon="mdi:chevron-right" width={18} height={18} style={{ color: 'rgba(255,255,255,0.4)' }} />

          <StepItem $active={step === 3} $completed={step === 3}>
            <span className="step-num">3</span>
            <span>3. Instant Confirmation</span>
          </StepItem>
        </StepsNav>

        <MainContent>
          {step === 1 && (
            <>
              <div>
                <FilterSearchBar>
                  <div className="field-group">
                    <label><Icon icon="mdi:calendar-import" /> Arrival Date</label>
                    <div className="input-box">
                      <input
                        type="date"
                        value={checkIn}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={(e) => setCheckIn(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="field-group">
                    <label><Icon icon="mdi:calendar-export" /> Departure Date</label>
                    <div className="input-box">
                      <input
                        type="date"
                        value={checkOut}
                        min={checkIn}
                        onChange={(e) => setCheckOut(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="field-group">
                    <label><Icon icon="mdi:map-marker" /> Branch Location</label>
                    <div className="input-box">
                      <select
                        value={selectedBranchId}
                        onChange={(e) => {
                          setSelectedBranchId(e.target.value);
                          setCurrentBranchById(e.target.value);
                        }}
                      >
                        {branches.map((b) => (
                          <option key={b.id} value={b.id}>
                            {b.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="field-group">
                    <label><Icon icon="mdi:account-group" /> Guests</label>
                    <div className="input-box">
                      <select
                        value={adults}
                        onChange={(e) => setAdults(Number(e.target.value))}
                      >
                        <option value={1}>1 Adult</option>
                        <option value={2}>2 Adults</option>
                        <option value={3}>3 Adults</option>
                        <option value={4}>4 Adults</option>
                      </select>
                    </div>
                  </div>
                </FilterSearchBar>

                <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#00382E', fontFamily: 'Playfair Display, Georgia, serif' }}>
                    Available Suites at {activeBranch?.name}
                  </h3>
                  <span style={{ fontSize: '0.82rem', color: '#059669', fontWeight: 700 }}>
                    ● Real-Time Availability Verified
                  </span>
                </div>

                <RoomsList>
                  {AVAILABLE_ROOMS.map((room) => {
                    const isSelected = selectedRoomId === room.id;
                    return (
                      <RoomCard key={room.id} $selected={isSelected}>
                        <div className="media">
                          <img src={room.image} alt={room.name} />
                          <span className="badge-tag">{room.size}</span>
                        </div>

                        <div className="details">
                          <div>
                            <h3>{room.name}</h3>
                            <p>{room.subtitle}</p>
                            <div className="specs-row">
                              <span><Icon icon="mdi:bed" /> {room.bedType}</span>
                              <span><Icon icon="mdi:account" /> {room.capacity}</span>
                            </div>
                          </div>

                          <div className="amenities-chips">
                            {room.amenities.map((a, i) => (
                              <span key={i} className="chip">
                                <Icon icon={a.icon} width={14} height={14} />
                                {a.label}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="action-col">
                          <div className="price-wrap">
                            <span className="amount">${room.pricePerNight}</span>
                            <span className="unit">USD / night</span>
                          </div>

                          <button
                            className="btn-select"
                            onClick={() => setSelectedRoomId(room.id)}
                          >
                            <Icon
                              icon={isSelected ? 'mdi:check-circle' : 'mdi:circle-outline'}
                              width={16}
                              height={16}
                            />
                            {isSelected ? 'Selected' : 'Select Suite'}
                          </button>
                        </div>
                      </RoomCard>
                    );
                  })}
                </RoomsList>
              </div>

              <SidebarSummary>
                <h3>Reservation Summary</h3>
                <div className="summary-line">
                  <span>Branch:</span>
                  <span style={{ fontWeight: 700, color: '#006A56' }}>{activeBranch?.name}</span>
                </div>
                <div className="summary-line">
                  <span>Check-In:</span>
                  <span>{checkIn}</span>
                </div>
                <div className="summary-line">
                  <span>Check-Out:</span>
                  <span>{checkOut}</span>
                </div>
                <div className="summary-line">
                  <span>Duration:</span>
                  <span>{nights} {nights === 1 ? 'Night' : 'Nights'}</span>
                </div>
                <div className="summary-line">
                  <span>Guests:</span>
                  <span>{adults} Adults {childrenCount > 0 ? `, ${childrenCount} Children` : ''}</span>
                </div>
                <div className="summary-line bold" style={{ marginTop: '0.85rem' }}>
                  <span>Selected Room:</span>
                  <span>{activeRoom.name}</span>
                </div>
                <div className="summary-line">
                  <span>Rate per night:</span>
                  <span>${activeRoom.pricePerNight}</span>
                </div>

                <div className="summary-line total">
                  <span>Total Amount:</span>
                  <span>${totalAmount} USD</span>
                </div>

                <button
                  className="btn-continue"
                  onClick={() => setStep(2)}
                >
                  Continue to Guest Info
                  <Icon icon="mdi:arrow-right" width={18} height={18} />
                </button>

                <div className="guarantee-note">
                  <Icon icon="mdi:lock" width={14} height={14} />
                  Best Direct Price Guaranteed
                </div>
              </SidebarSummary>
            </>
          )}

          {step === 2 && (
            <>
              <FormSection>
                <h3>Guest Contact Information</h3>
                <p>Please provide your details for reservation verification and automated check-in confirmation.</p>

                <div className="form-grid">
                  <div>
                    <label className="input-label">Full Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Tendai Moyo"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="input-label">Email Address *</label>
                    <input
                      type="email"
                      placeholder="e.g. tendai@example.com"
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="input-label">Phone / WhatsApp Number *</label>
                    <input
                      type="tel"
                      placeholder="+263 77 123 4567"
                      value={guestPhone}
                      onChange={(e) => setGuestPhone(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="input-label">Estimated Check-In Time</label>
                    <select>
                      <option>14:00 - 16:00 (Standard)</option>
                      <option>16:00 - 18:00</option>
                      <option>18:00 - 21:00 (Evening)</option>
                      <option>Late Arrival (After 21:00)</option>
                    </select>
                  </div>

                  <div className="full-width" style={{ background: '#F8FAF9', padding: '1rem', borderRadius: '6px', border: '1px solid #E5E9E7' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', fontWeight: 600, color: '#00382E' }}>
                      <input
                        type="checkbox"
                        checked={addBreakfast}
                        onChange={(e) => setAddBreakfast(e.target.checked)}
                        style={{ width: 'auto' }}
                      />
                      Add Gourmet Artisan Breakfast (+ $10 per guest / night)
                    </label>
                  </div>

                  <div className="full-width">
                    <label className="input-label">Special Requests &amp; Notes</label>
                    <textarea
                      rows={3}
                      placeholder="Airport transfer request, dietary requirements, quiet room preference..."
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                    />
                  </div>
                </div>
              </FormSection>

              <SidebarSummary>
                <h3>Booking Overview</h3>
                <div className="summary-line">
                  <span>Room:</span>
                  <span style={{ fontWeight: 700 }}>{activeRoom.name}</span>
                </div>
                <div className="summary-line">
                  <span>Dates:</span>
                  <span>{checkIn} &rarr; {checkOut}</span>
                </div>
                <div className="summary-line">
                  <span>Stay:</span>
                  <span>{nights} Nights ({adults} Guests)</span>
                </div>
                <div className="summary-line">
                  <span>Room Total:</span>
                  <span>${roomSubtotal}</span>
                </div>
                {addBreakfast && (
                  <div className="summary-line">
                    <span>Breakfast Total:</span>
                    <span>+${breakfastTotal}</span>
                  </div>
                )}
                <div className="summary-line total">
                  <span>Grand Total:</span>
                  <span>${totalAmount} USD</span>
                </div>

                <button
                  className="btn-continue"
                  onClick={handleConfirmBooking}
                >
                  Confirm &amp; Reserve
                  <Icon icon="mdi:check-circle" width={18} height={18} />
                </button>

                <button
                  onClick={() => setStep(1)}
                  style={{
                    width: '100%',
                    background: 'transparent',
                    border: 'none',
                    color: '#6B7280',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    marginTop: '0.75rem',
                    cursor: 'pointer',
                  }}
                >
                  &larr; Back to room selection
                </button>
              </SidebarSummary>
            </>
          )}

          {step === 3 && (
            <ConfirmationBox>
              <div className="check-icon">
                <Icon icon="mdi:check" width={38} height={38} />
              </div>

              <h2>Reservation Confirmed!</h2>
              <p className="lead">
                Thank you, <strong>{guestName}</strong>. Your stay at <strong>{activeBranch?.name}</strong> has been received and confirmed.
              </p>

              <div className="voucher-card">
                <div className="code-row">
                  <span>Booking Reference:</span>
                  <span className="code">{bookingCode}</span>
                </div>
                <div className="summary-line">
                  <span>Selected Room:</span>
                  <strong>{activeRoom.name}</strong>
                </div>
                <div className="summary-line">
                  <span>Branch:</span>
                  <strong>{activeBranch?.name}</strong>
                </div>
                <div className="summary-line">
                  <span>Check-In &rarr; Check-Out:</span>
                  <strong>{checkIn} &rarr; {checkOut} ({nights} Nights)</strong>
                </div>
                <div className="summary-line">
                  <span>Total Amount (Pay on Arrival):</span>
                  <strong style={{ color: '#006A56', fontSize: '1.1rem' }}>${totalAmount} USD</strong>
                </div>
              </div>

              <div className="actions-row">
                <a
                  href={`https://wa.me/263775477464?text=${encodeURIComponent(
                    `Hello Harris Lodge, I have confirmed reservation ${bookingCode} for ${activeRoom.name} at ${activeBranch?.name} from ${checkIn} to ${checkOut}.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-gold"
                >
                  <Icon icon="mdi:whatsapp" width={18} height={18} />
                  WhatsApp Concierge
                </a>

                <button
                  className="btn-outline"
                  onClick={() => {
                    setStep(1);
                    onClose();
                  }}
                >
                  Done &amp; Close
                </button>
              </div>
            </ConfirmationBox>
          )}
        </MainContent>
      </ModalCard>
    </Overlay>
  );
}

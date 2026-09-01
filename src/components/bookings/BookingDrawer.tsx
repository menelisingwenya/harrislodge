import { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { harrisTheme } from '@/theme';
import { DrawerPanel, Field, Input, Badge, Button, Card } from '@/components/ui/Primitives';
import type { Room } from '@/types/database';
import { ROOM_TYPE_LABELS } from '@/types/database';
import { useBranch } from '@/context/BranchContext';
import {
  calculateNights,
  calculateRoomTotal,
  formatCurrency,
  formatDate,
  getTodayISO,
  getTomorrowISO,
  validateEmail,
  validatePhone,
} from '@/lib/utils';
import { useRoomAvailabilityCheck } from '@/hooks/useHotelQueries';
import { Icon } from '@iconify/react';
import { useRoomBookings } from '@/hooks/useHotelQueries';
import { createConferenceBooking } from '@/services/hotelService';

type BookingMode = 'room' | 'conference';

interface BookingDrawerProps {
  open?: boolean;
  isOpen?: boolean;
  onClose: () => void;
  mode?: BookingMode;
  selectedRoom?: Room | null;
  preselectedRoom?: Room | null;
  initialDates?: { checkIn?: string; checkOut?: string };
}

const SummaryBar = styled.div<{ $visible: boolean }>`
  position: sticky;
  bottom: 0;
  margin: 1rem -1.5rem -1.5rem;
  padding: 1rem 1.5rem 1.5rem;
  background: linear-gradient(180deg, transparent, ${harrisTheme.colors.slate[50]} 25%);
  display: ${(p) => (p.$visible ? 'block' : 'none')};
`;

const Grid2 = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.85rem;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const StepIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  padding: 0.6rem 0.9rem;
  background: ${harrisTheme.colors.slate[50]};
  border-radius: ${harrisTheme.borderRadius.xl};
  border: 1px solid ${harrisTheme.colors.slate[200]};
  font-size: 0.8rem;
  color: ${harrisTheme.colors.slate[600]};
`;

const StepDot = styled.span<{ $done?: boolean; $active?: boolean }>`
  width: 22px;
  height: 22px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  font-size: 0.7rem;
  font-weight: 700;
  background: ${(p) =>
    p.$done ? harrisTheme.colors.primary : p.$active ? harrisTheme.colors.accent : harrisTheme.colors.slate[200]};
  color: ${(p) => (p.$done || p.$active ? harrisTheme.colors.white : harrisTheme.colors.slate[600])};
`;

const StepBar = styled.span`
  flex: 1;
  height: 2px;
  background: ${harrisTheme.colors.slate[200]};
  border-radius: 2px;
  overflow: hidden;
  &::after {
    content: '';
    display: block;
    width: 60%;
    height: 100%;
    background: ${harrisTheme.colors.primary};
    border-radius: inherit;
  }
`;

const SummaryRow = styled.div<{ $muted?: boolean; $bold?: boolean; $accent?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.55rem 0;
  font-size: ${(p) => (p.$bold ? '1.05rem' : '0.9rem')};
  color: ${(p) =>
    p.$accent
      ? harrisTheme.colors.accentDark
      : p.$bold
      ? harrisTheme.colors.slate[900]
      : p.$muted
      ? harrisTheme.colors.slate[500]
      : harrisTheme.colors.slate[700]};
  font-weight: ${(p) => (p.$bold ? 700 : 500)};
  border-bottom: ${(p) => (p.$bold ? `2px solid ${harrisTheme.colors.slate[200]}` : `1px solid ${harrisTheme.colors.slate[100]}`)};

  &:last-of-type {
    border-bottom: none;
  }
`;

const RoomPreview = styled.div`
  display: flex;
  gap: 0.9rem;
  padding: 0.9rem;
  border-radius: ${harrisTheme.borderRadius['2xl']};
  background: ${harrisTheme.colors.slate[50]};
  border: 1px solid ${harrisTheme.colors.slate[200]};
  margin-bottom: 1.25rem;

  .rp-media {
    width: 92px;
    height: 92px;
    border-radius: ${harrisTheme.borderRadius.xl};
    background: linear-gradient(135deg, #064e3b 0%, #059669 100%);
    display: grid;
    place-items: center;
    color: ${harrisTheme.colors.white};
    flex-shrink: 0;
  }

  .rp-info {
    flex: 1;
    min-width: 0;
    h4 {
      font-size: 1rem;
      font-family: ${harrisTheme.fontFamily.display};
      margin-bottom: 0.2rem;
    }
    .rp-sub {
      display: flex;
      flex-wrap: wrap;
      gap: 0.35rem;
      margin-bottom: 0.4rem;
    }
    .rp-price {
      font-weight: 700;
      color: ${harrisTheme.colors.primary};
      font-family: ${harrisTheme.fontFamily.display};
      font-size: 1.05rem;
    }
  }
`;

const StepperButton = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.35rem 0.45rem;
  background: ${harrisTheme.colors.slate[100]};
  border-radius: 999px;
  border: 1px solid ${harrisTheme.colors.slate[200]};

  button {
    width: 26px;
    height: 26px;
    border-radius: 999px;
    background: ${harrisTheme.colors.white};
    color: ${harrisTheme.colors.primary};
    display: grid;
    place-items: center;
    border: 1px solid ${harrisTheme.colors.slate[200]};
    transition: all ${harrisTheme.transitions.base};
    &:hover:not(:disabled) {
      background: ${harrisTheme.colors.primary};
      color: ${harrisTheme.colors.white};
    }
    &:disabled { opacity: 0.4; cursor: not-allowed; }
  }

  span {
    font-weight: 700;
    font-size: 0.9rem;
    min-width: 20px;
    text-align: center;
    color: ${harrisTheme.colors.slate[800]};
  }
`;

const SuccessBanner = styled.div`
  padding: 2rem;
  text-align: center;

  .success-check {
    width: 72px;
    height: 72px;
    border-radius: 999px;
    background: linear-gradient(135deg, #16a34a, #22c55e);
    color: ${harrisTheme.colors.white};
    display: grid;
    place-items: center;
    margin: 0 auto 1rem;
    box-shadow: 0 8px 20px rgba(34, 197, 94, 0.35);
    animation: pop 380ms cubic-bezier(0.34, 1.56, 0.64, 1) both;
  }

  h3 { margin-bottom: 0.4rem; font-size: 1.45rem; }
  p { color: ${harrisTheme.colors.slate[500]}; font-size: 0.9375rem; line-height: 1.6; }
`;

const pop = `
@keyframes pop {
  0% { transform: scale(0.6); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}`;

const TabRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.4rem;
  padding: 0.35rem;
  background: ${harrisTheme.colors.slate[100]};
  border-radius: 999px;
  margin-bottom: 1.5rem;
`;

const Tab = styled.button<{ $active?: boolean }>`
  padding: 0.55rem 0.85rem;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 600;
  color: ${(p) => (p.$active ? harrisTheme.colors.white : harrisTheme.colors.slate[600])};
  background: ${(p) => (p.$active ? harrisTheme.colors.primary : 'transparent')};
  transition: all ${harrisTheme.transitions.base};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
`;

export function BookingDrawer({
  open,
  isOpen,
  onClose,
  mode: initialMode = 'room',
  selectedRoom,
  preselectedRoom,
  initialDates,
}: BookingDrawerProps) {
  const isDrawerOpen = isOpen ?? open ?? false;
  const targetRoom = preselectedRoom ?? selectedRoom ?? null;
  const { currentBranch } = useBranch();
  const { createBooking: createRoomBooking } = useRoomBookings(currentBranch?.id ?? null);
  const { check: checkAvail, checking, isAvailable, setIsAvailable, error: availError } =
    useRoomAvailabilityCheck();

  const [step, setStep] = useState<1 | 2>(1);
  const [mode, setMode] = useState<BookingMode>(initialMode);
  const [room, setRoom] = useState<Room | null>(targetRoom);
  const [checkIn, setCheckIn] = useState(initialDates?.checkIn || getTodayISO());
  const [checkOut, setCheckOut] = useState(initialDates?.checkOut || getTomorrowISO());
  const [eventDate, setEventDate] = useState(getTomorrowISO());
  const [durationHours, setDurationHours] = useState<number>(4);
  const [attendees, setAttendees] = useState<number>(20);
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<null | { id: string; total: number; code: string }>(null);

  useEffect(() => {
    if (isDrawerOpen) {
      setMode(initialMode);
      setRoom(targetRoom);
      if (initialDates?.checkIn) setCheckIn(initialDates.checkIn);
      if (initialDates?.checkOut) setCheckOut(initialDates.checkOut);
      setStep(1);
      setSuccess(null);
      setErrors({});
      setIsAvailable(null);
    }
  }, [isDrawerOpen, initialMode, targetRoom, initialDates, setIsAvailable]);

  const nights = useMemo(
    () => (mode === 'room' ? calculateNights(checkIn, checkOut) : 0),
    [mode, checkIn, checkOut]
  );

  const roomTotal = useMemo(() => {
    if (!room) return 0;
    return calculateRoomTotal(room.price_per_night, nights);
  }, [room, nights]);

  const conferenceTotal = useMemo(() => {
    return (currentBranch?.conference_rate_per_hour ?? 0) * Math.max(durationHours, 0);
  }, [currentBranch, durationHours]);

  const total = mode === 'room' ? roomTotal : conferenceTotal;

  useEffect(() => {
    if (mode !== 'room' || !room || nights <= 0) {
      setIsAvailable(null);
      return;
    }
    const t = setTimeout(() => {
      checkAvail(room.id, checkIn, checkOut);
    }, 250);
    return () => clearTimeout(t);
  }, [mode, room, nights, checkIn, checkOut, checkAvail, setIsAvailable]);

  function validateStep1(): boolean {
    const e: Record<string, string> = {};
    if (mode === 'room') {
      if (!room) e.room = 'Please choose a room';
      if (!checkIn) e.checkIn = 'Check-in date required';
      if (!checkOut) e.checkOut = 'Check-out date required';
      if (checkIn && checkOut && nights <= 0) e.checkOut = 'Check-out must be after check-in';
      if (isAvailable === false) e.room = 'Room is not available for the selected dates';
    } else {
      if (!currentBranch?.has_conference) e.conference = 'Conference unavailable at this branch';
      if (!eventDate) e.eventDate = 'Event date required';
      if (eventDate && new Date(eventDate) < new Date(getTodayISO()))
        e.eventDate = 'Event date cannot be in the past';
      if (durationHours <= 0) e.duration = 'Duration must be at least 1 hour';
      if (durationHours > 24) e.duration = 'Duration cannot exceed 24 hours';
      if (attendees <= 0) e.attendees = 'Attendees must be greater than 0';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function validateStep2(): boolean {
    const e: Record<string, string> = {};
    if (clientName.trim().length < 2) e.clientName = 'Enter your full name';
    if (!validateEmail(clientEmail)) e.clientEmail = 'Enter a valid email address';
    if (!validatePhone(clientPhone)) e.clientPhone = 'Enter a valid phone number';
    setErrors({ ...errors, ...e });
    return Object.keys(e).length === 0;
  }

  async function handleSubmit() {
    if (!validateStep2()) return;
    if (!currentBranch) return;
    setSubmitting(true);
    try {
      if (mode === 'room' && room) {
        const b = await createRoomBooking({
          branch_id: currentBranch.id,
          room_id: room.id,
          client_name: clientName.trim(),
          client_email: clientEmail.trim(),
          client_phone: clientPhone.trim(),
          check_in: checkIn,
          check_out: checkOut,
          total_price: roomTotal,
          status: 'pending',
        });
        setSuccess({
          id: b.id,
          total: roomTotal,
          code: `HRM-${b.id.slice(0, 6).toUpperCase()}`,
        });
      } else {
        const b = await createConferenceBooking({
          branch_id: currentBranch.id,
          client_name: clientName.trim(),
          client_email: clientEmail.trim(),
          client_phone: clientPhone.trim(),
          event_date: eventDate,
          duration_hours: durationHours,
          attendees,
          total_price: conferenceTotal,
          status: 'pending',
          notes: notes.trim() || null,
        });
        setSuccess({
          id: b.id,
          total: conferenceTotal,
          code: `HCN-${b.id.slice(0, 6).toUpperCase()}`,
        });
      }
    } catch (err) {
      setErrors({ submit: err instanceof Error ? err.message : 'Booking failed' });
    } finally {
      setSubmitting(false);
    }
  }

  function nextStep() {
    if (step === 1 && validateStep1()) setStep(2);
  }

  function resetAll() {
    setClientName('');
    setClientEmail('');
    setClientPhone('');
    setNotes('');
    setErrors({});
    setStep(1);
    setSuccess(null);
    onClose();
  }

  return (
    <DrawerPanel
      open={isDrawerOpen}
      onClose={onClose}
      position="right"
      width="540px"
      title={success ? 'Booking Confirmed' : mode === 'room' ? 'Book a Room' : 'Reserve Conference'}
      subtitle={
        success
          ? `Reference ${success.code}`
          : currentBranch
          ? `${currentBranch.name} · ${currentBranch.location ?? ''}`
          : 'Loading…'
      }
    >
      {success ? (
        <>
          <style>{pop}</style>
          <SuccessBanner>
            <div className="success-check">
              <Icon icon="mdi:check" width={34} height={34} />
            </div>
            <h3>Thank you, {clientName.split(' ')[0]}!</h3>
            <p style={{ marginBottom: '1.5rem' }}>
              Your reservation is pending. We&apos;ve emailed a confirmation to{' '}
              <strong style={{ color: harrisTheme.colors.slate[700] }}>{clientEmail}</strong> and
              our front desk will be in touch shortly.
            </p>
            <Card $padding="lg" style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
              <SummaryRow $muted>
                <span>Booking reference</span>
                <span>
                  <code
                    style={{
                      padding: '0.2rem 0.5rem',
                      borderRadius: 6,
                      background: harrisTheme.colors.slate[100],
                      fontSize: '0.85rem',
                      color: harrisTheme.colors.primary,
                      fontWeight: 700,
                    }}
                  >
                    {success.code}
                  </code>
                </span>
              </SummaryRow>
              <SummaryRow $muted>
                <span>Branch</span>
                <span>{currentBranch?.name}</span>
              </SummaryRow>
              <SummaryRow $muted>
                <span>{mode === 'room' ? 'Room type' : 'Event'}</span>
                <span>
                  {mode === 'room' && room ? ROOM_TYPE_LABELS[room.room_type] : 'Conference Hall'}
                </span>
              </SummaryRow>
              <SummaryRow $muted>
                <span>{mode === 'room' ? 'Check-in → Check-out' : 'Event date'}</span>
                <span>
                  {mode === 'room'
                    ? `${formatDate(checkIn)} → ${formatDate(checkOut)} (${nights} n)`
                    : formatDate(eventDate)}
                </span>
              </SummaryRow>
              <SummaryRow $bold $accent>
                <span>Total (pending)</span>
                <span>{formatCurrency(success.total)}</span>
              </SummaryRow>
            </Card>
            <Button variant="primary" size="lg" fullWidth onClick={resetAll}>
              <Icon icon="mdi:home-outline" width={18} height={18} />
              Back to listings
            </Button>
          </SuccessBanner>
        </>
      ) : (
        <>
          <TabRow>
            <Tab $active={mode === 'room'} onClick={() => { setMode('room'); setStep(1); }}>
              <Icon icon="mdi:bed-king-outline" width={16} height={16} />
              Room
            </Tab>
            <Tab
              $active={mode === 'conference'}
              onClick={() => { setMode('conference'); setStep(1); }}
              disabled={!currentBranch?.has_conference}
            >
              <Icon icon="mdi:presentation" width={16} height={16} />
              Conference
            </Tab>
          </TabRow>

          <StepIndicator>
            <StepDot $active={step === 1} $done={step > 1}>1</StepDot>
            <span style={{ fontWeight: step === 1 ? 700 : 500, color: step === 1 ? harrisTheme.colors.primary : undefined }}>
              Dates &amp; Details
            </span>
            <StepBar />
            <StepDot $active={step === 2} $done={false}>2</StepDot>
            <span style={{ fontWeight: step === 2 ? 700 : 500, color: step === 2 ? harrisTheme.colors.primary : undefined }}>
              Guest info
            </span>
          </StepIndicator>

          {mode === 'room' ? (
            step === 1 ? (
              <>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: harrisTheme.colors.slate[500], marginBottom: '0.5rem' }}>
                  Choose a Room
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.25rem', maxHeight: 260, overflowY: 'auto', paddingRight: '0.25rem' }}>
                  {!currentBranch && <div style={{ color: harrisTheme.colors.slate[500] }}>Loading rooms…</div>}
                  {!room && currentBranch && (
                    <div style={{ color: harrisTheme.colors.accentDark, fontSize: '0.8rem', fontWeight: 600 }}>
                      {errors.room ?? 'Select a room to continue'}
                    </div>
                  )}
                  {currentBranch &&
                    [
                      { type: 'standard', rate: 4000, cap: 2 },
                      { type: 'upper_standard', rate: 5000, cap: 2 },
                      { type: 'deluxe', rate: 6000, cap: 3 },
                      { type: 'double_executive', rate: 8000, cap: 4 },
                    ].map((t) => (
                      <button
                        key={t.type}
                        onClick={() =>
                          setRoom({
                            id: `pseudo-${t.type}-${currentBranch.id}`,
                            branch_id: currentBranch.id,
                            room_type: t.type as Room['room_type'],
                            room_number: `XX-${t.type.slice(0, 2).toUpperCase()}`,
                            price_per_night: t.rate,
                            capacity: t.cap,
                            is_available: true,
                            description: '',
                            created_at: '',
                            updated_at: '',
                          })
                        }
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          padding: '0.75rem 0.9rem',
                          borderRadius: harrisTheme.borderRadius.xl,
                          background: room?.room_type === t.type ? 'rgba(1,47,19,0.06)' : harrisTheme.colors.white,
                          border: `1.5px solid ${room?.room_type === t.type ? harrisTheme.colors.primary : harrisTheme.colors.slate[200]}`,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                          cursor: 'pointer',
                          transition: 'all 150ms ease-in-out',
                        }}
                      >
                        <div
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: harrisTheme.borderRadius.lg,
                            background:
                              room?.room_type === t.type
                                ? harrisTheme.colors.primary
                                : harrisTheme.colors.slate[100],
                            color:
                              room?.room_type === t.type
                                ? harrisTheme.colors.white
                                : harrisTheme.colors.slate[600],
                            display: 'grid',
                            placeItems: 'center',
                            flexShrink: 0,
                          }}
                        >
                          <Icon icon="mdi:bed-king-outline" width={18} height={18} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 700, color: harrisTheme.colors.slate[900], fontSize: '0.9rem' }}>
                            {ROOM_TYPE_LABELS[t.type as Room['room_type']]}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: harrisTheme.colors.slate[500] }}>
                            Sleeps {t.cap} · {formatCurrency(t.rate)} / night
                          </div>
                        </div>
                        {room?.room_type === t.type && (
                          <Icon icon="mdi:check-circle" width={18} height={18} color={harrisTheme.colors.primary} />
                        )}
                      </button>
                    ))}
                </div>

                {room && (
                  <RoomPreview>
                    <div className="rp-media">
                      <Icon icon="mdi:bed-king-outline" width={30} height={30} />
                    </div>
                    <div className="rp-info">
                      <h4>{ROOM_TYPE_LABELS[room.room_type]} · #{room.room_number}</h4>
                      <div className="rp-sub">
                        <Badge $tone="primary">
                          <Icon icon="mdi:account-group-outline" width={12} height={12} />
                          {room.capacity} guests
                        </Badge>
                        <Badge $tone="success">
                          <Icon icon="mdi:check-circle-outline" width={12} height={12} />
                          {checking ? 'Checking…' : isAvailable === true ? 'Available' : isAvailable === false ? 'Unavailable' : 'Select dates'}
                        </Badge>
                      </div>
                      <div className="rp-price">{formatCurrency(room.price_per_night)} <span style={{ fontSize: '0.75rem', color: harrisTheme.colors.slate[500], fontWeight: 500 }}>/night</span></div>
                    </div>
                  </RoomPreview>
                )}

                <Grid2>
                  <Field label="Check-in" required error={errors.checkIn}>
                    <Input
                      type="date"
                      value={checkIn}
                      min={getTodayISO()}
                      onChange={(e) => setCheckIn(e.target.value)}
                      $hasError={!!errors.checkIn}
                    />
                  </Field>
                  <Field label="Check-out" required error={errors.checkOut}>
                    <Input
                      type="date"
                      value={checkOut}
                      min={checkIn || getTomorrowISO()}
                      onChange={(e) => setCheckOut(e.target.value)}
                      $hasError={!!errors.checkOut}
                    />
                  </Field>
                </Grid2>

                {availError && (
                  <div style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: '#dc2626' }}>
                    {availError}
                  </div>
                )}

                {errors.room && isAvailable === false && (
                  <div style={{ marginTop: '0.75rem', padding: '0.6rem 0.85rem', borderRadius: harrisTheme.borderRadius.lg, background: 'rgba(220,38,38,0.08)', color: '#b91c1c', fontSize: '0.85rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <Icon icon="mdi:alert-circle-outline" width={16} height={16} />
                    This room is not available for the selected dates.
                  </div>
                )}

                <SummaryBar $visible={!!room && nights > 0}>
                  <SummaryRow $muted>
                    <span>Rate</span>
                    <span>{room ? formatCurrency(room.price_per_night) : '—'} × {nights} night{nights !== 1 ? 's' : ''}</span>
                  </SummaryRow>
                  <SummaryRow $muted>
                    <span>Room subtotal</span>
                    <span>{formatCurrency(roomTotal)}</span>
                  </SummaryRow>
                  <SummaryRow $bold $accent>
                    <span>Total</span>
                    <span>{formatCurrency(roomTotal)}</span>
                  </SummaryRow>
                </SummaryBar>
              </>
            ) : (
              <GuestForm
                clientName={clientName}
                setClientName={setClientName}
                clientEmail={clientEmail}
                setClientEmail={setClientEmail}
                clientPhone={clientPhone}
                setClientPhone={setClientPhone}
                notes={notes}
                setNotes={setNotes}
                errors={errors}
              />
            )
          ) : step === 1 ? (
            <>
              <RoomPreview style={{ background: `linear-gradient(135deg, #022c22 0%, #065f46 100%)`, color: 'white', border: 'none' }}>
                <div className="rp-media" style={{ background: 'rgba(255,255,255,0.14)' }}>
                  <Icon icon="mdi:presentation" width={30} height={30} />
                </div>
                <div className="rp-info">
                  <h4 style={{ color: 'white' }}>Conference Hall</h4>
                  <div className="rp-sub" style={{ color: 'rgba(255,255,255,0.8)' }}>
                    <Badge $tone="accent" style={{ background: 'rgba(249,115,22,0.2)', color: '#fed7aa' }}>
                      <Icon icon="mdi:clock-outline" width={12} height={12} />
                      Hourly billing
                    </Badge>
                    <Badge $tone="success" style={{ background: 'rgba(34,197,94,0.18)', color: '#bbf7d0' }}>
                      <Icon icon="mdi:account-group-outline" width={12} height={12} />
                      ≤ 80 pax
                    </Badge>
                  </div>
                  <div className="rp-price" style={{ color: 'white' }}>
                    {formatCurrency(currentBranch?.conference_rate_per_hour ?? 0)}
                    <span style={{ fontSize: '0.75rem', opacity: 0.75, fontWeight: 500 }}> /hour</span>
                  </div>
                </div>
              </RoomPreview>

              <Field label="Event date" required error={errors.eventDate}>
                <Input
                  type="date"
                  value={eventDate}
                  min={getTodayISO()}
                  onChange={(e) => setEventDate(e.target.value)}
                  $hasError={!!errors.eventDate}
                />
              </Field>

              <Grid2>
                <Field label="Duration (hours)" required error={errors.duration}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.5rem 0.85rem',
                      border: `1.5px solid ${errors.duration ? '#dc2626' : harrisTheme.colors.slate[300]}`,
                      borderRadius: harrisTheme.borderRadius.lg,
                      background: harrisTheme.colors.white,
                    }}
                  >
                    <StepperButton>
                      <button
                        onClick={() => setDurationHours((d) => Math.max(1, d - 1))}
                        disabled={durationHours <= 1}
                      >
                        <Icon icon="mdi:minus" width={14} height={14} />
                      </button>
                      <span>{durationHours}</span>
                      <button
                        onClick={() => setDurationHours((d) => Math.min(24, d + 1))}
                        disabled={durationHours >= 24}
                      >
                        <Icon icon="mdi:plus" width={14} height={14} />
                      </button>
                    </StepperButton>
                    <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                      {[2, 4, 6, 8].map((h) => (
                        <button
                          key={h}
                          type="button"
                          onClick={() => setDurationHours(h)}
                          style={{
                            padding: '0.25rem 0.65rem',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            borderRadius: 999,
                            background:
                              durationHours === h ? harrisTheme.colors.primary : harrisTheme.colors.slate[100],
                            color: durationHours === h ? harrisTheme.colors.white : harrisTheme.colors.slate[700],
                          }}
                        >
                          {h}h
                        </button>
                      ))}
                    </div>
                  </div>
                </Field>

                <Field label="Expected attendees" required error={errors.attendees}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.5rem 0.85rem',
                      border: `1.5px solid ${errors.attendees ? '#dc2626' : harrisTheme.colors.slate[300]}`,
                      borderRadius: harrisTheme.borderRadius.lg,
                      background: harrisTheme.colors.white,
                    }}
                  >
                    <StepperButton>
                      <button onClick={() => setAttendees((a) => Math.max(1, a - 5))} disabled={attendees <= 1}>
                        <Icon icon="mdi:minus" width={14} height={14} />
                      </button>
                      <span>{attendees}</span>
                      <button onClick={() => setAttendees((a) => Math.min(80, a + 5))} disabled={attendees >= 80}>
                        <Icon icon="mdi:plus" width={14} height={14} />
                      </button>
                    </StepperButton>
                    <span style={{ fontSize: '0.75rem', color: harrisTheme.colors.slate[500] }}>Max 80</span>
                  </div>
                </Field>
              </Grid2>

              {errors.conference && (
                <div style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: '#dc2626' }}>{errors.conference}</div>
              )}

              <SummaryBar $visible={durationHours > 0}>
                <SummaryRow $muted>
                  <span>Rate</span>
                  <span>{formatCurrency(currentBranch?.conference_rate_per_hour ?? 0)} × {durationHours}h</span>
                </SummaryRow>
                <SummaryRow $muted>
                  <span>Venue subtotal</span>
                  <span>{formatCurrency(conferenceTotal)}</span>
                </SummaryRow>
                <SummaryRow $bold $accent>
                  <span>Total</span>
                  <span>{formatCurrency(conferenceTotal)}</span>
                </SummaryRow>
              </SummaryBar>
            </>
          ) : (
            <GuestForm
              clientName={clientName}
              setClientName={setClientName}
              clientEmail={clientEmail}
              setClientEmail={setClientEmail}
              clientPhone={clientPhone}
              setClientPhone={setClientPhone}
              notes={notes}
              setNotes={setNotes}
              errors={errors}
              extraNotesLabel="Event notes / setup requests"
            />
          )}

          {errors.submit && (
            <div
              style={{
                marginTop: '1rem',
                padding: '0.7rem 0.9rem',
                borderRadius: harrisTheme.borderRadius.lg,
                background: 'rgba(220,38,38,0.08)',
                color: '#b91c1c',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <Icon icon="mdi:alert-circle-outline" width={16} height={16} />
              {errors.submit}
            </div>
          )}
        </>
      )}

      {!success && (
        <div
          style={{
            marginTop: '1.5rem',
            display: 'flex',
            gap: '0.6rem',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {step === 2 ? (
            <Button variant="outline" size="md" onClick={() => setStep(1)}>
              <Icon icon="mdi:arrow-left" width={16} height={16} />
              Back
            </Button>
          ) : (
            <Button variant="ghost" size="md" onClick={onClose}>
              Cancel
            </Button>
          )}
          {step === 1 ? (
            <Button
              variant="accent"
              size="lg"
              onClick={nextStep}
              disabled={checking}
              loading={checking}
            >
              Continue
              <Icon icon="mdi:arrow-right" width={16} height={16} />
            </Button>
          ) : (
            <Button
              variant="accent"
              size="lg"
              onClick={handleSubmit}
              loading={submitting}
              disabled={!clientName || !clientEmail || !clientPhone}
            >
              <Icon icon="mdi:calendar-check-outline" width={16} height={16} />
              Confirm Booking · {formatCurrency(total)}
            </Button>
          )}
        </div>
      )}
    </DrawerPanel>
  );
}

interface GuestFormProps {
  clientName: string;
  setClientName: (v: string) => void;
  clientEmail: string;
  setClientEmail: (v: string) => void;
  clientPhone: string;
  setClientPhone: (v: string) => void;
  notes: string;
  setNotes: (v: string) => void;
  errors: Record<string, string>;
  extraNotesLabel?: string;
}

function GuestForm({
  clientName,
  setClientName,
  clientEmail,
  setClientEmail,
  clientPhone,
  setClientPhone,
  notes,
  setNotes,
  errors,
  extraNotesLabel = 'Special requests (optional)',
}: GuestFormProps) {
  return (
    <>
      <Field label="Full name" required error={errors.clientName}>
        <Input
          type="text"
          placeholder="Jane Wanjiru"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          $hasError={!!errors.clientName}
        />
      </Field>

      <Grid2>
        <Field label="Email address" required error={errors.clientEmail}>
          <Input
            type="email"
            placeholder="jane@example.com"
            value={clientEmail}
            onChange={(e) => setClientEmail(e.target.value)}
            $hasError={!!errors.clientEmail}
          />
        </Field>
        <Field label="Phone number" required error={errors.clientPhone}>
          <Input
            type="tel"
            placeholder="+254 700 000 000"
            value={clientPhone}
            onChange={(e) => setClientPhone(e.target.value)}
            $hasError={!!errors.clientPhone}
          />
        </Field>
      </Grid2>

      <Field label={extraNotesLabel}>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Late check-in, seating layout, accessibility requirements…"
          style={{
            width: '100%',
            padding: '0.625rem 0.875rem',
            fontSize: '0.9375rem',
            borderRadius: harrisTheme.borderRadius.lg,
            border: `1.5px solid ${harrisTheme.colors.slate[300]}`,
            background: harrisTheme.colors.white,
            minHeight: 96,
            resize: 'vertical',
            fontFamily: 'inherit',
            outline: 'none',
            transition: 'all 150ms ease-in-out',
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = harrisTheme.colors.primary)}
          onBlur={(e) => (e.currentTarget.style.borderColor = harrisTheme.colors.slate[300])}
        />
      </Field>

      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '0.5rem',
          padding: '0.7rem 0.85rem',
          borderRadius: harrisTheme.borderRadius.lg,
          background: 'rgba(0,106,86,0.05)',
          border: `1px solid rgba(0,106,86,0.15)`,
          fontSize: '0.78rem',
          color: harrisTheme.colors.primaryDark,
          marginTop: '0.5rem',
        }}
      >
        <Icon icon="mdi:shield-check-outline" width={16} height={16} style={{ flexShrink: 0, marginTop: 1 }} />
        <div>
          <strong style={{ fontWeight: 700 }}>Privacy note</strong>: Your contact details are used
          solely for this reservation and are protected under Harris Lodge Guest Privacy &amp; Security Policy.
        </div>
      </div>
    </>
  );
}

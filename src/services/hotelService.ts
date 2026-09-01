import { StorageStore } from '@/lib/storage';
import type { Branch, Room, RoomBooking, ConferenceBooking } from '@/types/database';

export async function getAllBranches(): Promise<Branch[]> {
  await new Promise((res) => setTimeout(res, 50));
  return StorageStore.getBranches();
}

export async function getBranchById(id: string): Promise<Branch | null> {
  await new Promise((res) => setTimeout(res, 30));
  const branches = StorageStore.getBranches();
  return branches.find((b) => b.id === id) ?? null;
}

export async function getRoomsByBranch(
  branchId: string,
  options: { onlyAvailable?: boolean; roomType?: string } = {}
): Promise<Room[]> {
  await new Promise((res) => setTimeout(res, 50));
  let rooms = StorageStore.getRooms().filter((r) => r.branch_id === branchId);
  if (options.onlyAvailable) {
    rooms = rooms.filter((r) => r.is_available);
  }
  if (options.roomType) {
    rooms = rooms.filter((r) => r.room_type === options.roomType);
  }
  return rooms.sort((a, b) => a.price_per_night - b.price_per_night);
}

export async function getRoomById(id: string): Promise<Room | null> {
  await new Promise((res) => setTimeout(res, 30));
  const rooms = StorageStore.getRooms();
  return rooms.find((r) => r.id === id) ?? null;
}

export async function getRoomBookingsByBranch(branchId: string): Promise<RoomBooking[]> {
  await new Promise((res) => setTimeout(res, 50));
  const bookings = StorageStore.getRoomBookings().filter((b) => b.branch_id === branchId);
  return bookings.sort((a, b) => new Date(b.check_in).getTime() - new Date(a.check_in).getTime());
}

export async function getConferenceBookingsByBranch(
  branchId: string
): Promise<ConferenceBooking[]> {
  await new Promise((res) => setTimeout(res, 50));
  const bookings = StorageStore.getConferenceBookings().filter((b) => b.branch_id === branchId);
  return bookings.sort((a, b) => new Date(b.event_date).getTime() - new Date(a.event_date).getTime());
}

export async function createRoomBooking(
  booking: Omit<RoomBooking, 'id' | 'created_at'>
): Promise<RoomBooking> {
  await new Promise((res) => setTimeout(res, 80));
  const newBooking: RoomBooking = {
    ...booking,
    id: `bk-rb-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    created_at: new Date().toISOString(),
  };

  const existing = StorageStore.getRoomBookings();
  StorageStore.saveRoomBookings([newBooking, ...existing]);
  return newBooking;
}

export async function createConferenceBooking(
  booking: Omit<ConferenceBooking, 'id' | 'created_at'>
): Promise<ConferenceBooking> {
  await new Promise((res) => setTimeout(res, 80));
  const newBooking: ConferenceBooking = {
    ...booking,
    id: `bk-cb-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    created_at: new Date().toISOString(),
  };

  const existing = StorageStore.getConferenceBookings();
  StorageStore.saveConferenceBookings([newBooking, ...existing]);
  return newBooking;
}

export async function checkRoomAvailability(
  roomId: string,
  checkIn: string,
  checkOut: string,
  excludeBookingId?: string
): Promise<boolean> {
  await new Promise((res) => setTimeout(res, 40));
  const bookings = StorageStore.getRoomBookings();
  const cIn = new Date(checkIn).getTime();
  const cOut = new Date(checkOut).getTime();

  const conflict = bookings.find((b) => {
    if (b.room_id !== roomId) return false;
    if (b.status === 'cancelled') return false;
    if (excludeBookingId && b.id === excludeBookingId) return false;
    const bIn = new Date(b.check_in).getTime();
    const bOut = new Date(b.check_out).getTime();
    return bIn < cOut && bOut > cIn;
  });

  return !conflict;
}

export async function checkConferenceAvailability(
  branchId: string,
  eventDate: string,
  excludeBookingId?: string
): Promise<boolean> {
  await new Promise((res) => setTimeout(res, 40));
  const bookings = StorageStore.getConferenceBookings();
  const conflict = bookings.find((b) => {
    if (b.branch_id !== branchId) return false;
    if (b.status === 'cancelled') return false;
    if (excludeBookingId && b.id === excludeBookingId) return false;
    return b.event_date === eventDate;
  });

  return !conflict;
}

export async function updateRoomBookingStatus(
  bookingId: string,
  status: RoomBooking['status']
): Promise<RoomBooking> {
  await new Promise((res) => setTimeout(res, 50));
  const bookings = StorageStore.getRoomBookings();
  const idx = bookings.findIndex((b) => b.id === bookingId);
  if (idx === -1) throw new Error('Booking not found');

  const updated: RoomBooking = { ...bookings[idx], status };
  bookings[idx] = updated;
  StorageStore.saveRoomBookings(bookings);
  return updated;
}

export async function updateConferenceBookingStatus(
  bookingId: string,
  status: ConferenceBooking['status']
): Promise<ConferenceBooking> {
  await new Promise((res) => setTimeout(res, 50));
  const bookings = StorageStore.getConferenceBookings();
  const idx = bookings.findIndex((b) => b.id === bookingId);
  if (idx === -1) throw new Error('Conference booking not found');

  const updated: ConferenceBooking = { ...bookings[idx], status };
  bookings[idx] = updated;
  StorageStore.saveConferenceBookings(bookings);
  return updated;
}

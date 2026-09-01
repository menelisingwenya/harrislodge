import { useCallback, useEffect, useState } from 'react';
import type { Room, RoomBooking, ConferenceBooking } from '@/types/database';
import {
  createConferenceBooking,
  createRoomBooking,
  getConferenceBookingsByBranch,
  getRoomBookingsByBranch,
  checkRoomAvailability,
  checkConferenceAvailability,
} from '@/services/hotelService';

export function useBranches() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return { loading, error, setLoading, setError };
}

export function useRoomsByBranch(_branchId: string | null) {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return { rooms, loading, error, setRooms, setLoading, setError };
}

interface UseRoomBookingsResult {
  bookings: RoomBooking[];
  loading: boolean;
  error: string | null;
  loadBookings: () => Promise<void>;
  createBooking: (
    booking: Omit<RoomBooking, 'id' | 'created_at'>
  ) => Promise<RoomBooking>;
}

export function useRoomBookings(branchId: string | null): UseRoomBookingsResult {
  const [bookings, setBookings] = useState<RoomBooking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadBookings = useCallback(async () => {
    if (!branchId) return;
    try {
      setLoading(true);
      setError(null);
      const data = await getRoomBookingsByBranch(branchId);
      setBookings(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  }, [branchId]);

  const createBooking = useCallback(
    async (booking: Omit<RoomBooking, 'id' | 'created_at'>) => {
      setLoading(true);
      setError(null);
      try {
        const result = await createRoomBooking(booking);
        setBookings((prev) => [result, ...prev]);
        return result;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to create booking';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  return { bookings, loading, error, loadBookings, createBooking };
}

interface UseConferenceBookingsResult {
  bookings: ConferenceBooking[];
  loading: boolean;
  error: string | null;
  loadBookings: () => Promise<void>;
  createBooking: (
    booking: Omit<ConferenceBooking, 'id' | 'created_at'>
  ) => Promise<ConferenceBooking>;
}

export function useConferenceBookings(branchId: string | null): UseConferenceBookingsResult {
  const [bookings, setBookings] = useState<ConferenceBooking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadBookings = useCallback(async () => {
    if (!branchId) return;
    try {
      setLoading(true);
      setError(null);
      const data = await getConferenceBookingsByBranch(branchId);
      setBookings(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load conference bookings');
    } finally {
      setLoading(false);
    }
  }, [branchId]);

  const createBooking = useCallback(
    async (booking: Omit<ConferenceBooking, 'id' | 'created_at'>) => {
      setLoading(true);
      setError(null);
      try {
        const result = await createConferenceBooking(booking);
        setBookings((prev) => [result, ...prev]);
        return result;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Failed to create conference booking';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  return { bookings, loading, error, loadBookings, createBooking };
}

export function useRoomAvailabilityCheck() {
  const [checking, setChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  const check = useCallback(
    async (roomId: string, checkIn: string, checkOut: string, excludeId?: string) => {
      try {
        setChecking(true);
        setError(null);
        const result = await checkRoomAvailability(roomId, checkIn, checkOut, excludeId);
        setIsAvailable(result);
        return result;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Availability check failed';
        setError(message);
        return false;
      } finally {
        setChecking(false);
      }
    },
    []
  );

  return { checking, isAvailable, error, check, setIsAvailable };
}

export function useConferenceAvailabilityCheck() {
  const [checking, setChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  const check = useCallback(
    async (branchId: string, eventDate: string, excludeId?: string) => {
      try {
        setChecking(true);
        setError(null);
        const result = await checkConferenceAvailability(branchId, eventDate, excludeId);
        setIsAvailable(result);
        return result;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Availability check failed';
        setError(message);
        return false;
      } finally {
        setChecking(false);
      }
    },
    []
  );

  return { checking, isAvailable, error, check, setIsAvailable };
}

export function useBranchRoomsByType(
  rooms: Room[]
): Record<string, Room[]> {
  const grouped: Record<string, Room[]> = {
    standard: [],
    upper_standard: [],
    deluxe: [],
    double_executive: [],
  };
  for (const room of rooms) {
    if (!grouped[room.room_type]) grouped[room.room_type] = [];
    grouped[room.room_type].push(room);
  }
  return grouped;
}

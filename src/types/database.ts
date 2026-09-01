export type RoomType = 'standard' | 'upper_standard' | 'deluxe' | 'double_executive';
export type UserRole = 'guest' | 'receptionist' | 'admin';
export type BookingStatus = 'pending' | 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled';

export interface Branch {
  id: string;
  name: string;
  location: string | null;
  address: string | null;
  contact_phone: string | null;
  has_conference: boolean;
  conference_rate_per_hour: number;
  created_at: string;
  updated_at: string;
}

export interface Room {
  id: string;
  branch_id: string;
  room_type: RoomType;
  room_number: string;
  price_per_night: number;
  capacity: number;
  is_available: boolean;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  email: string;
  role: UserRole;
  branch_id: string | null;
  full_name: string | null;
  created_at: string;
  updated_at: string;
}

export interface RoomBooking {
  id: string;
  branch_id: string;
  room_id: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  check_in: string;
  check_out: string;
  total_price: number;
  status: BookingStatus;
  created_at: string;
}

export interface ConferenceBooking {
  id: string;
  branch_id: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  event_date: string;
  duration_hours: number;
  attendees: number;
  total_price: number;
  status: BookingStatus;
  notes: string | null;
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      branches: {
        Row: Branch;
        Insert: Omit<Branch, 'id' | 'created_at' | 'updated_at'> & Partial<Pick<Branch, 'id' | 'created_at' | 'updated_at'>>;
        Update: Partial<Omit<Branch, 'id'>>;
      };
      rooms: {
        Row: Room;
        Insert: Omit<Room, 'id' | 'created_at' | 'updated_at'> & Partial<Pick<Room, 'id' | 'created_at' | 'updated_at'>>;
        Update: Partial<Omit<Room, 'id'>>;
      };
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'id' | 'created_at' | 'updated_at'> & Partial<Pick<Profile, 'id' | 'created_at' | 'updated_at'>>;
        Update: Partial<Omit<Profile, 'id'>>;
      };
      room_bookings: {
        Row: RoomBooking;
        Insert: Omit<RoomBooking, 'id' | 'created_at'> & Partial<Pick<RoomBooking, 'id' | 'created_at'>>;
        Update: Partial<Omit<RoomBooking, 'id'>>;
      };
      conference_bookings: {
        Row: ConferenceBooking;
        Insert: Omit<ConferenceBooking, 'id' | 'created_at'> & Partial<Pick<ConferenceBooking, 'id' | 'created_at'>>;
        Update: Partial<Omit<ConferenceBooking, 'id'>>;
      };
    };
    Views: Record<string, never>;
    Functions: {
      get_user_role: {
        Args: Record<PropertyKey, never>;
        Returns: UserRole;
      };
      get_user_branch_id: {
        Args: Record<PropertyKey, never>;
        Returns: string | null;
      };
    };
    Enums: {
      room_type: RoomType;
      user_role: UserRole;
      booking_status: BookingStatus;
    };
  };
}

export const ROOM_TYPE_LABELS: Record<RoomType, string> = {
  standard: 'Standard',
  upper_standard: 'Upper Standard',
  deluxe: 'Deluxe',
  double_executive: 'Double Executive',
};

export const BOOKING_STATUS_LABELS: Record<BookingStatus, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  checked_in: 'Checked In',
  checked_out: 'Checked Out',
  cancelled: 'Cancelled',
};

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  guest: 'Guest',
  receptionist: 'Receptionist',
  admin: 'Admin',
};

export const ROOM_TYPE_AMENITIES: Record<RoomType, string[]> = {
  standard: ['Queen Bed', 'Wi-Fi', 'Work Desk', 'Air Conditioning'],
  upper_standard: ['King Bed', 'Wi-Fi', 'Minibar', 'Balcony', 'Air Conditioning'],
  deluxe: ['King Suite', 'Lounge Area', 'Premium Wi-Fi', 'Minibar', 'Premium Toiletries'],
  double_executive: ['Two Bedrooms', 'Meeting Nook', 'Premium Wi-Fi', 'Executive Lounge Access'],
};

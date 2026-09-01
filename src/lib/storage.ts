import type { Branch, Room, RoomBooking, ConferenceBooking, Profile } from '@/types/database';

const STORAGE_KEYS = {
  BRANCHES: 'harris_lodge_branches_v2',
  ROOMS: 'harris_lodge_rooms_v2',
  ROOM_BOOKINGS: 'harris_lodge_room_bookings_v2',
  CONFERENCE_BOOKINGS: 'harris_lodge_conf_bookings_v2',
  PROFILES: 'harris_lodge_profiles_v2',
  CURRENT_USER: 'harris_lodge_auth_user_v2',
};

// 12 Official Harris Branches
export const SEED_BRANCHES: Branch[] = [
  {
    id: 'branch-northend',
    name: 'Harris Northend',
    location: 'Northend District',
    address: '12 Northend Blvd',
    contact_phone: '+263 77 111 0001',
    has_conference: true,
    conference_rate_per_hour: 8000,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'branch-sunone',
    name: 'Harris Sunone',
    location: 'Sunone Plaza',
    address: '24 Sunone Way',
    contact_phone: '+263 77 111 0002',
    has_conference: true,
    conference_rate_per_hour: 8000,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'branch-prime',
    name: 'Harris Prime',
    location: 'Prime Commercial Centre',
    address: '88 Prime Heights',
    contact_phone: '+263 77 111 0003',
    has_conference: true,
    conference_rate_per_hour: 10000,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'branch-zim-harris',
    name: 'Zim Harris',
    location: 'Central Gateway',
    address: '101 Zim Harris Avenue',
    contact_phone: '+263 77 111 0004',
    has_conference: true,
    conference_rate_per_hour: 8500,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'branch-qatha',
    name: 'Harris Qatha',
    location: 'Qatha Precinct',
    address: '55 Qatha Lane',
    contact_phone: '+263 77 111 0005',
    has_conference: false,
    conference_rate_per_hour: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'branch-clark',
    name: 'Harris Clark',
    location: 'Clark Heritage Quarter',
    address: '32 Clark Close',
    contact_phone: '+263 77 111 0006',
    has_conference: true,
    conference_rate_per_hour: 9000,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'branch-romney-park',
    name: 'Harris Romney Park',
    location: 'Romney Park Parkland',
    address: '77 Romney Park Drive',
    contact_phone: '+263 77 111 0007',
    has_conference: true,
    conference_rate_per_hour: 9500,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'branch-silver-sands',
    name: 'Harris Silver Sands',
    location: 'Silver Sands Haven',
    address: '14 Silver Sands Bay',
    contact_phone: '+263 77 111 0008',
    has_conference: false,
    conference_rate_per_hour: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'branch-london',
    name: 'Harris London',
    location: 'London View',
    address: '19 London Road',
    contact_phone: '+263 77 111 0009',
    has_conference: true,
    conference_rate_per_hour: 11000,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'branch-villa',
    name: 'Harris Villa',
    location: 'Villa Sanctuary',
    address: '60 Villa Terraces',
    contact_phone: '+263 77 111 0010',
    has_conference: true,
    conference_rate_per_hour: 12000,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'branch-executive',
    name: 'Harris Executive',
    location: 'Diplomatic & Financial Sector',
    address: '250 Executive Towers',
    contact_phone: '+263 77 111 0011',
    has_conference: true,
    conference_rate_per_hour: 15000,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'branch-suburbs',
    name: 'Harris Suburbs',
    location: 'Suburbs Retreat',
    address: '42 Suburbs Garden Circle',
    contact_phone: '+263 77 111 0012',
    has_conference: true,
    conference_rate_per_hour: 8000,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// Seed Profiles / Demo Users
export const SEED_PROFILES: Profile[] = [
  {
    id: 'usr-admin-01',
    email: 'admin@harrislodge.com',
    role: 'admin',
    branch_id: null,
    full_name: 'Alexander Harris (General Manager)',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'usr-rec-01',
    email: 'reception@harrislodge.com',
    role: 'receptionist',
    branch_id: 'branch-northend',
    full_name: 'Grace Mutua (Front Desk)',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'usr-guest-01',
    email: 'guest@example.com',
    role: 'guest',
    branch_id: null,
    full_name: 'Sophia Bennett',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// Seed Rooms across branches (Standard, Deluxe, Executive)
export const SEED_ROOMS: Room[] = SEED_BRANCHES.flatMap((b) => [
  {
    id: `room-${b.id}-std`,
    branch_id: b.id,
    room_type: 'standard',
    room_number: '101',
    price_per_night: 4000,
    capacity: 2,
    is_available: true,
    description: `Refined standard room at ${b.name} with plush queen bedding, en-suite rainfall shower, and high-speed Wi-Fi.`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: `room-${b.id}-dlx`,
    branch_id: b.id,
    room_type: 'deluxe',
    room_number: '201',
    price_per_night: 6000,
    capacity: 3,
    is_available: true,
    description: `Premier deluxe suite at ${b.name} featuring panoramic views, master king bed, separate seating lounge, and marble ensuite.`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: `room-${b.id}-exec`,
    branch_id: b.id,
    room_type: 'double_executive',
    room_number: '301',
    price_per_night: 8000,
    capacity: 4,
    is_available: true,
    description: `Signature executive residence at ${b.name} with private study, dual master suites, deep soaking bathtub, and VIP concierge care.`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]);

// Seed Room Bookings
export const SEED_ROOM_BOOKINGS: RoomBooking[] = [
  {
    id: 'bk-rb-001',
    branch_id: '00000000-0000-0000-0000-000000000001',
    room_id: 'room-c-103',
    client_name: 'David Kariuki',
    client_email: 'david.k@enterprise.co.ke',
    client_phone: '+254 711 987 654',
    check_in: '2026-08-20',
    check_out: '2026-08-24',
    total_price: 42000,
    status: 'confirmed',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'bk-rb-002',
    branch_id: '00000000-0000-0000-0000-000000000001',
    room_id: 'room-c-101',
    client_name: 'Elena Rostova',
    client_email: 'elena.rostova@traveler.com',
    client_phone: '+44 7911 123456',
    check_in: '2026-08-18',
    check_out: '2026-08-22',
    total_price: 18000,
    status: 'checked_in',
    created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
  {
    id: 'bk-rb-003',
    branch_id: '00000000-0000-0000-0000-000000000002',
    room_id: 'room-g-104',
    client_name: 'Marcus Sterling',
    client_email: 'marcus@sterlingcapital.com',
    client_phone: '+1 212 555 0199',
    check_in: '2026-08-25',
    check_out: '2026-08-29',
    total_price: 64000,
    status: 'confirmed',
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
];

// Seed Conference Bookings
export const SEED_CONFERENCE_BOOKINGS: ConferenceBooking[] = [
  {
    id: 'bk-cb-001',
    branch_id: '00000000-0000-0000-0000-000000000001',
    client_name: 'Apex Global Summit',
    client_email: 'events@apexglobal.org',
    client_phone: '+254 722 000 999',
    event_date: '2026-08-23',
    duration_hours: 6,
    attendees: 45,
    total_price: 48000,
    status: 'confirmed',
    notes: 'Requires 4K projection, high-speed audio conferencing, and catered executive lunch.',
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: 'bk-cb-002',
    branch_id: '00000000-0000-0000-0000-000000000002',
    client_name: 'Savannah Tech Retreat',
    client_email: 'retreats@savannahtech.io',
    client_phone: '+254 733 444 555',
    event_date: '2026-08-26',
    duration_hours: 8,
    attendees: 70,
    total_price: 80000,
    status: 'pending',
    notes: 'Garden breakout zones needed with high-density Wi-Fi routers.',
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
];

function getFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    return JSON.parse(raw) as T;
  } catch (err) {
    console.warn(`LocalStorage read error for ${key}:`, err);
    return fallback;
  }
}

function setToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`LocalStorage write error for ${key}:`, err);
  }
}

export const StorageStore = {
  getBranches(): Branch[] {
    return getFromStorage<Branch[]>(STORAGE_KEYS.BRANCHES, SEED_BRANCHES);
  },
  saveBranches(branches: Branch[]): void {
    setToStorage(STORAGE_KEYS.BRANCHES, branches);
  },

  getRooms(): Room[] {
    return getFromStorage<Room[]>(STORAGE_KEYS.ROOMS, SEED_ROOMS);
  },
  saveRooms(rooms: Room[]): void {
    setToStorage(STORAGE_KEYS.ROOMS, rooms);
  },

  getRoomBookings(): RoomBooking[] {
    return getFromStorage<RoomBooking[]>(STORAGE_KEYS.ROOM_BOOKINGS, SEED_ROOM_BOOKINGS);
  },
  saveRoomBookings(bookings: RoomBooking[]): void {
    setToStorage(STORAGE_KEYS.ROOM_BOOKINGS, bookings);
  },

  getConferenceBookings(): ConferenceBooking[] {
    return getFromStorage<ConferenceBooking[]>(STORAGE_KEYS.CONFERENCE_BOOKINGS, SEED_CONFERENCE_BOOKINGS);
  },
  saveConferenceBookings(bookings: ConferenceBooking[]): void {
    setToStorage(STORAGE_KEYS.CONFERENCE_BOOKINGS, bookings);
  },

  getProfiles(): Profile[] {
    return getFromStorage<Profile[]>(STORAGE_KEYS.PROFILES, SEED_PROFILES);
  },
  saveProfiles(profiles: Profile[]): void {
    setToStorage(STORAGE_KEYS.PROFILES, profiles);
  },

  getCurrentUser(): Profile | null {
    return getFromStorage<Profile | null>(STORAGE_KEYS.CURRENT_USER, null);
  },
  saveCurrentUser(user: Profile | null): void {
    setToStorage(STORAGE_KEYS.CURRENT_USER, user);
  },

  resetToDefault(): void {
    setToStorage(STORAGE_KEYS.BRANCHES, SEED_BRANCHES);
    setToStorage(STORAGE_KEYS.ROOMS, SEED_ROOMS);
    setToStorage(STORAGE_KEYS.ROOM_BOOKINGS, SEED_ROOM_BOOKINGS);
    setToStorage(STORAGE_KEYS.CONFERENCE_BOOKINGS, SEED_CONFERENCE_BOOKINGS);
    setToStorage(STORAGE_KEYS.PROFILES, SEED_PROFILES);
    setToStorage(STORAGE_KEYS.CURRENT_USER, null);
  },
};

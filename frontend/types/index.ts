// ============================================================
// Hotel Booking System - TypeScript Type Definitions
// ============================================================

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  full_name: string;
  name: string; // alias for full_name
  email: string;
  phone?: string;
  is_active: boolean;
  roles?: { id: number; name: string }[];
  created_at: string;
  updated_at?: string;
}

export interface Hotel {
  id: number;
  name: string;
  slug: string;
  description: string;
  address: string;
  city: string;
  state?: string;
  country: string;
  zip_code?: string;
  phone: string;
  email: string;
  website?: string;
  star_rating: number;
  check_in_time: string;
  check_out_time: string;
  latitude?: number;
  longitude?: number;
  logo?: string;
  cover_image?: string;
  facilities: string[];
  is_active: boolean;
  room_types?: RoomType[];
  created_at: string;
  updated_at: string;
}

export interface RoomType {
  id: number;
  hotel_id: number;
  name: string;
  slug: string;
  description: string;
  base_price: number;
  max_occupancy: number;
  bed_type: string;
  room_size: number;
  view_type?: string;
  images: string[];
  is_active: boolean;
  total_rooms: number;
  available_rooms?: number;
  amenities?: Amenity[];
  hotel?: Hotel;
  created_at: string;
  updated_at: string;
}

export interface Amenity {
  id: number;
  name: string;
  icon?: string;
  category: string;
}

export interface Room {
  id: number;
  room_type_id: number;
  room_number: string;
  floor: number;
  status: 'available' | 'occupied' | 'maintenance' | 'out_of_order';
  notes?: string;
  room_type?: RoomType;
}

export interface Booking {
  id: number;
  booking_number: string;
  user_id: number;
  room_id?: number;
  room_type_id: number;
  hotel_id: number;
  check_in_date: string;
  check_out_date: string;
  num_guests: number;
  num_rooms: number;
  total_price: number;
  status: BookingStatus;
  payment_method: 'chapa' | 'cash';
  payment_status: PaymentStatus;
  special_requests?: string;
  cancellation_reason?: string;
  cancelled_at?: string;
  checked_in_at?: string;
  checked_out_at?: string;
  expires_at?: string;
  user?: User;
  room?: Room;
  room_type?: RoomType;
  hotel?: Hotel;
  payments?: Payment[];
  guests?: BookingGuest[];
  created_at: string;
  updated_at: string;
}

export type BookingStatus =
  | 'pending'
  | 'confirmed'
  | 'checked_in'
  | 'checked_out'
  | 'cancelled'
  | 'expired'
  | 'no_show';

export type PaymentStatus = 'pending' | 'paid' | 'partially_paid' | 'refunded' | 'failed';

export interface BookingGuest {
  id: number;
  booking_id: number;
  full_name: string;
  email?: string;
  phone?: string;
  id_type?: string;
  id_number?: string;
  is_primary: boolean;
}

export interface Payment {
  id: number;
  booking_id: number;
  amount: number;
  currency: string;
  payment_method: 'chapa' | 'cash';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  transaction_reference?: string;
  chapa_tx_ref?: string;
  chapa_checkout_url?: string;
  paid_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: number;
  user_id: number;
  hotel_id: number;
  booking_id: number;
  rating: number;
  comment?: string;
  is_approved: boolean;
  user?: User;
  created_at: string;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
  };
  links: {
    first: string;
    last: string;
    prev?: string;
    next?: string;
  };
}

export interface SearchFilters {
  check_in_date: string;
  check_out_date: string;
  guests?: number;
  rooms?: number;
  hotel_id?: number;
  min_price?: number;
  max_price?: number;
  bed_type?: string;
  amenities?: number[];
}

export interface BookingFormData {
  room_type_id: number;
  hotel_id: number;
  check_in_date: string;
  check_out_date: string;
  num_guests: number;
  num_rooms: number;
  special_requests?: string;
  payment_method: 'chapa' | 'cash';
  guests: GuestFormData[];
}

export interface GuestFormData {
  full_name: string;
  email?: string;
  phone?: string;
  id_type?: string;
  id_number?: string;
  is_primary: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone?: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

// Language types
export type Locale = 'en' | 'am' | 'or';

export interface LocaleOption {
  code: Locale;
  name: string;
  nativeName: string;
  flag: string;
}

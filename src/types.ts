export type ScreenId = 
  | 'login'
  | 'home'
  | 'search'
  | 'select-ride'
  | 'searching-driver'
  | 'driver-found'
  | 'active-trip'
  | 'trip-finished'
  | 'driver-profile'
  | 'account'
  | 'history'
  | 'payments'
  | 'promos'
  | 'driver-mode';

export type TabId = 'home' | 'rides' | 'activity' | 'promos' | 'account';

export interface LocationItem {
  id: string;
  name: string;
  address: string;
  city: string;
  lat: number;
  lng: number;
  type: 'recent' | 'saved' | 'poi';
  icon?: string;
}

export interface RideCategory {
  id: 'bear-flash' | 'bear-drive' | 'bear-premium' | 'bear-eco' | 'bear-moto';
  name: string;
  displayName: string;
  tagline: string;
  basePrice: number;
  etaMinutes: number;
  iconType: 'flash' | 'car' | 'premium' | 'leaf' | 'moto';
  badge?: string;
  badgeColor?: string;
  description: string;
  capacity: string;
}

export interface DriverInfo {
  id: string;
  name: string;
  title: string;
  rating: number;
  tripsCount: string;
  yearsExperience: number;
  acceptanceRate: number;
  avatarUrl: string;
  vehicleModel: string;
  vehicleColor: string;
  plate: string;
  phone: string;
  badges: Array<{
    title: string;
    description: string;
    icon: string;
  }>;
  reviews: Array<{
    id: string;
    author: string;
    date: string;
    rating: number;
    comment: string;
    avatarLetter: string;
  }>;
}

export interface PaymentMethod {
  id: string;
  type: 'cash' | 'credit' | 'mercadopago' | 'wallet';
  name: string;
  details: string;
  icon: string;
  isDefault?: boolean;
}

export interface TripRecord {
  id: string;
  date: string;
  time: string;
  origin: string;
  destination: string;
  category: string;
  price: number;
  driverName: string;
  driverAvatar: string;
  status: 'completed' | 'cancelled' | 'in_progress';
  rating?: number;
  carModel: string;
}

export interface ActiveTripState {
  origin: LocationItem;
  destination: LocationItem;
  category: RideCategory;
  price: number;
  discount: number;
  driver: DriverInfo;
  paymentMethod: PaymentMethod;
  promoCode?: string;
  status: 'searching' | 'driver_assigned' | 'in_transit' | 'arrived';
  progress: number; // 0 to 100
  currentInstruction: string;
  etaMinutes: number;
  distanceKm: number;
}

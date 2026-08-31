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
  | 'driver-mode'
  | 'driver-onboarding'
  | 'admin-panel'
  | 'bear-points'
  | 'conceptual-map';

export type TabId = 'home' | 'rides' | 'activity' | 'promos' | 'account' | 'admin' | 'ecosystem';

export interface LocationItem {
  id: string;
  name: string;
  address: string;
  city: string;
  lat: number;
  lng: number;
  type: 'recent' | 'saved' | 'poi' | 'frequent';
  icon?: string;
  frequencyCount?: number;
  lastVisited?: string;
  category?: string;
}

export type DriverPreference = 'none' | 'female_driver';

export interface DriverDocument {
  id: string;
  type: 
    | 'permiso_explotacion'
    | 'licencia_d1'
    | 'antecedentes_penales'
    | 'seguro_remis'
    | 'cedula_automotor'
    | 'rto_vtv'
    | 'deudores_alimentarios'
    | 'perros_guia';
  title: string;
  status: 'pendiente' | 'en_revision' | 'aprobado' | 'rechazado' | 'vencido';
  expiresAt?: string;
  daysToExpiry?: number;
  semaphore: 'verde' | 'amarillo' | 'rojo';
  fileName?: string;
  fileUrl?: string;
  feedback?: string;
  isRequired: boolean;
}

export interface DriverVehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  color: string;
  plate: string;
  isActive: boolean;
  category: 'bear-flash' | 'bear-drive' | 'bear-premium' | 'bear-eco';
  insuranceStatus: 'al_dia' | 'por_vencer' | 'vencido';
  rtoStatus: 'al_dia' | 'por_vencer' | 'vencido';
}

export interface DailyChargeRecord {
  id: string;
  date: string;
  tripsCount: number;
  grossIncome: number;
  chargeAmount: number;
  ruleDescription: string;
  status: 'pendiente' | 'programado' | 'procesando' | 'pagado' | 'fallido' | 'reintento';
  paymentMethod: string;
}

export interface BearPointReward {
  id: string;
  title: string;
  pointsCost: number;
  discountValue: string;
  badge: string;
  category: 'descuento' | 'viaje_gratis' | 'upgrade' | 'partner';
  isAvailable: boolean;
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
  time?: string;
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

export type TripHistoryItem = TripRecord;
export type DriverProfile = DriverInfo;

export interface ActiveTripState {
  id?: string;
  createdAt?: string;
  rideType?: string;
  origin: LocationItem;
  destination: LocationItem;
  category: RideCategory;
  price: number;
  discount: number;
  driver: DriverInfo;
  paymentMethod: PaymentMethod;
  promoCode?: string;
  status: 'searching' | 'driver_assigned' | 'driver-assigned' | 'in_transit' | 'in-progress' | 'arrived' | 'completed';
  progress?: number; // 0 to 100
  currentInstruction?: string;
  etaMinutes?: number;
  distanceKm?: number;
}

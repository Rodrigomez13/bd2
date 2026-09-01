import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { ActiveTripState, TripHistoryItem } from '../types';

const STORAGE_LOCAL_TRIPS_KEY = 'beardrive_local_demo_trips';

export type AuthResult = { ok: boolean; message?: string; user?: User };

export function getSupabaseConfig(): { url: string; anonKey: string; isConfigured: boolean } {
  const url = (import.meta.env.VITE_SUPABASE_URL || '').trim();
  const anonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();
  return {
    url,
    anonKey,
    isConfigured: Boolean(url.startsWith('https://') && url.includes('supabase.co') && anonKey.length > 20),
  };
}

export function isSupabaseConfigured(): boolean {
  return getSupabaseConfig().isConfigured;
}

let cachedClient: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (cachedClient) return cachedClient;
  const { url, anonKey, isConfigured } = getSupabaseConfig();
  if (!isConfigured) return null;
  cachedClient = createClient(url, anonKey, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
  });
  return cachedClient;
}

export async function getCurrentUser(): Promise<User | null> {
  const client = getSupabaseClient();
  if (!client) return null;
  const { data, error } = await client.auth.getUser();
  return error ? null : data.user;
}

export async function signInWithPassword(email: string, password: string): Promise<AuthResult> {
  const client = getSupabaseClient();
  if (!client) return { ok: false, message: 'La conexión segura todavía no está configurada.' };
  const { data, error } = await client.auth.signInWithPassword({ email, password });
  return error ? { ok: false, message: error.message } : { ok: true, user: data.user };
}

export async function signUpWithPassword(email: string, password: string, fullName: string): Promise<AuthResult> {
  const client = getSupabaseClient();
  if (!client) return { ok: false, message: 'La conexión segura todavía no está configurada.' };
  const { data, error } = await client.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  });
  if (error) return { ok: false, message: error.message };
  if (!data.session) return { ok: true, message: 'Revisá tu correo para confirmar la cuenta.' };
  return { ok: true, user: data.user };
}

export async function signOut(): Promise<void> {
  await getSupabaseClient()?.auth.signOut();
}

export interface LocalTripRecord {
  id: string;
  origin_name: string;
  origin_address: string;
  dest_name: string;
  dest_address: string;
  price: number;
  ride_type: string;
  status: string;
  driver_name: string;
  created_at: string;
  version: number;
}

function getLocalStoredTrips(): LocalTripRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_LOCAL_TRIPS_KEY) || '[]') as LocalTripRecord[];
  } catch {
    return [];
  }
}

function persistLocalTrip(record: LocalTripRecord): void {
  if (typeof window === 'undefined') return;
  const records = [record, ...getLocalStoredTrips().filter((item) => item.id !== record.id)];
  localStorage.setItem(STORAGE_LOCAL_TRIPS_KEY, JSON.stringify(records));
}

function toServiceType(name: string): 'BEAR_FLASH' | 'BEAR_STANDARD' | 'BEAR_PREMIUM' | 'BEAR_GREEN' {
  const normalized = name.toLowerCase();
  if (normalized.includes('flash')) return 'BEAR_FLASH';
  if (normalized.includes('premium')) return 'BEAR_PREMIUM';
  if (normalized.includes('green') || normalized.includes('eco')) return 'BEAR_GREEN';
  return 'BEAR_STANDARD';
}

/**
 * Stores demo history locally. With a configured project it invokes a protected
 * RPC; the browser never writes fares, drivers or ride states directly.
 */
export async function syncCreateTrip(trip: ActiveTripState): Promise<{ success: boolean; id: string; error?: string }> {
  const localId = trip.id || `demo-trip-${Date.now()}`;
  persistLocalTrip({
    id: localId,
    origin_name: trip.origin.name || trip.origin.address,
    origin_address: trip.origin.address,
    dest_name: trip.destination.name || trip.destination.address,
    dest_address: trip.destination.address,
    price: trip.price,
    ride_type: trip.category.name,
    status: trip.status,
    driver_name: trip.driver.name,
    created_at: trip.createdAt || new Date().toISOString(),
    version: 0,
  });

  const client = getSupabaseClient();
  if (!client) return { success: true, id: localId };
  const { data: auth } = await client.auth.getUser();
  if (!auth.user) return { success: false, id: localId, error: 'Iniciá sesión para solicitar un viaje real.' };

  const { data, error } = await client.functions.invoke('create-ride', {
    body: {
      pickup: { lat: trip.origin.lat, lng: trip.origin.lng, address: trip.origin.address },
      destination: { lat: trip.destination.lat, lng: trip.destination.lng, address: trip.destination.address },
      serviceType: toServiceType(trip.category.name),
    },
  });
  if (error || !data?.rideId) return { success: false, id: localId, error: error?.message || data?.error || 'No se pudo crear el viaje.' };
  return { success: true, id: String(data.rideId) };
}

export async function syncUpdateTripStatus(tripId?: string, status?: string, version = 0): Promise<boolean> {
  if (!tripId || !status) return false;
  const local = getLocalStoredTrips();
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_LOCAL_TRIPS_KEY, JSON.stringify(local.map((trip) => (
      trip.id === tripId ? { ...trip, status, version: trip.version + 1 } : trip
    ))));
  }

  const client = getSupabaseClient();
  if (!client || tripId.startsWith('demo-trip-') || tripId.startsWith('trip-')) return true;
  const statusMap: Record<string, string> = {
    'driver-assigned': 'DRIVER_ASSIGNED',
    'in-progress': 'TRIP_STARTED',
    completed: 'TRIP_COMPLETED',
    cancelled: 'CANCELLED',
  };
  const next = statusMap[status];
  if (!next) return false;
  const { error } = await client.rpc('transition_ride', {
    p_ride_id: tripId,
    p_expected_version: version,
    p_next_status: next,
  });
  return !error;
}

export async function fetchTripHistory(): Promise<TripHistoryItem[]> {
  const client = getSupabaseClient();
  if (client) {
    const { data, error } = await client
      .from('rides')
      .select('id, pickup_address, destination_address, fare_cents, service_type, status, created_at')
      .order('created_at', { ascending: false })
      .limit(20);
    if (!error && data) {
      return data.map((ride) => ({
        id: ride.id,
        date: new Date(ride.created_at).toLocaleDateString('es-AR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
        origin: ride.pickup_address,
        destination: ride.destination_address,
        category: ride.service_type.replace('BEAR_', 'Bear '),
        price: Math.round(ride.fare_cents / 100),
        driverName: 'Asignación segura',
        driverAvatar: '',
        carModel: 'Ver detalles del viaje',
        status: ride.status === 'COMPLETED' ? 'completed' : 'in_progress',
        rating: 0,
      }));
    }
  }

  return getLocalStoredTrips().map((trip) => ({
    id: trip.id,
    date: new Date(trip.created_at).toLocaleDateString('es-AR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
    origin: trip.origin_name || trip.origin_address,
    destination: trip.dest_name || trip.dest_address,
    category: trip.ride_type,
    price: trip.price,
    driverName: trip.driver_name,
    driverAvatar: '',
    carModel: 'Modo demo',
    status: trip.status === 'completed' ? 'completed' : 'in_progress',
    rating: 0,
  }));
}

export async function testSupabaseConnection(): Promise<{ ok: boolean; message: string; latencyMs?: number }> {
  const client = getSupabaseClient();
  if (!client) return { ok: false, message: 'Supabase no está configurado aún.' };
  const started = performance.now();
  const { error } = await client.from('service_zones').select('id').limit(1);
  const latencyMs = Math.round(performance.now() - started);
  return error
    ? { ok: false, message: `No se pudo validar la base segura: ${error.message}`, latencyMs }
    : { ok: true, message: 'Conexión y políticas de lectura verificadas.', latencyMs };
}

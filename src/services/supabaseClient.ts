import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { LocationItem, ActiveTripState, DriverProfile, TripHistoryItem } from '../types';

const STORAGE_SUPABASE_URL_KEY = 'beardrive_supabase_url';
const STORAGE_SUPABASE_KEY_KEY = 'beardrive_supabase_anon_key';
const STORAGE_LOCAL_TRIPS_KEY = 'beardrive_local_persisted_trips';

// Get current Supabase credentials from environment or local storage
export function getSupabaseConfig(): { url: string; anonKey: string; isConfigured: boolean } {
  let url = (import.meta.env.VITE_SUPABASE_URL || '').trim();
  let anonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

  if (typeof window !== 'undefined') {
    const savedUrl = localStorage.getItem(STORAGE_SUPABASE_URL_KEY);
    const savedKey = localStorage.getItem(STORAGE_SUPABASE_KEY_KEY);
    if (savedUrl && savedUrl.trim()) url = savedUrl.trim();
    if (savedKey && savedKey.trim()) anonKey = savedKey.trim();
  }

  const isConfigured = Boolean(
    url &&
    url.startsWith('https://') &&
    url.includes('supabase.co') &&
    anonKey &&
    anonKey.length > 20
  );

  return { url, anonKey, isConfigured };
}

export function isSupabaseConfigured(): boolean {
  return getSupabaseConfig().isConfigured;
}

export function saveCustomSupabaseConfig(url: string, anonKey: string): void {
  if (typeof window !== 'undefined') {
    if (url.trim()) {
      localStorage.setItem(STORAGE_SUPABASE_URL_KEY, url.trim());
    } else {
      localStorage.removeItem(STORAGE_SUPABASE_URL_KEY);
    }

    if (anonKey.trim()) {
      localStorage.setItem(STORAGE_SUPABASE_KEY_KEY, anonKey.trim());
    } else {
      localStorage.removeItem(STORAGE_SUPABASE_KEY_KEY);
    }
    // Invalidate cached client
    cachedClient = null;
  }
}

let cachedClient: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (cachedClient) return cachedClient;

  const { url, anonKey, isConfigured } = getSupabaseConfig();
  if (!isConfigured) return null;

  try {
    cachedClient = createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
    return cachedClient;
  } catch (err) {
    console.warn('Error initializing Supabase client:', err);
    return null;
  }
}

export interface SupabaseTripRecord {
  id: string;
  origin_name: string;
  origin_address: string;
  origin_lat: number;
  origin_lng: number;
  dest_name: string;
  dest_address: string;
  dest_lat: number;
  dest_lng: number;
  price: number;
  distance_km: number;
  eta_minutes: number;
  ride_type: string;
  status: string;
  driver_name: string;
  driver_plate: string;
  created_at: string;
}

/**
 * Creates or inserts a new Trip in Supabase database
 */
export async function syncCreateTrip(trip: ActiveTripState): Promise<{ success: boolean; id: string; error?: string }> {
  const client = getSupabaseClient();
  const tripId = trip.id || `trip-${Date.now()}`;
  const tripRecord: SupabaseTripRecord = {
    id: tripId,
    origin_name: trip.origin.name || trip.origin.address,
    origin_address: trip.origin.address,
    origin_lat: trip.origin.lat,
    origin_lng: trip.origin.lng,
    dest_name: trip.destination.name || trip.destination.address,
    dest_address: trip.destination.address,
    dest_lat: trip.destination.lat,
    dest_lng: trip.destination.lng,
    price: trip.price,
    distance_km: trip.distanceKm || 3.5,
    eta_minutes: trip.etaMinutes || 8,
    ride_type: trip.category.name,
    status: trip.status,
    driver_name: trip.driver.name,
    driver_plate: trip.driver.plate,
    created_at: trip.createdAt || new Date().toISOString(),
  };

  // 1. Always mirror locally in localStorage for 100% offline resilience
  try {
    const local = getLocalStoredTrips();
    const updated = [tripRecord, ...local.filter((t) => t.id !== tripId)];
    localStorage.setItem(STORAGE_LOCAL_TRIPS_KEY, JSON.stringify(updated));
  } catch {
    // ignore
  }

  // 2. If Supabase is connected, write to 'trips' table
  if (client) {
    try {
      const { data, error } = await client
        .from('trips')
        .upsert(tripRecord, { onConflict: 'id' })
        .select();

      if (error) {
        console.warn('Supabase upsert trip notice:', error.message);
        return { success: true, id: tripId, error: error.message };
      }
      return { success: true, id: data?.[0]?.id || tripId };
    } catch (err: any) {
      console.warn('Supabase network error:', err?.message);
      return { success: true, id: tripId, error: err?.message };
    }
  }

  return { success: true, id: tripId };
}

/**
 * Updates trip status in Supabase (e.g. 'in_progress', 'completed')
 */
export async function syncUpdateTripStatus(
  tripId?: string,
  status?: string,
  extra?: { rating?: number; tip?: number; comment?: string }
): Promise<boolean> {
  if (!tripId || !status) return false;
  const client = getSupabaseClient();

  // Update local
  try {
    const local = getLocalStoredTrips();
    const updated = local.map((t) => (t.id === tripId ? { ...t, status } : t));
    localStorage.setItem(STORAGE_LOCAL_TRIPS_KEY, JSON.stringify(updated));
  } catch {
    // ignore
  }

  if (client) {
    try {
      await client.from('trips').update({ status }).eq('id', tripId);
      if (extra?.rating) {
        await client.from('trip_ratings').insert({
          trip_id: tripId,
          rating: extra.rating,
          tip_amount: extra.tip || 0,
          comment: extra.comment || '',
          created_at: new Date().toISOString(),
        });
      }
      return true;
    } catch (err) {
      console.warn('Supabase update notice:', err);
    }
  }

  return true;
}

/**
 * Fetches all Trip history from Supabase, falling back to local storage
 */
export async function fetchTripHistory(): Promise<TripHistoryItem[]> {
  const client = getSupabaseClient();

  if (client) {
    try {
      const { data, error } = await client
        .from('trips')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (!error && data && data.length > 0) {
        return data.map((d: SupabaseTripRecord) => ({
          id: d.id,
          date: new Date(d.created_at).toLocaleDateString('es-AR', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
          }),
          origin: d.origin_name || d.origin_address,
          destination: d.dest_name || d.dest_address,
          category: d.ride_type || 'Bear Standard',
          price: d.price,
          driverName: d.driver_name,
          driverAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          carModel: 'Vehículo Conectado',
          status: (d.status === 'completed' ? 'completed' : 'in_progress') as any,
          rating: 5,
        }));
      }
    } catch (err) {
      console.warn('Supabase fetch history error:', err);
    }
  }

  // Fallback to local storage
  const local = getLocalStoredTrips();
  if (local.length > 0) {
    return local.map((d) => ({
      id: d.id,
      date: new Date(d.created_at).toLocaleDateString('es-AR', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      }),
      origin: d.origin_name || d.origin_address,
      destination: d.dest_name || d.dest_address,
      category: d.ride_type || 'Bear Standard',
      price: d.price,
      driverName: d.driver_name,
      driverAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      carModel: 'Vehículo Conectado',
      status: (d.status === 'completed' ? 'completed' : 'in_progress') as any,
      rating: 5,
    }));
  }

  return [];
}

/**
 * Helper to get local stored trips
 */
export function getLocalStoredTrips(): SupabaseTripRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_LOCAL_TRIPS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return [];
}

/**
 * Tests live connection to Supabase instance
 */
export async function testSupabaseConnection(): Promise<{ ok: boolean; message: string; latencyMs?: number }> {
  const { isConfigured, url } = getSupabaseConfig();
  if (!isConfigured) {
    return {
      ok: false,
      message: 'Supabase no está configurado aún. Agregá tu URL y Clave Anon para sincronización en la nube.',
    };
  }

  const client = getSupabaseClient();
  if (!client) {
    return { ok: false, message: 'No se pudo inicializar el cliente de Supabase.' };
  }

  const start = performance.now();
  try {
    // Try pinging or querying trips / auth health
    const { error } = await client.from('trips').select('id').limit(1);
    const latencyMs = Math.round(performance.now() - start);

    if (error && !error.message.includes('relation "trips" does not exist')) {
      return {
        ok: false,
        message: `Error de respuesta Supabase: ${error.message}`,
        latencyMs,
      };
    }

    return {
      ok: true,
      message: `Conectado exitosamente con ${url.split('//')[1]} (${latencyMs}ms)`,
      latencyMs,
    };
  } catch (err: any) {
    return {
      ok: false,
      message: `Fallo de red al conectar con Supabase: ${err?.message || String(err)}`,
    };
  }
}

/**
 * Mapbox Service for BearDrive
 * Handles token initialization, Directions API, Geocoding, Reverse Geocoding,
 * and high-reliability fallbacks for offline / custom tokens.
 */

// Default Mapbox Public Token / Custom Token handler
const STORAGE_KEY = 'bear_mapbox_token';

export const FORMOSA_CENTER: [number, number] = [-58.1758, -26.1852]; // [lng, lat]

export const MAPBOX_STYLES = {
  dark: 'mapbox://styles/mapbox/dark-v11',
  navigationNight: 'mapbox://styles/mapbox/navigation-night-v1',
  streets: 'mapbox://styles/mapbox/streets-v12',
  satellite: 'mapbox://styles/mapbox/satellite-streets-v12',
  light: 'mapbox://styles/mapbox/light-v11',
} as const;

export type MapStyleKey = keyof typeof MAPBOX_STYLES;

export function getMapboxToken(): string {
  // 1. Check environment variable (Vite)
  const envToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
  if (envToken && typeof envToken === 'string' && envToken.trim().length > 10) {
    return envToken.trim();
  }

  // 2. Check localStorage for user-provided custom token
  if (typeof window !== 'undefined') {
    const localToken = localStorage.getItem(STORAGE_KEY);
    if (localToken && localToken.trim().length > 10) {
      return localToken.trim();
    }
  }

  // No fake token: MapView will render its local preview map instead of a blank canvas.
  return '';
}

export function setCustomMapboxToken(token: string): void {
  if (typeof window !== 'undefined') {
    if (token.trim()) {
      localStorage.setItem(STORAGE_KEY, token.trim());
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }
}

export interface RouteResult {
  coordinates: [number, number][]; // Array of [lng, lat]
  distanceKm: number;
  durationMinutes: number;
  instructions: string[];
  summary: string;
}

/**
 * Calculates real driving directions using Mapbox Directions API with robust fallback
 */
export async function getDirections(
  origin: [number, number], // [lng, lat]
  destination: [number, number] // [lng, lat]
): Promise<RouteResult> {
  const token = getMapboxToken();

  try {
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${origin[0]},${origin[1]};${destination[0]},${destination[1]}?geometries=geojson&overview=full&steps=true&access_token=${token}`;
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        const coords = route.geometry.coordinates as [number, number][];
        const distanceKm = Number((route.distance / 1000).toFixed(1));
        const durationMinutes = Math.max(1, Math.round(route.duration / 60));
        const instructions: string[] = [];

        if (route.legs && route.legs[0] && route.legs[0].steps) {
          for (const step of route.legs[0].steps) {
            if (step.maneuver && step.maneuver.instruction) {
              instructions.push(step.maneuver.instruction);
            }
          }
        }

        return {
          coordinates: coords,
          distanceKm,
          durationMinutes,
          instructions: instructions.length > 0 ? instructions : ['Continúa por la ruta recomendada'],
          summary: route.legs?.[0]?.summary || 'Ruta más rápida',
        };
      }
    }
  } catch (error: any) {
    console.warn('Mapbox directions API notice:', error?.message || 'Using simulated route fallback');
  }

  // Fallback: Generate realistic city grid routing points
  return generateSimulatedRoute(origin, destination);
}

/**
 * Generates realistic street grid points between two coordinates (Manhattan + curves)
 */
function generateSimulatedRoute(
  origin: [number, number],
  destination: [number, number]
): RouteResult {
  const [lng1, lat1] = origin;
  const [lng2, lat2] = destination;

  // Approximate distance using Haversine
  const R = 6371; // km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const directDistance = R * c;
  const distanceKm = Number((directDistance * 1.35).toFixed(1)); // road detour factor
  const durationMinutes = Math.max(2, Math.round(distanceKm * 2.2));

  // Multi-step street points simulating city navigation
  const midLng1 = lng1 + (lng2 - lng1) * 0.15;
  const midLat1 = lat1 + (lat2 - lat1) * 0.05;

  const midLng2 = lng1 + (lng2 - lng1) * 0.45;
  const midLat2 = lat1 + (lat2 - lat1) * 0.4;

  const midLng3 = lng1 + (lng2 - lng1) * 0.75;
  const midLat3 = lat1 + (lat2 - lat1) * 0.85;

  const points: [number, number][] = [
    [lng1, lat1],
    [midLng1, midLat1],
    [midLng2, midLat2],
    [midLng3, midLat3],
    [lng2, lat2],
  ];

  // Smooth points interpolation
  const interpolated: [number, number][] = [];
  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i];
    const p2 = points[i + 1];
    const steps = 6;
    for (let s = 0; s < steps; s++) {
      const t = s / steps;
      interpolated.push([
        p1[0] + (p2[0] - p1[0]) * t,
        p1[1] + (p2[1] - p1[1]) * t,
      ]);
    }
  }
  interpolated.push([lng2, lat2]);

  return {
    coordinates: interpolated,
    distanceKm: Math.max(0.8, distanceKm),
    durationMinutes: Math.max(3, durationMinutes),
    instructions: [
      'Inicia tu recorrido hacia la avenida principal',
      'Gira en la siguiente intersección',
      'Continúa derecho por 800 metros',
      'Tu destino estará a la derecha',
    ],
    summary: 'Ruta optimizada BearDrive',
  };
}

export interface GeocodedPlace {
  id: string;
  name: string;
  address: string;
  city: string;
  lat: number;
  lng: number;
  category?: string;
}

/**
 * Searches places and addresses in Mapbox Geocoding API with Formosa bias
 */
export async function searchPlaces(query: string): Promise<GeocodedPlace[]> {
  if (!query || query.trim().length < 2) return [];

  const token = getMapboxToken();
  const trimmed = query.trim();

  try {
    const proximity = `${FORMOSA_CENTER[0]},${FORMOSA_CENTER[1]}`;
    // Bounding box around Formosa province & city for maximum relevance
    const bbox = `-60.5,-27.0,-57.5,-25.5`;
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
      trimmed
    )}.json?country=AR&proximity=${proximity}&bbox=${bbox}&types=address,poi,place,neighborhood,locality&language=es&access_token=${token}`;

    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      if (data.features && data.features.length > 0) {
        return data.features.map((f: any) => {
          const [lng, lat] = f.center || f.geometry?.coordinates || FORMOSA_CENTER;
          const fullPlaceName = f.place_name || f.text || '';
          // Clean up standard Mapbox Argentina suffixes for UI elegance
          const cleanAddress = fullPlaceName
            .replace(', Formosa, Argentina', '')
            .replace(', Departamento Formosa', '')
            .replace(', Argentina', '');

          return {
            id: f.id || `mb-${Math.random()}`,
            name: f.text || fullPlaceName.split(',')[0],
            address: cleanAddress || fullPlaceName,
            city: 'Formosa, Argentina',
            lat,
            lng,
            category: f.properties?.category || (f.place_type ? f.place_type[0] : 'Dirección'),
          };
        });
      }
    }
  } catch (err: any) {
    console.warn('Mapbox geocoding notice:', err?.message || 'Using local POIs fallback');
  }

  // If strict bbox yielded nothing, retry with broad Argentina proximity
  try {
    const broadUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
      trimmed
    )}.json?country=AR&proximity=${FORMOSA_CENTER[0]},${FORMOSA_CENTER[1]}&language=es&access_token=${token}`;
    const response = await fetch(broadUrl);
    if (response.ok) {
      const data = await response.json();
      if (data.features && data.features.length > 0) {
        return data.features.slice(0, 5).map((f: any) => {
          const [lng, lat] = f.center || f.geometry?.coordinates || FORMOSA_CENTER;
          return {
            id: f.id || `mb-${Math.random()}`,
            name: f.text || f.place_name.split(',')[0],
            address: f.place_name,
            city: 'Argentina',
            lat,
            lng,
            category: f.properties?.category || 'Lugar',
          };
        });
      }
    }
  } catch {
    // fallback
  }

  return [];
}

/**
 * Reverse geocodes coordinates to street address
 */
export async function reverseGeocode(lng: number, lat: number): Promise<{ name: string; address: string }> {
  const token = getMapboxToken();

  try {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${token}`;
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      if (data.features && data.features.length > 0) {
        const feat = data.features[0];
        return {
          name: feat.text || 'Ubicación seleccionada',
          address: feat.place_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
        };
      }
    }
  } catch (err: any) {
    console.warn('Reverse geocode notice:', err?.message || 'Using coordinate label fallback');
  }

  return {
    name: 'Punto en el mapa',
    address: `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}, Formosa`,
  };
}

/**
 * Calculates bearing angle between two coordinates
 */
export function calculateBearing(
  start: [number, number],
  end: [number, number]
): number {
  const startLng = (start[0] * Math.PI) / 180;
  const startLat = (start[1] * Math.PI) / 180;
  const endLng = (end[0] * Math.PI) / 180;
  const endLat = (end[1] * Math.PI) / 180;

  const dLng = endLng - startLng;
  const y = Math.sin(dLng) * Math.cos(endLat);
  const x =
    Math.cos(startLat) * Math.sin(endLat) -
    Math.sin(startLat) * Math.cos(endLat) * Math.cos(dLng);

  let brng = (Math.atan2(y, x) * 180) / Math.PI;
  return (brng + 360) % 360;
}

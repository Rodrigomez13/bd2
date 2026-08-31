import { reverseGeocode, FORMOSA_CENTER } from './mapboxService';
import { LocationItem } from '../types';

export interface UserLiveCoordinates {
  lat: number;
  lng: number;
  accuracy: number;
  heading: number | null;
  speed: number | null;
  timestamp: number;
}

export type GeolocationStatus = 'prompt' | 'granted' | 'denied' | 'unavailable' | 'loading';

/**
 * Retrieves the current real GPS location from the browser/mobile device
 */
export async function getCurrentGPSPosition(): Promise<{
  coords: UserLiveCoordinates;
  locationItem: LocationItem;
}> {
  return new Promise((resolve, reject) => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      reject(new Error('La geolocalización GPS no está soportada en este navegador.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude, accuracy, heading, speed } = position.coords;
        const coords: UserLiveCoordinates = {
          lat: latitude,
          lng: longitude,
          accuracy: accuracy || 10,
          heading: heading ?? null,
          speed: speed ?? null,
          timestamp: position.timestamp,
        };

        // Real reverse geocode via Mapbox to obtain real street name
        const geoInfo = await reverseGeocode(longitude, latitude);

        const locationItem: LocationItem = {
          id: `gps-live-${Date.now()}`,
          name: geoInfo.name || 'Mi ubicación actual',
          address: geoInfo.address || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
          city: 'Formosa, Argentina',
          lat: latitude,
          lng: longitude,
          type: 'recent',
          icon: 'crosshair',
          lastVisited: 'Ubicación GPS en vivo',
        };

        resolve({ coords, locationItem });
      },
      (error) => {
        let msg = 'No se pudo obtener la ubicación GPS.';
        if (error.code === error.PERMISSION_DENIED) {
          msg = 'Permiso de ubicación denegado.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          msg = 'Ubicación GPS no disponible.';
        } else if (error.code === error.TIMEOUT) {
          msg = 'Tiempo de espera agotado al consultar GPS.';
        }
        reject(new Error(msg));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 5000,
      }
    );
  });
}

/**
 * Starts continuous live GPS watch position
 */
export function watchGPSPosition(
  onUpdate: (data: { coords: UserLiveCoordinates; locationItem: LocationItem }) => void,
  onError?: (err: Error) => void
): () => void {
  if (typeof navigator === 'undefined' || !navigator.geolocation) {
    onError?.(new Error('Geolocalización no soportada.'));
    return () => {};
  }

  let lastGeocodeTime = 0;
  let cachedLocationItem: LocationItem | null = null;

  const watchId = navigator.geolocation.watchPosition(
    async (position) => {
      const { latitude, longitude, accuracy, heading, speed } = position.coords;
      const coords: UserLiveCoordinates = {
        lat: latitude,
        lng: longitude,
        accuracy: accuracy || 10,
        heading: heading ?? null,
        speed: speed ?? null,
        timestamp: position.timestamp,
      };

      const now = Date.now();
      // Throttle reverse geocoding to once every 15 seconds or if first time
      if (!cachedLocationItem || now - lastGeocodeTime > 15000) {
        const geoInfo = await reverseGeocode(longitude, latitude);
        lastGeocodeTime = now;
        cachedLocationItem = {
          id: `gps-live`,
          name: geoInfo.name || 'Mi ubicación actual',
          address: geoInfo.address || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
          city: 'Formosa, Argentina',
          lat: latitude,
          lng: longitude,
          type: 'recent',
          icon: 'crosshair',
          lastVisited: 'Ubicación GPS en vivo',
        };
      } else {
        cachedLocationItem = {
          ...cachedLocationItem,
          lat: latitude,
          lng: longitude,
        };
      }

      onUpdate({ coords, locationItem: cachedLocationItem });
    },
    (err) => {
      onError?.(new Error(err.message));
    },
    {
      enableHighAccuracy: true,
      maximumAge: 3000,
      timeout: 12000,
    }
  );

  return () => {
    navigator.geolocation.clearWatch(watchId);
  };
}

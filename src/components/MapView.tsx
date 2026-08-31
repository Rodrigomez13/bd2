import React, { useEffect, useRef, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { 
  Compass, 
  Plus, 
  Minus, 
  ShieldCheck, 
  Layers, 
  Navigation2, 
  Car, 
  Sparkles, 
  Eye, 
  Key, 
  Check, 
  RefreshCw, 
  LocateFixed
} from 'lucide-react';
import { LocationItem } from '../types';
import { triggerHaptic } from '../utils/haptics';
import { 
  getMapboxToken, 
  setCustomMapboxToken, 
  getDirections, 
  FORMOSA_CENTER, 
  MAPBOX_STYLES, 
  MapStyleKey, 
  reverseGeocode, 
  calculateBearing 
} from '../services/mapboxService';

interface MapViewProps {
  origin?: LocationItem | null;
  destination?: LocationItem | null;
  isNavigating?: boolean;
  progress?: number; // 0 to 100
  driverApproaching?: boolean;
  showCars?: boolean;
  onMapClick?: (location: { lat: number; lng: number; name: string; address: string }) => void;
  className?: string;
  interactive?: boolean;
  height?: string;
}

export const MapView: React.FC<MapViewProps> = ({
  origin,
  destination,
  isNavigating = false,
  progress = 0,
  driverApproaching = false,
  showCars = true,
  onMapClick,
  className = '',
  interactive = true,
  height = '100%',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  const originMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const destMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const driverMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const fleetMarkersRef = useRef<mapboxgl.Marker[]>([]);

  const [mapLoaded, setMapLoaded] = useState(false);
  const [useFallbackSvg, setUseFallbackSvg] = useState(false);
  const [currentStyle, setCurrentStyle] = useState<MapStyleKey>('dark');
  const [is3DMode, setIs3DMode] = useState(false);
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [tokenInput, setTokenInput] = useState('');
  const [tokenSaved, setTokenSaved] = useState(false);
  const [routeCoordinates, setRouteCoordinates] = useState<[number, number][]>([]);

  // Simulated fleet positions around Formosa Centro
  const initialFleetCoords: [number, number][] = [
    [-58.1720, -26.1825],
    [-58.1810, -26.1890],
    [-58.1690, -26.1770],
    [-58.1780, -26.1920],
  ];

  // Helper to create custom HTML Marker element
  const createMarkerElement = (type: 'origin' | 'destination' | 'driver' | 'fleet', label?: string) => {
    const el = document.createElement('div');
    el.className = 'bear-custom-marker cursor-pointer select-none';

    if (type === 'origin') {
      el.innerHTML = `
        <div class="relative flex flex-col items-center group">
          <div class="w-7 h-7 rounded-full bg-[#F5B51B] border-2 border-[#081226] shadow-[0_0_15px_rgba(245,181,27,0.8)] flex items-center justify-center animate-pulse">
            <div class="w-2.5 h-2.5 rounded-full bg-[#081226]"></div>
          </div>
          <div class="mt-1 px-2.5 py-1 rounded-full bg-[#15213A] border border-[#F5B51B] text-[10px] font-bold text-white shadow-xl whitespace-nowrap">
            ${label || 'Tu ubicación'}
          </div>
        </div>
      `;
    } else if (type === 'destination') {
      el.innerHTML = `
        <div class="relative flex flex-col items-center group">
          <div class="w-8 h-8 rounded-full bg-[#FF4B4B] border-2 border-white shadow-[0_0_15px_rgba(255,75,75,0.8)] flex items-center justify-center text-white font-black text-xs">
            ★
          </div>
          <div class="mt-1 px-2.5 py-1 rounded-full bg-[#15213A] border border-[#33405A] text-[10px] font-bold text-[#F5B51B] shadow-xl whitespace-nowrap">
            ${label || 'Destino'}
          </div>
        </div>
      `;
    } else if (type === 'driver') {
      el.innerHTML = `
        <div class="relative flex items-center justify-center" id="bear-live-driver-icon">
          <div class="w-10 h-10 rounded-full bg-[#15213A] border-2 border-[#F5B51B] shadow-[0_0_20px_rgba(245,181,27,0.9)] flex items-center justify-center text-[#F5B51B]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"></path>
              <circle cx="7" cy="17" r="2"></circle>
              <path d="M9 17h6"></path>
              <circle cx="17" cy="17" r="2"></circle>
            </svg>
          </div>
        </div>
      `;
    } else {
      // Fleet cars
      el.innerHTML = `
        <div class="w-6 h-6 rounded-full bg-[#15213A]/90 border border-[#F5B51B] shadow-md flex items-center justify-center opacity-85 hover:scale-125 transition-transform">
          <div class="w-2 h-2 rounded-full bg-[#F5B51B]"></div>
        </div>
      `;
    }

    return el;
  };

  // Initialize Mapbox Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const token = getMapboxToken();
    mapboxgl.accessToken = token;

    try {
      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: MAPBOX_STYLES[currentStyle],
        center: origin ? [origin.lng, origin.lat] : FORMOSA_CENTER,
        zoom: 13.8,
        pitch: is3DMode ? 55 : 0,
        bearing: 0,
        interactive: interactive,
        attributionControl: false,
      });

      map.on('load', () => {
        setMapLoaded(true);
        setUseFallbackSvg(false);

        // Add 3D building layers if in night mode
        if (map.getSource('composite')) {
          map.addLayer(
            {
              id: '3d-buildings',
              source: 'composite',
              'source-layer': 'building',
              filter: ['==', 'extrude', 'true'],
              type: 'fill-extrusion',
              minzoom: 14,
              paint: {
                'fill-extrusion-color': '#0D1930',
                'fill-extrusion-height': [
                  'interpolate',
                  ['linear'],
                  ['zoom'],
                  14,
                  0,
                  15.05,
                  ['get', 'height'],
                ],
                'fill-extrusion-base': [
                  'interpolate',
                  ['linear'],
                  ['zoom'],
                  14,
                  0,
                  15.05,
                  ['get', 'min_height'],
                ],
                'fill-extrusion-opacity': 0.7,
              },
            },
            'road-label'
          );
        }

        // Add route source & layer
        map.addSource('route', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: [],
            },
          },
        });

        // Route Glow Layer
        map.addLayer({
          id: 'route-glow',
          type: 'line',
          source: 'route',
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': '#F5B51B',
            'line-width': 10,
            'line-opacity': 0.35,
            'line-blur': 4,
          },
        });

        // Route Solid Golden Layer
        map.addLayer({
          id: 'route-line',
          type: 'line',
          source: 'route',
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': '#F5B51B',
            'line-width': 4.5,
            'line-opacity': 0.95,
          },
        });

        // Route Dash Overlay
        map.addLayer({
          id: 'route-dash',
          type: 'line',
          source: 'route',
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': '#FFFFFF',
            'line-width': 2,
            'line-dasharray': [1, 2],
            'line-opacity': 0.85,
          },
        });
      });

      // Handle map clicks for custom destinations
      if (onMapClick) {
        map.on('click', async (e) => {
          const { lng, lat } = e.lngLat;
          const geo = await reverseGeocode(lng, lat);
          onMapClick({
            lat,
            lng,
            name: geo.name,
            address: geo.address,
          });
        });
      }

      map.on('error', (e) => {
        // Only extract the message to prevent circular structure serialization errors from the map instance
        const msg = e?.error?.message || (typeof e === 'string' ? e : 'Mapbox resource loading notice');
        console.warn('Mapbox rendering notice:', msg);
      });

      mapRef.current = map;

      return () => {
        map.remove();
        mapRef.current = null;
      };
    } catch (err: any) {
      console.warn('Mapbox initialization fallback:', err?.message || String(err));
      setUseFallbackSvg(true);
    }
  }, [currentStyle]);

  // Load Route coordinates when origin or destination changes
  useEffect(() => {
    let isCancelled = false;

    async function loadRoute() {
      const origCoords: [number, number] = origin ? [origin.lng, origin.lat] : [-58.1731, -26.1848];
      const destCoords: [number, number] = destination ? [destination.lng, destination.lat] : [-58.1650, -26.1770];

      const res = await getDirections(origCoords, destCoords);
      if (!isCancelled) {
        setRouteCoordinates(res.coordinates);

        if (mapRef.current && mapLoaded) {
          const source = mapRef.current.getSource('route') as mapboxgl.GeoJSONSource;
          if (source) {
            source.setData({
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'LineString',
                coordinates: res.coordinates,
              },
            });
          }

          // Fit bounds smoothly to contain both origin and destination
          if (res.coordinates.length > 1) {
            const bounds = res.coordinates.reduce(
              (b, coord) => b.extend(coord),
              new mapboxgl.LngLatBounds(res.coordinates[0], res.coordinates[0])
            );
            mapRef.current.fitBounds(bounds, {
              padding: { top: 70, bottom: 90, left: 50, right: 50 },
              maxZoom: 15.5,
              duration: 1200,
            });
          }
        }
      }
    }

    if (origin || destination) {
      loadRoute();
    }

    return () => {
      isCancelled = true;
    };
  }, [origin, destination, mapLoaded]);

  // Update Markers
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;
    const map = mapRef.current;

    // 1. Origin Marker
    const origLngLat: [number, number] = origin ? [origin.lng, origin.lat] : [-58.1731, -26.1848];
    if (originMarkerRef.current) {
      originMarkerRef.current.setLngLat(origLngLat);
    } else {
      const el = createMarkerElement('origin', origin?.name || 'Tu ubicación');
      originMarkerRef.current = new mapboxgl.Marker({ element: el, anchor: 'center' })
        .setLngLat(origLngLat)
        .addTo(map);
    }

    // 2. Destination Marker
    if (destination) {
      const destLngLat: [number, number] = [destination.lng, destination.lat];
      if (destMarkerRef.current) {
        destMarkerRef.current.setLngLat(destLngLat);
      } else {
        const el = createMarkerElement('destination', destination.name);
        destMarkerRef.current = new mapboxgl.Marker({ element: el, anchor: 'center' })
          .setLngLat(destLngLat)
          .addTo(map);
      }
    } else if (destMarkerRef.current) {
      destMarkerRef.current.remove();
      destMarkerRef.current = null;
    }

    // 3. Nearby Fleet Markers
    if (showCars && fleetMarkersRef.current.length === 0) {
      initialFleetCoords.forEach((coords) => {
        const el = createMarkerElement('fleet');
        const marker = new mapboxgl.Marker({ element: el, anchor: 'center' })
          .setLngLat(coords)
          .addTo(map);
        fleetMarkersRef.current.push(marker);
      });
    } else if (!showCars) {
      fleetMarkersRef.current.forEach((m) => m.remove());
      fleetMarkersRef.current = [];
    }
  }, [origin, destination, mapLoaded, showCars]);

  // Live Driver / Vehicle tracking marker along route
  useEffect(() => {
    if (!mapRef.current || !mapLoaded || routeCoordinates.length === 0) return;
    const map = mapRef.current;

    if (isNavigating || driverApproaching) {
      const totalPoints = routeCoordinates.length;
      const index = Math.min(
        Math.floor((progress / 100) * (totalPoints - 1)),
        totalPoints - 1
      );
      const nextIndex = Math.min(index + 1, totalPoints - 1);

      const currentPoint = routeCoordinates[index];
      const nextPoint = routeCoordinates[nextIndex] || currentPoint;
      const bearing = calculateBearing(currentPoint, nextPoint);

      if (driverMarkerRef.current) {
        driverMarkerRef.current.setLngLat(currentPoint);
        const iconEl = document.getElementById('bear-live-driver-icon');
        if (iconEl) {
          iconEl.style.transform = `rotate(${bearing}deg)`;
        }
      } else {
        const el = createMarkerElement('driver');
        driverMarkerRef.current = new mapboxgl.Marker({ element: el, anchor: 'center' })
          .setLngLat(currentPoint)
          .addTo(map);
      }

      // Smooth camera follow during active navigation
      if (isNavigating && progress > 0 && progress < 100) {
        map.easeTo({
          center: currentPoint,
          zoom: 15.5,
          pitch: 50,
          bearing: bearing,
          duration: 800,
        });
      }
    } else if (driverMarkerRef.current) {
      driverMarkerRef.current.remove();
      driverMarkerRef.current = null;
    }
  }, [progress, isNavigating, driverApproaching, routeCoordinates, mapLoaded]);

  // Map Controls Actions
  const handleZoomIn = () => {
    triggerHaptic('light');
    mapRef.current?.zoomIn({ duration: 400 });
  };

  const handleZoomOut = () => {
    triggerHaptic('light');
    mapRef.current?.zoomOut({ duration: 400 });
  };

  const handleRecenter = () => {
    triggerHaptic('medium');

    // Attempt browser geolocation if user has real GPS permissions on mobile device
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { longitude, latitude } = pos.coords;
          mapRef.current?.flyTo({
            center: [longitude, latitude],
            zoom: 15,
            pitch: is3DMode ? 50 : 0,
            essential: true,
          });
        },
        () => {
          // Graceful fallback to specified trip origin or Formosa center
          if (origin) {
            mapRef.current?.flyTo({ center: [origin.lng, origin.lat], zoom: 14.5, pitch: is3DMode ? 50 : 0 });
          } else {
            mapRef.current?.flyTo({ center: FORMOSA_CENTER, zoom: 14, pitch: is3DMode ? 50 : 0 });
          }
        },
        { timeout: 3500, enableHighAccuracy: true }
      );
    } else if (origin) {
      mapRef.current?.flyTo({ center: [origin.lng, origin.lat], zoom: 14.5, pitch: is3DMode ? 50 : 0 });
    } else {
      mapRef.current?.flyTo({ center: FORMOSA_CENTER, zoom: 14, pitch: is3DMode ? 50 : 0 });
    }
  };

  const handleToggle3D = () => {
    triggerHaptic('light');
    const next = !is3DMode;
    setIs3DMode(next);
    mapRef.current?.easeTo({ pitch: next ? 55 : 0, duration: 800 });
  };

  const handleCycleStyle = () => {
    triggerHaptic('selection');
    const styles: MapStyleKey[] = ['dark', 'navigationNight', 'streets', 'satellite'];
    const nextIdx = (styles.indexOf(currentStyle) + 1) % styles.length;
    setCurrentStyle(styles[nextIdx]);
  };

  const handleSaveCustomToken = () => {
    setCustomMapboxToken(tokenInput);
    setTokenSaved(true);
    setTimeout(() => {
      setTokenSaved(false);
      setShowTokenModal(false);
      window.location.reload();
    }, 1000);
  };

  return (
    <div
      className={`relative w-full overflow-hidden select-none bg-[#081226] ${className}`}
      style={{ height }}
      id="bear-mapbox-container-wrapper"
    >
      {/* Real Mapbox GL Canvas Container */}
      <div
        ref={mapContainerRef}
        className="w-full h-full absolute inset-0 z-0"
        style={{ opacity: useFallbackSvg ? 0 : 1 }}
      />

      {/* High-fidelity SVG Fallback if Mapbox WebGL encounters unsupported environment */}
      {useFallbackSvg && (
        <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-[#081226]">
          <svg viewBox="0 0 400 600" className="w-full h-full object-cover">
            <rect width="400" height="600" fill="#081226" />
            <g stroke="#15213A" strokeWidth="2">
              <line x1="0" y1="200" x2="400" y2="200" />
              <line x1="0" y1="360" x2="400" y2="360" />
              <line x1="160" y1="0" x2="160" y2="600" />
              <line x1="280" y1="0" x2="280" y2="600" />
            </g>
            <path d="M 100 480 L 100 380 L 170 350 L 220 260 L 260 220 L 300 140" fill="none" stroke="#F5B51B" strokeWidth="4.5" />
            <circle cx="100" cy="480" r="7" fill="#F5B51B" />
            <circle cx="300" cy="140" r="7" fill="#FF4B4B" />
          </svg>
        </div>
      )}

      {/* Floating Mapbox Controls Bar */}
      {interactive && (
        <div className="absolute top-4 right-3.5 flex flex-col gap-2 z-20 pointer-events-auto">
          {/* Zoom In */}
          <button
            type="button"
            onClick={handleZoomIn}
            className="w-9 h-9 rounded-xl bg-[#15213A]/90 hover:bg-[#202D47] backdrop-blur-md border border-[#33405A] flex items-center justify-center text-white shadow-lg active:scale-95 transition-all"
            title="Acercar mapa"
            aria-label="Acercar mapa"
          >
            <Plus className="w-4 h-4 text-[#F5B51B]" />
          </button>

          {/* Zoom Out */}
          <button
            type="button"
            onClick={handleZoomOut}
            className="w-9 h-9 rounded-xl bg-[#15213A]/90 hover:bg-[#202D47] backdrop-blur-md border border-[#33405A] flex items-center justify-center text-white shadow-lg active:scale-95 transition-all"
            title="Alejar mapa"
            aria-label="Alejar mapa"
          >
            <Minus className="w-4 h-4 text-white" />
          </button>

          {/* 3D Tilt View */}
          <button
            type="button"
            onClick={handleToggle3D}
            className={`w-9 h-9 rounded-xl backdrop-blur-md border flex items-center justify-center text-xs font-black shadow-lg active:scale-95 transition-all ${
              is3DMode
                ? 'bg-[#F5B51B] text-[#081226] border-[#F5B51B] shadow-[0_0_12px_rgba(245,181,27,0.4)]'
                : 'bg-[#15213A]/90 hover:bg-[#202D47] text-[#AEB7C8] border-[#33405A]'
            }`}
            title="Alternar perspectiva 3D"
            aria-label="Alternar perspectiva 3D"
          >
            3D
          </button>

          {/* Recenter / GPS */}
          <button
            type="button"
            onClick={handleRecenter}
            className="w-9 h-9 rounded-xl bg-[#15213A]/90 hover:bg-[#202D47] backdrop-blur-md border border-[#33405A] flex items-center justify-center text-white shadow-lg active:scale-95 transition-all"
            title="Centrar en mi ubicación"
            aria-label="Centrar en mi ubicación"
          >
            <LocateFixed className="w-4 h-4 text-[#59C878]" />
          </button>

          {/* Layers / Styles Switcher */}
          <button
            type="button"
            onClick={handleCycleStyle}
            className="w-9 h-9 rounded-xl bg-[#15213A]/90 hover:bg-[#202D47] backdrop-blur-md border border-[#33405A] flex items-center justify-center text-white shadow-lg active:scale-95 transition-all"
            title={`Cambiar estilo (actual: ${currentStyle})`}
            aria-label="Cambiar estilo de mapa"
          >
            <Layers className="w-4 h-4 text-[#AEB7C8]" />
          </button>
        </div>
      )}

      {/* Top Left Security & Mapbox Badge */}
      <div className="absolute top-4 left-3.5 z-20 flex items-center gap-2 pointer-events-auto">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#15213A]/90 backdrop-blur-md border border-[#33405A] shadow-lg">
          <ShieldCheck className="w-3.5 h-3.5 text-[#59C878]" />
          <span className="text-[10px] font-bold text-white tracking-wide">
            Mapbox GPS • Formosa
          </span>
        </div>

        {/* Mapbox Token Config Trigger */}
        <button
          type="button"
          onClick={() => setShowTokenModal(true)}
          className="p-1.5 rounded-full bg-[#15213A]/80 hover:bg-[#202D47] border border-[#33405A] text-[#AEB7C8] hover:text-[#F5B51B] shadow-md transition-colors"
          title="Configurar Mapbox Token"
        >
          <Key className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Mapbox Token Modal */}
      {showTokenModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-sm bg-[#15213A] border border-[#33405A] rounded-3xl p-5 shadow-2xl flex flex-col gap-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#F5B51B]/20 border border-[#F5B51B] flex items-center justify-center text-[#F5B51B]">
                  <Key className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold">Mapbox Access Token</h3>
                  <p className="text-[11px] text-[#AEB7C8]">Personalizá tus mapas vectoriales</p>
                </div>
              </div>
            </div>

            <p className="text-xs text-[#AEB7C8] leading-relaxed">
              BearDrive incluye un token listo para usar. También podés ingresar tu propio token público de <span className="text-white font-mono">mapbox.com</span> para estilos personalizados y cuotas dedicadas.
            </p>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-[#AEB7C8]">Token público (pk.eyJ...)</label>
              <input
                type="text"
                placeholder="pk.eyJ1IjoieW91..."
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                className="w-full bg-[#081226] border border-[#33405A] focus:border-[#F5B51B] rounded-xl px-3 py-2 text-xs text-white focus:outline-none font-mono"
              />
            </div>

            <div className="flex items-center justify-end gap-2 mt-2">
              <button
                type="button"
                onClick={() => setShowTokenModal(false)}
                className="px-4 py-2 rounded-xl text-xs text-[#AEB7C8] hover:text-white font-medium"
              >
                Cerrar
              </button>
              <button
                type="button"
                onClick={handleSaveCustomToken}
                className="px-4 py-2 rounded-xl bg-[#F5B51B] text-[#081226] font-bold text-xs shadow-lg hover:bg-[#FFBE22] active:scale-95 transition-all flex items-center gap-1.5"
              >
                {tokenSaved ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>¡Guardado!</span>
                  </>
                ) : (
                  <span>Guardar Token</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

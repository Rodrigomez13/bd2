import React, { useEffect, useRef, useState } from 'react';
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
  LocateFixed,
  Maximize2,
  Minimize2,
  Move
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
  onUserManualPan?: () => void;
  className?: string;
  interactive?: boolean;
  height?: string;
  showControls?: boolean;
  showBadge?: boolean;
  controlsPosition?: 'right-center' | 'top-right' | 'bottom-right';
  allowFullscreenToggle?: boolean;
}

export const MapView: React.FC<MapViewProps> = ({
  origin,
  destination,
  isNavigating = false,
  progress = 0,
  driverApproaching = false,
  showCars = true,
  onMapClick,
  onUserManualPan,
  className = '',
  interactive = true,
  height = '100%',
  showControls = true,
  showBadge = false,
  controlsPosition = 'right-center',
  allowFullscreenToggle = true,
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
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [tokenInput, setTokenInput] = useState('');
  const [tokenSaved, setTokenSaved] = useState(false);
  const [routeCoordinates, setRouteCoordinates] = useState<[number, number][]>([]);
  const [currentZoomLevel, setCurrentZoomLevel] = useState<number>(14);
  const [mapBearing, setMapBearing] = useState<number>(0);
  const [isUserDragging, setIsUserDragging] = useState(false);

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
          <div class="w-6 h-6 rounded-full bg-[#59C878] border-2 border-[#081226] shadow-[0_0_12px_rgba(89,200,120,0.8)] flex items-center justify-center animate-pulse">
            <div class="w-2 h-2 rounded-full bg-[#081226]"></div>
          </div>
          <div class="mt-1 px-2 py-0.5 rounded-full bg-[#15213A] border border-[#59C878] text-[9px] font-bold text-white shadow-xl whitespace-nowrap">
            ${label || 'Tu ubicación'}
          </div>
        </div>
      `;
    } else if (type === 'destination') {
      el.innerHTML = `
        <div class="relative flex flex-col items-center group">
          <div class="w-7 h-7 rounded-full bg-[#FF4B4B] border-2 border-white shadow-[0_0_12px_rgba(255,75,75,0.8)] flex items-center justify-center text-white font-black text-[10px]">
            ★
          </div>
          <div class="mt-1 px-2 py-0.5 rounded-full bg-[#15213A] border border-[#FF4B4B] text-[9px] font-bold text-white shadow-xl whitespace-nowrap">
            ${label || 'Destino'}
          </div>
        </div>
      `;
    } else if (type === 'driver') {
      el.innerHTML = `
        <div class="relative flex items-center justify-center" id="bear-live-driver-icon">
          <div class="w-9 h-9 rounded-full bg-[#15213A] border-2 border-[#F5B51B] shadow-[0_0_16px_rgba(245,181,27,0.9)] flex items-center justify-center text-[#F5B51B]">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
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
        <div class="w-5 h-5 rounded-full bg-[#15213A]/90 border border-[#F5B51B] shadow-md flex items-center justify-center opacity-85 hover:scale-125 transition-transform">
          <div class="w-1.5 h-1.5 rounded-full bg-[#F5B51B]"></div>
        </div>
      `;
    }

    return el;
  };

  // Initialize Mapbox Map with complete interactivity & gestures
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const token = getMapboxToken();
    mapboxgl.accessToken = token;

    try {
      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: MAPBOX_STYLES[currentStyle],
        center: origin ? [origin.lng, origin.lat] : FORMOSA_CENTER,
        zoom: 14,
        pitch: is3DMode ? 55 : 0,
        bearing: 0,
        interactive: interactive,
        dragPan: true,
        scrollZoom: true,
        boxZoom: true,
        dragRotate: true,
        keyboard: true,
        doubleClickZoom: true,
        touchZoomRotate: true,
        touchPitch: true,
        attributionControl: false,
        cooperativeGestures: false,
      });

      map.on('load', () => {
        setMapLoaded(true);
        setUseFallbackSvg(false);

        // Add 3D building layers if supported
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
            'line-width': 9,
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

        // Force initial resize for pixel-perfect render
        map.resize();
      });

      // Track zoom & bearing for state
      map.on('zoom', () => {
        setCurrentZoomLevel(Math.round(map.getZoom() * 10) / 10);
      });

      map.on('rotate', () => {
        setMapBearing(Math.round(map.getBearing()));
      });

      // Detect manual user panning / dragging
      map.on('dragstart', () => {
        setIsUserDragging(true);
        onUserManualPan?.();
      });

      map.on('dragend', () => {
        setIsUserDragging(false);
      });

      map.on('wheel', () => {
        onUserManualPan?.();
      });

      map.on('touchstart', () => {
        onUserManualPan?.();
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

  // Robust ResizeObserver: dynamically resizes Mapbox canvas whenever container dimensions change
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const resizeObserver = new ResizeObserver(() => {
      if (mapRef.current) {
        requestAnimationFrame(() => {
          mapRef.current?.resize();
        });
      }
    });

    resizeObserver.observe(mapContainerRef.current);

    const handleWindowResize = () => {
      mapRef.current?.resize();
    };

    window.addEventListener('resize', handleWindowResize);
    window.addEventListener('orientationchange', handleWindowResize);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', handleWindowResize);
      window.removeEventListener('orientationchange', handleWindowResize);
    };
  }, []);

  // Update interactivity state if prop changes
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;
    if (interactive) {
      map.boxZoom.enable();
      map.scrollZoom.enable();
      map.dragPan.enable();
      map.dragRotate.enable();
      map.keyboard.enable();
      map.doubleClickZoom.enable();
      map.touchZoomRotate.enable();
      map.touchPitch.enable();
    } else {
      map.boxZoom.disable();
      map.scrollZoom.disable();
      map.dragPan.disable();
      map.dragRotate.disable();
      map.keyboard.disable();
      map.doubleClickZoom.disable();
      map.touchZoomRotate.disable();
      map.touchPitch.disable();
    }
  }, [interactive]);

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
              padding: { top: 50, bottom: 60, left: 35, right: 35 },
              maxZoom: 15.5,
              duration: 1000,
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

  // Update Origin & Destination Markers
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;
    const map = mapRef.current;

    // 1. Origin Marker
    const origLngLat: [number, number] = origin ? [origin.lng, origin.lat] : [-58.1731, -26.1848];
    if (originMarkerRef.current) {
      originMarkerRef.current.setLngLat(origLngLat);
    } else {
      const el = createMarkerElement('origin', origin?.name || 'Tu ubicación');
      originMarkerRef.current = new mapboxgl.Marker({ element: el, anchor: 'bottom' })
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
        destMarkerRef.current = new mapboxgl.Marker({ element: el, anchor: 'bottom' })
          .setLngLat(destLngLat)
          .addTo(map);
      }
    } else if (destMarkerRef.current) {
      destMarkerRef.current.remove();
      destMarkerRef.current = null;
    }
  }, [origin, destination, mapLoaded]);

  // Simulated Fleet Cars
  useEffect(() => {
    if (!mapRef.current || !mapLoaded || !showCars) return;

    const map = mapRef.current;
    if (fleetMarkersRef.current.length === 0) {
      initialFleetCoords.forEach((coords) => {
        const el = createMarkerElement('fleet');
        const marker = new mapboxgl.Marker({ element: el, anchor: 'center' })
          .setLngLat(coords)
          .addTo(map);
        fleetMarkersRef.current.push(marker);
      });
    }

    // Subtle drift simulation
    const interval = setInterval(() => {
      fleetMarkersRef.current.forEach((marker) => {
        const current = marker.getLngLat();
        const deltaLng = (Math.random() - 0.5) * 0.0003;
        const deltaLat = (Math.random() - 0.5) * 0.0003;
        marker.setLngLat([current.lng + deltaLng, current.lat + deltaLat]);
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [mapLoaded, showCars]);

  // Driver Car Marker & Live Navigation Follow
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;
    const map = mapRef.current;

    if (routeCoordinates.length > 1 && (isNavigating || driverApproaching)) {
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

      // Smooth camera follow during active navigation ONLY if user is not actively dragging
      if (isNavigating && progress > 0 && progress < 100 && !isUserDragging) {
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
  }, [progress, isNavigating, driverApproaching, routeCoordinates, mapLoaded, isUserDragging]);

  // Map Controls Actions
  const handleZoomIn = () => {
    triggerHaptic('light');
    mapRef.current?.zoomIn({ duration: 350 });
  };

  const handleZoomOut = () => {
    triggerHaptic('light');
    mapRef.current?.zoomOut({ duration: 350 });
  };

  const handleResetBearing = () => {
    triggerHaptic('light');
    mapRef.current?.rotateTo(0, { duration: 400 });
  };

  const handleRecenter = () => {
    triggerHaptic('medium');

    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { longitude, latitude } = pos.coords;
          mapRef.current?.flyTo({
            center: [longitude, latitude],
            zoom: 15.2,
            pitch: is3DMode ? 50 : 0,
            essential: true,
            duration: 900,
          });
        },
        () => {
          if (origin) {
            mapRef.current?.flyTo({ center: [origin.lng, origin.lat], zoom: 15, pitch: is3DMode ? 50 : 0, duration: 900 });
          } else {
            mapRef.current?.flyTo({ center: FORMOSA_CENTER, zoom: 14.2, pitch: is3DMode ? 50 : 0, duration: 900 });
          }
        },
        { timeout: 3500, enableHighAccuracy: true }
      );
    } else if (origin) {
      mapRef.current?.flyTo({ center: [origin.lng, origin.lat], zoom: 15, pitch: is3DMode ? 50 : 0, duration: 900 });
    } else {
      mapRef.current?.flyTo({ center: FORMOSA_CENTER, zoom: 14.2, pitch: is3DMode ? 50 : 0, duration: 900 });
    }
  };

  const handleToggle3D = () => {
    triggerHaptic('light');
    const next = !is3DMode;
    setIs3DMode(next);
    mapRef.current?.easeTo({ pitch: next ? 55 : 0, duration: 700 });
  };

  const handleCycleStyle = () => {
    triggerHaptic('selection');
    const styles: MapStyleKey[] = ['dark', 'navigationNight', 'streets', 'satellite'];
    const nextIdx = (styles.indexOf(currentStyle) + 1) % styles.length;
    setCurrentStyle(styles[nextIdx]);
  };

  const handleToggleFullscreen = () => {
    triggerHaptic('medium');
    setIsFullscreen((prev) => !prev);
    setTimeout(() => {
      mapRef.current?.resize();
    }, 150);
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

  // Determine controls positioning CSS class
  const getControlsPositionClass = () => {
    if (isFullscreen) return 'top-5 right-3.5';
    if (controlsPosition === 'top-right') return 'top-3 right-2.5';
    if (controlsPosition === 'bottom-right') return 'bottom-4 right-2.5';
    // Default right-center: cleanly avoids both top header banners and bottom pills/sheets
    return 'top-1/2 -translate-y-1/2 right-2.5';
  };

  return (
    <div
      className={`relative w-full select-none bg-[#081226] transition-all duration-300 ${
        isFullscreen
          ? 'fixed inset-0 z-50 h-screen w-screen overflow-hidden'
          : `overflow-hidden ${className}`
      }`}
      style={{ height: isFullscreen ? '100vh' : height }}
      id="bear-mapbox-container-wrapper"
    >
      {/* Real Mapbox GL Canvas Container */}
      <div
        ref={mapContainerRef}
        className="w-full h-full absolute inset-0 z-0 touch-none cursor-grab active:cursor-grabbing"
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

      {/* Floating Mapbox Controls Dock (Compact, non-overlapping) */}
      {interactive && showControls && (
        <div className={`absolute ${getControlsPositionClass()} flex flex-col gap-1.5 z-20 pointer-events-auto shadow-2xl`}>
          {/* Zoom In */}
          <button
            type="button"
            onClick={handleZoomIn}
            className="w-8 h-8 rounded-xl bg-[#15213A]/95 hover:bg-[#202D47] backdrop-blur-md border border-[#33405A] flex items-center justify-center text-white shadow-lg active:scale-95 transition-all cursor-pointer"
            title="Acercar (+)"
            aria-label="Acercar mapa"
          >
            <Plus className="w-3.5 h-3.5 text-[#F5B51B]" />
          </button>

          {/* Zoom Out */}
          <button
            type="button"
            onClick={handleZoomOut}
            className="w-8 h-8 rounded-xl bg-[#15213A]/95 hover:bg-[#202D47] backdrop-blur-md border border-[#33405A] flex items-center justify-center text-white shadow-lg active:scale-95 transition-all cursor-pointer"
            title="Alejar (-)"
            aria-label="Alejar mapa"
          >
            <Minus className="w-3.5 h-3.5 text-white" />
          </button>

          {/* Compass / Reset North */}
          {mapBearing !== 0 && (
            <button
              type="button"
              onClick={handleResetBearing}
              className="w-8 h-8 rounded-xl bg-[#15213A]/95 hover:bg-[#202D47] backdrop-blur-md border border-[#F5B51B] flex items-center justify-center text-[#F5B51B] shadow-lg active:scale-95 transition-all cursor-pointer animate-in fade-in"
              title="Restablecer Norte"
              aria-label="Orientar al norte"
            >
              <Compass
                className="w-3.5 h-3.5 transition-transform duration-300"
                style={{ transform: `rotate(${-mapBearing}deg)` }}
              />
            </button>
          )}

          {/* 3D Tilt View */}
          <button
            type="button"
            onClick={handleToggle3D}
            className={`w-8 h-8 rounded-xl backdrop-blur-md border flex items-center justify-center text-[10px] font-black shadow-lg active:scale-95 transition-all cursor-pointer ${
              is3DMode
                ? 'bg-[#F5B51B] text-[#081226] border-[#F5B51B] shadow-[0_0_10px_rgba(245,181,27,0.4)]'
                : 'bg-[#15213A]/95 hover:bg-[#202D47] text-[#AEB7C8] border-[#33405A]'
            }`}
            title="Vista 3D"
            aria-label="Alternar perspectiva 3D"
          >
            3D
          </button>

          {/* Recenter / GPS */}
          <button
            type="button"
            onClick={handleRecenter}
            className="w-8 h-8 rounded-xl bg-[#15213A]/95 hover:bg-[#202D47] backdrop-blur-md border border-[#33405A] flex items-center justify-center text-white shadow-lg active:scale-95 transition-all cursor-pointer"
            title="Centrar GPS"
            aria-label="Centrar en mi ubicación"
          >
            <LocateFixed className="w-3.5 h-3.5 text-[#59C878]" />
          </button>

          {/* Layers / Styles Switcher */}
          <button
            type="button"
            onClick={handleCycleStyle}
            className="w-8 h-8 rounded-xl bg-[#15213A]/95 hover:bg-[#202D47] backdrop-blur-md border border-[#33405A] flex items-center justify-center text-white shadow-lg active:scale-95 transition-all cursor-pointer"
            title={`Estilo: ${currentStyle}`}
            aria-label="Cambiar estilo"
          >
            <Layers className="w-3.5 h-3.5 text-[#AEB7C8]" />
          </button>

          {/* Expand / Collapse Fullscreen Map Mode */}
          {allowFullscreenToggle && (
            <button
              type="button"
              onClick={handleToggleFullscreen}
              className={`w-8 h-8 rounded-xl backdrop-blur-md border flex items-center justify-center shadow-lg active:scale-95 transition-all cursor-pointer ${
                isFullscreen
                  ? 'bg-[#F5B51B] text-[#081226] border-[#F5B51B]'
                  : 'bg-[#15213A]/95 hover:bg-[#202D47] text-[#AEB7C8] border-[#33405A]'
              }`}
              title={isFullscreen ? 'Reducir mapa' : 'Pantalla completa'}
              aria-label="Pantalla completa"
            >
              {isFullscreen ? (
                <Minimize2 className="w-3.5 h-3.5" />
              ) : (
                <Maximize2 className="w-3.5 h-3.5" />
              )}
            </button>
          )}
        </div>
      )}

      {/* Top Left Security & Mapbox Badge (Only when requested or in fullscreen) */}
      {(showBadge || isFullscreen) && (
        <div className="absolute top-4 left-3 z-20 flex items-center gap-1.5 pointer-events-auto">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#15213A]/90 backdrop-blur-md border border-[#33405A] shadow-lg">
            <ShieldCheck className="w-3 h-3 text-[#59C878]" />
            <span className="text-[9px] font-bold text-white tracking-wide">
              Mapbox • Formosa
            </span>
          </div>

          <button
            type="button"
            onClick={() => setShowTokenModal(true)}
            className="p-1 rounded-full bg-[#15213A]/80 hover:bg-[#202D47] border border-[#33405A] text-[#AEB7C8] hover:text-[#F5B51B] shadow-md transition-colors cursor-pointer"
            title="Configurar Mapbox Token"
          >
            <Key className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Fullscreen Close Floating Button when in fullscreen mode */}
      {isFullscreen && (
        <div className="absolute bottom-6 inset-x-6 z-40 flex justify-center pointer-events-auto">
          <button
            type="button"
            onClick={handleToggleFullscreen}
            className="px-5 py-3 rounded-2xl bg-[#F5B51B] hover:bg-[#FFBE22] active:scale-95 text-[#081226] font-bold text-xs shadow-[0_0_20px_rgba(245,181,27,0.5)] border border-white/40 flex items-center gap-2 cursor-pointer transition-all"
          >
            <Minimize2 className="w-4 h-4 stroke-[2.5]" />
            <span>Volver a la vista normal</span>
          </button>
        </div>
      )}

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
                className="px-4 py-2 rounded-xl text-xs text-[#AEB7C8] hover:text-white font-medium cursor-pointer"
              >
                Cerrar
              </button>
              <button
                type="button"
                onClick={handleSaveCustomToken}
                className="px-4 py-2 rounded-xl bg-[#F5B51B] text-[#081226] font-bold text-xs shadow-lg hover:bg-[#FFBE22] active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
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

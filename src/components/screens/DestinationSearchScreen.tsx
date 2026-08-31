import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  History, 
  MapPin, 
  Map, 
  ArrowLeft, 
  X, 
  Sparkles, 
  Navigation, 
  Check, 
  Loader2, 
  Home, 
  Briefcase, 
  Dumbbell, 
  ShoppingBag, 
  Sun, 
  HeartPulse, 
  Plane, 
  GraduationCap, 
  Bookmark, 
  TrendingUp, 
  Clock, 
  ChevronRight,
  Compass,
  ArrowUpDown,
  LocateFixed,
  Route,
  ArrowRight,
  Edit3
} from 'lucide-react';
import { LocationItem } from '../../types';
import { MOCK_LOCATIONS } from '../../data/mockData';
import { searchPlaces, GeocodedPlace, FORMOSA_CENTER, reverseGeocode, getDirections } from '../../services/mapboxService';
import { getCurrentGPSPosition } from '../../services/geolocationService';
import { MapView } from '../MapView';
import { triggerHaptic } from '../../utils/haptics';

interface DestinationSearchScreenProps {
  initialOrigin?: LocationItem;
  initialDestination?: LocationItem | null;
  onConfirmTripPlan: (origin: LocationItem, destination: LocationItem) => void;
  onBack: () => void;
}

type FilterCategory = 'all' | 'frequent' | 'saved' | 'recent' | 'poi';
type ActiveInputType = 'origin' | 'destination';

const LOCAL_STORAGE_KEY = 'beardrive_custom_recent_destinations';

export const DestinationSearchScreen: React.FC<DestinationSearchScreenProps> = ({
  initialOrigin,
  initialDestination,
  onConfirmTripPlan,
  onBack,
}) => {
  // Origin and Destination state
  const [origin, setOrigin] = useState<LocationItem>(
    initialOrigin || {
      id: 'loc-current-gps',
      name: 'Mi ubicación actual',
      address: 'Formosa, Argentina (GPS)',
      city: 'Formosa',
      lat: -26.1848,
      lng: -58.1731,
      type: 'recent',
    }
  );

  const [destination, setDestination] = useState<LocationItem | null>(initialDestination || null);

  // Active focus: which input the user is currently editing
  const [activeInput, setActiveInput] = useState<ActiveInputType>(
    initialDestination ? 'destination' : (initialOrigin ? 'destination' : 'origin')
  );

  // Search input strings
  const [originQuery, setOriginQuery] = useState(initialOrigin?.name || 'Mi ubicación actual');
  const [destQuery, setDestQuery] = useState(initialDestination?.name || '');

  // Category filter
  const [activeCategory, setActiveCategory] = useState<FilterCategory>('all');

  // Map Picker Mode state
  const [isMapPickerMode, setIsMapPickerMode] = useState(false);
  const [mapPickerTarget, setMapPickerTarget] = useState<ActiveInputType>('destination');
  const [pickedLocation, setPickedLocation] = useState<LocationItem>({
    id: 'picked-1',
    name: 'Costanera Vuelta Fermosa',
    address: 'Av. Costanera & San Martín, Formosa',
    city: 'Formosa',
    lat: -26.1770,
    lng: -58.1650,
    type: 'saved',
  });

  // GPS loading state
  const [isLocatingGPS, setIsLocatingGPS] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  // Mapbox Geocoding autocompletion
  const [mapboxResults, setMapboxResults] = useState<GeocodedPlace[]>([]);
  const [isSearchingMapbox, setIsSearchingMapbox] = useState(false);

  // Route preview info
  const [routeInfo, setRouteInfo] = useState<{ distanceKm: number; durationMinutes: number; summary: string } | null>(null);
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);

  // Load dynamically stored recent destinations from localStorage
  const [storedRecents, setStoredRecents] = useState<LocationItem[]>(() => {
    try {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (saved) {
          return JSON.parse(saved);
        }
      }
    } catch {
      // Fallback
    }
    return [];
  });

  // Fetch device GPS on mount if initialOrigin is default/placeholder
  useEffect(() => {
    if (!initialOrigin) {
      getCurrentGPSPosition()
        .then(({ locationItem }) => {
          setOrigin(locationItem);
          setOriginQuery(locationItem.name);
        })
        .catch(() => {
          // Keep default fallback
        });
    }
  }, [initialOrigin]);

  // Current query based on active input
  const currentQuery = activeInput === 'origin' ? originQuery : destQuery;

  // Debounced search with Mapbox Geocoding
  useEffect(() => {
    const trimmed = currentQuery.trim();
    if (!trimmed || trimmed.length < 2 || trimmed === 'Mi ubicación actual') {
      setMapboxResults([]);
      setIsSearchingMapbox(false);
      return;
    }

    setIsSearchingMapbox(true);
    const timer = setTimeout(async () => {
      const results = await searchPlaces(trimmed);
      setMapboxResults(results);
      setIsSearchingMapbox(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [currentQuery]);

  // Calculate route preview whenever both origin and destination are set
  useEffect(() => {
    let isCancelled = false;
    if (origin && destination) {
      setIsLoadingRoute(true);
      getDirections([origin.lng, origin.lat], [destination.lng, destination.lat])
        .then((res) => {
          if (!isCancelled) {
            setRouteInfo({
              distanceKm: res.distanceKm,
              durationMinutes: res.durationMinutes,
              summary: res.summary,
            });
            setIsLoadingRoute(false);
          }
        })
        .catch(() => {
          if (!isCancelled) {
            setIsLoadingRoute(false);
          }
        });
    } else {
      setRouteInfo(null);
    }

    return () => {
      isCancelled = true;
    };
  }, [origin, destination]);

  // Combined master locations list (Mock Locations + stored recents)
  const masterLocations = useMemo(() => {
    const combined = [...MOCK_LOCATIONS];
    storedRecents.forEach((sr) => {
      if (!combined.some((l) => l.id === sr.id || (l.lat === sr.lat && l.lng === sr.lng))) {
        combined.unshift(sr);
      }
    });
    return combined;
  }, [storedRecents]);

  // Filtered locations
  const filteredLocations = useMemo(() => {
    const query = currentQuery.trim().toLowerCase();
    const isDefaultOriginText = query === 'mi ubicación actual' || query === 'tu ubicación';
    
    return masterLocations.filter((loc) => {
      const matchesQuery =
        !query ||
        isDefaultOriginText ||
        loc.name.toLowerCase().includes(query) ||
        loc.address.toLowerCase().includes(query) ||
        loc.city.toLowerCase().includes(query) ||
        (loc.category && loc.category.toLowerCase().includes(query));

      if (!matchesQuery) return false;

      if (activeCategory === 'all') return true;
      if (activeCategory === 'frequent') return (loc.frequencyCount && loc.frequencyCount >= 10) || loc.type === 'frequent';
      if (activeCategory === 'saved') return loc.type === 'saved';
      if (activeCategory === 'recent') return loc.type === 'recent' || loc.lastVisited !== undefined;
      if (activeCategory === 'poi') return loc.type === 'poi';

      return true;
    });
  }, [masterLocations, currentQuery, activeCategory]);

  // Specific high-priority quick shortcuts
  const casaLocation = useMemo(
    () => masterLocations.find((l) => l.id === 'loc-casa') || masterLocations[0],
    [masterLocations]
  );
  const trabajoLocation = useMemo(
    () => masterLocations.find((l) => l.id === 'loc-trabajo') || masterLocations[1],
    [masterLocations]
  );

  // Handler for selecting a place from list
  const handleSelectLocation = (loc: LocationItem) => {
    triggerHaptic('selection');

    // Save to localStorage recent history
    try {
      const updated = [
        {
          ...loc,
          lastVisited: 'Recién seleccionado',
          frequencyCount: (loc.frequencyCount || 0) + 1,
        },
        ...storedRecents.filter((item) => item.id !== loc.id),
      ].slice(0, 10);
      setStoredRecents(updated);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Ignore
    }

    if (activeInput === 'origin') {
      setOrigin(loc);
      setOriginQuery(loc.name);
      if (!destination) {
        setActiveInput('destination');
      }
    } else {
      setDestination(loc);
      setDestQuery(loc.name);
    }
  };

  const handleSelectMapboxResult = (place: GeocodedPlace) => {
    triggerHaptic('selection');
    const loc: LocationItem = {
      id: place.id,
      name: place.name,
      address: place.address,
      city: place.city,
      lat: place.lat,
      lng: place.lng,
      type: 'recent',
      lastVisited: 'Hoy (Mapbox)',
      frequencyCount: 1,
      category: 'Geolocalizado',
    };
    handleSelectLocation(loc);
  };

  // Swap Origin and Destination
  const handleSwapAddresses = () => {
    triggerHaptic('medium');
    if (origin && destination) {
      const tempOrig = origin;
      const tempOrigQuery = originQuery;
      setOrigin(destination);
      setOriginQuery(destQuery);
      setDestination(tempOrig);
      setDestQuery(tempOrigQuery);
    }
  };

  // Live GPS locator handler
  const handleUseLiveGPS = async () => {
    triggerHaptic('medium');
    setIsLocatingGPS(true);
    setGpsError(null);
    try {
      const { locationItem } = await getCurrentGPSPosition();
      if (activeInput === 'origin') {
        setOrigin(locationItem);
        setOriginQuery(locationItem.name);
        if (!destination) setActiveInput('destination');
      } else {
        setDestination(locationItem);
        setDestQuery(locationItem.name);
      }
    } catch (err: any) {
      setGpsError(err.message || 'No se pudo obtener la posición GPS.');
      setTimeout(() => setGpsError(null), 4000);
    } finally {
      setIsLocatingGPS(false);
    }
  };

  // Map click handler for Map Picker mode
  const handleMapClick = (point: { lat: number; lng: number; name: string; address: string }) => {
    triggerHaptic('light');
    setPickedLocation({
      id: `picked-${Date.now()}`,
      name: point.name || 'Punto seleccionado en mapa',
      address: point.address || `GPS: ${point.lat.toFixed(4)}, ${point.lng.toFixed(4)}`,
      city: 'Formosa',
      lat: point.lat,
      lng: point.lng,
      type: 'saved',
      category: 'Mapa personalizado',
    });
  };

  const handleConfirmPickedLocation = () => {
    triggerHaptic('heavy');
    handleSelectLocation(pickedLocation);
    setIsMapPickerMode(false);
  };

  // Confirm Route and Proceed to Ride Options & Pricing
  const handleConfirmTripPlan = () => {
    if (!origin || !destination) return;
    triggerHaptic('heavy');
    onConfirmTripPlan(origin, destination);
  };

  const renderLocationIcon = (loc: LocationItem) => {
    if (loc.id === 'loc-casa' || loc.icon === 'home') {
      return <Home className="w-4 h-4 text-[#F5B51B]" />;
    }
    if (loc.id === 'loc-trabajo' || loc.icon === 'briefcase') {
      return <Briefcase className="w-4 h-4 text-[#59C878]" />;
    }
    if (loc.icon === 'dumbbell') {
      return <Dumbbell className="w-4 h-4 text-[#FFD66A]" />;
    }
    if (loc.icon === 'shopping-bag') {
      return <ShoppingBag className="w-4 h-4 text-[#EC4899]" />;
    }
    if (loc.icon === 'sun') {
      return <Sun className="w-4 h-4 text-[#F5B51B]" />;
    }
    if (loc.icon === 'heart-pulse') {
      return <HeartPulse className="w-4 h-4 text-red-400" />;
    }
    if (loc.icon === 'plane') {
      return <Plane className="w-4 h-4 text-sky-400" />;
    }
    if (loc.icon === 'graduation-cap') {
      return <GraduationCap className="w-4 h-4 text-indigo-400" />;
    }
    if (loc.type === 'saved') {
      return <Bookmark className="w-4 h-4 text-[#F5B51B]" />;
    }
    if (loc.type === 'frequent') {
      return <TrendingUp className="w-4 h-4 text-[#59C878]" />;
    }
    if (loc.type === 'recent') {
      return <History className="w-4 h-4 text-[#AEB7C8]" />;
    }
    return <MapPin className="w-4 h-4 text-[#F5B51B]" />;
  };

  return (
    <div className="flex-1 flex flex-col bg-[#081226] text-white p-3 sm:p-4 relative overflow-y-auto pb-24">
      {/* Map Picker Mode Fullscreen Overlay */}
      {isMapPickerMode ? (
        <div className="fixed inset-0 z-50 flex flex-col bg-[#081226]">
          {/* Top Bar on Map Picker */}
          <div className="absolute top-3 inset-x-3 z-30 flex items-center justify-between pointer-events-auto">
            <button
              type="button"
              onClick={() => {
                triggerHaptic('light');
                setIsMapPickerMode(false);
              }}
              className="px-3 py-1.5 rounded-xl bg-[#15213A]/95 backdrop-blur-md border border-[#33405A] text-white text-xs font-bold shadow-xl flex items-center gap-1.5 hover:bg-[#202D47] cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#F5B51B]" />
              <span>Volver</span>
            </button>

            <div className="px-2.5 py-1 rounded-full bg-[#15213A]/95 backdrop-blur-md border border-[#33405A] text-[10px] font-semibold text-[#59C878] shadow-xl flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#59C878] animate-ping" />
              <span>
                {mapPickerTarget === 'origin' ? 'Fijar Origen' : 'Fijar Destino'}
              </span>
            </div>
          </div>

          {/* Interactive Mapbox Map */}
          <div className="flex-1 w-full relative">
            <MapView
              origin={mapPickerTarget === 'origin' ? pickedLocation : origin}
              destination={mapPickerTarget === 'destination' ? pickedLocation : (destination || undefined)}
              onMapClick={handleMapClick}
              interactive={true}
              showBadge={false}
              controlsPosition="right-center"
              className="h-full"
            />
          </div>

          {/* Bottom Confirmation Card */}
          <div className="p-3.5 bg-[#15213A] border-t border-[#33405A] rounded-t-3xl shadow-2xl flex flex-col gap-2.5 relative z-30">
            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#0D1930] border border-[#F5B51B] flex items-center justify-center text-[#F5B51B] shrink-0 mt-0.5 shadow-md">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white truncate">{pickedLocation.name}</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#0D1930] text-[#59C878] border border-[#59C878]/30 font-bold">
                    GPS
                  </span>
                </div>
                <span className="text-[11px] text-[#AEB7C8] truncate">{pickedLocation.address}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleConfirmPickedLocation}
              className="w-full bg-[#F5B51B] hover:bg-[#FFBE22] active:scale-[0.98] text-[#081226] font-black py-3 px-4 rounded-xl shadow-[0_4px_16px_rgba(245,181,27,0.35)] transition-all flex items-center justify-center gap-2 cursor-pointer text-xs"
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>
                {mapPickerTarget === 'origin' ? 'Confirmar este inicio de viaje' : 'Confirmar este destino'}
              </span>
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Top Bar Header with Navigation */}
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  triggerHaptic('light');
                  onBack();
                }}
                className="w-8 h-8 rounded-xl bg-[#15213A] border border-[#33405A] hover:border-[#F5B51B] flex items-center justify-center text-white active:scale-95 transition-all cursor-pointer"
                title="Volver"
              >
                <ArrowLeft className="w-4 h-4 text-[#F5B51B]" />
              </button>
              <div>
                <h2 className="text-base font-bold tracking-tight text-white leading-tight">Planificar Trayecto</h2>
                <p className="text-[10px] text-[#AEB7C8]">Indica origen y destino en Formosa</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                triggerHaptic('light');
                setMapPickerTarget(activeInput);
                setIsMapPickerMode(true);
              }}
              className="px-2.5 py-1.5 rounded-xl bg-[#15213A] border border-[#33405A] hover:border-[#F5B51B] text-[10px] font-bold text-[#F5B51B] flex items-center gap-1 cursor-pointer active:scale-95 transition-all"
              title="Abrir mapa interactivo"
            >
              <Map className="w-3 h-3" />
              <span>Mapa</span>
            </button>
          </div>

          {/* DUAL INPUT BOX: ORIGIN & DESTINATION */}
          <div className="bg-[#15213A] border border-[#33405A] rounded-2xl p-2.5 shadow-xl mb-2.5 flex flex-col gap-1.5 relative">
            {/* Visual Route Connector Line */}
            <div className="absolute left-[23px] top-[30px] bottom-[30px] w-0.5 bg-gradient-to-b from-[#59C878] via-[#F5B51B] to-[#FF4B4B] z-0" />

            {/* 1. Origin Input Field */}
            <div className="relative flex items-center gap-2 z-10">
              <div className="w-5 h-5 rounded-full bg-[#0D1930] border-2 border-[#59C878] flex items-center justify-center shrink-0 shadow-md">
                <div className="w-1.5 h-1.5 rounded-full bg-[#59C878] animate-pulse" />
              </div>
              <div 
                onClick={() => setActiveInput('origin')}
                className={`flex-1 flex items-center bg-[#081226] rounded-xl px-2.5 py-1.5 border transition-all ${
                  activeInput === 'origin'
                    ? 'border-[#59C878] ring-1 ring-[#59C878]/30 shadow-[0_0_10px_rgba(89,200,120,0.15)]'
                    : 'border-[#33405A]'
                }`}
              >
                <div className="flex-1 flex flex-col min-w-0">
                  <span className="text-[8px] uppercase font-bold text-[#59C878] tracking-wider leading-none">
                    Punto de Partida (Inicio)
                  </span>
                  <input
                    type="text"
                    value={originQuery}
                    onFocus={() => setActiveInput('origin')}
                    onChange={(e) => {
                      setOriginQuery(e.target.value);
                      if (activeInput !== 'origin') setActiveInput('origin');
                    }}
                    placeholder="Escribí tu calle de partida..."
                    className="w-full bg-transparent text-xs text-white font-medium placeholder-gray-500 focus:outline-none mt-0.5"
                  />
                </div>
                {originQuery && activeInput === 'origin' && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      triggerHaptic('light');
                      setOriginQuery('');
                    }}
                    className="p-1 text-gray-400 hover:text-white cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>

            {/* Swap Button */}
            <div className="flex items-center justify-end pr-1 -my-1 z-10">
              <button
                type="button"
                onClick={handleSwapAddresses}
                className="w-6 h-6 rounded-full bg-[#0D1930] hover:bg-[#202D47] border border-[#33405A] text-[#AEB7C8] hover:text-[#F5B51B] flex items-center justify-center transition-all cursor-pointer shadow-md active:scale-90"
                title="Invertir origen y destino"
              >
                <ArrowUpDown className="w-3 h-3" />
              </button>
            </div>

            {/* 2. Destination Input Field */}
            <div className="relative flex items-center gap-2 z-10">
              <div className="w-5 h-5 rounded-full bg-[#0D1930] border-2 border-[#FF4B4B] flex items-center justify-center shrink-0 shadow-md">
                <div className="w-1.5 h-1.5 rounded-full bg-[#FF4B4B]" />
              </div>
              <div 
                onClick={() => setActiveInput('destination')}
                className={`flex-1 flex items-center bg-[#081226] rounded-xl px-2.5 py-1.5 border transition-all ${
                  activeInput === 'destination'
                    ? 'border-[#F5B51B] ring-1 ring-[#F5B51B]/30 shadow-[0_0_12px_rgba(245,181,27,0.15)]'
                    : 'border-[#33405A]'
                }`}
              >
                <div className="flex-1 flex flex-col min-w-0">
                  <span className="text-[8px] uppercase font-bold text-[#F5B51B] tracking-wider leading-none">
                    Punto de Llegada (Destino)
                  </span>
                  <input
                    type="text"
                    value={destQuery}
                    onFocus={() => setActiveInput('destination')}
                    onChange={(e) => {
                      setDestQuery(e.target.value);
                      if (activeInput !== 'destination') setActiveInput('destination');
                    }}
                    placeholder="¿A dónde vas? (ej. Costanera, San Martín)..."
                    className="w-full bg-transparent text-xs text-white font-medium placeholder-gray-500 focus:outline-none mt-0.5"
                    autoFocus={!initialDestination}
                  />
                </div>
                {destQuery && activeInput === 'destination' && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      triggerHaptic('light');
                      setDestQuery('');
                    }}
                    className="p-1 text-gray-400 hover:text-white cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Quick GPS Location Shortcut Bar */}
          <div className="mb-2">
            <button
              type="button"
              onClick={handleUseLiveGPS}
              disabled={isLocatingGPS}
              className="w-full py-1.5 px-2.5 rounded-xl bg-[#0D1930] hover:bg-[#15213A] border border-[#59C878]/50 hover:border-[#59C878] text-[#59C878] flex items-center justify-between text-xs font-bold transition-all shadow-sm active:scale-[0.99] cursor-pointer"
            >
              <div className="flex items-center gap-1.5 truncate">
                {isLocatingGPS ? (
                  <Loader2 className="w-3.5 h-3.5 text-[#59C878] animate-spin shrink-0" />
                ) : (
                  <LocateFixed className="w-3.5 h-3.5 text-[#59C878] shrink-0" />
                )}
                <span className="truncate">
                  {isLocatingGPS
                    ? 'Detectando satelital...'
                    : activeInput === 'origin'
                    ? 'Usar GPS actual como Origen'
                    : 'Usar GPS actual como Destino'}
                </span>
              </div>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#15213A] text-[#AEB7C8] border border-[#33405A] shrink-0 ml-1">
                GPS Real
              </span>
            </button>
            {gpsError && (
              <p className="text-[10px] text-red-400 mt-1 px-1">{gpsError}</p>
            )}
          </div>

          {/* Address Confirmation Banner (when both Origin & Destination are defined) */}
          {origin && destination && (
            <div className="mb-2.5 p-3 rounded-2xl bg-gradient-to-r from-[#15213A] to-[#0D1930] border-2 border-[#F5B51B] shadow-[0_0_20px_rgba(245,181,27,0.2)] animate-in fade-in">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1 text-xs font-extrabold text-[#F5B51B]">
                  <Route className="w-3.5 h-3.5" />
                  <span>Trayecto Seleccionado</span>
                </div>
                {routeInfo && (
                  <span className="text-[11px] font-mono font-bold text-white bg-[#081226] px-2 py-0.5 rounded-lg border border-[#33405A]">
                    {routeInfo.distanceKm} km • ~{routeInfo.durationMinutes} min
                  </span>
                )}
              </div>

              <div className="text-[11px] text-[#AEB7C8] flex flex-col gap-1 mb-2.5">
                <div className="flex items-center gap-1.5 truncate">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#59C878] shrink-0" />
                  <strong className="text-white">Desde:</strong>
                  <span className="truncate">{origin.name}</span>
                </div>
                <div className="flex items-center gap-1.5 truncate">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF4B4B] shrink-0" />
                  <strong className="text-white">Hasta:</strong>
                  <span className="truncate">{destination.name}</span>
                </div>
              </div>

              {/* Confirm Addresses CTA -> Moves to SelectRideScreen */}
              <button
                type="button"
                onClick={handleConfirmTripPlan}
                className="w-full bg-[#F5B51B] hover:bg-[#FFBE22] active:scale-[0.98] text-[#081226] font-black py-2.5 px-3 rounded-xl shadow-[0_4px_16px_rgba(245,181,27,0.4)] flex items-center justify-center gap-1.5 cursor-pointer text-xs transition-all"
              >
                <span>Confirmar Trayecto y Ver Precios</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
              </button>
            </div>
          )}

          {/* Quick Shortcuts: Casa & Trabajo */}
          {!currentQuery && (
            <div className="grid grid-cols-2 gap-2 mb-2.5">
              {casaLocation && (
                <div
                  onClick={() => handleSelectLocation(casaLocation)}
                  className="p-2 rounded-2xl bg-[#15213A] border border-[#33405A] hover:border-[#F5B51B] cursor-pointer transition-all active:scale-[0.98] shadow-md flex items-center gap-2 group"
                >
                  <div className="w-7 h-7 rounded-xl bg-[#0D1930] border border-[#F5B51B]/40 group-hover:border-[#F5B51B] flex items-center justify-center shrink-0">
                    <Home className="w-3.5 h-3.5 text-[#F5B51B]" />
                  </div>
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-xs font-bold text-white group-hover:text-[#F5B51B] transition-colors truncate">
                      Casa
                    </span>
                    <span className="text-[9px] text-[#AEB7C8] truncate">{casaLocation.address}</span>
                  </div>
                </div>
              )}

              {trabajoLocation && (
                <div
                  onClick={() => handleSelectLocation(trabajoLocation)}
                  className="p-2 rounded-2xl bg-[#15213A] border border-[#33405A] hover:border-[#59C878] cursor-pointer transition-all active:scale-[0.98] shadow-md flex items-center gap-2 group"
                >
                  <div className="w-7 h-7 rounded-xl bg-[#0D1930] border border-[#59C878]/40 group-hover:border-[#59C878] flex items-center justify-center shrink-0">
                    <Briefcase className="w-3.5 h-3.5 text-[#59C878]" />
                  </div>
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-xs font-bold text-white group-hover:text-[#59C878] transition-colors truncate">
                      Trabajo
                    </span>
                    <span className="text-[9px] text-[#AEB7C8] truncate">{trabajoLocation.address}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Search Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 mb-2 no-scrollbar">
            {(
              [
                { id: 'all', label: 'Todos' },
                { id: 'frequent', label: '⭐ Frecuentes' },
                { id: 'saved', label: '🔖 Guardados' },
                { id: 'poi', label: '🏛️ Puntos Interés' },
                { id: 'recent', label: '🕒 Recientes' },
              ] as { id: FilterCategory; label: string }[]
            ).map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  triggerHaptic('selection');
                  setActiveCategory(cat.id);
                }}
                className={`px-2.5 py-1 rounded-full text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-[#F5B51B] text-[#081226] shadow-md'
                    : 'bg-[#15213A] text-[#AEB7C8] border border-[#33405A]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Mapbox Live Results List (if active search) */}
          {mapboxResults.length > 0 && (
            <div className="mb-2.5">
              <div className="flex items-center justify-between px-1 mb-1">
                <span className="text-[10px] font-extrabold uppercase text-[#F5B51B] tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Resultados en Vivo Mapbox Formosa
                </span>
                <span className="text-[9px] text-[#AEB7C8] font-mono">
                  {mapboxResults.length} encontrados
                </span>
              </div>

              <div className="flex flex-col gap-1.5 max-h-48 overflow-y-auto pr-0.5">
                {mapboxResults.map((place) => (
                  <div
                    key={place.id}
                    onClick={() => handleSelectMapboxResult(place)}
                    className="p-2.5 rounded-xl bg-[#15213A] border border-[#33405A] hover:border-[#F5B51B] cursor-pointer transition-all active:scale-[0.99] flex items-center justify-between group shadow-sm"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-[#0D1930] border border-[#33405A] group-hover:border-[#F5B51B] flex items-center justify-center text-[#F5B51B] shrink-0">
                        <MapPin className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-bold text-white group-hover:text-[#F5B51B] transition-colors truncate">
                          {place.name}
                        </span>
                        <span className="text-[10px] text-[#AEB7C8] truncate">
                          {place.address} • {place.city}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-[#AEB7C8] group-hover:text-[#F5B51B] shrink-0 ml-1" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Categorized Places List */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between px-1">
              <span className="text-[10px] font-extrabold uppercase text-[#AEB7C8] tracking-wider">
                {activeInput === 'origin' ? 'Sugerencias de Inicio' : 'Destinos en Formosa'}
              </span>
              <span className="text-[9px] text-[#AEB7C8]">
                {filteredLocations.length} lugares
              </span>
            </div>

            {filteredLocations.map((loc) => (
              <div
                key={loc.id}
                onClick={() => handleSelectLocation(loc)}
                className="p-2.5 rounded-xl bg-[#15213A]/80 border border-[#33405A] hover:border-[#F5B51B] cursor-pointer transition-all active:scale-[0.99] flex items-center justify-between group shadow-sm"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-[#0D1930] border border-[#33405A] group-hover:border-[#F5B51B] flex items-center justify-center shrink-0">
                    {renderLocationIcon(loc)}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-white group-hover:text-[#F5B51B] transition-colors truncate">
                        {loc.name}
                      </span>
                      {loc.frequencyCount && loc.frequencyCount > 5 && (
                        <span className="text-[8px] px-1 py-0.2 rounded bg-[#0D1930] text-[#59C878] font-bold shrink-0">
                          {loc.frequencyCount} viajes
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-[#AEB7C8] truncate">{loc.address}</span>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-[#AEB7C8] group-hover:text-[#F5B51B] shrink-0 ml-1" />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

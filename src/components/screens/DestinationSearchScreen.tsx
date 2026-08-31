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
  Compass
} from 'lucide-react';
import { LocationItem } from '../../types';
import { MOCK_LOCATIONS, MOCK_TRIP_HISTORY } from '../../data/mockData';
import { searchPlaces, GeocodedPlace, FORMOSA_CENTER } from '../../services/mapboxService';
import { MapView } from '../MapView';
import { triggerHaptic } from '../../utils/haptics';

interface DestinationSearchScreenProps {
  onSelectDestination: (location: LocationItem) => void;
  onBack: () => void;
}

type FilterCategory = 'all' | 'frequent' | 'saved' | 'recent' | 'poi';

const LOCAL_STORAGE_KEY = 'beardrive_custom_recent_destinations';

export const DestinationSearchScreen: React.FC<DestinationSearchScreenProps> = ({
  onSelectDestination,
  onBack,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<FilterCategory>('all');
  const [isMapPickerMode, setIsMapPickerMode] = useState(false);
  const [pickedLocation, setPickedLocation] = useState<LocationItem>({
    id: 'picked-1',
    name: 'Costanera Vuelta Fermosa',
    address: 'Av. Costanera & San Martín, Formosa',
    city: 'Formosa',
    lat: -26.1770,
    lng: -58.1650,
    type: 'saved',
  });

  const [mapboxResults, setMapboxResults] = useState<GeocodedPlace[]>([]);
  const [isSearchingMapbox, setIsSearchingMapbox] = useState(false);

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
      // Fallback gracefully
    }
    return [];
  });

  // Debounced search with Mapbox Geocoding
  useEffect(() => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      setMapboxResults([]);
      setIsSearchingMapbox(false);
      return;
    }

    setIsSearchingMapbox(true);
    const timer = setTimeout(async () => {
      const results = await searchPlaces(searchQuery);
      setMapboxResults(results);
      setIsSearchingMapbox(false);
    }, 350);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Combined master locations list (Mock Locations + dynamically saved custom ones)
  const masterLocations = useMemo(() => {
    const combined = [...MOCK_LOCATIONS];
    storedRecents.forEach((sr) => {
      if (!combined.some((l) => l.id === sr.id || (l.lat === sr.lat && l.lng === sr.lng))) {
        combined.unshift(sr);
      }
    });
    return combined;
  }, [storedRecents]);

  // Specific high-priority quick shortcuts
  const casaLocation = useMemo(
    () => masterLocations.find((l) => l.id === 'loc-casa') || masterLocations[0],
    [masterLocations]
  );
  const trabajoLocation = useMemo(
    () => masterLocations.find((l) => l.id === 'loc-trabajo') || masterLocations[1],
    [masterLocations]
  );

  // Filtered lists based on search query and category
  const filteredLocations = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return masterLocations.filter((loc) => {
      const matchesQuery =
        !query ||
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
  }, [masterLocations, searchQuery, activeCategory]);

  // Destinations sorted by frequency in history (highest frequency first)
  const frequentDestinations = useMemo(() => {
    return [...masterLocations]
      .filter((loc) => loc.id !== 'loc-casa' && loc.id !== 'loc-trabajo')
      .sort((a, b) => (b.frequencyCount || 0) - (a.frequencyCount || 0));
  }, [masterLocations]);

  // Destinations sorted by recency in travel history
  const recentDestinations = useMemo(() => {
    return [...masterLocations].filter(
      (loc) => loc.type === 'recent' || loc.lastVisited !== undefined
    );
  }, [masterLocations]);

  // POIs (Key landmarks of Formosa)
  const poiLocations = useMemo(() => {
    return masterLocations.filter((loc) => loc.type === 'poi');
  }, [masterLocations]);

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
      // Ignore storage errors
    }

    onSelectDestination(loc);
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

  const handleMapClick = (point: { lat: number; lng: number; name: string; address: string }) => {
    triggerHaptic('light');
    setPickedLocation({
      id: `picked-${Date.now()}`,
      name: point.name || 'Punto personalizado en mapa',
      address: point.address || `Coordenadas: ${point.lat.toFixed(4)}, ${point.lng.toFixed(4)}`,
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
  };

  const renderLocationIcon = (loc: LocationItem) => {
    if (loc.id === 'loc-casa' || loc.icon === 'home') {
      return <Home className="w-5 h-5 text-[#F5B51B]" />;
    }
    if (loc.id === 'loc-trabajo' || loc.icon === 'briefcase') {
      return <Briefcase className="w-5 h-5 text-[#59C878]" />;
    }
    if (loc.icon === 'dumbbell') {
      return <Dumbbell className="w-5 h-5 text-[#FFD66A]" />;
    }
    if (loc.icon === 'shopping-bag') {
      return <ShoppingBag className="w-5 h-5 text-[#EC4899]" />;
    }
    if (loc.icon === 'sun') {
      return <Sun className="w-5 h-5 text-[#F5B51B]" />;
    }
    if (loc.icon === 'heart-pulse') {
      return <HeartPulse className="w-5 h-5 text-red-400" />;
    }
    if (loc.icon === 'plane') {
      return <Plane className="w-5 h-5 text-sky-400" />;
    }
    if (loc.icon === 'graduation-cap') {
      return <GraduationCap className="w-5 h-5 text-indigo-400" />;
    }
    if (loc.type === 'saved') {
      return <Bookmark className="w-5 h-5 text-[#F5B51B]" />;
    }
    if (loc.type === 'frequent') {
      return <TrendingUp className="w-5 h-5 text-[#59C878]" />;
    }
    if (loc.type === 'recent') {
      return <History className="w-5 h-5 text-[#AEB7C8]" />;
    }
    return <MapPin className="w-5 h-5 text-[#F5B51B]" />;
  };

  return (
    <div className="min-h-[640px] flex flex-col bg-[#081226] text-white p-4 relative">
      {/* Map Picker Mode Fullscreen Overlay */}
      {isMapPickerMode ? (
        <div className="flex-1 flex flex-col -m-4 bg-[#081226] relative">
          {/* Top Bar on Map Picker */}
          <div className="absolute top-4 inset-x-4 z-30 flex items-center justify-between pointer-events-auto">
            <button
              type="button"
              onClick={() => {
                triggerHaptic('light');
                setIsMapPickerMode(false);
              }}
              className="px-3.5 py-2 rounded-2xl bg-[#15213A]/90 backdrop-blur-md border border-[#33405A] text-white text-xs font-bold shadow-xl flex items-center gap-1.5 hover:bg-[#202D47] cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-[#F5B51B]" />
              <span>Volver a lista</span>
            </button>

            <div className="px-3 py-1.5 rounded-full bg-[#15213A]/90 backdrop-blur-md border border-[#33405A] text-[11px] font-semibold text-[#59C878] shadow-xl flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#59C878] animate-ping" />
              <span>Toca el mapa para fijar destino</span>
            </div>
          </div>

          {/* Interactive Mapbox Map */}
          <div className="flex-1 w-full relative">
            <MapView
              destination={pickedLocation}
              onMapClick={handleMapClick}
              interactive={true}
              className="h-full"
            />
          </div>

          {/* Bottom Confirmation Card */}
          <div className="p-4 bg-[#15213A] border-t border-[#33405A] rounded-t-3xl shadow-2xl flex flex-col gap-3 relative z-30">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#0D1930] border border-[#F5B51B] flex items-center justify-center text-[#F5B51B] shrink-0 mt-0.5 shadow-md">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white truncate">{pickedLocation.name}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#0D1930] text-[#59C878] border border-[#59C878]/30 font-bold">
                    GPS
                  </span>
                </div>
                <span className="text-xs text-[#AEB7C8] truncate">{pickedLocation.address}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleConfirmPickedLocation}
              className="w-full bg-[#F5B51B] hover:bg-[#FFBE22] active:scale-[0.98] text-[#081226] font-bold py-3.5 px-4 rounded-2xl shadow-[0_4px_16px_rgba(245,181,27,0.35)] transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
            >
              <Check className="w-5 h-5 stroke-[2.5]" />
              <span>Confirmar este destino</span>
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Top Bar Header with Navigation & Subtitle */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => {
                  triggerHaptic('light');
                  onBack();
                }}
                className="w-9 h-9 rounded-xl bg-[#15213A] border border-[#33405A] hover:border-[#F5B51B] flex items-center justify-center text-white active:scale-95 transition-all cursor-pointer"
                title="Volver"
              >
                <ArrowLeft className="w-4 h-4 text-[#F5B51B]" />
              </button>
              <div>
                <h2 className="text-xl font-bold tracking-tight text-white leading-tight">¿A dónde vamos?</h2>
                <p className="text-[11px] text-[#AEB7C8]">Sugerencias basadas en tu historial en Formosa</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                triggerHaptic('light');
                setIsMapPickerMode(true);
              }}
              className="px-2.5 py-1.5 rounded-xl bg-[#15213A] border border-[#33405A] hover:border-[#F5B51B] text-[11px] font-bold text-[#F5B51B] flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
              title="Abrir mapa"
            >
              <Map className="w-3.5 h-3.5" />
              <span>Mapa</span>
            </button>
          </div>

          {/* Golden Search Input Box with Mapbox Geocoding */}
          <div className="relative mb-3">
            <div className="relative flex items-center bg-[#0D1930] border-2 border-[#F5B51B] rounded-2xl px-3.5 py-3 shadow-[0_0_15px_rgba(245,181,27,0.2)]">
              {isSearchingMapbox ? (
                <Loader2 className="w-5 h-5 text-[#F5B51B] mr-2.5 shrink-0 animate-spin" />
              ) : (
                <Search className="w-5 h-5 text-[#F5B51B] mr-2.5 shrink-0" />
              )}
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar calle, barrio, comercio o lugar habitual..."
                className="w-full bg-transparent text-xs sm:text-sm text-white placeholder-gray-400 focus:outline-none"
                autoFocus
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic('light');
                    setSearchQuery('');
                  }}
                  className="p-1 rounded-full text-gray-400 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Quick-Access Shortcuts: Casa 🏠 & Trabajo 💼 (Top Priority) */}
          {!searchQuery && (
            <div className="grid grid-cols-2 gap-2.5 mb-3">
              {/* Casa Card */}
              {casaLocation && (
                <div
                  onClick={() => handleSelectLocation(casaLocation)}
                  className="p-3 rounded-2xl bg-[#15213A] border border-[#33405A] hover:border-[#F5B51B] cursor-pointer transition-all active:scale-[0.98] shadow-md flex items-center gap-2.5 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#0D1930] border border-[#F5B51B]/40 group-hover:border-[#F5B51B] flex items-center justify-center shrink-0">
                    <Home className="w-5 h-5 text-[#F5B51B]" />
                  </div>
                  <div className="flex flex-col min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white group-hover:text-[#F5B51B] transition-colors">
                        Casa
                      </span>
                      <span className="text-[9px] px-1 py-0.2 rounded bg-[#0D1930] text-[#59C878] font-bold">
                        {casaLocation.frequencyCount || 42} viajes
                      </span>
                    </div>
                    <span className="text-[10px] text-[#AEB7C8] truncate">{casaLocation.address}</span>
                  </div>
                </div>
              )}

              {/* Trabajo Card */}
              {trabajoLocation && (
                <div
                  onClick={() => handleSelectLocation(trabajoLocation)}
                  className="p-3 rounded-2xl bg-[#15213A] border border-[#33405A] hover:border-[#59C878] cursor-pointer transition-all active:scale-[0.98] shadow-md flex items-center gap-2.5 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#0D1930] border border-[#59C878]/40 group-hover:border-[#59C878] flex items-center justify-center shrink-0">
                    <Briefcase className="w-5 h-5 text-[#59C878]" />
                  </div>
                  <div className="flex flex-col min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white group-hover:text-[#59C878] transition-colors truncate">
                        Trabajo
                      </span>
                      <span className="text-[9px] px-1 py-0.2 rounded bg-[#0D1930] text-[#FFD66A] font-bold">
                        {trabajoLocation.frequencyCount || 38} viajes
                      </span>
                    </div>
                    <span className="text-[10px] text-[#AEB7C8] truncate">{trabajoLocation.address}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Filter Pills / Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-2 no-scrollbar">
            <button
              type="button"
              onClick={() => {
                triggerHaptic('light');
                setActiveCategory('all');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeCategory === 'all'
                  ? 'bg-[#F5B51B] text-[#081226] shadow-md'
                  : 'bg-[#15213A] text-[#AEB7C8] border border-[#33405A] hover:text-white'
              }`}
            >
              Todos ({filteredLocations.length})
            </button>
            <button
              type="button"
              onClick={() => {
                triggerHaptic('light');
                setActiveCategory('frequent');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1 transition-all cursor-pointer ${
                activeCategory === 'frequent'
                  ? 'bg-[#F5B51B] text-[#081226] shadow-md'
                  : 'bg-[#15213A] text-[#AEB7C8] border border-[#33405A] hover:text-white'
              }`}
            >
              <TrendingUp className="w-3 h-3" />
              <span>Frecuentes</span>
            </button>
            <button
              type="button"
              onClick={() => {
                triggerHaptic('light');
                setActiveCategory('recent');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1 transition-all cursor-pointer ${
                activeCategory === 'recent'
                  ? 'bg-[#F5B51B] text-[#081226] shadow-md'
                  : 'bg-[#15213A] text-[#AEB7C8] border border-[#33405A] hover:text-white'
              }`}
            >
              <History className="w-3 h-3" />
              <span>Recientes</span>
            </button>
            <button
              type="button"
              onClick={() => {
                triggerHaptic('light');
                setActiveCategory('saved');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1 transition-all cursor-pointer ${
                activeCategory === 'saved'
                  ? 'bg-[#F5B51B] text-[#081226] shadow-md'
                  : 'bg-[#15213A] text-[#AEB7C8] border border-[#33405A] hover:text-white'
              }`}
            >
              <Bookmark className="w-3 h-3" />
              <span>Guardados</span>
            </button>
            <button
              type="button"
              onClick={() => {
                triggerHaptic('light');
                setActiveCategory('poi');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1 transition-all cursor-pointer ${
                activeCategory === 'poi'
                  ? 'bg-[#F5B51B] text-[#081226] shadow-md'
                  : 'bg-[#15213A] text-[#AEB7C8] border border-[#33405A] hover:text-white'
              }`}
            >
              <Compass className="w-3 h-3" />
              <span>Puntos Clave</span>
            </button>
          </div>

          {/* Locations Container */}
          <div className="flex-1 flex flex-col gap-3.5 overflow-y-auto pr-1">
            {/* Live Mapbox Geocoded Results (when searching) */}
            {mapboxResults.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2 px-1">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#F5B51B] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Resultados de Mapbox en Vivo</span>
                  </h3>
                  <span className="text-[10px] text-[#AEB7C8]">Geocodificación</span>
                </div>
                <div className="flex flex-col gap-2">
                  {mapboxResults.map((place) => (
                    <div
                      key={place.id}
                      onClick={() => handleSelectMapboxResult(place)}
                      className="flex items-center justify-between p-3.5 rounded-2xl bg-[#15213A] border border-[#F5B51B]/50 hover:border-[#F5B51B] cursor-pointer transition-all active:scale-[0.99] group shadow-md"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-[#0D1930] border border-[#F5B51B] flex items-center justify-center text-[#F5B51B] shrink-0">
                          <Navigation className="w-5 h-5" />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs sm:text-sm font-bold text-white truncate">{place.name}</span>
                          <span className="text-[11px] text-[#AEB7C8] truncate">{place.address}</span>
                        </div>
                      </div>
                      <div className="text-[#F5B51B] font-bold pl-2">→</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Standard Filtered Results or Categorized Sections */}
            {searchQuery.trim() ? (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#AEB7C8] mb-2 px-1">
                  Destinos sugeridos para "{searchQuery}"
                </h3>
                {filteredLocations.length > 0 ? (
                  <div className="flex flex-col gap-2">
                    {filteredLocations.map((loc) => (
                      <div
                        key={loc.id}
                        onClick={() => handleSelectLocation(loc)}
                        className="flex items-center justify-between p-3 rounded-2xl bg-[#15213A] border border-[#33405A] hover:border-[#F5B51B] cursor-pointer transition-all active:scale-[0.99] group shadow-sm"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-xl bg-[#0D1930] border border-[#33405A] flex items-center justify-center shrink-0">
                            {renderLocationIcon(loc)}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-xs sm:text-sm font-semibold text-white truncate group-hover:text-[#F5B51B]">
                                {loc.name}
                              </span>
                              {loc.frequencyCount && (
                                <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#0D1930] text-[#59C878] font-bold shrink-0">
                                  {loc.frequencyCount} viajes
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-[#AEB7C8] truncate">{loc.address}</span>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-[#33405A] group-hover:text-[#F5B51B] shrink-0 transition-colors" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center text-xs text-[#AEB7C8] bg-[#15213A] rounded-2xl border border-[#33405A]">
                    No encontramos coincidencias locales. Podes elegir directamente en el mapa.
                  </div>
                )}
              </div>
            ) : (
              <>
                {/* 1. Destinos Frecuentes Sugeridos (Historial Inteligente) */}
                {(activeCategory === 'all' || activeCategory === 'frequent') && frequentDestinations.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-2 px-1">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-[#F5B51B] flex items-center gap-1.5">
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span>Destinos Frecuentes del Historial</span>
                      </h3>
                      <span className="text-[10px] text-[#59C878] font-bold">Más visitados</span>
                    </div>

                    <div className="flex flex-col gap-2">
                      {frequentDestinations.slice(0, 4).map((loc) => (
                        <div
                          key={loc.id}
                          onClick={() => handleSelectLocation(loc)}
                          className="flex items-center justify-between p-3 rounded-2xl bg-[#15213A] border border-[#33405A] hover:border-[#F5B51B] cursor-pointer transition-all active:scale-[0.99] group shadow-sm"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-10 h-10 rounded-xl bg-[#0D1930] border border-[#33405A] flex items-center justify-center shrink-0 group-hover:border-[#F5B51B]/40 transition-colors">
                              {renderLocationIcon(loc)}
                            </div>
                            <div className="flex flex-col min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-xs sm:text-sm font-bold text-white truncate group-hover:text-[#F5B51B] transition-colors">
                                  {loc.name}
                                </span>
                                {loc.frequencyCount && (
                                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#0D1930] text-[#59C878] font-bold shrink-0">
                                    {loc.frequencyCount} viajes
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2 text-[10px] text-[#AEB7C8] truncate">
                                <span className="truncate">{loc.address}</span>
                                {loc.lastVisited && (
                                  <span className="text-[#FFD66A] shrink-0 font-medium">• {loc.lastVisited}</span>
                                )}
                              </div>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-[#33405A] group-hover:text-[#F5B51B] shrink-0 transition-colors" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. Lugares Visitados Recientemente */}
                {(activeCategory === 'all' || activeCategory === 'recent') && recentDestinations.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-2 px-1">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-[#AEB7C8] flex items-center gap-1.5">
                        <History className="w-3.5 h-3.5 text-[#FFD66A]" />
                        <span>Lugares Visitados Recientemente</span>
                      </h3>
                      <span className="text-[10px] text-[#AEB7C8]">Últimos viajes</span>
                    </div>

                    <div className="flex flex-col gap-2">
                      {recentDestinations.slice(0, 3).map((loc) => (
                        <div
                          key={loc.id}
                          onClick={() => handleSelectLocation(loc)}
                          className="flex items-center justify-between p-3 rounded-2xl bg-[#15213A] border border-[#33405A] hover:border-[#F5B51B] cursor-pointer transition-all active:scale-[0.99] group shadow-sm"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-10 h-10 rounded-xl bg-[#0D1930] border border-[#33405A] flex items-center justify-center shrink-0">
                              {renderLocationIcon(loc)}
                            </div>
                            <div className="flex flex-col min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-xs sm:text-sm font-semibold text-white truncate group-hover:text-[#F5B51B] transition-colors">
                                  {loc.name}
                                </span>
                                {loc.category && (
                                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#0D1930] text-[#AEB7C8] border border-[#33405A] shrink-0 font-medium">
                                    {loc.category}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2 text-[10px] text-[#AEB7C8] truncate">
                                <span className="truncate">{loc.address}</span>
                                {loc.lastVisited && (
                                  <span className="text-[#59C878] shrink-0 font-medium">• {loc.lastVisited}</span>
                                )}
                              </div>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-[#33405A] group-hover:text-[#F5B51B] shrink-0 transition-colors" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. Puntos Clave de Formosa (POIs) */}
                {(activeCategory === 'all' || activeCategory === 'poi') && poiLocations.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-2 px-1">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-[#AEB7C8] flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#F5B51B]" />
                        <span>Puntos Clave de Formosa</span>
                      </h3>
                      <span className="text-[10px] text-[#AEB7C8]">Turismo & Conexión</span>
                    </div>

                    <div className="flex flex-col gap-2">
                      {poiLocations.map((loc) => (
                        <div
                          key={loc.id}
                          onClick={() => handleSelectLocation(loc)}
                          className="flex items-center justify-between p-3 rounded-2xl bg-[#15213A] border border-[#33405A] hover:border-[#F5B51B] cursor-pointer transition-all active:scale-[0.99] group shadow-sm"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-10 h-10 rounded-xl bg-[#0D1930] border border-[#33405A] flex items-center justify-center shrink-0">
                              {renderLocationIcon(loc)}
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="text-xs sm:text-sm font-semibold text-white truncate group-hover:text-[#F5B51B] transition-colors">
                                {loc.name}
                              </span>
                              <span className="text-[10px] text-[#AEB7C8] truncate">{loc.address}</span>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-[#33405A] group-hover:text-[#F5B51B] shrink-0 transition-colors" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Bottom CTA: Elegir interactivamente en Mapbox */}
          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              setIsMapPickerMode(true);
            }}
            className="w-full mt-3 bg-[#15213A] hover:bg-[#202D47] border border-[#F5B51B] text-[#F5B51B] font-bold py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg text-xs sm:text-sm cursor-pointer"
          >
            <Map className="w-4 h-4 text-[#F5B51B]" />
            <span>Elegir ubicación en el Mapa Mapbox</span>
          </button>
        </>
      )}
    </div>
  );
};

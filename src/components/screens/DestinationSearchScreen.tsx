import React, { useState, useEffect, useRef } from 'react';
import { Search, History, MapPin, Map, ArrowLeft, X, Sparkles, Navigation, Check, Loader2, LocateFixed } from 'lucide-react';
import { LocationItem } from '../../types';
import { MOCK_LOCATIONS } from '../../data/mockData';
import { searchPlaces, GeocodedPlace, reverseGeocode, FORMOSA_CENTER } from '../../services/mapboxService';
import { MapView } from '../MapView';

interface DestinationSearchScreenProps {
  onSelectDestination: (location: LocationItem) => void;
  onBack: () => void;
}

export const DestinationSearchScreen: React.FC<DestinationSearchScreenProps> = ({
  onSelectDestination,
  onBack,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
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

  const filteredLocalLocations = searchQuery.trim()
    ? MOCK_LOCATIONS.filter(
        (l) =>
          l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          l.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
          l.city.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : MOCK_LOCATIONS;

  const recents = filteredLocalLocations.filter((l) => l.type === 'recent' || l.type === 'saved');
  const pois = filteredLocalLocations.filter((l) => l.type === 'poi');

  const handleSelectMapboxResult = (place: GeocodedPlace) => {
    const loc: LocationItem = {
      id: place.id,
      name: place.name,
      address: place.address,
      city: place.city,
      lat: place.lat,
      lng: place.lng,
      type: 'saved',
    };
    onSelectDestination(loc);
  };

  const handleMapClick = (point: { lat: number; lng: number; name: string; address: string }) => {
    setPickedLocation({
      id: `picked-${Date.now()}`,
      name: point.name || 'Punto en el mapa',
      address: point.address || `${point.lat.toFixed(4)}, ${point.lng.toFixed(4)}`,
      city: 'Formosa',
      lat: point.lat,
      lng: point.lng,
      type: 'saved',
    });
  };

  const handleConfirmPickedLocation = () => {
    onSelectDestination(pickedLocation);
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
              onClick={() => setIsMapPickerMode(false)}
              className="px-3.5 py-2 rounded-2xl bg-[#15213A]/90 backdrop-blur-md border border-[#33405A] text-white text-xs font-bold shadow-xl flex items-center gap-1.5 hover:bg-[#202D47]"
            >
              <ArrowLeft className="w-4 h-4 text-[#F5B51B]" />
              <span>Volver a lista</span>
            </button>

            <div className="px-3 py-1.5 rounded-full bg-[#15213A]/90 backdrop-blur-md border border-[#33405A] text-[11px] font-semibold text-[#59C878] shadow-xl">
              Toca el mapa para fijar
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
              <div className="w-10 h-10 rounded-2xl bg-[#0D1930] border border-[#F5B51B] flex items-center justify-center text-[#F5B51B] shrink-0 mt-0.5">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-bold text-white truncate">{pickedLocation.name}</span>
                <span className="text-xs text-[#AEB7C8] truncate">{pickedLocation.address}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleConfirmPickedLocation}
              className="w-full bg-[#F5B51B] hover:bg-[#FFBE22] active:scale-[0.98] text-[#081226] font-bold py-3.5 px-4 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2"
            >
              <Check className="w-5 h-5 stroke-[2.5]" />
              <span>Confirmar este destino</span>
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Title & Prompt */}
          <div className="mb-4">
            <h2 className="text-2xl font-bold tracking-tight text-white">¿A dónde vamos?</h2>
            <p className="text-xs text-[#AEB7C8] mt-0.5">Búsqueda inteligente con Mapbox Geocoding</p>
          </div>

          {/* Golden Search Input Box */}
          <div className="relative mb-4">
            <div className="relative flex items-center bg-[#0D1930] border-2 border-[#F5B51B] rounded-2xl px-4 py-3.5 shadow-[0_0_15px_rgba(245,181,27,0.2)]">
              {isSearchingMapbox ? (
                <Loader2 className="w-5 h-5 text-[#F5B51B] mr-3 shrink-0 animate-spin" />
              ) : (
                <Search className="w-5 h-5 text-[#F5B51B] mr-3 shrink-0" />
              )}
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Calle, plaza, barrio o comercio..."
                className="w-full bg-transparent text-sm text-white placeholder-gray-400 focus:outline-none"
                autoFocus
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="p-1 rounded-full text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Location Sections */}
          <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-1">
            {/* Real Mapbox Geocoded Results */}
            {mapboxResults.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2 px-1">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#F5B51B] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Resultados Mapbox</span>
                  </h3>
                  <span className="text-[10px] text-[#AEB7C8]">En vivo</span>
                </div>
                <div className="flex flex-col gap-2">
                  {mapboxResults.map((place) => (
                    <div
                      key={place.id}
                      onClick={() => handleSelectMapboxResult(place)}
                      className="flex items-center justify-between p-3.5 rounded-2xl bg-[#15213A] border border-[#F5B51B]/50 hover:border-[#F5B51B] cursor-pointer transition-all active:scale-[0.99] group shadow-md"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-[#0D1930] border border-[#F5B51B] flex items-center justify-center text-[#F5B51B] shrink-0">
                          <Navigation className="w-5 h-5" />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-sm font-bold text-white truncate">{place.name}</span>
                          <span className="text-xs text-[#AEB7C8] truncate">{place.address}</span>
                        </div>
                      </div>
                      <div className="text-[#F5B51B] font-bold pl-2">→</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recientes */}
            {recents.length > 0 && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#AEB7C8] mb-2 px-1">
                  Lugares Guardados y Frecuentes
                </h3>
                <div className="flex flex-col gap-2">
                  {recents.map((loc) => (
                    <div
                      key={loc.id}
                      onClick={() => onSelectDestination(loc)}
                      className="flex items-center justify-between p-3.5 rounded-2xl bg-[#15213A] border border-[#33405A] hover:border-[#F5B51B] cursor-pointer transition-all active:scale-[0.99] group shadow-sm"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-[#0D1930] border border-[#33405A] flex items-center justify-center text-[#AEB7C8] group-hover:text-[#F5B51B] group-hover:border-[#F5B51B]/40 transition-colors shrink-0">
                          <History className="w-5 h-5" />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-sm font-semibold text-white truncate">{loc.name}</span>
                          <span className="text-xs text-[#AEB7C8] truncate">{loc.address}</span>
                        </div>
                      </div>
                      <div className="text-[#33405A] group-hover:text-[#F5B51B] transition-colors pl-2">
                        →
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Puntos de interés */}
            {pois.length > 0 && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#AEB7C8] mb-2 px-1">
                  Puntos Clave de Formosa
                </h3>
                <div className="flex flex-col gap-2">
                  {pois.map((loc) => (
                    <div
                      key={loc.id}
                      onClick={() => onSelectDestination(loc)}
                      className="flex items-center justify-between p-3.5 rounded-2xl bg-[#15213A] border border-[#33405A] hover:border-[#F5B51B] cursor-pointer transition-all active:scale-[0.99] group shadow-sm"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-[#0D1930] border border-[#33405A] flex items-center justify-center text-[#F5B51B] shrink-0">
                          <MapPin className="w-5 h-5" />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-sm font-semibold text-white truncate">{loc.name}</span>
                          <span className="text-xs text-[#AEB7C8] truncate">{loc.address}</span>
                        </div>
                      </div>
                      <div className="text-[#33405A] group-hover:text-[#F5B51B] transition-colors pl-2">
                        →
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Bottom CTA: Elegir interactivamente en Mapbox */}
          <button
            type="button"
            onClick={() => setIsMapPickerMode(true)}
            className="w-full mt-3 bg-[#15213A] hover:bg-[#202D47] border border-[#F5B51B] text-[#F5B51B] font-bold py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg text-sm"
          >
            <Map className="w-4 h-4 text-[#F5B51B]" />
            <span>Elegir ubicación en el Mapa Mapbox</span>
          </button>
        </>
      )}
    </div>
  );
};

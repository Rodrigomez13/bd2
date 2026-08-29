import React, { useState } from 'react';
import { Search, History, MapPin, Map, ArrowLeft, X, Sparkles, Navigation } from 'lucide-react';
import { LocationItem } from '../../types';
import { MOCK_LOCATIONS } from '../../data/mockData';

interface DestinationSearchScreenProps {
  onSelectDestination: (location: LocationItem) => void;
  onBack: () => void;
}

export const DestinationSearchScreen: React.FC<DestinationSearchScreenProps> = ({
  onSelectDestination,
  onBack,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLocations = searchQuery.trim()
    ? MOCK_LOCATIONS.filter(
        (l) =>
          l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          l.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
          l.city.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : MOCK_LOCATIONS;

  const recents = filteredLocations.filter((l) => l.type === 'recent' || l.type === 'saved');
  const pois = filteredLocations.filter((l) => l.type === 'poi');

  const handleCustomPin = () => {
    const customLoc: LocationItem = {
      id: `custom-${Date.now()}`,
      name: searchQuery.trim() || 'Ubicación seleccionada',
      address: 'Formosa, Argentina',
      city: 'Formosa',
      lat: -26.185,
      lng: -58.175,
      type: 'saved',
    };
    onSelectDestination(customLoc);
  };

  return (
    <div className="min-h-[640px] flex flex-col bg-[#081226] text-white p-4">
      {/* Title & Prompt */}
      <div className="mb-4">
        <h2 className="text-2xl font-bold tracking-tight text-white">¿A dónde vamos?</h2>
        <p className="text-xs text-[#AEB7C8] mt-0.5">Buscá tu destino en Formosa</p>
      </div>

      {/* Golden Search Input Box */}
      <div className="relative mb-6">
        <div className="relative flex items-center bg-[#0D1930] border-2 border-[#F5B51B] rounded-2xl px-4 py-3.5 shadow-[0_0_15px_rgba(245,181,27,0.2)]">
          <Search className="w-5 h-5 text-[#F5B51B] mr-3 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Ingresa tu destino..."
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
      <div className="flex-1 flex flex-col gap-5 overflow-y-auto pr-1">
        {/* Recientes */}
        {recents.length > 0 && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#AEB7C8] mb-2.5 px-1">
              Recientes
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
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#AEB7C8] mb-2.5 px-1">
              Puntos de Interés
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

      {/* Bottom CTA: Fijar en el mapa */}
      <button
        type="button"
        onClick={handleCustomPin}
        className="w-full mt-4 bg-[#15213A] hover:bg-[#202D47] border border-[#F5B51B]/60 text-[#F5B51B] font-bold py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg text-sm"
      >
        <Map className="w-4 h-4 text-[#F5B51B]" />
        <span>Fijar en el mapa</span>
      </button>
    </div>
  );
};

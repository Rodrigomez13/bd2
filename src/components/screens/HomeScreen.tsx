import React from 'react';
import { Search, Home as HomeIcon, Briefcase, MapPin, Zap, ArrowRight, Star, Tag, Clock, ShieldCheck, ChevronRight } from 'lucide-react';
import { MapView } from '../MapView';
import { BearLogo, BearMascotIcon } from '../BearLogo';
import { LocationItem, RideCategory, ScreenId } from '../../types';
import { MOCK_LOCATIONS, RIDE_CATEGORIES } from '../../data/mockData';

interface HomeScreenProps {
  onStartRide: (destination?: LocationItem) => void;
  onNavigate: (screen: ScreenId) => void;
  userName: string;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onStartRide,
  onNavigate,
  userName = 'Martín',
}) => {
  const casa = MOCK_LOCATIONS.find((l) => l.id === 'loc-casa') || MOCK_LOCATIONS[0];
  const trabajo = MOCK_LOCATIONS.find((l) => l.id === 'loc-trabajo') || MOCK_LOCATIONS[1];
  const costanera = MOCK_LOCATIONS.find((l) => l.id === 'loc-costanera') || MOCK_LOCATIONS[3];
  const aeropuerto = MOCK_LOCATIONS.find((l) => l.id === 'loc-aeropuerto') || MOCK_LOCATIONS[4];

  return (
    <div className="relative min-h-[640px] flex flex-col bg-[#081226] text-white">
      {/* Top Half: Night Illuminated Map Header with floating greeting & Flash Action */}
      <div className="relative h-72 w-full overflow-hidden border-b border-[#33405A]/40">
        <MapView interactive={false} showCars={true} />

        {/* Gradient dark overlay on bottom of map for smooth blending */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#081226] via-[#081226]/80 to-transparent pointer-events-none" />

        {/* Top Floating User Greeting */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-auto">
          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-[#15213A]/90 backdrop-blur-md border border-[#33405A] shadow-lg">
            <div className="w-7 h-7 rounded-full overflow-hidden border border-[#F5B51B] bg-[#081226]">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                alt="Usuario"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-[#AEB7C8] leading-none">Buenas noches,</span>
              <span className="text-xs font-bold text-white leading-tight">{userName}</span>
            </div>
          </div>

          {/* Quick Flash / Lightning Instant Request Button */}
          <button
            type="button"
            onClick={() => onStartRide(trabajo)}
            className="w-11 h-11 rounded-full bg-[#F5B51B] hover:bg-[#FFBE22] active:scale-95 text-[#081226] flex items-center justify-center shadow-[0_0_20px_rgba(245,181,27,0.5)] border-2 border-white/40 transition-transform cursor-pointer"
            title="Pedir BearFlash rápido al destino habitual"
          >
            <Zap className="w-6 h-6 fill-[#081226] stroke-[#081226]" />
          </button>
        </div>

        {/* Center Target Radar Icon overlay */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <div className="w-12 h-12 rounded-full border-2 border-[#F5B51B] bg-[#F5B51B]/20 flex items-center justify-center shadow-[0_0_20px_rgba(245,181,27,0.4)] animate-pulse">
            <div className="w-4 h-4 rounded-full bg-[#F5B51B]" />
          </div>
        </div>
      </div>

      {/* Bottom Main Content Card (Overlapping map) */}
      <div className="relative z-10 -mt-6 px-4 pb-8 flex flex-col gap-4">
        {/* Search destination trigger bar */}
        <div
          onClick={() => onNavigate('search')}
          className="w-full bg-[#15213A] hover:bg-[#202D47] border border-[#33405A] hover:border-[#F5B51B] rounded-2xl p-4 shadow-2xl cursor-pointer transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3 flex-1">
            <div className="w-10 h-10 rounded-xl bg-[#0D1930] border border-[#33405A] flex items-center justify-center text-[#F5B51B] group-hover:scale-105 transition-transform">
              <Search className="w-5 h-5" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-base font-bold text-white tracking-tight">¿A dónde vamos?</span>
              <span className="text-xs text-[#AEB7C8]">Elegí tu destino en Formosa</span>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-[#202D47] flex items-center justify-center text-[#AEB7C8] group-hover:text-[#F5B51B]">
            <Clock className="w-4 h-4" />
          </div>
        </div>

        {/* Ecosystem & BearPoints Navigation Pills */}
        <div className="grid grid-cols-2 gap-2.5">
          <div
            onClick={() => onNavigate('conceptual-map')}
            className="p-3 rounded-2xl bg-[#0D1930] hover:bg-[#15213A] border border-[#F5B51B]/40 cursor-pointer transition-all flex items-center gap-2.5 shadow-md group"
          >
            <div className="w-8 h-8 rounded-xl bg-[#081226] border border-[#F5B51B] flex items-center justify-center text-sm">
              🗺️
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-white group-hover:text-[#F5B51B] transition-colors truncate">
                Mapa Conceptual
              </span>
              <span className="text-[10px] text-[#AEB7C8] truncate">8 Pilares & Negocio</span>
            </div>
          </div>

          <div
            onClick={() => onNavigate('bear-points')}
            className="p-3 rounded-2xl bg-[#0D1930] hover:bg-[#15213A] border border-[#59C878]/40 cursor-pointer transition-all flex items-center gap-2.5 shadow-md group"
          >
            <div className="w-8 h-8 rounded-xl bg-[#081226] border border-[#59C878] flex items-center justify-center text-sm">
              🎁
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-[#59C878] truncate">1.250 BearPoints</span>
              <span className="text-[10px] text-[#AEB7C8] truncate">Canjear premios</span>
            </div>
          </div>
        </div>

        {/* Quick Favorite Destinations Grid (Casa / Trabajo) */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => onStartRide(casa)}
            className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#15213A] border border-[#33405A] hover:border-[#F5B51B]/60 text-left transition-all active:scale-[0.98] shadow-md group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#0D1930] flex items-center justify-center text-[#F5B51B] shrink-0 border border-[#33405A]">
              <HomeIcon className="w-5 h-5" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-bold text-white truncate">Casa</span>
              <span className="text-[11px] text-[#AEB7C8] truncate">{casa.address}</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onStartRide(trabajo)}
            className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#15213A] border border-[#33405A] hover:border-[#F5B51B]/60 text-left transition-all active:scale-[0.98] shadow-md group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#0D1930] flex items-center justify-center text-[#FFD66A] shrink-0 border border-[#33405A]">
              <Briefcase className="w-5 h-5" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-bold text-white truncate">Trabajo</span>
              <span className="text-[11px] text-[#AEB7C8] truncate">{trabajo.address}</span>
            </div>
          </button>
        </div>

        {/* Launch Promo Banner (20% OFF BEAR20) */}
        <div
          onClick={() => onNavigate('promos')}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#15213A] via-[#202D47] to-[#15213A] border border-[#F5B51B]/40 p-4 shadow-xl cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[#F5B51B] text-[#081226]">
                  PROMO LANZAMIENTO
                </span>
                <span className="text-xs text-[#FFD66A] font-semibold">Código: BEAR20</span>
              </div>
              <h3 className="text-lg font-black text-white mt-1">20% OFF en tu primer viaje</h3>
              <p className="text-xs text-[#AEB7C8]">Válido en toda Formosa • Tocá para ver promos</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#081226] border border-[#F5B51B] flex items-center justify-center text-2xl shadow-inner shrink-0 group-hover:scale-110 transition-transform">
              🐻
            </div>
          </div>
        </div>

        {/* Ride Categories Quick Selection Cards */}
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider text-xs text-[#AEB7C8]">
              Elegí tu servicio
            </h3>
            <button
              type="button"
              onClick={() => onNavigate('select-ride')}
              className="text-xs font-semibold text-[#F5B51B] hover:underline flex items-center gap-1"
            >
              Ver todas <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {RIDE_CATEGORIES.slice(0, 4).map((cat) => (
              <div
                key={cat.id}
                onClick={() => onStartRide(costanera)}
                className="bg-[#15213A] hover:bg-[#202D47] border border-[#33405A] hover:border-[#F5B51B] rounded-xl p-3 cursor-pointer transition-all flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xl">
                    {cat.iconType === 'flash'
                      ? '⚡'
                      : cat.iconType === 'car'
                      ? '🚗'
                      : cat.iconType === 'premium'
                      ? '⭐'
                      : '🌱'}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#0D1930] text-[#FFD66A] border border-[#33405A]">
                    {cat.etaMinutes} min
                  </span>
                </div>
                <div className="mt-2">
                  <div className="text-sm font-bold text-white">{cat.name}</div>
                  <div className="text-xs font-extrabold text-[#F5B51B]">
                    ${cat.basePrice.toLocaleString('es-AR')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Primary CTA: Solicitar Viaje */}
        <button
          type="button"
          onClick={() => onStartRide()}
          className="w-full mt-2 bg-[#F5B51B] hover:bg-[#FFBE22] active:scale-[0.98] text-[#081226] font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(245,181,27,0.35)] transition-all cursor-pointer text-base"
        >
          <span>Solicitar viaje</span>
          <ArrowRight className="w-5 h-5 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};

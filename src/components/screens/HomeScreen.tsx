import React from 'react';
import { 
  Search, 
  Home as HomeIcon, 
  Briefcase, 
  MapPin, 
  Zap, 
  ArrowRight, 
  Star, 
  Tag, 
  Clock, 
  ShieldCheck, 
  ChevronRight, 
  LocateFixed, 
  Sparkles
} from 'lucide-react';
import { MapView } from '../MapView';
import { LocationItem, ScreenId } from '../../types';
import { MOCK_LOCATIONS, RIDE_CATEGORIES } from '../../data/mockData';
import { isSupabaseConfigured } from '../../services/supabaseClient';
import { triggerHaptic } from '../../utils/haptics';

interface HomeScreenProps {
  onStartRide: (destination?: LocationItem) => void;
  onNavigate: (screen: ScreenId) => void;
  userName: string;
  currentOrigin?: LocationItem;
  onRefreshGPS?: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onStartRide,
  onNavigate,
  userName = 'Martín',
  currentOrigin,
  onRefreshGPS,
}) => {
  const casa = MOCK_LOCATIONS.find((l) => l.id === 'loc-casa') || MOCK_LOCATIONS[0];
  const trabajo = MOCK_LOCATIONS.find((l) => l.id === 'loc-trabajo') || MOCK_LOCATIONS[1];
  const costanera = MOCK_LOCATIONS.find((l) => l.id === 'loc-costanera') || MOCK_LOCATIONS[3];
  const isCloudOnline = isSupabaseConfigured();

  return (
    <div className="flex-1 flex flex-col bg-[#081226] text-white overflow-y-auto pb-24">
      {/* Top Map Section (Responsive & non-colliding overlays) */}
      <div className="relative h-[34vh] min-h-[230px] max-h-[320px] w-full shrink-0 overflow-hidden border-b border-[#33405A]/40">
        <MapView 
          origin={currentOrigin} 
          interactive={true} 
          showCars={true} 
          showControls={true}
          showBadge={false}
          controlsPosition="right-center"
          allowFullscreenToggle={true}
        />

        {/* Gradient dark overlay on bottom of map */}
        <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-[#081226] to-transparent pointer-events-none" />

        {/* Top Floating User Greeting & GPS Status Bar */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-auto z-20">
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#15213A]/95 backdrop-blur-md border border-[#33405A] shadow-lg max-w-[62%]">
            <div className="w-6 h-6 rounded-full overflow-hidden border border-[#F5B51B] bg-[#081226] shrink-0">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                alt="Usuario"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[9px] text-[#AEB7C8] leading-none">Hola,</span>
              <span className="text-xs font-bold text-white leading-tight truncate">{userName}</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Live GPS Status Indicator */}
            <div 
              onClick={() => {
                triggerHaptic('light');
                onRefreshGPS?.();
              }}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-[#15213A]/95 backdrop-blur-md border border-[#59C878]/50 shadow-md cursor-pointer hover:bg-[#202D47] active:scale-95 transition-all"
              title="GPS Satelital Activo • Tocá para actualizar ubicación"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#59C878] animate-ping" />
              <span className="text-[10px] font-bold text-[#59C878]">GPS Vivo</span>
            </div>

            {/* Lightning Instant Request Button */}
            <button
              type="button"
              onClick={() => {
                triggerHaptic('medium');
                onStartRide(trabajo);
              }}
              className="w-8 h-8 rounded-full bg-[#F5B51B] hover:bg-[#FFBE22] active:scale-95 text-[#081226] flex items-center justify-center shadow-[0_0_15px_rgba(245,181,27,0.5)] border border-white/40 transition-transform cursor-pointer"
              title="Pedir BearFlash rápido al destino habitual"
            >
              <Zap className="w-3.5 h-3.5 fill-[#081226] stroke-[#081226]" />
            </button>
          </div>
        </div>

        {/* Floating Current Location Pill */}
        {currentOrigin && (
          <div className="absolute bottom-2 inset-x-3 z-20 flex items-center justify-between px-3 py-1.5 rounded-xl bg-[#0D1930]/95 backdrop-blur-md border border-[#F5B51B]/40 shadow-xl pointer-events-auto">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-5 h-5 rounded-full bg-[#F5B51B]/20 border border-[#F5B51B] flex items-center justify-center text-[#F5B51B] shrink-0">
                <LocateFixed className="w-3 h-3" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[9px] text-[#AEB7C8] uppercase font-bold tracking-wider leading-none">
                  Ubicación actual en Formosa
                </span>
                <span className="text-xs font-bold text-white truncate">
                  {currentOrigin.name || currentOrigin.address}
                </span>
              </div>
            </div>
            {onRefreshGPS && (
              <button
                type="button"
                onClick={() => {
                  triggerHaptic('light');
                  onRefreshGPS();
                }}
                className="text-[10px] text-[#F5B51B] hover:underline font-bold shrink-0 ml-2 cursor-pointer"
              >
                Actualizar
              </button>
            )}
          </div>
        )}
      </div>

      {/* Main Content Section */}
      <div className="px-3.5 pt-3 flex flex-col gap-3.5">
        {/* Search destination trigger bar */}
        <div
          onClick={() => {
            triggerHaptic('light');
            onNavigate('search');
          }}
          className="w-full bg-[#15213A] hover:bg-[#202D47] border border-[#33405A] hover:border-[#F5B51B] rounded-2xl p-3.5 shadow-xl cursor-pointer transition-all flex items-center justify-between group active:scale-[0.99]"
        >
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-[#0D1930] border border-[#33405A] flex items-center justify-center text-[#F5B51B] group-hover:scale-105 transition-transform shrink-0">
              <Search className="w-4 h-4" />
            </div>
            <div className="flex flex-col text-left min-w-0">
              <span className="text-sm font-bold text-white tracking-tight">¿A dónde vas?</span>
              <span className="text-[11px] text-[#AEB7C8] truncate">Elegí tu destino en Formosa</span>
            </div>
          </div>
          <div className="w-7 h-7 rounded-full bg-[#202D47] flex items-center justify-center text-[#AEB7C8] group-hover:text-[#F5B51B] shrink-0">
            <Clock className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Live Connectivity Banner */}
        <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-[#0D1930] border border-[#33405A] text-[10px]">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#59C878]" />
            <span className="text-[#AEB7C8]">
              Supabase: <strong className="text-white">{isCloudOnline ? 'Cloud Sync Online' : 'Modo Offline'}</strong>
            </span>
          </div>
          <span className="text-[#F5B51B] font-bold">Mapbox Vector v5</span>
        </div>

        {/* Ecosystem & BearPoints Navigation Pills */}
        <div className="grid grid-cols-2 gap-2">
          <div
            onClick={() => {
              triggerHaptic('light');
              onNavigate('conceptual-map');
            }}
            className="p-2.5 rounded-2xl bg-[#0D1930] hover:bg-[#15213A] border border-[#F5B51B]/40 cursor-pointer transition-all flex items-center gap-2 shadow-md group active:scale-[0.98]"
          >
            <div className="w-7 h-7 rounded-xl bg-[#081226] border border-[#F5B51B] flex items-center justify-center text-xs shrink-0">
              🗺️
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-white group-hover:text-[#F5B51B] transition-colors truncate">
                Mapa Conceptual
              </span>
              <span className="text-[9px] text-[#AEB7C8] truncate">8 Pilares de Negocio</span>
            </div>
          </div>

          <div
            onClick={() => {
              triggerHaptic('light');
              onNavigate('bear-points');
            }}
            className="p-2.5 rounded-2xl bg-[#0D1930] hover:bg-[#15213A] border border-[#59C878]/40 cursor-pointer transition-all flex items-center gap-2 shadow-md group active:scale-[0.98]"
          >
            <div className="w-7 h-7 rounded-xl bg-[#081226] border border-[#59C878] flex items-center justify-center text-xs shrink-0">
              🎁
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-[#59C878] truncate">1.250 BearPoints</span>
              <span className="text-[9px] text-[#AEB7C8] truncate">Canjear premios</span>
            </div>
          </div>
        </div>

        {/* Quick Favorite Destinations Grid (Casa / Trabajo) */}
        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              onStartRide(casa);
            }}
            className="flex items-center gap-2.5 p-3 rounded-2xl bg-[#15213A] border border-[#33405A] hover:border-[#F5B51B]/60 text-left transition-all active:scale-[0.98] shadow-md group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-[#0D1930] flex items-center justify-center text-[#F5B51B] shrink-0 border border-[#33405A]">
              <HomeIcon className="w-4 h-4" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-white truncate">Casa</span>
              <span className="text-[10px] text-[#AEB7C8] truncate">{casa.address}</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              onStartRide(trabajo);
            }}
            className="flex items-center gap-2.5 p-3 rounded-2xl bg-[#15213A] border border-[#33405A] hover:border-[#59C878]/60 text-left transition-all active:scale-[0.98] shadow-md group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-[#0D1930] flex items-center justify-center text-[#59C878] shrink-0 border border-[#33405A]">
              <Briefcase className="w-4 h-4" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-white truncate">Trabajo</span>
              <span className="text-[10px] text-[#AEB7C8] truncate">{trabajo.address}</span>
            </div>
          </button>
        </div>

        {/* Promo Launch Banner */}
        <div
          onClick={() => {
            triggerHaptic('light');
            onNavigate('promos');
          }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#15213A] via-[#202D47] to-[#15213A] border border-[#F5B51B]/40 p-3.5 shadow-xl cursor-pointer group active:scale-[0.99]"
        >
          <div className="flex items-center justify-between">
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-[#F5B51B] text-[#081226]">
                  PROMO
                </span>
                <span className="text-xs text-[#FFD66A] font-semibold">Código: BEAR20</span>
              </div>
              <h3 className="text-sm font-black text-white mt-1">20% OFF en tu primer viaje</h3>
              <p className="text-[10px] text-[#AEB7C8] truncate">Válido en toda Formosa • Tocá para ver promos</p>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-[#081226] border border-[#F5B51B] flex items-center justify-center text-xl shadow-inner shrink-0 group-hover:scale-105 transition-transform ml-2">
              🐻
            </div>
          </div>
        </div>

        {/* Ride Categories Quick Selection Cards */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h3 className="text-[11px] font-extrabold uppercase tracking-wider text-[#AEB7C8]">
              Elegí tu categoría
            </h3>
            <button
              type="button"
              onClick={() => {
                triggerHaptic('light');
                onNavigate('select-ride');
              }}
              className="text-xs font-semibold text-[#F5B51B] hover:underline flex items-center gap-1 cursor-pointer"
            >
              Ver todas <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {RIDE_CATEGORIES.slice(0, 4).map((cat) => (
              <div
                key={cat.id}
                onClick={() => {
                  triggerHaptic('selection');
                  onStartRide(costanera);
                }}
                className="bg-[#15213A] hover:bg-[#202D47] border border-[#33405A] hover:border-[#F5B51B] rounded-xl p-2.5 cursor-pointer transition-all flex flex-col justify-between active:scale-[0.98]"
              >
                <div className="flex items-center justify-between">
                  <span className="text-lg">
                    {cat.iconType === 'flash'
                      ? '⚡'
                      : cat.iconType === 'car'
                      ? '🚗'
                      : cat.iconType === 'premium'
                      ? '⭐'
                      : '🌱'}
                  </span>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#0D1930] text-[#FFD66A] border border-[#33405A]">
                    {cat.etaMinutes} min
                  </span>
                </div>
                <div className="mt-1.5">
                  <div className="text-xs font-bold text-white truncate">{cat.name}</div>
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
          onClick={() => {
            triggerHaptic('heavy');
            onStartRide();
          }}
          className="w-full mt-1 bg-[#F5B51B] hover:bg-[#FFBE22] active:scale-[0.98] text-[#081226] font-black py-3.5 px-5 rounded-2xl flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(245,181,27,0.35)] transition-all cursor-pointer text-sm"
        >
          <span>Solicitar viaje en Formosa</span>
          <ArrowRight className="w-4 h-4 stroke-[3]" />
        </button>
      </div>
    </div>
  );
};

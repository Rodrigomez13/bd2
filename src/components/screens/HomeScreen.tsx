import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Home as HomeIcon, 
  Briefcase, 
  MapPin, 
  Zap, 
  ArrowRight, 
  Tag, 
  Clock, 
  ShieldCheck, 
  ChevronRight, 
  LocateFixed, 
  Sparkles,
  Gift,
  Award,
  Layers,
  X,
  Check,
  Compass
} from 'lucide-react';
import { MapView } from '../MapView';
import { LocationItem, ScreenId } from '../../types';
import { MOCK_LOCATIONS, RIDE_CATEGORIES } from '../../data/mockData';
import { isSupabaseConfigured } from '../../services/supabaseClient';
import { triggerHaptic } from '../../utils/haptics';
import { PromosModal } from '../modals/PromosModal';
import { BearPointsModal } from '../modals/BearPointsModal';
import { ConceptualMapModal } from '../modals/ConceptualMapModal';

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
  const isCloudOnline = isSupabaseConfigured();

  // Selected destination directly from map click
  const [tappedMapLocation, setTappedMapLocation] = useState<LocationItem | null>(null);

  // Modals state
  const [isPromosModalOpen, setIsPromosModalOpen] = useState(false);
  const [isPointsModalOpen, setIsPointsModalOpen] = useState(false);
  const [isConceptualModalOpen, setIsConceptualModalOpen] = useState(false);

  // Floating rotating announcement messages
  const [activeAnnouncementIndex, setActiveAnnouncementIndex] = useState(0);
  const announcements = [
    {
      id: 'promo-1',
      icon: '🎁',
      badge: 'CUPÓN 20% OFF',
      text: 'Código BEAR20 en tu primer viaje',
      action: () => setIsPromosModalOpen(true),
    },
    {
      id: 'speed-2',
      icon: '⚡',
      badge: 'BEARFLASH',
      text: 'Llega en 2 min en Formosa Centro',
      action: () => onStartRide(trabajo),
    },
    {
      id: 'points-3',
      icon: '⭐',
      badge: '1.250 PTS',
      text: 'Tenés BearPoints para canjear',
      action: () => setIsPointsModalOpen(true),
    },
    {
      id: 'security-4',
      icon: '🛡️',
      badge: 'SAS FORMOSA',
      text: 'Conductores 100% habilitados',
      action: () => setIsConceptualModalOpen(true),
    },
  ];

  // Rotate announcement chip every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveAnnouncementIndex((prev) => (prev + 1) % announcements.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [announcements.length]);

  // Handle map click: user taps on map to set a destination!
  const handleMapClick = (point: { lat: number; lng: number; name: string; address: string }) => {
    triggerHaptic('medium');
    const loc: LocationItem = {
      id: `map-tap-${Date.now()}`,
      name: point.name || 'Punto en el mapa',
      address: point.address || `GPS: ${point.lat.toFixed(4)}, ${point.lng.toFixed(4)}`,
      city: 'Formosa',
      lat: point.lat,
      lng: point.lng,
      type: 'recent',
      category: 'Seleccionado en mapa',
    };
    setTappedMapLocation(loc);
  };

  const handleConfirmTappedRide = () => {
    if (!tappedMapLocation) return;
    triggerHaptic('heavy');
    onStartRide(tappedMapLocation);
    setTappedMapLocation(null);
  };

  const currentAnnouncement = announcements[activeAnnouncementIndex];

  return (
    <div className="flex-1 flex flex-col bg-[#081226] text-white overflow-y-auto pb-24 relative">
      {/* Top Map Section - Clean, interactive without default address blocking */}
      <div className="relative h-[38vh] min-h-[260px] max-h-[360px] w-full shrink-0 overflow-hidden border-b border-[#33405A]/40">
        <MapView 
          origin={currentOrigin} 
          destination={tappedMapLocation}
          onMapClick={handleMapClick}
          interactive={true} 
          showCars={true} 
          showControls={true}
          showBadge={false}
          controlsPosition="right-center"
          allowFullscreenToggle={true}
        />

        {/* Gradient dark overlay on bottom of map */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#081226] to-transparent pointer-events-none" />

        {/* Top Floating User Greeting & Status Bar */}
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

            {/* Floating Promos Button */}
            <button
              type="button"
              onClick={() => {
                triggerHaptic('light');
                setIsPromosModalOpen(true);
              }}
              className="w-8 h-8 rounded-full bg-[#15213A]/95 backdrop-blur-md border border-[#F5B51B]/60 text-[#F5B51B] flex items-center justify-center shadow-lg active:scale-95 transition-transform cursor-pointer relative"
              title="Ver Promos y Cupones"
            >
              <Gift className="w-3.5 h-3.5" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#F5B51B] animate-pulse" />
            </button>
          </div>
        </div>

        {/* Floating Announcement / Promo Message Chip on Map */}
        <div className="absolute top-14 inset-x-3 z-20 flex justify-center pointer-events-auto">
          <div
            onClick={() => {
              triggerHaptic('light');
              currentAnnouncement.action();
            }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0D1930]/90 backdrop-blur-md border border-[#F5B51B]/40 shadow-lg cursor-pointer hover:border-[#F5B51B] transition-all active:scale-95 group max-w-full"
          >
            <span className="text-xs">{currentAnnouncement.icon}</span>
            <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-[#F5B51B] text-[#081226] tracking-wider">
              {currentAnnouncement.badge}
            </span>
            <span className="text-[11px] font-bold text-white group-hover:text-[#F5B51B] truncate transition-colors">
              {currentAnnouncement.text}
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-[#F5B51B] shrink-0" />
          </div>
        </div>

        {/* Floating Tapped Map Destination Emergent Card */}
        {tappedMapLocation && (
          <div className="absolute bottom-2 inset-x-2.5 z-30 p-3 rounded-2xl bg-[#0D1930]/95 backdrop-blur-md border-2 border-[#F5B51B] shadow-2xl flex flex-col gap-2 pointer-events-auto animate-in slide-in-from-bottom-2 duration-200">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-2 min-w-0">
                <div className="w-7 h-7 rounded-xl bg-[#15213A] border border-[#F5B51B] flex items-center justify-center text-[#F5B51B] shrink-0 mt-0.5">
                  <MapPin className="w-3.5 h-3.5" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[9px] uppercase font-extrabold text-[#F5B51B] tracking-wider leading-none">
                    Punto marcado en mapa
                  </span>
                  <span className="text-xs font-bold text-white truncate mt-0.5">
                    {tappedMapLocation.name}
                  </span>
                  <span className="text-[10px] text-[#AEB7C8] truncate">
                    {tappedMapLocation.address}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  triggerHaptic('light');
                  setTappedMapLocation(null);
                }}
                className="p-1 text-[#AEB7C8] hover:text-white cursor-pointer"
                title="Desmarcar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setTappedMapLocation(null)}
                className="px-3 py-2 rounded-xl bg-[#15213A] border border-[#33405A] text-[#AEB7C8] hover:text-white text-xs font-bold transition-all cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmTappedRide}
                className="flex-1 bg-[#F5B51B] hover:bg-[#FFBE22] active:scale-95 text-[#081226] font-black py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md cursor-pointer transition-all"
              >
                <span>Pedir viaje aquí</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
              </button>
            </div>
          </div>
        )}

        {/* Map interaction tip hint (if not tapped) */}
        {!tappedMapLocation && (
          <div className="absolute bottom-2 inset-x-4 z-10 flex justify-center pointer-events-none">
            <span className="text-[10px] text-[#AEB7C8] bg-[#081226]/80 backdrop-blur-sm px-3 py-1 rounded-full border border-[#33405A]/40 font-medium">
              Tocá cualquier punto del mapa para fijar destino
            </span>
          </div>
        )}
      </div>

      {/* Main Controls & Search Section */}
      <div className="px-3.5 pt-3 flex flex-col gap-3">
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

        {/* Floating Shortcuts Pills Row (Emergent Modals Triggers) */}
        <div className="grid grid-cols-3 gap-2">
          {/* Promos Pill */}
          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              setIsPromosModalOpen(true);
            }}
            className="p-2 rounded-2xl bg-[#0D1930] hover:bg-[#15213A] border border-[#F5B51B]/40 cursor-pointer transition-all flex flex-col items-center justify-center text-center shadow-sm active:scale-95"
          >
            <span className="text-base mb-0.5">🎁</span>
            <span className="text-[11px] font-bold text-white">Promos</span>
            <span className="text-[9px] text-[#F5B51B] font-extrabold">-20% OFF</span>
          </button>

          {/* BearPoints Pill */}
          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              setIsPointsModalOpen(true);
            }}
            className="p-2 rounded-2xl bg-[#0D1930] hover:bg-[#15213A] border border-[#59C878]/40 cursor-pointer transition-all flex flex-col items-center justify-center text-center shadow-sm active:scale-95"
          >
            <span className="text-base mb-0.5">⭐</span>
            <span className="text-[11px] font-bold text-white">Puntos</span>
            <span className="text-[9px] text-[#59C878] font-bold">1.250 pts</span>
          </button>

          {/* Pillars & Architecture Pill */}
          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              setIsConceptualModalOpen(true);
            }}
            className="p-2 rounded-2xl bg-[#0D1930] hover:bg-[#15213A] border border-[#33405A] hover:border-[#F5B51B]/50 cursor-pointer transition-all flex flex-col items-center justify-center text-center shadow-sm active:scale-95"
          >
            <span className="text-base mb-0.5">🗺️</span>
            <span className="text-[11px] font-bold text-white">Pilares</span>
            <span className="text-[9px] text-[#AEB7C8]">SAS Formosa</span>
          </button>
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

        {/* Ride Categories Quick Selection Cards */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h3 className="text-[11px] font-extrabold uppercase tracking-wider text-[#AEB7C8]">
              Categorías de Viaje
            </h3>
            <button
              type="button"
              onClick={() => {
                triggerHaptic('light');
                onNavigate('select-ride');
              }}
              className="text-xs font-semibold text-[#F5B51B] hover:underline flex items-center gap-1 cursor-pointer"
            >
              Ver tarifas <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {RIDE_CATEGORIES.slice(0, 4).map((cat) => (
              <div
                key={cat.id}
                onClick={() => {
                  triggerHaptic('selection');
                  onStartRide(casa);
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

      {/* Emergent Modals */}
      <PromosModal
        isOpen={isPromosModalOpen}
        onClose={() => setIsPromosModalOpen(false)}
        onApplyPromo={(code) => {
          onNavigate('select-ride');
        }}
      />

      <BearPointsModal
        isOpen={isPointsModalOpen}
        onClose={() => setIsPointsModalOpen(false)}
        onApplyReward={(reward) => {
          onNavigate('select-ride');
        }}
      />

      <ConceptualMapModal
        isOpen={isConceptualModalOpen}
        onClose={() => setIsConceptualModalOpen(false)}
      />
    </div>
  );
};

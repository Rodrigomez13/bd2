import React, { useState } from 'react';
import { CreditCard, MapPin, UserPlus, Settings, Star, ChevronRight, HelpCircle, Shield, Award, LogOut, Car, Sparkles, CheckCircle2 } from 'lucide-react';
import { ScreenId } from '../../types';
import { INITIAL_USER, MOCK_TRIP_HISTORY } from '../../data/mockData';

interface AccountScreenProps {
  onNavigate: (screen: ScreenId) => void;
  onLogout: () => void;
}

export const AccountScreen: React.FC<AccountScreenProps> = ({ onNavigate, onLogout }) => {
  const user = INITIAL_USER;
  const recentTrips = MOCK_TRIP_HISTORY.slice(0, 2);
  const [feedback, setFeedback] = useState<string | null>(null);

  const notify = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 2500);
  };

  return (
    <div className="min-h-[640px] flex flex-col bg-[#081226] text-white p-4 overflow-y-auto relative">
      {/* Inline Feedback Toast */}
      {feedback && (
        <div className="mb-3 p-3 rounded-2xl bg-[#15213A] border border-[#59C878] text-xs text-white font-bold flex items-center gap-2 shadow-lg animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-[#59C878] shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Profile Header Box (Image 4 style) */}
      <div className="p-4 rounded-2xl bg-[#15213A] border border-[#33405A] shadow-xl flex items-center justify-between mb-4">
        <div className="flex items-center gap-3.5">
          <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-[#F5B51B] bg-[#0D1930] shrink-0">
            <img
              src={user.avatarUrl}
              alt={user.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col">
            <h2 className="text-lg font-black text-white">{user.fullName}</h2>
            <div className="flex items-center gap-1.5 text-xs text-[#FFD66A] font-bold">
              <Star className="w-3.5 h-3.5 fill-[#F5B51B] text-[#F5B51B]" />
              <span>{user.rating} Pasajero VIP</span>
            </div>
            <span className="text-[11px] text-[#AEB7C8]">{user.phone}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => notify('Perfil 100% verificado por BearDrive Security')}
          className="text-xs text-[#F5B51B] font-semibold hover:underline bg-[#0D1930] px-3 py-1.5 rounded-xl border border-[#33405A]"
        >
          Verificado ✓
        </button>
      </div>

      {/* 4 Action Quick Cards Grid (Image 4) */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div
          onClick={() => onNavigate('bear-points')}
          className="p-3.5 rounded-2xl bg-[#15213A] border border-[#59C878]/60 hover:border-[#59C878] cursor-pointer transition-all shadow-sm flex flex-col gap-1.5"
        >
          <Sparkles className="w-5 h-5 text-[#59C878]" />
          <span className="text-xs font-bold text-[#59C878] leading-tight">BearPoints (1.250)</span>
          <span className="text-[10px] text-[#AEB7C8]">Canjear premios</span>
        </div>

        <div
          onClick={() => onNavigate('payments')}
          className="p-3.5 rounded-2xl bg-[#15213A] border border-[#33405A] hover:border-[#F5B51B] cursor-pointer transition-all shadow-sm flex flex-col gap-1.5"
        >
          <CreditCard className="w-5 h-5 text-[#F5B51B]" />
          <span className="text-xs font-bold text-white leading-tight">Métodos de pago</span>
          <span className="text-[10px] text-[#AEB7C8]">Directo / QR MP</span>
        </div>

        <div
          onClick={() => onNavigate('driver-onboarding')}
          className="p-3.5 rounded-2xl bg-[#15213A] border border-[#33405A] hover:border-[#F5B51B] cursor-pointer transition-all shadow-sm flex flex-col gap-1.5"
        >
          <Shield className="w-5 h-5 text-[#F5B51B]" />
          <span className="text-xs font-bold text-white leading-tight">Habilitación Chofer</span>
          <span className="text-[10px] text-[#AEB7C8]">8 documentos / RTO</span>
        </div>

        <div
          onClick={() => onNavigate('admin-panel')}
          className="p-3.5 rounded-2xl bg-[#15213A] border border-[#33405A] hover:border-[#F5B51B] cursor-pointer transition-all shadow-sm flex flex-col gap-1.5"
        >
          <Settings className="w-5 h-5 text-[#F5B51B]" />
          <span className="text-xs font-bold text-white leading-tight">Panel Admin</span>
          <span className="text-[10px] text-[#AEB7C8]">Backoffice SAS</span>
        </div>
      </div>

      {/* Conceptual Architecture Access Banner */}
      <div
        onClick={() => onNavigate('conceptual-map')}
        className="relative overflow-hidden p-4 rounded-2xl bg-gradient-to-r from-[#202D47] via-[#15213A] to-[#202D47] border border-[#F5B51B]/50 shadow-md mb-5 cursor-pointer hover:border-[#F5B51B] transition-colors"
      >
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 text-xs font-black text-[#F5B51B]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>MAPA CONCEPTUAL & ARQUITECTURA</span>
            </div>
            <p className="text-xs text-[#AEB7C8] mt-1">
              8 Pilares, 7 Fases de Viaje y Modelo Económico SAS de Formosa.
            </p>
          </div>
          <Award className="w-8 h-8 text-[#FFD66A] shrink-0" />
        </div>
      </div>

      {/* Viajes recientes section */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-2.5 px-1">
          <h3 className="text-sm font-bold text-white">Viajes recientes</h3>
          <button
            type="button"
            onClick={() => onNavigate('history')}
            className="text-xs text-[#F5B51B] font-semibold hover:underline"
          >
            Ver todo
          </button>
        </div>

        <div className="flex flex-col gap-2.5">
          {recentTrips.map((trip) => (
            <div
              key={trip.id}
              onClick={() => onNavigate('history')}
              className="p-3.5 rounded-2xl bg-[#15213A] border border-[#33405A] hover:border-[#33405A] flex flex-col gap-2 cursor-pointer shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#AEB7C8] font-medium">{trip.date}</span>
                <span className="text-base font-black text-[#F5B51B]">
                  ${trip.price.toLocaleString('es-AR')}
                </span>
              </div>

              <div className="flex flex-col gap-1 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#F5B51B]" />
                  <span className="text-white truncate">{trip.origin}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#FF4B4B]" />
                  <span className="text-white font-semibold truncate">{trip.destination}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Driver Mode Toggle and Logout */}
      <div className="flex flex-col gap-2 mt-auto pt-4 border-t border-[#33405A]/40">
        <button
          type="button"
          onClick={() => onNavigate('driver-mode')}
          className="w-full p-3.5 rounded-2xl bg-[#202D47] border border-[#F5B51B] text-[#F5B51B] font-bold text-xs flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform"
        >
          <Car className="w-4 h-4" />
          <span>Cambiar al Modo Conductor →</span>
        </button>

        <button
          type="button"
          onClick={onLogout}
          className="w-full p-3 rounded-xl text-xs text-[#AEB7C8] hover:text-red-400 font-semibold flex items-center justify-center gap-1.5 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </div>
  );
};

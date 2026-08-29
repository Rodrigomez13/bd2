import React from 'react';
import { Star, Phone, MessageSquare, Share2, Shield, User, ArrowRight, CheckCircle2 } from 'lucide-react';
import { MapView } from '../MapView';
import { ActiveTripState, DriverInfo } from '../../types';

interface DriverFoundScreenProps {
  trip: ActiveTripState;
  onStartTrip: () => void;
  onOpenProfile: (driver: DriverInfo) => void;
  onOpenChat: () => void;
  onOpenShare: () => void;
  onCancel: () => void;
}

export const DriverFoundScreen: React.FC<DriverFoundScreenProps> = ({
  trip,
  onStartTrip,
  onOpenProfile,
  onOpenChat,
  onOpenShare,
  onCancel,
}) => {
  const driver = trip.driver;

  return (
    <div className="relative min-h-[640px] flex flex-col bg-[#081226] text-white">
      {/* Top Map with Approaching Vehicle Animation */}
      <div className="relative h-72 w-full overflow-hidden border-b border-[#33405A]/40">
        <MapView
          origin={trip.origin}
          destination={trip.destination}
          driverApproaching={true}
          interactive={false}
        />

        {/* ETA Badge */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-[#15213A]/95 backdrop-blur-md border border-[#F5B51B] shadow-xl flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#59C878] animate-ping" />
          <span className="text-xs font-extrabold text-white">
            Tu conductor llega en ~2 min
          </span>
        </div>
      </div>

      {/* Driver Card Sheet */}
      <div className="relative z-10 flex-1 px-4 py-4 flex flex-col justify-between">
        <div className="flex flex-col gap-3">
          {/* Driver Profile Summary Card */}
          <div className="p-4 rounded-2xl bg-[#15213A] border border-[#33405A] shadow-2xl flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div
                onClick={() => onOpenProfile(driver)}
                className="relative w-14 h-14 rounded-full border-2 border-[#F5B51B] overflow-hidden cursor-pointer shrink-0 shadow-lg group"
              >
                <img
                  src={driver.avatarUrl}
                  alt={driver.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute bottom-0 inset-x-0 bg-[#081226]/80 text-[9px] font-bold text-center text-[#FFD66A] py-0.5">
                  ★ {driver.rating}
                </div>
              </div>

              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white">{driver.name}</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#0D1930] text-[#59C878] border border-[#59C878]/40">
                    VERIFICADO
                  </span>
                </div>
                <p className="text-xs text-[#AEB7C8] font-medium">
                  {driver.vehicleModel} • {driver.vehicleColor}
                </p>
                <span className="text-xs font-mono font-bold text-[#FFD66A] tracking-wider mt-0.5">
                  Patente: {driver.plate}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onOpenProfile(driver)}
              className="text-xs text-[#F5B51B] font-semibold hover:underline bg-[#0D1930] px-3 py-1.5 rounded-xl border border-[#33405A]"
            >
              Ver perfil
            </button>
          </div>

          {/* Quick Communication Actions (Chat, Call, Share) */}
          <div className="grid grid-cols-3 gap-2.5">
            <button
              type="button"
              onClick={onOpenChat}
              className="flex items-center justify-center gap-1.5 py-3 px-2 rounded-xl bg-[#15213A] border border-[#33405A] hover:border-[#F5B51B] text-xs font-semibold text-white active:scale-95 transition-all shadow-md"
            >
              <MessageSquare className="w-4 h-4 text-[#F5B51B]" />
              <span>Mensaje</span>
            </button>

            <button
              type="button"
              onClick={onOpenChat}
              className="flex items-center justify-center gap-1.5 py-3 px-2 rounded-xl bg-[#15213A] border border-[#33405A] hover:border-[#F5B51B] text-xs font-semibold text-white active:scale-95 transition-all shadow-md"
            >
              <Phone className="w-4 h-4 text-[#59C878]" />
              <span>Llamar</span>
            </button>

            <button
              type="button"
              onClick={onOpenShare}
              className="flex items-center justify-center gap-1.5 py-3 px-2 rounded-xl bg-[#15213A] border border-[#33405A] hover:border-[#F5B51B] text-xs font-semibold text-white active:scale-95 transition-all shadow-md"
            >
              <Share2 className="w-4 h-4 text-[#FFD66A]" />
              <span>Compartir</span>
            </button>
          </div>

          {/* Trip Fare & Pickup Summary */}
          <div className="p-3.5 rounded-xl bg-[#0D1930] border border-[#33405A] flex items-center justify-between text-xs">
            <div className="flex flex-col">
              <span className="text-[#AEB7C8]">Punto de encuentro:</span>
              <span className="text-white font-bold truncate max-w-[200px]">
                {trip.origin.address}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[#AEB7C8]">Total a pagar:</span>
              <div className="text-sm font-black text-[#F5B51B]">
                ${trip.price.toLocaleString('es-AR')}
              </div>
            </div>
          </div>
        </div>

        {/* Start / Simulate Trip CTA */}
        <div className="flex flex-col gap-2 mt-4">
          <button
            type="button"
            onClick={onStartTrip}
            className="w-full bg-[#F5B51B] hover:bg-[#FFBE22] active:scale-[0.98] text-[#081226] font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(245,181,27,0.35)] transition-all cursor-pointer text-base"
          >
            <span>Subir al vehículo e Iniciar Viaje</span>
            <ArrowRight className="w-5 h-5 stroke-[2.5]" />
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="text-xs text-[#AEB7C8] hover:text-white py-1 text-center font-medium"
          >
            Cancelar viaje
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useEffect, useState } from 'react';
import { X, ShieldCheck, Zap, Car } from 'lucide-react';
import { BearMascotIllustration } from '../BearMascotIllustration';
import { ActiveTripState } from '../../types';
import { triggerHaptic } from '../../utils/haptics';

interface SearchingDriverScreenProps {
  trip: ActiveTripState;
  onDriverFound: () => void;
  onCancel: () => void;
}

export const SearchingDriverScreen: React.FC<SearchingDriverScreenProps> = ({
  trip,
  onDriverFound,
  onCancel,
}) => {
  const [seconds, setSeconds] = useState(4);

  useEffect(() => {
    // Separate display countdown from triggering completion to avoid state updater side-effects
    const interval = setInterval(() => {
      setSeconds((prev) => (prev > 1 ? prev - 1 : 0));
    }, 1000);

    const completionTimer = setTimeout(() => {
      triggerHaptic('success');
      onDriverFound();
    }, 4000);

    return () => {
      clearInterval(interval);
      clearTimeout(completionTimer);
    };
  }, [onDriverFound]);

  return (
    <div className="min-h-[640px] flex flex-col justify-between bg-[#081226] text-white p-6 relative overflow-hidden">
      {/* Top Status */}
      <div className="flex items-center justify-between z-10">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#15213A] border border-[#33405A]">
          <ShieldCheck className="w-4 h-4 text-[#59C878]" />
          <span className="text-xs text-[#AEB7C8]">Monitoreo 24/7</span>
        </div>
        <button
          type="button"
          onClick={() => {
            triggerHaptic('medium');
            onDriverFound();
          }}
          className="text-xs text-[#F5B51B] font-semibold hover:underline cursor-pointer"
        >
          Acelerar demo →
        </button>
      </div>

      {/* Center Radar Animation */}
      <div className="my-auto flex flex-col items-center justify-center text-center z-10">
        <BearMascotIllustration variant="radar-search" className="mb-2" />

        <h2 className="text-2xl font-black text-white tracking-tight">Buscando conductor...</h2>
        <p className="text-xs text-[#AEB7C8] max-w-xs mt-1.5 leading-relaxed">
          Ofertando tu viaje a conductores verificados cercanos en Formosa.
        </p>

        {/* Pulse countdown badge */}
        <div className="mt-4 px-4 py-1.5 rounded-full bg-[#15213A] border border-[#F5B51B]/40 text-xs font-bold text-[#F5B51B] shadow-lg">
          Respuesta estimada: {seconds}s
        </div>
      </div>

      {/* Trip Details Card & Cancel Button */}
      <div className="z-10 flex flex-col gap-3">
        <div className="p-4 rounded-2xl bg-[#15213A] border border-[#33405A] shadow-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0D1930] flex items-center justify-center text-xl border border-[#33405A]">
              {trip.category.iconType === 'flash' ? '⚡' : '🚗'}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-white">{trip.category.name}</span>
              <span className="text-xs text-[#AEB7C8] truncate max-w-[180px]">
                {trip.origin.name} → {trip.destination.name}
              </span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-sm font-extrabold text-[#F5B51B]">
              ${trip.price.toLocaleString('es-AR')}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            triggerHaptic('error');
            onCancel();
          }}
          className="w-full bg-[#15213A] hover:bg-[#202D47] border border-[#33405A] text-white font-bold py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] text-sm cursor-pointer"
        >
          <X className="w-4 h-4 text-red-400" />
          <span>Cancelar búsqueda</span>
        </button>
      </div>
    </div>
  );
};

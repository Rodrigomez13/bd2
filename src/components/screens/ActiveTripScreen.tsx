import React, { useEffect, useState } from 'react';
import { Navigation, ShieldAlert, Phone, MessageSquare, Share2, CheckCircle, Compass, Zap, MapPin } from 'lucide-react';
import { MapView } from '../MapView';
import { ActiveTripState } from '../../types';

interface ActiveTripScreenProps {
  trip: ActiveTripState;
  onFinishTrip: () => void;
  onOpenChat: () => void;
  onOpenShare: () => void;
  onEmergencySOS: () => void;
}

export const ActiveTripScreen: React.FC<ActiveTripScreenProps> = ({
  trip,
  onFinishTrip,
  onOpenChat,
  onOpenShare,
  onEmergencySOS,
}) => {
  const [progress, setProgress] = useState(15);
  const [speed, setSpeed] = useState(44);

  // Smoothly advance vehicle along the road for live demo
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 98) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1.5;
      });

      // Fluctuate speed realistically between 38 and 52 km/h
      setSpeed(40 + Math.floor(Math.sin(Date.now() / 1000) * 8));
    }, 800);

    return () => clearInterval(interval);
  }, []);

  const remainingDistance = ((1 - progress / 100) * 3.8).toFixed(1);
  const remainingTime = Math.max(1, Math.round((1 - progress / 100) * 8));

  return (
    <div className="relative min-h-[640px] flex flex-col bg-[#081226] text-white">
      {/* Top Map Area with Live Navigation */}
      <div className="relative h-[340px] w-full overflow-hidden">
        <MapView
          origin={trip.origin}
          destination={trip.destination}
          isNavigating={true}
          progress={progress}
          interactive={false}
        />

        {/* Top Turn-by-Turn Instruction Banner */}
        <div className="absolute top-4 inset-x-4 z-20">
          <div className="p-3.5 rounded-2xl bg-[#15213A]/95 backdrop-blur-md border border-[#F5B51B] shadow-2xl flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-[#F5B51B] flex items-center justify-center text-[#081226] shrink-0 font-extrabold shadow-md">
              <Navigation className="w-6 h-6 transform rotate-45" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[11px] font-extrabold text-[#F5B51B] uppercase tracking-wider">
                A 200 m • Girá a la derecha
              </span>
              <span className="text-sm font-bold text-white truncate">
                Av. 25 de Mayo y Fontana
              </span>
            </div>
          </div>
        </div>

        {/* Floating Speedometer & SOS Button */}
        <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-[#15213A]/90 backdrop-blur-md border border-[#33405A] flex flex-col items-center">
            <span className="text-xs font-black text-white">{speed}</span>
            <span className="text-[9px] text-[#AEB7C8] uppercase font-bold">km/h</span>
          </div>

          <button
            type="button"
            onClick={onEmergencySOS}
            className="px-3 py-2 rounded-xl bg-red-900/80 hover:bg-red-800 border border-red-500/60 backdrop-blur-md flex items-center gap-1.5 text-xs font-bold text-red-100 shadow-lg active:scale-95 transition-transform"
          >
            <ShieldAlert className="w-4 h-4 text-red-400" />
            <span>SOS</span>
          </button>
        </div>

        {/* Progress Bar over Map */}
        <div className="absolute bottom-0 inset-x-0 h-1.5 bg-[#0D1930]">
          <div
            className="h-full bg-gradient-to-r from-[#F5B51B] to-[#59C878] transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Bottom Live Trip Status & Controls */}
      <div className="relative z-10 flex-1 px-4 py-4 flex flex-col justify-between">
        <div className="flex flex-col gap-3">
          {/* Trip Progress Metrics */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#15213A] border border-[#33405A] shadow-md">
            <div className="flex flex-col">
              <span className="text-xs text-[#AEB7C8]">Tiempo restante</span>
              <span className="text-xl font-black text-white">{remainingTime} min</span>
            </div>
            <div className="h-8 w-px bg-[#33405A]" />
            <div className="flex flex-col">
              <span className="text-xs text-[#AEB7C8]">Distancia</span>
              <span className="text-xl font-black text-[#FFD66A]">{remainingDistance} km</span>
            </div>
            <div className="h-8 w-px bg-[#33405A]" />
            <div className="flex flex-col text-right">
              <span className="text-xs text-[#AEB7C8]">Destino</span>
              <span className="text-xs font-bold text-white truncate max-w-[90px]">
                {trip.destination.name}
              </span>
            </div>
          </div>

          {/* Driver mini info with Contact Actions */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#0D1930] border border-[#33405A]">
            <div className="flex items-center gap-2.5">
              <img
                src={trip.driver.avatarUrl}
                alt={trip.driver.name}
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-full border border-[#F5B51B] object-cover"
              />
              <div className="flex flex-col">
                <span className="text-xs font-bold text-white">{trip.driver.name}</span>
                <span className="text-[11px] text-[#AEB7C8]">
                  {trip.driver.vehicleModel} ({trip.driver.plate})
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onOpenChat}
                className="w-9 h-9 rounded-full bg-[#15213A] border border-[#33405A] flex items-center justify-center text-[#F5B51B] active:scale-95"
              >
                <MessageSquare className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={onOpenShare}
                className="w-9 h-9 rounded-full bg-[#15213A] border border-[#33405A] flex items-center justify-center text-[#FFD66A] active:scale-95"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Complete Trip Simulation Button */}
        <div className="mt-4">
          <button
            type="button"
            onClick={onFinishTrip}
            className="w-full bg-[#59C878] hover:bg-[#4eb369] active:scale-[0.98] text-[#081226] font-bold py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(89,200,120,0.35)] transition-all cursor-pointer text-sm"
          >
            <CheckCircle className="w-5 h-5 stroke-[2.5]" />
            <span>Completar viaje y pagar (${trip.price.toLocaleString('es-AR')})</span>
          </button>
        </div>
      </div>
    </div>
  );
};

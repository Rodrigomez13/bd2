import React, { useState } from 'react';
import { Power, DollarSign, Navigation, ShieldCheck, ThumbsUp, Star, ArrowLeft, CheckCircle2, Clock, Car } from 'lucide-react';
import { MapView } from '../MapView';
import { ScreenId } from '../../types';

interface DriverModeScreenProps {
  onBack: () => void;
  onNavigateToPassenger: () => void;
}

export const DriverModeScreen: React.FC<DriverModeScreenProps> = ({
  onBack,
  onNavigateToPassenger,
}) => {
  const [isOnline, setIsOnline] = useState(true);
  const [todayEarnings, setTodayEarnings] = useState(28450);
  const [completedRides, setCompletedRides] = useState(11);
  const [acceptedRide, setAcceptedRide] = useState<{ passengerName: string; origin: string; destination: string; fare: number } | null>(null);
  const [activeRequest, setActiveRequest] = useState<{
    id: string;
    passengerName: string;
    origin: string;
    destination: string;
    distance: string;
    suggestedFare: number;
    category: string;
  } | null>({
    id: 'req-201',
    passengerName: 'Valeria R.',
    origin: 'Av. 25 de Mayo 1420',
    destination: 'Costanera Vuelta Fermosa',
    distance: '3.4 km • 7 min',
    suggestedFare: 2600,
    category: 'BearFlash',
  });

  const handleAcceptRequest = () => {
    if (!activeRequest) return;
    setTodayEarnings((prev) => prev + activeRequest.suggestedFare);
    setCompletedRides((prev) => prev + 1);
    setAcceptedRide({
      passengerName: activeRequest.passengerName,
      origin: activeRequest.origin,
      destination: activeRequest.destination,
      fare: activeRequest.suggestedFare,
    });
    setActiveRequest(null);
  };

  const handleCounterOffer = (extra: number) => {
    if (!activeRequest) return;
    const newPrice = activeRequest.suggestedFare + extra;
    alert(`Se envió contraoferta por $${newPrice} a ${activeRequest.passengerName}.`);
  };

  return (
    <div className="min-h-[640px] flex flex-col bg-[#081226] text-white p-4 overflow-y-auto">
      {/* Top Driver Header with Online Toggle */}
      <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#15213A] border border-[#33405A] shadow-xl mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-[#F5B51B] overflow-hidden bg-[#0D1930]">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
              alt="Conductor"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-white">Martín (Conductor)</span>
            <div className="flex items-center gap-1.5 text-xs text-[#FFD66A]">
              <Star className="w-3.5 h-3.5 fill-[#F5B51B] text-[#F5B51B]" />
              <span>4.9 (1.2k viajes)</span>
            </div>
          </div>
        </div>

        {/* Online / Offline Switch */}
        <button
          type="button"
          onClick={() => setIsOnline(!isOnline)}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-md ${
            isOnline
              ? 'bg-[#59C878] text-[#081226]'
              : 'bg-[#202D47] text-[#AEB7C8] border border-[#33405A]'
          }`}
        >
          <Power className="w-3.5 h-3.5 stroke-[3]" />
          <span>{isOnline ? 'EN LÍNEA' : 'DESCONECTADO'}</span>
        </button>
      </div>

      {/* Today Earnings Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-[#15213A] via-[#202D47] to-[#15213A] border border-[#F5B51B]/40 shadow-xl mb-4 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-xs text-[#AEB7C8] font-semibold uppercase">
            Ganancias de hoy
          </span>
          <div className="text-2xl font-black text-[#F5B51B]">
            ${todayEarnings.toLocaleString('es-AR')}
          </div>
          <span className="text-[11px] text-[#59C878] font-bold mt-0.5">
            ✓ {completedRides} viajes completados hoy
          </span>
        </div>

        <div className="text-right">
          <span className="text-[11px] text-[#AEB7C8]">Membresía</span>
          <div className="text-xs font-bold text-white bg-[#0D1930] px-2.5 py-1 rounded-lg border border-[#33405A] mt-1">
            Diaria ($1.200)
          </div>
        </div>
      </div>

      {/* Map Radar Simulation */}
      <div className="h-44 w-full rounded-2xl overflow-hidden border border-[#33405A] mb-4 relative">
        <MapView interactive={false} showCars={true} />
        <div className="absolute top-2 left-2 px-2.5 py-1 rounded-full bg-[#15213A]/90 text-[10px] font-bold text-[#FFD66A] border border-[#33405A]">
          Zona de alta demanda: Centro & Costanera
        </div>
      </div>

      {/* Accepted ride status */}
      {acceptedRide && (
        <div className="p-4 rounded-2xl bg-[#15213A] border-2 border-[#59C878] shadow-2xl flex flex-col gap-3 mb-4" role="status" aria-live="polite">
          <div className="flex items-center justify-between">
            <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-[#59C878] text-[#081226]">Viaje asignado</span>
            <span className="text-lg font-black text-[#FFD66A]">${acceptedRide.fare.toLocaleString('es-AR')}</span>
          </div>
          <div className="text-xs text-white">
            <p className="font-bold">Pasajero: {acceptedRide.passengerName}</p>
            <p className="mt-1 text-[#AEB7C8]">Recogida: {acceptedRide.origin}</p>
            <p className="text-[#AEB7C8]">Destino: {acceptedRide.destination}</p>
          </div>
          <button type="button" onClick={() => setAcceptedRide(null)} className="w-full rounded-xl bg-[#59C878] py-2.5 text-xs font-black text-[#081226] hover:bg-[#4eb369]">
            Iniciar siguiente viaje
          </button>
        </div>
      )}

      {/* Incoming Ride Request Offer Card */}
      {isOnline && activeRequest && !acceptedRide ? (
        <div className="p-4 rounded-2xl bg-[#15213A] border-2 border-[#F5B51B] shadow-2xl flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-[#F5B51B] text-[#081226]">
                ¡NUEVA SOLICITUD!
              </span>
              <span className="text-xs text-white font-bold">{activeRequest.category}</span>
            </div>
            <span className="text-lg font-black text-[#F5B51B]">
              ${activeRequest.suggestedFare.toLocaleString('es-AR')}
            </span>
          </div>

          <div className="flex flex-col gap-1 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#F5B51B]" />
              <span className="text-white truncate">Desde: {activeRequest.origin}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FF4B4B]" />
              <span className="text-white font-bold truncate">
                Hasta: {activeRequest.destination}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-[#AEB7C8] pt-1">
            <span>Pasajero: {activeRequest.passengerName}</span>
            <span>{activeRequest.distance}</span>
          </div>

          {/* Accept and Bidding Buttons */}
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={handleAcceptRequest}
              className="flex-1 bg-[#F5B51B] hover:bg-[#FFBE22] active:scale-95 text-[#081226] font-black py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow"
            >
              <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
              <span>Aceptar (${activeRequest.suggestedFare})</span>
            </button>
            <button
              type="button"
              onClick={() => handleCounterOffer(300)}
              className="px-3 py-3 rounded-xl bg-[#202D47] border border-[#33405A] text-xs font-bold text-[#FFD66A] hover:bg-[#33405A]"
            >
              +$300
            </button>
            <button
              type="button"
              onClick={() => setActiveRequest(null)}
              className="px-3 py-3 rounded-xl bg-[#0D1930] text-xs text-red-400 font-bold hover:bg-red-950"
            >
              Rechazar
            </button>
          </div>
        </div>
      ) : (
        <div className="p-6 rounded-2xl bg-[#15213A] border border-[#33405A] text-center flex flex-col items-center justify-center">
          <Car className="w-8 h-8 text-[#F5B51B] mb-2" />
          <h4 className="text-sm font-bold text-white">
            {isOnline ? 'Buscando solicitudes en tu zona...' : 'Estás desconectado'}
          </h4>
          <p className="text-xs text-[#AEB7C8] mt-1">
            {isOnline
              ? 'Te avisaremos apenas un pasajero solicite un viaje en Formosa.'
              : 'Activá el botón arriba para comenzar a recibir viajes.'}
          </p>
          {isOnline && !activeRequest && (
            <button
              type="button"
              onClick={() =>
                setActiveRequest({
                  id: `req-${Date.now()}`,
                  passengerName: 'Gonzalo P.',
                  origin: 'Av. Gutnisky 2350',
                  destination: 'Plaza San Martín',
                  distance: '2.8 km • 6 min',
                  suggestedFare: 2450,
                  category: 'BearDrive',
                })
              }
              className="mt-3 px-3 py-1.5 rounded-lg bg-[#202D47] text-xs text-[#F5B51B] font-semibold border border-[#33405A]"
            >
              Generar solicitud de prueba
            </button>
          )}
        </div>
      )}

      {/* Switch back to Passenger mode */}
      <div className="mt-auto pt-4">
        <button
          type="button"
          onClick={onNavigateToPassenger}
          className="w-full py-3 px-4 rounded-xl bg-[#0D1930] border border-[#33405A] text-xs text-[#AEB7C8] hover:text-white font-bold flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al Modo Pasajero</span>
        </button>
      </div>
    </div>
  );
};

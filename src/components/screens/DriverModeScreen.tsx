import React, { useState } from 'react';
import { 
  Power, 
  DollarSign, 
  Navigation, 
  ShieldCheck, 
  Star, 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  Car, 
  FileCheck, 
  AlertTriangle,
  Calendar,
  Layers,
  ChevronRight
} from 'lucide-react';
import { MapView } from '../MapView';
import { MOCK_DAILY_CHARGES, MOCK_DRIVER_VEHICLES, MOCK_DRIVER_DOCUMENTS } from '../../data/mockData';
import { triggerHaptic } from '../../utils/haptics';

interface DriverModeScreenProps {
  onBack: () => void;
  onNavigateToPassenger: () => void;
  onNavigateToOnboarding?: () => void;
}

export const DriverModeScreen: React.FC<DriverModeScreenProps> = ({
  onBack,
  onNavigateToPassenger,
  onNavigateToOnboarding,
}) => {
  const [isOnline, setIsOnline] = useState(true);
  const [todayGross, setTodayGross] = useState(38400);
  const [completedRides, setCompletedRides] = useState(14);
  const [activeVehicle, setActiveVehicle] = useState(MOCK_DRIVER_VEHICLES[0]);
  const [showDailyChargeModal, setShowDailyChargeModal] = useState(false);

  const [activeRequest, setActiveRequest] = useState<{
    id: string;
    passengerName: string;
    origin: string;
    destination: string;
    distance: string;
    suggestedFare: number;
    category: string;
    isFemalePreference?: boolean;
  } | null>({
    id: 'req-201',
    passengerName: 'Valeria R.',
    origin: 'Av. 25 de Mayo 1420',
    destination: 'Costanera Vuelta Fermosa',
    distance: '3.4 km • 7 min',
    suggestedFare: 2950,
    category: 'BearFlash',
    isFemalePreference: false,
  });

  const handleAcceptRequest = () => {
    if (!activeRequest) return;
    triggerHaptic('heavy');
    setTodayGross((prev) => prev + activeRequest.suggestedFare);
    setCompletedRides((prev) => prev + 1);
    setActiveRequest(null);
  };

  const handleCounterOffer = (extra: number) => {
    if (!activeRequest) return;
    triggerHaptic('selection');
    const newPrice = activeRequest.suggestedFare + extra;
    setActiveRequest(null);
  };

  const pendingDocsCount = MOCK_DRIVER_DOCUMENTS.filter((d) => d.status !== 'aprobado').length;

  return (
    <div className="min-h-[640px] flex flex-col bg-[#081226] text-white p-4 overflow-y-auto max-w-4xl mx-auto w-full">
      {/* Top Driver Header */}
      <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#15213A] border border-[#33405A] shadow-xl mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-[#F5B51B] overflow-hidden bg-[#0D1930] shrink-0">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
              alt="Conductor"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-bold text-white truncate">Martín Gómez</span>
            <div className="flex items-center gap-1.5 text-xs text-[#FFD66A]">
              <Star className="w-3.5 h-3.5 fill-[#F5B51B] text-[#F5B51B]" />
              <span>4.95 (1.2k viajes en Formosa)</span>
            </div>
          </div>
        </div>

        {/* Online / Offline Switch */}
        <button
          type="button"
          onClick={() => {
            triggerHaptic('medium');
            setIsOnline(!isOnline);
          }}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-black transition-all shadow-md cursor-pointer ${
            isOnline
              ? 'bg-[#59C878] text-[#081226]'
              : 'bg-[#202D47] text-[#AEB7C8] border border-[#33405A]'
          }`}
        >
          <Power className="w-3.5 h-3.5 stroke-[3]" />
          <span>{isOnline ? 'EN LÍNEA' : 'DESCONECTADO'}</span>
        </button>
      </div>

      {/* Official Economic Model Banner (No Membresías, Cobro Diario Separado) */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-[#15213A] via-[#0D1930] to-[#15213A] border border-[#F5B51B]/40 shadow-xl mb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] text-[#AEB7C8] font-bold uppercase tracking-wider">
              Recaudación de Hoy (100% Chofer)
            </span>
            <span className="px-1.5 py-0.2 rounded bg-[#59C878]/20 text-[#59C878] text-[9px] font-black uppercase">
              PAGO DIRECTO
            </span>
          </div>
          <div className="text-2xl md:text-3xl font-black text-[#F5B51B]">
            ${todayGross.toLocaleString('es-AR')}
          </div>
          <span className="text-[11px] text-[#59C878] font-bold mt-0.5 block">
            ✓ {completedRides} viajes completados • Sin comisiones retenidas por viaje
          </span>
        </div>

        <div className="flex flex-col items-start md:items-end border-t md:border-t-0 pt-3 md:pt-0 border-[#33405A]/60">
          <div className="flex items-center gap-1.5 text-xs text-[#AEB7C8]">
            <Calendar className="w-3.5 h-3.5 text-[#F5B51B]" />
            <span>Cobro Diario BearDrive:</span>
            <strong className="text-white font-mono">$1.800 / día</strong>
          </div>
          <span className="text-[10px] text-[#59C878] mt-0.5">
            Estado: <strong>PROGRAMADO</strong> (Débito aut. MP)
          </span>
          <button
            type="button"
            onClick={() => setShowDailyChargeModal(true)}
            className="text-[11px] text-[#F5B51B] underline font-bold mt-1 hover:text-[#FFBE22]"
          >
            Ver detalle del cobro diario →
          </button>
        </div>
      </div>

      {/* Active Vehicle & Documentation Status Toolbar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        {/* Active vehicle card */}
        <div className="p-3.5 rounded-2xl bg-[#15213A] border border-[#33405A] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#0D1930] border border-[#33405A] flex items-center justify-center text-[#F5B51B]">
              <Car className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block">
                {activeVehicle.brand} {activeVehicle.model}
              </span>
              <span className="text-[10px] text-[#AEB7C8] font-mono">
                Patente: {activeVehicle.plate} • Blanco Reglamentario
              </span>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-[#59C878]/20 text-[#59C878] text-[9px] font-black uppercase">
            VIGENTE
          </span>
        </div>

        {/* Documentation status button */}
        <button
          type="button"
          onClick={onNavigateToOnboarding}
          className="p-3.5 rounded-2xl bg-[#15213A] border border-[#33405A] hover:border-[#F5B51B] flex items-center justify-between text-left transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#0D1930] border border-[#33405A] flex items-center justify-center text-[#59C878]">
              <FileCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block">Habilitación & Documentos</span>
              <span className="text-[10px] text-[#AEB7C8]">
                {pendingDocsCount === 0 ? '8 de 8 aprobados' : `${pendingDocsCount} en revisión`}
              </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#F5B51B]" />
        </button>
      </div>

      {/* Map Radar Simulation */}
      <div className="h-56 w-full rounded-2xl overflow-hidden border border-[#33405A] mb-4 relative shadow-lg">
        <MapView 
          interactive={true} 
          showCars={true} 
          showControls={true} 
          allowFullscreenToggle={true}
        />
        <div className="absolute top-2 left-2 z-20 px-2.5 py-1 rounded-full bg-[#15213A]/90 text-[10px] font-bold text-[#FFD66A] border border-[#33405A] shadow-md">
          Zona de alta demanda: Centro, Av. 25 de Mayo & Costanera
        </div>
      </div>

      {/* Incoming Ride Request Offer Card */}
      {isOnline && activeRequest ? (
        <div className="p-4 rounded-2xl bg-[#15213A] border-2 border-[#F5B51B] shadow-2xl flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-[#F5B51B] text-[#081226]">
                ¡NUEVA SOLICITUD EN TIEMPO REAL!
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
              <span className="text-white font-bold truncate">Hasta: {activeRequest.destination}</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-[#AEB7C8] pt-1">
            <span>Pasajera: {activeRequest.passengerName}</span>
            <span>{activeRequest.distance}</span>
          </div>

          {/* Accept and Action Buttons */}
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={handleAcceptRequest}
              className="flex-1 bg-[#F5B51B] hover:bg-[#FFBE22] active:scale-95 text-[#081226] font-black py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow cursor-pointer"
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
            {isOnline ? 'Buscando solicitudes en Formosa Capital...' : 'Estás desconectado'}
          </h4>
          <p className="text-xs text-[#AEB7C8] mt-1">
            {isOnline
              ? 'Te notificaremos al instante cuando un pasajero solicite un viaje cercano.'
              : 'Presiona "En Línea" para recibir solicitudes en tiempo real.'}
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
              Simular nueva solicitud
            </button>
          )}
        </div>
      )}

      {/* Daily Charge Breakdown Modal */}
      {showDailyChargeModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#15213A] border border-[#33405A] rounded-3xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#33405A]">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-[#F5B51B]" />
                <span>Régimen de Cobro Diario BearDrive</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowDailyChargeModal(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-[#AEB7C8] leading-relaxed">
              En BearDrive <strong>no existen comisiones por viaje</strong> ni membresías fijas inaccesibles. Pagas una cuota diaria fija únicamente por los días en los que efectivamente trabajas y completas viajes.
            </p>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-[#0D1930] border border-[#33405A] flex justify-between">
                <span className="text-[#AEB7C8]">Tarifa diaria vigente:</span>
                <span className="font-bold text-white">$1.800 ARS</span>
              </div>
              <div className="p-3 rounded-xl bg-[#0D1930] border border-[#33405A] flex justify-between">
                <span className="text-[#AEB7C8]">Viajes hoy:</span>
                <span className="font-bold text-white">{completedRides} completados</span>
              </div>
              <div className="p-3 rounded-xl bg-[#0D1930] border border-[#33405A] flex justify-between">
                <span className="text-[#AEB7C8]">Recaudación directa del chofer:</span>
                <span className="font-bold text-[#59C878]">${todayGross.toLocaleString('es-AR')}</span>
              </div>
              <div className="p-3 rounded-xl bg-[#0D1930] border border-[#F5B51B]/40 flex justify-between">
                <span className="text-[#F5B51B] font-bold">Total a debitar al cierre:</span>
                <span className="font-extrabold text-[#F5B51B]">$1.800 ARS</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowDailyChargeModal(false)}
                className="w-full py-3 rounded-xl bg-[#F5B51B] text-[#081226] font-bold text-xs"
              >
                Entendido
              </button>
            </div>
          </div>
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

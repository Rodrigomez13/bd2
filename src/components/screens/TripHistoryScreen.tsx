import React, { useState, useEffect } from 'react';
import { Clock, Calendar, CheckCircle2, ArrowRight, FileText, Download, Star, MapPin, RefreshCw, Loader2, CloudCheck, Database } from 'lucide-react';
import { MOCK_TRIP_HISTORY } from '../../data/mockData';
import { TripRecord } from '../../types';
import { fetchTripHistory, isSupabaseConfigured } from '../../services/supabaseClient';
import { triggerHaptic } from '../../utils/haptics';

interface TripHistoryScreenProps {
  onBack: () => void;
}

export const TripHistoryScreen: React.FC<TripHistoryScreenProps> = ({ onBack }) => {
  const [tab, setTab] = useState<'history' | 'upcoming'>('history');
  const [selectedReceipt, setSelectedReceipt] = useState<TripRecord | null>(null);
  const [trips, setTrips] = useState<TripRecord[]>(MOCK_TRIP_HISTORY);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const isCloudOnline = isSupabaseConfigured();

  const loadHistory = async () => {
    setIsLoading(true);
    try {
      const records = await fetchTripHistory();
      if (records && records.length > 0) {
        setTrips(records);
      }
    } catch {
      // Keep initial
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleRefresh = () => {
    triggerHaptic('medium');
    loadHistory();
  };

  return (
    <div className="min-h-[640px] flex flex-col bg-[#081226] text-white p-4 overflow-y-auto">
      {/* Title & Tabs */}
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Mis Viajes</h2>
          <p className="text-xs text-[#AEB7C8] mt-0.5">Historial y recibos oficiales</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleRefresh}
            className="p-2 rounded-xl bg-[#15213A] border border-[#33405A] hover:border-[#F5B51B] text-[#F5B51B] cursor-pointer active:scale-95 transition-all"
            title="Sincronizar historial con Supabase"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Cloud Persistence Status */}
      <div className="mb-3 px-3 py-1.5 rounded-xl bg-[#15213A] border border-[#33405A] flex items-center justify-between text-[11px]">
        <div className="flex items-center gap-1.5 text-[#AEB7C8]">
          <span className="w-2 h-2 rounded-full bg-[#59C878]" />
          <span>Base de datos: <strong className="text-white">{isCloudOnline ? 'Supabase Cloud (En línea)' : 'Local Sync (Offline Ready)'}</strong></span>
        </div>
        <span className="text-[10px] text-[#F5B51B] font-mono">Total: {trips.length} viajes</span>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-[#15213A] border border-[#33405A] mb-4">
        <button
          type="button"
          onClick={() => setTab('history')}
          className={`py-2 text-xs font-bold rounded-lg transition-all ${
            tab === 'history' ? 'bg-[#F5B51B] text-[#081226] shadow' : 'text-[#AEB7C8]'
          }`}
        >
          Historial completado ({trips.length})
        </button>
        <button
          type="button"
          onClick={() => setTab('upcoming')}
          className={`py-2 text-xs font-bold rounded-lg transition-all ${
            tab === 'upcoming' ? 'bg-[#F5B51B] text-[#081226] shadow' : 'text-[#AEB7C8]'
          }`}
        >
          Próximos (0)
        </button>
      </div>

      {/* Trips list */}
      {tab === 'history' ? (
        <div className="flex flex-col gap-3">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center p-12 text-[#AEB7C8]">
              <Loader2 className="w-8 h-8 text-[#F5B51B] animate-spin mb-2" />
              <span className="text-xs">Sincronizando viajes desde Supabase...</span>
            </div>
          ) : (
            trips.map((trip) => (
              <div
                key={trip.id}
                onClick={() => setSelectedReceipt(trip)}
                className="p-4 rounded-2xl bg-[#15213A] border border-[#33405A] hover:border-[#F5B51B] cursor-pointer transition-all shadow-md flex flex-col gap-3 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#0D1930] text-[#FFD66A] border border-[#33405A]">
                      {trip.category}
                    </span>
                    <span className="text-xs text-[#AEB7C8]">{trip.date}</span>
                  </div>
                  <span className="text-base font-black text-[#F5B51B]">
                    ${trip.price.toLocaleString('es-AR')}
                  </span>
                </div>

                {/* Route line */}
                <div className="flex flex-col gap-1.5 text-xs">
                  <div className="flex items-start gap-2.5">
                    <div className="w-2 h-2 rounded-full bg-[#F5B51B] mt-1 shrink-0" />
                    <span className="text-white truncate">{trip.origin}</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <div className="w-2 h-2 rounded-full bg-[#FF4B4B] mt-1 shrink-0" />
                    <span className="text-white font-bold truncate">{trip.destination}</span>
                  </div>
                </div>

                {/* Driver & Receipt Action */}
                <div className="flex items-center justify-between pt-2 border-t border-[#33405A]/40 text-xs text-[#AEB7C8]">
                  <div className="flex items-center gap-2">
                    <img
                      src={trip.driverAvatar}
                      alt={trip.driverName}
                      referrerPolicy="no-referrer"
                      className="w-6 h-6 rounded-full border border-[#33405A] object-cover"
                    />
                    <span>Conductor: {trip.driverName}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[#F5B51B] font-semibold group-hover:underline">
                    <FileText className="w-3.5 h-3.5" />
                    <span>Ver recibo</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-12 text-center text-[#AEB7C8]">
          <Clock className="w-12 h-12 text-[#33405A] mb-2" />
          <h4 className="text-base font-bold text-white">No tenés viajes programados</h4>
          <p className="text-xs mt-1">Podés programar o pedir viajes en cualquier momento.</p>
        </div>
      )}

      {/* Receipt Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#15213A] border border-[#F5B51B] rounded-3xl p-6 shadow-2xl flex flex-col gap-4 text-white">
            <div className="flex items-center justify-between border-b border-[#33405A] pb-3">
              <div>
                <h3 className="text-base font-black text-white">Recibo de Viaje</h3>
                <span className="text-[10px] text-[#AEB7C8]">ID: {selectedReceipt.id}</span>
              </div>
              <span className="text-xl font-black text-[#F5B51B]">
                ${selectedReceipt.price.toLocaleString('es-AR')}
              </span>
            </div>

            <div className="flex flex-col gap-2 text-xs">
              <div className="flex justify-between text-[#AEB7C8]">
                <span>Fecha:</span>
                <span className="text-white font-medium">{selectedReceipt.date}</span>
              </div>
              <div className="flex justify-between text-[#AEB7C8]">
                <span>Servicio:</span>
                <span className="text-white font-medium">{selectedReceipt.category}</span>
              </div>
              <div className="flex justify-between text-[#AEB7C8]">
                <span>Conductor:</span>
                <span className="text-white font-medium">{selectedReceipt.driverName}</span>
              </div>
              <div className="flex justify-between text-[#AEB7C8]">
                <span>Vehículo:</span>
                <span className="text-white font-medium">{selectedReceipt.carModel}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#0D1930] border border-[#33405A] text-xs flex flex-col gap-1">
              <span className="text-[#AEB7C8] font-semibold">Ruta:</span>
              <span className="text-white truncate">Desde: {selectedReceipt.origin}</span>
              <span className="text-white truncate">Hasta: {selectedReceipt.destination}</span>
            </div>

            <div className="flex gap-2 mt-2">
              <button
                type="button"
                onClick={() => {
                  alert('Descargando comprobante fiscal PDF...');
                  setSelectedReceipt(null);
                }}
                className="flex-1 bg-[#F5B51B] hover:bg-[#FFBE22] text-[#081226] font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-1.5 text-xs shadow-md"
              >
                <Download className="w-4 h-4" />
                <span>Descargar PDF</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedReceipt(null)}
                className="px-4 py-3 rounded-xl bg-[#202D47] border border-[#33405A] text-xs font-bold text-white hover:bg-[#33405A]"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

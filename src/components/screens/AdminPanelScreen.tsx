import React, { useState } from 'react';
import { 
  Building, 
  Users, 
  Car, 
  FileCheck, 
  TrendingUp, 
  Sliders, 
  History, 
  Check, 
  X, 
  AlertTriangle, 
  Sparkles, 
  Calendar, 
  DollarSign, 
  ShieldCheck, 
  Lock,
  ArrowLeft,
  Search,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { MOCK_ADMIN_DATA, MOCK_DRIVER_DOCUMENTS } from '../../data/mockData';
import { DriverDocument } from '../../types';

interface AdminPanelScreenProps {
  onBack: () => void;
}

export const AdminPanelScreen: React.FC<AdminPanelScreenProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'documents' | 'rates' | 'matching' | 'audit'>('dashboard');
  const [dailyRate, setDailyRate] = useState<number>(MOCK_ADMIN_DATA.dailyRateConfig.currentAmount);
  const [rateMode, setRateMode] = useState<'fixed_daily' | 'percentage'>(MOCK_ADMIN_DATA.dailyRateConfig.mode);
  const [percentageRate, setPercentageRate] = useState<number>(MOCK_ADMIN_DATA.dailyRateConfig.percentageValue);
  const [rateSavedNotice, setRateSavedNotice] = useState(false);

  // Matching parameters
  const [femalePreferenceMultiplier, setFemalePreferenceMultiplier] = useState<number>(
    MOCK_ADMIN_DATA.matchingConfig.preferFemaleDriverMultiplier
  );
  const [round1Radius, setRound1Radius] = useState<number>(MOCK_ADMIN_DATA.matchingConfig.round1RadiusKm);
  const [round2Radius, setRound2Radius] = useState<number>(MOCK_ADMIN_DATA.matchingConfig.round2RadiusKm);
  const [offerTimeout, setOfferTimeout] = useState<number>(MOCK_ADMIN_DATA.matchingConfig.offerTimeoutSeconds);

  // Document queue
  const [documentsQueue, setDocumentsQueue] = useState<DriverDocument[]>(MOCK_DRIVER_DOCUMENTS);
  const [rejectionModalDoc, setRejectionModalDoc] = useState<DriverDocument | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // Audit Logs
  const [auditLogs, setAuditLogs] = useState([
    {
      id: 'log-1',
      admin: 'Admin General (S.A.S.)',
      action: 'Aprobación de Licencia D1',
      target: 'Conductor: Martín Gómez (AE 842 BD)',
      timestamp: 'Hoy, 09:12 AM',
    },
    {
      id: 'log-2',
      admin: 'Admin General (S.A.S.)',
      action: 'Ajuste de Coeficiente Cobro Diario',
      target: 'Valor actualizado a $1.800 / día',
      timestamp: 'Ayer, 18:30 PM',
    },
    {
      id: 'log-3',
      admin: 'Admin Auditoría',
      action: 'Verificación RTO/VTV',
      target: 'Toyota Etios (AE 842 BD) Válido hasta 2027',
      timestamp: '28 de Agosto, 14:00 PM',
    },
  ]);

  const handleSaveRates = (e: React.FormEvent) => {
    e.preventDefault();
    setRateSavedNotice(true);
    setTimeout(() => setRateSavedNotice(false), 3000);

    setAuditLogs([
      {
        id: `log-${Date.now()}`,
        admin: 'Admin General (S.A.S.)',
        action: 'Modificación Tarifa Cobro Diario',
        target: rateMode === 'fixed_daily' ? `$${dailyRate} ARS/día` : `${percentageRate}% variable`,
        timestamp: 'Justo ahora',
      },
      ...auditLogs,
    ]);
  };

  const handleApproveDoc = (docId: string) => {
    setDocumentsQueue((prev) =>
      prev.map((d) => (d.id === docId ? { ...d, status: 'aprobado', semaphore: 'verde', feedback: undefined } : d))
    );
    setAuditLogs([
      {
        id: `log-${Date.now()}`,
        admin: 'Admin Documental',
        action: 'Aprobación de Documento',
        target: `Doc: ${docId}`,
        timestamp: 'Justo ahora',
      },
      ...auditLogs,
    ]);
  };

  const handleRejectDoc = () => {
    if (!rejectionModalDoc) return;
    setDocumentsQueue((prev) =>
      prev.map((d) =>
        d.id === rejectionModalDoc.id
          ? {
              ...d,
              status: 'rechazado',
              semaphore: 'rojo',
              feedback: rejectionReason || 'Documento ilegible o no cumple normativa de Formosa.',
            }
          : d
      )
    );
    setAuditLogs([
      {
        id: `log-${Date.now()}`,
        admin: 'Admin Documental',
        action: 'Rechazo de Documento',
        target: `Doc: ${rejectionModalDoc.title} - Motivo: ${rejectionReason || 'No especificado'}`,
        timestamp: 'Justo ahora',
      },
      ...auditLogs,
    ]);
    setRejectionModalDoc(null);
    setRejectionReason('');
  };

  return (
    <div className="flex-1 flex flex-col bg-[#081226] text-white p-4 max-w-6xl mx-auto w-full">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-[#0D1930] border border-[#33405A] shadow-2xl mb-6">
        <div className="flex items-center gap-3.5">
          <button
            type="button"
            onClick={onBack}
            className="w-10 h-10 rounded-xl bg-[#15213A] border border-[#33405A] flex items-center justify-center text-white hover:bg-[#202D47] transition-colors shrink-0"
          >
            <ArrowLeft className="w-4 h-4 text-[#F5B51B]" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-white tracking-tight">
                Panel de Control & Administración
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-[#F59E0B] text-[#081226] text-[10px] font-black uppercase">
                Backoffice Formosa
              </span>
            </div>
            <p className="text-xs text-[#AEB7C8] mt-0.5">
              Gestión operativa, validación documental, cobro diario y matching inteligente
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-[#15213A] border border-[#33405A] text-xs text-[#59C878] font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#59C878] animate-pulse" />
            <span>Servidor Operativo (Formosa)</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#0D1930] border border-[#33405A] mb-6 overflow-x-auto">
        {[
          { id: 'dashboard', label: 'Métricas & Dashboard', icon: TrendingUp },
          { id: 'documents', label: `Validación Documental (${documentsQueue.length})`, icon: FileCheck },
          { id: 'rates', label: 'Cobro Diario (Coeficiente)', icon: DollarSign },
          { id: 'matching', label: 'Matching & Preferencias', icon: Sliders },
          { id: 'audit', label: 'Bitácora de Auditoría', icon: History },
        ].map((t) => {
          const Icon = t.icon;
          const isSelected = activeTab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                isSelected
                  ? 'bg-[#F5B51B] text-[#081226] shadow-md'
                  : 'text-[#AEB7C8] hover:text-white hover:bg-[#15213A]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: DASHBOARD */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-[#15213A] border border-[#33405A]">
              <span className="text-[11px] font-bold uppercase text-[#AEB7C8] block mb-1">Viajes Activos Ahora</span>
              <div className="text-2xl font-black text-white">{MOCK_ADMIN_DATA.stats.activeTripsNow}</div>
              <span className="text-[11px] text-[#59C878] mt-1 block">En Formosa Capital</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#15213A] border border-[#33405A]">
              <span className="text-[11px] font-bold uppercase text-[#AEB7C8] block mb-1">Choferes en Línea</span>
              <div className="text-2xl font-black text-[#59C878]">{MOCK_ADMIN_DATA.stats.onlineDrivers}</div>
              <span className="text-[11px] text-[#AEB7C8] mt-1 block">
                {MOCK_ADMIN_DATA.stats.approvedDrivers} habilitados totales
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-[#15213A] border border-[#33405A]">
              <span className="text-[11px] font-bold uppercase text-[#AEB7C8] block mb-1">
                Facturación Pasajes (Directa a Chofer)
              </span>
              <div className="text-2xl font-black text-[#F5B51B]">
                ${MOCK_ADMIN_DATA.stats.todayGrossTurnover.toLocaleString('es-AR')}
              </div>
              <span className="text-[10px] text-gray-400 mt-1 block">100% cobrado por los conductores</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#15213A] border border-[#33405A]">
              <span className="text-[11px] font-bold uppercase text-[#AEB7C8] block mb-1">
                Recaudación Cobro Diario BearDrive
              </span>
              <div className="text-2xl font-black text-[#06B6D4]">
                ${MOCK_ADMIN_DATA.stats.todayPlatformRevenue.toLocaleString('es-AR')}
              </div>
              <span className="text-[10px] text-[#59C878] mt-1 block">Cuota operativa tecnológica</span>
            </div>
          </div>

          {/* Quick Operational Insights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="p-5 rounded-3xl bg-[#15213A] border border-[#33405A]">
              <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#59C878]" />
                <span>Rendimiento Operativo en Formosa</span>
              </h3>
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#0D1930] border border-[#33405A]">
                  <span className="text-[#AEB7C8]">Tasa de Aceptación de Solicitudes</span>
                  <span className="font-bold text-[#59C878]">{MOCK_ADMIN_DATA.stats.acceptanceRate}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#0D1930] border border-[#33405A]">
                  <span className="text-[#AEB7C8]">Tiempo Promedio de Asignación (ETA)</span>
                  <span className="font-bold text-[#F5B51B]">{MOCK_ADMIN_DATA.stats.avgEta}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#0D1930] border border-[#33405A]">
                  <span className="text-[#AEB7C8]">Documentos Pendientes de Revisión</span>
                  <span className="font-bold text-[#F59E0B]">{MOCK_ADMIN_DATA.stats.pendingDocuments} solicitudes</span>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-[#15213A] border border-[#33405A]">
              <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-[#F5B51B]" />
                <span>Separación Económica & Cumplimiento</span>
              </h3>
              <p className="text-xs text-[#AEB7C8] leading-relaxed mb-4">
                BearDrive implementa el modelo <strong>Multivendedor / Split 1:1</strong>. Los fondos de cada viaje son abonados directamente al conductor mediante Mercado Pago, transferencia bancaria o efectivo. La empresa factura únicamente la cuota diaria por uso de la plataforma.
              </p>
              <div className="p-3 rounded-xl bg-[#0D1930] border border-[#F5B51B]/30 flex items-center justify-between">
                <span className="text-xs font-bold text-white">Tarifa diaria activa:</span>
                <span className="text-sm font-extrabold text-[#F5B51B]">
                  ${MOCK_ADMIN_DATA.dailyRateConfig.currentAmount} ARS / día
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: VALIDACIÓN DOCUMENTAL */}
      {activeTab === 'documents' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Validación de Documentos (Normativa Formosa)</h3>
              <p className="text-xs text-[#AEB7C8]">
                Revisión humana y semáforo de vencimientos antes de habilitar conductores.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {documentsQueue.map((doc) => {
              const semColor =
                doc.semaphore === 'verde' ? '#59C878' : doc.semaphore === 'amarillo' ? '#F5B51B' : '#FF4B4B';

              return (
                <div
                  key={doc.id}
                  className="p-4 rounded-2xl bg-[#15213A] border border-[#33405A] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-md"
                >
                  <div className="flex items-start gap-3.5 min-w-0">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                      style={{ backgroundColor: `${semColor}20`, color: semColor }}
                    >
                      <FileCheck className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white truncate">{doc.title}</span>
                        <span
                          className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: `${semColor}20`, color: semColor }}
                        >
                          {doc.status.replace('_', ' ')}
                        </span>
                      </div>
                      <span className="text-xs text-[#AEB7C8] truncate">
                        Archivo: <strong className="text-white font-mono">{doc.fileName || 'Pendiente'}</strong>
                      </span>
                      {doc.expiresAt && (
                        <span className="text-[11px] text-[#AEB7C8] flex items-center gap-1 mt-0.5">
                          <Calendar className="w-3 h-3 text-[#F5B51B]" />
                          <span>Vigencia: {doc.expiresAt}</span>
                          {doc.daysToExpiry && <span style={{ color: semColor }}>({doc.daysToExpiry} días restantes)</span>}
                        </span>
                      )}
                      {doc.feedback && (
                        <span className="text-[11px] text-[#FF4B4B] mt-1 flex items-center gap-1 font-semibold">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>Observación: {doc.feedback}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                    <button
                      type="button"
                      onClick={() => handleApproveDoc(doc.id)}
                      className="px-3.5 py-2 rounded-xl bg-[#59C878] hover:bg-[#4EAF68] text-[#081226] text-xs font-bold transition-colors flex items-center gap-1"
                    >
                      <Check className="w-4 h-4 stroke-[2.5]" />
                      <span>Aprobar</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRejectionModalDoc(doc)}
                      className="px-3.5 py-2 rounded-xl bg-[#0D1930] hover:bg-[#FF4B4B]/20 border border-[#FF4B4B]/40 text-[#FF4B4B] text-xs font-bold transition-colors flex items-center gap-1"
                    >
                      <X className="w-4 h-4" />
                      <span>Rechazar / Observar</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Rejection modal */}
          {rejectionModalDoc && (
            <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="w-full max-w-md bg-[#15213A] border-2 border-[#FF4B4B] rounded-3xl p-5 shadow-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white">Observar Documento: {rejectionModalDoc.title}</h4>
                  <button type="button" onClick={() => setRejectionModalDoc(null)} className="text-gray-400">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div>
                  <label className="text-xs text-[#AEB7C8] block mb-1">Motivo de rechazo o corrección requerida:</label>
                  <textarea
                    rows={3}
                    placeholder="Ej. La imagen está fuera de foco o la fecha de vencimiento no coincide con el registro oficial."
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    className="w-full p-3 rounded-xl bg-[#0D1930] border border-[#33405A] text-xs text-white focus:outline-none focus:border-[#FF4B4B]"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setRejectionModalDoc(null)}
                    className="px-4 py-2 rounded-xl bg-[#0D1930] text-xs text-gray-400"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleRejectDoc}
                    className="px-4 py-2 rounded-xl bg-[#FF4B4B] text-white text-xs font-bold"
                  >
                    Confirmar Rechazo
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: COBRO DIARIO (CONFIGURACIÓN) */}
      {activeTab === 'rates' && (
        <div className="p-6 rounded-3xl bg-[#15213A] border border-[#33405A] shadow-xl space-y-5">
          <div>
            <h3 className="text-base font-bold text-white mb-1">Configuración del Cobro Diario a Conductores</h3>
            <p className="text-xs text-[#AEB7C8]">
              Modelo sin membresías forzosas: BearDrive cobra una tarifa diaria por uso del software.
            </p>
          </div>

          <form onSubmit={handleSaveRates} className="space-y-4 max-w-xl">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-[#AEB7C8] block">Esquema de Cobro</label>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 p-3 rounded-xl bg-[#0D1930] border border-[#33405A] cursor-pointer flex-1">
                  <input
                    type="radio"
                    name="rateMode"
                    value="fixed_daily"
                    checked={rateMode === 'fixed_daily'}
                    onChange={() => setRateMode('fixed_daily')}
                    className="text-[#F5B51B]"
                  />
                  <span className="text-xs font-bold text-white">Monto Fijo Diario (Recomendado)</span>
                </label>
                <label className="flex items-center gap-2 p-3 rounded-xl bg-[#0D1930] border border-[#33405A] cursor-pointer flex-1">
                  <input
                    type="radio"
                    name="rateMode"
                    value="percentage"
                    checked={rateMode === 'percentage'}
                    onChange={() => setRateMode('percentage')}
                    className="text-[#F5B51B]"
                  />
                  <span className="text-xs font-bold text-white">Porcentaje Variable (%)</span>
                </label>
              </div>
            </div>

            {rateMode === 'fixed_daily' ? (
              <div>
                <label className="text-xs font-bold uppercase text-[#AEB7C8] block mb-1">
                  Tarifa Diaria por Jornada (ARS)
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-sm font-bold text-[#F5B51B]">$</span>
                  <input
                    type="number"
                    min={500}
                    max={10000}
                    step={100}
                    value={dailyRate}
                    onChange={(e) => setDailyRate(Number(e.target.value))}
                    className="w-full pl-8 pr-4 py-3 rounded-xl bg-[#0D1930] border border-[#33405A] text-base font-bold text-white focus:border-[#F5B51B] focus:outline-none"
                  />
                </div>
                <span className="text-[11px] text-[#AEB7C8] mt-1 block">
                  Se debitará automáticamente del medio de pago del conductor solo si completó viajes en el día.
                </span>
              </div>
            ) : (
              <div>
                <label className="text-xs font-bold uppercase text-[#AEB7C8] block mb-1">
                  Porcentaje sobre Facturación (%)
                </label>
                <div className="relative flex items-center">
                  <input
                    type="number"
                    min={1}
                    max={25}
                    value={percentageRate}
                    onChange={(e) => setPercentageRate(Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-xl bg-[#0D1930] border border-[#33405A] text-base font-bold text-white focus:border-[#F5B51B] focus:outline-none"
                  />
                  <span className="absolute right-3.5 text-sm font-bold text-[#F5B51B]">%</span>
                </div>
              </div>
            )}

            <div className="pt-2 flex items-center gap-3">
              <button
                type="submit"
                className="px-6 py-3 rounded-2xl bg-[#F5B51B] hover:bg-[#FFBE22] text-[#081226] font-bold text-xs flex items-center gap-2 shadow-lg transition-all"
              >
                <Check className="w-4 h-4 stroke-[2.5]" />
                <span>Guardar y Aplicar a Todos los Conductores</span>
              </button>

              {rateSavedNotice && (
                <span className="text-xs font-bold text-[#59C878] flex items-center gap-1 animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Configuración guardada y registrada en auditoría</span>
                </span>
              )}
            </div>
          </form>
        </div>
      )}

      {/* TAB 4: MATCHING & PREFERENCIAS */}
      {activeTab === 'matching' && (
        <div className="p-6 rounded-3xl bg-[#15213A] border border-[#33405A] shadow-xl space-y-5">
          <div>
            <h3 className="text-base font-bold text-white mb-1">Parámetros del Algoritmo de Matching</h3>
            <p className="text-xs text-[#AEB7C8]">
              Ajuste de pesos, rondas de despacho y preferencia de conductoras en Formosa Capital.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-3xl">
            <div className="p-4 rounded-2xl bg-[#0D1930] border border-[#33405A] space-y-2">
              <label className="text-xs font-bold text-white flex items-center justify-between">
                <span>Multiplicador Preferencia Conductora Mujer:</span>
                <span className="text-[#F5B51B] font-mono font-extrabold">{femalePreferenceMultiplier}x</span>
              </label>
              <input
                type="range"
                min={1.0}
                max={3.0}
                step={0.1}
                value={femalePreferenceMultiplier}
                onChange={(e) => setFemalePreferenceMultiplier(Number(e.target.value))}
                className="w-full accent-[#F5B51B]"
              />
              <span className="text-[11px] text-[#AEB7C8] block leading-relaxed">
                Prioriza en el score inicial a conductoras disponibles cuando la pasajera active la preferencia.
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-[#0D1930] border border-[#33405A] space-y-2">
              <label className="text-xs font-bold text-white flex items-center justify-between">
                <span>Radio Ronda 1 (Cercanos):</span>
                <span className="text-[#59C878] font-mono font-extrabold">{round1Radius} km</span>
              </label>
              <input
                type="range"
                min={0.5}
                max={3.0}
                step={0.1}
                value={round1Radius}
                onChange={(e) => setRound1Radius(Number(e.target.value))}
                className="w-full accent-[#59C878]"
              />
              <span className="text-[11px] text-[#AEB7C8] block leading-relaxed">
                Radio óptimo para despacho prioritario en calles céntricas y avenidas.
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-[#0D1930] border border-[#33405A] space-y-2">
              <label className="text-xs font-bold text-white flex items-center justify-between">
                <span>Tiempo de Expiración por Oferta:</span>
                <span className="text-[#06B6D4] font-mono font-extrabold">{offerTimeout} segundos</span>
              </label>
              <input
                type="range"
                min={10}
                max={30}
                step={1}
                value={offerTimeout}
                onChange={(e) => setOfferTimeout(Number(e.target.value))}
                className="w-full accent-[#06B6D4]"
              />
              <span className="text-[11px] text-[#AEB7C8] block leading-relaxed">
                Tiempo que tiene el conductor para aceptar antes de pasar a la siguiente ronda.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: AUDITORÍA */}
      {activeTab === 'audit' && (
        <div className="p-6 rounded-3xl bg-[#15213A] border border-[#33405A] shadow-xl space-y-4">
          <div>
            <h3 className="text-base font-bold text-white mb-1">Bitácora de Auditoría de Acciones Sensibles</h3>
            <p className="text-xs text-[#AEB7C8]">
              Registro inmutable de aprobaciones, cambios de tarifa y modificaciones normativas.
            </p>
          </div>

          <div className="space-y-2.5">
            {auditLogs.map((log) => (
              <div
                key={log.id}
                className="p-3.5 rounded-2xl bg-[#0D1930] border border-[#33405A] flex items-center justify-between text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{log.action}</span>
                    <span className="text-[10px] text-[#F5B51B] font-mono px-1.5 py-0.2 rounded bg-[#F5B51B]/10">
                      {log.admin}
                    </span>
                  </div>
                  <span className="text-[#AEB7C8] text-[11px] block mt-0.5">{log.target}</span>
                </div>
                <span className="text-[11px] text-gray-400 font-mono">{log.timestamp}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

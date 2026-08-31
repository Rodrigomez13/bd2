import React, { useState } from 'react';
import { 
  Users, 
  Car, 
  CreditCard, 
  ShieldCheck, 
  Cpu, 
  FileCheck, 
  Gift, 
  GitMerge, 
  CheckCircle2, 
  Info, 
  Sparkles, 
  ArrowRight, 
  Layers, 
  AlertTriangle,
  Building,
  QrCode,
  Calendar,
  Lock,
  HeartHandshake
} from 'lucide-react';

interface ConceptualMapScreenProps {
  onNavigateTo: (screen: any) => void;
}

export const ConceptualMapScreen: React.FC<ConceptualMapScreenProps> = ({ onNavigateTo }) => {
  const [activeTab, setActiveTab] = useState<'ecosystem' | 'flow' | 'legal'>('ecosystem');
  const [selectedPillar, setSelectedPillar] = useState<number>(1);

  const pillars = [
    {
      id: 1,
      title: '1. Pasajero',
      icon: Users,
      color: '#3B82F6',
      badge: 'EXPERIENCIA',
      summary: 'Solicita viajes en minutos con transparencia y beneficios.',
      points: [
        'Solicitud inmediata (Flash, Básico, Premium, Eco, Moto).',
        'Elige método de pago (Efectivo, Transferencia, QR, Tarjeta).',
        'Viaja seguro con monitoreo 24/7 y geofencing en Formosa Capital.',
        'Califica y suma BearPoints acumulables en cada viaje.',
      ],
      benefits: ['Sistema BearPoints', 'Descuentos y promociones', 'Viajes bonificados', 'Referidos ($1.000)'],
    },
    {
      id: 2,
      title: '2. Conductor',
      icon: Car,
      color: '#10B981',
      badge: 'SIN MEMBRESÍA',
      summary: '100% del viaje directo a su cuenta, sin comisiones ocultas.',
      points: [
        'Recibe solicitudes en tiempo real vía WebSockets/Realtime.',
        'Acepta o rechaza con transparencia total de tarifa y destino.',
        'Recibe pagos directamente del pasajero (efectivo, QR o transferencias).',
        'Paga su cuota diaria a BearDrive (calculada por coeficiente operativo).',
        'Puede registrar hasta 3 vehículos con semáforo de vencimientos.',
      ],
      benefits: ['Sin comisiones por viaje', 'Cobro diario justo', 'Cobro directo al instante', 'Libertad de horarios'],
    },
    {
      id: 3,
      title: '3. Pagos de Viajes',
      icon: CreditCard,
      color: '#8B5CF6',
      badge: 'PAGO DIRECTO',
      summary: 'El pasajero paga directamente al conductor. BearDrive NO retiene el dinero del pasaje.',
      points: [
        'Efectivo directo en mano al finalizar el viaje.',
        'QR dinámico generado con trip_id y cuenta bancaria del conductor.',
        'Transferencias directas y tarjetas mediante PSP Multivendedor.',
        'BearDrive nunca actúa como cuenta recaudadora ni billetera de terceros.',
      ],
      benefits: ['Liquidación instantánea', 'Transparencia fiscal', 'Sin retenciones de IVA del viaje', 'Comprobante digital'],
    },
    {
      id: 4,
      title: '4. Administración',
      icon: Building,
      color: '#F59E0B',
      badge: 'BACKOFFICE',
      summary: 'Control total de operaciones, validación documental y tarifas.',
      points: [
        'Dashboard completo con métricas de Formosa Capital en vivo.',
        'Gestión y validación de conductores con motivos de rechazo/aprobación.',
        'Configuración del coeficiente de cobro diario ($/día o % variable).',
        'Auditoría inmutable de todas las acciones sensibles.',
      ],
      benefits: ['Control en tiempo real', 'Reglas de matching', 'Gestión de zonas y tarifas', 'Reportes para AFIP/ATP'],
    },
    {
      id: 5,
      title: '5. Matching Inteligente',
      icon: Cpu,
      color: '#06B6D4',
      badge: 'IA & REALTIME',
      summary: 'Algoritmo de optimización multivariable con prioridad de género.',
      points: [
        'Prioriza por disponibilidad, distancia, ETA, rating y demanda.',
        'Preferencia de género: Las pasajeras pueden solicitar conductora mujer.',
        'Matching por 4 rondas progresivas con timeout de oferta de 15 segundos.',
        'Evita sobrecarga de base de datos usando canales de streaming efímeros.',
      ],
      benefits: ['Asignación en <30 seg', 'Preferencia Conductora', 'Rondas automáticas', 'Cero doble asignación'],
    },
    {
      id: 6,
      title: '6. Documentación & Seguridad',
      icon: FileCheck,
      color: '#EC4899',
      badge: 'NORMATIVA FORMOSA',
      summary: 'Estricto cumplimiento legal con semáforo de vencimientos.',
      points: [
        'Permiso de Explotación de Transporte Municipal.',
        'Domicilio legal y electrónico en Formosa.',
        'Licencia Nacional D1 profesional vigente.',
        'Certificado de Antecedentes Penales oficial.',
        'Póliza de Seguro de Remis/Pasajeros al día.',
        'Cédula Verde + Revisión Técnica Obligatoria (RTO/VTV).',
        'Declaración jurada de no deudor alimentario.',
        'Compromiso explícito de acceso a perros guía (Ley Discapacidad).',
      ],
      benefits: ['Semáforo Verde/Amarillo/Rojo', 'Alertas <15 días', 'Bloqueo automático de vencidos', 'Autos reglamentarios'],
    },
    {
      id: 7,
      title: '7. Beneficios BearPoints',
      icon: Gift,
      color: '#F5B51B',
      badge: 'FIDELIZACIÓN',
      summary: 'Premia la frecuencia y lealtad de los pasajeros sin abaratar al chofer.',
      points: [
        'Puntos acumulables por cada kilómetro y viaje completado.',
        'Bonus por viajes en horarios nocturnos y horas pico.',
        'Canje directo por cupones de $500, $1.000, 25% OFF o Viaje 100% Gratis.',
        'Programa de referidos: $1.000 de crédito y 250 pts por invitar amigos.',
      ],
      benefits: ['Niveles Bronce/Plata/Oro', 'Catálogo de recompensas', 'Sin membresía forzosa', 'Descuentos acumulables'],
    },
    {
      id: 8,
      title: '8. Flujo del Viaje',
      icon: GitMerge,
      color: '#14B8A6',
      badge: '7 PASOS',
      summary: 'Journey integral desde la cotización hasta el cobro diario.',
      points: [
        'Paso 1: Solicitud con geolocalización y validación de cobertura en Formosa.',
        'Paso 2: Matching inteligente por rondas y preferencias.',
        'Paso 3: Notificación y aceptación del conductor con oferta transparente.',
        'Paso 4: Conductor en camino con telemetría en vivo y chat.',
        'Paso 5: Viaje en curso con ruta Mapbox 3D y botón de pánico.',
        'Paso 6: Viaje finalizado y pago 100% directo al conductor (QR/efectivo).',
        'Paso 7: Calificación y registro del cobro diario a BearDrive.',
      ],
      benefits: ['Experiencia sin fricción', 'Soporte 24/7', 'QR dinámico', 'Registro transparente'],
    },
  ];

  const flowSteps = [
    { step: 1, title: 'Solicitud', desc: 'Pasajero define origen y destino en Formosa Capital y cotiza su categoría preferida.' },
    { step: 2, title: 'Matching Inteligente', desc: 'El algoritmo busca al mejor candidato por distancia, score y preferencia de conductora.' },
    { step: 3, title: 'Conductor Acepta', desc: 'El chofer recibe la oferta con precio neto y ubicación; el pasajero ve foto, auto y rating.' },
    { step: 4, title: 'En Camino / Pickup', desc: 'Navegación en tiempo real por avenidas de Formosa con estimación precisa de llegada.' },
    { step: 5, title: 'Viaje en Curso', desc: 'Monitoreo continuo por GPS con botón de seguridad y cálculo dinámico de ruta óptima.' },
    { step: 6, title: 'Pago Directo', desc: 'El pasajero abona el 100% del viaje al conductor por QR dinámico, transferencia o efectivo.' },
    { step: 7, title: 'Cobro Diario BearDrive', desc: 'Al finalizar la jornada se liquida la cuota diaria del conductor según coeficiente del Admin.' },
  ];

  return (
    <div className="flex-1 flex flex-col bg-[#081226] text-white p-4 max-w-6xl mx-auto w-full">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-3xl bg-gradient-to-r from-[#0D1930] via-[#15213A] to-[#0D1930] border border-[#F5B51B]/40 shadow-2xl mb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#081226] border-2 border-[#F5B51B] flex items-center justify-center text-2xl shadow-lg shrink-0">
            🐻
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-black text-white tracking-tight">
                Ecosistema & Mapa Conceptual
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-[#F5B51B] text-[#081226] text-[10px] font-extrabold uppercase">
                Formosa Capital
              </span>
            </div>
            <p className="text-xs text-[#AEB7C8] mt-0.5">
              "Tu viaje, tu elección, tu camino" • Arquitectura integral de producto, negocio y legal
            </p>
          </div>
        </div>

        {/* Quick Mode Switchers */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onNavigateTo('admin-panel')}
            className="px-3.5 py-2 rounded-xl bg-[#15213A] hover:bg-[#202D47] border border-[#F5B51B]/50 text-[#F5B51B] text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
          >
            <Building className="w-3.5 h-3.5" />
            <span>Panel Admin</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigateTo('driver-onboarding')}
            className="px-3.5 py-2 rounded-xl bg-[#F5B51B] hover:bg-[#FFBE22] text-[#081226] text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>Onboarding Chofer</span>
          </button>
        </div>
      </div>

      {/* Nav Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#0D1930] border border-[#33405A] mb-6 max-w-md">
        <button
          type="button"
          onClick={() => setActiveTab('ecosystem')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'ecosystem'
              ? 'bg-[#F5B51B] text-[#081226] shadow-md'
              : 'text-[#AEB7C8] hover:text-white'
          }`}
        >
          8 Pilares del Ecosistema
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('flow')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'flow'
              ? 'bg-[#F5B51B] text-[#081226] shadow-md'
              : 'text-[#AEB7C8] hover:text-white'
          }`}
        >
          Diagrama de Flujo (7 Pasos)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('legal')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'legal'
              ? 'bg-[#F5B51B] text-[#081226] shadow-md'
              : 'text-[#AEB7C8] hover:text-white'
          }`}
        >
          Marco Legal & Pagos
        </button>
      </div>

      {/* TAB 1: 8 PILARES DEL ECOSISTEMA */}
      {activeTab === 'ecosystem' && (
        <div className="space-y-6">
          {/* Grid of 8 Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {pillars.map((p) => {
              const IconComp = p.icon;
              const isSelected = selectedPillar === p.id;
              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedPillar(p.id)}
                  className={`p-4 rounded-2xl cursor-pointer transition-all border ${
                    isSelected
                      ? 'bg-[#15213A] border-[#F5B51B] shadow-[0_0_15px_rgba(245,181,27,0.25)] scale-[1.02]'
                      : 'bg-[#0D1930]/80 border-[#33405A]/70 hover:border-[#F5B51B]/50 hover:bg-[#15213A]/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2.5">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shadow-inner"
                      style={{ backgroundColor: `${p.color}20`, color: p.color }}
                    >
                      <IconComp className="w-5 h-5" />
                    </div>
                    <span
                      className="text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider"
                      style={{ backgroundColor: `${p.color}25`, color: p.color }}
                    >
                      {p.badge}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white mb-1">{p.title}</h3>
                  <p className="text-xs text-[#AEB7C8] line-clamp-2 leading-relaxed">{p.summary}</p>
                </div>
              );
            })}
          </div>

          {/* Detailed Selected Pillar Card */}
          {(() => {
            const current = pillars.find((p) => p.id === selectedPillar) || pillars[0];
            const IconComp = current.icon;
            return (
              <div className="p-6 rounded-3xl bg-[#15213A] border border-[#33405A] shadow-xl">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-[#33405A]/60">
                  <div className="flex items-center gap-3.5">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-md shrink-0"
                      style={{ backgroundColor: `${current.color}25`, color: current.color }}
                    >
                      <IconComp className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-lg font-bold text-white">{current.title}</h2>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#0D1930] text-[#AEB7C8] border border-[#33405A]">
                          Módulo Oficial
                        </span>
                      </div>
                      <p className="text-xs text-[#AEB7C8] mt-0.5">{current.summary}</p>
                    </div>
                  </div>

                  {/* Actions according to pillar */}
                  <div className="flex items-center gap-2">
                    {current.id === 1 && (
                      <button
                        type="button"
                        onClick={() => onNavigateTo('home')}
                        className="px-4 py-2 rounded-xl bg-[#F5B51B] text-[#081226] text-xs font-bold hover:bg-[#FFBE22] transition-colors"
                      >
                        Ir al Flujo Pasajero
                      </button>
                    )}
                    {current.id === 2 && (
                      <button
                        type="button"
                        onClick={() => onNavigateTo('driver-mode')}
                        className="px-4 py-2 rounded-xl bg-[#10B981] text-white text-xs font-bold hover:bg-[#059669] transition-colors"
                      >
                        Abrir Modo Conductor
                      </button>
                    )}
                    {current.id === 4 && (
                      <button
                        type="button"
                        onClick={() => onNavigateTo('admin-panel')}
                        className="px-4 py-2 rounded-xl bg-[#F59E0B] text-[#081226] text-xs font-bold hover:bg-[#D97706] transition-colors"
                      >
                        Abrir Panel Admin
                      </button>
                    )}
                    {current.id === 6 && (
                      <button
                        type="button"
                        onClick={() => onNavigateTo('driver-onboarding')}
                        className="px-4 py-2 rounded-xl bg-[#EC4899] text-white text-xs font-bold hover:bg-[#DB2777] transition-colors"
                      >
                        Ver Requisitos Formosa
                      </button>
                    )}
                    {current.id === 7 && (
                      <button
                        type="button"
                        onClick={() => onNavigateTo('bear-points')}
                        className="px-4 py-2 rounded-xl bg-[#F5B51B] text-[#081226] text-xs font-bold hover:bg-[#FFBE22] transition-colors"
                      >
                        Ver BearPoints & Canje
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-5">
                  {/* Key Implementation Points */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#F5B51B] mb-3 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Especificación Funcional</span>
                    </h4>
                    <ul className="space-y-2.5">
                      {current.points.map((pt, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs text-[#E2E8F0] leading-relaxed">
                          <CheckCircle2 className="w-4 h-4 text-[#59C878] shrink-0 mt-0.5" />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Highlights / Differentiators */}
                  <div className="p-4 rounded-2xl bg-[#0D1930] border border-[#33405A]/70 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#AEB7C8] mb-3">
                        Ventajas Competitivas & Beneficios
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        {current.benefits.map((b, idx) => (
                          <div
                            key={idx}
                            className="p-2.5 rounded-xl bg-[#15213A] border border-[#33405A] text-[11px] font-medium text-white flex items-center gap-1.5"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-[#F5B51B]" />
                            <span className="truncate">{b}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 p-3 rounded-xl bg-[#15213A]/50 border border-[#33405A]/50 text-[11px] text-[#AEB7C8]">
                      💡 <strong className="text-white">Identidad Local:</strong> Diseñado específicamente para responder a las características geográficas, legales y operativas de Formosa Capital.
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* TAB 2: DIAGRAMA DE FLUJO (7 PASOS) */}
      {activeTab === 'flow' && (
        <div className="space-y-6">
          <div className="p-5 rounded-3xl bg-[#15213A] border border-[#33405A] shadow-xl">
            <h3 className="text-base font-bold text-white mb-1">
              Diagrama de Flujo — Experiencia Completa de Extremo a Extremo
            </h3>
            <p className="text-xs text-[#AEB7C8] mb-6">
              El ciclo de vida del servicio garantiza inmediatez, seguridad y separación económica del pago.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
              {flowSteps.map((f, i) => (
                <div
                  key={f.step}
                  className="p-4 rounded-2xl bg-[#0D1930] border border-[#33405A] hover:border-[#F5B51B] transition-all flex flex-col justify-between relative group shadow-md"
                >
                  <div>
                    <div className="w-8 h-8 rounded-full bg-[#F5B51B] text-[#081226] font-black text-sm flex items-center justify-center mb-3 shadow-md">
                      {f.step}
                    </div>
                    <h4 className="text-xs font-bold text-white mb-1.5">{f.title}</h4>
                    <p className="text-[11px] text-[#AEB7C8] leading-relaxed">{f.desc}</p>
                  </div>
                  {i < flowSteps.length - 1 && (
                    <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-[#F5B51B] font-bold text-base">
                      →
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Flow Mechanics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-[#15213A] border border-[#33405A]">
              <div className="flex items-center gap-2 mb-2 text-[#F5B51B] font-bold text-xs uppercase">
                <Cpu className="w-4 h-4" />
                <span>1. Matching por Rondas</span>
              </div>
              <p className="text-xs text-[#AEB7C8] leading-relaxed">
                Ronda 1: Candidatos ideales &lt;1.5km (con preferencia de conductora si aplica). Si no hay respuesta en 15 seg, amplía a Ronda 2 (&lt;3.5km) y Ronda 3 con fallback general.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#15213A] border border-[#33405A]">
              <div className="flex items-center gap-2 mb-2 text-[#59C878] font-bold text-xs uppercase">
                <QrCode className="w-4 h-4" />
                <span>2. Liquidación Directa</span>
              </div>
              <p className="text-xs text-[#AEB7C8] leading-relaxed">
                Al completarse el viaje, el sistema genera el QR dinámico vinculado a la cuenta del conductor. El dinero viaja directo entre pasajero y chofer sin retenciones intermedias.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#15213A] border border-[#33405A]">
              <div className="flex items-center gap-2 mb-2 text-[#06B6D4] font-bold text-xs uppercase">
                <Calendar className="w-4 h-4" />
                <span>3. Cobro Diario Configurable</span>
              </div>
              <p className="text-xs text-[#AEB7C8] leading-relaxed">
                El conductor no paga comisiones por viaje ni membresías fijas inaccesibles. BearDrive factura su servicio tecnológico mediante una cuota diaria configurable desde el Admin.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: MARCO LEGAL, SOCIEDAD & PAGOS */}
      {activeTab === 'legal' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Sociedad & Responsabilidad */}
            <div className="p-5 rounded-3xl bg-[#15213A] border border-[#33405A] shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#0D1930] border border-[#F5B51B] flex items-center justify-center text-[#F5B51B]">
                  <Building className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Estructura Societaria: BearDrive S.A.S.</h3>
                  <p className="text-[11px] text-[#AEB7C8]">Sociedad por Acciones Simplificada (Formosa)</p>
                </div>
              </div>

              <div className="space-y-2.5 text-xs text-[#AEB7C8]">
                <div className="p-3 rounded-xl bg-[#0D1930] border border-[#33405A]/70">
                  <strong className="text-white block mb-1">Rol de la Empresa:</strong>
                  BearDrive es propietaria de la plataforma tecnológica y presta el servicio digital de intermediación de software. No opera como empresa de transporte con choferes en relación de dependencia.
                </div>
                <div className="p-3 rounded-xl bg-[#0D1930] border border-[#33405A]/70">
                  <strong className="text-white block mb-1">Inscripción Fiscal:</strong>
                  Inscrita en AFIP (Responsable Inscripto / IVA sobre servicios de plataforma), ATP Formosa (Ingresos Brutos régimen local/multilateral) y tributos municipales.
                </div>
                <div className="p-3 rounded-xl bg-[#0D1930] border border-[#33405A]/70">
                  <strong className="text-white block mb-1">Contrato de Prestación de Servicios:</strong>
                  Los conductores operan como contratistas autónomos (monotributistas / RI) con libertad de horarios, vehículos propios reglamentarios y seguros correspondientes.
                </div>
              </div>
            </div>

            {/* PSP & Pagos Multivendedor */}
            <div className="p-5 rounded-3xl bg-[#15213A] border border-[#33405A] shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#0D1930] border border-[#59C878] flex items-center justify-center text-[#59C878]">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Arquitectura de Pagos PSP Multivendedor</h3>
                  <p className="text-[11px] text-[#AEB7C8]">Integración Mobbex / Mercado Pago Split 1:1</p>
                </div>
              </div>

              <div className="space-y-2.5 text-xs text-[#AEB7C8]">
                <div className="p-3 rounded-xl bg-[#0D1930] border border-[#33405A]/70">
                  <strong className="text-white block mb-1">Separación Total de Fondos:</strong>
                  El valor del viaje se liquida directamente a la cuenta del conductor. BearDrive nunca retiene el dinero del pasaje ni opera como billetera de terceros.
                </div>
                <div className="p-3 rounded-xl bg-[#0D1930] border border-[#33405A]/70">
                  <strong className="text-white block mb-1">Recaudación de Cuota Diaria:</strong>
                  BearDrive genera su propia factura por la cuota diaria de software a los choferes mediante débito automático al final del día trabajado.
                </div>
                <div className="p-3 rounded-xl bg-[#0D1930] border border-[#33405A]/70">
                  <strong className="text-white block mb-1">Cumplimiento de Privacidad & ARCO:</strong>
                  Bases de datos protegidas conforme a Ley N° 25.326. No se almacenan números completos de tarjeta (solo tokens seguros del PSP).
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer: Principios de BearDrive */}
      <div className="mt-8 pt-6 border-t border-[#33405A]/60">
        <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#AEB7C8] mb-3 text-center">
          Principios Fundamentales de BearDrive Formosa
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="p-3 rounded-2xl bg-[#0D1930] border border-[#33405A] text-center">
            <ShieldCheck className="w-5 h-5 text-[#59C878] mx-auto mb-1.5" />
            <div className="text-xs font-bold text-white">Seguridad 24/7</div>
            <div className="text-[10px] text-[#AEB7C8] mt-0.5">Monitoreo continuo</div>
          </div>
          <div className="p-3 rounded-2xl bg-[#0D1930] border border-[#33405A] text-center">
            <HeartHandshake className="w-5 h-5 text-[#F5B51B] mx-auto mb-1.5" />
            <div className="text-xs font-bold text-white">Confianza</div>
            <div className="text-[10px] text-[#AEB7C8] mt-0.5">Choferes verificados</div>
          </div>
          <div className="p-3 rounded-2xl bg-[#0D1930] border border-[#33405A] text-center">
            <CreditCard className="w-5 h-5 text-[#3B82F6] mx-auto mb-1.5" />
            <div className="text-xs font-bold text-white">Transparencia</div>
            <div className="text-[10px] text-[#AEB7C8] mt-0.5">Pagos directos</div>
          </div>
          <div className="p-3 rounded-2xl bg-[#0D1930] border border-[#33405A] text-center">
            <Sparkles className="w-5 h-5 text-[#EC4899] mx-auto mb-1.5" />
            <div className="text-xs font-bold text-white">Innovación</div>
            <div className="text-[10px] text-[#AEB7C8] mt-0.5">Matching inteligente</div>
          </div>
          <div className="p-3 rounded-2xl bg-[#0D1930] border border-[#33405A] text-center col-span-2 sm:col-span-1">
            <Users className="w-5 h-5 text-[#06B6D4] mx-auto mb-1.5" />
            <div className="text-xs font-bold text-white">Comunidad</div>
            <div className="text-[10px] text-[#AEB7C8] mt-0.5">100% Formosa</div>
          </div>
        </div>
      </div>
    </div>
  );
};

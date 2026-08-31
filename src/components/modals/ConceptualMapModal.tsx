import React, { useState } from 'react';
import { 
  Users, 
  Car, 
  CreditCard, 
  ShieldCheck, 
  Building, 
  X, 
  Cpu, 
  Gift, 
  FileCheck, 
  Sparkles,
  CheckCircle2,
  ChevronRight,
  Info
} from 'lucide-react';
import { triggerHaptic } from '../../utils/haptics';

interface ConceptualMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToScreen?: (screen: any) => void;
}

export const ConceptualMapModal: React.FC<ConceptualMapModalProps> = ({
  isOpen,
  onClose,
  onNavigateToScreen,
}) => {
  const [selectedPillarId, setSelectedPillarId] = useState<number>(1);

  if (!isOpen) return null;

  const pillars = [
    {
      id: 1,
      title: '1. Pasajero',
      icon: Users,
      badge: 'EXPERIENCIA',
      summary: 'Solicitud inmediata, transparencia de tarifas y seguridad 24/7 en Formosa.',
      points: [
        'Categorías Flash, Auto Estándar, Premium, Eco y Moto.',
        'Pago directo al conductor (Efectivo, QR interoperable o transferencia).',
        'BearPoints acumulables y canjeables en viajes futuros.',
      ],
    },
    {
      id: 2,
      title: '2. Conductor',
      icon: Car,
      badge: 'SIN COMISIÓN %',
      summary: 'El conductor conserva el 100% de la tarifa del pasaje con cobro diario fijo.',
      points: [
        'Aceptación o rechazo transparente de viajes con mapa completo.',
        'Cobro directo en mano o cuenta bancaria sin retenciones.',
        'Habilitación legal SAS Formosa con hasta 3 vehículos.',
      ],
    },
    {
      id: 3,
      title: '3. Pagos Directos',
      icon: CreditCard,
      badge: 'TRANSPARENCIA',
      summary: 'El pasajero abona al chofer. BearDrive no retiene fondos de pasajes.',
      points: [
        'Efectivo directo en mano.',
        'QR dinámico con CBU/Alias del conductor.',
        'Comprobante digital instantáneo.',
      ],
    },
    {
      id: 4,
      title: '4. Administración & SAS',
      icon: Building,
      badge: 'LEGALIDAD',
      summary: 'Marco normativo SAS Formosa y validación documental de choferes.',
      points: [
        'Validación de cédula, antecedentes y seguro comercial.',
        'Control de telemetría y seguridad ciudadana.',
        'Soporte técnico y mediación local.',
      ],
    },
    {
      id: 5,
      title: '5. Seguridad & SOS',
      icon: ShieldCheck,
      badge: 'MONITOREO',
      summary: 'Protocolo de emergencia 24/7 y geofencing en Formosa Capital.',
      points: [
        'Botón SOS conectado a central de emergencias.',
        'Compartir trayecto en tiempo real con familiares.',
        'Monitoreo satelital GPS constante.',
      ],
    },
  ];

  const currentPillar = pillars.find((p) => p.id === selectedPillarId) || pillars[0];
  const Icon = currentPillar.icon;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-[#0D1930] border-t sm:border border-[#F5B51B]/40 rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl max-h-[85vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300"
        id="modal-conceptual-map"
      >
        {/* Header */}
        <div className="flex flex-col gap-2 pb-3 border-b border-[#33405A]/70">
          <div className="w-12 h-1 bg-[#33405A] rounded-full mx-auto sm:hidden" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#15213A] border border-[#F5B51B] flex items-center justify-center text-[#F5B51B]">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-black text-white">Ecosistema & Pilares BearDrive</h3>
                <p className="text-[10px] text-[#AEB7C8]">Arquitectura de Movilidad SAS Formosa</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                triggerHaptic('light');
                onClose();
              }}
              className="w-8 h-8 rounded-full bg-[#15213A] hover:bg-[#202D47] border border-[#33405A] flex items-center justify-center text-[#AEB7C8] hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto py-3 flex flex-col gap-3 pr-0.5">
          {/* Pillar Selector Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {pillars.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  triggerHaptic('selection');
                  setSelectedPillarId(p.id);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedPillarId === p.id
                    ? 'bg-[#F5B51B] text-[#081226] shadow-md'
                    : 'bg-[#15213A] text-[#AEB7C8] border border-[#33405A]'
                }`}
              >
                {p.title}
              </button>
            ))}
          </div>

          {/* Detailed Selected Pillar Card */}
          <div className="p-4 rounded-2xl bg-[#15213A] border border-[#33405A] shadow-xl flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#0D1930] border border-[#F5B51B] flex items-center justify-center text-[#F5B51B]">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-white">{currentPillar.title}</h4>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#0D1930] text-[#F5B51B] font-bold border border-[#F5B51B]/30">
                    {currentPillar.badge}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-xs text-[#AEB7C8] leading-relaxed">
              {currentPillar.summary}
            </p>

            <div className="p-2.5 rounded-xl bg-[#0D1930] border border-[#33405A] flex flex-col gap-1.5">
              <span className="text-[10px] uppercase font-bold text-[#59C878] tracking-wider">
                Características Clave:
              </span>
              {currentPillar.points.map((pt, idx) => (
                <div key={idx} className="flex items-start gap-1.5 text-[11px] text-white">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#59C878] shrink-0 mt-0.5" />
                  <span>{pt}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Legal SAS Stamp */}
          <div className="p-3 rounded-xl bg-[#081226] border border-[#33405A] text-[10px] text-[#AEB7C8] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-[#F5B51B]" />
              <span>Personería Jurídica SAS • Formosa, Argentina</span>
            </div>
            <span className="text-[#59C878] font-bold">100% Conforme</span>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-[#33405A]/70 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-[#15213A] hover:bg-[#202D47] text-white text-xs font-bold transition-all cursor-pointer"
          >
            Entendido, volver al mapa
          </button>
        </div>
      </div>
    </div>
  );
};

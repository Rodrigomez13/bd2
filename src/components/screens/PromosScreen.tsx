import React, { useState } from 'react';
import { Tag, Sparkles, Copy, Check, ArrowRight, ShieldCheck, Zap, Heart, Gift } from 'lucide-react';
import { MOCK_PROMOS } from '../../data/mockData';
import { BearLogo, BearMascotIcon } from '../BearLogo';
import { BearMascotIllustration } from '../BearMascotIllustration';

interface PromosScreenProps {
  onUsePromo: (code: string) => void;
  onNavigateToDriver: () => void;
}

export const PromosScreen: React.FC<PromosScreenProps> = ({
  onUsePromo,
  onNavigateToDriver,
}) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    setCopiedCode(code);
    onUsePromo(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <div className="min-h-[640px] flex flex-col bg-[#081226] text-white p-4 overflow-y-auto">
      {/* Title */}
      <div className="mb-4">
        <div className="flex items-center gap-2">
          <Gift className="w-6 h-6 text-[#F5B51B]" />
          <h2 className="text-2xl font-bold text-white tracking-tight">Promociones y Flyers</h2>
        </div>
        <p className="text-xs text-[#AEB7C8] mt-0.5">
          Beneficios exclusivos de lanzamiento oficial en Formosa
        </p>
      </div>

      <div className="flex flex-col gap-4 pb-6">
        {/* Main Launch Flyer 1: 20% OFF BEAR20 (Matching Mockup Image 1) */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#15213A] via-[#202D47] to-[#0D1930] border-2 border-[#F5B51B] p-5 shadow-2xl">
          <div className="flex items-center justify-between mb-3">
            <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-[#F5B51B] text-[#081226]">
              PROMO LANZAMIENTO
            </span>
            <div className="w-8 h-8 rounded-full bg-[#0D1930] flex items-center justify-center text-lg">
              🐻
            </div>
          </div>

          <h3 className="text-3xl font-black text-white leading-none tracking-tight">
            20% OFF
          </h3>
          <p className="text-sm font-bold text-[#FFD66A] mt-1">EN TU PRIMER VIAJE</p>
          <p className="text-xs text-[#AEB7C8] mt-1">
            Disponible para motos, autos estándar y premium en toda la ciudad de Formosa.
          </p>

          {/* Golden Code Box */}
          <div className="mt-4 p-3 rounded-2xl bg-[#081226] border border-[#F5B51B] flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] text-[#AEB7C8] uppercase font-semibold">
                Ingresá el código:
              </span>
              <span className="text-xl font-black tracking-widest text-[#F5B51B]">BEAR20</span>
            </div>

            <button
              type="button"
              onClick={() => handleCopy('BEAR20')}
              className="px-4 py-2 rounded-xl bg-[#F5B51B] hover:bg-[#FFBE22] active:scale-95 text-[#081226] font-bold text-xs flex items-center gap-1.5 shadow transition-transform"
            >
              {copiedCode === 'BEAR20' ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>¡Aplicado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar y Usar</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Flyer 2: Llegamos a Formosa / Viajá a tu manera */}
        <div className="relative overflow-hidden rounded-3xl bg-[#15213A] border border-[#33405A] p-5 shadow-xl flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <BearMascotIcon size={44} />
            <div>
              <span className="text-xs font-bold text-[#F5B51B] uppercase tracking-wider block">
                ¡LLEGÓ A LA CIUDAD!
              </span>
              <h4 className="text-lg font-black text-white leading-tight">
                Lanzamiento Oficial BearDrive
              </h4>
            </div>
          </div>

          <p className="text-xs text-[#AEB7C8] leading-relaxed">
            Una nueva forma de moverte con precios justos, ofertas en tiempo real y conductores
            100% verificados.
          </p>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-[#0D1930] border border-[#33405A] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#59C878] shrink-0" />
              <span className="text-white font-medium">Viajá Seguro</span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#0D1930] border border-[#33405A] flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#F5B51B] shrink-0" />
              <span className="text-white font-medium">Flash Express</span>
            </div>
          </div>
        </div>

        {/* Flyer 3: Conductor, Ganá Más (Matching Image 1 & 2) */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#202D47] to-[#15213A] border border-[#F5B51B]/40 p-5 shadow-xl flex flex-col gap-3">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="text-xs font-black text-[#F5B51B] uppercase tracking-wider">
                ¿TENÉS AUTO O MOTO?
              </span>
              <h4 className="text-xl font-black text-white mt-0.5">
                Conductor, Ganá Más. Vos Decidís.
              </h4>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#F5B51B] text-[#081226] flex items-center justify-center font-bold text-lg shadow-md shrink-0">
              🚗
            </div>
          </div>

          <ul className="text-xs text-[#AEB7C8] flex flex-col gap-1.5 list-disc list-inside">
            <li>Ofertá tus viajes y poné tu propio precio</li>
            <li>Membresía diaria fija: sin comisiones abusivas</li>
            <li>Cobro inmediato en efectivo o transferencia directa</li>
          </ul>

          <button
            type="button"
            onClick={onNavigateToDriver}
            className="w-full mt-2 bg-[#F5B51B] hover:bg-[#FFBE22] active:scale-95 text-[#081226] font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow"
          >
            <span>Ver Modo Conductor y Ganancias</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

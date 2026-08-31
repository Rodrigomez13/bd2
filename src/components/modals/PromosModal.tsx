import React, { useState } from 'react';
import { 
  Tag, 
  Sparkles, 
  Copy, 
  Check, 
  X, 
  Gift, 
  ShieldCheck, 
  Zap, 
  Share2, 
  ArrowRight,
  Percent
} from 'lucide-react';
import { triggerHaptic } from '../../utils/haptics';

interface PromosModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyPromo: (code: string) => void;
}

export const PromosModal: React.FC<PromosModalProps> = ({
  isOpen,
  onClose,
  onApplyPromo,
}) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopyAndApply = (code: string) => {
    triggerHaptic('medium');
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    onApplyPromo(code);
    setTimeout(() => {
      setCopiedCode(null);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-[#0D1930] border-t sm:border border-[#F5B51B]/40 rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl max-h-[85vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300"
        id="modal-promos"
      >
        {/* Modal Handle & Header */}
        <div className="flex flex-col gap-2 pb-3 border-b border-[#33405A]/70">
          <div className="w-12 h-1 bg-[#33405A] rounded-full mx-auto sm:hidden" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#15213A] border border-[#F5B51B] flex items-center justify-center text-[#F5B51B]">
                <Gift className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-black text-white">Promociones & Descuentos</h3>
                <p className="text-[10px] text-[#AEB7C8]">Beneficios exclusivos en Formosa Capital</p>
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

        {/* Modal Content Scrollable Area */}
        <div className="flex-1 overflow-y-auto py-3.5 flex flex-col gap-3 pr-0.5">
          {/* Main Featured Promo: BEAR20 */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#15213A] via-[#202D47] to-[#0D1930] border-2 border-[#F5B51B] p-4 shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#F5B51B] text-[#081226]">
                LANZAMIENTO FORMOSA
              </span>
              <span className="text-lg">🐻</span>
            </div>

            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-white">20% OFF</span>
              <span className="text-xs font-bold text-[#FFD66A]">EN TU PRIMER VIAJE</span>
            </div>
            <p className="text-[11px] text-[#AEB7C8] mt-1">
              Válido en cualquier categoría (BearFlash, Auto o Moto) en toda Formosa.
            </p>

            <div className="mt-3 p-2.5 rounded-xl bg-[#081226] border border-[#F5B51B]/60 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[9px] text-[#AEB7C8] uppercase font-bold">Código de cupón</span>
                <span className="text-lg font-black tracking-widest text-[#F5B51B]">BEAR20</span>
              </div>
              <button
                type="button"
                onClick={() => handleCopyAndApply('BEAR20')}
                className="px-3.5 py-2 rounded-lg bg-[#F5B51B] hover:bg-[#FFBE22] active:scale-95 text-[#081226] font-black text-xs flex items-center gap-1.5 shadow-md cursor-pointer transition-all"
              >
                {copiedCode === 'BEAR20' ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>¡Aplicado!</span>
                  </>
                ) : (
                  <>
                    <Percent className="w-3.5 h-3.5" />
                    <span>Aplicar Cupón</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Referral Promo */}
          <div className="p-3.5 rounded-2xl bg-[#15213A] border border-[#33405A] flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#081226] border border-[#59C878] flex items-center justify-center text-[#59C878]">
                <Share2 className="w-3.5 h-3.5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Invitá amigos y ganá $1.500</h4>
                <p className="text-[10px] text-[#AEB7C8]">Tu amigo recibe 20% y vos crédito en tu billetera</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-2 rounded-xl bg-[#081226] border border-[#33405A] text-xs">
              <span className="font-mono font-bold text-[#59C878]">BEAR-MARTIN92</span>
              <button
                type="button"
                onClick={() => handleCopyAndApply('BEAR-MARTIN92')}
                className="text-[11px] font-bold text-[#59C878] hover:underline cursor-pointer flex items-center gap-1"
              >
                <Copy className="w-3 h-3" />
                <span>Copiar</span>
              </button>
            </div>
          </div>

          {/* Service Perks Info */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-[#15213A] border border-[#33405A] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#59C878] shrink-0" />
              <div className="flex flex-col">
                <span className="font-bold text-white text-[11px]">Viajes Seguros</span>
                <span className="text-[9px] text-[#AEB7C8]">SAS Formosa</span>
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-[#15213A] border border-[#33405A] flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#F5B51B] shrink-0" />
              <div className="flex flex-col">
                <span className="font-bold text-white text-[11px]">Llega en 2 min</span>
                <span className="text-[9px] text-[#AEB7C8]">BearFlash</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-[#33405A]/70 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-[#15213A] hover:bg-[#202D47] text-white text-xs font-bold transition-all cursor-pointer"
          >
            Listo, volver al mapa
          </button>
        </div>
      </div>
    </div>
  );
};

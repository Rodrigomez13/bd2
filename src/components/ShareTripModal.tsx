import React, { useState } from 'react';
import { Share2, Copy, Check, X, ShieldCheck, QrCode } from 'lucide-react';
import { ActiveTripState } from '../types';

interface ShareTripModalProps {
  trip: ActiveTripState;
  isOpen: boolean;
  onClose: () => void;
}

export const ShareTripModal: React.FC<ShareTripModalProps> = ({
  trip,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const [copied, setCopied] = useState(false);
  const shareUrl = `https://beardrive.app/live-track/BD-${Math.floor(1000 + Math.random() * 9000)}`;

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-[#15213A] border border-[#33405A] rounded-3xl p-6 shadow-2xl text-white flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#33405A] pb-3">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-[#F5B51B]" />
            <h3 className="text-base font-bold text-white">Compartir Viaje en Vivo</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Security badge */}
        <div className="p-3 rounded-2xl bg-[#0D1930] border border-[#33405A] flex items-center gap-3 text-xs">
          <ShieldCheck className="w-6 h-6 text-[#59C878] shrink-0" />
          <p className="text-[#AEB7C8] leading-relaxed">
            Tu contacto podrá ver tu ubicación satelital en tiempo real, el modelo del auto (
            <span className="text-white font-bold">{trip.driver.vehicleModel}</span>) y la patente.
          </p>
        </div>

        {/* Copy Link Field */}
        <div>
          <label className="text-xs text-[#AEB7C8] block mb-1 font-semibold">
            Enlace de seguimiento en tiempo real
          </label>
          <div className="flex items-center gap-2 bg-[#0D1930] border border-[#33405A] rounded-xl p-2">
            <span className="flex-1 text-xs text-[#FFD66A] truncate font-mono">{shareUrl}</span>
            <button
              type="button"
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg bg-[#F5B51B] text-[#081226] text-xs font-bold flex items-center gap-1 active:scale-95 transition-transform shrink-0"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copiado' : 'Copiar'}</span>
            </button>
          </div>
        </div>

        {/* Quick Social Share Buttons */}
        <div className="grid grid-cols-2 gap-2 mt-1">
          <button
            type="button"
            onClick={() => {
              alert('Abriendo WhatsApp con el enlace de seguimiento...');
              onClose();
            }}
            className="py-3 px-3 rounded-xl bg-[#25D366]/20 border border-[#25D366]/40 text-[#25D366] font-bold text-xs flex items-center justify-center gap-2 hover:bg-[#25D366]/30 transition-colors"
          >
            <span>WhatsApp</span>
          </button>

          <button
            type="button"
            onClick={() => {
              alert('Enviando alerta a tus contactos de emergencia preconfigurados.');
              onClose();
            }}
            className="py-3 px-3 rounded-xl bg-[#202D47] border border-[#33405A] text-white font-bold text-xs flex items-center justify-center gap-2 hover:bg-[#33405A] transition-colors"
          >
            <span>Contacto SOS</span>
          </button>
        </div>
      </div>
    </div>
  );
};

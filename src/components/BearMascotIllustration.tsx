import React from 'react';
import { BEAR_ICON_URL } from './BearLogo';

const DRIVER_BEAR_URL = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/osito%20formose%C3%B1o-Qx90gjb2loMTi0ifx0j1Vbh8Xg91Qe.png';

interface BearMascotIllustrationProps {
  variant?: 'driver-car' | 'moto' | 'radar-search' | 'happy-arrival' | 'hero-poster';
  className?: string;
}

export const BearMascotIllustration: React.FC<BearMascotIllustrationProps> = ({ variant = 'driver-car', className = '' }) => {
  if (variant === 'driver-car' || variant === 'hero-poster') {
    return (
      <div className={`relative overflow-hidden rounded-2xl bg-[#15213A] border border-[#33405A]/60 shadow-xl ${className}`}>
        <img src={DRIVER_BEAR_URL} alt="Osito de BearDrive conduciendo por Formosa" referrerPolicy="no-referrer" className="block h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#081226]/65 via-transparent to-transparent pointer-events-none" />
      </div>
    );
  }

  if (variant === 'radar-search') {
    return (
      <div className={`relative flex items-center justify-center p-8 ${className}`}>
        <div className="absolute w-64 h-64 rounded-full border border-[#F5B51B]/20 animate-pulse-ring" />
        <div className="absolute w-48 h-48 rounded-full border border-[#F5B51B]/40 animate-pulse-ring" style={{ animationDelay: '0.6s' }} />
        <div className="relative z-10 rounded-full bg-[#15213A] border-4 border-[#F5B51B] p-3 shadow-[0_0_30px_rgba(245,181,27,0.4)]">
          <img src={BEAR_ICON_URL} alt="BearDrive buscando conductor" referrerPolicy="no-referrer" className="h-20 w-20 object-contain" />
        </div>
      </div>
    );
  }

  if (variant === 'moto') {
    return (
      <div className={`relative overflow-hidden rounded-2xl bg-[#15213A] p-4 flex items-center justify-between border border-[#F5B51B]/30 shadow-lg ${className}`}>
        <div className="flex-1 pr-4"><span className="inline-block px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase bg-[#F5B51B] text-[#081226] rounded-full mb-1.5">Flash Delivery & Ride</span><h4 className="text-lg font-bold text-white leading-tight">BearFlash Moto</h4><p className="text-xs text-[#AEB7C8] mt-1">Llegá en la mitad del tiempo esquivando el tráfico.</p></div>
        <img src={BEAR_ICON_URL} alt="Ícono BearDrive" referrerPolicy="no-referrer" className="h-20 w-20 rounded-full object-contain bg-[#081226] border-2 border-[#F5B51B]" />
      </div>
    );
  }

  return <div className={`flex flex-col items-center justify-center text-center p-6 ${className}`}><img src={BEAR_ICON_URL} alt="BearDrive" referrerPolicy="no-referrer" className="h-20 w-20 object-contain mb-3" /><h3 className="text-xl font-bold text-white">¡Llegamos a destino!</h3><p className="text-xs text-[#AEB7C8] mt-1">Esperamos que hayas disfrutado tu viaje con BearDrive.</p></div>;
};

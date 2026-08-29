import React from 'react';

interface BearMascotIllustrationProps {
  variant?: 'driver-car' | 'moto' | 'radar-search' | 'happy-arrival' | 'hero-poster';
  className?: string;
}

export const BearMascotIllustration: React.FC<BearMascotIllustrationProps> = ({
  variant = 'driver-car',
  className = '',
}) => {
  if (variant === 'driver-car') {
    return (
      <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#15213A] to-[#081226] p-4 flex items-center justify-center border border-[#33405A]/60 shadow-xl ${className}`}>
        <svg viewBox="0 0 400 300" className="w-full h-auto max-h-56 drop-shadow-2xl" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Sunset sky gradient in Formosa */}
          <defs>
            <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2A1B4E" />
              <stop offset="40%" stopColor="#803D4C" />
              <stop offset="70%" stopColor="#D97736" />
              <stop offset="100%" stopColor="#081226" />
            </linearGradient>
            <linearGradient id="bearBody" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFAE19" />
              <stop offset="100%" stopColor="#D87806" />
            </linearGradient>
            <radialGradient id="goldGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFBE22" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#FFBE22" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Sky background & city silhouettes */}
          <rect width="400" height="300" rx="16" fill="url(#skyGrad)" />
          <circle cx="320" cy="90" r="100" fill="url(#goldGlow)" />

          {/* City skyline silhouettes */}
          <path d="M0 220L20 220L20 180L45 180L45 220L80 220L80 150L110 150L110 220L150 220L150 170L190 170L190 220L240 220L240 140L280 140L280 220L340 220L340 190L370 190L370 220L400 220L400 300L0 300Z" fill="#0D1930" opacity="0.8" />
          
          {/* Palm trees silhouettes (Formosa vibe) */}
          <path d="M40 220Q45 160 50 140M50 140Q35 130 20 135M50 140Q65 130 75 135M50 140Q40 120 30 115M50 140Q60 120 70 115" stroke="#081226" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M360 220Q355 160 350 140M350 140Q335 130 320 135M350 140Q365 130 375 135M350 140Q340 120 330 115M350 140Q360 120 370 115" stroke="#081226" strokeWidth="3" fill="none" strokeLinecap="round" />

          {/* Car windshield frame */}
          <path d="M30 290L90 180L310 180L370 290" stroke="#33405A" strokeWidth="8" strokeLinecap="round" />
          <path d="M90 180L140 140L260 140L310 180" stroke="#202D47" strokeWidth="6" strokeLinecap="round" fill="none" />

          {/* Bear Body & Yellow Uniform */}
          <path d="M120 300Q130 200 200 200Q270 200 280 300Z" fill="#F5B51B" stroke="#081226" strokeWidth="3" />
          {/* Bear Arms holding steering wheel */}
          <path d="M130 250Q170 220 190 240" stroke="#F5B51B" strokeWidth="24" strokeLinecap="round" />
          <path d="M270 250Q230 220 210 240" stroke="#F5B51B" strokeWidth="24" strokeLinecap="round" />

          {/* Steering Wheel */}
          <circle cx="200" cy="245" r="50" stroke="#15213A" strokeWidth="12" fill="none" />
          <circle cx="200" cy="245" r="18" fill="#081226" stroke="#F5B51B" strokeWidth="3" />
          <path d="M200 245L155 245M200 245L245 245M200 245L200 290" stroke="#15213A" strokeWidth="8" />

          {/* Bear Head */}
          <circle cx="150" cy="115" r="22" fill="#FFAE19" stroke="#081226" strokeWidth="3" />
          <circle cx="150" cy="115" r="11" fill="#FFD66A" />
          <circle cx="250" cy="115" r="22" fill="#FFAE19" stroke="#081226" strokeWidth="3" />
          <circle cx="250" cy="115" r="11" fill="#FFD66A" />

          <circle cx="200" cy="145" r="58" fill="url(#bearBody)" stroke="#081226" strokeWidth="3" />

          {/* Bear Cap */}
          <path d="M152 125C155 90 245 90 248 125C255 128 250 135 200 135C150 135 145 128 152 125Z" fill="#081226" />
          <path d="M140 128C170 122 230 122 260 128C270 132 250 142 200 142C150 142 130 132 140 128Z" fill="#15213A" stroke="#081226" strokeWidth="2" />
          {/* Cap Lightning Icon */}
          <path d="M201 106L196 113H201L198 121L206 113H201L201 106Z" fill="#FFD66A" />

          {/* Eyes */}
          <circle cx="178" cy="142" r="7" fill="#081226" />
          <circle cx="180" cy="139" r="2.5" fill="#FFFFFF" />
          <circle cx="222" cy="142" r="7" fill="#081226" />
          <circle cx="224" cy="139" r="2.5" fill="#FFFFFF" />

          {/* Snout */}
          <ellipse cx="200" cy="165" rx="24" ry="18" fill="#FFFFFF" stroke="#081226" strokeWidth="2" />
          <path d="M192 156C192 152 208 152 208 156C208 162 200 167 200 167C200 167 192 162 192 156Z" fill="#081226" />
          <path d="M192 168C196 173 204 173 208 168" stroke="#081226" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  if (variant === 'radar-search') {
    return (
      <div className={`relative flex items-center justify-center p-8 ${className}`}>
        {/* Animated concentric rings */}
        <div className="absolute w-64 h-64 rounded-full border border-[#F5B51B]/20 animate-pulse-ring" />
        <div className="absolute w-48 h-48 rounded-full border border-[#F5B51B]/40 animate-pulse-ring" style={{ animationDelay: '0.6s' }} />
        <div className="absolute w-32 h-32 rounded-full border border-[#FFD66A]/60 animate-pulse-ring" style={{ animationDelay: '1.2s' }} />

        {/* Orbiting mock cars */}
        <div className="absolute w-56 h-56 rounded-full border border-[#33405A]/40 animate-spin" style={{ animationDuration: '12s' }}>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#202D47] border border-[#F5B51B] p-1.5 rounded-full shadow-lg">
            <span className="text-xs">🚗</span>
          </div>
          <div className="absolute bottom-4 right-4 bg-[#202D47] border border-[#59C878] p-1.5 rounded-full shadow-lg">
            <span className="text-xs">⚡</span>
          </div>
        </div>

        {/* Center Mascot Avatar */}
        <div className="relative z-10 w-24 h-24 rounded-full bg-[#15213A] border-4 border-[#F5B51B] flex items-center justify-center shadow-[0_0_30px_rgba(245,181,27,0.4)]">
          <svg viewBox="0 0 100 100" className="w-16 h-16" fill="none">
            <circle cx="28" cy="28" r="14" fill="#F5B51B" />
            <circle cx="72" cy="28" r="14" fill="#F5B51B" />
            <circle cx="50" cy="52" r="38" fill="#F5B51B" />
            <circle cx="36" cy="46" r="4.5" fill="#081226" />
            <circle cx="64" cy="46" r="4.5" fill="#081226" />
            <ellipse cx="50" cy="62" rx="16" ry="12" fill="#FFFFFF" />
            <circle cx="50" cy="57" r="4" fill="#081226" />
            <path d="M44 65C47 68 53 68 56 65" stroke="#081226" strokeWidth="2" strokeLinecap="round" />
            {/* Cap */}
            <path d="M30 32C40 24 60 24 70 32C74 36 68 40 50 40C32 40 26 36 30 32Z" fill="#081226" />
            <polygon points="50,26 48,30 51,30 49,34 53,30 50,30" fill="#FFD66A" />
          </svg>
        </div>
      </div>
    );
  }

  if (variant === 'moto') {
    return (
      <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#15213A] via-[#202D47] to-[#15213A] p-4 flex items-center justify-between border border-[#F5B51B]/30 shadow-lg ${className}`}>
        <div className="flex-1 pr-4">
          <span className="inline-block px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase bg-[#F5B51B] text-[#081226] rounded-full mb-1.5">
            Flash Delivery & Ride
          </span>
          <h4 className="text-lg font-bold text-white leading-tight">BearFlash Moto</h4>
          <p className="text-xs text-[#AEB7C8] mt-1">Llegá en la mitad del tiempo esquivando el tráfico.</p>
        </div>
        <div className="w-20 h-20 bg-[#081226] rounded-full border-2 border-[#F5B51B] flex items-center justify-center shrink-0 shadow-inner">
          <span className="text-3xl">🛵</span>
        </div>
      </div>
    );
  }

  // Default happy arrival
  return (
    <div className={`flex flex-col items-center justify-center text-center p-6 ${className}`}>
      <div className="w-20 h-20 rounded-full bg-[#15213A] border-3 border-[#59C878] flex items-center justify-center mb-3 shadow-[0_0_20px_rgba(89,200,120,0.3)]">
        <span className="text-4xl">🎉</span>
      </div>
      <h3 className="text-xl font-bold text-white">¡Llegamos a destino!</h3>
      <p className="text-xs text-[#AEB7C8] mt-1">Esperamos que hayas disfrutado tu viaje con BearDrive.</p>
    </div>
  );
};

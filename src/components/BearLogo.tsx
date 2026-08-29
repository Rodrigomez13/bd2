import React from 'react';

interface BearLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showWordmark?: boolean;
  showSlogan?: boolean;
  className?: string;
  horizontal?: boolean;
}

export const BearMascotIcon: React.FC<{ size?: number; className?: string }> = ({
  size = 40,
  className = '',
}) => {
  return (
    <div
      style={{ width: size, height: size }}
      className={`relative inline-flex items-center justify-center shrink-0 ${className}`}
    >
      <svg
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_4px_12px_rgba(245,181,27,0.25)]"
      >
        {/* Outer shield/head glow background */}
        <path
          d="M60 112C32 98 12 78 12 44C12 24 26 12 46 12C52 12 56.5 14.5 60 18C63.5 14.5 68 12 74 12C94 12 108 24 108 44C108 78 88 98 60 112Z"
          fill="#15213A"
          stroke="#F5B51B"
          strokeWidth="3"
        />

        {/* Bear Left Ear */}
        <circle cx="34" cy="32" r="16" fill="#F5B51B" stroke="#0D1930" strokeWidth="2.5" />
        <circle cx="34" cy="32" r="8.5" fill="#FFD66A" />

        {/* Bear Right Ear */}
        <circle cx="86" cy="32" r="16" fill="#F5B51B" stroke="#0D1930" strokeWidth="2.5" />
        <circle cx="86" cy="32" r="8.5" fill="#FFD66A" />

        {/* Bear Head Base */}
        <path
          d="M26 62C26 40 40 28 60 28C80 28 94 40 94 62C94 82 78 98 60 98C42 98 26 82 26 62Z"
          fill="#F5B51B"
          stroke="#0D1930"
          strokeWidth="2.5"
        />

        {/* Eyes */}
        <circle cx="46" cy="54" r="5" fill="#081226" />
        <circle cx="48" cy="52" r="1.5" fill="#FFFFFF" />
        <circle cx="74" cy="54" r="5" fill="#081226" />
        <circle cx="76" cy="52" r="1.5" fill="#FFFFFF" />

        {/* White Snout Muzzle */}
        <ellipse cx="60" cy="72" rx="18" ry="14" fill="#FFFFFF" stroke="#081226" strokeWidth="1.5" />

        {/* Black Nose */}
        <path
          d="M54 66C54 64 66 64 66 66C66 70 60 74 60 74C60 74 54 70 54 66Z"
          fill="#081226"
        />

        {/* Friendly Mouth */}
        <path
          d="M54 75C57 78 63 78 66 75"
          stroke="#081226"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Optional Cap Visor Accent */}
        <path
          d="M40 34C48 30 72 30 80 34C84 36 78 40 60 40C42 40 36 36 40 34Z"
          fill="#081226"
          opacity="0.9"
        />
        {/* Golden lightning badge on cap */}
        <path
          d="M61 31L58 35H61L59 39L63 35H60L61 31Z"
          fill="#FFD66A"
        />
      </svg>
    </div>
  );
};

export const BearLogo: React.FC<BearLogoProps> = ({
  size = 'md',
  showWordmark = true,
  showSlogan = false,
  className = '',
  horizontal = true,
}) => {
  const pixelSizes = {
    sm: 32,
    md: 46,
    lg: 64,
    xl: 88,
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl',
  };

  return (
    <div
      className={`inline-flex ${
        horizontal ? 'flex-row items-center gap-3' : 'flex-col items-center text-center gap-2'
      } ${className}`}
    >
      <BearMascotIcon size={pixelSizes[size]} />
      {showWordmark && (
        <div className="flex flex-col">
          <div className={`font-extrabold tracking-tight ${textSizes[size]} leading-none`}>
            <span className="text-[#F5F7FA]">Bear</span>
            <span className="text-[#F5B51B]">Drive</span>
          </div>
          {showSlogan && (
            <span className="text-xs text-[#AEB7C8] font-medium tracking-wide mt-1">
              Tu viaje. Tu elección. Tu camino.
            </span>
          )}
        </div>
      )}
    </div>
  );
};

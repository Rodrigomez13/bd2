import React from 'react';

const BEAR_ICON_URL = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-beardrive-RWdyfxydxTNGJexZYmk2yMDlpCGWWK.png';
const BEARDRIVE_LOGO_URL = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-beardrive-gZXzou9PbAMP7cnMKAUNJRdJDIFN6Y.svg';

interface BearLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showWordmark?: boolean;
  showSlogan?: boolean;
  className?: string;
  horizontal?: boolean;
}

export const BearMascotIcon: React.FC<{ size?: number; className?: string }> = ({ size = 40, className = '' }) => (
  <img
    src={BEAR_ICON_URL}
    alt="Ícono de oso BearDrive"
    width={size}
    height={size}
    referrerPolicy="no-referrer"
    className={`object-contain shrink-0 drop-shadow-[0_4px_12px_rgba(245,181,27,0.25)] ${className}`}
  />
);

export const BearLogo: React.FC<BearLogoProps> = ({
  size = 'md', showWordmark = true, showSlogan = false, className = '', horizontal = true,
}) => {
  const dimensions = { sm: 'h-8 w-24', md: 'h-10 w-32', lg: 'h-14 w-44', xl: 'h-20 w-56' };
  return (
    <div className={`inline-flex ${horizontal ? 'flex-row items-center' : 'flex-col items-center'} ${className}`}>
      <img
        src={BEARDRIVE_LOGO_URL}
        alt="BearDrive"
        referrerPolicy="no-referrer"
        className={`${dimensions[size]} object-contain`}
      />
      {showSlogan && <span className="sr-only">Tu viaje. Tu elección. Tu camino.</span>}
      {!showWordmark && <span className="sr-only">BearDrive</span>}
    </div>
  );
};

export { BEAR_ICON_URL, BEARDRIVE_LOGO_URL };

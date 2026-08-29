import React from 'react';
import { ArrowLeft, Bell, Shield, User } from 'lucide-react';
import { BearLogo } from './BearLogo';
import { ScreenId } from '../types';

interface TopBarProps {
  currentScreen: ScreenId;
  onBack?: () => void;
  title?: string;
  onNavigate: (screen: ScreenId) => void;
  userAvatar?: string;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentScreen,
  onBack,
  title,
  onNavigate,
  userAvatar,
}) => {
  const showBack = currentScreen !== 'home' && currentScreen !== 'login';

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-[#081226]/95 backdrop-blur-md border-b border-[#33405A]/40 min-h-[58px]">
      <div className="flex items-center gap-3">
        {showBack ? (
          <button
            type="button"
            onClick={onBack || (() => onNavigate('home'))}
            className="w-10 h-10 rounded-full bg-[#15213A] border border-[#33405A] flex items-center justify-center text-white active:scale-95 transition-transform"
            aria-label="Volver atrás"
          >
            <ArrowLeft className="w-5 h-5 text-[#F5F7FA]" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onNavigate('account')}
            className="flex items-center gap-2 text-left"
          >
            <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-[#F5B51B] bg-[#15213A] flex items-center justify-center">
              {userAvatar ? (
                <img
                  src={userAvatar}
                  alt="Perfil"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-5 h-5 text-[#F5B51B]" />
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] text-[#AEB7C8] leading-none">Buenas noches</span>
              <span className="text-sm font-bold text-white leading-tight">Martín</span>
            </div>
          </button>
        )}

        {showBack && title && (
          <h1 className="text-base font-bold text-white tracking-tight truncate max-w-[180px]">
            {title}
          </h1>
        )}
      </div>

      {/* Center / Right Brand Wordmark or Actions */}
      <div className="flex items-center gap-2">
        {!showBack ? (
          <BearLogo size="sm" showWordmark={true} />
        ) : !title ? (
          <div className="font-extrabold text-xl tracking-tight">
            <span className="text-[#F5F7FA]">Bear</span>
            <span className="text-[#F5B51B]">Drive</span>
          </div>
        ) : null}

        <button
          type="button"
          onClick={() => onNavigate('promos')}
          className="w-9 h-9 rounded-full bg-[#15213A] border border-[#33405A] flex items-center justify-center text-[#F5B51B] active:scale-95 transition-transform relative"
          aria-label="Notificaciones y promociones"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#F5B51B] animate-pulse" />
        </button>
      </div>
    </header>
  );
};

import React from 'react';
import { Home, Car, Clock, Tag, User, Zap } from 'lucide-react';
import { ScreenId } from '../types';
import { BearMascotIcon } from './BearLogo';

interface BottomNavigationProps {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  currentScreen,
  onNavigate,
}) => {
  // Hide bottom nav on full-screen immersion views
  const isNavView =
    currentScreen === 'login' ||
    currentScreen === 'active-trip' ||
    currentScreen === 'searching-driver';

  if (isNavView) return null;

  const tabs = [
    { id: 'home', label: 'Inicio', icon: Home, targetScreen: 'home' as ScreenId },
    { id: 'rides', label: 'Viajar', icon: Car, targetScreen: 'select-ride' as ScreenId },
    { id: 'activity', label: 'Actividad', icon: Clock, targetScreen: 'history' as ScreenId },
    { id: 'promos', label: 'Promos', icon: Tag, targetScreen: 'promos' as ScreenId },
    { id: 'account', label: 'Cuenta', icon: User, targetScreen: 'account' as ScreenId },
  ];

  return (
    <nav
      className="sticky bottom-0 z-30 w-full bg-[#081226]/95 backdrop-blur-md border-t border-[#33405A]/50 px-2 py-1.5 flex items-center justify-around"
      id="bear-bottom-nav"
    >
      {tabs.map((tab) => {
        const isSelected =
          currentScreen === tab.targetScreen ||
          (tab.id === 'home' && (currentScreen === 'home' || currentScreen === 'search')) ||
          (tab.id === 'rides' && (currentScreen === 'select-ride' || currentScreen === 'driver-found')) ||
          (tab.id === 'account' && (currentScreen === 'account' || currentScreen === 'payments' || currentScreen === 'driver-profile'));

        const Icon = tab.icon;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onNavigate(tab.targetScreen)}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all relative ${
              isSelected ? 'text-[#F5B51B]' : 'text-[#AEB7C8] hover:text-[#F5F7FA]'
            }`}
          >
            <div
              className={`flex items-center justify-center w-10 h-7 rounded-full transition-all ${
                isSelected ? 'bg-[#F5B51B]/15 text-[#F5B51B]' : ''
              }`}
            >
              <Icon className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span
              className={`text-[11px] mt-0.5 tracking-tight font-medium ${
                isSelected ? 'font-bold text-[#F5B51B]' : 'text-[#AEB7C8]'
              }`}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

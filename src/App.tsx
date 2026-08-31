import React, { useState } from 'react';
import { TopBar } from './components/TopBar';
import { BottomNavigation } from './components/BottomNavigation';
import { LoginScreen } from './components/screens/LoginScreen';
import { HomeScreen } from './components/screens/HomeScreen';
import { DestinationSearchScreen } from './components/screens/DestinationSearchScreen';
import { SelectRideScreen } from './components/screens/SelectRideScreen';
import { SearchingDriverScreen } from './components/screens/SearchingDriverScreen';
import { DriverFoundScreen } from './components/screens/DriverFoundScreen';
import { DriverProfileScreen } from './components/screens/DriverProfileScreen';
import { ActiveTripScreen } from './components/screens/ActiveTripScreen';
import { TripFinishedScreen } from './components/screens/TripFinishedScreen';
import { AccountScreen } from './components/screens/AccountScreen';
import { TripHistoryScreen } from './components/screens/TripHistoryScreen';
import { PaymentMethodsScreen } from './components/screens/PaymentMethodsScreen';
import { PromosScreen } from './components/screens/PromosScreen';
import { DriverModeScreen } from './components/screens/DriverModeScreen';
import { ConceptualMapScreen } from './components/screens/ConceptualMapScreen';
import { DriverOnboardingScreen } from './components/screens/DriverOnboardingScreen';
import { AdminPanelScreen } from './components/screens/AdminPanelScreen';
import { BearPointsScreen } from './components/screens/BearPointsScreen';
import { ChatCallModal } from './components/ChatCallModal';
import { ShareTripModal } from './components/ShareTripModal';
import { ScreenId, LocationItem, RideCategory, PaymentMethod, DriverInfo, ActiveTripState } from './types';
import { MOCK_LOCATIONS, RIDE_CATEGORIES, PAYMENT_METHODS, MOCK_DRIVERS, INITIAL_USER } from './data/mockData';
import { triggerHaptic } from './utils/haptics';
import { Layers, ShieldAlert, Sparkles, CheckCircle2, Info } from 'lucide-react';

export function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('home');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [selectedOrigin, setSelectedOrigin] = useState<LocationItem>(MOCK_LOCATIONS[0]);
  const [selectedDestination, setSelectedDestination] = useState<LocationItem>(MOCK_LOCATIONS[3]);
  const [selectedDriver, setSelectedDriver] = useState<DriverInfo>(MOCK_DRIVERS[0]);
  const [showScreenSwitcher, setShowScreenSwitcher] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type?: 'info' | 'success' } | null>(null);

  const showToast = (text: string, type: 'info' | 'success' = 'info') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Active trip state
  const [activeTrip, setActiveTrip] = useState<ActiveTripState>({
    id: 'trip-current',
    origin: MOCK_LOCATIONS[0],
    destination: MOCK_LOCATIONS[3],
    category: RIDE_CATEGORIES[0],
    driver: MOCK_DRIVERS[0],
    price: 2360,
    status: 'driver-assigned',
    paymentMethod: PAYMENT_METHODS[0],
    discount: 590,
  });

  // Modals state
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [showSosAlert, setShowSosAlert] = useState(false);

  // Screen transition handlers
  const handleStartRide = (dest?: LocationItem) => {
    if (dest) {
      setSelectedDestination(dest);
      setCurrentScreen('select-ride');
    } else {
      setCurrentScreen('search');
    }
  };

  const handleSelectDestination = (dest: LocationItem) => {
    setSelectedDestination(dest);
    setCurrentScreen('select-ride');
  };

  const handleConfirmRide = (category: RideCategory, payment: PaymentMethod, promoCode?: string) => {
    const discount = promoCode ? Math.round(category.basePrice * 0.2) : 0;
    const finalPrice = category.basePrice - discount;

    setActiveTrip({
      id: `trip-${Date.now()}`,
      origin: selectedOrigin,
      destination: selectedDestination,
      category,
      driver: MOCK_DRIVERS[0],
      price: finalPrice,
      status: 'searching',
      paymentMethod: payment,
      discount,
    });

    setCurrentScreen('searching-driver');
  };

  const handleDriverFound = () => {
    setCurrentScreen('driver-found');
  };

  const handleStartActiveTrip = () => {
    setCurrentScreen('active-trip');
  };

  const handleFinishTrip = () => {
    setCurrentScreen('trip-finished');
  };

  const handleTripRatingComplete = () => {
    setCurrentScreen('home');
  };

  const handleBack = () => {
    switch (currentScreen) {
      case 'search':
      case 'select-ride':
      case 'driver-mode':
      case 'history':
      case 'payments':
      case 'promos':
      case 'conceptual-map':
      case 'bear-points':
      case 'admin-panel':
      case 'driver-onboarding':
        setCurrentScreen('home');
        break;
      case 'searching-driver':
        setCurrentScreen('select-ride');
        break;
      case 'driver-found':
        setCurrentScreen('home');
        break;
      case 'driver-profile':
        setCurrentScreen('driver-found');
        break;
      case 'active-trip':
        setCurrentScreen('home');
        break;
      case 'trip-finished':
        setCurrentScreen('home');
        break;
      default:
        setCurrentScreen('home');
    }
  };

  // Check if TopBar or BottomNav should be shown
  const showTopBar = currentScreen !== 'login';
  const showBottomNav =
    currentScreen === 'home' ||
    currentScreen === 'promos' ||
    currentScreen === 'history' ||
    currentScreen === 'account';

  const screensList: { id: ScreenId; label: string; group: string }[] = [
    { id: 'conceptual-map', label: '⭐ 00 • Ecosistema & Mapa Conceptual (8 Pilares)', group: 'Arquitectura' },
    { id: 'login', label: '01 • Login / Bienvenida', group: 'Auth' },
    { id: 'home', label: '02 • Inicio Nocturno & Mapa', group: 'Pasajero' },
    { id: 'search', label: '03 • Buscar Destino', group: 'Pasajero' },
    { id: 'select-ride', label: '04 • Selección de Viaje (BearFlash)', group: 'Pasajero' },
    { id: 'searching-driver', label: '05 • Buscando Conductor (Radar)', group: 'Pasajero' },
    { id: 'driver-found', label: '06 • Conductor Encontrado', group: 'Pasajero' },
    { id: 'driver-profile', label: '07 • Perfil de Conductor (Martín)', group: 'Pasajero' },
    { id: 'active-trip', label: '08 • En Viaje / GPS en Vivo', group: 'Pasajero' },
    { id: 'trip-finished', label: '09 • Viaje Finalizado & Calificación', group: 'Pasajero' },
    { id: 'promos', label: '10 • Promos & Flyers Oficiales', group: 'Beneficios' },
    { id: 'bear-points', label: '11 • BearPoints & Fidelización', group: 'Beneficios' },
    { id: 'history', label: '12 • Mis Viajes & Recibos', group: 'Usuario' },
    { id: 'payments', label: '13 • Métodos de Pago & Wallet', group: 'Usuario' },
    { id: 'account', label: '14 • Mi Cuenta & Habilitaciones', group: 'Usuario' },
    { id: 'driver-onboarding', label: '15 • Registro & Habilitación Chofer (8 Docs)', group: 'Conductor' },
    { id: 'driver-mode', label: '16 • Modo Conductor & Cobro Diario', group: 'Conductor' },
    { id: 'admin-panel', label: '17 • Panel de Control & Admin (SAS Formosa)', group: 'Backoffice' },
  ];

  return (
    <div className="min-h-screen bg-[#040914] text-[#F5F7FA] flex flex-col items-center justify-start p-0 sm:p-4 selection:bg-[#F5B51B] selection:text-[#081226]">
      {/* Top Demo Bar / Screen Switcher Shortcut */}
      <div className="w-full max-w-md mb-2 px-2 hidden sm:flex items-center justify-between text-xs text-[#AEB7C8]">
        <div className="flex items-center gap-1.5 font-bold text-[#F5B51B]">
          <span>🐻 BearDrive Formosa</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#15213A] border border-[#33405A] text-[#AEB7C8]">
            v2.5 Ecosistema Completo
          </span>
        </div>
        <button
          type="button"
          onClick={() => setShowScreenSwitcher(!showScreenSwitcher)}
          className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#15213A] border border-[#F5B51B]/50 text-[#F5B51B] hover:bg-[#202D47] transition-colors cursor-pointer"
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Ver todas las pantallas ({screensList.length})</span>
        </button>
      </div>

      {/* Screen Switcher Drawer Modal */}
      {showScreenSwitcher && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#15213A] border border-[#F5B51B] rounded-3xl p-5 shadow-2xl max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-[#33405A]">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#F5B51B]" />
                <h3 className="text-base font-black text-white">Explorador de Pantallas BearDrive</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowScreenSwitcher(false)}
                className="text-xs text-[#AEB7C8] hover:text-white px-2 py-1 bg-[#202D47] rounded-lg cursor-pointer"
              >
                Cerrar ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-3 flex flex-col gap-1.5">
              {screensList.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    setCurrentScreen(s.id);
                    setShowScreenSwitcher(false);
                  }}
                  className={`flex items-center justify-between p-3 rounded-xl text-left text-xs font-semibold transition-all cursor-pointer ${
                    currentScreen === s.id
                      ? 'bg-[#F5B51B] text-[#081226] font-bold shadow-md'
                      : 'bg-[#0D1930] hover:bg-[#202D47] text-white border border-[#33405A]'
                  }`}
                >
                  <span>{s.label}</span>
                  <span className="text-[10px] opacity-75 font-mono">[{s.group}]</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Device Frame Mockup */}
      <div className="w-full max-w-md bg-[#081226] border-0 sm:border sm:border-[#33405A] sm:rounded-[36px] shadow-2xl overflow-hidden flex flex-col min-h-[100dvh] sm:min-h-[720px] sm:max-h-[840px] relative">
        {/* Global Top Bar */}
        {showTopBar && (
          <TopBar
            currentScreen={currentScreen}
            onBack={handleBack}
            onNavigate={(screen) => setCurrentScreen(screen)}
            userAvatar={INITIAL_USER.avatarUrl}
          />
        )}

        {/* Global Floating Toast */}
        {toastMessage && (
          <div className="absolute top-16 inset-x-4 z-50 flex items-center justify-center pointer-events-none animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="px-4 py-2.5 rounded-2xl bg-[#15213A]/95 border border-[#F5B51B] text-white text-xs font-bold shadow-2xl flex items-center gap-2 backdrop-blur-md">
              {toastMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-[#59C878] shrink-0" />
              ) : (
                <Info className="w-4 h-4 text-[#F5B51B] shrink-0" />
              )}
              <span>{toastMessage.text}</span>
            </div>
          </div>
        )}

        {/* Dynamic Screen View Router */}
        <main className="flex-1 flex flex-col overflow-hidden relative">
          {currentScreen === 'conceptual-map' && (
            <ConceptualMapScreen
              onBack={handleBack}
              onNavigateToScreen={(screen) => setCurrentScreen(screen)}
            />
          )}

          {currentScreen === 'login' && (
            <LoginScreen
              onLoginSuccess={() => {
                setIsAuthenticated(true);
                setCurrentScreen('home');
              }}
            />
          )}

          {currentScreen === 'home' && (
            <HomeScreen
              userName="Martín"
              onStartRide={handleStartRide}
              onNavigate={(screen) => setCurrentScreen(screen)}
            />
          )}

          {currentScreen === 'search' && (
            <DestinationSearchScreen
              onSelectDestination={handleSelectDestination}
              onBack={handleBack}
            />
          )}

          {currentScreen === 'select-ride' && (
            <SelectRideScreen
              origin={selectedOrigin}
              destination={selectedDestination}
              onConfirmRide={handleConfirmRide}
              onBack={handleBack}
            />
          )}

          {currentScreen === 'searching-driver' && (
            <SearchingDriverScreen
              trip={activeTrip}
              onDriverFound={handleDriverFound}
              onCancel={() => setCurrentScreen('select-ride')}
            />
          )}

          {currentScreen === 'driver-found' && (
            <DriverFoundScreen
              trip={activeTrip}
              onStartTrip={handleStartActiveTrip}
              onOpenProfile={(driver) => {
                setSelectedDriver(driver);
                setCurrentScreen('driver-profile');
              }}
              onOpenChat={() => setIsChatOpen(true)}
              onOpenShare={() => setIsShareOpen(true)}
              onCancel={() => setCurrentScreen('home')}
            />
          )}

          {currentScreen === 'driver-profile' && (
            <DriverProfileScreen
              driver={selectedDriver}
              onBack={() => setCurrentScreen('driver-found')}
              onContact={() => setIsChatOpen(true)}
            />
          )}

          {currentScreen === 'active-trip' && (
            <ActiveTripScreen
              trip={activeTrip}
              onFinishTrip={handleFinishTrip}
              onOpenChat={() => setIsChatOpen(true)}
              onOpenShare={() => setIsShareOpen(true)}
              onEmergencySOS={() => setShowSosAlert(true)}
            />
          )}

          {currentScreen === 'trip-finished' && (
            <TripFinishedScreen
              trip={activeTrip}
              onComplete={handleTripRatingComplete}
            />
          )}

          {currentScreen === 'account' && (
            <AccountScreen
              onNavigate={(screen) => setCurrentScreen(screen)}
              onLogout={() => setCurrentScreen('login')}
            />
          )}

          {currentScreen === 'history' && (
            <TripHistoryScreen onBack={() => setCurrentScreen('home')} />
          )}

          {currentScreen === 'payments' && (
            <PaymentMethodsScreen onBack={() => setCurrentScreen('account')} />
          )}

          {currentScreen === 'promos' && (
            <PromosScreen
              onUsePromo={(code) => {
                showToast(`¡Código "${code}" aplicado con 20% OFF!`, 'success');
                setCurrentScreen('select-ride');
              }}
              onNavigateToDriver={() => setCurrentScreen('driver-mode')}
            />
          )}

          {currentScreen === 'bear-points' && (
            <BearPointsScreen
              onBack={() => setCurrentScreen('home')}
              onApplyReward={(reward) => {
                showToast(`¡Premio "${reward}" canjeado y aplicado!`, 'success');
                setCurrentScreen('select-ride');
              }}
            />
          )}

          {currentScreen === 'driver-onboarding' && (
            <DriverOnboardingScreen
              onBack={() => setCurrentScreen('account')}
              onComplete={() => {
                showToast('¡Documentación enviada! En revisión por Admin', 'success');
                setCurrentScreen('driver-mode');
              }}
            />
          )}

          {currentScreen === 'driver-mode' && (
            <DriverModeScreen
              onBack={() => setCurrentScreen('account')}
              onNavigateToPassenger={() => setCurrentScreen('home')}
              onNavigateToOnboarding={() => setCurrentScreen('driver-onboarding')}
            />
          )}

          {currentScreen === 'admin-panel' && (
            <AdminPanelScreen onBack={() => setCurrentScreen('account')} />
          )}
        </main>

        {/* Global Bottom Navigation */}
        {showBottomNav && (
          <BottomNavigation
            currentScreen={currentScreen}
            onNavigate={(screen) => setCurrentScreen(screen)}
            onOpenQuickSearch={() => setCurrentScreen('search')}
          />
        )}

        {/* Live Chat / Call Modal */}
        <ChatCallModal
          driver={activeTrip.driver}
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
        />

        {/* Live Share Trip Modal */}
        <ShareTripModal
          trip={activeTrip}
          isOpen={isShareOpen}
          onClose={() => setIsShareOpen(false)}
        />

        {/* Emergency SOS Modal */}
        {showSosAlert && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <div className="w-full max-w-xs bg-[#15213A] border-2 border-red-500 rounded-3xl p-5 shadow-2xl text-white text-center flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-red-600/30 border border-red-500 flex items-center justify-center text-red-500 mb-3 animate-pulse">
                <ShieldAlert className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-black text-white">Protocolo SOS Activado</h3>
              <p className="text-xs text-[#AEB7C8] my-2 leading-relaxed">
                Compartiendo telemetría en tiempo real con la Central de Seguridad de Formosa y
                contactos de emergencia.
              </p>
              <button
                type="button"
                onClick={() => {
                  triggerHaptic('light');
                  setShowSosAlert(false);
                }}
                className="w-full mt-3 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl text-xs cursor-pointer active:scale-95 transition-transform"
              >
                Entendido / Cancelar alarma
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
export default App;

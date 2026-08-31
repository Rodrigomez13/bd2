import React, { useState, useEffect } from 'react';
import { Zap, Car, Sparkles, Leaf, Bike, Tag, ChevronDown, Check, ArrowRight, Shield, Clock, MapPin } from 'lucide-react';
import { MapView } from '../MapView';
import { LocationItem, PaymentMethod, RideCategory } from '../../types';
import { PAYMENT_METHODS, RIDE_CATEGORIES } from '../../data/mockData';
import { getDirections } from '../../services/mapboxService';
import { triggerHaptic } from '../../utils/haptics';

interface SelectRideScreenProps {
  origin: LocationItem;
  destination: LocationItem;
  onConfirmRide: (category: RideCategory, payment: PaymentMethod, promoCode?: string) => void;
  onBack: () => void;
}

export const SelectRideScreen: React.FC<SelectRideScreenProps> = ({
  origin,
  destination,
  onConfirmRide,
  onBack,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<RideCategory>(RIDE_CATEGORIES[0]);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>(PAYMENT_METHODS[0]);
  const [showPaymentPicker, setShowPaymentPicker] = useState(false);
  const [promoCode, setPromoCode] = useState('BEAR20');
  const [promoApplied, setPromoApplied] = useState(true);
  const [preferFemaleDriver, setPreferFemaleDriver] = useState(false);
  const [routeInfo, setRouteInfo] = useState<{ distanceKm: number; durationMinutes: number; summary: string }>({
    distanceKm: 3.6,
    durationMinutes: 7,
    summary: 'Ruta óptima por Av. 25 de Mayo',
  });

  useEffect(() => {
    async function updateRoute() {
      const origCoords: [number, number] = [origin.lng, origin.lat];
      const destCoords: [number, number] = [destination.lng, destination.lat];
      const res = await getDirections(origCoords, destCoords);
      setRouteInfo({
        distanceKm: res.distanceKm,
        durationMinutes: res.durationMinutes,
        summary: res.summary,
      });
    }
    updateRoute();
  }, [origin, destination]);

  // Discount calculation if BEAR20 is active (20% off)
  const discountRate = promoApplied ? 0.2 : 0;
  const finalPrice = Math.round(selectedCategory.basePrice * (1 - discountRate));

  const getCategoryIcon = (type: RideCategory['iconType']) => {
    switch (type) {
      case 'flash':
        return <Zap className="w-5 h-5 fill-[#F5B51B] text-[#F5B51B]" />;
      case 'car':
        return <Car className="w-5 h-5 text-white" />;
      case 'premium':
        return <Sparkles className="w-5 h-5 text-[#FFD66A]" />;
      case 'leaf':
        return <Leaf className="w-5 h-5 text-[#59C878]" />;
      case 'moto':
        return <Bike className="w-5 h-5 text-[#F6A623]" />;
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#081226] text-white overflow-y-auto pb-24">
      {/* Top Map View with Mapbox Route */}
      <div className="relative h-[32vh] min-h-[220px] max-h-[300px] w-full shrink-0 overflow-hidden border-b border-[#33405A]/40">
        <MapView 
          origin={origin} 
          destination={destination} 
          interactive={true} 
          showControls={true}
          showBadge={false}
          controlsPosition="right-center"
          allowFullscreenToggle={true}
        />

        {/* Floating Trip Origin/Dest Pill with Edit Action */}
        <div className="absolute top-2.5 inset-x-2.5 bg-[#15213A]/95 backdrop-blur-md border border-[#33405A] rounded-2xl p-2 shadow-xl flex items-center justify-between text-xs z-20 pointer-events-auto">
          <div className="flex items-center gap-1.5 min-w-0 flex-1">
            <span className="w-2 h-2 rounded-full bg-[#59C878] shrink-0" />
            <span className="truncate text-white font-medium text-[11px]">{origin.name}</span>
            <span className="text-[#F5B51B] font-bold shrink-0 text-xs">→</span>
            <span className="w-2 h-2 rounded-full bg-[#FF4B4B] shrink-0" />
            <span className="truncate text-white font-bold text-[11px]">{destination.name}</span>
          </div>
          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              onBack();
            }}
            className="text-[10px] px-2 py-1 rounded-lg bg-[#081226] text-[#F5B51B] border border-[#F5B51B]/40 hover:bg-[#202D47] font-bold shrink-0 ml-1.5 cursor-pointer transition-all active:scale-95"
            title="Cambiar origen o destino"
          >
            Editar
          </button>
        </div>
      </div>

      {/* Bottom Sheet for Ride Category Selection */}
      <div className="px-3.5 pt-3 flex flex-col gap-3">
        <div>
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">Elegí tu categoría de viaje</h3>
              <p className="text-[10px] text-[#AEB7C8]">Tarifas fijas y transparentes para Formosa</p>
            </div>
            <span className="text-[11px] text-[#AEB7C8] font-mono bg-[#0D1930] px-2 py-0.5 rounded-lg border border-[#33405A] shrink-0">
              {routeInfo.distanceKm} km • ~{routeInfo.durationMinutes} min
            </span>
          </div>

          {/* Ride Options List */}
          <div className="flex flex-col gap-2">
            {RIDE_CATEGORIES.map((cat) => {
              const isSelected = selectedCategory.id === cat.id;
              const catFinalPrice = Math.round(cat.basePrice * (1 - discountRate));

              return (
                <div
                  key={cat.id}
                  onClick={() => {
                    triggerHaptic('selection');
                    setSelectedCategory(cat);
                  }}
                  className={`flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all active:scale-[0.99] ${
                    isSelected
                      ? 'bg-[#15213A] border-2 border-[#F5B51B] shadow-[0_0_15px_rgba(245,181,27,0.25)]'
                      : 'bg-[#15213A]/70 border border-[#33405A] hover:border-[#33405A]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-[#0D1930] border border-[#F5B51B]' : 'bg-[#0D1930]'
                      }`}
                    >
                      {getCategoryIcon(cat.iconType)}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-white truncate">{cat.name}</span>
                        {cat.badge && (
                          <span
                            className="text-[8px] font-extrabold uppercase px-1.5 py-0.2 rounded shrink-0"
                            style={{
                              backgroundColor: isSelected ? '#F5B51B' : '#202D47',
                              color: isSelected ? '#081226' : '#AEB7C8',
                            }}
                          >
                            {cat.badge}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-[#AEB7C8]">Llega en {cat.etaMinutes} min</span>
                    </div>
                  </div>

                  <div className="text-right shrink-0 ml-2">
                    <div className="text-sm font-extrabold text-[#F5B51B]">
                      ${catFinalPrice.toLocaleString('es-AR')}
                    </div>
                    {promoApplied && (
                      <div className="text-[10px] text-gray-400 line-through">
                        ${cat.basePrice.toLocaleString('es-AR')}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Payment and Promo Toolbar */}
        <div className="pt-2 border-t border-[#33405A]/60 flex flex-col gap-2.5">
          {/* Female Driver Preference */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-[#0D1930] border border-[#33405A]">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-sm">👩</span>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-white truncate">Preferencia Conductora</span>
                <span className="text-[9px] text-[#AEB7C8] truncate">Prioriza mujeres en matching</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                triggerHaptic('medium');
                setPreferFemaleDriver(!preferFemaleDriver);
              }}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all shrink-0 ml-2 cursor-pointer ${
                preferFemaleDriver
                  ? 'bg-[#EC4899] text-white shadow-md'
                  : 'bg-[#15213A] text-[#AEB7C8] border border-[#33405A]'
              }`}
            >
              {preferFemaleDriver ? 'ACTIVADA' : 'OPCIONAL'}
            </button>
          </div>

          <div className="flex items-center justify-between gap-2">
            {/* Payment Method Selector */}
            <button
              type="button"
              onClick={() => {
                triggerHaptic('light');
                setShowPaymentPicker(!showPaymentPicker);
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#15213A] border border-[#33405A] text-xs font-semibold text-white hover:border-[#F5B51B] transition-colors cursor-pointer"
            >
              <span>💳 {selectedPayment.name}</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#AEB7C8]" />
            </button>

            {/* Promo Code Pill */}
            <div className="flex items-center gap-1 px-2.5 py-2 rounded-xl bg-[#15213A] border border-[#F5B51B]/40 text-xs text-[#FFD66A]">
              <Tag className="w-3 h-3 text-[#F5B51B]" />
              <span className="font-bold">BEAR20 (-20%)</span>
              <Check className="w-3 h-3 text-[#59C878]" />
            </div>
          </div>

          {/* Payment Modal / Dropdown */}
          {showPaymentPicker && (
            <div className="bg-[#0D1930] border border-[#33405A] rounded-xl p-1.5 flex flex-col gap-1">
              {PAYMENT_METHODS.map((pm) => (
                <button
                  key={pm.id}
                  type="button"
                  onClick={() => {
                    triggerHaptic('selection');
                    setSelectedPayment(pm);
                    setShowPaymentPicker(false);
                  }}
                  className={`flex items-center justify-between p-2 rounded-lg text-xs text-left cursor-pointer ${
                    selectedPayment.id === pm.id
                      ? 'bg-[#15213A] text-[#F5B51B] font-bold'
                      : 'text-white hover:bg-[#15213A]/50'
                  }`}
                >
                  <span>{pm.name} ({pm.details})</span>
                  {selectedPayment.id === pm.id && <Check className="w-3.5 h-3.5" />}
                </button>
              ))}
            </div>
          )}

          {/* Confirm Ride CTA */}
          <button
            type="button"
            onClick={() => {
              triggerHaptic('heavy');
              onConfirmRide(selectedCategory, selectedPayment, promoCode);
            }}
            className="w-full bg-[#F5B51B] hover:bg-[#FFBE22] active:scale-[0.98] text-[#081226] font-black py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(245,181,27,0.35)] transition-all cursor-pointer text-sm"
          >
            <span>Aceptar por ${finalPrice.toLocaleString('es-AR')} • Buscar conductor</span>
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </button>
        </div>
      </div>
    </div>
  );
};

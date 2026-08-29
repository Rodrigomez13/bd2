import React, { useState } from 'react';
import { Zap, Car, Sparkles, Leaf, Bike, Tag, ChevronDown, Check, ArrowRight, Shield, Clock } from 'lucide-react';
import { MapView } from '../MapView';
import { LocationItem, PaymentMethod, RideCategory } from '../../types';
import { PAYMENT_METHODS, RIDE_CATEGORIES } from '../../data/mockData';

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

  // Discount calculation if BEAR20 is active (20% off)
  const discountRate = promoApplied ? 0.2 : 0;
  const finalPrice = Math.round(selectedCategory.basePrice * (1 - discountRate));
  const discountAmount = selectedCategory.basePrice - finalPrice;

  const handleApplyPromo = () => {
    if (promoCode.toUpperCase() === 'BEAR20' || promoCode.toUpperCase() === 'NOCHEBEAR') {
      setPromoApplied(true);
    } else {
      alert('Código inválido. Probá BEAR20 para 20% OFF.');
    }
  };

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
    <div className="relative min-h-[640px] flex flex-col bg-[#081226] text-white">
      {/* Top Map View with Route */}
      <div className="relative h-60 w-full overflow-hidden border-b border-[#33405A]/40">
        <MapView origin={origin} destination={destination} interactive={false} />

        {/* Floating Trip Origin/Dest Pill */}
        <div className="absolute top-3 left-4 right-4 bg-[#15213A]/90 backdrop-blur-md border border-[#33405A] rounded-2xl p-2.5 shadow-lg flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2 h-2 rounded-full bg-[#F5B51B]" />
            <span className="truncate text-white font-medium">{origin.name}</span>
            <span className="text-[#AEB7C8]">→</span>
            <span className="w-2 h-2 rounded-full bg-[#FF4B4B]" />
            <span className="truncate text-white font-bold">{destination.name}</span>
          </div>
        </div>
      </div>

      {/* Bottom Sheet for Ride Category Selection */}
      <div className="relative z-10 flex-1 px-4 py-4 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-bold text-white tracking-tight">Selecciona tu viaje</h3>
            <span className="text-xs text-[#AEB7C8]">4.2 km • ~8 min</span>
          </div>

          {/* Ride Options List */}
          <div className="flex flex-col gap-2.5 max-h-56 overflow-y-auto pr-1">
            {RIDE_CATEGORIES.map((cat) => {
              const isSelected = selectedCategory.id === cat.id;
              const catFinalPrice = Math.round(cat.basePrice * (1 - discountRate));

              return (
                <div
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat)}
                  className={`flex items-center justify-between p-3.5 rounded-2xl cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-[#15213A] border-2 border-[#F5B51B] shadow-[0_0_15px_rgba(245,181,27,0.25)]'
                      : 'bg-[#15213A]/70 border border-[#33405A] hover:border-[#33405A]'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                        isSelected ? 'bg-[#0D1930] border border-[#F5B51B]' : 'bg-[#0D1930]'
                      }`}
                    >
                      {getCategoryIcon(cat.iconType)}
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">{cat.name}</span>
                        {cat.badge && (
                          <span
                            className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded"
                            style={{
                              backgroundColor: isSelected ? '#F5B51B' : '#202D47',
                              color: isSelected ? '#081226' : '#AEB7C8',
                            }}
                          >
                            {cat.badge}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-[#AEB7C8]">Llegada en {cat.etaMinutes} min</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-base font-extrabold text-[#F5B51B]">
                      ${catFinalPrice.toLocaleString('es-AR')}
                    </div>
                    {promoApplied && (
                      <div className="text-[11px] text-gray-400 line-through">
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
        <div className="pt-3 border-t border-[#33405A]/60 flex flex-col gap-3">
          <div className="flex items-center justify-between gap-2">
            {/* Payment Method Selector */}
            <button
              type="button"
              onClick={() => setShowPaymentPicker(!showPaymentPicker)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#15213A] border border-[#33405A] text-xs font-semibold text-white hover:border-[#F5B51B] transition-colors"
            >
              <span>💳 {selectedPayment.name}</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#AEB7C8]" />
            </button>

            {/* Promo Code Pill */}
            <div className="flex items-center gap-1 px-3 py-2 rounded-xl bg-[#15213A] border border-[#F5B51B]/40 text-xs text-[#FFD66A]">
              <Tag className="w-3.5 h-3.5 text-[#F5B51B]" />
              <span className="font-bold">BEAR20 (-20%)</span>
              <Check className="w-3.5 h-3.5 text-[#59C878]" />
            </div>
          </div>

          {/* Payment Modal / Dropdown */}
          {showPaymentPicker && (
            <div className="bg-[#0D1930] border border-[#33405A] rounded-xl p-2 flex flex-col gap-1.5">
              {PAYMENT_METHODS.map((pm) => (
                <button
                  key={pm.id}
                  type="button"
                  onClick={() => {
                    setSelectedPayment(pm);
                    setShowPaymentPicker(false);
                  }}
                  className={`flex items-center justify-between p-2 rounded-lg text-xs text-left ${
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
            onClick={() => onConfirmRide(selectedCategory, selectedPayment, promoCode)}
            className="w-full bg-[#F5B51B] hover:bg-[#FFBE22] active:scale-[0.98] text-[#081226] font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(245,181,27,0.35)] transition-all cursor-pointer text-base"
          >
            <span>Confirmar viaje (${finalPrice.toLocaleString('es-AR')})</span>
            <ArrowRight className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </div>
  );
};

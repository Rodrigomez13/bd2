import React, { useState } from 'react';
import { Star, CheckCircle, Heart, Sparkles, Receipt, ArrowRight, ThumbsUp } from 'lucide-react';
import { BearMascotIllustration } from '../BearMascotIllustration';
import { ActiveTripState } from '../../types';
import { triggerHaptic } from '../../utils/haptics';

interface TripFinishedScreenProps {
  trip: ActiveTripState;
  onComplete: () => void;
}

export const TripFinishedScreen: React.FC<TripFinishedScreenProps> = ({
  trip,
  onComplete,
}) => {
  const [rating, setRating] = useState(5);
  const [selectedTags, setSelectedTags] = useState<string[]>(['Excelente conductor', 'Vehículo impecable']);
  const [selectedTip, setSelectedTip] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const tags = [
    'Excelente conductor',
    'Vehículo impecable',
    'Música agradable',
    'Ruta rápida',
    'Muy respetuoso',
    'Conducción suave',
  ];

  const tips = [200, 500, 1000];

  const toggleTag = (tag: string) => {
    triggerHaptic('light');
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSendRating = () => {
    triggerHaptic('success');
    setSubmitted(true);
    setTimeout(() => {
      onComplete();
    }, 1200);
  };

  return (
    <div className="min-h-[640px] flex flex-col justify-between bg-[#081226] text-white p-5 overflow-y-auto">
      {/* Top Arrival Celebration */}
      <div className="flex flex-col items-center text-center pt-2">
        <BearMascotIllustration variant="happy-arrival" className="p-2" />

        {/* Fare Summary Pill */}
        <div className="mt-1 p-4 rounded-2xl bg-[#15213A] border border-[#33405A] w-full max-w-sm shadow-xl">
          <div className="flex items-center justify-between text-xs text-[#AEB7C8] mb-1">
            <span>Pago directo al conductor ({trip.paymentMethod.name})</span>
            <span>{trip.category.name}</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-[#F5B51B]">
              ${trip.price.toLocaleString('es-AR')}
            </span>
            {trip.discount > 0 && (
              <span className="text-xs font-bold text-[#59C878] bg-[#59C878]/10 px-2 py-0.5 rounded-full border border-[#59C878]/30">
                Ahorraste ${trip.discount.toLocaleString('es-AR')} (BEAR20)
              </span>
            )}
          </div>

          {/* BearPoints Earned Badge */}
          <div className="mt-3 pt-2.5 border-t border-[#33405A]/60 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-[#59C878] font-bold">
              <Sparkles className="w-4 h-4 text-[#F5B51B]" />
              <span>¡Ganaste +50 BearPoints!</span>
            </div>
            <span className="text-[10px] text-[#AEB7C8]">Acreditados a tu cuenta</span>
          </div>
        </div>
      </div>

      {/* Rating & Feedback Section */}
      <div className="my-4 flex flex-col items-center text-center">
        <div className="flex items-center gap-2 mb-2">
          <img
            src={trip.driver.avatarUrl}
            alt={trip.driver.name}
            referrerPolicy="no-referrer"
            className="w-8 h-8 rounded-full border border-[#F5B51B] object-cover"
          />
          <span className="text-sm font-bold text-white">
            ¿Cómo fue tu viaje con {trip.driver.name}?
          </span>
        </div>

        {/* 5 Interactive Stars */}
        <div className="flex items-center gap-2 my-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => {
                triggerHaptic('selection');
                setRating(star);
              }}
              className="p-1.5 transform hover:scale-125 active:scale-95 transition-transform cursor-pointer"
            >
              <Star
                className={`w-8 h-8 ${
                  star <= rating
                    ? 'fill-[#F5B51B] text-[#F5B51B] drop-shadow-[0_0_8px_rgba(245,181,27,0.6)]'
                    : 'text-[#33405A]'
                }`}
              />
            </button>
          ))}
        </div>

        {/* Compliment Badges */}
        <div className="flex flex-wrap justify-center gap-1.5 my-3">
          {tags.map((tag) => {
            const isSelected = selectedTags.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                className={`text-xs px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#F5B51B] text-[#081226] font-bold shadow-md'
                    : 'bg-[#15213A] text-[#AEB7C8] border border-[#33405A]'
                }`}
              >
                {tag}
              </button>
            );
          })}
        </div>

        {/* Tip Selector */}
        <div className="w-full mt-2">
          <span className="text-xs text-[#AEB7C8] block mb-2 font-medium">
            ¿Querés dejarle una propina a {trip.driver.name}?
          </span>
          <div className="flex justify-center gap-2">
            {tips.map((amount) => (
              <button
                key={amount}
                type="button"
                onClick={() => {
                  triggerHaptic('medium');
                  setSelectedTip(selectedTip === amount ? null : amount);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedTip === amount
                    ? 'bg-[#59C878] text-[#081226] shadow-md'
                    : 'bg-[#15213A] border border-[#33405A] text-white'
                }`}
              >
                +${amount}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <button
          type="button"
          onClick={handleSendRating}
          disabled={submitted}
          className="w-full bg-[#F5B51B] hover:bg-[#FFBE22] active:scale-[0.98] text-[#081226] font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(245,181,27,0.35)] transition-all cursor-pointer text-base"
        >
          {submitted ? (
            <span>¡Gracias! Redirigiendo...</span>
          ) : (
            <>
              <span>Enviar calificación</span>
              <ArrowRight className="w-5 h-5 stroke-[2.5]" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

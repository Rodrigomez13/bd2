import React from 'react';
import { Star, Route, Clock, ThumbsUp, ShieldCheck, Sparkles, Building2, Car, MessageSquare, Phone, ArrowLeft } from 'lucide-react';
import { DriverInfo } from '../../types';

interface DriverProfileScreenProps {
  driver: DriverInfo;
  onBack: () => void;
  onContact: () => void;
}

export const DriverProfileScreen: React.FC<DriverProfileScreenProps> = ({
  driver,
  onBack,
  onContact,
}) => {
  return (
    <div className="min-h-[640px] flex flex-col justify-between bg-[#081226] text-white p-5 overflow-y-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-[#15213A] border border-[#33405A] flex items-center justify-center text-white active:scale-95 transition-transform"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <h2 className="text-base font-bold text-white tracking-tight">Perfil del conductor</h2>
        <div className="w-10" />
      </div>

      {/* Driver Avatar & Hero Info */}
      <div className="flex flex-col items-center text-center my-2">
        <div className="relative mb-3">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-[#15213A] shadow-2xl">
            <img
              src={driver.avatarUrl}
              alt={driver.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          {/* Star rating pill */}
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#F5B51B] text-[#081226] font-bold text-xs shadow-md">
            <Star className="w-3 h-3 fill-[#081226] text-[#081226]" />
            <span>{driver.rating}</span>
          </div>
        </div>

        <h1 className="text-2xl font-black text-white mt-1">{driver.name}</h1>
        <p className="text-xs font-semibold text-[#FFD66A] tracking-wide">{driver.title}</p>
        <span className="text-xs text-[#AEB7C8] mt-0.5">
          {driver.vehicleModel} • {driver.vehicleColor} ({driver.plate})
        </span>
      </div>

      {/* 3 Metric Cards Grid (Exact matching Image 11) */}
      <div className="grid grid-cols-3 gap-2.5 my-4">
        <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#15213A] border border-[#33405A] text-center shadow-sm">
          <Route className="w-5 h-5 text-[#F5B51B] mb-1" />
          <span className="text-lg font-black text-white">{driver.tripsCount}</span>
          <span className="text-[11px] text-[#AEB7C8]">Viajes</span>
        </div>

        <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#15213A] border border-[#33405A] text-center shadow-sm">
          <Clock className="w-5 h-5 text-[#F5B51B] mb-1" />
          <span className="text-lg font-black text-white">{driver.yearsExperience}</span>
          <span className="text-[11px] text-[#AEB7C8]">Años</span>
        </div>

        <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#15213A] border border-[#33405A] text-center shadow-sm">
          <ThumbsUp className="w-5 h-5 text-[#F5B51B] mb-1" />
          <span className="text-lg font-black text-white">{driver.acceptanceRate}%</span>
          <span className="text-[11px] text-[#AEB7C8]">Aceptación</span>
        </div>
      </div>

      {/* Insignias Section */}
      <div className="mb-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#AEB7C8] mb-2 px-1">
          Insignias
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {driver.badges.map((badge, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2.5 p-3 rounded-xl bg-[#15213A] border border-[#33405A]"
            >
              <div className="w-8 h-8 rounded-lg bg-[#0D1930] flex items-center justify-center text-[#F5B51B] shrink-0 border border-[#33405A]">
                {idx === 0 ? (
                  <Building2 className="w-4 h-4" />
                ) : idx === 1 ? (
                  <Sparkles className="w-4 h-4" />
                ) : (
                  <ShieldCheck className="w-4 h-4" />
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-white leading-tight">{badge.title}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reseñas Section */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-2.5 px-1">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#AEB7C8]">Reseñas</h3>
          <span className="text-xs text-[#F5B51B] font-semibold cursor-pointer">Ver todas</span>
        </div>

        <div className="flex flex-col gap-2.5">
          {driver.reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-3.5 rounded-2xl bg-[#15213A] border border-[#33405A] flex flex-col gap-2 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-[#0D1930] border border-[#33405A] text-xs font-bold text-[#F5B51B] flex items-center justify-center">
                    {rev.avatarLetter}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-white">{rev.author}</span>
                    <span className="text-[10px] text-[#AEB7C8]">{rev.date}</span>
                  </div>
                </div>
                <div className="flex items-center gap-0.5 text-[#F5B51B]">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3 h-3 ${
                        i < rev.rating ? 'fill-[#F5B51B] text-[#F5B51B]' : 'text-[#33405A]'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-xs text-[#F5F7FA]/90 italic leading-relaxed">
                "{rev.comment}"
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Sticky Action: Contactar conductor */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onContact}
          className="w-full bg-[#F5B51B] hover:bg-[#FFBE22] active:scale-[0.98] text-[#081226] font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(245,181,27,0.35)] transition-all cursor-pointer text-base"
        >
          <MessageSquare className="w-5 h-5" />
          <span>Contactar conductor</span>
        </button>
      </div>
    </div>
  );
};

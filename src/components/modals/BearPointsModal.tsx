import React, { useState } from 'react';
import { 
  Gift, 
  Sparkles, 
  Award, 
  Check, 
  X, 
  Copy, 
  TrendingUp, 
  ArrowRight,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { MOCK_BEAR_POINTS_USER, BEAR_POINT_REWARDS } from '../../data/mockData';
import { triggerHaptic } from '../../utils/haptics';

interface BearPointsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyReward: (rewardDiscount: string) => void;
}

export const BearPointsModal: React.FC<BearPointsModalProps> = ({
  isOpen,
  onClose,
  onApplyReward,
}) => {
  const [balance, setBalance] = useState<number>(MOCK_BEAR_POINTS_USER.currentBalance);
  const [redeemSuccess, setRedeemSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleRedeem = (reward: (typeof BEAR_POINT_REWARDS)[0]) => {
    if (balance < reward.pointsCost) return;
    triggerHaptic('heavy');
    const newBal = balance - reward.pointsCost;
    setBalance(newBal);
    setRedeemSuccess(`¡Canjeaste "${reward.discountValue}"!`);
    onApplyReward(reward.discountValue);
    setTimeout(() => {
      setRedeemSuccess(null);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-[#0D1930] border-t sm:border border-[#59C878]/40 rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl max-h-[85vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300"
        id="modal-bear-points"
      >
        {/* Header */}
        <div className="flex flex-col gap-2 pb-3 border-b border-[#33405A]/70">
          <div className="w-12 h-1 bg-[#33405A] rounded-full mx-auto sm:hidden" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#15213A] border border-[#59C878] flex items-center justify-center text-[#59C878]">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-black text-white">Programa BearPoints</h3>
                <p className="text-[10px] text-[#AEB7C8]">Fidelización oficial en cada viaje</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                triggerHaptic('light');
                onClose();
              }}
              className="w-8 h-8 rounded-full bg-[#15213A] hover:bg-[#202D47] border border-[#33405A] flex items-center justify-center text-[#AEB7C8] hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto py-3.5 flex flex-col gap-3 pr-0.5">
          {/* Balance Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-[#15213A] via-[#0D1930] to-[#15213A] border-2 border-[#59C878]/50 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold text-[#AEB7C8]">Saldo Actual</span>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className="text-3xl font-black text-[#59C878]">{balance.toLocaleString()}</span>
                  <span className="text-xs font-bold text-white">pts</span>
                </div>
              </div>
              <div className="px-2.5 py-1 rounded-full bg-[#59C878]/20 border border-[#59C878] text-[#59C878] text-[10px] font-black uppercase">
                Nivel Plata
              </div>
            </div>
            <p className="text-[10px] text-[#AEB7C8] mt-2">
              Sumás 10 pts por cada $100 gastados en BearDrive Formosa.
            </p>
          </div>

          {redeemSuccess && (
            <div className="p-2.5 rounded-xl bg-[#59C878]/20 border border-[#59C878] text-[#59C878] text-xs font-bold flex items-center gap-2 animate-in fade-in">
              <Check className="w-4 h-4" />
              <span>{redeemSuccess}</span>
            </div>
          )}

          {/* Rewards List */}
          <div className="flex flex-col gap-2">
            <span className="text-[11px] font-extrabold uppercase text-[#AEB7C8] tracking-wider">
              Premios Disponibles
            </span>

            {BEAR_POINT_REWARDS.map((reward) => {
              const canRedeem = balance >= reward.pointsCost;
              return (
                <div
                  key={reward.id}
                  className="p-3 rounded-2xl bg-[#15213A] border border-[#33405A] flex items-center justify-between gap-3 shadow-md"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-xl">
                      {reward.category === 'viaje_gratis' ? '🎁' : reward.category === 'upgrade' ? '⭐' : '🏷️'}
                    </span>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-bold text-white truncate">{reward.title}</span>
                      <span className="text-[10px] text-[#59C878] font-bold truncate">{reward.discountValue} • {reward.badge}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRedeem(reward)}
                    disabled={!canRedeem}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                      canRedeem
                        ? 'bg-[#59C878] hover:bg-[#4EAF68] text-[#081226] shadow-md active:scale-95'
                        : 'bg-[#0D1930] text-gray-500 border border-[#33405A] cursor-not-allowed'
                    }`}
                  >
                    {reward.pointsCost} pts
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-[#33405A]/70 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-[#15213A] hover:bg-[#202D47] text-white text-xs font-bold transition-all cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

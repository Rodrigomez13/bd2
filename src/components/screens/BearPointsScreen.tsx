import React, { useState } from 'react';
import { 
  Gift, 
  Sparkles, 
  Award, 
  ArrowLeft, 
  Check, 
  Copy, 
  Users, 
  TrendingUp, 
  CheckCircle2, 
  Clock,
  ArrowRight,
  Shield
} from 'lucide-react';
import { MOCK_BEAR_POINTS_USER, BEAR_POINT_REWARDS } from '../../data/mockData';

interface BearPointsScreenProps {
  onBack: () => void;
  onApplyReward?: (rewardTitle: string) => void;
}

export const BearPointsScreen: React.FC<BearPointsScreenProps> = ({ onBack, onApplyReward }) => {
  const [balance, setBalance] = useState<number>(MOCK_BEAR_POINTS_USER.currentBalance);
  const [rewards, setRewards] = useState(BEAR_POINT_REWARDS);
  const [history, setHistory] = useState(MOCK_BEAR_POINTS_USER.history);
  const [copiedReferral, setCopiedReferral] = useState(false);
  const [redeemSuccess, setRedeemSuccess] = useState<string | null>(null);

  const referralCode = 'BEAR-MARTIN92';

  const handleCopy = () => {
    navigator.clipboard?.writeText(referralCode);
    setCopiedReferral(true);
    setTimeout(() => setCopiedReferral(false), 2500);
  };

  const handleRedeem = (reward: (typeof BEAR_POINT_REWARDS)[0]) => {
    if (balance < reward.pointsCost) return;

    const newBal = balance - reward.pointsCost;
    setBalance(newBal);

    setHistory([
      {
        id: `bp-${Date.now()}`,
        title: `Canje: ${reward.title}`,
        points: -reward.pointsCost,
        date: 'Justo ahora',
        type: 'redeemed',
      },
      ...history,
    ]);

    setRedeemSuccess(`¡Canjeaste "${reward.discountValue}" exitosamente!`);
    setTimeout(() => setRedeemSuccess(null), 3500);

    if (onApplyReward) {
      onApplyReward(reward.discountValue);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#081226] text-white p-4 max-w-3xl mx-auto w-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#33405A]/60 mb-5">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#15213A] border border-[#33405A] text-xs font-semibold text-white hover:bg-[#202D47] transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-[#F5B51B]" />
          <span>Volver</span>
        </button>

        <div className="flex items-center gap-1.5 text-xs font-bold text-[#F5B51B]">
          <Sparkles className="w-4 h-4" />
          <span>Programa de Fidelización Oficial</span>
        </div>
      </div>

      {/* Hero Points Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-[#15213A] via-[#0D1930] to-[#15213A] border-2 border-[#F5B51B]/40 shadow-2xl mb-6 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#AEB7C8]">Tu Saldo Acumulado</span>
              <span className="px-2 py-0.5 rounded-full bg-[#F5B51B] text-[#081226] text-[10px] font-black uppercase">
                Nivel {MOCK_BEAR_POINTS_USER.tier}
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-[#F5B51B] tracking-tight">{balance.toLocaleString()}</span>
              <span className="text-sm font-extrabold text-white">BearPoints</span>
            </div>
            <p className="text-xs text-[#AEB7C8] mt-1">
              Faltan {MOCK_BEAR_POINTS_USER.pointsToNextTier} pts para alcanzar categoría <strong>Oro</strong>
            </p>
          </div>

          <div className="w-16 h-16 rounded-2xl bg-[#081226] border-2 border-[#F5B51B] flex items-center justify-center text-3xl shadow-xl shrink-0">
            🎁
          </div>
        </div>

        {/* Tier Progress Bar */}
        <div className="mt-5 pt-4 border-t border-[#33405A]/60">
          <div className="flex justify-between text-[11px] text-[#AEB7C8] mb-1.5 font-bold">
            <span className="text-white">Nivel Plata (1.000 pts)</span>
            <span className="text-[#F5B51B]">Nivel Oro (2.000 pts)</span>
          </div>
          <div className="w-full bg-[#081226] h-2.5 rounded-full overflow-hidden border border-[#33405A]">
            <div
              className="h-full bg-gradient-to-r from-[#F5B51B] to-[#FFD66A] rounded-full transition-all duration-500"
              style={{ width: '62%' }}
            />
          </div>
        </div>
      </div>

      {/* Success Notification */}
      {redeemSuccess && (
        <div className="mb-5 p-4 rounded-2xl bg-[#59C878]/20 border border-[#59C878] text-white text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-[#59C878] shrink-0" />
          <span>{redeemSuccess}</span>
        </div>
      )}

      {/* Referrals Banner */}
      <div className="p-4 rounded-2xl bg-[#15213A] border border-[#33405A] flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0D1930] border border-[#F5B51B] flex items-center justify-center text-[#F5B51B] shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-white block">Gana $1.000 + 250 BearPoints por amigo</span>
            <span className="text-[11px] text-[#AEB7C8]">Tu amigo recibe 20% OFF en su primer viaje</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="px-3.5 py-2 rounded-xl bg-[#0D1930] hover:bg-[#202D47] border border-[#F5B51B]/50 text-xs font-mono font-bold text-[#F5B51B] flex items-center gap-2 transition-all self-start sm:self-center"
        >
          {copiedReferral ? <Check className="w-3.5 h-3.5 text-[#59C878]" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copiedReferral ? '¡Copiado!' : referralCode}</span>
        </button>
      </div>

      {/* Rewards Catalogue */}
      <div className="mb-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-[#AEB7C8] mb-3 flex items-center gap-1.5">
          <Award className="w-4 h-4 text-[#F5B51B]" />
          <span>Catálogo de Recompensas Disponibles</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {rewards.map((rew) => {
            const canAfford = balance >= rew.pointsCost;

            return (
              <div
                key={rew.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                  canAfford
                    ? 'bg-[#15213A] border-[#33405A] hover:border-[#F5B51B]'
                    : 'bg-[#0D1930]/70 border-[#33405A]/40 opacity-70'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#0D1930] text-[#F5B51B] border border-[#F5B51B]/30">
                      {rew.badge}
                    </span>
                    <span className="text-xs font-mono font-extrabold text-[#F5B51B]">
                      {rew.pointsCost} BearPoints
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white mb-1">{rew.title}</h4>
                  <span className="text-xs text-[#59C878] font-bold block mb-3">{rew.discountValue}</span>
                </div>

                <button
                  type="button"
                  disabled={!canAfford}
                  onClick={() => handleRedeem(rew)}
                  className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${
                    canAfford
                      ? 'bg-[#F5B51B] hover:bg-[#FFBE22] text-[#081226] shadow-md cursor-pointer active:scale-[0.98]'
                      : 'bg-[#0D1930] text-gray-400 cursor-not-allowed border border-[#33405A]'
                  }`}
                >
                  <Gift className="w-3.5 h-3.5" />
                  <span>{canAfford ? 'Canjear Recompensa' : `Faltan ${rew.pointsCost - balance} pts`}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Transaction History */}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wider text-[#AEB7C8] mb-3 flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-[#AEB7C8]" />
          <span>Historial de Movimientos de Puntos</span>
        </h3>

        <div className="space-y-2">
          {history.map((h) => (
            <div
              key={h.id}
              className="p-3 rounded-xl bg-[#15213A] border border-[#33405A] flex items-center justify-between text-xs"
            >
              <div>
                <span className="font-bold text-white block">{h.title}</span>
                <span className="text-[11px] text-[#AEB7C8]">{h.date}</span>
              </div>
              <span
                className={`font-mono font-extrabold text-sm ${
                  h.points > 0 ? 'text-[#59C878]' : 'text-[#FF4B4B]'
                }`}
              >
                {h.points > 0 ? `+${h.points}` : h.points} pts
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

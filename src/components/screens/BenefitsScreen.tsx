import React from 'react';
import { Award, Check, ChevronRight, Gift, ShieldCheck, Star, Zap } from 'lucide-react';
import { INITIAL_USER } from '../../data/mockData';

interface BenefitsScreenProps {
  onNavigateToPromos: () => void;
}

export const BenefitsScreen: React.FC<BenefitsScreenProps> = ({ onNavigateToPromos }) => {
  const progress = 68;

  return (
    <section className="min-h-[640px] flex flex-col gap-5 bg-[#081226] p-4 text-white overflow-y-auto">
      <header className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#F5B51B]">BearDrive Benefits</p>
          <h2 className="mt-1 text-2xl font-black tracking-tight text-balance">Más viajes, más beneficios</h2>
          <p className="mt-1 text-xs leading-relaxed text-[#AEB7C8]">Tus recompensas por moverte seguro por Formosa.</p>
        </div>
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#F5B51B]/50 bg-[#15213A] text-[#F5B51B]">
          <Award className="h-6 w-6" />
        </div>
      </header>

      <div className="rounded-3xl border border-[#F5B51B]/50 bg-[#15213A] p-5 shadow-xl">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold text-[#FFD66A]">Membresía actual</p>
            <h3 className="mt-1 text-xl font-black">{INITIAL_USER.membership}</h3>
          </div>
          <Star className="h-7 w-7 fill-[#F5B51B] text-[#F5B51B]" />
        </div>
        <div className="mt-5 flex items-center justify-between text-[11px] font-bold text-[#AEB7C8]">
          <span>Progreso al próximo nivel</span><span className="text-[#F5B51B]">{progress}%</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#0D1930]" aria-label={`Progreso ${progress}%`}>
          <div className="h-full rounded-full bg-[#F5B51B]" style={{ width: `${progress}%` }} />
        </div>
        <p className="mt-3 text-xs text-[#AEB7C8]">Te faltan 6 viajes para desbloquear beneficios exclusivos.</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {[
          { icon: Zap, title: 'Despacho prioritario', text: 'Llegá antes, incluso de noche.' },
          { icon: Gift, title: 'Ofertas semanales', text: 'Promos personalizadas para vos.' },
          { icon: ShieldCheck, title: 'Viajes seguros', text: 'Conductores verificados.' },
          { icon: Check, title: '10% de ahorro', text: 'En cada viaje BearDrive.' },
        ].map(({ icon: Icon, title, text }) => (
          <article key={title} className="flex min-h-32 flex-col justify-between rounded-2xl border border-[#33405A] bg-[#15213A] p-3.5">
            <Icon className="h-5 w-5 text-[#F5B51B]" />
            <div><h3 className="text-xs font-black">{title}</h3><p className="mt-1 text-[11px] leading-relaxed text-[#AEB7C8]">{text}</p></div>
          </article>
        ))}
      </div>

      <button type="button" onClick={onNavigateToPromos} className="flex items-center justify-between rounded-2xl border border-[#33405A] bg-[#0D1930] p-4 text-left transition-colors hover:border-[#F5B51B]">
        <span><span className="block text-xs font-black">Descubrí tus promociones</span><span className="mt-1 block text-[11px] text-[#AEB7C8]">Usá tus beneficios en el próximo viaje.</span></span>
        <ChevronRight className="h-5 w-5 text-[#F5B51B]" />
      </button>
    </section>
  );
};

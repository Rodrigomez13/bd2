import React, { useMemo, useState } from 'react';
import { Activity, ArrowUpRight, Car, CheckCircle2, Clock3, DollarSign, MapPin, Users } from 'lucide-react';

const trips = [
  { id: '#BD-2048', passenger: 'Valeria R.', route: 'Centro → Costanera', status: 'En curso', value: 2600 },
  { id: '#BD-2047', passenger: 'Gonzalo P.', route: 'Gutnisky → Plaza San Martín', status: 'Completado', value: 2450 },
  { id: '#BD-2046', passenger: 'Sofía M.', route: 'Terminal → Barrio Norte', status: 'Buscando', value: 3100 },
  { id: '#BD-2045', passenger: 'Lucas D.', route: 'La Paz → Centro', status: 'Completado', value: 2250 },
];

const metrics = [
  { label: 'Viajes hoy', value: '128', change: '+18%', icon: Car },
  { label: 'Conductores activos', value: '42', change: '+6%', icon: Users },
  { label: 'Ingresos estimados', value: '$312.400', change: '+12%', icon: DollarSign },
  { label: 'Tiempo de espera', value: '4,2 min', change: '-9%', icon: Clock3 },
];

interface AdminDashboardScreenProps { onBack: () => void }

export const AdminDashboardScreen: React.FC<AdminDashboardScreenProps> = ({ onBack }) => {
  const [filter, setFilter] = useState('Todos');
  const filteredTrips = useMemo(() => filter === 'Todos' ? trips : trips.filter((trip) => trip.status === filter), [filter]);

  return (
    <section className="min-h-[640px] flex flex-col gap-4 bg-[#081226] p-4 text-white overflow-y-auto">
      <header className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#F5B51B]">Operaciones BearDrive</p>
          <h1 className="mt-1 text-2xl font-black tracking-tight">Panel de control</h1>
          <p className="mt-1 text-xs leading-relaxed text-[#AEB7C8]">Monitoreo en tiempo real de Formosa.</p>
        </div>
        <button type="button" onClick={onBack} className="rounded-xl border border-[#33405A] bg-[#15213A] px-3 py-2 text-xs font-bold text-[#FFD66A]">Volver</button>
      </header>

      <div className="grid grid-cols-2 gap-2">
        {metrics.map(({ label, value, change, icon: Icon }) => (
          <article key={label} className="rounded-2xl border border-[#33405A] bg-[#15213A] p-3">
            <div className="flex items-center justify-between"><Icon className="h-4 w-4 text-[#F5B51B]" /><span className="text-[10px] font-bold text-[#59C878]">{change}</span></div>
            <p className="mt-3 text-xl font-black">{value}</p>
            <p className="mt-0.5 text-[10px] text-[#AEB7C8]">{label}</p>
          </article>
        ))}
      </div>

      <article className="rounded-2xl border border-[#33405A] bg-[#15213A] p-4">
        <div className="flex items-center justify-between"><div><p className="text-xs font-bold text-[#AEB7C8]">Actividad de viajes</p><p className="mt-1 text-lg font-black">Demanda por hora</p></div><Activity className="h-5 w-5 text-[#F5B51B]" /></div>
        <div className="mt-5 flex h-24 items-end gap-2" aria-label="Gráfico de demanda horaria">
          {[35, 48, 42, 65, 54, 78, 68, 92, 74, 86, 60, 70].map((height, index) => <div key={index} className="flex flex-1 flex-col items-center gap-1"><div className="w-full rounded-t-md bg-[#F5B51B]" style={{ height: `${height}%` }} /><span className="text-[8px] text-[#65718A]">{index + 8}h</span></div>)}
        </div>
      </article>

      <article className="rounded-2xl border border-[#33405A] bg-[#15213A] p-4">
        <div className="flex items-center justify-between"><h2 className="text-sm font-black">Viajes recientes</h2><MapPin className="h-4 w-4 text-[#FFD66A]" /></div>
        <div className="mt-3 flex gap-1.5 overflow-x-auto pb-1">{['Todos', 'En curso', 'Buscando', 'Completado'].map((option) => <button key={option} type="button" onClick={() => setFilter(option)} className={`whitespace-nowrap rounded-full px-3 py-1.5 text-[10px] font-bold ${filter === option ? 'bg-[#F5B51B] text-[#081226]' : 'border border-[#33405A] text-[#AEB7C8]'}`}>{option}</button>)}</div>
        <div className="mt-2 flex flex-col divide-y divide-[#33405A]">{filteredTrips.map((trip) => <div key={trip.id} className="flex items-center justify-between gap-3 py-3"><div className="min-w-0"><p className="text-xs font-bold">{trip.id} · {trip.passenger}</p><p className="truncate text-[10px] text-[#AEB7C8]">{trip.route}</p></div><div className="shrink-0 text-right"><p className="text-xs font-black text-[#FFD66A]">${trip.value.toLocaleString('es-AR')}</p><p className={`text-[10px] font-bold ${trip.status === 'Completado' ? 'text-[#59C878]' : 'text-[#F5B51B]'}`}>{trip.status}</p></div></div>)}</div>
      </article>

      <div className="flex items-center gap-2 rounded-xl border border-[#59C878]/30 bg-[#59C878]/10 p-3 text-xs text-[#BDECC9]"><CheckCircle2 className="h-4 w-4 shrink-0" /><span>Sistema operativo. Sin incidentes críticos en los últimos 60 minutos.</span><ArrowUpRight className="ml-auto h-4 w-4 shrink-0" /></div>
    </section>
  );
};

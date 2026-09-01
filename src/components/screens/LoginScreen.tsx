import React, { useState } from 'react';
import { ArrowRight, LockKeyhole, Mail, ShieldCheck, Sparkles } from 'lucide-react';
import { BearMascotIcon } from '../BearLogo';

interface LoginScreenProps {
  onAuthenticate: (values: { email: string; password: string; fullName: string; isRegister: boolean }) => Promise<void>;
  onExploreDemo: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onAuthenticate, onExploreDemo }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      await onAuthenticate({ email, password, fullName, isRegister });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-[640px] h-full flex flex-col justify-between bg-[#081226] text-white p-5 sm:p-8 lg:p-10 overflow-y-auto">
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-50">
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[34rem] h-[34rem] bg-gradient-to-b from-[#F5B51B]/20 via-[#2A1B4E]/25 to-transparent rounded-full blur-3xl" />
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-20"><BearMascotIcon size={260} /></div>
      </div>

      <div className="relative z-10 flex flex-col items-center text-center pt-6 pb-5">
        <div className="mb-4 p-3 rounded-2xl bg-[#15213A]/80 border border-[#F5B51B]/40 shadow-[0_0_25px_rgba(245,181,27,0.25)]"><BearMascotIcon size={64} /></div>
        <div className="font-extrabold text-3xl tracking-tight leading-none"><span>Bear</span><span className="text-[#F5B51B]">Drive</span></div>
        <p className="text-sm text-[#AEB7C8] font-medium mt-2">Movilidad local, clara y segura para Formosa.</p>
        <div className="flex items-center gap-1.5 mt-3 px-3 py-1 rounded-full bg-[#15213A] border border-[#33405A] text-[11px] text-[#FFD66A]"><Sparkles className="w-3 h-3 text-[#F5B51B]" /><span>Experiencia piloto</span></div>
      </div>

      <div className="relative z-10 w-full max-w-md mx-auto bg-[#15213A]/90 backdrop-blur-xl border border-[#33405A] rounded-3xl p-5 sm:p-6 shadow-2xl my-auto">
        <div className="flex items-center gap-2 mb-5 text-xs text-[#AEB7C8]"><ShieldCheck className="w-4 h-4 text-[#59C878]" /><span>Acceso protegido con Supabase Auth</span></div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {isRegister && <label className="block text-xs font-semibold text-[#AEB7C8]">Nombre completo<input type="text" value={fullName} onChange={(event) => setFullName(event.target.value)} className="mt-1.5 w-full bg-[#0D1930] border border-[#33405A] focus:border-[#F5B51B] rounded-xl px-4 py-3 text-sm text-white outline-none" placeholder="Tu nombre y apellido" minLength={2} required /></label>}
          <label className="block text-xs font-semibold text-[#AEB7C8]"><span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" />Correo</span><input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-1.5 w-full bg-[#0D1930] border border-[#33405A] focus:border-[#F5B51B] rounded-xl px-4 py-3 text-sm text-white outline-none" placeholder="nombre@correo.com" required /></label>
          <label className="block text-xs font-semibold text-[#AEB7C8]"><span className="flex items-center gap-1.5"><LockKeyhole className="w-3.5 h-3.5" />Contraseña</span><input type="password" autoComplete={isRegister ? 'new-password' : 'current-password'} value={password} onChange={(event) => setPassword(event.target.value)} className="mt-1.5 w-full bg-[#0D1930] border border-[#33405A] focus:border-[#F5B51B] rounded-xl px-4 py-3 text-sm text-white outline-none" placeholder="Mínimo 8 caracteres" minLength={8} required /></label>
          <button type="submit" disabled={isSubmitting} className="w-full mt-1 bg-[#F5B51B] enabled:hover:bg-[#FFBE22] disabled:opacity-60 text-[#081226] font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(245,181,27,0.3)] transition-all text-sm"><span>{isSubmitting ? 'Validando…' : isRegister ? 'Crear cuenta segura' : 'Iniciar sesión'}</span><ArrowRight className="w-4 h-4 stroke-[2.5]" /></button>
        </form>
        <p className="mt-4 text-center text-xs text-[#AEB7C8]">{isRegister ? '¿Ya tenés una cuenta?' : '¿Primera vez?'} <button type="button" onClick={() => setIsRegister(!isRegister)} className="text-[#F5B51B] font-semibold hover:underline">{isRegister ? 'Iniciá sesión' : 'Creá tu cuenta'}</button></p>
        <div className="flex items-center gap-3 my-5"><div className="flex-1 h-px bg-[#33405A]" /><span className="text-[10px] uppercase tracking-wider text-[#AEB7C8]">sin conexión</span><div className="flex-1 h-px bg-[#33405A]" /></div>
        <button type="button" onClick={onExploreDemo} className="w-full border border-[#F5B51B]/50 hover:border-[#F5B51B] bg-[#0D1930] text-[#F5B51B] font-semibold py-3 rounded-xl text-sm transition-colors">Explorar demostración local</button>
      </div>

      <p className="relative z-10 mt-5 text-center text-[11px] text-[#AEB7C8]/75">La demo no solicita viajes, procesa pagos ni activa servicios de emergencia.</p>
    </div>
  );
};

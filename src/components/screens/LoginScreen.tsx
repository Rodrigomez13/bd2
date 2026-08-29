import React, { useState } from 'react';
import { ArrowRight, Lock, Mail, Shield, Sparkles, UserCheck } from 'lucide-react';
import { BearLogo, BearMascotIcon } from '../BearLogo';
import { ScreenId } from '../../types';

interface LoginScreenProps {
  onLogin: () => void;
  onDriverLogin: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, onDriverLogin }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('martin.gomez@ejemplo.com');
  const [password, setPassword] = useState('••••••••');
  const [name, setName] = useState('Martín Gómez');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div className="relative min-h-[640px] h-full flex flex-col justify-between bg-[#081226] text-white p-6 overflow-y-auto">
      {/* Brand artwork backdrop */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Redise%C3%B1o%20de%20Pantalla%20de%20Inicio%20App.png-yoNfwwFbq5u5XoyGM27D4kW8OFtr9e.jpeg" alt="" referrerPolicy="no-referrer" className="absolute inset-0 h-full w-full object-cover opacity-45" />
        <div className="absolute inset-0 bg-[#081226]/70" />
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-20"><BearMascotIcon size={240} /></div>
      </div>

      {/* Top Brand Section */}
      <div className="relative z-10 flex flex-col items-center text-center pt-8 pb-4">
        <div className="mb-4 p-3 rounded-2xl bg-[#15213A]/80 border border-[#F5B51B]/40 shadow-[0_0_25px_rgba(245,181,27,0.25)]">
          <BearMascotIcon size={64} />
        </div>
        <div className="font-extrabold text-3xl tracking-tight leading-none">
          <span className="text-[#F5F7FA]">Bear</span>
          <span className="text-[#F5B51B]">Drive</span>
        </div>
        <p className="text-sm text-[#AEB7C8] font-medium mt-2 tracking-wide">
          Your premium nocturnal navigator.
        </p>
        <div className="flex items-center gap-1.5 mt-2 px-3 py-0.5 rounded-full bg-[#15213A] border border-[#33405A] text-[11px] text-[#FFD66A]">
          <Sparkles className="w-3 h-3 text-[#F5B51B]" />
          <span>Lanzamiento oficial en Formosa</span>
        </div>
      </div>

      {/* Auth Card */}
      <div className="relative z-10 w-full max-w-sm mx-auto bg-[#15213A]/90 backdrop-blur-xl border border-[#33405A] rounded-2xl p-6 shadow-2xl my-auto">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {isRegister && (
            <div>
              <label className="block text-xs font-semibold text-[#AEB7C8] mb-1.5">
                Nombre completo
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#0D1930] border border-[#33405A] focus:border-[#F5B51B] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition-colors"
                  placeholder="Tu nombre y apellido"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#AEB7C8] mb-1.5">
              Email
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0D1930] border border-[#33405A] focus:border-[#F5B51B] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition-colors"
                placeholder="Ingresá tu correo"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-[#AEB7C8]">Contraseña</label>
              {!isRegister && (
                <button
                  type="button"
                  onClick={() => alert('Se envió un correo de recuperación.')}
                  className="text-xs text-[#FFD66A] hover:underline"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              )}
            </div>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#0D1930] border border-[#33405A] focus:border-[#F5B51B] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition-colors"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-2 bg-[#F5B51B] hover:bg-[#FFBE22] active:scale-[0.98] text-[#081226] font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(245,181,27,0.3)] transition-all cursor-pointer text-sm"
          >
            <span>{isRegister ? 'Crear cuenta' : 'Iniciar sesión'}</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-xs text-[#AEB7C8]">
            {isRegister ? '¿Ya tenés una cuenta?' : '¿No tenés una cuenta?'}{' '}
            <button
              type="button"
              onClick={() => setIsRegister(!isRegister)}
              className="text-[#F5B51B] font-semibold hover:underline"
            >
              {isRegister ? 'Iniciá sesión' : 'Registrate aquí'}
            </button>
          </p>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-[#33405A]" />
          <span className="text-[11px] uppercase tracking-wider text-[#AEB7C8] font-medium">
            O continuá con
          </span>
          <div className="flex-1 h-px bg-[#33405A]" />
        </div>

        {/* Social login buttons */}
        <div className="flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={onLogin}
            className="w-12 h-12 rounded-full bg-[#0D1930] border border-[#33405A] hover:border-[#F5B51B] flex items-center justify-center active:scale-95 transition-all shadow-md"
            aria-label="Iniciar con Google"
          >
            <span className="text-lg font-bold text-[#EA4335]">G</span>
          </button>
          <button
            type="button"
            onClick={onLogin}
            className="w-12 h-12 rounded-full bg-[#0D1930] border border-[#33405A] hover:border-[#F5B51B] flex items-center justify-center active:scale-95 transition-all shadow-md"
            aria-label="Iniciar con Apple"
          >
            <span className="text-lg"></span>
          </button>
        </div>
      </div>

      {/* Driver Mode & Demo Shortcuts */}
      <div className="relative z-10 flex flex-col items-center gap-2 pt-4 pb-2">
        <button
          type="button"
          onClick={onDriverLogin}
          className="text-xs font-semibold text-[#FFD66A] hover:text-white flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-[#202D47]/60 border border-[#33405A] transition-colors"
        >
          <UserCheck className="w-3.5 h-3.5 text-[#F5B51B]" />
          <span>¿Sos conductor? Entrá al Modo Conductor →</span>
        </button>
        <p className="text-[11px] text-[#AEB7C8]/70">
          Formosa, Argentina • Versión 2.4.0
        </p>
      </div>
    </div>
  );
};

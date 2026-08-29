import React, { useState } from 'react';
import { MessageSquare, Phone, Send, X, Mic, MicOff, Volume2, VolumeX, PhoneOff, CheckCheck } from 'lucide-react';
import { DriverInfo } from '../types';

interface ChatCallModalProps {
  driver: DriverInfo;
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'chat' | 'call';
}

export const ChatCallModal: React.FC<ChatCallModalProps> = ({
  driver,
  isOpen,
  onClose,
  initialMode = 'chat',
}) => {
  if (!isOpen) return null;

  const [mode, setMode] = useState<'chat' | 'call'>(initialMode);
  const [messages, setMessages] = useState<Array<{ id: string; sender: 'user' | 'driver'; text: string; time: string }>>([
    {
      id: 'm-1',
      sender: 'driver',
      text: '¡Hola! Ya estoy en camino en el Toyota Etios blanco. Llego en 2 minutos.',
      time: 'Ahora',
    },
  ]);
  const [input, setInput] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(true);
  const [callSeconds, setCallSeconds] = useState(14);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = {
      id: `msg-${Date.now()}`,
      sender: 'user' as const,
      text: input,
      time: 'Ahora',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    // Simulated driver reply after 1.5s
    setTimeout(() => {
      const replies = [
        '¡Perfecto, te espero en la puerta!',
        'Excelente, tengo las balizas puestas.',
        'Dale, ya te veo.',
      ];
      const randomReply = replies[Math.floor(Math.random() * replies.length)];
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-reply-${Date.now()}`,
          sender: 'driver',
          text: randomReply,
          time: 'Ahora',
        },
      ]);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-[#15213A] border border-[#33405A] rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[520px] text-white">
        {/* Modal Header */}
        <div className="p-4 bg-[#0D1930] border-b border-[#33405A] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full border border-[#F5B51B] overflow-hidden">
              <img
                src={driver.avatarUrl}
                alt={driver.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-white">{driver.name}</span>
              <span className="text-[11px] text-[#59C878] font-medium">
                {mode === 'call' ? 'Llamada segura BearDrive' : 'En línea • ' + driver.vehicleModel}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMode(mode === 'chat' ? 'call' : 'chat')}
              className="p-2 rounded-xl bg-[#202D47] text-[#F5B51B] hover:bg-[#33405A]"
            >
              {mode === 'chat' ? <Phone className="w-4 h-4" /> : <MessageSquare className="w-4 h-4" />}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-[#202D47] text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Mode Switch */}
        {mode === 'chat' ? (
          <div className="flex-1 flex flex-col justify-between p-4 overflow-hidden">
            {/* Message History */}
            <div className="flex-1 overflow-y-auto flex flex-col gap-2.5 pr-1">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex flex-col max-w-[80%] ${
                    m.sender === 'user' ? 'self-end items-end' : 'self-start items-start'
                  }`}
                >
                  <div
                    className={`p-3 rounded-2xl text-xs leading-relaxed ${
                      m.sender === 'user'
                        ? 'bg-[#F5B51B] text-[#081226] font-medium rounded-tr-none shadow-md'
                        : 'bg-[#0D1930] text-white border border-[#33405A] rounded-tl-none shadow-sm'
                    }`}
                  >
                    {m.text}
                  </div>
                  <div className="flex items-center gap-1 mt-0.5 text-[9px] text-[#AEB7C8]">
                    <span>{m.time}</span>
                    {m.sender === 'user' && <CheckCheck className="w-3 h-3 text-[#F5B51B]" />}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick quick replies */}
            <div className="flex gap-1.5 overflow-x-auto py-2">
              {['Ya bajé.', 'Estoy en la esquina.', '¿Dónde estás?'].map((qr) => (
                <button
                  key={qr}
                  type="button"
                  onClick={() => setInput(qr)}
                  className="px-2.5 py-1 rounded-lg bg-[#0D1930] border border-[#33405A] text-[11px] text-[#AEB7C8] whitespace-nowrap hover:text-white"
                >
                  {qr}
                </button>
              ))}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSend} className="flex items-center gap-2 pt-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Escribir mensaje..."
                className="flex-1 bg-[#0D1930] border border-[#33405A] focus:border-[#F5B51B] rounded-xl px-3 py-2.5 text-xs text-white outline-none"
              />
              <button
                type="submit"
                className="w-10 h-10 rounded-xl bg-[#F5B51B] text-[#081226] flex items-center justify-center font-bold active:scale-95 shadow shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        ) : (
          /* VoIP In-App Call Simulation */
          <div className="flex-1 flex flex-col items-center justify-between p-8 text-center bg-gradient-to-b from-[#081226] to-[#15213A]">
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full border-4 border-[#F5B51B] overflow-hidden shadow-[0_0_30px_rgba(245,181,27,0.3)] mb-3">
                <img
                  src={driver.avatarUrl}
                  alt={driver.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold text-white">{driver.name}</h3>
              <span className="text-xs text-[#59C878] font-semibold mt-0.5">
                Llamando • 00:{callSeconds < 10 ? `0${callSeconds}` : callSeconds}
              </span>
            </div>

            {/* Voice waveform animation */}
            <div className="flex items-center gap-1.5 h-12">
              {[40, 75, 100, 60, 90, 45, 80, 55, 30].map((h, i) => (
                <div
                  key={i}
                  className="w-1.5 bg-[#F5B51B] rounded-full animate-pulse"
                  style={{
                    height: `${h}%`,
                    animationDelay: `${i * 0.15}s`,
                  }}
                />
              ))}
            </div>

            {/* Call Action Controls */}
            <div className="flex items-center gap-6">
              <button
                type="button"
                onClick={() => setIsMuted(!isMuted)}
                className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  isMuted ? 'bg-red-500 text-white' : 'bg-[#202D47] text-white'
                }`}
              >
                {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  setMode('chat');
                }}
                className="w-14 h-14 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-lg active:scale-95 transition-transform"
              >
                <PhoneOff className="w-6 h-6" />
              </button>

              <button
                type="button"
                onClick={() => setIsSpeaker(!isSpeaker)}
                className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  isSpeaker ? 'bg-[#F5B51B] text-[#081226]' : 'bg-[#202D47] text-white'
                }`}
              >
                {isSpeaker ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

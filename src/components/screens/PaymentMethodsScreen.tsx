import React, { useState } from 'react';
import { CreditCard, Wallet, Smartphone, Banknote, Plus, Check, Trash2, ArrowRight, QrCode, ShieldCheck } from 'lucide-react';
import { PAYMENT_METHODS } from '../../data/mockData';
import { PaymentMethod } from '../../types';

interface PaymentMethodsScreenProps {
  onBack: () => void;
}

export const PaymentMethodsScreen: React.FC<PaymentMethodsScreenProps> = ({ onBack }) => {
  const [methods, setMethods] = useState<PaymentMethod[]>(PAYMENT_METHODS);
  const [selectedId, setSelectedId] = useState<string>('pay-cash');
  const [walletBalance, setWalletBalance] = useState<number>(4850);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [newCardNumber, setNewCardNumber] = useState('');

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCardNumber) return;
    const newMethod: PaymentMethod = {
      id: `pay-custom-${Date.now()}`,
      type: 'credit',
      name: 'Tarjeta Nueva',
      details: `•••• ${newCardNumber.slice(-4) || '9922'}`,
      icon: 'credit-card',
    };
    setMethods([...methods, newMethod]);
    setShowAddModal(false);
    setNewCardNumber('');
  };

  const handleTopUp = () => {
    const amount = 2000;
    setWalletBalance((prev) => prev + amount);
    alert(`¡Se acreditaron $${amount} a tu billetera BearBalance!`);
  };

  return (
    <div className="min-h-[640px] flex flex-col justify-between bg-[#081226] text-white p-4 overflow-y-auto">
      <div>
        {/* Title */}
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-white tracking-tight">Métodos de Pago</h2>
          <p className="text-xs text-[#AEB7C8] mt-0.5">Pagá de forma segura y sin vueltas</p>
        </div>

        {/* BearBalance Digital Wallet Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-[#15213A] via-[#202D47] to-[#15213A] border border-[#F5B51B]/40 shadow-xl mb-5">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Wallet className="w-5 h-5 text-[#F5B51B]" />
              <span className="text-xs font-black text-white uppercase tracking-wider">
                BearBalance Wallet
              </span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#59C878]/20 text-[#59C878] border border-[#59C878]/30">
              ACTIVO
            </span>
          </div>

          <div className="flex items-baseline justify-between mt-1">
            <div>
              <span className="text-[11px] text-[#AEB7C8]">Saldo disponible:</span>
              <div className="text-2xl font-black text-[#F5B51B]">
                ${walletBalance.toLocaleString('es-AR')}
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <button type="button" onClick={handleTopUp} className="flex-1 rounded-xl bg-[#F5B51B] px-3.5 py-2 text-xs font-bold text-[#081226] shadow-md transition-all hover:bg-[#FFBE22] active:scale-95">+ Cargar saldo</button>
              <button type="button" onClick={() => setShowQrModal(true)} className="flex items-center gap-1.5 rounded-xl border border-[#F5B51B]/60 bg-[#0D1930] px-3 py-2 text-xs font-bold text-[#FFD66A]"><QrCode className="h-4 w-4" /> Pagar QR</button>
            </div>
          </div>
        </div>

        {/* Methods List */}
        <div className="flex flex-col gap-2.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#AEB7C8] px-1 mb-1">
            Tus opciones guardadas
          </h3>

          {methods.map((method) => {
            const isSelected = selectedId === method.id;

            return (
              <div
                key={method.id}
                onClick={() => setSelectedId(method.id)}
                className={`p-3.5 rounded-2xl cursor-pointer transition-all flex items-center justify-between shadow-sm ${
                  isSelected
                    ? 'bg-[#15213A] border-2 border-[#F5B51B] shadow-[0_0_15px_rgba(245,181,27,0.2)]'
                    : 'bg-[#15213A] border border-[#33405A] hover:border-[#33405A]'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#0D1930] border border-[#33405A] flex items-center justify-center text-lg shrink-0">
                    {method.type === 'cash' ? '💵' : method.type === 'mercadopago' ? '📱' : method.type === 'wallet' ? '🐻' : '💳'}
                  </div>
                  <div className="flex flex-col"><span className="text-sm font-bold text-white">{method.name}</span><span className="text-xs text-[#AEB7C8]">{method.details}</span></div>
                </div>
                {isSelected && <div className="w-6 h-6 rounded-full bg-[#F5B51B] flex items-center justify-center text-[#081226]"><Check className="w-4 h-4 stroke-[3]" /></div>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Add payment button */}
      <div className="pt-4 mt-auto">
        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="w-full bg-[#15213A] hover:bg-[#202D47] border border-[#F5B51B]/60 text-[#F5B51B] font-bold py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all text-sm"
        >
          <Plus className="w-4 h-4 text-[#F5B51B]" />
          <span>Agregar tarjeta o cuenta</span>
        </button>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#15213A] border border-[#33405A] rounded-3xl p-6 shadow-2xl text-white">
            <h3 className="text-lg font-black text-white mb-1">Agregar Tarjeta</h3>
            <p className="text-xs text-[#AEB7C8] mb-4">Aceptamos Visa, Mastercard y Débito.</p>

            <form onSubmit={handleAddCard} className="flex flex-col gap-3">
              <div>
                <label className="text-xs font-semibold text-[#AEB7C8] block mb-1">
                  Número de tarjeta
                </label>
                <input
                  type="text"
                  placeholder="4500 0000 0000 0000"
                  value={newCardNumber}
                  onChange={(e) => setNewCardNumber(e.target.value)}
                  className="w-full bg-[#0D1930] border border-[#33405A] rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#F5B51B]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-[#AEB7C8] block mb-1">
                    Vencimiento
                  </label>
                  <input
                    type="text"
                    placeholder="MM/AA"
                    defaultValue="10/28"
                    className="w-full bg-[#0D1930] border border-[#33405A] rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#F5B51B]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#AEB7C8] block mb-1">CVV</label>
                  <input
                    type="password"
                    placeholder="123"
                    defaultValue="789"
                    className="w-full bg-[#0D1930] border border-[#33405A] rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#F5B51B]"
                  />
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <button
                  type="submit"
                  className="flex-1 bg-[#F5B51B] hover:bg-[#FFBE22] text-[#081226] font-bold py-3 px-4 rounded-xl text-xs shadow-md"
                >
                  Guardar tarjeta
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-3 rounded-xl bg-[#202D47] text-xs font-bold text-white hover:bg-[#33405A]"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl border border-[#F5B51B] bg-[#15213A] p-6 text-center shadow-2xl">
            <QrCode className="mx-auto h-8 w-8 text-[#F5B51B]" />
            <h3 className="mt-3 text-lg font-black">Pagar con QR</h3>
            <p className="mt-1 text-xs leading-relaxed text-[#AEB7C8]">Escaneá este código desde tu billetera para cargar BearBalance.</p>
            <div className="mx-auto mt-5 flex h-44 w-44 items-center justify-center rounded-2xl bg-white p-3" aria-label="Código QR de pago de demostración"><div className="grid h-full w-full grid-cols-7 gap-1 bg-white">{Array.from({ length: 49 }, (_, index) => <span key={index} className={(index * 7 + 3) % 5 < 2 || index < 7 || index % 7 < 2 ? 'bg-[#081226]' : 'bg-white'} />)}</div></div>
            <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-[#59C878]"><ShieldCheck className="h-4 w-4" /> Pago seguro de demostración</div>
            <button type="button" onClick={() => setShowQrModal(false)} className="mt-5 w-full rounded-xl bg-[#F5B51B] py-3 text-xs font-black text-[#081226]">Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
};

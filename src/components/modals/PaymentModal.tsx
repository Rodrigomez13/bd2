import React from 'react';
import { CreditCard, Check, X, Plus, Wallet, QrCode, Banknote } from 'lucide-react';
import { PAYMENT_METHODS } from '../../data/mockData';
import { PaymentMethod } from '../../types';
import { triggerHaptic } from '../../utils/haptics';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPayment: PaymentMethod;
  onSelectPayment: (pm: PaymentMethod) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  selectedPayment,
  onSelectPayment,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-[#0D1930] border-t sm:border border-[#33405A] rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl max-h-[80vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300"
        id="modal-payment-methods"
      >
        <div className="flex flex-col gap-2 pb-3 border-b border-[#33405A]/70">
          <div className="w-12 h-1 bg-[#33405A] rounded-full mx-auto sm:hidden" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#15213A] border border-[#F5B51B] flex items-center justify-center text-[#F5B51B]">
                <CreditCard className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-black text-white">Métodos de Pago</h3>
                <p className="text-[10px] text-[#AEB7C8]">Aboná directo a tu conductor</p>
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

        <div className="flex-1 overflow-y-auto py-3.5 flex flex-col gap-2.5">
          {PAYMENT_METHODS.map((pm) => {
            const isSelected = selectedPayment.id === pm.id;
            return (
              <div
                key={pm.id}
                onClick={() => {
                  triggerHaptic('selection');
                  onSelectPayment(pm);
                  onClose();
                }}
                className={`p-3 rounded-2xl cursor-pointer transition-all flex items-center justify-between active:scale-[0.99] ${
                  isSelected
                    ? 'bg-[#15213A] border-2 border-[#F5B51B] shadow-md'
                    : 'bg-[#15213A]/70 border border-[#33405A] hover:border-[#33405A]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#081226] border border-[#33405A] flex items-center justify-center text-base shrink-0">
                    {pm.type === 'cash' ? (
                      <Banknote className="w-4 h-4 text-[#59C878]" />
                    ) : pm.type === 'mercadopago' ? (
                      <QrCode className="w-4 h-4 text-[#F5B51B]" />
                    ) : pm.type === 'wallet' ? (
                      <Wallet className="w-4 h-4 text-[#FFD66A]" />
                    ) : (
                      <CreditCard className="w-4 h-4 text-[#3B82F6]" />
                    )}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-white truncate">{pm.name}</span>
                    <span className="text-[10px] text-[#AEB7C8] truncate">{pm.details}</span>
                  </div>
                </div>

                {isSelected && (
                  <div className="w-6 h-6 rounded-full bg-[#F5B51B] text-[#081226] flex items-center justify-center font-bold shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="pt-2 border-t border-[#33405A]/70">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-[#15213A] hover:bg-[#202D47] text-white text-xs font-bold transition-all cursor-pointer"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
};

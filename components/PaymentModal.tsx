
import React, { useState } from 'react';
import { X, CreditCard, Smartphone, CheckCircle, Lock } from 'lucide-react';

interface PaymentModalProps {
  amount: number;
  productName: string;
  onClose: () => void;
  onSuccess: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ amount, productName, onClose, onSuccess }) => {
  const [method, setMethod] = useState<'card' | 'paypal' | 'mobile'>('card');
  const [processing, setProcessing] = useState(false);
  const [completed, setCompleted] = useState(false);

  const handlePayment = () => {
    setProcessing(true);
    // Simulate API call
    setTimeout(() => {
      setProcessing(false);
      setCompleted(true);
      setTimeout(() => {
        onSuccess();
      }, 2000);
    }, 2000);
  };

  if (completed) {
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
        <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center animate-in zoom-in duration-300">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Paiement Réussi !</h2>
          <p className="text-gray-500 mb-6">Vous allez recevoir votre reçu et l'accès par email immédiatement.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl animate-in slide-in-from-bottom-10 duration-300">
        <div className="bg-blue-600 p-6 text-white flex justify-between items-start">
          <div>
            <h3 className="text-sm font-medium text-blue-100 uppercase tracking-wider">Paiement Sécurisé</h3>
            <h2 className="text-xl font-bold mt-1">{productName}</h2>
            <p className="text-3xl font-bold mt-2">{amount}€</p>
          </div>
          <button onClick={onClose} className="text-blue-100 hover:text-white bg-blue-700 p-1 rounded-full">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Moyen de paiement</label>
            <div className="grid grid-cols-3 gap-3">
              <button 
                onClick={() => setMethod('card')}
                className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all ${method === 'card' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-gray-300'}`}
              >
                <CreditCard size={24} className="mb-2" />
                <span className="text-xs font-bold">Carte</span>
              </button>
              <button 
                onClick={() => setMethod('paypal')}
                className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all ${method === 'paypal' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-gray-300'}`}
              >
                <span className="text-xl font-bold italic font-serif mb-2">P</span>
                <span className="text-xs font-bold">PayPal</span>
              </button>
              <button 
                onClick={() => setMethod('mobile')}
                className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all ${method === 'mobile' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-gray-300'}`}
              >
                <Smartphone size={24} className="mb-2" />
                <span className="text-xs font-bold">Mobile Money</span>
              </button>
            </div>
          </div>

          {method === 'card' && (
            <div className="space-y-3">
              <input type="text" placeholder="Numéro de carte" className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              <div className="flex gap-3">
                <input type="text" placeholder="MM/AA" className="w-1/2 border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                <input type="text" placeholder="CVC" className="w-1/2 border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>
          )}

          {method === 'mobile' && (
            <div className="space-y-3">
              <p className="text-xs text-gray-500 mb-2">Compatible T-Money (Togo), Flooz, Orange Money.</p>
              <input type="text" placeholder="Numéro de téléphone (+228...)" className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
          )}

          {method === 'paypal' && (
            <div className="text-center py-4 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              <p className="text-sm text-gray-600">Vous serez redirigé vers PayPal pour finaliser.</p>
            </div>
          )}

          <div className="border-t border-gray-100 pt-4">
             <button 
               onClick={handlePayment}
               disabled={processing}
               className="w-full bg-brand-black text-white font-bold py-4 rounded-xl hover:bg-gray-800 transition-colors flex justify-center items-center gap-2"
             >
               {processing ? (
                 <>Traitement en cours...</>
               ) : (
                 <>
                   <Lock size={18} /> Payer {amount}€
                 </>
               )}
             </button>
             <p className="text-center text-xs text-gray-400 mt-3 flex justify-center items-center gap-1">
               <Lock size={10} /> Transactions chiffrées SSL 256-bit
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;

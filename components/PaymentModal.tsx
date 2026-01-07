
import React, { useState, useEffect, useMemo } from 'react';
import { X, CreditCard, Smartphone, CheckCircle, Lock, Wallet, AlertTriangle, Upload, Shield, BadgeCheck, Globe, Tag, ExternalLink, Ticket, Check, RefreshCw } from 'lucide-react';
import { PaymentGatewayManager } from '../services/paymentGatewayManager';
import { PaymentMethodConfig } from '../types';
import { useData } from '../contexts/DataContext';
import { useUser } from '../contexts/UserContext';

interface PaymentModalProps {
  amount: number;
  productName: string;
  onClose: () => void;
  onSuccess: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ amount, productName, onClose, onSuccess }) => {
  const { completePurchase, courses, coupons } = useData();
  const { user } = useUser();
  const [activeMethods, setActiveMethods] = useState<PaymentMethodConfig[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodConfig | null>(null);
  const [processing, setProcessing] = useState(false);
  const [completed, setCompleted] = useState(false);
  
  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponError, setCouponError] = useState('');

  const currentCourse = useMemo(() => courses.find(c => c.title === productName), [courses, productName]);

  useEffect(() => {
    setActiveMethods(PaymentGatewayManager.getActiveMethods());
  }, []);

  const handleApplyCoupon = () => {
      setCouponError('');
      const code = couponCodeInput.toUpperCase().trim();
      if (!code) return;

      const coupon = coupons.find(c => c.code === code && c.isActive);
      
      if (!coupon) {
          setCouponError('Code invalide ou expiré');
          setAppliedCoupon(null);
          return;
      }

      if (coupon.limitToProducts && currentCourse && !coupon.selectedProductIds.includes(currentCourse.id)) {
          setCouponError('Ce code ne s\'applique pas à ce produit');
          setAppliedCoupon(null);
          return;
      }

      setAppliedCoupon(coupon);
      setCouponCodeInput('');
  };

  const finalDiscount = useMemo(() => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.type === 'percentage') {
      return (amount * appliedCoupon.discountValue) / 100;
    } else {
      return appliedCoupon.discountValue;
    }
  }, [appliedCoupon, amount]);

  const finalAmount = Math.max(0, amount - finalDiscount);

  const handlePayment = async () => {
    if (!selectedMethod) return;
    setProcessing(true);
    
    try {
      const result = await PaymentGatewayManager.initiateTransaction(
        selectedMethod.id,
        Math.round(finalAmount),
        productName,
        currentCourse?.instructorId || 'v1'
      );

      if (result.success) {
        if (user && currentCourse) {
            completePurchase(user.id, currentCourse.id, selectedMethod.name);
        }
        setProcessing(false);
        setCompleted(true);
        setTimeout(onSuccess, 2000);
      } else {
        alert("Erreur : " + result.message);
        setProcessing(false);
      }
    } catch (e) {
      setProcessing(false);
    }
  };

  if (completed) {
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in">
        <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl">
          <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Paiement Validé</h2>
          <p className="text-gray-500">Votre accès est débloqué !</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-2 md:p-4">
      <div className="bg-white rounded-[32px] max-w-4xl w-full overflow-hidden shadow-2xl flex flex-col md:flex-row h-full md:h-auto">
        
        <div className="w-full md:w-5/12 bg-brand-black p-8 text-white flex flex-col">
          <div className="mb-8">
            <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4">Récapitulatif de commande</h3>
            <h2 className="text-xl font-black leading-tight mb-2">{productName}</h2>
            <div className="h-1 w-12 bg-brand-blue rounded-full"></div>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex justify-between items-center text-sm">
               <span className="text-gray-400 font-bold uppercase tracking-widest text-[9px]">Prix initial</span>
               <span className="font-black">{amount.toLocaleString()} F</span>
            </div>
            {appliedCoupon && (
              <div className="flex justify-between items-center text-sm animate-in slide-in-from-right-2">
                 <span className="text-green-400 font-bold uppercase tracking-widest text-[9px] flex items-center gap-1"><Tag size={10}/> Remise {appliedCoupon.code}</span>
                 <span className="font-black text-green-400">-{finalDiscount.toLocaleString()} F</span>
              </div>
            )}
            <div className="pt-4 border-t border-white/10 flex justify-between items-end">
               <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Total à payer</span>
               <span className="text-3xl font-black text-brand-blue">{Math.round(finalAmount).toLocaleString()} <span className="text-xs font-medium text-gray-500">F</span></span>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-3">Moyen de paiement</p>
            {activeMethods.map(m => (
              <button key={m.id} onClick={() => setSelectedMethod(m)} className={`w-full text-left p-4 rounded-2xl flex items-center gap-3 transition-all border-2 ${selectedMethod?.id === m.id ? 'bg-brand-blue/20 border-brand-blue text-white' : 'bg-white/5 border-transparent text-gray-400 hover:bg-white/10'}`}>
                <div className={`p-2 rounded-lg ${selectedMethod?.id === m.id ? 'bg-brand-blue text-white' : 'bg-gray-800 text-gray-400'}`}>
                   {m.type === 'mobile_money' ? <Smartphone size={16}/> : <CreditCard size={16}/>}
                </div>
                <span className="font-black text-xs uppercase tracking-widest">{m.name}</span>
                {selectedMethod?.id === m.id && <Check size={14} className="ml-auto" />}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 p-10 bg-gray-50 overflow-y-auto">
          <div className="space-y-8">
            {!appliedCoupon && (
               <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Ticket size={16} className="text-brand-blue" />
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Avez-vous un code promo ?</h4>
                  </div>
                  <div className="flex gap-2">
                    <input 
                      value={couponCodeInput}
                      onChange={e => setCouponCodeInput(e.target.value)}
                      placeholder="ENTRER LE CODE" 
                      className="flex-1 bg-gray-50 border-none rounded-xl p-3 text-xs font-black tracking-[0.2em] uppercase focus:ring-2 focus:ring-brand-blue/20"
                    />
                    <button 
                      onClick={handleApplyCoupon}
                      className="bg-brand-black text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-800"
                    >
                      Appliquer
                    </button>
                  </div>
                  {couponError && <p className="text-[9px] font-bold text-red-500 uppercase flex items-center gap-1"><AlertTriangle size={10}/> {couponError}</p>}
               </div>
            )}

            {selectedMethod ? (
              <div className="space-y-6 animate-in slide-in-from-right-4">
                <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-5"><Shield size={80}/></div>
                  <h4 className="font-black text-[10px] uppercase text-gray-400 mb-4 tracking-widest">Processus de paiement sécurisé</h4>
                  <p className="text-gray-800 font-bold leading-relaxed">{selectedMethod.instructions || "Effectuez le transfert vers nos comptes officiels pour validation immédiate."}</p>
                </div>
                
                <button 
                  onClick={handlePayment} 
                  disabled={processing} 
                  className="w-full bg-brand-blue text-white py-6 rounded-[24px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-blue-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                >
                  {processing ? <RefreshCw className="animate-spin" size={20}/> : <Lock size={20} />}
                  {processing ? 'TRAITEMENT...' : 'PAYER MAINTENANT'}
                </button>
              </div>
            ) : (
              <div className="py-20 flex flex-col items-center justify-center text-gray-300 gap-4">
                <Shield size={64} className="opacity-10" />
                <p className="font-black uppercase text-[10px] tracking-[0.2em]">Sélectionnez un moyen de paiement</p>
              </div>
            )}
          </div>
          
          <button onClick={onClose} className="w-full mt-10 text-gray-400 font-black text-[10px] uppercase tracking-[0.2em] py-2 hover:text-red-500 transition-colors">Retour au site</button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;


import React, { useState, useEffect } from 'react';
import { X, CreditCard, Smartphone, CheckCircle, Lock, Wallet, AlertTriangle, Upload, Shield, BadgeCheck, Globe, Tag, ExternalLink } from 'lucide-react';
import { mockCoupons } from '../services/mockData';
import { PaymentGatewayManager } from '../services/paymentGatewayManager';
import { PaymentMethodConfig } from '../types';

interface PaymentModalProps {
  amount: number;
  productName: string;
  onClose: () => void;
  onSuccess: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ amount, productName, onClose, onSuccess }) => {
  // Fetch dynamic methods from manager
  const [activeMethods, setActiveMethods] = useState<PaymentMethodConfig[]>([]);
  
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodConfig | null>(null);
  const [currency, setCurrency] = useState<'EUR' | 'XOF' | 'USD'>('XOF'); 
  const [processing, setProcessing] = useState(false);
  const [completed, setCompleted] = useState(false);
  
  // Coupon State
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [couponError, setCouponError] = useState('');

  // Manual Payment State
  const [proofId, setProofId] = useState('');
  const [proofFile, setProofFile] = useState<File | null>(null);

  useEffect(() => {
    setActiveMethods(PaymentGatewayManager.getActiveMethods());
  }, []);

  // Apply Coupon Logic
  const handleApplyCoupon = () => {
      setCouponError('');
      const coupon = mockCoupons.find(c => c.code === couponCode.toUpperCase() && c.isActive);
      
      if (!coupon) {
          setCouponError('Code invalide ou expiré');
          setAppliedDiscount(0);
          return;
      }
      
      let discount = 0;
      if (coupon.discountType === 'percentage') {
          discount = amount * (coupon.discountValue / 100);
      } else {
          discount = coupon.discountValue;
      }
      setAppliedDiscount(discount);
  };

  const finalAmount = Math.max(0, amount - appliedDiscount);

  // Simple exchange rate for demo
  const displayAmount = currency === 'XOF' 
    ? (finalAmount < 1000 ? finalAmount * 655 : finalAmount) 
    : (finalAmount > 1000 ? finalAmount / 655 : finalAmount);
  
  const displayCurrency = currency === 'XOF' ? 'FCFA' : (currency === 'EUR' ? '€' : '$');

  const handlePayment = async () => {
    if (!selectedMethod) return;

    if (selectedMethod.integrationMode === 'manual' && selectedMethod.requiresProof && !proofId && !proofFile) {
       alert("Veuillez fournir une preuve de paiement (ID de transaction ou capture).");
       return;
    }

    setProcessing(true);
    
    try {
      const result = await PaymentGatewayManager.initiateTransaction(
        selectedMethod.id,
        Math.round(displayAmount),
        productName,
        'v1', 
        { name: 'Customer', email: 'test@customer.com' }
      );

      if (result.success) {
        if (result.action === 'redirect' && result.redirectUrl) {
           window.open(result.redirectUrl, '_blank');
           setTimeout(() => {
             setProcessing(false);
             setCompleted(true);
             setTimeout(onSuccess, 3000);
           }, 2000);
        } else if (result.action === 'completed') {
           setProcessing(false);
           setCompleted(true);
           setTimeout(onSuccess, 3000);
        } else if (result.action === 'display_instructions') {
           if(selectedMethod.integrationMode === 'manual') {
             PaymentGatewayManager.confirmManualPayment(selectedMethod.id, Math.round(displayAmount), productName, 'v1', proofId);
           }
           setProcessing(false);
           setCompleted(true);
           setTimeout(onSuccess, 3000);
        }
      } else {
        alert("Erreur de paiement : " + result.message);
        setProcessing(false);
      }
    } catch (e) {
      console.error(e);
      setProcessing(false);
      alert("Une erreur est survenue.");
    }
  };

  if (completed) {
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in">
        <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center animate-in zoom-in duration-300 shadow-2xl">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Paiement Réussi !</h2>
          <p className="text-gray-500 mb-6">Votre accès a été débloqué. Vous allez être redirigé.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-2 md:p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl animate-in slide-in-from-bottom-10 duration-300 flex flex-col md:flex-row max-h-[95vh] h-full md:h-auto">
        
        {/* Left Side: Summary & Navigation - Scrollable on mobile if needed but usually compact */}
        <div className="w-full md:w-1/3 bg-brand-black p-4 md:p-6 text-white flex flex-col shrink-0">
          <div className="mb-4 md:mb-6">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Commande</h3>
            <h2 className="text-lg font-bold leading-tight mb-4 truncate">{productName}</h2>
            
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-3 md:p-4 mb-4">
                <div className="flex items-end gap-2">
                    <p className="text-2xl md:text-3xl font-bold text-brand-blue">{Math.round(displayAmount).toLocaleString()} <span className="text-sm md:text-base font-normal text-gray-400">{displayCurrency}</span></p>
                </div>
            </div>

            {/* Coupon Input */}
            <div className="relative">
                <input 
                    type="text" 
                    placeholder="CODE PROMO" 
                    value={couponCode}
                    onChange={e => setCouponCode(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-brand-blue uppercase"
                />
                <button 
                    onClick={handleApplyCoupon}
                    className="absolute right-1 top-1 bg-gray-700 hover:bg-gray-600 text-xs px-2 py-1.5 rounded"
                >
                    OK
                </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar hidden md:block">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 mt-4">Paiement Sécurisé Par</p>
            <div className="space-y-2">
               {activeMethods.map(method => (
                 <button 
                   key={method.id}
                   onClick={() => setSelectedMethod(method)}
                   className={`w-full text-left p-3 rounded-xl flex items-center gap-3 transition-all border ${
                     selectedMethod?.id === method.id 
                       ? 'bg-brand-blue text-white border-brand-blue shadow-lg' 
                       : 'hover:bg-gray-800 text-gray-300 border-gray-700'
                   }`}
                 >
                   <div className="w-8 h-8 rounded flex items-center justify-center bg-white text-brand-black font-bold text-xs overflow-hidden shrink-0" style={{color: method.textColor, backgroundColor: method.color}}>
                     {method.logoUrl ? <img src={method.logoUrl} className="w-full h-full object-contain p-1"/> : method.name.substring(0, 2)}
                   </div>
                   <div className="flex-1 truncate">
                     <span className="font-bold text-sm block truncate">{method.name}</span>
                   </div>
                   {selectedMethod?.id === method.id && <CheckCircle size={16}/>}
                 </button>
               ))}
            </div>
          </div>

          <button onClick={onClose} className="mt-4 flex items-center gap-2 text-gray-500 hover:text-white text-sm transition-colors justify-center md:hidden">
            <X size={16} /> Annuler
          </button>
        </div>
        
        {/* Right Side: Dynamic Form - Main Scrollable Area */}
        <div className="w-full md:w-2/3 bg-gray-50 flex flex-col h-full overflow-hidden">
          
          {/* Mobile Payment Method Selector (Horizontal) */}
          <div className="md:hidden p-3 bg-white border-b border-gray-200 overflow-x-auto whitespace-nowrap shrink-0 no-scrollbar flex gap-2">
             {activeMethods.map(method => (
                 <button 
                   key={method.id}
                   onClick={() => setSelectedMethod(method)}
                   className={`px-4 py-2 rounded-lg flex items-center gap-2 border transition-all text-sm font-bold ${
                     selectedMethod?.id === method.id 
                       ? 'bg-brand-blue text-white border-brand-blue shadow' 
                       : 'bg-white text-gray-600 border-gray-200'
                   }`}
                 >
                   {method.name}
                 </button>
             ))}
          </div>

          <div className="flex-1 p-4 md:p-8 overflow-y-auto">
            {!selectedMethod ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 text-center py-10">
                 <Shield size={48} className="mb-4 opacity-50 text-brand-blue" />
                 <h3 className="font-bold text-gray-600 mb-2">Sécurité Bancaire</h3>
                 <p className="text-sm max-w-xs mx-auto">Veuillez sélectionner un moyen de paiement pour continuer.</p>
                 <div className="hidden md:flex gap-4 mt-8 opacity-50 grayscale">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" className="h-6"/>
                    <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" className="h-6"/>
                 </div>
              </div>
            ) : (
              <div className="animate-in slide-in-from-right-4 space-y-4 md:space-y-6">
                 <div className="text-center">
                    <div className="w-12 h-12 md:w-16 md:h-16 mx-auto bg-white rounded-full shadow-md flex items-center justify-center mb-4 border border-gray-100" style={{backgroundColor: selectedMethod.color}}>
                       {selectedMethod.logoUrl ? <img src={selectedMethod.logoUrl} className="w-8 h-8 md:w-10 md:h-10 object-contain"/> : <Wallet size={24} style={{color: selectedMethod.textColor}}/>}
                    </div>
                    <h3 className="font-bold text-lg md:text-xl text-gray-800">Payer avec {selectedMethod.name}</h3>
                 </div>

                 {selectedMethod.integrationMode === 'manual' && selectedMethod.instructions && (
                    <div className="bg-white p-4 md:p-6 rounded-xl border border-gray-200 shadow-sm relative">
                        <div className="absolute top-0 left-0 w-1 h-full bg-brand-blue rounded-l-xl"></div>
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Instructions</h4>
                        <p className="text-gray-800 font-medium whitespace-pre-wrap leading-relaxed text-sm md:text-base">{selectedMethod.instructions}</p>
                    </div>
                 )}

                 {selectedMethod.integrationMode !== 'manual' && (
                     <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 text-center text-blue-800">
                         <p className="font-bold mb-1">Connexion Sécurisée</p>
                         <p className="text-xs opacity-75">Cliquez sur le bouton ci-dessous pour ouvrir la passerelle.</p>
                     </div>
                 )}

                 {selectedMethod.integrationMode === 'manual' && selectedMethod.requiresProof && (
                   <div className="space-y-4">
                      <div className="bg-yellow-50 p-3 md:p-4 rounded-xl border border-yellow-100 flex gap-3 text-sm text-yellow-800">
                         <AlertTriangle size={20} className="shrink-0" />
                         <p className="text-xs md:text-sm">Une fois le transfert effectué, veuillez renseigner l'ID ou la capture pour validation.</p>
                      </div>

                      <div>
                         <label className="block text-xs font-bold text-gray-500 mb-1">ID de Transaction</label>
                         <input 
                           type="text" 
                           value={proofId}
                           onChange={e => setProofId(e.target.value)}
                           placeholder="Ex: TX-123456789" 
                           className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-brand-blue outline-none" 
                         />
                      </div>
                      
                      <div>
                         <label className="block text-xs font-bold text-gray-500 mb-1">Capture d'écran</label>
                         <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 md:p-6 text-center hover:bg-gray-100 transition-colors cursor-pointer relative">
                            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => setProofFile(e.target.files?.[0] || null)} />
                            <Upload size={24} className="mx-auto text-gray-400 mb-2"/>
                            <p className="text-xs text-gray-500 font-bold">{proofFile ? proofFile.name : 'Cliquez pour ajouter une image'}</p>
                         </div>
                      </div>
                   </div>
                 )}
              </div>
            )}
          </div>

          <div className="p-4 md:p-6 border-t border-gray-200 bg-white shrink-0">
             <button 
               onClick={handlePayment}
               disabled={processing || !selectedMethod}
               className="w-full bg-brand-blue text-white font-bold py-3 md:py-4 rounded-xl hover:bg-blue-600 transition-all flex justify-center items-center gap-2 shadow-lg shadow-blue-500/20 disabled:opacity-70 disabled:cursor-not-allowed group text-base md:text-lg"
             >
               {processing ? (
                 <>Traitement...</>
               ) : (
                 <>
                   <Lock size={20} /> Payer {Math.round(displayAmount).toLocaleString()} {displayCurrency}
                 </>
               )}
             </button>
             <button onClick={onClose} className="mt-3 flex items-center gap-2 text-gray-500 hover:text-black text-xs md:hidden w-full justify-center">
                Annuler la transaction
             </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PaymentModal;

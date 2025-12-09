
import React, { useState } from 'react';
import { X, CreditCard, Smartphone, CheckCircle, Lock, Globe, Wallet, ChevronRight, Bitcoin, QrCode, Landmark, Link as LinkIcon, AlertTriangle, Copy, Shield, BadgeCheck, Zap } from 'lucide-react';

interface PaymentModalProps {
  amount: number;
  productName: string;
  onClose: () => void;
  onSuccess: () => void;
}

const paymentLogos = {
  visa: "https://upload.wikimedia.org/wikipedia/commons/d/d6/Visa_2021.svg",
  mastercard: "https://upload.wikimedia.org/wikipedia/commons/a/a4/Mastercard_2019_logo.svg",
  paypal: "https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg",
  mtn: "https://upload.wikimedia.org/wikipedia/commons/9/93/MTN_Logo.svg",
  orange: "https://upload.wikimedia.org/wikipedia/commons/c/c8/Orange_logo.svg",
  wave: "https://upload.wikimedia.org/wikipedia/commons/4/42/Wave_Logo.png", 
  bitcoin: "https://upload.wikimedia.org/wikipedia/commons/4/46/Bitcoin.svg",
  usdt: "https://upload.wikimedia.org/wikipedia/commons/e/e9/Tether_USDT.png",
  chariow: "https://play-lh.googleusercontent.com/yP8YJ_2_2x3yX5y3yX5y3yX5y3yX5y3yX5y3yX5y3yX5y3yX5y3yX5y3yX5y3yX5", 
  flutterwave: "https://upload.wikimedia.org/wikipedia/commons/2/29/Flutterwave_Logo.png",
  paystack: "https://upload.wikimedia.org/wikipedia/commons/0/0b/Paystack_Logo.png",
  stripe: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg"
};

const PaymentModal: React.FC<PaymentModalProps> = ({ amount, productName, onClose, onSuccess }) => {
  const [methodCategory, setMethodCategory] = useState<'mobile' | 'card' | 'crypto' | 'bank' | 'other'>('mobile');
  const [provider, setProvider] = useState<string>(''); 
  const [currency, setCurrency] = useState<'EUR' | 'XOF' | 'USD'>('XOF'); 
  const [processing, setProcessing] = useState(false);
  const [completed, setCompleted] = useState(false);

  // Simple exchange rate for demo
  const displayAmount = currency === 'XOF' 
    ? (amount < 1000 ? amount * 655 : amount) 
    : (amount > 1000 ? amount / 655 : amount);
  
  const displayCurrency = currency === 'XOF' ? 'FCFA' : (currency === 'EUR' ? '€' : '$');

  const handlePayment = () => {
    if (methodCategory === 'mobile' && !provider) {
      alert("Veuillez choisir un opérateur (T-Money, Flooz, Wave, etc.)");
      return;
    }
    setProcessing(true);
    // Simulate Split Payment Logic
    console.log("Processing payment...");
    console.log(`Amount: ${amount}, Commission (10%): ${amount * 0.1}, Vendor Net: ${amount * 0.9}`);
    
    // Simulate API delay
    setTimeout(() => {
      setProcessing(false);
      setCompleted(true);
      setTimeout(() => {
        onSuccess();
      }, 3000);
    }, 2000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copié !");
  };

  if (completed) {
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in">
        <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center animate-in zoom-in duration-300 shadow-2xl">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Paiement Validé !</h2>
          <p className="text-gray-500 mb-6">Votre accès à "{productName}" a été débloqué. Un reçu a été envoyé par email.</p>
          <div className="text-xs text-gray-400 mt-4">Transaction ID: #TRX-{Math.floor(Math.random()*100000)}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl animate-in slide-in-from-bottom-10 duration-300 flex flex-col md:flex-row max-h-[90vh]">
        
        {/* Left Side: Summary & Navigation */}
        <div className="w-full md:w-1/3 bg-brand-black p-6 text-white flex flex-col">
          <div className="mb-6">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Résumé de la commande</h3>
            <h2 className="text-lg font-bold leading-tight mb-4">{productName}</h2>
            <div className="flex items-end gap-2 p-4 bg-gray-900 rounded-xl border border-gray-800">
               <p className="text-3xl font-bold text-brand-blue">{Math.round(displayAmount).toLocaleString()} <span className="text-base font-normal text-gray-400">{displayCurrency}</span></p>
            </div>
            {/* Currency Switcher */}
            <div className="flex gap-2 mt-4">
              {['XOF', 'EUR', 'USD'].map(c => (
                <button 
                  key={c}
                  onClick={() => setCurrency(c as any)}
                  className={`px-3 py-1 text-xs font-bold rounded-lg border transition-colors ${currency === c ? 'bg-white text-brand-black border-white' : 'border-gray-700 text-gray-500 hover:text-white'}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <nav className="flex-1 space-y-2 overflow-y-auto pr-2 custom-scrollbar">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 mt-4">Moyens de paiement</p>
            
            <button 
              onClick={() => setMethodCategory('mobile')}
              className={`w-full text-left p-3 rounded-xl flex items-center gap-3 transition-all ${methodCategory === 'mobile' ? 'bg-brand-blue text-white shadow-lg' : 'hover:bg-gray-800 text-gray-300'}`}
            >
              <Smartphone size={20} />
              <div>
                <span className="font-bold text-sm block">Mobile Money</span>
                <span className="text-[10px] opacity-70">TMoney, Flooz, Wave, Chariow...</span>
              </div>
            </button>

            <button 
              onClick={() => setMethodCategory('card')}
              className={`w-full text-left p-3 rounded-xl flex items-center gap-3 transition-all ${methodCategory === 'card' ? 'bg-brand-blue text-white shadow-lg' : 'hover:bg-gray-800 text-gray-300'}`}
            >
              <CreditCard size={20} />
              <div>
                <span className="font-bold text-sm block">Carte & International</span>
                <span className="text-[10px] opacity-70">Stripe, Paystack, Flutterwave...</span>
              </div>
            </button>

            <button 
              onClick={() => setMethodCategory('crypto')}
              className={`w-full text-left p-3 rounded-xl flex items-center gap-3 transition-all ${methodCategory === 'crypto' ? 'bg-brand-blue text-white shadow-lg' : 'hover:bg-gray-800 text-gray-300'}`}
            >
              <Bitcoin size={20} />
              <div>
                <span className="font-bold text-sm block">Crypto-monnaies</span>
                <span className="text-[10px] opacity-70">USDT, BTC (Web3)</span>
              </div>
            </button>

            <button 
              onClick={() => setMethodCategory('bank')}
              className={`w-full text-left p-3 rounded-xl flex items-center gap-3 transition-all ${methodCategory === 'bank' ? 'bg-brand-blue text-white shadow-lg' : 'hover:bg-gray-800 text-gray-300'}`}
            >
              <Landmark size={20} />
              <div>
                <span className="font-bold text-sm block">Virement Bancaire</span>
                <span className="text-[10px] opacity-70">Swift, IBAN</span>
              </div>
            </button>
          </nav>

          <button onClick={onClose} className="mt-6 flex items-center gap-2 text-gray-500 hover:text-white text-sm transition-colors">
            <X size={16} /> Annuler la transaction
          </button>
        </div>
        
        {/* Right Side: Dynamic Form */}
        <div className="w-full md:w-2/3 bg-gray-50 flex flex-col">
          <div className="flex-1 p-6 md:p-8 overflow-y-auto">
            
            {/* --- MOBILE MONEY VIEW --- */}
            {methodCategory === 'mobile' && (
              <div className="space-y-6 animate-in slide-in-from-right-4">
                <div className="text-center">
                   <h3 className="font-bold text-xl text-gray-800">Mobile Money Afrique</h3>
                   <p className="text-sm text-gray-500">Paiement instantané et sécurisé</p>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                   {[
                     { name: 'TMoney', color: 'bg-yellow-400', textColor: 'text-black', logoText: 'T' }, 
                     { name: 'Flooz', color: 'bg-blue-800', textColor: 'text-white', logoText: 'F' }, 
                     { name: 'Wave', color: 'bg-sky-400', textColor: 'text-white', isImg: true, src: paymentLogos.wave }, 
                     { name: 'Chariow', color: 'bg-green-600', textColor: 'text-white', logoText: 'C' }, 
                     { name: 'MTN', color: 'bg-yellow-500', textColor: 'text-black', isImg: true, src: paymentLogos.mtn }, 
                     { name: 'Orange', color: 'bg-orange-500', textColor: 'text-white', isImg: true, src: paymentLogos.orange }, 
                     { name: 'Airtel', color: 'bg-red-600', textColor: 'text-white', logoText: 'A' }
                    ].map(p => (
                     <button 
                       key={p.name}
                       onClick={() => setProvider(p.name)}
                       className={`relative overflow-hidden h-20 rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-1 ${provider === p.name ? 'border-brand-blue ring-1 ring-brand-blue shadow-lg bg-white' : 'border-gray-200 bg-white hover:border-gray-300'}`}
                     >
                       {/* Indicator Strip */}
                       <div className={`absolute top-0 left-0 w-full h-1 ${p.color}`}></div>
                       
                       {p.isImg && p.src ? (
                          <img src={p.src} alt={p.name} className="h-6 w-auto object-contain" />
                       ) : (
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-sm ${p.color} ${p.textColor}`}>
                            {p.logoText}
                          </div>
                       )}
                       <span className="font-bold text-[10px] text-gray-700">{p.name}</span>
                       
                       {provider === p.name && (
                         <div className="absolute top-2 right-2 text-brand-blue">
                           <CheckCircle size={14} fill="currentColor" className="text-white" />
                         </div>
                       )}
                     </button>
                   ))}
                </div>

                {provider && (
                  <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm animate-in fade-in">
                    <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Numéro de téléphone ({provider})</label>
                    <div className="flex gap-2 mb-4">
                       <div className="bg-gray-100 border border-gray-200 rounded-lg px-3 py-3 flex items-center gap-2 text-sm font-bold text-gray-600">
                         <span className="text-lg">🇹🇬</span> +228
                       </div>
                       <input type="text" placeholder="90 00 00 00" className="flex-1 border border-gray-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-brand-blue outline-none font-bold text-brand-black tracking-wide" />
                    </div>
                    <div className="bg-yellow-50 text-yellow-800 p-3 rounded-lg text-xs flex gap-2">
                       <AlertTriangle size={16} className="shrink-0" />
                       Validez la transaction sur votre téléphone après avoir cliqué sur Payer.
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* --- CARD / PAYPAL VIEW --- */}
            {methodCategory === 'card' && (
              <div className="space-y-6 animate-in slide-in-from-right-4">
                <div className="text-center">
                   <h3 className="font-bold text-xl text-gray-800">Carte & International</h3>
                   <p className="text-sm text-gray-500">Stripe, Visa, Paystack, Flutterwave</p>
                </div>

                <div className="flex gap-4 justify-center">
                   <button 
                     onClick={() => setProvider('stripe')}
                     className={`flex-1 p-4 bg-white border rounded-xl transition-colors text-center group ${provider === 'stripe' ? 'border-brand-blue ring-1 ring-brand-blue' : 'border-gray-200 hover:border-gray-300'}`}
                   >
                      <div className="flex justify-center mb-2 group-hover:scale-105 transition-transform h-6 items-center">
                         <img src={paymentLogos.stripe} className="h-6" alt="Stripe" />
                      </div>
                      <span className="text-xs font-bold text-gray-600">Stripe (CB)</span>
                   </button>
                   <button 
                     onClick={() => setProvider('paystack')}
                     className={`flex-1 p-4 bg-white border rounded-xl transition-colors text-center group ${provider === 'paystack' ? 'border-brand-blue ring-1 ring-brand-blue' : 'border-gray-200 hover:border-gray-300'}`}
                   >
                      <div className="flex justify-center gap-1 mb-2 group-hover:scale-105 transition-transform h-6 items-center">
                        <img src={paymentLogos.paystack} className="h-5" alt="Paystack" />
                      </div>
                      <span className="text-xs font-bold text-gray-600">Paystack</span>
                   </button>
                   <button 
                     onClick={() => setProvider('flutterwave')}
                     className={`flex-1 p-4 bg-white border rounded-xl transition-colors text-center group ${provider === 'flutterwave' ? 'border-brand-blue ring-1 ring-brand-blue' : 'border-gray-200 hover:border-gray-300'}`}
                   >
                      <div className="flex justify-center gap-1 mb-2 group-hover:scale-105 transition-transform h-6 items-center">
                        <img src={paymentLogos.flutterwave} className="h-5" alt="Flutterwave" />
                      </div>
                      <span className="text-xs font-bold text-gray-600">Flutterwave</span>
                   </button>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <div className="space-y-4">
                    <div className="relative">
                      <label className="block text-xs font-bold text-gray-500 mb-1">Numéro de carte</label>
                      <input type="text" placeholder="0000 0000 0000 0000" className="w-full border border-gray-200 rounded-lg p-3 pl-10 text-sm focus:ring-2 focus:ring-brand-blue outline-none font-mono" />
                      <CreditCard className="absolute left-3 top-8 text-gray-400" size={18} />
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <label className="block text-xs font-bold text-gray-500 mb-1">Expiration</label>
                        <input type="text" placeholder="MM/AA" className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-brand-blue outline-none font-mono text-center" />
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs font-bold text-gray-500 mb-1">CVC</label>
                        <div className="relative">
                           <input type="text" placeholder="123" className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-brand-blue outline-none font-mono text-center" />
                           <Lock className="absolute right-3 top-3 text-gray-300" size={14} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* --- CRYPTO VIEW --- */}
            {methodCategory === 'crypto' && (
               <div className="space-y-6 animate-in slide-in-from-right-4">
                 <div className="text-center">
                    <h3 className="font-bold text-xl text-gray-800">Crypto-Paiement</h3>
                    <p className="text-sm text-gray-500">USDT (TRC20) ou Bitcoin</p>
                 </div>
                 
                 <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm text-center">
                    <div className="bg-white p-2 inline-block rounded-xl border-2 border-gray-100 mb-4 shadow-sm">
                       <QrCode size={140} className="text-gray-800" />
                    </div>
                    <p className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Adresse Portefeuille (USDT - TRC20)</p>
                    <div className="flex items-center gap-2 bg-gray-100 p-3 rounded-lg mb-4">
                       <code className="text-xs text-brand-black font-mono break-all flex-1 text-left">TF5...MockAddress...XyZ89</code>
                       <button onClick={() => copyToClipboard('TF5...MockAddress...XyZ89')} className="p-2 hover:bg-gray-200 rounded text-gray-500"><Copy size={16}/></button>
                    </div>
                    <div className="bg-blue-50 text-blue-800 p-3 rounded-lg text-xs">
                       Envoyez exactement <strong>{Math.round(displayAmount).toLocaleString()} {displayCurrency}</strong> équivalent en USDT.
                    </div>
                 </div>
                 
                 <div className="flex justify-center gap-4">
                    <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm">
                       <img src={paymentLogos.usdt} className="w-5 h-5"/> <span className="text-sm font-bold">USDT</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm opacity-50">
                       <img src={paymentLogos.bitcoin} className="w-5 h-5"/> <span className="text-sm font-bold">Bitcoin</span>
                    </div>
                 </div>
               </div>
            )}

            {/* --- BANK VIEW --- */}
            {methodCategory === 'bank' && (
              <div className="space-y-6 animate-in slide-in-from-right-4">
                 <div className="text-center">
                    <h3 className="font-bold text-xl text-gray-800">Virement Bancaire</h3>
                    <p className="text-sm text-gray-500">Les accès sont débloqués après validation du reçu.</p>
                 </div>

                 <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase">Banque</p>
                      <p className="font-bold text-gray-800">Orabank Togo</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase">IBAN / RIB</p>
                      <div className="flex items-center gap-2">
                        <p className="font-mono text-sm bg-gray-50 p-2 rounded flex-1">TG00 0000 0000 0000 0000 00</p>
                        <button onClick={() => copyToClipboard('TG00 0000 0000 0000 0000 00')}><Copy size={16} className="text-gray-400"/></button>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase">Titulaire</p>
                      <p className="font-bold text-gray-800">KADJOLO BASILE ENTERPRISE</p>
                    </div>
                 </div>

                 <button className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-brand-blue hover:text-brand-blue hover:bg-blue-50 transition-colors font-bold text-sm">
                    Téléverser le reçu de virement (Image/PDF)
                 </button>
              </div>
            )}
          </div>

          {/* Checkout Footer */}
          <div className="p-6 border-t border-gray-200 bg-white">
             <button 
               onClick={handlePayment}
               disabled={processing}
               className="w-full bg-brand-blue text-white font-bold py-4 rounded-xl hover:bg-blue-600 transition-all flex justify-center items-center gap-2 shadow-lg shadow-blue-500/20 disabled:opacity-70 disabled:cursor-not-allowed group text-lg"
             >
               {processing ? (
                 <>Traitement en cours...</>
               ) : (
                 <>
                   <Lock size={20} /> Payer {Math.round(displayAmount).toLocaleString()} {displayCurrency}
                 </>
               )}
             </button>
             <div className="flex items-center justify-center gap-4 mt-3 opacity-70 grayscale">
                 <img src={paymentLogos.visa} className="h-3" alt="Visa" />
                 <img src={paymentLogos.mastercard} className="h-3" alt="Mastercard" />
                 <img src={paymentLogos.mtn} className="h-3" alt="MTN" />
                 <BadgeCheck size={14} className="text-green-600" />
                 <span className="text-[10px] text-gray-500 font-bold">SSL SÉCURISÉ</span>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PaymentModal;

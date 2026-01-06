
import React, { useState, useMemo } from 'react';
import { 
  Wallet, ArrowUpRight, History, DollarSign, ArrowDownRight, 
  Clock, CheckCircle, XCircle, AlertCircle, Plus, Smartphone, 
  CreditCard, Globe, Send, TrendingUp, Info, ShieldCheck, ChevronRight
} from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { useUser } from '../../contexts/UserContext';
import { PayoutRequest } from '../../types';

const RevenueManager: React.FC = () => {
  const { user } = useUser();
  const { sales, payouts, requestPayout } = useData();
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawMethod, setWithdrawMethod] = useState<'mobile_money' | 'bank' | 'paypal'>('mobile_money');
  const [withdrawDetails, setWithdrawDetails] = useState('');

  // CALCULS FINANCIERS RÉELS
  const mySales = useMemo(() => sales.filter(s => s.vendorId === user?.id || (user?.isFounder && s.vendorId === 'v1')), [sales, user]);
  const myPayouts = useMemo(() => payouts.filter(p => p.vendorId === user?.id || (user?.isFounder && p.vendorId === 'v1')), [payouts, user]);

  const stats = useMemo(() => {
    const grossTotal = mySales.reduce((acc, s) => acc + s.amount, 0);
    const netTotal = mySales.reduce((acc, s) => acc + s.netEarnings, 0);
    const totalWithdrawn = myPayouts.filter(p => p.status === 'paid').reduce((acc, p) => acc + p.amount, 0);
    const pendingWithdrawal = myPayouts.filter(p => p.status === 'pending' || p.status === 'processing').reduce((acc, p) => acc + p.amount, 0);
    
    // Solde disponible = Revenus nets - (Sommes déjà retirées + Retraits en cours)
    const availableBalance = netTotal - (totalWithdrawn + pendingWithdrawal);
    
    return { netTotal, totalWithdrawn, pendingWithdrawal, availableBalance, grossTotal };
  }, [mySales, myPayouts]);

  const handleWithdrawRequest = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseInt(withdrawAmount);
    
    if (isNaN(amount) || amount <= 0) {
      alert("Veuillez saisir un montant valide.");
      return;
    }
    
    if (amount > stats.availableBalance) {
      alert("Solde insuffisant.");
      return;
    }

    if (amount < 5000) {
      alert("Le montant minimum de retrait est de 5 000 F.");
      return;
    }

    if (!withdrawDetails.trim()) {
      alert("Veuillez fournir les détails de paiement (Numéro, RIB, etc.).");
      return;
    }

    requestPayout(
      user?.id || 'v1',
      user?.name || 'KADJOLO BASILE',
      amount,
      withdrawMethod,
      withdrawDetails
    );

    setWithdrawAmount('');
    setWithdrawDetails('');
    setShowWithdrawModal(false);
    alert("Demande de retrait transmise avec succès !");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid': return <span className="px-3 py-1 bg-green-50 text-green-600 border border-green-100 rounded-full text-[9px] font-black uppercase flex items-center gap-1.5"><CheckCircle size={10}/> Payé</span>;
      case 'pending': return <span className="px-3 py-1 bg-orange-50 text-orange-600 border border-orange-100 rounded-full text-[9px] font-black uppercase flex items-center gap-1.5 animate-pulse"><Clock size={10}/> En attente</span>;
      case 'processing': return <span className="px-3 py-1 bg-blue-50 text-blue-600 border border-blue-100 rounded-full text-[9px] font-black uppercase flex items-center gap-1.5"><History size={10}/> En cours</span>;
      case 'rejected': return <span className="px-3 py-1 bg-red-50 text-red-600 border border-red-100 rounded-full text-[9px] font-black uppercase flex items-center gap-1.5"><XCircle size={10}/> Rejeté</span>;
      default: return null;
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20">
      
      {/* HEADER : BALANCE PRINCIPALE */}
      <div className="bg-brand-black rounded-[40px] p-10 text-white relative overflow-hidden shadow-2xl border border-white/5">
         <div className="relative z-10 grid md:grid-cols-2 gap-10 items-center">
            <div>
               <p className="text-blue-200/50 text-[10px] font-black uppercase tracking-[0.2em] mb-3">Solde Disponible au Retrait</p>
               <h1 className="text-5xl md:text-6xl font-black tracking-tighter italic">{stats.availableBalance.toLocaleString()} <span className="text-2xl not-italic font-medium text-gray-500">FCFA</span></h1>
               <div className="flex flex-wrap gap-4 mt-8">
                  <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/5">
                     <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Revenus Nets Totaux</p>
                     <p className="text-lg font-black">{stats.netTotal.toLocaleString()} F</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/5">
                     <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Sommes Déjà Retirées</p>
                     <p className="text-lg font-black text-green-400">{stats.totalWithdrawn.toLocaleString()} F</p>
                  </div>
               </div>
            </div>
            <div className="flex justify-center md:justify-end">
               <button 
                 onClick={() => setShowWithdrawModal(true)}
                 className="bg-brand-blue text-white px-10 py-5 rounded-[24px] font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-blue-600/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-3 animate-glow-pulse"
               >
                 <ArrowUpRight size={20} /> Effectuer un Retrait
               </button>
            </div>
         </div>
         <div className="absolute -bottom-10 -right-10 opacity-10 transform rotate-12">
            <Wallet size={300} />
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* COLONNE GAUCHE : INFOS & CONSEILS */}
         <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm space-y-6">
               <h3 className="font-black text-gray-900 uppercase tracking-tighter">Répartition de vos revenus</h3>
               <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex justify-between items-center">
                     <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-brand-blue shadow-sm"><TrendingUp size={16}/></div>
                        <span className="text-xs font-bold text-gray-600">Formations</span>
                     </div>
                     <span className="text-sm font-black text-gray-900">85%</span>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex justify-between items-center">
                     <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-brand-green shadow-sm"><DollarSign size={16}/></div>
                        <span className="text-xs font-bold text-gray-600">Ebooks</span>
                     </div>
                     <span className="text-sm font-black text-gray-900">15%</span>
                  </div>
               </div>
               
               <div className="pt-6 border-t border-gray-50">
                  <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100">
                     <div className="flex items-center gap-2 text-brand-blue mb-2">
                        <ShieldCheck size={18} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Paiements Sécurisés</span>
                     </div>
                     <p className="text-[10px] text-blue-700 leading-relaxed font-bold italic">"Les fonds sont décaissés tous les mercredis de chaque semaine après validation de l'administration."</p>
                  </div>
               </div>
            </div>

            <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm text-center">
               <div className="w-12 h-12 bg-gray-50 text-gray-400 rounded-2xl flex items-center justify-center mx-auto mb-4"><Info size={24}/></div>
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Besoin d'aide ?</p>
               <h4 className="font-bold text-gray-900 mb-4">Un problème avec un retrait ?</h4>
               <button className="w-full py-3 bg-gray-100 text-gray-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-200 transition-colors">Contacter la Finance</button>
            </div>
         </div>

         {/* COLONNE DROITE : HISTORIQUE DES RETRAITS */}
         <div className="lg:col-span-2 bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden flex flex-col">
            <div className="p-8 border-b border-gray-50 flex justify-between items-center">
               <div>
                  <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter">Historique des Flux</h3>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Suivi de vos demandes de retrait</p>
               </div>
               <div className="w-10 h-10 bg-gray-50 text-gray-400 rounded-xl flex items-center justify-center"><History size={20}/></div>
            </div>

            <div className="flex-1 overflow-x-auto">
               <table className="w-full text-left">
                  <thead className="bg-gray-50/50 text-[9px] font-black uppercase text-gray-400">
                     <tr>
                        <th className="px-8 py-4">Date</th>
                        <th className="px-8 py-4">ID / Moyen</th>
                        <th className="px-8 py-4">Montant Brut</th>
                        <th className="px-8 py-4">Frais</th>
                        <th className="px-8 py-4">Status</th>
                        <th className="px-8 py-4 text-right">Action</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                     {myPayouts.length > 0 ? myPayouts.map(p => (
                        <tr key={p.id} className="hover:bg-gray-50/50 transition-colors group">
                           <td className="px-8 py-6">
                              <p className="text-xs font-bold text-gray-500">{p.requestDate}</p>
                           </td>
                           <td className="px-8 py-6">
                              <div className="flex items-center gap-3">
                                 {p.method === 'mobile_money' ? <Smartphone size={16} className="text-blue-500" /> : <Globe size={16} className="text-gray-400" />}
                                 <div>
                                    <p className="font-black text-gray-900 text-xs uppercase tracking-tighter">#{p.id.slice(-6)}</p>
                                    <p className="text-[9px] text-gray-400 font-bold uppercase">{p.method}</p>
                                 </div>
                              </div>
                           </td>
                           <td className="px-8 py-6">
                              <p className="font-black text-gray-900 text-sm">{p.amount.toLocaleString()} F</p>
                           </td>
                           <td className="px-8 py-6">
                              <p className="text-[10px] font-bold text-red-400">-{p.feeDeducted} F</p>
                           </td>
                           <td className="px-8 py-6">
                              {getStatusBadge(p.status)}
                           </td>
                           <td className="px-8 py-6 text-right">
                              <button className="p-2 bg-gray-50 text-gray-400 rounded-lg group-hover:bg-white group-hover:text-brand-blue shadow-sm transition-all"><Plus size={14}/></button>
                           </td>
                        </tr>
                     )) : (
                        <tr>
                           <td colSpan={6} className="px-8 py-20 text-center">
                              <div className="flex flex-col items-center gap-4 opacity-20">
                                 <Wallet size={48} />
                                 <p className="italic font-black uppercase text-xs tracking-[0.2em]">Aucun retrait enregistré</p>
                              </div>
                           </td>
                        </tr>
                     )}
                  </tbody>
               </table>
            </div>
         </div>
      </div>

      {/* MODAL DE DEMANDE DE RETRAIT */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in">
           <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="bg-brand-black p-8 text-white flex justify-between items-center">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-brand-blue text-white flex items-center justify-center shadow-lg"><ArrowUpRight size={24}/></div>
                    <div>
                       <h3 className="text-xl font-black uppercase italic tracking-tighter">Demander un Retrait</h3>
                       <p className="text-xs text-blue-200/50 font-black uppercase tracking-widest">Solde Dispo : {stats.availableBalance.toLocaleString()} F</p>
                    </div>
                 </div>
                 <button onClick={() => setShowWithdrawModal(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors"><XCircle size={24}/></button>
              </div>

              <form onSubmit={handleWithdrawRequest} className="p-10 space-y-8">
                 <div className="space-y-4">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Montant à retirer (FCFA)</label>
                    <div className="relative">
                       <input 
                         type="number" 
                         required
                         value={withdrawAmount}
                         onChange={e => setWithdrawAmount(e.target.value)}
                         placeholder="Ex: 50000"
                         className="w-full bg-gray-50 border-none rounded-2xl p-6 text-2xl font-black text-gray-900 outline-none focus:ring-4 focus:ring-brand-blue/10 transition-all" 
                       />
                       <span className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 font-black italic">XOF</span>
                    </div>
                 </div>

                 <div className="space-y-4">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Méthode de réception</label>
                    <div className="grid grid-cols-3 gap-3">
                       <button 
                         type="button"
                         onClick={() => setWithdrawMethod('mobile_money')}
                         className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${withdrawMethod === 'mobile_money' ? 'border-brand-blue bg-blue-50 text-brand-blue shadow-lg' : 'border-gray-50 bg-gray-50 text-gray-400'}`}
                       >
                          <Smartphone size={24} />
                          <span className="text-[9px] font-black uppercase">Mobile Money</span>
                       </button>
                       <button 
                         type="button"
                         onClick={() => setWithdrawMethod('bank')}
                         className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${withdrawMethod === 'bank' ? 'border-brand-blue bg-blue-50 text-brand-blue shadow-lg' : 'border-gray-50 bg-gray-50 text-gray-400'}`}
                       >
                          <CreditCard size={24} />
                          <span className="text-[9px] font-black uppercase">Virement Bancaire</span>
                       </button>
                       <button 
                         type="button"
                         onClick={() => setWithdrawMethod('paypal')}
                         className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${withdrawMethod === 'paypal' ? 'border-brand-blue bg-blue-50 text-brand-blue shadow-lg' : 'border-gray-50 bg-gray-50 text-gray-400'}`}
                       >
                          <Globe size={24} />
                          <span className="text-[9px] font-black uppercase">PayPal</span>
                       </button>
                    </div>
                 </div>

                 <div className="space-y-4">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Détails de paiement</label>
                    <textarea 
                      required
                      value={withdrawDetails}
                      onChange={e => setWithdrawDetails(e.target.value)}
                      placeholder={withdrawMethod === 'mobile_money' ? "Numéro TMoney ou Flooz avec indicatif..." : "Coordonnées bancaires ou Email PayPal..."}
                      className="w-full bg-gray-50 border-none rounded-2xl p-5 text-sm font-bold resize-none outline-none focus:ring-4 focus:ring-brand-blue/10 h-28"
                    />
                 </div>

                 <button 
                   type="submit"
                   className="w-full py-5 bg-brand-black text-white rounded-[24px] font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-black/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                 >
                    <Send size={18} /> Transmettre la demande
                 </button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default RevenueManager;

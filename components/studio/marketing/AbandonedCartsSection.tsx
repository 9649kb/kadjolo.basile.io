import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, ShoppingCart, User, Clock, Mail, 
  Tag, Send, ArrowUpRight, Search, Filter, 
  TrendingUp, AlertCircle, CheckCircle2, Ticket, Settings
} from 'lucide-react';
import { useData } from '../../../contexts/DataContext';

const AbandonedCartsSection: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { sales, courses } = useData();
  const [searchTerm, setSearchTerm] = useState('');

  // Simulation de données de paniers abandonnés basées sur les cours existants
  const abandonedCarts = useMemo(() => [
    { id: 'ab_1', customer: 'Alice M.', email: 'alice@test.com', product: 'Intelligence Financière 101', value: 25000, date: 'Il y a 2h', status: 'pending' },
    { id: 'ab_2', customer: 'Moussa B.', email: 'moussa@k.com', product: 'Mindset de Champion', value: 50000, date: 'Il y a 5h', status: 'recovered' },
    { id: 'ab_3', customer: 'Sarah L.', email: 'sarah@web.fr', product: 'Masterclass Leadership', value: 100000, date: 'Il y a 1j', status: 'pending' },
  ], []);

  const recoveryRate = 24.5;
  const lostRevenue = abandonedCarts.filter(c => c.status === 'pending').reduce((acc, c) => acc + c.value, 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-3 bg-white text-gray-400 rounded-2xl border border-gray-100 shadow-sm hover:text-gray-900 transition-all">
            <ChevronLeft size={20}/>
          </button>
          <div>
            <h2 className="text-3xl font-black text-gray-900 uppercase italic tracking-tighter leading-none">Paniers Abandonnés</h2>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2">Récupérez votre chiffre d'affaires perdu</p>
          </div>
        </div>

        <div className="flex gap-4">
           <div className="bg-white px-6 py-3 rounded-2xl border border-gray-100 shadow-sm">
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Revenu Récupérable</p>
              <p className="text-xl font-black text-orange-600">{lostRevenue.toLocaleString()} F</p>
           </div>
           <div className="bg-brand-black text-white px-6 py-3 rounded-2xl shadow-xl">
              <p className="text-[9px] font-black text-blue-200/50 uppercase tracking-widest">Taux de Relance</p>
              <p className="text-xl font-black">{recoveryRate}%</p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         <div className="lg:col-span-8 space-y-4">
            <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
               <Search className="text-gray-300 ml-2" size={20} />
               <input 
                 value={searchTerm}
                 onChange={e => setSearchTerm(e.target.value)}
                 className="flex-1 bg-transparent border-none font-bold text-sm outline-none"
                 placeholder="Rechercher un client..."
               />
               <button className="p-2 bg-gray-50 text-gray-400 rounded-xl hover:bg-brand-blue hover:text-white transition-all"><Filter size={18}/></button>
            </div>

            <div className="space-y-4">
               {abandonedCarts.map(cart => (
                 <div key={cart.id} className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row justify-between items-center gap-6 group">
                    <div className="flex items-center gap-4 flex-1">
                       <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${cart.status === 'recovered' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600 animate-pulse'}`}>
                          <ShoppingCart size={24} />
                       </div>
                       <div>
                          <h4 className="font-black text-gray-900 uppercase text-sm tracking-tight">{cart.customer}</h4>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{cart.email}</p>
                       </div>
                    </div>

                    <div className="flex flex-col items-center md:items-start flex-1">
                       <p className="text-xs font-bold text-gray-700 line-clamp-1">{cart.product}</p>
                       <p className="text-[10px] font-black text-brand-blue uppercase">{cart.value.toLocaleString()} F</p>
                    </div>

                    <div className="text-center md:text-right flex-1">
                       <p className="text-[10px] font-black text-gray-400 uppercase flex items-center justify-center md:justify-end gap-1">
                         <Clock size={10}/> {cart.date}
                       </p>
                       <p className={`text-[9px] font-black uppercase mt-1 ${cart.status === 'recovered' ? 'text-green-600' : 'text-orange-500'}`}>
                         {cart.status === 'recovered' ? 'Vente Récupérée' : 'Paiement Incomplet'}
                       </p>
                    </div>

                    <div className="flex gap-2">
                       {cart.status === 'pending' ? (
                          <button className="bg-brand-black text-white px-6 py-3 rounded-2xl font-black text-[9px] uppercase tracking-widest flex items-center gap-2 hover:bg-brand-blue transition-all shadow-lg group-hover:scale-105">
                             <Send size={14}/> Relancer avec Coupon
                          </button>
                       ) : (
                          <div className="bg-green-50 text-green-600 p-3 rounded-xl"><CheckCircle2 size={24}/></div>
                       )}
                    </div>
                 </div>
               ))}
            </div>
         </div>

         <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm space-y-8">
               <h3 className="font-black text-gray-900 uppercase tracking-tight flex items-center gap-2">
                 <AlertCircle className="text-orange-500" size={20} /> Stratégie Automatique
               </h3>
               
               <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                     <div>
                        <p className="text-xs font-black uppercase">Relance à H+1</p>
                        <p className="text-[9px] text-gray-400 font-bold uppercase">Rappel simple par email</p>
                     </div>
                     <button className="text-brand-blue"><CheckCircle2 size={24}/></button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-2xl border border-blue-100">
                     <div>
                        <p className="text-xs font-black uppercase text-brand-blue">Relance à H+24</p>
                        <p className="text-[9px] text-brand-blue/60 font-bold uppercase italic">+ Offre -10% personnalisée</p>
                     </div>
                     <button className="text-brand-blue"><CheckCircle2 size={24}/></button>
                  </div>
               </div>

               <div className="pt-8 border-t border-gray-50">
                  <button className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2">
                     {/* Added missing Settings icon import above */}
                     <Settings size={16}/> Configurer les Emails
                  </button>
               </div>
            </div>

            <div className="bg-brand-blue p-8 rounded-[40px] text-white relative overflow-hidden shadow-2xl">
               <div className="relative z-10">
                  <Ticket size={48} className="mb-6 opacity-50" />
                  <h4 className="text-xl font-black italic tracking-tighter uppercase mb-2">Automate Coupon</h4>
                  <p className="text-blue-100 text-xs font-medium leading-relaxed mb-6">
                    Le système génère automatiquement un code promo unique de 24h dès qu'un panier est abandonné depuis plus de 6 heures.
                  </p>
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-white/10 w-fit px-3 py-1 rounded-full">
                     Actif • Efficacité +12%
                  </div>
               </div>
               <TrendingUp className="absolute -bottom-6 -right-6 text-white opacity-10" size={180} />
            </div>
         </div>
      </div>
    </div>
  );
};

export default AbandonedCartsSection;
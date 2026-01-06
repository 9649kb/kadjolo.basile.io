
import React, { useMemo } from 'react';
import { 
  TrendingUp, ShoppingBag, Package, Users, 
  Plus, Eye, Wand2, ArrowUpRight, CheckCircle, 
  Clock, Zap, MousePointer2, Percent
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer 
} from 'recharts';
import { Course, Sale } from '../../types';

interface DashboardOverviewProps {
  sales: Sale[];
  courses: Course[];
  commissionRate: number; // Nouveau: Taux défini par le fondateur
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({ sales, courses, commissionRate }) => {
  // Calculs des statistiques réelles
  const totalNetRevenue = useMemo(() => sales.reduce((acc, s) => acc + s.netEarnings, 0), [sales]);
  const totalCommissionPaid = useMemo(() => sales.reduce((acc, s) => acc + s.platformFee, 0), [sales]);
  const activeProducts = useMemo(() => courses.filter(c => c.status === 'published').length, [courses]);
  
  // Données pour le graphique
  const chartData = [
    { name: 'Jan', net: 45000 },
    { name: 'Fév', net: 52000 },
    { name: 'Mar', net: 48000 },
    { name: 'Avr', net: 61000 },
    { name: 'Mai', net: 55000 },
    { name: 'Juin', net: totalNetRevenue > 0 ? totalNetRevenue : 75000 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      
      {/* SECTION 1: CARTES DE STATISTIQUES ÉLITE */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* REVENU NET */}
        <div className="bg-brand-black text-white p-6 rounded-[32px] shadow-2xl relative overflow-hidden group border border-white/5">
          <div className="relative z-10">
            <p className="text-blue-200/50 text-[10px] font-black uppercase tracking-widest mb-1">Votre Revenu Net</p>
            <h3 className="text-3xl font-black tracking-tighter">{totalNetRevenue.toLocaleString()} F</h3>
            <div className="mt-4 flex items-center gap-1 text-green-400 text-[10px] font-bold uppercase tracking-widest bg-white/5 w-fit px-2 py-1 rounded-lg">
              <ArrowUpRight size={14} /> +12.5% croissance
            </div>
          </div>
          <div className="absolute -bottom-4 -right-4 text-blue-500/10 group-hover:scale-110 transition-transform duration-500">
            <TrendingUp size={120} />
          </div>
        </div>

        {/* COMMISSION FONDATEUR (DYNAMIQUE) */}
        <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-md transition-all group">
          <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Percent size={20} />
          </div>
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">Commissions Fondateur</p>
          <h3 className="text-2xl font-black text-gray-900">{totalCommissionPaid.toLocaleString()} F</h3>
          <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 bg-orange-50 text-orange-600 rounded text-[9px] font-black uppercase tracking-widest border border-orange-100">
             Prélèvement auto. {commissionRate}%
          </div>
        </div>

        <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-md transition-all group">
          <div className="w-10 h-10 bg-blue-50 text-brand-blue rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <ShoppingBag size={20} />
          </div>
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">Commandes Totales</p>
          <h3 className="text-3xl font-black text-gray-900">{sales.length}</h3>
          <p className="mt-2 text-[10px] text-gray-400 font-bold uppercase tracking-widest">Toutes périodes</p>
        </div>

        <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-md transition-all group">
          <div className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Package size={20} />
          </div>
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">Catalogue Actif</p>
          <h3 className="text-3xl font-black text-gray-900">{activeProducts}</h3>
          <p className="mt-2 text-[10px] text-gray-400 font-bold uppercase tracking-widest">Sur {courses.length} produits</p>
        </div>
      </div>

      {/* SECTION 2: GRAPHIQUE & ACTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h4 className="font-black text-gray-900 uppercase tracking-tight">Analyse de Performance</h4>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Évolution de votre revenu net</p>
            </div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorNet" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold', fill: '#94a3b8'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold', fill: '#94a3b8'}} tickFormatter={(val) => `${val/1000}k`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', padding: '20px' }}
                  labelStyle={{ fontWeight: 'black', textTransform: 'uppercase', fontSize: '10px', color: '#94a3b8', marginBottom: '8px' }}
                />
                <Area type="monotone" dataKey="net" stroke="#2563eb" strokeWidth={4} fillOpacity={1} fill="url(#colorNet)" animationDuration={1500} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
             <h4 className="font-black text-gray-900 uppercase tracking-tight mb-6">Actions Rapides</h4>
             <div className="grid grid-cols-1 gap-3">
                <button className="flex items-center gap-4 p-4 bg-blue-50 text-brand-blue rounded-2xl hover:bg-brand-blue hover:text-white transition-all group">
                   <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform"><Plus size={20} /></div>
                   <span className="text-xs font-black uppercase tracking-widest">Nouveau Produit</span>
                </button>
                <button className="flex items-center gap-4 p-4 bg-gray-50 text-gray-600 rounded-2xl hover:bg-brand-black hover:text-white transition-all group">
                   <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform"><Eye size={20} /></div>
                   <span className="text-xs font-black uppercase tracking-widest">Ma Boutique</span>
                </button>
                <button className="flex items-center gap-4 p-4 bg-purple-50 text-purple-600 rounded-2xl hover:bg-purple-600 hover:text-white transition-all group">
                   <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform"><Wand2 size={20} /></div>
                   <span className="text-xs font-black uppercase tracking-widest">Idée IA Vente</span>
                </button>
             </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: VENTES RÉCENTES */}
      <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
         <div className="flex justify-between items-center mb-8">
            <h4 className="font-black text-gray-900 uppercase tracking-tight">Ventes Récentes</h4>
            <button className="text-[10px] font-black text-brand-blue uppercase tracking-widest border-b-2 border-brand-blue">Tout voir</button>
         </div>
         <div className="space-y-4">
            {sales.length > 0 ? sales.slice(0, 3).map((sale) => (
               <div key={sale.id} className="flex flex-col md:flex-row md:items-center justify-between p-5 bg-gray-50 rounded-2xl hover:bg-blue-50 transition-all border border-transparent hover:border-blue-100">
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm text-brand-blue font-black italic">{sale.studentName.charAt(0)}</div>
                     <div>
                        <p className="text-sm font-black text-gray-900 tracking-tight uppercase leading-none mb-1">{sale.studentName}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest line-clamp-1">Produit : {sale.courseTitle}</p>
                     </div>
                  </div>
                  <div className="text-right">
                     <p className="text-sm font-black text-brand-blue leading-none mb-1">+{sale.netEarnings.toLocaleString()} F</p>
                     <p className="text-[9px] text-orange-400 font-black uppercase tracking-widest">Calcul auto. -{commissionRate}%</p>
                  </div>
               </div>
            )) : (
               <div className="text-center py-20 italic text-gray-300 font-bold uppercase tracking-widest text-xs border-2 border-dashed border-gray-100 rounded-[32px]">
                  En attente de votre première vente...
               </div>
            )}
         </div>
      </div>
    </div>
  );
};

export default DashboardOverview;

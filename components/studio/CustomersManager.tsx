
import React, { useMemo, useState } from 'react';
import { 
  Users, Search, Download, Mail, ExternalLink, 
  UserCheck, Award, TrendingUp, Filter, X, 
  ChevronDown, MessageSquare, History, ShoppingBag
} from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { Sale } from '../../types';

const CustomersManager: React.FC = () => {
  const { sales, enrollments, courses } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);

  // LOGIQUE DE RECONSTRUCTION DE LA BASE CLIENTS DEPUIS LES VENTES
  const customers = useMemo(() => {
    const customerMap = new Map<string, {
      name: string;
      email: string;
      totalSpent: number;
      ordersCount: number;
      lastPurchase: string;
      purchasedProducts: string[];
    }>();

    sales.forEach(sale => {
      const existing = customerMap.get(sale.studentName) || {
        name: sale.studentName,
        email: sale.studentEmail || `${sale.studentName.toLowerCase().replace(' ', '.')}@example.com`,
        totalSpent: 0,
        ordersCount: 0,
        lastPurchase: sale.date,
        purchasedProducts: []
      };

      existing.totalSpent += sale.amount;
      existing.ordersCount += 1;
      if (new Date(sale.date) > new Date(existing.lastPurchase)) {
        existing.lastPurchase = sale.date;
      }
      if (!existing.purchasedProducts.includes(sale.courseTitle)) {
        existing.purchasedProducts.push(sale.courseTitle);
      }

      customerMap.set(sale.studentName, existing);
    });

    return Array.from(customerMap.values());
  }, [sales]);

  const filteredCustomers = useMemo(() => {
    return customers.filter(c => 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      c.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [customers, searchTerm]);

  const stats = useMemo(() => {
    const total = customers.length;
    const avgLTV = total > 0 ? customers.reduce((acc, c) => acc + c.totalSpent, 0) / total : 0;
    const repeatRate = total > 0 ? (customers.filter(c => c.ordersCount > 1).length / total) * 100 : 0;
    return { total, avgLTV, repeatRate };
  }, [customers]);

  const handleExportCSV = () => {
    if (filteredCustomers.length === 0) return;
    const headers = ["Nom", "Email", "Total Dépensé", "Nombre Commandes", "Dernier Achat"];
    const rows = filteredCustomers.map(c => [c.name, c.email, c.totalSpent, c.ordersCount, c.lastPurchase]);
    const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `clients_kadjolo_${new Date().toISOString().split('T')[0]}.csv`);
    link.click();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* SECTION 1: STATS CLIENTS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 bg-blue-50 text-brand-blue rounded-xl flex items-center justify-center">
              <Users size={20} />
            </div>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Base Élèves</span>
          </div>
          <h3 className="text-2xl font-black text-gray-900">{stats.total} Clients</h3>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Utilisateurs uniques</p>
        </div>

        <div className="bg-brand-black text-white p-6 rounded-[32px] shadow-xl relative overflow-hidden group">
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 bg-white/10 text-white rounded-xl flex items-center justify-center">
                <TrendingUp size={20} />
              </div>
              <span className="text-[10px] font-black text-blue-200/50 uppercase tracking-widest">Valeur Client (LTV)</span>
            </div>
            <h3 className="text-2xl font-black">{Math.round(stats.avgLTV).toLocaleString()} F</h3>
            <p className="text-[10px] text-blue-300 font-black uppercase tracking-widest mt-1">Dépense moyenne par élève</p>
          </div>
          <div className="absolute -bottom-4 -right-4 text-white/5 transform rotate-12 group-hover:scale-110 transition-transform">
            <UserCheck size={100} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
              <Award size={20} />
            </div>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Fidélisation</span>
          </div>
          <h3 className="text-2xl font-black text-gray-900">{Math.round(stats.repeatRate)}%</h3>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Clients récurrents (2+ achats)</p>
        </div>
      </div>

      {/* SECTION 2: BARRE DE RECHERCHE & ACTIONS */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-2xl outline-none font-bold text-sm focus:ring-2 focus:ring-brand-blue/10 transition-all" 
            placeholder="Filtrer par nom ou email..." 
          />
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleExportCSV}
            className="bg-brand-black text-white px-6 py-3 rounded-2xl flex items-center gap-2 font-black text-[10px] uppercase tracking-widest shadow-lg hover:bg-gray-800 transition-all"
          >
            <Download size={16} /> Exporter Liste
          </button>
        </div>
      </div>

      {/* SECTION 3: TABLEAU DES CLIENTS */}
      <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50/50 text-[10px] font-black uppercase text-gray-400 border-b border-gray-100">
              <tr>
                <th className="px-8 py-6">Élève</th>
                <th className="px-8 py-6">Email</th>
                <th className="px-8 py-6">Dernier Achat</th>
                <th className="px-8 py-6">Achats</th>
                <th className="px-8 py-6 text-right">Valeur Totale</th>
                <th className="px-8 py-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredCustomers.length > 0 ? filteredCustomers.map(client => (
                <tr key={client.email} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-[10px] font-black text-gray-400 group-hover:bg-white transition-colors">
                        {client.name.charAt(0)}
                      </div>
                      <p className="font-bold text-gray-900 text-sm">{client.name}</p>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-gray-500 text-xs font-medium">{client.email}</p>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">{client.lastPurchase}</p>
                  </td>
                  <td className="px-8 py-6">
                    <span className="bg-blue-50 text-brand-blue px-3 py-1 rounded-full text-[9px] font-black uppercase border border-blue-100">
                      {client.ordersCount} {client.ordersCount > 1 ? 'Commandes' : 'Commande'}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <p className="font-black text-gray-900 text-sm">{client.totalSpent.toLocaleString()} F</p>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                       <button 
                         onClick={() => setSelectedCustomer(client.name)}
                         className="p-2 bg-gray-50 text-gray-400 hover:text-brand-blue hover:bg-white rounded-lg transition-all shadow-sm"
                         title="Détails"
                       >
                         <History size={16} />
                       </button>
                       <a 
                         href={`mailto:${client.email}`}
                         className="p-2 bg-gray-50 text-gray-400 hover:text-brand-green hover:bg-white rounded-lg transition-all shadow-sm"
                         title="Contacter"
                       >
                         <Mail size={16} />
                       </a>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="px-8 py-32 text-center">
                    <div className="flex flex-col items-center gap-4 opacity-20">
                      <Users size={64} />
                      <p className="italic font-black uppercase text-xs tracking-[0.2em]">Aucun élève dans votre base pour le moment</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAIL MODAL (SIMULÉ) */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95">
             <div className="bg-brand-black p-8 text-white flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center text-2xl font-black italic">{selectedCustomer.charAt(0)}</div>
                  <div>
                    <h3 className="text-2xl font-black uppercase italic tracking-tighter">{selectedCustomer}</h3>
                    <p className="text-xs text-blue-200/50 font-black uppercase tracking-widest">Fiche Client Détaillée</p>
                  </div>
                </div>
                <button onClick={() => setSelectedCustomer(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X size={24}/></button>
             </div>
             
             <div className="p-10 space-y-8">
                <div>
                   <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Produits Possédés</h4>
                   <div className="grid gap-3">
                      {customers.find(c => c.name === selectedCustomer)?.purchasedProducts.map((p, idx) => (
                        <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                           <div className="flex items-center gap-3">
                             <div className="p-2 bg-white rounded-xl text-brand-blue shadow-sm"><ShoppingBag size={16}/></div>
                             <span className="font-bold text-gray-800 text-sm">{p}</span>
                           </div>
                           <span className="text-[9px] font-black text-green-600 uppercase tracking-widest bg-green-50 px-2 py-1 rounded border border-green-100">Accès à vie</span>
                        </div>
                      ))}
                   </div>
                </div>

                <div className="flex gap-4">
                   <button className="flex-1 py-4 bg-brand-blue text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:scale-[1.02] transition-transform flex items-center justify-center gap-2">
                     <MessageSquare size={16}/> Envoyer un message
                   </button>
                   <button className="flex-1 py-4 bg-gray-100 text-gray-500 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-gray-200 transition-colors">
                     Voir historique complet
                   </button>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomersManager;

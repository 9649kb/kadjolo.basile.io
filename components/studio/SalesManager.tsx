
import React, { useMemo, useState } from 'react';
import { 
  ShoppingBag, Search, Filter, Download, ArrowUpRight, 
  CreditCard, Calendar, User, Tag, CheckCircle2, Clock, 
  AlertCircle, DollarSign, Percent, TrendingUp, X, ChevronDown
} from 'lucide-react';
import { Sale } from '../../types';

interface SalesManagerProps {
  sales: Sale[];
  commissionRate: number;
}

const SalesManager: React.FC<SalesManagerProps> = ({ sales, commissionRate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Calculs financiers dynamiques basés sur la liste filtrée (optionnel, mais plus précis)
  const stats = useMemo(() => {
    const gross = sales.reduce((acc, s) => acc + s.amount, 0);
    const net = sales.reduce((acc, s) => acc + s.netEarnings, 0);
    const platform = sales.reduce((acc, s) => acc + s.platformFee, 0);
    return { gross, net, platform };
  }, [sales]);

  // LOGIQUE DE FILTRAGE COMBINÉE
  const filteredSales = useMemo(() => {
    return sales.filter(s => {
      const matchesSearch = 
        s.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.courseTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.id.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [sales, searchTerm, statusFilter]);

  // FONCTION D'EXPORT CSV
  const handleExportCSV = () => {
    if (filteredSales.length === 0) return;

    const headers = ["ID Transaction", "Date", "Client", "Produit", "Montant Brut", "Com. Plateforme", "Net Vendeur", "Statut", "Méthode"];
    const rows = filteredSales.map(s => [
      s.id,
      s.date,
      s.studentName,
      `"${s.courseTitle.replace(/"/g, '""')}"`, // Escape quotes
      s.amount,
      s.platformFee,
      s.netEarnings,
      s.status,
      s.paymentMethod
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(e => e.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `ventes_kadjolo_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-50 text-green-600 border-green-100';
      case 'pending': return 'bg-orange-50 text-orange-600 border-orange-100';
      case 'refunded': return 'bg-red-50 text-red-600 border-red-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* SECTION 1: RÉSUMÉ FINANCIER */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 bg-blue-50 text-brand-blue rounded-xl flex items-center justify-center">
              <ShoppingBag size={20} />
            </div>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Brut</span>
          </div>
          <h3 className="text-2xl font-black text-gray-900">{stats.gross.toLocaleString()} F</h3>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Chiffre d'affaires total</p>
        </div>

        <div className="bg-brand-black text-white p-6 rounded-[32px] shadow-xl relative overflow-hidden group">
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 bg-white/10 text-white rounded-xl flex items-center justify-center">
                <DollarSign size={20} />
              </div>
              <span className="text-[10px] font-black text-blue-200/50 uppercase tracking-widest">Votre Revenu Net</span>
            </div>
            <h3 className="text-2xl font-black">{stats.net.toLocaleString()} F</h3>
            <div className="mt-2 flex items-center gap-1 text-green-400 text-[10px] font-black uppercase">
              <CheckCircle2 size={12} /> Prêt pour retrait
            </div>
          </div>
          <div className="absolute -bottom-4 -right-4 text-white/5 transform rotate-12 group-hover:scale-110 transition-transform">
            <TrendingUp size={100} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center">
              <Percent size={20} />
            </div>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Commissions</span>
          </div>
          <h3 className="text-2xl font-black text-gray-900">{stats.platform.toLocaleString()} F</h3>
          <p className="text-[9px] text-orange-500 font-black uppercase tracking-widest mt-1 italic">Taux plateforme : {commissionRate}%</p>
        </div>
      </div>

      {/* SECTION 2: FILTRES ET ACTIONS RÉELLES */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-2xl outline-none font-bold text-sm focus:ring-2 focus:ring-brand-blue/10 transition-all" 
            placeholder="Rechercher un client, un produit ou une transaction..." 
          />
        </div>
        <div className="flex gap-2">
          {/* FILTRE PAR STATUT FONCTIONNEL */}
          <div className="relative group">
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none bg-white px-6 py-3 pr-12 rounded-2xl border border-gray-100 font-black text-[10px] uppercase tracking-widest text-gray-500 hover:bg-gray-50 transition-colors shadow-sm outline-none cursor-pointer"
            >
              <option value="all">Tous les Statuts</option>
              <option value="completed">Succès</option>
              <option value="pending">En attente</option>
              <option value="refunded">Remboursé</option>
            </select>
            <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

          {/* EXPORT FONCTIONNEL */}
          <button 
            onClick={handleExportCSV}
            disabled={filteredSales.length === 0}
            className="bg-brand-black text-white px-6 py-3 rounded-2xl flex items-center gap-2 font-black text-[10px] uppercase tracking-widest shadow-lg hover:bg-gray-800 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Download size={16} /> Exporter CSV
          </button>
        </div>
      </div>

      {/* INDICATEUR DE FILTRE ACTIF */}
      {(statusFilter !== 'all' || searchTerm) && (
        <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-2">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Résultats : <span className="text-brand-blue">{filteredSales.length}</span></p>
          <button 
            onClick={() => { setStatusFilter('all'); setSearchTerm(''); }}
            className="flex items-center gap-1 text-[9px] font-black text-red-500 uppercase tracking-tighter hover:underline"
          >
            <X size={10} /> Réinitialiser
          </button>
        </div>
      )}

      {/* SECTION 3: TABLEAU DES VENTES */}
      <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50/50 text-[10px] font-black uppercase text-gray-400 border-b border-gray-100">
              <tr>
                <th className="px-8 py-6">Transaction</th>
                <th className="px-8 py-6">Client</th>
                <th className="px-8 py-6">Produit</th>
                <th className="px-8 py-6">Paiement</th>
                <th className="px-8 py-6">Status</th>
                <th className="px-8 py-6 text-right">Net Vendeur</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredSales.length > 0 ? filteredSales.map(sale => (
                <tr key={sale.id} className="hover:bg-blue-50/30 transition-colors group cursor-pointer">
                  <td className="px-8 py-6">
                    <p className="font-black text-gray-900 text-xs uppercase tracking-tighter">#{sale.id.slice(-6)}</p>
                    <p className="text-[10px] text-gray-400 font-bold flex items-center gap-1 mt-1">
                      <Calendar size={10} /> {sale.date}
                    </p>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-[10px] font-black text-gray-400 group-hover:bg-white transition-colors">
                        {sale.studentName.charAt(0)}
                      </div>
                      <p className="font-bold text-gray-900 text-sm">{sale.studentName}</p>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-gray-600 text-sm font-medium line-clamp-1 italic max-w-[200px]">{sale.courseTitle}</p>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-500">
                      <CreditCard size={14} className="text-blue-400" /> {sale.paymentMethod}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase border ${getStatusStyle(sale.status)}`}>
                      {sale.status === 'completed' ? 'Succès' : sale.status === 'pending' ? 'En attente' : sale.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <p className="font-black text-brand-blue text-sm">+{sale.netEarnings.toLocaleString()} F</p>
                    <p className="text-[9px] text-orange-400 font-bold uppercase tracking-widest mt-1">Com. plateforme: -{sale.platformFee} F</p>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="px-8 py-32 text-center">
                    <div className="flex flex-col items-center gap-4 opacity-30">
                      <ShoppingBag size={64} />
                      <p className="italic font-black uppercase text-xs tracking-[0.2em]">Aucune transaction ne correspond à vos critères</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* FOOTER INFO: RAPPEL COMMISSION */}
      <div className="bg-blue-50 border border-blue-100 rounded-3xl p-6 flex items-center gap-4">
        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-brand-blue shadow-sm shrink-0">
          <AlertCircle size={24} />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-black text-blue-900 uppercase tracking-tight">Exportation des Données Comptables</h4>
          <p className="text-xs text-blue-700 leading-relaxed">
            Utilisez le bouton "Exporter CSV" pour générer un relevé complet de vos ventes. Le fichier inclut le détail brut, les commissions de {commissionRate}% prélevées par <strong>KADJOLO BASILE</strong> et votre revenu net final.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SalesManager;

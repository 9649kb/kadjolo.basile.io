import React, { useState } from 'react';
import { 
  LayoutDashboard, Package, Users, MessageSquare, Wallet, Settings, 
  Plus, Search, Bell, Menu, X, Upload, Video, FileText, Link as LinkIcon, 
  TrendingUp, ArrowUpRight, DollarSign, Calendar, Filter, MoreHorizontal,
  Mic, Send, Image as ImageIcon, CheckCircle, ChevronRight, ChevronDown,
  Shield, AlertTriangle, Eye, Globe, Lock, Smartphone, Trash2, Edit, Radio, Heart, 
  Download, PieChart as PieChartIcon, Ban, Unlock, Share2, Store, UserPlus, CheckSquare, Crown,
  Sparkles, Wand2, Loader2, CreditCard, Bitcoin, Landmark, QrCode, MousePointer, Copy, RefreshCw, Palette,
  Zap, Megaphone, FileBox, RefreshCcw, Clock
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { currentUser, salesHistory, creatorStats, adminGlobalStats, supportTickets, courses as initialCourses, vendorProfiles, payoutRequests, systemAdmins, mockAffiliateLinks, mockMarketingAssets } from '../services/mockData';
import { Course, Module, Lesson, VendorProfile, User, AdminPermission, VendorPaymentConfig, PayoutRequest, VendorThemeConfig, AffiliateLink, Sale } from '../types';
import { getAISuggestions } from '../services/geminiService';
import SocialShare from '../components/SocialShare';

// Mock Chart Data
const salesData = [
  { name: 'Lun', sales: 4000, clicks: 120 },
  { name: 'Mar', sales: 3000, clicks: 90 },
  { name: 'Mer', sales: 2000, clicks: 80 },
  { name: 'Jeu', sales: 2780, clicks: 110 },
  { name: 'Ven', sales: 1890, clicks: 130 },
  { name: 'Sam', sales: 2390, clicks: 150 },
  { name: 'Dim', sales: 3490, clicks: 170 },
];

const trafficData = [
  { name: 'Facebook Ads', value: 45, color: '#1877F2' },
  { name: 'TikTok', value: 25, color: '#000000' },
  { name: 'Google', value: 20, color: '#DB4437' },
  { name: 'Direct', value: 10, color: '#16a34a' },
];

const CreatorStudio: React.FC = () => {
  const isAdmin = currentUser.role === 'admin';
  const [activeView, setActiveView] = useState<'dashboard' | 'affiliate_links' | 'sales' | 'finance' | 'marketing_assets' | 'settings' | 'admin_vendors' | 'admin_team'>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  
  // Data State
  const [myCourses, setMyCourses] = useState<Course[]>(initialCourses);
  const [affiliateLinks, setAffiliateLinks] = useState<AffiliateLink[]>(mockAffiliateLinks);
  const [allVendors, setAllVendors] = useState<VendorProfile[]>(vendorProfiles);
  const [admins, setAdmins] = useState<User[]>(systemAdmins);
  const [payouts, setPayouts] = useState<PayoutRequest[]>(payoutRequests);
  
  // Sharing State
  const [shareData, setShareData] = useState<{url: string, title: string, subtitle?: string} | null>(null);

  // --- PERMISSION CHECKER ---
  const hasPermission = (permission: AdminPermission): boolean => {
    // Founders have all access
    if (currentUser.isFounder) return true;
    // Check specific permission
    return currentUser.permissions ? currentUser.permissions.includes(permission) : false;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copié dans le presse-papier !");
  };

  // --- SUB-COMPONENTS ---

  const SidebarItem = ({ view, icon, label }: { view: string, icon: React.ReactNode, label: string }) => (
    <button 
      onClick={() => { setActiveView(view as any); setIsSidebarOpen(false); }}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-1 transition-all ${
        activeView === view 
          ? 'bg-brand-blue text-white shadow-lg shadow-blue-500/20 font-bold' 
          : 'text-gray-500 hover:bg-gray-50 hover:text-brand-black'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );

  const StatCard = ({ title, value, subtext, icon, color }: any) => (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
      <div className={`absolute top-0 right-0 p-4 opacity-10 transform scale-150 group-hover:scale-125 transition-transform ${color.replace('bg-', 'text-')}`}>
        {icon}
      </div>
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className={`p-3 rounded-xl ${color}`}>
          {icon}
        </div>
      </div>
      <h3 className="text-gray-500 text-sm font-medium mb-1 relative z-10">{title}</h3>
      <p className="text-2xl font-bold text-brand-black relative z-10">{value}</p>
      {subtext && <p className="text-xs text-gray-400 mt-2 relative z-10">{subtext}</p>}
    </div>
  );

  // --- VIEW: DASHBOARD (HOME) ---
  const DashboardView = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Welcome Banner */}
      <div className="bg-brand-black text-white p-8 rounded-2xl relative overflow-hidden shadow-2xl">
         <div className="relative z-10">
            <h1 className="text-3xl font-serif font-bold mb-2">Bonjour, {currentUser.name.split(' ')[0]} 👋</h1>
            <p className="text-gray-400 mb-6 max-w-xl">Voici vos performances d'affiliation et de vente en temps réel. Continuez à partager vos liens pour maximiser vos gains.</p>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => setActiveView('affiliate_links')}
                className="bg-brand-blue text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-600 transition-colors flex items-center gap-2 shadow-lg shadow-blue-900/50"
              >
                <LinkIcon size={18} /> Copier mon lien Affilié
              </button>
              <button 
                onClick={() => setActiveView('marketing_assets')}
                className="bg-white/10 text-white px-6 py-3 rounded-xl font-bold hover:bg-white/20 transition-colors flex items-center gap-2"
              >
                <Zap size={18} /> Créer une Publicité
              </button>
            </div>
         </div>
         <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-brand-blue/20 to-transparent"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Ventes Totales" 
          value={creatorStats.totalSales.toLocaleString()} 
          subtext="+12% cette semaine"
          icon={<Package size={24} className="text-brand-blue" />} 
          color="bg-blue-50" 
        />
        <StatCard 
          title="Clics Totaux" 
          value={creatorStats.totalClicks?.toLocaleString()} 
          subtext="Trafic généré"
          icon={<MousePointer size={24} className="text-purple-600" />} 
          color="bg-purple-50" 
        />
        <StatCard 
          title="Commissions" 
          value={`${creatorStats.revenue.toLocaleString()} F`} 
          subtext="Gains validés"
          icon={<Wallet size={24} className="text-green-600" />} 
          color="bg-green-50" 
        />
        <StatCard 
          title="Paiements en Attente" 
          value={`${(creatorStats.revenue * 0.15).toLocaleString()} F`} 
          subtext="Prochain virement auto"
          icon={<RefreshCw size={24} className="text-orange-600" />} 
          color="bg-orange-50" 
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="font-bold mb-6 flex items-center gap-2"><TrendingUp size={20} className="text-brand-blue"/> Performances (Ventes vs Clics)</h3>
          <div className="h-72">
             <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={salesData}>
                 <defs>
                   <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8}/>
                     <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                   </linearGradient>
                   <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#9333ea" stopOpacity={0.8}/>
                     <stop offset="95%" stopColor="#9333ea" stopOpacity={0}/>
                   </linearGradient>
                 </defs>
                 <XAxis dataKey="name" axisLine={false} tickLine={false} />
                 <YAxis axisLine={false} tickLine={false} />
                 <CartesianGrid vertical={false} stroke="#f0f0f0" />
                 <Tooltip />
                 <Area type="monotone" dataKey="sales" stroke="#2563eb" fillOpacity={1} fill="url(#colorSales)" />
                 <Area type="monotone" dataKey="clicks" stroke="#9333ea" fillOpacity={1} fill="url(#colorClicks)" />
               </AreaChart>
             </ResponsiveContainer>
          </div>
        </div>
        
        {/* Quick Recap Table */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
           <h3 className="font-bold mb-4">Dernières Ventes</h3>
           <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3">
             {salesHistory.slice(0, 5).map(sale => (
               <div key={sale.id} className="flex justify-between items-center text-sm border-b border-gray-50 pb-2">
                 <div>
                   <p className="font-bold text-gray-800">{sale.courseTitle}</p>
                   <p className="text-xs text-gray-500">{sale.studentName}</p>
                 </div>
                 <div className="text-right">
                   <p className="font-bold text-green-600">+{sale.netEarnings.toLocaleString()} F</p>
                   <p className="text-[10px] text-gray-400">{sale.date}</p>
                 </div>
               </div>
             ))}
           </div>
           <button onClick={() => setActiveView('sales')} className="mt-4 text-brand-blue font-bold text-sm w-full text-center hover:underline">Voir tout l'historique</button>
        </div>
      </div>
    </div>
  );

  // --- VIEW: AFFILIATE LINKS ---
  const AffiliateLinksView = () => {
    const [selectedProduct, setSelectedProduct] = useState('');
    
    const generateNewLink = () => {
       if(!selectedProduct) return;
       const product = initialCourses.find(c => c.id === selectedProduct);
       if(!product) return;

       const newLink: AffiliateLink = {
         id: Date.now().toString(),
         productId: product.id,
         productName: product.title,
         url: `${window.location.origin}/#/product/${product.id}?ref=${currentUser.id}`,
         clicks: 0,
         conversions: 0,
         commissionEarned: 0,
         isActive: true
       };
       setAffiliateLinks([newLink, ...affiliateLinks]);
    };

    return (
      <div className="space-y-6 animate-in fade-in">
        <h2 className="text-2xl font-bold font-serif flex items-center gap-2"><LinkIcon className="text-brand-blue" /> Mes Liens Affiliés</h2>
        
        {/* Generator */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
           <h3 className="font-bold mb-4 text-gray-800">Générer un nouveau lien</h3>
           <div className="flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1 w-full">
                <label className="block text-sm font-bold text-gray-500 mb-2">Choisir un produit à promouvoir</label>
                <select 
                  className="w-full border border-gray-200 rounded-lg p-3 bg-gray-50 outline-none focus:ring-2 focus:ring-brand-blue"
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                >
                  <option value="">Sélectionnez une formation...</option>
                  {initialCourses.map(c => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
              </div>
              <button 
                onClick={generateNewLink}
                disabled={!selectedProduct}
                className="bg-brand-black text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-800 disabled:opacity-50 transition-colors w-full md:w-auto"
              >
                Générer le lien
              </button>
           </div>
        </div>

        {/* Links List */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
           <div className="overflow-x-auto">
             <table className="w-full text-left">
               <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-bold">
                 <tr>
                   <th className="p-4">Produit Associé</th>
                   <th className="p-4">Lien de tracking</th>
                   <th className="p-4">Clics</th>
                   <th className="p-4">Ventes</th>
                   <th className="p-4">Commission</th>
                   <th className="p-4 text-right">Actions</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-gray-100">
                 {affiliateLinks.map(link => (
                   <tr key={link.id} className="hover:bg-gray-50 transition-colors">
                     <td className="p-4 font-bold text-gray-800">{link.productName}</td>
                     <td className="p-4">
                       <div className="flex items-center gap-2 bg-gray-50 p-2 rounded border border-gray-200 max-w-xs">
                          <span className="truncate text-xs text-gray-600 font-mono">{link.url}</span>
                       </div>
                     </td>
                     <td className="p-4">
                        <span className="bg-blue-50 text-brand-blue px-2 py-1 rounded text-xs font-bold">{link.clicks}</span>
                     </td>
                     <td className="p-4">
                        <span className="bg-green-50 text-green-600 px-2 py-1 rounded text-xs font-bold">{link.conversions}</span>
                     </td>
                     <td className="p-4 font-bold text-gray-800">{link.commissionEarned.toLocaleString()} F</td>
                     <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                           <button 
                             onClick={() => copyToClipboard(link.url)}
                             className="p-2 bg-brand-blue text-white rounded hover:bg-blue-600 transition-colors"
                             title="Copier le lien"
                           >
                             <Copy size={16} />
                           </button>
                           <button className="p-2 bg-gray-100 text-gray-500 rounded hover:bg-red-50 hover:text-red-500 transition-colors">
                             <Trash2 size={16} />
                           </button>
                        </div>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
        </div>
      </div>
    );
  };

  // --- VIEW: SALES (Detailed) ---
  const SalesView = () => {
     return (
       <div className="space-y-6 animate-in fade-in">
         <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold font-serif flex items-center gap-2"><Package className="text-brand-blue" /> Mes Ventes</h2>
            <div className="flex gap-2">
               <button className="bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-gray-50">
                 <Filter size={16} /> Filtrer
               </button>
               <button className="bg-brand-black text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-gray-800">
                 <Download size={16} /> Exporter CSV
               </button>
            </div>
         </div>

         <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-bold">
                  <tr>
                    <th className="p-4">Date</th>
                    <th className="p-4">Client</th>
                    <th className="p-4">Produit</th>
                    <th className="p-4">Montant</th>
                    <th className="p-4">Commission</th>
                    <th className="p-4">Statut</th>
                    <th className="p-4 text-right">Détail</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {salesHistory.map(sale => (
                    <tr key={sale.id} className="hover:bg-gray-50">
                      <td className="p-4 text-sm text-gray-600">{sale.date}</td>
                      <td className="p-4 font-bold text-gray-800">{sale.studentName}</td>
                      <td className="p-4 text-sm text-gray-600">{sale.courseTitle}</td>
                      <td className="p-4 font-bold">{sale.amount.toLocaleString()} F</td>
                      <td className="p-4 font-bold text-green-600">+{sale.netEarnings.toLocaleString()} F</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                          sale.status === 'completed' ? 'bg-green-100 text-green-700' : 
                          sale.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {sale.status === 'completed' ? 'Validé' : 'En attente'}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                         <button className="text-gray-400 hover:text-brand-blue"><MoreHorizontal size={20}/></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
         </div>
       </div>
     );
  };

  // --- VIEW: COMMISSIONS / FINANCE ---
  const FinanceView = () => {
    // Current Balance Logic (Mock)
    const pendingCommission = creatorStats.revenue * 0.15;
    const availableBalance = creatorStats.revenue * 0.9;
    
    return (
      <div className="space-y-6 animate-in fade-in">
        <h2 className="text-2xl font-bold font-serif flex items-center gap-2"><Wallet className="text-brand-blue" /> Mes Commissions & Retraits</h2>
        
        {/* Wallet Cards */}
        <div className="grid md:grid-cols-2 gap-6">
           <div className="bg-brand-black text-white p-8 rounded-2xl shadow-xl relative overflow-hidden">
             <div className="relative z-10">
               <p className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-2">Solde Disponible</p>
               <h3 className="text-4xl font-bold mb-6">{availableBalance.toLocaleString()} F</h3>
               <div className="flex gap-3">
                 <button className="bg-brand-blue text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-600 shadow-lg shadow-blue-900/50 flex-1">
                   Retrait Immédiat
                 </button>
                 <button className="bg-gray-800 text-white px-6 py-2 rounded-lg font-bold hover:bg-gray-700 flex-1 border border-gray-700">
                   Historique
                 </button>
               </div>
             </div>
             <Wallet size={100} className="absolute -bottom-4 -right-4 text-gray-800 opacity-50" />
           </div>

           <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
             <div className="relative z-10">
               <p className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-2">Commissions en Attente</p>
               <h3 className="text-4xl font-bold text-gray-800 mb-6">{pendingCommission.toLocaleString()} F</h3>
               <div className="bg-green-50 p-3 rounded-lg flex items-center gap-3">
                 <RefreshCcw className="text-green-600" size={20} />
                 <div>
                   <p className="text-xs font-bold text-green-800">Distribution Automatique Active</p>
                   <p className="text-[10px] text-green-600">Prochain virement auto : Lundi prochain</p>
                 </div>
               </div>
             </div>
           </div>
        </div>
        
        {/* Withdrawal Methods */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="font-bold mb-4">Méthodes de Paiement Configurées</h3>
          <div className="flex flex-wrap gap-4">
             <div className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl bg-gray-50 min-w-[200px]">
                <Smartphone className="text-brand-blue" />
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase">Mobile Money</p>
                  <p className="font-bold text-sm">TMoney (...5419)</p>
                </div>
                <CheckCircle size={16} className="text-green-500 ml-auto" />
             </div>
             <div className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl bg-gray-50 min-w-[200px] opacity-60">
                <Landmark className="text-gray-400" />
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase">Virement Bancaire</p>
                  <p className="font-bold text-sm">Non configuré</p>
                </div>
                <Plus size={16} className="text-gray-400 ml-auto cursor-pointer" />
             </div>
          </div>
        </div>

        {/* Payout History */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
           <div className="p-4 border-b border-gray-100 bg-gray-50">
             <h3 className="font-bold text-gray-700">Historique des transactions</h3>
           </div>
           <div className="divide-y divide-gray-100">
             {payouts.map(p => (
               <div key={p.id} className="p-4 flex justify-between items-center hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${p.status === 'paid' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                      {p.status === 'paid' ? <CheckCircle size={16} /> : <Clock size={16} />}
                    </div>
                    <div>
                      <p className="font-bold text-gray-800">Retrait vers {p.method.replace('_', ' ')}</p>
                      <p className="text-xs text-gray-500">{p.requestDate}</p>
                    </div>
                  </div>
                  <div className="text-right">
                     <p className="font-bold text-brand-black">-{p.amount.toLocaleString()} F</p>
                     <p className={`text-xs font-bold ${p.status === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                       {p.status === 'paid' ? 'Payé' : 'En traitement'}
                     </p>
                  </div>
               </div>
             ))}
           </div>
        </div>
      </div>
    );
  };

  // --- VIEW: MARKETING RESOURCES ---
  const MarketingAssetsView = () => {
     return (
       <div className="space-y-6 animate-in fade-in">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold font-serif flex items-center gap-2"><Megaphone className="text-brand-blue" /> Ressources Marketing</h2>
              <p className="text-gray-500">Utilisez ces contenus pour vos publicités Facebook, TikTok et Instagram.</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
             {mockMarketingAssets.map(asset => (
               <div key={asset.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition-shadow group">
                  <div className="bg-gray-100 h-48 relative flex items-center justify-center overflow-hidden">
                     {asset.type === 'text' ? (
                       <div className="p-6 text-center">
                         <FileBox size={40} className="mx-auto text-gray-400 mb-2" />
                         <p className="text-xs text-gray-500 line-clamp-3 italic">"{asset.content}"</p>
                       </div>
                     ) : (
                       <img src={asset.url} alt={asset.title} className="w-full h-full object-cover" />
                     )}
                     <div className="absolute top-2 right-2 bg-black/60 text-white text-[10px] font-bold px-2 py-1 rounded">
                       {asset.format}
                     </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                       {asset.type === 'banner' && <ImageIcon size={14} className="text-blue-500"/>}
                       {asset.type === 'video' && <Video size={14} className="text-red-500"/>}
                       {asset.type === 'text' && <FileText size={14} className="text-gray-500"/>}
                       <span className="text-xs font-bold text-gray-500 uppercase">{asset.type}</span>
                    </div>
                    <h3 className="font-bold text-gray-800 mb-4">{asset.title}</h3>
                    
                    <div className="flex gap-2">
                       <button 
                         onClick={() => {
                           if(asset.content) copyToClipboard(asset.content);
                           else alert("Téléchargement démarré...");
                         }}
                         className="flex-1 bg-brand-black text-white py-2 rounded-lg text-sm font-bold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                       >
                         {asset.type === 'text' ? <Copy size={16} /> : <Download size={16} />}
                         {asset.type === 'text' ? 'Copier le texte' : 'Télécharger'}
                       </button>
                    </div>
                  </div>
               </div>
             ))}
          </div>
       </div>
     );
  };

  // --- VIEW: SETTINGS (Profile) ---
  const SettingsView = () => {
    return (
      <div className="space-y-6 animate-in fade-in">
        <h2 className="text-2xl font-bold font-serif flex items-center gap-2"><Settings className="text-brand-blue" /> Paramètres du Profil</h2>
        
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm grid md:grid-cols-2 gap-12">
           <div className="space-y-6">
             <h3 className="font-bold text-gray-800 border-b border-gray-100 pb-2">Informations Personnelles</h3>
             <div className="flex items-center gap-4">
               <img src={currentUser.avatar} className="w-20 h-20 rounded-full object-cover border-4 border-gray-100" />
               <button className="text-sm font-bold text-brand-blue border border-brand-blue px-4 py-2 rounded-lg hover:bg-blue-50">Changer la photo</button>
             </div>
             
             <div>
               <label className="block text-sm font-bold text-gray-500 mb-2">Nom Complet</label>
               <input className="w-full border border-gray-200 rounded-lg p-3" defaultValue={currentUser.name} />
             </div>
             <div>
               <label className="block text-sm font-bold text-gray-500 mb-2">Email</label>
               <input className="w-full border border-gray-200 rounded-lg p-3 bg-gray-50" defaultValue={currentUser.email} readOnly />
             </div>
           </div>

           <div className="space-y-6">
             <h3 className="font-bold text-gray-800 border-b border-gray-100 pb-2">Personnalisation & Sécurité</h3>
             
             <div>
               <label className="block text-sm font-bold text-gray-500 mb-2">Thème de l'interface</label>
               <div className="flex gap-4">
                 <button className="flex-1 bg-white border-2 border-brand-blue p-3 rounded-xl flex items-center justify-center gap-2 font-bold text-brand-blue">
                   <div className="w-4 h-4 bg-gray-100 rounded-full border border-gray-300"></div> Clair
                 </button>
                 <button className="flex-1 bg-gray-900 border-2 border-transparent p-3 rounded-xl flex items-center justify-center gap-2 font-bold text-white hover:border-gray-700">
                   <div className="w-4 h-4 bg-gray-700 rounded-full border border-gray-600"></div> Sombre
                 </button>
               </div>
             </div>

             <div>
                <label className="block text-sm font-bold text-gray-500 mb-2">Sécurité</label>
                <button className="w-full border border-gray-200 py-3 rounded-lg font-bold text-gray-600 hover:bg-gray-50 flex items-center justify-center gap-2">
                  <Lock size={16} /> Modifier mon mot de passe
                </button>
             </div>
             
             <div className="flex items-center gap-3">
               <input type="checkbox" className="w-5 h-5 text-brand-blue rounded" defaultChecked />
               <label className="text-sm text-gray-600">Recevoir des notifications par email à chaque vente</label>
             </div>
           </div>
        </div>
        <div className="flex justify-end">
          <button className="bg-brand-black text-white px-8 py-3 rounded-xl font-bold shadow-lg">Enregistrer les modifications</button>
        </div>
      </div>
    );
  };

  const AdminVendorsView = () => (
    <div className="p-6 bg-red-50 text-red-600 rounded-lg">Interface Admin Fondateur (Placeholder)</div>
  );

  const AdminTeamView = () => (
    <div className="p-6 bg-red-50 text-red-600 rounded-lg">Interface Gestion Équipe (Placeholder)</div>
  );

  // --- MAIN LAYOUT RENDER ---
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-200 transform transition-transform duration-300 flex flex-col
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static shadow-2xl lg:shadow-none
      `}>
        <div className="h-20 flex items-center px-6 border-b border-gray-100">
           <div className="w-10 h-10 bg-brand-black rounded-xl flex items-center justify-center text-white font-bold mr-3 shadow-lg shadow-gray-300">A</div>
           <div>
             <span className="font-serif font-bold text-xl text-brand-black tracking-wide block leading-none">Affiliate</span>
             <span className="text-xs font-bold text-brand-blue tracking-widest uppercase">Pro</span>
           </div>
           <button className="ml-auto lg:hidden text-gray-400" onClick={() => setIsSidebarOpen(false)}><X size={24} /></button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* User Info Block */}
          <div className="flex items-center gap-3 px-2 bg-gray-50 p-3 rounded-xl border border-gray-100">
            <img src={currentUser.avatar} alt="Profile" className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm" />
            <div className="overflow-hidden">
              <p className="font-bold text-sm truncate text-brand-black">{currentUser.name}</p>
              <div className="flex items-center gap-1">
                <span className={`w-2 h-2 rounded-full bg-green-500`}></span>
                <span className="text-xs text-gray-500">En ligne</span>
              </div>
            </div>
          </div>

          <nav>
            <SidebarItem view="dashboard" icon={<LayoutDashboard size={18} />} label="Tableau de bord" />
            <SidebarItem view="affiliate_links" icon={<LinkIcon size={18} />} label="Mes Liens Affiliés" />
            <SidebarItem view="sales" icon={<Package size={18} />} label="Mes Ventes" />
            <SidebarItem view="finance" icon={<Wallet size={18} />} label="Commissions / Retraits" />
            <SidebarItem view="marketing_assets" icon={<Megaphone size={18} />} label="Ressources Marketing" />
            
            <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 mt-6">Compte</p>
            <SidebarItem view="settings" icon={<Settings size={18} />} label="Paramètres Profil" />

            {/* Admin Section if applicable */}
            {isAdmin && (
               <div className="mt-6 border-t border-gray-100 pt-6">
                  <p className="px-4 text-xs font-bold text-red-500 uppercase tracking-wider mb-2 flex items-center gap-2"><Shield size={12}/> Fondateur</p>
                  <SidebarItem view="admin_vendors" icon={<Users size={18} />} label="Tous les Affiliés" />
                  <SidebarItem view="admin_team" icon={<UserPlus size={18} />} label="Gestion Admin" />
               </div>
            )}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Topbar */}
        <header className="h-20 bg-white/80 backdrop-blur border-b border-gray-200 flex justify-between items-center px-8 z-40 sticky top-0">
           <div className="flex items-center gap-4">
             <button className="lg:hidden" onClick={() => setIsSidebarOpen(true)}><Menu size={24} /></button>
             <h2 className="font-bold text-xl text-gray-800 hidden md:block capitalize">
               {activeView.replace(/_/g, ' ')}
             </h2>
           </div>
           
           <div className="flex items-center gap-4">
             <div className="relative">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 text-gray-400 hover:text-brand-blue transition-colors"
                >
                  <Bell size={24} />
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
                </button>
                {/* Notification Dropdown */}
                {showNotifications && (
                   <div className="absolute right-0 top-12 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 z-50">
                      <div className="p-4 border-b border-gray-50 font-bold text-sm">Notifications</div>
                      <div className="max-h-64 overflow-y-auto">
                         <div className="p-3 border-b border-gray-50 bg-blue-50/50 flex gap-3">
                            <div className="p-2 bg-green-100 text-green-600 rounded-full h-fit"><DollarSign size={14}/></div>
                            <div>
                               <p className="text-sm font-bold text-gray-800">Nouvelle Commission !</p>
                               <p className="text-xs text-gray-500">Vous avez gagné 4,500 F sur la vente de "Leadership Absolu".</p>
                               <p className="text-[10px] text-gray-400 mt-1">Il y a 2 min</p>
                            </div>
                         </div>
                         <div className="p-3 flex gap-3">
                            <div className="p-2 bg-blue-100 text-blue-600 rounded-full h-fit"><Users size={14}/></div>
                            <div>
                               <p className="text-sm font-bold text-gray-800">Nouveau Clic</p>
                               <p className="text-xs text-gray-500">Un prospect a cliqué sur votre lien Facebook.</p>
                               <p className="text-[10px] text-gray-400 mt-1">Il y a 10 min</p>
                            </div>
                         </div>
                      </div>
                      <div className="p-2 text-center text-xs font-bold text-brand-blue cursor-pointer hover:bg-gray-50">Tout marquer comme lu</div>
                   </div>
                )}
             </div>
           </div>
        </header>

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto p-6 md:p-10 scroll-smooth">
          {activeView === 'dashboard' && <DashboardView />}
          {activeView === 'affiliate_links' && <AffiliateLinksView />}
          {activeView === 'sales' && <SalesView />}
          {activeView === 'finance' && <FinanceView />}
          {activeView === 'marketing_assets' && <MarketingAssetsView />}
          {activeView === 'settings' && <SettingsView />}
          {activeView === 'admin_vendors' && <AdminVendorsView />}
          {activeView === 'admin_team' && <AdminTeamView />}
        </main>
      </div>

      {/* --- SOCIAL SHARE MODAL --- */}
      {shareData && (
        <SocialShare 
          url={shareData.url}
          title={shareData.title}
          subtitle={shareData.subtitle}
          onClose={() => setShareData(null)}
        />
      )}
    </div>
  );
};

export default CreatorStudio;
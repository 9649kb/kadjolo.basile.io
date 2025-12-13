
import React, { useState, useRef, useEffect } from 'react';
import { 
  LayoutDashboard, BookOpen, Users, DollarSign, Settings, Plus, Search, 
  MoreVertical, TrendingUp, Calendar, ArrowUpRight, Bell, Menu, X, 
  FileText, Video, Image as ImageIcon, Trash2, Edit2, CheckCircle, XCircle,
  Eye, Download, RefreshCw, Smartphone, CreditCard, Globe, Lock, Save, Share2, Copy,
  Camera, Upload, Link as LinkIcon, BarChart2, Star, Megaphone, Workflow, Grid, ExternalLink,
  ShoppingBag, Zap, MessageSquare, PieChart, Tag, ArrowLeft, Mail, Clock,
  Code, Plug, Radio, HelpCircle, Shield, AlertCircle, Check, Loader, UserPlus, User,
  List, ChevronDown, ChevronRight, GripVertical, Percent, Hash, Send, CornerDownRight, Database,
  ArrowRight, Award, Play, Pause, MousePointer, Filter, MessageCircle, Crown, Wallet, Info,
  Gift, Trophy, Target // Added Icons
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend
} from 'recharts';
import { 
  courses as initialCourses, salesHistory, creatorStats, siteConfig, 
  vendorProfiles, payoutRequests as initialPayouts, globalPaymentMethods as initialPaymentMethods,
  mockCoupons, posts as initialPosts, supportTickets as initialTickets,
  financialService, mockRewardRules // Added mockRewardRules
} from '../services/mockData';
import { Course, Sale, PayoutRequest, PaymentMethodConfig, VendorProfile, Module, Lesson, Coupon, Post, SupportTicket, RewardRule } from '../types';
import { useUser } from '../contexts/UserContext';
import { useNavigate, Link } from 'react-router-dom';
import { getAISuggestions } from '../services/geminiService';
import { PaymentGatewayManager } from '../services/paymentGatewayManager'; 
import { notifyRewardClaim } from '../services/notificationService'; // Added import

// --- COMPONENTS ---

const SidebarItem = ({ icon: Icon, label, active, onClick, badge }: any) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative ${
      active 
        ? 'bg-brand-black text-white shadow-lg' 
        : 'text-gray-500 hover:bg-white hover:text-brand-blue hover:shadow-sm'
    }`}
  >
    <Icon size={20} className={`transition-colors ${active ? 'text-brand-blue' : 'group-hover:text-brand-blue'}`} />
    <span className="font-medium text-sm">{label}</span>
    {badge && (
      <span className="ml-auto bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
        {badge}
      </span>
    )}
    {active && !badge && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-blue" />}
  </button>
);

const StatCard = ({ title, value, change, icon: Icon, isCurrency = false }: any) => (
  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-brand-gray rounded-xl text-brand-black">
        <Icon size={24} />
      </div>
      {change !== undefined && (
        <span className={`flex items-center text-xs font-bold px-2 py-1 rounded-full ${change >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {change >= 0 ? '+' : ''}{change}%
          <TrendingUp size={12} className="ml-1" />
        </span>
      )}
    </div>
    <h3 className="text-gray-500 text-sm font-medium mb-1">{title}</h3>
    <p className="text-2xl font-bold text-brand-black tracking-tight">
      {value}
      {isCurrency && <span className="text-sm font-normal text-gray-400 ml-1">FCFA</span>}
    </p>
  </div>
);

// --- VIEWS ---

const RewardsView = () => {
  const { user } = useUser();
  // Find current vendor profile based on logged-in user
  const currentVendor = vendorProfiles.find(v => v.userId === user?.id) || vendorProfiles[0]; // Fallback for dev
  const [claiming, setClaiming] = useState<string | null>(null);
  const [requestedRewards, setRequestedRewards] = useState<string[]>([]); // Track requests in current session
  
  // Calculate progress for each rule
  const getProgress = (rule: RewardRule) => {
    let current = 0;
    if (rule.type === 'revenue') current = currentVendor.totalRevenue || 0;
    if (rule.type === 'sales_count') current = currentVendor.totalSales || 0;
    
    const percent = Math.min(100, Math.round((current / rule.threshold) * 100));
    return { current, percent, completed: percent === 100 };
  };

  const isClaimed = (ruleId: string) => {
    return currentVendor.receivedRewards?.includes(ruleId);
  };

  const handleClaim = async (rule: RewardRule) => {
    if (confirm(`Voulez-vous envoyer une demande officielle pour recevoir : "${rule.rewardValue}" ?`)) {
      setClaiming(rule.id);
      
      // Simulate API Call / Email
      await notifyRewardClaim(currentVendor.shopName, rule.name, rule.rewardValue);
      
      setClaiming(null);
      setRequestedRewards(prev => [...prev, rule.id]); // Mark as requested visually
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in">
       {/* Hero Banner */}
       <div className="bg-gradient-to-r from-brand-black to-gray-800 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl">
          <div className="relative z-10">
             <div className="flex items-center gap-3 mb-2">
                <Trophy className="text-yellow-400 animate-bounce" size={32} />
                <h2 className="text-2xl font-bold">Programme Élites</h2>
             </div>
             <p className="text-gray-300 max-w-xl">
               Débloquez des bonus exclusifs, des badges et des cadeaux physiques en développant votre activité.
               Chaque vente vous rapproche du niveau supérieur.
             </p>
          </div>
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
       </div>

       <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockRewardRules.map(rule => {
            const { current, percent, completed } = getProgress(rule);
            const claimed = isClaimed(rule.id);
            const requested = requestedRewards.includes(rule.id);
            
            // Adjust styling if requested
            const statusColor = completed 
                ? (claimed ? 'bg-green-50 border-green-200' : requested ? 'bg-blue-50 border-blue-200' : 'bg-yellow-50 border-yellow-200') 
                : 'bg-white border-gray-100 opacity-80';

            return (
              <div key={rule.id} className={`rounded-2xl border-2 p-6 flex flex-col relative overflow-hidden transition-all hover:shadow-lg ${statusColor}`}>
                 
                 {/* Status Badge */}
                 <div className="absolute top-4 right-4">
                    {claimed ? (
                      <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
                        <CheckCircle size={12}/> Reçu
                      </span>
                    ) : requested ? (
                       <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
                        <Clock size={12}/> En attente
                      </span>
                    ) : completed ? (
                      <span className="bg-yellow-100 text-yellow-700 text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 animate-pulse">
                        <Gift size={12}/> Débloqué !
                      </span>
                    ) : (
                      <span className="bg-gray-100 text-gray-500 text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
                        <Lock size={12}/> Verrouillé
                      </span>
                    )}
                 </div>

                 {/* Icon */}
                 <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-white shadow-md ${rule.color}`}>
                    {rule.icon === 'Crown' ? <Crown size={24}/> : rule.icon === 'Trophy' ? <Trophy size={24}/> : <Gift size={24}/>}
                 </div>

                 <h3 className="font-bold text-gray-900 text-lg">{rule.name}</h3>
                 <p className="text-xs text-gray-500 mt-1 mb-4 h-10">{rule.description}</p>

                 {/* Reward Display */}
                 <div className="bg-white/50 rounded-lg p-3 mb-4 border border-gray-100/50">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Récompense</p>
                    <p className="font-bold text-brand-blue text-sm">{rule.rewardValue} {typeof rule.rewardValue === 'number' ? 'FCFA' : ''}</p>
                 </div>

                 {/* Progress Bar */}
                 <div className="mt-auto">
                    <div className="flex justify-between text-xs font-bold mb-1">
                       <span className={completed ? 'text-green-600' : 'text-gray-500'}>{current.toLocaleString()} / {rule.threshold.toLocaleString()}</span>
                       <span className={completed ? 'text-green-600' : 'text-gray-400'}>{percent}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                       <div 
                         className={`h-full rounded-full transition-all duration-1000 ${completed ? 'bg-green-500' : 'bg-brand-blue'}`} 
                         style={{width: `${percent}%`}}
                       ></div>
                    </div>
                 </div>

                 {/* Action Button: Dynamic State */}
                 {completed && !claimed && (
                   <div className="mt-4 pt-4 border-t border-yellow-200/50">
                      {requested ? (
                        <button 
                            disabled
                            className="w-full bg-blue-100 text-blue-700 font-bold text-xs py-2 rounded-lg cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            <CheckCircle size={14} /> Demande Envoyée
                        </button>
                      ) : (
                        <button 
                            onClick={() => handleClaim(rule)}
                            disabled={claiming === rule.id}
                            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold text-xs py-2 rounded-lg shadow-md transition-colors flex items-center justify-center gap-2"
                        >
                            {claiming === rule.id ? (
                            <>
                                <Loader size={14} className="animate-spin" /> Envoi...
                            </>
                            ) : (
                            <>
                                <Gift size={14} /> Réclamer Maintenant
                            </>
                            )}
                        </button>
                      )}
                      
                      {!requested && <p className="text-[10px] text-center text-yellow-700 mt-2">Cliquez pour notifier le fondateur.</p>}
                   </div>
                 )}
              </div>
            );
          })}
       </div>
    </div>
  );
};

const DashboardView = ({ stats, isAdmin }: { stats: any, isAdmin: boolean }) => {
  const data = [
    { name: 'Lun', revenue: 4000, sales: 24, views: 120 },
    { name: 'Mar', revenue: 3000, sales: 18, views: 132 },
    { name: 'Mer', revenue: 2000, sales: 12, views: 101 },
    { name: 'Jeu', revenue: 2780, sales: 20, views: 154 },
    { name: 'Ven', revenue: 1890, sales: 15, views: 98 },
    { name: 'Sam', revenue: 2390, sales: 18, views: 110 },
    { name: 'Dim', revenue: 3490, sales: 25, views: 170 },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-brand-black flex items-center gap-2">
            Vue d'ensemble {isAdmin && <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-bold uppercase"><Crown size={12} className="inline mr-1"/>Fondateur</span>}
          </h2>
          {isAdmin && <p className="text-sm text-gray-500">Données globales de la plateforme</p>}
        </div>
        <div className="text-sm text-gray-500">{new Date().toLocaleDateString('fr-FR', { dateStyle: 'full' })}</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Revenu Total" value={stats.revenue.toLocaleString()} change={12} icon={DollarSign} isCurrency />
        <StatCard title="Vues Totales" value="15,420" change={8} icon={Eye} />
        <StatCard title="Ventes" value={stats.totalSales} change={5} icon={ShoppingBag} />
        <StatCard title="Commission Due" value="45,000" icon={Lock} isCurrency />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg text-brand-black">Analyse des Ventes</h3>
            <select className="bg-brand-gray border-none text-xs font-bold rounded-lg px-3 py-2 outline-none cursor-pointer">
              <option>7 derniers jours</option>
              <option>Ce mois</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} tickFormatter={(value) => `${value/1000}k`} />
                <Tooltip 
                  contentStyle={{backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'}}
                  itemStyle={{color: '#1f2937', fontWeight: 'bold'}}
                />
                <Area type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-lg text-brand-black mb-6">Activité Récente</h3>
          <div className="space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-50 text-brand-blue flex items-center justify-center shrink-0">
                  <ShoppingBag size={14} />
                </div>
                <div>
                  <p className="text-sm font-medium text-brand-black">Nouvelle commande #24{i}</p>
                  <p className="text-xs text-gray-400">Il y a {i * 15} minutes</p>
                </div>
                <span className="ml-auto text-xs font-bold text-green-600">+15,000 F</span>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-3 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors">
            Voir tout l'historique
          </button>
        </div>
      </div>
    </div>
  );
};

const SalesHistoryView = ({ sales }: { sales: Sale[] }) => {
  return (
    <div className="space-y-6 animate-in fade-in">
       <h2 className="text-2xl font-bold text-brand-black">Historique des Clients</h2>
       <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold">
               <tr>
                  <th className="p-4">Date</th>
                  <th className="p-4">Client</th>
                  <th className="p-4">Produit</th>
                  <th className="p-4">Montant</th>
                  <th className="p-4">Statut</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
               {sales.map(sale => (
                  <tr key={sale.id} className="hover:bg-gray-50">
                     <td className="p-4 text-sm text-gray-500">{sale.date}</td>
                     <td className="p-4 font-bold text-sm text-gray-800">{sale.studentName}</td>
                     <td className="p-4 text-sm text-gray-600">{sale.courseTitle}</td>
                     <td className="p-4 font-bold text-sm text-brand-blue">{sale.amount.toLocaleString()} F</td>
                     <td className="p-4"><span className={`px-2 py-1 rounded text-xs font-bold uppercase ${sale.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{sale.status}</span></td>
                  </tr>
               ))}
               {sales.length === 0 && (
                 <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-400">Aucune vente enregistrée.</td>
                 </tr>
               )}
            </tbody>
          </table>
       </div>
    </div>
  );
};

const ProductListView = ({ products, onEdit, onNew }: { products: Course[], onEdit: (product: Course) => void, onNew: () => void }) => {
  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-brand-black">Mes Produits ({products.length})</h2>
        <button onClick={onNew} className="bg-brand-black text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
          <Plus size={16} /> Nouveau Produit
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold">
            <tr>
              <th className="p-4">Produit</th>
              <th className="p-4">Prix</th>
              <th className="p-4">Ventes</th>
              <th className="p-4">Note</th>
              <th className="p-4">Statut</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map(product => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded overflow-hidden bg-gray-100">
                    <img src={product.image} className="w-full h-full object-cover" alt="" />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-brand-black line-clamp-1">{product.title}</p>
                    <p className="text-xs text-gray-400 capitalize">{product.type}</p>
                  </div>
                </td>
                <td className="p-4 text-sm font-bold">{product.price.toLocaleString()} F</td>
                <td className="p-4 text-sm text-gray-600">{product.students}</td>
                <td className="p-4 text-sm text-yellow-500 font-bold flex items-center gap-1">
                  <Star size={12} fill="currentColor"/> {product.rating}
                </td>
                <td className="p-4">
                  <span className={`text-xs font-bold px-2 py-1 rounded-full capitalize ${product.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                    {product.status === 'published' ? 'Publié' : 'Brouillon'}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button onClick={() => onEdit(product)} className="text-brand-blue font-bold text-xs hover:underline">Modifier</button>
                </td>
              </tr>
            ))}
             {products.length === 0 && (
                 <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-400">Aucun produit. Créez-en un !</td>
                 </tr>
               )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ProductEditor = ({ product, onSave, onCancel }: { product: Partial<Course> | null, onSave: (p: any) => void, onCancel: () => void }) => {
  const [formData, setFormData] = useState<Partial<Course>>(product || {
    title: '',
    price: 0,
    description: '',
    type: 'course',
    status: 'draft',
    image: 'https://via.placeholder.com/300'
  });
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loadingAI, setLoadingAI] = useState(false);

  const handleAI = async (field: 'title' | 'description') => {
    if (!formData[field]) return;
    setLoadingAI(true);
    const results = await getAISuggestions(formData[field] as string, field);
    setSuggestions(results);
    setLoadingAI(false);
  };

  const applySuggestion = (text: string, field: 'title' | 'description') => {
    setFormData({ ...formData, [field]: text });
    setSuggestions([]);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in slide-in-from-right-8">
      <div className="flex items-center gap-4 mb-4">
        <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-full"><ArrowLeft size={24}/></button>
        <h2 className="text-2xl font-bold text-brand-black">{product ? 'Modifier le Produit' : 'Nouveau Produit'}</h2>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Titre du produit</label>
          <div className="flex gap-2">
             <input 
                value={formData.title} 
                onChange={e => setFormData({...formData, title: e.target.value})}
                className="flex-1 border border-gray-200 rounded-lg p-3 outline-none focus:ring-2 focus:ring-brand-blue"
                placeholder="Ex: Formation Business 360"
             />
             <button 
                onClick={() => handleAI('title')} 
                disabled={loadingAI}
                className="bg-purple-100 text-purple-700 px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1 disabled:opacity-50"
              >
               {loadingAI ? <Loader size={14} className="animate-spin" /> : <Zap size={14}/>} IA
             </button>
          </div>
          {suggestions.length > 0 && (
            <div className="mt-2 space-y-2 p-3 bg-purple-50 rounded-lg">
               <p className="text-xs font-bold text-purple-700 mb-1">Suggestions IA :</p>
               {suggestions.map((s, i) => (
                 <button key={i} onClick={() => applySuggestion(s, 'title')} className="block w-full text-left text-sm p-2 hover:bg-white rounded text-purple-900 truncate border border-transparent hover:border-purple-200 transition-colors">
                   {s}
                 </button>
               ))}
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
             <label className="block text-sm font-bold text-gray-700 mb-1">Prix (FCFA)</label>
             <input 
                type="number"
                value={formData.price} 
                onChange={e => setFormData({...formData, price: Number(e.target.value)})}
                className="w-full border border-gray-200 rounded-lg p-3 outline-none focus:ring-2 focus:ring-brand-blue"
             />
          </div>
          <div>
             <label className="block text-sm font-bold text-gray-700 mb-1">Type</label>
             <select 
                value={formData.type} 
                onChange={e => setFormData({...formData, type: e.target.value as any})}
                className="w-full border border-gray-200 rounded-lg p-3 bg-white"
             >
               <option value="course">Formation Vidéo</option>
               <option value="ebook">E-Book (PDF)</option>
               <option value="coaching">Coaching</option>
             </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
          <div className="relative">
             <textarea 
                value={formData.description} 
                onChange={e => setFormData({...formData, description: e.target.value})}
                className="w-full border border-gray-200 rounded-lg p-3 h-32 resize-none outline-none focus:ring-2 focus:ring-brand-blue"
                placeholder="Décrivez votre produit..."
             />
             <button 
               onClick={() => handleAI('description')} 
               disabled={loadingAI}
               className="absolute bottom-3 right-3 bg-purple-100 text-purple-700 px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 disabled:opacity-50"
             >
               {loadingAI ? <Loader size={14} className="animate-spin" /> : <Zap size={14}/>} Améliorer
             </button>
          </div>
          {suggestions.length > 0 && (
            <div className="mt-2 space-y-2 p-3 bg-purple-50 rounded-lg">
               <p className="text-xs font-bold text-purple-700 mb-1">Suggestions IA :</p>
               {suggestions.map((s, i) => (
                 <button key={i} onClick={() => applySuggestion(s, 'description')} className="block w-full text-left text-sm p-2 hover:bg-white rounded text-purple-900 border border-transparent hover:border-purple-200 transition-colors">
                   {s}
                 </button>
               ))}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
           <button onClick={onCancel} className="px-6 py-2 text-gray-500 font-bold hover:bg-gray-50 rounded-lg">Annuler</button>
           <button onClick={() => onSave(formData)} className="bg-brand-black text-white px-8 py-2 rounded-lg font-bold hover:bg-gray-800 transition-colors">
             Enregistrer
           </button>
        </div>
      </div>
    </div>
  );
};

const PayoutRequestView = () => {
  const { user } = useUser();
  const [amount, setAmount] = useState('');
  
  // DYNAMIC PAYMENT METHODS LOGIC
  const [activeMethods, setActiveMethods] = useState<PaymentMethodConfig[]>([]);
  const [selectedMethodName, setSelectedMethodName] = useState('');
  
  // Load active methods from Manager
  useEffect(() => {
    const methods = PaymentGatewayManager.getActiveMethods();
    setActiveMethods(methods);
    if (methods.length > 0) {
      setSelectedMethodName(methods[0].name);
    }
  }, []);

  const [details, setDetails] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Helper to determine placeholder based on selected method type
  const getPlaceholder = () => {
    const selected = activeMethods.find(m => m.name === selectedMethodName);
    if (!selected) return "Numéro ou Identifiant";
    
    if (selected.type === 'mobile_money') return "Votre numéro (ex: 90 00 00 00)";
    if (selected.type === 'bank') return "IBAN / RIB Complet";
    if (selected.type === 'crypto') return "Adresse de votre portefeuille (Wallet)";
    if (selected.type === 'paypal') return "Votre adresse email PayPal";
    
    return "Détails du compte de réception";
  };

  const handleRequest = async () => {
    if(!amount || !details) return;
    if(!user) return;

    setIsProcessing(true);
    
    // Simulate API call
    await financialService.requestPayout(user.id, parseInt(amount), selectedMethodName, details);
    
    setTimeout(() => {
        setIsProcessing(false);
        setAmount('');
        setDetails('');
        alert("Demande de retrait envoyée ! L'administrateur a été notifié.");
    }, 1000);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
       <h2 className="text-2xl font-bold text-brand-black">Mes Revenus</h2>
       
       <div className="grid md:grid-cols-2 gap-6">
          {/* Main Wallet Card */}
          <div className="bg-brand-black text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
             <div className="relative z-10">
               <p className="text-xs text-gray-400 font-bold uppercase mb-1">Solde Disponible</p>
               <h3 className="text-4xl font-bold mb-6">125,000 FCFA</h3>
               
               <div className="space-y-4 bg-gray-900 p-4 rounded-xl border border-gray-800">
                  <h4 className="font-bold text-sm text-gray-300 mb-2 flex items-center gap-2"><Wallet size={16}/> Nouvelle Demande</h4>
                  <div>
                     <label className="block text-xs font-bold text-gray-500 mb-1">Montant à retirer</label>
                     <div className="relative">
                        <input 
                          value={amount}
                          onChange={e => setAmount(e.target.value)}
                          type="number" 
                          className="w-full bg-black border border-gray-700 rounded-lg p-3 text-white outline-none focus:border-brand-blue text-sm" 
                          placeholder="Ex: 50000"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs font-bold">FCFA</span>
                     </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1">Moyen de réception</label>
                          <select 
                              value={selectedMethodName} 
                              onChange={e => setSelectedMethodName(e.target.value)}
                              className="w-full bg-black border border-gray-700 rounded-lg p-3 text-white outline-none text-sm"
                          >
                              {activeMethods.map(method => (
                                <option key={method.id} value={method.name}>{method.name}</option>
                              ))}
                              {activeMethods.length === 0 && <option value="">Aucune méthode disponible</option>}
                          </select>
                      </div>
                      <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1">Coordonnées</label>
                          <input 
                              value={details}
                              onChange={e => setDetails(e.target.value)}
                              type="text" 
                              className="w-full bg-black border border-gray-700 rounded-lg p-3 text-white outline-none focus:border-brand-blue text-sm" 
                              placeholder={getPlaceholder()}
                          />
                      </div>
                  </div>

                  <button 
                      onClick={handleRequest}
                      disabled={!amount || !details || isProcessing}
                      className="w-full bg-brand-blue text-white py-3 rounded-xl font-bold hover:bg-blue-600 transition-colors disabled:opacity-50 flex justify-center items-center gap-2 mt-2"
                  >
                     {isProcessing ? 'Envoi...' : 'Confirmer le Retrait'} <CheckCircle size={16} />
                  </button>
               </div>
             </div>
             
             {/* Decorative Background */}
             <div className="absolute top-0 right-0 w-64 h-64 bg-brand-blue/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
          </div>
          
          {/* Withdrawal History */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
             <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-brand-black">Historique des Retraits</h3>
                <button className="text-xs font-bold text-brand-blue hover:underline">Voir tout</button>
             </div>
             
             <div className="space-y-3 flex-1 overflow-y-auto max-h-[300px] custom-scrollbar">
                {initialPayouts.map(payout => (
                   <div key={payout.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl border border-gray-100 hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-3">
                         <div className={`w-8 h-8 rounded-full flex items-center justify-center ${payout.status === 'paid' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                            {payout.status === 'paid' ? <Check size={14}/> : <Clock size={14}/>}
                         </div>
                         <div>
                            <p className="font-bold text-sm text-gray-800">{payout.amount.toLocaleString()} F</p>
                            <p className="text-xs text-gray-400">{new Date(payout.requestDate).toLocaleDateString()} • {payout.method}</p>
                         </div>
                      </div>
                      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${payout.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                         {payout.status === 'paid' ? 'Payé' : 'En attente'}
                      </span>
                   </div>
                ))}
                {initialPayouts.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400 py-10">
                     <Info size={32} className="mb-2 opacity-50"/>
                     <p className="text-sm italic">Aucun retrait effectué pour le moment.</p>
                  </div>
                )}
             </div>
          </div>
       </div>
    </div>
  );
};

const AnalyticsView = () => {
  const data = [
    { name: 'Lun', sales: 4000 },
    { name: 'Mar', sales: 3000 },
    { name: 'Mer', sales: 2000 },
    { name: 'Jeu', sales: 2780 },
    { name: 'Ven', sales: 1890 },
    { name: 'Sam', sales: 2390 },
    { name: 'Dim', sales: 3490 },
  ];

  return (
    <div className="space-y-6 animate-in fade-in">
       <h2 className="text-2xl font-bold text-brand-black">Analytiques Détaillées</h2>
       
       <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
             <h3 className="font-bold mb-4">Ventes par jour</h3>
             <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={data}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} />
                      <YAxis axisLine={false} tickLine={false} />
                      <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '8px'}} />
                      <Bar dataKey="sales" fill="#2563eb" radius={[4, 4, 0, 0]} />
                   </BarChart>
                </ResponsiveContainer>
             </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
             <h3 className="font-bold mb-4">Sources de Trafic</h3>
             <div className="space-y-4">
                {['Facebook', 'Direct', 'Google', 'Email'].map((source, i) => (
                   <div key={source} className="flex items-center gap-3">
                      <span className="w-20 text-sm font-bold text-gray-600">{source}</span>
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                         <div className="h-full bg-brand-black rounded-full" style={{width: `${80 - (i*20)}%`}}></div>
                      </div>
                      <span className="text-xs text-gray-400 font-bold">{80 - (i*20)}%</span>
                   </div>
                ))}
             </div>
          </div>
       </div>
    </div>
  );
};

const ReviewsView = () => {
  return (
    <div className="space-y-6 animate-in fade-in">
       <h2 className="text-2xl font-bold text-brand-black">Avis & Témoignages</h2>
       <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="space-y-6">
             {[1, 2, 3].map(i => (
                <div key={i} className="flex gap-4 border-b border-gray-50 pb-6 last:border-0 last:pb-0">
                   <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0"></div>
                   <div>
                      <div className="flex items-center gap-2 mb-1">
                         <h4 className="font-bold text-sm">Utilisateur {i}</h4>
                         <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, j) => <Star key={j} size={12} fill="currentColor"/>)}
                         </div>
                      </div>
                      <p className="text-gray-600 text-sm">Excellent contenu, très pédagogique. J'ai beaucoup appris !</p>
                      <p className="text-xs text-gray-400 mt-2">Sur : Formation Business Pro</p>
                   </div>
                </div>
             ))}
          </div>
       </div>
    </div>
  );
};

const SettingsView = () => {
  const { user } = useUser();
  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-500">
      <h2 className="text-2xl font-bold text-brand-black border-b border-gray-100 pb-4">Paramètres de la Boutique</h2>
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-6">
         <div className="relative">
            <img src={user?.avatar} className="w-20 h-20 rounded-full border-4 border-gray-50" />
            <button className="absolute bottom-0 right-0 bg-brand-blue text-white p-1.5 rounded-full border-2 border-white"><Camera size={12}/></button>
         </div>
         <div className="flex-1">
            <h3 className="font-bold text-lg">{user?.name}</h3>
            <p className="text-sm text-gray-500 mb-4">{user?.email}</p>
            <div className="flex gap-2">
               <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded">Compte Vérifié</span>
               <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded">Premium</span>
            </div>
         </div>
      </div>
      <div className="pt-4">
        <button className="bg-brand-black text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors">Enregistrer les modifications</button>
      </div>
    </div>
  );
};

const MarketingView = () => <div className="p-8 text-center text-gray-500">Module Marketing (Email, SMS, Codes Promo)</div>;
const AutomationView = () => <div className="p-8 text-center text-gray-500">Module Automatisation (Règles, Séquences)</div>;
const MoreView = () => <div className="p-8 text-center text-gray-500">Plus d'options (Affiliation, Blog, Support)</div>;


// --- MAIN LAYOUT ---

const CreatorStudio: React.FC = () => {
  const { user: currentUser } = useUser();
  const [activeView, setActiveView] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Course> | null>(null);
  
  // --- PERMISSION & DATA FILTERING LOGIC ---
  const isAdmin = currentUser?.role === 'admin';
  const isFounder = currentUser?.isFounder === true;
  
  const myProducts = isAdmin 
    ? initialCourses 
    : initialCourses.filter(c => c.instructorId === currentUser?.id);

  const mySales = isAdmin 
    ? salesHistory 
    : salesHistory.filter(s => s.vendorId === currentUser?.id);

  // Stats Calculation
  const stats = {
     revenue: mySales.reduce((acc, curr) => acc + curr.amount, 0),
     totalSales: mySales.length,
  };

  const copyShopLink = () => {
    const link = `${window.location.origin}/#/shop/${currentUser?.id || 'demo'}`;
    navigator.clipboard.writeText(link);
    alert('Lien de la boutique copié !');
  };

  const openShop = () => {
     window.open(`/#/shop/${currentUser?.id || 'demo'}`, '_blank');
  };

  const handleProductEdit = (product: Course) => {
    setEditingProduct(product);
    setActiveView('product-editor');
  };

  const handleNewProduct = () => {
    setEditingProduct(null);
    setActiveView('product-editor');
  };

  const handleSaveProduct = (product: any) => {
    console.log("Saving Product", product);
    alert("Produit enregistré !");
    setActiveView('products');
  };

  const renderContent = () => {
    switch(activeView) {
      case 'dashboard': return <DashboardView stats={stats} isAdmin={isAdmin} />;
      case 'products': return <ProductListView products={myProducts} onEdit={handleProductEdit} onNew={handleNewProduct} />;
      case 'product-editor': return <ProductEditor product={editingProduct} onSave={handleSaveProduct} onCancel={() => setActiveView('products')} />;
      case 'customers': return <SalesHistoryView sales={mySales} />;
      case 'revenue': return <PayoutRequestView />;
      case 'analytics': return <AnalyticsView />;
      case 'rewards': return <RewardsView />; 
      case 'reviews': return <ReviewsView />;
      case 'marketing': return <MarketingView />; 
      case 'automation': return <AutomationView />;
      case 'more': return <MoreView />;
      case 'settings': return <SettingsView />;
      default: return <DashboardView stats={stats} isAdmin={isAdmin} />;
    }
  };

  const menuItems = [
    { id: 'dashboard', label: 'Accueil', icon: LayoutDashboard },
    { id: 'products', label: 'Produits', icon: ShoppingBag },
    { id: 'customers', label: 'Clients', icon: Users },
    { id: 'revenue', label: 'Revenus', icon: DollarSign },
    { id: 'analytics', label: 'Analytiques', icon: BarChart2 },
    { id: 'rewards', label: 'Récompenses', icon: Gift, badge: 'NEW' }, // Added Menu Item
    { id: 'reviews', label: 'Avis', icon: Star },
    { id: 'marketing', label: 'Marketing', icon: Megaphone },
    { id: 'automation', label: 'Automatisation', icon: Workflow },
    { id: 'more', label: 'Plus', icon: Grid },
    { id: 'settings', label: 'Paramètres', icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="hidden lg:flex flex-col w-72 bg-white border-r border-gray-100 h-screen sticky top-0 overflow-y-auto custom-scrollbar">
        <div className="p-6">
           <div className="flex items-center gap-3 mb-8">
             <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-serif font-bold text-xl ${isAdmin ? 'bg-red-600 text-white' : 'bg-brand-black text-white'}`}>
                {isAdmin ? 'F' : 'K'}
             </div>
             <div>
               <h1 className="font-bold text-brand-black leading-none">{isAdmin ? 'Fondateur' : 'Studio Vendeur'}</h1>
               <p className="text-xs text-gray-400 mt-1">{isAdmin ? 'Supervision Globale' : 'Gérez votre empire'}</p>
             </div>
           </div>

           <div className="bg-gray-50 p-4 rounded-2xl mb-6 border border-gray-100">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Actions Rapides</p>
              <div className="space-y-2">
                 <button onClick={openShop} className="w-full flex items-center gap-2 text-sm font-bold text-brand-blue hover:underline">
                   <ExternalLink size={14} /> Visiter ma boutique
                 </button>
                 <button onClick={copyShopLink} className="w-full flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-brand-black">
                   <LinkIcon size={14} /> Copier le lien
                 </button>
              </div>
           </div>
           
           <nav className="space-y-1">
             {menuItems.map(item => (
               <SidebarItem 
                 key={item.id}
                 icon={item.icon} 
                 label={item.label} 
                 active={activeView === item.id || (activeView === 'product-editor' && item.id === 'products')} 
                 onClick={() => setActiveView(item.id)}
                 badge={item.badge}
               />
             ))}
           </nav>
        </div>

        <div className="mt-auto p-6 border-t border-gray-50">
           <Link to="/" className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-brand-black transition-colors">
              <ArrowUpRight size={16} /> Retour au site
           </Link>
        </div>
      </aside>

      <main className="flex-1 min-w-0">
         <div className="lg:hidden bg-white border-b border-gray-100 p-4 flex justify-between items-center sticky top-0 z-30">
            <span className="font-bold text-brand-black">Studio Vendeur</span>
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 bg-gray-50 rounded-lg">
               {isMobileMenuOpen ? <X size={20}/> : <Menu size={20}/>}
            </button>
         </div>

         {isMobileMenuOpen && (
           <div className="fixed inset-0 z-40 bg-white lg:hidden overflow-y-auto">
              <div className="p-6 space-y-6">
                <div className="flex justify-between items-center mb-8">
                   <h2 className="text-xl font-bold">Menu Studio</h2>
                   <button onClick={() => setIsMobileMenuOpen(false)}><X size={24}/></button>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                   <button onClick={openShop} className="p-3 bg-blue-50 text-brand-blue rounded-xl font-bold text-sm flex flex-col items-center gap-2">
                      <ExternalLink size={20} /> Visiter
                   </button>
                   <button onClick={copyShopLink} className="p-3 bg-gray-50 text-gray-700 rounded-xl font-bold text-sm flex flex-col items-center gap-2">
                      <LinkIcon size={20} /> Copier
                   </button>
                </div>

                <nav className="space-y-2">
                  {menuItems.map(item => (
                    <button 
                      key={item.id}
                      onClick={() => { setActiveView(item.id); setIsMobileMenuOpen(false); }}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl text-left font-bold transition-colors ${
                        activeView === item.id ? 'bg-brand-black text-white' : 'bg-gray-50 text-gray-600'
                      }`}
                    >
                      <item.icon size={20} /> {item.label}
                    </button>
                  ))}
                </nav>
              </div>
           </div>
         )}

         <div className="p-4 md:p-8 lg:p-12 max-w-7xl mx-auto">
            {renderContent()}
         </div>
      </main>
    </div>
  );
};

export default CreatorStudio;

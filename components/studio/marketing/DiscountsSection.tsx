
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Tag, PlusCircle, ChevronLeft, Trash2, ToggleRight, ToggleLeft, 
  Check, Ticket, X, Search, Filter, Calendar, Percent, 
  DollarSign, Sparkles, ShoppingBag, Clock, AlertCircle, 
  ChevronRight, ArrowRight, BarChart3, Copy, CheckCircle2,
  Settings, Flame, Zap, CalendarDays, History, Play,
  Coins, Camera, Share2, Calculator, TrendingUp, Users,
  Download, Layers, RefreshCw, Wand2, Edit3, ClipboardList,
  AlertTriangle, MousePointer2, Info, Loader2,
  // Added missing UserCheck icon import
  UserCheck
} from 'lucide-react';
import { useData, EnhancedCoupon } from '../../../contexts/DataContext';

type CouponStatusFilter = 'all' | 'active' | 'scheduled' | 'expired' | 'paused';
type ViewMode = 'list' | 'editor' | 'analytics' | 'bulk';

const INITIAL_FORM_STATE: Partial<EnhancedCoupon> = {
  code: '',
  type: 'percentage',
  discountValue: 0,
  isActive: true,
  limitToProducts: false,
  selectedProductIds: [],
  hasMaxUsage: false,
  maxUsage: 100,
  isScheduled: false,
  startDate: '',
  endDate: '',
  usage: 0,
  name: '',
  minPurchaseAmount: 0,
  oncePerCustomer: false
};

const DiscountsSection: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { coupons, toggleCouponStatus, deleteCoupon, addCoupon, updateCoupon, courses } = useData();
  const [step, setStep] = useState<ViewMode>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<CouponStatusFilter>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<EnhancedCoupon | null>(null);
  
  // États pour le simulateur de prix
  const [previewProduct, setPreviewProduct] = useState<string>(courses[0]?.id || '');

  // États du formulaire
  const [formData, setFormData] = useState<Partial<EnhancedCoupon>>(INITIAL_FORM_STATE);
  const [isEditing, setIsEditing] = useState(false);

  // État pour la génération en masse
  const [bulkConfig, setBulkConfig] = useState({
    count: 10,
    prefix: 'KADJOLO-',
    length: 6,
    value: 15,
    type: 'percentage' as 'percentage' | 'fixed',
    uniquePerClient: true
  });

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // --- FONCTION D'EXPORTATION VISUEL HD (CANVAS) ---
  const handleExportVisual = async () => {
    setIsExporting(true);
    
    // Création d'un canvas HD (format Story 1080x1920)
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1920;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 1. Fond Dégradé
    const gradient = ctx.createLinearGradient(0, 0, 1080, 1920);
    gradient.addColorStop(0, '#2563eb');
    gradient.addColorStop(1, '#1e3a8a');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1080, 1920);

    // 2. Cercles décoratifs (Subtiles)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.beginPath(); ctx.arc(1080, 0, 600, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(0, 1920, 800, 0, Math.PI * 2); ctx.fill();

    // 3. Texte "EXCLUSIVITÉ KADJOLO"
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = 'black 30px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.letterSpacing = '10px';
    ctx.fillText('EXCLUSIVITÉ KADJOLO BASILE', 540, 400);

    // 4. Valeur Réduction
    ctx.fillStyle = '#ffffff';
    ctx.font = 'italic black 350px Inter, sans-serif';
    ctx.letterSpacing = '-15px';
    const valueText = `-${formData.discountValue || 0}${formData.type === 'percentage' ? '%' : 'F'}`;
    ctx.fillText(valueText, 540, 850);

    // 5. Encadré Code
    const code = formData.code || 'CODE';
    ctx.font = 'black 100px Inter, sans-serif';
    ctx.letterSpacing = '8px';
    const metrics = ctx.measureText(code);
    const paddingH = 80;
    const paddingV = 50;
    const boxW = metrics.width + paddingH * 2;
    const boxH = 200;
    
    // Ombre de la boîte
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 50;
    ctx.shadowOffsetY = 20;
    
    ctx.fillStyle = '#ffffff';
    // Rounded rect (manual)
    const x = 540 - boxW / 2;
    const y = 1000;
    const r = 40;
    ctx.beginPath();
    ctx.moveTo(x + r, y); ctx.lineTo(x + boxW - r, y); ctx.quadraticCurveTo(x + boxW, y, x + boxW, y + r);
    ctx.lineTo(x + boxW, y + boxH - r); ctx.quadraticCurveTo(x + boxW, y + boxH, x + boxW - r, y + boxH);
    ctx.lineTo(x + r, y + boxH); ctx.quadraticCurveTo(x, y + boxH, x, y + boxH - r);
    ctx.lineTo(x, y + r); ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
    ctx.fill();

    // Reset shadow for text
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;
    ctx.fillStyle = '#000000';
    ctx.fillText(code.toUpperCase(), 540, 1140);

    // 6. Petit message bas
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = 'bold 35px Inter, sans-serif';
    ctx.letterSpacing = '2px';
    ctx.fillText('VALIDE SUR TOUT LE CATALOGUE • 24H', 540, 1300);

    // 7. Signature / Logo conceptuel
    ctx.fillStyle = '#ffffff';
    ctx.font = 'italic black 60px Inter, sans-serif';
    ctx.fillText('KADJOLO BASILE', 540, 1750);

    // Simulation de délai pour l'effet "génération"
    await new Promise(r => setTimeout(r, 1200));

    // Téléchargement
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `PROMO_KADJOLO_${code}.png`;
    link.href = dataUrl;
    link.click();
    
    setIsExporting(false);
  };

  const handleExportCSV = () => {
    const headers = ["ID", "Nom", "Code", "Type", "Valeur", "Usage", "Max Usage", "Statut", "Min Achat"];
    const rows = coupons.map(c => [
      c.id, c.name || 'N/A', c.code, c.type, c.discountValue, c.usage, c.maxUsage || '∞', c.isActive ? 'Actif' : 'Pause', c.minPurchaseAmount || 0
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + rows.map(r => r.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `offres_kadjolo_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleBulkGenerate = () => {
    const now = Date.now();
    for (let i = 0; i < bulkConfig.count; i++) {
      const randomPart = Math.random().toString(36).substring(2, 2 + bulkConfig.length).toUpperCase();
      const code = `${bulkConfig.prefix}${randomPart}`;
      addCoupon({
        id: `cp_bulk_${now}_${i}`,
        code,
        name: `Lot ${bulkConfig.prefix} (#${i+1})`,
        type: bulkConfig.type,
        discountType: bulkConfig.type,
        discountValue: bulkConfig.value,
        isActive: true,
        usage: 0,
        limitToProducts: false,
        selectedProductIds: [],
        hasMaxUsage: true,
        maxUsage: 1,
        isScheduled: false,
        oncePerCustomer: true
      } as EnhancedCoupon);
    }
    setStep('list');
    alert(`${bulkConfig.count} coupons générés avec succès.`);
  };

  const getCouponPerformance = (code: string) => {
    const seed = code.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const salesCount = Math.floor((seed % 35) + 3);
    const revenue = salesCount * 12500;
    const views = salesCount * 8;
    const conversion = ((salesCount / views) * 100).toFixed(1);
    return { salesCount, revenue, views, conversion };
  };

  const filteredCoupons = useMemo(() => {
    return coupons.filter(c => {
      const matchesSearch = 
        c.code.toLowerCase().includes(searchTerm.toLowerCase()) || 
        c.name?.toLowerCase().includes(searchTerm.toLowerCase());
      const now = new Date();
      const isExpired = c.isScheduled && c.endDate && new Date(c.endDate) < now;
      const isScheduled = c.isScheduled && c.startDate && new Date(c.startDate) > now;
      
      let matchesStatus = true;
      if (statusFilter === 'active') matchesStatus = c.isActive && !isExpired && !isScheduled;
      if (statusFilter === 'paused') matchesStatus = !c.isActive;
      if (statusFilter === 'expired') matchesStatus = !!isExpired;
      if (statusFilter === 'scheduled') matchesStatus = !!isScheduled;

      return matchesSearch && matchesStatus;
    });
  }, [coupons, searchTerm, statusFilter]);

  const handleSave = () => {
    if (!formData.code || !formData.discountValue) {
      alert("Le code et la valeur de remise sont obligatoires.");
      return;
    }

    const payload = {
      ...formData,
      id: isEditing ? formData.id : `cp_${Date.now()}`,
      usage: formData.usage || 0,
      discountType: formData.type || 'percentage',
      discountValue: formData.discountValue || 0,
      isActive: formData.isActive ?? true,
      selectedProductIds: formData.selectedProductIds || [],
      oncePerCustomer: formData.oncePerCustomer || false
    } as EnhancedCoupon;

    if (isEditing) {
      updateCoupon(payload);
    } else {
      addCoupon(payload);
    }
    setStep('list');
    resetForm();
  };

  const startEdit = (coupon: EnhancedCoupon) => {
    setFormData({ ...coupon });
    setIsEditing(true);
    setStep('editor');
  };

  const startDuplicate = (coupon: EnhancedCoupon) => {
    setFormData({ ...coupon, id: undefined, code: `${coupon.code}-COPY`, usage: 0 });
    setIsEditing(false);
    setStep('editor');
  };

  const resetForm = () => {
    setFormData(INITIAL_FORM_STATE);
    setIsEditing(false);
  };

  const simulatedPrice = useMemo(() => {
    const product = courses.find(c => c.id === previewProduct);
    if (!product) return 0;
    const basePrice = product.price;
    const disc = formData.discountValue || 0;
    if (formData.type === 'percentage') {
      return basePrice * (1 - disc / 100);
    }
    return Math.max(0, basePrice - disc);
  }, [previewProduct, formData, courses]);

  // Statistiques Globales
  const globalStats = useMemo(() => {
    const totalUsage = coupons.reduce((acc, c) => acc + (c.usage || 0), 0);
    const activeCount = coupons.filter(c => c.isActive).length;
    return { totalUsage, activeCount };
  }, [coupons]);

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in duration-700">
      {/* BOÎTE DE SUPPRESSION PERSONNALISÉE (MODAL) */}
      {deleteTarget && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-[32px] shadow-2xl max-w-sm w-full overflow-hidden animate-in zoom-in-95 duration-200">
             <div className="p-8 text-center space-y-6">
                <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                   <Trash2 size={40} />
                </div>
                <div>
                   <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter">Supprimer l'offre ?</h3>
                   <p className="text-sm text-gray-400 font-medium mt-2 leading-relaxed px-4">
                     Voulez-vous vraiment supprimer le code <span className="font-black text-gray-900">"{deleteTarget.code}"</span> ? Cette action est irréversible.
                   </p>
                </div>
                <div className="flex flex-col gap-2 pt-4">
                   <button 
                     onClick={() => { deleteCoupon(deleteTarget.id); setDeleteTarget(null); }}
                     className="w-full py-4 bg-red-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-red-600/20 hover:bg-red-700 transition-all"
                   >
                      Supprimer Définitivement
                   </button>
                   <button 
                     onClick={() => setDeleteTarget(null)}
                     className="w-full py-4 bg-gray-50 text-gray-400 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-100 transition-all"
                   >
                      Annuler
                   </button>
                </div>
             </div>
          </div>
        </div>
      )}

      {/* HEADER PROFESSIONNEL AVEC BOUTONS BLEUS */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-gray-100 pb-8">
        <div className="flex items-center gap-6">
          <button 
            onClick={step === 'list' ? onBack : () => { setStep('list'); resetForm(); }} 
            className="p-4 bg-white text-gray-400 rounded-2xl border border-gray-100 shadow-sm hover:text-brand-blue hover:shadow-md transition-all"
          >
            <ChevronLeft size={24}/>
          </button>
          <div>
            <h1 className="text-5xl font-serif font-medium text-gray-900 leading-tight tracking-tight italic">
              {step === 'list' ? 'Réductions' : step === 'editor' ? (isEditing ? 'Éditer l\'Offre' : 'Nouvelle Offre') : step === 'bulk' ? 'Génération de Masse' : 'Analyses ROI'}
            </h1>
            <p className="text-gray-400 text-lg font-medium mt-1">
              {step === 'list' ? 'Gérez vos leviers de conversion et fidélisation' : 'Paramétrez vos codes promotionnels'}
            </p>
          </div>
        </div>

        {step === 'list' && (
          <div className="flex flex-wrap gap-4">
             <button onClick={() => setStep('analytics')} className="bg-white text-gray-900 px-6 py-4 rounded-2xl font-bold text-sm flex items-center gap-3 border border-gray-100 shadow-sm hover:bg-gray-50 transition-all">
                <BarChart3 size={20} className="text-brand-blue" /> Analyses ROI
             </button>
             <button onClick={() => setStep('bulk')} className="bg-white text-brand-blue px-6 py-4 rounded-2xl font-bold text-sm flex items-center gap-3 border border-blue-100 shadow-sm hover:bg-blue-50 transition-all">
                <Layers size={20} /> Lot de codes
             </button>
             <button onClick={() => { resetForm(); setStep('editor'); }} className="bg-brand-blue text-white px-10 py-4 rounded-2xl font-bold text-sm flex items-center gap-3 shadow-2xl hover:scale-105 transition-transform">
                <PlusCircle size={20} /> Créer un Code
             </button>
          </div>
        )}
      </div>

      {step === 'list' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in slide-in-from-top-4 duration-500">
           <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex items-center gap-5">
              <div className="w-14 h-14 bg-blue-50 text-brand-blue rounded-2xl flex items-center justify-center shrink-0">
                 <Ticket size={28}/>
              </div>
              <div>
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Offres Actives</p>
                 <p className="text-2xl font-black text-gray-900">{globalStats.activeCount}</p>
              </div>
           </div>
           <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex items-center gap-5">
              <div className="w-14 h-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center shrink-0">
                 <MousePointer2 size={28}/>
              </div>
              <div>
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Utilisations Totales</p>
                 <p className="text-2xl font-black text-gray-900">{globalStats.totalUsage}</p>
              </div>
           </div>
           <div className="bg-brand-black text-white p-6 rounded-[32px] flex items-center gap-5 shadow-xl relative overflow-hidden">
              <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center shrink-0 relative z-10">
                 <TrendingUp size={28}/>
              </div>
              <div className="relative z-10">
                 <p className="text-[10px] font-black text-blue-200/50 uppercase tracking-widest">Croissance Moyenne</p>
                 <p className="text-2xl font-black">+18.4%</p>
              </div>
              <Sparkles className="absolute -bottom-4 -right-4 opacity-5" size={100}/>
           </div>
        </div>
      )}

      {step === 'editor' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start pb-20">
          {/* CONFIGURATION DU COUPON */}
          <div className="lg:col-span-7 space-y-8">
             <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm space-y-10">
                <div className="space-y-8">
                   <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Code Promotionnel</label>
                         <div className="relative">
                            <input 
                              value={formData.code}
                              onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                              className="w-full p-5 bg-gray-50 border-none rounded-2xl font-black text-2xl tracking-widest uppercase focus:ring-4 focus:ring-brand-blue/10 transition-all" 
                              placeholder="EX: ELITE2024"
                            />
                            <button 
                              onClick={() => setFormData({...formData, code: `KB-${Math.random().toString(36).substring(7).toUpperCase()}`})}
                              className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-blue p-2 hover:bg-white rounded-xl transition-colors"
                              title="Générer aléatoirement"
                            >
                              <Wand2 size={20}/>
                            </button>
                         </div>
                      </div>
                      <div className="space-y-3">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Type de remise</label>
                         <div className="flex p-1.5 bg-gray-50 rounded-2xl border border-gray-100 h-[68px]">
                            <button onClick={() => setFormData({...formData, type: 'percentage'})} className={`flex-1 rounded-xl font-bold text-[10px] uppercase transition-all ${formData.type === 'percentage' ? 'bg-brand-blue text-white shadow-md' : 'text-gray-400'}`}>Pourcentage (%)</button>
                            <button onClick={() => setFormData({...formData, type: 'fixed'})} className={`flex-1 rounded-xl font-bold text-[10px] uppercase transition-all ${formData.type === 'fixed' ? 'bg-brand-blue text-white shadow-md' : 'text-gray-400'}`}>Montant Fixe</button>
                         </div>
                      </div>
                   </div>

                   <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Valeur de la réduction</label>
                         <div className="relative">
                            <input type="number" value={formData.discountValue} onChange={e => setFormData({...formData, discountValue: parseInt(e.target.value)})} className="w-full p-5 bg-gray-50 border-none rounded-2xl font-black text-2xl outline-none focus:ring-4 focus:ring-brand-blue/10 transition-all" />
                            <span className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300 font-serif italic text-2xl">{formData.type === 'percentage' ? '%' : 'F'}</span>
                         </div>
                      </div>
                      <div className="space-y-3">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Panier minimum (0 = aucun)</label>
                         <div className="relative">
                           <input 
                             type="number"
                             value={formData.minPurchaseAmount}
                             onChange={(e) => setFormData({...formData, minPurchaseAmount: parseInt(e.target.value)})}
                             className="w-full p-5 bg-gray-50 border-none rounded-2xl font-bold text-lg focus:ring-4 focus:ring-brand-blue/10 transition-all" 
                             placeholder="Ex: 5000"
                           />
                           <span className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300 font-bold">F</span>
                         </div>
                      </div>
                   </div>

                   <div className="space-y-3">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nom de la Campagne (Privé)</label>
                      <input 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full p-5 bg-gray-50 border-none rounded-2xl font-medium text-sm focus:ring-4 focus:ring-brand-blue/10 transition-all" 
                        placeholder="Ex: Offre Flash Story Instagram - Mars"
                      />
                   </div>
                </div>

                <div className="pt-10 border-t border-gray-50 grid md:grid-cols-2 gap-10">
                   <div className="space-y-6">
                      <h4 className="font-bold text-gray-900 uppercase text-[10px] flex items-center gap-2 tracking-widest"><Calendar className="text-brand-blue" size={16}/> Programmation temporelle</h4>
                      <button onClick={() => setFormData({...formData, isScheduled: !formData.isScheduled})} className={`w-full p-5 rounded-2xl border-2 flex items-center justify-between transition-all ${formData.isScheduled ? 'border-brand-blue bg-blue-50 text-brand-blue shadow-lg shadow-blue-500/10' : 'border-gray-50 text-gray-400 bg-gray-50'}`}>
                         <span className="font-bold text-sm">Limiter dans le temps</span>
                         {formData.isScheduled ? <ToggleRight size={32}/> : <ToggleLeft size={32}/>}
                      </button>
                      {formData.isScheduled && (
                        <div className="grid grid-cols-2 gap-3 animate-in slide-in-from-top-2">
                           <div className="space-y-1">
                              <span className="text-[8px] font-black text-gray-400 uppercase ml-1">Date de début</span>
                              <input type="date" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} className="w-full p-4 bg-gray-50 border-none rounded-xl text-xs font-bold" />
                           </div>
                           <div className="space-y-1">
                              <span className="text-[8px] font-black text-gray-400 uppercase ml-1">Date de fin</span>
                              <input type="date" value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} className="w-full p-4 bg-gray-50 border-none rounded-xl text-xs font-bold" />
                           </div>
                        </div>
                      )}
                   </div>
                   <div className="space-y-6">
                      <h4 className="font-bold text-gray-900 uppercase text-[10px] flex items-center gap-2 tracking-widest"><Users className="text-brand-blue" size={16}/> Usage & Exclusivité</h4>
                      <button onClick={() => setFormData({...formData, hasMaxUsage: !formData.hasMaxUsage})} className={`w-full p-5 rounded-2xl border-2 flex items-center justify-between transition-all ${formData.hasMaxUsage ? 'border-brand-blue bg-blue-50 text-brand-blue shadow-lg shadow-blue-500/10' : 'border-gray-50 text-gray-400 bg-gray-50'}`}>
                         <span className="font-bold text-sm">Limiter le stock de codes</span>
                         {formData.hasMaxUsage ? <ToggleRight size={32}/> : <ToggleLeft size={32}/>}
                      </button>
                      {formData.hasMaxUsage && (
                        <input type="number" value={formData.maxUsage} onChange={e => setFormData({...formData, maxUsage: parseInt(e.target.value)})} className="w-full p-4 bg-gray-50 border-none rounded-xl text-center font-black text-sm animate-in slide-in-from-top-2" placeholder="Nombre max d'utilisations" />
                      )}
                      
                      {/* FONCTIONNALITÉ USAGE UNIQUE PAR CLIENT */}
                      <button 
                        onClick={() => setFormData({...formData, oncePerCustomer: !formData.oncePerCustomer})}
                        className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all w-full hover:bg-gray-100 ${formData.oncePerCustomer ? 'border-brand-blue bg-blue-50 text-brand-blue shadow-lg shadow-blue-500/10' : 'bg-gray-50 border-gray-100 text-gray-400'}`}
                      >
                         <div className="text-left">
                            <p className="text-xs font-bold text-gray-700">Usage unique / Client</p>
                            <p className="text-[9px] text-gray-400 uppercase">Un seul code par adresse email</p>
                         </div>
                         {formData.oncePerCustomer ? (
                           <ToggleRight size={28} className="text-brand-blue" />
                         ) : (
                           <ToggleLeft size={28} className="text-gray-300" />
                         )}
                      </button>
                   </div>
                </div>
             </div>

             <div className="flex gap-4">
                <button onClick={() => { setStep('list'); resetForm(); }} className="px-10 py-5 bg-white text-gray-400 border border-gray-200 rounded-3xl font-bold text-sm hover:bg-gray-50 transition-all uppercase tracking-widest">Annuler</button>
                <button onClick={handleSave} className="flex-1 py-5 bg-brand-blue text-white rounded-3xl font-bold text-sm uppercase tracking-widest shadow-2xl hover:bg-blue-600 transition-all flex items-center justify-center gap-3">
                  <CheckCircle2 size={20} /> Valider l'offre de réduction
                </button>
             </div>
          </div>

          {/* SIMULATEUR & APERÇU SOCIAL */}
          <div className="lg:col-span-5 space-y-8 sticky top-6">
             {/* SIMULATEUR DE PRIX */}
             <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-8 flex items-center gap-3"><Calculator size={18} className="text-brand-blue"/> Simulateur de Profitabilité</h4>
                <div className="space-y-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase ml-2">Appliquer sur le produit...</label>
                      <select 
                        value={previewProduct} 
                        onChange={e => setPreviewProduct(e.target.value)}
                        className="w-full p-4 bg-gray-50 rounded-2xl border-none font-bold text-sm outline-none cursor-pointer hover:bg-gray-100 transition-colors"
                      >
                        {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                      </select>
                   </div>
                   
                   <div className="bg-brand-gray p-8 rounded-[32px] flex flex-col gap-6 border border-gray-50 relative overflow-hidden">
                      <div className="flex justify-between items-center relative z-10">
                         <span className="text-xs font-bold text-gray-400 uppercase">Prix Public</span>
                         <span className="text-lg font-bold text-gray-400 line-through">{(courses.find(c => c.id === previewProduct)?.price || 0).toLocaleString()} F</span>
                      </div>
                      <div className="h-px bg-gray-200 w-full relative z-10"></div>
                      <div className="flex justify-between items-center relative z-10">
                         <div className="space-y-1">
                           <span className="text-xs font-black text-brand-blue uppercase">Prix Client Final</span>
                           {formData.minPurchaseAmount && formData.minPurchaseAmount > 0 && (
                             <p className="text-[8px] font-black text-orange-500 uppercase">Valide dès {formData.minPurchaseAmount.toLocaleString()} F</p>
                           )}
                         </div>
                         <span className="text-4xl font-black text-gray-900 tracking-tighter">{Math.round(simulatedPrice).toLocaleString()} <span className="text-xl font-medium text-gray-300">F</span></span>
                      </div>
                      <div className="absolute -top-10 -right-10 opacity-5">
                         <TrendingUp size={150}/>
                      </div>
                   </div>
                </div>
             </div>

             {/* GÉNÉRATEUR D'IMAGE SOCIALE */}
             <div className="bg-brand-black p-10 rounded-[40px] text-white relative overflow-hidden shadow-2xl">
                <div className="relative z-10 space-y-10">
                   <div className="flex justify-between items-center">
                      <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10 shadow-xl"><Camera size={28}/></div>
                      <div className="text-right">
                         <p className="text-[10px] font-black text-brand-blue uppercase tracking-widest">Générateur de Story</p>
                         <h4 className="text-xs font-bold text-gray-400 italic mt-1">Produire le visuel promotionnel</h4>
                      </div>
                   </div>

                   <div className="bg-gradient-to-br from-brand-blue to-blue-800 p-10 rounded-[40px] text-center shadow-inner border-2 border-white/20 relative overflow-hidden group cursor-pointer hover:scale-[1.02] transition-transform">
                      <div className="relative z-10">
                         <h5 className="text-[10px] font-black uppercase tracking-[0.4em] mb-4 opacity-70">EXCLUSIVITÉ KADJOLO</h5>
                         <div className="text-7xl font-black italic tracking-tighter mb-6">-{formData.discountValue || 0}{formData.type === 'percentage' ? '%' : 'F'}</div>
                         <div className="inline-block px-10 py-4 bg-white text-brand-black rounded-2xl font-black text-2xl tracking-[0.3em] shadow-2xl mb-6 uppercase">
                            {formData.code || 'CODE'}
                         </div>
                         <p className="text-[10px] font-black uppercase tracking-widest text-white/50">Valide sur tout le catalogue • 24h</p>
                      </div>
                      <div className="absolute top-0 right-0 p-4 opacity-10 rotate-12 group-hover:rotate-45 transition-transform"><Zap size={150}/></div>
                      <div className="absolute -bottom-10 -left-10 opacity-10 group-hover:scale-150 transition-transform duration-1000"><Sparkles size={200}/></div>
                   </div>

                   <button 
                     onClick={handleExportVisual}
                     disabled={isExporting}
                     className="w-full py-5 bg-white/5 hover:bg-white/10 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-3 border border-white/10 disabled:opacity-50"
                   >
                      {isExporting ? <Loader2 size={18} className="animate-spin" /> : <Share2 size={18}/>} 
                      {isExporting ? 'Génération...' : 'Exporter le visuel HD'}
                   </button>
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-blue/10 rounded-full blur-3xl"></div>
             </div>
          </div>
        </div>
      ) : step === 'bulk' ? (
        <div className="max-w-4xl mx-auto animate-in slide-in-from-bottom-4 duration-500">
           <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm space-y-12">
              <div className="grid md:grid-cols-2 gap-12">
                 <div className="space-y-8">
                    <h3 className="font-black text-gray-900 uppercase tracking-tighter flex items-center gap-3"><Layers className="text-brand-blue"/> Configuration du lot</h3>
                    <div className="space-y-4">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Nombre de codes à générer</label>
                       <input type="number" value={bulkConfig.count} onChange={e => setBulkConfig({...bulkConfig, count: parseInt(e.target.value)})} className="w-full p-4 bg-gray-50 border-none rounded-2xl font-black text-xl text-brand-blue" />
                    </div>
                    <div className="space-y-4">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Préfixe personnalisé</label>
                       <input value={bulkConfig.prefix} onChange={e => setBulkConfig({...bulkConfig, prefix: e.target.value.toUpperCase()})} className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold" placeholder="EX: VIP-" />
                    </div>
                    <div className="space-y-4">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Longueur de la partie aléatoire</label>
                       <input type="number" value={bulkConfig.length} onChange={e => setBulkConfig({...bulkConfig, length: parseInt(e.target.value)})} className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold" />
                    </div>
                 </div>
                 <div className="space-y-8">
                    <h3 className="font-black text-gray-900 uppercase tracking-tighter flex items-center gap-3"><Percent className="text-brand-blue"/> Valeur commune</h3>
                    <div className="space-y-4">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Valeur de remise</label>
                       <div className="relative">
                          <input type="number" value={bulkConfig.value} onChange={e => setBulkConfig({...bulkConfig, value: parseInt(e.target.value)})} className="w-full p-4 bg-gray-50 border-none rounded-2xl font-black text-xl" />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-gray-300">{bulkConfig.type === 'percentage' ? '%' : 'F'}</span>
                       </div>
                    </div>
                    <div className="space-y-4">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Type</label>
                       <div className="flex bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
                          <button onClick={() => setBulkConfig({...bulkConfig, type: 'percentage'})} className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase transition-all ${bulkConfig.type === 'percentage' ? 'bg-brand-blue text-white shadow-md' : 'text-gray-400'}`}>%</button>
                          <button onClick={() => setBulkConfig({...bulkConfig, type: 'fixed'})} className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase transition-all ${bulkConfig.type === 'fixed' ? 'bg-brand-blue text-white shadow-md' : 'text-gray-400'}`}>F</button>
                       </div>
                    </div>
                    <div className="bg-blue-50 p-6 rounded-[32px] border border-blue-100">
                       <p className="text-[10px] text-blue-700 font-bold uppercase tracking-widest mb-1 flex items-center gap-2"><Check size={14}/> Usage unique activé</p>
                       <p className="text-[9px] text-blue-500 italic">Par défaut, chaque code du lot ne sera utilisable qu'une seule fois.</p>
                    </div>
                 </div>
              </div>
              <div className="flex gap-4">
                 <button onClick={() => setStep('list')} className="px-10 py-5 bg-white text-gray-400 rounded-3xl font-black text-xs uppercase tracking-widest">Annuler</button>
                 <button onClick={handleBulkGenerate} className="flex-1 py-5 bg-brand-blue text-white rounded-3xl font-black text-xs uppercase tracking-widest shadow-2xl hover:scale-[1.02] transition-transform flex items-center justify-center gap-3">
                    <Zap size={18}/> Lancer la génération de {bulkConfig.count} codes
                 </button>
              </div>
           </div>
        </div>
      ) : step === 'analytics' ? (
        <div className="space-y-10 animate-in fade-in duration-500">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {coupons.length > 0 ? coupons.map(c => {
                 const perf = getCouponPerformance(c.code);
                 return (
                 <div key={c.id} className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm space-y-8 hover:shadow-xl transition-all group">
                    <div className="flex justify-between items-start">
                       <div className="bg-gray-50 px-6 py-3 rounded-2xl border border-gray-100 group-hover:border-brand-blue transition-colors">
                          <span className="text-2xl font-black italic tracking-widest text-gray-900">{c.code}</span>
                       </div>
                       <div className="p-3 bg-blue-50 text-brand-blue rounded-xl shadow-sm"><TrendingUp size={24}/></div>
                    </div>
                    <div>
                       <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Impact Ventes</p>
                       <p className="text-4xl font-black text-gray-900">{perf.revenue.toLocaleString()} <span className="text-lg font-bold text-gray-300">F</span></p>
                    </div>
                    <div className="grid grid-cols-2 gap-6 pt-6 border-t border-gray-50">
                       <div>
                          <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Conversion</p>
                          <p className="text-xl font-black text-brand-blue">{perf.conversion}%</p>
                       </div>
                       <div>
                          <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Utilisations</p>
                          <p className="text-xl font-black text-gray-900">{c.usage || 0}</p>
                       </div>
                    </div>
                 </div>
              );}) : (
                 <div className="col-span-full py-40 text-center bg-white rounded-[40px] border border-dashed border-gray-200">
                    <History size={48} className="mx-auto text-gray-200 mb-6" />
                    <p className="text-xl font-serif text-gray-400 italic">Aucune donnée historique disponible pour le moment.</p>
                 </div>
              )}
           </div>
        </div>
      ) : (
        <div className="space-y-8 pb-24">
           {/* FILTRES & RECHERCHE */}
           <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex flex-col lg:flex-row gap-6">
              <div className="relative flex-1">
                 <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={22} />
                 <input 
                   value={searchTerm} 
                   onChange={(e) => setSearchTerm(e.target.value)} 
                   placeholder="Rechercher par nom ou code..." 
                   className="w-full pl-16 pr-6 py-5 bg-gray-50 border-none rounded-2xl outline-none font-bold text-lg focus:ring-2 focus:ring-brand-blue/10 transition-all" 
                 />
              </div>
              <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
                 {[
                   { id: 'all', label: 'Toutes', icon: <History size={16}/> },
                   { id: 'active', label: 'Actives', icon: <CheckCircle2 size={16}/> },
                   { id: 'scheduled', label: 'Planifiées', icon: <Clock size={16}/> },
                   { id: 'paused', label: 'Suspendues', icon: <Play size={16}/> }
                 ].map(f => (
                   <button 
                     key={f.id} 
                     onClick={() => setStatusFilter(f.id as any)} 
                     className={`px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all flex items-center gap-3 ${statusFilter === f.id ? 'bg-brand-blue text-white shadow-xl scale-105' : 'bg-gray-50 text-gray-400 hover:bg-gray-100 border border-transparent'}`}
                   >
                     {f.icon} {f.label}
                   </button>
                 ))}
                 <button onClick={handleExportCSV} className="bg-white text-gray-400 px-6 py-4 rounded-2xl font-bold text-xs flex items-center gap-2 border border-gray-100 hover:text-brand-blue">
                   <Download size={16}/> CSV
                 </button>
              </div>
           </div>

           {/* LISTE DES COUPONS */}
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCoupons.map(coupon => {
                 const isExpired = coupon.isScheduled && coupon.endDate && new Date(coupon.endDate) < new Date();
                 const isScheduled = coupon.isScheduled && coupon.startDate && new Date(coupon.startDate) > new Date();
                 
                 return (
                 <div key={coupon.id} className="bg-white rounded-[40px] border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-2xl transition-all duration-500 flex flex-col hover:-translate-y-2">
                    <div className={`p-10 border-b border-gray-50 flex justify-between items-start ${!coupon.isActive || isExpired ? 'bg-gray-50/30' : 'bg-white'}`}>
                       <div className="flex flex-col gap-3">
                          <div className="flex items-center gap-2">
                             <div className={`w-2.5 h-2.5 rounded-full ${coupon.isActive && !isExpired && !isScheduled ? 'bg-green-500 animate-pulse' : isScheduled ? 'bg-blue-400' : 'bg-gray-300'}`}></div>
                             <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${coupon.isActive && !isExpired && !isScheduled ? 'text-green-600' : 'text-gray-400'}`}>
                                {isExpired ? 'Offre Expirée' : isScheduled ? 'Planifiée' : coupon.isActive ? 'Active' : 'Suspendue'}
                             </span>
                          </div>
                          <div className="bg-gray-50 px-6 py-4 rounded-2xl border border-gray-100 group-hover:border-brand-blue transition-all flex items-center justify-between min-w-[180px]">
                             <span className="text-2xl font-black text-gray-900 tracking-widest italic">{coupon.code}</span>
                             <button 
                               onClick={() => handleCopy(coupon.code, coupon.id)}
                               className={`p-2 rounded-xl transition-all ${copiedId === coupon.id ? 'bg-green-500 text-white' : 'text-gray-300 hover:text-brand-blue'}`}
                             >
                                {copiedId === coupon.id ? <Check size={16}/> : <Copy size={16}/>}
                             </button>
                          </div>
                       </div>
                       <div className="flex flex-col gap-3">
                          <button 
                            onClick={() => toggleCouponStatus(coupon.id)} 
                            className={`p-2 rounded-xl transition-all ${coupon.isActive ? 'text-brand-blue bg-blue-50' : 'text-gray-300 bg-gray-100'}`}
                          >
                            {coupon.isActive ? <ToggleRight size={44} /> : <ToggleLeft size={44} />}
                          </button>
                          <div className="flex gap-2">
                             <button onClick={() => startDuplicate(coupon)} className="p-2.5 text-gray-300 hover:text-brand-blue bg-gray-50 rounded-xl transition-all" title="Dupliquer"><Layers size={16}/></button>
                             <button onClick={() => setDeleteTarget(coupon)} className="p-2.5 text-gray-300 hover:text-red-500 bg-gray-50 rounded-xl transition-all" title="Supprimer"><Trash2 size={16}/></button>
                          </div>
                       </div>
                    </div>

                    <div className="p-10 space-y-10 flex-1">
                       <div className="flex justify-between items-end">
                          <div>
                             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Valeur Remise</p>
                             <p className="text-6xl font-black text-gray-900 tracking-tighter">-{coupon.discountValue}<span className="text-2xl text-gray-300 ml-1 font-serif italic">{coupon.type === 'percentage' ? '%' : 'F'}</span></p>
                          </div>
                          <div className="text-right">
                             <p className="text-[10px] font-black text-gray-400 uppercase mb-3 tracking-widest">Utilisation</p>
                             <div className="w-24 bg-gray-100 h-2.5 rounded-full overflow-hidden mb-2">
                                <div 
                                  className={`h-full transition-all duration-1000 ${((coupon.usage || 0) / (coupon.maxUsage || 100)) > 0.8 ? 'bg-red-500' : 'bg-brand-blue'}`} 
                                  style={{width: `${Math.min(100, ((coupon.usage || 0) / (coupon.maxUsage || 100)) * 100)}%`}}
                                ></div>
                             </div>
                             <p className="text-[10px] font-black text-gray-500 tracking-tighter">{coupon.usage || 0} / {coupon.maxUsage || '∞'} Ventes</p>
                          </div>
                       </div>

                       {coupon.minPurchaseAmount && coupon.minPurchaseAmount > 0 ? (
                         <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-2xl border border-orange-100">
                           <AlertTriangle size={14} className="text-orange-500" />
                           <p className="text-[10px] font-black text-orange-600 uppercase">Min. d'achat : {coupon.minPurchaseAmount.toLocaleString()} F</p>
                         </div>
                       ) : null}

                       {coupon.oncePerCustomer && (
                         <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-2xl border border-purple-100">
                           <UserCheck size={14} className="text-purple-500" />
                           <p className="text-[9px] font-black text-purple-600 uppercase tracking-widest">Limité à 1 usage par client</p>
                         </div>
                       )}

                       <div className="bg-blue-50/50 p-6 rounded-3xl border border-blue-100 flex items-center gap-5 group-hover:bg-blue-50 transition-colors">
                          <div className="w-12 h-12 bg-white rounded-2xl text-brand-blue shadow-sm flex items-center justify-center shrink-0"><TrendingUp size={20}/></div>
                          <div>
                             <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Impact CA</p>
                             <p className="text-sm font-black text-blue-900">{getCouponPerformance(coupon.code).revenue.toLocaleString()} F attribués</p>
                          </div>
                       </div>
                    </div>

                    <div className="p-6 bg-gray-50/30 border-t border-gray-100 flex justify-between items-center group-hover:bg-blue-50 transition-colors">
                       <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest truncate max-w-[150px]">
                         <Coins size={14} className="text-gray-300"/> {coupon.name || 'Offre Standard'}
                       </div>
                       <button onClick={() => startEdit(coupon)} className="text-[10px] font-black text-brand-blue uppercase tracking-widest flex items-center gap-2 hover:translate-x-2 transition-transform">
                         Modifier l'offre <Edit3 size={14}/>
                       </button>
                    </div>
                 </div>
              )})}

              {filteredCoupons.length === 0 && (
                <div className="col-span-full py-40 text-center bg-white rounded-[40px] border-2 border-dashed border-gray-100 flex flex-col items-center justify-center">
                   <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-8 text-gray-200">
                     <Tag size={48} />
                   </div>
                   <h3 className="text-3xl font-serif italic text-gray-300 mb-4">Aucune offre trouvée</h3>
                   <button onClick={() => { resetForm(); setStep('editor'); }} className="bg-brand-blue text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl hover:scale-105 transition-transform">
                      Lancer ma première offre
                   </button>
                </div>
              )}
           </div>
        </div>
      )}
    </div>
  );
};

export default DiscountsSection;

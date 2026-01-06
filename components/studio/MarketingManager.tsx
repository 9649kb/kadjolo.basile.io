
import React, { useState, useMemo } from 'react';
import { 
  Tag, ArrowRight, ChevronLeft, Trash2, ToggleRight, ToggleLeft, 
  PlusCircle, Info, Zap, X, Sparkles, Percent, ArrowLeft, RefreshCw,
  CheckCircle2, Circle, Smartphone, Calendar, Lock, Check, ShoppingBag, Search,
  MousePointerClick, MessageSquare, Clock, LogOut, Layout, Eye, ChevronDown, Plus,
  Globe, AlertCircle, Edit3, Send, Rocket, Monitor, MousePointer2, Target
} from 'lucide-react';
import { useData, EnhancedCoupon } from '../../contexts/DataContext';
import { useUser } from '../../contexts/UserContext';
import { Course, Popup, Banner, Campaign } from '../../types';

type MarketingSubView = 'home' | 'discounts' | 'popups' | 'banners' | 'campaigns';
type Step = 'list' | 'templates' | 'editor';

const MarketingManager: React.FC = () => {
  const { user } = useUser();
  const { courses, coupons, addCoupon, deleteCoupon, toggleCouponStatus } = useData();
  const [activeView, setActiveView] = useState<MarketingSubView>('home');
  const [step, setStep] = useState<Step>('list');
  const [templateFilter, setTemplateFilter] = useState<string>('Tout');
  const [templateSearch, setTemplateSearch] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  
  // --- ÉTATS RÉDUCTIONS ---
  const [couponForm, setCouponForm] = useState<Partial<EnhancedCoupon>>({
    name: '', code: '', discountValue: 0, type: 'percentage', isActive: false, limitToProducts: false, selectedProductIds: [], hasMaxUsage: false, maxUsage: 0, isScheduled: false, startDate: '', endDate: '', usage: 0, discountType: 'percentage'
  });

  // --- ÉTATS POPUPS ---
  const [popups, setPopups] = useState<Popup[]>([
    { id: 'p1', name: 'Bienvenue', title: 'CADEAU 🎁', message: 'Utilisez KADJOLO10 pour -10%', ctaText: 'Profiter', ctaUrl: '#', trigger: 'delay', delaySeconds: 5, isActive: true, backgroundColor: '#2563eb', textColor: '#ffffff' }
  ]);
  const [popupForm, setPopupForm] = useState<Partial<Popup>>({ name: '', title: '', message: '', ctaText: 'Cliquer', ctaUrl: '', trigger: 'delay', delaySeconds: 5, isActive: false, backgroundColor: '#ffffff', textColor: '#000000' });

  // --- ÉTATS BANNIÈRES ---
  const [banners, setBanners] = useState<Banner[]>([
    { id: 'b1', name: 'Promo Été', text: '🚀 Profitez de -50% sur le pack Leadership !', ctaText: 'En savoir plus', ctaUrl: '#', isActive: true, backgroundColor: '#000000', textColor: '#ffffff' }
  ]);
  const [bannerForm, setBannerForm] = useState<Partial<Banner>>({ name: '', text: '', ctaText: 'Voir', ctaUrl: '', isActive: false, backgroundColor: '#2563eb', textColor: '#ffffff' });

  // --- ÉTATS CAMPAGNES ---
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    { id: 'cp1', name: 'Lien Bio Instagram', source: 'Instagram', trackingLink: 'https://kadjolo.com/s/ig-bio', isActive: true, clicks: 145, sales: 12, revenue: 180000, createdAt: '2023-10-20' }
  ]);
  const [campaignForm, setCampaignForm] = useState({ name: '', source: '' });

  // --- TEMPLATES POPUPS ---
  const POPUP_TEMPLATES = [
    { id: 't_pasta', name: 'Style Gourmand', category: 'Annonce', title: 'LES PÂTES NE SONT JAMAIS ASSEZ', message: 'Nouveau menu dégustation disponible !', ctaText: 'VOIR PLUS', backgroundColor: '#000000', textColor: '#ffffff', preview: 'https://images.unsplash.com/photo-1473093226795-af9932fe5856?q=80&w=400' },
    { id: 't_bf', name: 'Black Friday Gold', category: 'Promotion', title: 'BLACK FRIDAY : -50%', message: 'Seulement aujourd\'hui sur tout le site.', ctaText: 'ACHETER', backgroundColor: '#1a1a1a', textColor: '#facc15', preview: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=400' },
    { id: 't_news', name: 'Capture Newsletter', category: 'Annonce', title: 'REJOIGNEZ L\'ÉLITE', message: 'Inscrivez-vous pour recevoir mes conseils privés.', ctaText: 'S\'ABONNER', backgroundColor: '#f97316', textColor: '#ffffff', preview: 'https://images.unsplash.com/photo-1557200134-90327ee9fafa?q=80&w=400' }
  ];

  // --- ACTIONS ---
  const handlePublishCoupon = () => {
    if (!couponForm.name || !couponForm.code) return;
    addCoupon({ ...couponForm as EnhancedCoupon, id: Date.now().toString(), isActive: true, usage: 0, discountType: couponForm.type as any });
    setIsCreating(false);
  };

  const handlePublishPopup = () => {
    if (!popupForm.name || !popupForm.title) return;
    setPopups([{ ...popupForm as Popup, id: Date.now().toString(), isActive: true }, ...popups]);
    setStep('list');
  };

  const handlePublishBanner = () => {
    if (!bannerForm.name || !bannerForm.text) return;
    setBanners([{ ...bannerForm as Banner, id: Date.now().toString(), isActive: true }, ...banners]);
    setStep('list');
  };

  const handleCreateCampaign = () => {
    if (!campaignForm.name) return;
    const newCp: Campaign = {
      id: Date.now().toString(),
      name: campaignForm.name,
      source: campaignForm.source,
      trackingLink: `https://kadjolo.com/s/${campaignForm.name.toLowerCase().replace(/\s+/g, '-')}`,
      isActive: true,
      clicks: 0,
      sales: 0,
      revenue: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setCampaigns([newCp, ...campaigns]);
    setIsCreating(false);
    setCampaignForm({ name: '', source: '' });
  };

  // --- RENDERS ---

  const renderHome = () => (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div>
        <h1 className="text-5xl font-black text-gray-900 tracking-tighter uppercase italic">Marketing</h1>
        <p className="text-gray-500 text-lg mt-2 font-medium">Boostez vos ventes avec des outils marketing puissants et faciles à utiliser.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 max-w-2xl">
        <button onClick={() => { setActiveView('discounts'); setIsCreating(false); }} className="group bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl transition-all flex items-center justify-between text-left">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-blue-50 text-brand-blue rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform"><Tag size={32} /></div>
            <div>
              <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Réductions</h3>
              <p className="text-gray-400 font-medium max-w-xs">Offrez des réductions et codes promo pour déclencher l'achat et...</p>
            </div>
          </div>
          <div className="p-4 bg-gray-50 text-gray-300 rounded-2xl group-hover:bg-brand-blue group-hover:text-white transition-all"><ArrowRight size={24} /></div>
        </button>

        <button onClick={() => { setActiveView('popups'); setStep('list'); }} className="group bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl transition-all flex items-center justify-between text-left">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-blue-50 text-brand-blue rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform"><MessageSquare size={32} /></div>
            <div>
              <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Popups</h3>
              <p className="text-gray-400 font-medium max-w-xs">Mettez en avant vos offres et promotions à un moment clé pour...</p>
            </div>
          </div>
          <div className="p-4 bg-gray-50 text-gray-300 rounded-2xl group-hover:bg-brand-blue group-hover:text-white transition-all"><ArrowRight size={24} /></div>
        </button>

        <button onClick={() => { setActiveView('banners'); setStep('list'); }} className="group bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl transition-all flex items-center justify-between text-left">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-yellow-50 text-yellow-600 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform"><Monitor size={32} /></div>
            <div>
              <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Bannières</h3>
              <p className="text-gray-400 font-medium max-w-xs">Diffusez un message promotionnel en haut de votre boutique pour...</p>
            </div>
          </div>
          <div className="p-4 bg-gray-50 text-gray-300 rounded-2xl group-hover:bg-yellow-500 group-hover:text-white transition-all"><ArrowRight size={24} /></div>
        </button>

        <button onClick={() => { setActiveView('campaigns'); setIsCreating(false); }} className="group bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl transition-all flex items-center justify-between text-left">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform"><Target size={32} /></div>
            <div>
              <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Campagnes</h3>
              <p className="text-gray-400 font-medium max-w-xs">Créez des liens de suivi pour savoir quelles publicités ou réseaux...</p>
            </div>
          </div>
          <div className="p-4 bg-gray-50 text-gray-300 rounded-2xl group-hover:bg-green-600 group-hover:text-white transition-all"><ArrowRight size={24} /></div>
        </button>
      </div>
    </div>
  );

  const renderPopups = () => {
    if (step === 'list') return (
      <div className="space-y-8 animate-in slide-in-from-bottom-5">
        <div className="flex justify-between items-center bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm">
           <button onClick={() => setActiveView('home')} className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-400 hover:text-brand-blue transition-colors"><ArrowLeft size={14}/> Retour</button>
           <button onClick={() => setStep('templates')} className="bg-brand-blue text-white px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center gap-2"><PlusCircle size={18} /> Nouvelle Popup</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {popups.map(p => (
            <div key={p.id} className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm relative group">
              <div className="flex justify-between mb-6">
                <div>
                   <h3 className="font-black text-gray-900 text-sm uppercase tracking-widest">{p.name}</h3>
                   <div className="flex items-center gap-2 mt-1">
                      <div className={`w-2 h-2 rounded-full ${p.isActive ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}></div>
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{p.isActive ? 'En ligne' : 'Brouillon'}</span>
                   </div>
                </div>
                <button onClick={() => setPopups(popups.map(x => x.id === p.id ? {...x, isActive: !x.isActive} : x))} className={`p-2 rounded-xl transition-all ${p.isActive ? 'text-brand-blue' : 'text-gray-300'}`}>
                  {p.isActive ? <ToggleRight size={40} /> : <ToggleLeft size={40} />}
                </button>
              </div>
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 text-[10px] text-gray-500 italic mb-6 leading-relaxed">"{p.message}"</div>
              <div className="flex justify-between items-center border-t pt-6">
                 <button className="p-2 bg-gray-50 text-gray-400 hover:text-brand-blue rounded-xl transition-colors"><Edit3 size={16}/></button>
                 <button onClick={() => setPopups(popups.filter(x => x.id !== p.id))} className="p-2 bg-gray-50 text-gray-300 hover:text-red-500 rounded-xl transition-colors"><Trash2 size={16}/></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );

    if (step === 'templates') return (
      <div className="animate-in slide-in-from-right-10 space-y-10">
        <button onClick={() => setStep('list')} className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-400 hover:text-brand-blue transition-colors"><ArrowLeft size={14}/> Retour à la liste</button>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           <button onClick={() => { setPopupForm({ name: 'Perso', title: '', message: '', ctaText: 'Valider', backgroundColor: '#ffffff', textColor: '#000000' }); setStep('editor'); }} className="group bg-white rounded-[40px] border-2 border-dashed border-gray-200 p-12 hover:border-brand-blue hover:bg-blue-50 transition-all flex flex-col items-center justify-center min-h-[300px]">
              <Plus size={40} className="text-gray-300 group-hover:text-brand-blue mb-4" />
              <p className="font-black text-gray-400 uppercase text-xs tracking-widest group-hover:text-brand-blue">Partir de zéro</p>
           </button>
           {POPUP_TEMPLATES.map(t => (
             <div key={t.id} className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden group hover:shadow-2xl transition-all relative">
                <div className="aspect-video relative overflow-hidden bg-gray-50">
                   <img src={t.preview} className="w-full h-full object-cover opacity-80" alt="" />
                   <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button onClick={() => { setPopupForm({ ...popupForm, name: t.name, title: t.title, message: t.message, ctaText: t.ctaText, backgroundColor: t.backgroundColor, textColor: t.textColor }); setStep('editor'); }} className="bg-brand-blue text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl">Utiliser ce modèle</button>
                   </div>
                </div>
                <div className="p-6">
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{t.category}</p>
                   <h3 className="font-black text-lg text-gray-900 uppercase italic tracking-tighter">{t.name}</h3>
                </div>
             </div>
           ))}
        </div>
      </div>
    );

    if (step === 'editor') return (
      <div className="animate-in slide-in-from-right-10 max-w-5xl mx-auto space-y-8">
         <div className="flex justify-between items-center bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm">
            <button onClick={() => setStep('templates')} className="p-3 bg-gray-50 text-gray-400 rounded-2xl hover:text-gray-900 transition-colors"><ChevronLeft size={20}/></button>
            <button onClick={handlePublishPopup} className="bg-brand-black text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl flex items-center gap-3 hover:scale-105 transition-all"><Rocket size={18}/> PUBLIER L'IMPULSION</button>
         </div>
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm space-y-6">
               <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Nom de l'impulsion</label>
                  <input value={popupForm.name} onChange={e => setPopupForm({...popupForm, name: e.target.value})} className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold" />
               </div>
               <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Titre visible</label>
                  <input value={popupForm.title} onChange={e => setPopupForm({...popupForm, title: e.target.value})} className="w-full p-4 bg-gray-50 border-none rounded-2xl font-black text-lg" />
               </div>
               <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Message persuasif</label>
                  <textarea value={popupForm.message} onChange={e => setPopupForm({...popupForm, message: e.target.value})} className="w-full h-32 p-5 bg-gray-50 border-none rounded-2xl font-medium resize-none" />
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3"><label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Fond</label><input type="color" value={popupForm.backgroundColor} onChange={e => setPopupForm({...popupForm, backgroundColor: e.target.value})} className="w-full h-12 rounded-xl border-none cursor-pointer" /></div>
                  <div className="space-y-3"><label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Texte</label><input type="color" value={popupForm.textColor} onChange={e => setPopupForm({...popupForm, textColor: e.target.value})} className="w-full h-12 rounded-xl border-none cursor-pointer" /></div>
               </div>
            </div>
            <div className="bg-gray-100 rounded-[40px] flex flex-col items-center justify-center p-12 relative overflow-hidden border border-gray-200">
               <div className="absolute top-6 left-8 text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2"><Eye size={12} className="text-brand-blue"/> APERÇU LIVE VISITEUR</div>
               <div className="w-full max-w-sm rounded-[32px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] p-10 relative" style={{ backgroundColor: popupForm.backgroundColor, color: popupForm.textColor }}>
                  <button className="absolute top-6 right-6 opacity-30"><X size={20}/></button>
                  <h3 className="text-3xl font-black uppercase italic tracking-tighter mb-4 leading-none">{popupForm.title || "VOTRE TITRE"}</h3>
                  <p className="text-sm font-medium mb-10 leading-relaxed opacity-90">{popupForm.message || "Écrivez ici le texte qui fera passer vos visiteurs à l'action."}</p>
                  <div className="w-full py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl flex items-center justify-center gap-2" style={{ backgroundColor: popupForm.textColor, color: popupForm.backgroundColor }}>{popupForm.ctaText} <ArrowRight size={16}/></div>
               </div>
               <div className="mt-12 flex items-center gap-2 text-[9px] font-black text-gray-400 uppercase tracking-widest bg-white/50 px-4 py-2 rounded-full border border-white"><Smartphone size={12}/> ADAPTÉ POUR MOBILE & DESKTOP</div>
            </div>
         </div>
      </div>
    );
  };

  const renderBanners = () => {
    if (step === 'list') return (
      <div className="space-y-8 animate-in slide-in-from-bottom-5">
        <div className="flex justify-between items-center bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm">
           <button onClick={() => setActiveView('home')} className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-400 hover:text-brand-blue transition-colors"><ArrowLeft size={14}/> Retour</button>
           <button onClick={() => setStep('templates')} className="bg-brand-blue text-white px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center gap-2"><PlusCircle size={18} /> Nouvelle Bannière</button>
        </div>
        <div className="space-y-4">
           {banners.map(b => (
              <div key={b.id} className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex items-center justify-between group">
                 <div className="flex items-center gap-6">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner" style={{backgroundColor: b.backgroundColor, color: b.textColor}}><Monitor size={24}/></div>
                    <div>
                       <h3 className="font-black text-gray-900 text-sm uppercase tracking-widest">{b.name}</h3>
                       <p className="text-xs text-gray-400 font-medium line-clamp-1">{b.text}</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-4">
                    <button onClick={() => setBanners(banners.map(x => x.id === b.id ? {...x, isActive: !x.isActive} : x))} className={`p-2 rounded-xl transition-all ${b.isActive ? 'text-brand-blue' : 'text-gray-300'}`}>
                      {b.isActive ? <ToggleRight size={40} /> : <ToggleLeft size={40} />}
                    </button>
                    <button onClick={() => setBanners(banners.filter(x => x.id !== b.id))} className="p-2 text-gray-300 hover:text-red-500 transition-colors"><Trash2 size={20}/></button>
                 </div>
              </div>
           ))}
        </div>
      </div>
    );

    if (step === 'templates') return (
      <div className="animate-in slide-in-from-right-10 space-y-10">
        <button onClick={() => setStep('list')} className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-400 hover:text-brand-blue transition-colors"><ArrowLeft size={14}/> Retour à la liste</button>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <button onClick={() => { setBannerForm({ name: 'Promo 1', text: 'Offre Limitée !', ctaText: 'Voir', backgroundColor: '#2563eb', textColor: '#ffffff' }); setStep('editor'); }} className="bg-white p-8 rounded-[32px] border border-gray-100 flex flex-col items-center justify-center min-h-[200px] hover:border-brand-blue group">
              <Plus className="text-gray-300 group-hover:text-brand-blue mb-2" />
              <p className="font-black text-[10px] uppercase text-gray-400 group-hover:text-brand-blue">Template Alerte Bleue</p>
           </button>
           <button onClick={() => { setBannerForm({ name: 'Promo Black', text: 'Black Friday is here.', ctaText: 'Shop', backgroundColor: '#000000', textColor: '#ffffff' }); setStep('editor'); }} className="bg-brand-black p-8 rounded-[32px] border border-white/10 flex flex-col items-center justify-center min-h-[200px] hover:scale-105 transition-transform group">
              <Monitor className="text-gray-600 mb-2" />
              <p className="font-black text-[10px] uppercase text-gray-500">Template Dark Mode</p>
           </button>
        </div>
      </div>
    );

    if (step === 'editor') return (
      <div className="animate-in slide-in-from-right-10 max-w-5xl mx-auto space-y-8">
         <div className="flex justify-between items-center bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm">
            <button onClick={() => setStep('templates')} className="p-3 bg-gray-50 text-gray-400 rounded-2xl hover:text-gray-900 transition-colors"><ChevronLeft size={20}/></button>
            <button onClick={handlePublishBanner} className="bg-brand-black text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl flex items-center gap-3 hover:scale-105 transition-all"><Rocket size={18}/> PUBLIER LE BANDEAU</button>
         </div>
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm space-y-6">
               <div className="space-y-3"><label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Nom interne</label><input value={bannerForm.name} onChange={e => setBannerForm({...bannerForm, name: e.target.value})} className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold" /></div>
               <div className="space-y-3"><label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Texte d'annonce</label><input value={bannerForm.text} onChange={e => setBannerForm({...bannerForm, text: e.target.value})} className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold" /></div>
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3"><label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Fond</label><input type="color" value={bannerForm.backgroundColor} onChange={e => setBannerForm({...bannerForm, backgroundColor: e.target.value})} className="w-full h-12 rounded-xl border-none cursor-pointer" /></div>
                  <div className="space-y-3"><label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Texte</label><input type="color" value={bannerForm.textColor} onChange={e => setBannerForm({...bannerForm, textColor: e.target.value})} className="w-full h-12 rounded-xl border-none cursor-pointer" /></div>
               </div>
            </div>
            <div className="bg-gray-100 rounded-[40px] flex flex-col items-center justify-center p-12 border border-gray-200 relative">
               <div className="absolute top-6 left-8 text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2"><Eye size={12} className="text-brand-blue"/> APERÇU BOUTIQUE</div>
               <div className="w-full p-4 rounded-xl flex items-center justify-center gap-4 text-center font-black text-xs uppercase tracking-widest shadow-2xl" style={{backgroundColor: bannerForm.backgroundColor, color: bannerForm.textColor}}>
                  {bannerForm.text || "VOTRE MESSAGE ICI"}
                  <div className="bg-white/20 px-3 py-1 rounded text-[9px]">{bannerForm.ctaText}</div>
               </div>
            </div>
         </div>
      </div>
    );
  };

  const renderDiscounts = () => {
    if (isCreating) return (
      <div className="animate-in slide-in-from-right-10 max-w-xl mx-auto space-y-8">
         <div className="flex items-center gap-4">
            <button onClick={() => setIsCreating(false)} className="p-3 bg-white text-gray-400 rounded-2xl hover:text-gray-900 shadow-sm border border-gray-100"><ChevronLeft size={20}/></button>
            <h2 className="text-2xl font-black text-gray-900 uppercase italic tracking-tighter">Créer une Réduction</h2>
         </div>
         <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm space-y-6">
            <div className="space-y-3"><label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Nom de l'offre</label><input value={couponForm.name} onChange={e => setCouponForm({...couponForm, name: e.target.value})} className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold" /></div>
            <div className="space-y-3"><label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Code Coupon</label><input value={couponForm.code} onChange={e => setCouponForm({...couponForm, code: e.target.value.toUpperCase()})} className="w-full p-4 bg-gray-50 border-none rounded-2xl font-black tracking-widest text-lg" placeholder="EX: PROMO20" /></div>
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-3"><label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Valeur</label><input type="number" value={couponForm.discountValue} onChange={e => setCouponForm({...couponForm, discountValue: parseInt(e.target.value)})} className="w-full p-4 bg-gray-50 border-none rounded-2xl font-black" /></div>
               <div className="space-y-3"><label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Type</label><select value={couponForm.type} onChange={e => setCouponForm({...couponForm, type: e.target.value as any})} className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold"><option value="percentage">% Pourcentage</option><option value="fixed">F Montant fixe</option></select></div>
            </div>
            <button onClick={handlePublishCoupon} className="w-full py-6 bg-brand-black text-white rounded-[24px] font-black text-xs uppercase tracking-widest shadow-2xl flex items-center justify-center gap-3 hover:scale-105 transition-all"><Rocket size={20}/> PUBLIER LA RÉDUCTION</button>
         </div>
      </div>
    );

    return (
      <div className="space-y-8 animate-in slide-in-from-bottom-5">
        <div className="flex justify-between items-center bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm">
           <button onClick={() => setActiveView('home')} className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-400 hover:text-brand-blue transition-colors"><ArrowLeft size={14}/> Retour</button>
           <button onClick={() => setIsCreating(true)} className="bg-brand-blue text-white px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center gap-2"><PlusCircle size={18} /> Nouvelle Réduction</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {coupons.map(c => (
              <div key={c.id} className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm relative">
                 <div className="flex justify-between items-start mb-6">
                    <div>
                       <h3 className="font-black text-gray-900 text-sm uppercase tracking-widest mb-1">{c.name}</h3>
                       <div className="bg-gray-100 px-3 py-1 rounded-lg text-lg font-black tracking-widest">{c.code}</div>
                    </div>
                    <button onClick={() => toggleCouponStatus(c.id)} className={`p-2 rounded-xl transition-all ${c.isActive ? 'text-brand-blue' : 'text-gray-300'}`}>{c.isActive ? <ToggleRight size={40} /> : <ToggleLeft size={40} />}</button>
                 </div>
                 <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-50">
                    <div><p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Remise</p><p className="text-xl font-black text-gray-900">{c.discountValue}{c.type === 'percentage' ? '%' : ' F'}</p></div>
                    <div className="text-right"><p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Usages</p><p className="text-xl font-black text-brand-blue">{c.usage}</p></div>
                 </div>
                 <button onClick={() => deleteCoupon(c.id)} className="absolute top-4 right-16 p-2 text-gray-300 hover:text-red-500"><Trash2 size={18}/></button>
              </div>
           ))}
        </div>
      </div>
    );
  };

  const renderCampaigns = () => (
    <div className="space-y-8 animate-in slide-in-from-bottom-5">
      <div className="flex justify-between items-center bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm">
         <button onClick={() => setActiveView('home')} className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-400 hover:text-brand-blue transition-colors"><ArrowLeft size={14}/> Retour</button>
         <button onClick={() => setIsCreating(true)} className="bg-green-600 text-white px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center gap-2"><Target size={18} /> Nouvelle Campagne</button>
      </div>

      {isCreating && (
        <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm space-y-6 max-w-xl mx-auto animate-in zoom-in-95">
           <div className="space-y-3"><label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Nom de la campagne</label><input value={campaignForm.name} onChange={e => setCampaignForm({...campaignForm, name: e.target.value})} className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold" placeholder="Ex: Pub Facebook Octobre" /></div>
           <div className="space-y-3"><label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Source (Réseau social, site...)</label><input value={campaignForm.source} onChange={e => setCampaignForm({...campaignForm, source: e.target.value})} className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold" placeholder="Ex: Facebook Ads" /></div>
           <button onClick={handleCreateCampaign} className="w-full py-5 bg-brand-black text-white rounded-[24px] font-black text-xs uppercase tracking-widest shadow-2xl flex items-center justify-center gap-3 hover:scale-105 transition-all"><Rocket size={20}/> CRÉER LE LIEN DE SUIVI</button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {campaigns.map(c => (
            <div key={c.id} className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm group">
               <div className="flex justify-between items-start mb-6">
                  <div className="p-3 bg-green-50 text-green-600 rounded-2xl shadow-inner"><Target size={24}/></div>
                  <div className="text-right">
                     <p className="font-black text-gray-900 text-sm uppercase tracking-widest">{c.name}</p>
                     <p className="text-[9px] text-gray-400 font-bold uppercase">{c.source}</p>
                  </div>
               </div>
               <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 mb-6 flex items-center justify-between gap-4">
                  <p className="text-[9px] font-mono text-gray-400 truncate">{c.trackingLink}</p>
                  <button className="text-brand-blue hover:text-blue-700 transition-colors"><MousePointer2 size={14}/></button>
               </div>
               <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-50 text-center">
                  <div><p className="text-[8px] font-black text-gray-400 uppercase">Clics</p><p className="text-lg font-black text-gray-900">{c.clicks}</p></div>
                  <div><p className="text-[8px] font-black text-gray-400 uppercase">Ventes</p><p className="text-lg font-black text-green-600">{c.sales}</p></div>
                  <div><p className="text-[8px] font-black text-gray-400 uppercase">Revenu</p><p className="text-xs font-black text-brand-blue">{c.revenue.toLocaleString()} F</p></div>
               </div>
            </div>
         ))}
      </div>
    </div>
  );

  return (
    <div className="pb-24">
      {activeView === 'home' && renderHome()}
      {activeView === 'discounts' && renderDiscounts()}
      {activeView === 'popups' && renderPopups()}
      {activeView === 'banners' && renderBanners()}
      {activeView === 'campaigns' && renderCampaigns()}
    </div>
  );
};

export default MarketingManager;

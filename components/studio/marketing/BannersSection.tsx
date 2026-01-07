import React, { useState, useMemo, useEffect } from 'react';
import { 
  ChevronLeft, Layout, Palette, Settings, Save, 
  Eye, Check, Trash2, Clock, Globe, Zap, 
  Smartphone, Monitor, Sparkles, CheckCircle2,
  Wand2, Loader2, Plus, Edit3, X, Search,
  ShoppingBag, ExternalLink, AlertTriangle, MessageSquare,
  ToggleRight, ToggleLeft, Link as LinkIcon, 
  MousePointer2, Info, ArrowUpRight, BarChart3,
  AlertCircle
} from 'lucide-react';
import { useData } from '../../../contexts/DataContext';
import { Banner } from '../../../types';
import { GoogleGenAI, Type } from "@google/genai";

const INITIAL_BANNER: Partial<Banner> = {
  name: '',
  text: '🚀 OFFRE EXCLUSIVE : -30% sur votre premier coaching avec Kadjolo Basile !',
  ctaText: 'EN PROFITER',
  ctaUrl: '/courses',
  backgroundColor: '#2563eb',
  textColor: '#ffffff',
  isActive: true,
  openInNewTab: false,
  autoTrack: true
};

const BannersSection: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { banners, addBanner, updateBanner, deleteBanner, toggleBannerStatus, courses } = useData();
  const [view, setView] = useState<'list' | 'editor'>('list');
  const [formData, setFormData] = useState<Partial<Banner>>(INITIAL_BANNER);
  const [isEditing, setIsEditing] = useState(false);
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [activePreviewDevice, setActivePreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [showUrlSelector, setShowUrlSelector] = useState(false);
  const [urlSearchTerm, setUrlSearchTerm] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<Banner | null>(null);

  // --- LOGIQUE IA GEMINI ---
  const handleAiWizard = async () => {
    if (!formData.name && !formData.text) {
      alert("Veuillez donner un nom ou un texte de base pour orienter l'IA.");
      return;
    }

    setIsAiGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Génère un message court et ultra-impactant pour une bannière promotionnelle située en haut d'un site web de marque personnelle.
        Marque: KADJOLO BASILE.
        Contexte/Nom de l'offre: ${formData.name || formData.text}.
        Cible: Entrepreneurs, leaders.
        Contrainte: Le message doit faire moins de 80 caractères.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              text: { type: Type.STRING, description: "Le message court de la bannière (avec emoji)." },
              ctaText: { type: Type.STRING, description: "Le texte du bouton (max 2 mots)." }
            },
            required: ["text", "ctaText"]
          }
        }
      });

      const data = JSON.parse(response.text || "{}");
      setFormData(prev => ({
        ...prev,
        text: data.text || prev.text,
        ctaText: data.ctaText || prev.ctaText
      }));
    } catch (error) {
      console.error("AI Wizard Error:", error);
      alert("L'assistant IA est indisponible.");
    } finally {
      setIsAiGenerating(false);
    }
  };

  const handleSave = () => {
    if (!formData.name || !formData.text) {
      alert("Le nom interne et le texte sont obligatoires.");
      return;
    }

    let finalUrl = formData.ctaUrl || '/';
    
    // AUTO-TRACKING UTM
    if (formData.autoTrack && !finalUrl.includes('utm_campaign')) {
      const separator = finalUrl.includes('?') ? '&' : '?';
      const campaignName = (formData.name || 'banner').toLowerCase().replace(/\s+/g, '_');
      finalUrl = `${finalUrl}${separator}utm_source=banner&utm_medium=internal&utm_campaign=${campaignName}`;
    }

    const payload = {
      ...formData,
      ctaUrl: finalUrl,
      id: isEditing ? formData.id : `ban_${Date.now()}`,
      isActive: formData.isActive ?? true,
      backgroundColor: formData.backgroundColor || '#2563eb',
      textColor: formData.textColor || '#ffffff',
      openInNewTab: formData.openInNewTab || false,
      autoTrack: formData.autoTrack || false
    } as Banner;

    if (isEditing) {
      updateBanner(payload);
    } else {
      addBanner(payload);
    }
    setView('list');
    resetForm();
  };

  const startEdit = (banner: Banner) => {
    let displayUrl = banner.ctaUrl;
    if (banner.autoTrack && displayUrl.includes('utm_source=banner')) {
        displayUrl = displayUrl.split('?utm_source=banner')[0].split('&utm_source=banner')[0];
    }

    setFormData({ ...banner, ctaUrl: displayUrl });
    setIsEditing(true);
    setView('editor');
  };

  const startCreate = () => {
    setFormData(INITIAL_BANNER);
    setIsEditing(false);
    setView('editor');
  };

  const resetForm = () => {
    setFormData(INITIAL_BANNER);
    setIsEditing(false);
    setShowUrlSelector(false);
  };

  const filteredUrlContent = useMemo(() => {
    const defaultPages = [
      { id: 'p_courses', title: 'Catalogue des Formations', url: '/courses', type: 'page', icon: <ShoppingBag size={14}/> },
      { id: 'p_community', title: 'Communauté Élite', url: '/community', type: 'page', icon: <MessageSquare size={14}/> },
      { id: 'p_news', title: 'Journal & Actualités', url: '/news', type: 'page', icon: <BarChart3 size={14}/> },
      { id: 'p_contact', title: 'Page de Contact', url: '/contact', type: 'page', icon: <Globe size={14}/> }
    ];

    const courseItems = courses.map(c => ({
      id: c.id,
      title: c.title,
      url: `/product/${c.id}`,
      type: 'course',
      icon: <Check size={14} className="text-green-500"/>
    }));

    const all = [...defaultPages, ...courseItems];
    return all.filter(item => 
      item.title.toLowerCase().includes(urlSearchTerm.toLowerCase())
    );
  }, [courses, urlSearchTerm]);

  const linkType = useMemo(() => {
    if (!formData.ctaUrl) return 'none';
    if (formData.ctaUrl.startsWith('http')) return 'external';
    if (formData.ctaUrl.startsWith('/product')) return 'product';
    return 'page';
  }, [formData.ctaUrl]);

  if (view === 'list') {
    return (
      <div className="space-y-8 animate-in fade-in duration-500 pb-20">
        {deleteTarget && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="bg-white rounded-[32px] shadow-2xl max-sm w-full overflow-hidden animate-in zoom-in-95 duration-200">
               <div className="p-8 text-center space-y-6">
                  <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                     <Trash2 size={40} />
                  </div>
                  <div>
                     <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter">Supprimer cette Bannière ?</h3>
                     <p className="text-sm text-gray-400 font-medium mt-2 leading-relaxed px-4">
                       Voulez-vous supprimer <span className="font-black text-gray-900">"{deleteTarget.name}"</span> ?
                     </p>
                  </div>
                  <div className="flex flex-col gap-2 pt-4">
                     <button 
                       onClick={() => { deleteBanner(deleteTarget.id); setDeleteTarget(null); }}
                       className="w-full py-4 bg-red-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-700 transition-all shadow-xl"
                     >
                        Confirmer Suppression
                     </button>
                     <button onClick={() => setDeleteTarget(null)} className="w-full py-4 bg-gray-50 text-gray-400 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-100 transition-all">Annuler</button>
                  </div>
               </div>
            </div>
          </div>
        )}

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-gray-100 pb-8">
          <div className="flex items-center gap-6">
            <button onClick={onBack} className="p-4 bg-white text-gray-400 rounded-2xl border border-gray-100 shadow-sm hover:text-brand-blue transition-all">
              <ChevronLeft size={24}/>
            </button>
            <div>
              <h1 className="text-5xl font-serif font-medium text-gray-900 leading-tight tracking-tight italic">Bannières</h1>
              <p className="text-gray-400 text-lg font-medium mt-1">Annoncez vos offres phares en haut de page.</p>
            </div>
          </div>
          <button 
            onClick={startCreate}
            className="bg-brand-blue text-white px-10 py-4 rounded-2xl font-bold text-sm flex items-center gap-3 shadow-2xl hover:scale-105 transition-transform"
          >
            <Plus size={20} /> Nouvelle Bannière
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {banners.map(banner => (
            <div key={banner.id} className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden group hover:shadow-xl transition-all flex flex-col md:flex-row items-center">
               <div className="p-8 border-b md:border-b-0 md:border-r border-gray-50 flex items-center gap-4 shrink-0">
                  <button onClick={() => toggleBannerStatus(banner.id)}>
                    {banner.isActive ? <ToggleRight size={44} className="text-brand-blue" /> : <ToggleLeft size={44} className="text-gray-300" />}
                  </button>
                  <div>
                    <h3 className="font-black text-gray-900 uppercase text-xs tracking-tight truncate max-w-[120px]">{banner.name || 'Sans titre'}</h3>
                    <p className={`text-[9px] font-black uppercase tracking-widest mt-1 ${banner.isActive ? 'text-green-500' : 'text-gray-400'}`}>
                      {banner.isActive ? 'Actif sur le site' : 'En pause'}
                    </p>
                  </div>
               </div>

               <div className="flex-1 p-6 md:px-10 overflow-hidden">
                  <div 
                    className="p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 border border-white/10 shadow-inner"
                    style={{ backgroundColor: banner.backgroundColor, color: banner.textColor }}
                  >
                     <p className="text-xs font-black uppercase tracking-tight line-clamp-1">{banner.text}</p>
                     <span className="px-4 py-1.5 bg-white text-brand-black rounded-lg text-[9px] font-black uppercase tracking-widest shadow-lg shrink-0">
                        {banner.ctaText}
                     </span>
                  </div>
                  <div className="flex items-center gap-6 mt-4">
                     <span className="flex items-center gap-1.5 text-[9px] font-black text-gray-400 uppercase tracking-widest">
                       <LinkIcon size={10} className="text-brand-blue"/> URL : <span className="text-brand-blue lowercase truncate max-w-[200px]">{banner.ctaUrl}</span>
                     </span>
                     {banner.autoTrack && (
                       <span className="flex items-center gap-1.5 text-[9px] font-black text-purple-500 uppercase tracking-widest">
                         <Zap size={10}/> Tracking UTM Actif
                       </span>
                     )}
                     {banner.openInNewTab && (
                       <span className="flex items-center gap-1.5 text-[9px] font-black text-orange-500 uppercase tracking-widest">
                         <ExternalLink size={10}/> Nouvel Onglet
                       </span>
                     )}
                  </div>
               </div>

               <div className="p-6 md:p-8 flex gap-3">
                  <button 
                    onClick={() => startEdit(banner)}
                    className="p-3 bg-gray-50 text-gray-400 hover:text-brand-blue hover:bg-blue-50 rounded-xl transition-all shadow-sm"
                  >
                    <Edit3 size={18}/>
                  </button>
                  <button 
                    onClick={() => setDeleteTarget(banner)}
                    className="p-3 bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all shadow-sm"
                  >
                    <Trash2 size={18}/>
                  </button>
               </div>
            </div>
          ))}

          {banners.length === 0 && (
            <div className="py-40 text-center bg-white rounded-[40px] border-2 border-dashed border-gray-100 flex flex-col items-center justify-center">
               <div className="w-24 h-24 bg-gray-50 text-gray-200 rounded-full flex items-center justify-center mb-8">
                  <Monitor size={56} />
               </div>
               <h3 className="text-3xl font-serif italic text-gray-300 mb-4">Aucune bannière active</h3>
               <button onClick={startCreate} className="bg-brand-blue text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl hover:scale-105 transition-transform">Lancer ma première annonce</button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 pb-20">
      <div className="flex items-center gap-6">
        <button onClick={() => setView('list')} className="p-4 bg-white text-gray-400 rounded-2xl border border-gray-100 shadow-sm hover:text-gray-900 transition-all">
          <ChevronLeft size={24}/>
        </button>
        <div>
          <h2 className="text-4xl font-serif font-medium text-gray-900 italic tracking-tight">
            {isEditing ? 'Éditer l\'Annonce' : 'Nouvelle Annonce'}
          </h2>
          <p className="text-gray-400 text-lg font-medium mt-1">Captez l'attention dès la première seconde.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        <div className="lg:col-span-7 space-y-8">
           <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm space-y-10">
              <div className="space-y-8">
                 <div className="flex justify-between items-center">
                   <h3 className="font-black text-gray-900 uppercase text-[10px] tracking-[0.2em] flex items-center gap-3">
                     <Settings className="text-brand-blue" size={20} /> Paramètres de l'Annonce
                   </h3>
                   <button 
                     onClick={handleAiWizard}
                     disabled={isAiGenerating}
                     className="bg-purple-50 text-purple-600 px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-purple-600 hover:text-white transition-all shadow-sm"
                   >
                     {isAiGenerating ? <Loader2 size={14} className="animate-spin" /> : <Wand2 size={14} />}
                     Assistant IA
                   </button>
                 </div>

                 <div className="space-y-4">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Nom Interne (Privé)</label>
                    <input 
                       value={formData.name}
                       onChange={e => setFormData({...formData, name: e.target.value})}
                       placeholder="Ex: Promo Lancement Janvier"
                       className="w-full p-5 bg-gray-50 border-none rounded-2xl font-bold text-gray-800 focus:ring-4 focus:ring-brand-blue/10"
                    />
                 </div>

                 <div className="space-y-4">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Message de l'Annonce</label>
                    <textarea 
                       value={formData.text}
                       onChange={e => setFormData({...formData, text: e.target.value})}
                       className="w-full p-6 bg-gray-50 border-none rounded-[32px] font-black text-sm uppercase tracking-tight focus:ring-4 focus:ring-brand-blue/10 h-28 resize-none leading-relaxed text-gray-800"
                       placeholder="Écrivez le message qui apparaîtra dans la bannière..."
                    />
                 </div>

                 <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Texte du Bouton</label>
                        <input 
                          value={formData.ctaText}
                          onChange={e => setFormData({...formData, ctaText: e.target.value})}
                          className="w-full p-5 bg-gray-50 border-none rounded-2xl font-black text-sm uppercase tracking-widest"
                          placeholder="EX: CLIQUEZ ICI"
                        />
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 flex items-center gap-2">
                          <LinkIcon size={14}/> Destination de l'action
                        </label>
                        <div className="relative">
                          <div className="flex gap-2">
                             <div className="relative flex-1 group">
                                <input 
                                  value={formData.ctaUrl}
                                  onChange={e => setFormData({...formData, ctaUrl: e.target.value})}
                                  placeholder="/courses ou lien externe"
                                  className="w-full pl-5 pr-12 py-5 bg-gray-50 border-none rounded-2xl font-bold text-sm text-brand-blue focus:ring-4 focus:ring-brand-blue/10 transition-all"
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                   {linkType === 'external' && <ExternalLink size={16} className="text-orange-400" title="Lien externe"/>}
                                   {linkType === 'product' && <ShoppingBag size={16} className="text-green-500" title="Lien formation"/>}
                                   {linkType === 'page' && <Layout size={16} className="text-brand-blue" title="Lien page interne"/>}
                                </div>
                             </div>
                             <button 
                               onClick={() => setShowUrlSelector(!showUrlSelector)}
                               className={`p-5 rounded-2xl border-2 transition-all flex items-center justify-center shrink-0 ${showUrlSelector ? 'bg-brand-black text-white border-brand-black shadow-lg' : 'bg-white border-gray-100 text-gray-400 hover:bg-gray-50'}`}
                               title="Parcourir le catalogue"
                             >
                                <Search size={20}/>
                             </button>
                          </div>

                          {showUrlSelector && (
                            <div className="absolute top-full left-0 right-0 mt-3 bg-white rounded-[32px] shadow-2xl border border-gray-100 overflow-hidden z-[60] animate-in slide-in-from-top-2">
                                <div className="p-4 border-b border-gray-50 bg-gray-50/50">
                                   <div className="relative">
                                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14}/>
                                      <input 
                                        autoFocus
                                        value={urlSearchTerm}
                                        onChange={e => setUrlSearchTerm(e.target.value)}
                                        placeholder="Rechercher une destination..."
                                        className="w-full pl-9 pr-4 py-3 bg-white border-none rounded-xl text-xs font-bold outline-none ring-2 ring-transparent focus:ring-brand-blue/10"
                                      />
                                   </div>
                                </div>
                                <div className="max-h-64 overflow-y-auto custom-scrollbar">
                                   {filteredUrlContent.length > 0 ? (
                                      filteredUrlContent.map(item => (
                                        <button 
                                          key={item.id}
                                          onClick={() => { setFormData({...formData, ctaUrl: item.url}); setShowUrlSelector(false); }}
                                          className="w-full text-left p-4 hover:bg-blue-50 flex items-center justify-between group transition-colors border-b border-gray-50 last:border-0"
                                        >
                                           <div className="flex items-center gap-3">
                                              <div className="p-2 rounded-lg bg-gray-100 group-hover:bg-white text-gray-400 group-hover:text-brand-blue transition-colors">
                                                 {item.icon}
                                              </div>
                                              <div>
                                                 <p className="text-xs font-black text-gray-800 uppercase tracking-tight">{item.title}</p>
                                                 <p className="text-[9px] text-gray-400 font-medium">{item.url}</p>
                                              </div>
                                           </div>
                                           <Plus size={14} className="text-gray-300 group-hover:text-brand-blue" />
                                        </button>
                                      ))
                                   ) : (
                                      <div className="p-10 text-center">
                                         <AlertCircle size={24} className="mx-auto text-gray-200 mb-2"/>
                                         <p className="text-[10px] font-black text-gray-400 uppercase">Aucun résultat trouvé</p>
                                      </div>
                                   )}
                                </div>
                                <div className="p-3 bg-gray-50 border-t border-gray-100">
                                   <button onClick={() => setShowUrlSelector(false)} className="w-full py-2 text-[10px] font-black text-gray-400 uppercase hover:text-gray-800 transition-colors">Fermer</button>
                                </div>
                            </div>
                          )}
                        </div>
                    </div>
                 </div>

                 <div className="grid md:grid-cols-2 gap-4 pt-4">
                    <button 
                      onClick={() => setFormData({...formData, openInNewTab: !formData.openInNewTab})}
                      className={`flex items-center justify-between p-5 rounded-2xl border-2 transition-all ${formData.openInNewTab ? 'border-orange-200 bg-orange-50 text-orange-700 shadow-lg shadow-orange-500/10' : 'bg-gray-50 border-gray-50 text-gray-400'}`}
                    >
                       <div className="text-left">
                          <p className="text-xs font-bold">Nouvel onglet</p>
                          <p className="text-[9px] uppercase font-black opacity-60">Recommandé pour liens externes</p>
                       </div>
                       {formData.openInNewTab ? <ToggleRight size={32}/> : <ToggleLeft size={32}/>}
                    </button>

                    <button 
                      onClick={() => setFormData({...formData, autoTrack: !formData.autoTrack})}
                      className={`flex items-center justify-between p-5 rounded-2xl border-2 transition-all ${formData.autoTrack ? 'border-purple-200 bg-purple-50 text-purple-700 shadow-lg shadow-purple-500/10' : 'bg-gray-50 border-gray-50 text-gray-400'}`}
                    >
                       <div className="text-left">
                          <p className="text-xs font-bold">Auto-Tagger UTM</p>
                          <p className="text-[9px] uppercase font-black opacity-60">Suivre les clics/ventes</p>
                       </div>
                       {formData.autoTrack ? <ToggleRight size={32}/> : <ToggleLeft size={32}/>}
                    </button>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-gray-50">
                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 flex items-center gap-2"><Palette size={14}/> Fond</label>
                        <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl">
                          <input type="color" value={formData.backgroundColor} onChange={e => setFormData({...formData, backgroundColor: e.target.value})} className="w-12 h-12 rounded-xl border-none p-0 cursor-pointer shadow-lg" />
                          <span className="text-xs font-mono font-black uppercase text-gray-500">{formData.backgroundColor}</span>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 flex items-center gap-2"><Palette size={14}/> Texte & Icones</label>
                        <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl">
                          <input type="color" value={formData.textColor} onChange={e => setFormData({...formData, textColor: e.target.value})} className="w-12 h-12 rounded-xl border-none p-0 cursor-pointer shadow-lg" />
                          <span className="text-xs font-mono font-black uppercase text-gray-500">{formData.textColor}</span>
                        </div>
                    </div>
                 </div>
              </div>
           </div>

           <div className="flex gap-4">
              <button onClick={() => setView('list')} className="px-10 py-5 bg-white text-gray-400 rounded-[32px] border border-gray-100 font-black text-xs uppercase tracking-widest hover:bg-gray-50 transition-all">Annuler</button>
              <button onClick={handleSave} className="flex-1 py-5 bg-brand-black text-white rounded-[32px] font-black text-xs uppercase tracking-widest shadow-2xl hover:bg-gray-800 transition-all flex items-center justify-center gap-3">
                <CheckCircle2 size={20}/> {isEditing ? 'Mettre à jour l\'Annonce' : 'Publier l\'Annonce'}
              </button>
           </div>
        </div>

        <div className="lg:col-span-5 space-y-8 sticky top-10">
           <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm space-y-8">
              <div className="flex justify-between items-center">
                 <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Visualisation Temps Réel</h4>
                 <div className="flex p-1 bg-gray-50 rounded-xl">
                    <button 
                      onClick={() => setActivePreviewDevice('desktop')}
                      className={`p-2 rounded-lg transition-all ${activePreviewDevice === 'desktop' ? 'bg-white text-brand-blue shadow-sm' : 'text-gray-400'}`}
                    >
                       <Monitor size={18}/>
                    </button>
                    <button 
                      onClick={() => setActivePreviewDevice('mobile')}
                      className={`p-2 rounded-lg transition-all ${activePreviewDevice === 'mobile' ? 'bg-white text-brand-blue shadow-sm' : 'text-gray-400'}`}
                    >
                       <Smartphone size={18}/>
                    </button>
                 </div>
              </div>

              <div className={`bg-gray-100 rounded-[32px] border border-gray-200 shadow-inner relative flex flex-col items-center overflow-hidden transition-all duration-500 ${activePreviewDevice === 'mobile' ? 'aspect-[9/16] max-w-[280px] mx-auto' : 'aspect-video w-full'}`}>
                 <div 
                   className="w-full p-4 flex flex-col md:flex-row items-center justify-center gap-4 text-center z-20 border-b border-white/10"
                   style={{ backgroundColor: formData.backgroundColor, color: formData.textColor }}
                 >
                    <p className="text-[10px] font-black uppercase tracking-tight leading-none px-4">{formData.text || 'Message de votre bannière ici...'}</p>
                    <button 
                      className="px-6 py-2 rounded-xl font-black text-[9px] uppercase tracking-widest shadow-xl shrink-0"
                      style={{ backgroundColor: formData.textColor, color: formData.backgroundColor }}
                    >
                       {formData.ctaText || 'ACTION'}
                    </button>
                 </div>

                 <div className="p-8 w-full space-y-10 opacity-30 pointer-events-none scale-95 blur-[0.5px]">
                    <div className="flex justify-between items-center">
                       <div className="h-6 w-32 bg-gray-300 rounded-full"></div>
                       <div className="flex gap-4">
                          <div className="h-4 w-4 bg-gray-300 rounded-full"></div>
                          <div className="h-4 w-4 bg-gray-300 rounded-full"></div>
                       </div>
                    </div>
                    <div className="space-y-4">
                       <div className="h-10 w-full bg-gray-200 rounded-2xl"></div>
                       <div className="h-40 w-full bg-gray-200 rounded-[32px]"></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <div className="h-32 bg-gray-200 rounded-2xl"></div>
                       <div className="h-32 bg-gray-200 rounded-2xl"></div>
                    </div>
                 </div>
              </div>

              <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 space-y-4">
                 <h5 className="text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                   <ArrowUpRight size={14} className="text-brand-blue"/> Lien qui sera utilisé :
                 </h5>
                 <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-inner">
                    <p className="text-[10px] font-mono break-all text-gray-600 leading-relaxed font-bold">
                       {formData.ctaUrl || '/'}
                       {formData.autoTrack && !formData.ctaUrl?.includes('utm_campaign') && (
                          <span className="text-purple-600">
                             {formData.ctaUrl?.includes('?') ? '&' : '?'}utm_source=banner&utm_medium=internal&utm_campaign={(formData.name || 'banner').toLowerCase().replace(/\s+/g, '_')}
                          </span>
                       )}
                    </p>
                 </div>
              </div>
           </div>
           
           <div className="bg-blue-50 p-6 rounded-[32px] border border-blue-100 flex items-center gap-4">
              <div className="p-3 bg-white rounded-2xl text-brand-blue shadow-sm shrink-0"><MessageSquare size={24}/></div>
              <p className="text-[10px] text-blue-700 font-bold uppercase leading-relaxed">
                <span className="block mb-1">Règle d'or :</span>
                Les bannières sont idéales pour les offres à durée limitée ou les lancements de produits majeurs.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default BannersSection;
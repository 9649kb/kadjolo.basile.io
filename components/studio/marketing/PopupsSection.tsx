
import React, { useState, useMemo, useEffect } from 'react';
import { 
  ChevronLeft, MousePointerClick, Save, X, ToggleRight, 
  ToggleLeft, Settings, Eye, Zap, Clock, ArrowDown, 
  Smartphone, Monitor, Sparkles, CheckCircle2, Plus, 
  Trash2, Edit3, AlertCircle, Wand2, Loader2, Copy,
  Layout, Palette, Target, MessageSquare, AlertTriangle, RefreshCw,
  Search, Link as LinkIcon, ShoppingBag, Globe, ExternalLink, ChevronDown
} from 'lucide-react';
import { useData } from '../../../contexts/DataContext';
import { Popup } from '../../../types';
import { GoogleGenAI, Type } from "@google/genai";

const INITIAL_POPUP: Partial<Popup> = {
  name: '',
  title: 'Attendez ! Ne partez pas les mains vides 🎁',
  message: 'Inscrivez-vous maintenant et recevez mon guide exclusif sur le mindset des champions.',
  ctaText: 'Je veux mon cadeau',
  ctaUrl: '/courses',
  trigger: 'exit',
  delaySeconds: 5,
  isActive: true,
  backgroundColor: '#000000',
  textColor: '#ffffff'
};

const PopupsSection: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { popups, addPopup, updatePopup, deletePopup, togglePopupStatus, courses } = useData();
  const [view, setView] = useState<'list' | 'editor'>('list');
  const [formData, setFormData] = useState<Partial<Popup>>(INITIAL_POPUP);
  const [isEditing, setIsEditing] = useState(false);
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [activePreviewDevice, setActivePreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [deleteTarget, setDeleteTarget] = useState<Popup | null>(null);
  
  // États pour le sélecteur d'URL
  const [showUrlSelector, setShowUrlSelector] = useState(false);
  const [urlSearchTerm, setUrlSearchTerm] = useState('');

  // --- LOGIQUE IA GEMINI ---
  const handleAiWizard = async () => {
    if (!formData.name && !formData.title) {
      alert("Veuillez donner un nom ou un titre de base pour orienter l'IA.");
      return;
    }

    setIsAiGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Génère un contenu de popup marketing irrésistible pour ma marque personnelle KADJOLO BASILE. 
        Contexte de la campagne: ${formData.name || formData.title}.
        Cible: Entrepreneurs ambitieux, leaders en devenir.
        Style: Professionnel, impactant, inspirant, psychologie de la vente (curiosité, urgence ou bénéfice massif).`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: "Un titre court et accrocheur." },
              message: { type: Type.STRING, description: "Un message persuasif de 15-20 mots." },
              ctaText: { type: Type.STRING, description: "Le texte du bouton d'action (max 3 mots)." }
            },
            required: ["title", "message", "ctaText"]
          }
        }
      });

      const data = JSON.parse(response.text || "{}");
      setFormData(prev => ({
        ...prev,
        title: data.title || prev.title,
        message: data.message || prev.message,
        ctaText: data.ctaText || prev.ctaText
      }));
    } catch (error) {
      console.error("AI Wizard Error:", error);
      alert("L'assistant IA est temporairement indisponible.");
    } finally {
      setIsAiGenerating(false);
    }
  };

  const handleSave = () => {
    if (!formData.name || !formData.title) {
      alert("Le nom interne et le titre sont obligatoires.");
      return;
    }

    const payload = {
      ...formData,
      id: isEditing ? formData.id : `pop_${Date.now()}`,
      isActive: formData.isActive ?? true,
      delaySeconds: formData.delaySeconds || 5,
      backgroundColor: formData.backgroundColor || '#000000',
      textColor: formData.textColor || '#ffffff'
    } as Popup;

    if (isEditing) {
      updatePopup(payload);
    } else {
      addPopup(payload);
    }
    setView('list');
    resetForm();
  };

  const startEdit = (popup: Popup) => {
    setFormData({ ...popup });
    setIsEditing(true);
    setView('editor');
  };

  const startCreate = () => {
    setFormData(INITIAL_POPUP);
    setIsEditing(false);
    setView('editor');
  };

  const resetForm = () => {
    setFormData(INITIAL_POPUP);
    setIsEditing(false);
    setShowUrlSelector(false);
  };

  const filteredUrlContent = useMemo(() => {
    const defaultPages = [
      { id: 'p_courses', title: 'Catalogue des Formations', url: '/courses', type: 'page' },
      { id: 'p_community', title: 'Communauté Élite', url: '/community', type: 'page' },
      { id: 'p_news', title: 'Journal & Actualités', url: '/news', type: 'page' },
      { id: 'p_contact', title: 'Page de Contact', url: '/contact', type: 'page' }
    ];

    const courseItems = courses.map(c => ({
      id: c.id,
      title: c.title,
      url: `/product/${c.id}`,
      type: 'course'
    }));

    const all = [...defaultPages, ...courseItems];
    return all.filter(item => 
      item.title.toLowerCase().includes(urlSearchTerm.toLowerCase())
    );
  }, [courses, urlSearchTerm]);

  if (view === 'list') {
    return (
      <div className="space-y-8 animate-in fade-in duration-500 pb-20">
        {/* BOÎTE DE SUPPRESSION PERSONNALISÉE */}
        {deleteTarget && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="bg-white rounded-[32px] shadow-2xl max-w-sm w-full overflow-hidden animate-in zoom-in-95 duration-200">
               <div className="p-8 text-center space-y-6">
                  <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                     <Trash2 size={40} />
                  </div>
                  <div>
                     <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter">Supprimer ce Popup ?</h3>
                     <p className="text-sm text-gray-400 font-medium mt-2 leading-relaxed px-4">
                       Voulez-vous vraiment supprimer <span className="font-black text-gray-900">"{deleteTarget.name}"</span> ?
                     </p>
                  </div>
                  <div className="flex flex-col gap-2 pt-4">
                     <button 
                       onClick={() => { deletePopup(deleteTarget.id); setDeleteTarget(null); }}
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

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-gray-100 pb-8">
          <div className="flex items-center gap-6">
            <button onClick={onBack} className="p-4 bg-white text-gray-400 rounded-2xl border border-gray-100 shadow-sm hover:text-brand-blue transition-all">
              <ChevronLeft size={24}/>
            </button>
            <div>
              <h1 className="text-5xl font-serif font-medium text-gray-900 leading-tight tracking-tight italic">Popups</h1>
              <p className="text-gray-400 text-lg font-medium mt-1">Convertissez vos visiteurs au moment parfait.</p>
            </div>
          </div>
          <button 
            onClick={startCreate}
            className="bg-brand-blue text-white px-10 py-4 rounded-2xl font-bold text-sm flex items-center gap-3 shadow-2xl hover:scale-105 transition-transform"
          >
            <Plus size={20} /> Créer un Popup
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {popups.map(popup => (
            <div key={popup.id} className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden group hover:shadow-2xl transition-all flex flex-col hover:-translate-y-2 duration-500">
               <div className="p-8 border-b border-gray-50 flex justify-between items-start">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-50 text-brand-blue rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                      <MousePointerClick size={24}/>
                    </div>
                    <div>
                      <h3 className="font-black text-gray-900 uppercase text-sm tracking-tight truncate max-w-[150px]">{popup.name || 'Sans titre'}</h3>
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-1 flex items-center gap-1">
                        <Zap size={10} className="text-brand-blue"/> {popup.trigger === 'exit' ? 'Intention de sortie' : popup.trigger === 'delay' ? `Après ${popup.delaySeconds}s` : 'Chargement'}
                      </p>
                    </div>
                  </div>
                  <button onClick={() => togglePopupStatus(popup.id)}>
                    {popup.isActive ? <ToggleRight size={44} className="text-brand-blue" /> : <ToggleLeft size={44} className="text-gray-300" />}
                  </button>
               </div>
               
               <div className="p-8 flex-1 space-y-4">
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <p className="text-xs font-bold text-gray-800 line-clamp-2 leading-relaxed">"{popup.title}"</p>
                  </div>
                  <p className="text-[10px] text-gray-400 font-medium italic line-clamp-2">"{popup.message}"</p>
                  <div className="flex items-center gap-2 text-[9px] font-black text-brand-blue uppercase tracking-widest">
                     <LinkIcon size={12}/> Redirection : <span className="text-gray-400 truncate">{popup.ctaUrl}</span>
                  </div>
               </div>

               <div className="p-6 bg-gray-50/50 border-t border-gray-100 flex justify-between items-center group-hover:bg-blue-50 transition-colors">
                  <button 
                    onClick={() => startEdit(popup)}
                    className="text-[10px] font-black text-brand-blue uppercase tracking-widest flex items-center gap-2 hover:translate-x-1 transition-transform"
                  >
                    Modifier le design <Edit3 size={14}/>
                  </button>
                  <button 
                    onClick={() => setDeleteTarget(popup)}
                    className="p-2.5 text-gray-300 hover:text-red-500 bg-white rounded-xl shadow-sm transition-all"
                  >
                    <Trash2 size={16}/>
                  </button>
               </div>
            </div>
          ))}

          {popups.length === 0 && (
            <div className="col-span-full py-40 text-center bg-white rounded-[40px] border-2 border-dashed border-gray-100 flex flex-col items-center justify-center">
               <div className="w-24 h-24 bg-gray-50 text-gray-200 rounded-full flex items-center justify-center mb-8">
                  <MousePointerClick size={56} />
               </div>
               <h3 className="text-3xl font-serif italic text-gray-300 mb-4">Aucun popup configuré</h3>
               <button onClick={startCreate} className="bg-brand-blue text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl hover:scale-105 transition-transform">Créer ma première campagne</button>
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
            {isEditing ? 'Éditer le Popup' : 'Nouveau Popup'}
          </h2>
          <p className="text-gray-400 text-lg font-medium mt-1">Concevez une offre qui ne peut être refusée.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* ÉDITEUR */}
        <div className="lg:col-span-7 space-y-8">
           <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm space-y-10">
              <div className="space-y-8">
                 <div className="flex justify-between items-center">
                   <h3 className="font-black text-gray-900 uppercase text-[10px] tracking-[0.2em] flex items-center gap-3">
                     <Settings className="text-brand-blue" size={20} /> Paramètres Généraux
                   </h3>
                   <button 
                     onClick={handleAiWizard}
                     disabled={isAiGenerating}
                     className="bg-purple-50 text-purple-600 px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-purple-600 hover:text-white transition-all shadow-sm disabled:opacity-50"
                   >
                     {isAiGenerating ? <Loader2 size={14} className="animate-spin" /> : <Wand2 size={14} />}
                     {isAiGenerating ? 'Réflexion IA...' : 'Assistant Copywriting IA'}
                   </button>
                 </div>
                 
                 <div className="space-y-4">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Nom de la Campagne (Privé)</label>
                    <input 
                       value={formData.name}
                       onChange={e => setFormData({...formData, name: e.target.value})}
                       placeholder="Ex: Lead Magnet - Guide Mindset"
                       className="w-full p-5 bg-gray-50 border-none rounded-2xl font-bold focus:ring-4 focus:ring-brand-blue/10 transition-all text-gray-800"
                    />
                 </div>

                 <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Titre du Popup</label>
                        <input 
                          value={formData.title}
                          onChange={e => setFormData({...formData, title: e.target.value})}
                          className="w-full p-5 bg-gray-50 border-none rounded-2xl font-black text-sm focus:ring-4 focus:ring-brand-blue/10 transition-all text-gray-800"
                        />
                    </div>
                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Texte du bouton</label>
                        <input 
                          value={formData.ctaText}
                          onChange={e => setFormData({...formData, ctaText: e.target.value})}
                          className="w-full p-5 bg-gray-50 border-none rounded-2xl font-black text-sm uppercase tracking-widest text-gray-800"
                        />
                    </div>
                 </div>

                 <div className="space-y-4">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Message Persuasif</label>
                    <textarea 
                       value={formData.message}
                       onChange={e => setFormData({...formData, message: e.target.value})}
                       className="w-full p-6 bg-gray-50 border-none rounded-[32px] font-medium focus:ring-4 focus:ring-brand-blue/10 h-32 resize-none leading-relaxed text-gray-700"
                       placeholder="Expliquez pourquoi ils doivent cliquer..."
                    />
                 </div>

                 {/* --- PARTIE SPÉCIFIQUE : URL DE REDIRECTION AMÉLIORÉE --- */}
                 <div className="space-y-4">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 flex items-center gap-2">
                       <LinkIcon size={14}/> URL de Redirection
                    </label>
                    <div className="relative group">
                      <div className="flex gap-2">
                         <div className="relative flex-1">
                            <input 
                              value={formData.ctaUrl}
                              onChange={e => setFormData({...formData, ctaUrl: e.target.value})}
                              placeholder="/courses ou lien externe"
                              className="w-full pl-5 pr-12 py-5 bg-gray-50 border-none rounded-2xl font-bold text-sm text-brand-blue"
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300">
                               {formData.ctaUrl?.startsWith('http') ? <ExternalLink size={16}/> : <Globe size={16}/>}
                            </div>
                         </div>
                         <button 
                           onClick={() => setShowUrlSelector(!showUrlSelector)}
                           className={`p-5 rounded-2xl border-2 transition-all flex items-center gap-2 ${showUrlSelector ? 'bg-brand-black text-white border-brand-black' : 'bg-white border-gray-100 text-gray-400 hover:bg-gray-50'}`}
                         >
                            <Search size={18}/>
                            <span className="text-[10px] font-black uppercase hidden md:inline">Parcourir</span>
                         </button>
                      </div>

                      {/* Sélecteur de contenu intelligent */}
                      {showUrlSelector && (
                         <div className="absolute top-full left-0 right-0 mt-3 bg-white rounded-[32px] shadow-2xl border border-gray-100 overflow-hidden z-[60] animate-in slide-in-from-top-2">
                            <div className="p-4 border-b border-gray-50 bg-gray-50/50">
                               <div className="relative">
                                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14}/>
                                  <input 
                                    autoFocus
                                    value={urlSearchTerm}
                                    onChange={e => setUrlSearchTerm(e.target.value)}
                                    placeholder="Rechercher une formation ou une page..."
                                    className="w-full pl-9 pr-4 py-3 bg-white border-none rounded-xl text-xs font-bold outline-none ring-2 ring-transparent focus:ring-brand-blue/10"
                                  />
                               </div>
                            </div>
                            <div className="max-h-60 overflow-y-auto custom-scrollbar">
                               {filteredUrlContent.length > 0 ? (
                                 filteredUrlContent.map(item => (
                                   <button 
                                     key={item.id}
                                     onClick={() => { setFormData({...formData, ctaUrl: item.url}); setShowUrlSelector(false); }}
                                     className="w-full text-left p-4 hover:bg-blue-50 flex items-center justify-between group transition-colors"
                                   >
                                      <div className="flex items-center gap-3">
                                         <div className={`p-2 rounded-lg ${item.type === 'course' ? 'bg-blue-50 text-brand-blue' : 'bg-gray-50 text-gray-400'}`}>
                                            {item.type === 'course' ? <ShoppingBag size={14}/> : <Layout size={14}/>}
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
                               <button onClick={() => setShowUrlSelector(false)} className="w-full py-2 text-[10px] font-black text-gray-400 uppercase hover:text-gray-600">Fermer</button>
                            </div>
                         </div>
                      )}
                    </div>
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

              <div className="pt-10 border-t border-gray-50 space-y-8">
                 <h3 className="font-black text-gray-900 uppercase text-[10px] tracking-[0.2em] flex items-center gap-3">
                   <Zap className="text-brand-blue" size={20} /> Règle de Déclenchement
                 </h3>

                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { id: 'load', label: 'Au chargement', icon: <RefreshCw size={20}/> },
                      { id: 'exit', label: 'Intention de sortie', icon: <MousePointerClick size={20}/> },
                      { id: 'delay', label: 'Après un délai', icon: <Clock size={20}/> },
                      { id: 'scroll', label: 'Au scroll (50%)', icon: <ArrowDown size={20}/> }
                    ].map(trig => (
                      <button 
                        key={trig.id}
                        onClick={() => setFormData({...formData, trigger: trig.id as any})} 
                        className={`p-6 rounded-3xl border-2 transition-all text-center flex flex-col items-center gap-3 ${formData.trigger === trig.id ? 'border-brand-blue bg-blue-50 text-brand-blue shadow-xl shadow-blue-500/10' : 'border-gray-50 bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
                      >
                         {trig.icon}
                         <span className="text-[9px] font-black uppercase tracking-tight leading-none">{trig.label}</span>
                      </button>
                    ))}
                 </div>

                 {formData.trigger === 'delay' && (
                    <div className="p-6 bg-blue-50 rounded-3xl border border-blue-100 animate-in slide-in-from-top-2">
                       <label className="text-[10px] font-black text-brand-blue uppercase tracking-widest mb-3 block">Temps d'attente (secondes)</label>
                       <div className="relative">
                          <input 
                            type="number" 
                            value={formData.delaySeconds} 
                            onChange={e => setFormData({...formData, delaySeconds: parseInt(e.target.value)})}
                            className="w-full bg-white border-none p-4 rounded-2xl font-black text-xl text-center focus:ring-4 focus:ring-brand-blue/10"
                          />
                          <span className="absolute right-6 top-1/2 -translate-y-1/2 font-black text-gray-300">SEC</span>
                       </div>
                    </div>
                 )}
              </div>
           </div>

           <div className="flex gap-4">
              <button onClick={() => setView('list')} className="px-10 py-5 bg-white text-gray-400 rounded-[32px] border border-gray-100 font-black text-xs uppercase tracking-widest hover:bg-gray-50 transition-all">Annuler</button>
              <button onClick={handleSave} className="flex-1 py-5 bg-brand-black text-white rounded-[32px] font-black text-xs uppercase tracking-widest shadow-2xl hover:bg-gray-800 transition-all flex items-center justify-center gap-3">
                <CheckCircle2 size={20}/> {isEditing ? 'Mettre à jour la campagne' : 'Publier le Popup'}
              </button>
           </div>
        </div>

        {/* APERÇU DYNAMIQUE */}
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

              <div className={`bg-gray-100 rounded-[32px] p-4 border border-gray-200 shadow-inner relative flex items-center justify-center overflow-hidden transition-all duration-500 ${activePreviewDevice === 'mobile' ? 'aspect-[9/16] max-w-[280px] mx-auto' : 'aspect-video w-full'}`}>
                 {/* LE POPUP RÉEL DANS L'APERÇU */}
                 <div 
                   className="w-full max-w-[320px] p-8 rounded-[40px] shadow-2xl animate-in zoom-in-95 duration-500 relative border border-white/10 z-20"
                   style={{ backgroundColor: formData.backgroundColor, color: formData.textColor }}
                 >
                    <div className="absolute top-4 right-4 opacity-50"><X size={16}/></div>
                    <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-6 shadow-inner border border-white/10">
                       <Sparkles className="text-white" size={24} />
                    </div>
                    <h4 className="text-xl font-black leading-tight mb-4 italic tracking-tighter uppercase">{formData.title || 'Titre du Popup'}</h4>
                    <p className="text-xs leading-relaxed mb-8 opacity-70 font-medium">{formData.message || 'Votre message promotionnel apparaîtra ici...'}</p>
                    <button 
                      className="w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:scale-[1.02] transition-transform"
                      style={{ backgroundColor: formData.textColor, color: formData.backgroundColor }}
                    >
                       {formData.ctaText || 'ACTION'}
                    </button>
                 </div>

                 {/* Faux contenu de site derrière */}
                 <div className="absolute inset-0 z-0 p-10 opacity-20 pointer-events-none scale-90 blur-[1px]">
                    <div className="h-4 w-3/4 bg-gray-400 rounded-full mb-4"></div>
                    <div className="h-4 w-1/2 bg-gray-400 rounded-full mb-12"></div>
                    <div className="grid grid-cols-2 gap-4 mb-8">
                       <div className="h-24 bg-gray-300 rounded-[24px]"></div>
                       <div className="h-24 bg-gray-300 rounded-[24px]"></div>
                    </div>
                    <div className="h-40 bg-gray-300 rounded-[32px]"></div>
                 </div>
                 
                 {/* Overlay pour Intention de sortie */}
                 {formData.trigger === 'exit' && (
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-brand-blue text-white px-3 py-1 rounded-full text-[7px] font-black uppercase tracking-widest z-30 shadow-lg">Déclenchement Sortie</div>
                 )}
              </div>
           </div>
           
           <div className="bg-orange-50 p-6 rounded-[32px] border border-orange-100 flex items-center gap-4">
              <div className="p-3 bg-white rounded-2xl text-orange-500 shadow-sm shrink-0"><AlertTriangle size={24}/></div>
              <p className="text-[10px] text-orange-700 font-bold uppercase leading-relaxed">
                <span className="block mb-1">Attention stratégique :</span>
                Évitez d'activer trop de popups simultanément pour ne pas dégrader l'expérience utilisateur.
              </p>
           </div>

           <div className="bg-blue-50 p-6 rounded-[32px] border border-blue-100 flex items-center gap-4">
              <div className="p-3 bg-white rounded-2xl text-brand-blue shadow-sm shrink-0"><MessageSquare size={24}/></div>
              <p className="text-[10px] text-blue-700 font-bold uppercase leading-relaxed">
                <span className="block mb-1">Impact sur les ventes :</span>
                Les popups de "sortie" (exit-intent) augmentent la conversion de +15% en moyenne.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default PopupsSection;

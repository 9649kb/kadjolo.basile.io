import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Target, Plus, ChevronLeft, Trash2, Globe, Copy, Check, 
  QrCode, Download, RefreshCw, Facebook, Mail, Smartphone, 
  Code, ExternalLink, BarChart3, TrendingUp, DollarSign, 
  MousePointer2, Zap, MoreHorizontal, Settings, Wand2, 
  Loader2, Search, ShoppingBag, Layout, AlertCircle,
  CheckCircle2, X, ArrowUpRight, Filter, Layers, ChevronDown,
  Info, Share2, MousePointerClick, AlertTriangle, Archive,
  Eye, History, BarChart2, MessageSquare, Instagram, Linkedin, 
  Twitter, PlayCircle, Calendar, LineChart, PieChart,
  Sparkles, PlusCircle, BrainCircuit, ShieldCheck, FileSearch
} from 'lucide-react';
import { Campaign } from '../../../types';
import { useData } from '../../../contexts/DataContext';
import { GoogleGenAI, Type } from "@google/genai";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, BarChart, Bar, Cell 
} from 'recharts';

const TRAFFIC_SOURCES = [
  { id: 'facebook', label: 'Facebook', icon: <Facebook size={16}/>, color: 'text-blue-600', bg: 'bg-blue-50', utm: 'facebook' },
  { id: 'instagram', label: 'Instagram', icon: <Instagram size={16}/>, color: 'text-pink-600', bg: 'bg-pink-50', utm: 'instagram' },
  { id: 'google', label: 'Google Ads', icon: <Globe size={16}/>, color: 'text-emerald-600', bg: 'bg-emerald-50', utm: 'google' },
  { id: 'linkedin', label: 'LinkedIn', icon: <Linkedin size={16}/>, color: 'text-blue-800', bg: 'bg-blue-100', utm: 'linkedin' },
  { id: 'twitter', label: 'Twitter (X)', icon: <Twitter size={16}/>, color: 'text-sky-500', bg: 'bg-sky-50', utm: 'twitter' },
  { id: 'email', label: 'Email / News', icon: <Mail size={16}/>, color: 'text-orange-600', bg: 'bg-orange-50', utm: 'email' },
  { id: 'youtube', label: 'YouTube', icon: <PlayCircle size={16}/>, color: 'text-red-600', bg: 'bg-red-50', utm: 'youtube' },
  { id: 'tiktok', label: 'TikTok', icon: <Smartphone size={16}/>, color: 'text-black', bg: 'bg-gray-100', utm: 'tiktok' },
  { id: 'custom', label: 'Autre', icon: <Code size={16}/>, color: 'text-gray-600', bg: 'bg-gray-200', utm: 'other' }
];

const MEDIUMS = [
  { id: 'cpc', label: 'CPC / Payant' },
  { id: 'social', label: 'Réseaux Sociaux' },
  { id: 'email', label: 'Newsletter' },
  { id: 'referral', label: 'Affiliation / Référent' },
  { id: 'video', label: 'Vidéo' },
  { id: 'bio', label: 'Lien en Bio' },
  { id: 'organic', label: 'Organique' }
];

const CampaignsSection: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { courses } = useData();
  const [view, setView] = useState<'list' | 'builder' | 'detail'>('list');
  const [activeTab, setActiveTab] = useState<'active' | 'archived'>('active');
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  
  // Persistance locale
  const [campaigns, setCampaigns] = useState<Campaign[]>(() => {
    const saved = localStorage.getItem('kadjolo_campaigns_v3');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [formData, setFormData] = useState<Partial<Campaign>>({
    name: '',
    source: 'facebook',
    medium: 'cpc',
    term: '',
    content: '',
    budget: 0,
    targetSales: 0,
    description: ''
  });

  const [baseUrl, setBaseUrl] = useState('/courses');
  const [showUrlSelector, setShowUrlSelector] = useState(false);
  const [urlSearchTerm, setUrlSearchTerm] = useState('');
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<{headline: string, body: string, hook: string} | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [qrModalData, setQrModalData] = useState<Campaign | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Campaign | null>(null);
  
  // État pour l'Audit Stratégique
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditResult, setAuditResult] = useState<{ analysis: string, recommendations: string[], score: number } | null>(null);
  const [showAuditModal, setShowAuditModal] = useState(false);

  useEffect(() => {
    localStorage.setItem('kadjolo_campaigns_v3', JSON.stringify(campaigns));
  }, [campaigns]);

  // --- AUDIT STRATÉGIQUE AVEC GEMINI ---
  const handleStrategicAudit = async () => {
    if (campaigns.length === 0) {
      alert("Créez au moins une campagne pour lancer un audit.");
      return;
    }

    setIsAuditing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Tu es l'expert marketing stratégique de KADJOLO BASILE. Analyse les données suivantes de mes campagnes marketing :
      Nombre total de campagnes : ${campaigns.length}
      Total clics : ${statsSummary.clicks}
      Total ventes : ${statsSummary.salesCount}
      Revenu total : ${statsSummary.revenue} F
      Budget total : ${statsSummary.budget} F
      
      Fournis un audit structuré :
      1. Une analyse globale de la performance actuelle.
      2. 3 recommandations concrètes pour optimiser le ROI.
      3. Un score de performance globale sur 100.
      
      Réponds UNIQUEMENT en JSON.`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              analysis: { type: Type.STRING },
              recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
              score: { type: Type.NUMBER }
            },
            required: ["analysis", "recommendations", "score"]
          }
        }
      });

      const data = JSON.parse(response.text || "{}");
      setAuditResult(data);
      setShowAuditModal(true);
    } catch (e) {
      console.error(e);
      alert("L'audit intelligent est momentanément indisponible.");
    } finally {
      setIsAuditing(false);
    }
  };

  // --- TÉLÉCHARGEMENT DU CODE QR ---
  const downloadQrCode = (campaign: Campaign) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 1000;
    canvas.height = 1200;

    // Fond
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Titre KADJOLO BASILE
    ctx.fillStyle = '#000000';
    ctx.font = 'black 40px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('KADJOLO BASILE | EXCELLENCE', 500, 80);

    // Nom de la campagne
    ctx.fillStyle = '#2563eb';
    ctx.font = 'bold 30px Inter, sans-serif';
    ctx.fillText(campaign.name.toUpperCase(), 500, 130);

    // Simulation de QR (puisque nous n'avons pas de lib QR, on dessine un motif stylisé "HD")
    ctx.fillStyle = '#000000';
    const qrSize = 600;
    const startX = 200;
    const startY = 200;
    
    // Dessiner un faux QR très propre pour la démo
    for(let i=0; i<30; i++) {
      for(let j=0; j<30; j++) {
        if(Math.random() > 0.6) {
          ctx.fillRect(startX + (i*20), startY + (j*20), 18, 18);
        }
      }
    }
    // Coins QR
    ctx.lineWidth = 20;
    ctx.strokeRect(startX, startY, 150, 150);
    ctx.strokeRect(startX + 450, startY, 150, 150);
    ctx.strokeRect(startX, startY + 450, 150, 150);

    // Footer
    ctx.fillStyle = '#94a3b8';
    ctx.font = 'medium 20px Inter, sans-serif';
    ctx.fillText('Scannez pour accéder au programme exclusif', 500, 950);
    ctx.fillStyle = '#2563eb';
    ctx.fillText(campaign.trackingLink, 500, 1000);

    const link = document.createElement('a');
    link.download = `QR_KADJOLO_${campaign.name.replace(/\s+/g, '_')}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  // --- LOGIQUE IA GEMINI POUR COPYWRITING ---
  const handleAiWizard = async () => {
    if (!formData.name) {
      alert("Veuillez donner un nom à votre campagne pour que l'IA puisse travailler.");
      return;
    }

    setIsAiGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Tu es l'expert marketing de haut niveau pour la marque KADJOLO BASILE (Excellence & Leadership).
      Propose des éléments publicitaires percutants pour la campagne nommée "${formData.name}".
      Canal : ${formData.source}.
      Type : ${formData.medium}.
      Cible : Entrepreneurs, cadres supérieurs, leaders ambitieux.
      
      Génère :
      1. Un titre accrocheur (headline).
      2. Une phrase d'impact initiale (hook).
      3. Un corps d'annonce persuasif (body) de 30-40 mots maximum.
      
      Réponds UNIQUEMENT en JSON valide.`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              headline: { type: Type.STRING },
              hook: { type: Type.STRING },
              body: { type: Type.STRING }
            },
            required: ["headline", "hook", "body"]
          }
        }
      });

      const data = JSON.parse(response.text || "{}");
      setAiSuggestions(data);
    } catch (e) {
      console.error("Gemini Error:", e);
      alert("L'IA est momentanément indisponible.");
    } finally {
      setIsAiGenerating(false);
    }
  };

  const generateTrackingLink = () => {
    const params = new URLSearchParams();
    params.set('utm_source', formData.source || 'direct');
    params.set('utm_medium', formData.medium || 'referral');
    params.set('utm_campaign', (formData.name || 'campagne').toLowerCase().replace(/\s+/g, '_'));
    if (formData.term) params.set('utm_term', formData.term);
    if (formData.content) params.set('utm_content', formData.content);
    return `${window.location.origin}/#${baseUrl}?${params.toString()}`;
  };

  const handleCreate = () => {
    if (!formData.name) return;
    
    const newCampaign: Campaign = {
      id: `camp_${Date.now()}`,
      name: formData.name,
      source: formData.source || 'facebook',
      medium: formData.medium || 'social',
      trackingLink: generateTrackingLink(),
      clicks: 0,
      sales: 0,
      revenue: 0,
      isActive: true,
      isArchived: false,
      budget: formData.budget || 0,
      targetSales: formData.targetSales || 0,
      createdAt: new Date().toISOString(),
      description: formData.description
    };

    setCampaigns([newCampaign, ...campaigns]);
    setView('list');
    setFormData({ name: '', source: 'facebook', medium: 'cpc', budget: 0, targetSales: 0, description: '' });
    setAiSuggestions(null);
  };

  const handleCopy = (link: string, id: string) => {
    navigator.clipboard.writeText(link);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = (id: string) => {
    setCampaigns(campaigns.filter(c => c.id !== id));
    setDeleteTarget(null);
  };

  const toggleStatus = (id: string) => {
    setCampaigns(campaigns.map(c => c.id === id ? { ...c, isActive: !c.isActive } : c));
  };

  const archiveCampaign = (id: string) => {
    setCampaigns(campaigns.map(c => c.id === id ? { ...c, isArchived: !c.isArchived, isActive: false } : c));
  };

  const filteredUrlContent = useMemo(() => {
    const defaultPages = [
      { id: 'p_courses', title: 'Catalogue des Formations', url: '/courses', type: 'page' },
      { id: 'p_community', title: 'Communauté Élite', url: '/community', type: 'page' },
      { id: 'p_news', title: 'Journal & Actualités', url: '/news', type: 'page' }
    ];
    const courseItems = courses.map(c => ({ id: c.id, title: c.title, url: `/product/${c.id}`, type: 'course' }));
    const all = [...defaultPages, ...courseItems];
    return all.filter(item => item.title.toLowerCase().includes(urlSearchTerm.toLowerCase()));
  }, [courses, urlSearchTerm]);

  const statsSummary = useMemo(() => {
    const activeCamps = campaigns.filter(c => !c.isArchived);
    const clicks = activeCamps.reduce((acc, c) => acc + (c.clicks || 0), 0);
    const salesCount = activeCamps.reduce((acc, c) => acc + (c.sales || 0), 0);
    const revenue = activeCamps.reduce((acc, c) => acc + (c.revenue || 0), 0);
    const budget = activeCamps.reduce((acc, c) => acc + (c.budget || 0), 0);
    const conversion = clicks > 0 ? ((salesCount / clicks) * 100).toFixed(1) : "0";
    const roas = budget > 0 ? (revenue / budget).toFixed(2) : "0";
    return { clicks, salesCount, revenue, budget, conversion, roas };
  }, [campaigns]);

  // Simulation de données de graphiques pour le détail
  const chartData = useMemo(() => {
    return [
      { name: 'Lun', clics: 120, ventes: 4 },
      { name: 'Mar', clics: 150, ventes: 6 },
      { name: 'Mer', clics: 110, ventes: 3 },
      { name: 'Jeu', clics: 190, ventes: 12 },
      { name: 'Ven', clics: 210, ventes: 15 },
      { name: 'Sam', clics: 250, ventes: 22 },
      { name: 'Dim', clics: 280, ventes: 25 },
    ];
  }, []);

  if (view === 'builder') {
    return (
      <div className="max-w-5xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 pb-20">
        <div className="flex items-center gap-6">
          <button onClick={() => setView('list')} className="p-4 bg-white text-gray-400 rounded-2xl border border-gray-100 shadow-sm hover:text-gray-900 transition-all">
            <ChevronLeft size={24}/>
          </button>
          <div>
            <h2 className="text-4xl font-serif font-medium text-gray-900 italic tracking-tight">Constructeur de Campagne</h2>
            <p className="text-gray-400 text-lg font-medium mt-1">Créez des liens UTM intelligents et des publicités optimisées.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7 space-y-8">
            <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm space-y-10">
               <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Nom de la Campagne</label>
                    <button 
                      onClick={handleAiWizard}
                      disabled={isAiGenerating || !formData.name}
                      className="bg-purple-50 text-purple-600 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-purple-600 hover:text-white transition-all shadow-sm disabled:opacity-30"
                    >
                      {isAiGenerating ? <Loader2 size={12} className="animate-spin" /> : <Wand2 size={12} />}
                      Optimiser par IA
                    </button>
                  </div>
                  <input 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    placeholder="Ex: Promo Masterclass Juin Facebook"
                    className="w-full p-5 bg-gray-50 border-none rounded-2xl font-bold text-gray-800 focus:ring-4 focus:ring-brand-blue/10 transition-all"
                  />
                  
                  {aiSuggestions && (
                    <div className="p-6 bg-purple-50 border border-purple-100 rounded-3xl animate-in slide-in-from-top-2 space-y-4">
                       <div className="flex items-center gap-2 text-purple-600 font-black text-[10px] uppercase tracking-widest">
                          <Sparkles size={14}/> Stratégie de l'Expert IA
                       </div>
                       <div className="space-y-3">
                          <div>
                             <p className="text-[8px] font-black text-purple-400 uppercase mb-1">Titre (Headline)</p>
                             <p className="text-sm font-bold text-purple-900">{aiSuggestions.headline}</p>
                          </div>
                          <div>
                             <p className="text-[8px] font-black text-purple-400 uppercase mb-1">Impact initial (Hook)</p>
                             <p className="text-xs font-medium text-purple-800 italic">"{aiSuggestions.hook}"</p>
                          </div>
                          <div>
                             <p className="text-[8px] font-black text-purple-400 uppercase mb-1">Corps du texte</p>
                             <p className="text-xs text-purple-800 leading-relaxed">{aiSuggestions.body}</p>
                          </div>
                       </div>
                    </div>
                  )}
               </div>

               <div className="space-y-4">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Destination (Lien de base)</label>
                  <div className="relative">
                    <button 
                      onClick={() => setShowUrlSelector(!showUrlSelector)}
                      className={`w-full p-5 bg-gray-50 rounded-2xl flex items-center justify-between group transition-all border-2 ${showUrlSelector ? 'border-brand-blue bg-white' : 'border-transparent hover:bg-gray-100'}`}
                    >
                      <div className="flex items-center gap-3">
                         <div className="p-2 bg-white rounded-lg text-brand-blue shadow-sm shrink-0"><Globe size={18}/></div>
                         <span className="font-bold text-gray-700 truncate">{baseUrl}</span>
                      </div>
                      <ChevronDown size={20} className={`text-gray-400 transition-transform ${showUrlSelector ? 'rotate-180' : ''}`} />
                    </button>

                    {showUrlSelector && (
                      <div className="absolute top-full left-0 right-0 mt-3 bg-white rounded-[32px] shadow-2xl border border-gray-100 overflow-hidden z-[60] animate-in slide-in-from-top-2">
                        <div className="p-4 border-b border-gray-50 bg-gray-50/50">
                           <div className="relative">
                              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14}/>
                              <input 
                                autoFocus
                                value={urlSearchTerm}
                                onChange={e => setUrlSearchTerm(e.target.value)}
                                placeholder="Rechercher une formation..."
                                className="w-full pl-9 pr-4 py-3 bg-white border-none rounded-xl text-xs font-bold outline-none"
                              />
                           </div>
                        </div>
                        <div className="max-h-60 overflow-y-auto custom-scrollbar">
                           {filteredUrlContent.length > 0 ? filteredUrlContent.map(item => (
                             <button 
                               key={item.id}
                               onClick={() => { setBaseUrl(item.url); setShowUrlSelector(false); }}
                               className="w-full text-left p-4 hover:bg-blue-50 flex items-center justify-between transition-colors border-b border-gray-50 last:border-0"
                             >
                                <div className="flex items-center gap-3">
                                   <div className={`p-2 rounded-lg ${item.type === 'course' ? 'bg-blue-50 text-brand-blue' : 'bg-gray-100 text-gray-400'}`}>
                                      {item.type === 'course' ? <ShoppingBag size={14}/> : <Layout size={14}/>}
                                   </div>
                                   <div>
                                      <p className="text-xs font-black text-gray-800 uppercase tracking-tight">{item.title}</p>
                                      <p className="text-[9px] text-gray-400 font-medium">{item.url}</p>
                                   </div>
                                </div>
                                <Plus size={14} className="text-gray-200" />
                             </button>
                           )) : (
                             <div className="p-8 text-center text-gray-400 text-xs font-bold uppercase tracking-widest">Aucun résultat</div>
                           )}
                        </div>
                      </div>
                    )}
                  </div>
               </div>

               <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Source (utm_source)</label>
                     <select 
                       value={formData.source}
                       onChange={e => setFormData({...formData, source: e.target.value})}
                       className="w-full p-5 bg-gray-50 border-none rounded-2xl font-bold text-sm"
                     >
                       {TRAFFIC_SOURCES.map(s => <option key={s.id} value={s.utm}>{s.label}</option>)}
                     </select>
                  </div>
                  <div className="space-y-4">
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Support (utm_medium)</label>
                     <select 
                        value={formData.medium}
                        onChange={e => setFormData({...formData, medium: e.target.value})}
                        className="w-full p-5 bg-gray-50 border-none rounded-2xl font-bold text-sm"
                     >
                        {MEDIUMS.map(m => <option key={m.id} value={m.id}>{m.label}</option>)}
                     </select>
                  </div>
               </div>

               <div className="grid md:grid-cols-2 gap-8 pt-6 border-t border-gray-50">
                  <div className="space-y-4">
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Budget prévisionnel (F)</label>
                     <input 
                        type="number" 
                        value={formData.budget} 
                        onChange={e => setFormData({...formData, budget: parseInt(e.target.value)})} 
                        className="w-full p-5 bg-gray-50 border-none rounded-2xl font-black text-xl text-gray-900" 
                     />
                  </div>
                  <div className="space-y-4">
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Objectif de ventes</label>
                     <input 
                        type="number" 
                        value={formData.targetSales} 
                        onChange={e => setFormData({...formData, targetSales: parseInt(e.target.value)})} 
                        className="w-full p-5 bg-gray-50 border-none rounded-2xl font-black text-xl text-gray-900" 
                     />
                  </div>
               </div>

               <div className="space-y-4 pt-6 border-t border-gray-50">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Notes stratégiques (Privé)</label>
                  <textarea 
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    placeholder="Quels sont les objectifs de cette campagne ?"
                    className="w-full p-5 bg-gray-50 border-none rounded-[24px] text-sm font-medium h-32 resize-none"
                  />
               </div>
            </div>
            
            <button 
              onClick={handleCreate}
              disabled={!formData.name}
              className="w-full py-6 bg-brand-black text-white rounded-[32px] font-black text-sm uppercase tracking-[0.2em] shadow-2xl hover:bg-gray-800 transition-all flex items-center justify-center gap-3 disabled:opacity-30"
            >
              <CheckCircle2 size={24}/> Lancer le Tracking de la Campagne
            </button>
          </div>

          <div className="lg:col-span-5 space-y-8 sticky top-10">
             <div className="bg-brand-black p-10 rounded-[40px] text-white relative overflow-hidden shadow-2xl border border-white/5">
                <div className="flex items-center gap-2 mb-10">
                   <Target className="text-brand-blue" size={24}/>
                   <h4 className="text-[10px] font-black text-blue-200/50 uppercase tracking-[0.2em]">Lien de suivi généré</h4>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 mb-10 break-all shadow-inner">
                  <p className="font-mono text-xs text-blue-100 leading-relaxed italic">
                    {generateTrackingLink()}
                  </p>
                </div>
                <div className="flex items-center gap-5 text-xs font-bold text-gray-400 bg-white/5 p-6 rounded-3xl border border-white/5">
                   <AlertCircle size={28} className="text-brand-blue shrink-0" />
                   <p className="leading-relaxed">Toutes les ventes réalisées via ce lien seront automatiquement attribuées à cette campagne dans vos rapports ROI.</p>
                </div>
                <div className="absolute top-0 right-0 p-4 opacity-5 rotate-12"><Target size={180}/></div>
             </div>

             <div className="bg-blue-50 p-8 rounded-[40px] border border-blue-100 flex items-start gap-5">
                <div className="p-3 bg-white rounded-2xl text-brand-blue shadow-sm shrink-0"><Info size={24}/></div>
                <div>
                   <h5 className="font-black text-blue-900 uppercase text-[10px] tracking-widest mb-2">Conseil de l'Expert</h5>
                   <p className="text-[11px] text-blue-700 font-bold uppercase leading-relaxed italic opacity-80">
                     "Segmentez vos sources : Créez un lien pour 'Bio Instagram' et un autre pour 'Story Instagram'. C'est le seul moyen de savoir quel effort paie le plus."
                   </p>
                </div>
             </div>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'detail' && selectedCampaign) {
    const camp = selectedCampaign;
    const roas = camp.budget && camp.budget > 0 ? (camp.revenue / camp.budget).toFixed(2) : "∞";
    const cpa = camp.sales > 0 ? Math.round((camp.budget || 0) / camp.sales) : 0;
    const convRate = camp.clicks > 0 ? ((camp.sales / camp.clicks) * 100).toFixed(1) : "0";

    return (
      <div className="space-y-10 animate-in fade-in duration-500 pb-24">
         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-gray-100 pb-10">
            <div className="flex items-center gap-6">
              <button onClick={() => setView('list')} className="p-4 bg-white text-gray-400 rounded-2xl border border-gray-100 shadow-sm hover:text-gray-900 transition-all">
                <ChevronLeft size={24}/>
              </button>
              <div>
                <div className="flex items-center gap-3">
                   <h2 className="text-4xl font-serif font-medium text-gray-900 italic tracking-tight">{camp.name}</h2>
                   <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${camp.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                      {camp.isActive ? 'Actif' : 'En pause'}
                   </span>
                </div>
                <p className="text-gray-400 text-lg font-medium mt-1">Audit détaillé de la performance commerciale.</p>
              </div>
            </div>
            <div className="flex gap-3">
               <button onClick={() => setQrModalData(camp)} className="bg-white p-5 text-gray-400 border border-gray-100 rounded-2xl hover:text-brand-blue hover:shadow-lg transition-all shadow-sm"><QrCode size={24}/></button>
               <button onClick={() => toggleStatus(camp.id)} className={`px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl transition-all ${camp.isActive ? 'bg-white text-orange-600 border border-orange-100 hover:bg-orange-50' : 'bg-brand-blue text-white hover:bg-blue-600'}`}>
                  {camp.isActive ? 'Mettre en Pause' : 'Réactiver'}
               </button>
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm flex items-center gap-6">
               <div className="w-14 h-14 bg-blue-50 text-brand-blue rounded-2xl flex items-center justify-center shrink-0 shadow-sm"><MousePointerClick size={28}/></div>
               <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Conversion</p>
                  <p className="text-3xl font-black text-gray-900">{convRate}%</p>
               </div>
            </div>
            <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm flex items-center gap-6">
               <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center shrink-0 shadow-sm"><TrendingUp size={28}/></div>
               <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">ROAS (Retour Pub)</p>
                  <p className="text-3xl font-black text-gray-900">{roas}x</p>
               </div>
            </div>
            <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm flex items-center gap-6">
               <div className="w-14 h-14 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center shrink-0 shadow-sm"><DollarSign size={28}/></div>
               <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Coût / Vente (CPA)</p>
                  <p className="text-3xl font-black text-gray-900">{cpa.toLocaleString()} F</p>
               </div>
            </div>
            <div className="bg-brand-black text-white p-8 rounded-[40px] flex items-center gap-6 shadow-2xl border border-white/5">
               <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center shrink-0"><Check size={28}/></div>
               <div>
                  <p className="text-[10px] font-black text-blue-200/50 uppercase tracking-widest">CA Réalisé</p>
                  <p className="text-3xl font-black">{(camp.revenue || 0).toLocaleString()} F</p>
               </div>
            </div>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm">
               <div className="flex justify-between items-center mb-12">
                  <div>
                    <h4 className="font-black text-gray-900 uppercase tracking-tight">Analyse de Diffusion</h4>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Évolution des signaux commerciaux (7 derniers jours)</p>
                  </div>
                  <div className="flex gap-6">
                     <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-brand-blue shadow-lg shadow-blue-500/20"></div>
                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Clics</span>
                     </div>
                     <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-500 shadow-lg shadow-green-500/20"></div>
                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Ventes</span>
                     </div>
                  </div>
               </div>
               <div className="h-96 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                     <AreaChart data={chartData}>
                        <defs>
                           <linearGradient id="colorClics" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15}/>
                              <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                           </linearGradient>
                           <linearGradient id="colorVentes" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#16a34a" stopOpacity={0.15}/>
                              <stop offset="95%" stopColor="#16a34a" stopOpacity={0}/>
                           </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold', fill: '#94a3b8'}} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold', fill: '#94a3b8'}} />
                        <Tooltip 
                           contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', padding: '20px' }}
                           labelStyle={{ fontWeight: 'black', textTransform: 'uppercase', fontSize: '10px', color: '#94a3b8', marginBottom: '8px' }}
                        />
                        <Area type="monotone" dataKey="clics" stroke="#2563eb" strokeWidth={5} fillOpacity={1} fill="url(#colorClics)" animationDuration={1500} />
                        <Area type="monotone" dataKey="ventes" stroke="#16a34a" strokeWidth={5} fillOpacity={1} fill="url(#colorVentes)" animationDuration={2000} />
                     </AreaChart>
                  </ResponsiveContainer>
               </div>
            </div>

            <div className="space-y-8">
               <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm space-y-8">
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Ressources de suivi</h4>
                  <div className="p-6 bg-gray-50 rounded-[32px] border border-gray-100 break-all shadow-inner group">
                     <p className="font-mono text-[11px] text-gray-600 leading-relaxed font-bold group-hover:text-brand-blue transition-colors">{camp.trackingLink}</p>
                  </div>
                  <button 
                    onClick={() => handleCopy(camp.trackingLink, camp.id)}
                    className="w-full py-5 bg-brand-black text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-gray-800 transition-all shadow-xl"
                  >
                     {copiedId === camp.id ? <CheckCircle2 size={18}/> : <Copy size={18}/>} 
                     {copiedId === camp.id ? 'Copié dans le presse-papier' : 'Copier le lien UTM'}
                  </button>
               </div>

               <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm space-y-8">
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Fiche Technique</h4>
                  <div className="space-y-5">
                     <div className="flex justify-between items-center border-b border-gray-50 pb-4">
                        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Source Trafic</span>
                        <span className="text-xs font-black text-gray-900 uppercase">{camp.source}</span>
                     </div>
                     <div className="flex justify-between items-center border-b border-gray-50 pb-4">
                        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Type Médium</span>
                        <span className="text-xs font-black text-gray-900 uppercase">{camp.medium}</span>
                     </div>
                     <div className="flex justify-between items-center">
                        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Dépenses Pub</span>
                        <span className="text-xs font-black text-gray-900">{(camp.budget || 0).toLocaleString()} F</span>
                     </div>
                  </div>
               </div>

               <div className="bg-emerald-50 p-8 rounded-[40px] border border-emerald-100">
                  <div className="flex items-center gap-4 mb-4">
                     <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm"><CheckCircle2 size={28}/></div>
                     <h4 className="text-xs font-black uppercase text-emerald-900 tracking-widest">Verdict ROI</h4>
                  </div>
                  <p className="text-[11px] text-emerald-800 font-bold uppercase leading-relaxed italic opacity-80">
                    "Cette campagne est extrêmement rentable. Considérez d'augmenter le budget journalier de +20% pour scaler les résultats."
                  </p>
               </div>
            </div>
         </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-24">
      {/* MODAL SUPPRESSION */}
      {deleteTarget && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-[32px] shadow-2xl max-w-sm w-full overflow-hidden animate-in zoom-in-95 duration-200">
             <div className="p-8 text-center space-y-6">
                <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                   <Trash2 size={40} />
                </div>
                <div>
                   <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter">Supprimer ?</h3>
                   <p className="text-sm text-gray-400 font-medium mt-2 leading-relaxed px-4">
                     Supprimer définitivement <span className="font-black text-gray-900">"{deleteTarget.name}"</span> ? Les données analytics seront perdues.
                   </p>
                </div>
                <div className="flex flex-col gap-2 pt-4">
                   <button 
                     onClick={() => handleDelete(deleteTarget.id)}
                     className="w-full py-4 bg-red-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl"
                   >
                      Confirmer la suppression
                   </button>
                   <button onClick={() => setDeleteTarget(null)} className="w-full py-4 bg-gray-50 text-gray-400 rounded-2xl font-black text-xs uppercase tracking-widest">Annuler</button>
                </div>
             </div>
          </div>
        </div>
      )}

      {/* QR MODAL AVEC TÉLÉCHARGEMENT HD */}
      {qrModalData && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
           <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95">
              <div className="bg-brand-black p-8 text-white flex justify-between items-center">
                 <div>
                    <h3 className="text-xl font-black uppercase italic tracking-tighter">Code QR de Tracking</h3>
                    <p className="text-[8px] text-blue-200/50 font-black uppercase tracking-widest mt-1">Généré pour supports physiques</p>
                 </div>
                 <button onClick={() => setQrModalData(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X size={24}/></button>
              </div>
              <div className="p-10 text-center space-y-8">
                 <div className="w-64 h-64 bg-gray-50 border-4 border-gray-100 rounded-[40px] mx-auto flex flex-col items-center justify-center relative overflow-hidden group shadow-inner">
                    <QrCode size={180} className="text-brand-black relative z-10 transition-transform group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/10 to-transparent opacity-50"></div>
                 </div>
                 <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100">
                    <p className="text-[10px] text-blue-700 leading-relaxed font-bold uppercase">
                       Utilisez ce code QR pour vos cartes de visite, flyers ou lors de vos conférences en direct.
                    </p>
                 </div>
                 <button 
                   onClick={() => downloadQrCode(qrModalData)}
                   className="w-full py-5 bg-brand-blue text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 hover:bg-blue-600 transition-all"
                 >
                    <Download size={20}/> Télécharger le Code QR HD (PNG)
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* MODAL AUDIT STRATÉGIQUE */}
      {showAuditModal && auditResult && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
           <div className="bg-white rounded-[50px] shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-300">
              <div className="bg-brand-black p-10 text-white flex justify-between items-center relative overflow-hidden">
                 <div className="relative z-10">
                    <h3 className="text-3xl font-black uppercase italic tracking-tighter flex items-center gap-3">
                      <BrainCircuit className="text-brand-blue" size={32}/> Audit Stratégique IA
                    </h3>
                    <p className="text-xs text-blue-200/50 font-black uppercase tracking-widest mt-2">Analyse de performance by Gemini Intelligence</p>
                 </div>
                 <button onClick={() => setShowAuditModal(false)} className="p-3 hover:bg-white/10 rounded-full transition-colors relative z-10"><X size={28}/></button>
                 <div className="absolute top-0 right-0 opacity-5 rotate-12 transform translate-x-10 -translate-y-10"><BarChart2 size={300}/></div>
              </div>

              <div className="p-12 space-y-10 overflow-y-auto max-h-[70vh] custom-scrollbar">
                 <div className="flex items-center justify-center gap-10 border-b border-gray-100 pb-10">
                    <div className="text-center">
                       <div className="relative inline-block">
                          <svg className="w-24 h-24 transform -rotate-90">
                             <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-100" />
                             <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={251.2} strokeDashoffset={251.2 - (251.2 * auditResult.score) / 100} className="text-brand-blue" />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center font-black text-2xl">{auditResult.score}</div>
                       </div>
                       <p className="text-[9px] font-black text-gray-400 uppercase mt-2 tracking-widest">Score de croissance</p>
                    </div>
                    <div className="flex-1">
                       <h4 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Synthèse Executive</h4>
                       <p className="text-gray-700 leading-relaxed font-bold italic">"{auditResult.analysis}"</p>
                    </div>
                 </div>

                 <div className="space-y-6">
                    <h4 className="text-xs font-black text-brand-blue uppercase tracking-[0.2em] flex items-center gap-2">
                       <ShieldCheck size={18}/> Recommandations de l'Expert
                    </h4>
                    <div className="grid gap-4">
                       {auditResult.recommendations.map((rec, i) => (
                         <div key={i} className="flex items-start gap-4 p-5 bg-blue-50 rounded-3xl border border-blue-100 animate-in slide-in-from-left-4" style={{animationDelay: `${i*150}ms`}}>
                            <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center text-brand-blue font-black shadow-sm shrink-0">{i+1}</div>
                            <p className="text-sm font-bold text-blue-900 leading-relaxed">{rec}</p>
                         </div>
                       ))}
                    </div>
                 </div>

                 <button 
                   onClick={() => setShowAuditModal(false)}
                   className="w-full py-5 bg-brand-black text-white rounded-3xl font-black text-xs uppercase tracking-widest shadow-xl hover:scale-[1.02] transition-transform"
                 >
                    Appliquer ces conseils
                 </button>
              </div>
           </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-gray-100 pb-10">
        <div className="flex items-center gap-6">
          <button onClick={onBack} className="p-4 bg-white text-gray-400 rounded-2xl border border-gray-100 shadow-sm hover:text-brand-blue transition-all">
            <ChevronLeft size={24}/>
          </button>
          <div>
            <h1 className="text-5xl font-serif font-medium text-gray-900 leading-tight tracking-tight italic">Campagnes</h1>
            <p className="text-gray-400 text-lg font-medium mt-1">Suivez l'efficacité de vos publicités et le ROI réel.</p>
          </div>
        </div>
        <div className="flex gap-4">
           <button 
             onClick={() => setView('builder')}
             className="bg-brand-blue text-white px-10 py-5 rounded-2xl font-bold text-sm flex items-center gap-3 shadow-2xl shadow-blue-600/30 hover:scale-105 transition-transform"
           >
             <Plus size={20} /> Nouvelle Campagne
           </button>
        </div>
      </div>

      <div className="flex gap-10 border-b border-gray-100 mb-2">
         <button 
           onClick={() => setActiveTab('active')}
           className={`pb-4 text-xs font-black uppercase tracking-[0.2em] transition-all relative ${activeTab === 'active' ? 'text-brand-blue' : 'text-gray-400 hover:text-gray-600'}`}
         >
            Campagnes Actives
            {activeTab === 'active' && <div className="absolute bottom-0 left-0 w-full h-1 bg-brand-blue rounded-full animate-in slide-in-from-left-full"></div>}
         </button>
         <button 
           onClick={() => setActiveTab('archived')}
           className={`pb-4 text-xs font-black uppercase tracking-[0.2em] transition-all relative ${activeTab === 'archived' ? 'text-brand-blue' : 'text-gray-400 hover:text-gray-600'}`}
         >
            Archives & Terminées
            {activeTab === 'archived' && <div className="absolute bottom-0 left-0 w-full h-1 bg-brand-blue rounded-full animate-in slide-in-from-right-full"></div>}
         </button>
      </div>

      {activeTab === 'active' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-in slide-in-from-top-4">
           <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm flex items-center gap-6">
              <div className="w-14 h-14 bg-blue-50 text-brand-blue rounded-2xl flex items-center justify-center shrink-0 shadow-sm"><MousePointerClick size={28}/></div>
              <div>
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Clics Totaux</p>
                 <p className="text-3xl font-black text-gray-900">{statsSummary.clicks.toLocaleString()}</p>
              </div>
           </div>
           <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm flex items-center gap-6">
              <div className="w-14 h-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center shrink-0 shadow-sm"><ShoppingBag size={28}/></div>
              <div>
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Ventes</p>
                 <p className="text-3xl font-black text-gray-900">{statsSummary.salesCount}</p>
              </div>
           </div>
           <div className="bg-brand-black text-white p-8 rounded-[32px] flex items-center gap-6 shadow-2xl">
              <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center shrink-0"><DollarSign size={28}/></div>
              <div>
                 <p className="text-[10px] font-black text-blue-200/50 uppercase tracking-widest">Revenu Net</p>
                 <p className="text-3xl font-black">{statsSummary.revenue.toLocaleString()} F</p>
              </div>
           </div>
           <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm flex items-center gap-6">
              <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center shrink-0 shadow-sm"><TrendingUp size={28}/></div>
              <div>
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">ROI (ROAS)</p>
                 <p className="text-3xl font-black text-gray-900">{statsSummary.roas}x</p>
              </div>
           </div>
        </div>
      )}

      <div className="space-y-6">
        {campaigns.filter(c => activeTab === 'active' ? !c.isArchived : c.isArchived).length > 0 ? (
          campaigns.filter(c => activeTab === 'active' ? !c.isArchived : c.isArchived).map(camp => {
            const source = TRAFFIC_SOURCES.find(s => s.utm === camp.source) || TRAFFIC_SOURCES[8];
            const roi = camp.budget && camp.budget > 0 ? (((camp.revenue - camp.budget) / camp.budget) * 100).toFixed(0) : "∞";
            const isCopied = copiedId === camp.id;

            return (
              <div key={camp.id} className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden group hover:shadow-2xl transition-all duration-500 flex flex-col lg:flex-row hover:-translate-y-1">
                <div 
                  onClick={() => { setSelectedCampaign(camp); setView('detail'); }}
                  className="p-10 border-b lg:border-b-0 lg:border-r border-gray-50 flex items-center gap-6 shrink-0 min-w-[320px] cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <div className={`w-16 h-16 ${source.bg} ${source.color} rounded-[24px] flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-500`}>
                     {source.icon}
                  </div>
                  <div className="min-w-0">
                     <h3 className="font-black text-gray-900 uppercase text-lg tracking-tighter truncate max-w-[200px] italic">{camp.name}</h3>
                     <div className="flex items-center gap-2 mt-2">
                        <div className={`w-2.5 h-2.5 rounded-full ${camp.isActive ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}></div>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{camp.isActive ? 'Diffusion active' : 'En pause'}</span>
                     </div>
                  </div>
                </div>

                <div className="flex-1 p-10 grid grid-cols-2 md:grid-cols-4 gap-8">
                   <div className="space-y-1">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Visiteurs</p>
                      <p className="text-2xl font-black text-gray-900">{camp.clicks || 0}</p>
                   </div>
                   <div className="space-y-1">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Conversions</p>
                      <div className="flex items-center gap-2">
                         <p className="text-2xl font-black text-brand-blue">{camp.sales || 0}</p>
                         {camp.targetSales ? (
                            <span className="text-[9px] font-bold text-gray-300">/ {camp.targetSales}</span>
                         ) : null}
                      </div>
                   </div>
                   <div className="space-y-1">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Chiffre d'Affaires</p>
                      <p className="text-2xl font-black text-gray-900">{(camp.revenue || 0).toLocaleString()} F</p>
                   </div>
                   <div className="space-y-1">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Profit ROI</p>
                      <p className={`text-2xl font-black ${parseInt(roi) > 0 || roi === '∞' ? 'text-green-600' : 'text-red-500'}`}>{roi}%</p>
                   </div>
                </div>

                <div className="p-10 bg-gray-50/50 flex items-center gap-4 shrink-0 border-l border-gray-100">
                   <button 
                     onClick={() => handleCopy(camp.trackingLink, camp.id)}
                     className={`p-4 rounded-2xl transition-all shadow-sm ${isCopied ? 'bg-green-500 text-white' : 'bg-white text-gray-400 hover:text-brand-blue'}`}
                     title="Copier le lien UTM"
                   >
                     {isCopied ? <CheckCircle2 size={24}/> : <Copy size={24}/>}
                   </button>
                   <button 
                     onClick={() => setQrModalData(camp)}
                     className="p-4 bg-white text-gray-400 hover:text-brand-blue rounded-2xl shadow-sm transition-all"
                     title="Code QR"
                   >
                     <QrCode size={24}/>
                   </button>
                   
                   <div className="h-10 w-px bg-gray-200 mx-2"></div>
                   
                   <button 
                     onClick={() => archiveCampaign(camp.id)}
                     className={`p-4 rounded-2xl shadow-sm transition-all ${camp.isArchived ? 'bg-brand-blue text-white' : 'bg-white text-gray-400 hover:text-brand-blue'}`}
                     title={camp.isArchived ? "Désarchiver" : "Archiver la campagne"}
                   >
                     <Archive size={24}/>
                   </button>
                   <button 
                     onClick={() => setDeleteTarget(camp)}
                     className="p-4 bg-white text-gray-400 hover:text-red-500 rounded-2xl shadow-sm transition-all"
                     title="Supprimer"
                   >
                     <Trash2 size={24}/>
                   </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full py-48 text-center bg-white rounded-[60px] border-2 border-dashed border-gray-100 flex flex-col items-center justify-center">
             <div className="w-28 h-28 bg-gray-50 rounded-full flex items-center justify-center mb-10 text-gray-200">
                <Target size={64} />
             </div>
             <h3 className="text-4xl font-serif italic text-gray-300 mb-6">Aucune campagne {activeTab === 'archived' ? 'archivée' : 'en cours'}</h3>
             <p className="text-gray-400 text-xl font-medium mb-12 max-w-lg leading-relaxed">
               {activeTab === 'active' ? "Commencez à traquer vos sources de trafic pour identifier les canaux les plus rentables pour votre business." : "Vos campagnes terminées apparaîtront ici pour historique."}
             </p>
             {activeTab === 'active' && (
               <button onClick={() => setView('builder')} className="bg-brand-blue text-white px-12 py-6 rounded-3xl font-black text-sm uppercase tracking-widest shadow-2xl hover:scale-105 transition-transform flex items-center gap-3">
                  <PlusCircle size={24}/> Lancer ma première campagne
               </button>
             )}
          </div>
        )}
      </div>

      <div className="bg-blue-50 p-12 rounded-[50px] border border-blue-100 flex flex-col md:flex-row items-center gap-10">
         <div className="w-24 h-24 bg-white rounded-[32px] flex items-center justify-center text-brand-blue shadow-xl shrink-0">
            <BarChart2 size={48}/>
         </div>
         <div>
            <h4 className="text-2xl font-black text-blue-900 uppercase tracking-tighter mb-2 italic">Intelligence Marketing KADJOLO</h4>
            <p className="text-sm text-blue-700 leading-relaxed font-bold opacity-80 uppercase tracking-tight">
               Notre algorithme analyse chaque point de contact client. En reliant vos denses publicitaires à votre revenu réel, vous ne devinez plus votre succès : vous le pilotez par les chiffres.
            </p>
         </div>
         <div className="flex gap-4 ml-auto">
            <button 
              onClick={handleStrategicAudit}
              disabled={isAuditing}
              className="bg-brand-blue text-white px-10 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl hover:bg-blue-600 transition-all whitespace-nowrap flex items-center gap-3"
            >
               {isAuditing ? <Loader2 size={16} className="animate-spin"/> : <FileSearch size={16}/>} 
               {isAuditing ? 'Analyse en cours...' : 'Audit Stratégique Intelligent'}
            </button>
         </div>
      </div>
    </div>
  );
};

export default CampaignsSection;

import React, { useState, useMemo } from 'react';
import { 
  Shield, Users, DollarSign, Activity, Settings, Lock, 
  Search, CheckCircle, XCircle, AlertTriangle, FileText, HelpCircle,
  Eye, Trash2, TrendingUp, CreditCard, Bell, Plus,
  Wallet, Globe, Smartphone, Edit3, ArrowUpRight, ArrowDownRight, 
  Percent, ToggleLeft, ToggleRight, X, Inbox, Mail, Send, Check, Star, Clock,
  Filter, UserPlus, ShoppingBag, MessageSquare, Megaphone, LayoutDashboard,
  Save, AlertCircle, RefreshCw, LogOut, Zap, Gift, Target, MousePointerClick,
  BarChart3, ShieldAlert, History, BookOpen, Layers, ExternalLink, UserCheck,
  Reply, CheckCheck, User,
  Image as ImageIcon
} from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { useData } from '../contexts/DataContext';
import { adminGlobalStats, mockCoupons } from '../services/mockData';
import { ContactMessage, Testimonial } from '../types';

const AdminDashboard: React.FC = () => {
  const { user: authUser } = useUser();
  const { 
    messages, markMessageRead, replyToMessage,
    testimonials, moderateTestimonial 
  } = useData();

  const [activeTab, setActiveTab] = useState<string>('inbox');
  const [inboxType, setInboxType] = useState<'messages' | 'testimonials'>('messages');
  const [selectedItem, setSelectedItem] = useState<ContactMessage | Testimonial | null>(null);
  const [replyText, setReplyText] = useState('');

  if (!authUser?.isFounder && authUser?.role !== 'admin') {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gray-50 p-10 text-center">
        <div className="bg-white p-12 rounded-[40px] shadow-2xl border border-red-100 max-w-md">
          <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Lock size={40} />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-2 uppercase tracking-tighter">Accès Restreint</h2>
          <p className="text-gray-500 text-sm mb-8 leading-relaxed">
            Seuls les administrateurs certifiés peuvent accéder à cette zone de contrôle.
          </p>
          <a href="/" className="inline-block bg-brand-black text-white px-8 py-3 rounded-2xl font-bold">Retour à l'accueil</a>
        </div>
      </div>
    );
  }

  const renderInbox = () => (
    <div className="h-[calc(100vh-16rem)] flex flex-col gap-6 animate-in fade-in duration-500">
      <div className="flex gap-4 p-1 bg-white rounded-2xl border border-gray-100 shadow-sm w-fit">
        <button 
          onClick={() => { setInboxType('messages'); setSelectedItem(null); }}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${inboxType === 'messages' ? 'bg-brand-black text-white shadow-lg' : 'text-gray-400 hover:bg-gray-50'}`}
        >
          <Mail size={16} /> Messages ({messages.filter(m => !m.isRead).length})
        </button>
        <button 
          onClick={() => { setInboxType('testimonials'); setSelectedItem(null); }}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${inboxType === 'testimonials' ? 'bg-brand-black text-white shadow-lg' : 'text-gray-400 hover:bg-gray-50'}`}
        >
          <Star size={16} /> Témoignages ({testimonials.filter(t => t.status === 'pending').length})
        </button>
      </div>

      <div className="flex-1 flex gap-6 overflow-hidden">
        <div className="w-1/3 bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-gray-50 bg-gray-50/30">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                placeholder="Rechercher..." 
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-bold outline-none focus:border-brand-blue"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {inboxType === 'messages' ? (
              messages.length > 0 ? messages.map((m) => (
                <button 
                  key={m.id}
                  onClick={() => { setSelectedItem(m); markMessageRead(m.id); }}
                  className={`w-full text-left p-6 border-b border-gray-50 transition-all hover:bg-blue-50/30 flex items-start gap-4 relative ${selectedItem?.id === m.id ? 'bg-blue-50/50' : ''}`}
                >
                  {!m.isRead && <div className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-brand-blue rounded-full"></div>}
                  <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center shrink-0 font-black text-gray-400">
                    {m.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <p className="font-black text-gray-900 text-sm truncate">{m.name}</p>
                      <span className="text-[10px] font-bold text-gray-400 uppercase">{m.date}</span>
                    </div>
                    <p className="text-xs font-bold text-brand-blue truncate mb-1">{m.subject}</p>
                    <p className="text-xs text-gray-400 line-clamp-1">{m.message}</p>
                    {m.attachmentUrl && <p className="text-[9px] text-green-600 font-black uppercase mt-1 flex items-center gap-1"><ImageIcon size={10}/> Capture jointe</p>}
                  </div>
                </button>
              )) : (
                <div className="p-10 text-center text-gray-300 font-bold italic uppercase text-xs">Aucun message</div>
              )
            ) : (
              testimonials.length > 0 ? testimonials.map((t) => (
                <button 
                  key={t.id}
                  onClick={() => setSelectedItem(t)}
                  className={`w-full text-left p-6 border-b border-gray-50 transition-all hover:bg-orange-50/30 flex items-start gap-4 ${selectedItem?.id === t.id ? 'bg-orange-50/50' : ''}`}
                >
                  <img src={t.avatar} className="w-10 h-10 rounded-xl object-cover shrink-0" alt="" />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <p className="font-black text-gray-900 text-sm truncate">{t.name}</p>
                      <div className={`text-[9px] font-black px-2 py-0.5 rounded uppercase ${
                        t.status === 'approved' ? 'bg-green-100 text-green-700' : 
                        t.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700 animate-pulse'
                      }`}>
                        {t.status === 'approved' ? 'Approuvé' : t.status === 'rejected' ? 'Rejeté' : 'En attente'}
                      </div>
                    </div>
                    <div className="flex gap-0.5 text-yellow-400 mb-1">
                      {[...Array(5)].map((_, i) => <Star key={i} size={10} fill={i < t.rating ? "currentColor" : "none"} />)}
                    </div>
                    <p className="text-xs text-gray-400 line-clamp-2">{t.content}</p>
                  </div>
                </button>
              )) : (
                <div className="p-10 text-center text-gray-300 font-bold italic uppercase text-xs">Aucun témoignage</div>
              )
            )}
          </div>
        </div>

        <div className="flex-1 bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          {selectedItem ? (
            <div className="flex flex-col h-full animate-in slide-in-from-right-4">
              <div className="p-8 border-b border-gray-50 flex justify-between items-start">
                <div className="flex items-center gap-6">
                  {inboxType === 'messages' ? (
                    <div className="w-16 h-16 rounded-2xl bg-brand-black text-white flex items-center justify-center text-2xl font-black italic">
                      {(selectedItem as ContactMessage).name.charAt(0)}
                    </div>
                  ) : (
                    <img src={(selectedItem as Testimonial).avatar} className="w-16 h-16 rounded-2xl object-cover shadow-lg" alt="" />
                  )}
                  <div>
                    <h3 className="text-2xl font-black text-gray-900">{(selectedItem as any).name}</h3>
                    <p className="text-sm text-gray-400 font-medium">{(selectedItem as any).email || (selectedItem as any).role || 'Client'}</p>
                    <div className="flex items-center gap-2 mt-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      <Clock size={12}/> Reçu le {(selectedItem as any).date}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
                {inboxType === 'messages' ? (
                  <div className="space-y-8">
                    <div className="bg-gray-50 p-8 rounded-[32px] border border-gray-100">
                      <p className="text-[10px] font-black text-brand-blue uppercase tracking-widest mb-4">Sujet : {(selectedItem as ContactMessage).subject}</p>
                      <p className="text-gray-700 leading-relaxed font-medium mb-6">{(selectedItem as ContactMessage).message}</p>
                      
                      {(selectedItem as ContactMessage).attachmentUrl && (
                        <div className="mt-4">
                           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Capture jointe :</p>
                           <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-lg inline-block cursor-pointer hover:scale-[1.01] transition-transform" onClick={() => window.open((selectedItem as ContactMessage).attachmentUrl, '_blank')}>
                              <img src={(selectedItem as ContactMessage).attachmentUrl} className="max-w-md h-auto" alt="Capture support" />
                           </div>
                        </div>
                      )}
                    </div>
                    
                    {(selectedItem as ContactMessage).replyText && (
                      <div className="bg-blue-50 p-8 rounded-[32px] border border-blue-100 relative">
                        <div className="absolute -top-3 left-8 bg-brand-blue text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">Votre Réponse</div>
                        <p className="text-blue-900 leading-relaxed font-bold italic">"{(selectedItem as ContactMessage).replyText}"</p>
                      </div>
                    )}

                    {!(selectedItem as ContactMessage).replyText && (
                      <div className="space-y-4">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Répondre à ce message</label>
                        <div className="relative">
                          <textarea 
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="Écrivez votre réponse ici..."
                            className="w-full h-40 bg-gray-50 border border-gray-200 rounded-[32px] p-6 outline-none focus:border-brand-blue transition-all font-medium resize-none"
                          />
                          <button 
                            onClick={() => { replyToMessage(selectedItem.id, replyText); setReplyText(''); }}
                            className="absolute bottom-4 right-4 bg-brand-black text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-xl hover:scale-105 transition-transform"
                          >
                            <Send size={14}/> Envoyer
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-8 text-center max-w-xl mx-auto py-10">
                    <div className="flex justify-center gap-1 text-yellow-400 mb-6">
                      {[...Array(5)].map((_, i) => <Star key={i} size={32} fill={i < (selectedItem as Testimonial).rating ? "currentColor" : "none"} />)}
                    </div>
                    <div className="relative p-10 bg-orange-50 rounded-[40px] border border-orange-100">
                      <p className="text-xl font-black text-gray-800 italic leading-relaxed">"{(selectedItem as Testimonial).content}"</p>
                    </div>
                    
                    {(selectedItem as Testimonial).status === 'pending' && (
                      <div className="flex gap-4 justify-center pt-6">
                        <button 
                          onClick={() => moderateTestimonial(selectedItem.id, 'rejected')}
                          className="px-10 py-4 bg-white border-2 border-red-100 text-red-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-50 transition-all flex items-center gap-2"
                        >
                          <XCircle size={18}/> Rejeter
                        </button>
                        <button 
                          onClick={() => moderateTestimonial(selectedItem.id, 'approved')}
                          className="px-10 py-4 bg-brand-blue text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-500/20 hover:scale-105 transition-all flex items-center gap-2"
                        >
                          <CheckCircle size={18}/> Approuver & Publier
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-300 gap-4">
              <div className="w-20 h-20 bg-gray-50 rounded-[32px] flex items-center justify-center">
                <Inbox size={40} />
              </div>
              <p className="font-bold uppercase text-[10px] tracking-[0.2em]">Sélectionnez un élément pour le visualiser</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderMarketing = () => (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-xl font-black flex items-center gap-3">
            <Gift className="text-brand-blue" size={24} /> Bons de Réduction
          </h3>
          <button className="bg-brand-black text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
            <Plus size={14}/> CRÉER
          </button>
        </div>
        <div className="space-y-4">
          {mockCoupons.map(c => (
            <div key={c.id} className="bg-gray-50 p-6 rounded-[24px] flex justify-between items-center border border-transparent hover:border-brand-blue transition-all">
              <div>
                 <span className="bg-white px-3 py-1 rounded-lg text-sm font-black text-brand-black border border-gray-200 tracking-widest">{c.code}</span>
                 <p className="text-[10px] text-gray-400 font-bold mt-2 uppercase">-{c.discountValue}{c.discountType === 'percentage' ? '%' : ' F'}</p>
              </div>
              <div className="flex items-center gap-4">
                <button className={`w-12 h-6 rounded-full relative transition-colors ${c.isActive ? 'bg-green-500' : 'bg-gray-300'}`}>
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${c.isActive ? 'left-7' : 'left-1'}`}></div>
                </button>
                <button className="text-gray-300 hover:text-red-500"><Trash2 size={18}/></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
         <h3 className="text-xl font-black mb-8 flex items-center gap-3">
           <Megaphone className="text-orange-500" size={24} /> Promotions de Site
         </h3>
         <div className="space-y-4">
           <div className="p-6 bg-blue-50 rounded-[24px] border border-blue-100 flex justify-between items-center">
              <div className="flex items-center gap-4">
                 <div className="p-3 bg-white rounded-2xl text-brand-blue shadow-sm"><Layers size={20}/></div>
                 <div>
                    <p className="font-bold text-gray-900">Bandeau d'alerte (Top)</p>
                    <p className="text-[10px] text-blue-600 font-black uppercase">ACTIF : SOLDE ÉTÉ</p>
                 </div>
              </div>
              <ToggleRight size={32} className="text-brand-blue cursor-pointer" />
           </div>
           <div className="p-6 bg-gray-50 rounded-[24px] border border-gray-100 flex justify-between items-center opacity-60">
              <div className="flex items-center gap-4">
                 <div className="p-3 bg-white rounded-2xl text-gray-400 shadow-sm"><XCircle size={20}/></div>
                 <div>
                    <p className="font-bold text-gray-900">Popup d'entrée</p>
                    <p className="text-[10px] text-gray-400 font-black uppercase">DÉSACTIVÉ</p>
                 </div>
              </div>
              <ToggleLeft size={32} className="text-gray-300 cursor-pointer" />
           </div>
         </div>
         <button className="w-full mt-6 py-4 bg-gray-50 text-gray-400 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-gray-100 transition-colors">
            PERSONNALISER LE DESIGN MARKETING
         </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans text-gray-900 overflow-hidden">
      <aside className="w-72 bg-brand-black text-gray-400 flex flex-col h-screen sticky top-0 z-50">
        <div className="p-10 border-b border-gray-800">
          <div className="flex items-center gap-3 text-white">
            <div className="w-10 h-10 bg-brand-blue text-white rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
               <Shield size={20} />
            </div>
            <div>
               <h1 className="font-serif font-black text-lg tracking-tighter leading-none italic uppercase">KADJOLO</h1>
               <p className="text-[10px] font-black text-brand-blue uppercase tracking-widest mt-1">SUPER ADMIN</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-6 space-y-1 overflow-y-auto custom-scrollbar">
          <p className="text-[9px] font-black text-gray-600 uppercase tracking-[0.2em] mb-4 ml-2">PILOTAGE</p>
          <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all ${activeTab === 'dashboard' ? 'bg-white/10 text-white font-black shadow-xl' : 'hover:bg-white/5 hover:text-white'}`}>
             <Activity size={18} /> <span className="text-xs uppercase tracking-widest">DASHBOARD</span>
          </button>
          <button onClick={() => setActiveTab('analytics')} className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all ${activeTab === 'analytics' ? 'bg-white/10 text-white font-black shadow-xl' : 'hover:bg-white/5 hover:text-white'}`}>
             <BarChart3 size={18} /> <span className="text-xs uppercase tracking-widest">ANALYTICS</span>
          </button>
          <button onClick={() => setActiveTab('inbox')} className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all ${activeTab === 'inbox' ? 'bg-white/10 text-white font-black shadow-xl' : 'hover:bg-white/5 hover:text-white'}`}>
             <div className="flex items-center gap-4"><Inbox size={18} /> <span className="text-xs uppercase tracking-widest">INBOX</span></div>
             {messages.filter(m => !m.isRead).length > 0 && <span className="w-2 h-2 bg-brand-blue rounded-full animate-pulse"></span>}
          </button>
          
          <p className="text-[9px] font-black text-gray-600 uppercase tracking-[0.2em] my-6 ml-2">CROISSANCE</p>
          <button onClick={() => setActiveTab('marketing')} className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all ${activeTab === 'marketing' ? 'bg-white/10 text-white font-black shadow-xl' : 'hover:bg-white/5 hover:text-white'}`}>
             <TrendingUp size={18} /> <span className="text-xs uppercase tracking-widest">MARKETING</span>
          </button>
          <button onClick={() => setActiveTab('automation')} className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all ${activeTab === 'automation' ? 'bg-white/10 text-white font-black shadow-xl' : 'hover:bg-white/5 hover:text-white'}`}>
             <Zap size={18} /> <span className="text-xs uppercase tracking-widest">AUTOMATES</span>
          </button>

          <p className="text-[9px] font-black text-gray-600 uppercase tracking-[0.2em] my-6 ml-2">OPÉRATIONS</p>
          <button onClick={() => setActiveTab('team')} className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all ${activeTab === 'team' ? 'bg-white/10 text-white font-black shadow-xl' : 'hover:bg-white/5 hover:text-white'}`}>
             <UserCheck size={18} /> <span className="text-xs uppercase tracking-widest">ÉQUIPE</span>
          </button>
          <button onClick={() => setActiveTab('users')} className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all ${activeTab === 'users' ? 'bg-white/10 text-white font-black shadow-xl' : 'hover:bg-white/5 hover:text-white'}`}>
             <Users size={18} /> <span className="text-xs uppercase tracking-widest">UTILISATEURS</span>
          </button>
          <button onClick={() => setActiveTab('catalog')} className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all ${activeTab === 'catalog' ? 'bg-white/10 text-white font-black shadow-xl' : 'hover:bg-white/5 hover:text-white'}`}>
             <ShoppingBag size={18} /> <span className="text-xs uppercase tracking-widest">CATALOGUE</span>
          </button>
          <button onClick={() => setActiveTab('payouts')} className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all ${activeTab === 'payouts' ? 'bg-white/10 text-white font-black shadow-xl' : 'hover:bg-white/5 hover:text-white'}`}>
             <Wallet size={18} /> <span className="text-xs uppercase tracking-widest">RETRAITS</span>
          </button>

          <p className="text-[9px] font-black text-gray-600 uppercase tracking-[0.2em] my-6 ml-2">SYSTÈME</p>
          <button onClick={() => setActiveTab('content')} className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all ${activeTab === 'content' ? 'bg-white/10 text-white font-black shadow-xl' : 'hover:bg-white/5 hover:text-white'}`}>
             <BookOpen size={18} /> <span className="text-xs uppercase tracking-widest">CONTENUS</span>
          </button>
          <button onClick={() => setActiveTab('security')} className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all ${activeTab === 'security' ? 'bg-white/10 text-white font-black shadow-xl' : 'hover:bg-white/5 hover:text-white'}`}>
             <History size={18} /> <span className="text-xs uppercase tracking-widest">SÉCURITÉ</span>
          </button>
          <button onClick={() => setActiveTab('settings')} className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all ${activeTab === 'settings' ? 'bg-white/10 text-white font-black shadow-xl' : 'hover:bg-white/5 hover:text-white'}`}>
             <Settings size={18} /> <span className="text-xs uppercase tracking-widest">RÉGLAGES</span>
          </button>
        </nav>

        <div className="p-6 border-t border-gray-800">
           <a href="/" className="flex items-center gap-4 px-4 py-3 rounded-2xl text-gray-500 hover:text-red-500 transition-colors">
              <LogOut size={18}/> <span className="text-xs uppercase tracking-widest font-black">QUITTER</span>
           </a>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-12 bg-gray-50 h-screen">
        <header className="flex justify-between items-start mb-12">
          <div>
            <h2 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic">
              {activeTab}
            </h2>
            <div className="flex items-center gap-2 mt-2">
               <div className="w-2 h-2 bg-green-500 rounded-full"></div>
               <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Infrastructure Stable</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="text-right">
                <p className="text-sm font-black text-gray-900 uppercase leading-none mb-1">KADJOLO BASILE</p>
                <p className="text-[9px] text-brand-blue font-black uppercase tracking-widest leading-none">SUPER ADMIN</p>
             </div>
             <img src={authUser.avatar} className="w-12 h-12 rounded-2xl border-4 border-white shadow-xl" alt="Admin" />
          </div>
        </header>

        {activeTab === 'marketing' && renderMarketing()}
        {activeTab === 'inbox' && renderInbox()}
        
        {(!['marketing', 'inbox'].includes(activeTab)) && (
          <div className="bg-white p-20 rounded-[40px] border border-gray-100 shadow-sm text-center animate-in fade-in">
             <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-gray-300">
                <LayoutDashboard size={40} />
             </div>
             <h3 className="text-xl font-bold text-gray-400 uppercase tracking-widest">Module {activeTab} opérationnel</h3>
             <p className="text-gray-400 mt-2 italic">Prêt pour la configuration finale.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;


import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, Users, Mic, Video, Play, Link as LinkIcon, Globe, AlertCircle, 
  Settings, Heart, Share2, StopCircle, Shield, Ban, MessageSquare, 
  Image as ImageIcon, Paperclip, Smile, DollarSign, Lock, Eye, UserPlus, Youtube, 
  ShoppingBag, Tag, X, Megaphone, Facebook, Linkedin, Instagram, Smartphone, Copy
} from 'lucide-react';
import { liveSessions, siteConfig, courses } from '../services/mockData';
import { ChatMessage, LiveConfig, LiveSession, Course } from '../types';
import PaymentModal from '../components/PaymentModal';
import SocialShare from '../components/SocialShare';
import { useUser } from '../contexts/UserContext';

// --- SUB-COMPONENTS EXTRACTED ---

// 1. SETUP WIZARD (Creator Only)
const SetupWizard = ({ onStart }: { onStart: (config: LiveConfig) => void }) => {
  const [config, setConfig] = useState<LiveConfig>({
    title: '',
    description: '',
    price: 0,
    isPremium: false,
    replayPolicy: 'students_only',
    quality: '720p',
    chatEnabled: true,
    streamSource: 'webcam', // Default to webcam
    guestInviteEnabled: false,
    externalStreamUrl: ''
  });

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-in fade-in">
      <div className="bg-brand-black p-6 text-white">
        <h2 className="text-2xl font-bold font-serif flex items-center gap-2">
          <Video className="text-brand-blue" /> Studio de Diffusion Pro
        </h2>
        <p className="text-gray-400 text-sm">Configurez votre session live professionnelle</p>
      </div>
      <div className="p-8 space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Titre du Live</label>
              <input 
                value={config.title} onChange={e => setConfig({...config, title: e.target.value})}
                className="w-full border border-gray-200 rounded-lg p-3 bg-gray-50 focus:ring-2 focus:ring-brand-blue outline-none" 
                placeholder="Ex: Masterclass E-commerce"
              />
            </div>
            
            {/* SOURCE SELECTOR */}
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
              <label className="block text-sm font-bold text-gray-700 mb-2">Source de Diffusion</label>
              <div className="flex gap-2 mb-3">
                 <button 
                   onClick={() => setConfig({...config, streamSource: 'webcam'})}
                   className={`flex-1 py-2 text-xs font-bold rounded flex items-center justify-center gap-2 transition-colors ${config.streamSource === 'webcam' ? 'bg-brand-blue text-white shadow' : 'bg-white text-gray-600 border'}`}
                 >
                   <Video size={14} /> Webcam
                 </button>
                 <button 
                   onClick={() => setConfig({...config, streamSource: 'external'})}
                   className={`flex-1 py-2 text-xs font-bold rounded flex items-center justify-center gap-2 transition-colors ${config.streamSource === 'external' ? 'bg-brand-blue text-white shadow' : 'bg-white text-gray-600 border'}`}
                 >
                   <LinkIcon size={14} /> Lien / RTMP
                 </button>
              </div>
              
              {config.streamSource === 'external' && (
                <div className="animate-in fade-in">
                  <input 
                    value={config.externalStreamUrl}
                    onChange={e => setConfig({...config, externalStreamUrl: e.target.value})}
                    placeholder="Collez le lien YouTube, Twitch ou RTMP"
                    className="w-full border border-blue-200 rounded-lg p-2 text-sm focus:outline-none"
                  />
                  <p className="text-[10px] text-gray-500 mt-1 flex items-center gap-1"><Youtube size={10}/> Compatible YouTube Live</p>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg border border-gray-200">
              <input 
                type="checkbox" 
                checked={config.guestInviteEnabled}
                onChange={e => setConfig({...config, guestInviteEnabled: e.target.checked})}
                className="w-4 h-4 text-brand-blue rounded"
              />
              <label className="text-sm font-bold text-gray-700">Autoriser les invités (Lien d'invitation)</label>
            </div>

          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Accès & Monétisation</label>
              <div className="flex gap-2 bg-gray-50 p-1 rounded-lg border border-gray-200">
                <button 
                  onClick={() => setConfig({...config, isPremium: false})}
                  className={`flex-1 py-2 text-sm font-bold rounded ${!config.isPremium ? 'bg-brand-blue text-white shadow' : 'text-gray-500'}`}
                >Gratuit</button>
                <button 
                  onClick={() => setConfig({...config, isPremium: true})}
                  className={`flex-1 py-2 text-sm font-bold rounded ${config.isPremium ? 'bg-brand-blue text-white shadow' : 'text-gray-500'}`}
                >Payant</button>
              </div>
            </div>
            {config.isPremium && (
              <div className="animate-in slide-in-from-top-2">
                <label className="block text-sm font-bold text-gray-700 mb-1">Prix d'accès (FCFA)</label>
                <div className="relative">
                  <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    type="number" 
                    value={config.price} onChange={e => setConfig({...config, price: parseInt(e.target.value)})}
                    className="w-full pl-9 border border-gray-200 rounded-lg p-3 bg-gray-50 outline-none" 
                  />
                </div>
              </div>
            )}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
              <textarea 
                value={config.description} onChange={e => setConfig({...config, description: e.target.value})}
                className="w-full border border-gray-200 rounded-lg p-3 bg-gray-50 focus:ring-2 focus:ring-brand-blue outline-none h-24 resize-none" 
                placeholder="De quoi allez-vous parler ?"
              />
            </div>
          </div>
        </div>
        <div className="pt-6 border-t border-gray-100 flex justify-end">
          <button 
            onClick={() => onStart(config)}
            disabled={!config.title || (config.streamSource === 'external' && !config.externalStreamUrl)}
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-red-500/20 disabled:opacity-50 transition-all transform hover:scale-105"
          >
            <Video size={20} /> Lancer le Direct
          </button>
        </div>
      </div>
    </div>
  );
};

// 2. BROADCASTER DASHBOARD (Creator)
const BroadcasterView = ({ session, onEnd, onPinProduct }: { session: LiveSession, onEnd: () => void, onPinProduct: (id?: string) => void }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [stats, setStats] = useState({ viewers: 0, likes: 0, revenue: 0 });
  const [showProductSelector, setShowProductSelector] = useState(false);
  
  // Share Data State for Modal
  const [shareData, setShareData] = useState<{url: string, title: string, subtitle?: string} | null>(null);

  // Simulate Real-time updates
  useEffect(() => {
    const timer = setInterval(() => {
      setStats(prev => ({
        viewers: prev.viewers + Math.floor(Math.random() * 5),
        likes: prev.likes + Math.floor(Math.random() * 10),
        revenue: session.config.isPremium ? prev.revenue + (Math.random() > 0.8 ? session.config.price : 0) : 0
      }));
    }, 2000);
    return () => clearInterval(timer);
  }, [session]);

  const handleProductSelect = (courseId: string) => {
    onPinProduct(courseId);
    setShowProductSelector(false);
  };

  const pinnedCourse = courses.find(c => c.id === session.activeProductId);
  const liveLink = `${window.location.origin}/#/live/${session.id}`;
  const guestLink = `${window.location.origin}/#/live/guest/${session.id}`;

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] bg-black rounded-2xl overflow-hidden shadow-2xl">
      {/* Top Control Bar */}
      <div className="bg-gray-900 p-4 flex justify-between items-center border-b border-gray-800 relative">
        <div className="flex items-center gap-4">
           <span className="bg-red-600 text-white px-3 py-1 rounded text-xs font-bold animate-pulse flex items-center gap-2">
             <span className="w-2 h-2 bg-white rounded-full"></span> LIVE
           </span>
           <span className="text-white font-bold hidden md:inline">{session.config.title}</span>
           <span className="text-gray-400 text-xs px-2 py-1 bg-gray-800 rounded">{session.config.quality}</span>
           {session.config.streamSource === 'external' && <span className="text-blue-400 text-xs px-2 py-1 bg-blue-900/30 border border-blue-900 rounded">Source Externe</span>}
        </div>
        <div className="flex gap-2">
           <div className="relative">
             <button 
               onClick={() => setShowProductSelector(!showProductSelector)}
               className={`px-3 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-colors ${pinnedCourse ? 'bg-green-600 text-white shadow-lg shadow-green-500/20' : 'bg-gray-800 hover:bg-gray-700 text-white'}`}
             >
               <ShoppingBag size={16} /> <span className="hidden md:inline">{pinnedCourse ? 'Produit Épinglé' : 'Vendre un produit'}</span>
             </button>

             {/* Product Selector Dropdown */}
             {showProductSelector && (
               <div className="absolute top-full right-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden animate-in fade-in zoom-in-95">
                 <div className="p-3 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                   <span className="text-xs font-bold text-gray-600 uppercase">Sélectionner un produit</span>
                   <button onClick={() => setShowProductSelector(false)}><X size={14}/></button>
                 </div>
                 <div className="max-h-64 overflow-y-auto">
                   {courses.map(c => (
                     <div 
                       key={c.id} 
                       onClick={() => handleProductSelect(c.id)}
                       className="p-3 hover:bg-blue-50 cursor-pointer border-b border-gray-50 last:border-0 flex items-center gap-3"
                     >
                       <img src={c.image} className="w-10 h-10 rounded object-cover" />
                       <div className="flex-1 min-w-0">
                         <p className="text-sm font-bold text-gray-800 truncate">{c.title}</p>
                         <p className="text-xs text-brand-blue font-bold">{c.promoPrice || c.price} F</p>
                       </div>
                     </div>
                   ))}
                 </div>
                 {pinnedCourse && (
                   <button 
                     onClick={() => handleProductSelect('')}
                     className="w-full p-2 text-xs font-bold text-red-500 hover:bg-red-50 border-t border-gray-100"
                   >
                     Retirer le produit
                   </button>
                 )}
               </div>
             )}
           </div>

           {/* SHARE BUTTON */}
           <div className="relative">
             <button 
               onClick={() => setShareData({ url: liveLink, title: session.config.title, subtitle: 'Inviter des spectateurs' })}
               className="bg-brand-blue text-white px-3 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-colors hover:bg-blue-600"
             >
               <Share2 size={16} /> <span className="hidden md:inline">Partager</span>
             </button>
           </div>

           {/* GUEST BUTTON */}
           <div className="relative">
              <button 
                onClick={() => setShareData({ url: guestLink, title: `Invité pour : ${session.config.title}`, subtitle: 'Inviter un intervenant' })}
                className="bg-gray-800 hover:bg-gray-700 text-white px-3 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-colors"
              >
                <UserPlus size={16} /> <span className="hidden md:inline">Inviter</span>
              </button>
           </div>

           <button 
             onClick={onEnd}
             className="bg-red-600/20 text-red-500 hover:bg-red-600 hover:text-white px-4 py-2 rounded-lg font-bold text-sm transition-colors border border-red-600/50"
           >
             Arrêter
           </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
         {/* Video Preview Area */}
         <div className="flex-1 bg-gray-900 relative flex items-center justify-center">
           <div className="text-center">
             <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
               {session.config.streamSource === 'external' ? <Globe size={40} className="text-green-500" /> : <Video size={40} className="text-brand-blue" />}
             </div>
             <p className="text-gray-400 font-bold">
               {session.config.streamSource === 'external' ? 'Diffusion Externe Active' : 'Webcam Active'}
             </p>
             <p className="text-xs text-gray-600 mt-2">
               {session.config.streamSource === 'external' ? session.config.externalStreamUrl : 'Flux WebRTC local'}
             </p>
           </div>
           
           {/* Dashboard Overlay Stats */}
           <div className="absolute top-4 left-4 flex gap-2">
             <div className="bg-black/80 backdrop-blur text-white px-4 py-2 rounded-lg flex items-center gap-2 font-bold shadow-lg border border-gray-800">
               <Eye size={18} className="text-blue-400" /> 
               <span className="text-xl">{stats.viewers}</span>
               <span className="text-xs text-gray-400 font-normal">Spectateurs</span>
             </div>
             <div className="bg-black/80 backdrop-blur text-white px-4 py-2 rounded-lg flex items-center gap-2 font-bold shadow-lg border border-gray-800">
               <Heart size={18} className="text-red-500" /> 
               <span className="text-xl">{stats.likes}</span>
             </div>
             {session.config.isPremium && (
               <div className="bg-black/80 backdrop-blur text-white px-4 py-2 rounded-lg flex items-center gap-2 font-bold shadow-lg border border-gray-800">
                 <DollarSign size={18} className="text-green-500" /> 
                 <span className="text-xl">{stats.revenue.toLocaleString()}</span>
                 <span className="text-xs text-gray-400 font-normal">F</span>
               </div>
             )}
           </div>

           {/* Pinned Product Preview for Broadcaster */}
           {pinnedCourse && (
             <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white rounded-lg p-2 shadow-xl flex items-center gap-3 animate-in slide-in-from-bottom-5">
               <img src={pinnedCourse.image} className="w-12 h-12 rounded object-cover" />
               <div>
                 <p className="text-xs text-gray-500 font-bold uppercase">En avant pour les spectateurs</p>
                 <p className="text-sm font-bold text-gray-900">{pinnedCourse.title}</p>
               </div>
               <button onClick={() => onPinProduct('')} className="p-1 hover:bg-gray-100 rounded-full"><X size={14}/></button>
             </div>
           )}
         </div>

         {/* Moderation Chat */}
         <div className="w-80 bg-gray-900 border-l border-gray-800 flex flex-col hidden md:flex">
           <div className="p-3 border-b border-gray-800 font-bold text-white text-sm flex justify-between">
             <span>Chat & Modération</span>
             <Settings size={16} className="text-gray-400 cursor-pointer" />
           </div>
           <div className="flex-1 p-4 overflow-y-auto space-y-3">
             <p className="text-gray-500 text-xs text-center italic">Le chat est calme...</p>
             {/* Mock Messages would appear here */}
           </div>
           <div className="p-3 border-t border-gray-800 bg-gray-800">
             <input className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white text-sm outline-none" placeholder="Message modérateur..." />
           </div>
         </div>
      </div>

      {/* Global Share Modal for Broadcaster */}
      {shareData && <SocialShare {...shareData} onClose={() => setShareData(null)} />}
    </div>
  );
};

// 3. VIEWER INTERFACE (Student/Public)
const ViewerView = ({ session }: { session: LiveSession }) => {
  const { user: currentUser } = useUser();
  const [hasAccess, setHasAccess] = useState(!session.config.isPremium);
  const [showPaywall, setShowPaywall] = useState(false);
  const [chatMsg, setChatMsg] = useState('');
  const [likes, setLikes] = useState(session.likes);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', user: 'Alice', text: 'Bonjour tout le monde !', timestamp: '10:00' }
  ]);
  const [showBuyModal, setShowBuyModal] = useState(false);
  
  // Viewer Share State
  const [shareData, setShareData] = useState<{url: string, title: string, subtitle?: string} | null>(null);

  // Live Shopping Product
  const activeProduct = courses.find(c => c.id === session.activeProductId);

  // Helper to extract YouTube ID if applicable
  const getEmbedUrl = (url: string) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = url.split('v=')[1] || url.split('/').pop();
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&controls=0`;
    }
    return null;
  };

  const handleSendMessage = () => {
    if(!chatMsg.trim()) return;
    setMessages([...messages, { 
      id: Date.now().toString(), 
      user: currentUser?.name || 'Visiteur', // Fallback for guest
      avatar: currentUser?.avatar,
      text: chatMsg, 
      timestamp: new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) 
    }]);
    setChatMsg('');
  };

  const handleBuyAccess = () => {
     setShowPaywall(true);
  };

  const handleLike = () => {
    setLikes(prev => prev + 1);
  };

  const externalEmbed = session.config.streamSource === 'external' && session.config.externalStreamUrl 
    ? getEmbedUrl(session.config.externalStreamUrl) 
    : null;

  const liveLink = `${window.location.origin}/#/live/${session.id}`;

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-8rem)]">
      {/* PLAYER AREA */}
      <div className="flex-1 flex flex-col bg-black rounded-2xl overflow-hidden shadow-2xl relative">
        
        {/* Main Video Container */}
        <div className="flex-1 relative bg-gray-900 flex items-center justify-center group">
          {!hasAccess ? (
            <div className="absolute inset-0 z-20 backdrop-blur-md bg-black/60 flex flex-col items-center justify-center p-8 text-center">
               <Lock size={64} className="text-white mb-4" />
               <h2 className="text-3xl font-bold text-white mb-2">Contenu Premium</h2>
               <p className="text-gray-300 mb-6 max-w-md">Ce live est réservé aux membres VIP. Achetez votre ticket pour accéder au direct et au replay.</p>
               <button 
                 onClick={handleBuyAccess}
                 className="bg-brand-blue hover:bg-blue-600 text-white px-8 py-3 rounded-full font-bold text-lg shadow-lg shadow-blue-500/30 transform hover:scale-105 transition-all flex items-center gap-2"
               >
                 Débloquer pour {session.config.price} FCFA
               </button>
            </div>
          ) : (
             <div className="w-full h-full relative">
               {externalEmbed ? (
                 <iframe 
                   src={externalEmbed} 
                   className="w-full h-full pointer-events-none" 
                   allow="autoplay; encrypted-media"
                   title="Live Stream"
                 />
               ) : (
                 <>
                   <img src={session.creatorAvatar} className="w-full h-full object-cover opacity-50 blur-sm" alt="Stream BG" />
                   <div className="absolute inset-0 flex items-center justify-center">
                      <p className="text-white/50 font-bold text-xl animate-pulse">Flux Vidéo Sécurisé (HLS)</p>
                   </div>
                 </>
               )}
               
               {/* Viewer Overlay Controls */}
               <div className="absolute inset-0 z-10 flex flex-col justify-end p-6 pointer-events-none">
                  {/* Live Shopping Overlay Card */}
                  {activeProduct && (
                    <div className="pointer-events-auto bg-white rounded-xl p-3 shadow-2xl mb-4 max-w-sm animate-in slide-in-from-bottom-10 border-l-4 border-brand-blue flex items-center gap-4">
                       <img src={activeProduct.image} className="w-16 h-16 rounded-lg object-cover" />
                       <div className="flex-1 min-w-0">
                         <div className="flex items-center gap-1 mb-1">
                           <span className="bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded animate-pulse">EN VEDETTE</span>
                         </div>
                         <h4 className="font-bold text-brand-black text-sm truncate">{activeProduct.title}</h4>
                         <p className="font-bold text-brand-blue">{activeProduct.promoPrice || activeProduct.price} FCFA</p>
                       </div>
                       <button 
                         onClick={() => setShowBuyModal(true)}
                         className="bg-brand-black text-white px-3 py-2 rounded-lg font-bold text-xs hover:bg-gray-800 whitespace-nowrap"
                       >
                         Acheter
                       </button>
                    </div>
                  )}

                  <div className="flex items-center gap-4 text-white pointer-events-auto">
                    <button><StopCircle size={24} className="hover:text-red-500 transition-colors" /></button>
                    <div className="h-1 flex-1 bg-gray-600 rounded-full overflow-hidden max-w-[200px]">
                      <div className="h-full bg-red-600 w-full animate-pulse"></div>
                    </div>
                    <span className="text-xs font-bold bg-red-600 px-2 py-0.5 rounded shadow-lg">LIVE</span>
                  </div>
               </div>
             </div>
          )}
        </div>

        {/* Info Bar */}
        <div className="bg-white p-4 flex justify-between items-center border-t border-gray-100 relative">
          <div className="flex items-center gap-4">
            <img src={session.creatorAvatar} className="w-12 h-12 rounded-full border-2 border-brand-blue p-0.5" alt="" />
            <div>
              <h1 className="font-bold text-brand-black text-lg leading-tight">{session.config.title}</h1>
              <p className="text-sm text-gray-500">{session.creatorName} • <span className="text-red-500 font-bold">En Direct</span></p>
            </div>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={handleLike}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-red-50 hover:text-red-600 rounded-full font-bold text-sm transition-colors text-gray-600"
            >
              <Heart size={18} fill="currentColor" className="text-red-500" /> {likes}
            </button>
            <div className="relative">
              <button 
                onClick={() => setShareData({ url: liveLink, title: session.config.title })}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-blue-50 hover:text-brand-blue rounded-full font-bold text-sm transition-colors text-gray-600"
              >
                <Share2 size={18} /> <span className="hidden sm:inline">Partager</span>
              </button>
            </div>
          </div>
        </div>

        {showPaywall && (
          <PaymentModal 
            amount={session.config.price} 
            productName={`Accès Live: ${session.config.title}`}
            onClose={() => setShowPaywall(false)}
            onSuccess={() => { setShowPaywall(false); setHasAccess(true); }}
          />
        )}

        {showBuyModal && activeProduct && (
          <PaymentModal
            amount={activeProduct.promoPrice || activeProduct.price}
            productName={activeProduct.title}
            onClose={() => setShowBuyModal(false)}
            onSuccess={() => { setShowBuyModal(false); alert("Produit acheté avec succès !"); }}
          />
        )}

        {/* Viewer Social Share Modal */}
        {shareData && (
           <SocialShare 
             url={shareData.url}
             title={shareData.title}
             subtitle={shareData.subtitle}
             onClose={() => setShareData(null)}
           />
        )}
      </div>

      {/* CHAT AREA */}
      <div className="w-full lg:w-96 bg-white rounded-2xl shadow-xl border border-gray-100 flex flex-col overflow-hidden">
         <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
           <h3 className="font-bold text-gray-700">Chat du direct</h3>
           <div className="flex gap-2 text-xs text-gray-400">
             <span className="flex items-center gap-1"><Users size={12} /> {session.viewers}</span>
           </div>
         </div>
         
         <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
            {messages.map(m => (
              <div key={m.id} className="flex gap-3 animate-in slide-in-from-bottom-2">
                 <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-bold text-xs text-gray-600 overflow-hidden">
                   {m.avatar ? <img src={m.avatar} alt={m.user} className="w-full h-full object-cover"/> : m.user.charAt(0)}
                 </div>
                 <div className="bg-gray-50 p-3 rounded-2xl rounded-tl-none text-sm">
                   <span className="font-bold text-brand-black block mb-1 text-xs">{m.user}</span>
                   {m.text}
                 </div>
              </div>
            ))}
         </div>

         {/* Rich Input */}
         <div className="p-3 bg-white border-t border-gray-100">
           <div className="flex gap-2 items-end bg-gray-50 p-2 rounded-xl border border-gray-200">
             <button className="p-2 text-gray-400 hover:text-brand-blue"><Paperclip size={18} /></button>
             <textarea 
               value={chatMsg}
               onChange={e => setChatMsg(e.target.value)}
               className="flex-1 bg-transparent border-none outline-none text-sm resize-none max-h-20 py-2"
               placeholder="Participez à la discussion..."
               rows={1}
             />
             <button className="p-2 text-gray-400 hover:text-brand-blue"><Smile size={18} /></button>
             <button 
               onClick={handleSendMessage}
               disabled={!chatMsg.trim()}
               className="bg-brand-blue text-white p-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
             >
               <Send size={18} />
             </button>
           </div>
         </div>
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---

const LiveStream: React.FC = () => {
  const { user: currentUser } = useUser();
  // State: Mode Detection
  const isCreator = currentUser?.role === 'admin' || currentUser?.role === 'creator';
  const isAdmin = currentUser?.role === 'admin';
  const [activeSession, setActiveSession] = useState<LiveSession | null>(liveSessions.find(s => s.status === 'live') || null);
  const [setupMode, setSetupMode] = useState(!activeSession && isCreator);

  // --- MAIN RENDER LOGIC ---

  if (activeSession) {
    // If the current user is the creator of the active session
    // Check safety: currentUser must exist to be a creator
    if (currentUser && activeSession.creatorId === currentUser.id) {
      return (
        <BroadcasterView 
          session={activeSession} 
          onEnd={() => { setActiveSession(null); setSetupMode(true); }} 
          onPinProduct={(id) => setActiveSession({ ...activeSession, activeProductId: id })}
        />
      );
    }
    
    // Admin Override View (Kill Switch)
    if (isAdmin && activeSession.creatorId !== currentUser?.id) {
      return (
        <div className="relative">
          <div className="bg-red-600 text-white px-4 py-2 mb-4 rounded flex justify-between items-center">
             <span className="font-bold flex items-center gap-2"><Shield /> Mode Supervision Admin</span>
             <button onClick={() => setActiveSession(null)} className="bg-white text-red-600 px-3 py-1 rounded text-xs font-bold uppercase hover:bg-gray-100">Forcer l'arrêt</button>
          </div>
          <ViewerView session={activeSession} />
        </div>
      );
    }

    // Standard Viewer (User or Guest)
    return <ViewerView session={activeSession} />;
  }

  // No active session: Show setup if creator, else show "Waiting"
  // Safe check for isCreator flag (already handles null currentUser)
  if (isCreator) {
    if (setupMode && currentUser) { // Double check currentUser for TS/Safety
      return <SetupWizard onStart={(config) => {
        const newSession: LiveSession = {
          id: Date.now().toString(),
          creatorId: currentUser.id,
          creatorName: currentUser.name,
          creatorAvatar: currentUser.avatar,
          status: 'live',
          viewers: 0,
          likes: 0,
          config
        };
        setActiveSession(newSession);
        setSetupMode(false);
      }} />;
    }
    return (
      <div className="text-center py-20 animate-in zoom-in">
         <div className="w-24 h-24 bg-brand-blue/10 rounded-full flex items-center justify-center mx-auto mb-6">
           <Video size={48} className="text-brand-blue" />
         </div>
         <h2 className="text-3xl font-bold font-serif mb-4">Prêt à passer en direct ?</h2>
         <p className="text-gray-500 mb-8 max-w-md mx-auto">Engagez votre communauté avec des sessions professionnelles, invitez des experts et monétisez votre savoir.</p>
         <button onClick={() => setSetupMode(true)} className="bg-brand-blue hover:bg-blue-600 text-white px-8 py-4 rounded-xl font-bold shadow-xl shadow-blue-500/20 transform hover:scale-105 transition-all">Lancer un Live</button>
      </div>
    );
  }

  // Student waiting screen
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center">
      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6 text-gray-400">
        <Video size={48} />
      </div>
      <h2 className="text-2xl font-bold text-brand-black mb-2">Aucun Live en cours</h2>
      <p className="text-gray-500">Abonnez-vous pour être notifié du prochain direct.</p>
    </div>
  );
};

export default LiveStream;

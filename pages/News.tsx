
import React, { useState, useEffect } from 'react';
import { 
  Megaphone, Plus, Image as ImageIcon, Trash2, Calendar, 
  TrendingUp, Tag, Bell, X, Check, Award, ExternalLink, Globe, Pin
} from 'lucide-react';
import { newsItems as initialNews } from '../services/mockData';
import { NewsItem, NewsType } from '../types';
import { useUser } from '../contexts/UserContext';

const News: React.FC = () => {
  const { user: currentUser } = useUser();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  
  // RESTRICTION: Only Admins or Founder can publish news. Creators/Vendors cannot.
  const isAdmin = currentUser?.role === 'admin' || currentUser?.isFounder === true;

  // Initialize Data with LocalStorage Persistence
  useEffect(() => {
    const savedNews = localStorage.getItem('kadjolo_news');
    if (savedNews) {
      setNews(JSON.parse(savedNews));
    } else {
      setNews(initialNews);
    }
  }, []);

  // Save to LocalStorage whenever news changes
  useEffect(() => {
    if (news.length > 0) {
      localStorage.setItem('kadjolo_news', JSON.stringify(news));
    }
  }, [news]);

  // Form State
  const [newItem, setNewItem] = useState<Partial<NewsItem>>({
    title: '',
    content: '',
    type: 'press_release',
    mediaUrl: '',
    source: 'Victoria', // Default value suggested
    externalLink: '',
    isPinned: false
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setNewItem({ ...newItem, mediaUrl: url });
    }
  };

  const handlePublish = () => {
    if (!newItem.title || !newItem.content) {
      alert("Le titre et le contenu sont obligatoires.");
      return;
    }

    const item: NewsItem = {
      id: Date.now().toString(),
      title: newItem.title!,
      content: newItem.content!,
      type: newItem.type as NewsType,
      date: new Date().toLocaleDateString('fr-FR'),
      mediaUrl: newItem.mediaUrl,
      isPinned: newItem.isPinned || false,
      source: newItem.source || 'Rédaction',
      externalLink: newItem.externalLink
    };

    setNews([item, ...news]);
    setIsEditing(false);
    setNewItem({ 
      title: '', 
      content: '', 
      type: 'press_release', 
      mediaUrl: '', 
      source: 'Victoria', 
      externalLink: '',
      isPinned: false
    });
  };

  const handleDelete = (id: string) => {
    if (confirm("Confirmer la suppression ?")) {
      const updatedNews = news.filter(n => n.id !== id);
      setNews(updatedNews);
      localStorage.setItem('kadjolo_news', JSON.stringify(updatedNews));
    }
  };

  // Helper for Type Styles
  const getTypeStyle = (type: NewsType) => {
    switch (type) {
      case 'success_story':
        return { 
          badge: 'bg-green-100 text-green-700', 
          border: 'border-green-200',
          icon: <TrendingUp size={16} />,
          label: 'Succès Vendeur'
        };
      case 'promotion':
        return { 
          badge: 'bg-red-100 text-red-700', 
          border: 'border-red-200',
          icon: <Tag size={16} />,
          label: 'Promotion'
        };
      case 'new_feature':
        return { 
          badge: 'bg-purple-100 text-purple-700', 
          border: 'border-purple-200',
          icon: <Award size={16} />,
          label: 'Nouveauté'
        };
      case 'press_release':
         return {
            badge: 'bg-blue-100 text-blue-800',
            border: 'border-blue-200',
            icon: <Globe size={16} />,
            label: 'Presse & Média'
         };
      default:
        return { 
          badge: 'bg-gray-100 text-gray-700', 
          border: 'border-gray-200',
          icon: <Bell size={16} />,
          label: 'Annonce'
        };
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
           <h1 className="text-3xl font-serif font-bold text-brand-black flex items-center gap-3">
             <Globe className="text-brand-blue" /> Journal & Actualités
           </h1>
           <p className="text-gray-500 mt-1">L'actualité brûlante, les opportunités et les annonces officielles.</p>
        </div>
        
        {isAdmin && (
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className="bg-brand-black text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-800 transition-all shadow-lg"
          >
            {isEditing ? <X size={20} /> : <Plus size={20} />}
            {isEditing ? 'Fermer l\'éditeur' : 'Publier une actualité'}
          </button>
        )}
      </div>

      {/* Admin Editor Panel (Professional CMS Style) */}
      {isEditing && isAdmin && (
        <div className="bg-white p-8 rounded-2xl shadow-xl border-l-4 border-brand-blue animate-in slide-in-from-top-4">
           <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
             <h2 className="font-bold text-xl flex items-center gap-2"><Megaphone size={20}/> Éditeur de Presse</h2>
             <div className="text-xs text-gray-400 italic">Vos modifications seront sauvegardées localement.</div>
           </div>
           
           <div className="grid md:grid-cols-3 gap-6 mb-6">
             {/* Left Column: Meta Data */}
             <div className="space-y-4 md:col-span-1 border-r border-gray-100 pr-4">
               <div>
                 <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Type de contenu</label>
                 <select 
                    value={newItem.type}
                    onChange={e => setNewItem({...newItem, type: e.target.value as NewsType})}
                    className="w-full border border-gray-200 rounded-lg p-2.5 outline-none bg-gray-50 text-sm font-medium"
                 >
                    <option value="press_release">📰 Presse / Média (Victoria)</option>
                    <option value="announcement">📢 Annonce Officielle</option>
                    <option value="success_story">🏆 Succès / Motivation</option>
                    <option value="promotion">🏷️ Offre Commerciale</option>
                    <option value="new_feature">🚀 Mise à jour Plateforme</option>
                 </select>
               </div>
               
               <div>
                 <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Source (Journal/Auteur)</label>
                 <input 
                   value={newItem.source}
                   onChange={e => setNewItem({...newItem, source: e.target.value})}
                   className="w-full border border-gray-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-brand-blue text-sm"
                   placeholder="Ex: Victoria News"
                 />
               </div>

               <div>
                 <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Options de visibilité</label>
                 <label className="flex items-center gap-2 cursor-pointer p-2 hover:bg-gray-50 rounded">
                    <input 
                      type="checkbox" 
                      checked={newItem.isPinned}
                      onChange={e => setNewItem({...newItem, isPinned: e.target.checked})}
                      className="rounded text-brand-blue focus:ring-brand-blue"
                    />
                    <span className="text-sm text-gray-700">Épingler en haut</span>
                 </label>
               </div>

                <div>
                 <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Lien Externe (Optionnel)</label>
                 <input 
                   value={newItem.externalLink}
                   onChange={e => setNewItem({...newItem, externalLink: e.target.value})}
                   className="w-full border border-gray-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-brand-blue text-sm"
                   placeholder="https://..."
                 />
               </div>
             </div>
             
             {/* Right Column: Content */}
             <div className="md:col-span-2 space-y-4">
               <div>
                 <label className="block text-sm font-bold text-gray-700 mb-2">Titre de l'article</label>
                 <input 
                   value={newItem.title}
                   onChange={e => setNewItem({...newItem, title: e.target.value})}
                   className="w-full border border-gray-200 rounded-lg p-3 outline-none focus:ring-2 focus:ring-brand-blue font-serif text-lg"
                   placeholder="Ex: Le Togo en pleine croissance numérique..."
                 />
               </div>

               <div>
                 <label className="block text-sm font-bold text-gray-700 mb-2">Contenu / Résumé</label>
                 <textarea 
                    value={newItem.content}
                    onChange={e => setNewItem({...newItem, content: e.target.value})}
                    className="w-full h-32 border border-gray-200 rounded-lg p-3 outline-none focus:ring-2 focus:ring-brand-blue resize-none"
                    placeholder="Écrivez votre article ou le résumé de la news ici..."
                 />
               </div>

               <div>
                 <div className="relative">
                    <input 
                      type="file" 
                      onChange={handleImageUpload}
                      className="hidden" 
                      id="news-upload"
                      accept="image/*"
                    />
                    <div className="flex items-center gap-4">
                        <label 
                          htmlFor="news-upload"
                          className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 text-sm font-medium text-gray-600"
                        >
                          <ImageIcon size={18} />
                          {newItem.mediaUrl ? 'Changer l\'image' : 'Ajouter une image'}
                        </label>
                        {newItem.mediaUrl && <span className="text-xs text-green-600 font-bold flex items-center gap-1"><Check size={12}/> Image chargée</span>}
                    </div>
                 </div>
               </div>
             </div>
           </div>
           
           <div className="flex justify-end pt-4 border-t border-gray-100 gap-3">
             <button onClick={() => setIsEditing(false)} className="px-6 py-2 text-gray-500 hover:text-gray-800 font-bold text-sm">Annuler</button>
             <button 
               onClick={handlePublish}
               className="bg-brand-blue text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg"
             >
               Publier l'article
             </button>
           </div>
        </div>
      )}

      {/* News Feed */}
      <div className="space-y-6">
        {/* Sort: Pinned first */}
        {news.sort((a,b) => (a.isPinned === b.isPinned ? 0 : a.isPinned ? -1 : 1)).map(item => {
          const style = getTypeStyle(item.type);
          const isYouTube = item.mediaUrl?.includes('youtube.com') || item.mediaUrl?.includes('youtu.be');
          
          return (
            <div key={item.id} className={`bg-white rounded-2xl overflow-hidden shadow-sm border ${item.isPinned ? 'border-brand-blue ring-1 ring-brand-blue/20' : style.border} transition-all hover:shadow-md animate-in fade-in`}>
              {/* Header */}
              <div className="p-6 pb-2 flex justify-between items-start">
                 <div className="flex items-center gap-3">
                    <span className={`w-10 h-10 rounded-full flex items-center justify-center ${style.badge}`}>
                       {style.icon}
                    </span>
                    <div>
                       <div className="flex items-center gap-2">
                           <span className={`text-[10px] font-bold uppercase tracking-wider ${style.badge.split(' ')[1]}`}>
                             {style.label}
                           </span>
                           {item.isPinned && <span className="bg-brand-blue text-white text-[10px] px-1.5 py-0.5 rounded flex items-center gap-1"><Pin size={10} fill="white"/> Épinglé</span>}
                       </div>
                       <h3 className="text-xl font-bold text-brand-black leading-tight mt-1 font-serif">{item.title}</h3>
                       {item.source && <p className="text-xs text-gray-500 font-medium mt-1">Source : {item.source}</p>}
                    </div>
                 </div>
                 <div className="flex items-center gap-3">
                   <span className="text-xs text-gray-400 flex items-center gap-1 bg-gray-50 px-2 py-1 rounded">
                     <Calendar size={12} /> {item.date}
                   </span>
                   {isAdmin && (
                     <button onClick={() => handleDelete(item.id)} className="text-gray-300 hover:text-red-500 transition-colors p-1">
                       <Trash2 size={16} />
                     </button>
                   )}
                 </div>
              </div>

              {/* Content Body */}
              <div className="px-6 py-2 text-gray-600 leading-relaxed whitespace-pre-wrap">
                {item.content}
              </div>

              {/* Media */}
              {item.mediaUrl && (
                <div className="mt-4 px-6 pb-4">
                  {isYouTube ? (
                    <div className="aspect-video w-full rounded-xl overflow-hidden">
                       <iframe 
                         src={item.mediaUrl.replace('watch?v=', 'embed/')} 
                         className="w-full h-full"
                         allowFullScreen
                         title="Video Player"
                       />
                    </div>
                  ) : (
                    <img src={item.mediaUrl} alt="Illustration" className="w-full max-h-[400px] object-cover rounded-xl border border-gray-100" />
                  )}
                </div>
              )}

              {/* Footer / Actions */}
              <div className="px-6 py-4 border-t border-gray-50 flex items-center justify-between bg-gray-50/50">
                 <div className="flex -space-x-2">
                   {/* Fake Social Proof */}
                 </div>
                 
                 {item.externalLink && (
                    <a 
                      href={item.externalLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs font-bold bg-white border border-gray-200 text-brand-black px-4 py-2 rounded-lg hover:bg-brand-black hover:text-white transition-colors flex items-center gap-2 shadow-sm ml-auto"
                    >
                      Lire l'article original <ExternalLink size={12} />
                    </a>
                 )}
                 
                 {!item.externalLink && item.type === 'promotion' && (
                   <button className="text-xs font-bold bg-brand-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors ml-auto">
                     Voir l'offre
                   </button>
                 )}
              </div>
            </div>
          );
        })}

        {news.length === 0 && (
          <div className="text-center py-20 bg-gray-50 rounded-2xl border border-gray-100">
            <Bell size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-bold text-gray-500">Aucune actualité pour le moment</h3>
            <p className="text-gray-400">Revenez plus tard pour les dernières mises à jour.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default News;

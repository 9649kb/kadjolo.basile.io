
import React, { useState } from 'react';
import { 
  Megaphone, Plus, Image as ImageIcon, Trash2, Calendar, 
  TrendingUp, Tag, Bell, X, Check, Award
} from 'lucide-react';
import { newsItems as initialNews, currentUser } from '../services/mockData';
import { NewsItem, NewsType } from '../types';

const News: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>(initialNews);
  const [isEditing, setIsEditing] = useState(false);
  const isAdmin = currentUser.role === 'admin';

  // Form State
  const [newItem, setNewItem] = useState<Partial<NewsItem>>({
    title: '',
    content: '',
    type: 'success_story',
    mediaUrl: ''
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
      date: new Date().toISOString().split('T')[0],
      mediaUrl: newItem.mediaUrl,
      isPinned: false
    };

    setNews([item, ...news]);
    setIsEditing(false);
    setNewItem({ title: '', content: '', type: 'success_story', mediaUrl: '' });
  };

  const handleDelete = (id: string) => {
    if (confirm("Confirmer la suppression ?")) {
      setNews(news.filter(n => n.id !== id));
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
      default:
        return { 
          badge: 'bg-blue-100 text-blue-700', 
          border: 'border-blue-200',
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
             <Megaphone className="text-brand-blue" /> Actualités & Nouvelles
           </h1>
           <p className="text-gray-500 mt-1">Restez informé des succès de la communauté et des mises à jour.</p>
        </div>
        
        {isAdmin && (
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className="bg-brand-black text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-800 transition-all shadow-lg"
          >
            {isEditing ? <X size={20} /> : <Plus size={20} />}
            {isEditing ? 'Fermer' : 'Ajouter une nouvelle'}
          </button>
        )}
      </div>

      {/* Admin Editor Panel */}
      {isEditing && isAdmin && (
        <div className="bg-white p-8 rounded-2xl shadow-xl border-l-4 border-brand-blue animate-in slide-in-from-top-4">
           <h2 className="font-bold text-xl mb-6">Publier une annonce</h2>
           <div className="grid md:grid-cols-2 gap-6 mb-6">
             <div className="space-y-4">
               <div>
                 <label className="block text-sm font-bold text-gray-700 mb-2">Titre</label>
                 <input 
                   value={newItem.title}
                   onChange={e => setNewItem({...newItem, title: e.target.value})}
                   className="w-full border border-gray-200 rounded-lg p-3 outline-none focus:ring-2 focus:ring-brand-blue"
                   placeholder="Ex: Record de vente..."
                 />
               </div>
               <div>
                 <label className="block text-sm font-bold text-gray-700 mb-2">Type</label>
                 <select 
                    value={newItem.type}
                    onChange={e => setNewItem({...newItem, type: e.target.value as NewsType})}
                    className="w-full border border-gray-200 rounded-lg p-3 outline-none bg-white"
                 >
                    <option value="success_story">🏆 Succès Vendeur (Preuve de gain)</option>
                    <option value="announcement">📢 Annonce Générale</option>
                    <option value="promotion">🏷️ Promotion / Offre</option>
                    <option value="new_feature">🚀 Nouveauté Plateforme</option>
                 </select>
               </div>
               <div>
                 <label className="block text-sm font-bold text-gray-700 mb-2">Image / Capture d'écran</label>
                 <div className="relative">
                    <input 
                      type="file" 
                      onChange={handleImageUpload}
                      className="hidden" 
                      id="news-upload"
                      accept="image/*"
                    />
                    <label 
                      htmlFor="news-upload"
                      className="flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 text-sm font-medium text-gray-600"
                    >
                      <ImageIcon size={18} />
                      {newItem.mediaUrl ? 'Image sélectionnée (Changer)' : 'Importer une image...'}
                    </label>
                 </div>
               </div>
             </div>
             
             <div>
               <label className="block text-sm font-bold text-gray-700 mb-2">Contenu du message</label>
               <textarea 
                  value={newItem.content}
                  onChange={e => setNewItem({...newItem, content: e.target.value})}
                  className="w-full h-48 border border-gray-200 rounded-lg p-3 outline-none focus:ring-2 focus:ring-brand-blue resize-none"
                  placeholder="Écrivez votre message ici..."
               />
             </div>
           </div>
           
           <div className="flex justify-end pt-4 border-t border-gray-100">
             <button 
               onClick={handlePublish}
               className="bg-brand-green text-white px-8 py-3 rounded-xl font-bold hover:bg-green-700 transition-colors shadow-lg"
             >
               Publier maintenant
             </button>
           </div>
        </div>
      )}

      {/* News Feed */}
      <div className="space-y-6">
        {news.map(item => {
          const style = getTypeStyle(item.type);
          const isYouTube = item.mediaUrl?.includes('youtube.com') || item.mediaUrl?.includes('youtu.be');
          
          return (
            <div key={item.id} className={`bg-white rounded-2xl overflow-hidden shadow-sm border ${style.border} transition-shadow hover:shadow-md animate-in fade-in`}>
              {/* Header */}
              <div className="p-6 pb-2 flex justify-between items-start">
                 <div className="flex items-center gap-3">
                    <span className={`w-10 h-10 rounded-full flex items-center justify-center ${style.badge}`}>
                       {style.icon}
                    </span>
                    <div>
                       <span className={`text-xs font-bold uppercase tracking-wider ${style.badge.split(' ')[1]}`}>
                         {style.label}
                       </span>
                       <h3 className="text-xl font-bold text-brand-black leading-tight mt-1">{item.title}</h3>
                    </div>
                 </div>
                 <div className="flex items-center gap-3">
                   <span className="text-xs text-gray-400 flex items-center gap-1">
                     <Calendar size={12} /> {item.date}
                   </span>
                   {isAdmin && (
                     <button onClick={() => handleDelete(item.id)} className="text-gray-300 hover:text-red-500 transition-colors">
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
                <div className="mt-4">
                  {isYouTube ? (
                    <div className="aspect-video w-full">
                       <iframe 
                         src={item.mediaUrl.replace('watch?v=', 'embed/')} 
                         className="w-full h-full"
                         allowFullScreen
                         title="Video Player"
                       />
                    </div>
                  ) : (
                    <img src={item.mediaUrl} alt="Illustration" className="w-full max-h-[500px] object-cover bg-gray-100" />
                  )}
                </div>
              )}

              {/* Footer / Actions (Mock) */}
              <div className="px-6 py-4 border-t border-gray-50 flex items-center justify-between">
                 <div className="flex -space-x-2">
                   {[1,2,3].map(i => (
                     <div key={i} className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-[10px] text-gray-500 font-bold">
                       {i}
                     </div>
                   ))}
                   <span className="text-xs text-gray-400 pl-3 self-center">+12 réactions</span>
                 </div>
                 {item.type === 'promotion' && (
                   <button className="text-xs font-bold bg-brand-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">
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

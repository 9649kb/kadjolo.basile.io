
import React, { useState, useEffect } from 'react';
import { Youtube, ExternalLink, Play, RefreshCw, Radio, CheckCircle, Clock, Eye } from 'lucide-react';
import { siteConfig } from '../services/mockData';
import { fetchLatestVideos } from '../services/youtubeService';
import { YouTubeVideo } from '../types';

const YouTubePage: React.FC = () => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState('En attente...');
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Synchronisation automatique au chargement
  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    setIsLoading(true);
    const data = await fetchLatestVideos();
    setVideos(data);
    setLastSync(new Date().toLocaleTimeString());
    setIsLoading(false);
  };

  const handleManualSync = async () => {
    setIsSyncing(true);
    await loadVideos();
    setTimeout(() => {
      setIsSyncing(false);
    }, 1000);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 max-w-7xl mx-auto px-4">
      {/* Header Premium de la Chaîne - Cadre Rouge */}
      <div className="bg-red-600 rounded-[40px] p-8 md:p-16 text-white relative overflow-hidden shadow-2xl border border-white/10">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
           <div className="flex items-center gap-8">
             {/* Logo YouTube Principal + Certification avec Cadre YouTube Logo */}
             <div className="relative">
                {/* Logo Principal Blanc flottant */}
                <div className="w-24 h-24 bg-white text-red-600 rounded-3xl flex items-center justify-center shadow-2xl transform -rotate-3 ring-4 ring-white/20 animate-float">
                  <Youtube size={48} fill="currentColor" />
                </div>
                
                {/* Certification : Le cadre derrière la certification est le logo YouTube */}
                <div className="absolute -bottom-3 -right-3 animate-bounce">
                   <div className="relative">
                      {/* Cadre Logo YouTube servant de base */}
                      <div className="bg-white p-2 rounded-2xl shadow-2xl border-4 border-red-600 transform rotate-12">
                        <Youtube size={24} className="text-red-600" fill="currentColor" />
                      </div>
                      {/* Sceau de certification (Check) superposé */}
                      <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-0.5 border-2 border-white shadow-lg">
                        <CheckCircle size={14} fill="white" className="text-green-500" />
                      </div>
                   </div>
                </div>
             </div>
             
             <div className="text-center md:text-left">
               <div className="flex flex-col md:flex-row items-center gap-3">
                  <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic">KADJOLO BASILE</h1>
                  <div className="flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full border border-white/30 animate-pulse">
                    <Youtube size={12} fill="white" />
                    <span className="text-[10px] font-black uppercase tracking-widest">OFFICIEL</span>
                  </div>
               </div>
               <p className="text-white/80 flex items-center justify-center md:justify-start gap-2 text-sm mt-3 font-medium">
                 <Radio size={16} className="text-white animate-pulse" /> 
                 Chaîne de Leadership certifiée par YouTube
               </p>
             </div>
           </div>
           
           <a 
             href={siteConfig.socials.youtube}
             target="_blank" 
             rel="noopener noreferrer"
             className="bg-white text-red-600 px-10 py-5 rounded-2xl font-black hover:bg-gray-100 transition-all shadow-xl flex items-center gap-3 transform hover:scale-105 active:scale-95"
           >
             S'abonner à la chaîne <ExternalLink size={20} />
           </a>
        </div>
        
        {/* Motif décoratif en arrière-plan */}
        <div className="absolute top-0 right-0 opacity-[0.15] transform translate-x-20 -translate-y-20 rotate-12">
          <Youtube size={500} fill="white" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 via-transparent to-black/30 pointer-events-none"></div>
      </div>

      {/* Barre de contrôle de synchronisation */}
      <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 gap-4">
        <div>
           <h2 className="text-2xl font-black text-brand-black uppercase tracking-tight">Vidéos Récents</h2>
           <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mt-1 flex items-center gap-2">
             <Clock size={12} /> Dernière synchronisation : {lastSync}
           </p>
        </div>
        <button 
          onClick={handleManualSync}
          disabled={isSyncing}
          className="flex items-center gap-2 bg-brand-gray hover:bg-gray-100 text-brand-black px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all disabled:opacity-50 border border-gray-100 shadow-sm"
        >
          {isSyncing ? <RefreshCw size={14} className="animate-spin" /> : <RefreshCw size={14} />}
          {isSyncing ? 'Synchronisation...' : 'Actualiser le flux'}
        </button>
      </div>

      {/* Grille de Vidéos - Affichage des miniatures hqdefault garanti */}
      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {[1,2,3,4,5,6,7,8,9].map(i => (
            <div key={i} className="h-[400px] bg-white rounded-[32px] animate-pulse border border-gray-100 shadow-sm"></div>
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {videos.map(video => (
            <div key={video.id} className="group bg-white rounded-[32px] overflow-hidden shadow-sm border border-gray-100 hover:shadow-2xl transition-all duration-500 flex flex-col hover:-translate-y-2">
              {/* Miniature avec Overlay Cliquable */}
              <a href={video.url} target="_blank" rel="noopener noreferrer" className="relative h-56 overflow-hidden block bg-brand-black">
                <img 
                  src={video.thumbnail} 
                  alt={video.title} 
                  className="w-full h-full object-cover group-hover:scale-110 opacity-90 group-hover:opacity-100 transition-all duration-1000"
                  loading="lazy"
                  onError={(e) => {
                    // Fallback de sécurité : hqdefault est disponible pour 100% des vidéos
                    (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`;
                  }}
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center text-white shadow-2xl transform scale-75 group-hover:scale-100 transition-transform duration-300">
                      <Play size={32} fill="white" />
                    </div>
                </div>
                <div className="absolute bottom-4 left-4 bg-brand-black/80 backdrop-blur-md text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest border border-white/10 flex items-center gap-1.5">
                   <Eye size={12} /> {video.views} vues
                </div>
              </a>

              {/* Infos Vidéo */}
              <div className="p-8 flex-1 flex flex-col">
                <a href={video.url} target="_blank" rel="noopener noreferrer">
                  <h3 className="font-black text-xl text-brand-black mb-5 line-clamp-2 group-hover:text-red-600 transition-colors leading-tight font-sans" title={video.title}>
                    {video.title}
                  </h3>
                </a>
                
                <div className="mt-auto flex items-center justify-between pt-6 border-t border-gray-50">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-red-50 text-red-600 rounded-lg flex items-center justify-center shadow-inner">
                       <Youtube size={14}/>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{video.publishedAt}</span>
                  </div>
                  <a 
                    href={video.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[10px] font-black text-white bg-red-600 px-6 py-2.5 rounded-xl uppercase tracking-widest hover:bg-red-700 transition-all flex items-center gap-2 shadow-lg shadow-red-600/20 active:scale-95"
                  >
                    Regarder <Play size={10} fill="currentColor" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default YouTubePage;

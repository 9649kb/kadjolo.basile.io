
import React, { useState, useEffect } from 'react';
import { Youtube, ExternalLink, Play, RefreshCw, Radio } from 'lucide-react';
import { siteConfig } from '../services/mockData';
import { fetchLatestVideos } from '../services/youtubeService';
import { YouTubeVideo } from '../types';

const YouTubePage: React.FC = () => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState('À l\'instant');
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Automatic Sync on Mount
  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    setIsLoading(true);
    const data = await fetchLatestVideos();
    setVideos(data);
    setIsLoading(false);
  };

  const handleManualSync = async () => {
    setIsSyncing(true);
    await loadVideos();
    setTimeout(() => {
      setIsSyncing(false);
      setLastSync(new Date().toLocaleTimeString());
    }, 1000);
  };

  return (
    <div className="space-y-8">
      {/* Channel Header */}
      <div className="bg-red-600 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
           <div className="flex items-center gap-6">
             <div className="w-20 h-20 bg-white text-red-600 rounded-full flex items-center justify-center shadow-lg">
               <Youtube size={40} />
             </div>
             <div>
               <h1 className="text-3xl font-bold">KADJOLO BASILE TV</h1>
               <p className="text-red-100 flex items-center gap-2">
                 <Radio size={16} className="animate-pulse" /> 
                 Synchronisation automatique active
               </p>
             </div>
           </div>
           <a 
             href={siteConfig.socials.youtube}
             target="_blank" 
             rel="noopener noreferrer"
             className="bg-white text-red-600 px-8 py-3 rounded-full font-bold hover:bg-red-50 transition-colors shadow-lg flex items-center gap-2"
           >
             S'abonner maintenant <ExternalLink size={18} />
           </a>
        </div>
        {/* Background Pattern */}
        <div className="absolute top-0 right-0 opacity-20 transform translate-x-10 -translate-y-10">
          <Youtube size={300} />
        </div>
      </div>

      {/* Sync Control */}
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div>
           <h2 className="text-xl font-bold text-brand-black font-serif">Dernières Vidéos</h2>
           <p className="text-xs text-gray-500">Flux synchronisé directement avec YouTube</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400 hidden sm:inline">Dernière maj: {lastSync}</span>
          <button 
            onClick={handleManualSync}
            disabled={isSyncing}
            className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-brand-black px-4 py-2 rounded-lg text-sm font-bold transition-colors disabled:opacity-50"
          >
            {isSyncing ? <RefreshCw size={16} className="animate-spin" /> : <RefreshCw size={16} />}
            {isSyncing ? 'Synchronisation...' : 'Actualiser'}
          </button>
        </div>
      </div>

      {/* Video Grid */}
      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1,2,3].map(i => (
            <div key={i} className="h-64 bg-gray-200 rounded-xl animate-pulse"></div>
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {videos.map(video => (
            <div key={video.id} className="group bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 flex flex-col">
              <a href={video.url} target="_blank" rel="noopener noreferrer" className="relative h-48 overflow-hidden block">
                <img 
                  src={video.thumbnail} 
                  alt={video.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center text-white shadow-xl transform scale-75 group-hover:scale-100 transition-transform">
                      <Play size={32} fill="white" />
                    </div>
                </div>
              </a>
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="font-bold text-lg text-brand-black mb-2 line-clamp-2 group-hover:text-red-600 transition-colors" title={video.title}>
                  {video.title}
                </h3>
                <div className="flex items-center justify-between text-xs text-gray-500 mt-auto pt-4 border-t border-gray-50">
                  <span className="flex items-center gap-1"><Youtube size={12} /> {video.views} vues</span>
                  <span>{video.publishedAt}</span>
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

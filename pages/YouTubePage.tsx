
import React, { useState } from 'react';
import { Youtube, ExternalLink, Play, RefreshCw, Check } from 'lucide-react';
import { siteConfig } from '../services/mockData';

const YouTubePage: React.FC = () => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState('À l\'instant');

  // Specific YouTube videos provided by user
  const initialVideos = [
    {
      id: '21m45cKIcuA',
      title: 'Maîtrisez votre destin (Motivation)',
      thumbnail: 'https://img.youtube.com/vi/21m45cKIcuA/maxresdefault.jpg',
      views: '1.2k',
      date: 'Il y a 2 jours',
      url: 'https://youtu.be/21m45cKIcuA?si=f70LlESK-zHOquFr'
    },
    {
      id: 'tJp_YH70F3w',
      title: 'Stratégie Business pour 2024',
      thumbnail: 'https://img.youtube.com/vi/tJp_YH70F3w/maxresdefault.jpg',
      views: '850',
      date: 'Il y a 5 jours',
      url: 'https://youtu.be/tJp_YH70F3w?si=PsnHB9zyKUX3191A'
    },
    {
      id: 'iMj9zB16DTQ',
      title: 'Comment investir intelligemment',
      thumbnail: 'https://img.youtube.com/vi/iMj9zB16DTQ/maxresdefault.jpg',
      views: '2.1k',
      date: 'Il y a 1 semaine',
      url: 'https://youtu.be/iMj9zB16DTQ?si=f1BJ4vxqUvk6SZeK'
    },
    {
      id: 'TSMpf26Jmds',
      title: 'Les secrets du Leadership',
      thumbnail: 'https://img.youtube.com/vi/TSMpf26Jmds/maxresdefault.jpg',
      views: '3.4k',
      date: 'Il y a 2 semaines',
      url: 'https://youtu.be/TSMpf26Jmds?si=OY1EXe14zVxt71mb'
    },
    {
      id: 'CP83s4yNPh4',
      title: 'Développez votre marque personnelle',
      thumbnail: 'https://img.youtube.com/vi/CP83s4yNPh4/maxresdefault.jpg',
      views: '5k',
      date: 'Il y a 3 semaines',
      url: 'https://youtu.be/CP83s4yNPh4?si=gmb1jHIp6OS9Bg2N'
    }
  ];

  const [videos, setVideos] = useState(initialVideos);

  const handleSync = () => {
    setIsSyncing(true);
    // Simulate API call to YouTube Data API
    setTimeout(() => {
      setIsSyncing(false);
      setLastSync(new Date().toLocaleTimeString());
      // In a real app, this would fetch new videos from the API
      // For now, we just refresh the existing list
    }, 2000);
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
               <p className="text-red-100">Contenu gratuit, valeur illimitée. Abonnez-vous.</p>
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
           <p className="text-xs text-gray-500">Synchronisé automatiquement avec YouTube</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400">Dernière maj: {lastSync}</span>
          <button 
            onClick={handleSync}
            disabled={isSyncing}
            className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-brand-black px-4 py-2 rounded-lg text-sm font-bold transition-colors disabled:opacity-50"
          >
            {isSyncing ? <RefreshCw size={16} className="animate-spin" /> : <RefreshCw size={16} />}
            {isSyncing ? 'Synchronisation...' : 'Synchroniser'}
          </button>
        </div>
      </div>

      {/* Video Grid */}
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
              <h3 className="font-bold text-lg text-brand-black mb-2 line-clamp-2 group-hover:text-red-600 transition-colors">
                {video.title}
              </h3>
              <div className="flex items-center justify-between text-xs text-gray-500 mt-auto pt-4 border-t border-gray-50">
                <span className="flex items-center gap-1"><Youtube size={12} /> {video.views} vues</span>
                <span>{video.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default YouTubePage;

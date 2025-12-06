import React, { useState, useRef } from 'react';
import { Send, Users, Mic, Video as VideoIcon, Play, Link as LinkIcon, Youtube, Globe, AlertCircle } from 'lucide-react';
import { currentUser } from '../services/mockData';
import { ChatMessage } from '../types';

const LiveStream: React.FC = () => {
  const [isLive, setIsLive] = useState(false);
  const [streamType, setStreamType] = useState<'camera' | 'external'>('external');
  const [externalUrl, setExternalUrl] = useState('');
  const [embedUrl, setEmbedUrl] = useState('');
  
  const [viewerCount] = useState(1204);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', user: 'Jean', text: 'Hâte que ça commence !', timestamp: '19:58' },
    { id: '2', user: 'Marie', text: 'Bonjour à tous depuis Paris', timestamp: '19:59' },
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [hasCameraAccess, setHasCameraAccess] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Helper to extract YouTube ID
  const getYouTubeEmbedUrl = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}?autoplay=1` : null;
  };

  const startStream = async () => {
    if (streamType === 'camera') {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setHasCameraAccess(true);
        setIsLive(true);
      } catch (err) {
        console.error("Error accessing media devices", err);
        alert("Impossible d'accéder à la caméra/micro. Vérifiez vos permissions.");
      }
    } else {
      // External Stream Logic
      if (!externalUrl) {
        alert("Veuillez entrer un lien valide.");
        return;
      }
      
      const ytEmbed = getYouTubeEmbedUrl(externalUrl);
      if (ytEmbed) {
        setEmbedUrl(ytEmbed);
      } else {
        // Assume it's a direct link to another platform, we'll show a button
        setEmbedUrl(externalUrl);
      }
      setIsLive(true);
    }
  };

  const stopStream = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsLive(false);
    setHasCameraAccess(false);
    setEmbedUrl('');
  };

  const handleSend = () => {
    if(!inputMsg.trim()) return;
    setMessages([...messages, {
      id: Date.now().toString(),
      user: currentUser.name,
      text: inputMsg,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit'})
    }]);
    setInputMsg('');
  };

  const isYouTube = embedUrl.includes('youtube.com/embed');

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col md:flex-row gap-4">
      {/* Video / Stream Area */}
      <div className="flex-1 bg-black rounded-2xl overflow-hidden relative flex flex-col shadow-xl">
        <div className="absolute top-4 left-4 z-10 flex gap-2">
          {isLive ? (
            <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded animate-pulse">EN DIRECT</span>
          ) : (
            <span className="bg-gray-700 text-white text-xs font-bold px-3 py-1 rounded">HORS LIGNE</span>
          )}
          <span className="bg-black/50 backdrop-blur text-white text-xs font-medium px-3 py-1 rounded flex items-center gap-2">
            <Users size={12} /> {isLive ? viewerCount : 0}
          </span>
        </div>

        <div className="w-full h-full flex flex-col justify-center items-center relative">
            {!isLive ? (
              // OFFLINE STATE
              <div className="text-center p-8 max-w-lg">
                 <div className="w-20 h-20 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-800 text-gray-500">
                    <VideoIcon size={40} />
                 </div>
                 
                 {currentUser.role !== 'student' ? (
                   <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 w-full">
                     <h3 className="text-white font-bold mb-4">Configurer le Live</h3>
                     
                     <div className="flex bg-gray-800 rounded-lg p-1 mb-4">
                       <button 
                        onClick={() => setStreamType('external')}
                        className={`flex-1 py-2 text-sm rounded font-medium transition-colors ${streamType === 'external' ? 'bg-brand-blue text-white' : 'text-gray-400 hover:text-white'}`}
                       >
                         Lien Externe (YouTube/FB)
                       </button>
                       <button 
                        onClick={() => setStreamType('camera')}
                        className={`flex-1 py-2 text-sm rounded font-medium transition-colors ${streamType === 'camera' ? 'bg-brand-blue text-white' : 'text-gray-400 hover:text-white'}`}
                       >
                         Webcam Directe
                       </button>
                     </div>

                     {streamType === 'external' && (
                       <div className="mb-4">
                         <label className="text-xs text-gray-400 block mb-2 text-left">Lien du stream (YouTube, Facebook, Twitch...)</label>
                         <input 
                           type="text" 
                           placeholder="Ex: https://youtube.com/watch?v=..."
                           value={externalUrl}
                           onChange={(e) => setExternalUrl(e.target.value)}
                           className="w-full bg-black border border-gray-700 rounded p-2 text-white text-sm focus:border-brand-blue outline-none"
                         />
                         <p className="text-xs text-gray-500 mt-2 text-left flex items-center gap-1">
                           <AlertCircle size={10} /> Les liens YouTube seront intégrés automatiquement.
                         </p>
                       </div>
                     )}

                     <button 
                      onClick={startStream}
                      className="w-full bg-brand-blue hover:bg-blue-600 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/20"
                     >
                       <Play size={20} /> Commencer le Live
                     </button>
                   </div>
                 ) : (
                   <p className="text-gray-400">Le live n'a pas encore commencé. Veuillez patienter...</p>
                 )}
              </div>
            ) : (
              // LIVE STATE
              <>
                {streamType === 'camera' && hasCameraAccess && (
                  <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
                )}

                {streamType === 'external' && (
                  isYouTube ? (
                    <iframe 
                      src={embedUrl} 
                      title="Live Stream" 
                      className="w-full h-full" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                      allowFullScreen
                    ></iframe>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full w-full bg-gray-900 p-8 text-center">
                       <Globe size={64} className="text-brand-blue mb-4" />
                       <h3 className="text-white text-xl font-bold mb-2">Diffusion sur plateforme externe</h3>
                       <p className="text-gray-400 mb-6">Ce live est hébergé sur une autre plateforme.</p>
                       <a 
                         href={embedUrl} 
                         target="_blank" 
                         rel="noopener noreferrer"
                         className="bg-white text-brand-black px-6 py-3 rounded-full font-bold hover:bg-gray-200 transition-colors flex items-center gap-2"
                       >
                         Rejoindre le Live <LinkIcon size={16} />
                       </a>
                    </div>
                  )
                )}

                {/* Controls Overlay (Only for creator/admin and webcam mode or to stop external) */}
                {currentUser.role !== 'student' && (
                  <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-4 z-20">
                    {streamType === 'camera' && (
                      <>
                        <button className="p-4 bg-gray-900/80 hover:bg-gray-900 text-white rounded-full backdrop-blur transition-colors"><Mic size={20} /></button>
                        <button className="p-4 bg-gray-900/80 hover:bg-gray-900 text-white rounded-full backdrop-blur transition-colors"><VideoIcon size={20} /></button>
                      </>
                    )}
                    <button onClick={stopStream} className="p-4 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg font-bold px-8 transition-colors">ARRÊTER LE LIVE</button>
                  </div>
                )}
              </>
            )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="w-full md:w-80 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-bold text-brand-black">Chat en direct</h3>
          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full flex items-center gap-1">
             <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Actif
          </span>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map(msg => (
            <div key={msg.id} className="text-sm animate-in slide-in-from-bottom-2">
              <span className="font-bold text-brand-blue">{msg.user}</span>
              <span className="text-gray-400 text-xs ml-2">{msg.timestamp}</span>
              <p className="text-gray-700 mt-1 break-words">{msg.text}</p>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-gray-100 bg-brand-gray rounded-b-2xl">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Dire quelque chose..."
              className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand-blue text-brand-black"
            />
            <button 
              onClick={handleSend}
              className="bg-brand-black text-white p-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveStream;
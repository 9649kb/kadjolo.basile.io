
import React, { useState } from 'react';
import { X, Link as LinkIcon, Smartphone, Facebook, Linkedin, Instagram, Copy, Twitter, Check } from 'lucide-react';

interface SocialShareProps {
  url: string;
  title: string;
  onClose: () => void;
  subtitle?: string;
}

const SocialShare: React.FC<SocialShareProps> = ({ url, title, onClose, subtitle }) => {
  const [copied, setCopied] = useState(false);
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const handleShare = (platform: string) => {
    let shareUrl = '';
    switch (platform) {
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
        break;
      default:
        return;
    }
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Platforms that typically require copying the link on web
  const handleCopyPlatform = (platformName: string) => {
    copyToClipboard();
    // Optional: could show a specific message like "Link copied! Open TikTok to paste."
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="bg-brand-black p-4 flex justify-between items-center text-white">
          <div>
            <h3 className="font-bold text-lg">Partager</h3>
            {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
          </div>
          <button onClick={onClose} className="hover:bg-gray-800 p-1 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6">
          <p className="text-sm font-bold text-gray-700 mb-6 truncate text-center">{title}</p>
          
          <div className="grid grid-cols-3 gap-4 mb-8">
            <button onClick={() => handleShare('whatsapp')} className="flex flex-col items-center gap-2 group">
              <div className="w-14 h-14 bg-green-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-green-200 group-hover:scale-110 transition-transform">
                <Smartphone size={28} />
              </div>
              <span className="text-xs font-bold text-gray-600">WhatsApp</span>
            </button>
            
            <button onClick={() => handleShare('facebook')} className="flex flex-col items-center gap-2 group">
              <div className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200 group-hover:scale-110 transition-transform">
                <Facebook size={28} />
              </div>
              <span className="text-xs font-bold text-gray-600">Facebook</span>
            </button>

             <button onClick={() => handleCopyPlatform('tiktok')} className="flex flex-col items-center gap-2 group">
              <div className="w-14 h-14 bg-black text-white rounded-2xl flex items-center justify-center shadow-lg shadow-gray-200 group-hover:scale-110 transition-transform relative overflow-hidden">
                {/* Simple CSS TikTok-ish effect or Icon */}
                 <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
                {copied && <div className="absolute inset-0 bg-black/80 flex items-center justify-center"><Check size={20}/></div>}
              </div>
              <span className="text-xs font-bold text-gray-600">TikTok</span>
            </button>
            
            <button onClick={() => handleShare('linkedin')} className="flex flex-col items-center gap-2 group">
              <div className="w-14 h-14 bg-blue-700 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200 group-hover:scale-110 transition-transform">
                <Linkedin size={28} />
              </div>
              <span className="text-xs font-bold text-gray-600">LinkedIn</span>
            </button>
            
            <button onClick={() => handleCopyPlatform('instagram')} className="flex flex-col items-center gap-2 group">
              <div className="w-14 h-14 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-pink-200 group-hover:scale-110 transition-transform relative">
                <Instagram size={28} />
                {copied && <div className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center"><Check size={20}/></div>}
              </div>
              <span className="text-xs font-bold text-gray-600">Instagram</span>
            </button>
            
            <button onClick={() => handleShare('twitter')} className="flex flex-col items-center gap-2 group">
              <div className="w-14 h-14 bg-black text-white rounded-2xl flex items-center justify-center shadow-lg shadow-gray-200 group-hover:scale-110 transition-transform">
                <Twitter size={28} />
              </div>
              <span className="text-xs font-bold text-gray-600">X / Twitter</span>
            </button>
          </div>

          <div className="relative group">
            <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl p-4 transition-colors group-hover:border-brand-blue">
              <LinkIcon size={20} className="text-gray-400 flex-shrink-0 group-hover:text-brand-blue" />
              <div className="flex-1 min-w-0">
                 <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-0.5">Lien direct</p>
                 <input 
                    readOnly 
                    value={url} 
                    className="bg-transparent border-none text-sm text-gray-800 w-full outline-none truncate font-mono font-medium"
                  />
              </div>
            </div>
            <button 
              onClick={copyToClipboard}
              className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-all flex items-center gap-2 font-bold text-xs ${copied ? 'bg-green-500 text-white' : 'bg-brand-blue text-white hover:bg-blue-600'}`}
            >
              {copied ? (
                <>Copié <Check size={14} /></>
              ) : (
                <>Copier <Copy size={14} /></>
              )}
            </button>
          </div>
          
          <div className="mt-4 text-center">
             <p className="text-[10px] text-gray-400">
               Pour Instagram et TikTok, copiez le lien et collez-le dans votre bio ou story.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialShare;

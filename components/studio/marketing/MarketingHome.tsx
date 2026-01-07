
import React from 'react';
import { 
  Tag, MousePointerClick, Layout, Target, ArrowRight, 
  Sparkles, Megaphone, Ticket, Monitor, Zap
} from 'lucide-react';

interface MarketingHomeProps {
  onNavigate: (view: any) => void;
}

const MarketingHome: React.FC<MarketingHomeProps> = ({ onNavigate }) => {
  const marketingTools = [
    { 
      id: 'discounts', 
      label: 'Réductions', 
      desc: 'Offrez des réductions et codes promo pour déclencher l\'achat et fidéliser vos clients.', 
      icon: <Tag size={24} />, 
      color: 'bg-blue-100 text-blue-600' 
    },
    { 
      id: 'popups', 
      label: 'Popups', 
      desc: 'Mettez en avant vos offres et promotions à un moment clé pour capturer l\'attention.', 
      icon: <MousePointerClick size={24} />, 
      color: 'bg-cyan-100 text-cyan-600' 
    },
    { 
      id: 'banners', 
      label: 'Bannières', 
      desc: 'Diffusez un message promotionnel en haut de votre boutique pour annoncer vos nouveautés.', 
      icon: <Monitor size={24} />, 
      color: 'bg-yellow-100 text-yellow-600' 
    },
    { 
      id: 'campaigns', 
      label: 'Campagnes', 
      desc: 'Créez des liens de suivi pour savoir quelles publicités ou réseaux vous rapportent le plus.', 
      icon: <Zap size={24} />, 
      color: 'bg-green-100 text-green-600' 
    },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-10 animate-in fade-in duration-700">
      {/* HEADER STYLE CAPTURE */}
      <div className="space-y-2">
        <h1 className="text-6xl font-serif font-medium text-gray-900 leading-tight">Marketing</h1>
        <p className="text-gray-500 text-lg leading-relaxed font-medium">
          Boostez vos ventes avec des outils marketing puissants et faciles à utiliser
        </p>
      </div>

      {/* LISTE DES OUTILS */}
      <div className="space-y-4">
        {marketingTools.map((tool) => (
          <button 
            key={tool.id} 
            onClick={() => onNavigate(tool.id)} 
            className="w-full bg-white p-6 rounded-[24px] border border-transparent hover:border-gray-100 hover:shadow-xl hover:shadow-gray-200/40 transition-all duration-300 flex items-center gap-6 text-left group"
          >
            {/* ICON CONTAINER */}
            <div className={`w-14 h-14 ${tool.color} rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
              {tool.icon}
            </div>
            
            {/* TEXT CONTENT */}
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-bold text-gray-900 mb-1">{tool.label}</h3>
              <p className="text-gray-400 text-sm font-medium leading-snug line-clamp-2">
                {tool.desc}
              </p>
            </div>

            {/* TRAILING ARROW */}
            <div className="text-gray-300 group-hover:text-gray-900 group-hover:translate-x-1 transition-all">
              <ArrowRight size={24} />
            </div>
          </button>
        ))}
      </div>

      {/* FOOTER SUBTILE */}
      <div className="pt-10 border-t border-gray-100 flex items-center justify-between">
         <div className="flex items-center gap-2 text-[10px] font-black text-gray-300 uppercase tracking-widest">
            <Sparkles size={12}/> Système de croissance Kadjolo Basile
         </div>
         <button className="text-[10px] font-black text-brand-blue uppercase tracking-widest border-b border-brand-blue pb-1 hover:opacity-70 transition-opacity">
            Voir les tutoriels
         </button>
      </div>
    </div>
  );
};

export default MarketingHome;

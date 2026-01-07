
import React, { useState } from 'react';
import { ChevronLeft, Info, Facebook, Globe, Save } from 'lucide-react';

const PixelSection: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [trackingIds, setTrackingIds] = useState(() => {
    const saved = localStorage.getItem('kadjolo_tracking');
    return saved ? JSON.parse(saved) : { facebook: '', google: '' };
  });

  const handleSave = () => {
    localStorage.setItem('kadjolo_tracking', JSON.stringify(trackingIds));
    alert("Paramètres enregistrés.");
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="p-2.5 bg-white text-gray-400 rounded-2xl border border-gray-100 shadow-sm hover:text-gray-900 transition-colors"><ChevronLeft size={20}/></button>
        <h2 className="text-2xl font-black text-gray-900 uppercase italic tracking-tighter">Tracking Pixel & Analytics</h2>
      </div>
      <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm space-y-8 max-w-3xl mx-auto">
        <div className="bg-blue-50 border border-blue-100 p-6 rounded-3xl">
          <div className="flex items-center gap-2 text-brand-blue mb-2">
            <Info size={18}/>
            <h4 className="text-[10px] font-black uppercase tracking-widest">Pourquoi configurer ces IDs ?</h4>
          </div>
          <p className="text-xs text-blue-700 leading-relaxed font-medium">Le suivi précis vous permet de voir quelles publicités génèrent réellement des ventes sur votre boutique.</p>
        </div>
        <div className="space-y-6">
          <div className="space-y-4">
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Facebook Pixel ID</label>
            <div className="relative">
              <Facebook size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                value={trackingIds.facebook} 
                onChange={e => setTrackingIds({...trackingIds, facebook: e.target.value})}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl font-mono text-sm focus:ring-2 focus:ring-brand-blue/10 outline-none" 
                placeholder="Ex: 123456789012345"
              />
            </div>
          </div>
          <div className="space-y-4">
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Google Analytics G-ID</label>
            <div className="relative">
              <Globe size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                value={trackingIds.google} 
                onChange={e => setTrackingIds({...trackingIds, google: e.target.value})}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl font-mono text-sm focus:ring-2 focus:ring-brand-blue/10 outline-none" 
                placeholder="Ex: G-XXXXXXXXXX"
              />
            </div>
          </div>
          <button onClick={handleSave} className="w-full py-5 bg-brand-black text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-gray-800 transition-all flex items-center justify-center gap-2">
            <Save size={16}/> Enregistrer les paramètres
          </button>
        </div>
      </div>
    </div>
  );
};

export default PixelSection;

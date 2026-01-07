
import React, { useState } from 'react';
import { 
  Settings, Shield, User, Palette, Globe, Code, 
  Save, Image as ImageIcon, Smartphone, Facebook, 
  Instagram, Youtube, Check, RefreshCw, Type
} from 'lucide-react';
import { useUser } from '../../contexts/UserContext';

const SettingsManager: React.FC = () => {
  const { user } = useUser();
  const [activeSection, setActiveSection] = useState<'branding' | 'shop' | 'advanced'>('branding');
  
  const [config, setConfig] = useState({
    shopName: 'Elite Business Academy',
    description: 'Expert en leadership et croissance exponentielle.',
    primaryColor: '#2563eb',
    font: 'sans',
    facebookPixel: '',
    googleAnalytics: '',
    customScripts: ''
  });

  const handleSave = () => {
    alert("Configuration sauvegardée avec succès !");
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-24">
      
      {/* NAVIGATION INTERNE */}
      <div className="flex gap-2 p-1 bg-white border border-gray-100 rounded-2xl w-fit">
        {[
          { id: 'branding', label: 'Branding', icon: <Palette size={14}/> },
          { id: 'shop', label: 'Boutique', icon: <Globe size={14}/> },
          { id: 'advanced', label: 'Suivi & Scripts', icon: <Code size={14}/> }
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveSection(tab.id as any)}
            className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeSection === tab.id ? 'bg-brand-black text-white shadow-lg' : 'text-gray-400 hover:bg-gray-50'}`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* FORMULAIRE PRINCIPAL */}
        <div className="lg:col-span-7 space-y-8">
           
           {activeSection === 'branding' && (
             <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm space-y-8 animate-in slide-in-from-left-4">
                <div className="space-y-6">
                   <h3 className="font-black text-gray-900 uppercase tracking-tighter flex items-center gap-3">
                     <Palette className="text-brand-blue" /> Identité Visuelle
                   </h3>
                   
                   <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Couleur Signature</label>
                         <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                            <input 
                              type="color" 
                              value={config.primaryColor} 
                              onChange={e => setConfig({...config, primaryColor: e.target.value})}
                              className="w-12 h-12 rounded-xl overflow-hidden border-none p-0 cursor-pointer shadow-lg" 
                            />
                            <span className="text-xs font-mono font-black uppercase text-gray-500">{config.primaryColor}</span>
                         </div>
                      </div>

                      <div className="space-y-4">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Style Typographique</label>
                         <div className="flex p-1 bg-gray-50 rounded-2xl border border-gray-200">
                            <button 
                              onClick={() => setConfig({...config, font: 'sans'})}
                              className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase transition-all ${config.font === 'sans' ? 'bg-brand-black text-white' : 'text-gray-400'}`}
                            >Sans-Serif</button>
                            <button 
                              onClick={() => setConfig({...config, font: 'serif'})}
                              className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase transition-all ${config.font === 'serif' ? 'bg-brand-black text-white' : 'text-gray-400'}`}
                            >Sérif Class</button>
                         </div>
                      </div>
                   </div>

                   <div className="space-y-4">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Logotype Boutique</label>
                      <div className="aspect-video md:aspect-auto md:h-32 bg-gray-50 border-2 border-dashed border-gray-200 rounded-[32px] flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors">
                         <div className="text-center">
                            <ImageIcon size={32} className="text-gray-300 mx-auto mb-2" />
                            <p className="text-[9px] font-black text-gray-400 uppercase">Importer le logo</p>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
           )}

           {activeSection === 'shop' && (
             <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm space-y-8 animate-in slide-in-from-left-4">
                <div className="space-y-6">
                   <h3 className="font-black text-gray-900 uppercase tracking-tighter">Profil Public</h3>
                   <div className="space-y-4">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Nom commercial</label>
                      <input 
                        value={config.shopName} 
                        onChange={e => setConfig({...config, shopName: e.target.value})}
                        className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold focus:ring-2 focus:ring-brand-blue/10" 
                      />
                   </div>
                   <div className="space-y-4">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Description</label>
                      <textarea 
                        value={config.description} 
                        onChange={e => setConfig({...config, description: e.target.value})}
                        className="w-full bg-gray-50 border-none rounded-2xl p-4 font-medium focus:ring-2 focus:ring-brand-blue/10 h-32 resize-none" 
                      />
                   </div>
                </div>
             </div>
           )}

           {activeSection === 'advanced' && (
             <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm space-y-8 animate-in slide-in-from-left-4">
                <div className="space-y-6">
                   <h3 className="font-black text-gray-900 uppercase tracking-tighter flex items-center gap-3">
                     <Code className="text-brand-blue" /> Scripts & Tracking
                   </h3>
                   <p className="text-xs text-gray-400 font-bold uppercase tracking-widest leading-relaxed">Ajoutez vos pixels de suivi et scripts personnalisés ici.</p>
                   
                   <div className="space-y-4">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Facebook Pixel ID</label>
                      <input 
                        value={config.facebookPixel} 
                        onChange={e => setConfig({...config, facebookPixel: e.target.value})}
                        className="w-full bg-gray-50 border-none rounded-2xl p-4 font-mono text-sm focus:ring-2 focus:ring-brand-blue/10" 
                      />
                   </div>
                   
                   <div className="space-y-4">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Google Analytics G-ID</label>
                      <input 
                        value={config.googleAnalytics} 
                        onChange={e => setConfig({...config, googleAnalytics: e.target.value})}
                        className="w-full bg-gray-50 border-none rounded-2xl p-4 font-mono text-sm focus:ring-2 focus:ring-brand-blue/10" 
                      />
                   </div>
                </div>
             </div>
           )}

           <button 
             onClick={handleSave}
             className="w-full py-5 bg-brand-black text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-gray-800 transition-all flex items-center justify-center gap-3"
           >
              <Save size={18}/> Enregistrer les paramètres
           </button>
        </div>

        {/* SIDEBAR PREVIEW */}
        <div className="lg:col-span-5 space-y-6">
           <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6">Aperçu Boutique</h4>
              <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100">
                 <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl shadow-md flex items-center justify-center text-white" style={{backgroundColor: config.primaryColor}}>
                       <Globe size={24}/>
                    </div>
                    <div>
                       <p className="font-black text-gray-900 uppercase text-sm tracking-tight">{config.shopName}</p>
                       <p className="text-[9px] text-gray-400 font-bold uppercase">Boutique Vérifiée</p>
                    </div>
                 </div>
                 <p className="text-xs text-gray-500 line-clamp-2 italic leading-relaxed">"{config.description}"</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

// Fix: Added missing default export
export default SettingsManager;

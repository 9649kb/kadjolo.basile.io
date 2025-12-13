
import React, { useState } from 'react';
import { Eye, Shield, ShoppingBag, User, ChevronUp, ChevronDown, Check, Globe } from 'lucide-react';
import { useUser } from '../contexts/UserContext';

const RoleSwitcher: React.FC = () => {
  const { role, switchRole, user } = useUser();
  const [isOpen, setIsOpen] = useState(false);

  // Colors based on active role
  const getRoleColor = () => {
    switch (role) {
      case 'admin': return 'bg-red-600';
      case 'creator': return 'bg-brand-blue';
      case 'student': return 'bg-green-600';
      case 'visitor': return 'bg-gray-500';
      default: return 'bg-gray-800';
    }
  };

  const getRoleLabel = () => {
    switch (role) {
      case 'admin': return 'Fondateur (Admin)';
      case 'creator': return 'Vendeur';
      case 'student': return 'Client / Élève';
      case 'visitor': return 'Visiteur Public';
      default: return 'Visiteur';
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-[100] font-sans">
      {isOpen && (
        <div className="mb-3 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden w-72 animate-in slide-in-from-bottom-5">
          <div className="bg-gray-900 p-4 border-b border-gray-800">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Mode de vérification</p>
            <p className="text-white text-sm font-medium">Voir le site en tant que...</p>
          </div>
          <div className="flex flex-col">
            
            <button 
              onClick={() => { switchRole('visitor'); setIsOpen(false); }}
              className={`flex items-center gap-3 p-4 hover:bg-gray-50 text-left transition-colors border-b border-gray-50 ${role === 'visitor' ? 'bg-gray-100' : ''}`}
            >
              <div className={`p-2 rounded-lg ${role === 'visitor' ? 'bg-gray-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
                <Globe size={18} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                   <p className={`font-bold text-sm ${role === 'visitor' ? 'text-gray-900' : 'text-gray-800'}`}>Visiteur Public</p>
                   {role === 'visitor' && <Check size={16} className="text-gray-600" />}
                </div>
                <p className="text-xs text-gray-500 mt-0.5">Non connecté. Vue vitrine standard.</p>
              </div>
            </button>

            <button 
              onClick={() => { switchRole('student'); setIsOpen(false); }}
              className={`flex items-center gap-3 p-4 hover:bg-gray-50 text-left transition-colors border-b border-gray-50 ${role === 'student' ? 'bg-green-50' : ''}`}
            >
              <div className={`p-2 rounded-lg ${role === 'student' ? 'bg-green-600 text-white' : 'bg-green-100 text-green-700'}`}>
                <User size={18} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                   <p className={`font-bold text-sm ${role === 'student' ? 'text-green-800' : 'text-gray-800'}`}>Client / Élève</p>
                   {role === 'student' && <Check size={16} className="text-green-600" />}
                </div>
                <p className="text-xs text-gray-500 mt-0.5">Accès catalogue, achats, espace membre.</p>
              </div>
            </button>

            <button 
              onClick={() => { switchRole('creator'); setIsOpen(false); }}
              className={`flex items-center gap-3 p-4 hover:bg-gray-50 text-left transition-colors border-b border-gray-50 ${role === 'creator' ? 'bg-blue-50' : ''}`}
            >
              <div className={`p-2 rounded-lg ${role === 'creator' ? 'bg-brand-blue text-white' : 'bg-blue-100 text-brand-blue'}`}>
                <ShoppingBag size={18} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                   <p className={`font-bold text-sm ${role === 'creator' ? 'text-blue-900' : 'text-gray-800'}`}>Vendeur</p>
                   {role === 'creator' && <Check size={16} className="text-brand-blue" />}
                </div>
                <p className="text-xs text-gray-500 mt-0.5">Accès Creator Studio, produits, ventes.</p>
              </div>
            </button>

            <button 
              onClick={() => { switchRole('admin'); setIsOpen(false); }}
              className={`flex items-center gap-3 p-4 hover:bg-gray-50 text-left transition-colors ${role === 'admin' ? 'bg-red-50' : ''}`}
            >
              <div className={`p-2 rounded-lg ${role === 'admin' ? 'bg-red-600 text-white' : 'bg-red-100 text-red-700'}`}>
                <Shield size={18} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                   <p className={`font-bold text-sm ${role === 'admin' ? 'text-red-900' : 'text-gray-800'}`}>Fondateur</p>
                   {role === 'admin' && <Check size={16} className="text-red-600" />}
                </div>
                <p className="text-xs text-gray-500 mt-0.5">Accès total, supervision, configuration.</p>
              </div>
            </button>
          </div>
        </div>
      )}
      
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`${getRoleColor()} text-white pl-4 pr-5 py-3 rounded-full shadow-2xl shadow-black/30 flex items-center gap-3 hover:scale-105 transition-all font-bold text-sm border-2 border-white ring-2 ring-black/10`}
      >
        <Eye size={18} />
        <div className="flex flex-col items-start">
           <span className="text-[10px] uppercase opacity-80 leading-none mb-0.5">Mode Actuel</span>
           <span className="leading-none">{getRoleLabel()}</span>
        </div>
        {isOpen ? <ChevronDown size={16} className="ml-1 opacity-70" /> : <ChevronUp size={16} className="ml-1 opacity-70" />}
      </button>
    </div>
  );
};

export default RoleSwitcher;


import React from 'react';
import { Zap, Workflow } from 'lucide-react';

const AutomationManager: React.FC = () => {
  return (
    <div className="bg-white p-20 rounded-[40px] border border-gray-100 text-center animate-in fade-in">
      <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-gray-300">
        <Zap size={40} />
      </div>
      <h3 className="text-xl font-bold text-gray-400 uppercase tracking-widest">Automatisations de Vente</h3>
      <p className="text-gray-400 mt-2 italic">Module prêt pour le développement.</p>
    </div>
  );
};

export default AutomationManager;

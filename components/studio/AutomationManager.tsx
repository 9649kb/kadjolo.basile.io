
import React, { useState } from 'react';
import { 
  Zap, Workflow, Plus, Trash2, ToggleRight, ToggleLeft, 
  Settings, Mail, Tag, Ticket, Bell, ChevronRight, Play,
  AlertCircle, Sparkles, Wand2, Loader2, MousePointerClick,
  // Fix: Added missing 'X' icon to the imports from lucide-react
  X
} from 'lucide-react';
import { WorkflowRule, AutomationTrigger, AutomationAction } from '../../types';

const TRIGGERS = [
  { id: 'sale_created', label: 'Nouvelle Vente', icon: <Tag size={14}/>, desc: 'Quand un client achète un produit.' },
  { id: 'course_completed', label: 'Cours Terminé', icon: <Play size={14}/>, desc: 'Quand un élève finit 100% d\'un cours.' },
  { id: 'new_subscription', label: 'Nouvel Inscrit', icon: <Mail size={14}/>, desc: 'Quand quelqu\'un rejoint la newsletter.' },
  { id: 'lead_captured', label: 'Lead Capturé', icon: <MousePointerClick size={14}/>, desc: 'Quand un prospect clique sur un lien UTM.' }
];

const ACTIONS = [
  { id: 'send_email', label: 'Envoyer E-mail', icon: <Mail size={14}/>, desc: 'Envoi automatique d\'un message préparé.' },
  { id: 'send_coupon', label: 'Offrir Coupon', icon: <Ticket size={14}/>, desc: 'Offre une réduction pour booster le rachat.' },
  { id: 'add_tag', label: 'Ajouter Tag VIP', icon: <Zap size={14}/>, desc: 'Marque l\'utilisateur comme client privilégié.' },
  { id: 'notify_admin', label: 'Alerte Push', icon: <Bell size={14}/>, desc: 'Notifie l\'équipe en temps réel.' }
];

const AutomationManager: React.FC = () => {
  const [rules, setRules] = useState<WorkflowRule[]>([
    { id: 'r1', name: 'Auto-Welcome Sales', trigger: 'sale_created', action: 'send_email', isActive: true, executionCount: 142 },
    { id: 'r2', name: 'Retention Coupon', trigger: 'course_completed', action: 'send_coupon', isActive: false, executionCount: 0 }
  ]);

  const [isCreating, setIsCreating] = useState(false);
  const [newRule, setNewRule] = useState<Partial<WorkflowRule>>({
    name: '', trigger: 'sale_created', action: 'send_email', isActive: true
  });

  const handleSaveRule = () => {
    if (!newRule.name) return;
    const rule: WorkflowRule = {
      ...newRule as WorkflowRule,
      id: `r_${Date.now()}`,
      executionCount: 0
    };
    setRules([rule, ...rules]);
    setIsCreating(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm">
        <div className="flex items-center gap-4">
           <div className="w-14 h-14 bg-brand-blue text-white rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/20">
              <Zap size={28} />
           </div>
           <div>
              <h2 className="text-xl font-black text-gray-900 uppercase italic tracking-tighter">Automates de Vente</h2>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Gagnez du temps, multipliez vos revenus.</p>
           </div>
        </div>
        <button 
          onClick={() => setIsCreating(true)}
          className="bg-brand-black text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:scale-105 transition-all flex items-center gap-2"
        >
          <Plus size={16}/> Créer une règle
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LISTE DES RÈGLES */}
        <div className="lg:col-span-2 space-y-4">
           {rules.map(rule => (
             <div key={rule.id} className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm group hover:shadow-xl transition-all">
                <div className="flex justify-between items-start mb-6">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-50 text-gray-400 rounded-xl flex items-center justify-center group-hover:bg-brand-blue group-hover:text-white transition-colors">
                        <Workflow size={24} />
                      </div>
                      <div>
                        <h3 className="font-black text-gray-900 uppercase text-sm tracking-tight">{rule.name}</h3>
                        <p className="text-[9px] font-black text-gray-400 uppercase mt-1">Exécuté {rule.executionCount} fois</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-3">
                      <button onClick={() => setRules(rules.map(r => r.id === rule.id ? {...r, isActive: !r.isActive} : r))}>
                         {rule.isActive ? <ToggleRight size={40} className="text-brand-blue" /> : <ToggleLeft size={40} className="text-gray-300" />}
                      </button>
                      <button onClick={() => setRules(rules.filter(r => r.id !== rule.id))} className="p-2 text-gray-300 hover:text-red-500 transition-colors"><Trash2 size={18}/></button>
                   </div>
                </div>

                <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                   <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg shadow-sm">
                      <span className="text-brand-blue">{TRIGGERS.find(t => t.id === rule.trigger)?.icon}</span>
                      <span className="text-[9px] font-black uppercase">{TRIGGERS.find(t => t.id === rule.trigger)?.label}</span>
                   </div>
                   <ChevronRight size={14} className="text-gray-300" />
                   <div className="flex items-center gap-2 px-3 py-1.5 bg-brand-black text-white rounded-lg shadow-sm">
                      <span>{ACTIONS.find(a => a.id === rule.action)?.icon}</span>
                      <span className="text-[9px] font-black uppercase">{ACTIONS.find(a => a.id === rule.action)?.label}</span>
                   </div>
                </div>
             </div>
           ))}
        </div>

        {/* SIDEBAR : INFOS & STATS */}
        <div className="space-y-6">
           <div className="bg-brand-black p-8 rounded-[40px] text-white relative overflow-hidden">
              <h3 className="text-xl font-black italic tracking-tighter uppercase mb-6 relative z-10">Impact Automates</h3>
              <div className="space-y-6 relative z-10">
                 <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                    <p className="text-3xl font-black">24.5 h</p>
                    <p className="text-[9px] font-black text-blue-200/50 uppercase tracking-widest mt-1">Temps économisé / mois</p>
                 </div>
                 <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                    <p className="text-3xl font-black text-green-400">+12%</p>
                    <p className="text-[9px] font-black text-blue-200/50 uppercase tracking-widest mt-1">Boost rachat client</p>
                 </div>
              </div>
              <Sparkles size={120} className="absolute -bottom-6 -right-6 opacity-10" />
           </div>

           <div className="bg-blue-50 p-8 rounded-[40px] border border-blue-100">
              <div className="flex items-center gap-2 text-brand-blue mb-4">
                <AlertCircle size={18}/>
                <h4 className="text-[10px] font-black uppercase tracking-widest">Conseil d'expert</h4>
              </div>
              <p className="text-xs text-blue-700 font-bold italic leading-relaxed">
                "Offrez un coupon de 10% automatiquement dès qu'un élève termine un cours. C'est le meilleur moyen de transformer un élève en client fidèle."
              </p>
           </div>
        </div>
      </div>

      {/* MODAL DE CRÉATION */}
      {isCreating && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in">
           <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-4xl overflow-hidden animate-in zoom-in-95">
              <div className="bg-brand-black p-8 text-white flex justify-between items-center">
                 <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-2xl bg-brand-blue flex items-center justify-center shadow-lg"><Plus size={24}/></div>
                   <h3 className="text-2xl font-black uppercase italic tracking-tighter">Nouveau Workflow</h3>
                 </div>
                 <button onClick={() => setIsCreating(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X size={24}/></button>
              </div>

              <div className="p-10 grid md:grid-cols-2 gap-10">
                 <div className="space-y-6">
                    <div className="space-y-4">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Nom du Workflow</label>
                       <input 
                         value={newRule.name} 
                         onChange={e => setNewRule({...newRule, name: e.target.value})} 
                         className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold outline-none focus:ring-2 focus:ring-brand-blue/10" 
                         placeholder="Ex: Récompense Fin de Masterclass" 
                       />
                    </div>

                    <div className="space-y-4">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">1. Choisir le Déclencheur</label>
                       <div className="grid gap-2">
                          {TRIGGERS.map(t => (
                            <button 
                              key={t.id}
                              onClick={() => setNewRule({...newRule, trigger: t.id as any})}
                              className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${newRule.trigger === t.id ? 'border-brand-blue bg-blue-50' : 'border-gray-50'}`}
                            >
                               <div className="flex items-center gap-3">
                                 <div className={`p-2 rounded-lg ${newRule.trigger === t.id ? 'bg-brand-blue text-white' : 'bg-white text-gray-400'}`}>{t.icon}</div>
                                 <div className="text-left">
                                   <p className="text-xs font-black uppercase tracking-tight">{t.label}</p>
                                   <p className="text-[8px] text-gray-400 font-bold uppercase">{t.desc}</p>
                                 </div>
                               </div>
                               {newRule.trigger === t.id && <div className="w-2 h-2 bg-brand-blue rounded-full shadow-lg"></div>}
                            </button>
                          ))}
                       </div>
                    </div>
                 </div>

                 <div className="space-y-6">
                    <div className="space-y-4">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">2. Définir l'Action</label>
                       <div className="grid gap-2">
                          {ACTIONS.map(a => (
                            <button 
                              key={a.id}
                              onClick={() => setNewRule({...newRule, action: a.id as any})}
                              className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${newRule.action === a.id ? 'border-brand-black bg-gray-50' : 'border-gray-50'}`}
                            >
                               <div className="flex items-center gap-3">
                                 <div className={`p-2 rounded-lg ${newRule.action === a.id ? 'bg-brand-black text-white' : 'bg-white text-gray-400'}`}>{a.icon}</div>
                                 <div className="text-left">
                                   <p className="text-xs font-black uppercase tracking-tight">{a.label}</p>
                                   <p className="text-[8px] text-gray-400 font-bold uppercase">{a.desc}</p>
                                 </div>
                               </div>
                               {newRule.action === a.id && <div className="w-2 h-2 bg-brand-black rounded-full"></div>}
                            </button>
                          ))}
                       </div>
                    </div>

                    <div className="pt-8">
                       <button 
                         onClick={handleSaveRule}
                         className="w-full py-5 bg-brand-blue text-white rounded-[24px] font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:scale-[1.02] transition-transform"
                       >
                          Activer l'automatisation
                       </button>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default AutomationManager;


import React, { useState, useEffect, useRef } from 'react';
import { 
  Shield, Users, DollarSign, Activity, Settings, Lock, 
  Search, CheckCircle, XCircle, AlertTriangle, FileText, 
  Database, Server, Eye, Ban, Trash2, Save, Download, 
  TrendingUp, CreditCard, Bell, UserPlus, CheckSquare, Square, Crown, Briefcase,
  Wallet, Globe, Smartphone, Edit3, Plus, Link as LinkIcon, Code, Upload, ImageIcon, Percent, ArrowDownRight, ArrowUpRight, Gift, Trophy, Target,
  MessageSquare, Send, BookOpen, Clock, AlertCircle, Filter, Loader 
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line 
} from 'recharts';
import { useUser } from '../contexts/UserContext';
import { 
  adminGlobalStats, adminLogs, vendorProfiles as initialVendorProfiles, payoutRequests, 
  mockSiteSettings, salesHistory, teamMembers as initialTeam, commissionRecords, mockRewardRules, courses as initialCourses,
  supportService, contentService // IMPORT SERVICES
} from '../services/mockData';
import { PaymentGatewayManager } from '../services/paymentGatewayManager';
import { VendorProfile, PayoutRequest, SiteSettings, User, AdminPermission, PaymentMethodConfig, RewardRule, SupportTicket, Course, ChatMessage } from '../types';

// --- SUB-COMPONENTS ---

const KpiCard = ({ title, value, icon: Icon, color, trend, subValue }: any) => (
  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-start justify-between relative overflow-hidden">
    <div className="relative z-10">
      <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
      {subValue && <p className="text-xs text-gray-400 mt-1">{subValue}</p>}
      {trend && <p className="text-xs text-green-600 font-bold mt-2 flex items-center gap-1"><TrendingUp size={12}/> {trend}</p>}
    </div>
    <div className={`p-3 rounded-lg ${color} relative z-10`}>
      <Icon size={24} className="text-white" />
    </div>
    {/* Decorative background element */}
    <div className={`absolute -bottom-4 -right-4 w-24 h-24 rounded-full opacity-10 ${color}`}></div>
  </div>
);

// --- CONTENT MODERATION COMPONENT (UPDATED) ---
const ContentModeration = () => {
  const [courses, setCourses] = useState<Course[]>(contentService.getAllCourses());
  const [filter, setFilter] = useState<'all' | 'published' | 'draft' | 'banned'>('all');
  const [inspectCourse, setInspectCourse] = useState<Course | null>(null);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  // Refresh mechanism
  const refreshList = () => {
    setCourses([...contentService.getAllCourses()]);
  };

  const filteredCourses = courses.filter(c => filter === 'all' || c.status === filter);

  const handleStatusChange = async (id: string, newStatus: 'published' | 'banned' | 'draft') => {
    let reason = '';
    
    if (newStatus === 'banned') {
      const input = prompt("Motif du rejet / bannissement ? (Sera visible dans les logs)");
      if (input === null) return; // Cancelled
      reason = input || 'Non spécifié';
    }

    if (confirm(`Confirmer le changement de statut vers "${newStatus}" ?`)) {
      setLoadingAction(id);
      await contentService.updateCourseStatus(id, newStatus, reason);
      refreshList();
      setLoadingAction(null);
      if(inspectCourse?.id === id) setInspectCourse(null); // Close modal if inspecting the updated course
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Modération du Contenu</h2>
          <p className="text-sm text-gray-500">Vérifiez et validez les formations des vendeurs.</p>
        </div>
        <div className="flex gap-2 bg-white p-1 rounded-lg border border-gray-200">
           {['all', 'draft', 'published', 'banned'].map(f => (
             <button 
               key={f} 
               onClick={() => setFilter(f as any)}
               className={`px-4 py-1.5 rounded-md text-sm font-bold capitalize transition-colors ${filter === f ? 'bg-gray-900 text-white' : 'text-gray-500 hover:bg-gray-50'}`}
             >
               {f === 'draft' ? 'En attente' : f === 'published' ? 'Publié' : f === 'banned' ? 'Banni' : 'Tout'}
             </button>
           ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {filteredCourses.map(course => (
          <div key={course.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm flex flex-col relative">
             {loadingAction === course.id && (
               <div className="absolute inset-0 bg-white/80 z-10 flex items-center justify-center backdrop-blur-sm">
                 <div className="flex flex-col items-center">
                    <Loader className="animate-spin text-brand-blue mb-2" size={32} />
                    <span className="text-xs font-bold text-gray-500">Mise à jour...</span>
                 </div>
               </div>
             )}
             
             <div className="relative h-40">
                <img src={course.image} className="w-full h-full object-cover" />
                <div className="absolute top-2 right-2">
                   <span className={`px-2 py-1 rounded-md text-xs font-bold uppercase shadow-sm ${
                     course.status === 'published' ? 'bg-green-100 text-green-700' :
                     course.status === 'banned' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                   }`}>
                     {course.status === 'draft' ? 'En attente de validation' : course.status}
                   </span>
                </div>
                <div className="absolute bottom-2 left-2">
                   <button 
                     onClick={() => setInspectCourse(course)}
                     className="bg-black/70 hover:bg-black/90 text-white px-3 py-1.5 rounded-lg text-xs font-bold backdrop-blur-sm flex items-center gap-2 transition-colors shadow-lg"
                   >
                     <Eye size={14} /> Inspecter
                   </button>
                </div>
             </div>
             
             <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                   <h3 className="font-bold text-gray-900 line-clamp-1" title={course.title}>{course.title}</h3>
                   <span className="font-mono text-sm text-brand-blue font-bold">{course.price.toLocaleString()} F</span>
                </div>
                
                <p className="text-xs text-gray-500 mb-4 line-clamp-2">{course.description}</p>
                
                <div className="flex items-center gap-3 text-xs text-gray-400 mb-4">
                   <span className="flex items-center gap-1"><Users size={12}/> {course.instructor}</span>
                   <span className="flex items-center gap-1"><BookOpen size={12}/> {course.category}</span>
                </div>

                <div className="mt-auto pt-4 border-t border-gray-100 flex gap-2">
                   {course.status !== 'published' && (
                     <button 
                       onClick={() => handleStatusChange(course.id, 'published')}
                       className="flex-1 bg-green-50 hover:bg-green-100 text-green-700 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-colors"
                     >
                       <CheckCircle size={14} /> Approuver
                     </button>
                   )}
                   
                   {course.status !== 'banned' && (
                     <button 
                        onClick={() => handleStatusChange(course.id, 'banned')}
                        className="flex-1 bg-red-50 hover:bg-red-100 text-red-700 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-colors"
                     >
                       <Ban size={14} /> Rejeter
                     </button>
                   )}

                   {course.status === 'published' && (
                      <button 
                        onClick={() => handleStatusChange(course.id, 'draft')}
                        className="flex-1 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-colors"
                      >
                        <AlertTriangle size={14} /> Suspendre
                      </button>
                   )}
                </div>
             </div>
          </div>
        ))}
        {filteredCourses.length === 0 && (
          <div className="col-span-2 py-12 text-center text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
             <BookOpen size={48} className="mx-auto mb-3 opacity-20"/>
             <p>Aucun cours trouvé dans cette catégorie.</p>
          </div>
        )}
      </div>

      {/* INSPECTION MODAL */}
      {inspectCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
              <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                 <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                   <Eye size={20} className="text-brand-blue"/> Inspection du cours
                 </h3>
                 <button onClick={() => setInspectCourse(null)} className="hover:bg-gray-200 p-1 rounded-full"><XCircle size={20}/></button>
              </div>
              <div className="p-6 overflow-y-auto space-y-6">
                 <div className="flex gap-4">
                    <img src={inspectCourse.image} className="w-24 h-24 rounded-lg object-cover border border-gray-200" />
                    <div>
                       <h4 className="font-bold text-xl">{inspectCourse.title}</h4>
                       <p className="text-sm text-gray-500">{inspectCourse.instructor}</p>
                       <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded">{inspectCourse.category}</span>
                    </div>
                 </div>
                 
                 <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">Description</label>
                    <p className="text-sm text-gray-700 bg-gray-50 p-4 rounded-xl border border-gray-100 leading-relaxed whitespace-pre-wrap">
                      {inspectCourse.description || "Aucune description fournie."}
                    </p>
                 </div>

                 <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">Contenu ({inspectCourse.modules?.length || 0} Modules)</label>
                    <div className="border border-gray-200 rounded-xl overflow-hidden">
                       {inspectCourse.modules?.map((mod, idx) => (
                         <div key={idx} className="p-3 border-b border-gray-100 last:border-0 bg-white">
                            <p className="font-bold text-sm text-gray-800">Module {idx + 1}: {mod.title}</p>
                            <p className="text-xs text-gray-500">{mod.lessons.length} leçons</p>
                         </div>
                       ))}
                       {(!inspectCourse.modules || inspectCourse.modules.length === 0) && (
                         <div className="p-4 text-center text-gray-400 text-sm italic">Aucun module détecté.</div>
                       )}
                    </div>
                 </div>
              </div>
              <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
                 {inspectCourse.status === 'draft' && (
                   <>
                     <button 
                       onClick={() => handleStatusChange(inspectCourse.id, 'banned')}
                       className="px-4 py-2 border border-red-200 text-red-600 font-bold rounded-lg hover:bg-red-50 text-sm"
                     >
                       Rejeter / Bannir
                     </button>
                     <button 
                       onClick={() => handleStatusChange(inspectCourse.id, 'published')}
                       className="px-6 py-2 bg-brand-blue text-white font-bold rounded-lg hover:bg-blue-600 text-sm shadow-lg"
                     >
                       Valider & Publier
                     </button>
                   </>
                 )}
                 {inspectCourse.status === 'published' && (
                    <button 
                       onClick={() => handleStatusChange(inspectCourse.id, 'draft')}
                       className="px-6 py-2 bg-yellow-500 text-white font-bold rounded-lg hover:bg-yellow-600 text-sm shadow-lg"
                     >
                       Suspendre
                     </button>
                 )}
                 {inspectCourse.status === 'banned' && (
                    <button 
                       onClick={() => handleStatusChange(inspectCourse.id, 'draft')}
                       className="px-6 py-2 bg-gray-500 text-white font-bold rounded-lg hover:bg-gray-600 text-sm shadow-lg"
                     >
                       Rétablir en Brouillon
                     </button>
                 )}
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

// --- SUPPORT HELPDESK COMPONENT (UPDATED) ---
const SupportHelpdesk = () => {
  const { user } = useUser();
  // Initialize from Service
  const [tickets, setTickets] = useState<SupportTicket[]>(supportService.getTickets());
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  
  // Filters
  const [filter, setFilter] = useState<'all' | 'open' | 'resolved'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Auto-refresh function to keep UI in sync with Service
  const refreshTickets = () => {
    setTickets([...supportService.getTickets()]);
  };

  const selectedTicket = tickets.find(t => t.id === selectedTicketId);

  // Filter Logic
  const filteredTickets = tickets.filter(t => {
    const matchesFilter = filter === 'all' || t.status === filter;
    const matchesSearch = 
      t.studentName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      t.lastMessage.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.id.includes(searchTerm);
    return matchesFilter && matchesSearch;
  });

  const handleSelectTicket = (id: string) => {
    setSelectedTicketId(id);
    supportService.markAsRead(id);
    refreshTickets();
  };

  const handleSendReply = () => {
    if (!replyText.trim() || !selectedTicketId) return;
    
    supportService.replyToTicket(
      selectedTicketId, 
      replyText, 
      user?.name || 'Support Admin'
    );
    
    setReplyText('');
    refreshTickets();
  };

  const handleDeleteTicket = (id: string) => {
    if (confirm("Supprimer définitivement ce ticket ?")) {
      supportService.deleteTicket(id);
      if (selectedTicketId === id) setSelectedTicketId(null);
      refreshTickets();
    }
  };

  const handleToggleStatus = (id: string) => {
    const ticket = tickets.find(t => t.id === id);
    if (ticket) {
      const newStatus = ticket.status === 'open' ? 'resolved' : 'open';
      supportService.updateStatus(id, newStatus);
      refreshTickets();
    }
  };

  return (
    <div className="h-[700px] bg-white rounded-xl border border-gray-200 shadow-sm flex overflow-hidden animate-in fade-in">
      
      {/* Sidebar List */}
      <div className="w-1/3 border-r border-gray-200 flex flex-col bg-gray-50 min-w-[300px]">
         <div className="p-4 border-b border-gray-200 space-y-3 bg-white">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <MessageSquare size={18} className="text-brand-blue"/> Helpdesk
            </h3>
            
            {/* Search */}
            <div className="relative">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14}/>
               <input 
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="w-full pl-9 pr-3 py-2 bg-gray-100 border border-transparent rounded-lg text-xs focus:bg-white focus:border-brand-blue outline-none transition-all"
                 placeholder="Rechercher un ticket..."
               />
            </div>

            {/* Filters */}
            <div className="flex bg-gray-100 p-1 rounded-lg">
               {(['all', 'open', 'resolved'] as const).map(f => (
                 <button 
                   key={f}
                   onClick={() => setFilter(f)}
                   className={`flex-1 py-1.5 text-[10px] font-bold uppercase rounded-md transition-all ${filter === f ? 'bg-white text-brand-black shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                 >
                   {f === 'all' ? 'Tous' : f === 'open' ? 'Ouverts' : 'Résolus'}
                 </button>
               ))}
            </div>
         </div>

         <div className="flex-1 overflow-y-auto">
            {filteredTickets.map(ticket => (
              <div 
                key={ticket.id}
                onClick={() => handleSelectTicket(ticket.id)}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-white transition-colors relative group ${selectedTicketId === ticket.id ? 'bg-white border-l-4 border-l-brand-blue' : 'border-l-4 border-l-transparent'}`}
              >
                 <div className="flex justify-between items-start mb-1">
                    <div className="flex items-center gap-2">
                       {ticket.unreadCount > 0 && <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>}
                       <span className={`font-bold text-sm ${ticket.unreadCount > 0 ? 'text-gray-900' : 'text-gray-600'}`}>{ticket.studentName}</span>
                    </div>
                    <span className="text-[10px] text-gray-400">{new Date(ticket.timestamp).toLocaleDateString()}</span>
                 </div>
                 
                 <p className={`text-xs truncate mb-2 ${ticket.unreadCount > 0 ? 'font-medium text-gray-800' : 'text-gray-500'}`}>
                   {ticket.lastMessage}
                 </p>
                 
                 <div className="flex justify-between items-center">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold border ${ticket.status === 'open' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>
                      {ticket.status === 'open' ? 'Ouvert' : 'Fermé'}
                    </span>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleDeleteTicket(ticket.id); }} 
                      className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                    >
                      <Trash2 size={12}/>
                    </button>
                 </div>
              </div>
            ))}
            
            {filteredTickets.length === 0 && (
              <div className="p-10 text-center text-gray-400 flex flex-col items-center">
                 <Filter size={32} className="opacity-20 mb-2"/>
                 <p className="text-xs">Aucun ticket ne correspond.</p>
              </div>
            )}
         </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
         {selectedTicket ? (
           <>
             {/* Chat Header */}
             <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-white shadow-sm z-10">
                <div className="flex items-center gap-3">
                   <img src={selectedTicket.studentAvatar} className="w-10 h-10 rounded-full border border-gray-100" />
                   <div>
                      <h4 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                        {selectedTicket.studentName}
                        <span className="text-xs font-normal text-gray-400">#{selectedTicket.id}</span>
                      </h4>
                      <div className="flex items-center gap-2">
                         <span className={`w-2 h-2 rounded-full ${selectedTicket.status === 'open' ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                         <p className="text-xs text-gray-500 capitalize">{selectedTicket.status === 'open' ? 'En cours de traitement' : 'Ticket Résolu'}</p>
                      </div>
                   </div>
                </div>
                <div className="flex gap-2">
                   <button 
                     onClick={() => handleToggleStatus(selectedTicket.id)}
                     className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors flex items-center gap-2 ${selectedTicket.status === 'open' ? 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50' : 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100'}`}
                   >
                     {selectedTicket.status === 'open' ? <CheckCircle size={14}/> : <Clock size={14}/>}
                     {selectedTicket.status === 'open' ? 'Marquer résolu' : 'Rouvrir'}
                   </button>
                </div>
             </div>
             
             {/* Messages */}
             <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-gray-50/50">
                {selectedTicket.messages.map((msg, idx) => (
                  <div key={`${msg.id}-${idx}`} className={`flex ${msg.isSender ? 'justify-end' : 'justify-start'}`}>
                     {!msg.isSender && (
                       <img src={selectedTicket.studentAvatar} className="w-8 h-8 rounded-full mr-2 self-end mb-1" />
                     )}
                     <div className={`max-w-[70%] space-y-1`}>
                        <div className={`p-4 rounded-2xl text-sm shadow-sm ${msg.isSender ? 'bg-brand-black text-white rounded-br-none' : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none'}`}>
                           <p className="whitespace-pre-wrap">{msg.text}</p>
                        </div>
                        <p className={`text-[10px] ${msg.isSender ? 'text-right text-gray-400' : 'text-gray-400'}`}>
                          {msg.isModerator && <span className="font-bold mr-1">Admin •</span>}
                          {typeof msg.timestamp === 'string' && msg.timestamp.includes('T') ? new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : msg.timestamp}
                        </p>
                     </div>
                  </div>
                ))}
                
                {selectedTicket.status === 'resolved' && (
                  <div className="flex justify-center my-4">
                     <span className="bg-gray-200 text-gray-600 text-[10px] font-bold px-3 py-1 rounded-full">
                       Ticket fermé par l'administrateur
                     </span>
                  </div>
                )}
             </div>

             {/* Reply Input */}
             <div className="p-4 border-t border-gray-200 bg-white">
                <div className="flex gap-3">
                   <textarea 
                     value={replyText}
                     onChange={(e) => setReplyText(e.target.value)}
                     className="flex-1 border border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-blue outline-none resize-none h-14 bg-gray-50 focus:bg-white transition-all"
                     placeholder="Écrire une réponse..."
                     onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendReply())}
                   />
                   <button 
                     onClick={handleSendReply}
                     disabled={!replyText.trim()}
                     className="bg-brand-blue text-white w-14 h-14 rounded-xl hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center shadow-lg transition-all transform active:scale-95"
                   >
                     <Send size={20} />
                   </button>
                </div>
                <p className="text-[10px] text-gray-400 mt-2 text-center flex items-center justify-center gap-1">
                  <span className="bg-gray-100 border border-gray-200 rounded px-1 text-[9px] font-mono">Enter</span> pour envoyer
                </p>
             </div>
           </>
         ) : (
           <div className="flex-1 flex flex-col items-center justify-center text-gray-300 bg-gray-50/30">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <MessageSquare size={40} className="text-gray-300" />
              </div>
              <p className="text-sm font-medium text-gray-500">Sélectionnez un ticket pour répondre</p>
           </div>
         )}
      </div>
    </div>
  );
};

// --- REWARDS SYSTEM COMPONENT (NEW) ---
const RewardsSystem = () => {
  const [rules, setRules] = useState<RewardRule[]>(mockRewardRules);
  const [vendors, setVendors] = useState<VendorProfile[]>(initialVendorProfiles);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Rule Editor State
  const [newRule, setNewRule] = useState<Partial<RewardRule>>({
    name: '',
    description: '',
    type: 'revenue',
    threshold: 100000,
    rewardType: 'bonus_cash',
    rewardValue: '',
    icon: 'Trophy',
    color: 'bg-yellow-500'
  });

  const handleSaveRule = () => {
    if (!newRule.name || !newRule.rewardValue) return;
    
    const rule: RewardRule = {
      id: `rule_${Date.now()}`,
      name: newRule.name!,
      description: newRule.description || '',
      type: newRule.type as any,
      threshold: Number(newRule.threshold),
      rewardType: newRule.rewardType as any,
      rewardValue: newRule.rewardValue!,
      icon: newRule.icon || 'Gift',
      color: newRule.color || 'bg-brand-blue'
    };

    setRules([...rules, rule]);
    setIsModalOpen(false);
    setNewRule({
        name: '', description: '', type: 'revenue', threshold: 100000, rewardType: 'bonus_cash', rewardValue: '', icon: 'Trophy', color: 'bg-yellow-500'
    });
  };

  const handleDeleteRule = (id: string) => {
    if(confirm('Supprimer cette règle ?')) {
      setRules(rules.filter(r => r.id !== id));
    }
  };

  // Check if a vendor qualifies for a rule
  const isEligible = (vendor: VendorProfile, rule: RewardRule) => {
    // Check if already claimed (in a real app this would be more robust)
    if (vendor.receivedRewards?.includes(rule.id)) return false;

    if (rule.type === 'revenue') {
      return (vendor.totalRevenue || 0) >= rule.threshold;
    } else if (rule.type === 'sales_count') {
      return (vendor.totalSales || 0) >= rule.threshold;
    }
    return false;
  };

  const handleGrantReward = (vendorId: string, ruleId: string) => {
    const rule = rules.find(r => r.id === ruleId);
    const vendor = vendors.find(v => v.id === vendorId);
    
    if (!rule || !vendor) return;

    if (confirm(`Confirmer l'envoi de la récompense "${rule.name}" à ${vendor.shopName} ?\nCadeau : ${rule.rewardValue}`)) {
      // Update local state to reflect reward given
      const updatedVendors = vendors.map(v => {
        if (v.id === vendorId) {
          const newRewards = v.receivedRewards ? [...v.receivedRewards, ruleId] : [ruleId];
          return { ...v, receivedRewards: newRewards };
        }
        return v;
      });
      setVendors(updatedVendors);
      alert(`🎉 Récompense envoyée avec succès à ${vendor.shopName} !`);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in">
      <div className="flex justify-between items-center bg-gradient-to-r from-yellow-500 to-orange-500 p-8 rounded-2xl text-white shadow-lg relative overflow-hidden">
         <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-2 flex items-center gap-3"><Trophy size={32}/> Programme de Récompenses</h2>
            <p className="text-yellow-100 opacity-90 max-w-xl">
              Motivez vos vendeurs en automatisant les cadeaux et les bonus. 
              Définissez des paliers et distribuez les gains en un clic.
            </p>
         </div>
         <div className="relative z-10">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-white text-orange-600 px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-yellow-50 transition-colors flex items-center gap-2"
            >
              <Plus size={20} /> Créer une Règle
            </button>
         </div>
         {/* Background Decor */}
         <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* LEFT COL: RULES CONFIG */}
        <div className="lg:col-span-1 space-y-6">
           <h3 className="font-bold text-gray-900 flex items-center gap-2">
             <Settings size={20} className="text-gray-400"/> Règles Actives
           </h3>
           
           <div className="space-y-4">
             {rules.map(rule => (
               <div key={rule.id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm relative group hover:border-gray-300 transition-colors">
                  <div className={`absolute top-4 right-4 p-2 rounded-lg ${rule.color} text-white shadow-md`}>
                    {rule.icon === 'Crown' ? <Crown size={16}/> : rule.icon === 'Gift' ? <Gift size={16}/> : <Trophy size={16}/>}
                  </div>
                  
                  <h4 className="font-bold text-gray-800 text-lg pr-12">{rule.name}</h4>
                  <p className="text-xs text-gray-500 mt-1">{rule.description}</p>
                  
                  <div className="mt-4 flex flex-col gap-2">
                     <div className="flex justify-between text-sm bg-gray-50 p-2 rounded-lg">
                        <span className="text-gray-500 font-medium">Condition</span>
                        <span className="font-bold text-brand-blue">
                          {rule.type === 'revenue' ? `> ${rule.threshold.toLocaleString()} F CA` : `> ${rule.threshold} Ventes`}
                        </span>
                     </div>
                     <div className="flex justify-between text-sm bg-green-50 p-2 rounded-lg">
                        <span className="text-green-700 font-medium">Gain</span>
                        <span className="font-bold text-green-700">{rule.rewardValue} {typeof rule.rewardValue === 'number' ? 'F' : ''}</span>
                     </div>
                  </div>

                  <button 
                    onClick={() => handleDeleteRule(rule.id)}
                    className="absolute bottom-4 right-4 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={18}/>
                  </button>
               </div>
             ))}
           </div>
        </div>

        {/* RIGHT COL: ELIGIBLE VENDORS */}
        <div className="lg:col-span-2 space-y-6">
           <h3 className="font-bold text-gray-900 flex items-center gap-2">
             <Target size={20} className="text-gray-400"/> Vendeurs Éligibles (À Récompenser)
           </h3>

           <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold border-b border-gray-200">
                  <tr>
                    <th className="p-4">Vendeur</th>
                    <th className="p-4">Performance</th>
                    <th className="p-4">Récompense Débloquée</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {vendors.map(vendor => {
                    // Find all rules this vendor matches
                    const qualifyingRules = rules.filter(r => isEligible(vendor, r));
                    
                    if (qualifyingRules.length === 0) return null;

                    return qualifyingRules.map(rule => (
                      <tr key={`${vendor.id}-${rule.id}`} className="hover:bg-yellow-50/50 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img src={vendor.logoUrl} className="w-8 h-8 rounded-full border border-gray-200" />
                            <span className="font-bold text-gray-900">{vendor.shopName}</span>
                          </div>
                        </td>
                        <td className="p-4">
                           <div className="text-xs">
                             <p><span className="text-gray-500">CA:</span> <strong>{vendor.totalRevenue?.toLocaleString()} F</strong></p>
                             <p><span className="text-gray-500">Ventes:</span> <strong>{vendor.totalSales}</strong></p>
                           </div>
                        </td>
                        <td className="p-4">
                           <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${rule.color.replace('bg-', 'text-').replace('500', '700').replace('600', '700')} bg-opacity-10 border-opacity-20`}>
                              {rule.icon === 'Crown' ? <Crown size={12}/> : <Gift size={12}/>}
                              {rule.name}
                           </span>
                           <p className="text-xs text-gray-500 mt-1 pl-2">Gain: {rule.rewardValue}</p>
                        </td>
                        <td className="p-4 text-right">
                           <button 
                             onClick={() => handleGrantReward(vendor.id, rule.id)}
                             className="bg-brand-black hover:bg-green-600 text-white px-4 py-2 rounded-lg font-bold text-xs shadow-md transition-all flex items-center gap-2 ml-auto"
                           >
                             <Gift size={14} /> Envoyer Cadeau
                           </button>
                        </td>
                      </tr>
                    ));
                  })}
                  {/* Empty State fallback */}
                  {vendors.every(v => rules.filter(r => isEligible(v, r)).length === 0) && (
                    <tr>
                      <td colSpan={4} className="p-12 text-center text-gray-400">
                        <Trophy size={48} className="mx-auto mb-3 opacity-20"/>
                        <p>Aucun vendeur éligible pour le moment.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
           </div>
        </div>
      </div>

      {/* --- MODAL CREATE RULE --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95">
            <div className="bg-gradient-to-r from-orange-500 to-red-600 p-5 flex justify-between items-center text-white">
              <h3 className="font-bold text-lg flex items-center gap-2"><Trophy size={20}/> Nouvelle Règle</h3>
              <button onClick={() => setIsModalOpen(false)} className="hover:bg-white/10 p-1 rounded-full"><XCircle size={20}/></button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nom du Palier</label>
                <input 
                  value={newRule.name}
                  onChange={e => setNewRule({...newRule, name: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Ex: Club Diamant"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Condition</label>
                    <select 
                      value={newRule.type}
                      onChange={e => setNewRule({...newRule, type: e.target.value as any})}
                      className="w-full border border-gray-300 rounded-lg p-3 outline-none"
                    >
                      <option value="revenue">Chiffre d'Affaires</option>
                      <option value="sales_count">Nombre de Ventes</option>
                    </select>
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Seuil à atteindre</label>
                    <input 
                      type="number"
                      value={newRule.threshold}
                      onChange={e => setNewRule({...newRule, threshold: Number(e.target.value)})}
                      className="w-full border border-gray-300 rounded-lg p-3 outline-none font-mono"
                    />
                 </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Récompense (Cadeau)</label>
                <div className="flex gap-2 mb-2">
                   <button 
                     onClick={() => setNewRule({...newRule, rewardType: 'bonus_cash'})}
                     className={`flex-1 py-2 text-xs font-bold rounded border ${newRule.rewardType === 'bonus_cash' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-white text-gray-500'}`}
                   >Argent</button>
                   <button 
                     onClick={() => setNewRule({...newRule, rewardType: 'gift_physical'})}
                     className={`flex-1 py-2 text-xs font-bold rounded border ${newRule.rewardType === 'gift_physical' ? 'bg-red-100 text-red-700 border-red-200' : 'bg-white text-gray-500'}`}
                   >Physique</button>
                   <button 
                     onClick={() => setNewRule({...newRule, rewardType: 'badge_vip'})}
                     className={`flex-1 py-2 text-xs font-bold rounded border ${newRule.rewardType === 'badge_vip' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' : 'bg-white text-gray-500'}`}
                   >Badge</button>
                </div>
                <input 
                  value={newRule.rewardValue}
                  onChange={e => setNewRule({...newRule, rewardValue: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder={newRule.rewardType === 'bonus_cash' ? "Montant (ex: 50000)" : "Nom du cadeau (ex: iPhone 15)"}
                />
              </div>

              <div>
                 <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description (Interne)</label>
                 <textarea 
                   value={newRule.description}
                   onChange={e => setNewRule({...newRule, description: e.target.value})}
                   className="w-full border border-gray-300 rounded-lg p-3 outline-none h-20 resize-none"
                   placeholder="Détails sur la règle..."
                 />
              </div>
            </div>

            <div className="p-5 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-500 font-bold hover:bg-gray-200 rounded-lg text-sm">Annuler</button>
              <button onClick={handleSaveRule} className="bg-brand-black text-white px-6 py-2 rounded-lg font-bold hover:bg-gray-800 transition-colors">Créer Règle</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  const filteredVendors = initialVendorProfiles.filter(v => 
    v.shopName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    v.id.includes(searchTerm)
  );

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900">Gestion des Utilisateurs & Vendeurs</h2>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Rechercher..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-900 outline-none"
            />
          </div>
          <button className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-bold flex items-center gap-2">
            <Download size={16} /> Export CSV
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold border-b border-gray-200">
            <tr>
              <th className="p-4">Utilisateur / Boutique</th>
              <th className="p-4">Statut KYC</th>
              <th className="p-4">Ventes Totales</th>
              <th className="p-4">Revenu Généré</th>
              <th className="p-4">État</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {filteredVendors.map(vendor => (
              <tr key={vendor.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <img src={vendor.logoUrl} className="w-10 h-10 rounded-full border border-gray-200" />
                    <div>
                      <p className="font-bold text-gray-900">{vendor.shopName}</p>
                      <p className="text-xs text-gray-500">ID: {vendor.id}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                    vendor.kycStatus === 'verified' ? 'bg-green-100 text-green-700' : 
                    vendor.kycStatus === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {vendor.kycStatus}
                  </span>
                </td>
                <td className="p-4 font-mono">{vendor.totalSales}</td>
                <td className="p-4 font-mono text-blue-600 font-bold">{vendor.totalRevenue?.toLocaleString()} F</td>
                <td className="p-4">
                   <div className="flex items-center gap-2">
                     <div className={`w-2 h-2 rounded-full ${vendor.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                     <span className="capitalize">{vendor.status}</span>
                   </div>
                </td>
                <td className="p-4 text-right">
                  <button className="text-gray-400 hover:text-gray-900 mr-3" title="Voir détails"><Eye size={18}/></button>
                  <button className="text-gray-400 hover:text-red-600" title="Bannir"><Ban size={18}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const TeamManagement = () => {
  const [team, setTeam] = useState<User[]>(initialTeam);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [newAdmin, setNewAdmin] = useState<{
    name: string;
    email: string;
    isSuperAdmin: boolean;
    permissions: AdminPermission[];
  }>({
    name: '',
    email: '',
    isSuperAdmin: false,
    permissions: []
  });

  const PERMISSIONS_LIST: { key: AdminPermission; label: string; desc: string }[] = [
    { key: 'manage_users', label: 'Gestion Utilisateurs', desc: 'Bannir, valider KYC, voir profils' },
    { key: 'manage_finance', label: 'Trésorerie & Retraits', desc: 'Valider les virements, voir les revenus' },
    { key: 'manage_content', label: 'Modération Contenu', desc: 'Supprimer cours, gérer signalements' },
    { key: 'manage_settings', label: 'Configuration Site', desc: 'Commissions, mode maintenance, légal' },
    { key: 'manage_team', label: 'Gestion Équipe', desc: 'Ajouter/Supprimer d\'autres admins' },
  ];

  const handleTogglePermission = (key: AdminPermission) => {
    if (newAdmin.permissions.includes(key)) {
      setNewAdmin({ ...newAdmin, permissions: newAdmin.permissions.filter(p => p !== key), isSuperAdmin: false });
    } else {
      const newPerms = [...newAdmin.permissions, key];
      const allChecked = PERMISSIONS_LIST.every(p => newPerms.includes(p.key));
      setNewAdmin({ ...newAdmin, permissions: newPerms, isSuperAdmin: allChecked });
    }
  };

  const handleTotalAccessToggle = () => {
    if (!newAdmin.isSuperAdmin) {
      setNewAdmin({
        ...newAdmin,
        isSuperAdmin: true,
        permissions: PERMISSIONS_LIST.map(p => p.key)
      });
    } else {
      setNewAdmin({
        ...newAdmin,
        isSuperAdmin: false,
        permissions: []
      });
    }
  };

  const handleSaveAdmin = () => {
    if (!newAdmin.name || !newAdmin.email) return;

    const newUser: User = {
      id: `admin_${Date.now()}`,
      name: newAdmin.name,
      email: newAdmin.email,
      role: 'admin',
      isFounder: newAdmin.isSuperAdmin,
      permissions: newAdmin.permissions,
      avatar: `https://ui-avatars.com/api/?name=${newAdmin.name}&background=random`,
      joinedAt: new Date().toISOString()
    };

    setTeam([...team, newUser]);
    setIsModalOpen(false);
    setNewAdmin({ name: '', email: '', isSuperAdmin: false, permissions: [] });
  };

  const handleDeleteAdmin = (id: string) => {
    if(confirm("Supprimer cet administrateur ?")) {
      setTeam(team.filter(t => t.id !== id));
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Équipe Administrative</h2>
          <p className="text-sm text-gray-500">Gérez les accès et les rôles de vos collaborateurs.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-brand-black text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-gray-800 transition-colors"
        >
          <UserPlus size={16} /> Ajouter un Admin
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold border-b border-gray-200">
            <tr>
              <th className="p-4">Membre</th>
              <th className="p-4">Rôle</th>
              <th className="p-4">Permissions</th>
              <th className="p-4">Date d'ajout</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {team.map(member => (
              <tr key={member.id} className="hover:bg-gray-50">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <img src={member.avatar} className="w-10 h-10 rounded-full border border-gray-200" />
                    <div>
                      <p className="font-bold text-gray-900">{member.name}</p>
                      <p className="text-xs text-gray-500">{member.email}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  {member.isFounder ? (
                    <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit">
                      <Crown size={12} /> Accès Total
                    </span>
                  ) : (
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit">
                      <Briefcase size={12} /> Admin
                    </span>
                  )}
                </td>
                <td className="p-4">
                  {member.isFounder ? (
                    <span className="text-gray-400 italic text-xs">Tous les droits</span>
                  ) : (
                    <div className="flex flex-wrap gap-1">
                      {member.permissions?.map(p => (
                        <span key={p} className="bg-gray-100 border border-gray-200 text-gray-600 px-2 py-0.5 rounded text-[10px] uppercase font-bold">
                          {p.replace('manage_', '')}
                        </span>
                      ))}
                    </div>
                  )}
                </td>
                <td className="p-4 text-gray-500">{new Date(member.joinedAt || '').toLocaleDateString()}</td>
                <td className="p-4 text-right">
                  {!member.isFounder || team.length > 1 ? ( 
                    <button onClick={() => handleDeleteAdmin(member.id)} className="text-gray-400 hover:text-red-600 transition-colors">
                      <Trash2 size={18} />
                    </button>
                  ) : (
                    <span className="text-xs text-gray-300">Principal</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- MODAL AJOUT ADMIN --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95">
            <div className="bg-brand-black p-5 flex justify-between items-center text-white">
              <h3 className="font-bold text-lg flex items-center gap-2"><UserPlus size={20}/> Ajouter un Administrateur</h3>
              <button onClick={() => setIsModalOpen(false)} className="hover:bg-white/10 p-1 rounded-full"><XCircle size={20}/></button>
            </div>
            
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nom complet</label>
                  <input 
                    value={newAdmin.name} 
                    onChange={e => setNewAdmin({...newAdmin, name: e.target.value})}
                    placeholder="Ex: Jean Dupont"
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-black outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email professionnel</label>
                  <input 
                    value={newAdmin.email} 
                    onChange={e => setNewAdmin({...newAdmin, email: e.target.value})}
                    placeholder="jean.dupont@kadjolo.com"
                    type="email"
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-black outline-none" 
                  />
                </div>
              </div>

              {/* Super Admin Toggle */}
              <div className="bg-red-50 p-4 rounded-xl border border-red-100 flex items-center justify-between">
                <div>
                  <p className="font-bold text-red-900 text-sm flex items-center gap-2"><Crown size={14}/> Accès Fondateur (Super Admin)</p>
                  <p className="text-xs text-red-700 mt-1">Donne accès à TOUTES les fonctionnalités, y compris la suppression d'autres admins.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={newAdmin.isSuperAdmin} 
                    onChange={handleTotalAccessToggle} 
                    className="sr-only peer" 
                  />
                  <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                </label>
              </div>

              {/* Permissions List (Only if not Super Admin) */}
              {!newAdmin.isSuperAdmin && (
                <div className="space-y-3 animate-in slide-in-from-top-2">
                  <p className="text-xs font-bold text-gray-500 uppercase border-b border-gray-100 pb-2">Permissions Spécifiques</p>
                  <div className="grid gap-2">
                    {PERMISSIONS_LIST.map(perm => (
                      <label key={perm.key} className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${newAdmin.permissions.includes(perm.key) ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200 hover:bg-gray-50'}`}>
                        <input 
                          type="checkbox" 
                          checked={newAdmin.permissions.includes(perm.key)} 
                          onChange={() => handleTogglePermission(perm.key)}
                          className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-blue-500" 
                        />
                        <div>
                          <p className="text-sm font-bold text-gray-900">{perm.label}</p>
                          <p className="text-xs text-gray-500">{perm.desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-5 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="px-4 py-2 text-gray-500 font-bold hover:bg-gray-200 rounded-lg text-sm"
              >
                Annuler
              </button>
              <button 
                onClick={handleSaveAdmin} 
                disabled={!newAdmin.name || !newAdmin.email}
                className="bg-brand-black text-white px-6 py-2 rounded-lg font-bold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirmer l'ajout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- PAYMENT METHODS MANAGER ---
const PaymentMethodsManager = () => {
  const [methods, setMethods] = useState<PaymentMethodConfig[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadMode, setUploadMode] = useState<'url' | 'file'>('url');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [editingMethod, setEditingMethod] = useState<Partial<PaymentMethodConfig>>({
    name: '',
    type: 'mobile_money',
    integrationMode: 'manual',
    isActive: true,
    color: '#000000',
    instructions: '',
    requiresProof: true,
    logoUrl: ''
  });

  useEffect(() => {
    setMethods(PaymentGatewayManager.getAllMethods());
  }, []);

  const handleSave = () => {
    if (!editingMethod.name) return;

    if (editingMethod.id) {
      // Update
      PaymentGatewayManager.updateMethod(editingMethod.id, editingMethod);
    } else {
      // Create
      const newMethod: PaymentMethodConfig = {
        id: `pm_${Date.now()}`,
        name: editingMethod.name!,
        type: editingMethod.type as any,
        integrationMode: editingMethod.integrationMode as any,
        isActive: editingMethod.isActive || true,
        color: editingMethod.color || '#000000',
        textColor: '#ffffff',
        instructions: editingMethod.instructions,
        requiresProof: editingMethod.requiresProof,
        redirectUrl: editingMethod.redirectUrl,
        logoUrl: editingMethod.logoUrl
      };
      PaymentGatewayManager.addMethod(newMethod);
    }
    
    setMethods([...PaymentGatewayManager.getAllMethods()]);
    setIsModalOpen(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (confirm("Supprimer ce moyen de paiement ?")) {
      PaymentGatewayManager.deleteMethod(id);
      setMethods([...PaymentGatewayManager.getAllMethods()]);
    }
  };

  const handleEdit = (method: PaymentMethodConfig) => {
    setEditingMethod(method);
    // Auto-detect if using URL or File blob
    if (method.logoUrl?.startsWith('blob:')) {
      setUploadMode('file');
    } else {
      setUploadMode('url');
    }
    setIsModalOpen(true);
  };

  const toggleActive = (id: string) => {
    PaymentGatewayManager.toggleMethod(id);
    setMethods([...PaymentGatewayManager.getAllMethods()]);
  };

  const resetForm = () => {
    setEditingMethod({
      name: '',
      type: 'mobile_money',
      integrationMode: 'manual',
      isActive: true,
      color: '#000000',
      instructions: '',
      requiresProof: true,
      logoUrl: ''
    });
    setUploadMode('url');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setEditingMethod({ ...editingMethod, logoUrl: url });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Moyens de Paiement</h2>
          <p className="text-sm text-gray-500">Ces méthodes apparaîtront instantanément pour tous les clients.</p>
        </div>
        <button 
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="bg-brand-blue text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-blue-600 transition-colors"
        >
          <Plus size={16} /> Ajouter une méthode
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {methods.map(method => (
          <div key={method.id} className={`bg-white p-5 rounded-xl border-2 transition-all ${method.isActive ? 'border-gray-200' : 'border-gray-100 opacity-60'}`}>
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg border border-gray-100 shadow-sm flex items-center justify-center bg-white overflow-hidden p-1">
                  {method.logoUrl ? (
                    <img src={method.logoUrl} className="w-full h-full object-contain" alt={method.name} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-bold text-lg text-white" style={{backgroundColor: method.color}}>
                      {method.name.substring(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{method.name}</h4>
                  <p className="text-xs text-gray-500 capitalize">{method.type.replace('_', ' ')}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(method)} className="text-gray-400 hover:text-blue-600"><Edit3 size={16}/></button>
                <button onClick={() => handleDelete(method.id)} className="text-gray-400 hover:text-red-600"><Trash2 size={16}/></button>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-4">
              <span className={`text-[10px] font-bold px-2 py-1 rounded bg-gray-100 text-gray-600`}>
                {method.integrationMode === 'manual' ? 'Manuel' : method.integrationMode === 'redirect_link' ? 'Lien Externe' : 'Automatique (API)'}
              </span>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <span className={`text-xs font-bold ${method.isActive ? 'text-green-600' : 'text-gray-400'}`}>
                {method.isActive ? 'ACTIF' : 'INACTIF'}
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={method.isActive} onChange={() => toggleActive(method.id)} className="sr-only peer" />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500"></div>
              </label>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95">
            <div className="bg-gray-900 p-5 flex justify-between items-center text-white">
              <h3 className="font-bold text-lg">Configuration Paiement</h3>
              <button onClick={() => setIsModalOpen(false)}><XCircle size={20}/></button>
            </div>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nom affiché</label>
                <input 
                  value={editingMethod.name}
                  onChange={e => setEditingMethod({...editingMethod, name: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-black outline-none"
                  placeholder="Ex: Orange Money, PayPal..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Type</label>
                  <select 
                    value={editingMethod.type}
                    onChange={e => setEditingMethod({...editingMethod, type: e.target.value as any})}
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm"
                  >
                    <option value="mobile_money">Mobile Money</option>
                    <option value="card">Carte Bancaire</option>
                    <option value="crypto">Cryptomonnaie</option>
                    <option value="bank">Virement Bancaire</option>
                    <option value="paypal">PayPal</option>
                    <option value="manual">Autre (Manuel)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Mode d'intégration</label>
                  <select 
                    value={editingMethod.integrationMode}
                    onChange={e => setEditingMethod({...editingMethod, integrationMode: e.target.value as any})}
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm"
                  >
                    <option value="manual">Manuel (Instructions)</option>
                    <option value="redirect_link">Lien de paiement</option>
                    <option value="api_simulated">Automatique (API)</option>
                  </select>
                </div>
              </div>

              {/* LOGO MANAGEMENT SECTION */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Logo / Icône</label>
                <div className="flex gap-4 items-start">
                   {/* Preview Box */}
                   <div className="w-20 h-20 rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden shrink-0">
                      {editingMethod.logoUrl ? (
                        <img src={editingMethod.logoUrl} className="w-full h-full object-contain p-2" />
                      ) : (
                        <ImageIcon className="text-gray-300" />
                      )}
                   </div>
                   
                   {/* Controls */}
                   <div className="flex-1 space-y-3">
                      <div className="flex bg-gray-100 p-1 rounded-lg">
                         <button 
                           onClick={() => setUploadMode('url')}
                           className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${uploadMode === 'url' ? 'bg-white text-brand-black shadow' : 'text-gray-500'}`}
                         >
                           Lien URL
                         </button>
                         <button 
                           onClick={() => setUploadMode('file')}
                           className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${uploadMode === 'file' ? 'bg-white text-brand-black shadow' : 'text-gray-500'}`}
                         >
                           Importer
                         </button>
                      </div>

                      {uploadMode === 'url' ? (
                        <input 
                          type="text"
                          placeholder="https://exemple.com/logo.png"
                          value={editingMethod.logoUrl}
                          onChange={e => setEditingMethod({...editingMethod, logoUrl: e.target.value})}
                          className="w-full border border-gray-300 rounded-lg p-2 text-xs focus:ring-1 focus:ring-brand-black outline-none"
                        />
                      ) : (
                        <div 
                          onClick={() => fileInputRef.current?.click()}
                          className="border border-dashed border-gray-300 rounded-lg p-2 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                        >
                           <p className="text-xs text-gray-500 flex items-center justify-center gap-2">
                             <Upload size={12} /> Choisir une image
                           </p>
                           <input 
                             type="file" 
                             ref={fileInputRef}
                             onChange={handleFileUpload}
                             accept="image/*"
                             className="hidden"
                           />
                        </div>
                      )}
                   </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Couleur (Hex)</label>
                <div className="flex gap-2">
                  <input 
                    type="color"
                    value={editingMethod.color}
                    onChange={e => setEditingMethod({...editingMethod, color: e.target.value})}
                    className="h-10 w-10 p-0 border-0 rounded overflow-hidden cursor-pointer"
                  />
                  <input 
                    type="text"
                    value={editingMethod.color}
                    onChange={e => setEditingMethod({...editingMethod, color: e.target.value})}
                    className="flex-1 border border-gray-300 rounded-lg p-2.5 text-sm uppercase"
                  />
                </div>
              </div>

              {/* Conditional Fields based on Integration Mode */}
              {editingMethod.integrationMode === 'manual' && (
                <div className="bg-gray-50 p-4 rounded-xl space-y-3">
                   <div>
                     <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Instructions de paiement</label>
                     <textarea 
                        value={editingMethod.instructions}
                        onChange={e => setEditingMethod({...editingMethod, instructions: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg p-2.5 text-sm h-24"
                        placeholder="Ex: Envoyer le montant au 90 90 90 90 (Nom: KADJOLO)..."
                     />
                   </div>
                   <div className="flex items-center gap-2">
                      <input 
                        type="checkbox"
                        checked={editingMethod.requiresProof}
                        onChange={e => setEditingMethod({...editingMethod, requiresProof: e.target.checked})}
                        id="proof"
                      />
                      <label htmlFor="proof" className="text-sm text-gray-700">Exiger une preuve (Capture d'écran)</label>
                   </div>
                </div>
              )}

              {editingMethod.integrationMode === 'redirect_link' && (
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">URL de redirection</label>
                  <input 
                    value={editingMethod.redirectUrl || ''}
                    onChange={e => setEditingMethod({...editingMethod, redirectUrl: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm font-mono text-blue-600"
                    placeholder="https://paystack.com/pay/..."
                  />
                </div>
              )}

              {editingMethod.integrationMode === 'api_simulated' && (
                <div className="bg-blue-50 p-4 rounded-xl text-xs text-blue-800">
                  <p className="font-bold flex items-center gap-2"><Code size={14}/> Mode API</p>
                  <p className="mt-1">Ce mode simule une validation instantanée. En production, les clés API seraient configurées ici.</p>
                </div>
              )}

            </div>
            <div className="p-5 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-500 font-bold hover:bg-gray-200 rounded-lg text-sm">Annuler</button>
              <button onClick={handleSave} className="bg-brand-black text-white px-6 py-2 rounded-lg font-bold hover:bg-gray-800 transition-colors">Enregistrer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const FinancialControl = () => {
  const [activeSubTab, setActiveSubTab] = useState<'withdrawals' | 'methods' | 'commissions'>('withdrawals');
  const [requests, setRequests] = useState<PayoutRequest[]>(payoutRequests);

  const handleAction = (id: string, action: 'approve' | 'reject') => {
    alert(`Action ${action} sur la demande ${id}`);
    setRequests(requests.map(r => r.id === id ? { ...r, status: action === 'approve' ? 'paid' : 'rejected' } : r));
  };

  // Calculations for Centralized Treasury
  // Total Cash Held = All Sales (Gross)
  const totalTreasury = adminGlobalStats.totalSalesVolume;
  // Liabilities = What we owe vendors (Gross - Our Commission)
  const vendorLiabilities = totalTreasury - adminGlobalStats.totalPlatformRevenue;
  // Net Profit = Our Commission
  const netProfit = adminGlobalStats.totalPlatformRevenue;

  return (
    <div className="space-y-6 animate-in fade-in">
      
      {/* TREASURY OVERVIEW CARDS */}
      <div className="grid md:grid-cols-3 gap-6">
         {/* 1. TOTAL CASH HELD (Everything paid by customers) */}
         <KpiCard 
            title="Trésorerie Totale (Comptes)" 
            value={`${totalTreasury.toLocaleString()} F`} 
            icon={Wallet} 
            color="bg-brand-black" 
            subValue="100% des encaissements"
         />
         
         {/* 2. LIABILITIES (What belongs to vendors) */}
         <KpiCard 
            title="Dette Vendeurs (A Reverser)" 
            value={`${vendorLiabilities.toLocaleString()} F`} 
            icon={ArrowDownRight} 
            color="bg-red-500" 
            subValue="90% du volume (En attente de retrait)"
         />

         {/* 3. NET PROFIT (Founder's Share) */}
         <KpiCard 
            title="Bénéfice Net (Commissions)" 
            value={`${netProfit.toLocaleString()} F`} 
            icon={ArrowUpRight} 
            color="bg-green-600" 
            trend="+12% cette semaine"
            subValue="10% du volume"
         />
      </div>

      <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex gap-3 items-start text-sm text-blue-800">
         <div className="bg-white p-2 rounded-full shadow-sm"><Shield size={16}/></div>
         <div>
            <p className="font-bold">Mode Trésorerie Centralisée Actif</p>
            <p className="opacity-80">Tous les paiements clients arrivent sur vos comptes (Mobile Money, Banque). Le solde des vendeurs est virtuel jusqu'à ce que vous validiez manuellement leurs demandes de retrait ci-dessous.</p>
         </div>
      </div>

      <div className="flex gap-4 border-b border-gray-200 mt-8 overflow-x-auto">
         <button 
           onClick={() => setActiveSubTab('withdrawals')}
           className={`pb-3 text-sm font-bold transition-colors border-b-2 whitespace-nowrap ${activeSubTab === 'withdrawals' ? 'border-brand-black text-brand-black' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
         >
           Demandes de Retrait (Vendeurs)
         </button>
         <button 
           onClick={() => setActiveSubTab('commissions')}
           className={`pb-3 text-sm font-bold transition-colors border-b-2 whitespace-nowrap ${activeSubTab === 'commissions' ? 'border-brand-black text-brand-black' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
         >
           Historique Commissions (10%)
         </button>
         <button 
           onClick={() => setActiveSubTab('methods')}
           className={`pb-3 text-sm font-bold transition-colors border-b-2 whitespace-nowrap ${activeSubTab === 'methods' ? 'border-brand-black text-brand-black' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
         >
           Configuration Paiements (Réception)
         </button>
      </div>

      {activeSubTab === 'withdrawals' && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm animate-in fade-in">
          {requests.length === 0 ? (
            <div className="p-8 text-center text-gray-500">Aucune demande en attente.</div>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold border-b border-gray-200">
                <tr>
                  <th className="p-4">Date</th>
                  <th className="p-4">Vendeur</th>
                  <th className="p-4">Montant</th>
                  <th className="p-4">Méthode</th>
                  <th className="p-4">Détails</th>
                  <th className="p-4 text-right">Décision</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {requests.map(req => (
                  <tr key={req.id} className="hover:bg-gray-50">
                    <td className="p-4 text-gray-500">{new Date(req.requestDate).toLocaleDateString()}</td>
                    <td className="p-4 font-bold">{req.vendorName}</td>
                    <td className="p-4 font-mono font-bold text-gray-900">{req.amount.toLocaleString()} F</td>
                    <td className="p-4"><span className="bg-gray-100 px-2 py-1 rounded text-xs font-bold">{req.method}</span></td>
                    <td className="p-4 text-xs text-gray-500 max-w-xs truncate">{req.details}</td>
                    <td className="p-4 text-right">
                      {req.status === 'pending' ? (
                        <div className="flex justify-end gap-2">
                          <button onClick={() => handleAction(req.id, 'reject')} className="p-1 text-red-500 hover:bg-red-50 rounded"><XCircle size={20}/></button>
                          <button onClick={() => handleAction(req.id, 'approve')} className="p-1 text-green-500 hover:bg-green-50 rounded"><CheckCircle size={20}/></button>
                        </div>
                      ) : (
                        <span className={`text-xs font-bold uppercase ${req.status === 'paid' ? 'text-green-600' : 'text-red-600'}`}>{req.status}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {activeSubTab === 'commissions' && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm animate-in fade-in">
           <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
              <h3 className="font-bold text-sm text-gray-700">Détail des gains Fondateur</h3>
              <div className="flex items-center gap-2 text-xs font-bold text-green-600 bg-green-100 px-3 py-1 rounded-full">
                 <Percent size={12}/> Taux Appliqué : 10%
              </div>
           </div>
           <table className="w-full text-left">
              <thead className="bg-white text-gray-500 text-xs uppercase font-bold border-b border-gray-100">
                <tr>
                  <th className="p-4">Date</th>
                  <th className="p-4">Produit</th>
                  <th className="p-4">Vendeur</th>
                  <th className="p-4">Prix Vente</th>
                  <th className="p-4 text-green-600">Votre Part (10%)</th>
                  <th className="p-4 text-gray-400">Part Vendeur (90%)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {commissionRecords.map(rec => (
                  <tr key={rec.id} className="hover:bg-gray-50">
                    <td className="p-4 text-gray-500">{new Date(rec.date).toLocaleDateString()}</td>
                    <td className="p-4 font-medium">{rec.courseTitle}</td>
                    <td className="p-4 text-gray-600">{rec.vendorName}</td>
                    <td className="p-4 font-mono">{rec.totalAmount.toLocaleString()} F</td>
                    <td className="p-4 font-mono font-bold text-green-600">+{rec.adminAmount.toLocaleString()} F</td>
                    <td className="p-4 font-mono text-gray-400">{rec.vendorAmount.toLocaleString()} F</td>
                  </tr>
                ))}
                {commissionRecords.length === 0 && (
                   <tr>
                     <td colSpan={6} className="p-8 text-center text-gray-400">Aucune commission enregistrée.</td>
                   </tr>
                )}
              </tbody>
           </table>
        </div>
      )}

      {activeSubTab === 'methods' && <PaymentMethodsManager />}
    </div>
  );
};

const SystemSettings = () => {
  const [settings, setSettings] = useState<SiteSettings>(mockSiteSettings);

  return (
    <div className="max-w-2xl space-y-8 animate-in fade-in">
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Database size={20} className="text-blue-600"/> Configuration Générale
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Nom de la plateforme</label>
            <input 
              value={settings.siteName}
              onChange={e => setSettings({...settings, siteName: e.target.value})}
              className="w-full border border-gray-300 rounded-lg p-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Email Support (Global)</label>
            <input 
              value={settings.supportEmail}
              onChange={e => setSettings({...settings, supportEmail: e.target.value})}
              className="w-full border border-gray-300 rounded-lg p-2 text-sm"
            />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <DollarSign size={20} className="text-green-600"/> Économie
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Commission Fondateur Automatique (%)</label>
            <div className="flex items-center gap-4">
              <input 
                type="range" min="0" max="50"
                value={settings.commissionRate}
                onChange={e => setSettings({...settings, commissionRate: parseInt(e.target.value)})}
                className="flex-1"
              />
              <span className="font-mono font-bold text-xl text-green-600">{settings.commissionRate}%</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Cette commission est prélevée automatiquement sur chaque vente avant crédit au vendeur.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-red-50 p-6 rounded-xl border border-red-100">
        <h3 className="text-lg font-bold text-red-900 mb-4 flex items-center gap-2">
          <AlertTriangle size={20}/> Zone de Danger
        </h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-bold text-red-900">Mode Maintenance</p>
            <p className="text-xs text-red-700">Ferme l'accès public au site (sauf Admin).</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              checked={settings.maintenanceMode} 
              onChange={e => setSettings({...settings, maintenanceMode: e.target.checked})}
              className="sr-only peer" 
            />
            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
          </label>
        </div>
      </div>

      <button className="bg-gray-900 text-white px-8 py-3 rounded-lg font-bold flex items-center gap-2 hover:bg-black transition-colors">
        <Save size={18} /> Sauvegarder la configuration
      </button>
    </div>
  );
};

const LogsView = () => (
  <div className="bg-black text-green-400 p-6 rounded-xl font-mono text-xs h-[500px] overflow-y-auto shadow-inner">
    {adminLogs.length === 0 && <p className="opacity-50">// System logs initialized. Listening for events...</p>}
    {adminLogs.map(log => (
      <div key={log.id} className="mb-1 border-b border-gray-800 pb-1">
        <span className="text-gray-500">[{new Date(log.timestamp).toLocaleTimeString()}]</span>{' '}
        <span className="text-blue-400">{log.action.toUpperCase()}</span> : {log.details} <span className="text-gray-600">({log.ip})</span>
      </div>
    ))}
    <div className="mb-1">
      <span className="text-gray-500">[{new Date().toLocaleTimeString()}]</span>{' '}
      <span className="text-blue-400">ADMIN_ACCESS</span> : Session started by SuperAdmin <span className="text-gray-600">(127.0.0.1)</span>
    </div>
  </div>
);

// --- MAIN PAGE ---

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'finance' | 'settings' | 'logs' | 'team' | 'rewards' | 'content' | 'support'>('overview');
  const { user } = useUser();

  // Safety Double Check (Should be handled by Route, but extra layer)
  if (!user?.isFounder && user?.role !== 'admin') {
    return <div className="p-20 text-center text-red-600 font-bold">ACCÈS INTERDIT</div>;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'overview': 
        return (
          <div className="space-y-6 animate-in fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <KpiCard title="Revenu Total" value="12.5M F" icon={DollarSign} color="bg-brand-blue" />
              <KpiCard title="Utilisateurs" value="15,420" icon={Users} color="bg-purple-600" />
              <KpiCard title="Vendeurs Actifs" value="45" icon={Shield} color="bg-orange-500" />
              <KpiCard title="Tickets Ouverts" value="3" icon={Bell} color="bg-red-500" />
            </div>
            
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-6">Croissance Revenue (Platforme)</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[{name:'Jan', v:4000}, {name:'Fev', v:3000}, {name:'Mar', v:2000}, {name:'Avr', v:2780}, {name:'Mai', v:1890}, {name:'Juin', v:2390}]}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} />
                      <YAxis axisLine={false} tickLine={false} />
                      <Tooltip />
                      <Bar dataKey="v" fill="#2563eb" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-4">Dernières Actions Admin</h3>
                <div className="space-y-4">
                   <div className="flex gap-3 items-start text-sm">
                      <div className="bg-blue-100 p-2 rounded text-blue-600"><CheckCircle size={14}/></div>
                      <div>
                        <p className="font-bold">Validation Vendeur</p>
                        <p className="text-gray-500">Boutique "TechPro" validée par Admin</p>
                        <p className="text-xs text-gray-400 mt-1">Il y a 2 heures</p>
                      </div>
                   </div>
                   <div className="flex gap-3 items-start text-sm">
                      <div className="bg-green-100 p-2 rounded text-green-600"><DollarSign size={14}/></div>
                      <div>
                        <p className="font-bold">Retrait Approuvé</p>
                        <p className="text-gray-500">Virement de 150,000F vers TMoney</p>
                        <p className="text-xs text-gray-400 mt-1">Il y a 5 heures</p>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'users': return <UserManagement />;
      case 'finance': return <FinancialControl />;
      case 'team': return <TeamManagement />;
      case 'rewards': return <RewardsSystem />;
      case 'content': return <ContentModeration />; // ADDED
      case 'support': return <SupportHelpdesk />; // ADDED
      case 'settings': return <SystemSettings />;
      case 'logs': return <LogsView />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      
      {/* Admin Sidebar */}
      <aside className="w-64 bg-gray-900 text-gray-400 flex flex-col h-screen sticky top-0 overflow-y-auto">
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center gap-3 text-white mb-1">
            <Shield size={24} className="text-red-500" />
            <span className="font-bold text-lg tracking-wider">ADMIN CORE</span>
          </div>
          <p className="text-xs text-gray-500 uppercase tracking-widest">Accès Fondateur</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button onClick={() => setActiveTab('overview')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'overview' ? 'bg-gray-800 text-white' : 'hover:bg-gray-800 hover:text-white'}`}>
            <Activity size={20} /> Vue d'ensemble
          </button>
          <button onClick={() => setActiveTab('users')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'users' ? 'bg-gray-800 text-white' : 'hover:bg-gray-800 hover:text-white'}`}>
            <Users size={20} /> Utilisateurs
          </button>
          
          <button onClick={() => setActiveTab('content')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'content' ? 'bg-gray-800 text-white' : 'hover:bg-gray-800 hover:text-white'}`}>
            <CheckSquare size={20} className="text-blue-400" /> Contenu & Qualité
          </button>

          <button onClick={() => setActiveTab('finance')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'finance' ? 'bg-gray-800 text-white' : 'hover:bg-gray-800 hover:text-white'}`}>
            <DollarSign size={20} /> Finance
          </button>
          
          <button onClick={() => setActiveTab('rewards')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'rewards' ? 'bg-gray-800 text-white' : 'hover:bg-gray-800 hover:text-white'}`}>
            <Gift size={20} className="text-yellow-500" /> Récompenses
          </button>

          <button onClick={() => setActiveTab('support')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'support' ? 'bg-gray-800 text-white' : 'hover:bg-gray-800 hover:text-white'}`}>
            <MessageSquare size={20} className="text-green-400" /> Support & Tickets
          </button>

          {/* ONLY FOUNDER CAN SEE TEAM TAB */}
          {user?.isFounder && (
            <button onClick={() => setActiveTab('team')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'team' ? 'bg-gray-800 text-white' : 'hover:bg-gray-800 hover:text-white'}`}>
              <Shield size={20} className="text-red-500" /> Équipe & Rôles
            </button>
          )}

          <button onClick={() => setActiveTab('settings')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'settings' ? 'bg-gray-800 text-white' : 'hover:bg-gray-800 hover:text-white'}`}>
            <Settings size={20} /> Configuration
          </button>
          <button onClick={() => setActiveTab('logs')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'logs' ? 'bg-gray-800 text-white' : 'hover:bg-gray-800 hover:text-white'}`}>
            <Server size={20} /> System Logs
          </button>
        </nav>

        <div className="p-4 border-t border-gray-800">
          <div className="bg-gray-800 rounded p-3 flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <div className="text-xs">
              <p className="text-white font-bold">Système Stable</p>
              <p>v2.4.0 (Prod)</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white border-b border-gray-200 p-6 flex justify-between items-center sticky top-0 z-10">
          <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-tight">
            {activeTab === 'overview' && "Tableau de Bord"}
            {activeTab === 'users' && "Contrôle Utilisateurs"}
            {activeTab === 'finance' && "Trésorerie & Paiements"}
            {activeTab === 'team' && "Gestion de l'Équipe"}
            {activeTab === 'rewards' && "Programme Récompenses & Challenges"}
            {activeTab === 'settings' && "Paramètres Système"}
            {activeTab === 'logs' && "Journaux Serveur"}
            {activeTab === 'content' && "Modération du Contenu"}
            {activeTab === 'support' && "Helpdesk & Support"}
          </h1>
          <div className="flex items-center gap-4">
             <div className="text-right">
               <p className="text-sm font-bold text-gray-900">{user?.name}</p>
               <p className="text-xs text-red-600 font-bold uppercase">Super Admin</p>
             </div>
             <img src={user?.avatar} className="w-10 h-10 rounded-lg border-2 border-red-100" />
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>

    </div>
  );
};

export default AdminDashboard;


import React, { useState, useRef } from 'react';
import { MessageSquare, Plus, X, Send, Clock, Camera, Check } from 'lucide-react';

export const SupportManager = ({ userMessages, onSendMessage }: { userMessages: any[], onSendMessage: (data: any) => void }) => {
  const [selectedMsg, setSelectedMsg] = useState<any>(null);
  const [view, setView] = useState<'list' | 'create'>('list');
  const [formData, setFormData] = useState({ subject: '', message: '', attachment: '' });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, attachment: URL.createObjectURL(e.target.files[0]) });
    }
  };

  const handleSubmit = () => {
    if (!formData.subject || !formData.message) return;
    onSendMessage(formData);
    setFormData({ subject: '', message: '', attachment: '' });
    setView('list');
  };

  return (
    <div className="h-[calc(100vh-16rem)] flex flex-col gap-6 animate-in fade-in">
       <div className="flex-1 flex gap-6 overflow-hidden">
          <div className="w-1/3 bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden flex flex-col">
             <div className="p-6 bg-gray-50/50 border-b border-gray-100 flex justify-between items-center">
                <h3 className="font-black text-[10px] uppercase tracking-widest text-gray-400">Tickets Support</h3>
                <button onClick={() => setView('create')} className="bg-black text-white p-2 rounded-lg hover:scale-105 transition-transform"><Plus size={16}/></button>
             </div>
             <div className="flex-1 overflow-y-auto custom-scrollbar">
                {userMessages.map(m => (
                   <button key={m.id} onClick={() => { setSelectedMsg(m); setView('list'); }} className={`w-full text-left p-6 border-b border-gray-50 transition-all hover:bg-blue-50/30 flex items-start gap-4 ${selectedMsg?.id === m.id && view === 'list' ? 'bg-blue-50/50' : ''}`}>
                      <div className={`w-2 h-2 mt-1.5 rounded-full shrink-0 ${m.replyText ? 'bg-green-500' : 'bg-orange-500 animate-pulse'}`}></div>
                      <div className="flex-1 min-w-0">
                         <p className="font-black text-gray-900 text-sm truncate">{m.subject}</p>
                         <p className="text-xs text-gray-400 line-clamp-1">{m.message}</p>
                      </div>
                   </button>
                ))}
             </div>
          </div>

          <div className="flex-1 bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden flex flex-col">
             {view === 'create' ? (
                <div className="p-8 space-y-6">
                   <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-black text-gray-900">Nouvelle Demande</h3>
                      <button onClick={() => setView('list')} className="text-gray-400 hover:text-red-500"><X size={20}/></button>
                   </div>
                   <input value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} placeholder="Sujet de la demande" className="w-full bg-gray-50 border rounded-2xl p-4 font-bold text-sm" />
                   <textarea value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} placeholder="Décrivez votre problème..." className="w-full h-40 bg-gray-50 border rounded-[24px] p-5 outline-none resize-none text-sm" />
                   <div className="flex items-center gap-4">
                      <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
                      <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest bg-gray-100 text-gray-500">
                        {formData.attachment ? <Check size={16}/> : <Camera size={16}/>} {formData.attachment ? 'Capture jointe' : 'Joindre une capture'}
                      </button>
                   </div>
                   <button onClick={handleSubmit} className="w-full py-4 bg-black text-white rounded-[24px] font-black text-xs uppercase tracking-widest shadow-xl">Envoyer le ticket</button>
                </div>
             ) : selectedMsg ? (
                <div className="flex flex-col h-full animate-in slide-in-from-right-4">
                   <div className="p-8 border-b border-gray-50 flex justify-between items-start bg-gray-50/30">
                      <div><h3 className="text-xl font-black text-gray-900">{selectedMsg.subject}</h3><p className="text-xs text-gray-400 font-bold uppercase mt-1">Le {selectedMsg.date}</p></div>
                      <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase ${selectedMsg.replyText ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>{selectedMsg.replyText ? 'Réponse reçue' : 'En attente'}</div>
                   </div>
                   <div className="flex-1 p-8 overflow-y-auto space-y-10">
                      <div className="flex flex-col items-end"><div className="bg-black text-white p-6 rounded-[32px] rounded-tr-none max-w-[80%] shadow-lg"><p className="font-medium">{selectedMsg.message}</p></div><span className="text-[9px] font-bold text-gray-400 mt-2 uppercase">Vous</span></div>
                      {selectedMsg.replyText && <div className="flex flex-col items-start"><div className="bg-blue-600 text-white p-6 rounded-[32px] rounded-tl-none max-w-[80%] shadow-xl relative"><p className="font-bold italic">"{selectedMsg.replyText}"</p></div><span className="text-[9px] font-bold text-gray-400 mt-2 uppercase">Administration</span></div>}
                   </div>
                </div>
             ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-300 gap-4">
                   <MessageSquare size={48} />
                   <p className="font-bold uppercase text-[10px] tracking-[0.2em]">Sélectionnez un ticket</p>
                </div>
             )}
          </div>
       </div>
    </div>
  );
};

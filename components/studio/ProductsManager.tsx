
import React, { useState, useMemo, useRef } from 'react';
import { 
  Package, Plus, Search, Edit3, Trash2, ChevronLeft, 
  Eye, Save, Image as ImageIcon, Video, Check, Book, 
  Layers, AlertCircle, Globe, Layout, ArrowRight, Tag, Users,
  Wand2, Loader2, Play, FileText, PlusCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Course, Module, Lesson } from '../../types';
import { getAISuggestions } from '../../services/geminiService';

interface ProductsManagerProps {
  courses: Course[];
  onAdd: (c: Course) => void;
  onDelete: (id: string) => void;
  onUpdate: (c: Course) => void;
}

export const ProductsManager: React.FC<ProductsManagerProps> = ({ courses, onAdd, onDelete, onUpdate }) => {
  const [view, setView] = useState<'list' | 'editor'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'info' | 'curriculum'>('info');
  const [isAiLoading, setIsAiLoading] = useState(false);
  
  const [formData, setFormData] = useState<Partial<Course>>({
    title: '', 
    price: 0, 
    category: 'Business', 
    type: 'course', 
    description: '', 
    image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=1000&auto=format&fit=crop', 
    status: 'draft',
    hostingMode: 'internal',
    learningObjectives: [],
    features: [],
    modules: []
  });

  const filtered = useMemo(() => 
    courses.filter(c => c.title.toLowerCase().includes(searchTerm.toLowerCase())), 
    [courses, searchTerm]
  );

  // --- LOGIQUE IA GEMINI ---
  const handleAiOptimize = async (field: 'title' | 'description') => {
    const text = field === 'title' ? formData.title : formData.description;
    if (!text || text.length < 5) {
      alert("Veuillez saisir un texte de base avant d'utiliser l'IA.");
      return;
    }

    setIsAiLoading(true);
    try {
      const suggestions = await getAISuggestions(text, field);
      if (suggestions.length > 0) {
        // Pour la démo, on prend la première suggestion améliorée
        setFormData(prev => ({ ...prev, [field]: suggestions[0] }));
      }
    } catch (error) {
      console.error("AI Error:", error);
    } finally {
      setIsAiLoading(false);
    }
  };

  // --- GESTION DU CURRICULUM ---
  const addModule = () => {
    const newModule: Module = {
      id: `m_${Date.now()}`,
      title: 'Nouveau Module',
      lessons: []
    };
    setFormData(prev => ({ ...prev, modules: [...(prev.modules || []), newModule] }));
  };

  const deleteModule = (moduleId: string) => {
    setFormData(prev => ({
      ...prev,
      modules: prev.modules?.filter(m => m.id !== moduleId)
    }));
  };

  const addLesson = (moduleId: string) => {
    const newLesson: Lesson = {
      id: `l_${Date.now()}`,
      title: 'Nouvelle Leçon',
      type: 'video',
      contentUrl: ''
    };
    setFormData(prev => ({
      ...prev,
      modules: prev.modules?.map(m => m.id === moduleId ? { ...m, lessons: [...m.lessons, newLesson] } : m)
    }));
  };

  // --- SAUVEGARDE ---
  const handleSave = () => {
    if (!formData.title || formData.price === undefined) {
      alert("Le titre et le prix sont obligatoires.");
      return;
    }
    
    if (formData.id) {
      onUpdate(formData as Course);
    } else {
      const newCourse: Course = {
        ...formData as Course,
        id: `c_${Date.now()}`,
        instructor: 'KADJOLO BASILE',
        instructorId: 'v1',
        students: 0,
        rating: 0,
        createdAt: new Date().toISOString(),
        status: 'published',
        visibility: 'public'
      };
      onAdd(newCourse);
    }
    setView('list');
  };

  const startEdit = (c: Course) => {
    setFormData({ ...c });
    setView('editor');
    setActiveTab('info');
  };

  const startCreate = () => {
    setFormData({ 
      title: '', 
      price: 0, 
      category: 'Business', 
      type: 'course', 
      description: '', 
      image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=1000&auto=format&fit=crop', 
      status: 'draft',
      hostingMode: 'internal',
      learningObjectives: [],
      features: [],
      modules: []
    });
    setView('editor');
    setActiveTab('info');
  };

  if (view === 'editor') return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      {/* HEADER ÉDITEUR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={() => setView('list')} className="p-3 bg-gray-50 text-gray-400 rounded-2xl hover:text-gray-900 transition-colors">
            <ChevronLeft size={20} />
          </button>
          <div>
            <h2 className="text-xl font-black text-gray-900 uppercase italic tracking-tighter">
              {formData.id ? 'Modifier le Produit' : 'Nouveau Produit'}
            </h2>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Édition en cours...</p>
          </div>
        </div>
        <div className="flex gap-3">
           <button onClick={() => setView('list')} className="px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest text-gray-400 hover:bg-gray-50">Annuler</button>
           <button onClick={handleSave} className="bg-brand-black text-white px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center gap-2">
             <Save size={16} /> Enregistrer
           </button>
        </div>
      </div>

      {/* TABS ÉDITEUR */}
      <div className="flex gap-2 p-1 bg-white border border-gray-100 rounded-2xl w-fit">
        <button onClick={() => setActiveTab('info')} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'info' ? 'bg-brand-black text-white shadow-lg' : 'text-gray-400 hover:bg-gray-50'}`}>Informations de base</button>
        <button onClick={() => setActiveTab('curriculum')} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'curriculum' ? 'bg-brand-black text-white shadow-lg' : 'text-gray-400 hover:bg-gray-50'}`}>Programme (Modules)</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* COLONNE GAUCHE */}
        <div className="lg:col-span-2 space-y-6">
          {activeTab === 'info' ? (
            <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm space-y-8">
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Titre de l'offre</label>
                    <button 
                      onClick={() => handleAiOptimize('title')}
                      disabled={isAiLoading}
                      className="text-[9px] font-black text-brand-blue uppercase flex items-center gap-1 hover:bg-blue-50 px-2 py-1 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {isAiLoading ? <Loader2 size={12} className="animate-spin" /> : <Wand2 size={12}/>} Optimiser par IA
                    </button>
                  </div>
                  <input 
                    value={formData.title} 
                    onChange={e => setFormData({...formData, title: e.target.value})} 
                    className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-brand-blue/10" 
                    placeholder="Ex: Masterclass Leadership & Influence" 
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Prix (FCFA)</label>
                    <input 
                      type="number" 
                      value={formData.price} 
                      onChange={e => setFormData({...formData, price: parseInt(e.target.value)})} 
                      className="w-full p-4 bg-gray-50 border-none rounded-2xl font-black text-lg" 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Catégorie</label>
                    <select 
                      value={formData.category} 
                      onChange={e => setFormData({...formData, category: e.target.value})} 
                      className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold"
                    >
                      <option>Business</option>
                      <option>Finance</option>
                      <option>Mindset</option>
                      <option>Vente</option>
                    </select>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Description</label>
                    <button 
                      onClick={() => handleAiOptimize('description')}
                      disabled={isAiLoading}
                      className="text-[9px] font-black text-brand-blue uppercase flex items-center gap-1 hover:bg-blue-50 px-2 py-1 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {isAiLoading ? <Loader2 size={12} className="animate-spin" /> : <Wand2 size={12}/>} Améliorer la vente (IA)
                    </button>
                  </div>
                  <textarea 
                    value={formData.description} 
                    onChange={e => setFormData({...formData, description: e.target.value})} 
                    className="w-full h-64 p-6 bg-gray-50 border-none rounded-[32px] font-medium resize-none focus:ring-2 focus:ring-brand-blue/10 leading-relaxed" 
                    placeholder="Quels sont les bénéfices de cette offre ?" 
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm space-y-6">
               <div className="flex items-center justify-between">
                 <h3 className="font-black text-gray-900 uppercase tracking-tighter">Structure du programme</h3>
                 <button onClick={addModule} className="bg-brand-blue text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-blue-500/20"><Plus size={14}/> Ajouter un module</button>
               </div>
               
               <div className="space-y-6">
                 {formData.modules?.map((mod, mIdx) => (
                   <div key={mod.id} className="p-6 bg-gray-50 rounded-[32px] border border-gray-100 animate-in slide-in-from-top-2">
                      <div className="flex justify-between items-center mb-4">
                         <div className="flex items-center gap-3">
                           <div className="w-8 h-8 bg-brand-black text-white rounded-lg flex items-center justify-center font-black text-xs">{mIdx + 1}</div>
                           <input 
                             value={mod.title} 
                             onChange={(e) => {
                               const updated = [...(formData.modules || [])];
                               updated[mIdx].title = e.target.value;
                               setFormData({...formData, modules: updated});
                             }}
                             className="bg-transparent border-none font-black text-sm uppercase tracking-tight outline-none focus:text-brand-blue w-64"
                           />
                         </div>
                         <button onClick={() => deleteModule(mod.id)} className="text-gray-300 hover:text-red-500 transition-colors"><Trash2 size={16}/></button>
                      </div>
                      
                      <div className="space-y-2 ml-11">
                         {mod.lessons.map((lesson, lIdx) => (
                            <div key={lesson.id} className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
                               <div className="flex items-center gap-3 flex-1">
                                 <div className="p-1.5 bg-blue-50 text-brand-blue rounded-lg"><Video size={14}/></div>
                                 <input 
                                   value={lesson.title}
                                   onChange={(e) => {
                                      const updated = [...(formData.modules || [])];
                                      updated[mIdx].lessons[lIdx].title = e.target.value;
                                      setFormData({...formData, modules: updated});
                                   }}
                                   className="bg-transparent border-none font-bold text-xs outline-none w-full"
                                 />
                               </div>
                               <div className="flex items-center gap-2">
                                  <input 
                                    placeholder="Durée" 
                                    className="w-12 text-[10px] font-black text-gray-400 outline-none text-right"
                                    value={lesson.duration || ''}
                                    onChange={(e) => {
                                       const updated = [...(formData.modules || [])];
                                       updated[mIdx].lessons[lIdx].duration = e.target.value;
                                       setFormData({...formData, modules: updated});
                                    }}
                                  />
                                  <button className="text-gray-200 hover:text-brand-blue"><Edit3 size={14}/></button>
                               </div>
                            </div>
                         ))}
                         <button onClick={() => addLesson(mod.id)} className="w-full py-2 border-2 border-dashed border-gray-200 rounded-xl text-[9px] font-black uppercase text-gray-400 hover:border-brand-blue hover:text-brand-blue transition-colors flex items-center justify-center gap-2">
                           <PlusCircle size={14}/> Ajouter une leçon
                         </button>
                      </div>
                   </div>
                 ))}
                 
                 {formData.modules?.length === 0 && (
                    <div className="text-center py-20 bg-gray-50 rounded-[32px] border border-dashed border-gray-200">
                       <Layers size={32} className="mx-auto text-gray-300 mb-4" />
                       <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Aucun module créé pour le moment</p>
                    </div>
                 )}
               </div>
            </div>
          )}
        </div>

        {/* COLONNE DROITE */}
        <div className="space-y-6">
           <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm space-y-8">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Visuel de couverture</label>
                <div className="aspect-[4/3] bg-gray-50 rounded-[32px] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer">
                  {formData.image ? (
                    <>
                      <img src={formData.image} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700" alt="" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                         <p className="bg-white px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-xl">Remplacer</p>
                      </div>
                    </>
                  ) : (
                    <div className="text-center p-8">
                      <ImageIcon size={32} className="text-brand-blue mx-auto mb-4" />
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Format 16:9 recommandé</p>
                    </div>
                  )}
                  <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => {
                    if (e.target.files?.[0]) setFormData({...formData, image: URL.createObjectURL(e.target.files[0])});
                  }} />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Mode de diffusion</h4>
                <div className="space-y-2">
                  <button 
                    onClick={() => setFormData({...formData, hostingMode: 'internal'})}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${formData.hostingMode === 'internal' ? 'border-brand-blue bg-blue-50' : 'border-gray-50 bg-gray-50'}`}
                  >
                    <div className={`p-2 rounded-lg ${formData.hostingMode === 'internal' ? 'bg-brand-blue text-white' : 'bg-white text-gray-400'}`}><Layout size={16}/></div>
                    <div className="text-left">
                       <p className={`text-xs font-black uppercase tracking-tight ${formData.hostingMode === 'internal' ? 'text-brand-blue' : 'text-gray-400'}`}>Hébergé ici</p>
                       <p className="text-[8px] text-gray-400 font-bold uppercase">Lecteur vidéo premium KADJOLO</p>
                    </div>
                  </button>
                  
                  <button 
                    onClick={() => setFormData({...formData, hostingMode: 'external'})}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${formData.hostingMode === 'external' ? 'border-brand-blue bg-blue-50' : 'border-gray-50 bg-gray-50'}`}
                  >
                    <div className={`p-2 rounded-lg ${formData.hostingMode === 'external' ? 'bg-brand-blue text-white' : 'bg-white text-gray-400'}`}><Globe size={16}/></div>
                    <div className="text-left">
                       <p className={`text-xs font-black uppercase tracking-tight ${formData.hostingMode === 'external' ? 'text-brand-blue' : 'text-gray-400'}`}>Lien Externe</p>
                       <p className="text-[8px] text-gray-400 font-bold uppercase">Systeme.io, Patreon, etc.</p>
                    </div>
                  </button>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-50">
                 <div className="flex items-center justify-between p-4 bg-gray-900 text-white rounded-2xl shadow-xl">
                    <div className="flex items-center gap-3">
                       <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                       <p className="text-[10px] font-black uppercase tracking-widest">Statut : En ligne</p>
                    </div>
                    <button className="text-[9px] font-black text-gray-400 uppercase hover:text-white">Désactiver</button>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
       <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-6 rounded-[32px] shadow-sm border border-gray-100">
         <div className="relative flex-1 w-full max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              value={searchTerm} 
              onChange={e => setSearchTerm(e.target.value)} 
              className="w-full pl-12 pr-6 py-3 bg-gray-50 border-none rounded-2xl outline-none font-bold text-sm focus:ring-2 focus:ring-brand-blue/10 transition-all" 
              placeholder="Rechercher un produit..." 
            />
         </div>
         <button onClick={startCreate} className="w-full md:w-auto bg-brand-blue text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 shadow-xl shadow-blue-500/20 hover:scale-[1.02] transition-transform">
           <Plus size={18} /> Nouveau Produit
         </button>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
         {filtered.map(course => (
           <div key={course.id} className="bg-white rounded-[40px] overflow-hidden border border-gray-100 shadow-sm group hover:shadow-2xl transition-all flex flex-col">
              <div className="relative h-56 bg-gray-100">
                 <img src={course.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt="" />
                 <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3">
                    <div className="flex gap-2">
                       <button onClick={() => startEdit(course)} className="p-4 bg-white rounded-2xl text-brand-blue shadow-2xl hover:scale-110 transition-transform"><Edit3 size={20}/></button>
                       <button onClick={() => { if(confirm('Supprimer ce produit ?')) onDelete(course.id); }} className="p-4 bg-white rounded-2xl text-red-500 shadow-2xl hover:scale-110 transition-transform"><Trash2 size={20}/></button>
                    </div>
                    <Link to={`/product/${course.id}`} className="bg-brand-blue text-white px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-xl">Voir la page</Link>
                 </div>
                 <div className="absolute top-4 left-4 bg-brand-black/80 backdrop-blur text-white px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5">
                    {course.type === 'ebook' ? <Book size={10} /> : <Video size={10} />}
                    {course.type === 'ebook' ? 'E-Book' : 'Formation'}
                 </div>
              </div>
              <div className="p-8 flex-1 flex flex-col">
                 <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                       <span className={`w-2 h-2 rounded-full ${course.status === 'published' ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                       <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{course.status === 'published' ? 'Public' : 'Brouillon'}</p>
                    </div>
                    <p className="text-[9px] font-black text-brand-blue uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded-md">{course.category}</p>
                 </div>
                 <h3 className="font-black text-xl text-gray-900 leading-tight mb-4 group-hover:text-brand-blue transition-colors line-clamp-2">{course.title}</h3>
                 
                 <div className="mt-auto grid grid-cols-2 gap-4 pt-6 border-t border-gray-50">
                    <div>
                       <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Prix</p>
                       <p className="text-xl font-black text-gray-900">{course.price.toLocaleString()} F</p>
                    </div>
                    <div className="text-right">
                       <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Élèves</p>
                       <p className="text-xl font-black text-brand-blue flex items-center justify-end gap-1">{course.students} <Users size={14}/></p>
                    </div>
                 </div>
              </div>
           </div>
         ))}

         {filtered.length === 0 && (
           <div className="col-span-full py-32 text-center bg-white rounded-[40px] border-2 border-dashed border-gray-100 flex flex-col items-center justify-center">
              <Package size={48} className="text-gray-200 mb-6" />
              <h3 className="text-2xl font-black text-gray-300 uppercase italic tracking-tighter">Votre catalogue est vide</h3>
              <button onClick={startCreate} className="mt-8 bg-brand-black text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl">Créer mon premier produit</button>
           </div>
         )}
       </div>
    </div>
  );
};

export default ProductsManager;

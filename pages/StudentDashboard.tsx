
import React, { useState, useMemo } from 'react';
import { 
  BookOpen, Clock, Award, Shield, Lock, CreditCard, 
  PlayCircle, CheckCircle, Bell, Settings, LogOut, FileText,
  Download, ChevronRight, AlertCircle, Eye, EyeOff, TrendingUp,
  Search, Filter, Play, ArrowRight
} from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { useData } from '../contexts/DataContext';
import { Link, useNavigate } from 'react-router-dom';

const StudentDashboard: React.FC = () => {
  const { user, logout } = useUser();
  const { getStudentCourses } = useData();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'courses' | 'achievements' | 'billing' | 'security'>('courses');
  const [searchQuery, setSearchQuery] = useState('');

  // Récupération des cours avec progression réelle calculée automatiquement
  const myCourses = useMemo(() => {
    if (!user) return [];
    return getStudentCourses(user.id).filter(c => 
      c.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [user, getStudentCourses, searchQuery]);

  // Statistiques calculées
  const stats = useMemo(() => {
    const total = myCourses.length;
    const completed = myCourses.filter(c => c.progress === 100).length;
    const inProgress = total - completed;
    return { total, completed, inProgress };
  }, [myCourses]);

  if (!user) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Lock size={48} className="text-gray-300" />
        <h2 className="text-xl font-bold">Accès réservé aux membres</h2>
        <Link to="/login" className="bg-brand-blue text-white px-8 py-3 rounded-xl font-bold">Se connecter</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-gray pb-20">
      {/* HEADER PREMIUM & STATS */}
      <div className="bg-brand-black text-white relative overflow-hidden rounded-b-[40px] shadow-2xl">
        {/* Background Decorative elements */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-brand-blue/20 to-transparent"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-brand-blue/10 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-6 pt-12 pb-24 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-6">
              <div className="relative group">
                <img 
                  src={user.avatar} 
                  className="w-24 h-24 rounded-3xl object-cover border-4 border-white/10 shadow-2xl group-hover:scale-105 transition-transform" 
                  alt={user.name} 
                />
                <div className="absolute -bottom-2 -right-2 bg-green-500 p-1.5 rounded-xl border-4 border-brand-black shadow-lg">
                  <Shield size={14} className="text-white" />
                </div>
              </div>
              <div className="text-center md:text-left">
                <h1 className="text-3xl md:text-4xl font-black tracking-tighter uppercase italic">Mon Espace Élite</h1>
                <p className="text-blue-200/70 font-medium flex items-center justify-center md:justify-start gap-2 mt-1">
                  Ravi de vous revoir, <span className="text-white font-bold">{user.name}</span>
                </p>
              </div>
            </div>

            {/* Statistiques Dynamiques */}
            <div className="grid grid-cols-3 gap-4 md:gap-8">
              <div className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-center min-w-[100px]">
                <p className="text-2xl font-black text-white">{stats.total}</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Cours</p>
              </div>
              <div className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-center min-w-[100px]">
                <p className="text-2xl font-black text-green-400">{stats.completed}</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Finis</p>
              </div>
              <div className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-center min-w-[100px]">
                <p className="text-2xl font-black text-brand-blue">{stats.inProgress}</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">En cours</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* NAVIGATION & FILTERS BAR */}
      <div className="max-w-7xl mx-auto px-6 -mt-10 relative z-20">
        <div className="bg-white p-4 rounded-[32px] shadow-xl border border-gray-100 flex flex-col lg:flex-row justify-between items-center gap-6">
          <nav className="flex gap-2 p-1 bg-brand-gray rounded-2xl w-full lg:w-auto overflow-x-auto no-scrollbar">
            {[
              { id: 'courses', label: 'Mes Formations', icon: <BookOpen size={18}/> },
              { id: 'achievements', label: 'Certificats', icon: <Award size={18}/> },
              { id: 'billing', label: 'Factures', icon: <FileText size={18}/> },
              { id: 'security', label: 'Sécurité', icon: <Shield size={18}/> }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                  activeTab === tab.id 
                  ? 'bg-brand-black text-white shadow-lg' 
                  : 'text-gray-500 hover:bg-gray-200'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </nav>

          <div className="relative w-full lg:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Rechercher dans mes cours..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-6 py-3 bg-brand-gray border-none rounded-2xl outline-none text-sm font-bold placeholder:text-gray-400 focus:ring-2 focus:ring-brand-blue/20 transition-all"
            />
          </div>
        </div>
      </div>

      {/* CONTENT GRID */}
      <main className="max-w-7xl mx-auto px-6 mt-12">
        {activeTab === 'courses' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {myCourses.length > 0 ? (
              myCourses.map(course => (
                <div key={course.id} className="group bg-white rounded-[32px] overflow-hidden shadow-sm hover:shadow-2xl border border-gray-100 transition-all duration-500 flex flex-col hover:-translate-y-2">
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={course.image} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                      alt={course.title} 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <Link to={`/classroom/${course.id}`} className="bg-white text-brand-black p-4 rounded-2xl shadow-2xl transform scale-75 group-hover:scale-100 transition-transform duration-300">
                         <Play fill="currentColor" size={24} />
                       </Link>
                    </div>
                    <div className="absolute top-4 left-4 bg-brand-black/80 backdrop-blur-md text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest border border-white/10">
                      {course.category}
                    </div>
                    {course.progress === 100 && (
                      <div className="absolute top-4 right-4 bg-green-500 text-white p-1.5 rounded-full shadow-lg border-2 border-white animate-bounce">
                        <CheckCircle size={14} />
                      </div>
                    )}
                  </div>

                  <div className="p-8 flex-1 flex flex-col">
                    <div className="flex-1">
                      <h3 className="text-xl font-black text-brand-black mb-4 leading-tight group-hover:text-brand-blue transition-colors line-clamp-2">
                        {course.title}
                      </h3>
                      
                      {/* Barre de progression automatique */}
                      <div className="mb-6 bg-gray-100 h-3 rounded-full overflow-hidden relative border border-gray-50">
                        <div 
                          className={`h-full transition-all duration-1000 ease-out ${course.progress === 100 ? 'bg-green-500' : 'bg-brand-blue'}`}
                          style={{ width: `${course.progress}%` }}
                        ></div>
                      </div>
                      
                      <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-400 mb-6">
                        <span className={course.progress > 0 ? 'text-brand-blue' : ''}>
                          {course.progress}% complété
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={12} /> {course.progress === 100 ? 'Terminé' : 'En cours'}
                        </span>
                      </div>
                    </div>

                    <button 
                      onClick={() => navigate(`/classroom/${course.id}`)}
                      className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 border-2 ${
                        course.progress === 100 
                        ? 'bg-green-50 border-green-500 text-green-600 hover:bg-green-500 hover:text-white' 
                        : 'bg-brand-black border-brand-black text-white hover:bg-white hover:text-brand-black'
                      }`}
                    >
                      {course.progress === 100 ? 'Revoir la formation' : course.progress > 0 ? 'Reprendre le cours' : 'Démarrer maintenant'}
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-20 text-center bg-white rounded-[40px] border-2 border-dashed border-gray-200">
                <div className="w-20 h-20 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
                  <BookOpen size={40} />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-2">Aucune formation trouvée</h3>
                <p className="text-gray-500 mb-8 max-w-sm mx-auto">Propulsez votre carrière avec nos programmes d'excellence.</p>
                <Link to="/courses" className="bg-brand-blue text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-600/20 hover:scale-105 transition-transform inline-block">
                  Explorer le catalogue
                </Link>
              </div>
            )}

            {/* Carte Suggestion - Automatiquement ajoutée si l'utilisateur a peu de cours */}
            {myCourses.length > 0 && myCourses.length < 6 && (
              <Link to="/courses" className="group bg-brand-gray rounded-[32px] border-2 border-dashed border-gray-300 flex flex-col items-center justify-center p-8 text-center hover:border-brand-blue transition-colors min-h-[400px]">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-sm group-hover:bg-brand-blue group-hover:text-white transition-all">
                  <TrendingUp size={32} />
                </div>
                <p className="text-lg font-black text-gray-500 group-hover:text-brand-blue transition-colors">Débloquer de nouvelles compétences</p>
                <p className="text-xs text-gray-400 mt-2 font-bold uppercase tracking-wider">Voir les nouveautés →</p>
              </Link>
            )}
          </div>
        )}

        {/* --- AUTRES ONGLETS (STRUCTURELS) --- */}
        {activeTab === 'achievements' && (
          <div className="animate-in fade-in slide-in-from-top-4 duration-500 max-w-4xl mx-auto">
             <div className="bg-white p-12 rounded-[40px] text-center border border-gray-100 shadow-sm">
                <div className="w-24 h-24 bg-yellow-50 text-yellow-500 rounded-[32px] flex items-center justify-center mx-auto mb-8 shadow-inner">
                   <Award size={48} />
                </div>
                <h2 className="text-3xl font-black text-brand-black mb-4">Vos Certificats d'Excellence</h2>
                <p className="text-gray-500 mb-10 max-w-md mx-auto">Chaque formation terminée avec succès vous donne droit à un certificat officiel signé par KADJOLO BASILE.</p>
                
                <div className="grid gap-4">
                   {myCourses.filter(c => c.progress === 100).length > 0 ? (
                     myCourses.filter(c => c.progress === 100).map(c => (
                        <div key={c.id} className="flex items-center justify-between p-6 bg-brand-gray rounded-2xl border border-gray-100">
                           <div className="flex items-center gap-4">
                              <CheckCircle className="text-green-500" />
                              <span className="font-bold text-gray-800">{c.title}</span>
                           </div>
                           <button className="flex items-center gap-2 bg-brand-black text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-800">
                             <Download size={14} /> Télécharger
                           </button>
                        </div>
                     ))
                   ) : (
                     <div className="p-8 bg-brand-gray rounded-3xl border border-dashed border-gray-200 text-gray-400 font-bold uppercase tracking-widest text-xs">
                        Aucun certificat débloqué pour le moment.
                     </div>
                   )}
                </div>
             </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-right-4 duration-500">
             <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm space-y-10">
                <div>
                   <h3 className="text-xl font-black text-brand-black mb-6 uppercase tracking-tight flex items-center gap-3">
                     <Lock className="text-brand-blue" /> Paramètres de sécurité
                   </h3>
                   <div className="space-y-4">
                      <div className="bg-brand-gray p-6 rounded-2xl border border-gray-100 flex justify-between items-center">
                         <div>
                            <p className="font-black text-sm text-gray-900 uppercase tracking-tight">Mot de passe</p>
                            <p className="text-xs text-gray-500">Dernière modification il y a 3 mois</p>
                         </div>
                         <button className="text-[10px] font-black text-brand-blue uppercase tracking-widest border-b-2 border-brand-blue">Modifier</button>
                      </div>
                      <div className="bg-brand-gray p-6 rounded-2xl border border-gray-100 flex justify-between items-center">
                         <div>
                            <p className="font-black text-sm text-gray-900 uppercase tracking-tight">Double Authentification (2FA)</p>
                            <p className="text-xs text-gray-400">Recommandé pour protéger vos achats</p>
                         </div>
                         <div className="w-12 h-6 bg-gray-200 rounded-full relative cursor-pointer">
                            <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                         </div>
                      </div>
                   </div>
                </div>

                <div className="pt-10 border-t border-gray-100">
                   <button onClick={logout} className="w-full py-5 bg-red-50 text-red-600 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-red-600 hover:text-white transition-all">
                      <LogOut size={18} /> Déconnexion sécurisée
                   </button>
                </div>
             </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default StudentDashboard;

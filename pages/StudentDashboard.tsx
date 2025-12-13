
import React, { useState } from 'react';
import { 
  BookOpen, Clock, Award, Shield, Lock, CreditCard, 
  PlayCircle, CheckCircle, Bell, Settings, LogOut, FileText,
  Download, ChevronRight, AlertCircle, Eye, EyeOff
} from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { courses, salesHistory } from '../services/mockData';
import { Link } from 'react-router-dom';

const StudentDashboard: React.FC = () => {
  const { user, logout } = useUser();
  const [activeTab, setActiveTab] = useState<'courses' | 'achievements' | 'billing' | 'security'>('courses');
  
  // Mock Enrollments (Filter courses "purchased" by this user logic)
  const myCourses = courses.slice(0, 3).map((c, i) => ({
    ...c,
    progress: i === 0 ? 75 : (i === 1 ? 30 : 0),
    lastAccessed: i === 0 ? 'Il y a 2 heures' : 'Il y a 3 jours'
  }));

  // Security State
  const [showPassword, setShowPassword] = useState(false);
  const [twoFactor, setTwoFactor] = useState(user?.twoFactorEnabled || false);

  const SecurityTab = () => (
    <div className="space-y-6 animate-in fade-in">
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Shield className="text-brand-blue" /> Sécurité du Compte
        </h3>
        
        <div className="space-y-6">
          {/* Password Change */}
          <div className="pb-6 border-b border-gray-100">
            <h4 className="text-sm font-bold text-gray-700 mb-3">Mot de passe</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  value="fakepassword123" 
                  readOnly 
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-500"
                />
                <button 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-bold text-sm hover:bg-gray-50 transition-colors">
                Changer le mot de passe
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
              <CheckCircle size={12} className="text-green-500" /> Dernière modification il y a 30 jours
            </p>
          </div>

          {/* 2FA */}
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-gray-700">Authentification à deux facteurs (2FA)</h4>
              <p className="text-xs text-gray-500 mt-1">Ajoute une couche de sécurité supplémentaire à votre compte.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={twoFactor} onChange={() => setTwoFactor(!twoFactor)} className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-green"></div>
            </label>
          </div>

          {/* Login Activity */}
          <div>
            <h4 className="text-sm font-bold text-gray-700 mb-3">Appareils connectés</h4>
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-white p-2 rounded-lg shadow-sm">
                  <Shield size={20} className="text-brand-blue" />
                </div>
                <div>
                  <p className="text-sm font-bold text-brand-black">Chrome sur Windows (Cet appareil)</p>
                  <p className="text-xs text-blue-600">Lomé, Togo • Actif maintenant</p>
                </div>
              </div>
              <div className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded font-bold">Sécurisé</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const MyCoursesTab = () => (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in">
      {myCourses.map(course => (
        <div key={course.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
          <div className="relative h-40 overflow-hidden">
            <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Link to={`/product/${course.id}`} className="bg-white text-black rounded-full p-3 shadow-lg transform hover:scale-110 transition-transform">
                <PlayCircle size={32} />
              </Link>
            </div>
            <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur text-white text-xs px-2 py-1 rounded font-bold">
              {course.category}
            </div>
          </div>
          <div className="p-5">
            <h3 className="font-bold text-gray-900 mb-2 line-clamp-1">{course.title}</h3>
            
            <div className="mb-4">
              <div className="flex justify-between text-xs mb-1">
                <span className="font-bold text-gray-500">{course.progress}% complété</span>
                <span className="text-brand-blue">{course.progress === 100 ? 'Terminé' : 'En cours'}</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-brand-blue rounded-full transition-all duration-1000" style={{width: `${course.progress}%`}}></div>
              </div>
            </div>

            <Link 
              to={`/product/${course.id}`} 
              className="block w-full py-2.5 text-center bg-gray-50 hover:bg-brand-black hover:text-white text-gray-900 font-bold rounded-xl text-sm transition-colors"
            >
              {course.progress > 0 ? 'Continuer' : 'Commencer'}
            </Link>
          </div>
        </div>
      ))}
      
      {/* Add New Course Placeholder */}
      <Link to="/courses" className="border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center p-6 text-gray-400 hover:border-brand-blue hover:text-brand-blue transition-colors bg-gray-50/50">
        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-3 shadow-sm">
          <BookOpen size={24} />
        </div>
        <span className="font-bold text-sm">Découvrir d'autres formations</span>
      </Link>
    </div>
  );

  const BillingTab = () => (
    <div className="space-y-6 animate-in fade-in">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-900">Historique des achats</h3>
        </div>
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold">
            <tr>
              <th className="p-4">Date</th>
              <th className="p-4">Formation</th>
              <th className="p-4">Montant</th>
              <th className="p-4">Facture</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {[1, 2, 3].map(i => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="p-4 text-gray-500">12 Oct 2023</td>
                <td className="p-4 font-bold text-gray-900">Formation Business Pro - Module {i}</td>
                <td className="p-4 font-bold text-gray-900">25,000 F</td>
                <td className="p-4">
                  <button className="flex items-center gap-1 text-brand-blue hover:underline font-medium">
                    <Download size={14} /> PDF
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Secure Header */}
      <div className="bg-brand-black text-white pt-12 pb-24 px-4 md:px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              <img src={user.avatar} alt={user.name} className="w-20 h-20 rounded-full border-4 border-gray-800 shadow-xl" />
              <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 border-4 border-brand-black rounded-full" title="Compte Sécurisé"></div>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-serif font-bold">Espace Membre</h1>
              <p className="text-gray-400 flex items-center gap-2 text-sm mt-1">
                <Shield size={14} className="text-green-500" /> Compte sécurisé • {user.name}
              </p>
            </div>
          </div>
          <div className="flex gap-3">
             <Link to="/courses" className="px-5 py-2.5 bg-white/10 hover:bg-white/20 rounded-xl font-bold text-sm transition-colors border border-white/10 backdrop-blur">
               Parcourir le catalogue
             </Link>
             <button onClick={logout} className="px-5 py-2.5 bg-red-600/90 hover:bg-red-600 rounded-xl font-bold text-sm transition-colors shadow-lg flex items-center gap-2">
               <LogOut size={16} /> Déconnexion
             </button>
          </div>
        </div>
        
        {/* Abstract Pattern */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-blue-900/30 to-transparent"></div>
      </div>

      {/* Main Content Area (Overlapping Header) */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 -mt-12 relative z-20">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Menu */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden sticky top-24">
              <nav className="p-2 space-y-1">
                <button 
                  onClick={() => setActiveTab('courses')}
                  className={`w-full flex items-center justify-between p-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'courses' ? 'bg-brand-blue text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <div className="flex items-center gap-3"><BookOpen size={18}/> Mes Formations</div>
                  {activeTab === 'courses' && <ChevronRight size={16}/>}
                </button>
                <button 
                  onClick={() => setActiveTab('achievements')}
                  className={`w-full flex items-center justify-between p-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'achievements' ? 'bg-brand-blue text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <div className="flex items-center gap-3"><Award size={18}/> Certificats</div>
                  {activeTab === 'achievements' && <ChevronRight size={16}/>}
                </button>
                <button 
                  onClick={() => setActiveTab('billing')}
                  className={`w-full flex items-center justify-between p-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'billing' ? 'bg-brand-blue text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <div className="flex items-center gap-3"><CreditCard size={18}/> Facturation</div>
                  {activeTab === 'billing' && <ChevronRight size={16}/>}
                </button>
                <div className="h-px bg-gray-100 my-2"></div>
                <button 
                  onClick={() => setActiveTab('security')}
                  className={`w-full flex items-center justify-between p-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'security' ? 'bg-brand-black text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <div className="flex items-center gap-3"><Lock size={18}/> Sécurité</div>
                  {activeTab === 'security' && <ChevronRight size={16}/>}
                </button>
              </nav>
            </div>
          </div>

          {/* Content Panel */}
          <div className="flex-1">
             {activeTab === 'courses' && <MyCoursesTab />}
             {activeTab === 'billing' && <BillingTab />}
             {activeTab === 'security' && <SecurityTab />}
             {activeTab === 'achievements' && (
                <div className="bg-white p-12 rounded-2xl border border-gray-100 text-center shadow-sm">
                   <div className="w-20 h-20 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Award size={40} />
                   </div>
                   <h3 className="text-xl font-bold text-gray-900">Vos certificats</h3>
                   <p className="text-gray-500 mt-2">Terminez une formation à 100% pour débloquer votre certificat officiel KADJOLO.</p>
                </div>
             )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;

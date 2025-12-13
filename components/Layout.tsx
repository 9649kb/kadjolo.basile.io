
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, Users, Video, ShoppingBag, BookOpen, 
  Menu, X, LogOut, LayoutDashboard, Info, Mail, Youtube, Facebook, Instagram, Edit3, Megaphone, LogIn, UserPlus, User, Shield
} from 'lucide-react';
import { siteConfig } from '../services/mockData';
import Footer from './Footer';
import RoleSwitcher from './RoleSwitcher';
import { useUser } from '../contexts/UserContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user: currentUser, logout, isAuthenticated } = useUser(); // Using dynamic user from context
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const location = useLocation();

  // Greeting Toast Logic - MOVED HOOKS TO TOP LEVEL
  const [showGreeting, setShowGreeting] = useState(false);
  const [greetingMsg, setGreetingMsg] = useState('');

  useEffect(() => {
    // Show greeting on mount if user is logged in
    if (isAuthenticated && currentUser) {
      const hour = new Date().getHours();
      let msg = "Bonjour";
      if (hour >= 18) msg = "Bonsoir";
      else if (hour < 12) msg = "Bonjour";
      
      // Random variations
      const variations = [
        `${msg}, ${currentUser.name.split(' ')[0]} !`,
        `Salutations, ${currentUser.name.split(' ')[0]}.`,
        `Heureux de vous revoir, ${currentUser.name.split(' ')[0]}.`
      ];
      setGreetingMsg(variations[Math.floor(Math.random() * variations.length)]);
      setShowGreeting(true);

      const timer = setTimeout(() => setShowGreeting(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [currentUser, isAuthenticated]); // Trigger when user changes

  // Hide footer on Creator Studio (SaaS Dashboard) to maximize workspace
  const isCreatorStudio = location.pathname.startsWith('/creator-studio');
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  
  // Clean layout for auth pages
  if (isAuthPage) {
    return <>{children}</>;
  }

  const showFooter = !isCreatorStudio;

  // Base Nav Items
  let navItems = [
    { label: 'Accueil', path: '/', icon: <Home size={20} /> },
    { label: 'Formations', path: '/courses', icon: <ShoppingBag size={20} /> },
    { label: 'Actualités', path: '/news', icon: <Megaphone size={20} /> },
    { label: 'Communauté', path: '/community', icon: <Users size={20} /> },
    { label: 'Live Streaming', path: '/live', icon: <Video size={20} /> },
    { label: 'YouTube', path: '/youtube', icon: <Youtube size={20} /> },
    { label: 'Blog', path: '/blog', icon: <BookOpen size={20} /> },
    { label: 'Contact', path: '/contact', icon: <Mail size={20} /> },
  ];

  // Logic: Add Specific items based on Role
  if (isAuthenticated && currentUser) {
    if (currentUser.role === 'student') {
      // Add Student Dashboard at the top
      navItems.unshift({ label: 'Mon Espace Membre', path: '/dashboard', icon: <User size={20} className="text-green-400" /> });
    } else if (currentUser.role === 'creator') {
      // Add Creator Studio
      navItems.push({ label: 'Studio Vendeur', path: '/creator-studio', icon: <LayoutDashboard size={20} className="text-blue-400" /> });
    } else if (currentUser.role === 'admin' || currentUser.isFounder) {
      // ADMIN: Add Studio AND Super Admin Link
      navItems.push({ label: 'Studio Vendeur', path: '/creator-studio', icon: <LayoutDashboard size={20} className="text-blue-400" /> });
      navItems.push({ label: 'Super Admin', path: '/admin', icon: <Shield size={20} className="text-red-500 animate-pulse" /> });
    }
  }

  return (
    <div className={`min-h-screen flex bg-brand-gray ${editMode ? 'border-4 border-yellow-400' : ''}`}>
      {/* Role Switcher Widget (DEV ONLY) */}
      <RoleSwitcher />

      {/* Greeting Toast */}
      {showGreeting && (
        <div className="fixed top-20 lg:top-6 left-1/2 transform -translate-x-1/2 z-[40] bg-brand-black text-white px-4 py-2 md:px-6 md:py-3 rounded-full shadow-2xl animate-in slide-in-from-top-10 fade-in duration-500 flex items-center gap-3 w-[90%] md:w-auto justify-center">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shrink-0"></div>
          <span className="font-medium font-serif text-sm md:text-base truncate">{greetingMsg}</span>
        </div>
      )}

      {/* Global Edit Mode Indicator */}
      {editMode && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-[100] bg-yellow-400 text-black px-4 py-2 rounded-lg font-bold shadow-lg flex items-center gap-2 text-xs md:text-sm whitespace-nowrap">
           <Edit3 size={16} /> MODE ÉDITION ADMIN ACTIF
        </div>
      )}

      {/* Mobile Sidebar Backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Mobile Header - Sticky */}
      <div className="lg:hidden fixed top-0 left-0 w-full bg-brand-blue text-white z-50 flex justify-between items-center p-4 shadow-md h-16">
        <div className="flex items-center gap-3">
           <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-1 hover:bg-blue-700 rounded transition-colors">
             {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
           </button>
           <span className="font-serif font-bold text-xl tracking-wider">KADJOLO</span>
        </div>
        {!isAuthenticated ? (
           <Link to="/login" className="text-xs font-bold bg-white text-brand-blue px-3 py-1.5 rounded-full">
             Connexion
           </Link>
        ) : (
           <Link to="/dashboard" className="p-1">
             <img src={currentUser?.avatar} className="w-8 h-8 rounded-full border-2 border-white" />
           </Link>
        )}
      </div>

      {/* Sidebar - Responsive logic updated */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 md:w-80 bg-brand-black text-white transform transition-transform duration-300 ease-in-out shadow-2xl flex flex-col h-full
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:relative lg:translate-x-0
      `}>
        {/* BRANDING HEADER */}
        <div className="p-8 text-center border-b border-gray-800 flex flex-col items-center bg-brand-blue relative justify-center min-h-[160px]">
           <button className="absolute top-4 right-4 lg:hidden p-2 bg-blue-800 rounded-full" onClick={() => setIsSidebarOpen(false)}>
             <X size={20} className="text-white" />
           </button>

          <h1 className="font-serif font-bold text-2xl md:text-3xl text-white tracking-widest leading-tight">KADJOLO BASILE</h1>
          <p className="text-xs md:text-sm text-blue-200 mt-2 tracking-widest uppercase font-bold">Entrepreneur & Mentor</p>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto custom-scrollbar">
          <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const isAdminLink = item.path === '/admin';
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-brand-blue text-white font-medium shadow-lg shadow-blue-900/40 border-l-4 border-white' 
                      : isAdminLink 
                        ? 'text-red-400 hover:bg-red-900/30 hover:text-white border border-transparent hover:border-red-800'
                        : 'text-gray-400 hover:bg-gray-900 hover:text-white'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
          </ul>
        </nav>

        {/* Social Mini Links in Sidebar */}
        <div className="px-6 py-4 flex justify-between text-gray-500 border-t border-gray-800 bg-gray-900 shrink-0">
          <a href={siteConfig.socials.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors"><Facebook size={20} /></a>
          <a href={siteConfig.socials.youtube} target="_blank" rel="noopener noreferrer" className="hover:text-red-500 transition-colors"><Youtube size={20} /></a>
          <a href={siteConfig.socials.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-pink-500 transition-colors"><Instagram size={20} /></a>
        </div>

        <div className="p-4 border-t border-gray-800 bg-black shrink-0">
          {isAuthenticated && currentUser ? (
            <>
              <div className="flex items-center gap-3 px-2 mb-2">
                 <img src={currentUser.avatar} className="w-8 h-8 rounded-full border border-gray-700" alt="" />
                 <div className="overflow-hidden">
                    <p className="text-xs text-white font-bold truncate">{currentUser.name}</p>
                    <p className="text-[10px] text-gray-500 truncate capitalize">{currentUser.role === 'student' ? 'Membre Certifié' : currentUser.role}</p>
                 </div>
              </div>

              <button 
                onClick={logout}
                className="flex items-center space-x-2 text-gray-500 hover:text-white mt-1 px-4 text-sm w-full transition-colors justify-center py-2 border border-gray-800 rounded"
              >
                <LogOut size={16} />
                <span>Déconnexion</span>
              </button>
            </>
          ) : (
            <div className="space-y-2">
               <Link to="/login" className="flex items-center justify-center gap-2 w-full bg-gray-800 text-white py-2 rounded text-sm font-bold hover:bg-gray-700 transition-colors">
                 <LogIn size={16} /> Se Connecter
               </Link>
               <Link to="/register" className="flex items-center justify-center gap-2 w-full bg-brand-blue text-white py-2 rounded text-sm font-bold hover:bg-blue-600 transition-colors shadow-lg">
                 <UserPlus size={16} /> Créer un compte
               </Link>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:pt-0 overflow-y-auto h-screen scroll-smooth bg-gray-50 flex flex-col pt-16">
        {/* Page Content */}
        <div className={`max-w-7xl mx-auto p-4 md:p-8 w-full flex-grow ${isCreatorStudio ? 'max-w-none p-0 md:p-0' : ''}`}>
          {children}
        </div>

        {/* Footer */}
        {showFooter && <Footer />}
      </main>
    </div>
  );
};

export default Layout;

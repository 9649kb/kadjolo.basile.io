

import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, Users, Video, ShoppingBag, BookOpen, 
  Menu, X, LogOut, LayoutDashboard, Info, Mail, Youtube, Facebook, Instagram, Edit3, Megaphone
} from 'lucide-react';
import { currentUser, siteConfig } from '../services/mockData';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const location = useLocation();

  // Hide footer on Creator Studio (SaaS Dashboard) to maximize workspace
  const isCreatorStudio = location.pathname.startsWith('/creator-studio');
  const showFooter = !isCreatorStudio;

  // Greeting Toast Logic
  const [showGreeting, setShowGreeting] = useState(false);
  const [greetingMsg, setGreetingMsg] = useState('');

  useEffect(() => {
    // Show greeting on mount
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
  }, []);

  const navItems = [
    { label: 'Accueil', path: '/', icon: <Home size={20} /> },
    { label: 'Actualités', path: '/news', icon: <Megaphone size={20} /> },
    { label: 'Communauté', path: '/community', icon: <Users size={20} /> },
    { label: 'Live Streaming', path: '/live', icon: <Video size={20} /> },
    { label: 'Formations', path: '/courses', icon: <ShoppingBag size={20} /> },
    { label: 'Marketplace', path: '/marketplace', icon: <LayoutDashboard size={20} /> },
    { label: 'YouTube', path: '/youtube', icon: <Youtube size={20} /> },
    { label: 'Blog', path: '/blog', icon: <BookOpen size={20} /> },
    { label: 'À Propos', path: '/about', icon: <Info size={20} /> },
    { label: 'Contact', path: '/contact', icon: <Mail size={20} /> },
  ];

  return (
    <div className={`min-h-screen flex bg-brand-gray ${editMode ? 'border-4 border-yellow-400' : ''}`}>
      {/* Greeting Toast */}
      {showGreeting && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-[100] bg-brand-black text-white px-6 py-3 rounded-full shadow-2xl animate-in slide-in-from-top-10 fade-in duration-500 flex items-center gap-3">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="font-medium font-serif">{greetingMsg}</span>
        </div>
      )}

      {/* Global Edit Mode Indicator */}
      {editMode && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-[100] bg-yellow-400 text-black px-4 py-2 rounded-lg font-bold shadow-lg flex items-center gap-2">
           <Edit3 size={16} /> MODE ÉDITION ADMIN ACTIF
        </div>
      )}

      {/* Mobile Sidebar Backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Mobile Header */}
      <div className="lg:hidden fixed w-full bg-brand-blue text-white z-50 flex justify-between items-center p-4 shadow-md">
        <div className="flex items-center gap-3">
           <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
             {isSidebarOpen ? <X /> : <Menu />}
           </button>
           <span className="font-serif font-bold text-xl tracking-wider">KADJOLO</span>
        </div>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-80 bg-brand-black text-white transform transition-transform duration-300 ease-in-out shadow-2xl flex flex-col
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:relative lg:translate-x-0
      `}>
        {/* BRANDING HEADER (Photo Removed as requested) */}
        <div className="p-8 text-center border-b border-gray-800 flex flex-col items-center bg-brand-blue relative justify-center min-h-[160px]">
           <button className="absolute top-4 right-4 lg:hidden" onClick={() => setIsSidebarOpen(false)}>
             <X size={24} className="text-blue-200" />
           </button>

          <h1 className="font-serif font-bold text-3xl text-white tracking-widest leading-tight">KADJOLO BASILE</h1>
          <p className="text-sm text-blue-200 mt-2 tracking-widest uppercase font-bold">Entrepreneur & Mentor</p>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-brand-blue text-white font-medium shadow-lg shadow-blue-900/40 border-l-4 border-white' 
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
        <div className="px-6 py-4 flex justify-between text-gray-500 border-t border-gray-800 bg-gray-900">
          <a href={siteConfig.socials.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors"><Facebook size={20} /></a>
          <a href={siteConfig.socials.youtube} target="_blank" rel="noopener noreferrer" className="hover:text-red-500 transition-colors"><Youtube size={20} /></a>
          <a href={siteConfig.socials.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-pink-500 transition-colors"><Instagram size={20} /></a>
        </div>

        {/* User Stats for Admin */}
        {currentUser.role === 'admin' && (
          <div className="px-4 py-2 bg-black">
             <div className="bg-gray-900 rounded-lg p-3 text-xs text-gray-400 border border-gray-800">
               <div className="flex justify-between mb-1">
                 <span>Total Visites:</span>
                 <span className="text-brand-green font-bold">15,420</span>
               </div>
               <div className="flex justify-between">
                 <span>Ventes ce mois:</span>
                 <span className="text-white font-bold">2,450€</span>
               </div>
             </div>
          </div>
        )}

        <div className="p-4 border-t border-gray-800 bg-black">
          {/* Admin Toggle */}
          {currentUser.role === 'admin' && (
            <button 
              onClick={() => setEditMode(!editMode)}
              className={`flex items-center justify-center space-x-2 mb-2 px-4 py-2 w-full text-xs font-bold rounded transition-colors ${editMode ? 'bg-yellow-500 text-black' : 'bg-gray-800 text-gray-400 hover:text-white'}`}
            >
              <Edit3 size={14} />
              <span>{editMode ? 'Désactiver Édition' : 'Activer Mode Édition'}</span>
            </button>
          )}

          <button className="flex items-center space-x-2 text-gray-500 hover:text-white mt-1 px-4 text-sm w-full transition-colors justify-center py-2 border border-gray-800 rounded">
            <LogOut size={16} />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 pt-16 lg:pt-0 overflow-y-auto h-screen scroll-smooth bg-gray-50 flex flex-col">
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
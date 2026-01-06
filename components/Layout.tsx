
import React, { useState, useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, Users, Video, ShoppingBag, BookOpen, 
  Menu, X, LogOut, LayoutDashboard, Info, Mail, Youtube, Facebook, Instagram, Edit3, Megaphone, LogIn, UserPlus, User, Shield, Languages, ChevronDown, Sparkles, Tag
} from 'lucide-react';
import { siteConfig } from '../services/mockData';
import Footer from './Footer';
import RoleSwitcher from './RoleSwitcher';
import { useUser } from '../contexts/UserContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useData } from '../contexts/DataContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user: currentUser, logout, isAuthenticated } = useUser();
  const { t, language, setLanguage } = useLanguage();
  const { coupons } = useData();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  // Détection des promos globales pour le bandeau
  const activeGlobalPromo = useMemo(() => {
    return coupons.find(c => 
      c.isActive && 
      !c.limitToProducts && 
      (!c.isScheduled || (new Date(c.startDate!) <= new Date() && new Date(c.endDate!) >= new Date()))
    );
  }, [coupons]);

  const [showGreeting, setShowGreeting] = useState(false);
  const [greetingMsg, setGreetingMsg] = useState('');

  useEffect(() => {
    if (isAuthenticated && currentUser) {
      let msg = language === 'fr' ? "Bonjour" : "Welcome";
      const variations = [
        `${msg}, ${currentUser.name.split(' ')[0]} !`,
        `Salutations, ${currentUser.name.split(' ')[0]}.`
      ];
      setGreetingMsg(variations[Math.floor(Math.random() * variations.length)]);
      setShowGreeting(true);
      const timer = setTimeout(() => setShowGreeting(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [currentUser, isAuthenticated, language]);

  const isCreatorStudio = location.pathname.startsWith('/creator-studio');
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  
  if (isAuthPage) return <>{children}</>;

  const showFooter = !isCreatorStudio;

  let navItems = [
    { label: t('nav.home'), path: '/', icon: <Home size={20} /> },
    { label: t('nav.courses'), path: '/courses', icon: <ShoppingBag size={20} /> },
    { label: t('nav.news'), path: '/news', icon: <Megaphone size={20} /> },
    { label: t('nav.community'), path: '/community', icon: <Users size={20} /> },
    { label: t('nav.live'), path: '/live', icon: <Video size={20} /> },
    { label: t('nav.youtube'), path: '/youtube', icon: <Youtube size={20} /> },
    { label: t('nav.blog'), path: '/blog', icon: <BookOpen size={20} /> },
    { label: t('nav.contact'), path: '/contact', icon: <Mail size={20} /> },
  ];

  if (isAuthenticated && currentUser) {
    if (currentUser.role === 'student') {
      navItems.unshift({ label: t('nav.dashboard'), path: '/dashboard', icon: <User size={20} className="text-green-400" /> });
    } else if (currentUser.role === 'creator') {
      navItems.push({ label: t('nav.studio'), path: '/creator-studio', icon: <LayoutDashboard size={20} className="text-blue-400" /> });
    } else if (currentUser.role === 'admin' || currentUser.isFounder) {
      navItems.push({ label: t('nav.studio'), path: '/creator-studio', icon: <LayoutDashboard size={20} className="text-blue-400" /> });
      navItems.push({ label: t('nav.admin'), path: '/admin', icon: <Shield size={20} className="text-red-500 animate-pulse" /> });
    }
  }

  const langs = [
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'es', label: 'Español', flag: '🇪🇸' },
    { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-brand-gray">
      <RoleSwitcher />

      {/* BANDEAU PROMO DYNAMIQUE */}
      {activeGlobalPromo && !isAuthPage && (
        <div className="bg-brand-blue text-white py-2.5 px-4 text-center relative overflow-hidden z-[60]">
           <div className="flex items-center justify-center gap-4 animate-in fade-in slide-in-from-top-2">
             <Sparkles size={14} className="animate-pulse" />
             <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em]">
               OFFRE EXCEPTIONNELLE : <span className="bg-white text-brand-blue px-2 py-0.5 rounded ml-1">-{activeGlobalPromo.discountValue}{activeGlobalPromo.type === 'percentage' ? '%' : '$'}</span> SUR TOUT LE SITE AVEC LE CODE <span className="underline decoration-2 underline-offset-4">{activeGlobalPromo.code}</span>
             </p>
             <Sparkles size={14} className="animate-pulse" />
           </div>
           <div className="absolute top-0 left-0 w-full h-full bg-shimmer opacity-20 pointer-events-none animate-shimmer"></div>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        {showGreeting && (
          <div className="fixed top-20 lg:top-12 left-1/2 transform -translate-x-1/2 z-[100] bg-brand-black text-white px-6 py-3 rounded-full shadow-2xl animate-in slide-in-from-top-10 flex items-center gap-3 border border-white/10">
            <div className="w-2 h-2 bg-brand-blue rounded-full animate-pulse"></div>
            <span className="font-medium text-sm md:text-base">{greetingMsg}</span>
          </div>
        )}

        {/* MOBILE HEADER */}
        <div className="lg:hidden fixed top-0 left-0 w-full bg-brand-black text-white z-50 flex justify-between items-center p-4 shadow-md h-16 border-b border-white/5">
          <div className="flex items-center gap-3">
             <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-1 hover:bg-gray-800 rounded">
               {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
             </button>
             <span className="font-serif font-black text-xl tracking-wider text-white uppercase">KADJOLO</span>
          </div>
          <div className="flex items-center gap-4">
             {isAuthenticated ? (
               <Link to="/dashboard"><img src={currentUser?.avatar} className="w-8 h-8 rounded-full border border-brand-blue shadow-lg" /></Link>
             ) : (
               <Link to="/login" className="text-xs font-black bg-brand-blue text-white px-4 py-2 rounded-full uppercase tracking-widest">{t('nav.login')}</Link>
             )}
          </div>
        </div>

        {/* SIDEBAR */}
        <aside className={`
          fixed inset-y-0 left-0 z-50 w-72 md:w-80 bg-brand-black text-white transform transition-transform duration-300 ease-in-out shadow-2xl flex flex-col h-full
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:relative lg:translate-x-0 border-r border-white/5
        `}>
          <div className="p-10 text-center border-b border-gray-800 flex flex-col items-center bg-gradient-to-br from-brand-blue to-black relative justify-center min-h-[180px]">
             <button className="absolute top-4 right-4 lg:hidden p-2 bg-white/5 rounded-full" onClick={() => setIsSidebarOpen(false)}>
               <X size={20} className="text-white" />
             </button>
            <h1 className="font-sans font-black text-2xl md:text-3xl text-white tracking-tighter leading-tight uppercase italic">KADJOLO BASILE</h1>
            <p className="text-[10px] text-gray-100/60 mt-2 tracking-[0.4em] uppercase font-black">Elite Leadership</p>
          </div>

          <nav className="flex-1 p-4 overflow-y-auto custom-scrollbar">
            <div className="px-4 py-3 mb-6 bg-white/5 rounded-2xl border border-white/10">
               <div className="flex items-center justify-between text-gray-400 mb-3 px-2">
                  <span className="text-[10px] font-black uppercase tracking-widest">{t('lang.select')}</span>
                  <Languages size={14} />
               </div>
               <div className="grid grid-cols-2 gap-2">
                  {langs.map(l => (
                    <button 
                      key={l.code}
                      onClick={() => setLanguage(l.code as any)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl text-[10px] font-black transition-all ${language === l.code ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/20' : 'bg-black/40 text-gray-500 hover:text-white border border-transparent hover:border-white/10'}`}
                    >
                      <span>{l.flag}</span> {l.code.toUpperCase()}
                    </button>
                  ))}
               </div>
            </div>

            <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={() => setIsSidebarOpen(false)}
                    className={`flex items-center space-x-3 px-5 py-4 rounded-2xl transition-all duration-300 group ${
                      isActive 
                        ? 'bg-brand-blue text-white font-bold shadow-xl shadow-brand-blue/20 scale-[1.02]' 
                        : 'text-gray-500 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span className={`${isActive ? '' : 'group-hover:text-brand-blue transition-colors'}`}>{item.icon}</span>
                    <span className="text-sm uppercase tracking-widest">{item.label}</span>
                  </Link>
                </li>
              );
            })}
            </ul>
          </nav>

          <div className="p-6 border-t border-gray-800 bg-black/40 shrink-0">
            {isAuthenticated && currentUser ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4 px-2">
                   <img src={currentUser.avatar} className="w-10 h-10 rounded-xl border border-white/20 shadow-xl" alt="" />
                   <div className="overflow-hidden">
                      <p className="text-xs text-white font-black truncate uppercase">{currentUser.name}</p>
                      <p className="text-[9px] text-brand-blue font-black uppercase tracking-tighter">{currentUser.role}</p>
                   </div>
                </div>
                <button onClick={logout} className="flex items-center justify-center gap-2 text-gray-500 hover:text-white px-4 py-3 text-[10px] font-black uppercase tracking-widest w-full transition-all border border-white/10 rounded-2xl bg-white/5">
                  <LogOut size={16} /> <span>{t('nav.logout')}</span>
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                 <Link to="/login" className="flex items-center justify-center gap-2 w-full bg-white/5 text-gray-400 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all border border-white/10">
                   <LogIn size={16} /> {t('nav.login')}
                 </Link>
                 <Link to="/register" className="flex items-center justify-center gap-2 w-full bg-brand-blue text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/90 transition-all shadow-xl shadow-brand-blue/30">
                   <UserPlus size={16} /> {t('nav.register')}
                 </Link>
              </div>
            )}
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 lg:pt-0 overflow-y-auto h-screen scroll-smooth bg-brand-gray flex flex-col pt-16 lg:pt-0">
          <div className={`max-w-7xl mx-auto p-4 md:p-10 w-full flex-grow transition-opacity duration-300 ${isCreatorStudio ? 'max-w-none p-0 md:p-0' : ''}`}>
            {children}
          </div>
          {showFooter && <Footer />}
        </main>
      </div>
    </div>
  );
};

export default Layout;


import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, Package, Users as UsersIcon, Wallet, Settings, Lock, 
  ChevronRight, LogOut, Home as HomeIcon, ShoppingBag, BarChart2, 
  MessageCircle, MousePointerClick, Zap, MoreHorizontal, Bell, CheckCircle, X
} from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { useData } from '../contexts/DataContext';
import { AppNotification } from '../types';
import { vendorProfiles } from '../services/mockData';

// Importation des composants isolés par onglet
import DashboardOverview from '../components/studio/DashboardOverview';
import SalesManager from '../components/studio/SalesManager';
import { ProductsManager } from '../components/studio/ProductsManager';
import CustomersManager from '../components/studio/CustomersManager';
import RevenueManager from '../components/studio/RevenueManager';
import AnalyticsManager from '../components/studio/AnalyticsManager';
import ReviewsManager from '../components/studio/ReviewsManager';
import MarketingManager from '../components/studio/MarketingManager';
import AutomationManager from '../components/studio/AutomationManager';
import SettingsManager from '../components/studio/SettingsManager';
import { SupportManager } from '../components/studio/SupportManager';

const NotificationToast = ({ notification, onClose }: { notification: AppNotification, onClose: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-24 right-6 z-[100] animate-in slide-in-from-right-10 duration-500">
      <div className={`bg-white rounded-2xl shadow-2xl border-l-4 p-5 max-w-sm flex items-start gap-4 ${
        notification.type === 'success' ? 'border-green-500' : 
        notification.type === 'error' ? 'border-red-500' : 'border-blue-600'
      }`}>
        <div className={`p-2 rounded-xl shrink-0 ${
          notification.type === 'success' ? 'bg-green-50 text-green-600' : 
          notification.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
        }`}>
          {notification.type === 'success' ? <CheckCircle size={20} /> : <Bell size={20} />}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-black text-gray-900 text-sm uppercase tracking-tight">{notification.title}</h4>
          <p className="text-xs text-gray-400 mt-1 leading-relaxed line-clamp-2">{notification.message}</p>
        </div>
        <button onClick={onClose} className="text-gray-300 hover:text-gray-500 transition-colors"><X size={16} /></button>
      </div>
    </div>
  );
};

const CreatorStudio: React.FC = () => {
  const { user } = useUser();
  const { courses, deleteCourse, sales, addCourse, updateCourse, messages, addMessage } = useData();
  
  const [activeTab, setActiveTab] = useState<string>('home');
  const [activeToast, setActiveToast] = useState<AppNotification | null>(null);

  // Récupération du profil vendeur pour le taux de commission
  const vendorProfile = useMemo(() => vendorProfiles.find(v => v.userId === user?.id) || vendorProfiles[0], [user]);
  const currentCommissionRate = vendorProfile?.commissionRate || 10;

  const myCourses = useMemo(() => courses.filter(c => c.instructorId === user?.id || (user?.isFounder && c.instructorId === 'v1')), [courses, user]);
  const mySales = useMemo(() => sales.filter(s => s.vendorId === user?.id || (user?.isFounder && s.vendorId === 'v1')), [sales, user]);
  const myMessages = useMemo(() => messages.filter(m => m.senderId === user?.id), [messages, user]);
  const unreadSupport = useMemo(() => myMessages.filter(m => m.replyText && !m.isRead).length, [myMessages]);

  const navItems = [
    { id: 'home', label: 'Accueil', icon: <HomeIcon /> },
    { id: 'sales', label: 'Ventes', icon: <ShoppingBag /> },
    { id: 'products', label: 'Produits', icon: <Package /> },
    { id: 'customers', label: 'Clients', icon: <UsersIcon /> },
    { id: 'revenue', label: 'Revenus', icon: <Wallet /> },
    { id: 'analytics', label: 'Analytiques', icon: <BarChart2 /> },
    { id: 'reviews', label: 'Avis', icon: <MessageCircle /> },
    { id: 'marketing', label: 'Marketing', icon: <MousePointerClick /> },
    { id: 'automations', label: 'Automatisations', icon: <Zap /> },
    { id: 'plus', label: 'Plus', icon: <MoreHorizontal />, isDropdown: true },
    { id: 'support', label: 'Support Admin', icon: <Bell />, badge: unreadSupport, isSpecial: true },
    { id: 'settings', label: 'Paramètres', icon: <Settings /> },
  ];

  if (!user || (user.role !== 'creator' && user.role !== 'admin')) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50 p-10 text-center">
        <div className="space-y-4">
          <Lock size={48} className="mx-auto text-gray-300" />
          <h2 className="text-xl font-black text-gray-400 uppercase tracking-widest">Accès Réservé Créateurs</h2>
          <Link to="/" className="text-blue-600 font-black border-b-2 border-blue-600 inline-block mt-4">Retourner à l'accueil</Link>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <DashboardOverview sales={mySales} courses={myCourses} commissionRate={currentCommissionRate} />;
      case 'sales':
        return <SalesManager sales={mySales} commissionRate={currentCommissionRate} />;
      case 'products':
        return <ProductsManager courses={myCourses} onAdd={addCourse} onDelete={deleteCourse} onUpdate={updateCourse} />;
      case 'customers':
        return <CustomersManager />;
      case 'revenue':
        return <RevenueManager />;
      case 'analytics':
        return <AnalyticsManager />;
      case 'reviews':
        return <ReviewsManager />;
      case 'marketing':
        return <MarketingManager />;
      case 'automations':
        return <AutomationManager />;
      case 'support':
        return <SupportManager userMessages={myMessages} onSendMessage={(form) => addMessage({ senderId: user.id, name: user.name, email: user.email, subject: form.subject, message: form.message, attachmentUrl: form.attachment })} />;
      case 'settings':
        return <SettingsManager />;
      default:
        return (
          <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[40px] border border-gray-100 text-center">
            <p className="text-gray-400 font-black uppercase tracking-widest text-sm">Module {activeTab} prêt pour modification</p>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#F8FAFC]">
      {activeToast && <NotificationToast notification={activeToast} onClose={() => setActiveToast(null)} />}

      <aside className="w-full lg:w-72 bg-white border-r border-gray-100 flex flex-col h-auto lg:h-screen sticky top-0 z-40">
        <div className="p-8 border-b border-gray-50 flex items-center gap-3">
          <div className="w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center shadow-lg"><LayoutDashboard size={20} /></div>
          <div>
            <h1 className="font-black text-lg tracking-tighter text-gray-900 uppercase italic leading-none">STUDIO</h1>
            <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest mt-1">Creator Suite</p>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
          {navItems.map(item => (
            <button 
              key={item.id} 
              onClick={() => setActiveTab(item.id)} 
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all ${
                activeTab === item.id 
                ? 'bg-blue-50 text-blue-600 font-black border border-blue-100 shadow-sm' 
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
              }`}
            >
              <div className="flex items-center gap-3">
                {React.cloneElement(item.icon as React.ReactElement, { size: 18 } as any)}
                <span className="text-sm font-medium">{item.label}</span>
                {item.badge ? <span className="bg-red-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full animate-bounce">{item.badge}</span> : null}
              </div>
              {(item as any).isDropdown ? <ChevronRight size={14} className="text-gray-300" /> : null}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-50">
          <Link to="/" className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-gray-400 hover:text-red-500 transition-colors">
            <LogOut size={18} /><span className="text-xs font-black uppercase tracking-widest">Sortir</span>
          </Link>
        </div>
      </aside>

      <main className="flex-1 p-6 md:p-10 lg:p-16 overflow-y-auto h-screen">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase italic">{navItems.find(i => i.id === activeTab)?.label}</h2>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-gray-100 shadow-sm">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-[9px] font-black uppercase tracking-widest text-gray-500">Flux Vendeur Actif</span>
              </div>
              <img src={user.avatar} className="w-12 h-12 rounded-2xl border-2 border-blue-600/10 shadow-sm" alt="" />
            </div>
          </div>
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default CreatorStudio;

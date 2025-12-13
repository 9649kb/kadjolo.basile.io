
import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Community from './pages/Community';
import LiveStream from './pages/LiveStream';
import Marketplace from './pages/Marketplace';
import CreatorStudio from './pages/CreatorStudio';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard'; // IMPORTED
import Blog from './pages/Blog';
import About from './pages/About';
import Contact from './pages/Contact';
import YouTubePage from './pages/YouTubePage';
import ProductLanding from './pages/ProductLanding';
import LegalPage from './pages/LegalPage';
import News from './pages/News';
import VendorShop from './pages/VendorShop';
import Login from './pages/Login';
import Register from './pages/Register';
import { MessageSquare, X } from 'lucide-react';
import { generateAIResponse } from './services/geminiService';
import { UserProvider, useUser } from './contexts/UserContext';

// Protected Route Component (Standard)
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useUser();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

// ADMIN ROUTE COMPONENT (New)
const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useUser();
  
  // Must be logged in AND be Founder/Admin
  if (!user || (!user.isFounder && user.role !== 'admin')) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// AI Chat Widget Component
const AIChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'bot', text: string}[]>([
    { role: 'bot', text: 'Bonjour ! Je suis l\'assistant IA de KADJOLO. Comment puis-je vous aider à atteindre vos objectifs aujourd\'hui ?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const response = await generateAIResponse(userMsg);
      setMessages(prev => [...prev, { role: 'bot', text: response }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'bot', text: "Désolé, j'ai eu un petit problème technique." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="bg-white w-80 md:w-96 h-[500px] rounded-2xl shadow-2xl border border-gray-200 mb-4 flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">
          <div className="bg-brand-black p-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-brand-green animate-pulse"></div>
              <span className="font-bold">Assistant KADJOLO</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:text-gray-300"><X size={18} /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-brand-gray">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-lg text-sm ${
                  m.role === 'user' 
                    ? 'bg-brand-blue text-white rounded-br-none font-medium' 
                    : 'bg-white text-gray-700 border border-gray-200 rounded-bl-none shadow-sm'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm text-xs text-gray-400 italic">
                  En train d'écrire...
                </div>
              </div>
            )}
          </div>
          <div className="p-3 border-t border-gray-100 bg-white">
            <div className="flex gap-2">
              <input 
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Posez une question..."
                className="flex-1 bg-brand-gray border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand-blue"
              />
              <button onClick={handleSend} disabled={isLoading} className="bg-brand-black text-white p-2 rounded hover:bg-gray-800 disabled:opacity-50 transition-colors">
                <MessageSquare size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-brand-blue hover:bg-blue-600 text-white p-4 rounded-full shadow-lg transition-transform hover:scale-110 flex items-center gap-2 font-bold shadow-blue-500/30"
      >
        <MessageSquare size={24} />
        {!isOpen && <span className="hidden md:inline">Besoin d'aide ?</span>}
      </button>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <UserProvider>
      <Router>
        <Routes>
          {/* Dedicated Admin Layout/Route (No standard Layout wrapper) */}
          <Route path="/admin" element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } />

          {/* Standard Layout Routes */}
          <Route path="*" element={
            <Layout>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/youtube" element={<YouTubePage />} />
                
                {/* Auth Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                {/* Landing Pages */}
                <Route path="/product/:id" element={<ProductLanding />} />
                <Route path="/courses/:id" element={<ProductLanding />} />
                <Route path="/shop/:id" element={<VendorShop />} />
                
                {/* Legal Pages */}
                <Route path="/privacy" element={<LegalPage type="privacy" />} />
                <Route path="/terms" element={<LegalPage type="terms" />} />
                <Route path="/legal" element={<LegalPage type="legal" />} />
                <Route path="/refund" element={<LegalPage type="refund" />} />

                {/* Public Access */}
                <Route path="/news" element={<News />} />
                <Route path="/community" element={<Community />} />
                <Route path="/live" element={<LiveStream />} />
                <Route path="/courses" element={<Marketplace />} />
                <Route path="/marketplace" element={<Marketplace />} />

                {/* Protected Routes */}
                <Route path="/dashboard" element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />
                <Route path="/creator-studio" element={<ProtectedRoute><CreatorStudio /></ProtectedRoute>} />

                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Layout>
          } />
        </Routes>
        <AIChatWidget />
      </Router>
    </UserProvider>
  );
};

export default App;

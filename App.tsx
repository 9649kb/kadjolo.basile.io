

import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Community from './pages/Community';
import LiveStream from './pages/LiveStream';
import Marketplace from './pages/Marketplace';
import CreatorStudio from './pages/CreatorStudio';
import Blog from './pages/Blog';
import About from './pages/About';
import Contact from './pages/Contact';
import YouTubePage from './pages/YouTubePage';
import ProductLanding from './pages/ProductLanding';
import LegalPage from './pages/LegalPage';
import News from './pages/News';
import { MessageSquare, X } from 'lucide-react';
import { generateAIResponse } from './services/geminiService';

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
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/news" element={<News />} />
          <Route path="/community" element={<Community />} />
          <Route path="/live" element={<LiveStream />} />
          <Route path="/courses" element={<Marketplace />} />
          <Route path="/marketplace" element={<Marketplace />} />
          
          {/* Landing Page for Ads - Clean URL */}
          <Route path="/product/:id" element={<ProductLanding />} />
          <Route path="/courses/:id" element={<ProductLanding />} />
          
          {/* SaaS Interface */}
          <Route path="/creator-studio" element={<CreatorStudio />} />
          
          {/* Blog & Static */}
          <Route path="/blog" element={<Blog />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/youtube" element={<YouTubePage />} />
          
          {/* Legal Pages for Ads Compliance */}
          <Route path="/privacy" element={<LegalPage type="privacy" />} />
          <Route path="/terms" element={<LegalPage type="terms" />} />
          <Route path="/legal" element={<LegalPage type="legal" />} />
          <Route path="/refund" element={<LegalPage type="refund" />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
      <AIChatWidget />
    </Router>
  );
};

export default App;
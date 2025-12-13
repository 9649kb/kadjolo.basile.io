
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Youtube, Instagram, Twitter, Mail, MapPin, Phone, ArrowRight, Shield, Globe, Check, Loader } from 'lucide-react';
import { siteConfig } from '../services/mockData';
import { subscribeToNewsletter } from '../services/notificationService';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleSubscribe = async () => {
    if (!email || !email.includes('@')) return;
    setStatus('loading');
    await subscribeToNewsletter(email);
    setStatus('success');
    setEmail('');
    setTimeout(() => setStatus('idle'), 3000);
  };

  return (
    <footer className="bg-brand-black text-white pt-16 pb-8 border-t border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Top Section: 4 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Column 1: Brand & About */}
          <div className="space-y-6">
            <div>
              <h2 className="font-serif text-2xl font-bold tracking-wider text-white">KADJOLO</h2>
              <p className="text-xs text-brand-blue font-bold uppercase tracking-[0.2em]">Excellence & Leadership</p>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              La plateforme de référence pour les entrepreneurs ambitieux. Formations, mentorat et stratégies pour dominer votre marché.
            </p>
            <div className="flex gap-4">
              <a href={siteConfig.socials.facebook} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-gray-400 hover:bg-brand-blue hover:text-white transition-all">
                <Facebook size={18} />
              </a>
              <a href={siteConfig.socials.youtube} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-gray-400 hover:bg-red-600 hover:text-white transition-all">
                <Youtube size={18} />
              </a>
              <a href={siteConfig.socials.instagram} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-gray-400 hover:bg-pink-600 hover:text-white transition-all">
                <Instagram size={18} />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Globe size={16} className="text-brand-blue" /> Navigation
            </h3>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><Link to="/" className="hover:text-white hover:pl-2 transition-all flex items-center gap-2"><ArrowRight size={12}/> Accueil</Link></li>
              <li><Link to="/courses" className="hover:text-white hover:pl-2 transition-all flex items-center gap-2"><ArrowRight size={12}/> Formations</Link></li>
              <li><Link to="/live" className="hover:text-white hover:pl-2 transition-all flex items-center gap-2"><ArrowRight size={12}/> Live Streaming</Link></li>
              <li><Link to="/community" className="hover:text-white hover:pl-2 transition-all flex items-center gap-2"><ArrowRight size={12}/> Communauté</Link></li>
              <li><Link to="/blog" className="hover:text-white hover:pl-2 transition-all flex items-center gap-2"><ArrowRight size={12}/> Blog & Articles</ArrowRight></li>
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <MapPin size={16} className="text-brand-blue" /> Contact
            </h3>
            <ul className="space-y-4 text-sm text-gray-400">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-brand-blue mt-0.5 shrink-0" />
                <span>{siteConfig.location}</span>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={18} className="text-brand-blue mt-0.5 shrink-0" />
                <a href={`mailto:${siteConfig.email}`} className="hover:text-white transition-colors">{siteConfig.email}</a>
              </li>
              <li className="flex items-start gap-3">
                <Phone size={18} className="text-brand-blue mt-0.5 shrink-0" />
                <a href={`tel:${siteConfig.phone}`} className="hover:text-white transition-colors">{siteConfig.phone}</a>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div>
            <h3 className="text-lg font-bold mb-6">Newsletter Privée</h3>
            <p className="text-gray-400 text-sm mb-4">
              Recevez mes conseils exclusifs chaque semaine. Pas de spam.
            </p>
            <div className="flex flex-col gap-2">
              {status === 'success' ? (
                <div className="bg-green-900/30 border border-green-800 text-green-400 px-4 py-3 rounded-lg text-sm flex items-center gap-2 animate-in fade-in">
                  <Check size={16} /> Inscription réussie !
                </div>
              ) : (
                <>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Votre email professionnel" 
                    className="bg-gray-900 border border-gray-800 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-brand-blue text-sm"
                  />
                  <button 
                    onClick={handleSubscribe}
                    disabled={status === 'loading' || !email}
                    className="bg-brand-blue hover:bg-blue-600 text-white px-4 py-3 rounded-lg font-bold text-sm transition-colors shadow-lg shadow-blue-900/30 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {status === 'loading' ? <Loader size={16} className="animate-spin" /> : 'S\'inscrire'}
                  </button>
                </>
              )}
            </div>
          </div>

        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 mb-8"></div>

        {/* Bottom Section: Copyright & Legal */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>© {currentYear} KADJOLO BASILE. Tous droits réservés.</p>
          <div className="flex flex-wrap justify-center gap-6">
            <Link to="/legal" className="hover:text-white transition-colors">Mentions Légales</Link>
            <Link to="/privacy" className="hover:text-white transition-colors">Politique de Confidentialité</Link>
            <Link to="/terms" className="hover:text-white transition-colors">CGV</Link>
            <Link to="/refund" className="hover:text-white transition-colors">Remboursement</Link>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Shield size={12} />
            <span>Paiement 100% Sécurisé</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;

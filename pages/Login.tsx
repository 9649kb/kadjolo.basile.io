
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogIn, Mail, Lock, ArrowRight, Ticket } from 'lucide-react';
import { useUser } from '../contexts/UserContext';

const Login: React.FC = () => {
  const { login } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/creator-studio';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(email); // In real app, send password too
      navigate(from, { replace: true }); 
    } catch (error) {
      alert("Erreur de connexion");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-gray flex flex-col justify-center items-center p-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md animate-in fade-in slide-in-from-bottom-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-brand-blue/10 text-brand-blue rounded-full flex items-center justify-center mx-auto mb-4">
            <Ticket size={32} />
          </div>
          <h1 className="text-2xl font-serif font-bold text-gray-900">Connexion Membre</h1>
          <p className="text-gray-500 text-sm mt-2">Veuillez présenter votre ticket d'accès (Identifiants) pour entrer.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="email" 
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-blue focus:outline-none transition-all"
                placeholder="votre@email.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Mot de passe</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="password" 
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-blue focus:outline-none transition-all"
                placeholder="••••••••"
              />
            </div>
            <div className="flex justify-end mt-2">
              <Link to="/forgot-password" className="text-xs text-brand-blue font-bold hover:underline">Code oublié ?</Link>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-brand-black text-white font-bold py-4 rounded-xl shadow-lg hover:bg-gray-800 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {isLoading ? 'Vérification...' : 'Valider mon Ticket'} <ArrowRight size={20} />
          </button>
        </form>

        <div className="mt-8 text-center pt-6 border-t border-gray-100">
          <p className="text-sm text-gray-600">
            Vous n'avez pas de ticket ?{' '}
            <Link to="/register" className="text-brand-blue font-bold hover:underline">
              Créer un compte
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

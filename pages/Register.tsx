
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, ShoppingBag, BookOpen, Ticket } from 'lucide-react';
import { useUser } from '../contexts/UserContext';

const Register: React.FC = () => {
  const { register } = useUser();
  const navigate = useNavigate();
  
  const [role, setRole] = useState<'student' | 'creator'>('student');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await register(name, email, role);
      // Redirect based on role
      if (role === 'creator') {
        navigate('/creator-studio');
      } else {
        navigate('/marketplace');
      }
    } catch (error) {
      alert("Erreur lors de l'inscription");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-gray flex flex-col justify-center items-center p-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-lg animate-in fade-in slide-in-from-bottom-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-brand-green/10 text-brand-green rounded-full flex items-center justify-center mx-auto mb-4">
            <UserPlus size={32} />
          </div>
          <h1 className="text-2xl font-serif font-bold text-gray-900">Créer un compte</h1>
          <p className="text-gray-500 text-sm mt-2">Rejoignez la communauté de l'excellence.</p>
        </div>

        {/* Role Selection */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <button 
            type="button"
            onClick={() => setRole('student')}
            className={`p-4 rounded-xl border-2 text-left transition-all ${role === 'student' ? 'border-brand-blue bg-blue-50' : 'border-gray-100 hover:border-gray-200'}`}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${role === 'student' ? 'bg-brand-blue text-white' : 'bg-gray-100 text-gray-500'}`}>
              <BookOpen size={20} />
            </div>
            <h3 className={`font-bold text-sm ${role === 'student' ? 'text-brand-blue' : 'text-gray-700'}`}>Client / Élève</h3>
            <p className="text-xs text-gray-500 mt-1 leading-tight">Je veux acheter des formations et apprendre.</p>
          </button>

          <button 
            type="button"
            onClick={() => setRole('creator')}
            className={`p-4 rounded-xl border-2 text-left transition-all ${role === 'creator' ? 'border-brand-black bg-gray-50' : 'border-gray-100 hover:border-gray-200'}`}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${role === 'creator' ? 'bg-brand-black text-white' : 'bg-gray-100 text-gray-500'}`}>
              <ShoppingBag size={20} />
            </div>
            <h3 className={`font-bold text-sm ${role === 'creator' ? 'text-brand-black' : 'text-gray-700'}`}>Vendeur</h3>
            <p className="text-xs text-gray-500 mt-1 leading-tight">Je veux créer ma boutique et vendre.</p>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Nom Complet</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="text" 
                required
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-blue focus:outline-none transition-all"
                placeholder="Kadjolo Basile"
              />
            </div>
          </div>

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
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Code d'invitation (Optionnel)</label>
            <div className="relative">
              <Ticket className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="text" 
                value={inviteCode}
                onChange={e => setInviteCode(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-blue focus:outline-none transition-all"
                placeholder="Ticket ou Code Promo"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-brand-blue text-white font-bold py-4 rounded-xl shadow-lg hover:bg-blue-600 transition-all flex items-center justify-center gap-2 disabled:opacity-70 mt-6"
          >
            {isLoading ? 'Création...' : (role === 'creator' ? 'Créer ma boutique' : 'Créer mon compte')}
          </button>
        </form>

        <div className="mt-8 text-center pt-6 border-t border-gray-100">
          <p className="text-sm text-gray-600">
            Déjà un compte ?{' '}
            <Link to="/login" className="text-brand-blue font-bold hover:underline">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;

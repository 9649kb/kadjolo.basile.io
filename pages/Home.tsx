
import React from 'react';
import { ArrowRight, MessageSquare, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="space-y-12 pb-20">
      {/* Hero Section - Style Exact Capture d'Écran avec Animations Bouclées */}
      <section className="relative mx-auto max-w-[1400px]">
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-[40px] p-10 md:p-24 min-h-[650px] flex flex-col justify-center text-white relative overflow-hidden shadow-2xl">
          
          {/* Éléments de design en arrière-plan (Subtiles rayons lumineux) */}
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.15)_0%,transparent_50%)] pointer-events-none"></div>
          
          <div className="relative z-10 max-w-4xl space-y-10">
            {/* Badge Supérieur - ANIMÉ EN BOUCLE (Glow) */}
            <div className="animate-in fade-in slide-in-from-top-4 duration-700">
              <span className="inline-block px-5 py-2 bg-white text-blue-600 text-[10px] font-black rounded-full tracking-[0.2em] uppercase shadow-lg animate-glow-pulse border border-white/50 cursor-default">
                Plateforme Officielle
              </span>
            </div>

            {/* Titre de l'image */}
            <h1 className="text-5xl md:text-8xl font-black tracking-tight leading-tight animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
              Révélez votre <br />
              <span className="text-white">Potentiel.</span>
            </h1>

            {/* Texte de description de l'image */}
            <p className="text-blue-50/90 text-lg md:text-2xl leading-relaxed max-w-2xl font-medium animate-in fade-in duration-1000 delay-400">
              Bienvenue sur l'espace officiel de KADJOLO BASILE. Formations d'élite, communauté privée et ressources exclusives pour entrepreneurs ambitieux.
            </p>

            {/* Boutons d'action - "Accéder aux Ressources" ANIMÉ EN BOUCLE */}
            <div className="flex flex-col sm:flex-row items-center gap-6 pt-6 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-600">
              <Link 
                to="/courses" 
                className="w-full sm:w-auto bg-white text-blue-600 px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-wider flex items-center justify-center gap-3 shadow-2xl hover:scale-105 transition-transform animate-float ring-4 ring-white/10"
              >
                Accéder aux Ressources <ArrowRight size={20} className="animate-pulse" />
              </Link>
              
              <Link 
                to="/community" 
                className="w-full sm:w-auto bg-white/10 backdrop-blur-md border border-white/20 text-white px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-wider flex items-center justify-center hover:bg-white/20 transition-all"
              >
                Rejoindre le Groupe
              </Link>
            </div>

            {/* Social Proof Line */}
            <div className="flex items-center gap-4 pt-8 animate-in fade-in duration-1000 delay-800">
              <div className="flex -space-x-3">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-blue-600 bg-blue-400 flex items-center justify-center overflow-hidden shadow-md">
                    <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="leader" />
                  </div>
                ))}
              </div>
              <p className="text-blue-100 text-sm font-bold opacity-80">
                Rejoint par +15,000 leaders
              </p>
            </div>
          </div>

          {/* Floating Help Widget - Bas à droite du Hero */}
          <div className="absolute bottom-10 right-10 hidden md:flex items-center gap-3 bg-white/10 backdrop-blur-xl border border-white/20 px-6 py-4 rounded-3xl cursor-pointer hover:bg-white/20 transition-all group animate-float" style={{ animationDelay: '1s' }}>
            <div className="p-2 bg-white rounded-xl text-blue-600 shadow-lg group-hover:scale-110 transition-transform">
              <MessageSquare size={20} fill="currentColor" className="text-blue-600" />
            </div>
            <span className="text-sm font-black uppercase tracking-widest">Besoin d'aide ?</span>
          </div>
        </div>
      </section>

      {/* Stats Rapides - Section Complémentaire Professionnelle */}
      <section className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 py-10">
        {[
          { label: 'Formations d\'élite', val: '45+', color: 'text-blue-600' },
          { label: 'Mentorat Privé', val: '24/7', color: 'text-green-600' },
          { label: 'Pays représentés', val: '22', color: 'text-blue-600' },
          { label: 'Taux de réussite', val: '98%', color: 'text-blue-600' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center hover:shadow-xl transition-all group">
            <h3 className={`text-3xl font-black ${stat.color} mb-1`}>{stat.val}</h3>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
          </div>
        ))}
      </section>

      {/* Call to Action Final */}
      <section className="max-w-4xl mx-auto px-6 text-center py-20">
        <h2 className="text-4xl md:text-6xl font-black text-brand-black mb-8 tracking-tighter">
          Prêt à <span className="text-blue-600">changer d'échelle</span> ?
        </h2>
        <p className="text-gray-500 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
          Ne laissez plus votre avenir au hasard. Appliquez les méthodes qui ont déjà transformé des milliers de carrières.
        </p>
        <Link to="/register" className="bg-brand-black text-white px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:scale-105 transition-transform inline-block">
          Démarrer mon Ascension
        </Link>
      </section>
    </div>
  );
};

export default Home;

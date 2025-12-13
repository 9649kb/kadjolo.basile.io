
import React from 'react';
import { ArrowRight, Star, PlayCircle, Users, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { courses, posts, siteConfig } from '../services/mockData';

const Home: React.FC = () => {
  return (
    <div className="space-y-16">
      {/* Hero Section - BLUE AND WHITE THEME */}
      <section className="relative rounded-3xl overflow-hidden bg-brand-blue text-white shadow-2xl">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 right-0 w-2/3 h-full bg-white skew-x-12 transform translate-x-20 opacity-10"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-full bg-blue-800 skew-x-12 transform -translate-x-20 opacity-50"></div>
        
        <div className="relative z-20 flex flex-col md:flex-row items-center py-12 md:py-20">
          <div className="p-8 md:px-16 w-full text-center md:text-left">
            <div className="flex justify-center md:justify-start">
              <span className="inline-block px-4 py-1 bg-white text-brand-blue text-xs font-bold rounded-full mb-6 tracking-wide shadow-sm">
                PLATEFORME OFFICIELLE
              </span>
            </div>
            <h1 className="font-serif text-4xl md:text-7xl font-bold mb-6 leading-tight max-w-4xl mx-auto md:mx-0">
              {siteConfig.heroText.title}
            </h1>
            <p className="text-blue-100 text-base md:text-lg mb-8 leading-relaxed max-w-2xl mx-auto md:mx-0">
              {siteConfig.heroText.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link to="/courses" className="px-8 py-4 bg-white text-brand-blue font-bold rounded-lg transition-transform hover:scale-105 flex items-center justify-center shadow-lg hover:shadow-xl">
                Accéder aux Ressources
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link to="/community" className="px-8 py-4 bg-blue-700 hover:bg-blue-800 text-white font-medium rounded-lg transition-colors border border-blue-600 flex items-center justify-center">
                Rejoindre le Groupe
              </Link>
            </div>
            <div className="mt-8 flex items-center justify-center md:justify-start gap-4 text-sm text-blue-200">
              <div className="flex -space-x-2">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full bg-blue-400 border-2 border-brand-blue" />
                ))}
              </div>
              <p>Rejoint par +15,000 leaders</p>
            </div>
          </div>
          {/* Photo removed as requested */}
        </div>
      </section>

      {/* Stats Section - Clean White */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Membres Actifs', val: '15K+', icon: <Users className="text-brand-blue" /> },
          { label: 'Formations', val: '45+', icon: <PlayCircle className="text-brand-blue" /> },
          { label: 'Satisfaction', val: '98%', icon: <Star className="text-brand-green" /> },
          { label: 'Pays', val: '22', icon: <CheckCircle className="text-brand-black" /> },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border-l-4 border-brand-blue flex flex-col items-center text-center hover:translate-y-[-5px] transition-transform duration-300">
            <div className="mb-3 p-3 bg-blue-50 rounded-full">{stat.icon}</div>
            <h3 className="text-2xl md:text-3xl font-bold text-brand-black">{stat.val}</h3>
            <p className="text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wide mt-1">{stat.label}</p>
          </div>
        ))}
      </section>

      {/* Featured Courses */}
      <section>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 border-b border-gray-200 pb-4 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-brand-blue font-serif">Formations à la une</h2>
            <p className="text-gray-500 mt-1">Investissez en vous-même avec nos meilleurs programmes.</p>
          </div>
          <Link to="/courses" className="px-4 py-2 bg-gray-100 text-brand-black rounded hover:bg-gray-200 font-medium transition-colors text-sm">
            Voir tout le catalogue
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {courses.slice(0, 3).map(course => (
            <div key={course.id} className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 flex flex-col">
              <div className="relative h-56 overflow-hidden">
                <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute top-3 left-3 bg-brand-blue text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
                  {course.category}
                </div>
                <div className="absolute bottom-3 left-3 text-white">
                   <p className="text-xs opacity-90">Par {course.instructor}</p>
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="font-bold text-xl mb-2 text-brand-black leading-tight group-hover:text-brand-blue transition-colors">
                  {course.title}
                </h3>
                <div className="flex items-center gap-2 mb-4">
                   <div className="flex text-yellow-400">
                     {[...Array(5)].map((_,i) => <Star key={i} size={14} fill={i < Math.floor(course.rating) ? "currentColor" : "none"} />)}
                   </div>
                   <span className="text-xs text-gray-500">({course.students} avis)</span>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                  <span className="text-2xl font-bold text-brand-blue">{course.price}€</span>
                  <button className="px-6 py-2 bg-brand-black text-white text-sm font-bold rounded-lg hover:bg-blue-900 transition-colors shadow-lg shadow-blue-900/10">
                    Découvrir
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Latest News */}
      <section className="bg-gradient-to-br from-white to-blue-50 rounded-3xl p-6 md:p-10 shadow-lg border border-blue-100">
        <div className="flex items-center gap-4 mb-8">
           <div className="w-2 h-10 bg-brand-blue rounded-full"></div>
           <h2 className="text-2xl md:text-3xl font-bold text-brand-black font-serif">Actualités de la Communauté</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          {posts.slice(0, 2).map(post => (
            <div key={post.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-brand-blue transition-colors group">
              <div className="flex gap-4 items-start">
                <img src={post.author.avatar} alt={post.author.name} className="w-14 h-14 rounded-full object-cover ring-4 ring-gray-50 group-hover:ring-blue-100 transition-all shrink-0" />
                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h4 className="font-bold text-lg text-brand-black">{post.author.name}</h4>
                    <span className="bg-blue-100 text-brand-blue text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Membre</span>
                  </div>
                  <p className="text-sm text-gray-400 mb-3">{post.timestamp}</p>
                  <p className="text-gray-700 italic">"{post.content}"</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
           <Link to="/community" className="inline-flex items-center text-brand-blue font-bold hover:underline">
             Voir toutes les actualités <ArrowRight size={16} className="ml-1" />
           </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;

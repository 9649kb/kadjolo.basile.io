import React from 'react';
import { ArrowRight } from 'lucide-react';

const Blog: React.FC = () => {
  const articles = [
    {
      id: 1,
      title: "Les 5 piliers de l'intelligence financière en 2024",
      excerpt: "Découvrez comment structurer vos revenus pour ne plus dépendre d'une seule source.",
      date: "12 Oct 2023",
      category: "Finance",
      image: "https://picsum.photos/800/600?random=10"
    },
    {
      id: 2,
      title: "Comment créer une communauté engagée ?",
      excerpt: "Les secrets pour transformer des abonnés passifs en fans inconditionnels.",
      date: "08 Oct 2023",
      category: "Marketing",
      image: "https://picsum.photos/800/600?random=11"
    },
     {
      id: 3,
      title: "Le Mindset des champions",
      excerpt: "Ce qui différencie ceux qui réussissent de ceux qui abandonnent.",
      date: "01 Oct 2023",
      category: "Mindset",
      image: "https://picsum.photos/800/600?random=12"
    }
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="font-serif text-4xl font-bold text-brand-black mb-4">Le Journal de l'Excellence</h1>
        <p className="text-gray-500 max-w-2xl mx-auto">
          Analyses, stratégies et réflexions pour nourrir votre ambition au quotidien.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles.map((article) => (
          <article key={article.id} className="group cursor-pointer">
            <div className="rounded-xl overflow-hidden mb-4 relative h-64">
               <img 
                 src={article.image} 
                 alt={article.title} 
                 className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
               />
               <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
            </div>
            <div className="flex items-center gap-4 mb-3 text-xs tracking-wider uppercase text-gray-500 font-bold">
              <span className="text-brand-blue">{article.category}</span>
              <span>—</span>
              <span>{article.date}</span>
            </div>
            <h2 className="text-xl font-bold text-brand-black mb-3 group-hover:text-brand-blue transition-colors">
              {article.title}
            </h2>
            <p className="text-gray-600 mb-4 line-clamp-3">
              {article.excerpt}
            </p>
            <span className="inline-flex items-center text-brand-black font-medium text-sm group-hover:underline group-hover:text-brand-blue transition-colors">
              Lire l'article <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </span>
          </article>
        ))}
      </div>

      <div className="mt-16 bg-brand-black text-white rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="font-serif text-3xl font-bold mb-4">Rejoignez la Newsletter Privée</h2>
          <p className="text-gray-300 mb-8 max-w-xl mx-auto">
            Recevez chaque dimanche mes meilleurs conseils directement dans votre boîte mail. Pas de spam, que de la valeur.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Votre adresse email" 
              className="flex-1 px-4 py-3 rounded-lg text-brand-black focus:outline-none focus:ring-2 focus:ring-brand-blue"
            />
            <button className="px-6 py-3 bg-brand-blue hover:bg-blue-600 text-white font-bold rounded-lg transition-colors shadow-lg shadow-blue-900/50">
              S'inscrire
            </button>
          </div>
        </div>
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
      </div>
    </div>
  );
};

export default Blog;
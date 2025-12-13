
import React, { useState, useEffect } from 'react';
import { ArrowRight, Plus, Trash2, Edit3, X, Save, ImageIcon, Calendar, Tag, Search, Check, Loader } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { subscribeToNewsletter } from '../services/notificationService';

// Define Interface locally for now
interface BlogPost {
  id: number | string;
  title: string;
  excerpt: string;
  content?: string; // Full content
  date: string;
  category: string;
  image: string;
}

const INITIAL_POSTS: BlogPost[] = [
  {
    id: 1,
    title: "Les 5 piliers de l'intelligence financière en 2024",
    excerpt: "Découvrez comment structurer vos revenus pour ne plus dépendre d'une seule source.",
    content: "Contenu complet de l'article sur l'intelligence financière...",
    date: "12 Oct 2023",
    category: "Finance",
    image: "https://picsum.photos/800/600?random=10"
  },
  {
    id: 2,
    title: "Comment créer une communauté engagée ?",
    excerpt: "Les secrets pour transformer des abonnés passifs en fans inconditionnels.",
    content: "Contenu complet sur le community management...",
    date: "08 Oct 2023",
    category: "Marketing",
    image: "https://picsum.photos/800/600?random=11"
  },
   {
    id: 3,
    title: "Le Mindset des champions",
    excerpt: "Ce qui différencie ceux qui réussissent de ceux qui abandonnent.",
    content: "Analyse approfondie de la psychologie du succès...",
    date: "01 Oct 2023",
    category: "Mindset",
    image: "https://picsum.photos/800/600?random=12"
  }
];

const Blog: React.FC = () => {
  const { user } = useUser();
  const isAdmin = user?.role === 'admin' || user?.isFounder;

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingPost, setEditingPost] = useState<Partial<BlogPost>>({
    title: '',
    category: '',
    excerpt: '',
    content: '',
    image: ''
  });

  // Newsletter State
  const [email, setEmail] = useState('');
  const [subStatus, setSubStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  // Load from LocalStorage or Init
  useEffect(() => {
    const savedPosts = localStorage.getItem('kadjolo_blog_posts');
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
    } else {
      setPosts(INITIAL_POSTS);
    }
  }, []);

  // Save to LocalStorage on change
  useEffect(() => {
    if (posts.length > 0) {
      localStorage.setItem('kadjolo_blog_posts', JSON.stringify(posts));
    }
  }, [posts]);

  const handleSave = () => {
    if (!editingPost.title || !editingPost.excerpt) return;

    if (editingPost.id) {
      // Update existing
      const updatedPosts = posts.map(p => (p.id === editingPost.id ? { ...p, ...editingPost } as BlogPost : p));
      setPosts(updatedPosts);
    } else {
      // Create new
      const newPost: BlogPost = {
        id: Date.now(),
        title: editingPost.title!,
        excerpt: editingPost.excerpt!,
        content: editingPost.content || '',
        category: editingPost.category || 'Général',
        date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }),
        image: editingPost.image || `https://picsum.photos/800/600?random=${Date.now()}`
      };
      setPosts([newPost, ...posts]);
    }
    
    setIsEditing(false);
    resetForm();
  };

  const handleDelete = (id: number | string) => {
    if (window.confirm("Voulez-vous vraiment supprimer cet article ?")) {
      const updatedPosts = posts.filter(p => p.id !== id);
      setPosts(updatedPosts);
      // Force update local storage if list becomes empty or changes
      localStorage.setItem('kadjolo_blog_posts', JSON.stringify(updatedPosts));
    }
  };

  const startEdit = (post: BlogPost) => {
    setEditingPost(post);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setEditingPost({ title: '', category: '', excerpt: '', content: '', image: '' });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setEditingPost({ ...editingPost, image: url });
    }
  };

  const handleSubscribe = async () => {
    if (!email || !email.includes('@')) return;
    setSubStatus('loading');
    await subscribeToNewsletter(email);
    setSubStatus('success');
    setEmail('');
    setTimeout(() => setSubStatus('idle'), 4000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 pb-12">
      <div className="text-center mb-12">
        <h1 className="font-serif text-4xl font-bold text-brand-black mb-4">Le Journal de l'Excellence</h1>
        <p className="text-gray-500 max-w-2xl mx-auto">
          Analyses, stratégies et réflexions pour nourrir votre ambition au quotidien.
        </p>
        
        {isAdmin && (
          <div className="mt-8">
            <button 
              onClick={() => { resetForm(); setIsEditing(!isEditing); }}
              className="bg-brand-black text-white px-6 py-3 rounded-full font-bold shadow-lg hover:bg-gray-800 transition-all flex items-center gap-2 mx-auto"
            >
              {isEditing ? <X size={20} /> : <Plus size={20} />}
              {isEditing ? 'Fermer l\'éditeur' : 'Nouvel Article'}
            </button>
          </div>
        )}
      </div>

      {/* ADMIN EDITOR */}
      {isEditing && isAdmin && (
        <div className="bg-white p-8 rounded-3xl shadow-xl border-2 border-gray-100 mb-12 animate-in slide-in-from-top-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-brand-black flex items-center gap-2">
              {editingPost.id ? <Edit3 className="text-brand-blue"/> : <Plus className="text-brand-blue"/>}
              {editingPost.id ? 'Modifier l\'article' : 'Rédiger un nouvel article'}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Titre</label>
                <input 
                  value={editingPost.title}
                  onChange={e => setEditingPost({...editingPost, title: e.target.value})}
                  className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-brand-blue outline-none"
                  placeholder="Titre de l'article"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Catégorie</label>
                  <select 
                    value={editingPost.category}
                    onChange={e => setEditingPost({...editingPost, category: e.target.value})}
                    className="w-full border border-gray-200 rounded-xl p-3 outline-none bg-white"
                  >
                    <option value="">Choisir...</option>
                    <option value="Finance">Finance</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Mindset">Mindset</option>
                    <option value="Tech">Tech</option>
                    <option value="Business">Business</option>
                  </select>
                </div>
                <div>
                   <label className="block text-sm font-bold text-gray-700 mb-1">Image (URL)</label>
                   <input 
                      value={editingPost.image}
                      onChange={e => setEditingPost({...editingPost, image: e.target.value})}
                      className="w-full border border-gray-200 rounded-xl p-3 outline-none"
                      placeholder="https://..."
                   />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Upload Image (Alternative)</label>
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center cursor-pointer hover:bg-gray-50 transition-colors relative">
                   <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageUpload} accept="image/*" />
                   <div className="flex flex-col items-center gap-2 text-gray-400">
                      <ImageIcon size={24} />
                      <span className="text-xs font-bold">Cliquez pour importer</span>
                   </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Résumé (Accroche)</label>
                <textarea 
                  value={editingPost.excerpt}
                  onChange={e => setEditingPost({...editingPost, excerpt: e.target.value})}
                  className="w-full border border-gray-200 rounded-xl p-3 h-24 resize-none focus:ring-2 focus:ring-brand-blue outline-none"
                  placeholder="Un bref résumé pour la carte..."
                />
              </div>
              
              {/* Note: Full content editor omitted for brevity in mock, using textarea */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Contenu Complet</label>
                <textarea 
                  value={editingPost.content}
                  onChange={e => setEditingPost({...editingPost, content: e.target.value})}
                  className="w-full border border-gray-200 rounded-xl p-3 h-32 resize-none focus:ring-2 focus:ring-brand-blue outline-none"
                  placeholder="Le corps de votre article..."
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-100">
            <button onClick={() => setIsEditing(false)} className="px-6 py-2 text-gray-500 font-bold hover:bg-gray-50 rounded-lg">Annuler</button>
            <button onClick={handleSave} className="bg-brand-blue text-white px-8 py-2 rounded-lg font-bold hover:bg-blue-600 transition-colors flex items-center gap-2">
              <Save size={18} /> Enregistrer
            </button>
          </div>
        </div>
      )}

      {/* BLOG GRID */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((article) => (
          <article key={article.id} className="group flex flex-col h-full bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden relative">
            
            {/* Admin Overlay Actions */}
            {isAdmin && (
              <div className="absolute top-3 right-3 z-20 flex gap-2">
                <button 
                  onClick={() => startEdit(article)}
                  className="p-2 bg-white/90 backdrop-blur text-blue-600 rounded-lg shadow-sm hover:bg-blue-50 transition-colors"
                  title="Modifier"
                >
                  <Edit3 size={16} />
                </button>
                <button 
                  onClick={() => handleDelete(article.id)}
                  className="p-2 bg-white/90 backdrop-blur text-red-600 rounded-lg shadow-sm hover:bg-red-50 transition-colors"
                  title="Supprimer"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            )}

            <div className="relative h-64 overflow-hidden">
               <img 
                 src={article.image} 
                 alt={article.title} 
                 className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
               <div className="absolute bottom-4 left-4 flex items-center gap-3 text-xs font-bold text-white tracking-wider uppercase">
                  <span className="bg-brand-blue px-2 py-1 rounded-md">{article.category}</span>
                  <span className="flex items-center gap-1"><Calendar size={12}/> {article.date}</span>
               </div>
            </div>
            
            <div className="p-6 flex-1 flex flex-col">
              <h2 className="text-xl font-bold text-brand-black mb-3 group-hover:text-brand-blue transition-colors leading-tight">
                {article.title}
              </h2>
              <p className="text-gray-600 mb-6 line-clamp-3 text-sm flex-1 leading-relaxed">
                {article.excerpt}
              </p>
              <div className="mt-auto pt-4 border-t border-gray-50 flex justify-between items-center">
                <span className="inline-flex items-center text-brand-black font-bold text-sm group-hover:underline group-hover:text-brand-blue transition-colors cursor-pointer">
                  Lire l'article <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>

      {posts.length === 0 && (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
          <Search size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-bold text-gray-500">Aucun article publié</h3>
          <p className="text-gray-400">Soyez le premier à partager du contenu !</p>
        </div>
      )}

      <div className="mt-16 bg-brand-black text-white rounded-3xl p-8 md:p-12 text-center relative overflow-hidden shadow-2xl">
        <div className="relative z-10">
          <h2 className="font-serif text-3xl font-bold mb-4">Rejoignez la Newsletter Privée</h2>
          <p className="text-gray-300 mb-8 max-w-xl mx-auto">
            Recevez chaque dimanche mes meilleurs conseils directement dans votre boîte mail. Pas de spam, que de la valeur.
          </p>
          
          {subStatus === 'success' ? (
            <div className="bg-green-600 text-white px-6 py-4 rounded-xl inline-flex items-center gap-3 animate-in zoom-in">
               <Check size={24} className="bg-white text-green-600 rounded-full p-1" />
               <span className="font-bold">Merci ! Votre inscription est validée.</span>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Votre adresse email" 
                className="flex-1 px-4 py-3 rounded-lg text-brand-black focus:outline-none focus:ring-2 focus:ring-brand-blue"
              />
              <button 
                onClick={handleSubscribe}
                disabled={subStatus === 'loading' || !email}
                className="px-6 py-3 bg-brand-blue hover:bg-blue-600 text-white font-bold rounded-lg transition-colors shadow-lg shadow-blue-900/50 flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {subStatus === 'loading' ? <Loader size={20} className="animate-spin" /> : 'S\'inscrire'}
              </button>
            </div>
          )}
        </div>
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
      </div>
    </div>
  );
};

export default Blog;

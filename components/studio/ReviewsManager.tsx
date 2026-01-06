
import React, { useMemo, useState } from 'react';
import { 
  Star, MessageSquare, Filter, Search, Reply, 
  CheckCircle, Clock, X, Trash2, Send, TrendingUp, AlertCircle
} from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { useUser } from '../../contexts/UserContext';
import { Review } from '../../types';

interface AggregatedReview extends Review {
  courseId: string;
}

const ReviewsManager: React.FC = () => {
  const { courses, addReviewReply } = useData();
  const { user } = useUser();
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState<number | 'all'>('all');
  const [showUnansweredOnly, setShowUnansweredOnly] = useState(false);
  const [replyMode, setReplyMode] = useState<{ courseId: string, reviewId: string } | null>(null);
  const [replyText, setReplyText] = useState('');

  // 1. COLLECTER TOUS LES AVIS DES COURS DU VENDEUR
  const allReviews = useMemo(() => {
    const reviews: AggregatedReview[] = [];
    const myCourses = courses.filter(c => c.instructorId === user?.id || (user?.isFounder && c.instructorId === 'v1'));
    
    myCourses.forEach(course => {
      if (course.reviews) {
        course.reviews.forEach(r => {
          reviews.push({ ...r, courseId: course.id, courseTitle: course.title });
        });
      }
    });
    
    // Simuler des avis si la liste est vide pour la démo
    if (reviews.length === 0) {
      return [
        { id: 'rev_1', rating: 5, comment: "Excellente formation, très pragmatique !", date: "2023-11-15", authorName: "Jean Dupont", courseTitle: "Intelligence Financière 101", courseId: "c1", isReplied: false },
        { id: 'rev_2', rating: 4, comment: "Bon contenu mais j'aurais aimé plus d'exemples concrets.", date: "2023-11-10", authorName: "Alice Martin", courseTitle: "Mindset de Champion", courseId: "c2", isReplied: true, replyText: "Merci Alice, nous ajouterons des cas pratiques !" },
        { id: 'rev_3', rating: 1, comment: "Déçu par la qualité audio sur le module 2.", date: "2023-11-05", authorName: "Marc Solo", courseTitle: "Intelligence Financière 101", courseId: "c1", isReplied: false },
      ] as AggregatedReview[];
    }

    return reviews.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [courses, user]);

  // 2. STATISTIQUES
  const stats = useMemo(() => {
    if (allReviews.length === 0) return { avg: 0, total: 0, unanswered: 0 };
    const avg = allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length;
    const unanswered = allReviews.filter(r => !r.isReplied).length;
    return { avg: avg.toFixed(1), total: allReviews.length, unanswered };
  }, [allReviews]);

  // 3. FILTRAGE
  const filteredReviews = useMemo(() => {
    return allReviews.filter(r => {
      const matchesSearch = 
        r.authorName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        r.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.courseTitle?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRating = ratingFilter === 'all' || r.rating === ratingFilter;
      const matchesUnanswered = !showUnansweredOnly || !r.isReplied;
      
      return matchesSearch && matchesRating && matchesUnanswered;
    });
  }, [allReviews, searchTerm, ratingFilter, showUnansweredOnly]);

  const handleSendReply = () => {
    if (!replyMode || !replyText.trim()) return;
    addReviewReply(replyMode.courseId, replyMode.reviewId, replyText);
    setReplyMode(null);
    setReplyText('');
    alert("Réponse envoyée avec succès !");
  };

  const toggleUnansweredFilter = () => {
    setShowUnansweredOnly(!showUnansweredOnly);
    setRatingFilter('all'); // On réinitialise la note pour se concentrer sur les réponses
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      
      {/* SECTION 1: RÉSUMÉ DES NOTES - CARTES INTERACTIVES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm flex items-center gap-6">
          <div className="w-16 h-16 bg-yellow-50 text-yellow-500 rounded-[24px] flex items-center justify-center shrink-0">
            <Star size={32} fill="currentColor" />
          </div>
          <div>
            <h3 className="text-3xl font-black text-gray-900">{stats.avg}</h3>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Note moyenne</p>
          </div>
        </div>

        <div className="bg-brand-black text-white p-8 rounded-[40px] shadow-xl flex items-center gap-6 relative overflow-hidden group">
          <div className="w-16 h-16 bg-white/10 text-white rounded-[24px] flex items-center justify-center shrink-0 relative z-10">
            <MessageSquare size={32} />
          </div>
          <div className="relative z-10">
            <h3 className="text-3xl font-black">{stats.total}</h3>
            <p className="text-[10px] font-black text-blue-200/50 uppercase tracking-widest">Avis Totaux</p>
          </div>
          <div className="absolute -bottom-4 -right-4 text-white/5 transform rotate-12 group-hover:scale-110 transition-transform">
            <TrendingUp size={120} />
          </div>
        </div>

        {/* CARTE SANS RÉPONSE - DEVIENT UN BOUTON DE FILTRE */}
        <button 
          onClick={toggleUnansweredFilter}
          className={`p-8 rounded-[40px] border shadow-sm flex items-center gap-6 transition-all text-left w-full group relative overflow-hidden ${
            showUnansweredOnly 
            ? 'bg-orange-500 text-white border-orange-500 shadow-orange-200' 
            : 'bg-white border-gray-100 text-gray-900 hover:border-orange-200'
          }`}
        >
          <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center shrink-0 transition-colors ${
            showUnansweredOnly 
            ? 'bg-white/20 text-white' 
            : stats.unanswered > 0 ? 'bg-orange-50 text-orange-500 animate-pulse' : 'bg-green-50 text-green-500'
          }`}>
            <AlertCircle size={32} />
          </div>
          <div className="relative z-10">
            <h3 className="text-3xl font-black">{stats.unanswered}</h3>
            <p className={`text-[10px] font-black uppercase tracking-widest ${showUnansweredOnly ? 'text-white/80' : 'text-gray-400'}`}>Sans réponse</p>
          </div>
          {showUnansweredOnly && (
            <div className="absolute top-4 right-4 bg-white/20 p-1.5 rounded-full">
              <X size={14} />
            </div>
          )}
          <div className="absolute -bottom-2 -right-2 opacity-10 transform -rotate-12">
            <Reply size={80} />
          </div>
        </button>
      </div>

      {/* SECTION 2: FILTRES */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-2xl outline-none font-bold text-sm focus:ring-2 focus:ring-brand-blue/10 transition-all" 
            placeholder="Rechercher dans les avis..." 
          />
        </div>
        <div className="flex gap-2">
          {!showUnansweredOnly && [5, 4, 3, 2, 1].map(star => (
            <button 
              key={star}
              onClick={() => setRatingFilter(ratingFilter === star ? 'all' : star)}
              className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-all ${ratingFilter === star ? 'bg-brand-black text-yellow-400 border-brand-black shadow-lg' : 'bg-white text-gray-400 border-gray-100 hover:bg-gray-50'}`}
              title={`Filtrer par ${star} étoiles`}
            >
              <div className="flex flex-col items-center">
                <span className="text-[10px] font-black leading-none mb-0.5">{star}</span>
                <Star size={12} fill={ratingFilter === star ? "currentColor" : "none"} />
              </div>
            </button>
          ))}
          
          {(ratingFilter !== 'all' || showUnansweredOnly) && (
            <button 
              onClick={() => { setRatingFilter('all'); setShowUnansweredOnly(false); }} 
              className="px-6 h-12 bg-gray-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center gap-2 hover:bg-black transition-colors"
            >
              <X size={14} /> Effacer les filtres
            </button>
          )}
        </div>
      </div>

      {/* INDICATEUR DE MODE FOCUS */}
      {showUnansweredOnly && (
        <div className="bg-orange-50 border border-orange-100 p-4 rounded-2xl flex items-center justify-between animate-in slide-in-from-left-2">
           <div className="flex items-center gap-3 text-orange-700">
             <AlertCircle size={18} />
             <p className="text-xs font-bold uppercase tracking-tight">Mode Focus : Affichage des avis en attente de réponse uniquement</p>
           </div>
           <button onClick={() => setShowUnansweredOnly(false)} className="text-[10px] font-black text-orange-400 uppercase tracking-widest hover:text-orange-700">Tout afficher</button>
        </div>
      )}

      {/* SECTION 3: LISTE DES AVIS */}
      <div className="space-y-6">
        {filteredReviews.length > 0 ? filteredReviews.map(review => (
          <div key={review.id} className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden group transition-all hover:shadow-xl">
            <div className="p-8 md:p-10 flex flex-col md:flex-row gap-8">
              {/* Infos Gauche */}
              <div className="md:w-64 space-y-4 shrink-0 border-r border-gray-50 pr-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center font-black text-gray-400">{review.authorName?.charAt(0)}</div>
                  <div>
                    <p className="font-black text-gray-900 text-sm">{review.authorName}</p>
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">{review.date}</p>
                  </div>
                </div>
                <div className="flex gap-0.5 text-yellow-400">
                  {[...Array(5)].map((_, i) => <Star key={i} size={16} fill={i < review.rating ? "currentColor" : "none"} />)}
                </div>
                <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
                   <p className="text-[8px] font-black text-blue-400 uppercase tracking-widest mb-1">Formation concernée</p>
                   <p className="text-[10px] font-black text-blue-900 line-clamp-2">{review.courseTitle}</p>
                </div>
              </div>

              {/* Contenu Droite */}
              <div className="flex-1 flex flex-col">
                <div className="flex-1">
                   <p className="text-gray-700 leading-relaxed font-medium italic text-lg">"{review.comment}"</p>
                </div>

                {/* RÉPONSE DU CRÉATEUR */}
                {review.isReplied ? (
                  <div className="mt-8 p-6 bg-gray-900 text-white rounded-[32px] rounded-tl-none relative border border-white/5 animate-in slide-in-from-left-2 shadow-2xl">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-2">
                        <CheckCircle size={14} className="text-brand-blue" />
                        <span className="text-[9px] font-black text-brand-blue uppercase tracking-[0.2em]">Votre Réponse Officielle</span>
                      </div>
                      <button className="text-[8px] text-gray-500 font-bold uppercase hover:text-white transition-colors">Éditer</button>
                    </div>
                    <p className="text-gray-100 font-bold italic leading-relaxed">"{review.replyText}"</p>
                  </div>
                ) : (
                  replyMode?.reviewId === review.id ? (
                    <div className="mt-8 space-y-4 animate-in slide-in-from-top-2">
                       <textarea 
                         autoFocus
                         value={replyText}
                         onChange={(e) => setReplyText(e.target.value)}
                         placeholder="Répondez à votre élève avec bienveillance..."
                         className="w-full h-32 bg-gray-50 border border-gray-200 rounded-[24px] p-6 outline-none focus:border-brand-blue text-sm font-medium resize-none shadow-inner"
                       />
                       <div className="flex justify-end gap-3">
                          <button onClick={() => setReplyMode(null)} className="px-6 py-3 rounded-xl text-[10px] font-black uppercase text-gray-400 hover:bg-gray-50">Annuler</button>
                          <button 
                            onClick={handleSendReply}
                            className="bg-brand-black text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-xl hover:scale-105 transition-transform"
                          >
                            <Send size={14}/> Publier la réponse
                          </button>
                       </div>
                    </div>
                  ) : (
                    <button 
                      onClick={() => { setReplyMode({ courseId: review.courseId, reviewId: review.id }); setReplyText(''); }}
                      className="mt-6 flex items-center gap-2 text-[10px] font-black text-brand-blue uppercase tracking-[0.2em] hover:opacity-70 transition-all hover:translate-x-1"
                    >
                      <Reply size={14} /> Répondre à cet avis
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        )) : (
          <div className="bg-white p-32 rounded-[40px] border border-gray-100 shadow-sm text-center flex flex-col items-center justify-center">
             <div className="w-20 h-20 bg-gray-50 text-gray-200 rounded-full flex items-center justify-center mb-6">
                <Star size={48} />
             </div>
             <h3 className="text-2xl font-black text-gray-300 uppercase italic tracking-tighter">
               {showUnansweredOnly ? "Tous les avis ont été traités !" : "Aucun avis trouvé"}
             </h3>
             <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-2">
               {showUnansweredOnly ? "Félicitations, votre service client est impeccable." : "Dès que vos élèves laisseront des notes, elles apparaîtront ici."}
             </p>
             {showUnansweredOnly && (
               <button onClick={() => setShowUnansweredOnly(false)} className="mt-8 text-[10px] font-black text-brand-blue uppercase tracking-widest border-b-2 border-brand-blue pb-1">Voir tout l'historique</button>
             )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewsManager;

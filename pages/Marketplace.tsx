
import React, { useState, useMemo } from 'react';
import { ShoppingCart, Star, Video, Book, Search, Package, CheckCircle, Award, X, BadgeCheck, ExternalLink, ArrowRight, Clock, FileText, Globe, Users, Share2, Copy, Store, Layers, Tag, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { vendorProfiles } from '../services/mockData';
import { useData } from '../contexts/DataContext';
import { Course, VendorProfile } from '../types';
import PaymentModal from '../components/PaymentModal';
import SocialShare from '../components/SocialShare';

const Marketplace: React.FC = () => {
  const navigate = useNavigate();
  const { courses: allCourses, coupons } = useData();
  
  const courses = allCourses.filter(c => c.status === 'published');
  const [profiles] = useState<VendorProfile[]>(vendorProfiles);
  
  const [selectedProduct, setSelectedProduct] = useState<Course | null>(null);
  const [showProductDetail, setShowProductDetail] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [shareData, setShareData] = useState<{url: string, title: string, subtitle?: string} | null>(null);
  
  const [filterType, setFilterType] = useState<'all' | 'course' | 'ebook'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Helper pour trouver si une promo s'applique à un produit
  const getProductPromo = (courseId: string) => {
    return coupons.find(c => 
       c.isActive && 
       (!c.limitToProducts || c.selectedProductIds.includes(courseId)) &&
       (!c.isScheduled || (new Date(c.startDate!) <= new Date() && new Date(c.endDate!) >= new Date()))
    );
  };

  const handleProductClick = (product: Course) => {
    setSelectedProduct(product);
    setShowProductDetail(true);
  };

  const handleBuyClick = () => {
    setShowProductDetail(false);
    setShowPayment(true);
  };

  const filteredCourses = courses.filter(c => {
    const matchesType = filterType === 'all' || c.type === filterType;
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) || c.instructor.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header Premium */}
      <div className="bg-brand-black text-white p-10 md:p-16 rounded-[40px] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-brand-blue/30 to-transparent"></div>
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-brand-blue/10 rounded-full blur-[100px]"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="max-w-xl">
            <span className="inline-block px-5 py-2 bg-brand-blue text-[10px] font-black rounded-full mb-6 uppercase tracking-[0.2em] shadow-lg animate-glow-pulse border border-white/20">Catalogue Officiel Élite</span>
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter leading-tight italic uppercase mb-4">
              Investissez dans <br /><span className="text-brand-blue">l'Excellence.</span>
            </h1>
            <p className="text-gray-400 text-lg font-medium leading-relaxed">Accédez aux ressources stratégiques qui transformeront votre vision en résultats tangibles.</p>
          </div>
          
          <Link 
            to="/creator-studio"
            className="group flex items-center gap-6 bg-white text-brand-black p-8 rounded-[32px] font-black hover:scale-105 transition-all shadow-2xl"
          >
            <div className="text-left">
              <p className="text-[10px] text-gray-400 uppercase tracking-[0.3em] mb-1">Espace Vendeur</p>
              <p className="text-2xl italic tracking-tighter uppercase leading-none">Accéder au Studio</p>
            </div>
            <div className="w-12 h-12 bg-brand-gray rounded-2xl flex items-center justify-center group-hover:bg-brand-blue group-hover:text-white transition-all">
               <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </div>

      {/* Barre de Recherche et Filtres */}
      <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex flex-col lg:flex-row gap-6 sticky top-4 z-40">
        <div className="relative flex-1">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Rechercher une compétence, un auteur..." 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-14 pr-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-brand-blue/10 outline-none font-bold text-sm"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0 no-scrollbar">
          <button 
            onClick={() => setFilterType('all')}
            className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${filterType === 'all' ? 'bg-brand-black text-white shadow-xl' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
          >
            Tout voir
          </button>
          <button 
            onClick={() => setFilterType('course')}
            className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all flex items-center gap-2 ${filterType === 'course' ? 'bg-brand-blue text-white shadow-xl shadow-blue-500/20' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
          >
            <Video size={14} /> Formations
          </button>
          <button 
            onClick={() => setFilterType('ebook')}
            className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all flex items-center gap-2 ${filterType === 'ebook' ? 'bg-green-600 text-white shadow-xl shadow-green-500/20' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
          >
            <Book size={14} /> E-Books
          </button>
        </div>
      </div>

      {/* Grille de Produits */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredCourses.map(product => {
            const vendor = profiles.find(p => p.id === product.instructorId);
            const promo = getProductPromo(product.id);

            return (
          <div 
            key={product.id} 
            onClick={() => handleProductClick(product)}
            className="bg-white rounded-[40px] shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 flex flex-col group h-full relative cursor-pointer hover:-translate-y-2"
          >
            <div className="relative overflow-hidden h-56 rounded-t-[40px]">
              <img src={product.image} alt={product.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
              <div className="absolute top-4 left-4 bg-brand-black/80 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border border-white/10 flex items-center gap-1.5">
                {product.type === 'ebook' ? <Book size={12} /> : <Video size={12} />}
                {product.type === 'ebook' ? 'E-Book' : 'Formation'}
              </div>
              
              {/* BADGE PROMO DYNAMIQUE */}
              {promo && (
                <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl animate-pulse flex items-center gap-2 border border-white/20">
                  <Sparkles size={12}/> OFFRE -{promo.discountValue}{promo.type === 'percentage' ? '%' : '$'}
                </div>
              )}

              {product.modules && product.modules.length > 0 && (
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur text-brand-black px-2 py-1 rounded-lg text-[9px] font-black shadow-lg uppercase tracking-tighter">
                   {product.modules.length} Modules
                </div>
              )}
            </div>

            <div className="p-8 flex-1 flex flex-col">
              <div className="flex justify-between items-center mb-4">
                 <span className="text-[10px] font-black text-brand-blue uppercase tracking-[0.2em]">{product.category}</span>
                 <div className="flex items-center gap-1 bg-yellow-50 px-2 py-0.5 rounded text-yellow-600 text-[10px] font-black">
                    <Star size={12} fill="currentColor" />
                    <span>{product.rating > 0 ? product.rating : 'Nouveau'}</span>
                 </div>
              </div>

              <h3 className="font-black text-xl text-gray-900 mb-4 leading-tight group-hover:text-brand-blue transition-colors line-clamp-2 italic tracking-tighter" title={product.title}>{product.title}</h3>
              
              <div className="flex items-center gap-2 mb-6">
                <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-[8px] font-black text-gray-400 overflow-hidden">
                   {vendor?.logoUrl ? <img src={vendor.logoUrl} className="w-full h-full object-cover" /> : product.instructor.charAt(0)}
                </div>
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest flex items-center gap-1 truncate">
                  {product.instructor}
                  {vendor?.isVerified && <BadgeCheck size={12} className="text-blue-500" fill="currentColor" color="white" />}
                </span>
              </div>
      
              <div className="mt-auto flex items-center justify-between pt-6 border-t border-gray-50">
                <div className="flex flex-col">
                   {promo ? (
                     <>
                        <span className="text-[10px] text-gray-400 line-through font-bold">{product.price.toLocaleString()} F</span>
                        <span className="text-xl font-black text-red-600">
                           {promo.type === 'percentage' 
                             ? (product.price * (1 - promo.discountValue/100)).toLocaleString() 
                             : (product.price - promo.discountValue).toLocaleString()} F
                        </span>
                     </>
                   ) : (
                     <span className="text-xl font-black text-gray-900">{product.price.toLocaleString()} F</span>
                   )}
                </div>
                <button className="w-12 h-12 bg-brand-black text-white rounded-2xl flex items-center justify-center hover:bg-brand-blue transition-all shadow-xl group/btn">
                  <ShoppingCart size={20} className="group-hover/btn:scale-110 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        );})}
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-32 bg-white rounded-[40px] border border-gray-100 shadow-sm">
          <Package size={48} className="mx-auto mb-6 text-gray-200" />
          <h3 className="text-2xl font-black text-gray-300 uppercase italic tracking-tighter">Aucun produit trouvé</h3>
          <button onClick={() => setSearchQuery('')} className="mt-6 text-brand-blue font-black uppercase tracking-widest border-b-2 border-brand-blue pb-1">Effacer la recherche</button>
        </div>
      )}

      {showPayment && selectedProduct && (
        <PaymentModal 
          amount={selectedProduct.price}
          productName={selectedProduct.title}
          onClose={() => setShowPayment(false)}
          onSuccess={() => {
            setShowPayment(false);
            setSelectedProduct(null);
            alert("Accès débloqué !");
          }}
        />
      )}

      {showProductDetail && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[40px] w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-2xl relative flex flex-col md:flex-row">
            <button onClick={() => setShowProductDetail(false)} className="absolute top-6 right-6 bg-white/90 p-2 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors z-20 shadow-lg">
              <X size={24} />
            </button>

            <div className="w-full md:w-5/12 bg-gray-50 flex flex-col relative">
              <img src={selectedProduct.image} alt={selectedProduct.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-10">
                 <div className="flex items-center gap-3 mb-4">
                    {getProductPromo(selectedProduct.id) && (
                       <span className="bg-red-600 text-white px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl animate-bounce">
                         Offre Limitée
                       </span>
                    )}
                 </div>
                 <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-2">{selectedProduct.title}</h2>
              </div>
            </div>

            <div className="w-full md:w-7/12 p-10 md:p-16 overflow-y-auto custom-scrollbar flex flex-col">
              <div className="flex-1">
                <span className="text-[10px] font-black text-brand-blue tracking-[0.3em] uppercase mb-4 block">{selectedProduct.category}</span>
                <p className="text-gray-600 leading-relaxed text-lg mb-10 font-medium">{selectedProduct.description}</p>
                
                <div className="grid grid-cols-2 gap-6 mb-12">
                   <div className="p-6 bg-gray-50 rounded-[32px] border border-gray-100">
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Inscrits</p>
                      <p className="text-2xl font-black text-gray-900">{selectedProduct.students}</p>
                   </div>
                   <div className="p-6 bg-gray-50 rounded-[32px] border border-gray-100">
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Évaluation</p>
                      <p className="text-2xl font-black text-yellow-500">{selectedProduct.rating}/5</p>
                   </div>
                </div>
              </div>

              <div className="pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center gap-8">
                 <div className="text-center sm:text-left">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total investissement</p>
                    <p className="text-4xl font-black text-gray-900">{selectedProduct.price.toLocaleString()} F</p>
                 </div>
                 <button 
                    onClick={handleBuyClick}
                    className="flex-1 w-full sm:w-auto py-5 bg-brand-black text-white rounded-[24px] font-black uppercase tracking-[0.2em] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                 >
                   <ShoppingCart size={22} /> Débloquer l'accès
                 </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Marketplace;

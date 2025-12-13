
import React, { useState } from 'react';
import { ShoppingCart, Star, Video, Book, Search, Package, CheckCircle, Award, X, BadgeCheck, ExternalLink, ArrowRight, Clock, FileText, Globe, Users, Share2, Copy, Store, Layers } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { courses as initialCourses, vendorProfiles as initialProfiles, currentUser } from '../services/mockData';
import { Course, VendorProfile, Review } from '../types';
import PaymentModal from '../components/PaymentModal';
import SocialShare from '../components/SocialShare';

const Marketplace: React.FC = () => {
  const navigate = useNavigate();
  // Filter out non-published courses for the public
  const [courses, setCourses] = useState<Course[]>(initialCourses.filter(c => c.status === 'published'));
  const [profiles] = useState<VendorProfile[]>(initialProfiles);
  
  // Selection States
  const [selectedProduct, setSelectedProduct] = useState<Course | null>(null);
  const [showProductDetail, setShowProductDetail] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<VendorProfile | null>(null);
  
  // Sharing State
  const [shareData, setShareData] = useState<{url: string, title: string, subtitle?: string} | null>(null);
  
  // Filters
  const [filterType, setFilterType] = useState<'all' | 'course' | 'ebook'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const handleProductClick = (product: Course) => {
    setSelectedProduct(product);
    setShowProductDetail(true);
  };

  const handleBuyClick = () => {
    setShowProductDetail(false);
    setShowPayment(true);
  };

  const handlePaymentSuccess = () => {
    setShowPayment(false);
    setSelectedProduct(null);
  };

  const handleShareProduct = (e: React.MouseEvent, product: Course) => {
    e.stopPropagation();
    const url = `${window.location.origin}/#/courses/${product.id}`;
    setShareData({
      url,
      title: product.title,
      subtitle: 'Partager cette formation'
    });
  };

  const handleShareShop = (e: React.MouseEvent, vendorId: string) => {
    e.stopPropagation();
    const vendor = profiles.find(p => p.id === vendorId);
    const url = `${window.location.origin}/#/shop/${vendorId}`;
    setShareData({
      url,
      title: vendor?.shopName || 'Boutique Vendeur',
      subtitle: 'Partager cette boutique'
    });
  };

  const filteredCourses = courses.filter(c => {
    const matchesType = filterType === 'all' || c.type === filterType;
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) || c.instructor.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const getVendorCourses = (vendorId: string) => courses.filter(c => c.instructorId === vendorId);

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header & Mode Switch */}
      <div className="bg-brand-black text-white p-8 rounded-2xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-900/50 to-transparent"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <span className="inline-block px-3 py-1 bg-brand-blue text-xs font-bold rounded-full mb-3 uppercase tracking-wider">Catalogue Officiel</span>
            <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2">Marketplace Élite</h1>
            <p className="text-gray-400 max-w-lg">Accédez aux meilleures formations et ressources pour propulser votre business au niveau supérieur.</p>
          </div>
          
          <Link 
            to="/creator-studio"
            className="group flex items-center gap-3 bg-white text-brand-black px-6 py-4 rounded-xl font-bold hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <div className="text-left">
              <p className="text-xs text-gray-500 uppercase tracking-wider">Espace Vendeur</p>
              <p className="text-lg">Accéder au Studio</p>
            </div>
            <ArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 sticky top-0 bg-brand-gray/95 backdrop-blur z-30 py-4 border-b border-gray-200">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Rechercher une compétence, un auteur..." 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue shadow-sm"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
          <button 
            onClick={() => setFilterType('all')}
            className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${filterType === 'all' ? 'bg-brand-black text-white' : 'bg-white text-gray-600 border border-gray-200'}`}
          >
            Tout voir
          </button>
          <button 
            onClick={() => setFilterType('course')}
            className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors flex items-center gap-2 ${filterType === 'course' ? 'bg-brand-blue text-white' : 'bg-white text-gray-600 border border-gray-200'}`}
          >
            <Video size={16} /> Formations
          </button>
          <button 
            onClick={() => setFilterType('ebook')}
            className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors flex items-center gap-2 ${filterType === 'ebook' ? 'bg-brand-green text-white' : 'bg-white text-gray-600 border border-gray-200'}`}
          >
            <Book size={16} /> E-Books
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredCourses.map(product => {
            const vendor = profiles.find(p => p.id === product.instructorId);
            return (
          <div 
            key={product.id} 
            onClick={() => handleProductClick(product)}
            className={`bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col group h-full relative cursor-pointer ${product.type === 'ebook' ? 'max-w-xs mx-auto w-full' : ''}`}
          >
            <div className={`relative overflow-hidden ${product.type === 'ebook' ? 'aspect-[2/3]' : 'h-48'} rounded-t-xl`}>
              <img src={product.image} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute top-3 left-3 bg-brand-black/80 backdrop-blur text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                {product.type === 'ebook' ? <Book size={12} /> : <Video size={12} />}
                {product.type === 'ebook' ? 'E-Book' : 'Formation'}
              </div>
              
              {/* Hosted Content Badge */}
              {product.modules && product.modules.length > 0 && (
                <div className="absolute top-3 right-3 bg-brand-blue/90 backdrop-blur text-white px-2 py-1 rounded text-xs font-bold shadow-lg flex items-center gap-1">
                  <Layers size={10} /> {product.modules.length} Modules
                </div>
              )}

              {product.promoPrice && (
                <div className="absolute bottom-3 right-3 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                  Promo
                </div>
              )}
            </div>
            <div className="p-5 flex-1 flex flex-col">
              {/* Category & Rating */}
              <div className="flex justify-between items-center mb-2">
                 <span className="text-xs font-bold text-brand-blue uppercase tracking-wider">{product.category}</span>
                 <div className="flex items-center gap-1 bg-yellow-50 px-2 py-0.5 rounded text-yellow-600 text-xs font-bold">
                    <Star size={12} fill="currentColor" />
                    <span>{product.rating > 0 ? product.rating : 'N/A'}</span>
                    <span className="text-gray-400 font-normal">({product.reviews?.length || 0} avis)</span>
                 </div>
              </div>

              <h3 className="font-bold text-lg text-brand-black mb-1 leading-snug group-hover:text-brand-blue transition-colors line-clamp-2" title={product.title}>{product.title}</h3>
              
              <div className="flex justify-between items-center mb-3">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    if (vendor) setSelectedVendor(vendor);
                  }}
                  className="text-sm text-gray-500 hover:text-brand-blue hover:underline text-left flex items-center gap-1 truncate"
                >
                  <span className="truncate">Par {product.instructor}</span>
                  {vendor?.isVerified && <BadgeCheck size={14} className="text-blue-500 shrink-0" fill="currentColor" color="white" />}
                </button>
              </div>
      
              <p className="text-gray-600 text-sm line-clamp-2 mb-4 flex-1">{product.shortDescription || product.description}</p>
              
              <div className="flex items-center justify-between pt-4 border-t border-gray-50 mt-auto">
                <div className="flex flex-col">
                   {product.promoPrice ? (
                     <>
                        <span className="text-xs text-gray-400 line-through">{product.price.toLocaleString()} F</span>
                        <span className="text-xl font-bold text-red-600">{product.promoPrice.toLocaleString()} F</span>
                     </>
                   ) : (
                     <span className="text-xl font-bold text-brand-blue">{product.price.toLocaleString()} F</span>
                   )}
                </div>
                <button className="px-4 py-2 bg-brand-black text-white text-sm font-bold rounded-lg hover:bg-gray-800 transition-colors shadow-lg shadow-gray-900/10 flex items-center gap-2">
                  <ShoppingCart size={16} /> Détails
                </button>
              </div>
            </div>
          </div>
        );})}
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-20 text-gray-500">
          <Package size={48} className="mx-auto mb-4 opacity-50" />
          <p>Aucun produit trouvé pour cette recherche.</p>
        </div>
      )}

      {/* --- PAYMENT MODAL --- */}
      {showPayment && selectedProduct && (
        <PaymentModal 
          amount={selectedProduct.promoPrice || selectedProduct.price}
          productName={selectedProduct.title}
          onClose={() => setShowPayment(false)}
          onSuccess={handlePaymentSuccess}
        />
      )}

      {/* --- SOCIAL SHARE MODAL --- */}
      {shareData && (
        <SocialShare 
          url={shareData.url}
          title={shareData.title}
          subtitle={shareData.subtitle}
          onClose={() => setShareData(null)}
        />
      )}

      {/* --- PRODUCT DETAIL MODAL --- */}
      {showProductDetail && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[95vh] overflow-y-auto shadow-2xl relative flex flex-col md:flex-row overflow-hidden">
            <button 
              onClick={() => setShowProductDetail(false)}
              className="absolute top-4 right-4 bg-gray-100 p-2 rounded-full hover:bg-gray-200 transition-colors z-20"
            >
              <X size={20} />
            </button>

            {/* Left: Image & Sticky Action */}
            <div className="w-full md:w-5/12 bg-gray-50 p-6 flex flex-col border-r border-gray-100">
              <img src={selectedProduct.image} alt={selectedProduct.title} className="w-full h-auto object-cover rounded-lg shadow-md mb-6" />
              
              <div className="mt-auto bg-white p-6 rounded-xl border border-gray-200 shadow-sm sticky bottom-0">
                 <h2 className="font-bold text-brand-black mb-4">Investissez dans votre avenir</h2>
                 <div className="flex items-center gap-3 mb-6">
                    {selectedProduct.promoPrice ? (
                      <>
                        <span className="text-gray-400 line-through text-lg">{selectedProduct.price.toLocaleString()} F</span>
                        <span className="text-red-600 font-bold text-3xl">{selectedProduct.promoPrice.toLocaleString()} F</span>
                      </>
                    ) : (
                      <p className="text-brand-blue font-bold text-3xl">{selectedProduct.price.toLocaleString()} F</p>
                    )}
                 </div>
                 <button 
                    onClick={handleBuyClick}
                    className="w-full py-4 bg-brand-black text-white font-bold rounded-xl hover:bg-gray-800 transition-colors flex justify-center items-center gap-2 shadow-xl"
                 >
                   <ShoppingCart size={20} /> Accéder Maintenant
                 </button>
                 <p className="text-center text-xs text-gray-400 mt-4 flex items-center justify-center gap-1">
                   <CheckCircle size={12} /> Garantie satisfait ou remboursé 30j
                 </p>
              </div>
            </div>

            {/* Right: Rich Details & Modules */}
            <div className="w-full md:w-7/12 p-8 overflow-y-auto">
              <div className="mb-8">
                <div className="flex justify-between items-start">
                   <span className="text-brand-blue font-bold text-sm tracking-wider uppercase mb-2 block">{selectedProduct.category}</span>
                </div>
                
                <h2 className="text-3xl font-bold text-brand-black mb-4 leading-tight">{selectedProduct.title}</h2>
                <div className="flex items-center gap-4 mb-6 text-sm text-gray-500">
                  <div className="flex items-center gap-1"><Clock size={16} /> Durée estimée: 4h</div>
                  <div className="flex items-center gap-1"><Users size={16} /> {selectedProduct.students} étudiants</div>
                  {selectedProduct.hasCertificate && <div className="flex items-center gap-1 text-green-600"><Award size={16} /> Certificat inclus</div>}
                </div>
                
                <p className="text-gray-600 leading-relaxed text-lg mb-6 whitespace-pre-line">{selectedProduct.description}</p>
              </div>

              {selectedProduct.type === 'course' && selectedProduct.modules && selectedProduct.modules.length > 0 && (
                 <div className="mb-8">
                   <h3 className="font-bold text-lg border-b border-gray-100 pb-2 mb-4 flex justify-between items-center">
                     Programme de la formation
                     <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded font-bold">{selectedProduct.modules.length} Modules</span>
                   </h3>
                   <div className="space-y-3">
                      {selectedProduct.modules.map((mod, idx) => (
                        <div key={mod.id} className="border border-gray-100 rounded-lg overflow-hidden">
                           <div className="bg-gray-50 p-4 font-bold text-gray-800 flex justify-between items-center">
                             <span>Module {idx + 1} : {mod.title}</span>
                             <span className="text-gray-400 font-normal text-sm">{mod.lessons.length} leçons</span>
                           </div>
                           <div className="bg-white p-4 space-y-2">
                             {mod.lessons.map(l => (
                               <div key={l.id} className="flex items-center gap-3 text-sm text-gray-600">
                                 {l.type === 'video' ? <Video size={14} className="text-brand-blue" /> : l.type === 'pdf' ? <FileText size={14} className="text-red-500" /> : <Book size={14} />}
                                 <span className="flex-1">{l.title}</span>
                                 {l.duration && <span className="text-xs text-gray-400">{l.duration}</span>}
                               </div>
                             ))}
                           </div>
                        </div>
                      ))}
                   </div>
                 </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Marketplace;

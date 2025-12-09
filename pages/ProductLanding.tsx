
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, Star, CheckCircle, Clock, Users, Award, Shield, ChevronDown, Play, FileText, Lock } from 'lucide-react';
import { courses, vendorProfiles } from '../services/mockData';
import { Course, VendorProfile } from '../types';
import PaymentModal from '../components/PaymentModal';
import Footer from '../components/Footer';

const ProductLanding: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [vendor, setVendor] = useState<VendorProfile | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [activeModule, setActiveModule] = useState<string | null>(null);

  useEffect(() => {
    // Scroll to top on load
    window.scrollTo(0, 0);

    const foundCourse = courses.find(c => c.id === id);
    if (foundCourse) {
      setCourse(foundCourse);
      const foundVendor = vendorProfiles.find(v => v.id === foundCourse.instructorId);
      setVendor(foundVendor || null);

      // --- FACEBOOK PIXEL: VIEW CONTENT ---
      // Simulate Pixel Event
      if (foundVendor?.facebookPixelId) {
        console.log(`[FB PIXEL] Firing ViewContent for Pixel ID: ${foundVendor.facebookPixelId}`);
        console.log(`[FB PIXEL] Content ID: ${foundCourse.id}, Value: ${foundCourse.promoPrice || foundCourse.price}`);
      }
    }
  }, [id]);

  const handleBuy = () => {
    if (vendor?.facebookPixelId) {
      console.log(`[FB PIXEL] Firing InitiateCheckout for Pixel ID: ${vendor.facebookPixelId}`);
    }
    setShowPayment(true);
  };

  const toggleModule = (modId: string) => {
    setActiveModule(activeModule === modId ? null : modId);
  };

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Produit non trouvé</h2>
          <Link to="/courses" className="text-brand-blue hover:underline">Retour au catalogue</Link>
        </div>
      </div>
    );
  }

  const discount = course.promoPrice 
    ? Math.round(((course.price - course.promoPrice) / course.price) * 100) 
    : 0;

  // Theme Handling
  const primaryColor = vendor?.themeConfig?.primaryColor || '#2563eb'; // Default Blue
  const themeStyle = vendor?.themeConfig?.style || 'modern';
  
  const buttonRadius = themeStyle === 'minimalist' ? '0px' : '12px';
  const fontStyle = themeStyle === 'bold' ? 'font-serif' : 'font-sans';

  return (
    <div className={`bg-white min-h-screen ${fontStyle}`}>
      {/* 1. ANNONCE BAR */}
      <div className="text-white text-center py-2 text-xs font-bold tracking-wide" style={{backgroundColor: '#000000'}}>
        ⚡ OFFRE LIMITÉE : -{discount}% AUJOURD'HUI SEULEMENT ⚡
      </div>

      {/* 2. HERO SECTION */}
      <header className="relative bg-gradient-to-b from-gray-50 to-white pt-8 pb-12 lg:pt-16 lg:pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Text Side */}
            <div className="order-2 lg:order-1 space-y-6">
              <div 
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
                style={{backgroundColor: `${primaryColor}20`, color: primaryColor}}
              >
                <Award size={14} /> Formation Certifiante
              </div>
              <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight">
                {course.title}
              </h1>
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
                {course.shortDescription || course.description?.substring(0, 150) + "..."}
              </p>
              
              {/* Trust Badges */}
              <div className="flex flex-wrap gap-4 text-sm font-medium text-gray-700">
                <div className="flex items-center gap-1"><Users size={16} style={{color: primaryColor}} /> {course.students} Étudiants</div>
                <div className="flex items-center gap-1"><Star size={16} className="text-yellow-400" fill="currentColor" /> {course.rating}/5</div>
                <div className="flex items-center gap-1"><Clock size={16} className="text-gray-400" /> Accès à vie</div>
              </div>

              {/* Pricing & CTA */}
              <div className="pt-4">
                <div className="flex items-end gap-3 mb-6">
                  {course.promoPrice ? (
                    <>
                      <span className="text-4xl font-extrabold text-red-600">{course.promoPrice.toLocaleString()} F</span>
                      <span className="text-xl text-gray-400 line-through decoration-2 decoration-red-400 mb-1">{course.price.toLocaleString()} F</span>
                    </>
                  ) : (
                    <span className="text-4xl font-extrabold text-brand-black">{course.price.toLocaleString()} F</span>
                  )}
                </div>
                <button 
                  onClick={handleBuy}
                  className="w-full md:w-auto text-white text-lg font-bold px-8 py-4 shadow-xl transform hover:scale-105 transition-all flex items-center justify-center gap-2 animate-pulse"
                  style={{backgroundColor: primaryColor, borderRadius: buttonRadius, boxShadow: `0 10px 15px -3px ${primaryColor}50`}}
                >
                  <ShoppingCart size={22} /> OBTENIR MAINTENANT
                </button>
                <p className="text-xs text-gray-500 mt-3 flex items-center gap-1">
                  <Shield size={12} /> Paiement 100% Sécurisé • Satisfait ou Remboursé 30J
                </p>
              </div>
            </div>

            {/* Image Side */}
            <div className="order-1 lg:order-2 relative">
              <div className="relative overflow-hidden shadow-2xl border-4 border-white transform rotate-2 hover:rotate-0 transition-transform duration-500" style={{borderRadius: buttonRadius}}>
                <img src={course.image} alt={course.title} className="w-full h-auto object-cover" />
                {course.type === 'video' && (
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center shadow-lg backdrop-blur cursor-pointer">
                      <Play size={30} style={{color: primaryColor}} fill="currentColor" />
                    </div>
                  </div>
                )}
                <div className="absolute top-4 right-4 bg-red-600 text-white font-bold px-3 py-1 rounded shadow-lg">
                  -{discount}%
                </div>
              </div>
              {/* Floating element */}
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-xl border border-gray-100 hidden md:flex items-center gap-3 animate-bounce">
                <div className="flex -space-x-2">
                  {[1,2,3].map(i => (
                    <img key={i} src={`https://picsum.photos/50/50?random=${i+20}`} className="w-8 h-8 rounded-full border-2 border-white" />
                  ))}
                </div>
                <div className="text-xs font-bold">
                  <span className="block" style={{color: primaryColor}}>+15 personnes</span>
                  ont rejoint cette semaine
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 3. VENDOR & PROMISE */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="uppercase tracking-widest text-gray-400 font-bold text-xs mb-6">UNE FORMATION PROPOSÉE PAR</p>
          <div className="flex items-center justify-center gap-4 mb-8">
            <img src={vendor?.logoUrl || "https://via.placeholder.com/50"} className="w-16 h-16 rounded-full border-2 border-gray-100 p-1" />
            <div className="text-left">
              <h3 className="font-bold text-xl text-gray-900">{vendor?.shopName || course.instructor}</h3>
              <p className="text-sm text-gray-500">{vendor?.isVerified ? 'Vendeur Vérifié ☑' : 'Instructeur'}</p>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-4 bg-gray-50 rounded-xl">
              <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-3" />
              <h4 className="font-bold mb-1">Qualité Garantie</h4>
              <p className="text-sm text-gray-500">Contenu vérifié et approuvé par les experts.</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <Lock className="w-8 h-8 mx-auto mb-3" style={{color: primaryColor}} />
              <h4 className="font-bold mb-1">Accès Sécurisé</h4>
              <p className="text-sm text-gray-500">Plateforme privée disponible 24/7.</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <Star className="w-8 h-8 text-yellow-500 mx-auto mb-3" />
              <h4 className="font-bold mb-1">Support Dédié</h4>
              <p className="text-sm text-gray-500">Réponses à toutes vos questions.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. DESCRIPTION & CURRICULUM */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 grid md:grid-cols-3 gap-12">
          <div className="md:col-span-2 space-y-12">
            
            {/* Description */}
            <div>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <FileText style={{color: primaryColor}} /> Description du programme
              </h2>
              <div className="prose prose-blue text-gray-600 leading-relaxed whitespace-pre-line">
                {course.description}
              </div>
            </div>

            {/* Modules */}
            {course.modules && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Programme de la formation</h2>
                <div className="space-y-3">
                  {course.modules.map((mod, idx) => (
                    <div key={mod.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                      <button 
                        onClick={() => toggleModule(mod.id)}
                        className="w-full flex justify-between items-center p-4 bg-white hover:bg-gray-50 transition-colors text-left"
                      >
                        <span className="font-bold text-gray-800">Module {idx + 1} : {mod.title}</span>
                        <ChevronDown size={20} className={`transform transition-transform ${activeModule === mod.id ? 'rotate-180' : ''}`} />
                      </button>
                      {activeModule === mod.id && (
                        <div className="p-4 bg-gray-50 border-t border-gray-100 space-y-2">
                          {mod.lessons.map(lesson => (
                            <div key={lesson.id} className="flex items-center gap-3 text-sm text-gray-600 pl-4 border-l-2" style={{borderColor: `${primaryColor}40`}}>
                              {lesson.type === 'video' ? <Play size={14} /> : <FileText size={14} />}
                              <span>{lesson.title}</span>
                              {lesson.duration && <span className="text-gray-400 ml-auto">{lesson.duration}</span>}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sticky Sidebar on Desktop */}
          <div className="relative">
            <div className="sticky top-24 bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
              <h3 className="font-bold text-xl mb-4 text-center">Récapitulatif</h3>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle size={16} className="text-green-500" /> Accès immédiat
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600">
                   <CheckCircle size={16} className="text-green-500" /> {course.modules?.length || 5} Modules complets
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600">
                   <CheckCircle size={16} className="text-green-500" /> Ressources téléchargeables
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600">
                   <CheckCircle size={16} className="text-green-500" /> Certificat de fin de formation
                </li>
              </ul>
              
              <div className="text-center mb-6">
                 <p className="text-3xl font-extrabold text-red-600">{course.promoPrice ? course.promoPrice.toLocaleString() : course.price.toLocaleString()} F</p>
                 {course.promoPrice && <p className="text-sm text-gray-400 line-through">au lieu de {course.price.toLocaleString()} F</p>}
              </div>

              <button 
                onClick={handleBuy}
                className="w-full text-white py-4 font-bold transition-colors shadow-lg"
                style={{backgroundColor: primaryColor, borderRadius: buttonRadius}}
              >
                JE VEUX CETTE FORMATION
              </button>
              
              <div className="flex justify-center gap-2 mt-4 grayscale opacity-50">
                 <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" className="h-4" />
                 <img src="https://upload.wikimedia.org/wikipedia/commons/d/d6/Visa_2021.svg" className="h-4" />
                 <img src="https://upload.wikimedia.org/wikipedia/commons/a/a4/Mastercard_2019_logo.svg" className="h-4" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. REVIEWS / SOCIAL PROOF */}
      {course.reviews && course.reviews.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl font-bold mb-8 text-center">Ce que disent nos étudiants</h2>
            <div className="grid md:grid-cols-2 gap-6">
               {course.reviews.map(review => (
                 <div key={review.id} className="p-6 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="flex items-center gap-1 text-yellow-400 mb-3">
                      {[...Array(5)].map((_, i) => <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} />)}
                    </div>
                    <p className="text-gray-700 italic mb-4">"{review.comment}"</p>
                    <div className="flex items-center gap-3">
                      <img src={review.userAvatar} className="w-10 h-10 rounded-full" />
                      <div>
                        <p className="font-bold text-sm">{review.userName}</p>
                        <p className="text-xs text-gray-400">Étudiant vérifié</p>
                      </div>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        </section>
      )}

      {/* 6. MOBILE STICKY CTA */}
      <div className="lg:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-4 z-50 flex items-center justify-between shadow-[0_-5px_15px_rgba(0,0,0,0.1)]">
        <div>
           <p className="text-xs text-gray-500 uppercase font-bold">Total à payer</p>
           <p className="text-xl font-extrabold text-brand-black">{course.promoPrice ? course.promoPrice.toLocaleString() : course.price.toLocaleString()} F</p>
        </div>
        <button 
          onClick={handleBuy}
          className="text-white px-8 py-3 font-bold shadow-lg"
          style={{backgroundColor: primaryColor, borderRadius: buttonRadius}}
        >
          ACHETER
        </button>
      </div>
      
      {/* Footer Minimal for Landing Page */}
      <footer className="bg-brand-black text-white py-8 text-center text-sm text-gray-500">
        <p className="mb-4">© {new Date().getFullYear()} KADJOLO BASILE. Tous droits réservés.</p>
        <div className="flex justify-center gap-4">
          <Link to="/privacy" className="hover:text-white">Politique de Confidentialité</Link>
          <Link to="/terms" className="hover:text-white">CGV</Link>
          <Link to="/legal" className="hover:text-white">Mentions Légales</Link>
        </div>
      </footer>

      {showPayment && (
        <PaymentModal 
          amount={course.promoPrice || course.price}
          productName={course.title}
          onClose={() => setShowPayment(false)}
          onSuccess={() => {
             // FIRE PURCHASE PIXEL
             if (vendor?.facebookPixelId) {
                console.log(`[FB PIXEL] Firing Purchase for Pixel ID: ${vendor.facebookPixelId}, Value: ${course.promoPrice || course.price}`);
             }
             alert("Paiement réussi ! Vous avez reçu un email.");
             setShowPayment(false);
          }}
        />
      )}
    </div>
  );
};

export default ProductLanding;

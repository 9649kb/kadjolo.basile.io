

import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, Star, CheckCircle, Clock, Users, Award, Shield, ChevronDown, Play, FileText, Lock, Share2, Facebook, ExternalLink, Link as LinkIcon, Copy } from 'lucide-react';
import { courses, vendorProfiles } from '../services/mockData';
import { Course, VendorProfile } from '../types';
import PaymentModal from '../components/PaymentModal';
import SocialShare from '../components/SocialShare';

const ProductLanding: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [vendor, setVendor] = useState<VendorProfile | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [showShare, setShowShare] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);

    const foundCourse = courses.find(c => c.id === id);
    if (foundCourse) {
      setCourse(foundCourse);
      const foundVendor = vendorProfiles.find(v => v.id === foundCourse.instructorId);
      setVendor(foundVendor || null);

      // --- FACEBOOK PIXEL: VIEW CONTENT ---
      // Real-world implementation would utilize window.fbq
      if (foundVendor?.facebookPixelId) {
        console.log(`%c[FB PIXEL] Event: ViewContent | Pixel ID: ${foundVendor.facebookPixelId}`, 'color: #3b5998; font-weight: bold;');
      }
    }
  }, [id]);

  const handleBuy = () => {
    // Check if External Sales Page (Redirect immediately)
    if (course?.hostingMode === 'external' && course.externalSalesPageUrl) {
       console.log(`[REDIRECT] Redirecting to external sales page: ${course.externalSalesPageUrl}`);
       // Pixel Track InitiateCheckout before redirect
       if (vendor?.facebookPixelId) {
         console.log(`%c[FB PIXEL] Event: InitiateCheckout (External) | Pixel ID: ${vendor.facebookPixelId}`, 'color: #3b5998; font-weight: bold;');
       }
       window.open(course.externalSalesPageUrl, '_blank');
       return;
    }

    // Standard Platform Checkout
    if (vendor?.facebookPixelId) {
      console.log(`%c[FB PIXEL] Event: InitiateCheckout | Pixel ID: ${vendor.facebookPixelId}`, 'color: #3b5998; font-weight: bold;');
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
  const primaryColor = vendor?.themeConfig?.primaryColor || '#2563eb'; 
  const themeStyle = vendor?.themeConfig?.style || 'modern';
  
  const buttonRadius = themeStyle === 'minimalist' ? '0px' : '12px';
  const fontStyle = themeStyle === 'bold' ? 'font-serif' : 'font-sans';

  return (
    <div className={`bg-white min-h-screen ${fontStyle}`}>
      {/* 1. ANNONCE BAR */}
      <div className="text-white text-center py-2 text-xs font-bold tracking-wide" style={{backgroundColor: '#000000'}}>
        ⚡ OFFRE SPÉCIALE : ACCÈS IMMÉDIAT & SÉCURISÉ ⚡
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
                <Award size={14} /> Formation Vérifiée
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
                <div className="flex items-center gap-1"><Shield size={16} className="text-green-600" /> Garantie 30 Jours</div>
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
                <div className="flex flex-col sm:flex-row gap-4">
                  <button 
                    onClick={handleBuy}
                    className="w-full md:w-auto text-white text-lg font-bold px-8 py-4 shadow-xl transform hover:scale-105 transition-all flex items-center justify-center gap-2 animate-pulse"
                    style={{backgroundColor: primaryColor, borderRadius: buttonRadius, boxShadow: `0 10px 15px -3px ${primaryColor}50`}}
                  >
                    {course.hostingMode === 'external' ? (
                        <>VOIR LA PAGE DE VENTE <ExternalLink size={22} /></>
                    ) : (
                        <>OBTENIR MAINTENANT <ShoppingCart size={22} /></>
                    )}
                  </button>
                  <button 
                    onClick={() => setShowShare(true)}
                    className="w-full md:w-auto bg-white border border-gray-200 text-gray-700 text-lg font-bold px-8 py-4 flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
                    style={{borderRadius: buttonRadius}}
                  >
                    <Share2 size={22} /> Partager
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-3 flex items-center gap-1">
                  <Lock size={12} /> Paiement crypté SSL • Accès à vie
                </p>
              </div>
            </div>

            {/* Image Side */}
            <div className="order-1 lg:order-2 relative">
              <div className="relative overflow-hidden shadow-2xl border-4 border-white transform rotate-2 hover:rotate-0 transition-transform duration-500" style={{borderRadius: buttonRadius}}>
                <img src={course.image} alt={course.title} className="w-full h-auto object-cover" />
                {course.type === 'course' && (
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center shadow-lg backdrop-blur cursor-pointer">
                      <Play size={30} style={{color: primaryColor}} fill="currentColor" />
                    </div>
                  </div>
                )}
                {discount > 0 && (
                  <div className="absolute top-4 right-4 bg-red-600 text-white font-bold px-3 py-1 rounded shadow-lg">
                    -{discount}%
                  </div>
                )}
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
            <img src={vendor?.logoUrl || "https://via.placeholder.com/50"} className="w-16 h-16 rounded-full border-2 border-gray-100 p-1 object-cover" />
            <div className="text-left">
              <h3 className="font-bold text-xl text-gray-900">{vendor?.shopName || course.instructor}</h3>
              <p className="text-sm text-gray-500">{vendor?.isVerified ? 'Vendeur Certifié ☑' : 'Instructeur'}</p>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-4 bg-gray-50 rounded-xl">
              <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-3" />
              <h4 className="font-bold mb-1">Satisfait ou Remboursé</h4>
              <p className="text-sm text-gray-500">30 jours pour tester sans risque.</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <Lock className="w-8 h-8 mx-auto mb-3" style={{color: primaryColor}} />
              <h4 className="font-bold mb-1">Paiement Sécurisé</h4>
              <p className="text-sm text-gray-500">Vos données sont protégées (SSL).</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <Star className="w-8 h-8 text-yellow-500 mx-auto mb-3" />
              <h4 className="font-bold mb-1">Support 24/7</h4>
              <p className="text-sm text-gray-500">Une équipe dédiée pour vous aider.</p>
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
                <FileText style={{color: primaryColor}} /> Description détaillée
              </h2>
              <div className="prose prose-blue text-gray-600 leading-relaxed whitespace-pre-line">
                {course.description}
              </div>
            </div>

            {/* Modules */}
            {course.modules && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Contenu de la formation</h2>
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
                   <CheckCircle size={16} className="text-green-500" /> Support communautaire
                </li>
              </ul>
              
              <div className="text-center mb-6">
                 <p className="text-3xl font-extrabold text-red-600">{course.promoPrice ? course.promoPrice.toLocaleString() : course.price.toLocaleString()} F</p>
                 {course.promoPrice && <p className="text-sm text-gray-400 line-through">au lieu de {course.price.toLocaleString()} F</p>}
              </div>

              <button 
                onClick={handleBuy}
                className="w-full text-white py-4 font-bold transition-colors shadow-lg animate-pulse"
                style={{backgroundColor: primaryColor, borderRadius: buttonRadius}}
              >
                {course.hostingMode === 'external' ? 'ACCÉDER À LA PAGE' : 'JE VEUX CETTE FORMATION'}
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
           <p className="text-xs text-gray-500 uppercase font-bold">Total</p>
           <p className="text-xl font-extrabold text-brand-black">{course.promoPrice ? course.promoPrice.toLocaleString() : course.price.toLocaleString()} F</p>
        </div>
        <button 
          onClick={handleBuy}
          className="text-white px-8 py-3 font-bold shadow-lg"
          style={{backgroundColor: primaryColor, borderRadius: buttonRadius}}
        >
          {course.hostingMode === 'external' ? 'VOIR' : 'ACHETER'}
        </button>
      </div>
      
      {/* Footer Minimal for Landing Page (Required for Ads) */}
      <footer className="bg-brand-black text-white py-8 text-center text-sm text-gray-500">
        <p className="mb-4">© {new Date().getFullYear()} {vendor?.shopName || 'KADJOLO'}. Tous droits réservés.</p>
        <p className="text-xs mb-4 max-w-lg mx-auto">Ce site ne fait pas partie du site web Facebook ou de Facebook Inc. De plus, ce site n'est PAS approuvé par Facebook en aucune façon. FACEBOOK est une marque de commerce de FACEBOOK, Inc.</p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Link to="/privacy" className="hover:text-white" target="_blank">Politique de Confidentialité</Link>
          <Link to="/terms" className="hover:text-white" target="_blank">CGV</Link>
          <Link to="/legal" className="hover:text-white" target="_blank">Mentions Légales</Link>
          <Link to="/refund" className="hover:text-white" target="_blank">Remboursement</Link>
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
                console.log(`%c[FB PIXEL] Event: Purchase | Pixel ID: ${vendor.facebookPixelId} | Value: ${course.promoPrice || course.price}`, 'color: #3b5998; font-weight: bold;');
             }
             alert("Paiement réussi ! Vous avez reçu un email avec vos accès.");
             setShowPayment(false);
          }}
        />
      )}

      {showShare && (
        <SocialShare 
           url={window.location.href} 
           title={course.title} 
           subtitle="Partager cette formation avec un ami"
           onClose={() => setShowShare(false)} 
        />
      )}
    </div>
  );
};

export default ProductLanding;

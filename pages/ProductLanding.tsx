
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Star, CheckCircle, Clock, Users, Award, Shield, ChevronDown, Play, FileText, Lock, Share2, Facebook, ExternalLink, Link as LinkIcon, Copy, Video, Target, AlertCircle, Smartphone } from 'lucide-react';
import { vendorProfiles } from '../services/mockData';
import { useData } from '../contexts/DataContext';
import { useUser } from '../contexts/UserContext';
import { Course, VendorProfile } from '../types';
import PaymentModal from '../components/PaymentModal';
import SocialShare from '../components/SocialShare';

const ProductLanding: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { courses, enrollUser, isEnrolled } = useData();
  const { user } = useUser();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState<Course | null>(null);
  const [vendor, setVendor] = useState<VendorProfile | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [showShare, setShowShare] = useState(false);
  const [userHasAccess, setUserHasAccess] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const foundCourse = courses.find(c => c.id === id);
    if (foundCourse) {
      setCourse(foundCourse);
      const foundVendor = vendorProfiles.find(v => v.id === foundCourse.instructorId);
      setVendor(foundVendor || null);
    }
  }, [id, courses]);

  // Check enrollment
  useEffect(() => {
    if (user && course) {
      setUserHasAccess(isEnrolled(user.id, course.id));
    }
  }, [user, course, isEnrolled]);

  const handleBuy = () => {
    if (userHasAccess && course) {
      navigate(`/classroom/${course.id}`);
      return;
    }

    if (course?.hostingMode === 'external' && course.externalSalesPageUrl) {
       window.open(course.externalSalesPageUrl, '_blank');
       return;
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

  const primaryColor = vendor?.themeConfig?.primaryColor || '#2563eb'; 
  const buttonRadius = '12px';

  return (
    <div className="bg-white min-h-screen font-sans">
      <div className="text-white text-center py-2 text-xs font-bold tracking-wide" style={{backgroundColor: '#000000'}}>
        ⚡ OFFRE SPÉCIALE : ACCÈS IMMÉDIAT & SÉCURISÉ ⚡
      </div>

      <header className="relative bg-gradient-to-b from-gray-50 to-white pt-8 pb-12 lg:pt-16 lg:pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
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
              {course.subtitle && <p className="text-xl font-medium text-gray-700">{course.subtitle}</p>}
              <p className="text-lg text-gray-600 leading-relaxed line-clamp-3">
                {course.shortDescription || course.description?.substring(0, 150) + "..."}
              </p>
              
              <div className="flex flex-wrap gap-4 text-sm font-medium text-gray-700">
                <div className="flex items-center gap-1"><Users size={16} style={{color: primaryColor}} /> {course.students} Étudiants</div>
                <div className="flex items-center gap-1"><Star size={16} className="text-yellow-400" fill="currentColor" /> {course.rating}/5</div>
                <div className="flex items-center gap-1"><Clock size={16} /> Accès à vie</div>
              </div>

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
                    style={{backgroundColor: userHasAccess ? '#16a34a' : primaryColor, borderRadius: buttonRadius, boxShadow: `0 10px 15px -3px ${primaryColor}50`}}
                  >
                    {userHasAccess ? (
                      <>ACCÉDER À LA FORMATION <Play size={22} /></>
                    ) : course.hostingMode === 'external' ? (
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
              </div>
            </div>

            <div className="order-1 lg:order-2 relative">
              <div className="relative overflow-hidden shadow-2xl border-4 border-white transform rotate-2 hover:rotate-0 transition-transform duration-500" style={{borderRadius: buttonRadius}}>
                <img src={course.image} alt={course.title} className="w-full h-auto object-cover" />
                {discount > 0 && !userHasAccess && (
                  <div className="absolute top-4 right-4 bg-red-600 text-white font-bold px-3 py-1 rounded shadow-lg">
                    -{discount}%
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {showPayment && (
        <PaymentModal 
          amount={course.promoPrice || course.price}
          productName={course.title}
          onClose={() => setShowPayment(false)}
          onSuccess={() => {
             if (user) {
                enrollUser(user.id, course.id);
                setUserHasAccess(true);
             } else {
                enrollUser('u1', course.id);
                setUserHasAccess(true);
             }
             setShowPayment(false);
             setTimeout(() => navigate(`/classroom/${course.id}`), 1000);
          }}
        />
      )}

      {showShare && (
        <SocialShare 
           url={window.location.href} 
           title={course.title} 
           subtitle="Partager cette formation"
           onClose={() => setShowShare(false)} 
        />
      )}
    </div>
  );
};

export default ProductLanding;

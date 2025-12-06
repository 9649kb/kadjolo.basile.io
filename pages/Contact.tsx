
import React, { useState, useEffect } from 'react';
import { Mail, Youtube, Facebook, Instagram, Send, MapPin, Phone, Star, MessageSquare, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { siteConfig, testimonials } from '../services/mockData';
import { notifyAdminTestimonial } from '../services/notificationService';

const Contact: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'message' | 'testimonial'>('message');
  
  // Contact Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  // Testimonial Form State
  const [testimonialData, setTestimonialData] = useState({
    name: '',
    content: ''
  });
  const [testimonialSubmitted, setTestimonialSubmitted] = useState(false);

  // Carousel State
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-slide effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % testimonials.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate sending
    setTimeout(() => setSubmitted(true), 1000);
  };

  const handleTestimonialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await notifyAdminTestimonial(testimonialData.name, testimonialData.content);
    setTestimonialSubmitted(true);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-12">
      <div className="text-center">
        <h1 className="text-3xl font-serif font-bold text-brand-black mb-4">Contact & Témoignages</h1>
        <div className="inline-flex bg-gray-100 p-1 rounded-lg">
          <button 
            onClick={() => setActiveTab('message')}
            className={`px-6 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'message' ? 'bg-white text-brand-blue shadow-md' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Envoyer un Message
          </button>
          <button 
            onClick={() => setActiveTab('testimonial')}
            className={`px-6 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'testimonial' ? 'bg-white text-brand-blue shadow-md' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Laisser un Témoignage
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Contact Info & Socials (Always visible) */}
        <div className="space-y-8">
          <div className="bg-brand-black text-white p-8 rounded-2xl shadow-xl">
            <h2 className="text-xl font-bold mb-6">Informations Directes</h2>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-brand-blue">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Email</p>
                  <p className="font-medium">{siteConfig.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-brand-green">
                  <Phone size={20} />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Téléphone / WhatsApp</p>
                  <p className="font-medium">{siteConfig.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-white">
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Localisation</p>
                  <p className="font-medium">{siteConfig.location}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <a href={siteConfig.socials.youtube} target="_blank" rel="noopener noreferrer" className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all group flex flex-col items-center justify-center text-center">
              <Youtube size={32} className="text-red-600 mb-2 group-hover:scale-110 transition-transform" />
              <span className="font-bold text-brand-black">YouTube</span>
              <span className="text-xs text-gray-500">Vidéos exclusives</span>
            </a>
            <a href={siteConfig.socials.facebook} target="_blank" rel="noopener noreferrer" className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all group flex flex-col items-center justify-center text-center">
              <Facebook size={32} className="text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
              <span className="font-bold text-brand-black">Facebook</span>
              <span className="text-xs text-gray-500">Communauté</span>
            </a>
            <a href={siteConfig.socials.instagram} target="_blank" rel="noopener noreferrer" className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all group flex flex-col items-center justify-center text-center">
              <Instagram size={32} className="text-pink-600 mb-2 group-hover:scale-110 transition-transform" />
              <span className="font-bold text-brand-black">Instagram</span>
              <span className="text-xs text-gray-500">Lifestyle</span>
            </a>
            <a href={siteConfig.socials.tiktok} target="_blank" rel="noopener noreferrer" className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all group flex flex-col items-center justify-center text-center">
               <div className="w-8 h-8 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-black">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
               </div>
               <span className="font-bold text-brand-black">TikTok</span>
               <span className="text-xs text-gray-500">Astuces rapides</span>
            </a>
          </div>
        </div>

        {/* Dynamic Form Area */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 h-fit">
          
          {activeTab === 'message' ? (
            !submitted ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <h2 className="text-xl font-bold text-brand-black mb-2">Envoyez-moi un message</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Nom complet</label>
                    <input 
                      type="text" 
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent transition-all"
                      placeholder="Votre nom"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    <input 
                      type="email" 
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent transition-all"
                      placeholder="votre@email.com"
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Sujet</label>
                  <select 
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent transition-all bg-white"
                    value={formData.subject}
                    onChange={e => setFormData({...formData, subject: e.target.value})}
                  >
                    <option value="">Sélectionnez un sujet</option>
                    <option value="coaching">Demande de Coaching</option>
                    <option value="partnership">Partenariat / Business</option>
                    <option value="support">Support Technique</option>
                    <option value="other">Autre</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Message</label>
                  <textarea 
                    required
                    rows={5}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent transition-all resize-none"
                    placeholder="Comment puis-je vous aider ?"
                    value={formData.message}
                    onChange={e => setFormData({...formData, message: e.target.value})}
                  ></textarea>
                </div>
                <button 
                  type="submit" 
                  className="w-full bg-brand-black text-white font-bold py-4 rounded-lg hover:bg-gray-800 transition-all flex justify-center items-center gap-2"
                >
                  Envoyer le message <Send size={18} />
                </button>
              </form>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                  <Send size={32} />
                </div>
                <h3 className="text-2xl font-bold text-brand-black mb-2">Message Envoyé !</h3>
                <p className="text-gray-500 mb-8">Merci de m'avoir contacté. Mon équipe reviendra vers vous sous 24h.</p>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="text-brand-blue font-medium hover:underline"
                >
                  Envoyer un autre message
                </button>
              </div>
            )
          ) : (
            // TESTIMONIAL FORM
            !testimonialSubmitted ? (
              <form onSubmit={handleTestimonialSubmit} className="space-y-6">
                <h2 className="text-xl font-bold text-brand-black mb-2 flex items-center gap-2">
                   <Star className="text-yellow-400" fill="currentColor" /> Partagez votre succès
                </h2>
                <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-800 mb-4">
                  Votre témoignage pourra être affiché sur le site après validation.
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Votre Nom</label>
                  <input 
                    type="text" 
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                    placeholder="Prénom Nom"
                    value={testimonialData.name}
                    onChange={e => setTestimonialData({...testimonialData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Votre Témoignage</label>
                  <textarea 
                    required
                    rows={6}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-blue resize-none"
                    placeholder="Quels résultats avez-vous obtenus grâce à nos formations ?"
                    value={testimonialData.content}
                    onChange={e => setTestimonialData({...testimonialData, content: e.target.value})}
                  ></textarea>
                </div>
                <button 
                  type="submit" 
                  className="w-full bg-brand-blue text-white font-bold py-4 rounded-lg hover:bg-blue-600 transition-all flex justify-center items-center gap-2 shadow-lg shadow-blue-500/30"
                >
                  Envoyer le témoignage <MessageSquare size={18} />
                </button>
              </form>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mb-6">
                  <Star size={32} fill="currentColor" />
                </div>
                <h3 className="text-2xl font-bold text-brand-black mb-2">Merci pour votre avis !</h3>
                <p className="text-gray-500 mb-8">L'administrateur a été notifié par email. Votre témoignage apparaîtra bientôt.</p>
                <button 
                  onClick={() => setTestimonialSubmitted(false)}
                  className="text-brand-blue font-medium hover:underline"
                >
                  Envoyer un autre témoignage
                </button>
              </div>
            )
          )}
        </div>
      </div>

      {/* NEW TESTIMONIAL CAROUSEL SECTION */}
      <section className="bg-brand-blue rounded-3xl p-8 md:p-16 text-white text-center relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        
        <div className="relative z-10 max-w-3xl mx-auto">
          <Quote size={48} className="mx-auto text-blue-300 mb-6 opacity-50" />
          
          <h2 className="text-2xl md:text-3xl font-serif font-bold mb-8">Ils nous font confiance</h2>
          
          <div className="relative min-h-[250px] flex items-center justify-center">
            {testimonials.map((testimonial, index) => (
               <div 
                 key={testimonial.id}
                 className={`transition-all duration-500 absolute w-full ${
                   index === currentSlide 
                    ? 'opacity-100 transform translate-x-0 scale-100' 
                    : 'opacity-0 transform translate-x-8 scale-95 pointer-events-none'
                 }`}
               >
                 <p className="text-xl md:text-2xl leading-relaxed italic mb-8 font-light">
                   "{testimonial.content}"
                 </p>
                 <div className="flex flex-col items-center gap-2">
                   <img src={testimonial.avatar} alt={testimonial.name} className="w-16 h-16 rounded-full border-4 border-blue-400/30 shadow-lg object-cover" />
                   <div>
                     <h4 className="font-bold text-lg">{testimonial.name}</h4>
                     <p className="text-blue-200 text-sm">{testimonial.role}</p>
                   </div>
                   <div className="flex gap-1 mt-1 text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} fill={i < testimonial.rating ? "currentColor" : "none"} />
                      ))}
                   </div>
                 </div>
               </div>
            ))}
          </div>

          {/* Navigation Controls */}
          <div className="flex justify-center items-center gap-8 mt-8">
            <button onClick={prevSlide} className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-sm">
              <ChevronLeft size={24} />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, idx) => (
                <button 
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`w-3 h-3 rounded-full transition-all ${idx === currentSlide ? 'bg-white w-6' : 'bg-white/30'}`}
                />
              ))}
            </div>
            <button onClick={nextSlide} className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-sm">
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;

import React, { useState, useEffect, useMemo } from 'react';
import { Mail, Youtube, Facebook, Instagram, Send, MapPin, Phone, Star, MessageSquare, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { siteConfig } from '../services/mockData';
import { useData } from '../contexts/DataContext';
import { useUser } from '../contexts/UserContext';

const Contact: React.FC = () => {
  const { addMessage, addTestimonial, testimonials: allTestimonials } = useData();
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState<'message' | 'testimonial'>('message');
  
  const approvedTestimonials = useMemo(() => allTestimonials.filter(t => t.status === 'approved'), [allTestimonials]);
  
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [testimonialData, setTestimonialData] = useState({ name: '', content: '', rating: 5 });
  const [testimonialSubmitted, setTestimonialSubmitted] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (approvedTestimonials.length > 0) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % approvedTestimonials.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [approvedTestimonials.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % approvedTestimonials.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + approvedTestimonials.length) % approvedTestimonials.length);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addMessage({
      senderId: user?.id, // On lie le message à l'utilisateur s'il est connecté
      name: formData.name,
      email: formData.email,
      subject: formData.subject || 'Message de contact',
      message: formData.message
    });
    setSubmitted(true);
  };

  const handleTestimonialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTestimonial({
      name: testimonialData.name,
      content: testimonialData.content,
      role: 'Client',
      avatar: `https://ui-avatars.com/api/?name=${testimonialData.name}&background=random`,
      rating: testimonialData.rating
    });
    setTestimonialSubmitted(true);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-12">
      <div className="text-center">
        <h1 className="text-3xl font-serif font-bold text-brand-black mb-4">Contact & Témoignages</h1>
        <div className="inline-flex bg-gray-100 p-1 rounded-lg">
          <button onClick={() => setActiveTab('message')} className={`px-6 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'message' ? 'bg-white text-brand-blue shadow-md' : 'text-gray-500 hover:text-gray-700'}`}>Envoyer un Message</button>
          <button onClick={() => setActiveTab('testimonial')} className={`px-6 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'testimonial' ? 'bg-white text-brand-blue shadow-md' : 'text-gray-500 hover:text-gray-700'}`}>Laisser un Témoignage</button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        <div className="space-y-8">
          <div className="bg-brand-black text-white p-8 rounded-2xl shadow-xl">
            <h2 className="text-xl font-bold mb-6">Informations Directes</h2>
            <div className="space-y-6">
              <div className="flex items-center gap-4"><div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-brand-blue"><Mail size={20} /></div><div><p className="text-xs text-gray-400">Email</p><p className="font-medium">{siteConfig.email}</p></div></div>
              <div className="flex items-center gap-4"><div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-brand-green"><Phone size={20} /></div><div><p className="text-xs text-gray-400">WhatsApp</p><p className="font-medium">{siteConfig.phone}</p></div></div>
              <div className="flex items-center gap-4"><div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-white"><MapPin size={20} /></div><div><p className="text-xs text-gray-400">Localisation</p><p className="font-medium">{siteConfig.location}</p></div></div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <a href={siteConfig.socials.youtube} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md text-center"><Youtube size={32} className="text-red-600 mx-auto mb-2" /><span className="font-bold">YouTube</span></a>
            <a href={siteConfig.socials.facebook} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md text-center"><Facebook size={32} className="text-blue-600 mx-auto mb-2" /><span className="font-bold">Facebook</span></a>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          {activeTab === 'message' ? (
            !submitted ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <h2 className="text-xl font-bold text-brand-black mb-2">Envoyez-moi un message</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <input type="text" required placeholder="Votre nom" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 rounded-lg border border-gray-200" />
                  <input type="email" required placeholder="votre@email.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-3 rounded-lg border border-gray-200" />
                </div>
                <select className="w-full px-4 py-3 rounded-lg border border-gray-200" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})}>
                  <option value="">Sujet du message</option>
                  <option value="coaching">Demande de Coaching</option>
                  <option value="partnership">Partenariat</option>
                  <option value="other">Autre</option>
                </select>
                <textarea required rows={5} placeholder="Comment puis-je vous aider ?" value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} className="w-full px-4 py-3 rounded-lg border border-gray-200 resize-none"></textarea>
                <button type="submit" className="w-full bg-brand-black text-white font-bold py-4 rounded-lg flex justify-center items-center gap-2">Envoyer le message <Send size={18} /></button>
              </form>
            ) : (
              <div className="text-center py-12">
                <Send size={48} className="text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">Message Envoyé !</h3>
                <p className="text-gray-500 mb-6">Il apparaîtra immédiatement dans la boîte de réception Admin.</p>
                <button onClick={() => setSubmitted(false)} className="text-brand-blue font-bold">Envoyer un autre message</button>
              </div>
            )
          ) : (
            !testimonialSubmitted ? (
              <form onSubmit={handleTestimonialSubmit} className="space-y-6">
                <h2 className="text-xl font-bold flex items-center gap-2"><Star className="text-yellow-400" fill="currentColor" /> Partagez votre succès</h2>
                <input type="text" required placeholder="Votre nom" value={testimonialData.name} onChange={e => setTestimonialData({...testimonialData, name: e.target.value})} className="w-full px-4 py-3 rounded-lg border border-gray-200" />
                <textarea required rows={6} placeholder="Quels résultats avez-vous obtenus ?" value={testimonialData.content} onChange={e => setTestimonialData({...testimonialData, content: e.target.value})} className="w-full px-4 py-3 rounded-lg border border-gray-200 resize-none"></textarea>
                <div className="flex gap-2">
                  {[1,2,3,4,5].map(i => <Star key={i} onClick={() => setTestimonialData({...testimonialData, rating: i})} className={`cursor-pointer ${i <= testimonialData.rating ? 'text-yellow-400' : 'text-gray-200'}`} fill="currentColor" />)}
                </div>
                <button type="submit" className="w-full bg-brand-blue text-white font-bold py-4 rounded-lg shadow-lg">Envoyer le témoignage <MessageSquare size={18} /></button>
              </form>
            ) : (
              <div className="text-center py-12">
                <Star size={48} className="text-yellow-500 mx-auto mb-4" fill="currentColor" />
                <h3 className="text-2xl font-bold mb-2">Merci pour votre avis !</h3>
                <p className="text-gray-500">Votre témoignage est en attente de modération par l'Admin.</p>
                <button onClick={() => setTestimonialSubmitted(false)} className="text-brand-blue font-bold mt-4">Laisser un autre avis</button>
              </div>
            )
          )}
        </div>
      </div>

      {approvedTestimonials.length > 0 && (
        <section className="bg-brand-blue rounded-3xl p-8 md:p-16 text-white text-center relative overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-3xl mx-auto">
            <Quote size={48} className="mx-auto text-blue-300 mb-6 opacity-50" />
            <div className="relative min-h-[250px] flex items-center justify-center">
              {approvedTestimonials.map((t, index) => (
                 <div key={t.id} className={`transition-all duration-500 absolute w-full ${index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
                   <p className="text-xl md:text-2xl italic mb-8">"{t.content}"</p>
                   <div className="flex flex-col items-center gap-2">
                     <img src={t.avatar} className="w-16 h-16 rounded-full border-4 border-blue-400/30 object-cover" />
                     <div><h4 className="font-bold">{t.name}</h4><p className="text-blue-200 text-sm">{t.role}</p></div>
                   </div>
                 </div>
              ))}
            </div>
            <div className="flex justify-center items-center gap-8 mt-8">
              <button onClick={prevSlide} className="p-2 bg-white/10 rounded-full"><ChevronLeft size={24} /></button>
              <button onClick={nextSlide} className="p-2 bg-white/10 rounded-full"><ChevronRight size={24} /></button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Contact;

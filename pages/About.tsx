
import React, { useState, useRef } from 'react';
import { ArrowRight, Award, Target, Users, Camera, Save, X, Link as LinkIcon, Upload, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { siteConfig } from '../services/mockData';

const About: React.FC = () => {
  const [profileImage, setProfileImage] = useState(siteConfig.profilePicture);
  const [isEditingImage, setIsEditingImage] = useState(false);
  const [editMethod, setEditMethod] = useState<'url' | 'upload'>('url');
  const [tempImageUrl, setTempImageUrl] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpdateProfile = () => {
    if (tempImageUrl) {
      setProfileImage(tempImageUrl);
      // In a real app, update backend here
      siteConfig.profilePicture = tempImageUrl; 
      setIsEditingImage(false);
      setTempImageUrl('');
      alert("Profil mis à jour !");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setProfileImage(url);
      siteConfig.profilePicture = url;
      setIsEditingImage(false);
      alert("Photo importée avec succès !");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-16 pb-12">
      {/* Hero Section */}
      <section className="text-center space-y-8">
        <div className="relative inline-block mt-8">
          <div className="absolute inset-0 bg-brand-blue rounded-full blur-2xl opacity-20 transform translate-x-4 translate-y-4"></div>
          
          <div className="relative group">
            {/* Main Profile Image */}
            <div className="w-48 h-48 md:w-72 md:h-72 rounded-full border-8 border-white shadow-2xl mx-auto overflow-hidden bg-gray-100 relative z-10">
              <img 
                src={profileImage} 
                alt="Kadjolo Basile" 
                className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
              />
            </div>
            
            {/* Edit Trigger Button */}
            <button 
              onClick={() => setIsEditingImage(!isEditingImage)}
              className="absolute bottom-4 right-1/2 translate-x-1/2 md:translate-x-24 md:right-4 bg-brand-blue text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition-colors z-20 border-4 border-white"
              title="Changer la photo de profil"
            >
              <Camera size={20} />
            </button>
          </div>

          {/* Edit Interface - Displayed ABOVE or BELOW the photo logically, but conceptually 'top' of options */}
          {isEditingImage && (
            <div className="mt-8 max-w-md mx-auto bg-white p-6 rounded-2xl shadow-xl border border-gray-100 animate-in fade-in slide-in-from-top-4 relative z-30">
              <div className="flex justify-between items-center mb-4">
                 <h3 className="font-bold text-gray-800">Modifier le Profil</h3>
                 <button onClick={() => setIsEditingImage(false)} className="text-gray-400 hover:text-red-500"><X size={20} /></button>
              </div>

              {/* Tab Options */}
              <div className="flex bg-gray-100 p-1 rounded-lg mb-4">
                <button 
                  onClick={() => setEditMethod('url')}
                  className={`flex-1 py-2 text-sm font-bold rounded-md transition-all flex items-center justify-center gap-2 ${editMethod === 'url' ? 'bg-white text-brand-blue shadow-sm' : 'text-gray-500'}`}
                >
                  <LinkIcon size={14} /> Coller une URL
                </button>
                <button 
                  onClick={() => setEditMethod('upload')}
                  className={`flex-1 py-2 text-sm font-bold rounded-md transition-all flex items-center justify-center gap-2 ${editMethod === 'upload' ? 'bg-white text-brand-blue shadow-sm' : 'text-gray-500'}`}
                >
                  <Upload size={14} /> Importer
                </button>
              </div>

              {/* URL Input Method */}
              {editMethod === 'url' && (
                <div className="space-y-3">
                  <input 
                    type="text" 
                    placeholder="https://..."
                    value={tempImageUrl}
                    onChange={(e) => setTempImageUrl(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-3 text-sm focus:ring-2 focus:ring-brand-blue outline-none bg-gray-50"
                  />
                  <button 
                    onClick={handleUpdateProfile}
                    className="w-full bg-brand-blue text-white py-2 rounded-lg font-bold hover:bg-blue-600 transition-colors"
                  >
                    Valider l'URL
                  </button>
                </div>
              )}

              {/* Upload Method */}
              {editMethod === 'upload' && (
                <div className="space-y-3">
                   <div 
                     onClick={() => fileInputRef.current?.click()}
                     className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:bg-gray-50 hover:border-brand-blue transition-colors"
                   >
                     <div className="w-12 h-12 bg-blue-50 text-brand-blue rounded-full flex items-center justify-center mx-auto mb-3">
                        <Upload size={24} />
                     </div>
                     <p className="text-sm font-bold text-gray-700">Cliquez pour importer</p>
                     <p className="text-xs text-gray-400">Depuis ordinateur ou téléphone</p>
                   </div>
                   <input 
                     type="file" 
                     accept="image/*"
                     ref={fileInputRef}
                     onChange={handleFileUpload}
                     className="hidden"
                   />
                </div>
              )}
            </div>
          )}

        </div>
        <div>
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-brand-black mb-2">KADJOLO BASILE</h1>
          <p className="text-xl md:text-2xl text-brand-blue font-medium tracking-wide">Entrepreneur, Conférencier & Mentor</p>
        </div>
      </section>

      {/* Bio Section */}
      <section className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-blue/5 rounded-full blur-3xl"></div>
        <h2 className="text-2xl font-bold text-brand-black mb-6 font-serif relative z-10">Mon Histoire</h2>
        <div className="space-y-4 text-gray-600 leading-relaxed text-lg relative z-10">
          <BookOpen className="w-8 h-8 text-brand-blue mb-2" />
          <p>
            Tout a commencé avec une vision simple : <strong>le potentiel humain est illimité</strong>, mais souvent inexploité. 
            Après des années d'expérience dans le monde des affaires et de nombreuses épreuves surmontées, j'ai décidé de consacrer ma vie à aider les autres à bâtir leur propre empire.
          </p>
          <p>
            Je ne vends pas du rêve, je partage des stratégies. Mon approche est basée sur le pragmatisme, l'action massive et une discipline de fer. 
            Sur cette plateforme, je réunis tout ce que j'aurais aimé savoir quand j'ai débuté.
          </p>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="grid md:grid-cols-3 gap-6">
        <div className="bg-brand-black text-white p-8 rounded-2xl transform hover:-translate-y-2 transition-transform">
          <Target className="w-10 h-10 mb-4 text-brand-green" />
          <h3 className="text-xl font-bold mb-3">Mission</h3>
          <p className="text-gray-400">
            Armer 100,000 entrepreneurs avec les outils mentaux et stratégiques pour dominer leur marché.
          </p>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 transform hover:-translate-y-2 transition-transform delay-75">
          <Users className="w-10 h-10 mb-4 text-brand-blue" />
          <h3 className="text-xl font-bold mb-3 text-brand-black">Communauté</h3>
          <p className="text-gray-600">
            Créer un écosystème d'entraide où chaque membre tire les autres vers le haut.
          </p>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 transform hover:-translate-y-2 transition-transform delay-100">
          <Award className="w-10 h-10 mb-4 text-brand-blue" />
          <h3 className="text-xl font-bold mb-3 text-brand-black">Excellence</h3>
          <p className="text-gray-600">
            Le refus de la médiocrité. Nous visons l'exceptionnel dans chaque aspect de notre vie.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand-blue rounded-3xl p-12 text-center text-white relative overflow-hidden shadow-xl">
        <div className="relative z-10">
          <h2 className="text-3xl font-serif font-bold mb-4">Prêt à passer au niveau supérieur ?</h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Ne restez pas spectateur de votre vie. Rejoignez la communauté dès aujourd'hui et commencez votre transformation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
             <Link to="/community" className="bg-white text-brand-blue font-bold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors shadow-lg">
               Rejoindre Gratuitement
             </Link>
             <Link to="/contact" className="bg-blue-700 text-white font-bold px-8 py-3 rounded-lg hover:bg-blue-800 transition-colors border border-blue-500 shadow-lg">
               Me Contacter
             </Link>
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-brand-blue to-blue-900 opacity-90"></div>
      </section>
    </div>
  );
};

export default About;

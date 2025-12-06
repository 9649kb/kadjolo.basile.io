
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, Users, TrendingUp, Package, Search, Book, Video, X, CheckCircle, Globe, ShoppingCart, Plus, Save, Settings, Image as ImageIcon, Trash2, Star, MessageCircle, Send, Award, BadgeCheck } from 'lucide-react';
import { courses as initialCourses, vendorProfiles as initialProfiles, siteConfig, currentUser } from '../services/mockData';
import { Course, VendorProfile, Review } from '../types';
import PaymentModal from '../components/PaymentModal';
import { notifyNewProduct } from '../services/notificationService';

const data = [
  { name: 'Lun', sales: 400 },
  { name: 'Mar', sales: 300 },
  { name: 'Mer', sales: 600 },
  { name: 'Jeu', sales: 800 },
  { name: 'Ven', sales: 500 },
  { name: 'Sam', sales: 900 },
  { name: 'Dim', sales: 700 },
];

const Marketplace: React.FC = () => {
  const [mode, setMode] = useState<'student' | 'creator'>('student');
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [profiles] = useState<VendorProfile[]>(initialProfiles);
  
  // Selection States
  const [selectedProduct, setSelectedProduct] = useState<Course | null>(null);
  const [showProductDetail, setShowProductDetail] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<VendorProfile | null>(null);
  
  // Review States
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [replyText, setReplyText] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  // Filters
  const [filterType, setFilterType] = useState<'all' | 'course' | 'ebook'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Profile Photo Management State
  const [profilePhotoUrl, setProfilePhotoUrl] = useState(siteConfig.profilePicture);

  // Creator Mode States
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'profile'>('dashboard');
  const [newProduct, setNewProduct] = useState({ title: '', price: '', type: 'course', description: '' });
  
  // Admin/Edit Mode
  const isAdmin = currentUser.role === 'admin';

  // --- ACTIONS ---

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

  const handleDeleteProduct = (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) {
      setCourses(courses.filter(c => c.id !== id));
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const newId = Date.now().toString();
    const product: Course = {
      id: newId,
      title: newProduct.title,
      price: Number(newProduct.price),
      type: newProduct.type as 'course' | 'ebook',
      description: newProduct.description,
      instructor: currentUser.name,
      instructorId: 'v1', // Assuming current user is v1 for demo
      image: newProduct.type === 'ebook' ? 'https://picsum.photos/300/450?random=' + newId : 'https://picsum.photos/400/250?random=' + newId,
      category: 'Business',
      rating: 0,
      students: 0,
      isPremium: true,
      reviews: []
    };
    
    setCourses([product, ...courses]);
    setNewProduct({ title: '', price: '', type: 'course', description: '' });
    await notifyNewProduct(product.title);
    alert("Produit ajouté avec succès !");
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, we would update the backend config here
    siteConfig.profilePicture = profilePhotoUrl;
    alert("Profil vendeur mis à jour !");
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    const review: Review = {
      id: Date.now().toString(),
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      rating: newReview.rating,
      comment: newReview.comment,
      date: new Date().toLocaleDateString()
    };

    const updatedProduct = {
      ...selectedProduct,
      reviews: [review, ...(selectedProduct.reviews || [])],
      rating: ((selectedProduct.rating * selectedProduct.students) + newReview.rating) / (selectedProduct.students + 1), // Simple approx update
      students: selectedProduct.students + 1 // Simulating purchase verify
    };

    setCourses(courses.map(c => c.id === selectedProduct.id ? updatedProduct : c));
    setSelectedProduct(updatedProduct);
    setNewReview({ rating: 5, comment: '' });
  };

  const handleReplyToReview = (reviewId: string) => {
    if (!selectedProduct || !replyText) return;

    const updatedReviews = selectedProduct.reviews?.map(r => {
      if (r.id === reviewId) {
        return { ...r, reply: replyText };
      }
      return r;
    });

    const updatedProduct = { ...selectedProduct, reviews: updatedReviews };
    setCourses(courses.map(c => c.id === selectedProduct.id ? updatedProduct : c));
    setSelectedProduct(updatedProduct);
    setReplyText('');
    setReplyingTo(null);
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
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-serif font-bold text-brand-black">Marketplace</h1>
          <p className="text-gray-500 text-sm">Formations et E-books d'élite</p>
        </div>
        <div className="flex bg-gray-100 p-1 rounded-lg">
          <button 
            onClick={() => setMode('student')}
            className={`px-6 py-2 rounded-md text-sm font-bold transition-all ${mode === 'student' ? 'bg-white text-brand-blue shadow-md' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Acheter
          </button>
          <button 
            onClick={() => setMode('creator')}
            className={`px-6 py-2 rounded-md text-sm font-bold transition-all ${mode === 'creator' ? 'bg-brand-blue text-white shadow-md' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Vendre (Créateur)
          </button>
        </div>
      </div>

      {/* --- CREATOR MODE --- */}
      {mode === 'creator' && (
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Creator Sidebar */}
          <div className="lg:col-span-1 space-y-2">
            {[
              { id: 'dashboard', label: 'Tableau de bord', icon: <TrendingUp size={20} /> },
              { id: 'products', label: 'Mes Produits', icon: <Package size={20} /> },
              { id: 'profile', label: 'Mon Profil Boutique', icon: <Settings size={20} /> },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === tab.id ? 'bg-brand-blue text-white shadow-lg shadow-blue-500/30' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          {/* Creator Content */}
          <div className="lg:col-span-3">
            
            {/* Dashboard Tab */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-blue-100 text-brand-blue rounded-lg"><DollarSign size={24} /></div>
                      <span className="text-gray-500 font-medium">Revenus</span>
                    </div>
                    <p className="text-3xl font-bold text-brand-black">2,450€</p>
                    <span className="text-green-500 text-sm font-bold flex items-center gap-1"><TrendingUp size={14} /> +12% ce mois</span>
                  </div>
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-purple-100 text-purple-600 rounded-lg"><Users size={24} /></div>
                      <span className="text-gray-500 font-medium">Étudiants</span>
                    </div>
                    <p className="text-3xl font-bold text-brand-black">843</p>
                    <span className="text-green-500 text-sm font-bold flex items-center gap-1"><TrendingUp size={14} /> +5% ce mois</span>
                  </div>
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-orange-100 text-orange-600 rounded-lg"><Globe size={24} /></div>
                      <span className="text-gray-500 font-medium">Visiteurs Boutique</span>
                    </div>
                    <p className="text-3xl font-bold text-brand-black">15,420</p>
                    <span className="text-gray-400 text-sm">Total historique</span>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-80">
                  <h3 className="font-bold text-lg mb-4">Performance des Ventes</h3>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                      <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}€`} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                        cursor={{ fill: '#f1f5f9' }}
                      />
                      <Bar dataKey="sales" fill="#2563eb" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Products Tab */}
            {activeTab === 'products' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Plus size={20} className="text-brand-blue" /> Ajouter un produit</h3>
                  <form onSubmit={handleAddProduct} className="grid md:grid-cols-2 gap-4">
                    <input 
                      type="text" 
                      placeholder="Titre du produit"
                      value={newProduct.title}
                      onChange={e => setNewProduct({...newProduct, title: e.target.value})}
                      className="bg-gray-50 border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-brand-blue outline-none"
                      required
                    />
                    <input 
                      type="number" 
                      placeholder="Prix (€)"
                      value={newProduct.price}
                      onChange={e => setNewProduct({...newProduct, price: e.target.value})}
                      className="bg-gray-50 border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-brand-blue outline-none"
                      required
                    />
                    <select 
                      value={newProduct.type}
                      onChange={e => setNewProduct({...newProduct, type: e.target.value})}
                      className="bg-gray-50 border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-brand-blue outline-none"
                    >
                      <option value="course">Formation Vidéo</option>
                      <option value="ebook">E-Book (PDF)</option>
                    </select>
                    <input 
                      type="text" 
                      placeholder="Description courte"
                      value={newProduct.description}
                      onChange={e => setNewProduct({...newProduct, description: e.target.value})}
                      className="bg-gray-50 border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-brand-blue outline-none"
                    />
                    <button type="submit" className="md:col-span-2 bg-brand-black text-white font-bold py-3 rounded-lg hover:bg-gray-800 transition-colors">
                      Publier le produit
                    </button>
                  </form>
                </div>

                <h3 className="font-bold text-xl text-brand-black">Mon Catalogue</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {courses.filter(c => c.instructorId === 'v1').map(product => (
                    <div key={product.id} className="flex gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100 items-center">
                      <img src={product.image} alt={product.title} className="w-16 h-16 rounded-lg object-cover" />
                      <div className="flex-1">
                        <h4 className="font-bold text-brand-black line-clamp-1">{product.title}</h4>
                        <p className="text-sm text-gray-500">{product.price}€ • {product.students} ventes</p>
                      </div>
                      <button onClick={() => handleDeleteProduct(product.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Shop Profile Tab */}
            {activeTab === 'profile' && (
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 animate-in fade-in duration-300">
                <div className="flex justify-between items-center mb-6">
                   <h3 className="font-bold text-xl">Profil Vendeur Public</h3>
                   <div className="flex gap-2">
                     <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase flex items-center gap-1">
                       <CheckCircle size={14} /> Vérifié
                     </span>
                     <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold uppercase flex items-center gap-1">
                       <Award size={14} /> Top Vendeur
                     </span>
                   </div>
                </div>
                
                <form onSubmit={handleSaveProfile} className="space-y-6">
                  <div className="flex items-center gap-6">
                    <div className="w-24 h-24 rounded-full border-4 border-gray-100 shadow-inner overflow-hidden relative group cursor-pointer bg-gray-50">
                      {profilePhotoUrl ? (
                        <img src={profilePhotoUrl} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                          <ImageIcon size={32} />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-brand-black">Photo de Profil</h4>
                      <p className="text-sm text-gray-500 mb-2">URL de l'image (Copiez/Collez un lien)</p>
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          value={profilePhotoUrl}
                          onChange={(e) => setProfilePhotoUrl(e.target.value)}
                          placeholder="https://..."
                          className="flex-1 border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-brand-blue outline-none"
                        />
                        <button 
                          type="button" 
                          onClick={() => setProfilePhotoUrl('')}
                          className="bg-red-50 text-red-600 px-3 py-2 rounded-lg text-sm font-bold hover:bg-red-100"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Nom de la Boutique</label>
                      <input type="text" defaultValue="KADJOLO Official Store" className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-brand-blue outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Email Contact</label>
                      <input type="email" defaultValue={siteConfig.email} className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-brand-blue outline-none" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-gray-700 mb-2">Bio / Description</label>
                      <textarea rows={4} defaultValue="La boutique officielle. Retrouvez ici toutes mes méthodes exclusives." className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-brand-blue outline-none"></textarea>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex justify-end">
                    <button type="submit" className="bg-brand-blue text-white font-bold px-8 py-3 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2">
                      <Save size={18} /> Enregistrer les modifications
                    </button>
                  </div>
                </form>
              </div>
            )}

          </div>
        </div>
      )}

      {/* --- STUDENT MODE --- */}
      {mode === 'student' && (
        <div className="animate-in fade-in duration-300">
          
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
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
                {/* Edit/Delete Controls for Admin */}
                {isAdmin && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleDeleteProduct(product.id); }}
                    className="absolute top-2 right-2 z-20 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
          
                <div className={`relative overflow-hidden ${product.type === 'ebook' ? 'aspect-[2/3]' : 'h-48'} rounded-t-xl`}>
                  <img src={product.image} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 left-3 bg-brand-black/80 backdrop-blur text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                    {product.type === 'ebook' ? <Book size={12} /> : <Video size={12} />}
                    {product.type === 'ebook' ? 'E-Book' : 'Formation'}
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="font-bold text-lg text-brand-black mb-1 leading-snug group-hover:text-brand-blue transition-colors">{product.title}</h3>
                  
                  {/* Vendor Link with Badges */}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      if (vendor) setSelectedVendor(vendor);
                    }}
                    className="text-sm text-gray-500 mb-3 hover:text-brand-blue hover:underline text-left flex items-center gap-1"
                  >
                    Par {product.instructor}
                    {vendor?.isVerified && <BadgeCheck size={14} className="text-blue-500" fill="currentColor" color="white" />}
                  </button>
          
                  <p className="text-gray-600 text-sm line-clamp-2 mb-4 flex-1">{product.description}</p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-50 mt-auto">
                    <span className="text-2xl font-bold text-brand-blue">{product.price}€</span>
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
        </div>
      )}

      {/* --- PAYMENT MODAL --- */}
      {showPayment && selectedProduct && (
        <PaymentModal 
          amount={selectedProduct.price}
          productName={selectedProduct.title}
          onClose={() => setShowPayment(false)}
          onSuccess={handlePaymentSuccess}
        />
      )}

      {/* --- PRODUCT DETAIL MODAL (With Reviews) --- */}
      {showProductDetail && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl relative flex flex-col md:flex-row overflow-hidden">
            <button 
              onClick={() => setShowProductDetail(false)}
              className="absolute top-4 right-4 bg-gray-100 p-2 rounded-full hover:bg-gray-200 transition-colors z-20"
            >
              <X size={20} />
            </button>

            {/* Left: Image & Main Info */}
            <div className="w-full md:w-2/5 bg-gray-50 p-6 flex flex-col">
              <img src={selectedProduct.image} alt={selectedProduct.title} className="w-full h-64 object-cover rounded-lg shadow-md mb-6" />
              
              <div className="mt-auto">
                 <h2 className="text-2xl font-bold text-brand-black mb-2">{selectedProduct.title}</h2>
                 <p className="text-brand-blue font-bold text-3xl mb-4">{selectedProduct.price}€</p>
                 <button 
                    onClick={handleBuyClick}
                    className="w-full py-4 bg-brand-black text-white font-bold rounded-xl hover:bg-gray-800 transition-colors flex justify-center items-center gap-2 shadow-xl"
                 >
                   <ShoppingCart size={20} /> Acheter Maintenant
                 </button>
              </div>
            </div>

            {/* Right: Details & Reviews */}
            <div className="w-full md:w-3/5 p-8 overflow-y-auto">
              <div className="mb-8">
                <h3 className="font-bold text-lg border-b border-gray-100 pb-2 mb-4">Description</h3>
                <p className="text-gray-600 leading-relaxed">{selectedProduct.description}</p>
              </div>

              {/* Reviews Section */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-lg">Avis & Témoignages</h3>
                  <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1 rounded-full border border-yellow-100">
                    <Star size={16} className="text-yellow-500 fill-current" />
                    <span className="font-bold text-brand-black">{selectedProduct.rating.toFixed(1)}</span>
                    <span className="text-gray-400 text-xs">({selectedProduct.reviews?.length || 0})</span>
                  </div>
                </div>

                {/* Reviews List */}
                <div className="space-y-6 mb-8">
                  {selectedProduct.reviews && selectedProduct.reviews.length > 0 ? (
                    selectedProduct.reviews.map(review => (
                      <div key={review.id} className="border-b border-gray-50 pb-4 last:border-0">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-3">
                            <img src={review.userAvatar} alt={review.userName} className="w-10 h-10 rounded-full" />
                            <div>
                              <p className="font-bold text-sm text-brand-black">{review.userName}</p>
                              <div className="flex text-yellow-400">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} size={12} fill={i < review.rating ? "currentColor" : "none"} />
                                ))}
                              </div>
                            </div>
                          </div>
                          <span className="text-xs text-gray-400">{review.date}</span>
                        </div>
                        <p className="text-gray-600 text-sm mb-3">{review.comment}</p>
                        
                        {/* Seller Reply */}
                        {review.reply && (
                           <div className="bg-gray-50 p-3 rounded-lg border-l-4 border-brand-blue ml-8">
                             <p className="text-xs font-bold text-brand-blue mb-1">Réponse du vendeur :</p>
                             <p className="text-xs text-gray-700">{review.reply}</p>
                           </div>
                        )}

                        {/* Reply Action for Creator */}
                        {mode === 'creator' && !review.reply && (
                          <div className="mt-2 ml-8">
                            {replyingTo === review.id ? (
                              <div className="flex gap-2">
                                <input 
                                  type="text" 
                                  value={replyText}
                                  onChange={(e) => setReplyText(e.target.value)}
                                  className="flex-1 border rounded px-2 py-1 text-sm"
                                  placeholder="Votre réponse..."
                                />
                                <button onClick={() => handleReplyToReview(review.id)} className="text-xs bg-brand-blue text-white px-3 rounded">Envoyer</button>
                                <button onClick={() => setReplyingTo(null)} className="text-xs text-gray-500">Annuler</button>
                              </div>
                            ) : (
                              <button onClick={() => setReplyingTo(review.id)} className="text-xs text-brand-blue font-bold hover:underline">Répondre</button>
                            )}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400 italic text-sm">Aucun avis pour le moment. Soyez le premier !</p>
                  )}
                </div>

                {/* Add Review Form */}
                {mode === 'student' && (
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <h4 className="font-bold text-sm mb-3">Donner votre avis</h4>
                    <form onSubmit={handleSubmitReview}>
                      <div className="flex gap-2 mb-3">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button 
                            key={star} 
                            type="button"
                            onClick={() => setNewReview({ ...newReview, rating: star })}
                            className="focus:outline-none"
                          >
                            <Star 
                              size={20} 
                              className={star <= newReview.rating ? "text-yellow-500 fill-current" : "text-gray-300"} 
                            />
                          </button>
                        ))}
                      </div>
                      <textarea 
                        value={newReview.comment}
                        onChange={(e) => setNewReview({ ...newReview, comment: e.target.value})}
                        placeholder="Partagez votre expérience avec ce produit..."
                        className="w-full p-3 rounded-lg border border-gray-200 text-sm mb-3 focus:ring-1 focus:ring-brand-blue outline-none"
                        rows={3}
                        required
                      />
                      <button type="submit" className="bg-brand-black text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-800 transition-colors flex items-center gap-2">
                        <Send size={14} /> Publier l'avis
                      </button>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- VENDOR PROFILE MODAL (For Students) --- */}
      {selectedVendor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl relative">
            <button 
              onClick={() => setSelectedVendor(null)}
              className="absolute top-4 right-4 bg-gray-100 p-2 rounded-full hover:bg-gray-200 transition-colors z-10"
            >
              <X size={20} />
            </button>
            
            {/* Vendor Header */}
            <div className="relative h-48 bg-brand-blue">
               {/* Pattern */}
               <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
            </div>
            
            <div className="px-8 pb-8">
              <div className="relative -mt-16 mb-6 flex flex-col md:flex-row items-center md:items-end gap-6 text-center md:text-left">
                <img src={selectedVendor.logoUrl} alt={selectedVendor.shopName} className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover bg-white" />
                <div className="flex-1 mb-2">
                  <div className="flex items-center justify-center md:justify-start gap-2">
                     <h2 className="text-3xl font-bold text-brand-black">{selectedVendor.shopName}</h2>
                     {selectedVendor.isVerified && <BadgeCheck size={28} className="text-blue-500" fill="currentColor" color="white" />}
                  </div>
                  <p className="text-gray-500 font-medium">Membre depuis {selectedVendor.joinedDate}</p>
                </div>
                
                <div className="flex flex-col gap-2 items-center md:items-end">
                   {selectedVendor.isVerified && (
                    <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg font-bold flex items-center gap-2 text-sm">
                      <CheckCircle size={16} /> Vendeur Vérifié
                    </div>
                   )}
                   {selectedVendor.isTopSeller && (
                    <div className="bg-yellow-50 text-yellow-700 px-4 py-2 rounded-lg font-bold flex items-center gap-2 text-sm border border-yellow-100">
                      <Award size={16} /> Top Vendeur 2024
                    </div>
                   )}
                </div>
              </div>

              <div className="mb-10 max-w-2xl">
                <h3 className="font-bold text-lg mb-2">À propos</h3>
                <p className="text-gray-600 leading-relaxed">{selectedVendor.description}</p>
              </div>

              <h3 className="font-bold text-xl mb-6 border-b border-gray-100 pb-2">Produits de ce vendeur</h3>
              <div className="grid md:grid-cols-3 gap-6">
                {getVendorCourses(selectedVendor.id).map(course => (
                  <div key={course.id} className="border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <img src={course.image} alt={course.title} className="w-full h-32 object-cover" />
                    <div className="p-4">
                      <h4 className="font-bold text-sm mb-2 line-clamp-2">{course.title}</h4>
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-brand-blue">{course.price}€</span>
                        <button 
                          onClick={() => { setSelectedVendor(null); handleProductClick(course); }}
                          className="text-xs bg-brand-black text-white px-3 py-1 rounded hover:bg-gray-800"
                        >
                          Voir
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Marketplace;

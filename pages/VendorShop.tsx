

import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { vendorProfiles, courses } from '../services/mockData';
import { VendorProfile, Course } from '../types';
import { MapPin, Calendar, Star, CheckCircle, Video, Book, ArrowRight, Share2 } from 'lucide-react';
import SocialShare from '../components/SocialShare';

const VendorShop: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [vendor, setVendor] = useState<VendorProfile | null>(null);
    const [vendorCourses, setVendorCourses] = useState<Course[]>([]);
    const [shareData, setShareData] = useState<{url: string, title: string} | null>(null);

    useEffect(() => {
        window.scrollTo(0, 0);
        const foundVendor = vendorProfiles.find(v => v.id === id);
        if (foundVendor) {
            setVendor(foundVendor);
            setVendorCourses(courses.filter(c => c.instructorId === id && c.status === 'published'));
        }
    }, [id]);

    if (!vendor) {
        return <div className="p-12 text-center text-gray-500">Boutique introuvable.</div>;
    }

    const primaryColor = vendor.themeConfig?.primaryColor || '#000000';
    const fontStyle = vendor.themeConfig?.font === 'serif' ? 'font-serif' : 'font-sans';

    return (
        <div className={`min-h-screen bg-white ${fontStyle}`}>
            {/* Banner */}
            <div className="h-64 md:h-80 w-full relative overflow-hidden bg-gray-900">
                {vendor.coverUrl ? (
                    <img src={vendor.coverUrl} className="w-full h-full object-cover opacity-80" />
                ) : (
                    <div className="w-full h-full bg-gradient-to-r from-gray-800 to-black" />
                )}
                <div className="absolute inset-0 bg-black/40" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative -mt-20 z-10">
                <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 flex flex-col md:flex-row gap-8 items-start border border-gray-100">
                    <img 
                        src={vendor.logoUrl} 
                        className="w-32 h-32 rounded-2xl border-4 border-white shadow-lg object-cover bg-white" 
                        alt={vendor.shopName}
                    />
                    <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                                    {vendor.shopName}
                                    {vendor.isVerified && <CheckCircle size={24} className="text-blue-500" fill="white" />}
                                </h1>
                                <p className="text-gray-500 mt-2 max-w-2xl">{vendor.description}</p>
                            </div>
                            <div className="flex gap-3">
                                <button 
                                    onClick={() => setShareData({ url: window.location.href, title: vendor.shopName })}
                                    className="p-3 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-600"
                                >
                                    <Share2 size={20} />
                                </button>
                                <button 
                                    className="px-6 py-3 rounded-xl font-bold text-white shadow-lg transition-transform hover:scale-105"
                                    style={{backgroundColor: primaryColor}}
                                >
                                    Contacter
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-6 mt-6 pt-6 border-t border-gray-100 text-sm text-gray-500">
                            <div className="flex items-center gap-2">
                                <MapPin size={16} /> Togo, Lomé
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar size={16} /> Membre depuis {vendor.joinedDate}
                            </div>
                            <div className="flex items-center gap-2 text-yellow-500 font-bold">
                                <Star size={16} fill="currentColor" /> 4.9/5 (120 avis)
                            </div>
                            <div className="flex items-center gap-2 font-bold text-brand-black">
                                <Book size={16} /> {vendorCourses.length} Formations
                            </div>
                        </div>
                    </div>
                </div>

                {/* Products Grid */}
                <div className="mt-16 pb-20">
                    <h2 className="text-2xl font-bold mb-8 flex items-center gap-2 border-b border-gray-100 pb-4">
                        Formations disponibles 
                        <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">{vendorCourses.length}</span>
                    </h2>
                    
                    {vendorCourses.length > 0 ? (
                        <div className="grid md:grid-cols-3 gap-8">
                            {vendorCourses.map(course => (
                                <Link to={`/product/${course.id}`} key={course.id} className="group bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col">
                                    <div className="h-48 relative overflow-hidden">
                                        <img src={course.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        <div className="absolute top-3 left-3 bg-black/70 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                            {course.category}
                                        </div>
                                    </div>
                                    <div className="p-6 flex-1 flex flex-col">
                                        <h3 className="font-bold text-lg mb-2 text-gray-900 group-hover:text-blue-600 transition-colors">{course.title}</h3>
                                        <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-1">{course.description}</p>
                                        <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                            <span className="font-bold text-xl text-brand-black">{course.price.toLocaleString()} F</span>
                                            <span className="text-sm font-bold text-blue-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                                Voir <ArrowRight size={14} />
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-gray-50 rounded-2xl border border-gray-200 border-dashed">
                            <p className="text-gray-400 font-bold">Aucune formation publiée pour le moment.</p>
                        </div>
                    )}
                </div>
            </div>

            {shareData && (
                <SocialShare url={shareData.url} title={shareData.title} onClose={() => setShareData(null)} />
            )}
        </div>
    );
};

export default VendorShop;
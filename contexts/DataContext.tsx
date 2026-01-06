
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Course, Sale, Post, User, Module, ContactMessage, Testimonial, AppNotification, VendorProfile, PayoutRequest, Review, Coupon } from '../types';
import { courses as initialCourses, posts as initialPosts, salesHistory as initialSales, testimonials as initialTestimonials, vendorProfiles, payoutRequests as initialPayouts } from '../services/mockData';
import { notifyUserSupportReply, notifyAdminPayoutRequest } from '../services/notificationService';

interface Enrollment {
  userId: string;
  courseId: string;
  completedLessonIds: string[];
  lastAccessed: string;
}

// Extension de l'interface Coupon pour inclure les nouvelles fonctionnalités
export interface EnhancedCoupon extends Coupon {
  name: string;
  type: 'percentage' | 'fixed';
  limitToProducts: boolean;
  selectedProductIds: string[];
  hasMaxUsage: boolean;
  maxUsage?: number;
  usage: number;
  isScheduled: boolean;
  startDate?: string;
  endDate?: string;
}

interface DataContextType {
  courses: Course[];
  posts: Post[];
  sales: Sale[];
  enrollments: Enrollment[];
  messages: ContactMessage[];
  testimonials: Testimonial[];
  notifications: AppNotification[];
  payouts: PayoutRequest[];
  coupons: EnhancedCoupon[];
  addCourse: (course: Course) => void;
  updateCourse: (course: Course) => void;
  deleteCourse: (id: string) => void;
  addPost: (post: Post) => void;
  updatePost: (id: string, content: string) => void;
  deletePost: (id: string) => void;
  togglePinPost: (id: string) => void;
  completePurchase: (userId: string, courseId: string, paymentMethod: string) => void;
  enrollUser: (userId: string, courseId: string) => void;
  markLessonComplete: (userId: string, courseId: string, lessonId: string) => void;
  getStudentCourses: (userId: string) => (Course & { progress: number, lastAccessed: string })[];
  getCourseProgress: (userId: string, courseId: string) => { completedLessonIds: string[], percentage: number };
  isEnrolled: (userId: string, courseId: string) => boolean;
  addMessage: (msg: Omit<ContactMessage, 'id' | 'date' | 'isRead'>) => void;
  markMessageRead: (id: string) => void;
  replyToMessage: (id: string, reply: string) => void;
  addTestimonial: (test: Omit<Testimonial, 'id' | 'status' | 'date'>) => void;
  moderateTestimonial: (id: string, status: 'approved' | 'rejected') => void;
  addNotification: (userId: string, title: string, message: string, type?: AppNotification['type']) => void;
  markNotificationRead: (id: string) => void;
  requestPayout: (vendorId: string, vendorName: string, amount: number, method: any, details: string) => void;
  addReviewReply: (courseId: string, reviewId: string, replyText: string) => void;
  addCoupon: (coupon: EnhancedCoupon) => void;
  deleteCoupon: (id: string) => void;
  toggleCouponStatus: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [courses, setCourses] = useState<Course[]>(() => {
    const saved = localStorage.getItem('kadjolo_db_courses');
    return saved ? JSON.parse(saved) : initialCourses;
  });

  const [posts, setPosts] = useState<Post[]>(() => {
    const saved = localStorage.getItem('kadjolo_db_posts');
    return saved ? JSON.parse(saved) : initialPosts;
  });

  const [sales, setSales] = useState<Sale[]>(() => {
    const saved = localStorage.getItem('kadjolo_db_sales');
    return saved ? JSON.parse(saved) : initialSales;
  });

  const [enrollments, setEnrollments] = useState<Enrollment[]>(() => {
    const saved = localStorage.getItem('kadjolo_db_enrollments');
    return saved ? JSON.parse(saved) : [];
  });

  const [messages, setMessages] = useState<ContactMessage[]>(() => {
    const saved = localStorage.getItem('kadjolo_db_messages');
    return saved ? JSON.parse(saved) : [];
  });

  const [testimonials, setTestimonials] = useState<Testimonial[]>(() => {
    const saved = localStorage.getItem('kadjolo_db_testimonials');
    return saved ? JSON.parse(saved) : initialTestimonials.map(t => ({...t, status: 'approved', date: '2023-10-01'}));
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('kadjolo_db_notifications');
    return saved ? JSON.parse(saved) : [];
  });

  const [payouts, setPayouts] = useState<PayoutRequest[]>(() => {
    const saved = localStorage.getItem('kadjolo_db_payouts');
    return saved ? JSON.parse(saved) : initialPayouts;
  });

  const [coupons, setCoupons] = useState<EnhancedCoupon[]>(() => {
    const saved = localStorage.getItem('kadjolo_db_coupons');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => localStorage.setItem('kadjolo_db_courses', JSON.stringify(courses)), [courses]);
  useEffect(() => localStorage.setItem('kadjolo_db_posts', JSON.stringify(posts)), [posts]);
  useEffect(() => localStorage.setItem('kadjolo_db_sales', JSON.stringify(sales)), [sales]);
  useEffect(() => localStorage.setItem('kadjolo_db_enrollments', JSON.stringify(enrollments)), [enrollments]);
  useEffect(() => localStorage.setItem('kadjolo_db_messages', JSON.stringify(messages)), [messages]);
  useEffect(() => localStorage.setItem('kadjolo_db_testimonials', JSON.stringify(testimonials)), [testimonials]);
  useEffect(() => localStorage.setItem('kadjolo_db_notifications', JSON.stringify(notifications)), [notifications]);
  useEffect(() => localStorage.setItem('kadjolo_db_payouts', JSON.stringify(payouts)), [payouts]);
  useEffect(() => localStorage.setItem('kadjolo_db_coupons', JSON.stringify(coupons)), [coupons]);

  const addCourse = (course: Course) => setCourses(prev => [course, ...prev]);
  const updateCourse = (updatedCourse: Course) => setCourses(prev => prev.map(c => c.id === updatedCourse.id ? updatedCourse : c));
  const deleteCourse = (id: string) => setCourses(prev => prev.filter(c => c.id !== id));
  
  const addPost = (post: Post) => setPosts(prev => [post, ...prev]);
  const updatePost = (id: string, content: string) => setPosts(prev => prev.map(p => p.id === id ? { ...p, content, isEdited: true } : p));
  const deletePost = (id: string) => setPosts(prev => prev.filter(p => p.id !== id));
  const togglePinPost = (id: string) => setPosts(prev => prev.map(p => p.id === id ? { ...p, isPinned: !p.isPinned } : p));
  
  const completePurchase = (userId: string, courseId: string, paymentMethod: string) => {
    const course = courses.find(c => c.id === courseId);
    if (!course) return;

    enrollUser(userId, courseId);

    const vendor = vendorProfiles.find(v => v.id === course.instructorId) || vendorProfiles[0];
    const amount = course.promoPrice || course.price;
    const platformFee = Math.round(amount * (vendor.commissionRate / 100));
    const netEarnings = amount - platformFee;

    const newSale: Sale = {
      id: `s_${Date.now()}`,
      studentName: userId.startsWith('u_') ? 'Nouvel Étudiant' : userId,
      courseTitle: course.title,
      courseId: course.id,
      vendorId: course.instructorId,
      amount,
      platformFee,
      netEarnings,
      currency: 'XOF',
      date: new Date().toISOString().split('T')[0],
      status: 'completed',
      paymentMethod
    };

    setSales(prev => [newSale, ...prev]);
    addNotification(course.instructorId || 'v1', 'Nouvelle Vente !', `Vous avez vendu "${course.title}" pour ${amount} F.`, 'success');
  };

  const enrollUser = (userId: string, courseId: string) => {
    if (!isEnrolled(userId, courseId)) {
      setEnrollments(prev => [...prev, { userId, courseId, completedLessonIds: [], lastAccessed: new Date().toISOString() }]);
    }
  };

  const isEnrolled = (userId: string, courseId: string) => enrollments.some(e => e.userId === userId && e.courseId === courseId);

  const markLessonComplete = (userId: string, courseId: string, lessonId: string) => {
    setEnrollments(prev => prev.map(e => {
      if (e.userId === userId && e.courseId === courseId) {
        const updatedCompleted = e.completedLessonIds.includes(lessonId) ? e.completedLessonIds : [...e.completedLessonIds, lessonId];
        return { ...e, completedLessonIds: updatedCompleted, lastAccessed: new Date().toISOString() };
      }
      return e;
    }));
  };

  const getCourseProgress = (userId: string, courseId: string) => {
    const enrollment = enrollments.find(e => e.userId === userId && e.courseId === courseId);
    const course = courses.find(c => c.id === courseId);
    if (!enrollment || !course) return { completedLessonIds: [], percentage: 0 };
    const totalLessons = course.modules?.reduce((acc, m) => acc + m.lessons.length, 0) || 0;
    const percentage = totalLessons > 0 ? Math.round((enrollment.completedLessonIds.length / totalLessons) * 100) : 0;
    return { completedLessonIds: enrollment.completedLessonIds, percentage };
  };

  const getStudentCourses = (userId: string) => {
    return enrollments.filter(e => e.userId === userId).map(e => {
      const course = courses.find(c => c.id === e.courseId);
      if (!course) return null;
      return { ...course, progress: getCourseProgress(userId, course.id).percentage, lastAccessed: e.lastAccessed };
    }).filter(Boolean) as (Course & { progress: number, lastAccessed: string })[];
  };

  const addMessage = (msg: Omit<ContactMessage, 'id' | 'date' | 'isRead'>) => {
    const newMessage: ContactMessage = { 
      ...msg, 
      id: `msg_${Date.now()}`, 
      date: new Date().toISOString().split('T')[0], 
      isRead: false 
    };
    setMessages(prev => [newMessage, ...prev]);
    addNotification('admin', 'Nouveau Ticket Support', `De ${msg.name} : ${msg.subject}`, 'info');
  };

  const markMessageRead = (id: string) => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, isRead: true } : m));
  };

  const replyToMessage = (id: string, reply: string) => {
    const originalMsg = messages.find(m => m.id === id);
    setMessages(prev => prev.map(m => m.id === id ? { ...m, replyText: reply, isRead: true } : m));
    
    if (originalMsg) {
      if (originalMsg.senderId) {
        addNotification(
          originalMsg.senderId, 
          'Réponse Administration', 
          `L'administration a répondu à votre ticket : "${originalMsg.subject}"`, 
          'success'
        );
      }
      notifyUserSupportReply(originalMsg.email, originalMsg.subject, reply);
    }
    
    addNotification('admin', 'Réponse Envoyée', `Votre réponse à ${originalMsg?.name} a été transmise.`, 'success');
  };

  const addTestimonial = (test: Omit<Testimonial, 'id' | 'status' | 'date'>) => {
    const newTest: Testimonial = { ...test, id: `test_${Date.now()}`, status: 'pending', date: new Date().toISOString().split('T')[0] };
    setTestimonials(prev => [newTest, ...prev]);
    addNotification('admin', 'Nouveau Témoignage', `De ${test.name} en attente de modération.`, 'info');
  };

  const moderateTestimonial = (id: string, status: 'approved' | 'rejected') => {
    setTestimonials(prev => prev.map(t => t.id === id ? { ...t, status } : t));
  };

  const addNotification = (userId: string, title: string, message: string, type: AppNotification['type'] = 'info') => {
    const newNotif: AppNotification = {
      id: `notif_${Date.now()}`,
      userId,
      title,
      message,
      type,
      isRead: false,
      createdAt: new Date().toISOString()
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const requestPayout = (vendorId: string, vendorName: string, amount: number, method: any, details: string) => {
    const newPayout: PayoutRequest = {
      id: `p_${Date.now()}`,
      vendorId,
      vendorName,
      amount,
      method,
      details,
      requestDate: new Date().toISOString().split('T')[0],
      status: 'pending',
      feeDeducted: Math.round(amount * 0.01) // 1% fee for processing
    };
    setPayouts(prev => [newPayout, ...prev]);
    notifyAdminPayoutRequest(vendorName, amount, method);
    addNotification(vendorId, 'Demande de retrait transmise', `Votre demande de ${amount} F est en cours de traitement.`, 'info');
    addNotification('admin', 'Nouvelle demande de retrait', `${vendorName} demande un retrait de ${amount} F.`, 'warning');
  };

  const addReviewReply = (courseId: string, reviewId: string, replyText: string) => {
    setCourses(prev => prev.map(c => {
      if (c.id === courseId && c.reviews) {
        return {
          ...c,
          reviews: c.reviews.map(r => r.id === reviewId ? { ...r, isReplied: true, replyText } : r)
        };
      }
      return c;
    }));
  };

  const addCoupon = (coupon: EnhancedCoupon) => setCoupons(prev => [coupon, ...prev]);
  const deleteCoupon = (id: string) => setCoupons(prev => prev.filter(c => c.id !== id));
  const toggleCouponStatus = (id: string) => setCoupons(prev => prev.map(c => c.id === id ? { ...c, isActive: !c.isActive } : c));

  return (
    <DataContext.Provider value={{
      courses, posts, sales, enrollments, messages, testimonials, notifications, payouts, coupons,
      addCourse, updateCourse, deleteCourse, addPost, updatePost, deletePost, togglePinPost, completePurchase,
      enrollUser, markLessonComplete, getStudentCourses, getCourseProgress, isEnrolled,
      addMessage, markMessageRead, replyToMessage, addTestimonial, moderateTestimonial,
      addNotification, markNotificationRead, requestPayout, addReviewReply,
      addCoupon, deleteCoupon, toggleCouponStatus
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within a DataProvider');
  return context;
};

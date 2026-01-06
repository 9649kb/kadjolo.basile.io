
import { User, Post, Course, VendorProfile, Testimonial, Sale, SupportTicket, CreatorStats, AdminGlobalStats, LiveSession, PayoutRequest, NewsItem, AffiliateLink, MarketingAsset, PaymentMethodConfig, Transaction, Coupon, ActivityLog, SiteSettings, AdminReport, SystemLog, AdminLog, CommissionRecord, RewardRule, ChatMessage, WorkflowRule, Review, Popup, Banner } from '../types';
import { notifyAdminPayoutRequest, notifyNewProduct } from './notificationService';

// Site configuration for global settings
export const siteConfig = {
  adminName: 'Kadjolo Basile',
  email: 'contact@kadjolo.com',
  phone: '+228 96495419',
  location: 'Kara, Togo',
  profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&w=300&h=300',
  socials: {
    youtube: 'https://youtube.com/@KADJOLOBasile',
    facebook: 'https://facebook.com/kadjolo',
    instagram: 'https://instagram.com/kadjolo',
    tiktok: 'https://tiktok.com/@kadjolo'
  }
};

// Default admin user
export const currentUser: User = {
  id: 'u1',
  name: 'Kadjolo Basile',
  avatar: siteConfig.profilePicture,
  role: 'admin',
  email: siteConfig.email,
  isFounder: true,
  permissions: ['manage_users', 'manage_finance', 'manage_content', 'manage_team', 'manage_settings'],
  balance: 500000,
  affiliateCode: 'FOUNDER01',
  joinedAt: '2023-01-01',
  twoFactorEnabled: true
};

// Mock courses data
export const courses: Course[] = [
  {
    id: 'c1',
    title: 'Intelligence Financière 101',
    instructor: 'Kadjolo Basile',
    instructorId: 'v1',
    price: 25000,
    promoPrice: 15000,
    image: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?fit=crop&w=800&q=80',
    category: 'Finance',
    rating: 4.8,
    students: 1250,
    isPremium: true,
    type: 'course',
    status: 'published',
    visibility: 'public',
    hostingMode: 'internal',
    createdAt: '2023-05-10',
    description: 'Apprenez les bases de la gestion d\'argent.',
    shortDescription: 'Maîtrisez vos finances personnelles.',
    modules: []
  },
  {
    id: 'c2',
    title: 'Mindset de Champion',
    instructor: 'Kadjolo Basile',
    instructorId: 'v1',
    price: 50000,
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?fit=crop&w=800&q=80',
    category: 'Mindset',
    rating: 4.9,
    students: 800,
    isPremium: true,
    type: 'course',
    status: 'published',
    visibility: 'public',
    hostingMode: 'internal',
    createdAt: '2023-06-15',
    description: 'Développez une mentalité d\'acier.',
    shortDescription: 'Forgez votre esprit pour le succès.',
    modules: []
  }
];

// Mock community posts
export const posts: Post[] = [
  {
    id: 'p1',
    author: currentUser,
    content: "Le succès n'est pas une destination, c'est un voyage.",
    likes: 120,
    comments: 15,
    timestamp: 'Il y a 2h',
    likedByMe: false
  }
];

// Mock vendor profiles
export const vendorProfiles: VendorProfile[] = [
  {
    id: 'v1',
    userId: 'u1',
    shopName: 'Elite Business Academy',
    description: 'Formations de haut niveau pour entrepreneurs.',
    logoUrl: siteConfig.profilePicture,
    isVerified: true,
    joinedDate: '2023-01-01',
    status: 'active',
    commissionRate: 10,
    walletBalance: 150000,
    pendingBalance: 50000,
    totalRevenue: 2000000,
    totalCommissionPaid: 200000,
    kycStatus: 'verified'
  }
];

// Mock live sessions
export const liveSessions: LiveSession[] = [
  {
    id: 'l1',
    creatorId: 'u1',
    creatorName: 'Kadjolo Basile',
    creatorAvatar: siteConfig.profilePicture,
    status: 'live',
    viewers: 150,
    likes: 450,
    config: {
      title: 'Session Q&A Business',
      description: 'Posez toutes vos questions sur l\'entrepreneuriat.',
      price: 0,
      isPremium: false,
      replayPolicy: 'all',
      quality: '720p',
      chatEnabled: true,
      streamSource: 'webcam',
      guestInviteEnabled: true
    }
  }
];

// Mock testimonials
export const testimonials: Testimonial[] = [
  {
    id: 't1',
    name: 'Jean D.',
    role: 'Entrepreneur',
    content: 'Cette formation a changé ma vie !',
    avatar: 'https://picsum.photos/100/100?random=1',
    rating: 5
  }
];

// Mock coupons
export const mockCoupons: Coupon[] = [
  {
    id: 'cp1',
    code: 'WELCOME10',
    discountType: 'percentage',
    discountValue: 10,
    isActive: true
  }
];

// Mock payout requests
export const payoutRequests: PayoutRequest[] = [
  {
    id: 'pr1',
    vendorId: 'v1',
    vendorName: 'Kadjolo Basile',
    amount: 100000,
    method: 'mobile_money',
    details: '+228 90000000',
    requestDate: '2023-10-01',
    status: 'paid',
    feeDeducted: 1000,
    processedDate: '2023-10-02'
  },
  {
    id: 'pr2',
    vendorId: 'v1',
    vendorName: 'Kadjolo Basile',
    amount: 50000,
    method: 'mobile_money',
    details: '+228 90000000',
    requestDate: '2023-10-25',
    status: 'pending',
    feeDeducted: 500
  }
];

// Mock workflow rules
export const mockWorkflowRules: WorkflowRule[] = [
  {
    id: 'wr1',
    name: 'Auto-Welcome',
    trigger: 'sale_created',
    action: 'send_email',
    isActive: true,
    executionCount: 50
  }
];

// Mock reviews
export const mockReviews: Review[] = [
  {
    id: 'r1',
    rating: 5,
    comment: 'Excellent contenu !',
    date: '2023-09-20',
    authorName: 'Alice'
  }
];

// Mock news items
export const newsItems: NewsItem[] = [
  {
    id: 'n1',
    title: 'Nouveau programme de mentorat',
    content: 'Nous lançons un programme exclusif.',
    type: 'announcement',
    date: '2023-10-15',
    isPinned: true
  }
];

// Global payment methods configuration
export const globalPaymentMethods: PaymentMethodConfig[] = [
  {
    id: 'pm1',
    name: 'TMoney',
    type: 'mobile_money',
    integrationMode: 'manual',
    isActive: true,
    instructions: 'Envoyez les fonds au 96495419',
    requiresProof: true,
    color: '#0047AB',
    textColor: '#FFFFFF'
  },
  {
    id: 'pm2',
    name: 'PayPal',
    type: 'paypal',
    integrationMode: 'api_simulated',
    isActive: true,
    color: '#003087',
    textColor: '#FFFFFF'
  }
];

// Admin global statistics
export const adminGlobalStats: AdminGlobalStats = {
  totalPlatformRevenue: 500000,
  totalSalesVolume: 5000000,
  totalVendors: 10,
  totalCourses: 45,
  activeStudents: 15000,
  pendingPayouts: 1
};

// Admin logs
export const adminLogs: AdminLog[] = [
  {
    id: 'al1',
    adminName: 'Admin',
    action: 'Login',
    details: 'Admin logged in',
    timestamp: '2023-10-20'
  }
];

// Sales history data
export const salesHistory: Sale[] = [
  {
    id: 's1',
    studentName: 'Marc',
    courseTitle: 'Mindset de Champion',
    amount: 50000,
    platformFee: 5000,
    netEarnings: 45000,
    currency: 'XOF',
    date: '2023-10-18',
    status: 'completed',
    paymentMethod: 'TMoney',
    vendorId: 'v1'
  }
];

// Commission records
export const commissionRecords: CommissionRecord[] = [
  {
    id: 'cr1',
    saleId: 's1',
    courseTitle: 'Mindset de Champion',
    vendorId: 'v1',
    vendorName: 'Kadjolo Basile',
    totalAmount: 50000,
    adminAmount: 5000,
    vendorAmount: 45000,
    rateApplied: 10,
    date: '2023-10-18'
  }
];

// Financial service mock
export const financialService = {
  requestPayout: async (vendorId: string, amount: number, method: string, details: string) => {
    console.log(`[FINANCE] Payout requested for ${vendorId}: ${amount} via ${method}`);
    await notifyAdminPayoutRequest(vendorId, amount, method);
    return { success: true };
  }
};

// Marketing popups
export const mockPopups: Popup[] = [
  {
    id: 'pop1',
    name: 'Offre Bienvenue',
    title: 'Cadeau de Bienvenue 🎁',
    message: 'Profitez de -15% sur votre première commande avec le code HELLO15.',
    ctaText: 'Utiliser maintenant',
    ctaUrl: '/courses',
    trigger: 'delay',
    delaySeconds: 5,
    isActive: true,
    backgroundColor: '#2563eb',
    textColor: '#ffffff'
  }
];

// Marketing banners
export const mockBanners: Banner[] = [
  {
    id: 'ban1',
    name: 'Promo Été',
    text: '🚀 C\'est les soldes ! Profitez de -50% sur toutes nos formations business aujourd\'hui.',
    ctaText: 'Voir les offres',
    ctaUrl: '/courses',
    isActive: true,
    backgroundColor: '#000000',
    textColor: '#ffffff'
  }
];



import { User, Post, Course, VendorProfile, Testimonial, Sale, SupportTicket, CreatorStats, AdminGlobalStats, LiveSession, PayoutRequest, NewsItem, AffiliateLink, MarketingAsset } from '../types';

// CENTRALIZED CONFIGURATION
export const siteConfig = {
  adminName: 'KADJOLO BASILE',
  email: 'basilekadjolo4@gmail.com',
  phone: '+228 96495419',
  location: 'Togo, Kara',
  profilePicture: 'https://images.unsplash.com/photo-1531384441138-2736e62e0919?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60', 
  socials: {
    facebook: 'https://www.facebook.com/share/1FYheGA3BV/',
    youtube: 'https://youtube.com/@tech-astuces3?si=3fPsryc13SovikDe',
    instagram: 'https://www.instagram.com/basilekadjolo?igsh=MW9tbTdrbmJnMDNmeA==',
    tiktok: 'https://www.tiktok.com/@kadjolo.basile.officiel'
  } as const,
  heroText: {
    title: "Révélez votre Potentiel.",
    subtitle: "Dominez votre Marché.",
    description: "Bienvenue sur l'espace officiel de KADJOLO BASILE. Formations d'élite, communauté privée et ressources exclusives pour entrepreneurs ambitieux."
  }
};

export const currentUser: User = {
  id: 'u1',
  name: siteConfig.adminName, 
  avatar: siteConfig.profilePicture,
  role: 'admin', 
  email: siteConfig.email,
  isFounder: true, // YOU ARE THE FOUNDER
  permissions: ['manage_vendors', 'manage_team', 'view_finance', 'moderate_content', 'manage_live']
};

export const systemAdmins: User[] = [
  currentUser,
  { 
    id: 'admin2', 
    name: 'Responsable Technique', 
    avatar: 'https://picsum.photos/200/200?random=99', 
    role: 'admin', 
    email: 'tech@kadjolo.com',
    isFounder: false,
    permissions: ['moderate_content', 'manage_vendors'] // Limited Admin (Cannot see finance or add admins)
  },
  { 
    id: 'admin3', 
    name: 'Responsable Finance', 
    avatar: 'https://picsum.photos/200/200?random=98', 
    role: 'admin', 
    email: 'finance@kadjolo.com',
    isFounder: false,
    permissions: ['view_finance'] // Only Finance
  }
];

// Mock Vendor Payment Configuration
const defaultPaymentConfig = {
  mobileMoney: {
    tmoney: '+228 90 00 00 00',
    flooz: '+228 99 00 00 00',
    wave: '+225 07 00 00 00 00',
    mtn: '+229 01 00 00 00'
  },
  international: {
    paypalEmail: 'paiement@kadjolo.com',
    stripePublicKey: 'pk_test_mock'
  },
  crypto: {
    enabled: true,
    usdtAddress: 'TRC20...ADDRESS...MOCK',
    btcAddress: 'BTC...ADDRESS...MOCK'
  },
  bank: {
    enabled: true,
    iban: 'TG00 0000 0000 0000 0000',
    bankName: 'Orabank Togo'
  }
};

export const vendorProfiles: VendorProfile[] = [
  {
    id: 'v1',
    userId: 'u1',
    shopName: 'KADJOLO Official Store',
    description: 'La boutique officielle. Retrouvez ici toutes mes méthodes exclusives pour réussir votre business et votre mindset.',
    logoUrl: siteConfig.profilePicture,
    isVerified: true,
    isTopSeller: true,
    joinedDate: 'Jan 2023',
    status: 'active',
    commissionRate: 10,
    canStream: true,
    totalSales: 2450,
    totalRevenue: 4500000,
    totalCommissionPaid: 450000,
    walletBalance: 250000, // Remaining balance to withdraw
    kycStatus: 'verified',
    paymentConfig: defaultPaymentConfig,
    themeConfig: {
      primaryColor: '#000000',
      style: 'bold'
    }
  },
  {
    id: 'v2',
    userId: 'u2',
    shopName: 'Digital Success Academy',
    description: 'Expert en marketing digital et freelance. J\'aide les créateurs à vivre de leur passion.',
    logoUrl: 'https://picsum.photos/200/200?random=50',
    isVerified: true,
    isTopSeller: false,
    joinedDate: 'Mars 2023',
    status: 'active',
    commissionRate: 10,
    canStream: true,
    totalSales: 120,
    totalRevenue: 600000,
    totalCommissionPaid: 60000,
    walletBalance: 50000,
    kycStatus: 'verified',
    paymentConfig: { ...defaultPaymentConfig, crypto: { enabled: false }, bank: { enabled: false } },
    themeConfig: {
      primaryColor: '#2563eb',
      style: 'modern'
    }
  },
  {
    id: 'v3',
    userId: 'u3',
    shopName: 'Crypto Elite',
    description: 'Analyses techniques et fondamentales.',
    logoUrl: 'https://picsum.photos/200/200?random=51',
    isVerified: false,
    isTopSeller: false,
    joinedDate: 'Avril 2023',
    status: 'blocked',
    commissionRate: 10,
    canStream: false,
    totalSales: 0,
    totalRevenue: 0,
    totalCommissionPaid: 0,
    walletBalance: 0,
    kycStatus: 'rejected'
  }
];

export const payoutRequests: PayoutRequest[] = [
  {
    id: 'pr1',
    vendorId: 'v2',
    vendorName: 'Digital Success Academy',
    amount: 150000,
    method: 'mobile_money',
    details: '+228 90 90 90 90 (TMoney)',
    requestDate: '2023-10-25',
    status: 'pending'
  },
  {
    id: 'pr2',
    vendorId: 'v1',
    vendorName: 'KADJOLO Official Store',
    amount: 500000,
    method: 'bank',
    details: 'TG00...009',
    requestDate: '2023-10-20',
    processedDate: '2023-10-21',
    status: 'paid'
  }
];

export const testimonials: Testimonial[] = [
  {
    id: 't1',
    name: 'Jean-Pierre K.',
    role: 'Entrepreneur E-commerce',
    content: "Grâce aux conseils de Basile, j'ai doublé mon chiffre d'affaires en 3 mois.",
    avatar: 'https://picsum.photos/100/100?random=20',
    rating: 5
  },
  {
    id: 't2',
    name: 'Amina D.',
    role: 'Coach de Vie',
    content: "La formation sur le leadership a été un déclic.",
    avatar: 'https://picsum.photos/100/100?random=21',
    rating: 5
  },
];

export const posts: Post[] = [
  {
    id: 'p1',
    author: { id: 'admin', name: siteConfig.adminName, avatar: siteConfig.profilePicture, role: 'admin', email: siteConfig.email },
    content: "L'échec n'est qu'une étape vers le succès. Écoutez ce message vocal pour la motivation du jour !",
    image: 'https://picsum.photos/800/400',
    audioUrl: 'mock-audio.mp3',
    attachmentType: 'audio',
    likes: 1240,
    comments: 45,
    timestamp: 'Il y a 2 heures',
    likedByMe: false
  },
];

// --- NEW CREATOR STUDIO MOCK DATA ---

// Calculating Mock Sales Data based on 10% commission
const totalRev = 4589000;
const commission = totalRev * 0.10;

export const creatorStats: CreatorStats = {
  totalSales: 24500,
  revenue: totalRev, 
  commissionPaid: commission,
  students: 1205,
  monthlyGrowth: 12.5,
  conversionRate: 3.8,
  totalClicks: 15420
};

export const adminGlobalStats: AdminGlobalStats = {
  totalPlatformRevenue: commission * 1.5, // Total commissions collected
  totalSalesVolume: totalRev * 1.5, // GMV
  totalVendors: 14,
  totalCourses: 45,
  activeStudents: 5400,
  pendingPayouts: 1
};

export const salesHistory: Sale[] = [
  { id: 's1', studentName: 'Alice Koffi', courseTitle: 'Leadership Absolu', amount: 10000, currency: 'XOF', platformFee: 1000, netEarnings: 9000, date: '2023-10-24', status: 'completed', paymentMethod: 'Mobile Money', paymentProvider: 'Flooz', transactionId: 'TX12345' },
  { id: 's2', studentName: 'Marc T.', courseTitle: 'Les 10 Piliers', amount: 5000, currency: 'XOF', platformFee: 500, netEarnings: 4500, date: '2023-10-23', status: 'completed', paymentMethod: 'Mobile Money', paymentProvider: 'TMoney', transactionId: 'TX67890' },
  { id: 's3', studentName: 'Jean D.', courseTitle: 'Leadership Absolu', amount: 10000, currency: 'XOF', platformFee: 1000, netEarnings: 9000, date: '2023-10-23', status: 'completed', paymentMethod: 'Mobile Money', paymentProvider: 'Wave', transactionId: 'TX11223' },
  { id: 's4', studentName: 'Eric M.', courseTitle: 'Crypto Master', amount: 50000, currency: 'XOF', platformFee: 5000, netEarnings: 45000, date: '2023-10-22', status: 'verifying', paymentMethod: 'Crypto', paymentProvider: 'USDT (TRC20)', transactionId: 'TX44556' },
  { id: 's5', studentName: 'Sophie L.', courseTitle: 'Freelance Pro', amount: 25000, currency: 'XOF', platformFee: 2500, netEarnings: 22500, date: '2023-10-21', status: 'completed', paymentMethod: 'Card', paymentProvider: 'Visa', transactionId: 'TX77889' },
];

export const supportTickets: SupportTicket[] = [
  { 
    id: 'st1', 
    studentName: 'Paul Amegbo', 
    studentAvatar: 'https://picsum.photos/50/50?random=100', 
    lastMessage: 'Je n\'arrive pas à télécharger le module 3.', 
    unreadCount: 2, 
    status: 'open', 
    timestamp: '10:30',
    messages: [
      { id: 'm1', user: 'Paul Amegbo', text: 'Bonjour, le lien PDF semble brisé.', timestamp: '10:25' },
      { id: 'm2', user: 'Paul Amegbo', text: 'Je n\'arrive pas à télécharger le module 3.', timestamp: '10:30' }
    ]
  },
  { 
    id: 'st2', 
    studentName: 'Sarah M.', 
    studentAvatar: 'https://picsum.photos/50/50?random=101', 
    lastMessage: 'Merci, problème résolu !', 
    unreadCount: 0, 
    status: 'resolved', 
    timestamp: 'Hier',
    messages: []
  }
];

export const courses: Course[] = [
  {
    id: 'c1',
    title: 'Leadership Absolu : Devenez Incontournable',
    instructor: siteConfig.adminName,
    instructorId: 'v1',
    price: 19700,
    promoPrice: 14700,
    currency: 'XOF',
    image: 'https://picsum.photos/400/250?random=1',
    category: 'Business',
    rating: 4.9,
    students: 1205,
    isPremium: true,
    type: 'course',
    description: 'Une formation vidéo complète de 12 modules pour maîtriser les aspects fondamentaux du leadership moderne.',
    level: 'expert',
    hasCertificate: true,
    status: 'published',
    hostingMode: 'internal',
    createdAt: '2023-09-15',
    modules: [
      {
        id: 'm1', title: 'Introduction au Mindset', lessons: [
          { id: 'l1', title: 'Bienvenue', type: 'video', contentUrl: 'https://youtu.be/xxx', isExternal: true, duration: '05:00', hostingType: 'external' },
          { id: 'l2', title: 'Le mythe du talent', type: 'video', contentUrl: '', duration: '12:00', hostingType: 'internal' }
        ]
      },
      {
        id: 'm2', title: 'Communication d\'Impact', lessons: [
          { id: 'l3', title: 'La règle des 3 secondes', type: 'video', contentUrl: '', duration: '15:30', hostingType: 'internal' },
          { id: 'l4', title: 'Support PDF', type: 'pdf', contentUrl: '', duration: '3 pages', hostingType: 'internal' }
        ]
      }
    ],
    reviews: [
      {
        id: 'r1',
        userId: 'u3',
        userName: 'Marc Dupont',
        userAvatar: 'https://picsum.photos/50/50?random=1',
        rating: 5,
        comment: "Excellente formation. J'ai appliqué les conseils dès la première semaine.",
        date: "12 Oct 2023",
        reply: "Merci Marc ! Ravi de voir tes progrès."
      }
    ]
  },
  {
    id: 'eb1',
    title: 'Les 10 Piliers de la Richesse (E-Book)',
    instructor: siteConfig.adminName,
    instructorId: 'v1',
    price: 5000,
    currency: 'XOF',
    image: 'https://picsum.photos/300/450?random=10', 
    category: 'Finance',
    rating: 4.8,
    students: 3400,
    isPremium: false,
    type: 'ebook',
    description: 'Le guide ultime au format PDF. 250 pages de stratégies financières applicables immédiatement.',
    status: 'published',
    hostingMode: 'internal',
    createdAt: '2023-08-10',
    reviews: []
  },
  {
    id: 'c2_pub',
    title: 'Devenir Freelance en 30 Jours',
    instructor: 'Digital Success Academy',
    instructorId: 'v2',
    price: 50000,
    currency: 'XOF',
    image: 'https://picsum.photos/400/250?random=22', 
    category: 'Freelance',
    rating: 0,
    students: 0,
    isPremium: true,
    type: 'course',
    description: 'Une méthode pas à pas pour générer ses premiers revenus en ligne depuis l\'Afrique.',
    status: 'published', // PUBLISHED IMMEDIATELY
    hostingMode: 'external',
    createdAt: '2023-10-25',
    reviews: []
  }
];

export const liveSessions: LiveSession[] = [
  {
    id: 'live1',
    creatorId: 'u1',
    creatorName: siteConfig.adminName,
    creatorAvatar: siteConfig.profilePicture,
    status: 'live',
    viewers: 1542,
    likes: 850,
    revenue: 125000,
    config: {
      title: "Masterclass: Les Secrets du E-commerce 2024",
      description: "Session exclusive pour répondre à toutes vos questions.",
      price: 0,
      isPremium: false,
      replayPolicy: 'public',
      quality: '1080p',
      chatEnabled: true,
      streamSource: 'webcam'
    }
  },
  {
    id: 'live2',
    creatorId: 'u2',
    creatorName: 'Digital Success Academy',
    creatorAvatar: 'https://picsum.photos/200/200?random=50',
    status: 'ended',
    viewers: 0,
    likes: 420,
    revenue: 50000,
    config: {
      title: "Coaching Privé : Analyse de Boutique",
      description: "Replay disponible pour les étudiants.",
      price: 5000,
      isPremium: true,
      replayPolicy: 'students_only',
      quality: '720p',
      chatEnabled: true,
      streamSource: 'external',
      externalStreamUrl: 'https://youtube.com/live/xxxx'
    }
  }
];

export const newsItems: NewsItem[] = [
  {
    id: 'n1',
    title: 'Nouveau record de vente ! 🚀',
    content: "Félicitations à notre formateur Marc qui vient de dépasser les 500 000 FCFA de ventes cette semaine. La persévérance paie toujours. Rejoignez-nous pour atteindre les mêmes sommets.",
    type: 'success_story',
    date: '2023-11-05',
    isPinned: true,
    mediaUrl: 'https://picsum.photos/800/500?random=88'
  },
  {
    id: 'n2',
    title: 'Promotion Spéciale : Pack Freelance',
    content: "Profitez de -50% sur toutes les formations de la catégorie Freelance jusqu'à ce dimanche. Code : FREELANCE50",
    type: 'promotion',
    date: '2023-11-04',
    mediaUrl: 'https://picsum.photos/800/400?random=89'
  },
  {
    id: 'n3',
    title: 'Mise à jour de la plateforme',
    content: "Nous avons intégré les paiements par Chariow et Flutterwave pour faciliter vos transactions internationales. Tout est désormais disponible dans vos paramètres vendeur.",
    type: 'new_feature',
    date: '2023-11-01',
  }
];

export const mockAffiliateLinks: AffiliateLink[] = [
  {
    id: 'lnk1',
    productId: 'c1',
    productName: 'Leadership Absolu',
    url: 'https://kadjolo.com/#/product/c1?ref=u1',
    clicks: 1250,
    conversions: 45,
    commissionEarned: 202500,
    isActive: true
  },
  {
    id: 'lnk2',
    productId: 'eb1',
    productName: 'E-Book Richesse',
    url: 'https://kadjolo.com/#/product/eb1?ref=u1',
    clicks: 3400,
    conversions: 120,
    commissionEarned: 60000,
    isActive: true
  }
];

export const mockMarketingAssets: MarketingAsset[] = [
  {
    id: 'ma1',
    type: 'banner',
    title: 'Bannière Carrée Promo',
    url: 'https://picsum.photos/1080/1080?random=1',
    format: '1080x1080',
    downloadCount: 120
  },
  {
    id: 'ma2',
    type: 'story',
    title: 'Story Instagram Dynamique',
    url: 'https://picsum.photos/1080/1920?random=2',
    format: '9:16',
    downloadCount: 85
  },
  {
    id: 'ma3',
    type: 'text',
    title: 'Script Facebook Ads (Convertisseur)',
    content: "🔥 STOP ! Ne scrollez pas plus loin. Si vous voulez doubler vos revenus en 30 jours, lisez ceci...",
    format: 'Text',
    url: '',
    downloadCount: 230
  }
];
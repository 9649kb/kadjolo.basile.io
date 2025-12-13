
import { User, Post, Course, VendorProfile, Testimonial, Sale, SupportTicket, CreatorStats, AdminGlobalStats, LiveSession, PayoutRequest, NewsItem, AffiliateLink, MarketingAsset, PaymentMethodConfig, Transaction, Coupon, ActivityLog, SiteSettings, AdminReport, SystemLog, AdminLog, CommissionRecord, RewardRule, ChatMessage } from '../types';
import { notifyAdminPayoutRequest, notifyNewProduct } from './notificationService'; // IMPORT ADDED

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

export const mockSiteSettings: SiteSettings = {
  siteName: 'KADJOLO BASILE Marketplace',
  commissionRate: 10, // --- COMMISSION AUTOMATIQUE 10% ---
  currency: 'XOF',
  maintenanceMode: false,
  allowNewRegistrations: true,
  autoApproveCourses: false, // Changed to false to demonstrate moderation
  supportEmail: 'contact@kadjolo.com',
  adminPaymentAccounts: []
};

// RESTART FROM ZERO: Standard Admin User WITH FOUNDER FLAG
export const currentUser: User = {
  id: 'u1',
  name: siteConfig.adminName, 
  avatar: siteConfig.profilePicture,
  role: 'admin', 
  email: siteConfig.email,
  permissions: ['manage_users', 'manage_finance', 'manage_content', 'manage_team', 'manage_settings'],
  isFounder: true, // MANDATORY ACCESS FLAG
  balance: 0,
  affiliateCode: 'KADJOLO228',
  joinedAt: new Date().toISOString(),
  twoFactorEnabled: true
};

export const teamMembers: User[] = [
  currentUser 
];

// --- MOCK REWARD RULES ---
export const mockRewardRules: RewardRule[] = [
  {
    id: 'reward_1',
    name: 'Club Millionnaire',
    description: 'Atteindre 1 Million FCFA de chiffre d\'affaires cumulé.',
    type: 'revenue',
    threshold: 1000000,
    rewardType: 'badge_vip',
    rewardValue: 'Badge "Millionnaire" + Coaching 30min',
    icon: 'Crown',
    color: 'bg-yellow-500'
  },
  {
    id: 'reward_2',
    name: 'Top Vendeur (100 Ventes)',
    description: 'Réaliser 100 ventes de produits sur la plateforme.',
    type: 'sales_count',
    threshold: 100,
    rewardType: 'bonus_cash',
    rewardValue: 50000,
    icon: 'Trophy',
    color: 'bg-purple-600'
  },
  {
    id: 'reward_3',
    name: 'Prime d\'Excellence',
    description: 'Atteindre 5 Millions FCFA de CA.',
    type: 'revenue',
    threshold: 5000000,
    rewardType: 'gift_physical',
    rewardValue: 'iPhone 15 ou Équivalent',
    icon: 'Gift',
    color: 'bg-red-600'
  }
];

export const systemAdmins: User[] = teamMembers;

export const adminReports: AdminReport[] = [];

export const systemLogs: SystemLog[] = [];

export const adminLogs: AdminLog[] = [];

// MOCK DATA: Historique des commissions pour visualisation immédiate
export const commissionRecords: CommissionRecord[] = [
  {
    id: 'comm_1',
    saleId: 'sale_99',
    courseTitle: 'Formation E-commerce Pro',
    vendorId: 'v2',
    vendorName: 'Jean Vendeur',
    totalAmount: 25000,
    adminAmount: 2500, // 10%
    vendorAmount: 22500,
    rateApplied: 10,
    date: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 'comm_2',
    saleId: 'sale_98',
    courseTitle: 'Pack Trading Débutant',
    vendorId: 'v2',
    vendorName: 'Jean Vendeur',
    totalAmount: 10000,
    adminAmount: 1000, // 10%
    vendorAmount: 9000,
    rateApplied: 10,
    date: new Date(Date.now() - 172800000).toISOString()
  }
];

// --- DYNAMIC PAYMENT METHODS (ENRICHED) ---
export const globalPaymentMethods: PaymentMethodConfig[] = [
  {
    id: 'pm1',
    name: 'TMoney',
    type: 'mobile_money',
    integrationMode: 'manual',
    instructions: 'Envoyez le montant exact au 90 00 00 00 (Compte Principal KADJOLO). Mettez votre nom en référence.',
    isActive: true,
    requiresProof: true,
    color: '#FFD700',
    textColor: '#000000',
    logoUrl: 'https://togocom.tg/wp-content/uploads/2020/11/tmoney.png',
    providerCode: 'tmoney'
  },
  {
    id: 'pm2',
    name: 'Flooz',
    type: 'mobile_money',
    integrationMode: 'manual',
    instructions: 'Envoyez le montant au 99 00 00 00 (Compte Principal KADJOLO). Frais de retrait à votre charge.',
    isActive: true,
    requiresProof: true,
    color: '#0000FF',
    textColor: '#FFFFFF',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/22/Moov_Africa_logo.png',
    providerCode: 'flooz'
  },
  {
    id: 'pm3',
    name: 'Orange Money',
    type: 'mobile_money',
    integrationMode: 'manual',
    instructions: 'Transfert OM vers le +228 00 00 00 00.',
    isActive: true,
    requiresProof: true,
    color: '#FF7900',
    textColor: '#FFFFFF',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Orange_logo.svg/1200px-Orange_logo.svg.png',
    providerCode: 'orange'
  },
  {
    id: 'pm4',
    name: 'Wave',
    type: 'mobile_money',
    integrationMode: 'manual',
    instructions: 'Envoyez via l\'application Wave au numéro indiqué.',
    isActive: true,
    requiresProof: true,
    color: '#1DC0F1',
    textColor: '#FFFFFF',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Wave_logo.svg/1200px-Wave_logo.svg.png',
    providerCode: 'wave'
  },
  {
    id: 'pm5',
    name: 'PayPal',
    type: 'paypal',
    integrationMode: 'api_simulated',
    isActive: true,
    color: '#003087',
    textColor: '#FFFFFF',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg',
    providerCode: 'paypal'
  },
  {
    id: 'pm6',
    name: 'Carte Bancaire (Stripe)',
    type: 'card',
    integrationMode: 'api_simulated',
    isActive: true,
    color: '#635BFF',
    textColor: '#FFFFFF',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Stripe_Logo%2C_revised_2016.svg/2560px-Stripe_Logo%2C_revised_2016.svg.png',
    providerCode: 'stripe'
  },
  {
    id: 'pm7',
    name: 'Western Union',
    type: 'manual',
    integrationMode: 'manual',
    instructions: 'Bénéficiaire : KADJOLO BASILE, Ville : Kara, Pays : Togo. Envoyez le MTCN.',
    isActive: false,
    requiresProof: true,
    color: '#FFDA00',
    textColor: '#000000',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Western_Union_logo.svg/2560px-Western_Union_logo.svg.png',
    providerCode: 'wu'
  },
  {
    id: 'pm8',
    name: 'Bitcoin / Crypto',
    type: 'crypto',
    integrationMode: 'manual',
    instructions: 'Adresse USDT (TRC20) : T9xxxxxxxxxxxxxxxx. Envoyez le hash de transaction.',
    isActive: false,
    requiresProof: true,
    color: '#F7931A',
    textColor: '#FFFFFF',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/1200px-Bitcoin.svg.png',
    providerCode: 'btc'
  },
  {
    id: 'pm9',
    name: 'Virement Bancaire',
    type: 'bank',
    integrationMode: 'manual',
    instructions: 'IBAN : TGxx xxxx xxxx... BIC : xxxx. Veuillez mentionner le numéro de commande.',
    isActive: false,
    requiresProof: true,
    color: '#374151',
    textColor: '#FFFFFF',
    providerCode: 'bank'
  }
];

export const vendorActivityLogs: ActivityLog[] = [];

// RESTART FROM ZERO: Main Vendor Profile Reset
export const vendorProfiles: VendorProfile[] = [
  {
    id: 'v1',
    userId: 'u1',
    email: 'basilekadjolo4@gmail.com',
    shopName: 'KADJOLO Official Store',
    description: 'La boutique officielle.',
    logoUrl: siteConfig.profilePicture,
    coverUrl: '',
    isVerified: true,
    isTopSeller: true, // Example of already top seller
    joinedDate: new Date().toLocaleDateString(),
    status: 'active',
    commissionRate: 10,
    canStream: true,
    totalSales: 150, // Matches condition for reward
    totalRevenue: 1500000, // Matches condition for reward
    totalCommissionPaid: 150000, 
    walletBalance: 0, 
    pendingBalance: 0, 
    kycStatus: 'verified',
    withdrawalSettings: {
        mobileMoneyNumber: '',
        mobileMoneyProvider: 'TMoney',
        autoWithdrawalThreshold: 50000
    },
    themeConfig: {
      primaryColor: '#000000',
      style: 'business',
      font: 'sans'
    },
    activityLogs: [],
    receivedRewards: [] // Init empty
  },
  {
    id: 'v2',
    userId: 'u2',
    email: 'vendeur@test.com',
    shopName: 'Business Pro Académie',
    description: 'Formations business.',
    logoUrl: 'https://ui-avatars.com/api/?name=Business+Pro',
    isVerified: false,
    joinedDate: new Date().toLocaleDateString(),
    status: 'active',
    commissionRate: 10,
    totalSales: 12,
    totalRevenue: 120000,
    totalCommissionPaid: 12000,
    walletBalance: 50000,
    pendingBalance: 0,
    kycStatus: 'verified',
    receivedRewards: []
  }
];

export const mockCoupons: Coupon[] = [];

export const payoutRequests: PayoutRequest[] = [];

export const testimonials: Testimonial[] = [];

export const posts: Post[] = [];

// --- CREATOR STUDIO MOCK DATA (RESET) ---

export const creatorStats: CreatorStats = {
  totalSales: 0, 
  revenue: 0, 
  commissionPaid: 0, 
  students: 0, 
  monthlyGrowth: 0, 
  conversionRate: 0, 
  totalClicks: 0 
};

export const adminGlobalStats: AdminGlobalStats = {
  totalPlatformRevenue: 3500, // Pre-filled with mock commissions
  totalSalesVolume: 35000,
  totalVendors: 2, 
  totalCourses: 0,
  activeStudents: 0,
  pendingPayouts: 0
};

export const salesHistory: Sale[] = []; 

export const mockTransactions: Transaction[] = []; 

// ADDED: Support Tickets Mock Data
export const supportTickets: SupportTicket[] = [
  {
    id: 'ticket_1',
    studentName: 'Alice Etudiante',
    studentAvatar: 'https://ui-avatars.com/api/?name=Alice',
    lastMessage: 'Je n\'arrive pas à accéder au module 3 de la formation Business.',
    unreadCount: 1,
    status: 'open',
    timestamp: new Date().toISOString(),
    messages: [
      { id: 'm1', user: 'Alice Etudiante', text: 'Bonjour, j\'ai payé mais le module 3 reste bloqué. Pouvez-vous m\'aider ?', timestamp: new Date(Date.now() - 3600000).toISOString() }
    ]
  },
  {
    id: 'ticket_2',
    studentName: 'Jean Vendeur',
    studentAvatar: 'https://ui-avatars.com/api/?name=Jean',
    lastMessage: 'Quand est-ce que mon retrait sera validé ?',
    unreadCount: 0,
    status: 'resolved',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    messages: [
      { id: 'm1', user: 'Jean Vendeur', text: 'Demande faite hier. Je suis pressé.', timestamp: 'Hier' },
      { id: 'm2', user: 'Support', text: 'Bonjour Jean, c\'est validé ce matin. Vous devriez recevoir les fonds d\'ici 1h.', timestamp: 'Aujourd\'hui', isSender: true }
    ]
  },
  {
    id: 'ticket_3',
    studentName: 'Marc Dubos',
    studentAvatar: 'https://ui-avatars.com/api/?name=Marc',
    lastMessage: 'Erreur lors du paiement PayPal',
    unreadCount: 1,
    status: 'open',
    timestamp: new Date().toISOString(),
    messages: [
      { id: 'm1', user: 'Marc Dubos', text: 'Salut, j\'essaie de payer via PayPal mais ça tourne en rond.', timestamp: new Date().toISOString() }
    ]
  }
];

// --- SUPPORT SERVICE ---
export const supportService = {
  getTickets: () => supportTickets,
  
  replyToTicket: (ticketId: string, text: string, adminName: string) => {
    const ticket = supportTickets.find(t => t.id === ticketId);
    if (!ticket) return;

    const newMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      user: adminName,
      text,
      timestamp: new Date().toISOString(),
      isSender: true,
      isModerator: true
    };

    ticket.messages.push(newMessage);
    ticket.lastMessage = `Vous: ${text}`;
    ticket.unreadCount = 0; // Admin replied, read
    return ticket;
  },

  updateStatus: (ticketId: string, status: 'open' | 'resolved') => {
    const ticket = supportTickets.find(t => t.id === ticketId);
    if (ticket) ticket.status = status;
  },

  deleteTicket: (ticketId: string) => {
    const index = supportTickets.findIndex(t => t.id === ticketId);
    if (index !== -1) supportTickets.splice(index, 1);
  },

  markAsRead: (ticketId: string) => {
    const ticket = supportTickets.find(t => t.id === ticketId);
    if (ticket) ticket.unreadCount = 0;
  }
};

// ADDED: Courses with moderation status
export const courses: Course[] = [
  {
    id: 'c1',
    title: 'Devenir Freelance à Succès',
    price: 15000,
    instructor: 'KADJOLO Official Store',
    instructorId: 'v1',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'Business',
    rating: 4.8,
    students: 120,
    isPremium: true,
    type: 'course',
    status: 'published',
    visibility: 'public',
    hostingMode: 'internal',
    createdAt: new Date().toISOString(),
    description: "Apprenez toutes les ficelles du métier de freelance : de la prospection à la fidélisation client. Inclus : modèles de contrats et scripts de vente.",
    modules: [
      { id: 'm1', title: 'Introduction au Freelancing', lessons: [] },
      { id: 'm2', title: 'Trouver ses premiers clients', lessons: [] }
    ]
  },
  {
    id: 'c2',
    title: 'Crypto Trading Avancé',
    price: 50000,
    instructor: 'Business Pro Académie',
    instructorId: 'v2',
    image: 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'Finance',
    rating: 0,
    students: 0,
    isPremium: true,
    type: 'course',
    status: 'draft', // MOCKED AS PENDING REVIEW LOGICALLY
    visibility: 'private', 
    hostingMode: 'internal',
    createdAt: new Date().toISOString(),
    description: "Une formation complète pour comprendre le marché crypto. Attention, méthode agressive. Stratégies de Scalping et Day Trading sur Binance.",
    modules: [
      { id: 'm1', title: 'Les bases de la Blockchain', lessons: [] },
      { id: 'm2', title: 'Analyse Technique', lessons: [] }
    ]
  }
];

// --- CONTENT MODERATION SERVICE (NEW) ---
export const contentService = {
  getAllCourses: () => courses,
  
  getCourseById: (id: string) => courses.find(c => c.id === id),

  updateCourseStatus: async (courseId: string, status: 'published' | 'draft' | 'banned', reason?: string) => {
    const course = courses.find(c => c.id === courseId);
    if (!course) return;

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    course.status = status;
    
    // Log action
    adminLogs.unshift({
      id: `al_${Date.now()}`,
      adminName: 'Super Admin',
      action: `course_${status}`,
      details: `Cours "${course.title}" passé en statut : ${status}${reason ? ` (Raison: ${reason})` : ''}`,
      timestamp: new Date().toISOString(),
      ip: '127.0.0.1'
    });

    if (status === 'published') {
      await notifyNewProduct(course.title); 
    }
    
    return course;
  }
};

export const liveSessions: LiveSession[] = [];

export const newsItems: NewsItem[] = [];

export const mockAffiliateLinks: AffiliateLink[] = []; 

export const mockMarketingAssets: MarketingAsset[] = [];

// --- FINANCIAL SERVICE SIMULATION ---
export const financialService = {
  getCommissionRate: (vendorId: string) => {
    const vendor = vendorProfiles.find(v => v.id === vendorId);
    return vendor?.commissionRate || mockSiteSettings.commissionRate;
  },

  processSale: (productName: string, amount: number, vendorId: string, paymentMethod: string, txId?: string) => {
    const vendorIndex = vendorProfiles.findIndex(v => v.id === vendorId);
    if (vendorIndex === -1) return;
    const vendor = vendorProfiles[vendorIndex];

    const rate = financialService.getCommissionRate(vendorId);
    const commissionAmount = Math.round(amount * (rate / 100)); // AUTOMATIC 10% CALCULATION
    const netAmount = amount - commissionAmount;

    console.log(`[FINANCE] Traitement Vente: ${amount} | Comm (${rate}%): ${commissionAmount} | Net Vendeur: ${netAmount}`);
    console.log(`[FINANCE CENTRALISEE] 100% des fonds (${amount}) encaissés par le Fondateur. Solde vendeur crédité virtuellement.`);

    const newSale: Sale = {
      id: `sale-${Date.now()}`,
      studentName: 'Client Vérifié',
      courseTitle: productName,
      amount: amount,
      vendorId: vendorId, // SET VENDOR ID
      platformFee: commissionAmount,
      netEarnings: netAmount,
      currency: 'XOF',
      date: new Date().toISOString().split('T')[0],
      status: 'completed',
      paymentMethod: paymentMethod,
      transactionId: txId || `tx-${Math.random().toString(36).substr(2, 9)}`,
    };

    const newTransaction: Transaction = {
      id: `tx-${Date.now()}`,
      type: 'sale',
      amount: amount,
      feeAmount: commissionAmount,
      netAmount: netAmount,
      status: 'completed',
      date: new Date().toISOString(),
      description: `Vente: ${productName}`,
      vendorId: vendorId,
      paymentMethod: paymentMethod,
      referenceId: txId
    };

    salesHistory.unshift(newSale);
    mockTransactions.unshift(newTransaction);

    vendorProfiles[vendorIndex] = {
      ...vendor,
      totalSales: (vendor.totalSales || 0) + 1,
      totalRevenue: (vendor.totalRevenue || 0) + amount,
      totalCommissionPaid: (vendor.totalCommissionPaid || 0) + commissionAmount,
      walletBalance: (vendor.walletBalance || 0) + netAmount,
    };
    
    // UPDATE GLOBAL STATS FOR CENTRALIZED TREASURY
    adminGlobalStats.totalSalesVolume += amount; // Founder gets full cash
    adminGlobalStats.totalPlatformRevenue += commissionAmount; // Net profit tracking

    commissionRecords.unshift({
       id: `comm_${Date.now()}`,
       saleId: newSale.id,
       courseTitle: productName,
       vendorId: vendor.id,
       vendorName: vendor.shopName,
       totalAmount: amount,
       adminAmount: commissionAmount,
       vendorAmount: netAmount,
       rateApplied: rate,
       date: new Date().toISOString()
    });
  },

  // NEW: HANDLE WITHDRAWAL REQUEST AND NOTIFY
  requestPayout: async (vendorId: string, amount: number, method: string, details: string) => {
    const vendor = vendorProfiles.find(v => v.id === vendorId);
    if (!vendor) return { success: false, message: "Vendeur introuvable" };

    // Create Request
    const newRequest: PayoutRequest = {
        id: `pr_${Date.now()}`,
        vendorId: vendor.id,
        vendorName: vendor.shopName,
        amount: amount,
        method: method as any,
        details: details,
        requestDate: new Date().toISOString(),
        status: 'pending',
        feeDeducted: 0
    };

    payoutRequests.unshift(newRequest);
    adminGlobalStats.pendingPayouts += 1;

    // Trigger Notification
    await notifyAdminPayoutRequest(vendor.shopName, amount, method);

    // Log for Admin Dashboard
    adminLogs.unshift({
       id: `log_${Date.now()}`,
       adminName: 'SYSTEM',
       action: 'payout_request',
       details: `Demande de retrait de ${amount} par ${vendor.shopName}`,
       timestamp: new Date().toISOString(),
       ip: '127.0.0.1'
    });

    return { success: true };
  },

  processPayout: (requestId: string, adminNote?: string, txRef?: string) => {
    const reqIndex = payoutRequests.findIndex(r => r.id === requestId);
    if (reqIndex === -1) return;
    
    const request = payoutRequests[reqIndex];
    
    payoutRequests[reqIndex] = {
      ...request,
      status: 'paid',
      processedDate: new Date().toISOString(),
      adminNote: adminNote,
      transactionReference: txRef
    };

    const newTransaction: Transaction = {
      id: `payout-${Date.now()}`,
      type: 'payout',
      amount: request.amount,
      feeAmount: 0, 
      netAmount: -request.amount,
      status: 'completed',
      date: new Date().toISOString(),
      description: `Retrait vers ${request.details} (${request.method})`,
      vendorId: request.vendorId,
      referenceId: txRef
    };
    
    mockTransactions.unshift(newTransaction);
    
    adminGlobalStats.pendingPayouts = Math.max(0, adminGlobalStats.pendingPayouts - 1);
    
    adminLogs.unshift({
       id: `al_${Date.now()}`,
       adminName: 'SYSTEM',
       action: 'approved_payout',
       details: `Retrait de ${request.amount} validé pour ${request.vendorName}`,
       timestamp: new Date().toISOString(),
       ip: '127.0.0.1'
    });
  }
};

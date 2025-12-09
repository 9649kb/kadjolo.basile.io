

export interface User {
  id: string;
  name: string;
  avatar: string;
  role: 'student' | 'creator' | 'admin';
  email: string;
  isBanned?: boolean;
  isFounder?: boolean; // Only true for you
  permissions?: AdminPermission[]; // List of allowed tasks
}

export type AdminPermission = 
  | 'manage_vendors'   // Can block/unblock vendors
  | 'manage_team'      // Can add/remove other admins
  | 'view_finance'     // Can see global revenue
  | 'moderate_content' // Can delete courses/comments
  | 'manage_live';     // Can stop live streams

export interface Post {
  id: string;
  author: User;
  content: string;
  image?: string;
  audioUrl?: string; // For voice messages
  attachmentUrl?: string; // For files
  attachmentType?: 'image' | 'file' | 'audio';
  likes: number;
  comments: number;
  timestamp: string;
  likedByMe?: boolean;
}

export type PayoutStatus = 'pending' | 'processing' | 'paid' | 'rejected';

export interface PayoutRequest {
  id: string;
  vendorId: string;
  vendorName: string;
  amount: number;
  method: 'bank' | 'mobile_money' | 'crypto' | 'paypal';
  details: string; // Phone number or IBAN
  requestDate: string;
  processedDate?: string;
  status: PayoutStatus;
  adminNote?: string;
}

export interface VendorThemeConfig {
  primaryColor: string; // Hex code
  style: 'modern' | 'minimalist' | 'bold';
  bannerUrl?: string;
}

export interface VendorPaymentConfig {
  mobileMoney: {
    tmoney?: string;
    flooz?: string;
    mtn?: string;
    orange?: string;
    moov?: string;
    wave?: string;
    airtel?: string;
  };
  international: {
    paypalEmail?: string;
    stripePublicKey?: string;
    payoneerEmail?: string;
  };
  crypto: {
    btcAddress?: string;
    usdtAddress?: string; // TRC20 usually
    enabled: boolean;
  };
  bank: {
    iban?: string;
    swift?: string;
    bankName?: string;
    accountName?: string;
    enabled: boolean;
  };
  customLink?: string; // For external payment links
}

export interface VendorProfile {
  id: string;
  userId: string;
  shopName: string;
  description: string;
  logoUrl: string;
  coverUrl?: string;
  isVerified: boolean;
  isTopSeller?: boolean;
  joinedDate: string;
  status: 'active' | 'suspended' | 'blocked'; // Added blocked
  commissionRate: number; // Admin control (percentage, default 10)
  canStream?: boolean; // Admin control
  
  // Finance
  walletBalance: number; // Available for withdrawal
  totalRevenue: number; // Gross revenue
  totalCommissionPaid: number; // Platform fees paid
  totalSales?: number;
  kycStatus: 'pending' | 'verified' | 'rejected';
  
  paymentConfig?: VendorPaymentConfig; 
  facebookPixelId?: string; 
  themeConfig?: VendorThemeConfig; // NEW: Shop design
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  date: string;
  reply?: string; // Response from the seller
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  avatar: string;
  rating: number;
}

// --- NEW COURSE STRUCTURE TYPES ---

export interface Lesson {
  id: string;
  title: string;
  type: 'video' | 'audio' | 'pdf' | 'link' | 'zip'; // Added zip
  contentUrl: string;
  isExternal?: boolean; // True if YouTube/Vimeo/Drive
  duration?: string;
  isPreview?: boolean;
  hostingType?: 'internal' | 'external'; // Explicit hosting choice
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  instructor: string;
  instructorId?: string; 
  price: number;
  promoPrice?: number; // New: Promo pricing
  currency?: 'EUR' | 'USD' | 'XOF'; // New: Currency
  image: string;
  additionalImages?: string[]; // Multiple covers
  category: string;
  subCategory?: string;
  rating: number;
  students: number;
  isPremium: boolean;
  type: 'course' | 'ebook'; 
  description?: string; 
  shortDescription?: string;
  reviews?: Review[];
  // Legacy fields
  contentUrl?: string; 
  fileName?: string; 
  // New deep structure
  modules?: Module[];
  level?: 'beginner' | 'intermediate' | 'expert';
  hasCertificate?: boolean;
  skills?: string[];
  status: 'draft' | 'published' | 'deleted'; // Direct publishing
  hostingMode: 'internal' | 'external'; // New
  createdAt: string;
  // NEW: Traffic Analytics for Ads
  stats?: {
    views: number;
    clicks: number;
    sales: number;
    trafficSources: { source: 'facebook' | 'google' | 'tiktok' | 'direct'; count: number }[];
  };
}

export interface Sale {
  id: string;
  studentName: string;
  courseTitle: string;
  amount: number;
  platformFee: number; // 10%
  netEarnings: number; // 90%
  currency: string;
  date: string;
  status: 'completed' | 'pending' | 'refunded' | 'verifying'; 
  paymentMethod: string;
  paymentProvider?: string; // e.g., 'Binance', 'TMoney'
  transactionId?: string;
}

export interface SupportTicket {
  id: string;
  studentName: string;
  studentAvatar: string;
  lastMessage: string;
  unreadCount: number;
  status: 'open' | 'resolved';
  timestamp: string;
  messages: ChatMessage[];
}

export interface ChatMessage {
  id: string;
  user: string;
  avatar?: string;
  text: string;
  timestamp: string;
  isSender?: boolean; // For local user logic
  attachment?: { type: 'image' | 'file' | 'audio'; url: string; name: string };
  isModerator?: boolean;
}

export interface CreatorStats {
  totalSales: number;
  revenue: number;
  students: number;
  monthlyGrowth: number;
  conversionRate: number;
  commissionPaid: number;
  totalClicks?: number; // Added for Affiliate
}

export interface AdminGlobalStats {
  totalPlatformRevenue: number; // Only the commissions
  totalSalesVolume: number; // GMV
  totalVendors: number;
  totalCourses: number;
  activeStudents: number;
  pendingPayouts: number; // New
}

export interface Notification {
  id: string;
  type: 'email' | 'system';
  message: string;
  timestamp: string;
  read: boolean;
}

// --- NEW LIVE STREAMING TYPES ---

export type StreamQuality = '1080p' | '720p' | '480p' | '360p';
export type StreamSource = 'webcam' | 'external';

export interface LiveConfig {
  title: string;
  description: string;
  thumbnail?: string;
  price: number; // 0 for free
  isPremium: boolean;
  replayPolicy: 'public' | 'private' | 'students_only';
  quality: StreamQuality;
  chatEnabled: boolean;
  // Professional Options
  streamSource: StreamSource;
  externalStreamUrl?: string; // YouTube, Twitch, RTMP link
  guestInviteEnabled?: boolean;
  guestLink?: string;
}

export interface LiveSession {
  id: string;
  creatorId: string;
  creatorName: string;
  creatorAvatar: string;
  config: LiveConfig;
  status: 'scheduled' | 'live' | 'ended';
  viewers: number;
  likes: number;
  startedAt?: string;
  endedAt?: string;
  revenue?: number;
  activeProductId?: string; // New: For Live Shopping/Pinning
}

export interface YouTubeVideo {
  id: string;
  title: string;
  thumbnail: string;
  publishedAt: string;
  url: string;
  views?: string;
}

// --- NEW NEWS / ACTUALITÉS TYPES ---
export type NewsType = 'success_story' | 'announcement' | 'promotion' | 'new_feature' | 'info';

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  type: NewsType;
  mediaUrl?: string; // Image or Video URL
  date: string;
  isPinned?: boolean; // To keep at top
}

// --- NEW AFFILIATE TYPES ---
export interface AffiliateLink {
  id: string;
  productId: string;
  productName: string;
  url: string;
  clicks: number;
  conversions: number;
  commissionEarned: number;
  isActive: boolean;
}

export interface MarketingAsset {
  id: string;
  type: 'banner' | 'video' | 'text' | 'story';
  title: string;
  url: string; // Image url or video url
  content?: string; // For text scripts
  format?: '1080x1080' | '9:16' | 'Text';
  downloadCount: number;
}
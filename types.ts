
export interface User {
  id: string;
  name: string;
  avatar: string;
  role: 'student' | 'creator' | 'admin' | 'affiliate';
  email: string;
  isBanned?: boolean;
  isFounder?: boolean; 
  permissions?: AdminPermission[]; 
  balance?: number; 
  affiliateCode?: string;
  joinedAt?: string;
  twoFactorEnabled?: boolean; 
}

export type AdminPermission = 
  | 'manage_users'     
  | 'manage_finance'   
  | 'manage_content'   
  | 'manage_team'      
  | 'manage_settings'; 

export interface PaymentMethodConfig {
  id: string;
  name: string; 
  type: 'mobile_money' | 'card' | 'crypto' | 'bank' | 'paypal' | 'manual';
  integrationMode: 'manual' | 'api_simulated' | 'redirect_link'; 
  
  logoUrl?: string; 
  color?: string; 
  textColor?: string;
  
  isActive: boolean;
  instructions?: string; 
  requiresProof?: boolean; 
  
  redirectUrl?: string; 
  
  // Secure Credentials (usually not sent to front-end in full, but needed for admin edit)
  apiConfig?: {
    publicKey?: string;
    secretKey?: string; // Admin only
    merchantId?: string;
    environment?: 'sandbox' | 'production';
    webhookSecret?: string; // Admin only
  };
  
  providerCode?: string; 
}

// NEW: Reward Rule Interface
export interface RewardRule {
  id: string;
  name: string;
  description: string;
  type: 'revenue' | 'sales_count'; // Condition type
  threshold: number; // The value to reach (e.g. 1,000,000 FCFA)
  rewardType: 'bonus_cash' | 'gift_physical' | 'badge_vip';
  rewardValue: string | number; // e.g., "50000" (cash) or "iPhone 15" (gift)
  icon: string;
  color: string;
}

export interface VendorProfile {
  id: string;
  userId: string;
  email?: string; 
  shopName: string;
  description: string;
  logoUrl: string;
  coverUrl?: string;
  isVerified: boolean;
  isTopSeller?: boolean;
  joinedDate: string;
  status: 'active' | 'suspended' | 'blocked'; 
  commissionRate: number; 
  canStream?: boolean; 
  
  walletBalance: number; 
  pendingBalance: number; 
  totalRevenue: number; 
  totalCommissionPaid: number; 
  totalSales?: number;
  kycStatus: 'pending' | 'verified' | 'rejected';
  withdrawalSettings?: VendorWithdrawalSettings;
  
  facebookPixelId?: string; 
  themeConfig?: VendorThemeConfig; 
  activityLogs?: ActivityLog[];
  
  // NEW: Track rewards received
  receivedRewards?: string[]; // IDs of rewards already claimed
}

export interface VendorThemeConfig {
  primaryColor: string; 
  style: 'modern' | 'minimalist' | 'bold' | 'business' | 'creative';
  font?: 'sans' | 'serif' | 'mono';
  bannerUrl?: string;
}

export interface VendorWithdrawalSettings {
  mobileMoneyNumber?: string;
  mobileMoneyProvider?: 'TMoney' | 'Flooz' | 'Moov';
  paypalEmail?: string;
  bankDetails?: string;
  stripeConnectId?: string;
  autoWithdrawalThreshold?: number; 
}

export interface Course {
  id: string;
  title: string;
  subtitle?: string; // NEW
  instructor: string;
  instructorId?: string; 
  price: number;
  promoPrice?: number;
  currency?: 'EUR' | 'USD' | 'XOF';
  image: string;
  additionalImages?: string[];
  category: string;
  subCategory?: string;
  rating: number;
  students: number;
  isPremium: boolean;
  type: 'course' | 'ebook'; 
  description?: string; 
  shortDescription?: string; 
  reviews?: Review[];
  
  // Content Logic
  contentUrl?: string; 
  modules?: Module[]; 
  level?: 'beginner' | 'intermediate' | 'expert';
  hasCertificate?: boolean;
  skills?: string[];
  tags?: string[];
  language?: string; 
  
  // Admin/System
  status: 'draft' | 'published' | 'deleted' | 'banned' | 'private' | 'scheduled' | 'archived'; 
  visibility: 'public' | 'private' | 'unlisted'; // NEW
  scheduledDate?: string; 
  
  // Hosting
  hostingMode: 'internal' | 'external'; 
  externalSalesPageUrl?: string; 
  
  // Media Configuration (NEW)
  mediaConfig?: {
    videoUrl?: string;
    videoType?: 'upload' | 'youtube' | 'vimeo' | 'external_link';
    pdfUrl?: string;
    previewImage?: string;
  };

  // Versioning (NEW)
  version?: number;
  lastModified?: string;

  createdAt: string;
  updatedAt?: string;
  
  seo?: SEOConfig; 
  seoScore?: number; 
  
  affiliateEnabled?: boolean;
  affiliateCommission?: number; 

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
  studentEmail?: string; // NEW
  courseTitle: string;
  courseId?: string; // NEW
  vendorId?: string; // ADDED for filtering
  amount: number;
  platformFee: number; 
  netEarnings: number; 
  currency: string;
  date: string;
  status: 'completed' | 'pending' | 'refunded' | 'verifying'; 
  paymentMethod: string;
  paymentProvider?: string; 
  transactionId?: string;
  proofUrl?: string; 
  source?: string; 
}

export interface PayoutRequest {
  id: string;
  vendorId: string;
  vendorName: string;
  amount: number;
  method: PaymentMethodType;
  details: string; 
  bankDetails?: string; 
  mobileMoneyNumber?: string; 
  requestDate: string;
  processedDate?: string;
  status: PayoutStatus;
  adminNote?: string; 
  transactionReference?: string; 
  feeDeducted: number; 
}

// ... Keep existing interfaces ...
export interface Lesson {
  id: string;
  title: string;
  type: 'video' | 'audio' | 'pdf' | 'link' | 'zip' | 'quiz';
  contentUrl: string;
  isExternal?: boolean;
  duration?: string;
  isPreview?: boolean;
  hostingType?: 'internal' | 'external';
  fileSize?: string;
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface SEOConfig {
  metaTitle: string;
  metaDescription: string;
  ogImage?: string;
  keywords?: string[];
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  date: string;
  reply?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  avatar: string;
  rating: number;
  used?: boolean;
}

export interface Transaction {
  id: string;
  type: 'sale' | 'payout' | 'refund' | 'commission_fee';
  amount: number; 
  netAmount?: number; 
  feeAmount?: number; 
  status: 'completed' | 'pending' | 'failed';
  date: string;
  description: string;
  vendorId: string;
  paymentMethod?: string;
  referenceId?: string; 
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
  isSender?: boolean;
  attachment?: { type: 'image' | 'file' | 'audio'; url: string; name: string };
  isModerator?: boolean;
}

export interface CreatorStats {
  totalSales: number;
  revenue: number;
  commissionPaid: number;
  students: number;
  monthlyGrowth: number;
  conversionRate: number;
  totalClicks?: number; 
}

export interface AdminGlobalStats {
  totalPlatformRevenue: number;
  totalSalesVolume: number;
  totalVendors: number;
  totalCourses: number;
  activeStudents: number;
  pendingPayouts: number;
}

export interface AdminReport {
  date: string;
  sales: number;
  commission: number;
  payouts: number;
}

export interface Notification {
  id: string;
  type: 'email' | 'system';
  message: string;
  timestamp: string;
  read: boolean;
}

export type StreamQuality = '1080p' | '720p' | '480p' | '360p';
export type StreamSource = 'webcam' | 'external';

export interface LiveConfig {
  title: string;
  description: string;
  thumbnail?: string;
  price: number; 
  isPremium: boolean;
  replayPolicy: 'public' | 'private' | 'students_only';
  quality: StreamQuality;
  chatEnabled: boolean;
  streamSource: StreamSource;
  externalStreamUrl?: string;
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
  activeProductId?: string;
}

export interface YouTubeVideo {
  id: string;
  title: string;
  thumbnail: string;
  publishedAt: string;
  url: string;
  views?: string;
}

export type NewsType = 'success_story' | 'announcement' | 'promotion' | 'new_feature' | 'info' | 'vendor_news' | 'press_release';

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  type: NewsType;
  mediaUrl?: string;
  date: string;
  isPinned?: boolean;
  source?: string;
  externalLink?: string;
}

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
  url: string;
  content?: string;
  format?: '1080x1080' | '9:16' | 'Text';
  downloadCount: number;
}

export interface AdminPaymentAccount {
  id: string;
  methodName: string; 
  details: string; 
  isActive: boolean;
  type: 'crypto' | 'bank' | 'mobile' | 'card' | 'other';
}

export interface SiteSettings {
  siteName: string;
  commissionRate: number; 
  currency: 'XOF' | 'EUR' | 'USD';
  maintenanceMode: boolean;
  allowNewRegistrations: boolean;
  autoApproveCourses: boolean;
  supportEmail: string;
  adminPaymentAccounts?: AdminPaymentAccount[]; 
}

export interface Post {
  id: string;
  author: User;
  content: string;
  image?: string;
  audioUrl?: string;
  attachmentUrl?: string;
  attachmentType?: 'image' | 'file' | 'audio';
  likes: number;
  comments: number;
  timestamp: string;
  likedByMe?: boolean;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  vendorId: string;
  maxUses?: number;
  usedCount: number;
  expiresAt?: string;
  isActive: boolean;
}

export type PayoutStatus = 'pending' | 'processing' | 'paid' | 'rejected';
export type PaymentMethodType = 'mobile_money' | 'card' | 'crypto' | 'bank' | 'paypal' | 'manual';
export type PaymentIntegrationMode = 'manual' | 'api_simulated' | 'redirect_link';

export interface CommissionRecord {
  id: string;
  saleId: string;
  courseTitle: string;
  vendorId: string;
  vendorName: string;
  totalAmount: number;
  adminAmount: number; 
  vendorAmount: number; 
  rateApplied: number;
  date: string;
}

export interface ActivityLog {
  id: string;
  action: string;
  details: string;
  timestamp: string;
  ip?: string;
}

export interface AdminLog {
  id: string;
  adminName: string;
  action: string;
  targetId?: string;
  details: string;
  timestamp: string;
  ip: string;
}

export interface SystemLog {
  id: string;
  level: 'info' | 'warning' | 'error';
  message: string;
  user: string;
  timestamp: string;
}

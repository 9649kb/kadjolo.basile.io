
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

export interface Lead {
  id: string;
  email: string;
  source: string;
  status: 'new' | 'contacted' | 'converted' | 'lost';
  score: number; // 0-100
  joinedAt: string;
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
  apiConfig?: {
    publicKey?: string;
    secretKey?: string;
    merchantId?: string;
    environment?: 'sandbox' | 'production';
    webhookSecret?: string;
  };
  providerCode?: string; 
}

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  createdAt: string;
  link?: string;
}

export type AutomationTrigger = 'sale_created' | 'course_completed' | 'new_subscription' | 'lead_captured';
export type AutomationAction = 'send_email' | 'add_tag' | 'send_coupon' | 'notify_admin';

export interface WorkflowRule {
  id: string;
  name: string;
  trigger: AutomationTrigger;
  action: AutomationAction;
  targetId?: string; 
  isActive: boolean;
  executionCount: number;
}

export interface RewardRule {
  id: string;
  name: string;
  description: string;
  type: 'revenue' | 'sales_count'; 
  threshold: number; 
  rewardType: 'bonus_cash' | 'fixed' | 'gift_physical' | 'badge_vip';
  rewardValue: string | number;
  icon: string;
  color: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  timestamp: string;
  details?: string;
}

export interface SupportTicket {
  id: string;
  userId: string;
  subject: string;
  status: 'open' | 'closed' | 'pending';
  createdAt: string;
}

export interface CreatorStats {
  totalRevenue: number;
  totalSales: number;
  activeStudents: number;
}

export interface AffiliateLink {
  id: string;
  userId: string;
  courseId: string;
  code: string;
  clicks: number;
  sales: number;
}

export interface MarketingAsset {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'video' | 'document';
}

export interface SiteSettings {
  siteName: string;
  contactEmail: string;
  maintenanceMode: boolean;
}

export interface AdminReport {
  id: string;
  title: string;
  generatedAt: string;
  data: any;
}

export interface SystemLog {
  id: string;
  level: 'info' | 'warn' | 'error';
  message: string;
  timestamp: string;
}

export interface AdminLog {
  id: string;
  adminName: string;
  action: string;
  details: string;
  timestamp: string;
}

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
  receivedRewards?: string[];
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
  subtitle?: string;
  instructor: string;
  instructorId?: string; 
  price: number;
  promoPrice?: number;
  currency?: 'EUR' | 'XOF' | 'USD';
  image: string;
  additionalImages?: string[];
  category: string;
  subCategory?: string;
  rating: number;
  students: number;
  isPremium: boolean;
  type: 'course' | 'ebook' | 'service'; 
  description?: string; 
  shortDescription?: string; 
  reviews?: Review[];
  learningObjectives?: string[];
  requirements?: string[];
  targetAudience?: string[];
  features?: string[];
  contentUrl?: string; 
  modules?: Module[]; 
  level?: 'beginner' | 'intermediate' | 'expert';
  hasCertificate?: boolean;
  skills?: string[];
  tags?: string[];
  language?: string; 
  status: 'draft' | 'published' | 'deleted' | 'banned' | 'private' | 'scheduled' | 'archived'; 
  visibility: 'public' | 'private' | 'unlisted';
  scheduledDate?: string; 
  hostingMode: 'internal' | 'external'; 
  externalSalesPageUrl?: string; 
  mediaConfig?: {
    videoUrl?: string;
    videoType?: 'upload' | 'youtube' | 'vimeo' | 'external_link';
    pdfUrl?: string;
    previewImage?: string;
  };
  createdAt: string;
  updatedAt?: string;
  seo?: SEOConfig; 
  affiliateEnabled?: boolean;
  affiliateCommission?: number; 
  files?: any[];
  faq?: any[];
  customFields?: any[]; 
  bannerUrl?: string;
  settings?: any;
  pricingModel?: string;
}

export interface Sale {
  id: string;
  studentName: string;
  studentEmail?: string;
  courseTitle: string;
  courseId?: string;
  vendorId?: string;
  amount: number;
  platformFee: number; 
  netEarnings: number; 
  currency: string;
  date: string;
  status: 'completed' | 'pending' | 'refunded' | 'verifying'; 
  paymentMethod: string;
  transactionId?: string;
}

export interface PayoutRequest {
  id: string;
  vendorId: string;
  vendorName: string;
  amount: number;
  method: PaymentMethodType;
  details: string; 
  requestDate: string;
  status: PayoutStatus;
  feeDeducted: number; 
  processedDate?: string;
  adminNote?: string;
  transactionReference?: string;
}

export interface Lesson {
  id: string;
  title: string;
  type: 'video' | 'audio' | 'pdf' | 'link' | 'zip' | 'quiz';
  contentUrl: string;
  duration?: string;
  hostingType?: 'internal' | 'external' | 'youtube' | 'vimeo' | 'upload';
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface SEOConfig {
  metaTitle: string;
  metaDescription: string;
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  date: string;
  authorName?: string;
  courseTitle?: string;
  isReplied?: boolean;
  replyText?: string;
}

export interface Transaction {
  id: string;
  type: 'sale' | 'payout' | 'refund' | 'commission_fee' | 'withdrawal';
  amount: number; 
  feeAmount?: number;
  netAmount?: number;
  status: 'completed' | 'pending' | 'failed' | 'processing';
  date: string;
  description: string;
  vendorId: string;
  paymentMethod?: string;
  referenceId?: string;
}

export interface ChatMessage {
  id: string;
  user: string;
  text: string;
  timestamp: string;
  avatar?: string;
  isSender?: boolean;
  isModerator?: boolean;
}

export type PayoutStatus = 'pending' | 'processing' | 'paid' | 'rejected';
export type PaymentMethodType = 'mobile_money' | 'card' | 'crypto' | 'bank' | 'paypal' | 'manual';

export interface TextStyle {
  color?: string;
  fontFamily?: 'sans' | 'serif' | 'mono';
}

export interface Post {
  id: string;
  author: User;
  content: string;
  likes: number;
  comments: number;
  timestamp: string;
  likedByMe: boolean;
  image?: string;
  audioUrl?: string;
  attachmentType?: 'image' | 'audio' | 'file';
  attachmentUrl?: string;
  style?: TextStyle;
  isPinned?: boolean;
  isQuestion?: boolean;
  isEdited?: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  avatar: string;
  rating: number;
  status?: 'pending' | 'approved' | 'rejected';
  date?: string;
}

export interface ContactMessage {
  id: string;
  senderId?: string; 
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  isRead: boolean;
  replyText?: string;
  attachmentUrl?: string; 
}

export interface AdminGlobalStats {
  totalPlatformRevenue: number;
  totalSalesVolume: number;
  totalVendors: number;
  totalCourses: number;
  activeStudents: number;
  pendingPayouts: number;
}

export interface LiveSession {
  id: string;
  creatorId: string;
  creatorName: string;
  creatorAvatar: string;
  status: 'live' | 'ended';
  viewers: number;
  likes: number;
  config: LiveConfig;
  activeProductId?: string;
}

export interface LiveConfig {
  title: string;
  description: string;
  price: number;
  isPremium: boolean;
  replayPolicy: string;
  quality: string;
  chatEnabled: boolean;
  streamSource: 'webcam' | 'external';
  guestInviteEnabled: boolean;
  externalStreamUrl?: string;
}

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  type: NewsType;
  date: string;
  mediaUrl?: string;
  isPinned: boolean;
  source?: string;
  externalLink?: string;
}

export type NewsType = 'press_release' | 'announcement' | 'success_story' | 'promotion' | 'new_feature';

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  isActive: boolean;
  minPurchaseAmount?: number;
}

export interface Popup {
  id: string;
  name: string;
  title: string;
  message: string;
  ctaText: string;
  ctaUrl: string;
  trigger: 'load' | 'exit' | 'scroll' | 'delay';
  delaySeconds: number;
  isActive: boolean;
  backgroundColor: string;
  textColor: string;
  startDate?: string;
  endDate?: string;
}

export interface Banner {
  id: string;
  name: string;
  text: string;
  ctaText: string;
  ctaUrl: string;
  isActive: boolean;
  backgroundColor: string;
  textColor: string;
  startDate?: string;
  endDate?: string;
  openInNewTab?: boolean; // Nouvelle fonctionnalité
  autoTrack?: boolean; // Nouvelle fonctionnalité
  targetSpecificProducts?: boolean;
  selectedProductIds?: string[];
  hasDisplayDelay?: boolean;
  displayDelaySeconds?: number;
  hasFrequencyLimit?: boolean;
  frequency?: 'always' | 'once_per_visit' | 'once_per_day';
  hasDeviceTargeting?: boolean;
  targetedDevices?: ('mobile' | 'desktop')[];
  hasPageTargeting?: boolean;
  targetedPageIds?: string[];
  hasGeoTargeting?: boolean;
  targetedCountries?: string[];
  hasLanguageTargeting?: boolean;
  targetedLanguages?: string[];
  hasActivationPeriod?: boolean;
}

export interface Campaign {
  id: string;
  name: string;
  source: string;
  medium?: string;
  term?: string;
  content?: string;
  trackingLink: string;
  isActive: boolean;
  isArchived?: boolean;
  clicks: number;
  sales: number;
  revenue: number;
  budget?: number;
  targetSales?: number;
  createdAt: string;
  description?: string;
}

export interface YouTubeVideo {
  id: string;
  title: string;
  thumbnail: string;
  views: string;
  publishedAt: string;
  url: string;
}

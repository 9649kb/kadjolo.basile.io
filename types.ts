
export interface User {
  id: string;
  name: string;
  avatar: string;
  role: 'student' | 'creator' | 'admin';
  email: string;
}

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

export interface Course {
  id: string;
  title: string;
  instructor: string;
  instructorId?: string; // Link to vendor profile
  price: number;
  image: string;
  category: string;
  rating: number;
  students: number;
  isPremium: boolean;
  type: 'course' | 'ebook'; 
  description?: string; 
  reviews?: Review[];
}

export interface LiveSession {
  id: string;
  title: string;
  viewers: number;
  isActive: boolean;
  chat: ChatMessage[];
}

export interface ChatMessage {
  id: string;
  user: string;
  text: string;
  timestamp: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  type: 'ebook' | 'video' | 'service';
}

export interface CreatorStats {
  totalSales: number;
  revenue: number;
  students: number;
  monthlyGrowth: number;
}

export interface Notification {
  id: string;
  type: 'email' | 'system';
  message: string;
  timestamp: string;
  read: boolean;
}

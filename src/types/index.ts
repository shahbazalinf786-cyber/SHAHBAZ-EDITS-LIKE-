export type UserRole = 'user' | 'creator' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  channelId?: string;
  createdAt: string;
}

export type MonetizationStatus = 
  | 'not_eligible' 
  | 'eligible' 
  | 'pending' 
  | 'approved' 
  | 'rejected' 
  | 'suspended';

export interface PaymentRecord {
  id: string;
  date: string;
  amount: number;
  method: 'Stripe Direct' | 'Bank Wire' | 'PayPal Express';
  status: 'processed' | 'pending' | 'failed';
  invoiceId: string;
}

export interface MonetizationData {
  status: MonetizationStatus;
  appliedDate?: string;
  decisionDate?: string;
  reviewNotes?: string;
  applicantLegalName?: string;
  applicantCountry?: string;
  payoutMethod: 'Stripe Direct' | 'Bank Wire' | 'PayPal Express';
  payoutAccountInfo?: string;
  estimatedEarnings: number;
  finalizedEarnings: number;
  unpaidBalance: number;
  payoutThreshold: number;
  cpm: number;
  rpm: number;
  payments: PaymentRecord[];
}

export interface ChannelLink {
  title: string;
  url: string;
}

export interface Channel {
  id: string;
  userId: string;
  name: string;
  handle: string;
  avatar: string;
  banner: string;
  description: string;
  links: ChannelLink[];
  subscriberCount: number;
  totalViews: number;
  verified: boolean;
  monetization: MonetizationData;
  createdAt: string;
}

export type VideoVisibility = 'public' | 'unlisted' | 'private';

export interface Video {
  id: string;
  channelId: string;
  channelName: string;
  channelHandle: string;
  channelAvatar: string;
  channelVerified: boolean;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  duration: number; // in seconds
  formattedDuration: string;
  views: number;
  likes: number;
  dislikes: number;
  tags: string[];
  category: string;
  visibility: VideoVisibility;
  uploadDate: string;
  isShort?: boolean;
}

export interface Short {
  id: string;
  channelId: string;
  channelName: string;
  channelHandle: string;
  channelAvatar: string;
  channelVerified: boolean;
  title: string;
  description: string;
  videoUrl: string;
  soundTitle: string;
  soundArtist: string;
  views: number;
  likes: number;
  commentsCount: number;
  uploadDate: string;
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface CommunityPost {
  id: string;
  channelId: string;
  channelName: string;
  channelAvatar: string;
  channelHandle: string;
  channelVerified: boolean;
  type: 'text' | 'image' | 'poll';
  content: string;
  imageUrl?: string;
  pollOptions?: PollOption[];
  totalVotes?: number;
  userVotedOptionId?: string;
  likes: number;
  commentsCount: number;
  createdAt: string;
}

export interface Comment {
  id: string;
  targetType: 'video' | 'short' | 'post';
  targetId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  channelId?: string;
  content: string;
  likes: number;
  isLikedByMe?: boolean;
  replies?: Comment[];
  createdAt: string;
  isChannelOwner?: boolean;
}

export type NotificationType = 
  | 'subscriber' 
  | 'like' 
  | 'comment' 
  | 'reply' 
  | 'monetization' 
  | 'announcement';

export interface NotificationItem {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  avatar?: string;
  targetUrl?: string;
  isRead: boolean;
  createdAt: string;
}

export type ReportReason = 
  | 'spam' 
  | 'hate_speech' 
  | 'copyright' 
  | 'misinformation' 
  | 'harassment' 
  | 'other';

export interface ReportItem {
  id: string;
  targetType: 'video' | 'short' | 'comment' | 'channel';
  targetId: string;
  targetTitle: string;
  reportedByUserId: string;
  reportedByUserName: string;
  reason: ReportReason;
  details: string;
  status: 'pending' | 'resolved' | 'dismissed';
  actionTaken?: string;
  createdAt: string;
}

export interface AdminConfig {
  requiredSubscribers: number;
  requiredViews: number;
  qualificationDays: number;
  defaultRevenueSharePercent: number; // e.g. 55%
  minimumPayoutAmount: number; // e.g. $100
}

export type ActiveView = 
  | 'home' 
  | 'watch' 
  | 'shorts' 
  | 'channel' 
  | 'subscriptions' 
  | 'community' 
  | 'search' 
  | 'library' 
  | 'notifications' 
  | 'studio' 
  | 'monetization' 
  | 'admin';

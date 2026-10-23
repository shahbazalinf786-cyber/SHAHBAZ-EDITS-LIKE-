import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  User, 
  Channel, 
  Video, 
  Short, 
  CommunityPost, 
  Comment, 
  NotificationItem, 
  ReportItem, 
  AdminConfig, 
  ActiveView,
  MonetizationData,
  PaymentRecord
} from '../types';
import { 
  initialUsers, 
  initialChannels, 
  initialVideos, 
  initialShorts, 
  initialCommunityPosts, 
  initialComments, 
  initialNotifications, 
  initialReports, 
  initialAdminConfig 
} from '../lib/seedData';
import { getLocalItem, setLocalItem } from '../lib/storage';

interface AppContextType {
  // Theme
  isDarkMode: boolean;
  toggleTheme: () => void;

  // Navigation
  activeView: ActiveView;
  viewParam: string | null;
  navigateTo: (view: ActiveView, param?: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;

  // Authentication & Users
  currentUser: User | null;
  currentChannel: Channel | null;
  users: User[];
  login: (email: string, password?: string) => boolean;
  register: (name: string, email: string, password?: string) => boolean;
  googleSignIn: () => void;
  logout: () => void;
  switchUser: (userId: string) => void;
  updateProfile: (data: Partial<User>) => void;

  // Channels
  channels: Channel[];
  createChannel: (data: { name: string; handle: string; description: string; avatar?: string; banner?: string }) => Channel;
  updateChannel: (channelId: string, data: Partial<Channel>) => void;
  userSubscriptions: string[]; // channel ids
  toggleSubscribe: (channelId: string) => void;
  isSubscribed: (channelId: string) => boolean;

  // Videos
  videos: Video[];
  uploadVideo: (video: Omit<Video, 'id' | 'channelId' | 'channelName' | 'channelHandle' | 'channelAvatar' | 'channelVerified' | 'views' | 'likes' | 'dislikes' | 'uploadDate'>) => Video;
  updateVideo: (videoId: string, data: Partial<Video>) => void;
  deleteVideo: (videoId: string) => void;
  incrementVideoViews: (videoId: string) => void;
  toggleVideoLike: (videoId: string) => void;
  toggleVideoDislike: (videoId: string) => void;
  getVideoLikeState: (videoId: string) => 'like' | 'dislike' | null;
  
  // Library & Watch lists
  watchHistory: { videoId: string; watchedAt: string }[];
  watchLater: string[];
  toggleWatchLater: (videoId: string) => void;
  clearHistory: () => void;

  // Shorts
  shorts: Short[];
  uploadShort: (short: { title: string; description: string; videoUrl: string; soundTitle?: string; soundArtist?: string }) => Short;
  toggleShortLike: (shortId: string) => void;
  isShortLiked: (shortId: string) => boolean;
  incrementShortViews: (shortId: string) => void;

  // Community Posts
  posts: CommunityPost[];
  createPost: (post: { type: 'text' | 'image' | 'poll'; content: string; imageUrl?: string; pollOptions?: string[] }) => void;
  votePoll: (postId: string, optionId: string) => void;
  togglePostLike: (postId: string) => void;
  isPostLiked: (postId: string) => boolean;

  // Comments
  comments: Comment[];
  addComment: (targetType: 'video' | 'short' | 'post', targetId: string, content: string, parentId?: string) => void;
  editComment: (commentId: string, content: string) => void;
  deleteComment: (commentId: string) => void;
  toggleCommentLike: (commentId: string) => void;

  // Notifications
  notifications: NotificationItem[];
  unreadNotificationCount: number;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;

  // Reports
  reports: ReportItem[];
  submitReport: (targetType: 'video' | 'short' | 'comment' | 'channel', targetId: string, targetTitle: string, reason: any, details: string) => void;
  updateReportStatus: (reportId: string, status: 'resolved' | 'dismissed', actionTaken?: string) => void;

  // Admin & Monetization
  adminConfig: AdminConfig;
  updateAdminConfig: (config: Partial<AdminConfig>) => void;
  applyForMonetization: (channelId: string, applicantLegalName: string, applicantCountry: string, payoutMethod: any, payoutAccountInfo: string) => void;
  reviewMonetizationApplication: (channelId: string, decision: 'approved' | 'rejected', reviewNotes?: string) => void;
  simulateChannelGrowth: (channelId: string, deltaSubs: number, deltaViews: number) => void;

  // Modals state
  isUploadModalOpen: boolean;
  setIsUploadModalOpen: (open: boolean) => void;
  isShortUploadModalOpen: boolean;
  setIsShortUploadModalOpen: (open: boolean) => void;
  isCreatePostModalOpen: boolean;
  setIsCreatePostModalOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isChannelModalOpen: boolean;
  setIsChannelModalOpen: (open: boolean) => void;
  reportModalTarget: { type: 'video' | 'short' | 'comment' | 'channel'; id: string; title: string } | null;
  openReportModal: (type: 'video' | 'short' | 'comment' | 'channel', id: string, title: string) => void;
  closeReportModal: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Theme
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return getLocalItem('vp_theme', true);
  });

  useEffect(() => {
    setLocalItem('vp_theme', isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(prev => !prev);

  // Navigation
  const [activeView, setActiveView] = useState<ActiveView>('home');
  const [viewParam, setViewParam] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  const navigateTo = (view: ActiveView, param?: string) => {
    setActiveView(view);
    setViewParam(param || null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleSidebar = () => setIsSidebarCollapsed(prev => !prev);

  // Users & Auth
  const [users, setUsers] = useState<User[]>(() => getLocalItem('vp_users', initialUsers));
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const savedId = getLocalItem('vp_current_user_id', 'user_elena');
    const u = initialUsers.find(x => x.id === savedId) || initialUsers[0];
    return u;
  });

  // Channels
  const [channels, setChannels] = useState<Channel[]>(() => getLocalItem('vp_channels', initialChannels));
  const [userSubscriptions, setUserSubscriptions] = useState<string[]>(() => 
    getLocalItem('vp_subscriptions', ['channel_fjord_cinematics', 'channel_midnight_lofi'])
  );

  const currentChannel = channels.find(c => c.id === currentUser?.channelId) || null;

  // Videos & Shorts
  const [videos, setVideos] = useState<Video[]>(() => getLocalItem('vp_videos', initialVideos));
  const [shorts, setShorts] = useState<Short[]>(() => getLocalItem('vp_shorts', initialShorts));
  const [userLikes, setUserLikes] = useState<Record<string, 'like' | 'dislike'>>(() => getLocalItem('vp_likes', {}));
  const [userShortLikes, setUserShortLikes] = useState<Record<string, boolean>>(() => getLocalItem('vp_short_likes', {}));

  // Watch lists
  const [watchHistory, setWatchHistory] = useState<{ videoId: string; watchedAt: string }[]>(() => 
    getLocalItem('vp_history', [
      { videoId: 'vid_quantum_silicon', watchedAt: new Date(Date.now() - 3600000).toISOString() },
      { videoId: 'vid_norwegian_fjords', watchedAt: new Date(Date.now() - 86400000).toISOString() }
    ])
  );
  const [watchLater, setWatchLater] = useState<string[]>(() => getLocalItem('vp_watch_later', ['vid_lofi_midnight_session']));

  // Community & Comments
  const [posts, setPosts] = useState<CommunityPost[]>(() => getLocalItem('vp_posts', initialCommunityPosts));
  const [userPostLikes, setUserPostLikes] = useState<Record<string, boolean>>(() => getLocalItem('vp_post_likes', {}));
  const [comments, setComments] = useState<Comment[]>(() => getLocalItem('vp_comments', initialComments));

  // Notifications & Reports
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => getLocalItem('vp_notifications', initialNotifications));
  const [reports, setReports] = useState<ReportItem[]>(() => getLocalItem('vp_reports', initialReports));
  const [adminConfig, setAdminConfig] = useState<AdminConfig>(() => getLocalItem('vp_admin_config', initialAdminConfig));

  // Modals
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isShortUploadModalOpen, setIsShortUploadModalOpen] = useState(false);
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isChannelModalOpen, setIsChannelModalOpen] = useState(false);
  const [reportModalTarget, setReportModalTarget] = useState<{ type: 'video' | 'short' | 'comment' | 'channel'; id: string; title: string } | null>(null);

  // Sync state to LocalStorage
  useEffect(() => { setLocalItem('vp_users', users); }, [users]);
  useEffect(() => { setLocalItem('vp_channels', channels); }, [channels]);
  useEffect(() => { setLocalItem('vp_videos', videos); }, [videos]);
  useEffect(() => { setLocalItem('vp_shorts', shorts); }, [shorts]);
  useEffect(() => { setLocalItem('vp_posts', posts); }, [posts]);
  useEffect(() => { setLocalItem('vp_comments', comments); }, [comments]);
  useEffect(() => { setLocalItem('vp_notifications', notifications); }, [notifications]);
  useEffect(() => { setLocalItem('vp_reports', reports); }, [reports]);
  useEffect(() => { setLocalItem('vp_admin_config', adminConfig); }, [adminConfig]);
  useEffect(() => { setLocalItem('vp_subscriptions', userSubscriptions); }, [userSubscriptions]);
  useEffect(() => { setLocalItem('vp_likes', userLikes); }, [userLikes]);
  useEffect(() => { setLocalItem('vp_short_likes', userShortLikes); }, [userShortLikes]);
  useEffect(() => { setLocalItem('vp_post_likes', userPostLikes); }, [userPostLikes]);
  useEffect(() => { setLocalItem('vp_history', watchHistory); }, [watchHistory]);
  useEffect(() => { setLocalItem('vp_watch_later', watchLater); }, [watchLater]);
  useEffect(() => { 
    if (currentUser) {
      setLocalItem('vp_current_user_id', currentUser.id);
    }
  }, [currentUser]);

  // Auth actions
  const switchUser = (userId: string) => {
    const target = users.find(u => u.id === userId);
    if (target) {
      setCurrentUser(target);
    }
  };

  const login = (email: string): boolean => {
    const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      setCurrentUser(existing);
      return true;
    }
    // Create new user if not found
    const newUser: User = {
      id: `user_${Date.now()}`,
      name: email.split('@')[0],
      email: email,
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(email)}`,
      role: 'user',
      createdAt: new Date().toISOString(),
    };
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    return true;
  };

  const register = (name: string, email: string): boolean => {
    const newUser: User = {
      id: `user_${Date.now()}`,
      name: name.trim() || 'New Creator',
      email: email.trim(),
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}`,
      role: 'creator',
      createdAt: new Date().toISOString(),
    };
    // Also auto-create channel
    const newChannel: Channel = {
      id: `channel_${newUser.id}`,
      userId: newUser.id,
      name: newUser.name,
      handle: `@${newUser.name.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
      avatar: newUser.avatar,
      banner: '/src/assets/images/vidpulse_channel_banner_1792757456590.jpg',
      description: `Welcome to the official VidPulse channel of ${newUser.name}!`,
      links: [],
      subscriberCount: 0,
      totalViews: 0,
      verified: false,
      monetization: {
        status: 'not_eligible',
        payoutMethod: 'Stripe Direct',
        estimatedEarnings: 0,
        finalizedEarnings: 0,
        unpaidBalance: 0,
        payoutThreshold: adminConfig.minimumPayoutAmount,
        cpm: 3.50,
        rpm: 2.00,
        payments: [],
      },
      createdAt: new Date().toISOString(),
    };

    newUser.channelId = newChannel.id;
    setUsers(prev => [...prev, newUser]);
    setChannels(prev => [...prev, newChannel]);
    setCurrentUser(newUser);
    return true;
  };

  const googleSignIn = () => {
    const googleUser: User = {
      id: 'user_google_connected',
      name: 'Shahbaz Ali',
      email: 'shahbazalinf4422@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      role: 'creator',
      channelId: 'channel_cyberpulse',
      createdAt: new Date().toISOString(),
    };
    if (!users.some(u => u.id === googleUser.id)) {
      setUsers(prev => [googleUser, ...prev]);
    }
    setCurrentUser(googleUser);
  };

  const logout = () => {
    setCurrentUser(null);
    navigateTo('home');
  };

  const updateProfile = (data: Partial<User>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...data };
    setCurrentUser(updated);
    setUsers(prev => prev.map(u => u.id === updated.id ? updated : u));
  };

  // Channels
  const createChannel = (data: { name: string; handle: string; description: string; avatar?: string; banner?: string }): Channel => {
    if (!currentUser) throw new Error('Must be logged in');
    const newChan: Channel = {
      id: `channel_${Date.now()}`,
      userId: currentUser.id,
      name: data.name,
      handle: data.handle.startsWith('@') ? data.handle : `@${data.handle}`,
      avatar: data.avatar || currentUser.avatar,
      banner: data.banner || '/src/assets/images/vidpulse_channel_banner_1792757456590.jpg',
      description: data.description,
      links: [],
      subscriberCount: 0,
      totalViews: 0,
      verified: false,
      monetization: {
        status: 'not_eligible',
        payoutMethod: 'Stripe Direct',
        estimatedEarnings: 0,
        finalizedEarnings: 0,
        unpaidBalance: 0,
        payoutThreshold: adminConfig.minimumPayoutAmount,
        cpm: 3.50,
        rpm: 2.00,
        payments: [],
      },
      createdAt: new Date().toISOString(),
    };

    setChannels(prev => [newChan, ...prev]);
    updateProfile({ channelId: newChan.id, role: 'creator' });
    return newChan;
  };

  const updateChannel = (channelId: string, data: Partial<Channel>) => {
    setChannels(prev => prev.map(c => c.id === channelId ? { ...c, ...data } : c));
  };

  const toggleSubscribe = (channelId: string) => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }
    setUserSubscriptions(prev => {
      const isSub = prev.includes(channelId);
      const next = isSub ? prev.filter(id => id !== channelId) : [...prev, channelId];
      // Update target channel subscriberCount
      setChannels(chans => chans.map(c => {
        if (c.id === channelId) {
          const newCount = Math.max(0, c.subscriberCount + (isSub ? -1 : 1));
          return { ...c, subscriberCount: newCount };
        }
        return c;
      }));

      // If subscribed, create notification for that channel owner
      if (!isSub) {
        const targetChan = channels.find(c => c.id === channelId);
        if (targetChan) {
          const newNotif: NotificationItem = {
            id: `notif_${Date.now()}`,
            userId: targetChan.userId,
            type: 'subscriber',
            title: 'New Subscriber!',
            message: `${currentUser.name} just subscribed to your channel ${targetChan.name}.`,
            avatar: currentUser.avatar,
            targetUrl: `/channel/${targetChan.id}`,
            isRead: false,
            createdAt: new Date().toISOString(),
          };
          setNotifications(n => [newNotif, ...n]);
        }
      }
      return next;
    });
  };

  const isSubscribed = (channelId: string) => userSubscriptions.includes(channelId);

  // Videos
  const uploadVideo = (videoData: Omit<Video, 'id' | 'channelId' | 'channelName' | 'channelHandle' | 'channelAvatar' | 'channelVerified' | 'views' | 'likes' | 'dislikes' | 'uploadDate'>): Video => {
    const chan = currentChannel || channels[0];
    const newVideo: Video = {
      ...videoData,
      id: `vid_${Date.now()}`,
      channelId: chan.id,
      channelName: chan.name,
      channelHandle: chan.handle,
      channelAvatar: chan.avatar,
      channelVerified: chan.verified,
      views: 0,
      likes: 0,
      dislikes: 0,
      uploadDate: new Date().toISOString(),
    };

    setVideos(prev => [newVideo, ...prev]);

    // Send notification to subscribers
    const newNotif: NotificationItem = {
      id: `notif_up_${Date.now()}`,
      userId: chan.userId,
      type: 'announcement',
      title: 'Video Published Successfully',
      message: `"${newVideo.title}" is now live on VidPulse.`,
      targetUrl: `/watch/${newVideo.id}`,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications(prev => [newNotif, ...prev]);

    return newVideo;
  };

  const updateVideo = (videoId: string, data: Partial<Video>) => {
    setVideos(prev => prev.map(v => v.id === videoId ? { ...v, ...data } : v));
  };

  const deleteVideo = (videoId: string) => {
    setVideos(prev => prev.filter(v => v.id !== videoId));
  };

  const incrementVideoViews = (videoId: string) => {
    setVideos(prev => prev.map(v => {
      if (v.id === videoId) {
        return { ...v, views: v.views + 1 };
      }
      return v;
    }));
    // Also track in history
    setWatchHistory(prev => {
      const filtered = prev.filter(item => item.videoId !== videoId);
      return [{ videoId, watchedAt: new Date().toISOString() }, ...filtered];
    });
  };

  const toggleVideoLike = (videoId: string) => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }
    const currentLike = userLikes[videoId];
    const isLiking = currentLike !== 'like';

    setUserLikes(prev => ({
      ...prev,
      [videoId]: isLiking ? 'like' : (undefined as any),
    }));

    setVideos(prev => prev.map(v => {
      if (v.id === videoId) {
        let likesDelta = isLiking ? 1 : -1;
        let dislikesDelta = currentLike === 'dislike' ? -1 : 0;
        return {
          ...v,
          likes: Math.max(0, v.likes + likesDelta),
          dislikes: Math.max(0, v.dislikes + dislikesDelta),
        };
      }
      return v;
    }));
  };

  const toggleVideoDislike = (videoId: string) => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }
    const currentLike = userLikes[videoId];
    const isDisliking = currentLike !== 'dislike';

    setUserLikes(prev => ({
      ...prev,
      [videoId]: isDisliking ? 'dislike' : (undefined as any),
    }));

    setVideos(prev => prev.map(v => {
      if (v.id === videoId) {
        let dislikesDelta = isDisliking ? 1 : -1;
        let likesDelta = currentLike === 'like' ? -1 : 0;
        return {
          ...v,
          likes: Math.max(0, v.likes + likesDelta),
          dislikes: Math.max(0, v.dislikes + dislikesDelta),
        };
      }
      return v;
    }));
  };

  const getVideoLikeState = (videoId: string) => userLikes[videoId] || null;

  const toggleWatchLater = (videoId: string) => {
    setWatchLater(prev => 
      prev.includes(videoId) ? prev.filter(id => id !== videoId) : [videoId, ...prev]
    );
  };

  const clearHistory = () => {
    setWatchHistory([]);
  };

  // Shorts
  const uploadShort = (shortData: { title: string; description: string; videoUrl: string; soundTitle?: string; soundArtist?: string }): Short => {
    const chan = currentChannel || channels[0];
    const newShort: Short = {
      id: `short_${Date.now()}`,
      channelId: chan.id,
      channelName: chan.name,
      channelHandle: chan.handle,
      channelAvatar: chan.avatar,
      channelVerified: chan.verified,
      title: shortData.title,
      description: shortData.description,
      videoUrl: shortData.videoUrl,
      soundTitle: shortData.soundTitle || 'Original Audio',
      soundArtist: shortData.soundArtist || chan.name,
      views: 0,
      likes: 0,
      commentsCount: 0,
      uploadDate: new Date().toISOString(),
    };

    setShorts(prev => [newShort, ...prev]);
    return newShort;
  };

  const toggleShortLike = (shortId: string) => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }
    const isLiked = !!userShortLikes[shortId];
    setUserShortLikes(prev => ({ ...prev, [shortId]: !isLiked }));
    setShorts(prev => prev.map(s => {
      if (s.id === shortId) {
        return { ...s, likes: Math.max(0, s.likes + (isLiked ? -1 : 1)) };
      }
      return s;
    }));
  };

  const isShortLiked = (shortId: string) => !!userShortLikes[shortId];

  const incrementShortViews = (shortId: string) => {
    setShorts(prev => prev.map(s => s.id === shortId ? { ...s, views: s.views + 1 } : s));
  };

  // Community Posts
  const createPost = (postData: { type: 'text' | 'image' | 'poll'; content: string; imageUrl?: string; pollOptions?: string[] }) => {
    const chan = currentChannel || channels[0];
    const newPost: CommunityPost = {
      id: `post_${Date.now()}`,
      channelId: chan.id,
      channelName: chan.name,
      channelAvatar: chan.avatar,
      channelHandle: chan.handle,
      channelVerified: chan.verified,
      type: postData.type,
      content: postData.content,
      imageUrl: postData.imageUrl,
      pollOptions: postData.pollOptions ? postData.pollOptions.map((opt, i) => ({ id: `opt_${i}`, text: opt, votes: 0 })) : undefined,
      totalVotes: postData.pollOptions ? 0 : undefined,
      likes: 0,
      commentsCount: 0,
      createdAt: new Date().toISOString(),
    };
    setPosts(prev => [newPost, ...prev]);
  };

  const votePoll = (postId: string, optionId: string) => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }
    setPosts(prev => prev.map(p => {
      if (p.id === postId && p.pollOptions) {
        if (p.userVotedOptionId) return p; // already voted
        const updatedOptions = p.pollOptions.map(opt => 
          opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt
        );
        return {
          ...p,
          pollOptions: updatedOptions,
          totalVotes: (p.totalVotes || 0) + 1,
          userVotedOptionId: optionId,
        };
      }
      return p;
    }));
  };

  const togglePostLike = (postId: string) => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }
    const isLiked = !!userPostLikes[postId];
    setUserPostLikes(prev => ({ ...prev, [postId]: !isLiked }));
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return { ...p, likes: Math.max(0, p.likes + (isLiked ? -1 : 1)) };
      }
      return p;
    }));
  };

  const isPostLiked = (postId: string) => !!userPostLikes[postId];

  // Comments
  const addComment = (targetType: 'video' | 'short' | 'post', targetId: string, content: string, parentId?: string) => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }
    const isOwner = currentChannel?.id && (
      (targetType === 'video' && videos.find(v => v.id === targetId)?.channelId === currentChannel.id) ||
      (targetType === 'short' && shorts.find(s => s.id === targetId)?.channelId === currentChannel.id) ||
      (targetType === 'post' && posts.find(p => p.id === targetId)?.channelId === currentChannel.id)
    );

    const newComment: Comment = {
      id: `comment_${Date.now()}`,
      targetType,
      targetId,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      channelId: currentChannel?.id,
      content,
      likes: 0,
      isLikedByMe: false,
      replies: [],
      createdAt: new Date().toISOString(),
      isChannelOwner: !!isOwner,
    };

    if (parentId) {
      setComments(prev => prev.map(c => {
        if (c.id === parentId) {
          return {
            ...c,
            replies: [...(c.replies || []), newComment],
          };
        }
        return c;
      }));
    } else {
      setComments(prev => [newComment, ...prev]);
    }
  };

  const editComment = (commentId: string, content: string) => {
    setComments(prev => prev.map(c => {
      if (c.id === commentId) {
        return { ...c, content };
      }
      if (c.replies) {
        return {
          ...c,
          replies: c.replies.map(r => r.id === commentId ? { ...r, content } : r)
        };
      }
      return c;
    }));
  };

  const deleteComment = (commentId: string) => {
    setComments(prev => prev.filter(c => c.id !== commentId).map(c => ({
      ...c,
      replies: c.replies ? c.replies.filter(r => r.id !== commentId) : [],
    })));
  };

  const toggleCommentLike = (commentId: string) => {
    setComments(prev => prev.map(c => {
      if (c.id === commentId) {
        const nextLiked = !c.isLikedByMe;
        return {
          ...c,
          isLikedByMe: nextLiked,
          likes: Math.max(0, c.likes + (nextLiked ? 1 : -1)),
        };
      }
      if (c.replies) {
        return {
          ...c,
          replies: c.replies.map(r => {
            if (r.id === commentId) {
              const nextLiked = !r.isLikedByMe;
              return {
                ...r,
                isLikedByMe: nextLiked,
                likes: Math.max(0, r.likes + (nextLiked ? 1 : -1)),
              };
            }
            return r;
          }),
        };
      }
      return c;
    }));
  };

  // Notifications
  const unreadNotificationCount = notifications.filter(n => !n.isRead).length;

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  // Reports
  const submitReport = (
    targetType: 'video' | 'short' | 'comment' | 'channel',
    targetId: string,
    targetTitle: string,
    reason: any,
    details: string
  ) => {
    const newReport: ReportItem = {
      id: `rep_${Date.now()}`,
      targetType,
      targetId,
      targetTitle,
      reportedByUserId: currentUser?.id || 'guest',
      reportedByUserName: currentUser?.name || 'Anonymous',
      reason,
      details,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    setReports(prev => [newReport, ...prev]);
  };

  const updateReportStatus = (reportId: string, status: 'resolved' | 'dismissed', actionTaken?: string) => {
    setReports(prev => prev.map(r => r.id === reportId ? { ...r, status, actionTaken } : r));
  };

  // Admin & Monetization
  const updateAdminConfig = (config: Partial<AdminConfig>) => {
    setAdminConfig(prev => ({ ...prev, ...config }));
  };

  const applyForMonetization = (
    channelId: string,
    applicantLegalName: string,
    applicantCountry: string,
    payoutMethod: any,
    payoutAccountInfo: string
  ) => {
    setChannels(prev => prev.map(c => {
      if (c.id === channelId) {
        const mon: MonetizationData = {
          ...c.monetization,
          status: 'pending',
          appliedDate: new Date().toISOString(),
          applicantLegalName,
          applicantCountry,
          payoutMethod,
          payoutAccountInfo,
        };
        return { ...c, monetization: mon };
      }
      return c;
    }));

    // Add notification
    const targetChan = channels.find(c => c.id === channelId);
    if (targetChan) {
      const notif: NotificationItem = {
        id: `notif_mon_${Date.now()}`,
        userId: targetChan.userId,
        type: 'monetization',
        title: 'Partner Application Submitted',
        message: 'Your VidPulse Partner Program application has been submitted and is under administrative review.',
        targetUrl: '/studio/monetization',
        isRead: false,
        createdAt: new Date().toISOString(),
      };
      setNotifications(n => [notif, ...n]);
    }
  };

  const reviewMonetizationApplication = (channelId: string, decision: 'approved' | 'rejected', reviewNotes?: string) => {
    setChannels(prev => prev.map(c => {
      if (c.id === channelId) {
        const isApproved = decision === 'approved';
        const mon: MonetizationData = {
          ...c.monetization,
          status: isApproved ? 'approved' : 'rejected',
          decisionDate: new Date().toISOString(),
          reviewNotes: reviewNotes || (isApproved ? 'All content integrity and engagement metrics verified.' : 'Engagement thresholds or content guidelines not satisfied.'),
          estimatedEarnings: isApproved ? (c.monetization.estimatedEarnings || 148.50) : 0,
          finalizedEarnings: isApproved ? (c.monetization.finalizedEarnings || 120.00) : 0,
          unpaidBalance: isApproved ? (c.monetization.unpaidBalance || 148.50) : 0,
        };
        return { ...c, monetization: mon, verified: isApproved ? true : c.verified };
      }
      return c;
    }));

    const targetChan = channels.find(c => c.id === channelId);
    if (targetChan) {
      const notif: NotificationItem = {
        id: `notif_mon_rev_${Date.now()}`,
        userId: targetChan.userId,
        type: 'monetization',
        title: decision === 'approved' ? 'Congratulations! You are a VidPulse Partner' : 'Monetization Application Update',
        message: decision === 'approved' 
          ? 'Your channel was approved for the VidPulse Partner Program. You can now earn ad revenue and track payouts.'
          : `Your application was not approved. Feedback: ${reviewNotes || 'See guidelines.'}`,
        targetUrl: '/studio/monetization',
        isRead: false,
        createdAt: new Date().toISOString(),
      };
      setNotifications(n => [notif, ...n]);
    }
  };

  const simulateChannelGrowth = (channelId: string, deltaSubs: number, deltaViews: number) => {
    setChannels(prev => prev.map(c => {
      if (c.id === channelId) {
        const newSubs = Math.max(0, c.subscriberCount + deltaSubs);
        const newViews = Math.max(0, c.totalViews + deltaViews);
        // check eligibility
        const isNowEligible = newSubs >= adminConfig.requiredSubscribers && newViews >= adminConfig.requiredViews;
        let newStatus = c.monetization.status;
        if (newStatus === 'not_eligible' && isNowEligible) {
          newStatus = 'eligible';
        }
        return {
          ...c,
          subscriberCount: newSubs,
          totalViews: newViews,
          monetization: {
            ...c.monetization,
            status: newStatus,
          },
        };
      }
      return c;
    }));
  };

  // Report modal helpers
  const openReportModal = (type: 'video' | 'short' | 'comment' | 'channel', id: string, title: string) => {
    setReportModalTarget({ type, id, title });
  };
  const closeReportModal = () => {
    setReportModalTarget(null);
  };

  return (
    <AppContext.Provider
      value={{
        isDarkMode,
        toggleTheme,
        activeView,
        viewParam,
        navigateTo,
        searchQuery,
        setSearchQuery,
        isSidebarCollapsed,
        toggleSidebar,

        currentUser,
        currentChannel,
        users,
        login,
        register,
        googleSignIn,
        logout,
        switchUser,
        updateProfile,

        channels,
        createChannel,
        updateChannel,
        userSubscriptions,
        toggleSubscribe,
        isSubscribed,

        videos,
        uploadVideo,
        updateVideo,
        deleteVideo,
        incrementVideoViews,
        toggleVideoLike,
        toggleVideoDislike,
        getVideoLikeState,

        watchHistory,
        watchLater,
        toggleWatchLater,
        clearHistory,

        shorts,
        uploadShort,
        toggleShortLike,
        isShortLiked,
        incrementShortViews,

        posts,
        createPost,
        votePoll,
        togglePostLike,
        isPostLiked,

        comments,
        addComment,
        editComment,
        deleteComment,
        toggleCommentLike,

        notifications,
        unreadNotificationCount,
        markNotificationAsRead,
        markAllNotificationsAsRead,

        reports,
        submitReport,
        updateReportStatus,

        adminConfig,
        updateAdminConfig,
        applyForMonetization,
        reviewMonetizationApplication,
        simulateChannelGrowth,

        isUploadModalOpen,
        setIsUploadModalOpen,
        isShortUploadModalOpen,
        setIsShortUploadModalOpen,
        isCreatePostModalOpen,
        setIsCreatePostModalOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isChannelModalOpen,
        setIsChannelModalOpen,
        reportModalTarget,
        openReportModal,
        closeReportModal,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

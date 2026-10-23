import React from 'react';
import { 
  Home, 
  Flame, 
  Tv, 
  Clock, 
  Bookmark, 
  ThumbsUp, 
  Users, 
  SlidersHorizontal, 
  DollarSign, 
  Shield, 
  Settings, 
  HelpCircle, 
  CheckCircle2,
  TrendingUp,
  Music2,
  Gamepad2,
  Code2,
  Sparkles,
  Compass
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Sidebar: React.FC = () => {
  const { 
    isSidebarCollapsed, 
    activeView, 
    navigateTo, 
    channels, 
    userSubscriptions, 
    currentUser, 
    currentChannel 
  } = useApp();

  const subscribedChannels = channels.filter(c => userSubscriptions.includes(c.id));

  // Collapsed icon-only mode for large screens
  if (isSidebarCollapsed) {
    return (
      <aside className="hidden md:flex flex-col items-center w-18 py-3 bg-white dark:bg-[#0f0f13] border-r border-slate-200 dark:border-slate-800/80 shrink-0 select-none z-30">
        <div className="flex flex-col gap-3 w-full px-2">
          <button
            onClick={() => navigateTo('home')}
            className={`flex flex-col items-center justify-center py-2.5 rounded-xl transition-colors cursor-pointer ${
              activeView === 'home' 
                ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 font-semibold' 
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            <Home className="w-5 h-5 mb-1" />
            <span className="text-[10px]">Home</span>
          </button>

          <button
            onClick={() => navigateTo('shorts')}
            className={`flex flex-col items-center justify-center py-2.5 rounded-xl transition-colors cursor-pointer ${
              activeView === 'shorts' 
                ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 font-semibold' 
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            <Flame className="w-5 h-5 mb-1" />
            <span className="text-[10px]">Shorts</span>
          </button>

          <button
            onClick={() => navigateTo('subscriptions')}
            className={`flex flex-col items-center justify-center py-2.5 rounded-xl transition-colors cursor-pointer ${
              activeView === 'subscriptions' 
                ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 font-semibold' 
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            <Tv className="w-5 h-5 mb-1" />
            <span className="text-[10px]">Subs</span>
          </button>

          <button
            onClick={() => navigateTo('community')}
            className={`flex flex-col items-center justify-center py-2.5 rounded-xl transition-colors cursor-pointer ${
              activeView === 'community' 
                ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 font-semibold' 
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            <Users className="w-5 h-5 mb-1" />
            <span className="text-[10px]">Community</span>
          </button>

          <button
            onClick={() => navigateTo('library')}
            className={`flex flex-col items-center justify-center py-2.5 rounded-xl transition-colors cursor-pointer ${
              activeView === 'library' 
                ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 font-semibold' 
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            <Clock className="w-5 h-5 mb-1" />
            <span className="text-[10px]">Library</span>
          </button>
        </div>
      </aside>
    );
  }

  // Expanded Sidebar
  return (
    <aside className="hidden md:flex flex-col w-60 h-[calc(100vh-3.5rem)] overflow-y-auto py-3 bg-white dark:bg-[#0f0f13] border-r border-slate-200 dark:border-slate-800/80 shrink-0 text-xs select-none">
      {/* Primary Section */}
      <div className="px-3 space-y-1">
        <button
          onClick={() => navigateTo('home')}
          className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl transition-colors cursor-pointer ${
            activeView === 'home' 
              ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 font-semibold' 
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
          }`}
        >
          <Home className="w-4 h-4 shrink-0" />
          <span className="truncate">Home</span>
        </button>

        <button
          onClick={() => navigateTo('shorts')}
          className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl transition-colors cursor-pointer ${
            activeView === 'shorts' 
              ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 font-semibold' 
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
          }`}
        >
          <Flame className="w-4 h-4 shrink-0 text-amber-500" />
          <span className="truncate">VidPulse Shorts</span>
        </button>

        <button
          onClick={() => navigateTo('subscriptions')}
          className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl transition-colors cursor-pointer ${
            activeView === 'subscriptions' 
              ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 font-semibold' 
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
          }`}
        >
          <Tv className="w-4 h-4 shrink-0 text-rose-500" />
          <span className="truncate">Subscriptions</span>
        </button>

        <button
          onClick={() => navigateTo('community')}
          className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl transition-colors cursor-pointer ${
            activeView === 'community' 
              ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 font-semibold' 
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
          }`}
        >
          <Users className="w-4 h-4 shrink-0 text-indigo-500" />
          <span className="truncate">Community Posts</span>
        </button>
      </div>

      <div className="my-3 border-t border-slate-200 dark:border-slate-800/70" />

      {/* Library Section */}
      <div className="px-3 space-y-1">
        <div className="px-3 py-1 font-semibold text-[11px] text-slate-400 uppercase tracking-wider">
          Library
        </div>
        <button
          onClick={() => navigateTo('library')}
          className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl transition-colors cursor-pointer ${
            activeView === 'library' 
              ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 font-semibold' 
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
          }`}
        >
          <Clock className="w-4 h-4 shrink-0" />
          <span className="truncate">History & Watch Later</span>
        </button>

        {currentChannel && (
          <button
            onClick={() => navigateTo('channel', currentChannel.id)}
            className="w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
          >
            <Bookmark className="w-4 h-4 shrink-0" />
            <span className="truncate">Your Channel</span>
          </button>
        )}
      </div>

      <div className="my-3 border-t border-slate-200 dark:border-slate-800/70" />

      {/* Creator & Partner Section */}
      <div className="px-3 space-y-1">
        <div className="px-3 py-1 font-semibold text-[11px] text-slate-400 uppercase tracking-wider">
          Creator Suite
        </div>
        <button
          onClick={() => navigateTo('studio')}
          className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl transition-colors cursor-pointer ${
            activeView === 'studio' 
              ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 font-semibold' 
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4 shrink-0 text-rose-500" />
          <span className="truncate">Creator Studio</span>
        </button>

        <button
          onClick={() => navigateTo('monetization')}
          className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl transition-colors cursor-pointer ${
            activeView === 'monetization' 
              ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 font-semibold' 
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
          }`}
        >
          <DollarSign className="w-4 h-4 shrink-0 text-emerald-500" />
          <span className="truncate">Monetization & Payouts</span>
        </button>

        <button
          onClick={() => navigateTo('admin')}
          className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl transition-colors cursor-pointer ${
            activeView === 'admin' 
              ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400 font-semibold' 
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
          }`}
        >
          <Shield className="w-4 h-4 shrink-0 text-indigo-500" />
          <span className="truncate">Admin Dashboard</span>
        </button>
      </div>

      <div className="my-3 border-t border-slate-200 dark:border-slate-800/70" />

      {/* Subscriptions List */}
      <div className="px-3 space-y-1">
        <div className="px-3 py-1 font-semibold text-[11px] text-slate-400 uppercase tracking-wider">
          Subscriptions ({subscribedChannels.length})
        </div>
        {subscribedChannels.length === 0 ? (
          <div className="px-3 py-2 text-[11px] text-slate-400">
            No subscribed channels yet.
          </div>
        ) : (
          subscribedChannels.map(chan => (
            <button
              key={chan.id}
              onClick={() => navigateTo('channel', chan.id)}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors cursor-pointer text-left"
            >
              <img
                src={chan.avatar}
                alt={chan.name}
                referrerPolicy="no-referrer"
                className="w-6 h-6 rounded-full object-cover"
              />
              <span className="truncate flex-1 font-medium">{chan.name}</span>
              {chan.verified && (
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0" />
              )}
            </button>
          ))
        )}
      </div>

      {/* Footer Info */}
      <div className="mt-auto px-6 py-4 text-[11px] text-slate-400 border-t border-slate-100 dark:border-slate-800/50">
        <div className="flex flex-wrap gap-x-2 gap-y-1 text-slate-400 mb-2">
          <span>About</span>
          <span>·</span>
          <span>Press</span>
          <span>·</span>
          <span>Terms</span>
          <span>·</span>
          <span>Privacy</span>
        </div>
        <div>© 2026 VidPulse Platform Inc.</div>
      </div>
    </aside>
  );
};

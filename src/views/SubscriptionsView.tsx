import React, { useState } from 'react';
import { Tv, CheckCircle2, Video as VideoIcon, Compass } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { VideoCard } from '../components/video/VideoCard';

export const SubscriptionsView: React.FC = () => {
  const { channels, userSubscriptions, videos, navigateTo } = useApp();

  const subscribedChannels = channels.filter(c => userSubscriptions.includes(c.id));
  const [selectedChannelId, setSelectedChannelId] = useState<string>('all');

  const subVideos = videos.filter(v => userSubscriptions.includes(v.channelId));
  const displayedVideos = selectedChannelId === 'all'
    ? subVideos
    : subVideos.filter(v => v.channelId === selectedChannelId);

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Tv className="w-6 h-6 text-rose-500" />
            <span>Subscriptions</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Latest uploads from channels you follow
          </p>
        </div>
      </div>

      {/* Subscribed Channels Avatar Bar */}
      {subscribedChannels.length > 0 && (
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-2">
          <button
            onClick={() => setSelectedChannelId('all')}
            className={`px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
              selectedChannelId === 'all'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            All Channels
          </button>

          {subscribedChannels.map((channel) => (
            <button
              key={channel.id}
              onClick={() => setSelectedChannelId(channel.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-2xl border transition-colors cursor-pointer shrink-0 ${
                selectedChannelId === channel.id
                  ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/30'
                  : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900'
              }`}
            >
              <img
                src={channel.avatar}
                alt={channel.name}
                referrerPolicy="no-referrer"
                className="w-7 h-7 rounded-full object-cover"
              />
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate max-w-32">
                {channel.name}
              </span>
              {channel.verified && <CheckCircle2 className="w-3 h-3 text-blue-500 shrink-0" />}
            </button>
          ))}
        </div>
      )}

      {/* Videos Grid */}
      {displayedVideos.length === 0 ? (
        <div className="py-20 text-center space-y-3">
          <Tv className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            No videos from subscribed channels yet
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Explore trending creators and subscribe to their channels to keep up with daily updates.
          </p>
          <button
            onClick={() => navigateTo('home')}
            className="px-5 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700 cursor-pointer transition-colors"
          >
            Explore Videos
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5">
          {displayedVideos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { 
  CheckCircle2, 
  ExternalLink, 
  Film, 
  Flame, 
  Layers, 
  Info, 
  SlidersHorizontal, 
  UploadCloud, 
  Plus,
  Calendar,
  Eye,
  Users
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { VideoCard } from '../components/video/VideoCard';
import { ChannelModal } from '../components/modals/ChannelModal';

interface ChannelViewProps {
  channelId?: string;
}

export const ChannelView: React.FC<ChannelViewProps> = ({ channelId }) => {
  const { 
    channels, 
    viewParam, 
    videos, 
    shorts, 
    posts, 
    toggleSubscribe, 
    isSubscribed, 
    currentChannel, 
    setIsChannelModalOpen, 
    setIsUploadModalOpen,
    navigateTo 
  } = useApp();

  const targetChannelId = channelId || viewParam || currentChannel?.id || channels[0]?.id;
  const channel = channels.find(c => c.id === targetChannelId) || channels[0];

  const [activeTab, setActiveTab] = useState<'videos' | 'shorts' | 'community' | 'about'>('videos');

  const isOwner = currentChannel?.id === channel.id;
  const subscribed = isSubscribed(channel.id);

  const channelVideos = videos.filter(v => v.channelId === channel.id);
  const channelShorts = shorts.filter(s => s.channelId === channel.id);
  const channelPosts = posts.filter(p => p.channelId === channel.id);

  const joinDate = new Date(channel.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="max-w-7xl mx-auto pb-12">
      {/* Panoramic Channel Banner */}
      <div className="relative w-full aspect-[21/6] sm:aspect-[24/6] max-h-64 bg-slate-900 overflow-hidden">
        <img
          src={channel.banner}
          alt={channel.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
      </div>

      <div className="px-4 sm:px-8 mt-4">
        {/* Channel Profile Info Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-start sm:items-center gap-4">
            <img
              src={channel.avatar}
              alt={channel.name}
              referrerPolicy="no-referrer"
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-4 border-white dark:border-[#0a0a0c] shadow-lg shrink-0 -mt-8 sm:-mt-10"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                  {channel.name}
                </h1>
                {channel.verified && (
                  <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" />
                )}
              </div>

              {/* Zero-pill unboxed metadata */}
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1 font-mono tabular-nums">
                <span className="font-semibold text-slate-700 dark:text-slate-300">{channel.handle}</span>
                <span aria-hidden="true">·</span>
                <span>{channel.subscriberCount.toLocaleString()} subscribers</span>
                <span aria-hidden="true">·</span>
                <span>{channelVideos.length} videos</span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 line-clamp-2 max-w-xl">
                {channel.description}
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-center">
            {isOwner ? (
              <>
                <button
                  onClick={() => setIsChannelModalOpen(true)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>Customize Channel</span>
                </button>
                <button
                  onClick={() => setIsUploadModalOpen(true)}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-full text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>Upload Video</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => toggleSubscribe(channel.id)}
                className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer shadow-sm ${
                  subscribed
                    ? 'bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700'
                    : 'bg-rose-600 hover:bg-rose-700 text-white'
                }`}
              >
                {subscribed ? 'Subscribed' : 'Subscribe'}
              </button>
            )}
          </div>
        </div>

        {/* Channel Navigation Tabs */}
        <div className="flex items-center gap-1 sm:gap-4 border-b border-slate-200 dark:border-slate-800 mt-2">
          {[
            { id: 'videos', label: 'Videos', icon: Film, count: channelVideos.length },
            { id: 'shorts', label: 'Shorts', icon: Flame, count: channelShorts.length },
            { id: 'community', label: 'Community', icon: Layers, count: channelPosts.length },
            { id: 'about', label: 'About', icon: Info },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
                  activeTab === tab.id
                    ? 'border-rose-600 text-rose-600 dark:text-rose-400'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className="text-[11px] opacity-70">({tab.count})</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === 'videos' && (
            <div>
              {channelVideos.length === 0 ? (
                <div className="text-center py-16 text-slate-400">
                  <Film className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm font-semibold">No videos uploaded yet</p>
                  {isOwner && (
                    <button
                      onClick={() => setIsUploadModalOpen(true)}
                      className="mt-3 px-4 py-2 bg-rose-600 text-white text-xs font-bold rounded-xl cursor-pointer"
                    >
                      Upload your first video
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {channelVideos.map((video) => (
                    <VideoCard key={video.id} video={video} />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'shorts' && (
            <div>
              {channelShorts.length === 0 ? (
                <div className="text-center py-16 text-slate-400">
                  <Flame className="w-12 h-12 mx-auto mb-2 opacity-50 text-amber-500" />
                  <p className="text-sm font-semibold">No Shorts published yet</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {channelShorts.map((short) => (
                    <div
                      key={short.id}
                      onClick={() => navigateTo('shorts')}
                      className="group relative aspect-[9/16] rounded-2xl overflow-hidden bg-slate-900 cursor-pointer shadow-md hover:shadow-xl transition-all"
                    >
                      <video
                        src={short.videoUrl}
                        muted
                        playsInline
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />
                      <div className="absolute bottom-3 left-3 right-3 text-white">
                        <h4 className="text-xs font-bold line-clamp-2 leading-snug">
                          {short.title}
                        </h4>
                        <div className="text-[11px] text-slate-300 mt-1 font-mono tabular-nums">
                          {short.views.toLocaleString()} views
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'community' && (
            <div className="max-w-2xl mx-auto space-y-4">
              {channelPosts.length === 0 ? (
                <div className="text-center py-16 text-slate-400">
                  <Layers className="w-12 h-12 mx-auto mb-2 opacity-50 text-indigo-500" />
                  <p className="text-sm font-semibold">No community posts yet</p>
                </div>
              ) : (
                channelPosts.map((post) => (
                  <div
                    key={post.id}
                    className="p-5 rounded-2xl bg-white dark:bg-[#16161c] border border-slate-200 dark:border-slate-800 shadow-sm"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <img
                        src={post.channelAvatar}
                        alt={post.channelName}
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1">
                          <span>{post.channelName}</span>
                          {post.channelVerified && <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
                      {post.content}
                    </p>

                    {post.imageUrl && (
                      <div className="mt-3 rounded-xl overflow-hidden aspect-video bg-slate-950">
                        <img src={post.imageUrl} alt="Post attachment" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'about' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
                    Description
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {channel.description}
                  </p>
                </div>

                {channel.links && channel.links.length > 0 && (
                  <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
                      Official Links
                    </h3>
                    <div className="flex flex-col gap-2">
                      {channel.links.map((link, idx) => (
                        <a
                          key={idx}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1.5 font-medium"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>{link.title}</span>
                          <span className="text-slate-400 text-[11px]">({link.url})</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Stats & Details */}
              <div className="p-5 rounded-2xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 space-y-3">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Channel Statistics
                </h3>
                <div className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300 font-mono tabular-nums">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span>Joined {joinDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-slate-400" />
                    <span>{channel.totalViews.toLocaleString()} total views</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-slate-400" />
                    <span>{channel.subscriberCount.toLocaleString()} subscribers</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <ChannelModal channelId={channel.id} />
    </div>
  );
};

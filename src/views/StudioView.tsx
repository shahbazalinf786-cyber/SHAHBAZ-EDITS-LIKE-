import React, { useState } from 'react';
import { 
  SlidersHorizontal, 
  Eye, 
  Users, 
  Clock, 
  DollarSign, 
  Film, 
  Flame, 
  BarChart3, 
  MessageSquare, 
  Settings, 
  Plus, 
  Trash2, 
  Edit3, 
  Globe, 
  Lock, 
  ExternalLink,
  CheckCircle2,
  TrendingUp,
  ArrowUpRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { VideoVisibility } from '../types';

export const StudioView: React.FC = () => {
  const { 
    currentChannel, 
    videos, 
    shorts, 
    comments, 
    deleteVideo, 
    updateVideo, 
    setIsUploadModalOpen, 
    setIsShortUploadModalOpen, 
    setIsChannelModalOpen,
    navigateTo 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'content' | 'analytics' | 'comments' | 'customization'>('dashboard');

  const myVideos = videos.filter(v => v.channelId === currentChannel?.id);
  const myShorts = shorts.filter(s => s.channelId === currentChannel?.id);

  // Compute metrics
  const totalViews = myVideos.reduce((acc, v) => acc + v.views, 0) + (currentChannel?.totalViews || 0);
  const totalLikes = myVideos.reduce((acc, v) => acc + v.likes, 0);
  const estimatedHours = Math.round((totalViews * 4.5) / 60);

  const channelComments = comments.filter(c => 
    myVideos.some(v => v.id === c.targetId) || myShorts.some(s => s.id === c.targetId)
  );

  const toggleVisibility = (videoId: string, currentVis: VideoVisibility) => {
    const nextVis: VideoVisibility = currentVis === 'public' ? 'private' : 'public';
    updateVideo(videoId, { visibility: nextVis });
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Studio Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <img
            src={currentChannel?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
            alt="Avatar"
            referrerPolicy="no-referrer"
            className="w-12 h-12 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shadow-sm"
          />
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <span>{currentChannel?.name || 'Creator Studio'}</span>
              <span className="text-xs px-2 py-0.5 bg-rose-500/10 text-rose-500 font-bold rounded-md">Studio</span>
            </h1>
            <p className="text-xs text-slate-500">
              Channel overview, analytics, video inventory, and monetization
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Upload Video</span>
          </button>
          <button
            onClick={() => setIsShortUploadModalOpen(true)}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
          >
            <Flame className="w-4 h-4 fill-slate-950" />
            <span>New Short</span>
          </button>
        </div>
      </div>

      {/* Studio Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 overflow-x-auto no-scrollbar">
        {[
          { id: 'dashboard', label: 'Dashboard', icon: SlidersHorizontal },
          { id: 'content', label: 'Content Manager', icon: Film, count: myVideos.length },
          { id: 'analytics', label: 'Analytics', icon: BarChart3 },
          { id: 'comments', label: 'Comments', icon: MessageSquare, count: channelComments.length },
          { id: 'customization', label: 'Customization', icon: Settings },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-rose-600 text-rose-600 dark:text-rose-400 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.count !== undefined && <span className="text-[11px] opacity-75">({tab.count})</span>}
            </button>
          );
        })}
      </div>

      {/* Tab: Dashboard Overview */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* 4 KPIs Strip */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#16161c] border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
                <span>Subscribers</span>
                <Users className="w-4 h-4 text-rose-500" />
              </div>
              <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-2 font-mono tabular-nums">
                {currentChannel?.subscriberCount.toLocaleString() || 0}
              </div>
              <div className="text-[11px] text-emerald-500 font-semibold mt-1 flex items-center gap-1">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>+142 in last 28 days</span>
              </div>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#16161c] border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
                <span>Total Views</span>
                <Eye className="w-4 h-4 text-blue-500" />
              </div>
              <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-2 font-mono tabular-nums">
                {totalViews.toLocaleString()}
              </div>
              <div className="text-[11px] text-emerald-500 font-semibold mt-1 flex items-center gap-1">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>+18.4% velocity</span>
              </div>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#16161c] border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
                <span>Watch Time</span>
                <Clock className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-2 font-mono tabular-nums">
                {estimatedHours.toLocaleString()} hrs
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Average 04:12 per view</div>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#16161c] border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
                <span>Monetization Status</span>
                <DollarSign className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="text-lg font-extrabold text-slate-900 dark:text-white mt-2 capitalize">
                {currentChannel?.monetization.status.replace('_', ' ') || 'Not Eligible'}
              </div>
              <button
                onClick={() => navigateTo('monetization')}
                className="text-[11px] text-rose-600 dark:text-rose-400 font-bold hover:underline mt-1 block cursor-pointer"
              >
                View partner eligibility →
              </button>
            </div>
          </div>

          {/* Latest Video Spotlight & Top Performing */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Latest Upload Card */}
            <div className="lg:col-span-2 p-5 rounded-3xl bg-white dark:bg-[#16161c] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Latest Video Performance
                </h3>
                {myVideos[0] && (
                  <button
                    onClick={() => navigateTo('watch', myVideos[0].id)}
                    className="text-xs text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1 cursor-pointer font-medium"
                  >
                    <span>Watch page</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {myVideos[0] ? (
                <div className="flex flex-col sm:flex-row gap-4 items-start">
                  <div className="relative w-full sm:w-56 aspect-video rounded-xl overflow-hidden bg-slate-900 shrink-0">
                    <img
                      src={myVideos[0].thumbnailUrl}
                      alt={myVideos[0].title}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-1.5 right-1.5 bg-black/80 text-white text-[10px] font-mono px-1.5 py-0.5 rounded">
                      {myVideos[0].formattedDuration}
                    </span>
                  </div>
                  <div className="flex-1 space-y-2">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2">
                      {myVideos[0].title}
                    </h4>
                    <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-100 dark:border-slate-800 text-xs font-mono tabular-nums">
                      <div>
                        <div className="text-slate-400 text-[10px]">Views</div>
                        <div className="font-bold text-slate-900 dark:text-white mt-0.5">
                          {myVideos[0].views.toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <div className="text-slate-400 text-[10px]">Likes</div>
                        <div className="font-bold text-slate-900 dark:text-white mt-0.5">
                          {myVideos[0].likes.toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <div className="text-slate-400 text-[10px]">Visibility</div>
                        <div className="font-bold text-slate-900 dark:text-white mt-0.5 capitalize">
                          {myVideos[0].visibility}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center text-xs text-slate-400">
                  No video uploaded yet. Click "Upload Video" to get started.
                </div>
              )}
            </div>

            {/* Quick Actions & Guidance */}
            <div className="p-5 rounded-3xl bg-white dark:bg-[#16161c] border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Creator Toolkit
              </h3>
              <p className="text-xs text-slate-500">
                Grow your channel reach with daily uploads, Shorts, and community polling.
              </p>
              <div className="space-y-2 pt-2">
                <button
                  onClick={() => setIsUploadModalOpen(true)}
                  className="w-full py-2.5 px-3 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center justify-between cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Film className="w-4 h-4 text-rose-500" />
                    <span>Upload Long-Form 4K</span>
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-slate-400" />
                </button>
                <button
                  onClick={() => setIsShortUploadModalOpen(true)}
                  className="w-full py-2.5 px-3 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center justify-between cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Flame className="w-4 h-4 text-amber-500" />
                    <span>Upload Vertical Short</span>
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-slate-400" />
                </button>
                <button
                  onClick={() => navigateTo('monetization')}
                  className="w-full py-2.5 px-3 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center justify-between cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-emerald-500" />
                    <span>Partner Program Rules</span>
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Content Manager */}
      {activeTab === 'content' && (
        <div className="bg-white dark:bg-[#16161c] border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Channel Videos ({myVideos.length})
            </h3>
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Video</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-500 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Video</th>
                  <th className="py-3 px-4">Visibility</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Views</th>
                  <th className="py-3 px-4">Likes</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {myVideos.map((vid) => (
                  <tr key={vid.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={vid.thumbnailUrl}
                          alt={vid.title}
                          className="w-20 aspect-video rounded-lg object-cover shrink-0 bg-slate-900"
                        />
                        <div className="max-w-xs">
                          <button
                            onClick={() => navigateTo('watch', vid.id)}
                            className="font-bold text-slate-900 dark:text-white line-clamp-1 hover:text-rose-600 cursor-pointer text-left"
                          >
                            {vid.title}
                          </button>
                          <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                            {vid.category} · {vid.formattedDuration}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <button
                        onClick={() => toggleVisibility(vid.id, vid.visibility)}
                        className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300 capitalize cursor-pointer hover:underline"
                        title="Click to toggle visibility"
                      >
                        {vid.visibility === 'public' ? (
                          <Globe className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <Lock className="w-3.5 h-3.5 text-amber-500" />
                        )}
                        <span>{vid.visibility}</span>
                      </button>
                    </td>

                    <td className="py-3 px-4 text-slate-500 font-mono tabular-nums">
                      {new Date(vid.uploadDate).toLocaleDateString()}
                    </td>

                    <td className="py-3 px-4 font-mono font-bold tabular-nums text-slate-900 dark:text-white">
                      {vid.views.toLocaleString()}
                    </td>

                    <td className="py-3 px-4 font-mono tabular-nums text-slate-700 dark:text-slate-300">
                      {vid.likes.toLocaleString()}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => navigateTo('watch', vid.id)}
                          className="p-1.5 text-slate-500 hover:text-rose-600 cursor-pointer"
                          title="View"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteVideo(vid.id)}
                          className="p-1.5 text-slate-500 hover:text-rose-600 cursor-pointer"
                          title="Delete Video"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Analytics */}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 rounded-3xl bg-white dark:bg-[#16161c] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Traffic Sources Breakdown
            </h3>
            <div className="space-y-3 font-mono text-xs tabular-nums">
              {[
                { source: 'VidPulse Search & Suggestions', percentage: 48 },
                { source: 'Browse Features (Home & Category Feeds)', percentage: 28 },
                { source: 'Channel Pages & Subscriptions', percentage: 14 },
                { source: 'External & Direct Links', percentage: 10 },
              ].map((s, i) => (
                <div key={i}>
                  <div className="flex justify-between text-slate-700 dark:text-slate-300 mb-1">
                    <span>{s.source}</span>
                    <span className="font-bold">{s.percentage}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-rose-600 h-full rounded-full" style={{ width: `${s.percentage}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-[#16161c] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Top Geographic Demographics
            </h3>
            <div className="space-y-3 font-mono text-xs tabular-nums">
              {[
                { country: 'United States', share: 36 },
                { country: 'Germany & EU', share: 24 },
                { country: 'United Kingdom', share: 15 },
                { country: 'Japan & Korea', share: 14 },
                { country: 'Other International', share: 11 },
              ].map((g, i) => (
                <div key={i}>
                  <div className="flex justify-between text-slate-700 dark:text-slate-300 mb-1">
                    <span>{g.country}</span>
                    <span className="font-bold">{g.share}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${g.share}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Comments Moderation */}
      {activeTab === 'comments' && (
        <div className="bg-white dark:bg-[#16161c] border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Channel Comments Inbox ({channelComments.length})
          </h3>
          {channelComments.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              No comments on your videos yet.
            </div>
          ) : (
            <div className="space-y-3">
              {channelComments.map((com) => (
                <div key={com.id} className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 flex items-start gap-3">
                  <img
                    src={com.userAvatar}
                    alt={com.userName}
                    className="w-8 h-8 rounded-full object-cover shrink-0 mt-0.5"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span>{com.userName}</span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {new Date(com.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300 mt-1">
                      {com.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Customization */}
      {activeTab === 'customization' && (
        <div className="bg-white dark:bg-[#16161c] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs max-w-xl space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Channel Branding
          </h3>
          <p className="text-xs text-slate-500">
            Customize your channel visual identity, handle, and description.
          </p>
          <button
            onClick={() => setIsChannelModalOpen(true)}
            className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors"
          >
            Open Channel Customizer
          </button>
        </div>
      )}
    </div>
  );
};

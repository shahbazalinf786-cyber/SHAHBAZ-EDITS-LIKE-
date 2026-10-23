import React, { useState, useEffect } from 'react';
import { 
  ThumbsUp, 
  ThumbsDown, 
  Share2, 
  Bookmark, 
  Flag, 
  CheckCircle2, 
  Bell, 
  ChevronDown, 
  ChevronUp,
  Sparkles,
  Eye,
  Calendar
} from 'lucide-react';
import { VideoPlayer } from '../components/video/VideoPlayer';
import { CommentSection } from '../components/video/CommentSection';
import { VideoCard } from '../components/video/VideoCard';
import { ShareModal } from '../components/video/ShareModal';
import { useApp } from '../context/AppContext';

interface WatchViewProps {
  videoId?: string;
}

export const WatchView: React.FC<WatchViewProps> = ({ videoId }) => {
  const { 
    videos, 
    viewParam, 
    toggleSubscribe, 
    isSubscribed, 
    toggleVideoLike, 
    toggleVideoDislike, 
    getVideoLikeState,
    toggleWatchLater,
    watchLater,
    incrementVideoViews,
    openReportModal,
    navigateTo 
  } = useApp();

  const currentVideoId = videoId || viewParam || videos[0]?.id;
  const currentVideo = videos.find(v => v.id === currentVideoId) || videos[0];

  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isTheaterMode, setIsTheaterMode] = useState(false);
  const [bellState, setBellState] = useState<'all' | 'none'>('all');

  const subscribed = isSubscribed(currentVideo.channelId);
  const likeState = getVideoLikeState(currentVideo.id);
  const isSaved = watchLater.includes(currentVideo.id);

  // Increment views on load
  useEffect(() => {
    if (currentVideo) {
      incrementVideoViews(currentVideo.id);
    }
  }, [currentVideo?.id]);

  const recommendedVideos = videos.filter(v => v.id !== currentVideo.id);

  const formattedDate = new Date(currentVideo.uploadDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className={`p-3 sm:p-5 mx-auto ${isTheaterMode ? 'w-full max-w-[1600px]' : 'max-w-7xl'}`}>
      <div className={`flex flex-col lg:flex-row gap-6 ${isTheaterMode ? 'flex-col' : ''}`}>
        {/* Main Content Column */}
        <div className="flex-1 min-w-0">
          {/* Player Container */}
          <div className="mb-4">
            <VideoPlayer
              src={currentVideo.videoUrl}
              poster={currentVideo.thumbnailUrl}
              title={currentVideo.title}
              isTheaterMode={isTheaterMode}
              onToggleTheater={() => setIsTheaterMode(!isTheaterMode)}
              onEnded={() => {
                if (recommendedVideos.length > 0) {
                  navigateTo('watch', recommendedVideos[0].id);
                }
              }}
            />
          </div>

          {/* Video Title */}
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 dark:text-white leading-snug">
            {currentVideo.title}
          </h1>

          {/* Creator Channel Bar & Social Actions */}
          <div className="flex flex-wrap items-center justify-between gap-4 py-3 border-b border-slate-200 dark:border-slate-800">
            {/* Creator Channel Profile */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigateTo('channel', currentVideo.channelId)}
                className="shrink-0 cursor-pointer"
              >
                <img
                  src={currentVideo.channelAvatar}
                  alt={currentVideo.channelName}
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover"
                />
              </button>
              <div>
                <button
                  onClick={() => navigateTo('channel', currentVideo.channelId)}
                  className="flex items-center gap-1 font-bold text-sm sm:text-base text-slate-900 dark:text-white hover:text-rose-600 transition-colors cursor-pointer"
                >
                  <span>{currentVideo.channelName}</span>
                  {currentVideo.channelVerified && (
                    <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />
                  )}
                </button>
                <div className="text-xs text-slate-500 font-mono tabular-nums">
                  {currentVideo.channelHandle}
                </div>
              </div>

              {/* Subscribe Button */}
              <div className="flex items-center gap-1 ml-2">
                <button
                  onClick={() => toggleSubscribe(currentVideo.channelId)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer shadow-xs ${
                    subscribed
                      ? 'bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700'
                      : 'bg-rose-600 hover:bg-rose-700 text-white'
                  }`}
                >
                  {subscribed ? 'Subscribed' : 'Subscribe'}
                </button>
                {subscribed && (
                  <button
                    onClick={() => setBellState(bellState === 'all' ? 'none' : 'all')}
                    className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
                    title={bellState === 'all' ? "All notifications on" : "Notifications muted"}
                  >
                    <Bell className={`w-4 h-4 ${bellState === 'all' ? 'text-amber-500 fill-amber-500' : ''}`} />
                  </button>
                )}
              </div>
            </div>

            {/* Action Buttons: Like, Dislike, Share, Save, Report */}
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              {/* Like / Dislike Capsule */}
              <div className="flex items-center bg-slate-100 dark:bg-slate-800/90 rounded-full p-0.5 border border-slate-200 dark:border-slate-700/60">
                <button
                  onClick={() => toggleVideoLike(currentVideo.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-l-full text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer transition-colors ${
                    likeState === 'like' ? 'text-rose-600 dark:text-rose-400 font-bold' : 'text-slate-700 dark:text-slate-200'
                  }`}
                >
                  <ThumbsUp className={`w-4 h-4 ${likeState === 'like' ? 'fill-rose-500 text-rose-500' : ''}`} />
                  <span className="font-mono tabular-nums">{currentVideo.likes.toLocaleString()}</span>
                </button>
                <div className="h-4 w-px bg-slate-300 dark:bg-slate-700" />
                <button
                  onClick={() => toggleVideoDislike(currentVideo.id)}
                  className={`px-3 py-1.5 rounded-r-full text-xs hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer transition-colors ${
                    likeState === 'dislike' ? 'text-rose-600 dark:text-rose-400 font-bold' : 'text-slate-700 dark:text-slate-200'
                  }`}
                  title="Dislike"
                >
                  <ThumbsDown className={`w-4 h-4 ${likeState === 'dislike' ? 'fill-rose-500 text-rose-500' : ''}`} />
                </button>
              </div>

              {/* Share */}
              <button
                onClick={() => setIsShareModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800/90 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700/60 rounded-full text-xs font-semibold text-slate-700 dark:text-slate-200 cursor-pointer transition-colors"
              >
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>

              {/* Save to Watch Later */}
              <button
                onClick={() => toggleWatchLater(currentVideo.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors cursor-pointer ${
                  isSaved
                    ? 'bg-rose-50 border-rose-300 text-rose-600 dark:bg-rose-950/40 dark:border-rose-800 dark:text-rose-400'
                    : 'bg-slate-100 dark:bg-slate-800/90 hover:bg-slate-200 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700/60 text-slate-700 dark:text-slate-200'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-rose-500' : ''}`} />
                <span>{isSaved ? 'Saved' : 'Save'}</span>
              </button>

              {/* Report */}
              <button
                onClick={() => openReportModal('video', currentVideo.id, currentVideo.title)}
                className="p-2 text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title="Report Video"
              >
                <Flag className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Description Box */}
          <div className="mt-4 p-4 rounded-2xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80">
            <div className="flex items-center gap-3 text-xs font-bold text-slate-800 dark:text-slate-200 font-mono tabular-nums mb-2">
              <span>{currentVideo.views.toLocaleString()} views</span>
              <span>·</span>
              <span>Published {formattedDate}</span>
              <span>·</span>
              <span className="text-rose-600 dark:text-rose-400">{currentVideo.category}</span>
            </div>

            <div className={`text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap ${
              !isDescriptionExpanded ? 'line-clamp-3' : ''
            }`}>
              {currentVideo.description}
            </div>

            {/* Tags (Zero-pill text separators) */}
            {currentVideo.tags && currentVideo.tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-slate-200 dark:border-slate-800/60 text-xs text-rose-600 dark:text-rose-400">
                {currentVideo.tags.map((tag, idx) => (
                  <span key={idx} className="hover:underline cursor-pointer">
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            <button
              onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
              className="mt-2 text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1 hover:underline cursor-pointer"
            >
              <span>{isDescriptionExpanded ? 'Show less' : 'Show more'}</span>
              {isDescriptionExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Comments Section */}
          <div className="mt-8">
            <CommentSection targetType="video" targetId={currentVideo.id} />
          </div>
        </div>

        {/* Recommended Videos Sidebar */}
        <div className={`w-full lg:w-96 shrink-0 space-y-3 ${isTheaterMode ? 'mt-6' : ''}`}>
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Related Videos
            </h3>
            <span className="text-[11px] text-slate-400">Autoplay on</span>
          </div>

          <div className="space-y-1">
            {recommendedVideos.map((recVideo) => (
              <VideoCard key={recVideo.id} video={recVideo} layout="horizontal" />
            ))}
          </div>
        </div>
      </div>

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        title={currentVideo.title}
        url={window.location.origin + `/watch/${currentVideo.id}`}
      />
    </div>
  );
};

import React from 'react';
import { CheckCircle2, MoreVertical, Clock, Share2 } from 'lucide-react';
import { Video } from '../../types';
import { useApp } from '../../context/AppContext';

interface VideoCardProps {
  video: Video;
  layout?: 'grid' | 'horizontal';
}

export const VideoCard: React.FC<VideoCardProps> = ({ video, layout = 'grid' }) => {
  const { navigateTo, toggleWatchLater, watchLater } = useApp();

  const isSaved = watchLater.includes(video.id);

  // Format upload date into relative time
  const getRelativeTime = (dateStr: string) => {
    const diffDays = Math.floor((Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays <= 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  const handleCardClick = () => {
    navigateTo('watch', video.id);
  };

  const handleChannelClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigateTo('channel', video.channelId);
  };

  const handleSaveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWatchLater(video.id);
  };

  if (layout === 'horizontal') {
    return (
      <div 
        onClick={handleCardClick}
        className="flex gap-3 group cursor-pointer hover:bg-slate-100/70 dark:hover:bg-slate-800/40 p-2 rounded-xl transition-colors"
      >
        {/* Thumbnail */}
        <div className="relative w-40 sm:w-48 aspect-video rounded-lg overflow-hidden bg-slate-900 shrink-0">
          <img
            src={video.thumbnailUrl}
            alt={video.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <span className="absolute bottom-1.5 right-1.5 bg-black/85 text-white text-[10px] font-mono px-1.5 py-0.5 rounded">
            {video.formattedDuration}
          </span>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
          <div>
            <h3 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 line-clamp-2 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
              {video.title}
            </h3>
            <button
              onClick={handleChannelClick}
              className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 mt-1 flex items-center gap-1 cursor-pointer"
            >
              <span>{video.channelName}</span>
              {video.channelVerified && (
                <CheckCircle2 className="w-3 h-3 text-blue-500" />
              )}
            </button>
          </div>

          <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-1 font-mono tabular-nums">
            <span>{video.views.toLocaleString()} views</span>
            <span aria-hidden="true">·</span>
            <span>{getRelativeTime(video.uploadDate)}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      onClick={handleCardClick}
      className="group flex flex-col cursor-pointer"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-900">
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Duration badge */}
        <span className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-xs text-white text-xs font-mono font-medium px-2 py-0.5 rounded-md">
          {video.formattedDuration}
        </span>

        {/* Hover quick action */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
          <button
            onClick={handleSaveClick}
            title={isSaved ? "Saved in Watch Later" : "Watch Later"}
            className={`p-1.5 rounded-md text-white backdrop-blur-md transition-colors ${
              isSaved ? 'bg-rose-600' : 'bg-black/60 hover:bg-black/80'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Details */}
      <div className="flex gap-3 mt-3 px-0.5">
        <button
          onClick={handleChannelClick}
          className="shrink-0 cursor-pointer self-start"
        >
          <img
            src={video.channelAvatar}
            alt={video.channelName}
            referrerPolicy="no-referrer"
            className="w-9 h-9 rounded-full object-cover hover:opacity-85 transition-opacity"
          />
        </button>

        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 line-clamp-2 leading-snug group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
            {video.title}
          </h3>

          <button
            onClick={handleChannelClick}
            className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 mt-1 flex items-center gap-1 cursor-pointer"
          >
            <span className="truncate">{video.channelName}</span>
            {video.channelVerified && (
              <CheckCircle2 className="w-3 h-3 text-blue-500 shrink-0" />
            )}
          </button>

          {/* Unboxed Metadata (Zero-pill discipline) */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-0.5 tabular-nums">
            <span>{video.views.toLocaleString()} views</span>
            <span aria-hidden="true">·</span>
            <span>{getRelativeTime(video.uploadDate)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

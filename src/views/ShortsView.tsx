import React, { useState, useRef, useEffect } from 'react';
import { 
  Heart, 
  MessageSquare, 
  Share2, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  ChevronUp, 
  ChevronDown, 
  Music, 
  CheckCircle2, 
  Plus, 
  X,
  Flame,
  ThumbsDown
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CommentSection } from '../components/video/CommentSection';
import { ShareModal } from '../components/video/ShareModal';

export const ShortsView: React.FC = () => {
  const { 
    shorts, 
    toggleShortLike, 
    isShortLiked, 
    toggleSubscribe, 
    isSubscribed, 
    incrementShortViews,
    navigateTo, 
    setIsShortUploadModalOpen 
  } = useApp();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const currentShort = shorts[currentIndex] || shorts[0];

  useEffect(() => {
    if (currentShort) {
      incrementShortViews(currentShort.id);
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch(() => {});
        setIsPlaying(true);
      }
    }
  }, [currentIndex, currentShort?.id]);

  // Keyboard navigation: ArrowUp, ArrowDown
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        handleNext();
      } else if (e.key === ' ') {
        e.preventDefault();
        togglePlay();
      } else if (e.key === 'm') {
        toggleMute();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, shorts.length]);

  const handleNext = () => {
    if (currentIndex < shorts.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setCurrentIndex(0); // loop
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  if (!currentShort) {
    return (
      <div className="py-20 text-center text-slate-400">
        No shorts available. Be the first to create one!
      </div>
    );
  }

  const liked = isShortLiked(currentShort.id);
  const subscribed = isSubscribed(currentShort.channelId);

  return (
    <div className="relative h-[calc(100vh-3.5rem)] flex items-center justify-center p-2 sm:p-4 bg-slate-950">
      {/* Navigation Buttons for Desktop */}
      <div className="hidden md:flex flex-col gap-3 absolute right-6 top-1/2 -translate-y-1/2 z-20">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="p-3 rounded-full bg-slate-800/80 hover:bg-slate-700 text-white disabled:opacity-30 cursor-pointer transition-colors shadow-lg"
          title="Previous short (Arrow Up)"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
        <button
          onClick={handleNext}
          className="p-3 rounded-full bg-slate-800/80 hover:bg-slate-700 text-white cursor-pointer transition-colors shadow-lg"
          title="Next short (Arrow Down)"
        >
          <ChevronDown className="w-5 h-5" />
        </button>
      </div>

      {/* Main Vertical Player Frame */}
      <div className="relative w-full max-w-[380px] h-full max-h-[720px] rounded-3xl overflow-hidden shadow-2xl bg-black border border-slate-800 flex items-center justify-center">
        {/* Video Element */}
        <video
          ref={videoRef}
          src={currentShort.videoUrl}
          loop
          playsInline
          muted={isMuted}
          onClick={togglePlay}
          className="w-full h-full object-cover cursor-pointer"
        />

        {/* Play/Pause Center Indicator */}
        {!isPlaying && (
          <div 
            onClick={togglePlay}
            className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer pointer-events-auto"
          >
            <div className="w-16 h-16 rounded-full bg-black/60 text-white flex items-center justify-center backdrop-blur-xs">
              <Play className="w-8 h-8 fill-white ml-1" />
            </div>
          </div>
        )}

        {/* Top Controls: Sound, Index, Create */}
        <div className="absolute top-4 inset-x-4 flex items-center justify-between text-white z-10">
          <button
            onClick={toggleMute}
            className="p-2 rounded-full bg-black/50 backdrop-blur-md hover:bg-black/70 cursor-pointer"
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <span className="text-xs font-mono bg-black/50 backdrop-blur-md px-2 py-0.5 rounded-full">
            {currentIndex + 1} / {shorts.length}
          </span>

          <button
            onClick={() => setIsShortUploadModalOpen(true)}
            className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-full text-xs font-bold flex items-center gap-1 shadow-md cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Short</span>
          </button>
        </div>

        {/* Bottom Overlay: Channel info, Title, Audio Sound Track */}
        <div className="absolute bottom-4 left-4 right-16 text-white z-10 pointer-events-none">
          {/* Channel info with Subscribe button */}
          <div className="flex items-center gap-2 mb-2 pointer-events-auto">
            <button
              onClick={() => navigateTo('channel', currentShort.channelId)}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <img
                src={currentShort.channelAvatar}
                alt={currentShort.channelName}
                referrerPolicy="no-referrer"
                className="w-9 h-9 rounded-full object-cover border-2 border-white"
              />
              <span className="text-xs font-bold truncate group-hover:underline">
                {currentShort.channelHandle}
              </span>
            </button>
            <button
              onClick={() => toggleSubscribe(currentShort.channelId)}
              className={`px-3 py-1 rounded-full text-[11px] font-bold cursor-pointer transition-colors ${
                subscribed 
                  ? 'bg-white/20 text-white backdrop-blur-md' 
                  : 'bg-rose-600 hover:bg-rose-700 text-white'
              }`}
            >
              {subscribed ? 'Subscribed' : 'Subscribe'}
            </button>
          </div>

          {/* Caption */}
          <p className="text-xs font-medium leading-snug line-clamp-2 text-slate-100">
            {currentShort.title}
          </p>

          {/* Sound attribution */}
          <div className="flex items-center gap-1.5 mt-2 text-[11px] text-slate-300">
            <Music className="w-3.5 h-3.5 animate-bounce" />
            <span className="truncate">{currentShort.soundTitle} · {currentShort.soundArtist}</span>
          </div>
        </div>

        {/* Right Floating Rail: Likes, Comments, Share, Sound Disc */}
        <div className="absolute bottom-6 right-3 flex flex-col items-center gap-4 text-white z-10">
          {/* Like */}
          <button
            onClick={() => toggleShortLike(currentShort.id)}
            className="flex flex-col items-center group cursor-pointer"
          >
            <div className={`p-3 rounded-full backdrop-blur-md transition-transform group-active:scale-125 ${
              liked ? 'bg-rose-600 text-white' : 'bg-black/50 hover:bg-black/70'
            }`}>
              <Heart className={`w-5 h-5 ${liked ? 'fill-white' : ''}`} />
            </div>
            <span className="text-[10px] font-mono font-semibold mt-1 tabular-nums">
              {currentShort.likes.toLocaleString()}
            </span>
          </button>

          {/* Comments */}
          <button
            onClick={() => setIsCommentsOpen(true)}
            className="flex flex-col items-center group cursor-pointer"
          >
            <div className="p-3 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-md transition-transform group-active:scale-110">
              <MessageSquare className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono font-semibold mt-1 tabular-nums">
              {currentShort.commentsCount}
            </span>
          </button>

          {/* Share */}
          <button
            onClick={() => setIsShareOpen(true)}
            className="flex flex-col items-center group cursor-pointer"
          >
            <div className="p-3 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-md transition-transform group-active:scale-110">
              <Share2 className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-semibold mt-1">Share</span>
          </button>

          {/* Spinning Audio Vinyl Disc */}
          <div className="w-9 h-9 rounded-full bg-slate-900 border-2 border-slate-700 flex items-center justify-center animate-spin">
            <Music className="w-4 h-4 text-amber-400" />
          </div>
        </div>
      </div>

      {/* Slide-up Comments Drawer */}
      {isCommentsOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md h-full bg-white dark:bg-[#16161c] border-l border-slate-200 dark:border-slate-800 p-5 overflow-y-auto flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4 shrink-0">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-rose-500" />
                <span>Shorts Discussion</span>
              </h3>
              <button
                onClick={() => setIsCommentsOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1">
              <CommentSection targetType="short" targetId={currentShort.id} />
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        title={currentShort.title}
        url={window.location.origin + `/shorts`}
      />
    </div>
  );
};

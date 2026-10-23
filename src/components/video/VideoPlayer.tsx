import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize, 
  Settings, 
  RotateCcw, 
  RotateCw,
  PictureInPicture,
  Tv
} from 'lucide-react';

interface VideoPlayerProps {
  src: string;
  poster?: string;
  title: string;
  isTheaterMode?: boolean;
  onToggleTheater?: () => void;
  onEnded?: () => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  poster,
  title,
  isTheaterMode = false,
  onToggleTheater,
  onEnded
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<number | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [quality, setQuality] = useState('1080p');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [hoverPosition, setHoverPosition] = useState<number>(0);

  // Play / Pause
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in input or textarea
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.code === 'Space' || e.key === 'k') {
        e.preventDefault();
        togglePlay();
      } else if (e.key === 'm') {
        toggleMute();
      } else if (e.key === 'f') {
        toggleFullscreen();
      } else if (e.key === 'ArrowRight' || e.key === 'l') {
        skipTime(10);
      } else if (e.key === 'ArrowLeft' || e.key === 'j') {
        skipTime(-10);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMuted, isFullscreen]);

  // Handle mouse movements to show/hide controls
  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      window.clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = window.setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
        setIsSettingsOpen(false);
      }
    }, 2500);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  const handleSeekHover = (e: React.MouseEvent<HTMLInputElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const clampedPos = Math.max(0, Math.min(1, pos));
    setHoverPosition(e.clientX - rect.left);
    setHoverTime(clampedPos * duration);
  };

  const handleSeekLeave = () => {
    setHoverTime(null);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    if (isMuted) {
      videoRef.current.muted = false;
      setIsMuted(false);
      videoRef.current.volume = volume || 0.5;
    } else {
      videoRef.current.muted = true;
      setIsMuted(true);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
      setIsMuted(val === 0);
    }
  };

  const skipTime = (seconds: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = Math.max(0, Math.min(duration, videoRef.current.currentTime + seconds));
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
    setIsSettingsOpen(false);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const togglePiP = async () => {
    if (!videoRef.current) return;
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else {
        await videoRef.current.requestPictureInPicture();
      }
    } catch (err) {
      console.warn('PiP not supported or allowed:', err);
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '00:00';
    const mins = Math.floor(secs / 60);
    const remainder = Math.floor(secs % 60);
    const hrs = Math.floor(mins / 60);
    const remMins = mins % 60;
    if (hrs > 0) {
      return `${hrs}:${remMins < 10 ? '0' : ''}${remMins}:${remainder < 10 ? '0' : ''}${remainder}`;
    }
    return `${mins}:${remainder < 10 ? '0' : ''}${remainder}`;
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
      className={`relative bg-black group select-none overflow-hidden ${
        isFullscreen 
          ? 'w-screen h-screen' 
          : isTheaterMode 
            ? 'w-full aspect-[21/9] max-h-[70vh] rounded-none' 
            : 'w-full aspect-video rounded-2xl shadow-xl'
      }`}
    >
      {/* HTML5 Native Video Tag */}
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={onEnded}
        onClick={togglePlay}
        playsInline
        className="w-full h-full object-contain cursor-pointer"
      />

      {/* Center Big Play Animation on Pause */}
      {!isPlaying && (
        <div 
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center bg-black/20 cursor-pointer"
        >
          <div className="w-16 h-16 rounded-full bg-rose-600/90 text-white flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-transform backdrop-blur-xs">
            <Play className="w-8 h-8 fill-white ml-1" />
          </div>
        </div>
      )}

      {/* Overlay Gradient Controls Scrim */}
      <div 
        className={`absolute inset-x-0 bottom-0 pt-16 pb-3 px-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent transition-opacity duration-300 flex flex-col gap-2 ${
          showControls || !isPlaying ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Scrubber Timeline Bar */}
        <div className="relative flex items-center w-full group/timeline">
          {/* Hover Time Tooltip */}
          {hoverTime !== null && (
            <div 
              style={{ left: `${hoverPosition}px` }}
              className="absolute -top-8 -translate-x-1/2 bg-black/90 text-white text-[11px] font-mono px-2 py-0.5 rounded shadow pointer-events-none"
            >
              {formatTime(hoverTime)}
            </div>
          )}

          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={handleSeekChange}
            onMouseMove={handleSeekHover}
            onMouseLeave={handleSeekLeave}
            className="w-full h-1.5 hover:h-2.5 bg-white/30 rounded-lg appearance-none cursor-pointer accent-rose-600 transition-all"
            style={{
              background: `linear-gradient(to right, #e11d48 ${(currentTime / (duration || 1)) * 100}%, rgba(255,255,255,0.3) ${(currentTime / (duration || 1)) * 100}%)`
            }}
          />
        </div>

        {/* Buttons Row */}
        <div className="flex items-center justify-between text-white text-xs">
          {/* Left: Play/Pause, Rewind, Forward, Volume, Time */}
          <div className="flex items-center gap-3">
            <button
              onClick={togglePlay}
              className="p-1 hover:text-rose-400 transition-colors cursor-pointer"
              title={isPlaying ? "Pause (k)" : "Play (k)"}
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white" />}
            </button>

            <button
              onClick={() => skipTime(-10)}
              className="p-1 hover:text-rose-400 transition-colors cursor-pointer"
              title="Rewind 10s (j)"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={() => skipTime(10)}
              className="p-1 hover:text-rose-400 transition-colors cursor-pointer"
              title="Forward 10s (l)"
            >
              <RotateCw className="w-4 h-4" />
            </button>

            {/* Volume */}
            <div className="flex items-center gap-1.5 group/vol">
              <button
                onClick={toggleMute}
                className="p-1 hover:text-rose-400 transition-colors cursor-pointer"
                title={isMuted ? "Unmute (m)" : "Mute (m)"}
              >
                {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-14 sm:w-20 h-1 bg-white/40 rounded appearance-none accent-rose-600 cursor-pointer"
              />
            </div>

            {/* Time display */}
            <div className="text-[11px] font-mono tabular-nums text-slate-300 ml-1">
              <span>{formatTime(currentTime)}</span>
              <span className="mx-1 text-slate-500">/</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Right: Quality, Speed, Theater, PiP, Fullscreen */}
          <div className="flex items-center gap-2 relative">
            {/* Settings menu toggle */}
            <div className="relative">
              <button
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  isSettingsOpen ? 'bg-white/20 text-rose-400' : 'hover:bg-white/10'
                }`}
                title="Settings"
              >
                <Settings className="w-4 h-4" />
              </button>

              {/* Settings Dropdown */}
              {isSettingsOpen && (
                <div className="absolute right-0 bottom-9 w-48 bg-slate-900/95 border border-slate-700 rounded-xl p-2.5 shadow-2xl backdrop-blur-md z-50 text-xs text-slate-200">
                  <div className="font-semibold text-slate-400 text-[10px] uppercase mb-1">
                    Playback Speed
                  </div>
                  <div className="grid grid-cols-3 gap-1 mb-2.5">
                    {[0.5, 0.75, 1, 1.25, 1.5, 2].map((s) => (
                      <button
                        key={s}
                        onClick={() => handleSpeedChange(s)}
                        className={`py-1 text-center rounded cursor-pointer ${
                          playbackSpeed === s ? 'bg-rose-600 text-white font-bold' : 'hover:bg-white/10'
                        }`}
                      >
                        {s}x
                      </button>
                    ))}
                  </div>

                  <div className="font-semibold text-slate-400 text-[10px] uppercase mb-1">
                    Resolution Quality
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    {['1080p', '720p', '480p', 'Auto'].map((q) => (
                      <button
                        key={q}
                        onClick={() => {
                          setQuality(q);
                          setIsSettingsOpen(false);
                        }}
                        className={`py-1 text-center rounded cursor-pointer ${
                          quality === q ? 'bg-rose-600 text-white font-bold' : 'hover:bg-white/10'
                        }`}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Theater Mode */}
            {onToggleTheater && (
              <button
                onClick={onToggleTheater}
                className="hidden sm:block p-1.5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                title={isTheaterMode ? "Default View" : "Theater Mode"}
              >
                <Tv className="w-4 h-4" />
              </button>
            )}

            {/* Picture in Picture */}
            <button
              onClick={togglePiP}
              className="p-1.5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              title="Picture in Picture"
            >
              <PictureInPicture className="w-4 h-4" />
            </button>

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className="p-1.5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              title="Fullscreen (f)"
            >
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

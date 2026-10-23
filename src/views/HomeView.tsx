import React, { useState } from 'react';
import { VideoCard } from '../components/video/VideoCard';
import { useApp } from '../context/AppContext';
import { Flame, Play, Sparkles, TrendingUp, Compass } from 'lucide-react';

export const HomeView: React.FC = () => {
  const { videos, shorts, navigateTo } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = [
    'All',
    'Tech & AI',
    'Nature & Travel',
    'Lofi & Music',
    'Culinary',
    'Coding & Dev',
    'Film & Media'
  ];

  const filteredVideos = selectedCategory === 'All'
    ? videos.filter(v => v.visibility === 'public')
    : videos.filter(v => v.visibility === 'public' && v.category === selectedCategory);

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Category Filter Pills (Functional Filter Buttons) */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              selectedCategory === cat
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:bg-slate-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Featured Spotlight Banner */}
      {selectedCategory === 'All' && videos.length > 0 && (
        <div 
          onClick={() => navigateTo('watch', videos[0].id)}
          className="relative rounded-3xl overflow-hidden bg-slate-950 text-white shadow-xl cursor-pointer group border border-slate-800"
        >
          <div className="aspect-[21/9] sm:aspect-[24/9] max-h-72 w-full relative">
            <img
              src={videos[0].thumbnailUrl}
              alt={videos[0].title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
            
            <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 flex flex-col justify-end">
              <div className="flex items-center gap-2 text-xs text-rose-400 font-semibold mb-1">
                <TrendingUp className="w-4 h-4" />
                <span>Featured Premiere · Trending #1</span>
              </div>
              <h2 className="text-base sm:text-xl md:text-2xl font-bold line-clamp-2 max-w-2xl leading-tight">
                {videos[0].title}
              </h2>
              <div className="flex items-center gap-3 mt-2 text-xs text-slate-300">
                <span className="font-medium text-white">{videos[0].channelName}</span>
                <span aria-hidden="true">·</span>
                <span className="tabular-nums">{videos[0].views.toLocaleString()} views</span>
                <span aria-hidden="true">·</span>
                <span>{videos[0].formattedDuration}</span>
              </div>
            </div>

            <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-rose-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Play className="w-5 h-5 fill-white ml-0.5" />
            </div>
          </div>
        </div>
      )}

      {/* Main Video Feed Grid */}
      <div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-x-5 gap-y-7">
          {filteredVideos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      </div>

      {/* Shorts Showcase Strip */}
      {shorts.length > 0 && (
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
                <Flame className="w-4 h-4 fill-amber-500" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                VidPulse Shorts
              </h3>
            </div>
            <button
              onClick={() => navigateTo('shorts')}
              className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline cursor-pointer"
            >
              View all
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
            {shorts.slice(0, 4).map((short) => (
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h4 className="text-xs font-bold line-clamp-2 leading-snug">
                    {short.title}
                  </h4>
                  <div className="text-[11px] text-slate-300 mt-1 font-mono tabular-nums">
                    {short.views.toLocaleString()} views
                  </div>
                </div>
                <div className="absolute top-2.5 right-2.5 p-1.5 bg-black/60 rounded-full text-white">
                  <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

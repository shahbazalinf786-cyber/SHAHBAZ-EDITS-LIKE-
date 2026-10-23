import React, { useState } from 'react';
import { Search, SlidersHorizontal, CheckCircle2, Film, Flame, Tv } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { VideoCard } from '../components/video/VideoCard';

interface SearchViewProps {
  initialQuery?: string;
}

export const SearchView: React.FC<SearchViewProps> = ({ initialQuery }) => {
  const { searchQuery, viewParam, videos, shorts, channels, navigateTo, toggleSubscribe, isSubscribed } = useApp();

  const query = (viewParam || searchQuery || initialQuery || '').toLowerCase().trim();
  const [filterType, setFilterType] = useState<'all' | 'videos' | 'shorts' | 'channels'>('all');
  const [sortBy, setSortBy] = useState<'relevance' | 'views' | 'date'>('relevance');

  // Filter videos
  const matchedVideos = videos.filter(v => 
    !query ||
    v.title.toLowerCase().includes(query) ||
    v.description.toLowerCase().includes(query) ||
    v.channelName.toLowerCase().includes(query) ||
    v.tags.some(t => t.toLowerCase().includes(query))
  );

  // Filter shorts
  const matchedShorts = shorts.filter(s =>
    !query ||
    s.title.toLowerCase().includes(query) ||
    s.channelName.toLowerCase().includes(query)
  );

  // Filter channels
  const matchedChannels = channels.filter(c =>
    !query ||
    c.name.toLowerCase().includes(query) ||
    c.handle.toLowerCase().includes(query) ||
    c.description.toLowerCase().includes(query)
  );

  // Sort videos
  const sortedVideos = [...matchedVideos].sort((a, b) => {
    if (sortBy === 'views') return b.views - a.views;
    if (sortBy === 'date') return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
    return 0; // relevance
  });

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Search Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Search className="w-5 h-5 text-rose-500" />
            <span>Search Results for "{query || 'All Content'}"</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Found {sortedVideos.length} videos, {matchedShorts.length} shorts, and {matchedChannels.length} channels
          </p>
        </div>

        {/* Filter Type Buttons (Functional Filter Controls) */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
          {[
            { id: 'all', label: 'All' },
            { id: 'videos', label: 'Videos' },
            { id: 'shorts', label: 'Shorts' },
            { id: 'channels', label: 'Channels' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilterType(f.id as any)}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                filterType === f.id
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Matched Channels Section */}
      {(filterType === 'all' || filterType === 'channels') && matchedChannels.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Channels
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {matchedChannels.map((channel) => {
              const subscribed = isSubscribed(channel.id);
              return (
                <div
                  key={channel.id}
                  className="flex items-center justify-between p-4 bg-white dark:bg-[#16161c] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs"
                >
                  <button
                    onClick={() => navigateTo('channel', channel.id)}
                    className="flex items-center gap-3.5 text-left cursor-pointer group"
                  >
                    <img
                      src={channel.avatar}
                      alt={channel.name}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <div className="flex items-center gap-1 font-bold text-sm text-slate-900 dark:text-white group-hover:text-rose-500 transition-colors">
                        <span>{channel.name}</span>
                        {channel.verified && <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />}
                      </div>
                      <div className="text-xs text-slate-400 font-mono tabular-nums">
                        {channel.handle} · {channel.subscriberCount.toLocaleString()} subs
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => toggleSubscribe(channel.id)}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      subscribed
                        ? 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                        : 'bg-rose-600 hover:bg-rose-700 text-white shadow-xs'
                    }`}
                  >
                    {subscribed ? 'Subscribed' : 'Subscribe'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Matched Videos */}
      {(filterType === 'all' || filterType === 'videos') && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Videos ({sortedVideos.length})
            </h2>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span>Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg text-slate-800 dark:text-slate-200 border-none focus:outline-none cursor-pointer"
              >
                <option value="relevance">Relevance</option>
                <option value="views">Most Views</option>
                <option value="date">Upload Date</option>
              </select>
            </div>
          </div>

          {sortedVideos.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              No videos matching your query.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {sortedVideos.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Matched Shorts */}
      {(filterType === 'all' || filterType === 'shorts') && matchedShorts.length > 0 && (
        <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-amber-500" />
            <span>Shorts ({matchedShorts.length})</span>
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {matchedShorts.map((short) => (
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
        </div>
      )}
    </div>
  );
};

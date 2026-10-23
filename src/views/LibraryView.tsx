import React, { useState } from 'react';
import { Clock, Bookmark, ThumbsUp, Trash2, Play, Film } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { VideoCard } from '../components/video/VideoCard';

export const LibraryView: React.FC = () => {
  const { 
    watchHistory, 
    watchLater, 
    videos, 
    clearHistory, 
    getVideoLikeState, 
    navigateTo, 
    currentUser 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'history' | 'watch_later' | 'liked'>('history');

  const historyVideos = watchHistory
    .map(h => videos.find(v => v.id === h.videoId))
    .filter(Boolean) as typeof videos;

  const savedVideos = watchLater
    .map(id => videos.find(v => v.id === id))
    .filter(Boolean) as typeof videos;

  const likedVideos = videos.filter(v => getVideoLikeState(v.id) === 'like');

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Clock className="w-6 h-6 text-rose-500" />
            <span>Library & Playlists</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Your watch history, saved queue, and favorite content
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
          {[
            { id: 'history', label: 'History', count: historyVideos.length, icon: Clock },
            { id: 'watch_later', label: 'Watch Later', count: savedVideos.length, icon: Bookmark },
            { id: 'liked', label: 'Liked', count: likedVideos.length, icon: ThumbsUp },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-bold'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                <span className="text-[11px] opacity-75">({tab.count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* History Tab */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Recently Watched
            </h2>
            {historyVideos.length > 0 && (
              <button
                onClick={clearHistory}
                className="text-xs font-medium text-slate-500 hover:text-rose-600 flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear Watch History</span>
              </button>
            )}
          </div>

          {historyVideos.length === 0 ? (
            <div className="py-20 text-center space-y-3">
              <Clock className="w-12 h-12 text-slate-400 mx-auto" />
              <p className="text-sm font-bold text-slate-900 dark:text-white">Your history is clear</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Videos you watch will appear here so you can easily pick up where you left off.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {historyVideos.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Watch Later Tab */}
      {activeTab === 'watch_later' && (
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Watch Later Queue ({savedVideos.length})
          </h2>

          {savedVideos.length === 0 ? (
            <div className="py-20 text-center space-y-3">
              <Bookmark className="w-12 h-12 text-slate-400 mx-auto" />
              <p className="text-sm font-bold text-slate-900 dark:text-white">No saved videos</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Click the bookmark or clock icon on any video to save it for later viewing.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {savedVideos.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Liked Videos Tab */}
      {activeTab === 'liked' && (
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Videos You Liked ({likedVideos.length})
          </h2>

          {likedVideos.length === 0 ? (
            <div className="py-20 text-center space-y-3">
              <ThumbsUp className="w-12 h-12 text-slate-400 mx-auto" />
              <p className="text-sm font-bold text-slate-900 dark:text-white">No liked videos yet</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Give thumbs up to videos you enjoy to save them in this playlist.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {likedVideos.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

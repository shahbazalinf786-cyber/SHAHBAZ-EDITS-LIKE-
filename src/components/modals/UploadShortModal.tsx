import React, { useState } from 'react';
import { X, Flame, Music, Sparkles, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const UploadShortModal: React.FC = () => {
  const { 
    isShortUploadModalOpen, 
    setIsShortUploadModalOpen, 
    uploadShort, 
    navigateTo,
    currentUser,
    setIsAuthModalOpen 
  } = useApp();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [soundTitle, setSoundTitle] = useState('Trending Viral Sound - 120BPM');
  const [soundArtist, setSoundArtist] = useState('VidPulse Originals');
  const [videoUrl, setVideoUrl] = useState('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4');
  const [isDone, setIsDone] = useState(false);

  if (!isShortUploadModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }
    if (!title.trim()) return;

    uploadShort({
      title: title.trim(),
      description: description.trim(),
      videoUrl,
      soundTitle,
      soundArtist,
    });

    setIsDone(true);
    setTimeout(() => {
      setIsDone(false);
      setIsShortUploadModalOpen(false);
      navigateTo('shorts');
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div className="bg-white dark:bg-[#16161c] border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-lg p-6 shadow-2xl relative">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Flame className="w-4 h-4 fill-amber-500" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Create VidPulse Short
              </h3>
              <p className="text-[11px] text-slate-400">Vertical video up to 60 seconds</p>
            </div>
          </div>
          <button
            onClick={() => setIsShortUploadModalOpen(false)}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isDone ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
            <h4 className="text-base font-bold text-slate-900 dark:text-white">
              Short Published to Feed!
            </h4>
            <p className="text-xs text-slate-500">Redirecting to Shorts feed...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Short Caption & Hashtags *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Hook viewers with a catchy caption #shorts #tech..."
                required
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-amber-500 text-slate-900 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Sound Attribution
              </label>
              <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2">
                <Music className="w-4 h-4 text-amber-500 shrink-0" />
                <input
                  type="text"
                  value={soundTitle}
                  onChange={(e) => setSoundTitle(e.target.value)}
                  placeholder="Sound title..."
                  className="w-full bg-transparent text-xs text-slate-900 dark:text-slate-100 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Vertical Video Source
              </label>
              <select
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-amber-500 text-slate-900 dark:text-slate-100 cursor-pointer"
              >
                <option value="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4">
                  🔥 High Velocity Fast Cut (Sample 1)
                </option>
                <option value="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4">
                  🏔️ Mountain Waterfall Dive (Sample 2)
                </option>
                <option value="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4">
                  🍕 Culinary ASMR Crust (Sample 3)
                </option>
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsShortUploadModalOpen(false)}
                className="px-4 py-2 text-xs font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs cursor-pointer shadow-xs transition-colors"
              >
                Post Short
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

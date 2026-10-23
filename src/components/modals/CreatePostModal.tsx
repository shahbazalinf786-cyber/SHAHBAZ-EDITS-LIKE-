import React, { useState } from 'react';
import { X, Layers, Image as ImageIcon, BarChart2, CheckCircle2, Plus, Trash2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CreatePostModal: React.FC = () => {
  const { 
    isCreatePostModalOpen, 
    setIsCreatePostModalOpen, 
    createPost, 
    navigateTo, 
    currentUser, 
    setIsAuthModalOpen,
    currentChannel 
  } = useApp();

  const [postType, setPostType] = useState<'text' | 'image' | 'poll'>('text');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('/src/assets/images/thumb_tech_ai_1792757458005.jpg');
  const [pollOptions, setPollOptions] = useState<string[]>(['Option 1', 'Option 2']);
  const [isDone, setIsDone] = useState(false);

  if (!isCreatePostModalOpen) return null;

  const handleAddPollOption = () => {
    if (pollOptions.length < 5) {
      setPollOptions(prev => [...prev, `Option ${prev.length + 1}`]);
    }
  };

  const handlePollOptionChange = (index: number, val: string) => {
    setPollOptions(prev => prev.map((opt, i) => i === index ? val : opt));
  };

  const handleRemovePollOption = (index: number) => {
    if (pollOptions.length > 2) {
      setPollOptions(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }
    if (!content.trim()) return;

    createPost({
      type: postType,
      content: content.trim(),
      imageUrl: postType === 'image' ? imageUrl : undefined,
      pollOptions: postType === 'poll' ? pollOptions.filter(o => o.trim()) : undefined,
    });

    setIsDone(true);
    setTimeout(() => {
      setIsDone(false);
      setIsCreatePostModalOpen(false);
      navigateTo('community');
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div className="bg-white dark:bg-[#16161c] border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-lg p-6 shadow-2xl relative">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Create Community Post
              </h3>
              <p className="text-[11px] text-slate-400">
                Engage with {currentChannel?.name || 'your'} subscribers
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsCreatePostModalOpen(false)}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isDone ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
            <h4 className="text-base font-bold text-slate-900 dark:text-white">
              Community Post Published!
            </h4>
            <p className="text-xs text-slate-500">Redirecting to Community feed...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            {/* Post Type Selector (interactive buttons) */}
            <div className="grid grid-cols-3 gap-2 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setPostType('text')}
                className={`py-1.5 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  postType === 'text' 
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs' 
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Text Update
              </button>
              <button
                type="button"
                onClick={() => setPostType('image')}
                className={`py-1.5 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  postType === 'image' 
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs' 
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                Image
              </button>
              <button
                type="button"
                onClick={() => setPostType('poll')}
                className={`py-1.5 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  postType === 'poll' 
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs' 
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <BarChart2 className="w-3.5 h-3.5" />
                Live Poll
              </button>
            </div>

            {/* Post Textarea */}
            <div>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Share an announcement, ask a question, or start a discussion..."
                rows={4}
                required
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-900 dark:text-slate-100 placeholder-slate-400"
              />
            </div>

            {/* Image Preview / Selection */}
            {postType === 'image' && (
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Select Feature Image
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    '/src/assets/images/thumb_tech_ai_1792757458005.jpg',
                    '/src/assets/images/thumb_cinematic_travel_1792757458722.jpg',
                    '/src/assets/images/thumb_cooking_culinary_1792757459060.jpg',
                  ].map((img, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setImageUrl(img)}
                      className={`aspect-video rounded-xl overflow-hidden border-2 cursor-pointer ${
                        imageUrl === img ? 'border-indigo-500 ring-2 ring-indigo-500/30' : 'opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="choice" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Poll Options Builder */}
            {postType === 'poll' && (
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Poll Options (Min 2, Max 5)
                </label>
                {pollOptions.map((opt, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) => handlePollOptionChange(idx, e.target.value)}
                      placeholder={`Option ${idx + 1}`}
                      className="flex-1 px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-900 dark:text-slate-100"
                    />
                    {pollOptions.length > 2 && (
                      <button
                        type="button"
                        onClick={() => handleRemovePollOption(idx)}
                        className="p-1 text-slate-400 hover:text-rose-500 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                {pollOptions.length < 5 && (
                  <button
                    type="button"
                    onClick={handleAddPollOption}
                    className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer pt-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Option
                  </button>
                )}
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsCreatePostModalOpen(false)}
                className="px-4 py-2 text-xs font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs cursor-pointer shadow-xs transition-colors"
              >
                Publish Post
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

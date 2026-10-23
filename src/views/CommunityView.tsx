import React from 'react';
import { 
  ThumbsUp, 
  MessageSquare, 
  Share2, 
  CheckCircle2, 
  BarChart2, 
  Plus, 
  Check,
  Layers
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const CommunityView: React.FC = () => {
  const { 
    posts, 
    votePoll, 
    togglePostLike, 
    isPostLiked, 
    setIsCreatePostModalOpen, 
    navigateTo, 
    currentUser 
  } = useApp();

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header & Create CTA */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-6 h-6 text-indigo-500" />
            <span>Community Feed</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Updates, behind-the-scenes previews, and interactive polls from creators
          </p>
        </div>

        <button
          onClick={() => setIsCreatePostModalOpen(true)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>New Post</span>
        </button>
      </div>

      {/* Posts List */}
      <div className="space-y-5">
        {posts.map((post) => {
          const liked = isPostLiked(post.id);
          const hasVoted = Boolean(post.userVotedOptionId);

          return (
            <div
              key={post.id}
              className="bg-white dark:bg-[#16161c] border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4"
            >
              {/* Creator info */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => navigateTo('channel', post.channelId)}
                  className="flex items-center gap-3 cursor-pointer text-left group"
                >
                  <img
                    src={post.channelAvatar}
                    alt={post.channelName}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <div className="flex items-center gap-1 font-bold text-xs sm:text-sm text-slate-900 dark:text-white group-hover:text-rose-500 transition-colors">
                      <span>{post.channelName}</span>
                      {post.channelVerified && <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0" />}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                </button>
              </div>

              {/* Post content */}
              <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
                {post.content}
              </p>

              {/* Image attachment */}
              {post.type === 'image' && post.imageUrl && (
                <div className="rounded-2xl overflow-hidden aspect-video bg-slate-900">
                  <img
                    src={post.imageUrl}
                    alt="Post"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Poll with real percentage calculation */}
              {post.type === 'poll' && post.pollOptions && (
                <div className="space-y-2 pt-1">
                  {post.pollOptions.map((opt) => {
                    const totalVotes = post.totalVotes || 1;
                    const percentage = Math.round((opt.votes / totalVotes) * 100);
                    const isSelected = post.userVotedOptionId === opt.id;

                    return (
                      <button
                        key={opt.id}
                        onClick={() => votePoll(post.id, opt.id)}
                        disabled={hasVoted}
                        className={`w-full relative overflow-hidden rounded-xl border p-3 text-left transition-all cursor-pointer ${
                          isSelected 
                            ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30' 
                            : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900'
                        }`}
                      >
                        {/* Fill progress bar behind text if voted */}
                        {hasVoted && (
                          <div
                            className={`absolute inset-y-0 left-0 transition-all duration-500 ${
                              isSelected ? 'bg-indigo-500/20 dark:bg-indigo-500/30' : 'bg-slate-200/50 dark:bg-slate-800/60'
                            }`}
                            style={{ width: `${percentage}%` }}
                          />
                        )}

                        <div className="relative flex items-center justify-between text-xs font-semibold text-slate-800 dark:text-slate-200">
                          <div className="flex items-center gap-2">
                            {isSelected && <Check className="w-3.5 h-3.5 text-indigo-500" />}
                            <span>{opt.text}</span>
                          </div>
                          {hasVoted && (
                            <span className="font-mono tabular-nums text-slate-500">
                              {percentage}% ({opt.votes})
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                  <div className="text-[11px] text-slate-400 font-mono tabular-nums pt-1">
                    {post.totalVotes?.toLocaleString() || 0} total votes · {hasVoted ? 'You voted' : 'Click an option to vote'}
                  </div>
                </div>
              )}

              {/* Actions: Likes, Comments */}
              <div className="flex items-center gap-4 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-xs text-slate-500">
                <button
                  onClick={() => togglePostLike(post.id)}
                  className={`flex items-center gap-1.5 hover:text-rose-500 cursor-pointer ${
                    liked ? 'text-rose-600 dark:text-rose-400 font-bold' : ''
                  }`}
                >
                  <ThumbsUp className={`w-4 h-4 ${liked ? 'fill-rose-500 text-rose-500' : ''}`} />
                  <span className="font-mono tabular-nums">{post.likes}</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4" />
                  <span className="font-mono tabular-nums">{post.commentsCount}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

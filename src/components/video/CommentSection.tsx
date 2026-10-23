import React, { useState } from 'react';
import { 
  ThumbsUp, 
  MessageSquare, 
  MoreVertical, 
  Trash2, 
  Edit3, 
  CornerDownRight, 
  SlidersHorizontal,
  Send,
  CheckCircle2
} from 'lucide-react';
import { Comment } from '../../types';
import { useApp } from '../../context/AppContext';

interface CommentSectionProps {
  targetType: 'video' | 'short' | 'post';
  targetId: string;
}

export const CommentSection: React.FC<CommentSectionProps> = ({ targetType, targetId }) => {
  const { 
    comments, 
    addComment, 
    editComment, 
    deleteComment, 
    toggleCommentLike, 
    currentUser, 
    setIsAuthModalOpen,
    openReportModal
  } = useApp();

  const [newCommentText, setNewCommentText] = useState('');
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [sortBy, setSortBy] = useState<'top' | 'newest'>('top');

  const targetComments = comments.filter(c => c.targetType === targetType && c.targetId === targetId);

  // Sorting
  const sortedComments = [...targetComments].sort((a, b) => {
    if (sortBy === 'top') {
      return b.likes - a.likes;
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }
    if (!newCommentText.trim()) return;
    addComment(targetType, targetId, newCommentText.trim());
    setNewCommentText('');
  };

  const handlePostReply = (parentId: string) => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }
    if (!replyText.trim()) return;
    addComment(targetType, targetId, replyText.trim(), parentId);
    setReplyText('');
    setReplyingToId(null);
  };

  const handleSaveEdit = (commentId: string) => {
    if (!editText.trim()) return;
    editComment(commentId, editText.trim());
    setEditingId(null);
  };

  const getRelativeTime = (dateStr: string) => {
    const diffHours = Math.floor((Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60));
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d ago`;
    return `${Math.floor(diffDays / 7)}w ago`;
  };

  return (
    <div className="space-y-6">
      {/* Header & Sort Controls */}
      <div className="flex items-center justify-between">
        <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span>{targetComments.length} Comments</span>
        </h2>

        {/* Sort Filter Buttons (Allowed functional filter controls) */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg text-xs font-medium">
          <button
            onClick={() => setSortBy('top')}
            className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
              sortBy === 'top' 
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold' 
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Top
          </button>
          <button
            onClick={() => setSortBy('newest')}
            className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
              sortBy === 'newest' 
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold' 
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Newest
          </button>
        </div>
      </div>

      {/* Write Comment Box */}
      <form onSubmit={handlePostComment} className="flex gap-3">
        <img
          src={currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'}
          alt={currentUser?.name || 'User'}
          referrerPolicy="no-referrer"
          className="w-9 h-9 rounded-full object-cover shrink-0"
        />
        <div className="flex-1 flex flex-col gap-2">
          <textarea
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
            placeholder={currentUser ? "Add a thoughtful comment..." : "Sign in to leave a comment..."}
            rows={2}
            className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-rose-500 text-slate-900 dark:text-slate-100 placeholder-slate-400 resize-none transition-colors"
          />
          {newCommentText.trim() && (
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setNewCommentText('')}
                className="px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition-colors cursor-pointer shadow-xs"
              >
                Comment
              </button>
            </div>
          )}
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-4">
        {sortedComments.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-400">
            No comments yet. Be the first to start the conversation!
          </div>
        ) : (
          sortedComments.map((comment) => (
            <div key={comment.id} className="flex gap-3 group">
              <img
                src={comment.userAvatar}
                alt={comment.userName}
                referrerPolicy="no-referrer"
                className="w-8 h-8 rounded-full object-cover shrink-0 self-start mt-0.5"
              />

              <div className="flex-1 min-w-0">
                {/* Name & timestamp */}
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                    {comment.userName}
                  </span>

                  {comment.isChannelOwner && (
                    <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400">
                      Creator
                    </span>
                  )}

                  <span className="text-slate-400 text-[11px] tabular-nums">
                    {getRelativeTime(comment.createdAt)}
                  </span>
                </div>

                {/* Content or Edit Form */}
                {editingId === comment.id ? (
                  <div className="mt-1 flex flex-col gap-2">
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      rows={2}
                      className="w-full p-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:border-rose-500 text-slate-900 dark:text-slate-100"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-2.5 py-1 text-xs text-slate-500 hover:text-slate-700 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSaveEdit(comment.id)}
                        className="px-3 py-1 text-xs bg-rose-600 text-white rounded-md cursor-pointer font-medium"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 mt-1 whitespace-pre-wrap leading-relaxed">
                    {comment.content}
                  </p>
                )}

                {/* Comment Actions: Like, Reply, Edit, Delete, Report */}
                <div className="flex items-center gap-4 mt-2 text-xs text-slate-500 dark:text-slate-400">
                  <button
                    onClick={() => toggleCommentLike(comment.id)}
                    className={`flex items-center gap-1.5 hover:text-rose-600 transition-colors cursor-pointer ${
                      comment.isLikedByMe ? 'text-rose-600 dark:text-rose-400 font-semibold' : ''
                    }`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span className="font-mono tabular-nums">{comment.likes}</span>
                  </button>

                  <button
                    onClick={() => {
                      if (!currentUser) {
                        setIsAuthModalOpen(true);
                        return;
                      }
                      setReplyingToId(replyingToId === comment.id ? null : comment.id);
                    }}
                    className="hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer font-medium"
                  >
                    Reply
                  </button>

                  {/* Own comment controls */}
                  {currentUser?.id === comment.userId && (
                    <>
                      <button
                        onClick={() => {
                          setEditingId(comment.id);
                          setEditText(comment.content);
                        }}
                        className="hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
                        title="Edit comment"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteComment(comment.id)}
                        className="hover:text-rose-600 cursor-pointer"
                        title="Delete comment"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}

                  {/* Report */}
                  <button
                    onClick={() => openReportModal('comment', comment.id, `Comment by ${comment.userName}`)}
                    className="opacity-0 group-hover:opacity-100 hover:text-rose-500 transition-opacity cursor-pointer text-[11px]"
                  >
                    Report
                  </button>
                </div>

                {/* Nested Reply Form */}
                {replyingToId === comment.id && (
                  <div className="mt-3 pl-3 border-l-2 border-slate-200 dark:border-slate-700 flex gap-2">
                    <input
                      type="text"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder={`Reply to ${comment.userName}...`}
                      className="flex-1 px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:border-rose-500 text-slate-900 dark:text-slate-100"
                    />
                    <button
                      onClick={() => handlePostReply(comment.id)}
                      className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg cursor-pointer transition-colors"
                    >
                      Reply
                    </button>
                  </div>
                )}

                {/* Nested Replies Display */}
                {comment.replies && comment.replies.length > 0 && (
                  <div className="mt-3 pl-4 space-y-3 border-l-2 border-slate-100 dark:border-slate-800">
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="flex gap-2.5">
                        <img
                          src={reply.userAvatar}
                          alt={reply.userName}
                          referrerPolicy="no-referrer"
                          className="w-6 h-6 rounded-full object-cover shrink-0 mt-0.5"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 text-xs">
                            <span className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                              {reply.userName}
                            </span>
                            {reply.isChannelOwner && (
                              <span className="text-[10px] font-bold text-rose-500">
                                Creator
                              </span>
                            )}
                            <span className="text-slate-400 text-[10px] tabular-nums">
                              {getRelativeTime(reply.createdAt)}
                            </span>
                          </div>
                          <p className="text-xs text-slate-700 dark:text-slate-300 mt-0.5 leading-relaxed">
                            {reply.content}
                          </p>
                          <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-500">
                            <button
                              onClick={() => toggleCommentLike(reply.id)}
                              className={`flex items-center gap-1 hover:text-rose-600 cursor-pointer ${
                                reply.isLikedByMe ? 'text-rose-600 font-semibold' : ''
                              }`}
                            >
                              <ThumbsUp className="w-3 h-3" />
                              <span>{reply.likes}</span>
                            </button>
                            {currentUser?.id === reply.userId && (
                              <button
                                onClick={() => deleteComment(reply.id)}
                                className="hover:text-rose-600 cursor-pointer"
                              >
                                Delete
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

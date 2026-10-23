import React, { useState } from 'react';
import { 
  Bell, 
  CheckCheck, 
  Users, 
  MessageSquare, 
  ThumbsUp, 
  DollarSign, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { NotificationType } from '../types';

export const NotificationsView: React.FC = () => {
  const { 
    notifications, 
    markNotificationAsRead, 
    markAllNotificationsAsRead, 
    navigateTo 
  } = useApp();

  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filteredNotifs = filter === 'all' 
    ? notifications 
    : notifications.filter(n => !n.isRead);

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'subscriber':
        return <Users className="w-4 h-4 text-rose-500" />;
      case 'comment':
      case 'reply':
        return <MessageSquare className="w-4 h-4 text-blue-500" />;
      case 'like':
        return <ThumbsUp className="w-4 h-4 text-rose-500" />;
      case 'monetization':
        return <DollarSign className="w-4 h-4 text-emerald-500" />;
      default:
        return <Sparkles className="w-4 h-4 text-amber-500" />;
    }
  };

  const handleClickNotif = (notif: typeof notifications[0]) => {
    markNotificationAsRead(notif.id);
    if (notif.targetUrl) {
      if (notif.targetUrl.startsWith('/watch/')) {
        const vidId = notif.targetUrl.replace('/watch/', '');
        navigateTo('watch', vidId);
      } else if (notif.targetUrl.includes('monetization')) {
        navigateTo('monetization');
      } else if (notif.targetUrl.includes('studio')) {
        navigateTo('studio');
      } else {
        navigateTo('home');
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Bell className="w-6 h-6 text-rose-500" />
            <span>Notifications</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time activity on your channel, videos, and subscriptions
          </p>
        </div>

        <button
          onClick={markAllNotificationsAsRead}
          className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1.5 cursor-pointer"
        >
          <CheckCheck className="w-4 h-4" />
          <span>Mark all as read</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
            filter === 'all'
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
          }`}
        >
          All Notifications ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
            filter === 'unread'
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
          }`}
        >
          Unread ({notifications.filter(n => !n.isRead).length})
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-2.5">
        {filteredNotifs.length === 0 ? (
          <div className="py-16 text-center text-xs text-slate-400">
            You're all caught up! No notifications to display.
          </div>
        ) : (
          filteredNotifs.map((item) => (
            <div
              key={item.id}
              onClick={() => handleClickNotif(item)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                !item.isRead
                  ? 'bg-rose-50/40 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/60 shadow-xs'
                  : 'bg-white dark:bg-[#16161c] border-slate-200 dark:border-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-900'
              }`}
            >
              {/* Type Icon Badge */}
              <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 mt-0.5">
                {getIcon(item.type)}
              </div>

              {/* Message */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                    {item.title}
                  </h4>
                  <span className="text-[11px] text-slate-400 font-mono tabular-nums shrink-0">
                    {new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  {item.message}
                </p>
              </div>

              {/* Unread dot */}
              {!item.isRead && (
                <div className="w-2.5 h-2.5 rounded-full bg-rose-600 shrink-0 self-center" />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

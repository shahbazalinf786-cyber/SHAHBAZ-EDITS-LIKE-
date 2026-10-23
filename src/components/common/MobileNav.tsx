import React from 'react';
import { Home, Flame, Plus, Tv, User } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const MobileNav: React.FC = () => {
  const { activeView, navigateTo, setIsUploadModalOpen, currentUser } = useApp();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 h-16 bg-white/95 dark:bg-[#0f0f13]/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800/80 px-2 flex items-center justify-around">
      <button
        onClick={() => navigateTo('home')}
        className={`min-h-[44px] min-w-[44px] flex flex-col items-center justify-center transition-colors cursor-pointer ${
          activeView === 'home' 
            ? 'text-rose-600 dark:text-rose-400 font-semibold' 
            : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
        }`}
      >
        <Home className="w-5 h-5" />
        <span className="text-[10px] mt-1">Home</span>
      </button>

      <button
        onClick={() => navigateTo('shorts')}
        className={`min-h-[44px] min-w-[44px] flex flex-col items-center justify-center transition-colors cursor-pointer ${
          activeView === 'shorts' 
            ? 'text-rose-600 dark:text-rose-400 font-semibold' 
            : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
        }`}
      >
        <Flame className="w-5 h-5" />
        <span className="text-[10px] mt-1">Shorts</span>
      </button>

      {/* Center Create Button */}
      <button
        onClick={() => setIsUploadModalOpen(true)}
        aria-label="Upload Video or Create Content"
        className="min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
      >
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-rose-500 to-red-600 flex items-center justify-center text-white shadow-md shadow-rose-500/25 active:scale-95 transition-transform">
          <Plus className="w-5 h-5" />
        </div>
      </button>

      <button
        onClick={() => navigateTo('subscriptions')}
        className={`min-h-[44px] min-w-[44px] flex flex-col items-center justify-center transition-colors cursor-pointer ${
          activeView === 'subscriptions' 
            ? 'text-rose-600 dark:text-rose-400 font-semibold' 
            : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
        }`}
      >
        <Tv className="w-5 h-5" />
        <span className="text-[10px] mt-1">Subscriptions</span>
      </button>

      <button
        onClick={() => navigateTo(currentUser ? 'library' : 'home')}
        className={`min-h-[44px] min-w-[44px] flex flex-col items-center justify-center transition-colors cursor-pointer ${
          activeView === 'library' 
            ? 'text-rose-600 dark:text-rose-400 font-semibold' 
            : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
        }`}
      >
        {currentUser ? (
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            referrerPolicy="no-referrer"
            className="w-5 h-5 rounded-full object-cover border border-slate-300 dark:border-slate-700"
          />
        ) : (
          <User className="w-5 h-5" />
        )}
        <span className="text-[10px] mt-1">You</span>
      </button>
    </nav>
  );
};

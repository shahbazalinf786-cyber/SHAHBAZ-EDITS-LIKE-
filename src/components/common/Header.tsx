import React, { useState, useRef, useEffect } from 'react';
import { 
  Menu, 
  Search, 
  Video, 
  Bell, 
  Sun, 
  Moon, 
  User, 
  Plus, 
  Flame, 
  Compass, 
  CheckCircle2, 
  X, 
  SlidersHorizontal,
  DollarSign,
  Shield,
  Layers,
  LogOut,
  Sparkles,
  PlaySquare
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Header: React.FC = () => {
  const { 
    isDarkMode, 
    toggleTheme, 
    toggleSidebar, 
    currentUser, 
    currentChannel, 
    unreadNotificationCount, 
    searchQuery, 
    setSearchQuery, 
    navigateTo, 
    activeView, 
    setIsUploadModalOpen, 
    setIsShortUploadModalOpen, 
    setIsCreatePostModalOpen, 
    setIsAuthModalOpen,
    switchUser,
    logout,
    users
  } = useApp();

  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isCreateMenuOpen, setIsCreateMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const createMenuRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Search suggestions
  const suggestions = [
    'Quantum processor architecture',
    'Norwegian fjords 4K HDR',
    'Lofi beats to study to',
    'Wood fired sourdough pizza',
    'WebGL compute shaders',
    'Liquid helium cooling lab',
    'Creator partner program monetization'
  ].filter(s => !searchQuery || s.toLowerCase().includes(searchQuery.toLowerCase()));

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (createMenuRef.current && !createMenuRef.current.contains(e.target as Node)) {
        setIsCreateMenuOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigateTo('search', searchQuery.trim());
      setIsSearchFocused(false);
    }
  };

  const handleSelectSuggestion = (text: string) => {
    setSearchQuery(text);
    navigateTo('search', text);
    setIsSearchFocused(false);
  };

  return (
    <header className="sticky top-0 z-40 h-14 bg-white/95 dark:bg-[#0f0f13]/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800/80 px-3 md:px-5 flex items-center justify-between gap-4">
      {/* Zone 1: Brand & Toggle */}
      <div className="flex items-center gap-3 shrink-0">
        <button 
          onClick={toggleSidebar}
          aria-label="Toggle navigation menu"
          className="p-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>

        <button 
          onClick={() => navigateTo('home')}
          className="flex items-center gap-2 group text-left cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-500 to-red-600 flex items-center justify-center text-white shadow-sm shadow-rose-500/20 group-hover:scale-105 transition-transform">
            <PlaySquare className="w-4 h-4 fill-white" />
          </div>
          <div className="flex items-center">
            <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
              Vid<span className="text-rose-600 dark:text-rose-500">Pulse</span>
            </span>
          </div>
        </button>
      </div>

      {/* Zone 2: Search Bar & Auto-suggestions */}
      <div className="flex-1 max-w-2xl relative mx-2">
        <form onSubmit={handleSearchSubmit} className="relative flex items-center w-full">
          <div className="relative w-full flex items-center">
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              placeholder="Search videos, creators, or topics..."
              className="w-full h-9 pl-9 pr-8 text-xs md:text-sm bg-slate-100 dark:bg-slate-900 border border-transparent dark:border-slate-800 rounded-l-full focus:bg-white dark:focus:bg-slate-950 focus:border-rose-500 focus:outline-none text-slate-900 dark:text-slate-100 placeholder-slate-400 transition-colors"
            />
            <Search className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <button
            type="submit"
            className="h-9 px-4 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-l-0 border-slate-200 dark:border-slate-800 rounded-r-full flex items-center justify-center transition-colors cursor-pointer"
            title="Search"
          >
            <Search className="w-4 h-4" />
          </button>
        </form>

        {/* Search suggestions dropdown */}
        {isSearchFocused && suggestions.length > 0 && (
          <div className="absolute top-11 left-0 right-0 bg-white dark:bg-[#16161c] border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl py-2 z-50">
            <div className="px-3 py-1 text-[11px] font-medium text-slate-400 uppercase tracking-wider">
              Popular Searches
            </div>
            {suggestions.slice(0, 5).map((item, idx) => (
              <button
                key={idx}
                onMouseDown={() => handleSelectSuggestion(item)}
                className="w-full px-3 py-2 text-left text-xs md:text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/70 flex items-center gap-2 cursor-pointer transition-colors"
              >
                <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{item}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Zone 3: Actions & Account Menu */}
      <div className="flex items-center gap-1.5 md:gap-2.5 shrink-0">
        {/* Create (+) Dropdown */}
        <div className="relative" ref={createMenuRef}>
          <button
            onClick={() => setIsCreateMenuOpen(!isCreateMenuOpen)}
            className="h-8 md:h-9 px-2.5 md:px-3 text-xs font-semibold bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/50 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Create</span>
          </button>

          {isCreateMenuOpen && (
            <div className="absolute right-0 top-11 w-48 bg-white dark:bg-[#16161c] border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl py-1.5 z-50">
              <button
                onClick={() => {
                  setIsCreateMenuOpen(false);
                  setIsUploadModalOpen(true);
                }}
                className="w-full px-3 py-2 text-left text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2.5 cursor-pointer"
              >
                <Video className="w-4 h-4 text-rose-500" />
                <span>Upload Video</span>
              </button>
              <button
                onClick={() => {
                  setIsCreateMenuOpen(false);
                  setIsShortUploadModalOpen(true);
                }}
                className="w-full px-3 py-2 text-left text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2.5 cursor-pointer"
              >
                <Flame className="w-4 h-4 text-amber-500" />
                <span>Create Short</span>
              </button>
              <button
                onClick={() => {
                  setIsCreateMenuOpen(false);
                  setIsCreatePostModalOpen(true);
                }}
                className="w-full px-3 py-2 text-left text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2.5 cursor-pointer"
              >
                <Layers className="w-4 h-4 text-indigo-500" />
                <span>Community Post</span>
              </button>
            </div>
          )}
        </div>

        {/* Notifications */}
        <button
          onClick={() => navigateTo('notifications')}
          className="relative p-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          title="Notifications"
        >
          <Bell className="w-4 h-4 md:w-5 md:h-5" />
          {unreadNotificationCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-rose-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {unreadNotificationCount}
            </span>
          )}
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          className="p-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
        >
          {isDarkMode ? <Sun className="w-4 h-4 md:w-5 md:h-5 text-amber-400" /> : <Moon className="w-4 h-4 md:w-5 md:h-5 text-slate-600" />}
        </button>

        {/* User Profile Avatar / Sign In */}
        {currentUser ? (
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-1.5 p-1 rounded-full hover:ring-2 hover:ring-rose-500/30 transition-all cursor-pointer"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                referrerPolicy="no-referrer"
                className="w-7 h-7 md:w-8 md:h-8 rounded-full object-cover border border-slate-300 dark:border-slate-700"
              />
            </button>

            {isUserMenuOpen && (
              <div className="absolute right-0 top-11 w-64 bg-white dark:bg-[#16161c] border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl py-2 z-50 divide-y divide-slate-100 dark:divide-slate-800">
                {/* User Info */}
                <div className="px-4 py-2.5">
                  <div className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                    {currentUser.name}
                  </div>
                  <div className="text-xs text-slate-500 truncate">
                    {currentUser.email}
                  </div>
                  {currentChannel && (
                    <div className="mt-1 text-[11px] text-rose-500 font-medium">
                      {currentChannel.handle} · {currentChannel.subscriberCount.toLocaleString()} subs
                    </div>
                  )}
                </div>

                {/* Primary Nav Links */}
                <div className="py-1">
                  {currentChannel && (
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        navigateTo('channel', currentChannel.id);
                      }}
                      className="w-full px-4 py-2 text-left text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2.5 cursor-pointer"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      <span>Your Channel</span>
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      navigateTo('studio');
                    }}
                    className="w-full px-4 py-2 text-left text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2.5 cursor-pointer"
                  >
                    <SlidersHorizontal className="w-4 h-4 text-slate-400" />
                    <span>Creator Studio</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      navigateTo('monetization');
                    }}
                    className="w-full px-4 py-2 text-left text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2.5 cursor-pointer"
                  >
                    <DollarSign className="w-4 h-4 text-emerald-500" />
                    <span>Partner & Monetization</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      navigateTo('admin');
                    }}
                    className="w-full px-4 py-2 text-left text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2.5 cursor-pointer"
                  >
                    <Shield className="w-4 h-4 text-indigo-500" />
                    <span>Admin Dashboard</span>
                  </button>
                </div>

                {/* Switch Demo Accounts */}
                <div className="py-1 px-4">
                  <div className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider mb-1">
                    Switch Test Account
                  </div>
                  <div className="space-y-1">
                    {users.map(u => (
                      <button
                        key={u.id}
                        onClick={() => {
                          switchUser(u.id);
                          setIsUserMenuOpen(false);
                        }}
                        className={`w-full px-2 py-1 text-left text-xs rounded-md flex items-center justify-between cursor-pointer ${
                          u.id === currentUser.id 
                            ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 font-semibold' 
                            : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        <span className="truncate">{u.name} ({u.role})</span>
                        {u.id === currentUser.id && <CheckCircle2 className="w-3.5 h-3.5 text-rose-500 shrink-0" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sign Out */}
                <div className="py-1">
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      logout();
                    }}
                    className="w-full px-4 py-2 text-left text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2.5 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="h-8 md:h-9 px-3 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition-colors cursor-pointer shadow-sm"
          >
            Sign In
          </button>
        )}
      </div>
    </header>
  );
};

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { MobileNav } from './components/common/MobileNav';

// Views
import { HomeView } from './views/HomeView';
import { WatchView } from './views/WatchView';
import { ShortsView } from './views/ShortsView';
import { ChannelView } from './views/ChannelView';
import { SubscriptionsView } from './views/SubscriptionsView';
import { CommunityView } from './views/CommunityView';
import { SearchView } from './views/SearchView';
import { LibraryView } from './views/LibraryView';
import { NotificationsView } from './views/NotificationsView';
import { StudioView } from './views/StudioView';
import { MonetizationView } from './views/MonetizationView';
import { AdminView } from './views/AdminView';

// Modals
import { UploadVideoModal } from './components/modals/UploadVideoModal';
import { UploadShortModal } from './components/modals/UploadShortModal';
import { CreatePostModal } from './components/modals/CreatePostModal';
import { AuthModal } from './components/modals/AuthModal';
import { ReportModal } from './components/video/ReportModal';

const AppContent: React.FC = () => {
  const { activeView } = useApp();

  const renderActiveView = () => {
    switch (activeView) {
      case 'home':
        return <HomeView />;
      case 'watch':
        return <WatchView />;
      case 'shorts':
        return <ShortsView />;
      case 'channel':
        return <ChannelView />;
      case 'subscriptions':
        return <SubscriptionsView />;
      case 'community':
        return <CommunityView />;
      case 'search':
        return <SearchView />;
      case 'library':
        return <LibraryView />;
      case 'notifications':
        return <NotificationsView />;
      case 'studio':
        return <StudioView />;
      case 'monetization':
        return <MonetizationView />;
      case 'admin':
        return <AdminView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#0a0a0c] dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Top Bar Contract: Header */}
      <Header />

      {/* Main Layout Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar (hidden on shorts view to maximize viewport) */}
        {activeView !== 'shorts' && <Sidebar />}

        {/* Dynamic View Scroll Area */}
        <main className={`flex-1 overflow-y-auto ${activeView !== 'shorts' ? 'pb-20 md:pb-8' : ''}`}>
          {renderActiveView()}
        </main>
      </div>

      {/* Mobile Navigation Anchor */}
      <MobileNav />

      {/* Global Interactive Modals */}
      <UploadVideoModal />
      <UploadShortModal />
      <CreatePostModal />
      <AuthModal />
      <ReportModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

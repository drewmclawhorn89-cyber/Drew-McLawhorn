/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { InstagramProvider, useInstagram } from './context/InstagramContext';
import { Sidebar } from './components/Sidebar';
import { MobileHeader } from './components/MobileHeader';
import { MobileBottomNav } from './components/MobileBottomNav';
import { FeedView } from './components/FeedView';
import { ExploreView } from './components/ExploreView';
import { ReelsView } from './components/ReelsView';
import { MessagesView } from './components/MessagesView';
import { ProfileView } from './components/ProfileView';
import { StoryViewerModal } from './components/StoryViewerModal';
import { CreatePostModal } from './components/CreatePostModal';
import { PostDetailModal } from './components/PostDetailModal';
import { NotificationsDropdown } from './components/NotificationsDropdown';
import { SearchFlyout } from './components/SearchFlyout';
import { LoginModal } from './components/LoginModal';

const MainAppContent: React.FC = () => {
  const {
    activeTab,
    selectedPostForDetail,
    setSelectedPostForDetail,
  } = useInstagram();

  const [isSearchFlyoutOpen, setIsSearchFlyoutOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-black text-[#262626] dark:text-[#f5f5f5] flex flex-col md:flex-row antialiased">
      {/* Desktop Sidebar */}
      <Sidebar onOpenSearch={() => setIsSearchFlyoutOpen(true)} />

      {/* Mobile Top Header */}
      <MobileHeader />

      {/* Main Content Area */}
      <div className="flex-1 md:ml-18 lg:ml-60 min-h-screen px-2 md:px-6">
        {activeTab === 'feed' && (
          <FeedView onOpenDetail={post => setSelectedPostForDetail(post)} />
        )}
        {activeTab === 'explore' && <ExploreView />}
        {activeTab === 'reels' && <ReelsView />}
        {activeTab === 'messages' && <MessagesView />}
        {activeTab === 'profile' && <ProfileView />}
      </div>

      {/* Mobile Fixed Bottom Navigation Bar */}
      <MobileBottomNav />

      {/* Modals & Slide-outs */}
      <StoryViewerModal />
      <CreatePostModal />
      {selectedPostForDetail && (
        <PostDetailModal
          post={selectedPostForDetail}
          onClose={() => setSelectedPostForDetail(null)}
        />
      )}
      <NotificationsDropdown />
      <SearchFlyout
        isOpen={isSearchFlyoutOpen}
        onClose={() => setIsSearchFlyoutOpen(false)}
      />
      <LoginModal />
    </div>
  );
};

export default function App() {
  return (
    <InstagramProvider>
      <MainAppContent />
    </InstagramProvider>
  );
}

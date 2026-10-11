import React from 'react';
import { Home, Compass, Film, PlusSquare } from 'lucide-react';
import { useInstagram } from '../context/InstagramContext';

export const MobileBottomNav: React.FC = () => {
  const { activeTab, setActiveTab, setIsCreateModalOpen, currentUser } = useInstagram();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-black/95 backdrop-blur-md border-t border-[#dbdbdb] dark:border-[#262626] h-14 flex items-center justify-around px-2">
      {/* Home */}
      <button
        onClick={() => setActiveTab('feed')}
        className="flex items-center justify-center w-12 h-12 text-neutral-900 dark:text-neutral-100"
        aria-label="Home"
      >
        <Home className="w-6 h-6" strokeWidth={activeTab === 'feed' ? 2.5 : 1.75} />
      </button>

      {/* Explore */}
      <button
        onClick={() => setActiveTab('explore')}
        className="flex items-center justify-center w-12 h-12 text-neutral-900 dark:text-neutral-100"
        aria-label="Explore"
      >
        <Compass className="w-6 h-6" strokeWidth={activeTab === 'explore' ? 2.5 : 1.75} />
      </button>

      {/* Create */}
      <button
        onClick={() => setIsCreateModalOpen(true)}
        className="flex items-center justify-center w-12 h-12 text-neutral-900 dark:text-neutral-100"
        aria-label="Create post"
      >
        <PlusSquare className="w-6 h-6" strokeWidth={1.75} />
      </button>

      {/* Reels */}
      <button
        onClick={() => setActiveTab('reels')}
        className="flex items-center justify-center w-12 h-12 text-neutral-900 dark:text-neutral-100"
        aria-label="Reels"
      >
        <Film className="w-6 h-6" strokeWidth={activeTab === 'reels' ? 2.5 : 1.75} />
      </button>

      {/* Profile */}
      <button
        onClick={() => setActiveTab('profile')}
        className="flex items-center justify-center w-12 h-12"
        aria-label="Profile"
      >
        <div
          className={`w-7 h-7 rounded-full overflow-hidden border ${
            activeTab === 'profile'
              ? 'border-neutral-950 dark:border-white ring-2 ring-neutral-900 dark:ring-white'
              : 'border-transparent'
          }`}
        >
          <img
            src={currentUser.avatar}
            alt={currentUser.username}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>
      </button>
    </nav>
  );
};

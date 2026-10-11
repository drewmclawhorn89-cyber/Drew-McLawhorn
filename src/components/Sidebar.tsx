import React, { useState } from 'react';
import {
  Home,
  Search,
  Compass,
  Film,
  MessageCircle,
  Heart,
  PlusSquare,
  Menu,
  Sun,
  Moon,
  Bookmark,
  Settings,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { useInstagram } from '../context/InstagramContext';

interface SidebarProps {
  onOpenSearch: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onOpenSearch }) => {
  const {
    activeTab,
    setActiveTab,
    setIsCreateModalOpen,
    isNotificationsOpen,
    setIsNotificationsOpen,
    conversations,
    notifications,
    currentUser,
    theme,
    toggleTheme,
    isGoogleSignedIn,
    setIsLoginModalOpen,
    signOutAction,
  } = useInstagram();

  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  // Total unread DMs
  const unreadMessagesCount = conversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0);
  const unreadNotifsCount = notifications.length;

  return (
    <>
      <aside className="hidden md:flex flex-col fixed top-0 left-0 bottom-0 z-30 w-18 lg:w-60 border-r border-[#dbdbdb] dark:border-[#262626] bg-white dark:bg-black px-3 py-6 select-none transition-all duration-200">
        {/* SnapUp Brand Wordmark */}
        <div className="px-3 mb-7 flex items-center h-10">
          <button
            onClick={() => setActiveTab('feed')}
            className="flex items-center gap-2 text-left group"
          >
            <span className="hidden lg:block font-insta text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 group-hover:opacity-80 transition-opacity">
              SnapUp
            </span>
            <div className="lg:hidden w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center text-white shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 flex flex-col gap-1">
          {/* Home */}
          <button
            onClick={() => {
              setActiveTab('feed');
              setIsNotificationsOpen(false);
            }}
            className={`flex items-center gap-4 px-3 py-3 rounded-xl transition-colors font-medium text-sm ${
              activeTab === 'feed' && !isNotificationsOpen
                ? 'font-bold text-neutral-900 dark:text-white bg-neutral-100 dark:bg-neutral-900/70'
                : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900/50 hover:text-neutral-950 dark:hover:text-white'
            }`}
            title="Home"
          >
            <Home
              className="w-6 h-6 shrink-0"
              strokeWidth={activeTab === 'feed' && !isNotificationsOpen ? 2.5 : 1.75}
            />
            <span className="hidden lg:inline truncate">Home</span>
          </button>

          {/* Search */}
          <button
            onClick={() => {
              onOpenSearch();
              setIsNotificationsOpen(false);
            }}
            className="flex items-center gap-4 px-3 py-3 rounded-xl transition-colors font-medium text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900/50 hover:text-neutral-950 dark:hover:text-white"
            title="Search"
          >
            <Search className="w-6 h-6 shrink-0" strokeWidth={1.75} />
            <span className="hidden lg:inline truncate">Search</span>
          </button>

          {/* Explore */}
          <button
            onClick={() => {
              setActiveTab('explore');
              setIsNotificationsOpen(false);
            }}
            className={`flex items-center gap-4 px-3 py-3 rounded-xl transition-colors font-medium text-sm ${
              activeTab === 'explore' && !isNotificationsOpen
                ? 'font-bold text-neutral-900 dark:text-white bg-neutral-100 dark:bg-neutral-900/70'
                : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900/50 hover:text-neutral-950 dark:hover:text-white'
            }`}
            title="Explore"
          >
            <Compass
              className="w-6 h-6 shrink-0"
              strokeWidth={activeTab === 'explore' && !isNotificationsOpen ? 2.5 : 1.75}
            />
            <span className="hidden lg:inline truncate">Explore</span>
          </button>

          {/* Reels */}
          <button
            onClick={() => {
              setActiveTab('reels');
              setIsNotificationsOpen(false);
            }}
            className={`flex items-center gap-4 px-3 py-3 rounded-xl transition-colors font-medium text-sm ${
              activeTab === 'reels' && !isNotificationsOpen
                ? 'font-bold text-neutral-900 dark:text-white bg-neutral-100 dark:bg-neutral-900/70'
                : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900/50 hover:text-neutral-950 dark:hover:text-white'
            }`}
            title="Reels"
          >
            <Film
              className="w-6 h-6 shrink-0"
              strokeWidth={activeTab === 'reels' && !isNotificationsOpen ? 2.5 : 1.75}
            />
            <span className="hidden lg:inline truncate">Reels</span>
          </button>

          {/* Messages */}
          <button
            onClick={() => {
              setActiveTab('messages');
              setIsNotificationsOpen(false);
            }}
            className={`relative flex items-center gap-4 px-3 py-3 rounded-xl transition-colors font-medium text-sm ${
              activeTab === 'messages' && !isNotificationsOpen
                ? 'font-bold text-neutral-900 dark:text-white bg-neutral-100 dark:bg-neutral-900/70'
                : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900/50 hover:text-neutral-950 dark:hover:text-white'
            }`}
            title="Messages"
          >
            <div className="relative shrink-0">
              <MessageCircle
                className="w-6 h-6"
                strokeWidth={activeTab === 'messages' && !isNotificationsOpen ? 2.5 : 1.75}
              />
              {unreadMessagesCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] flex items-center justify-center font-bold">
                  {unreadMessagesCount}
                </span>
              )}
            </div>
            <span className="hidden lg:inline truncate">Messages</span>
          </button>

          {/* Notifications */}
          <button
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className={`relative flex items-center gap-4 px-3 py-3 rounded-xl transition-colors font-medium text-sm ${
              isNotificationsOpen
                ? 'font-bold text-neutral-900 dark:text-white bg-neutral-100 dark:bg-neutral-900/70'
                : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900/50 hover:text-neutral-950 dark:hover:text-white'
            }`}
            title="Notifications"
          >
            <div className="relative shrink-0">
              <Heart
                className="w-6 h-6"
                strokeWidth={isNotificationsOpen ? 2.5 : 1.75}
              />
              {unreadNotifsCount > 0 && (
                <span className="absolute top-0 right-0 w-2 h-2 bg-rose-500 rounded-full" />
              )}
            </div>
            <span className="hidden lg:inline truncate">Notifications</span>
          </button>

          {/* Create Post */}
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-4 px-3 py-3 rounded-xl transition-colors font-medium text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900/50 hover:text-neutral-950 dark:hover:text-white"
            title="Create Post"
          >
            <PlusSquare className="w-6 h-6 shrink-0" strokeWidth={1.75} />
            <span className="hidden lg:inline truncate">Create</span>
          </button>

          {/* Profile */}
          <button
            onClick={() => {
              setActiveTab('profile');
              setIsNotificationsOpen(false);
            }}
            className={`flex items-center gap-4 px-3 py-3 rounded-xl transition-colors font-medium text-sm ${
              activeTab === 'profile' && !isNotificationsOpen
                ? 'font-bold text-neutral-900 dark:text-white bg-neutral-100 dark:bg-neutral-900/70'
                : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900/50 hover:text-neutral-950 dark:hover:text-white'
            }`}
            title="Profile"
          >
            <div
              className={`w-6 h-6 rounded-full overflow-hidden shrink-0 border ${
                activeTab === 'profile' && !isNotificationsOpen
                  ? 'border-neutral-950 dark:border-white ring-1 ring-neutral-950 dark:ring-white'
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
            <span className="hidden lg:inline truncate">Profile</span>
          </button>

          {/* Google Sign In status button */}
          <button
            onClick={() => setIsLoginModalOpen(true)}
            className="flex items-center gap-4 px-3 py-3 rounded-xl transition-colors font-medium text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900/50 hover:text-neutral-950 dark:hover:text-white"
            title={isGoogleSignedIn ? 'Google Account Connected' : 'Sign in with Google'}
          >
            <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24Z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15Z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98Z"
                />
              </svg>
            </div>
            <span className="hidden lg:inline truncate">
              {isGoogleSignedIn ? 'Google Connected' : 'Google Sign In'}
            </span>
          </button>
        </nav>

        {/* More Menu Dropdown Trigger */}
        <div className="relative pt-4">
          {isMoreMenuOpen && (
            <div className="absolute bottom-14 left-0 w-56 bg-white dark:bg-[#1f1f1f] border border-[#dbdbdb] dark:border-[#333333] rounded-2xl shadow-xl py-2 z-50 text-sm">
              <button
                onClick={() => {
                  toggleTheme();
                  setIsMoreMenuOpen(false);
                }}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {theme === 'dark' ? (
                    <Sun className="w-4 h-4 text-amber-400" />
                  ) : (
                    <Moon className="w-4 h-4 text-indigo-400" />
                  )}
                  <span>Switch Appearance</span>
                </div>
                <span className="text-xs text-neutral-400 capitalize">{theme}</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('profile');
                  setIsMoreMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 transition-colors"
              >
                <Bookmark className="w-4 h-4" />
                <span>Saved Posts</span>
              </button>

              <button
                onClick={() => {
                  setIsLoginModalOpen(true);
                  setIsMoreMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24Z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15Z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98Z"
                  />
                </svg>
                <span>{isGoogleSignedIn ? 'Google Account' : 'Sign In with Google'}</span>
              </button>

              <div className="my-1 border-t border-neutral-200 dark:border-neutral-800" />

              {isGoogleSignedIn ? (
                <button
                  onClick={() => {
                    signOutAction();
                    setIsMoreMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-rose-500 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign out</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    setIsLoginModalOpen(true);
                    setIsMoreMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-sky-500 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log in</span>
                </button>
              )}
            </div>
          )}

          <button
            onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
            className="w-full flex items-center gap-4 px-3 py-3 rounded-xl transition-colors font-medium text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900/50 hover:text-neutral-950 dark:hover:text-white"
            title="More Options"
          >
            <Menu className="w-6 h-6 shrink-0" strokeWidth={1.75} />
            <span className="hidden lg:inline truncate">More</span>
          </button>
        </div>
      </aside>
    </>
  );
};

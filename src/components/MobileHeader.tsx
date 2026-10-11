import React from 'react';
import { Heart, MessageCircle, Moon, Sun } from 'lucide-react';
import { useInstagram } from '../context/InstagramContext';

export const MobileHeader: React.FC = () => {
  const {
    setActiveTab,
    isNotificationsOpen,
    setIsNotificationsOpen,
    conversations,
    theme,
    toggleTheme,
    isGoogleSignedIn,
    setIsLoginModalOpen,
    currentUser,
  } = useInstagram();

  const unreadMessagesCount = conversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0);

  return (
    <header className="md:hidden sticky top-0 z-30 flex items-center justify-between px-4 h-14 bg-white/95 dark:bg-black/95 backdrop-blur-md border-b border-[#dbdbdb] dark:border-[#262626]">
      {/* Brand Logo */}
      <button
        onClick={() => {
          setActiveTab('feed');
          setIsNotificationsOpen(false);
        }}
        className="font-insta text-2xl font-bold tracking-wide text-neutral-900 dark:text-neutral-50 active:scale-95 transition-transform"
      >
        SnapUp
      </button>

      {/* Right Action Icons */}
      <div className="flex items-center gap-3">
        {/* Google Sign In status */}
        <button
          onClick={() => setIsLoginModalOpen(true)}
          className="p-1 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800"
          title={isGoogleSignedIn ? 'Google Account' : 'Sign In with Google'}
        >
          {isGoogleSignedIn ? (
            <img
              src={currentUser.avatar}
              alt={currentUser.username}
              referrerPolicy="no-referrer"
              className="w-5 h-5 rounded-full object-cover ring-1 ring-emerald-500"
            />
          ) : (
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
          )}
        </button>

        {/* Quick Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="text-neutral-700 dark:text-neutral-300 p-1"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <Sun className="w-5 h-5 text-amber-400" />
          ) : (
            <Moon className="w-5 h-5 text-neutral-600" />
          )}
        </button>

        {/* Notifications Heart */}
        <button
          onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
          className="relative text-neutral-800 dark:text-neutral-200 p-1"
          aria-label="Activity notifications"
        >
          <Heart className="w-6 h-6" strokeWidth={isNotificationsOpen ? 2.5 : 1.75} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full" />
        </button>

        {/* Direct Messages */}
        <button
          onClick={() => {
            setActiveTab('messages');
            setIsNotificationsOpen(false);
          }}
          className="relative text-neutral-800 dark:text-neutral-200 p-1"
          aria-label="Direct messages"
        >
          <MessageCircle className="w-6 h-6" strokeWidth={1.75} />
          {unreadMessagesCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] flex items-center justify-center font-bold">
              {unreadMessagesCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};

import React from 'react';
import { X, Sparkles, ShieldCheck } from 'lucide-react';
import { useInstagram } from '../context/InstagramContext';

export const LoginModal: React.FC = () => {
  const {
    isLoginModalOpen,
    setIsLoginModalOpen,
    signInWithGoogleAction,
    isAuthLoading,
    isGoogleSignedIn,
    currentUser,
    signOutAction,
  } = useInstagram();

  if (!isLoginModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#1f1f1f] border border-neutral-200 dark:border-neutral-800 rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl p-6 relative flex flex-col items-center text-center">
        {/* Close Button */}
        <button
          onClick={() => setIsLoginModalOpen(false)}
          className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 p-1"
        >
          <X className="w-5 h-5" />
        </button>

        {/* SnapUp Icon */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-rose-500/20 mb-3 mt-2">
          <Sparkles className="w-8 h-8" />
        </div>

        {/* Brand Name */}
        <h2 className="font-insta text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 mb-1">
          SnapUp
        </h2>

        {isGoogleSignedIn ? (
          <div className="w-full my-4">
            <div className="p-3 bg-neutral-100 dark:bg-neutral-800 rounded-2xl flex items-center gap-3 mb-4 text-left">
              <img
                src={currentUser.avatar}
                alt={currentUser.username}
                referrerPolicy="no-referrer"
                className="w-11 h-11 rounded-full object-cover border border-neutral-300 dark:border-neutral-700"
              />
              <div className="min-w-0">
                <p className="font-semibold text-xs text-neutral-900 dark:text-neutral-100 truncate">
                  {currentUser.fullName}
                </p>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate">
                  {currentUser.email || `@${currentUser.username}`}
                </p>
              </div>
            </div>

            <button
              onClick={signOutAction}
              className="w-full py-2.5 px-4 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 font-semibold rounded-xl text-xs transition-colors"
            >
              Sign Out of Google
            </button>
          </div>
        ) : (
          <>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-[260px] leading-relaxed mb-6">
              Sign in with your Google Account to sync your photos, comment, like posts, and connect with creators.
            </p>

            {/* Official Google Sign-In Button */}
            <button
              onClick={signInWithGoogleAction}
              disabled={isAuthLoading}
              className="w-full py-3 px-4 bg-white dark:bg-black text-neutral-700 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-900 font-semibold rounded-xl text-xs flex items-center justify-center gap-3 shadow-sm active:scale-95 transition-all disabled:opacity-50"
            >
              {/* Google G SVG */}
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
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
              <span>{isAuthLoading ? 'Connecting...' : 'Continue with Google'}</span>
            </button>

            <div className="flex items-center gap-1.5 mt-5 text-[11px] text-neutral-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Secure authentication via Firebase</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

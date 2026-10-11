import React from 'react';
import { X, Heart, MessageCircle, UserPlus, Check } from 'lucide-react';
import { useInstagram } from '../context/InstagramContext';

export const NotificationsDropdown: React.FC = () => {
  const {
    isNotificationsOpen,
    setIsNotificationsOpen,
    notifications,
    toggleFollowUser,
  } = useInstagram();

  if (!isNotificationsOpen) return null;

  return (
    <div className="fixed md:absolute top-14 md:top-4 left-0 md:left-20 lg:left-64 z-50 w-full md:w-96 bg-white dark:bg-[#1a1a1a] border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl overflow-hidden p-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800 mb-3">
        <h2 className="font-bold text-base text-neutral-900 dark:text-neutral-100">
          Notifications
        </h2>
        <button
          onClick={() => setIsNotificationsOpen(false)}
          className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 p-1"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-3.5 max-h-[70vh] overflow-y-auto">
        <span className="block text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-2">
          Earlier this week
        </span>

        {notifications.map(n => (
          <div key={n.id} className="flex items-center justify-between gap-3 text-xs">
            {/* User Avatar */}
            <div className="relative shrink-0">
              <img
                src={n.user.avatar}
                alt={n.user.username}
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-full object-cover"
              />
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white flex items-center justify-center text-[9px]">
                {n.type === 'like' && <Heart className="w-2.5 h-2.5 fill-white" />}
                {n.type === 'comment' && <MessageCircle className="w-2.5 h-2.5 fill-white" />}
                {n.type === 'follow' && <UserPlus className="w-2.5 h-2.5" />}
              </span>
            </div>

            {/* Notification Text */}
            <div className="flex-1 min-w-0">
              <p className="leading-snug">
                <span className="font-semibold text-neutral-900 dark:text-neutral-100 mr-1">
                  {n.user.username}
                </span>
                {n.type === 'like' && 'liked your photo.'}
                {n.type === 'comment' && `commented: "${n.text}"`}
                {n.type === 'follow' && 'started following you.'}
              </p>
              <span className="text-[10px] text-neutral-400">{n.createdAt}</span>
            </div>

            {/* Right Action: Follow back button OR photo preview thumbnail */}
            {n.type === 'follow' ? (
              <button
                onClick={() => toggleFollowUser(n.user.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-colors ${
                  n.isFollowedBack
                    ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300'
                    : 'bg-sky-500 hover:bg-sky-600 text-white'
                }`}
              >
                {n.isFollowedBack ? 'Following' : 'Follow Back'}
              </button>
            ) : n.postImage ? (
              <div className="w-10 h-10 rounded-md overflow-hidden shrink-0 border border-neutral-200 dark:border-neutral-800">
                <img
                  src={n.postImage}
                  alt="Post preview"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
};

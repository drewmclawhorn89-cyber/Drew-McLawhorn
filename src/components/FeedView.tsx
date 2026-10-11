import React, { useState } from 'react';
import { StoriesBar } from './StoriesBar';
import { PostCard } from './PostCard';
import { useInstagram } from '../context/InstagramContext';
import { MOCK_USERS } from '../data/mockData';
import { Post } from '../types/instagram';

interface FeedViewProps {
  onOpenDetail: (post: Post) => void;
}

export const FeedView: React.FC<FeedViewProps> = ({ onOpenDetail }) => {
  const { posts, currentUser, setActiveTab } = useInstagram();
  const [followingMap, setFollowingMap] = useState<{ [id: string]: boolean }>({});

  const suggestedUsers = Object.values(MOCK_USERS).slice(0, 4);

  const toggleFollow = (id: string) => {
    setFollowingMap(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex justify-center gap-12 pt-2 md:pt-4 pb-16">
      {/* Left/Center Column: Stories & Post Feed */}
      <main className="w-full max-w-[470px]">
        {/* Stories Bar */}
        <StoriesBar />

        {/* Posts List */}
        <div className="space-y-4">
          {posts.map(post => (
            <PostCard key={post.id} post={post} onOpenDetail={onOpenDetail} />
          ))}
        </div>
      </main>

      {/* Right Column: Suggested for You & User Profile (Desktop only) */}
      <aside className="hidden lg:block w-76 shrink-0 pt-3 text-xs">
        {/* Current User Quick Row */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setActiveTab('profile')}
            className="flex items-center gap-3 text-left group"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.username}
              referrerPolicy="no-referrer"
              className="w-11 h-11 rounded-full object-cover group-hover:opacity-90 transition-opacity"
            />
            <div className="flex flex-col">
              <span className="font-semibold text-xs text-neutral-900 dark:text-neutral-100 group-hover:underline">
                {currentUser.username}
              </span>
              <span className="text-[11px] text-neutral-400">{currentUser.fullName}</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className="text-[11px] font-semibold text-sky-500 hover:text-sky-600"
          >
            Switch
          </button>
        </div>

        {/* Suggested For You Header */}
        <div className="flex items-center justify-between mb-3.5">
          <span className="font-semibold text-neutral-500 text-xs">Suggested for you</span>
          <button
            onClick={() => setActiveTab('explore')}
            className="font-semibold text-[11px] text-neutral-900 dark:text-neutral-200 hover:opacity-70"
          >
            See All
          </button>
        </div>

        {/* Suggested Users List */}
        <div className="space-y-3.5 mb-6">
          {suggestedUsers.map(user => {
            const isFollowing = followingMap[user.id];

            return (
              <div key={user.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={user.avatar}
                    alt={user.username}
                    referrerPolicy="no-referrer"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className="flex flex-col">
                    <span className="font-semibold text-xs text-neutral-900 dark:text-neutral-100 leading-none mb-0.5">
                      {user.username}
                    </span>
                    <span className="text-[10px] text-neutral-400">
                      Suggested for you
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => toggleFollow(user.id)}
                  className={`text-[11px] font-semibold transition-colors ${
                    isFollowing
                      ? 'text-neutral-400 hover:text-neutral-600'
                      : 'text-sky-500 hover:text-sky-600'
                  }`}
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </button>
              </div>
            );
          })}
        </div>

        {/* Legal & Meta Links */}
        <div className="text-[11px] text-neutral-400/80 space-y-3 leading-relaxed">
          <div className="flex flex-wrap gap-x-2 gap-y-1">
            <span className="hover:underline cursor-pointer">About</span>
            <span>·</span>
            <span className="hover:underline cursor-pointer">Help</span>
            <span>·</span>
            <span className="hover:underline cursor-pointer">Press</span>
            <span>·</span>
            <span className="hover:underline cursor-pointer">API</span>
            <span>·</span>
            <span className="hover:underline cursor-pointer">Jobs</span>
            <span>·</span>
            <span className="hover:underline cursor-pointer">Privacy</span>
            <span>·</span>
            <span className="hover:underline cursor-pointer">Terms</span>
            <span>·</span>
            <span className="hover:underline cursor-pointer">Locations</span>
          </div>
          <p className="uppercase text-[10px] tracking-wide text-neutral-400/60">
            © 2026 SNAPUP
          </p>
        </div>
      </aside>
    </div>
  );
};

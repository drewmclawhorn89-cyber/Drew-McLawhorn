import React, { useState } from 'react';
import {
  Grid,
  Bookmark,
  UserCheck,
  Settings,
  Heart,
  MessageCircle,
  Plus,
  ExternalLink,
  Film,
  X,
  Check,
} from 'lucide-react';
import { useInstagram } from '../context/InstagramContext';
import { Post } from '../types/instagram';
import { ASSET_IMAGES } from '../data/mockData';

const HIGHLIGHTS = [
  { id: 'h1', title: 'Kyoto ⛩️', img: ASSET_IMAGES.coffeeFlatlay },
  { id: 'h2', title: 'Portraits 📷', img: ASSET_IMAGES.urbanStreetwear },
  { id: 'h3', title: 'Ocean 🌊', img: ASSET_IMAGES.coastalSurf },
  { id: 'h4', title: 'Spaces 🌿', img: ASSET_IMAGES.nordicInterior },
  { id: 'h5', title: 'Dining 🍷', img: ASSET_IMAGES.culinaryPlating },
];

export const ProfileView: React.FC = () => {
  const {
    currentUser,
    setCurrentUser,
    posts,
    setSelectedPostForDetail,
    setIsCreateModalOpen,
    isGoogleSignedIn,
    setIsLoginModalOpen,
    signOutAction,
  } = useInstagram();

  const [activeTab, setActiveTab] = useState<'posts' | 'saved' | 'tagged'>('posts');
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  // Edit form state
  const [editName, setEditName] = useState(currentUser.fullName);
  const [editUsername, setEditUsername] = useState(currentUser.username);
  const [editBio, setEditBio] = useState(currentUser.bio || '');
  const [editWebsite, setEditWebsite] = useState(currentUser.website || '');

  // Saved posts
  const savedPosts = posts.filter(p => p.isSaved);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentUser(prev => ({
      ...prev,
      fullName: editName.trim(),
      username: editUsername.trim(),
      bio: editBio.trim(),
      website: editWebsite.trim(),
    }));
    setIsEditProfileOpen(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-4 md:py-8 pb-16">
      {/* Profile Header */}
      <header className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-16 mb-8">
        {/* Avatar */}
        <div className="relative group shrink-0">
          <div className="w-24 h-24 md:w-36 md:h-36 rounded-full p-1 story-gradient">
            <img
              src={currentUser.avatar}
              alt={currentUser.username}
              referrerPolicy="no-referrer"
              className="w-full h-full rounded-full object-cover border-4 border-white dark:border-black"
            />
          </div>
        </div>

        {/* Info & Stats */}
        <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
          {/* Username & Action Buttons */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-4">
            <h1 className="text-xl md:text-2xl font-normal text-neutral-900 dark:text-neutral-100">
              {currentUser.username}
            </h1>
            {currentUser.isVerified && (
              <span className="w-4 h-4 bg-sky-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold">
                ✓
              </span>
            )}

            <div className="flex items-center gap-2 mt-1 md:mt-0">
              <button
                onClick={() => setIsEditProfileOpen(true)}
                className="px-4 py-1.5 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 rounded-lg text-xs font-semibold text-neutral-900 dark:text-neutral-100 transition-colors"
              >
                Edit profile
              </button>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="px-4 py-1.5 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 rounded-lg text-xs font-semibold text-neutral-900 dark:text-neutral-100 transition-colors"
              >
                Create post
              </button>

              {/* Google Sign In / Account Button */}
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="px-3 py-1.5 border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
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
                <span>{isGoogleSignedIn ? 'Google Connected' : 'Google Sign In'}</span>
              </button>

              <button
                onClick={() => setIsEditProfileOpen(true)}
                className="p-1.5 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="flex items-center gap-8 mb-4 text-sm text-neutral-800 dark:text-neutral-200">
            <div>
              <span className="font-bold text-neutral-900 dark:text-white mr-1">
                {posts.length}
              </span>
              <span>posts</span>
            </div>
            <div>
              <span className="font-bold text-neutral-900 dark:text-white mr-1">
                {currentUser.followersCount.toLocaleString()}
              </span>
              <span>followers</span>
            </div>
            <div>
              <span className="font-bold text-neutral-900 dark:text-white mr-1">
                {currentUser.followingCount.toLocaleString()}
              </span>
              <span>following</span>
            </div>
          </div>

          {/* Bio & Links */}
          <div className="max-w-md text-xs leading-relaxed text-neutral-800 dark:text-neutral-200">
            <p className="font-semibold text-neutral-900 dark:text-neutral-100 mb-0.5">
              {currentUser.fullName}
            </p>
            <p className="whitespace-pre-line text-neutral-700 dark:text-neutral-300">
              {currentUser.bio}
            </p>
            {currentUser.website && (
              <a
                href={currentUser.website}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-sky-500 font-semibold mt-1 hover:underline"
              >
                <ExternalLink className="w-3 h-3" />
                <span>{currentUser.website.replace('https://', '')}</span>
              </a>
            )}
          </div>
        </div>
      </header>

      {/* Story Highlights Tray */}
      <div className="flex items-center gap-5 overflow-x-auto no-scrollbar py-2 mb-8 border-b border-neutral-100 dark:border-neutral-900 pb-6">
        {HIGHLIGHTS.map(hl => (
          <div key={hl.id} className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group">
            <div className="w-16 h-16 rounded-full p-0.5 bg-neutral-200 dark:bg-neutral-800 group-hover:scale-105 transition-transform">
              <img
                src={hl.img}
                alt={hl.title}
                className="w-full h-full rounded-full object-cover border-2 border-white dark:border-black"
              />
            </div>
            <span className="text-[11px] font-medium text-neutral-700 dark:text-neutral-300 truncate max-w-[70px]">
              {hl.title}
            </span>
          </div>
        ))}
      </div>

      {/* Tabs Navigation */}
      <div className="flex justify-center border-t border-neutral-200 dark:border-neutral-800 mb-4">
        <button
          onClick={() => setActiveTab('posts')}
          className={`flex items-center gap-2 py-3 px-6 text-xs font-semibold tracking-wider uppercase border-t -mt-px transition-colors ${
            activeTab === 'posts'
              ? 'border-neutral-900 dark:border-white text-neutral-900 dark:text-white'
              : 'border-transparent text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300'
          }`}
        >
          <Grid className="w-3.5 h-3.5" />
          <span>Posts</span>
        </button>

        <button
          onClick={() => setActiveTab('saved')}
          className={`flex items-center gap-2 py-3 px-6 text-xs font-semibold tracking-wider uppercase border-t -mt-px transition-colors ${
            activeTab === 'saved'
              ? 'border-neutral-900 dark:border-white text-neutral-900 dark:text-white'
              : 'border-transparent text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300'
          }`}
        >
          <Bookmark className="w-3.5 h-3.5" />
          <span>Saved ({savedPosts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('tagged')}
          className={`flex items-center gap-2 py-3 px-6 text-xs font-semibold tracking-wider uppercase border-t -mt-px transition-colors ${
            activeTab === 'tagged'
              ? 'border-neutral-900 dark:border-white text-neutral-900 dark:text-white'
              : 'border-transparent text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300'
          }`}
        >
          <UserCheck className="w-3.5 h-3.5" />
          <span>Tagged</span>
        </button>
      </div>

      {/* Posts Grid */}
      {activeTab === 'posts' && (
        <div className="grid grid-cols-3 gap-1 md:gap-3">
          {posts.map(post => (
            <div
              key={post.id}
              onClick={() => setSelectedPostForDetail(post)}
              className="relative aspect-square group bg-neutral-100 dark:bg-neutral-900 cursor-pointer overflow-hidden rounded-sm md:rounded-md"
            >
              <img
                src={post.mediaUrl}
                alt={post.caption}
                referrerPolicy="no-referrer"
                className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${
                  post.filter || ''
                }`}
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6 text-white font-semibold text-xs md:text-sm">
                <div className="flex items-center gap-1.5">
                  <Heart className="w-4 h-4 fill-white" />
                  <span>{post.likesCount}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>{post.comments.length}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Saved Posts Grid */}
      {activeTab === 'saved' && (
        <div>
          {savedPosts.length > 0 ? (
            <div className="grid grid-cols-3 gap-1 md:gap-3">
              {savedPosts.map(post => (
                <div
                  key={post.id}
                  onClick={() => setSelectedPostForDetail(post)}
                  className="relative aspect-square group bg-neutral-100 dark:bg-neutral-900 cursor-pointer overflow-hidden rounded-sm md:rounded-md"
                >
                  <img
                    src={post.mediaUrl}
                    alt={post.caption}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6 text-white font-semibold text-xs md:text-sm">
                    <div className="flex items-center gap-1.5">
                      <Heart className="w-4 h-4 fill-white" />
                      <span>{post.likesCount}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MessageCircle className="w-4 h-4 fill-white" />
                      <span>{post.comments.length}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center text-neutral-400">
              <Bookmark className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="font-semibold text-sm">Save photos and videos</p>
              <p className="text-xs mt-1">
                Save photos to keep them in your private collection. No one is notified.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Tagged Posts Tab */}
      {activeTab === 'tagged' && (
        <div className="py-20 text-center text-neutral-400">
          <UserCheck className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="font-semibold text-sm">Photos of you</p>
          <p className="text-xs mt-1">
            When people tag you in photos, they will appear right here.
          </p>
        </div>
      )}

      {/* Edit Profile Modal */}
      {isEditProfileOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#262626] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl p-6 border border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800 mb-4">
              <h2 className="font-bold text-base text-neutral-900 dark:text-neutral-100">
                Edit Profile
              </h2>
              <button
                onClick={() => setIsEditProfileOpen(false)}
                className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-500 mb-1 font-semibold">Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  className="w-full bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-2.5 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-neutral-500 mb-1 font-semibold">Username</label>
                <input
                  type="text"
                  value={editUsername}
                  onChange={e => setEditUsername(e.target.value)}
                  className="w-full bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-2.5 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-neutral-500 mb-1 font-semibold">Bio</label>
                <textarea
                  rows={3}
                  value={editBio}
                  onChange={e => setEditBio(e.target.value)}
                  className="w-full bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-2.5 focus:outline-none focus:border-sky-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-neutral-500 mb-1 font-semibold">Website</label>
                <input
                  type="text"
                  value={editWebsite}
                  onChange={e => setEditWebsite(e.target.value)}
                  className="w-full bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-2.5 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditProfileOpen(false)}
                  className="px-4 py-2 rounded-lg font-semibold text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-lg flex items-center gap-1.5 shadow-md shadow-sky-500/20"
                >
                  <Check className="w-4 h-4" /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

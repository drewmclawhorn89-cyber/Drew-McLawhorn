import React, { useState } from 'react';
import { Search, Heart, MessageCircle, Film } from 'lucide-react';
import { useInstagram } from '../context/InstagramContext';
import { Post } from '../types/instagram';

const CATEGORIES = [
  'For you',
  'Photography',
  'Architecture',
  'Coffee & Food',
  'Ocean & Surf',
  'Streetwear',
  'Interior Design',
];

export const ExploreView: React.FC = () => {
  const { posts, reels, setSelectedPostForDetail } = useInstagram();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('For you');

  // Filter items based on category and query
  const filteredPosts = posts.filter(post => {
    const matchesQuery =
      post.caption.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.tags && post.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));

    if (!matchesQuery) return false;

    if (selectedCategory === 'For you') return true;
    if (selectedCategory === 'Photography') return true;
    if (selectedCategory === 'Architecture')
      return post.tags?.includes('architecture') || post.tags?.includes('interiordesign');
    if (selectedCategory === 'Coffee & Food')
      return post.tags?.includes('specialtycoffee') || post.tags?.includes('finedining');
    if (selectedCategory === 'Ocean & Surf')
      return post.tags?.includes('surfing') || post.tags?.includes('oceanlife');
    if (selectedCategory === 'Streetwear')
      return post.tags?.includes('streetstyle') || post.tags?.includes('london');
    if (selectedCategory === 'Interior Design')
      return post.tags?.includes('interiordesign') || post.tags?.includes('nordichome');

    return true;
  });

  return (
    <div className="w-full max-w-4xl mx-auto pb-16">
      {/* Search Bar & Categories */}
      <div className="sticky top-0 md:top-0 z-20 bg-white/95 dark:bg-black/95 backdrop-blur-md pt-3 pb-3 px-2 border-b border-neutral-200 dark:border-neutral-800">
        {/* Search Input */}
        <div className="relative mb-3">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search creators, photos, hashtags..."
            className="w-full bg-neutral-100 dark:bg-[#1a1a1a] text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 pl-10 pr-4 py-2 rounded-xl text-xs border border-transparent focus:border-neutral-300 dark:focus:border-neutral-700 focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-neutral-600"
            >
              Clear
            </button>
          )}
        </div>

        {/* Category Pills (functional filter buttons) */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors shrink-0 ${
                selectedCategory === cat
                  ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 font-semibold'
                  : 'bg-neutral-100 text-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Discoveries */}
      <div className="grid grid-cols-3 gap-1 md:gap-3 p-1 md:p-3">
        {filteredPosts.map((post, idx) => {
          const isLarge = idx % 5 === 1; // Instagram's signature layout mix

          return (
            <div
              key={post.id}
              onClick={() => setSelectedPostForDetail(post)}
              className={`relative group bg-neutral-100 dark:bg-neutral-900 rounded-sm md:rounded-lg overflow-hidden cursor-pointer select-none ${
                isLarge ? 'col-span-2 row-span-2 aspect-square' : 'col-span-1 aspect-square'
              }`}
            >
              <img
                src={post.mediaUrl}
                alt={post.caption}
                referrerPolicy="no-referrer"
                className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${
                  post.filter || ''
                }`}
              />

              {/* Reel or Multiple Icon indicator */}
              <div className="absolute top-2 right-2 text-white drop-shadow p-1">
                {isLarge ? (
                  <Film className="w-4 h-4 drop-shadow" />
                ) : null}
              </div>

              {/* Hover Dark Overlay with Stats */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6 text-white font-semibold text-sm">
                <div className="flex items-center gap-1.5">
                  <Heart className="w-5 h-5 fill-white" />
                  <span>{post.likesCount}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MessageCircle className="w-5 h-5 fill-white" />
                  <span>{post.comments.length}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredPosts.length === 0 && (
        <div className="py-20 text-center text-neutral-400">
          <p className="text-sm">No results found for "{searchQuery}".</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('For you');
            }}
            className="mt-2 text-xs text-sky-500 font-semibold"
          >
            Reset filters
          </button>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import {
  X,
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  Smile,
  MoreHorizontal,
} from 'lucide-react';
import { useInstagram } from '../context/InstagramContext';
import { Post } from '../types/instagram';

interface PostDetailModalProps {
  post: Post;
  onClose: () => void;
}

export const PostDetailModal: React.FC<PostDetailModalProps> = ({ post, onClose }) => {
  const {
    toggleLikePost,
    toggleSavePost,
    addComment,
    toggleLikeComment,
    setSelectedChatId,
    setActiveTab,
  } = useInstagram();

  const [commentText, setCommentText] = useState('');

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addComment(post.id, commentText);
    setCommentText('');
  };

  const handleShare = () => {
    setSelectedChatId('conv_1');
    setActiveTab('messages');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-2 md:p-6 backdrop-blur-sm">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white/80 hover:text-white p-2 rounded-full z-50"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Split Modal Container */}
      <div className="bg-white dark:bg-black rounded-xl overflow-hidden w-full max-w-4xl max-h-[90vh] flex flex-col md:flex-row shadow-2xl border border-neutral-200 dark:border-neutral-800">
        {/* Left Side: Photo */}
        <div className="flex-1 bg-black flex items-center justify-center min-h-[300px] md:min-h-[500px] max-h-[550px] relative">
          <img
            src={post.mediaUrl}
            alt={post.caption}
            referrerPolicy="no-referrer"
            className={`w-full h-full object-contain ${post.filter || ''}`}
          />
        </div>

        {/* Right Side: Details & Comments */}
        <div className="w-full md:w-96 flex flex-col h-[400px] md:h-auto border-t md:border-t-0 md:border-l border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black">
          {/* Post Author Header */}
          <div className="p-3.5 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={post.userAvatar}
                alt={post.username}
                referrerPolicy="no-referrer"
                className="w-8 h-8 rounded-full object-cover"
              />
              <div className="flex flex-col">
                <span className="font-semibold text-xs leading-none text-neutral-900 dark:text-neutral-100">
                  {post.username}
                </span>
                {post.location && (
                  <span className="text-[10px] text-neutral-400 mt-0.5">{post.location}</span>
                )}
              </div>
            </div>

            <button className="text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 p-1">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>

          {/* Comments and Caption Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
            {/* Caption as first comment item */}
            <div className="flex items-start gap-3">
              <img
                src={post.userAvatar}
                alt={post.username}
                referrerPolicy="no-referrer"
                className="w-7 h-7 rounded-full object-cover shrink-0"
              />
              <div className="flex-1">
                <p className="leading-relaxed">
                  <span className="font-semibold mr-1.5 text-neutral-900 dark:text-neutral-100">
                    {post.username}
                  </span>
                  <span className="text-neutral-800 dark:text-neutral-200">{post.caption}</span>
                </p>
                <span className="text-[10px] text-neutral-400 mt-1 block uppercase">
                  {post.createdAt}
                </span>
              </div>
            </div>

            {/* Comments List */}
            {post.comments.map(c => (
              <div key={c.id} className="flex items-start justify-between gap-2 group">
                <div className="flex items-start gap-3 flex-1">
                  <img
                    src={c.userAvatar}
                    alt={c.username}
                    referrerPolicy="no-referrer"
                    className="w-7 h-7 rounded-full object-cover shrink-0"
                  />
                  <div>
                    <p className="leading-relaxed">
                      <span className="font-semibold mr-1.5 text-neutral-900 dark:text-neutral-100">
                        {c.username}
                      </span>
                      <span className="text-neutral-800 dark:text-neutral-200">{c.text}</span>
                    </p>
                    <div className="flex items-center gap-3 text-[10px] text-neutral-400 mt-1">
                      <span>{c.createdAt}</span>
                      {c.likesCount > 0 && <span>{c.likesCount} likes</span>}
                      <button className="font-semibold hover:text-neutral-600 dark:hover:text-neutral-300">
                        Reply
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => toggleLikeComment(post.id, c.id)}
                  className="p-1 text-neutral-400 hover:text-rose-500 transition-colors"
                >
                  <Heart
                    className={`w-3.5 h-3.5 ${
                      c.isLiked ? 'fill-rose-500 text-rose-500' : ''
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>

          {/* Action Row & Likes */}
          <div className="p-3.5 border-t border-neutral-200 dark:border-neutral-800 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleLikePost(post.id)}
                  className="hover:opacity-75 active:scale-125 transition-transform"
                >
                  <Heart
                    className={`w-5 h-5 ${
                      post.isLiked
                        ? 'fill-rose-500 text-rose-500'
                        : 'text-neutral-800 dark:text-neutral-200'
                    }`}
                  />
                </button>
                <button className="text-neutral-800 dark:text-neutral-200 hover:opacity-75">
                  <MessageCircle className="w-5 h-5" />
                </button>
                <button
                  onClick={handleShare}
                  className="text-neutral-800 dark:text-neutral-200 hover:opacity-75"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>

              <button
                onClick={() => toggleSavePost(post.id)}
                className="hover:opacity-75 transition-transform"
              >
                <Bookmark
                  className={`w-5 h-5 ${
                    post.isSaved
                      ? 'fill-neutral-900 dark:fill-white text-neutral-900 dark:text-white'
                      : 'text-neutral-800 dark:text-neutral-200'
                  }`}
                />
              </button>
            </div>

            <div className="font-semibold text-xs text-neutral-900 dark:text-neutral-100">
              {post.likesCount.toLocaleString()} likes
            </div>

            <div className="text-[10px] text-neutral-400 uppercase tracking-wide">
              {post.createdAt}
            </div>
          </div>

          {/* Add Comment Input */}
          <form
            onSubmit={handleCommentSubmit}
            className="p-3 border-t border-neutral-200 dark:border-neutral-800 flex items-center gap-2"
          >
            <button
              type="button"
              className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
            >
              <Smile className="w-5 h-5" />
            </button>
            <input
              type="text"
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 bg-transparent text-xs text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!commentText.trim()}
              className="text-xs font-semibold text-sky-500 hover:text-sky-600 disabled:opacity-30"
            >
              Post
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

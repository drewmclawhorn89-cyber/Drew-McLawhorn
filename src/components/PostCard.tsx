import React, { useState } from 'react';
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MoreHorizontal,
  Smile,
  Check,
  Share2,
} from 'lucide-react';
import { Post } from '../types/instagram';
import { useInstagram } from '../context/InstagramContext';

interface PostCardProps {
  post: Post;
  onOpenDetail?: (post: Post) => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, onOpenDetail }) => {
  const { toggleLikePost, toggleSavePost, addComment, setSelectedChatId, setActiveTab } = useInstagram();

  const [commentInput, setCommentInput] = useState('');
  const [showHeartOverlay, setShowHeartOverlay] = useState(false);
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [showFullCaption, setShowFullCaption] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showAllComments, setShowAllComments] = useState(false);

  // Double tap to like
  const handleDoubleTap = () => {
    if (!post.isLiked) {
      toggleLikePost(post.id);
    }
    setShowHeartOverlay(true);
    setTimeout(() => setShowHeartOverlay(false), 900);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    addComment(post.id, commentInput);
    setCommentInput('');
  };

  const handleShareClick = () => {
    setSelectedChatId('conv_1');
    setActiveTab('messages');
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => {
      setCopiedLink(false);
      setShowOptionsModal(false);
    }, 1200);
  };

  return (
    <>
      <article className="w-full bg-white dark:bg-black border border-[#dbdbdb] dark:border-[#262626] rounded-xl overflow-hidden mb-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-colors">
        {/* Post Header */}
        <header className="flex items-center justify-between px-3.5 py-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full p-[2px] story-gradient cursor-pointer shrink-0">
              <img
                src={post.userAvatar}
                alt={post.username}
                referrerPolicy="no-referrer"
                className="w-full h-full rounded-full object-cover border-2 border-white dark:border-black"
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 leading-none">
                <span className="font-semibold text-sm text-neutral-900 dark:text-neutral-100 hover:opacity-75 cursor-pointer">
                  {post.username}
                </span>
                {post.isVerified && (
                  <span className="w-3.5 h-3.5 bg-sky-500 rounded-full flex items-center justify-center text-white text-[9px] font-bold">
                    ✓
                  </span>
                )}
                <span className="text-neutral-400 text-xs">·</span>
                <span className="text-neutral-400 text-xs">{post.createdAt}</span>
              </div>
              {post.location && (
                <span className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate max-w-[200px]">
                  {post.location}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={() => setShowOptionsModal(true)}
            className="text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200 p-1 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
            title="Options"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </header>

        {/* Media Container with Double Tap Heart */}
        <div
          onDoubleClick={handleDoubleTap}
          className="relative w-full aspect-square bg-neutral-100 dark:bg-neutral-900 overflow-hidden cursor-pointer select-none"
        >
          <img
            src={post.mediaUrl}
            alt={post.caption}
            referrerPolicy="no-referrer"
            className={`w-full h-full object-cover transition-transform duration-300 ${
              post.filter || ''
            }`}
          />

          {/* Animated Pop Heart on Double Tap */}
          {showHeartOverlay && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
              <div className="animate-ping scale-150 duration-500">
                <Heart className="w-24 h-24 text-rose-500 fill-rose-500 drop-shadow-lg" />
              </div>
            </div>
          )}
        </div>

        {/* Action Row */}
        <div className="px-3.5 pt-3 pb-2">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-4">
              {/* Like Button */}
              <button
                onClick={() => toggleLikePost(post.id)}
                className="hover:opacity-75 active:scale-125 transition-transform"
                title={post.isLiked ? 'Unlike' : 'Like'}
              >
                <Heart
                  className={`w-6 h-6 transition-colors ${
                    post.isLiked
                      ? 'fill-rose-500 text-rose-500'
                      : 'text-neutral-800 dark:text-neutral-200'
                  }`}
                  strokeWidth={post.isLiked ? 0 : 2}
                />
              </button>

              {/* Comment Button */}
              <button
                onClick={() => onOpenDetail && onOpenDetail(post)}
                className="text-neutral-800 dark:text-neutral-200 hover:opacity-75 active:scale-95 transition-transform"
                title="Comment"
              >
                <MessageCircle className="w-6 h-6" strokeWidth={2} />
              </button>

              {/* Share / DM Button */}
              <button
                onClick={handleShareClick}
                className="text-neutral-800 dark:text-neutral-200 hover:opacity-75 active:scale-95 transition-transform"
                title="Send Message"
              >
                <Send className="w-6 h-6" strokeWidth={2} />
              </button>
            </div>

            {/* Bookmark / Save Button */}
            <button
              onClick={() => toggleSavePost(post.id)}
              className="hover:opacity-75 active:scale-110 transition-transform"
              title={post.isSaved ? 'Remove from saved' : 'Save'}
            >
              <Bookmark
                className={`w-6 h-6 transition-colors ${
                  post.isSaved
                    ? 'fill-neutral-900 text-neutral-900 dark:fill-white dark:text-white'
                    : 'text-neutral-800 dark:text-neutral-200'
                }`}
                strokeWidth={post.isSaved ? 0 : 2}
              />
            </button>
          </div>

          {/* Likes Counter */}
          <div className="mb-2">
            <span className="font-semibold text-sm text-neutral-900 dark:text-neutral-100">
              {post.likesCount.toLocaleString()} likes
            </span>
          </div>

          {/* Caption */}
          <div className="text-sm text-neutral-800 dark:text-neutral-200 mb-2 leading-relaxed">
            <span className="font-semibold mr-1.5 text-neutral-900 dark:text-neutral-100">
              {post.username}
            </span>
            <span>
              {showFullCaption || post.caption.length <= 120
                ? post.caption
                : `${post.caption.slice(0, 120)}...`}
            </span>
            {post.caption.length > 120 && (
              <button
                onClick={() => setShowFullCaption(!showFullCaption)}
                className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 ml-1 font-medium text-xs"
              >
                {showFullCaption ? 'less' : 'more'}
              </button>
            )}

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-1 text-sky-500 font-medium text-xs">
                {post.tags.map(tag => (
                  <span key={tag} className="hover:underline cursor-pointer">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Comments Toggle */}
          {post.comments.length > 0 && (
            <div className="mb-2">
              <button
                onClick={() => setShowAllComments(!showAllComments)}
                className="text-xs font-medium text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
              >
                {showAllComments
                  ? 'Hide comments'
                  : `View all ${post.comments.length} comments`}
              </button>

              {/* Comments Preview list */}
              {showAllComments && (
                <div className="mt-2 space-y-1.5 text-xs">
                  {post.comments.map(c => (
                    <div key={c.id} className="flex items-start justify-between">
                      <p>
                        <span className="font-semibold mr-1 text-neutral-900 dark:text-neutral-100">
                          {c.username}
                        </span>
                        <span className="text-neutral-700 dark:text-neutral-300">{c.text}</span>
                      </p>
                      <button className="text-neutral-400 hover:text-rose-500 p-0.5">
                        <Heart className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Time Ago Display */}
          <span className="block text-[10px] text-neutral-400 font-medium uppercase tracking-wider mb-2">
            {post.createdAt}
          </span>
        </div>

        {/* Inline Comment Input Box */}
        <form
          onSubmit={handleCommentSubmit}
          className="border-t border-neutral-100 dark:border-neutral-800/80 px-3.5 py-2.5 flex items-center gap-2"
        >
          <button
            type="button"
            className="text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
          >
            <Smile className="w-5 h-5" />
          </button>
          <input
            type="text"
            value={commentInput}
            onChange={e => setCommentInput(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 text-xs bg-transparent text-neutral-800 dark:text-neutral-200 placeholder-neutral-400 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!commentInput.trim()}
            className={`text-xs font-semibold ${
              commentInput.trim()
                ? 'text-sky-500 hover:text-sky-600 cursor-pointer'
                : 'text-sky-500/40 cursor-default'
            }`}
          >
            Post
          </button>
        </form>
      </article>

      {/* Options Dropdown Modal */}
      {showOptionsModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#262626] rounded-2xl w-full max-w-sm overflow-hidden text-sm divide-y divide-neutral-200 dark:divide-neutral-700/60 shadow-2xl">
            <button
              onClick={handleCopyLink}
              className="w-full py-3.5 text-center font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800 flex items-center justify-center gap-2"
            >
              {copiedLink ? (
                <>
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span className="text-emerald-500">Link Copied!</span>
                </>
              ) : (
                'Copy Link'
              )}
            </button>
            <button
              onClick={() => {
                setShowOptionsModal(false);
                if (onOpenDetail) onOpenDetail(post);
              }}
              className="w-full py-3.5 text-center font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800"
            >
              Go to post
            </button>
            <button
              onClick={() => setShowOptionsModal(false)}
              className="w-full py-3.5 text-center font-medium text-rose-500 hover:bg-neutral-50 dark:hover:bg-neutral-800"
            >
              Report
            </button>
            <button
              onClick={() => setShowOptionsModal(false)}
              className="w-full py-3.5 text-center font-medium text-neutral-500 hover:bg-neutral-50 dark:hover:bg-neutral-800"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
};

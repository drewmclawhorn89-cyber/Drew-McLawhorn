import React, { useState } from 'react';
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  Volume2,
  VolumeX,
  Music2,
  ChevronUp,
  ChevronDown,
  Disc,
} from 'lucide-react';
import { useInstagram } from '../context/InstagramContext';

export const ReelsView: React.FC = () => {
  const { reels, toggleLikeReel, toggleSaveReel, setSelectedChatId, setActiveTab } = useInstagram();
  const [currentReelIndex, setCurrentReelIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [showCommentsDrawer, setShowCommentsDrawer] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const [reelComments, setReelComments] = useState<{ [reelId: string]: string[] }>({
    reel_1: ['Epic drop!! 🏄‍♂️', 'Pacific swell is something else'],
    reel_2: ['Love the 35mm warmth here!', 'Such clean cinematography'],
  });

  const reel = reels[currentReelIndex];

  const handleNextReel = () => {
    if (currentReelIndex < reels.length - 1) {
      setCurrentReelIndex(prev => prev + 1);
    }
  };

  const handlePrevReel = () => {
    if (currentReelIndex > 0) {
      setCurrentReelIndex(prev => prev - 1);
    }
  };

  const handleAddReelComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim() || !reel) return;
    setReelComments(prev => ({
      ...prev,
      [reel.id]: [...(prev[reel.id] || []), commentInput.trim()],
    }));
    setCommentInput('');
  };

  if (!reel) return null;

  return (
    <div className="w-full flex items-center justify-center min-h-[calc(100vh-80px)] py-4 select-none">
      <div className="relative flex items-center gap-4">
        {/* Reel Card Container (9:16 ratio) */}
        <div className="relative w-full max-w-[380px] h-[78vh] min-h-[580px] max-h-[720px] bg-neutral-950 rounded-2xl overflow-hidden shadow-2xl flex flex-col justify-between">
          {/* Background Poster Image */}
          <div className="absolute inset-0 z-0">
            <img
              src={reel.videoPoster}
              alt={reel.caption}
              className="w-full h-full object-cover"
            />
            {/* Dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/40" />
          </div>

          {/* Top Bar */}
          <div className="relative z-10 p-4 flex items-center justify-between text-white">
            <span className="font-semibold text-sm drop-shadow">Reels</span>
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 rounded-full bg-black/40 backdrop-blur-md hover:bg-black/60 transition-colors"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>

          {/* Bottom Information */}
          <div className="relative z-10 p-4 text-white">
            {/* Author */}
            <div className="flex items-center gap-2.5 mb-2.5">
              <img
                src={reel.userAvatar}
                alt={reel.username}
                className="w-9 h-9 rounded-full object-cover border border-white/60"
              />
              <span className="font-semibold text-sm">{reel.username}</span>
              {reel.isVerified && (
                <span className="w-3.5 h-3.5 bg-sky-500 rounded-full flex items-center justify-center text-white text-[9px] font-bold">
                  ✓
                </span>
              )}
              <button className="ml-1 px-3 py-1 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-lg text-xs font-semibold">
                Follow
              </button>
            </div>

            {/* Caption */}
            <p className="text-xs text-white/90 line-clamp-2 mb-2 leading-relaxed">
              {reel.caption}
            </p>

            {/* Audio Track with Spinning Vinyl */}
            <div className="flex items-center gap-2 text-xs text-white/80">
              <Music2 className="w-3.5 h-3.5" />
              <span className="truncate max-w-[220px]">{reel.audioTrack}</span>
            </div>
          </div>
        </div>

        {/* Right Floating Action Rail */}
        <div className="flex flex-col items-center gap-5 pb-4 select-none">
          {/* Like Button */}
          <button
            onClick={() => toggleLikeReel(reel.id)}
            className="flex flex-col items-center gap-1 group"
          >
            <div className="w-11 h-11 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center hover:scale-110 active:scale-95 transition-transform shadow-md">
              <Heart
                className={`w-5 h-5 transition-colors ${
                  reel.isLiked
                    ? 'fill-rose-500 text-rose-500'
                    : 'text-neutral-800 dark:text-neutral-200'
                }`}
                strokeWidth={reel.isLiked ? 0 : 2}
              />
            </div>
            <span className="text-[11px] font-semibold text-neutral-700 dark:text-neutral-300">
              {(reel.likesCount / 1000).toFixed(1)}k
            </span>
          </button>

          {/* Comments Button */}
          <button
            onClick={() => setShowCommentsDrawer(!showCommentsDrawer)}
            className="flex flex-col items-center gap-1 group"
          >
            <div className="w-11 h-11 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center hover:scale-110 active:scale-95 transition-transform shadow-md">
              <MessageCircle className="w-5 h-5 text-neutral-800 dark:text-neutral-200" />
            </div>
            <span className="text-[11px] font-semibold text-neutral-700 dark:text-neutral-300">
              {reel.commentsCount + (reelComments[reel.id]?.length || 0)}
            </span>
          </button>

          {/* Share Button */}
          <button
            onClick={() => {
              setSelectedChatId('conv_1');
              setActiveTab('messages');
            }}
            className="flex flex-col items-center gap-1 group"
          >
            <div className="w-11 h-11 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center hover:scale-110 active:scale-95 transition-transform shadow-md">
              <Send className="w-5 h-5 text-neutral-800 dark:text-neutral-200" />
            </div>
            <span className="text-[11px] font-semibold text-neutral-700 dark:text-neutral-300">
              Share
            </span>
          </button>

          {/* Bookmark Button */}
          <button
            onClick={() => toggleSaveReel(reel.id)}
            className="flex flex-col items-center gap-1 group"
          >
            <div className="w-11 h-11 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center hover:scale-110 active:scale-95 transition-transform shadow-md">
              <Bookmark
                className={`w-5 h-5 ${
                  reel.isSaved
                    ? 'fill-neutral-900 dark:fill-white text-neutral-900 dark:text-white'
                    : 'text-neutral-800 dark:text-neutral-200'
                }`}
              />
            </div>
          </button>

          {/* Spinning Audio Disc */}
          <div className="w-9 h-9 rounded-full bg-neutral-900 border-2 border-white/40 flex items-center justify-center animate-spin">
            <Disc className="w-5 h-5 text-neutral-400" />
          </div>

          {/* Up / Down navigation buttons */}
          <div className="flex flex-col gap-1.5 mt-2">
            <button
              onClick={handlePrevReel}
              disabled={currentReelIndex === 0}
              className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center disabled:opacity-30 hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextReel}
              disabled={currentReelIndex === reels.length - 1}
              className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center disabled:opacity-30 hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Sliding Comments Drawer */}
        {showCommentsDrawer && (
          <div className="absolute right-16 top-0 bottom-0 w-80 bg-white dark:bg-[#1f1f1f] border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl p-4 flex flex-col z-30 animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
              <h3 className="font-semibold text-sm">Comments</h3>
              <button
                onClick={() => setShowCommentsDrawer(false)}
                className="text-xs text-neutral-400 hover:text-neutral-600"
              >
                Close
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-3 space-y-3">
              {(reelComments[reel.id] || []).map((c, i) => (
                <div key={i} className="text-xs flex items-start gap-2">
                  <div className="w-6 h-6 rounded-full bg-sky-500 text-white font-bold flex items-center justify-center text-[10px] shrink-0">
                    U
                  </div>
                  <div className="flex-1">
                    <span className="font-semibold mr-1.5">viewer</span>
                    <span className="text-neutral-700 dark:text-neutral-300">{c}</span>
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddReelComment} className="pt-2 border-t border-neutral-200 dark:border-neutral-800 flex gap-2">
              <input
                type="text"
                value={commentInput}
                onChange={e => setCommentInput(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 bg-neutral-100 dark:bg-neutral-900 text-xs px-3 py-2 rounded-lg focus:outline-none"
              />
              <button
                type="submit"
                disabled={!commentInput.trim()}
                className="text-xs font-semibold text-sky-500 disabled:opacity-40"
              >
                Post
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

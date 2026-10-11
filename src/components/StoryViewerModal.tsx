import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, Play, Pause, Send, Volume2, VolumeX, Heart } from 'lucide-react';
import { useInstagram } from '../context/InstagramContext';

export const StoryViewerModal: React.FC = () => {
  const { stories, activeStoryIndex, setActiveStoryIndex, markStorySeen, sendMessage } = useInstagram();
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [floatingEmojis, setFloatingEmojis] = useState<{ id: number; emoji: string }[]>([]);
  const timerRef = useRef<number | null>(null);

  const currentStory = activeStoryIndex !== null ? stories[activeStoryIndex] : null;

  // Mark story as seen
  useEffect(() => {
    if (currentStory) {
      markStorySeen(currentStory.id);
      setProgress(0);
    }
  }, [activeStoryIndex]);

  // Story progress timer (5 seconds duration)
  useEffect(() => {
    if (activeStoryIndex === null || isPaused) return;

    const interval = 50; // 50ms ticks
    const step = (interval / 5000) * 100;

    const id = window.setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          // Go to next story
          handleNextStory();
          return 0;
        }
        return prev + step;
      });
    }, interval);

    return () => clearInterval(id);
  }, [activeStoryIndex, isPaused, stories.length]);

  const handleNextStory = () => {
    if (activeStoryIndex === null) return;
    if (activeStoryIndex < stories.length - 1) {
      setActiveStoryIndex(activeStoryIndex + 1);
      setProgress(0);
    } else {
      setActiveStoryIndex(null); // Close
    }
  };

  const handlePrevStory = () => {
    if (activeStoryIndex === null) return;
    if (activeStoryIndex > 0) {
      setActiveStoryIndex(activeStoryIndex - 1);
      setProgress(0);
    }
  };

  const handleSendReaction = (emoji: string) => {
    const id = Date.now();
    setFloatingEmojis(prev => [...prev, { id, emoji }]);
    setTimeout(() => {
      setFloatingEmojis(prev => prev.filter(item => item.id !== id));
    }, 1500);

    // Send to direct messages
    if (currentStory) {
      sendMessage('conv_1', `Reacted ${emoji} to your story!`);
    }
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !currentStory) return;
    sendMessage('conv_1', `Story reply: ${replyText}`);
    setReplyText('');
    handleSendReaction('💌');
  };

  if (activeStoryIndex === null || !currentStory) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center select-none backdrop-blur-md">
      {/* Top Close Button */}
      <button
        onClick={() => setActiveStoryIndex(null)}
        className="absolute top-4 right-4 z-50 text-white/80 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Main Story Container (9:16 mobile aspect ratio frame) */}
      <div
        className="relative w-full max-w-[420px] h-[92vh] max-h-[840px] bg-neutral-900 rounded-2xl overflow-hidden flex flex-col shadow-2xl"
        onMouseDown={() => setIsPaused(true)}
        onMouseUp={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        {/* Progress Bar Segments */}
        <div className="absolute top-3 left-3 right-3 z-30 flex items-center gap-1.5">
          {stories.map((s, idx) => (
            <div key={s.id} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-75"
                style={{
                  width:
                    idx < activeStoryIndex
                      ? '100%'
                      : idx === activeStoryIndex
                      ? `${progress}%`
                      : '0%',
                }}
              />
            </div>
          ))}
        </div>

        {/* Story Author Header */}
        <div className="absolute top-6 left-3 right-3 z-30 flex items-center justify-between text-white drop-shadow-md">
          <div className="flex items-center gap-2.5">
            <img
              src={currentStory.userAvatar}
              alt={currentStory.username}
              referrerPolicy="no-referrer"
              className="w-8 h-8 rounded-full object-cover border border-white/50"
            />
            <span className="font-semibold text-sm">{currentStory.username}</span>
            <span className="text-white/70 text-xs">{currentStory.timestamp}</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={e => {
                e.stopPropagation();
                setIsPaused(!isPaused);
              }}
              className="p-1.5 rounded-full hover:bg-white/20 transition-colors text-white"
            >
              {isPaused ? <Play className="w-4 h-4 fill-white" /> : <Pause className="w-4 h-4" />}
            </button>
            <button
              onClick={e => {
                e.stopPropagation();
                setIsMuted(!isMuted);
              }}
              className="p-1.5 rounded-full hover:bg-white/20 transition-colors text-white"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Story Media */}
        <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden">
          <img
            src={currentStory.mediaUrl}
            alt="Story media"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover select-none"
          />

          {/* Left / Right Tap zones */}
          <button
            onClick={e => {
              e.stopPropagation();
              handlePrevStory();
            }}
            className="absolute left-0 top-0 bottom-0 w-1/3 cursor-pointer opacity-0 hover:opacity-100 flex items-center justify-start pl-4 text-white/50 hover:text-white"
            aria-label="Previous story"
          >
            <ChevronLeft className="w-8 h-8 drop-shadow" />
          </button>
          <button
            onClick={e => {
              e.stopPropagation();
              handleNextStory();
            }}
            className="absolute right-0 top-0 bottom-0 w-1/3 cursor-pointer opacity-0 hover:opacity-100 flex items-center justify-end pr-4 text-white/50 hover:text-white"
            aria-label="Next story"
          >
            <ChevronRight className="w-8 h-8 drop-shadow" />
          </button>

          {/* Caption overlay if present */}
          {currentStory.caption && (
            <div className="absolute bottom-20 left-4 right-4 z-20 bg-black/40 backdrop-blur-md rounded-xl p-3 text-white text-sm">
              <p>{currentStory.caption}</p>
            </div>
          )}

          {/* Floating Emoji Bursts */}
          {floatingEmojis.map(item => (
            <div
              key={item.id}
              className="absolute bottom-24 right-8 text-4xl animate-bounce transition-all pointer-events-none"
            >
              {item.emoji}
            </div>
          ))}
        </div>

        {/* Bottom Interactive Reply & Quick Reactions */}
        <div className="relative z-30 p-3 bg-gradient-to-t from-black via-black/80 to-transparent flex flex-col gap-2">
          {/* Quick Reaction Emojis */}
          <div className="flex items-center justify-around px-2">
            {['🔥', '❤️', '😂', '😮', '😢', '👏'].map(emoji => (
              <button
                key={emoji}
                onClick={e => {
                  e.stopPropagation();
                  handleSendReaction(emoji);
                }}
                className="text-xl hover:scale-125 active:scale-95 transition-transform p-1"
                title={`React ${emoji}`}
              >
                {emoji}
              </button>
            ))}
          </div>

          {/* Reply Text Form */}
          <form
            onSubmit={handleSendReply}
            onClick={e => e.stopPropagation()}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={replyText}
              onChange={e => setReplyText(e.target.value)}
              placeholder={`Reply to ${currentStory.username}...`}
              className="flex-1 bg-white/15 text-white placeholder-white/60 text-xs px-3.5 py-2.5 rounded-full border border-white/20 focus:outline-none focus:border-white/60"
            />
            {replyText.trim() ? (
              <button
                type="submit"
                className="w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center hover:bg-rose-600 transition-colors shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleSendReaction('❤️')}
                className="text-white hover:text-rose-500 transition-colors p-1"
              >
                <Heart className="w-6 h-6" />
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

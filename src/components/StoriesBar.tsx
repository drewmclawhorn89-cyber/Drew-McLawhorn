import React from 'react';
import { Plus } from 'lucide-react';
import { useInstagram } from '../context/InstagramContext';

export const StoriesBar: React.FC = () => {
  const { stories, currentUser, setActiveStoryIndex, setIsCreateModalOpen } = useInstagram();

  return (
    <div className="w-full bg-white dark:bg-black border border-[#dbdbdb] dark:border-[#262626] rounded-xl p-4 mb-4 overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
      <div className="flex items-center gap-4 overflow-x-auto no-scrollbar py-1">
        {/* Current User Story Item */}
        <div className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group">
          <div className="relative">
            <div className="w-16 h-16 rounded-full p-0.5 bg-neutral-200 dark:bg-neutral-800 transition-transform group-hover:scale-105">
              <img
                src={currentUser.avatar}
                alt="Your story"
                referrerPolicy="no-referrer"
                className="w-full h-full rounded-full object-cover border-2 border-white dark:border-black"
              />
            </div>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="absolute bottom-0 right-0 w-5 h-5 bg-sky-500 text-white rounded-full flex items-center justify-center border-2 border-white dark:border-black shadow-sm group-hover:scale-110 transition-transform"
              title="Add to story"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
            </button>
          </div>
          <span className="text-xs text-neutral-600 dark:text-neutral-400 font-medium truncate max-w-[68px]">
            Your story
          </span>
        </div>

        {/* Stories from Friends */}
        {stories.map((story, index) => (
          <button
            key={story.id}
            onClick={() => setActiveStoryIndex(index)}
            className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group text-left"
          >
            <div
              className={`w-16 h-16 rounded-full p-[2.5px] transition-transform duration-200 group-hover:scale-105 ${
                story.isSeen ? 'story-gradient-seen' : 'story-gradient'
              }`}
            >
              <img
                src={story.userAvatar}
                alt={story.username}
                referrerPolicy="no-referrer"
                className="w-full h-full rounded-full object-cover border-2 border-white dark:border-black bg-neutral-100 dark:bg-neutral-900"
              />
            </div>
            <span className="text-xs text-neutral-800 dark:text-neutral-200 font-normal truncate max-w-[68px]">
              {story.username}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

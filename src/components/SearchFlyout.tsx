import React, { useState } from 'react';
import { X, Search, Check } from 'lucide-react';
import { useInstagram } from '../context/InstagramContext';
import { MOCK_USERS } from '../data/mockData';

interface SearchFlyoutProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchFlyout: React.FC<SearchFlyoutProps> = ({ isOpen, onClose }) => {
  const { setActiveTab } = useInstagram();
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const usersList = Object.values(MOCK_USERS);
  const filteredUsers = usersList.filter(
    u =>
      u.username.toLowerCase().includes(query.toLowerCase()) ||
      u.fullName.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed md:absolute top-0 left-0 md:left-20 lg:left-64 z-40 w-full md:w-96 h-full bg-white dark:bg-[#121212] border-r border-neutral-200 dark:border-neutral-800 shadow-2xl p-5 flex flex-col animate-in slide-in-from-left duration-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">Search</h2>
        <button
          onClick={onClose}
          className="p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Search Input */}
      <div className="relative mb-6">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search creators..."
          autoFocus
          className="w-full bg-neutral-100 dark:bg-neutral-800 text-xs pl-10 pr-4 py-2.5 rounded-xl border border-transparent focus:border-neutral-300 dark:focus:border-neutral-600 focus:outline-none"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-neutral-600"
          >
            Clear
          </button>
        )}
      </div>

      {/* Results List */}
      <div className="flex-1 overflow-y-auto">
        <span className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3">
          {query ? 'Results' : 'Suggested Creators'}
        </span>

        <div className="space-y-3">
          {filteredUsers.map(user => (
            <div
              key={user.id}
              onClick={() => {
                setActiveTab('explore');
                onClose();
              }}
              className="flex items-center justify-between p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800/60 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3">
                <img
                  src={user.avatar}
                  alt={user.username}
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <div className="flex items-center gap-1 font-semibold text-xs text-neutral-900 dark:text-neutral-100">
                    <span>{user.username}</span>
                    {user.isVerified && (
                      <span className="w-3 h-3 bg-sky-500 rounded-full flex items-center justify-center text-white text-[8px] font-bold">
                        ✓
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
                    {user.fullName} · {user.followersCount.toLocaleString()} followers
                  </span>
                </div>
              </div>

              <button className="px-3 py-1 bg-sky-500 hover:bg-sky-600 text-white rounded-lg text-xs font-semibold">
                View
              </button>
            </div>
          ))}

          {filteredUsers.length === 0 && (
            <div className="text-center py-12 text-xs text-neutral-400">
              No matching accounts found for "{query}".
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

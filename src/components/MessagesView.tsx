import React, { useState } from 'react';
import {
  Send,
  Heart,
  Image as ImageIcon,
  Smile,
  Phone,
  Video,
  Info,
  Search,
  CheckCheck,
} from 'lucide-react';
import { useInstagram } from '../context/InstagramContext';
import { ASSET_IMAGES } from '../data/mockData';

export const MessagesView: React.FC = () => {
  const {
    conversations,
    selectedChatId,
    setSelectedChatId,
    sendMessage,
    toggleLikeMessage,
    currentUser,
  } = useInstagram();

  const [messageInput, setMessageInput] = useState('');
  const [chatSearch, setChatSearch] = useState('');

  const activeConv = conversations.find(c => c.id === selectedChatId) || conversations[0];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !activeConv) return;
    sendMessage(activeConv.id, messageInput);
    setMessageInput('');
  };

  const handleSendHeart = () => {
    if (!activeConv) return;
    sendMessage(activeConv.id, '❤️');
  };

  const handleSendPhoto = () => {
    if (!activeConv) return;
    sendMessage(activeConv.id, 'Sent a photo 📷');
  };

  const filteredConversations = conversations.filter(c =>
    c.user.fullName.toLowerCase().includes(chatSearch.toLowerCase()) ||
    c.user.username.toLowerCase().includes(chatSearch.toLowerCase())
  );

  return (
    <div className="w-full max-w-5xl mx-auto h-[calc(100vh-100px)] md:h-[84vh] bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden flex shadow-sm my-2 md:my-4">
      {/* Left Column: Inbox List */}
      <div className="w-full md:w-80 border-r border-neutral-200 dark:border-neutral-800 flex flex-col shrink-0">
        {/* Inbox Header */}
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-bold text-base">
            <span>{currentUser.username}</span>
          </div>
          <span className="text-xs text-neutral-400 font-medium">Messages</span>
        </div>

        {/* Search Chats */}
        <div className="p-3 border-b border-neutral-100 dark:border-neutral-900">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={chatSearch}
              onChange={e => setChatSearch(e.target.value)}
              placeholder="Search chats..."
              className="w-full bg-neutral-100 dark:bg-neutral-900 text-xs pl-9 pr-3 py-2 rounded-xl focus:outline-none"
            />
          </div>
        </div>

        {/* Chat List Items */}
        <div className="flex-1 overflow-y-auto divide-y divide-neutral-100 dark:divide-neutral-900/50">
          {filteredConversations.map(conv => {
            const isSelected = activeConv?.id === conv.id;
            return (
              <button
                key={conv.id}
                onClick={() => setSelectedChatId(conv.id)}
                className={`w-full p-3.5 flex items-center gap-3 text-left transition-colors ${
                  isSelected
                    ? 'bg-neutral-100 dark:bg-neutral-900'
                    : 'hover:bg-neutral-50 dark:hover:bg-neutral-900/40'
                }`}
              >
                <div className="relative shrink-0">
                  <img
                    src={conv.user.avatar}
                    alt={conv.user.username}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  {/* Online indicator */}
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-black rounded-full" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-semibold text-xs text-neutral-900 dark:text-neutral-100 truncate">
                      {conv.user.fullName}
                    </span>
                    <span className="text-[10px] text-neutral-400 shrink-0">
                      {conv.lastMessageTimestamp}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                    {conv.lastMessage}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right Column: Chat History & Input */}
      {activeConv ? (
        <div className="hidden md:flex flex-1 flex-col bg-white dark:bg-[#0a0a0a]">
          {/* Active Chat Header */}
          <div className="p-3.5 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between bg-white dark:bg-black">
            <div className="flex items-center gap-3">
              <img
                src={activeConv.user.avatar}
                alt={activeConv.user.username}
                referrerPolicy="no-referrer"
                className="w-9 h-9 rounded-full object-cover"
              />
              <div>
                <div className="flex items-center gap-1.5 leading-none">
                  <span className="font-semibold text-xs text-neutral-900 dark:text-neutral-100">
                    {activeConv.user.fullName}
                  </span>
                  {activeConv.user.isVerified && (
                    <span className="w-3 h-3 bg-sky-500 rounded-full flex items-center justify-center text-white text-[8px] font-bold">
                      ✓
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-emerald-500">Active now</span>
              </div>
            </div>

            <div className="flex items-center gap-3 text-neutral-700 dark:text-neutral-300">
              <button className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-900 rounded-full transition-colors">
                <Phone className="w-4 h-4" />
              </button>
              <button className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-900 rounded-full transition-colors">
                <Video className="w-4 h-4" />
              </button>
              <button className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-900 rounded-full transition-colors">
                <Info className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages History */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {activeConv.messages.map(msg => {
              const isMine = msg.senderId === currentUser.id;

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMine ? 'items-end' : 'items-start'} group`}
                >
                  <div className="relative flex items-center gap-1.5 max-w-[70%]">
                    <div
                      onDoubleClick={() => toggleLikeMessage(activeConv.id, msg.id)}
                      className={`px-4 py-2.5 rounded-2xl text-xs leading-relaxed select-none cursor-pointer transition-transform active:scale-95 ${
                        isMine
                          ? 'bg-sky-500 text-white rounded-br-xs'
                          : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 rounded-bl-xs'
                      }`}
                    >
                      {msg.text}
                    </div>

                    {/* Double-tap heart indicator */}
                    {msg.isLiked && (
                      <span className="text-rose-500 text-xs">
                        <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-neutral-400 mt-0.5 px-1">
                    {msg.timestamp}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Chat Message Input Bar */}
          <form
            onSubmit={handleSend}
            className="p-3 border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black flex items-center gap-2"
          >
            <div className="flex-1 bg-neutral-100 dark:bg-neutral-900 rounded-full flex items-center px-3 py-1.5 border border-transparent focus-within:border-neutral-300 dark:focus-within:border-neutral-700">
              <button
                type="button"
                className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 p-1"
              >
                <Smile className="w-4 h-4" />
              </button>

              <input
                type="text"
                value={messageInput}
                onChange={e => setMessageInput(e.target.value)}
                placeholder="Message..."
                className="flex-1 bg-transparent text-xs text-neutral-900 dark:text-neutral-100 px-2 py-1 focus:outline-none"
              />

              <button
                type="button"
                onClick={handleSendPhoto}
                className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 p-1"
                title="Send photo"
              >
                <ImageIcon className="w-4 h-4" />
              </button>
            </div>

            {messageInput.trim() ? (
              <button
                type="submit"
                className="text-xs font-bold text-sky-500 hover:text-sky-600 px-2 py-1"
              >
                Send
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSendHeart}
                className="p-2 text-rose-500 hover:scale-110 active:scale-95 transition-transform"
                title="Send heart"
              >
                <Heart className="w-5 h-5 fill-rose-500" />
              </button>
            )}
          </form>
        </div>
      ) : (
        <div className="hidden md:flex flex-1 items-center justify-center text-neutral-400 text-xs">
          Select a chat to start messaging
        </div>
      )}
    </div>
  );
};

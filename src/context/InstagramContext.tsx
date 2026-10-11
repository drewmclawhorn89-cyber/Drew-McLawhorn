import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth, signInWithGoogle, signOutUser } from '../lib/firebase';
import {
  User,
  Post,
  Story,
  Reel,
  Conversation,
  ActivityNotification,
  Comment,
  DirectMessage,
} from '../types/instagram';
import {
  CURRENT_USER,
  INITIAL_POSTS,
  INITIAL_STORIES,
  INITIAL_REELS,
  INITIAL_CONVERSATIONS,
  INITIAL_NOTIFICATIONS,
} from '../data/mockData';

interface InstagramContextType {
  currentUser: User;
  setCurrentUser: React.Dispatch<React.SetStateAction<User>>;
  posts: Post[];
  stories: Story[];
  reels: Reel[];
  conversations: Conversation[];
  notifications: ActivityNotification[];
  activeTab: 'feed' | 'explore' | 'reels' | 'messages' | 'profile';
  setActiveTab: (tab: 'feed' | 'explore' | 'reels' | 'messages' | 'profile') => void;
  activeStoryIndex: number | null;
  setActiveStoryIndex: (index: number | null) => void;
  isCreateModalOpen: boolean;
  setIsCreateModalOpen: (open: boolean) => void;
  isNotificationsOpen: boolean;
  setIsNotificationsOpen: (open: boolean) => void;
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (open: boolean) => void;
  selectedPostForDetail: Post | null;
  setSelectedPostForDetail: (post: Post | null) => void;
  selectedChatId: string | null;
  setSelectedChatId: (id: string | null) => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  toggleLikePost: (postId: string) => void;
  toggleSavePost: (postId: string) => void;
  addComment: (postId: string, text: string) => void;
  toggleLikeComment: (postId: string, commentId: string) => void;
  addNewPost: (newPostData: {
    mediaUrl: string;
    caption: string;
    location?: string;
    filter?: string;
    tags?: string[];
  }) => void;
  addNewStory: (mediaUrl: string, caption?: string) => void;
  toggleLikeReel: (reelId: string) => void;
  toggleSaveReel: (reelId: string) => void;
  sendMessage: (convId: string, text: string) => void;
  toggleLikeMessage: (convId: string, messageId: string) => void;
  toggleFollowUser: (userId: string) => void;
  markStorySeen: (storyId: string) => void;
  isGoogleSignedIn: boolean;
  isAuthLoading: boolean;
  signInWithGoogleAction: () => Promise<void>;
  signOutAction: () => Promise<void>;
}

const InstagramContext = createContext<InstagramContextType | undefined>(undefined);

export const InstagramProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('ig_theme');
    return (saved as 'dark' | 'light') || 'dark';
  });

  useEffect(() => {
    localStorage.setItem('ig_theme', theme);
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // User state
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem('ig_current_user');
    return saved ? JSON.parse(saved) : CURRENT_USER;
  });

  useEffect(() => {
    localStorage.setItem('ig_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  // Posts state
  const [posts, setPosts] = useState<Post[]>(() => {
    const saved = localStorage.getItem('ig_posts');
    return saved ? JSON.parse(saved) : INITIAL_POSTS;
  });

  useEffect(() => {
    localStorage.setItem('ig_posts', JSON.stringify(posts));
  }, [posts]);

  // Stories state
  const [stories, setStories] = useState<Story[]>(() => {
    const saved = localStorage.getItem('ig_stories');
    return saved ? JSON.parse(saved) : INITIAL_STORIES;
  });

  useEffect(() => {
    localStorage.setItem('ig_stories', JSON.stringify(stories));
  }, [stories]);

  // Reels state
  const [reels, setReels] = useState<Reel[]>(() => {
    const saved = localStorage.getItem('ig_reels');
    return saved ? JSON.parse(saved) : INITIAL_REELS;
  });

  useEffect(() => {
    localStorage.setItem('ig_reels', JSON.stringify(reels));
  }, [reels]);

  // Conversations state
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const saved = localStorage.getItem('ig_conversations');
    return saved ? JSON.parse(saved) : INITIAL_CONVERSATIONS;
  });

  useEffect(() => {
    localStorage.setItem('ig_conversations', JSON.stringify(conversations));
  }, [conversations]);

  // Notifications state
  const [notifications, setNotifications] = useState<ActivityNotification[]>(() => {
    const saved = localStorage.getItem('ig_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  // UI state
  const [activeTab, setActiveTab] = useState<'feed' | 'explore' | 'reels' | 'messages' | 'profile'>('feed');
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [selectedPostForDetail, setSelectedPostForDetail] = useState<Post | null>(null);
  const [selectedChatId, setSelectedChatId] = useState<string | null>('conv_1');

  // Firebase Google Auth state
  const [isGoogleSignedIn, setIsGoogleSignedIn] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, fbUser => {
      setIsAuthLoading(false);
      if (fbUser) {
        setIsGoogleSignedIn(true);
        const derivedUsername =
          fbUser.email?.split('@')[0].toLowerCase().replace(/[^a-z0-9_.]/g, '') ||
          fbUser.displayName?.toLowerCase().replace(/\s+/g, '_') ||
          'creator';

        setCurrentUser(prev => ({
          ...prev,
          id: fbUser.uid,
          fullName: fbUser.displayName || prev.fullName,
          username: derivedUsername,
          email: fbUser.email || undefined,
          avatar: fbUser.photoURL || prev.avatar,
          isVerified: true,
        }));
      } else {
        setIsGoogleSignedIn(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogleAction = async () => {
    setIsAuthLoading(true);
    try {
      const user = await signInWithGoogle();
      if (user) {
        setIsLoginModalOpen(false);
      }
    } catch (err) {
      console.error('Sign in failed:', err);
    } finally {
      setIsAuthLoading(false);
    }
  };

  const signOutAction = async () => {
    try {
      await signOutUser();
      setIsGoogleSignedIn(false);
      // Reset to default guest profile
      setCurrentUser(CURRENT_USER);
    } catch (err) {
      console.error('Sign out failed:', err);
    }
  };

  // Toggle like post
  const toggleLikePost = (postId: string) => {
    setPosts(prev =>
      prev.map(post => {
        if (post.id === postId) {
          const isLiked = !post.isLiked;
          return {
            ...post,
            isLiked,
            likesCount: isLiked ? post.likesCount + 1 : Math.max(0, post.likesCount - 1),
          };
        }
        return post;
      })
    );

    // Keep selected detail post in sync if open
    if (selectedPostForDetail && selectedPostForDetail.id === postId) {
      setSelectedPostForDetail(prev =>
        prev
          ? {
              ...prev,
              isLiked: !prev.isLiked,
              likesCount: !prev.isLiked ? prev.likesCount + 1 : Math.max(0, prev.likesCount - 1),
            }
          : null
      );
    }
  };

  // Toggle save post
  const toggleSavePost = (postId: string) => {
    setPosts(prev =>
      prev.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            isSaved: !post.isSaved,
          };
        }
        return post;
      })
    );

    if (selectedPostForDetail && selectedPostForDetail.id === postId) {
      setSelectedPostForDetail(prev =>
        prev ? { ...prev, isSaved: !prev.isSaved } : null
      );
    }
  };

  // Add comment to post
  const addComment = (postId: string, text: string) => {
    if (!text.trim()) return;
    const newComment: Comment = {
      id: `c_${Date.now()}`,
      userId: currentUser.id,
      username: currentUser.username,
      userAvatar: currentUser.avatar,
      isVerified: currentUser.isVerified,
      text: text.trim(),
      createdAt: 'Just now',
      likesCount: 0,
      isLiked: false,
    };

    setPosts(prev =>
      prev.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            commentsCount: post.commentsCount + 1,
            comments: [...post.comments, newComment],
          };
        }
        return post;
      })
    );

    if (selectedPostForDetail && selectedPostForDetail.id === postId) {
      setSelectedPostForDetail(prev =>
        prev
          ? {
              ...prev,
              commentsCount: prev.commentsCount + 1,
              comments: [...prev.comments, newComment],
            }
          : null
      );
    }
  };

  // Toggle like comment
  const toggleLikeComment = (postId: string, commentId: string) => {
    setPosts(prev =>
      prev.map(post => {
        if (post.id === postId) {
          const updatedComments = post.comments.map(c => {
            if (c.id === commentId) {
              const isLiked = !c.isLiked;
              return {
                ...c,
                isLiked,
                likesCount: isLiked ? c.likesCount + 1 : Math.max(0, c.likesCount - 1),
              };
            }
            return c;
          });
          return { ...post, comments: updatedComments };
        }
        return post;
      })
    );

    if (selectedPostForDetail && selectedPostForDetail.id === postId) {
      setSelectedPostForDetail(prev => {
        if (!prev) return null;
        const updatedComments = prev.comments.map(c => {
          if (c.id === commentId) {
            const isLiked = !c.isLiked;
            return {
              ...c,
              isLiked,
              likesCount: isLiked ? c.likesCount + 1 : Math.max(0, c.likesCount - 1),
            };
          }
          return c;
        });
        return { ...prev, comments: updatedComments };
      });
    }
  };

  // Add new post
  const addNewPost = ({
    mediaUrl,
    caption,
    location,
    filter,
    tags,
  }: {
    mediaUrl: string;
    caption: string;
    location?: string;
    filter?: string;
    tags?: string[];
  }) => {
    const newPost: Post = {
      id: `post_${Date.now()}`,
      userId: currentUser.id,
      username: currentUser.username,
      userAvatar: currentUser.avatar,
      isVerified: currentUser.isVerified,
      mediaUrl,
      caption,
      location: location || 'London, United Kingdom',
      createdAt: 'JUST NOW',
      likesCount: 0,
      isLiked: false,
      isSaved: false,
      commentsCount: 0,
      comments: [],
      filter: filter || 'filter-normal',
      tags: tags || ['photography', 'lifestyle'],
    };

    setPosts(prev => [newPost, ...prev]);
    setCurrentUser(prev => ({ ...prev, postsCount: prev.postsCount + 1 }));
    setIsCreateModalOpen(false);
    setActiveTab('feed');
  };

  // Add new story
  const addNewStory = (mediaUrl: string, caption?: string) => {
    const newStory: Story = {
      id: `story_${Date.now()}`,
      userId: currentUser.id,
      username: currentUser.username,
      userAvatar: currentUser.avatar,
      mediaUrl,
      caption: caption || 'My story ✨',
      timestamp: 'Just now',
      isSeen: false,
    };
    setStories(prev => [newStory, ...prev]);
  };

  // Mark story as seen
  const markStorySeen = (storyId: string) => {
    setStories(prev =>
      prev.map(s => (s.id === storyId ? { ...s, isSeen: true } : s))
    );
  };

  // Toggle like reel
  const toggleLikeReel = (reelId: string) => {
    setReels(prev =>
      prev.map(reel => {
        if (reel.id === reelId) {
          const isLiked = !reel.isLiked;
          return {
            ...reel,
            isLiked,
            likesCount: isLiked ? reel.likesCount + 1 : Math.max(0, reel.likesCount - 1),
          };
        }
        return reel;
      })
    );
  };

  // Toggle save reel
  const toggleSaveReel = (reelId: string) => {
    setReels(prev =>
      prev.map(reel => (reel.id === reelId ? { ...reel, isSaved: !reel.isSaved } : reel))
    );
  };

  // Send message
  const sendMessage = (convId: string, text: string) => {
    if (!text.trim()) return;
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newMsg: DirectMessage = {
      id: `m_${Date.now()}`,
      senderId: currentUser.id,
      text: text.trim(),
      timestamp: timeString,
    };

    setConversations(prev =>
      prev.map(conv => {
        if (conv.id === convId) {
          return {
            ...conv,
            lastMessage: text.trim(),
            lastMessageTimestamp: 'Just now',
            messages: [...conv.messages, newMsg],
          };
        }
        return conv;
      })
    );

    // Simulated responsive reply after 2.5 seconds if talking to Maya
    if (convId === 'conv_1') {
      setTimeout(() => {
        const autoReply: DirectMessage = {
          id: `m_reply_${Date.now()}`,
          senderId: 'user_maya',
          text: 'Love that idea! Catch you then 📸✌️',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setConversations(current =>
          current.map(c =>
            c.id === convId
              ? {
                  ...c,
                  lastMessage: autoReply.text,
                  lastMessageTimestamp: 'Just now',
                  messages: [...c.messages, autoReply],
                }
              : c
          )
        );
      }, 2500);
    }
  };

  // Toggle like message
  const toggleLikeMessage = (convId: string, messageId: string) => {
    setConversations(prev =>
      prev.map(conv => {
        if (conv.id === convId) {
          const updated = conv.messages.map(m =>
            m.id === messageId ? { ...m, isLiked: !m.isLiked } : m
          );
          return { ...conv, messages: updated };
        }
        return conv;
      })
    );
  };

  // Toggle follow user
  const toggleFollowUser = (userId: string) => {
    setNotifications(prev =>
      prev.map(notif => {
        if (notif.user.id === userId) {
          return { ...notif, isFollowedBack: !notif.isFollowedBack };
        }
        return notif;
      })
    );
  };

  return (
    <InstagramContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        posts,
        stories,
        reels,
        conversations,
        notifications,
        activeTab,
        setActiveTab,
        activeStoryIndex,
        setActiveStoryIndex,
        isCreateModalOpen,
        setIsCreateModalOpen,
        isNotificationsOpen,
        setIsNotificationsOpen,
        isLoginModalOpen,
        setIsLoginModalOpen,
        selectedPostForDetail,
        setSelectedPostForDetail,
        selectedChatId,
        setSelectedChatId,
        theme,
        toggleTheme,
        toggleLikePost,
        toggleSavePost,
        addComment,
        toggleLikeComment,
        addNewPost,
        addNewStory,
        toggleLikeReel,
        toggleSaveReel,
        sendMessage,
        toggleLikeMessage,
        toggleFollowUser,
        markStorySeen,
        isGoogleSignedIn,
        isAuthLoading,
        signInWithGoogleAction,
        signOutAction,
      }}
    >
      {children}
    </InstagramContext.Provider>
  );
};

export const useInstagram = () => {
  const context = useContext(InstagramContext);
  if (!context) {
    throw new Error('useInstagram must be used within an InstagramProvider');
  }
  return context;
};

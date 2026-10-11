export interface User {
  id: string;
  username: string;
  fullName: string;
  avatar: string;
  email?: string;
  isVerified?: boolean;
  bio?: string;
  website?: string;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  isFollowing?: boolean;
}

export interface Story {
  id: string;
  userId: string;
  username: string;
  userAvatar: string;
  mediaUrl: string;
  caption?: string;
  timestamp: string;
  isSeen?: boolean;
}

export interface Comment {
  id: string;
  userId: string;
  username: string;
  userAvatar: string;
  isVerified?: boolean;
  text: string;
  createdAt: string;
  likesCount: number;
  isLiked?: boolean;
}

export interface Post {
  id: string;
  userId: string;
  username: string;
  userAvatar: string;
  isVerified?: boolean;
  mediaUrl: string;
  caption: string;
  location?: string;
  createdAt: string;
  likesCount: number;
  isLiked?: boolean;
  isSaved?: boolean;
  commentsCount: number;
  comments: Comment[];
  filter?: string;
  tags?: string[];
}

export interface Reel {
  id: string;
  userId: string;
  username: string;
  userAvatar: string;
  isVerified?: boolean;
  videoPoster: string;
  caption: string;
  audioTrack: string;
  likesCount: number;
  isLiked?: boolean;
  isSaved?: boolean;
  commentsCount: number;
  sharesCount: number;
}

export interface DirectMessage {
  id: string;
  senderId: string;
  text: string;
  mediaUrl?: string;
  timestamp: string;
  isLiked?: boolean;
}

export interface Conversation {
  id: string;
  user: User;
  lastMessage: string;
  lastMessageTimestamp: string;
  unreadCount: number;
  messages: DirectMessage[];
}

export interface ActivityNotification {
  id: string;
  type: 'like' | 'comment' | 'follow';
  user: User;
  postImage?: string;
  text?: string;
  createdAt: string;
  isFollowedBack?: boolean;
}

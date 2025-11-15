export interface SocialLink {
  id: string;
  url: string;
  platform: 'twitter' | 'facebook' | 'linkedin' | 'instagram' | 'youtube' | 'other';
  addedAt: string;
}

export interface GetSocialLinksResponse {
  links: SocialLink[];
}

export interface AddLinkRequest {
  url: string;
}

// New types for enhanced social media platforms
export interface XProfile {
  id: string;
  username: string;
  displayName: string;
  profileImageUrl?: string;
  followersCount: number;
  lastSyncAt?: string;
  isActive: boolean;
}

export interface InstagramProfile {
  id: string;
  username: string;
  displayName: string;
  profileImageUrl?: string;
  followersCount: number;
  lastSyncAt?: string;
  isActive: boolean;
}

export interface YouTubeChannel {
  id: string;
  channelName: string;
  description?: string;
  thumbnailUrl?: string;
  subscriberCount: number;
  lastSyncAt?: string;
  isActive: boolean;
}

export interface YouTubeVideo {
  id: string;
  title: string;
  description?: string;
  thumbnailUrl?: string;
  duration: string;
  viewCount: number;
  uploadedAt: string;
  isProcessed: boolean;
}

export interface YouTubePlaylist {
  id: string;
  title: string;
  description?: string;
  videoCount: number;
  lastSyncAt?: string;
  isActive: boolean;
  keepSynced: boolean;
}

export interface SocialMediaStatus {
  platform: 'x' | 'instagram' | 'youtube';
  isConnected: boolean;
  lastSyncAt?: string;
  itemCount: number;
  error?: string;
}
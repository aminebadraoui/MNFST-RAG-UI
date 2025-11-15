import { apiClient } from './apiClient';
import { 
  SocialLink, 
  GetSocialLinksResponse, 
  AddLinkRequest,
  XProfile,
  InstagramProfile,
  YouTubeChannel,
  YouTubeVideo,
  YouTubePlaylist,
  SocialMediaStatus
} from '../types';

// Define DataResponse interface for type safety
interface DataResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const socialAPI = {
  // Existing social links functionality
  getLinks: async (): Promise<SocialLink[]> => {
    const response = await apiClient.get<DataResponse<SocialLink[]>>('/social-links');
    return response.data.data;
  },

  addLink: async (url: string): Promise<SocialLink> => {
    const response = await apiClient.post<DataResponse<SocialLink>>('/social-links', { url });
    return response.data.data;
  },

  removeLink: async (linkId: string): Promise<void> => {
    await apiClient.delete(`/social-links/${linkId}`);
  },

  // X (Twitter) API methods
  getXProfiles: async (): Promise<XProfile[]> => {
    const response = await apiClient.get<DataResponse<XProfile[]>>('/social/x/profiles');
    return response.data.data;
  },

  addXProfile: async (username: string): Promise<XProfile> => {
    const response = await apiClient.post<DataResponse<XProfile>>('/social/x/profiles', { username });
    return response.data.data;
  },

  syncXProfile: async (profileId: string): Promise<XProfile> => {
    const response = await apiClient.post<DataResponse<XProfile>>(`/social/x/profiles/${profileId}/sync`);
    return response.data.data;
  },

  deleteXProfile: async (profileId: string): Promise<void> => {
    await apiClient.delete(`/social/x/profiles/${profileId}`);
  },

  // Instagram API methods
  getInstagramProfiles: async (): Promise<InstagramProfile[]> => {
    const response = await apiClient.get<DataResponse<InstagramProfile[]>>('/social/instagram/profiles');
    return response.data.data;
  },

  addInstagramProfile: async (username: string): Promise<InstagramProfile> => {
    const response = await apiClient.post<DataResponse<InstagramProfile>>('/social/instagram/profiles', { username });
    return response.data.data;
  },

  syncInstagramProfile: async (profileId: string): Promise<InstagramProfile> => {
    const response = await apiClient.post<DataResponse<InstagramProfile>>(`/social/instagram/profiles/${profileId}/sync`);
    return response.data.data;
  },

  deleteInstagramProfile: async (profileId: string): Promise<void> => {
    await apiClient.delete(`/social/instagram/profiles/${profileId}`);
  },

  // YouTube API methods
  getYouTubeChannels: async (): Promise<YouTubeChannel[]> => {
    const response = await apiClient.get<DataResponse<YouTubeChannel[]>>('/social/youtube/channels');
    return response.data.data;
  },

  addYouTubeChannel: async (channelId: string): Promise<YouTubeChannel> => {
    const response = await apiClient.post<DataResponse<YouTubeChannel>>('/social/youtube/channels', { channelId });
    return response.data.data;
  },

  syncYouTubeChannel: async (channelId: string): Promise<YouTubeChannel> => {
    const response = await apiClient.post<DataResponse<YouTubeChannel>>(`/social/youtube/channels/${channelId}/sync`);
    return response.data.data;
  },

  deleteYouTubeChannel: async (channelId: string): Promise<void> => {
    await apiClient.delete(`/social/youtube/channels/${channelId}`);
  },

  uploadYouTubeVideo: async (videoFile: File, onProgress?: (progress: number) => void): Promise<YouTubeVideo> => {
    const formData = new FormData();
    formData.append('video', videoFile);

    const response = await apiClient.post<DataResponse<YouTubeVideo>>(
      '/social/youtube/videos/upload',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress(progress);
          }
        },
      }
    );
    return response.data.data;
  },

  getYouTubePlaylists: async (): Promise<YouTubePlaylist[]> => {
    const response = await apiClient.get<DataResponse<YouTubePlaylist[]>>('/social/youtube/playlists');
    return response.data.data;
  },

  addYouTubePlaylist: async (playlistId: string, keepSynced: boolean = false): Promise<YouTubePlaylist> => {
    const response = await apiClient.post<DataResponse<YouTubePlaylist>>('/social/youtube/playlists', { 
      playlistId, 
      keepSynced 
    });
    return response.data.data;
  },

  syncYouTubePlaylist: async (playlistId: string): Promise<YouTubePlaylist> => {
    const response = await apiClient.post<DataResponse<YouTubePlaylist>>(`/social/youtube/playlists/${playlistId}/sync`);
    return response.data.data;
  },

  deleteYouTubePlaylist: async (playlistId: string): Promise<void> => {
    await apiClient.delete(`/social/youtube/playlists/${playlistId}`);
  },

  updatePlaylistSync: async (playlistId: string, keepSynced: boolean): Promise<YouTubePlaylist> => {
    const response = await apiClient.put<DataResponse<YouTubePlaylist>>(`/social/youtube/playlists/${playlistId}`, {
      keepSynced
    });
    return response.data.data;
  },

  // General status methods
  getSocialMediaStatus: async (): Promise<SocialMediaStatus[]> => {
    const response = await apiClient.get<DataResponse<SocialMediaStatus[]>>('/social/status');
    return response.data.data;
  },
};
import { apiClient } from './apiClient';
import { SocialLink, GetSocialLinksResponse, AddLinkRequest } from '../types';

// Define DataResponse interface for type safety
interface DataResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const socialAPI = {
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
};
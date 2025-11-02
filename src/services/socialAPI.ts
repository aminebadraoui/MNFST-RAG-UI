import { apiClient } from './apiClient';
import { SocialLink, GetSocialLinksResponse, AddLinkRequest } from '../types';

export const socialAPI = {
  getLinks: async (): Promise<GetSocialLinksResponse> => {
    const response = await apiClient.get<GetSocialLinksResponse>('/social-links');
    return response.data;
  },

  addLink: async (url: string): Promise<SocialLink> => {
    const response = await apiClient.post<SocialLink>('/social-links', { url });
    return response.data;
  },

  removeLink: async (linkId: string): Promise<void> => {
    await apiClient.delete(`/social-links/${linkId}`);
  },
};
import { SocialLink, GetSocialLinksResponse, AddLinkRequest } from '../../types';
import { mockApiClient } from './mockApiClient';
import { MockDataGenerator } from './mockDataGenerator';

// Store mock data in memory
let mockSocialLinks: SocialLink[] = MockDataGenerator.generateSocialLinks();

export const mockSocialAPI = {
  getLinks: async (): Promise<GetSocialLinksResponse> => {
    return mockApiClient.get({ links: mockSocialLinks });
  },

  addLink: async (url: string): Promise<SocialLink> => {
    // Determine platform from URL
    let platform: SocialLink['platform'] = 'other';
    if (url.includes('twitter.com')) platform = 'twitter';
    else if (url.includes('facebook.com')) platform = 'facebook';
    else if (url.includes('linkedin.com')) platform = 'linkedin';
    else if (url.includes('instagram.com')) platform = 'instagram';
    else if (url.includes('youtube.com')) platform = 'youtube';

    const newLink: SocialLink = {
      id: MockDataGenerator.generateId(),
      url,
      platform,
      addedAt: new Date().toISOString()
    };

    const addedLink = await mockApiClient.post(newLink);
    mockSocialLinks.unshift(addedLink);
    return addedLink;
  },

  removeLink: async (linkId: string): Promise<void> => {
    const index = mockSocialLinks.findIndex(link => link.id === linkId);
    if (index === -1) {
      throw new Error('Social link not found');
    }
    
    mockSocialLinks.splice(index, 1);
    return mockApiClient.delete();
  }
};
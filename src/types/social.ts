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
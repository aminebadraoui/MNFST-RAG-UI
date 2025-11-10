import { mockConfig } from './mock/mockConfig';
import { authAPI as realAuthAPI } from './authAPI';
import { chatAPI as realChatAPI } from './chatAPI';
import { documentAPI as realDocumentAPI } from './documentAPI';
import { socialAPI as realSocialAPI } from './socialAPI';
import { tenantAPI as realTenantAPI } from './tenantAPI';
import { userAPI as realUserAPI } from './userAPI';
import { mockAuthAPI } from './mock/mockAuthAPI';
import { mockChatAPI } from './mock/mockChatAPI';
import { mockDocumentAPI } from './mock/mockDocumentAPI';
import { mockSocialAPI } from './mock/mockSocialAPI';
import { mockTenantAPI } from './mock/mockTenantAPI';
import { mockUserAPI } from './mock/mockUserAPI';

interface APIs {
  authAPI: typeof mockAuthAPI | typeof realAuthAPI;
  chatAPI: typeof mockChatAPI | typeof realChatAPI;
  documentAPI: typeof mockDocumentAPI | typeof realDocumentAPI;
  socialAPI: typeof mockSocialAPI | typeof realSocialAPI;
  tenantAPI: typeof mockTenantAPI | typeof realTenantAPI;
  userAPI: typeof mockUserAPI | typeof realUserAPI;
}

export const createAPIs = (): APIs => {
  // Check if mock is globally enabled
  if (mockConfig.enabled) {
    return {
      authAPI: mockConfig.services.auth ? mockAuthAPI : realAuthAPI,
      chatAPI: mockConfig.services.chat ? mockChatAPI : realChatAPI,
      documentAPI: mockConfig.services.document ? mockDocumentAPI : realDocumentAPI,
      socialAPI: mockConfig.services.social ? mockSocialAPI : realSocialAPI,
      tenantAPI: mockConfig.services.tenant ? mockTenantAPI : realTenantAPI,
      userAPI: mockConfig.services.user ? mockUserAPI : realUserAPI
    };
  } else {
    // If mock is globally disabled, use all real APIs
    return {
      authAPI: realAuthAPI,
      chatAPI: realChatAPI,
      documentAPI: realDocumentAPI,
      socialAPI: realSocialAPI,
      tenantAPI: realTenantAPI,
      userAPI: realUserAPI
    };
  }
};

export const { authAPI, chatAPI, documentAPI, socialAPI, tenantAPI, userAPI } = createAPIs();
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
  if (mockConfig.enabled) {
    return {
      authAPI: mockAuthAPI,
      chatAPI: mockChatAPI,
      documentAPI: mockDocumentAPI,
      socialAPI: mockSocialAPI,
      tenantAPI: mockTenantAPI,
      userAPI: mockUserAPI
    };
  } else {
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
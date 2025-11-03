import { LoginRequest, LoginResponse, RefreshTokenRequest, RefreshTokenResponse, UserRole } from '../../types';
import { mockApiClient } from './mockApiClient';
import { MockDataGenerator } from './mockDataGenerator';

// Get mock credentials from environment variables
const getMockCredentials = () => ({
  superadmin: {
    email: import.meta.env.VITE_MOCK_SUPERADMIN_EMAIL || 'superadmin@ragchat.com',
    password: import.meta.env.VITE_MOCK_SUPERADMIN_PASSWORD || 'admin123'
  },
  tenant_admin: {
    email: import.meta.env.VITE_MOCK_TENANT_ADMIN_EMAIL || 'admin@tenant.com',
    password: import.meta.env.VITE_MOCK_TENANT_ADMIN_PASSWORD || 'admin123'
  },
  user: {
    email: import.meta.env.VITE_MOCK_USER_EMAIL || 'user@tenant.com',
    password: import.meta.env.VITE_MOCK_USER_PASSWORD || 'user123'
  }
});

export const mockAuthAPI = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const credentials = getMockCredentials();
    
    // Simulate validation for different roles using environment variables
    let role: UserRole;
    if (email === credentials.superadmin.email && password === credentials.superadmin.password) {
      role = 'superadmin';
    } else if (email === credentials.tenant_admin.email && password === credentials.tenant_admin.password) {
      role = 'tenant_admin';
    } else if (email === credentials.user.email && password === credentials.user.password) {
      role = 'user';
    } else {
      throw new Error('Invalid credentials');
    }

    const user = MockDataGenerator.generateUser(role);
    return mockApiClient.post({
      user,
      tokens: {
        accessToken: `mock_access_token_${Date.now()}`,
        refreshToken: `mock_refresh_token_${Date.now()}`,
        expiresIn: 3600
      }
    });
  },

  // Helper function for debug login to get credentials by role
  getCredentialsByRole: (role: UserRole) => {
    const credentials = getMockCredentials();
    return credentials[role];
  },

  refreshToken: async (refreshToken: string): Promise<RefreshTokenResponse> => {
    if (!refreshToken.startsWith('mock_refresh_token')) {
      throw new Error('Invalid refresh token');
    }

    return mockApiClient.post({
      accessToken: `mock_access_token_${Date.now()}`,
      expiresIn: 3600
    });
  },

  logout: async (): Promise<void> => {
    return mockApiClient.delete();
  }
};
import { LoginRequest, LoginResponse, RefreshTokenRequest, RefreshTokenResponse, UserRole } from '../../types';
import { mockApiClient } from './mockApiClient';
import { MockDataGenerator } from './mockDataGenerator';

export const mockAuthAPI = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    // Simulate validation for different roles
    let role: UserRole;
    if (email === 'superadmin@ragchat.com' && password === 'admin123') {
      role = 'superadmin';
    } else if (email === 'admin@tenant.com' && password === 'admin123') {
      role = 'tenant_admin';
    } else if (email === 'user@tenant.com' && password === 'user123') {
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
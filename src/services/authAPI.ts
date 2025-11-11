import { apiClient } from './apiClient';
import { LoginRequest, LoginResponse, RefreshTokenRequest, RefreshTokenResponse, User } from '../types';

// Define DataResponse interface for type safety
interface DataResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const authAPI = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await apiClient.post<DataResponse<LoginResponse>>('/auth/login', {
      email,
      password,
    });
    return response.data.data;
  },

  refreshToken: async (refreshToken: string): Promise<RefreshTokenResponse> => {
    const response = await apiClient.post<DataResponse<RefreshTokenResponse>>('/auth/refresh', {
      refresh_token: refreshToken,
    });
    return response.data.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get<DataResponse<User>>('/auth/me');
    return response.data.data;
  },
};
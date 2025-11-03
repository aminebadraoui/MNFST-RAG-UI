import { apiClient } from './apiClient';
import { User, CreateUserRequest, CreateUserResponse } from '../types';

export const userAPI = {
  // Tenant admin only
  createUser: async (data: CreateUserRequest): Promise<CreateUserResponse> => {
    const response = await apiClient.post<CreateUserResponse>('/users', data);
    return response.data;
  },

  // Tenant admin only (or superadmin for all users)
  getUsers: async (): Promise<{ data: User[] }> => {
    const response = await apiClient.get<{ data: User[] }>('/users');
    return response.data;
  },

  // Tenant admin only
  updateUser: async (userId: string, data: Partial<User>): Promise<{ data: User }> => {
    const response = await apiClient.put<{ data: User }>(`/users/${userId}`, data);
    return response.data;
  },

  // Tenant admin only
  deleteUser: async (userId: string): Promise<void> => {
    await apiClient.delete(`/users/${userId}`);
  },

  // Get current user info
  getCurrentUser: async (): Promise<{ data: User }> => {
    const response = await apiClient.get<{ data: User }>('/auth/me');
    return response.data;
  },
};
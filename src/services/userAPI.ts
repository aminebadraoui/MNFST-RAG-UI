import { apiClient } from './apiClient';
import { User, CreateUserRequest, CreateUserResponse } from '../types';

// Define DataResponse interface for type safety
interface DataResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const userAPI = {
  // Tenant admin only
  createUser: async (data: CreateUserRequest): Promise<CreateUserResponse> => {
    const response = await apiClient.post<DataResponse<CreateUserResponse>>('/users', data);
    return response.data.data;
  },

  // Tenant admin only (or superadmin for all users)
  getUsers: async (): Promise<User[]> => {
    const response = await apiClient.get<DataResponse<User[]>>('/users');
    return response.data.data;
  },

  // Tenant admin only
  updateUser: async (userId: string, data: Partial<User>): Promise<User> => {
    const response = await apiClient.put<DataResponse<User>>(`/users/${userId}`, data);
    return response.data.data;
  },

  // Tenant admin only
  deleteUser: async (userId: string): Promise<void> => {
    await apiClient.delete(`/users/${userId}`);
  },

  // Get current user info
  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get<DataResponse<User>>('/auth/me');
    return response.data.data;
  },
};
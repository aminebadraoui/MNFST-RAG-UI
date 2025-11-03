import { User, CreateUserRequest, CreateUserResponse, UserRole } from '../../types';
import { mockApiClient } from './mockApiClient';
import { MockDataGenerator } from './mockDataGenerator';

// Store mock data in memory
let mockUsers: User[] = [
  MockDataGenerator.generateUser('superadmin'),
  MockDataGenerator.generateUser('tenant_admin', 'tenant_1'),
  MockDataGenerator.generateUser('user', 'tenant_1'),
  MockDataGenerator.generateUser('user', 'tenant_1'),
  MockDataGenerator.generateUser('tenant_admin', 'tenant_2'),
  MockDataGenerator.generateUser('user', 'tenant_2'),
];

export const mockUserAPI = {
  createUser: async (data: CreateUserRequest): Promise<CreateUserResponse> => {
    // Check if email already exists
    if (mockUsers.some(u => u.email === data.email)) {
      throw new Error('User with this email already exists');
    }

    const newUser: User = {
      id: MockDataGenerator.generateId(),
      email: data.email,
      name: data.name,
      role: data.role,
      tenantId: 'current_tenant_id', // In real app, this would come from auth context
      createdAt: new Date().toISOString(),
    };

    const addedUser = await mockApiClient.post(newUser);
    mockUsers.push(addedUser);

    return {
      id: addedUser.id,
      email: addedUser.email,
      name: addedUser.name,
      role: addedUser.role,
      tenantId: addedUser.tenantId || 'current_tenant_id',
      createdAt: addedUser.createdAt || new Date().toISOString(),
    };
  },

  getUsers: async (): Promise<{ data: User[] }> => {
    // In real app, this would filter by tenant_id for tenant admins
    // and return all users for superadmin
    return mockApiClient.get({ data: mockUsers });
  },

  updateUser: async (userId: string, data: Partial<User>): Promise<{ data: User }> => {
    const index = mockUsers.findIndex(u => u.id === userId);
    if (index === -1) {
      throw new Error('User not found');
    }

    const updatedUser = { ...mockUsers[index], ...data, updatedAt: new Date().toISOString() };
    mockUsers[index] = updatedUser;

    return mockApiClient.put({ data: updatedUser });
  },

  deleteUser: async (userId: string): Promise<void> => {
    const index = mockUsers.findIndex(u => u.id === userId);
    if (index === -1) {
      throw new Error('User not found');
    }

    mockUsers.splice(index, 1);
    return mockApiClient.delete();
  },

  getCurrentUser: async (): Promise<{ data: User }> => {
    // In real app, this would get the current user from token
    // For mock, we'll return the first user
    const currentUser = mockUsers[0];
    if (!currentUser) {
      throw new Error('No current user found');
    }

    return mockApiClient.get({ data: currentUser });
  },
};
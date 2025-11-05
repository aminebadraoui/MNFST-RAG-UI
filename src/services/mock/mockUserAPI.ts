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

// Helper function to get current user from localStorage
const getCurrentUser = (): User | null => {
  try {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  } catch {
    return null;
  }
};

export const mockUserAPI = {
  createUser: async (data: CreateUserRequest): Promise<CreateUserResponse> => {
    // Check if email already exists
    if (mockUsers.some(u => u.email === data.email)) {
      throw new Error('User with this email already exists');
    }

    const currentUser = getCurrentUser();
    if (!currentUser) {
      throw new Error('No authenticated user found');
    }

    // Only superadmin and tenant_admin can create users
    if (currentUser.role !== 'superadmin' && currentUser.role !== 'tenant_admin') {
      throw new Error('Insufficient permissions to create users');
    }

    // Determine tenant ID based on current user
    let tenantId: string | undefined;
    if (currentUser.role === 'tenant_admin') {
      tenantId = currentUser.tenantId;
      // Tenant admins can only create users under their tenant
      if (data.role === 'superadmin' || (data.role === 'tenant_admin' && data.tenantId !== tenantId)) {
        throw new Error('Tenant admins can only create regular users under their tenant');
      }
    } else if (currentUser.role === 'superadmin') {
      // Superadmin can specify tenant or create system users
      tenantId = data.tenantId;
    }

    const newUser: User = {
      id: MockDataGenerator.generateId(),
      email: data.email,
      name: data.name,
      role: data.role,
      tenantId,
      createdAt: new Date().toISOString(),
    };

    const addedUser = await mockApiClient.post(newUser);
    mockUsers.push(addedUser);

    return {
      id: addedUser.id,
      email: addedUser.email,
      name: addedUser.name,
      role: addedUser.role,
      tenantId: addedUser.tenantId || 'system',
      createdAt: addedUser.createdAt || new Date().toISOString(),
    };
  },

  getUsers: async (): Promise<{ data: User[] }> => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      throw new Error('No authenticated user found');
    }

    // Only superadmin and tenant_admin can view users
    if (currentUser.role !== 'superadmin' && currentUser.role !== 'tenant_admin') {
      throw new Error('Insufficient permissions to view users');
    }

    let filteredUsers: User[];
    
    if (currentUser.role === 'superadmin') {
      // Superadmin can see all users except themselves
      filteredUsers = mockUsers.filter(user => user.email !== currentUser.email);
    } else if (currentUser.role === 'tenant_admin') {
      // Tenant admin can only see users from their tenant, excluding themselves
      filteredUsers = mockUsers.filter(user =>
        user.email !== currentUser.email && user.tenantId === currentUser.tenantId
      );
    } else {
      // Regular users shouldn't be able to access this endpoint
      filteredUsers = [];
    }

    return mockApiClient.get({ data: filteredUsers });
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
    // Get the current user from localStorage (same as the helper function)
    const currentUser = getCurrentUser();
    if (!currentUser) {
      throw new Error('No current user found');
    }

    return mockApiClient.get({ data: currentUser });
  },
};
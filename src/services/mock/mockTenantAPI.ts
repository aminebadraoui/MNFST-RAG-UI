import { Tenant, CreateTenantRequest, CreateTenantResponse } from '../../types';
import { mockApiClient } from './mockApiClient';
import { MockDataGenerator } from './mockDataGenerator';

// Store mock data in memory
let mockTenants: Tenant[] = [
  {
    id: 'tenant_1',
    name: 'Acme Corporation',
    slug: 'acme-corp',
    createdAt: new Date('2024-01-01').toISOString(),
    userCount: 5,
    documentCount: 12,
  },
  {
    id: 'tenant_2',
    name: 'Tech Startup Inc',
    slug: 'tech-startup',
    createdAt: new Date('2024-01-15').toISOString(),
    userCount: 3,
    documentCount: 8,
  },
];

export const mockTenantAPI = {
  createTenant: async (data: CreateTenantRequest): Promise<CreateTenantResponse> => {
    // Check if slug already exists
    if (mockTenants.some(t => t.slug === data.slug)) {
      throw new Error('Tenant with this slug already exists');
    }

    const newTenant: Tenant = {
      id: MockDataGenerator.generateId(),
      name: data.name,
      slug: data.slug,
      createdAt: new Date().toISOString(),
    };

    const adminUser = {
      id: MockDataGenerator.generateId(),
      email: data.adminUser.email,
      name: data.adminUser.name,
      role: 'tenant_admin' as const,
    };

    const addedTenant = await mockApiClient.post(newTenant);
    mockTenants.push(addedTenant);

    return {
      ...addedTenant,
      adminUser,
    };
  },

  getTenants: async (): Promise<Tenant[]> => {
    return mockTenants;
  },

  updateTenant: async (tenantId: string, data: Partial<Tenant>): Promise<Tenant> => {
    const index = mockTenants.findIndex(t => t.id === tenantId);
    if (index === -1) {
      throw new Error('Tenant not found');
    }

    const updatedTenant = { ...mockTenants[index], ...data, updatedAt: new Date().toISOString() };
    mockTenants[index] = updatedTenant;

    return updatedTenant;
  },

  deleteTenant: async (tenantId: string): Promise<void> => {
    const index = mockTenants.findIndex(t => t.id === tenantId);
    if (index === -1) {
      throw new Error('Tenant not found');
    }

    mockTenants.splice(index, 1);
    return mockApiClient.delete();
  },
};
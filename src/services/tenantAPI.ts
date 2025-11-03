import { apiClient } from './apiClient';
import { Tenant, CreateTenantRequest, CreateTenantResponse } from '../types';

export const tenantAPI = {
  // Superadmin only
  createTenant: async (data: CreateTenantRequest): Promise<CreateTenantResponse> => {
    const response = await apiClient.post<CreateTenantResponse>('/tenants', data);
    return response.data;
  },

  // Superadmin only
  getTenants: async (): Promise<{ data: Tenant[] }> => {
    const response = await apiClient.get<{ data: Tenant[] }>('/tenants');
    return response.data;
  },

  // Superadmin only
  updateTenant: async (tenantId: string, data: Partial<Tenant>): Promise<{ data: Tenant }> => {
    const response = await apiClient.put<{ data: Tenant }>(`/tenants/${tenantId}`, data);
    return response.data;
  },

  // Superadmin only
  deleteTenant: async (tenantId: string): Promise<void> => {
    await apiClient.delete(`/tenants/${tenantId}`);
  },
};
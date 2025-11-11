import { apiClient } from './apiClient';
import { Tenant, CreateTenantRequest, CreateTenantResponse } from '../types';

// Define DataResponse interface for type safety
interface DataResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const tenantAPI = {
  // Superadmin only
  createTenant: async (data: CreateTenantRequest): Promise<CreateTenantResponse> => {
    const response = await apiClient.post<DataResponse<CreateTenantResponse>>('/tenants', data);
    return response.data.data;
  },

  // Superadmin only
  getTenants: async (): Promise<Tenant[]> => {
    const response = await apiClient.get<DataResponse<Tenant[]>>('/tenants');
    return response.data.data;
  },

  // Superadmin only
  getTenant: async (tenantId: string): Promise<Tenant> => {
    const response = await apiClient.get<DataResponse<Tenant>>(`/tenants/${tenantId}`);
    return response.data.data;
  },

  // Superadmin only
  updateTenant: async (tenantId: string, data: Partial<Tenant>): Promise<Tenant> => {
    const response = await apiClient.put<DataResponse<Tenant>>(`/tenants/${tenantId}`, data);
    return response.data.data;
  },

  // Superadmin only
  deleteTenant: async (tenantId: string): Promise<void> => {
    await apiClient.delete(`/tenants/${tenantId}`);
  },
};
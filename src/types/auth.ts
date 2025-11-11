export type UserRole = 'superadmin' | 'tenant_admin' | 'user';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  tenantId?: string;
  createdAt?: string;
  updatedAt?: string;
  lastLogin?: string;
}

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt?: string;
  userCount?: number;
  documentCount?: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  tokens: {
    access_token: string;
    refresh_token: string;
    expires_in: number;
  };
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

export interface RefreshTokenResponse {
  access_token: string;
  expires_in: number;
}

export interface CreateTenantRequest {
  name: string;
  slug: string;
  adminUser: {
    email: string;
    password: string;
    name: string;
  };
}

export interface CreateTenantResponse {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  adminUser: {
    id: string;
    email: string;
    name: string;
    role: UserRole;
  };
}

export interface CreateUserRequest {
  email: string;
  name: string;
  password: string;
  role: UserRole;
  tenantId?: string; // Optional, only used by superadmin
}

export interface CreateUserResponse {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  tenantId: string;
  createdAt: string;
}
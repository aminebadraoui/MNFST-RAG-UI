# Multi-Tenant API Specification

Complete API specification for the MNFST-RAG multi-tenant SaaS platform, including all endpoints, request/response formats, and authentication requirements.

## 🎯 Overview

This document provides a comprehensive specification of all API endpoints available in the MNFST-RAG multi-tenant platform. The API follows RESTful principles and uses JSON for all request/response payloads.

## 📋 API Basics

### Base URL

```
Production: https://api.ragchat.com/v1
Development: http://localhost:3001/api/v1
```

### Authentication

All API requests require authentication using Bearer tokens:

```http
Authorization: Bearer <access-token>
```

#### Token Types

| Token Type | Prefix | Purpose | Validity |
|------------|--------|---------|----------|
| Superadmin | `sa_` | Platform administration | 24 hours |
| Tenant Admin | `ta_` | Tenant management | 8 hours |
| User | `u_` | Regular user access | 1 hour |

### Request Headers

```http
Content-Type: application/json
Accept: application/json
X-Client-Version: 1.0.0
X-Request-ID: <unique-request-id>
```

### Response Format

All API responses follow a consistent format:

```typescript
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    requestId: string;
    timestamp: string;
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}
```

## 🔐 Authentication Endpoints

### Superadmin Authentication

#### Login

```http
POST /auth/superadmin/login
Content-Type: application/json
```

**Request Body:**
```typescript
interface SuperadminLoginRequest {
  email: string;
  password: string;
  twoFactorCode?: string;  // Required if 2FA enabled
}
```

**Response:**
```typescript
interface SuperadminLoginResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: 'superadmin';
    permissions: string[];
  };
  tokens: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  };
}
```

#### Refresh Token

```http
POST /auth/superadmin/refresh
Content-Type: application/json
```

**Request Body:**
```typescript
interface RefreshTokenRequest {
  refreshToken: string;
}
```

### Tenant Authentication

#### Tenant Login

```http
POST /auth/tenant/login
Content-Type: application/json
```

**Request Body:**
```typescript
interface TenantLoginRequest {
  tenantSlug: string;        // Tenant identifier
  email: string;
  password: string;
  twoFactorCode?: string;
}
```

**Response:**
```typescript
interface TenantLoginResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: 'tenant_admin' | 'user';
    tenant: {
      id: string;
      name: string;
      slug: string;
    };
  };
  tokens: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  };
}
```

## 🏢 Tenant Management Endpoints

### Get All Tenants

```http
GET /tenants?page=1&limit=20&status=active&search=company
Authorization: Bearer <superadmin-token>
```

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 20, max: 100)
- `status` (string): Filter by status (`active`, `inactive`, `suspended`, `trial`)
- `search` (string): Search by name or email
- `plan` (string): Filter by plan (`starter`, `professional`, `enterprise`)

**Response:**
```typescript
interface GetTenantsResponse {
  tenants: Array<{
    id: string;
    name: string;
    slug: string;
    status: string;
    plan: string;
    createdAt: string;
    userCount: number;
    storageUsed: number;
    documentCount: number;
  }>;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
```

### Create Tenant

```http
POST /tenants
Authorization: Bearer <superadmin-token>
Content-Type: application/json
```

**Request Body:**
```typescript
interface CreateTenantRequest {
  name: string;
  slug: string;
  plan: 'starter' | 'professional' | 'enterprise';
  adminUser: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  };
  settings?: {
    branding?: {
      primaryColor?: string;
      secondaryColor?: string;
    };
    features?: {
      maxUsers?: number;
      maxDocuments?: number;
      maxStorageGB?: number;
    };
  };
  trial?: {
    enabled: boolean;
    duration: number;  // Days
  };
}
```

**Response:**
```typescript
interface CreateTenantResponse {
  tenant: {
    id: string;
    name: string;
    slug: string;
    status: 'trial' | 'active';
    plan: string;
    createdAt: string;
    trialEndsAt?: string;
  };
  adminUser: {
    id: string;
    email: string;
    name: string;
    role: 'tenant_admin';
  };
}
```

### Get Tenant Details

```http
GET /tenants/{tenantId}
Authorization: Bearer <superadmin-token>
```

**Response:**
```typescript
interface GetTenantResponse {
  tenant: {
    id: string;
    name: string;
    slug: string;
    status: string;
    plan: string;
    settings: {
      branding: {
        primaryColor: string;
        secondaryColor: string;
        logo?: string;
      };
      features: {
        maxUsers: number;
        maxDocuments: number;
        maxStorageGB: number;
        enableAPIAccess: boolean;
        enableSSO: boolean;
      };
    };
    usage: {
      users: {
        total: number;
        active: number;
      };
      storage: {
        usedGB: number;
        totalGB: number;
        percentage: number;
      };
      documents: {
        total: number;
        processed: number;
      };
    };
    billing: {
      planId: string;
      nextBillingDate: string;
      currentUsers: number;
      currentStorageGB: number;
    };
    createdAt: string;
    updatedAt: string;
  };
}
```

### Update Tenant

```http
PUT /tenants/{tenantId}
Authorization: Bearer <superadmin-token>
Content-Type: application/json
```

**Request Body:**
```typescript
interface UpdateTenantRequest {
  name?: string;
  status?: 'active' | 'inactive' | 'suspended';
  plan?: 'starter' | 'professional' | 'enterprise';
  settings?: {
    branding?: Partial<{
      primaryColor: string;
      secondaryColor: string;
      logo: string;
    }>;
    features?: Partial<{
      maxUsers: number;
      maxDocuments: number;
      maxStorageGB: number;
      enableAPIAccess: boolean;
      enableSSO: boolean;
    }>;
  };
}
```

### Delete Tenant

```http
DELETE /tenants/{tenantId}
Authorization: Bearer <superadmin-token>
```

**Query Parameters:**
- `confirm` (boolean): Must be `true` to confirm deletion
- `reason` (string): Reason for deletion

## 👥 User Management Endpoints

### Get Tenant Users

```http
GET /tenants/{tenantId}/users?page=1&limit=20&role=user&status=active
Authorization: Bearer <superadmin-token> or <tenant-admin-token>
```

**Response:**
```typescript
interface GetUsersResponse {
  users: Array<{
    id: string;
    email: string;
    name: string;
    role: 'tenant_admin' | 'user';
    status: 'active' | 'inactive' | 'suspended';
    lastLoginAt?: string;
    createdAt: string;
  }>;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
```

### Create User

```http
POST /tenants/{tenantId}/users
Authorization: Bearer <superadmin-token> or <tenant-admin-token>
Content-Type: application/json
```

**Request Body:**
```typescript
interface CreateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  role: 'tenant_admin' | 'user';
  password?: string;  // If not provided, will send invitation
  sendInvitation: boolean;
  permissions?: string[];
}
```

### Update User

```http
PUT /tenants/{tenantId}/users/{userId}
Authorization: Bearer <superadmin-token> or <tenant-admin-token>
Content-Type: application/json
```

**Request Body:**
```typescript
interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  role?: 'tenant_admin' | 'user';
  status?: 'active' | 'inactive' | 'suspended';
  permissions?: string[];
}
```

### Delete User

```http
DELETE /tenants/{tenantId}/users/{userId}
Authorization: Bearer <superadmin-token> or <tenant-admin-token>
```

## 📄 Document Management Endpoints

### Get Documents

```http
GET /tenants/{tenantId}/documents?page=1&limit=20&status=processed
Authorization: Bearer <superadmin-token> or <tenant-admin-token> or <user-token>
```

**Query Parameters:**
- `status` (string): Filter by status (`uploading`, `processing`, `processed`, `error`)
- `type` (string): Filter by document type
- `search` (string): Search by filename or content

**Response:**
```typescript
interface GetDocumentsResponse {
  documents: Array<{
    id: string;
    filename: string;
    type: string;
    size: number;
    status: string;
    uploadedBy: string;
    uploadedAt: string;
    processedAt?: string;
    error?: string;
  }>;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
```

### Upload Document

```http
POST /tenants/{tenantId}/documents
Authorization: Bearer <superadmin-token> or <tenant-admin-token> or <user-token>
Content-Type: multipart/form-data
```

**Form Data:**
- `file` (file): Document file
- `metadata` (string): JSON string with metadata

**Metadata Format:**
```typescript
interface DocumentMetadata {
  title?: string;
  description?: string;
  tags?: string[];
  category?: string;
}
```

**Response:**
```typescript
interface UploadDocumentResponse {
  document: {
    id: string;
    filename: string;
    type: string;
    size: number;
    status: 'uploading';
    uploadedBy: string;
    uploadedAt: string;
  };
}
```

### Get Document Details

```http
GET /tenants/{tenantId}/documents/{documentId}
Authorization: Bearer <superadmin-token> or <tenant-admin-token> or <user-token>
```

### Delete Document

```http
DELETE /tenants/{tenantId}/documents/{documentId}
Authorization: Bearer <superadmin-token> or <tenant-admin-token> or <user-token>
```

## 💬 Chat Endpoints

### Create Chat Session

```http
POST /tenants/{tenantId}/chat/sessions
Authorization: Bearer <superadmin-token> or <tenant-admin-token> or <user-token>
Content-Type: application/json
```

**Request Body:**
```typescript
interface CreateChatSessionRequest {
  title?: string;
  documentIds?: string[];  // Optional: specific documents to chat with
}
```

**Response:**
```typescript
interface CreateChatSessionResponse {
  session: {
    id: string;
    title: string;
    createdAt: string;
    userId: string;
  };
}
```

### Send Message

```http
POST /tenants/{tenantId}/chat/sessions/{sessionId}/messages
Authorization: Bearer <superadmin-token> or <tenant-admin-token> or <user-token>
Content-Type: application/json
```

**Request Body:**
```typescript
interface SendMessageRequest {
  message: string;
  context?: {
    documentIds?: string[];
    searchQuery?: string;
  };
}
```

**Response:**
```typescript
interface SendMessageResponse {
  message: {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
  };
  sources?: Array<{
    documentId: string;
    filename: string;
    relevanceScore: number;
    snippet: string;
  }>;
}
```

### Get Chat History

```http
GET /tenants/{tenantId}/chat/sessions/{sessionId}/messages?page=1&limit=50
Authorization: Bearer <superadmin-token> or <tenant-admin-token> or <user-token>
```

## 📊 Analytics Endpoints

### Get Tenant Analytics

```http
GET /tenants/{tenantId}/analytics?period=30d&metrics=usage,engagement
Authorization: Bearer <superadmin-token> or <tenant-admin-token>
```

**Query Parameters:**
- `period` (string): Time period (`7d`, `30d`, `90d`, `1y`)
- `metrics` (string): Comma-separated metrics (`usage`, `engagement`, `financial`)

**Response:**
```typescript
interface GetAnalyticsResponse {
  period: string;
  usage: {
    users: {
      total: number;
      active: number;
      new: number;
    };
    storage: {
      usedGB: number;
      growth: number;
    };
    documents: {
      total: number;
      uploaded: number;
      processed: number;
    };
    sessions: {
      total: number;
      averageDuration: number;
      messages: number;
    };
  };
  engagement: {
    loginFrequency: number;
    featureUsage: Record<string, number>;
    retentionRate: number;
  };
}
```

### Get Platform Analytics (Superadmin Only)

```http
GET /analytics/platform?period=30d
Authorization: Bearer <superadmin-token>
```

## 🔧 Configuration Endpoints

### Get Tenant Configuration

```http
GET /tenants/{tenantId}/configuration
Authorization: Bearer <superadmin-token> or <tenant-admin-token>
```

### Update Tenant Configuration

```http
PUT /tenants/{tenantId}/configuration
Authorization: Bearer <superadmin-token> or <tenant-admin-token>
Content-Type: application/json
```

**Request Body:**
```typescript
interface UpdateConfigurationRequest {
  branding?: {
    primaryColor?: string;
    secondaryColor?: string;
    logo?: string;
    customCSS?: string;
  };
  features?: {
    enableAPIAccess?: boolean;
    enableSSO?: boolean;
    enableCustomDomain?: boolean;
  };
  security?: {
    require2FA?: boolean;
    sessionTimeout?: number;
    ipWhitelist?: string[];
  };
  notifications?: {
    emailNotifications?: boolean;
    webhookUrl?: string;
  };
}
```

## 🚦 Health Check Endpoints

### System Health

```http
GET /health
```

**Response:**
```typescript
interface HealthCheckResponse {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  version: string;
  services: {
    database: 'healthy' | 'unhealthy';
    redis: 'healthy' | 'unhealthy';
    storage: 'healthy' | 'unhealthy';
    ai: 'healthy' | 'unhealthy';
  };
  metrics: {
    uptime: number;
    responseTime: number;
    errorRate: number;
  };
}
```

### Tenant Health

```http
GET /tenants/{tenantId}/health
Authorization: Bearer <superadmin-token> or <tenant-admin-token>
```

## 🔄 Webhook Endpoints

### Configure Webhook

```http
POST /tenants/{tenantId}/webhooks
Authorization: Bearer <superadmin-token> or <tenant-admin-token>
Content-Type: application/json
```

**Request Body:**
```typescript
interface ConfigureWebhookRequest {
  url: string;
  events: string[];  // Events to subscribe to
  secret: string;    // Webhook secret for verification
  active: boolean;
}
```

### Webhook Events

| Event | Description | Payload |
|-------|-------------|---------|
| `user.created` | New user created | User object |
| `user.deleted` | User deleted | User ID |
| `document.uploaded` | Document uploaded | Document object |
| `document.processed` | Document processing completed | Document object |
| `tenant.suspended` | Tenant suspended | Tenant object |
| `usage.alert` | Usage threshold exceeded | Alert details |

## 📝 Error Codes

### Authentication Errors

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `AUTH_001` | 401 | Invalid credentials |
| `AUTH_002` | 401 | Token expired |
| `AUTH_003` | 401 | Invalid token |
| `AUTH_004` | 403 | Insufficient permissions |
| `AUTH_005` | 403 | Account suspended |

### Tenant Errors

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `TENANT_001` | 404 | Tenant not found |
| `TENANT_002` | 409 | Tenant slug already exists |
| `TENANT_003` | 400 | Invalid tenant status |
| `TENANT_004` | 403 | Tenant access denied |
| `TENANT_005` | 429 | Tenant rate limit exceeded |

### User Errors

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `USER_001` | 404 | User not found |
| `USER_002` | 409 | User email already exists |
| `USER_003` | 400 | Invalid user role |
| `USER_004` | 403 | User access denied |
| `USER_005` | 429 | User rate limit exceeded |

### Document Errors

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `DOC_001` | 404 | Document not found |
| `DOC_002` | 400 | Invalid file type |
| `DOC_003` | 413 | File too large |
| `DOC_004` | 409 | Document already exists |
| `DOC_005` | 500 | Document processing failed |

### System Errors

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `SYS_001` | 500 | Internal server error |
| `SYS_002` | 503 | Service unavailable |
| `SYS_003` | 429 | Rate limit exceeded |
| `SYS_004` | 400 | Invalid request format |
| `SYS_005` | 413 | Request too large |

## 🚀 Rate Limiting

### Rate Limit Rules

| Endpoint Type | Limit | Window |
|---------------|-------|--------|
| Authentication | 5 requests | 1 minute |
| Document Upload | 10 requests | 1 minute |
| Chat Messages | 100 requests | 1 minute |
| API Calls | 1000 requests | 1 hour |
| Admin Endpoints | 100 requests | 1 minute |

### Rate Limit Headers

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

## 📚 SDK Examples

### JavaScript/TypeScript SDK

```typescript
import { RAGChatClient } from '@ragchat/client-sdk';

const client = new RAGChatClient({
  baseURL: 'https://api.ragchat.com/v1',
  apiKey: 'your-api-key'
});

// Create tenant
const tenant = await client.tenants.create({
  name: 'Acme Corp',
  slug: 'acme-corp',
  plan: 'professional',
  adminUser: {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@acme.com',
    password: 'secure-password'
  }
});

// Upload document
const document = await client.documents.upload(tenant.id, file, {
  title: 'Company Handbook',
  tags: ['hr', 'policy']
});

// Send chat message
const response = await client.chat.sendMessage(tenant.id, sessionId, {
  message: 'What is our vacation policy?'
});
```

### Python SDK

```python
from ragchat_client import RAGChatClient

client = RAGChatClient(
    base_url='https://api.ragchat.com/v1',
    api_key='your-api-key'
)

# Create tenant
tenant = client.tenants.create({
    'name': 'Acme Corp',
    'slug': 'acme-corp',
    'plan': 'professional',
    'admin_user': {
        'first_name': 'John',
        'last_name': 'Doe',
        'email': 'john@acme.com',
        'password': 'secure-password'
    }
})

# Upload document
with open('handbook.pdf', 'rb') as f:
    document = client.documents.upload(
        tenant.id, 
        f, 
        metadata={
            'title': 'Company Handbook',
            'tags': ['hr', 'policy']
        }
    )

# Send chat message
response = client.chat.send_message(
    tenant.id,
    session_id,
    message='What is our vacation policy?'
)
```

---

**Related Documentation**:
- [Database Schema](./database-schema.md) - Data structure reference
- [Authentication System](./authentication-authorization-system.md) - Authentication details
- [Client Management System](./client-management-system.md) - Client management guide
- [Deployment Architecture](./deployment-architecture-recommendations.md) - Deployment guidelines
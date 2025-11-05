# Backend Contract for MNFST-RAG Application

This document defines the complete contract that the backend must implement to ensure compatibility with the MNFST-RAG frontend client.

## Table of Contents

1. [Overview](#overview)
2. [Architecture Requirements](#architecture-requirements)
3. [Authentication & Authorization](#authentication--authorization)
4. [Data Models](#data-models)
5. [Database Schema](#database-schema)
6. [API Endpoints](#api-endpoints)
7. [Response Formats](#response-formats)
8. [Error Handling](#error-handling)
9. [Streaming Requirements](#streaming-requirements)
10. [File Upload Requirements](#file-upload-requirements)
11. [Role-Based Access Control](#role-based-access-control)
12. [Security Requirements](#security-requirements)
13. [Performance Requirements](#performance-requirements)

## Overview

The MNFST-RAG application is a multi-tenant, role-based system that provides:
- Multi-tenant architecture with three-tier user roles
- Document management and processing for RAG (Retrieval-Augmented Generation)
- Real-time chat functionality with streaming responses
- Social media link management
- User and tenant management

### Base URL Configuration

```
Development: http://localhost:3001/api/v1  # Default for Node.js/Express
Development: http://localhost:8000/api/v1  # Default for FastAPI/Python
Production: https://yourdomain.com/api/v1
```

### API Versioning

All endpoints must be versioned using URL paths:
```
/api/v1/...
```

## Architecture Requirements

### Multi-Tenancy

The backend must implement strict tenant isolation:
- Data must be isolated at the database level (Row Level Security preferred)
- All queries must be scoped to the tenant context
- Cross-tenant data access must be prevented

### Technology Stack Compatibility

The backend must be compatible with:
- Frontend: React with TypeScript
- API Client: Axios with interceptors
- Authentication: JWT tokens (access + refresh)
- File Uploads: Multipart/form-data
- Streaming: Server-Sent Events (SSE)

## Authentication & Authorization

### JWT Token Structure

#### Access Token Payload
```typescript
interface AccessTokenPayload {
  sub: string;          // User ID
  role: 'superadmin' | 'tenant_admin' | 'user';
  tenantId?: string;    // Tenant ID (null for superadmin)
  email: string;
  name: string;
  iat: number;         // Issued at
  exp: number;         // Expires at (15 minutes)
  iss: string;         // Issuer
  aud: string;         // Audience
}
```

#### Refresh Token Payload
```typescript
interface RefreshTokenPayload {
  sub: string;          // User ID
  tenantId?: string;    // Tenant ID (null for superadmin)
  iat: number;         // Issued at
  exp: number;         // Expires at (7 days)
}
```

### Authentication Flow

1. User submits credentials to `/auth/login`
2. Backend validates credentials and returns JWT tokens
3. Frontend stores tokens and includes access token in Authorization header
4. Access token expires after 15 minutes
5. Frontend automatically refreshes using refresh token
6. Refresh token expires after 7 days

### Required Headers

All authenticated requests must include:
```http
Authorization: Bearer <access-token>
Content-Type: application/json
```

## Data Models

### API Response Models

These models represent the data structure exposed to the frontend client:

#### User Model
```typescript
interface User {
  id: string;           // UUID
  email: string;        // Unique across all tenants
  name: string;
  role: 'superadmin' | 'tenant_admin' | 'user';
  tenantId?: string;    // Null for superadmin
  createdAt: string;    // ISO 8601
  updatedAt?: string;   // ISO 8601
  lastLogin?: string;   // ISO 8601
}
```

#### Tenant Model
```typescript
interface Tenant {
  id: string;           // UUID
  name: string;
  slug: string;         // URL-safe identifier
  createdAt: string;    // ISO 8601
  updatedAt?: string;   // ISO 8601
  userCount?: number;   // Computed
  documentCount?: number; // Computed
}
```

#### Document Model
```typescript
interface Document {
  id: string;                    // UUID
  filename: string;              // Stored filename
  originalName: string;          // Original upload filename
  size: number;                  // Bytes
  mimeType: string;              // MIME type
  status: 'uploaded' | 'processing' | 'processed' | 'error';
  uploadedAt: string;            // ISO 8601
  processedAt?: string;          // ISO 8601
  error?: string;                // Error message if status is 'error'
}
```

#### Social Link Model
```typescript
interface SocialLink {
  id: string;                    // UUID
  url: string;
  platform: 'twitter' | 'facebook' | 'linkedin' | 'instagram' | 'youtube' | 'other';
  addedAt: string;               // ISO 8601
}
```

#### Chat Session Model
```typescript
interface Session {
  id: string;           // UUID
  title: string;
  createdAt: string;    // ISO 8601
  updatedAt: string;    // ISO 8601
}
```

#### Chat Message Model
```typescript
interface Message {
  id: string;           // UUID
  content: string;
  role: 'user' | 'assistant';
  timestamp: string;    // ISO 8601
}
```

## Database Schema

The following database schema must be implemented to support the API models above. These tables represent the actual database structure that will store the data.

**Note:** RAG processing and vector storage should be handled by a separate vector database service (e.g., Pinecone, Weaviate, ChromaDB). The main relational database only needs to track document processing status and metadata, while the actual vector embeddings and chunks are managed by the specialized vector database service.

### Users Table
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('superadmin', 'tenant_admin', 'user')),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE
);

-- Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_tenant_id ON users(tenant_id);
CREATE INDEX idx_users_role ON users(role);
```

### Tenants Table
```sql
CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_tenants_slug ON tenants(slug);
```

### Documents Table
```sql
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    filename VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    size BIGINT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'uploaded' CHECK (status IN ('uploaded', 'processing', 'processed', 'error')),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    uploaded_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processed_at TIMESTAMP WITH TIME ZONE,
    error TEXT,
    
    CONSTRAINT documents_tenant_user_check CHECK (
        (SELECT role FROM users WHERE id = uploaded_by) IN ('tenant_admin', 'superadmin')
    )
);

-- Indexes
CREATE INDEX idx_documents_tenant_id ON documents(tenant_id);
CREATE INDEX idx_documents_status ON documents(status);
CREATE INDEX idx_documents_uploaded_by ON documents(uploaded_by);
```

### Social Links Table
```sql
CREATE TABLE social_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    url TEXT NOT NULL,
    platform VARCHAR(50) NOT NULL CHECK (platform IN ('twitter', 'facebook', 'linkedin', 'instagram', 'youtube', 'other')),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    added_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT social_links_tenant_user_check CHECK (
        (SELECT role FROM users WHERE id = added_by) IN ('tenant_admin', 'superadmin')
    )
);

-- Indexes
CREATE INDEX idx_social_links_tenant_id ON social_links(tenant_id);
CREATE INDEX idx_social_links_platform ON social_links(platform);
```

### Chat Sessions Table
```sql
CREATE TABLE chat_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_chat_sessions_user_id ON chat_sessions(user_id);
CREATE INDEX idx_chat_sessions_tenant_id ON chat_sessions(tenant_id);
CREATE INDEX idx_chat_sessions_created_at ON chat_sessions(created_at);
```

### Chat Messages Table
```sql
CREATE TABLE chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant')),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT chat_messages_session_role_check CHECK (
        -- Users can only send user messages
        -- System generates assistant messages
        (role = 'user' AND session_id IN (
            SELECT id FROM chat_sessions WHERE user_id = current_setting('app.current_user_id')::UUID
        )) OR role = 'assistant'
    )
);

-- Indexes
CREATE INDEX idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX idx_chat_messages_timestamp ON chat_messages(timestamp);
CREATE INDEX idx_chat_messages_role ON chat_messages(role);
```

### Refresh Tokens Table
```sql
CREATE TABLE refresh_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    token_hash VARCHAR(255) UNIQUE NOT NULL, -- Hashed token for security
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_revoked BOOLEAN DEFAULT FALSE,
    last_used_at TIMESTAMP WITH TIME ZONE
);

-- Indexes
CREATE INDEX idx_refresh_tokens_token_hash ON refresh_tokens(token_hash);
CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_expires_at ON refresh_tokens(expires_at);
```

### Row Level Security (RLS) Policies

```sql
-- Enable RLS on all tenant-scoped tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Users can only see users in their tenant (except superadmin)
CREATE POLICY users_tenant_policy ON users
    FOR ALL TO authenticated_user
    USING (
        current_setting('app.current_user_role') = 'superadmin' OR
        tenant_id = current_setting('app.current_tenant_id')::UUID
    );

-- Documents are scoped to tenant
CREATE POLICY documents_tenant_policy ON documents
    FOR ALL TO authenticated_user
    USING (tenant_id = current_setting('app.current_tenant_id')::UUID);

-- Social links are scoped to tenant
CREATE POLICY social_links_tenant_policy ON social_links
    FOR ALL TO authenticated_user
    USING (tenant_id = current_setting('app.current_tenant_id')::UUID);

-- Chat sessions are scoped to user and tenant
CREATE POLICY chat_sessions_user_policy ON chat_sessions
    FOR ALL TO authenticated_user
    USING (
        user_id = current_setting('app.current_user_id')::UUID AND
        tenant_id = current_setting('app.current_tenant_id')::UUID
    );

-- Chat messages are scoped through sessions
CREATE POLICY chat_messages_user_policy ON chat_messages
    FOR ALL TO authenticated_user
    USING (
        session_id IN (
            SELECT id FROM chat_sessions
            WHERE user_id = current_setting('app.current_user_id')::UUID
            AND tenant_id = current_setting('app.current_tenant_id')::UUID
        )
    );

```

### Database Functions and Triggers

```sql
-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tenants_updated_at BEFORE UPDATE ON tenants
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chat_sessions_updated_at BEFORE UPDATE ON chat_sessions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

```

## API Endpoints

### Authentication Endpoints

#### POST /api/v1/auth/login
Authenticates user and returns JWT tokens.

**Request:**
```typescript
{
  email: string;
  password: string;
}
```

**Response:**
```typescript
{
  success: true;
  data: {
    user: User;
    tokens: {
      accessToken: string;
      refreshToken: string;
      expiresIn: number;  // Seconds until expiry
    };
  };
}
```

#### POST /api/v1/auth/refresh
Refreshes access token using refresh token.

**Request:**
```typescript
{
  refreshToken: string;
}
```

**Response:**
```typescript
{
  success: true;
  data: {
    accessToken: string;
    expiresIn: number;  // Seconds until expiry
  };
}
```

#### POST /api/v1/auth/logout
Invalidates tokens (requires authentication).

**Response:**
```typescript
{
  success: true;
  message: string;
}
```

#### GET /api/v1/auth/me
Returns current user information (requires authentication).

**Response:**
```typescript
{
  success: true;
  data: User;
}
```

### Tenant Management Endpoints (Superadmin Only)

#### POST /api/v1/tenants
Creates a new tenant with admin user.

**Request:**
```typescript
{
  name: string;
  slug: string;
  adminUser: {
    email: string;
    password: string;
    name: string;
  };
}
```

**Response:**
```typescript
{
  success: true;
  data: {
    id: string;
    name: string;
    slug: string;
    createdAt: string;
    adminUser: {
      id: string;
      email: string;
      name: string;
      role: 'tenant_admin';
    };
  };
}
```

#### GET /api/v1/tenants
Returns all tenants (superadmin only).

**Response:**
```typescript
{
  success: true;
  data: Tenant[];
}
```

#### PUT /api/v1/tenants/{tenantId}
Updates tenant information (superadmin only).

**Request:**
```typescript
{
  name?: string;
  slug?: string;
}
```

**Response:**
```typescript
{
  success: true;
  data: Tenant;
}
```

#### DELETE /api/v1/tenants/{tenantId}
Deletes a tenant (superadmin only).

**Response:**
```typescript
{
  success: true;
  message: string;
}
```

### User Management Endpoints

#### POST /api/v1/users
Creates a new user (tenant admin only).

**Request:**
```typescript
{
  email: string;
  name: string;
  password: string;
  role: 'tenant_admin' | 'user';
}
```

**Response:**
```typescript
{
  success: true;
  data: {
    id: string;
    email: string;
    name: string;
    role: 'tenant_admin' | 'user';
    tenantId: string;
    createdAt: string;
  };
}
```

#### GET /api/v1/users
Returns users for current tenant (tenant admin only).

**Response:**
```typescript
{
  success: true;
  data: User[];
}
```

#### PUT /api/v1/users/{userId}
Updates user information (tenant admin only).

**Request:**
```typescript
{
  name?: string;
  role?: 'tenant_admin' | 'user';
}
```

**Response:**
```typescript
{
  success: true;
  data: User;
}
```

#### DELETE /api/v1/users/{userId}
Deletes a user (tenant admin only).

**Response:**
```typescript
{
  success: true;
  message: string;
}
```

### Document Management Endpoints (Tenant Admin Only)

#### GET /api/v1/documents
Returns all documents for the tenant.

**Response:**
```typescript
{
  success: true;
  data: Document[];
}
```

#### POST /api/v1/documents/upload
Uploads a single document.

**Request:** `multipart/form-data`
- `file`: Binary file data

**Response:**
```typescript
{
  success: true;
  data: Document;
}
```

#### POST /api/v1/documents/upload-multiple
Uploads multiple documents.

**Request:** `multipart/form-data`
- `files`: Array of binary file data

**Response:**
```typescript
{
  success: true;
  data: {
    uploadId: string;
    documents: Document[];
  };
}
```

#### GET /api/v1/documents/upload/{uploadId}/status
Returns upload status for multiple document upload.

**Response:**
```typescript
{
  success: true;
  data: {
    uploadId: string;
    status: 'processing' | 'completed' | 'error';
    documents: {
      id: string;
      filename: string;
      status: 'uploaded' | 'processing' | 'processed' | 'error';
      progress: number;  // 0-100
      processedAt?: string;
      error?: string;
    }[];
  };
}
```

#### DELETE /api/v1/documents/{documentId}
Deletes a document.

**Response:**
```typescript
{
  success: true;
  message: string;
}
```

### Social Media Management Endpoints (Tenant Admin Only)

#### GET /api/v1/social-links
Returns all social links for the tenant.

**Response:**
```typescript
{
  success: true;
  data: SocialLink[];
}
```

#### POST /api/v1/social-links
Adds a new social link.

**Request:**
```typescript
{
  url: string;
}
```

**Response:**
```typescript
{
  success: true;
  data: SocialLink;
}
```

#### DELETE /api/v1/social-links/{linkId}
Deletes a social link.

**Response:**
```typescript
{
  success: true;
  message: string;
}
```

### Chat Functionality Endpoints (All Authenticated Users)

#### GET /api/v1/sessions
Returns all chat sessions for the user.

**Response:**
```typescript
{
  success: true;
  data: Session[];
}
```

#### POST /api/v1/sessions
Creates a new chat session.

**Request:**
```typescript
{
  title: string;
}
```

**Response:**
```typescript
{
  success: true;
  data: Session;
}
```

#### GET /api/v1/sessions/{sessionId}/messages
Returns all messages in a session.

**Response:**
```typescript
{
  success: true;
  data: Message[];
}
```

#### POST /api/v1/sessions/{sessionId}/messages
Sends a message to a session.

**Request:**
```typescript
{
  content: string;
  role: 'user';
}
```

**Response:**
```typescript
{
  success: true;
  data: Message;
}
```

#### POST /api/v1/sessions/{sessionId}/messages/stream
Sends a message with streaming response.

**Request:**
```typescript
{
  content: string;
  role: 'user';
}
```

**Response:** Server-Sent Events stream
```
data: {"type": "start", "messageId": "msg_123"}
data: {"type": "token", "content": "Quantum computing "}
data: {"type": "token", "content": "is a revolutionary "}
data: {"type": "token", "content": "approach to processing "}
data: {"type": "end", "messageId": "msg_123"}
```

#### DELETE /api/v1/sessions/{sessionId}
Deletes a chat session.

**Response:**
```typescript
{
  success: true;
  message: string;
}
```

## Response Formats

### Success Response Format
```typescript
{
  success: true;
  data?: any;  // Response data
  message?: string;  // Optional success message
  meta?: {
    timestamp: string;  // ISO 8601
    requestId: string;  // Unique request identifier
  };
}
```

### Error Response Format
```typescript
{
  success: false;
  error: {
    code: string;        // Machine-readable error code
    message: string;    // Human-readable error message
    details?: string;    // Additional error details
  };
  meta?: {
    timestamp: string;  // ISO 8601
    requestId: string;  // Unique request identifier
  };
}
```

## Error Handling

### HTTP Status Codes

#### Success Codes
- `200 OK` - Request successful
- `201 Created` - Resource created successfully
- `204 No Content` - Request successful, no content returned

#### Client Error Codes
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Authentication required or failed
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `422 Unprocessable Entity` - Validation error

#### Server Error Codes
- `500 Internal Server Error` - Server error

### Error Codes

| Code | Description | HTTP Status |
|------|-------------|-------------|
| `VALIDATION_ERROR` | Input validation failed | 422 |
| `AUTHENTICATION_FAILED` | Invalid credentials | 401 |
| `TOKEN_EXPIRED` | JWT token expired | 401 |
| `INSUFFICIENT_PERMISSIONS` | User lacks permission | 403 |
| `RESOURCE_NOT_FOUND` | Resource doesn't exist | 404 |
| `TENANT_NOT_FOUND` | Tenant doesn't exist | 404 |
| `USER_NOT_FOUND` | User doesn't exist | 404 |
| `DOCUMENT_NOT_FOUND` | Document doesn't exist | 404 |
| `SESSION_NOT_FOUND` | Chat session doesn't exist | 404 |
| `FILE_TOO_LARGE` | Uploaded file exceeds size limit | 422 |
| `UNSUPPORTED_FILE_TYPE` | File type not supported | 422 |
| `UPLOAD_FAILED` | File upload processing failed | 500 |
| `RAG_PROCESSING_ERROR` | RAG processing failed | 500 |
| `INTERNAL_ERROR` | Server error | 500 |

## Streaming Requirements

### Server-Sent Events (SSE) Format

The chat streaming endpoint must implement Server-Sent Events with the following format:

#### Event Types
1. `start` - Indicates the beginning of a response
2. `token` - Contains a chunk of the response content
3. `end` - Indicates the completion of the response
4. `error` - Indicates an error occurred during streaming

#### Event Structure
```typescript
// Start event
{
  type: 'start';
  messageId: string;  // UUID for the message
}

// Token event
{
  type: 'token';
  content: string;    // Chunk of response content
}

// End event
{
  type: 'end';
  messageId: string;  // Same UUID as start event
}

// Error event
{
  type: 'error';
  messageId: string;
  error: string;      // Error message
}
```

#### Implementation Requirements
- Use `text/event-stream` content type
- Send events in the order: start → multiple tokens → end
- Include proper SSE formatting: `data: {json}\n\n`
- Handle connection drops gracefully
- Implement timeout handling (recommended: 30 seconds)

## File Upload Requirements

### Supported File Types
- PDF documents (application/pdf)
- Microsoft Word documents (application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document)
- Plain text files (text/plain)
- Markdown files (text/markdown)

### File Size Limits
- Maximum file size: 50MB per file
- Maximum total size per upload: 500MB

### Upload Processing Flow
1. File uploaded with status 'uploaded'
2. Backend processes file for RAG indexing
3. Status updates to 'processing'
4. Final status: 'processed' or 'error'

### File Storage Requirements
- Store original files with secure access controls
- Generate unique filenames to prevent collisions
- Implement proper cleanup for failed uploads
- Store file metadata in database

### Document Processing Requirements
- Extract text content from documents
- Split content into chunks for RAG
- Generate embeddings for semantic search
- Store in vector database for retrieval

## Role-Based Access Control

### User Roles and Access Rights

The system uses three roles with the following access rights:

#### Superadmin
- Can create, view, update, and delete all tenants
- Can view all users across all tenants
- Has system-wide administrative access

#### Tenant Admin
- Can create, view, update, and delete users within their tenant
- Can upload, view, and delete documents within their tenant
- Can add, view, and delete social media links for their tenant
- Can access chat interface (but not view other users' chats)
- Limited to operations within their tenant only

#### User
- Can create and view their own chat sessions and messages
- Can only access documents and social links for their tenant (read-only)
- Limited to chat functionality only

### Role Enforcement

All endpoints must enforce role-based access:
1. Extract user role from JWT token
2. Verify user has required role for the operation
3. For tenant-specific operations, verify tenant context matches user's tenant
4. Return 403 Forbidden for insufficient role access

### Tenant Isolation

The backend must implement strict tenant data isolation:
1. Extract tenantId from JWT token (null for superadmin)
2. Set database context for all queries
3. Implement Row Level Security (RLS) where possible
4. Validate tenant access for all operations

## Security Requirements

### Authentication Security
- Use bcrypt with minimum 12 salt rounds for password hashing
- Implement secure password reset flow
- Store refresh tokens securely (httpOnly cookies recommended)
- Implement token blacklisting for logout

### API Security
- Enforce HTTPS in production
- Implement CORS with appropriate origins
- Add rate limiting (recommended: 100 requests/minute per IP)
- Validate all input data
- Use parameterized queries to prevent SQL injection
- Implement request size limits

### File Upload Security
- Validate file types and content
- Scan uploaded files for malware
- Store files outside web root
- Implement secure file access controls
- Generate unique filenames to prevent directory traversal

### Data Protection
- Encrypt sensitive data at rest
- Use environment variables for secrets
- Implement audit logging for sensitive operations
- Follow GDPR/CCPA compliance for user data

## Performance Requirements

### Response Time Requirements
- API endpoints: < 500ms (95th percentile)
- File upload processing: < 30 seconds
- Chat response generation: < 10 seconds
- Database queries: < 100ms (average)

### Scalability Requirements
- Support 100+ concurrent users per tenant
- Handle 10,000+ documents per tenant
- Process file uploads of 50MB+ without timeout
- Support streaming to 1000+ concurrent chat sessions

## Implementation Checklist

### Core Functionality
- [ ] Multi-tenant database design with RLS
- [ ] JWT authentication with refresh tokens
- [ ] Role-based access control system
- [ ] File upload and processing pipeline
- [ ] RAG integration with vector database
- [ ] Real-time chat with streaming responses

### Security Implementation
- [ ] Password hashing with bcrypt
- [ ] Input validation and sanitization
- [ ] CORS configuration
- [ ] Rate limiting
- [ ] Secure file handling
- [ ] HTTPS enforcement

### API Implementation
- [ ] All endpoints documented above
- [ ] Consistent error handling
- [ ] Proper HTTP status codes
- [ ] Request/response validation
- [ ] API versioning

### Performance & Scalability
- [ ] Database indexing strategy
- [ ] Connection pooling
- [ ] Async processing for file uploads
- [ ] Load testing

### Logging
- [ ] Structured logging
- [ ] Error tracking
- [ ] Health checks

This contract serves as the definitive specification for backend implementation. Any deviations from this contract may result in frontend compatibility issues.
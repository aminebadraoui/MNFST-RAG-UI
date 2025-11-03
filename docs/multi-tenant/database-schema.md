# Database Schema & Types

Complete guide to the RAG Chat database structure, TypeScript type definitions, and data relationships for the simplified multi-tenant system using PostgreSQL.

## 🗄️ Database Overview

The simplified multi-tenant database uses PostgreSQL with Row Level Security (RLS) to ensure complete data isolation between tenants while maintaining a shared database infrastructure.

### Design Principles

1. **Tenant Isolation**: Every tenant-specific table includes `tenant_id` for data separation
2. **Row Level Security**: PostgreSQL RLS policies enforce tenant data access
3. **Three-Role System**: Simple user roles (superadmin, tenant_admin, user)
4. **Simplified Schema**: Removed complex audit, rate limiting, and advanced security tables
5. **Backend Agnostic**: Compatible with any backend framework (FastAPI, Node.js, etc.)

## 📊 Database Schema

### Entity Relationship Diagram

```mermaid
erDiagram
    tenants ||--o{ users : "has"
    tenants ||--o{ chat_sessions : "belongs to"
    tenants ||--o{ documents : "owns"
    tenants ||--o{ social_links : "manages"
    users ||--o{ chat_sessions : "creates"
    chat_sessions ||--o{ messages : "contains"
    
    tenants {
        uuid id PK
        string name
        string slug
        timestamp created_at
        timestamp updated_at
    }
    
    users {
        uuid id PK
        uuid tenant_id FK
        string email
        string password_hash
        string name
        enum role
        timestamp created_at
        timestamp updated_at
    }
    
    chat_sessions {
        uuid id PK
        uuid tenant_id FK
        uuid user_id FK
        string title
        timestamp created_at
        timestamp updated_at
    }
    
    messages {
        uuid id PK
        uuid tenant_id FK
        uuid session_id FK
        text content
        enum role
        timestamp created_at
    }
    
    documents {
        uuid id PK
        uuid tenant_id FK
        string filename
        string original_name
        bigint file_size
        string file_type
        string storage_path
        enum status
        timestamp created_at
        timestamp updated_at
    }
    
    social_links {
        uuid id PK
        uuid tenant_id FK
        string url
        string platform
        timestamp created_at
    }
```

### Core Tables

#### Tenants Table

```sql
CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster lookups
CREATE INDEX idx_tenants_slug ON tenants(slug);
```

**Purpose**: Stores tenant information for multi-tenant architecture
**Key Fields**:
- `id`: Unique tenant identifier
- `name`: Human-readable tenant name
- `slug`: URL-friendly tenant identifier

#### Users Table

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE, -- null for superadmin
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    role VARCHAR(20) NOT NULL CHECK (role IN ('superadmin', 'tenant_admin', 'user')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(tenant_id, email) -- Ensure unique email within tenant
);

-- Indexes for faster lookups
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_tenant_role ON users(tenant_id, role);
```

**Purpose**: Stores user accounts with role-based permissions
**Key Fields**:
- `tenant_id`: Links user to tenant (null for superadmin)
- `role`: User role (superadmin, tenant_admin, user)
- `email`: User email address (unique within tenant)

#### Chat Sessions Table

```sql
CREATE TABLE chat_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_sessions_tenant_user ON chat_sessions(tenant_id, user_id);
CREATE INDEX idx_sessions_updated_at ON chat_sessions(updated_at DESC);
```

**Purpose**: Tracks chat conversations with tenant isolation
**Key Fields**:
- `tenant_id`: Links session to tenant
- `user_id`: Links session to user
- `title`: Human-readable session title

#### Messages Table

```sql
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    session_id UUID NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_messages_session_created ON messages(session_id, created_at);
CREATE INDEX idx_messages_tenant_session ON messages(tenant_id, session_id);
```

**Purpose**: Stores individual chat messages with role distinction
**Key Fields**:
- `tenant_id`: Links message to tenant
- `session_id`: Links message to chat session
- `role`: Message role (user or assistant)

#### Documents Table

```sql
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    filename VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    size BIGINT NOT NULL,                    -- Matches TypeScript 'size' field
    mime_type VARCHAR(100) NOT NULL,           -- Matches TypeScript 'mimeType' field
    storage_path VARCHAR(500) NOT NULL,
    status VARCHAR(20) DEFAULT 'uploaded' CHECK (status IN ('uploaded', 'processing', 'processed', 'error')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_documents_tenant_status ON documents(tenant_id, status);
CREATE INDEX idx_documents_tenant_created ON documents(tenant_id, created_at DESC);
```

**Purpose**: Manages document uploads with processing status
**Key Fields**:
- `tenant_id`: Links document to tenant
- `status`: Processing status (uploaded, processing, processed, error)
- `storage_path`: File location in storage system

#### Social Links Table

```sql
CREATE TABLE social_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    url VARCHAR(500) NOT NULL,
    platform VARCHAR(50) NOT NULL,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()  -- Matches TypeScript 'addedAt' field
);

-- Indexes for performance
CREATE INDEX idx_social_links_tenant ON social_links(tenant_id);
```

**Purpose**: Stores social media links for tenant knowledge base
**Key Fields**:
- `tenant_id`: Links social link to tenant
- `platform`: Social media platform (twitter, github, etc.)
- `url`: Social media profile URL

## 🔒 Row Level Security

### Enable RLS on Tenant-Specific Tables

```sql
-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;
```

### RLS Policies

```sql
-- Users can only see users from their tenant (except superadmin)
CREATE POLICY tenant_isolation_users ON users
    FOR ALL TO authenticated
    USING (
        tenant_id = current_setting('app.current_tenant_id')::uuid 
        OR current_setting('app.user_role') = 'superadmin'
    );

-- Chat sessions isolation
CREATE POLICY tenant_isolation_sessions ON chat_sessions
    FOR ALL TO authenticated
    USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

-- Messages isolation
CREATE POLICY tenant_isolation_messages ON messages
    FOR ALL TO authenticated
    USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

-- Documents isolation
CREATE POLICY tenant_isolation_documents ON documents
    FOR ALL TO authenticated
    USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

-- Social links isolation
CREATE POLICY tenant_isolation_social_links ON social_links
    FOR ALL TO authenticated
    USING (tenant_id = current_setting('app.current_tenant_id')::uuid);
```

## 🔧 Database Functions

### Context Setting Functions

```sql
-- Function to set tenant context
CREATE OR REPLACE FUNCTION set_tenant_context(user_uuid UUID)
RETURNS void AS $$
DECLARE
    user_tenant_id UUID;
    user_role VARCHAR(20);
BEGIN
    -- Get user's tenant and role
    SELECT tenant_id, role INTO user_tenant_id, user_role
    FROM users
    WHERE id = user_uuid;
    
    -- Set context variables
    PERFORM set_config('app.current_tenant_id', user_tenant_id::text, true);
    PERFORM set_config('app.user_role', user_role, true);
    PERFORM set_config('app.current_user_id', user_uuid::text, true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### Automated Timestamp Functions

```sql
-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for automatic timestamp updates
CREATE TRIGGER update_tenants_updated_at
    BEFORE UPDATE ON tenants
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sessions_updated_at
    BEFORE UPDATE ON chat_sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_documents_updated_at
    BEFORE UPDATE ON documents
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

## 📝 TypeScript Type Definitions

### Core Types

#### User Types

```typescript
// User role enumeration
export type UserRole = 'superadmin' | 'tenant_admin' | 'user';

// Base user interface
export interface User {
  id: string;
  tenantId?: string; // null for superadmin
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

// Authentication response
export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

// JWT tokens
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

// JWT payloads
export interface AccessTokenPayload {
  sub: string;          // User ID
  role: UserRole;
  tenantId?: string;    // Tenant ID (null for superadmin)
  email: string;
  name: string;
  iat: number;         // Issued at
  exp: number;         // Expires at
  iss: string;         // Issuer
  aud: string;         // Audience
}

export interface RefreshTokenPayload {
  sub: string;          // User ID
  tenantId?: string;    // Tenant ID (null for superadmin)
  iat: number;         // Issued at
  exp: number;         // Expires at (7 days)
}
```

#### Tenant Types

```typescript
// Tenant interface
export interface Tenant {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

// Tenant creation request
export interface CreateTenantRequest {
  name: string;
  slug: string;
  adminUser: {
    email: string;
    password: string;
    name: string;
  };
}

// Tenant with statistics
export interface TenantWithStats extends Tenant {
  userCount: number;
  documentCount: number;
  sessionCount: number;
}
```

#### Chat Types

```typescript
// Chat session interface
export interface Session {
  id: string;
  tenantId: string;
  userId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

// Message role enumeration
export type MessageRole = 'user' | 'assistant';

// Message interface
export interface Message {
  id: string;
  tenantId: string;
  sessionId: string;
  content: string;
  role: MessageRole;
  timestamp: string;       // Matches implementation (not createdAt)
}

// Create session request
export interface CreateSessionRequest {
  title: string;
}

// Send message request
export interface SendMessageRequest {
  content: string;
  role: MessageRole;
}

// Streaming response types
export interface StreamStart {
  type: 'start';
  messageId: string;
}

export interface StreamToken {
  type: 'token';
  content: string;
}

export interface StreamEnd {
  type: 'end';
  messageId: string;
}

export type StreamResponse = StreamStart | StreamToken | StreamEnd;
```

#### Document Types

```typescript
// Document status enumeration
export type DocumentStatus = 'uploaded' | 'processing' | 'processed' | 'error';

// Document interface
export interface Document {
  id: string;
  tenantId: string;
  filename: string;
  originalName: string;
  size: number;           // Matches implementation (not fileSize)
  mimeType: string;        // Matches implementation (not fileType)
  status: DocumentStatus;
  uploadedAt: string;       // Matches implementation (not createdAt)
  processedAt?: string;
  error?: string;           // Matches implementation
}

// Upload progress
export interface UploadProgress {
  id: string;
  filename: string;
  progress: number;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  error?: string;
}

// Multiple upload response
export interface MultipleUploadResponse {
  uploadId: string;
  documents: Document[];
}
```

#### Social Media Types

```typescript
// Social media platform enumeration
export type SocialPlatform = 'twitter' | 'github' | 'linkedin' | 'facebook' | 'instagram' | 'youtube';

// Social link interface
export interface SocialLink {
  id: string;
  tenantId: string;
  url: string;
  platform: SocialPlatform;
  addedAt: string;
}

// Create social link request
export interface CreateSocialLinkRequest {
  url: string;
}
```

### API Types

#### Request/Response Types

```typescript
// API response wrapper
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ApiError;
  meta?: {
    timestamp: string;
    requestId: string;
  };
}

// API error interface
export interface ApiError {
  code: string;
  message: string;
  details?: string;
}

// Pagination types
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
```

#### Configuration Types

```typescript
// Application settings
export interface AppSettings {
  apiUrl: string;
  appName: string;
  version: string;
  enableAnalytics: boolean;
  enableErrorReporting: boolean;
  enablePerformanceMonitoring: boolean;
}

// Mock API configuration
export interface MockApiConfig {
  enabled: boolean;
  delayMin: number;
  delayMax: number;
  errorRate: number;
  dataSeed: number;
  realisticData: boolean;
  consistentData: boolean;
}
```

## 🔄 Database Migration Strategy

### Initial Setup

```sql
-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create tables in order
-- 1. tenants (no dependencies)
-- 2. users (depends on tenants)
-- 3. chat_sessions (depends on tenants, users)
-- 4. messages (depends on chat_sessions)
-- 5. documents (depends on tenants)
-- 6. social_links (depends on tenants)
```

### Data Migration

#### From Complex to Simple Schema

```sql
-- Migrate users with role simplification
INSERT INTO users (id, tenant_id, email, password_hash, name, role, created_at, updated_at)
SELECT 
    id,
    tenant_id,
    email,
    password_hash,
    name,
    CASE 
        WHEN type = 'tenant_admin' THEN 'tenant_admin'
        WHEN type = 'client_user' THEN 'user'
        WHEN type = 'api_key' THEN 'user' -- Convert API key users to regular users
        ELSE 'user'
    END,
    created_at,
    updated_at
FROM old_users;

-- Migrate chat sessions
INSERT INTO chat_sessions (id, tenant_id, user_id, title, created_at, updated_at)
SELECT 
    id,
    tenant_id,
    user_id,
    title,
    created_at,
    updated_at
FROM old_chat_sessions;

-- Migrate messages
INSERT INTO messages (id, tenant_id, session_id, content, role, created_at)
SELECT 
    id,
    tenant_id,
    session_id,
    content,
    role,
    created_at
FROM old_messages;
```

### Version Control

```sql
-- Migration version table
CREATE TABLE IF NOT EXISTS schema_migrations (
    version VARCHAR(255) PRIMARY KEY,
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Example migration
INSERT INTO schema_migrations (version) VALUES ('001_initial_schema');
INSERT INTO schema_migrations (version) VALUES ('002_add_rls_policies');
INSERT INTO schema_migrations (version) VALUES ('003_add_indexes');
```

## 🗃️ Database Optimization

### Indexing Strategy

```sql
-- Performance indexes
CREATE INDEX CONCURRENTLY idx_users_email_tenant ON users(email, tenant_id);
CREATE INDEX CONCURRENTLY idx_sessions_tenant_updated ON chat_sessions(tenant_id, updated_at DESC);
CREATE INDEX CONCURRENTLY idx_messages_session_created ON messages(session_id, created_at);
CREATE INDEX CONCURRENTLY idx_documents_tenant_status ON documents(tenant_id, status);
CREATE INDEX CONCURRENTLY idx_social_links_tenant_platform ON social_links(tenant_id, platform);

-- Full-text search for messages
CREATE INDEX CONCURRENTLY idx_messages_content_fts ON messages USING gin(to_tsvector('english', content));
```

### Query Optimization

```sql
-- Efficient tenant data queries
EXPLAIN (ANALYZE, BUFFERS) 
SELECT u.*, COUNT(cs.id) as session_count
FROM users u
LEFT JOIN chat_sessions cs ON u.id = cs.user_id
WHERE u.tenant_id = $1
GROUP BY u.id
ORDER BY u.created_at DESC
LIMIT $2 OFFSET $3;

-- Optimized message retrieval
SELECT m.*
FROM messages m
WHERE m.session_id = $1
ORDER BY m.created_at ASC
LIMIT 50;
```

### Connection Pooling

#### Node.js/PostgreSQL
```javascript
// Database connection configuration
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  max: 20, // Maximum number of connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
```

#### Python/asyncpg (FastAPI)
```python
# Database connection configuration
import asyncpg

DATABASE_URL = "postgresql://user:password@host:port/database"

async def create_db_pool():
    return await asyncpg.create_pool(
        DATABASE_URL,
        min_size=5,
        max_size=20,
        command_timeout=60
    )
```

#### Python/SQLAlchemy (FastAPI/Django)
```python
# Database connection configuration
from sqlalchemy import create_engine
from sqlalchemy.pool import QueuePool

engine = create_engine(
    DATABASE_URL,
    poolclass=QueuePool,
    pool_size=10,
    max_overflow=20,
    pool_pre_ping=True,
    pool_recycle=3600
)
```

## 📊 File Storage Integration

### Local Storage Setup

For local file storage, create directories and configure permissions:

```bash
# Create storage directories
mkdir -p /var/www/storage/documents
mkdir -p /var/www/storage/avatars
chmod 755 /var/www/storage
```

### Cloud Storage Integration

For cloud storage (AWS S3, Google Cloud Storage, etc.), configure your backend to:

1. **Handle file uploads** with proper authentication
2. **Store file metadata** in the documents table
3. **Implement access controls** based on tenant isolation
4. **Generate presigned URLs** for secure file access

### Storage Metadata Table

```sql
-- Optional: Enhanced storage metadata
CREATE TABLE storage_metadata (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    storage_path VARCHAR(500) NOT NULL,
    storage_type VARCHAR(50) NOT NULL, -- 'local', 's3', 'gcs', etc.
    file_size BIGINT NOT NULL,
    mime_type VARCHAR(100),
    checksum VARCHAR(64),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE storage_metadata ENABLE ROW LEVEL SECURITY;

-- RLS policy
CREATE POLICY tenant_isolation_storage_metadata ON storage_metadata
    FOR ALL TO authenticated
    USING (tenant_id = current_setting('app.current_tenant_id')::uuid);
```

### Real-time Updates

For real-time functionality, implement using:

1. **WebSockets** in your backend
2. **Server-Sent Events** for streaming updates
3. **Polling** as a fallback option

Example WebSocket implementation in your backend:
```python
# FastAPI WebSocket example
@app.websocket("/ws/{tenant_id}")
async def websocket_endpoint(websocket: WebSocket, tenant_id: str):
    await websocket.accept()
    # Verify tenant access
    # Handle real-time updates
```

## 🔍 Data Validation

### Check Constraints

```sql
-- Email validation
ALTER TABLE users ADD CONSTRAINT valid_email 
    CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- URL validation for social links
ALTER TABLE social_links ADD CONSTRAINT valid_url 
    CHECK (url ~* '^https?://[^\s/$.?#].[^\s]+$');

-- File size validation
ALTER TABLE documents ADD CONSTRAINT valid_file_size 
    CHECK (file_size > 0 AND file_size <= 52428800); -- 50MB max
```

### Trigger-based Validation

```sql
-- Function to validate tenant slug
CREATE OR REPLACE FUNCTION validate_tenant_slug()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.slug ~* '[^a-z0-9-]' THEN
        RAISE EXCEPTION 'Tenant slug can only contain lowercase letters, numbers, and hyphens';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for tenant validation
CREATE TRIGGER validate_tenant_slug_trigger
    BEFORE INSERT OR UPDATE ON tenants
    FOR EACH ROW
    EXECUTE FUNCTION validate_tenant_slug();
```

## 📈 Performance Monitoring

### Query Performance

```sql
-- Slow query monitoring
SELECT 
    query,
    calls,
    total_time,
    mean_time,
    rows
FROM pg_stat_statements
WHERE mean_time > 100 -- queries taking more than 100ms
ORDER BY mean_time DESC
LIMIT 10;

-- Table size monitoring
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### Index Usage

```sql
-- Index effectiveness
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_scan,
    idx_tup_read,
    idx_tup_fetch
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY idx_scan DESC;
```

## 🛠️ Development Tools

### Database Seeding

```sql
-- Create default superadmin user
INSERT INTO users (id, email, password_hash, name, role)
VALUES (
    gen_random_uuid(),
    'admin@ragchat.com',
    '$2b$10$rOzJqQjQjQjQjQjQjQjOzJqQjQjQjQjQjQjQjQjQjQjQjQjQjQjQjQ',
    'Super Admin',
    'superadmin'
);

-- Create sample tenant
INSERT INTO tenants (id, name, slug)
VALUES (
    gen_random_uuid(),
    'Demo Company',
    'demo-company'
);

-- Create sample tenant admin
INSERT INTO users (id, tenant_id, email, password_hash, name, role)
SELECT 
    gen_random_uuid(),
    t.id,
    'admin@demo.com',
    '$2b$10$rOzJqQjQjQjQjQjQjQjOzJqQjQjQjQjQjQjQjQjQjQjQjQjQjQjQ',
    'Demo Admin',
    'tenant_admin'
FROM tenants t
WHERE t.slug = 'demo-company';
```

### Testing Data

```sql
-- Generate test chat sessions
INSERT INTO chat_sessions (id, tenant_id, user_id, title)
SELECT 
    gen_random_uuid(),
    t.id,
    u.id,
    'Test Session ' || generate_series(1, 10)
FROM tenants t
CROSS JOIN users u
WHERE t.slug = 'demo-company' AND u.role = 'user';

-- Generate test messages
INSERT INTO messages (id, tenant_id, session_id, content, role, created_at)
SELECT 
    gen_random_uuid(),
    cs.tenant_id,
    cs.id,
    CASE WHEN mod(row_number, 2) = 0 THEN 'User message ' || row_number ELSE 'Assistant response ' || row_number END,
    CASE WHEN mod(row_number, 2) = 0 THEN 'user' ELSE 'assistant' END,
    NOW() - (row_number || ' minutes')::interval
FROM chat_sessions cs
CROSS JOIN generate_series(1, 20) AS row_number
WHERE cs.title LIKE 'Test Session%';
```

---

**Related Documentation**:
- [Architecture Guide](./ARCHITECTURE.md) - System architecture and design
- [API Reference](./API.md) - Complete API documentation
- [Development Guide](./DEVELOPMENT.md) - Development setup and patterns
- [Deployment Guide](./DEPLOYMENT.md) - Deployment instructions
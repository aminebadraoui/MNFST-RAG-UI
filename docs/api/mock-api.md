# Mock API Documentation

Complete guide to the mock API system used for development and testing of the MNFST-RAG Admin Dashboard.

## 🎯 Overview

The mock API system provides a realistic development experience without requiring a backend implementation. It simulates network delays, error conditions, and maintains consistent in-memory data across requests.

## 🔧 Configuration

### Environment Variables

Enable and configure the mock API using these environment variables:

```env
# Enable mock API (set to 'false' to use real API)
VITE_USE_MOCK_API=true

# Network simulation (in milliseconds)
VITE_MOCK_DELAY_MIN=500
VITE_MOCK_DELAY_MAX=2000

# Error simulation (0.0 to 1.0)
VITE_MOCK_ERROR_RATE=0.1
```

### Configuration Object

```typescript
interface MockConfig {
  enabled: boolean;
  delay: {
    min: number;
    max: number;
  };
  errorRate: number; // Probability of simulated errors
}
```

## 🔐 Mock Authentication

### Default Credentials

The mock API provides these default credentials for testing:

#### Superadmin
- **Email**: `superadmin@ragchat.com`
- **Password**: `admin123`
- **Role**: `superadmin`
- **Tenant**: None (system-wide access)

#### Tenant Admin
- **Email**: `admin@tenant.com`
- **Password**: `admin123`
- **Role**: `tenant_admin`
- **Tenant**: `demo-tenant`

#### Regular User
- **Email**: `user@tenant.com`
- **Password**: `user123`
- **Role**: `user`
- **Tenant**: `demo-tenant`

### JWT Token Structure

The mock API generates JWT tokens with this structure:

#### Access Token
```json
{
  "sub": "user-uuid",
  "role": "tenant_admin",
  "tenantId": "tenant-uuid",
  "email": "admin@tenant.com",
  "name": "Demo Admin",
  "iat": 1640995200,
  "exp": 1640995800,
  "iss": "rag-chat-mock",
  "aud": "rag-chat-frontend"
}
```

#### Refresh Token
```json
{
  "sub": "user-uuid",
  "tenantId": "tenant-uuid",
  "iat": 1640995200,
  "exp": 1641600000
}
```

## 📄 Document Management Mock API

### Get Documents

```http
GET /documents
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "documents": [
      {
        "id": "doc-uuid-1",
        "filename": "uuid_filename.pdf",
        "originalName": "research-paper.pdf",
        "size": 2048576,
        "mimeType": "application/pdf",
        "status": "processed",
        "uploadedAt": "2024-01-01T10:00:00Z",
        "processedAt": "2024-01-01T10:05:00Z"
      }
    ]
  }
}
```

### Upload Document

```http
POST /documents/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

file: <binary-data>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "doc-uuid-2",
    "filename": "uuid_document.pdf",
    "originalName": "my-document.pdf",
    "size": 1024000,
    "mimeType": "application/pdf",
    "status": "uploaded",
    "uploadedAt": "2024-01-01T11:00:00Z"
  }
}
```

### Upload Multiple Documents

```http
POST /documents/upload-multiple
Authorization: Bearer <token>
Content-Type: multipart/form-data

files: [<binary-data-1>, <binary-data-2>]
```

**Response:**
```json
{
  "success": true,
  "data": {
    "uploadId": "upload-uuid",
    "documents": [
      {
        "id": "doc-uuid-3",
        "filename": "uuid_file1.pdf",
        "originalName": "file1.pdf",
        "status": "uploaded"
      },
      {
        "id": "doc-uuid-4",
        "filename": "uuid_file2.pdf",
        "originalName": "file2.pdf",
        "status": "uploaded"
      }
    ]
  }
}
```

### Get Upload Status

```http
GET /documents/upload/{uploadId}/status
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "uploadId": "upload-uuid",
    "status": "processing",
    "documents": [
      {
        "id": "doc-uuid-3",
        "filename": "uuid_file1.pdf",
        "status": "processing",
        "progress": 50
      },
      {
        "id": "doc-uuid-4",
        "filename": "uuid_file2.pdf",
        "status": "uploaded",
        "progress": 100
      }
    ]
  }
}
```

### Delete Document

```http
DELETE /documents/{documentId}
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Document deleted successfully"
}
```

## 🔗 Social Media Mock API

### Get Social Links

```http
GET /social-links
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "links": [
      {
        "id": "social-uuid-1",
        "url": "https://twitter.com/example",
        "platform": "twitter",
        "addedAt": "2024-01-01T09:00:00Z"
      }
    ]
  }
}
```

### Add Social Link

```http
POST /social-links
Authorization: Bearer <token>
Content-Type: application/json

{
  "url": "https://github.com/example"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "social-uuid-2",
    "url": "https://github.com/example",
    "platform": "github",
    "addedAt": "2024-01-01T11:00:00Z"
  }
}
```

### Delete Social Link

```http
DELETE /social-links/{linkId}
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Social link deleted successfully"
}
```

## 💬 Chat Mock API

### Get Chat Sessions

```http
GET /sessions
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "session-uuid-1",
      "title": "Getting Started with RAG",
      "createdAt": "2024-01-01T10:00:00Z",
      "updatedAt": "2024-01-01T10:30:00Z"
    }
  ]
}
```

### Create Chat Session

```http
POST /sessions
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "New Chat Session"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "session-uuid-2",
    "title": "New Chat Session",
    "createdAt": "2024-01-01T11:00:00Z",
    "updatedAt": "2024-01-01T11:00:00Z"
  }
}
```

### Get Chat Messages

```http
GET /sessions/{sessionId}/messages
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "msg-uuid-1",
      "content": "What is RAG?",
      "role": "user",
      "timestamp": "2024-01-01T11:00:00Z"
    },
    {
      "id": "msg-uuid-2",
      "content": "RAG stands for Retrieval-Augmented Generation...",
      "role": "assistant",
      "timestamp": "2024-01-01T11:00:05Z"
    }
  ]
}
```

### Send Message

```http
POST /sessions/{sessionId}/messages
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "What is RAG?",
  "role": "user"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "msg-uuid-3",
    "sessionId": "session-uuid-1",
    "content": "What is RAG?",
    "role": "user",
    "timestamp": "2024-01-01T11:00:00Z"
  }
}
```

### Send Message (Streaming)

```http
POST /sessions/{sessionId}/messages/stream
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "Explain quantum computing",
  "role": "user"
}
```

**Streaming Response:**
```
data: {"type": "start", "messageId": "msg-uuid-4"}
data: {"type": "token", "content": "Quantum computing "}
data: {"type": "token", "content": "is a revolutionary "}
data: {"type": "token", "content": "approach to processing "}
data: {"type": "end", "messageId": "msg-uuid-4"}
```

## 🏢 Tenant Management Mock API

### Get All Tenants (Superadmin Only)

```http
GET /tenants
Authorization: Bearer <superadmin-token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "tenant-uuid-1",
      "name": "Demo Company",
      "slug": "demo-company",
      "createdAt": "2024-01-01T10:00:00Z",
      "userCount": 5,
      "documentCount": 12
    }
  ]
}
```

### Create Tenant (Superadmin Only)

```http
POST /tenants
Authorization: Bearer <superadmin-token>
Content-Type: application/json

{
  "name": "Acme Corporation",
  "slug": "acme-corp",
  "adminUser": {
    "email": "admin@acme.com",
    "password": "securePassword123",
    "name": "John Admin"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "tenant-uuid-2",
    "name": "Acme Corporation",
    "slug": "acme-corp",
    "createdAt": "2024-01-01T10:00:00Z",
    "adminUser": {
      "id": "user-uuid-2",
      "email": "admin@acme.com",
      "name": "John Admin",
      "role": "tenant_admin"
    }
  }
}
```

## 👥 User Management Mock API

### Get Users (Tenant Admin Only)

```http
GET /users
Authorization: Bearer <tenant-admin-token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "user-uuid-1",
      "email": "user@company.com",
      "name": "Jane User",
      "role": "user",
      "tenantId": "tenant-uuid-1",
      "createdAt": "2024-01-01T10:00:00Z",
      "lastLogin": "2024-01-01T09:30:00Z"
    }
  ]
}
```

### Create User (Tenant Admin Only)

```http
POST /users
Authorization: Bearer <tenant-admin-token>
Content-Type: application/json

{
  "email": "user@company.com",
  "name": "Jane User",
  "password": "userPassword123",
  "role": "user"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user-uuid-3",
    "email": "user@company.com",
    "name": "Jane User",
    "role": "user",
    "tenantId": "tenant-uuid-1",
    "createdAt": "2024-01-01T10:00:00Z"
  }
}
```

## 🔧 Mock API Implementation

### Mock API Client

The mock API client provides these core features:

```typescript
class MockApiClient {
  // Configuration
  private config: MockConfig;
  
  // Core HTTP methods
  async get<T>(data: T, customDelay?: number): Promise<T>
  async post<T>(data: T, customDelay?: number): Promise<T>
  async put<T>(data: T, customDelay?: number): Promise<T>
  async delete(customDelay?: number): Promise<void>
  
  // Specialized methods
  async upload<T>(
    data: T, 
    onProgress?: (progress: number) => void,
    customDelay?: number
  ): Promise<T>
  
  async uploadMultiple<T>(
    data: T,
    fileCount: number,
    onProgress?: (progress: { fileId: string; progress: number }[]) => void,
    customDelay?: number
  ): Promise<T>
  
  createStreamResponse(
    chunks: string[],
    onChunk?: (chunk: string) => void,
    chunkDelay?: number
  ): ReadableStream
}
```

### Data Generation

The mock API includes a data generator for realistic test data:

```typescript
class MockDataGenerator {
  static generateId(): string
  static generateDocuments(): Document[]
  static generateSocialLinks(): SocialLink[]
  static generateUsers(): User[]
  static generateTenants(): Tenant[]
  static generateSessions(): ChatSession[]
  static generateMessages(): Message[]
}
```

## 🚨 Error Simulation

The mock API can simulate various error conditions:

### Random Errors
Based on the `errorRate` configuration, the API will randomly return errors:

```json
{
  "success": false,
  "error": {
    "code": "SIMULATED_ERROR",
    "message": "Simulated API error for testing"
  }
}
```

### Specific Error Scenarios
- **Authentication failures** for invalid credentials
- **Authorization errors** for insufficient permissions
- **Not found errors** for missing resources
- **Validation errors** for invalid input data

## 🧪 Testing with Mock API

### Unit Testing
```typescript
import { mockDocumentAPI } from '../services/mock/mockDocumentAPI';

describe('Document API', () => {
  it('should upload document', async () => {
    const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });
    const result = await mockDocumentAPI.uploadDocument(file);
    
    expect(result.filename).toContain('test.pdf');
    expect(result.status).toBe('uploaded');
  });
});
```

### Integration Testing
```typescript
import { createAPIs } from '../services/apiServiceFactory';

// Enable mock mode
process.env.VITE_USE_MOCK_API = 'true';

const apis = createAPIs();
const documents = await apis.documentAPI.getDocuments();

expect(documents.documents).toHaveLength(greaterThan(0));
```

## 🔍 Debugging Mock API

### Enable Debug Mode
```env
VITE_DEBUG_MODE=true
```

### Console Logging
The mock API logs detailed information about:
- Request/response data
- Simulated delays
- Error conditions
- Data state changes

### Data Persistence
Mock data is stored in memory during the session:
- Persists across API calls
- Reset on page refresh
- Can be inspected in browser dev tools

## 📝 Best Practices

### Development Workflow
1. **Start with mock API** for frontend development
2. **Test edge cases** using error simulation
3. **Validate UI states** with various data conditions
4. **Switch to real API** for integration testing

### Test Coverage
- Test success scenarios
- Test error conditions
- Test loading states
- Test data validation

### Performance Considerations
- Mock API includes realistic delays
- Test with different delay configurations
- Verify UI handles slow responses gracefully

---

**Related Documentation**:
- [API Overview](./overview.md) - Complete API reference
- [Development Guide](../getting-started/development-setup.md) - Development setup
- [Architecture Guide](../architecture/system-architecture.md) - System architecture
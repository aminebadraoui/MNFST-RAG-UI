# OpenAPI Specification for MNFST-RAG Frontend

This folder contains the complete OpenAPI 3.0.3 specification that any backend should respect to communicate with this MNFST-RAG frontend.

## Structure

This specification is organized into modular files for better maintainability:

- `openapi.yaml` - Main index file that references all other files
- `components/` - Reusable components (schemas, parameters, responses)
  - `schemas.yaml` - All data models and schemas
  - `parameters.yaml` - Reusable parameters
  - `responses.yaml` - Common response structures
  - `security.yaml` - Security schemes and requirements
- `paths/` - API endpoints organized by feature
  - `auth.yaml` - Authentication endpoints
  - `tenants.yaml` - Tenant management endpoints
  - `users.yaml` - User management endpoints
  - `documents.yaml` - Document management endpoints
  - `social.yaml` - Social media endpoints
  - `chat.yaml` - Chat functionality endpoints

## API Overview

The MNFST-RAG application is a multi-tenant, role-based system with the following key features:

### Multi-Tenancy
- Three-tier user roles: superadmin, tenant_admin, user
- Strict tenant data isolation
- Row-level security for all tenant-scoped data

### Core Features
- JWT-based authentication with refresh tokens
- Document management with RAG processing
- Real-time chat with streaming responses
- Social media link management
- User and tenant administration

### Base URLs
- Development: `http://localhost:3001/api/v1` (Node.js/Express)
- Development: `http://localhost:8000/api/v1` (FastAPI/Python)
- Production: `https://yourdomain.com/api/v1`

## Authentication

The API uses JWT tokens with the following structure:

### Access Token Payload
```json
{
  "sub": "user-id",
  "role": "tenant_admin",
  "tenantId": "tenant-id",
  "email": "user@example.com",
  "name": "John Doe",
  "iat": 1640995200,
  "exp": 1640995800,
  "iss": "rag-chat",
  "aud": "rag-chat-frontend"
}
```

### Token Expiration
- Access Token: 15 minutes
- Refresh Token: 7 days

## Role-Based Access Control

### Superadmin
- Create, view, update, delete all tenants
- View all users across all tenants
- System-wide administrative access

### Tenant Admin
- Manage users within their tenant
- Upload and manage documents
- Manage social media links
- Access chat interface

### User
- Create and view their own chat sessions
- Read-only access to tenant documents and social links
- Chat functionality only

## Data Models

### Core Entities
- **User**: System users with roles and tenant associations
- **Tenant**: Multi-tenant organizations
- **Document**: Uploaded files with RAG processing status
- **SocialLink**: Social media links for tenants
- **Session**: Chat sessions for users
- **Message**: Chat messages within sessions

### Response Format

All API responses follow a consistent format:

#### Success Response
```json
{
  "success": true,
  "data": { /* response data */ },
  "meta": {
    "timestamp": "2024-01-01T00:00:00Z",
    "requestId": "req_123"
  }
}
```

#### Error Response
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": "Additional error details"
  },
  "meta": {
    "timestamp": "2024-01-01T00:00:00Z",
    "requestId": "req_123"
  }
}
```

## Special Features

### File Upload
- Supported formats: PDF, Word, Plain Text, Markdown
- Maximum file size: 50MB per file
- Multiple file upload support
- Progress tracking and status updates

### Streaming Chat
- Server-Sent Events (SSE) for real-time responses
- Token-by-token streaming for better UX
- Error handling and connection management

### Error Handling
- Comprehensive error codes
- Detailed error messages
- Consistent HTTP status codes
- Request tracking with request IDs

## Implementation Requirements

### Security
- HTTPS in production
- CORS configuration
- Rate limiting (100 requests/minute per IP)
- Input validation and sanitization
- SQL injection prevention
- File upload security

### Performance
- API endpoints: < 500ms (95th percentile)
- File upload processing: < 30 seconds
- Chat response generation: < 10 seconds
- Database queries: < 100ms (average)

### Scalability
- Support 100+ concurrent users per tenant
- Handle 10,000+ documents per tenant
- Process 50MB+ file uploads
- Support 1000+ concurrent chat streams

## Usage

1. **For Backend Developers**: Use this specification to implement a compatible backend
2. **For Frontend Developers**: Reference this for understanding API contracts
3. **For Testing**: Use the specification to generate mock servers and test cases
4. **For Documentation**: Generate API documentation from these specifications

## Validation

The OpenAPI specification can be validated using:
- Swagger Editor: https://editor.swagger.io/
- OpenAPI Generator: https://github.com/OpenAPITools/openapi-generator
- Redoc: https://github.com/Redocly/redoc

## Files Description

### Main Files
- `openapi.yaml` - Root specification file with references to all modules

### Component Files
- `components/schemas.yaml` - All data models (User, Tenant, Document, etc.)
- `components/parameters.yaml` - Path parameters, query parameters, headers
- `components/responses.yaml` - Standardized response structures
- `components/security.yaml` - JWT authentication schemes

### Path Files
- `paths/auth.yaml` - Login, refresh, logout, current user endpoints
- `paths/tenants.yaml` - Tenant CRUD operations (superadmin only)
- `paths/users.yaml` - User CRUD operations (tenant admin)
- `paths/documents.yaml` - Document upload, status, delete operations
- `paths/social.yaml` - Social media link management
- `paths/chat.yaml` - Chat sessions, messages, and streaming

This specification ensures complete compatibility between any backend implementation and the MNFST-RAG frontend.
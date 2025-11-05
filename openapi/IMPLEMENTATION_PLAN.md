# OpenAPI Implementation Plan

This document outlines the complete structure and content for the OpenAPI specification files to be created.

## File Structure

```
openapi/
├── openapi.yaml                 # Main index file
├── components/
│   ├── schemas.yaml            # All data models
│   ├── parameters.yaml         # Reusable parameters
│   ├── responses.yaml          # Common response structures
│   └── security.yaml          # Security schemes
├── paths/
│   ├── auth.yaml              # Authentication endpoints
│   ├── tenants.yaml           # Tenant management
│   ├── users.yaml             # User management
│   ├── documents.yaml         # Document management
│   ├── social.yaml            # Social media links
│   └── chat.yaml             # Chat functionality
├── README.md                 # This file
└── IMPLEMENTATION_PLAN.md     # Current file
```

## Main Index File (openapi.yaml)

```yaml
openapi: 3.0.3
info:
  title: RAG Chat API
  description: Multi-tenant RAG Chat application API with role-based access control
  version: 1.0.0
  contact:
    name: RAG Chat Team
    email: support@ragchat.com
  license:
    name: MIT
    url: https://opensource.org/licenses/MIT

servers:
  - url: http://localhost:3001/api/v1
    description: Development server (Node.js/Express)
  - url: http://localhost:8000/api/v1
    description: Development server (FastAPI/Python)
  - url: https://yourdomain.com/api/v1
    description: Production server

tags:
  - name: Authentication
    description: Authentication and token management
  - name: Tenants
    description: Tenant management (superadmin only)
  - name: Users
    description: User management (tenant admin)
  - name: Documents
    description: Document management and RAG processing
  - name: Social
    description: Social media link management
  - name: Chat
    description: Chat functionality and messaging

paths:
  /auth/login:
    $ref: './paths/auth.yaml#/paths/~1auth~1login'
  /auth/refresh:
    $ref: './paths/auth.yaml#/paths/~1auth~1refresh'
  /auth/logout:
    $ref: './paths/auth.yaml#/paths/~1auth~1logout'
  /auth/me:
    $ref: './paths/auth.yaml#/paths/~1auth~1me'
  
  /tenants:
    $ref: './paths/tenants.yaml#/paths/~1tenants'
  /tenants/{tenantId}:
    $ref: './paths/tenants.yaml#/paths/~1tenants~1{tenantId}'
  
  /users:
    $ref: './paths/users.yaml#/paths/~1users'
  /users/{userId}:
    $ref: './paths/users.yaml#/paths/~1users~1{userId}'
  
  /documents:
    $ref: './paths/documents.yaml#/paths/~1documents'
  /documents/upload:
    $ref: './paths/documents.yaml#/paths/~1documents~1upload'
  /documents/upload-multiple:
    $ref: './paths/documents.yaml#/paths/~1documents~1upload-multiple'
  /documents/upload/{uploadId}/status:
    $ref: './paths/documents.yaml#/paths/~1documents~1upload~1{uploadId}~1status'
  /documents/{documentId}:
    $ref: './paths/documents.yaml#/paths/~1documents~1{documentId}'
  
  /social-links:
    $ref: './paths/social.yaml#/paths/~1social-links'
  /social-links/{linkId}:
    $ref: './paths/social.yaml#/paths/~1social-links~1{linkId}'
  
  /sessions:
    $ref: './paths/chat.yaml#/paths/~1sessions'
  /sessions/{sessionId}:
    $ref: './paths/chat.yaml#/paths/~1sessions~1{sessionId}'
  /sessions/{sessionId}/messages:
    $ref: './paths/chat.yaml#/paths/~1sessions~1{sessionId}~1messages'
  /sessions/{sessionId}/messages/stream:
    $ref: './paths/chat.yaml#/paths/~1sessions~1{sessionId}~1messages~1stream'

components:
  schemas:
    $ref: './components/schemas.yaml#/components/schemas'
  parameters:
    $ref: './components/parameters.yaml#/components/parameters'
  responses:
    $ref: './components/responses.yaml#/components/responses'
  securitySchemes:
    $ref: './components/security.yaml#/components/securitySchemes'
```

## Components

### schemas.yaml

All data models including:
- User, Tenant, Document, SocialLink, Session, Message
- Request/Response DTOs
- Error models
- Pagination models

### parameters.yaml

Reusable parameters:
- Path parameters (tenantId, userId, documentId, etc.)
- Query parameters (pagination, filtering)
- Headers (authorization, content-type)

### responses.yaml

Standard response structures:
- Success responses
- Error responses
- Paginated responses
- Validation errors

### security.yaml

Security schemes:
- JWT Bearer authentication
- API key authentication (if needed)

## Paths

### auth.yaml

Authentication endpoints:
- POST /auth/login - User login
- POST /auth/refresh - Refresh access token
- POST /auth/logout - User logout
- GET /auth/me - Get current user

### tenants.yaml

Tenant management (superadmin only):
- GET /tenants - List all tenants
- POST /tenants - Create new tenant
- PUT /tenants/{tenantId} - Update tenant
- DELETE /tenants/{tenantId} - Delete tenant

### users.yaml

User management (tenant admin):
- GET /users - List users in tenant
- POST /users - Create new user
- PUT /users/{userId} - Update user
- DELETE /users/{userId} - Delete user

### documents.yaml

Document management:
- GET /documents - List documents
- POST /documents/upload - Upload single document
- POST /documents/upload-multiple - Upload multiple documents
- GET /documents/upload/{uploadId}/status - Get upload status
- DELETE /documents/{documentId} - Delete document

### social.yaml

Social media management:
- GET /social-links - List social links
- POST /social-links - Add social link
- DELETE /social-links/{linkId} - Remove social link

### chat.yaml

Chat functionality:
- GET /sessions - List chat sessions
- POST /sessions - Create new session
- DELETE /sessions/{sessionId} - Delete session
- GET /sessions/{sessionId}/messages - Get session messages
- POST /sessions/{sessionId}/messages - Send message
- POST /sessions/{sessionId}/messages/stream - Send message with streaming

## Key Features to Document

### Authentication
- JWT token structure and claims
- Token refresh mechanism
- Role-based access control

### Multi-Tenancy
- Tenant isolation requirements
- Role permissions matrix
- Data access patterns

### File Upload
- Supported file types and sizes
- Upload progress tracking
- Processing status updates

### Streaming
- Server-Sent Events format
- Chat response streaming
- Error handling in streams

### Error Handling
- Standardized error codes
- HTTP status code mapping
- Request tracking

## Implementation Notes

1. **Security**: All endpoints except auth endpoints require JWT Bearer token
2. **Tenant Isolation**: All tenant-scoped operations must enforce data isolation
3. **Role Enforcement**: Each endpoint must validate user role permissions
4. **Validation**: Input validation for all request parameters and bodies
5. **Error Responses**: Consistent error format across all endpoints
6. **Pagination**: List endpoints should support pagination parameters
7. **File Handling**: Secure file upload with type and size validation
8. **Streaming**: Proper SSE implementation for chat streaming

This plan provides a complete roadmap for implementing the OpenAPI specification that any backend can follow to ensure compatibility with the RAG Chat frontend.
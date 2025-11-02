# API Specification for RAG Chat Admin Dashboard

## Base Configuration
- Base URL: Configurable in settings
- Authentication: Bearer Token (JWT)
- Content-Type: application/json
- Refresh Token: Stored securely and used to renew access tokens

## Authentication Endpoints

### POST /auth/login
Login user and return tokens.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "userPassword123"
}
```

**Response (200 OK):**
```json
{
  "user": {
    "id": "user123",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 3600
}
```

**Error Response (401 Unauthorized):**
```json
{
  "error": "Invalid credentials",
  "message": "The email or password is incorrect"
}
```

### POST /auth/refresh
Refresh access token using refresh token.

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200 OK):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 3600
}
```

### POST /auth/logout
Logout user and invalidate tokens.

**Request Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK):**
```json
{
  "message": "Successfully logged out"
}
```

## Chat Session Endpoints

### GET /sessions
Get all chat sessions for the authenticated user.

**Request Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK):**
```json
{
  "sessions": [
    {
      "id": "session123",
      "title": "Discussion about AI",
      "createdAt": "2023-11-01T10:30:00Z",
      "updatedAt": "2023-11-01T11:45:00Z",
      "messageCount": 15
    },
    {
      "id": "session456",
      "title": "Document Analysis",
      "createdAt": "2023-11-02T09:15:00Z",
      "updatedAt": "2023-11-02T10:20:00Z",
      "messageCount": 8
    }
  ]
}
```

### POST /sessions
Create a new chat session.

**Request Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Request Body:**
```json
{
  "title": "New Chat Session"
}
```

**Response (201 Created):**
```json
{
  "id": "session789",
  "title": "New Chat Session",
  "createdAt": "2023-11-03T14:30:00Z",
  "updatedAt": "2023-11-03T14:30:00Z",
  "messageCount": 0
}
```

### GET /sessions/:id/messages
Get all messages for a specific session.

**Request Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK):**
```json
{
  "messages": [
    {
      "id": "msg123",
      "content": "Hello, how can you help me today?",
      "role": "user",
      "timestamp": "2023-11-01T10:30:00Z"
    },
    {
      "id": "msg124",
      "content": "I can help you with various tasks including document analysis and answering questions.",
      "role": "assistant",
      "timestamp": "2023-11-01T10:30:15Z"
    }
  ]
}
```

### POST /sessions/:id/messages
Send a new message in a session.

**Request Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Request Body:**
```json
{
  "content": "What is the capital of France?",
  "role": "user"
}
```

**Response (201 Created):**
```json
{
  "id": "msg125",
  "content": "What is the capital of France?",
  "role": "user",
  "timestamp": "2023-11-01T10:35:00Z"
}
```

## Document Management Endpoints

### POST /documents/upload
Upload a document for processing.

**Request Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: multipart/form-data
```

**Request Body:**
```
file: [File data]
```

**Response (201 Created):**
```json
{
  "id": "doc123",
  "filename": "document.pdf",
  "originalName": "My Document.pdf",
  "size": 1024000,
  "mimeType": "application/pdf",
  "status": "uploaded",
  "uploadedAt": "2023-11-01T10:30:00Z"
}
```

### GET /documents
Get all uploaded documents.

**Request Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK):**
```json
{
  "documents": [
    {
      "id": "doc123",
      "filename": "document.pdf",
      "originalName": "My Document.pdf",
      "size": 1024000,
      "mimeType": "application/pdf",
      "status": "processed",
      "uploadedAt": "2023-11-01T10:30:00Z",
      "processedAt": "2023-11-01T10:35:00Z"
    },
    {
      "id": "doc456",
      "filename": "report.docx",
      "originalName": "Annual Report.docx",
      "size": 2048000,
      "mimeType": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "status": "uploaded",
      "uploadedAt": "2023-11-02T09:15:00Z"
    }
  ]
}
```

### DELETE /documents/:id
Delete a document.

**Request Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK):**
```json
{
  "message": "Document deleted successfully"
}
```

## Social Media Links Endpoints

### GET /social-links
Get all social media links.

**Request Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK):**
```json
{
  "links": [
    {
      "id": "link123",
      "url": "https://twitter.com/example",
      "platform": "twitter",
      "addedAt": "2023-11-01T10:30:00Z"
    },
    {
      "id": "link456",
      "url": "https://linkedin.com/company/example",
      "platform": "linkedin",
      "addedAt": "2023-11-02T09:15:00Z"
    }
  ]
}
```

### POST /social-links
Add a new social media link.

**Request Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Request Body:**
```json
{
  "url": "https://facebook.com/example"
}
```

**Response (201 Created):**
```json
{
  "id": "link789",
  "url": "https://facebook.com/example",
  "platform": "facebook",
  "addedAt": "2023-11-03T14:30:00Z"
}
```

### DELETE /social-links/:id
Delete a social media link.

**Request Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK):**
```json
{
  "message": "Social media link deleted successfully"
}
```

## Error Response Format

All error responses follow this format:

```json
{
  "error": "ERROR_CODE",
  "message": "Human-readable error message",
  "details": "Additional error details (optional)"
}
```

## Common HTTP Status Codes

- 200 OK: Request successful
- 201 Created: Resource created successfully
- 400 Bad Request: Invalid request data
- 401 Unauthorized: Authentication required or invalid
- 403 Forbidden: Insufficient permissions
- 404 Not Found: Resource not found
- 409 Conflict: Resource conflict
- 422 Unprocessable Entity: Validation errors
- 500 Internal Server Error: Server error

## Rate Limiting

API requests may be rate limited. The following headers are included in responses:

```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1638360000
```

## Pagination

List endpoints support pagination with these query parameters:

- `page`: Page number (default: 1)
- `limit`: Number of items per page (default: 20, max: 100)

**Example:**
```
GET /sessions?page=2&limit=10
```

**Response with pagination:**
```json
{
  "sessions": [...],
  "pagination": {
    "page": 2,
    "limit": 10,
    "total": 45,
    "totalPages": 5
  }
}
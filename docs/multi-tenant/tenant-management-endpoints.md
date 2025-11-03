# Tenant Management Endpoints

Complete API specification for tenant management operations in the RAG Chat multi-tenant system.

## 🏢 Overview

Tenant management endpoints allow superadmins to create, manage, and monitor tenants in the multi-tenant RAG Chat system. These endpoints are restricted to users with the `superadmin` role.

## 🔐 Authentication & Authorization

All tenant management endpoints require:

1. **Authentication**: Valid JWT access token
2. **Authorization**: User must have `superadmin` role
3. **Headers**: 
   ```http
   Authorization: Bearer <access-token>
   Content-Type: application/json
   ```

## 📋 Tenant Endpoints

### Create Tenant

Creates a new tenant with an associated admin user.

```http
POST /api/v1/tenants
Authorization: Bearer <superadmin-token>
Content-Type: application/json
```

#### Request Body

```typescript
interface CreateTenantRequest {
  name: string;           // Human-readable tenant name
  slug: string;           // URL-safe tenant identifier
  adminUser: {
    email: string;         // Admin user email
    password: string;      // Admin user password
    name: string;          // Admin user display name
  };
}
```

#### Example Request

```json
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

#### Response

```typescript
interface CreateTenantResponse {
  success: true;
  data: {
    id: string;           // Generated tenant UUID
    name: string;          // Tenant name
    slug: string;          // Tenant slug
    createdAt: string;      // ISO 8601 timestamp
    adminUser: {
      id: string;         // Generated user UUID
      email: string;       // Admin user email
      name: string;        // Admin user name
      role: 'tenant_admin';
      tenantId: string;    // Tenant ID
      createdAt: string;   // ISO 8601 timestamp
    };
  };
}
```

#### Example Response

```json
{
  "success": true,
  "data": {
    "id": "tenant_1234567890",
    "name": "Acme Corporation",
    "slug": "acme-corp",
    "createdAt": "2024-01-01T10:00:00Z",
    "adminUser": {
      "id": "user_1234567890",
      "email": "admin@acme.com",
      "name": "John Admin",
      "role": "tenant_admin",
      "tenantId": "tenant_1234567890",
      "createdAt": "2024-01-01T10:00:00Z"
    }
  }
}
```

### Get All Tenants

Retrieves all tenants in the system (superadmin only).

```http
GET /api/v1/tenants
Authorization: Bearer <superadmin-token>
```

#### Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | number | 1 | Page number for pagination |
| `limit` | number | 20 | Number of tenants per page |
| `search` | string | null | Search term for tenant name/slug |
| `sortBy` | string | createdAt | Field to sort by |
| `sortOrder` | string | desc | Sort order (asc/desc) |

#### Example Request

```http
GET /api/v1/tenants?page=1&limit=10&sortBy=createdAt&sortOrder=desc
```

#### Response

```typescript
interface GetTenantsResponse {
  success: true;
  data: {
    tenants: Array<{
      id: string;
      name: string;
      slug: string;
      createdAt: string;
      updatedAt?: string;
      userCount: number;      // Number of users in tenant
      documentCount: number;   // Number of documents in tenant
      sessionCount: number;    // Number of chat sessions in tenant
    }>;
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}
```

#### Example Response

```json
{
  "success": true,
  "data": {
    "tenants": [
      {
        "id": "tenant_1234567890",
        "name": "Acme Corporation",
        "slug": "acme-corp",
        "createdAt": "2024-01-01T10:00:00Z",
        "updatedAt": "2024-01-15T14:30:00Z",
        "userCount": 5,
        "documentCount": 12,
        "sessionCount": 23
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 1,
      "totalPages": 1
    }
  }
}
```

### Get Tenant by ID

Retrieves a specific tenant by ID (superadmin only).

```http
GET /api/v1/tenants/{tenantId}
Authorization: Bearer <superadmin-token>
```

#### Response

```typescript
interface GetTenantResponse {
  success: true;
  data: {
    id: string;
    name: string;
    slug: string;
    createdAt: string;
    updatedAt?: string;
    userCount: number;
    documentCount: number;
    sessionCount: number;
    adminUser: {
      id: string;
      email: string;
      name: string;
      role: 'tenant_admin';
      createdAt: string;
      lastLogin?: string;
    };
  };
}
```

#### Example Response

```json
{
  "success": true,
  "data": {
    "id": "tenant_1234567890",
    "name": "Acme Corporation",
    "slug": "acme-corp",
    "createdAt": "2024-01-01T10:00:00Z",
    "updatedAt": "2024-01-15T14:30:00Z",
    "userCount": 5,
    "documentCount": 12,
    "sessionCount": 23,
    "adminUser": {
      "id": "user_1234567890",
      "email": "admin@acme.com",
      "name": "John Admin",
      "role": "tenant_admin",
      "createdAt": "2024-01-01T10:00:00Z",
      "lastLogin": "2024-01-15T09:30:00Z"
    }
  }
}
```

### Update Tenant

Updates tenant information (superadmin only).

```http
PUT /api/v1/tenants/{tenantId}
Authorization: Bearer <superadmin-token>
Content-Type: application/json
```

#### Request Body

```typescript
interface UpdateTenantRequest {
  name?: string;    // Updated tenant name
  slug?: string;    // Updated tenant slug
}
```

#### Example Request

```json
{
  "name": "Updated Company Name"
}
```

#### Response

```typescript
interface UpdateTenantResponse {
  success: true;
  data: {
    id: string;
    name: string;
    slug: string;
    createdAt: string;
    updatedAt: string;
    userCount: number;
    documentCount: number;
    sessionCount: number;
  };
}
```

#### Example Response

```json
{
  "success": true,
  "data": {
    "id": "tenant_1234567890",
    "name": "Updated Company Name",
    "slug": "acme-corp",
    "createdAt": "2024-01-01T10:00:00Z",
    "updatedAt": "2024-01-20T11:00:00Z",
    "userCount": 5,
    "documentCount": 12,
    "sessionCount": 23
  }
}
```

### Delete Tenant

Deletes a tenant and all associated data (superadmin only).

⚠️ **Warning**: This operation is irreversible and will delete:
- All users in the tenant
- All documents uploaded by the tenant
- All chat sessions and messages
- All social media links
- All tenant-specific data

```http
DELETE /api/v1/tenants/{tenantId}
Authorization: Bearer <superadmin-token>
```

#### Response

```typescript
interface DeleteTenantResponse {
  success: true;
  message: string;
}
```

#### Example Response

```json
{
  "success": true,
  "message": "Tenant deleted successfully"
}
```

### Get Tenant Statistics

Retrieves comprehensive statistics for a tenant (superadmin only).

```http
GET /api/v1/tenants/{tenantId}/statistics
Authorization: Bearer <superadmin-token>
```

#### Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `period` | string | month | Time period (day, week, month, year) |
| `startDate` | string | null | ISO 8601 start date |
| `endDate` | string | null | ISO 8601 end date |

#### Response

```typescript
interface GetTenantStatisticsResponse {
  success: true;
  data: {
    tenant: {
      id: string;
      name: string;
      slug: string;
    };
    users: {
      total: number;
      active: number;
      newThisPeriod: number;
      byRole: {
        tenant_admin: number;
        user: number;
      };
    };
    documents: {
      total: number;
      processed: number;
      uploadedThisPeriod: number;
      totalSize: number;
      averageSize: number;
    };
    sessions: {
      total: number;
      activeThisPeriod: number;
      averageDuration: number;
      totalMessages: number;
    };
    storage: {
      totalSize: number;
      documentSize: number;
      databaseSize: number;
    };
    period: {
      startDate: string;
      endDate: string;
      type: string;
    };
  };
}
```

#### Example Response

```json
{
  "success": true,
  "data": {
    "tenant": {
      "id": "tenant_1234567890",
      "name": "Acme Corporation",
      "slug": "acme-corp"
    },
    "users": {
      "total": 5,
      "active": 3,
      "newThisPeriod": 1,
      "byRole": {
        "tenant_admin": 1,
        "user": 4
      }
    },
    "documents": {
      "total": 12,
      "processed": 10,
      "uploadedThisPeriod": 3,
      "totalSize": 52428800,
      "averageSize": 4369066
    },
    "sessions": {
      "total": 23,
      "activeThisPeriod": 8,
      "averageDuration": 1800,
      "totalMessages": 156
    },
    "storage": {
      "totalSize": 52428800,
      "documentSize": 52428800,
      "databaseSize": 1048576
    },
    "period": {
      "startDate": "2024-01-01T00:00:00Z",
      "endDate": "2024-01-31T23:59:59Z",
      "type": "month"
    }
  }
}
```

## 🔒 Security Considerations

### Authorization Checks

All tenant management endpoints must verify:

1. **User Role**: Only `superadmin` role allowed
2. **Tenant Access**: Superadmin can access any tenant
3. **Operation Permissions**: Role-based access control

### Input Validation

#### Tenant Name
- Required for creation
- Minimum length: 3 characters
- Maximum length: 255 characters
- Allowed characters: letters, numbers, spaces, hyphens, underscores

#### Tenant Slug
- Required for creation
- Minimum length: 3 characters
- Maximum length: 100 characters
- Pattern: `^[a-z0-9-]+$` (lowercase, numbers, hyphens)
- Must be unique across all tenants

#### Admin User Data
- Email: Valid email format, unique across system
- Password: Minimum 8 characters, at least one uppercase, one lowercase, one number
- Name: Required, maximum 255 characters

### Rate Limiting

Implement rate limiting for tenant management:

```typescript
const rateLimits = {
  createTenant: '5 per hour per superadmin',
  updateTenant: '20 per hour per tenant',
  deleteTenant: '2 per hour per superadmin',
  getTenants: '100 per hour per superadmin',
  getStatistics: '50 per hour per tenant',
};
```

## 🚨 Error Handling

### Error Response Format

```typescript
interface TenantErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: string;
  };
  meta: {
    timestamp: string;
    requestId: string;
  };
}
```

### Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `TENANT_NOT_FOUND` | 404 | Tenant with specified ID not found |
| `TENANT_SLUG_EXISTS` | 409 | Tenant slug already exists |
| `INVALID_TENANT_NAME` | 400 | Tenant name fails validation |
| `INVALID_TENANT_SLUG` | 400 | Tenant slug fails validation |
| `INSUFFICIENT_PERMISSIONS` | 403 | User lacks superadmin role |
| `TENANT_HAS_USERS` | 409 | Cannot delete tenant with active users |
| `TENANT_HAS_DOCUMENTS` | 409 | Cannot delete tenant with documents |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests in time period |

### Example Error Responses

#### Tenant Not Found
```json
{
  "success": false,
  "error": {
    "code": "TENANT_NOT_FOUND",
    "message": "Tenant with ID 'invalid-id' not found"
  },
  "meta": {
    "timestamp": "2024-01-01T10:00:00Z",
    "requestId": "req_1234567890"
  }
}
```

#### Slug Already Exists
```json
{
  "success": false,
  "error": {
    "code": "TENANT_SLUG_EXISTS",
    "message": "Tenant slug 'existing-slug' already exists",
    "details": "Choose a different slug for this tenant"
  },
  "meta": {
    "timestamp": "2024-01-01T10:00:00Z",
    "requestId": "req_1234567891"
  }
}
```

## 🔄 Implementation Examples

### FastAPI Implementation

```python
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

router = APIRouter(prefix="/api/v1/tenants", tags=["tenants"])

@router.post("/", response_model=CreateTenantResponse)
async def create_tenant(
    request: CreateTenantRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_superadmin)
):
    # Validate tenant slug uniqueness
    if db.query(Tenant).filter(Tenant.slug == request.slug).first():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail={
                "code": "TENANT_SLUG_EXISTS",
                "message": f"Tenant slug '{request.slug}' already exists"
            }
        )
    
    # Create tenant
    tenant = Tenant(
        name=request.name,
        slug=request.slug
    )
    db.add(tenant)
    db.flush()  # Get the ID without committing
    
    # Create admin user
    admin_user = User(
        email=request.adminUser.email,
        password_hash=hash_password(request.adminUser.password),
        name=request.adminUser.name,
        role="tenant_admin",
        tenant_id=tenant.id
    )
    db.add(admin_user)
    db.commit()
    
    return CreateTenantResponse(
        success=True,
        data={
            "id": str(tenant.id),
            "name": tenant.name,
            "slug": tenant.slug,
            "createdAt": tenant.created_at.isoformat(),
            "adminUser": {
                "id": str(admin_user.id),
                "email": admin_user.email,
                "name": admin_user.name,
                "role": admin_user.role,
                "tenantId": str(tenant.id),
                "createdAt": admin_user.created_at.isoformat()
            }
        }
    )
```

### Node.js/Express Implementation

```javascript
const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();

// Create tenant
router.post('/', async (req, res) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid request data',
          details: errors.array()
        }
      });
    }

    // Check user permissions
    if (req.user.role !== 'superadmin') {
      return res.status(403).json({
        success: false,
        error: {
          code: 'INSUFFICIENT_PERMISSIONS',
          message: 'Only superadmins can create tenants'
        }
      });
    }

    // Check slug uniqueness
    const existingTenant = await Tenant.findOne({ 
      where: { slug: req.body.slug } 
    });
    
    if (existingTenant) {
      return res.status(409).json({
        success: false,
        error: {
          code: 'TENANT_SLUG_EXISTS',
          message: `Tenant slug '${req.body.slug}' already exists`
        }
      });
    }

    // Create tenant
    const tenant = await Tenant.create({
      name: req.body.name,
      slug: req.body.slug
    });

    // Create admin user
    const adminUser = await User.create({
      email: req.body.adminUser.email,
      password: await bcrypt.hash(req.body.adminUser.password),
      name: req.body.adminUser.name,
      role: 'tenant_admin',
      tenantId: tenant.id
    });

    res.status(201).json({
      success: true,
      data: {
        id: tenant.id,
        name: tenant.name,
        slug: tenant.slug,
        createdAt: tenant.createdAt,
        adminUser: {
          id: adminUser.id,
          email: adminUser.email,
          name: adminUser.name,
          role: adminUser.role,
          tenantId: tenant.id,
          createdAt: adminUser.createdAt
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to create tenant'
      }
    });
  }
});
```

## 📊 Monitoring & Analytics

### Tenant Metrics

Track these tenant management metrics:

1. **Creation Rate**: New tenants per time period
2. **Deletion Rate**: Deleted tenants per time period
3. **Update Frequency**: How often tenants are updated
4. **Admin User Activity**: Login frequency and actions
5. **Storage Usage**: Per-tenant storage consumption

### Audit Logging

Log all tenant management operations:

```typescript
interface TenantAuditLog {
  timestamp: string;
  userId: string;
  action: 'create' | 'update' | 'delete' | 'view';
  tenantId?: string;
  details: {
    before?: any;
    after?: any;
    reason?: string;
  };
  ipAddress: string;
  userAgent: string;
}
```

---

**Related Documentation**:
- [Database Schema](./database-schema.md) - Tenant data structure
- [API Overview](../api/overview.md) - General API information
- [Authentication System](./authentication-authorization-system.md) - Auth implementation
- [Client Management System](./client-management-system.md) - Client management
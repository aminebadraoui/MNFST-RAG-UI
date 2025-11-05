# Cloudflare R2 Implementation Guide

## Overview

This guide provides complete implementation for integrating Cloudflare R2 with your MNFST RAG application using FastAPI backend and React frontend.

## Architecture

### Upload Flow
1. Client requests pre-signed URL from FastAPI backend
2. Backend generates pre-signed URL using R2 SDK
3. Backend returns pre-signed URL to client
4. Client uploads directly to R2 using pre-signed URL
5. Client notifies backend with document URL after successful upload
6. Backend updates database with document details

### Bucket Structure
```
mnfst-rag-documents/
├── tenant-123/
│   ├── document.pdf
│   ├── report.docx
├── tenant-456/
│   ├── file1.pdf
```

## FastAPI Backend Implementation

### 1. Dependencies

```bash
pip install boto3 python-multipart uvicorn fastapi
```

### 2. R2 Service Module

```python
# services/r2_service.py
import boto3
import uuid
from botocore.client import Config
from typing import Dict, Any
import os

class R2Service:
    def __init__(self):
        self.client = boto3.client(
            's3',
            endpoint_url=f'https://{os.getenv("R2_ACCOUNT_ID")}.r2.cloudflarestorage.com',
            aws_access_key_id=os.getenv("R2_ACCESS_KEY_ID"),
            aws_secret_access_key=os.getenv("R2_SECRET_ACCESS_KEY"),
            config=Config(region_name='auto', signature_version='s3v4'),
        )
        self.bucket_name = os.getenv("R2_BUCKET_NAME", "mnfst-rag-documents")

    def generate_presigned_upload_url(
        self, 
        tenant_id: str, 
        file_name: str, 
        mime_type: str, 
        file_size: int
    ) -> Dict[str, Any]:
        """Generate presigned URL for direct upload to R2"""
        
        document_id = str(uuid.uuid4())
        # Sanitize filename
        sanitized_name = "".join(c if c.isalnum() or c in "._-" else "_" for c in file_name)
        file_key = f"{tenant_id}/{sanitized_name}"
        
        # Generate presigned URL
        url = self.client.generate_presigned_url(
            'put_object',
            Params={
                'Bucket': self.bucket_name,
                'Key': file_key,
                'ContentType': mime_type,
                'ContentLength': file_size,
                'Metadata': {
                    'tenant_id': tenant_id,
                    'document_id': document_id,
                    'original_name': file_name,
                    'uploaded_at': datetime.utcnow().isoformat()
                }
            },
            ExpiresIn=300  # 5 minutes
        )
        
        public_url = f"https://pub-{os.getenv('R2_ACCOUNT_ID')}.r2.dev/{file_key}"
        
        return {
            "upload_url": url,
            "file_key": file_key,
            "document_id": document_id,
            "public_url": public_url
        }

    def delete_file(self, file_key: str) -> bool:
        """Delete file from R2"""
        try:
            self.client.delete_object(Bucket=self.bucket_name, Key=file_key)
            return True
        except Exception as e:
            print(f"Error deleting file: {e}")
            return False
```

### 3. Database Models

```python
# models/document.py
from sqlalchemy import Column, String, Integer, DateTime, Text, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from database.base import Base
import uuid

class Document(Base):
    __tablename__ = "documents"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = Column(UUID(as_uuid=True), ForeignKey("tenants.id"), nullable=False)
    filename = Column(String(255), nullable=False)
    original_name = Column(String(255), nullable=False)
    file_size = Column(Integer, nullable=False)
    mime_type = Column(String(100), nullable=False)
    storage_path = Column(String(500), nullable=False)  # R2 file key
    status = Column(String(20), default="uploaded")
    uploaded_at = Column(DateTime, default=datetime.utcnow)
    processed_at = Column(DateTime, nullable=True)
    error = Column(Text, nullable=True)
    
    # Relationships
    tenant = relationship("Tenant", back_populates="documents")
```

### 4. API Endpoints

```python
# api/documents.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from services.r2_service import R2Service
from models.document import Document
from schemas.document import DocumentCreate, DocumentResponse
from database.session import get_db
from auth.dependencies import get_current_user
from models.user import User

router = APIRouter(prefix="/api/v1/documents", tags=["documents"])
r2_service = R2Service()

@router.post("/presigned-url")
async def get_presigned_upload_url(
    file_name: str,
    mime_type: str,
    file_size: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Generate presigned URL for document upload"""
    
    # Validate file type and size
    allowed_types = ["application/pdf", "application/msword", 
                   "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                   "text/plain", "text/markdown"]
    
    if mime_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail="File type not allowed"
        )
    
    max_size = 100 * 1024 * 1024  # 100MB
    if file_size > max_size:
        raise HTTPException(
            status_code=400,
            detail="File size exceeds limit"
        )
    
    # Generate presigned URL
    presigned_data = r2_service.generate_presigned_upload_url(
        tenant_id=str(current_user.tenant_id),
        file_name=file_name,
        mime_type=mime_type,
        file_size=file_size
    )
    
    return presigned_data

@router.post("/register-upload")
async def register_upload(
    document_id: str,
    file_name: str,
    file_key: str,
    public_url: str,
    file_size: int,
    mime_type: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Register uploaded document in database"""
    
    # Create document record
    document = Document(
        id=document_id,
        tenant_id=current_user.tenant_id,
        filename=file_name,
        original_name=file_name,
        file_size=file_size,
        mime_type=mime_type,
        storage_path=file_key,
        status="uploaded"
    )
    
    db.add(document)
    db.commit()
    db.refresh(document)
    
    # Trigger document processing (async)
    # background_tasks.add_task(process_document, document.id)
    
    return DocumentResponse.from_orm(document)

@router.get("/")
async def get_documents(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all documents for current tenant"""
    
    documents = db.query(Document).filter(
        Document.tenant_id == current_user.tenant_id
    ).all()
    
    return [DocumentResponse.from_orm(doc) for doc in documents]

@router.delete("/{document_id}")
async def delete_document(
    document_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete document"""
    
    document = db.query(Document).filter(
        Document.id == document_id,
        Document.tenant_id == current_user.tenant_id
    ).first()
    
    if not document:
        raise HTTPException(
            status_code=404,
            detail="Document not found"
        )
    
    # Delete from R2
    r2_service.delete_file(document.storage_path)
    
    # Delete from database
    db.delete(document)
    db.commit()
    
    return {"message": "Document deleted successfully"}
```

### 5. Pydantic Schemas

```python
# schemas/document.py
from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class DocumentCreate(BaseModel):
    id: str
    filename: str
    original_name: str
    file_size: int
    mime_type: str
    storage_path: str
    status: str = "uploaded"
    uploaded_at: datetime

class DocumentResponse(BaseModel):
    id: str
    filename: str
    original_name: str
    file_size: int
    mime_type: str
    status: str
    uploaded_at: datetime
    processed_at: Optional[datetime] = None
    error: Optional[str] = None
    
    @classmethod
    def from_orm(cls, document):
        return cls(
            id=str(document.id),
            filename=document.filename,
            original_name=document.original_name,
            file_size=document.file_size,
            mime_type=document.mime_type,
            status=document.status,
            uploaded_at=document.uploaded_at,
            processed_at=document.processed_at,
            error=document.error
        )

class PresignedUrlResponse(BaseModel):
    upload_url: str
    file_key: str
    document_id: str
    public_url: str
```

### 6. Environment Variables

```env
# .env
R2_ACCOUNT_ID=your-account-id
R2_ACCESS_KEY_ID=your-access-key-id
R2_SECRET_ACCESS_KEY=your-secret-access-key
R2_BUCKET_NAME=mnfst-rag-documents

# Database
DATABASE_URL=postgresql://user:password@localhost/dbname

# Security
SECRET_KEY=your-secret-key
```

## Frontend Implementation

### 1. Update Document API Service

```typescript
// src/services/documentAPI.ts
import { apiClient } from './apiClient';
import {
  Document,
  GetDocumentsResponse,
  UploadProgressCallback,
  UploadRequest,
  UploadResponse,
  UploadStatusResponse,
  MultipleUploadProgressCallback,
  PresignedUrlResponse,
  RegisterUploadRequest
} from '../types';

export const documentAPI = {
  getDocuments: async (): Promise<GetDocumentsResponse> => {
    const response = await apiClient.get<GetDocumentsResponse>('/documents');
    return response.data;
  },

  // NEW: Get presigned URL from backend
  getPresignedUrl: async (file: File): Promise<PresignedUrlResponse> => {
    const response = await apiClient.post<PresignedUrlResponse>('/documents/presigned-url', {
      file_name: file.name,
      mime_type: file.type,
      file_size: file.size
    });
    return response.data;
  },

  // NEW: Register uploaded document with backend
  registerUpload: async (uploadData: RegisterUploadRequest): Promise<Document> => {
    const response = await apiClient.post<Document>('/documents/register-upload', uploadData);
    return response.data;
  },

  // ENHANCED: Upload with R2 support
  uploadDocuments: async (
    files: File[],
    onProgress?: MultipleUploadProgressCallback | UploadProgressCallback
  ): Promise<UploadResponse> => {
    const documents: Document[] = [];

    for (const file of files) {
      try {
        // Step 1: Get presigned URL from backend
        const presignedData = await documentAPI.getPresignedUrl(file);
        
        // Step 2: Upload directly to R2
        await uploadToR2(file, presignedData.upload_url, onProgress);
        
        // Step 3: Register with backend
        const document = await documentAPI.registerUpload({
          document_id: presignedData.document_id,
          file_name: file.name,
          file_key: presignedData.file_key,
          public_url: presignedData.public_url,
          file_size: file.size,
          mime_type: file.type
        });
        
        documents.push(document);
      } catch (error) {
        console.error('Upload failed:', error);
        throw error;
      }
    }

    return { documents };
  },

  getUploadStatus: async (uploadId: string): Promise<UploadStatusResponse> => {
    const response = await apiClient.get<UploadStatusResponse>(`/documents/upload/${uploadId}/status`);
    return response.data;
  },

  deleteDocument: async (documentId: string): Promise<void> => {
    await apiClient.delete(`/documents/${documentId}`);
  },
};

// Helper function for direct R2 upload
const uploadToR2 = (
  file: File, 
  uploadUrl: string, 
  onProgress?: MultipleUploadProgressCallback | UploadProgressCallback
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    
    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable && onProgress) {
        const progress = Math.round((e.loaded / e.total) * 100);
        
        if (typeof onProgress === 'function') {
          (onProgress as UploadProgressCallback)(progress);
        }
      }
    });
    
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        resolve();
      } else {
        reject(new Error(`Upload failed with status ${xhr.status}`));
      }
    });
    
    xhr.addEventListener('error', () => {
      reject(new Error('Upload failed'));
    });
    
    xhr.open('PUT', uploadUrl);
    xhr.setRequestHeader('Content-Type', file.type);
    xhr.send(file);
  });
};
```

### 2. Update Document Types

```typescript
// src/types/document.ts (ADD NEW TYPES)
export interface PresignedUrlResponse {
  upload_url: string;
  file_key: string;
  document_id: string;
  public_url: string;
}

export interface RegisterUploadRequest {
  document_id: string;
  file_name: string;
  file_key: string;
  public_url: string;
  file_size: number;
  mime_type: string;
}

// Keep existing interfaces...
export interface Document {
  id: string;
  filename: string;
  originalName: string;
  size: number;
  mimeType: string;
  status: 'uploaded' | 'processing' | 'processed' | 'error';
  uploadedAt: string;
  processedAt?: string;
  error?: string;
}
```

### 3. Update Documents Page (Minimal Changes)

```typescript
// src/pages/DocumentsPage.tsx (NO CHANGES NEEDED)
// The existing implementation should work with the enhanced documentAPI
// The uploadDocuments method will automatically use R2
```

## R2 Bucket Configuration

### 1. CORS Configuration

```json
{
  "AllowedOrigins": [
    "https://yourdomain.com",
    "https://app.yourdomain.com"
  ],
  "AllowedHeaders": [
    "Content-Type",
    "Content-Length",
    "Authorization"
  ],
  "AllowedMethods": [
    "GET",
    "PUT",
    "POST",
    "DELETE"
  ],
  "MaxAgeSeconds": 3000
}
```

### 2. Bucket Policy (Optional)

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowTenantAccess",
      "Effect": "Allow",
      "Principal": {
        "AWS": "*"
      },
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject"
      ],
      "Resource": "arn:aws:s3:::mnfst-rag-documents/tenant-*/*",
      "Condition": {
        "StringLike": {
          "s3:prefix": "tenant-*/*"
        }
      }
    }
  ]
}
```

## Security Considerations

### 1. Backend Security
- Validate file types and sizes before generating URLs
- Use short-lived presigned URLs (5 minutes max)
- Implement rate limiting per tenant
- Validate tenant ownership

### 2. Frontend Security
- Use HTTPS for all requests
- Validate file types before upload
- Implement proper error handling
- Sanitize filenames

### 3. R2 Security
- Configure proper CORS policies
- Use bucket policies for tenant isolation
- Enable access logging
- Regular cleanup of failed uploads

## Deployment Steps

### 1. Backend Deployment
```bash
# Install dependencies
pip install -r requirements.txt

# Set environment variables
export R2_ACCOUNT_ID=your-account-id
export R2_ACCESS_KEY_ID=your-access-key-id
export R2_SECRET_ACCESS_KEY=your-secret-access-key

# Run FastAPI server
uvicorn main:app --host 0.0.0.0 --port 8000
```

### 2. Frontend Deployment
```bash
# Install dependencies
npm install

# Build for production
npm run build

# Deploy to your hosting provider
```

## Testing

### 1. Backend Testing
```bash
# Test presigned URL generation
curl -X POST "http://localhost:8000/api/v1/documents/presigned-url" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "file_name": "test.pdf",
    "mime_type": "application/pdf",
    "file_size": 1024000
  }'
```

### 2. Frontend Testing
- Test file upload with various formats
- Test progress tracking
- Test error handling
- Test tenant isolation

## Troubleshooting

### Common Issues
1. **CORS Errors**: Check R2 bucket CORS configuration
2. **Upload Failures**: Verify presigned URL expiration
3. **Permission Errors**: Check R2 credentials and bucket policies
4. **Database Errors**: Verify database connection and schema

### Debugging Tips
- Enable R2 access logging
- Check FastAPI logs for errors
- Use browser dev tools for frontend debugging
- Test with small files first

## Performance Optimization

### 1. Large File Handling
- Implement multipart upload for files > 100MB
- Add resumable upload support
- Use chunked uploads

### 2. Caching
- Cache presigned URLs for short periods
- Implement client-side file deduplication
- Use CDN for serving files

This implementation provides a secure, scalable, and efficient way to upload documents to Cloudflare R2 with proper tenant isolation and comprehensive error handling.
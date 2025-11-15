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
  fileKey?: string;
  publicUrl?: string;
}

export interface GetDocumentsResponse {
  documents: Document[];
}

export interface UploadRequest {
  files: File[];
}

export interface UploadResponse {
  uploadId?: string;
  documents: Document[];
}

export interface DocumentUploadStatus {
  id: string;
  filename: string;
  status: 'uploaded' | 'processing' | 'processed' | 'error';
  progress: number;
  processedAt?: string;
  error?: string;
}

export interface UploadStatusResponse {
  uploadId: string;
  status: 'processing' | 'completed' | 'error';
  documents: DocumentUploadStatus[];
}

export interface UploadProgressCallback {
  (progress: number): void;
}

export interface MultipleUploadProgressCallback {
  (progress: { fileId: string; progress: number }[]): void;
}

// R2-specific interfaces for Cloudflare R2 integration
export interface PresignedUrlResponse {
  uploadUrl: string;
  fileKey: string;
  documentId: string;
  publicUrl: string;
}

export interface RegisterUploadRequest {
  documentId: string;
  fileName: string;
  fileKey: string;
  publicUrl: string;
  fileSize: number;
  mimeType: string;
}
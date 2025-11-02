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

export interface GetDocumentsResponse {
  documents: Document[];
}

export interface UploadProgressCallback {
  (progress: number): void;
}
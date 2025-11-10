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

// Define DataResponse interface for type safety
interface DataResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const documentAPI = {
  getDocuments: async (): Promise<Document[]> => {
    const response = await apiClient.get<DataResponse<Document[]>>('/documents');
    return response.data.data;
  },

  // NEW: Get presigned URL from backend
  getPresignedUrl: async (file: File): Promise<PresignedUrlResponse> => {
    const response = await apiClient.post<DataResponse<PresignedUrlResponse>>('/documents/presigned-url', {
      file_name: file.name,
      mime_type: file.type,
      file_size: file.size
    });
    return response.data.data;
  },

  // NEW: Register uploaded document with backend
  registerUpload: async (uploadData: RegisterUploadRequest): Promise<Document> => {
    const response = await apiClient.post<DataResponse<Document>>('/documents/register-upload', uploadData);
    return response.data.data;
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
    const response = await apiClient.get<DataResponse<UploadStatusResponse>>(`/documents/upload/${uploadId}/status`);
    return response.data.data;
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
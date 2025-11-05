import { apiClient } from './apiClient';
import {
  Document,
  GetDocumentsResponse,
  UploadProgressCallback,
  UploadRequest,
  UploadResponse,
  UploadStatusResponse,
  MultipleUploadProgressCallback
} from '../types';

export const documentAPI = {
  getDocuments: async (): Promise<GetDocumentsResponse> => {
    const response = await apiClient.get<GetDocumentsResponse>('/documents');
    return response.data;
  },

  uploadDocuments: async (
    files: File[],
    onProgress?: MultipleUploadProgressCallback | UploadProgressCallback
  ): Promise<UploadResponse> => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });
    
    const response = await apiClient.upload<UploadResponse>('/documents/upload', formData, {
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const overallProgress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          
          // Handle single file progress callback
          if (files.length === 1 && typeof onProgress === 'function') {
            (onProgress as UploadProgressCallback)(overallProgress);
          }
          // Handle multiple files progress callback
          else if (files.length > 1 && typeof onProgress === 'function') {
            // For multiple files, we'd need to track individual file progress
            // This is a simplified implementation
            (onProgress as MultipleUploadProgressCallback)([{ fileId: 'multiple', progress: overallProgress }]);
          }
        }
      },
    });
    return response.data;
  },

  getUploadStatus: async (uploadId: string): Promise<UploadStatusResponse> => {
    const response = await apiClient.get<UploadStatusResponse>(`/documents/upload/${uploadId}/status`);
    return response.data;
  },

  deleteDocument: async (documentId: string): Promise<void> => {
    await apiClient.delete(`/documents/${documentId}`);
  },
};
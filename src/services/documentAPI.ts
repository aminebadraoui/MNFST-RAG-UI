import { apiClient } from './apiClient';
import {
  Document,
  GetDocumentsResponse,
  UploadProgressCallback,
  MultipleUploadRequest,
  MultipleUploadResponse,
  UploadStatusResponse,
  MultipleUploadProgressCallback
} from '../types';

export const documentAPI = {
  getDocuments: async (): Promise<GetDocumentsResponse> => {
    const response = await apiClient.get<GetDocumentsResponse>('/documents');
    return response.data;
  },

  uploadDocument: async (
    formData: FormData,
    onProgress?: UploadProgressCallback
  ): Promise<Document> => {
    const response = await apiClient.upload<Document>('/documents/upload', formData, {
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    });
    return response.data;
  },

  uploadMultipleDocuments: async (
    formData: FormData,
    onProgress?: MultipleUploadProgressCallback
  ): Promise<MultipleUploadResponse> => {
    const response = await apiClient.upload<MultipleUploadResponse>('/documents/upload-multiple', formData, {
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          // For multiple files, we'd need to track individual file progress
          // This is a simplified implementation
          const overallProgress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          // In a real implementation, you'd track each file separately
          onProgress([{ fileId: 'multiple', progress: overallProgress }]);
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
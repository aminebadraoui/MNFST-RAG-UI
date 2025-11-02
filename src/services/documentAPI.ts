import { apiClient } from './apiClient';
import { Document, GetDocumentsResponse, UploadProgressCallback } from '../types';

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

  deleteDocument: async (documentId: string): Promise<void> => {
    await apiClient.delete(`/documents/${documentId}`);
  },
};
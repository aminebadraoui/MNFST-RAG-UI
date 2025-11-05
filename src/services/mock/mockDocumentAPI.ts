import {
  Document,
  GetDocumentsResponse,
  UploadProgressCallback,
  UploadRequest,
  UploadResponse,
  UploadStatusResponse,
  MultipleUploadProgressCallback,
  DocumentUploadStatus,
  PresignedUrlResponse,
  RegisterUploadRequest
} from '../../types';
import { mockApiClient } from './mockApiClient';
import { MockDataGenerator } from './mockDataGenerator';

// Store mock data in memory
let mockDocuments: Document[] = MockDataGenerator.generateDocuments();
let mockUploadStatuses: Record<string, UploadStatusResponse> = {};

export const mockDocumentAPI = {
  getDocuments: async (): Promise<GetDocumentsResponse> => {
    return mockApiClient.get({ documents: mockDocuments });
  },

  // NEW: Mock implementation for getting presigned URL
  getPresignedUrl: async (file: File): Promise<PresignedUrlResponse> => {
    // Simulate validation
    const allowedTypes = ["application/pdf", "application/msword",
                       "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                       "text/plain", "text/markdown"];
    
    if (!allowedTypes.includes(file.type)) {
      throw new Error("File type not allowed");
    }
    
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
      throw new Error("File size exceeds limit");
    }
    
    const documentId = MockDataGenerator.generateId();
    const fileKey = `tenant-123/${file.name}`;
    
    return {
      upload_url: `https://mock-r2-upload-url.com/${fileKey}`,
      file_key: fileKey,
      document_id: documentId,
      public_url: `https://mock-r2-public-url.com/${fileKey}`
    };
  },

  // NEW: Mock implementation for registering upload
  registerUpload: async (uploadData: RegisterUploadRequest): Promise<Document> => {
    const document: Document = {
      id: uploadData.document_id,
      filename: uploadData.file_name,
      originalName: uploadData.file_name,
      size: uploadData.file_size,
      mimeType: uploadData.mime_type,
      status: 'uploaded',
      uploadedAt: new Date().toISOString()
    };
    
    // Add to mock documents
    mockDocuments.unshift(document);
    
    // Simulate processing
    setTimeout(() => {
      const doc = mockDocuments.find(d => d.id === document.id);
      if (doc) {
        doc.status = 'processing';
      }
    }, 2000);
    
    setTimeout(() => {
      const doc = mockDocuments.find(d => d.id === document.id);
      if (doc) {
        doc.status = 'processed';
        doc.processedAt = new Date().toISOString();
      }
    }, 5000);
    
    return document;
  },

  uploadDocuments: async (
    files: File[],
    onProgress?: MultipleUploadProgressCallback | UploadProgressCallback
  ): Promise<UploadResponse> => {
    const documents: Document[] = [];
    let uploadId: string | undefined;

    // Create document objects for all files
    files.forEach(file => {
      documents.push({
        id: MockDataGenerator.generateId(),
        filename: `${MockDataGenerator.generateId()}_${file.name}`,
        originalName: file.name,
        size: file.size,
        mimeType: file.type,
        status: 'uploaded',
        uploadedAt: new Date().toISOString()
      });
    });

    // Generate uploadId only for multiple files
    if (files.length > 1) {
      uploadId = MockDataGenerator.generateId();
    }

    const response = await mockApiClient.uploadMultiple(
      { uploadId, documents },
      files.length,
      onProgress as MultipleUploadProgressCallback
    );

    // Add to mock documents
    mockDocuments.unshift(...documents);

    // Create upload status tracking only for multiple files
    if (uploadId) {
      mockUploadStatuses[uploadId] = {
        uploadId,
        status: 'processing',
        documents: documents.map(doc => ({
          id: doc.id,
          filename: doc.filename,
          status: 'uploaded',
          progress: 100
        }))
      };

      // Simulate processing for multiple files
      setTimeout(() => {
        const status = mockUploadStatuses[uploadId!];
        if (status) {
          status.documents.forEach((doc, index) => {
            setTimeout(() => {
              doc.status = 'processing';
              doc.progress = 50;
            }, index * 1000);
          });
        }
      }, 2000);

      setTimeout(() => {
        const status = mockUploadStatuses[uploadId!];
        if (status) {
          status.documents.forEach((doc, index) => {
            setTimeout(() => {
              doc.status = 'processed';
              doc.progress = 100;
              doc.processedAt = new Date().toISOString();
              
              // Update the main document as well
              const mainDoc = mockDocuments.find(d => d.id === doc.id);
              if (mainDoc) {
                mainDoc.status = 'processed';
                mainDoc.processedAt = doc.processedAt;
              }
            }, index * 500);
          });
          
          // Check if all are processed
          setTimeout(() => {
            if (status.documents.every(doc => doc.status === 'processed')) {
              status.status = 'completed';
            }
          }, status.documents.length * 500);
        }
      }, 5000);
    } else {
      // Simulate processing for single file
      const doc = documents[0];
      setTimeout(() => {
        const mainDoc = mockDocuments.find(d => d.id === doc.id);
        if (mainDoc) {
          mainDoc.status = 'processing';
        }
      }, 2000);

      setTimeout(() => {
        const mainDoc = mockDocuments.find(d => d.id === doc.id);
        if (mainDoc) {
          mainDoc.status = 'processed';
          mainDoc.processedAt = new Date().toISOString();
        }
      }, 5000);
    }

    return response;
  },

  getUploadStatus: async (uploadId: string): Promise<UploadStatusResponse> => {
    const status = mockUploadStatuses[uploadId];
    if (!status) {
      throw new Error('Upload not found');
    }
    return mockApiClient.get(status);
  },

  deleteDocument: async (documentId: string): Promise<void> => {
    const index = mockDocuments.findIndex(doc => doc.id === documentId);
    if (index === -1) {
      throw new Error('Document not found');
    }
    
    mockDocuments.splice(index, 1);
    return mockApiClient.delete();
  }
};
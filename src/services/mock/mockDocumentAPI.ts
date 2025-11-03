import { 
  Document, 
  GetDocumentsResponse, 
  UploadProgressCallback,
  MultipleUploadRequest,
  MultipleUploadResponse,
  UploadStatusResponse,
  MultipleUploadProgressCallback,
  DocumentUploadStatus
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

  uploadDocument: async (
    file: File, 
    onProgress?: UploadProgressCallback
  ): Promise<Document> => {
    const newDocument: Document = {
      id: MockDataGenerator.generateId(),
      filename: `${MockDataGenerator.generateId()}_${file.name}`,
      originalName: file.name,
      size: file.size,
      mimeType: file.type,
      status: 'uploaded',
      uploadedAt: new Date().toISOString()
    };

    const uploadedDoc = await mockApiClient.upload(newDocument, onProgress);
    mockDocuments.unshift(uploadedDoc);
    
    // Simulate processing after upload
    setTimeout(() => {
      const doc = mockDocuments.find(d => d.id === uploadedDoc.id);
      if (doc) {
        doc.status = 'processing';
      }
    }, 2000);

    setTimeout(() => {
      const doc = mockDocuments.find(d => d.id === uploadedDoc.id);
      if (doc) {
        doc.status = 'processed';
        doc.processedAt = new Date().toISOString();
      }
    }, 5000);

    return uploadedDoc;
  },

  uploadMultipleDocuments: async (
    files: File[],
    onProgress?: MultipleUploadProgressCallback
  ): Promise<MultipleUploadResponse> => {
    const uploadId = MockDataGenerator.generateId();
    const documents: Document[] = [];

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

    const response = await mockApiClient.uploadMultiple(
      { uploadId, documents },
      files.length,
      onProgress
    );

    // Add to mock documents
    mockDocuments.unshift(...documents);

    // Create upload status tracking
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

    // Simulate processing
    setTimeout(() => {
      const status = mockUploadStatuses[uploadId];
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
      const status = mockUploadStatuses[uploadId];
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
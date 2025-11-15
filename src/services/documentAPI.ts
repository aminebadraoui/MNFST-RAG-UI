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
    console.group('📄 getDocuments API Call');
    try {
      console.log('Fetching documents from /documents endpoint...');
      const response = await apiClient.get<DataResponse<Document[]>>('/documents');
      console.log('Response received:', response);
      console.log('Response data:', response.data);
      console.log('Documents array:', response.data.data);
      console.groupEnd();
      return response.data.data;
    } catch (error) {
      console.error('Error in getDocuments:', error);
      console.groupEnd();
      throw error;
    }
  },

  // File validation helper
  validateFile: (file: File): { valid: boolean; error?: string } => {
    // Check file size (10MB max)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      return {
        valid: false,
        error: `File size ${Math.round(file.size / 1024 / 1024)}MB exceeds maximum allowed size of 10MB`
      };
    }

    // Check file type
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'text/markdown'
    ];

    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: `File type ${file.type} is not supported. Supported types: PDF, DOCX, TXT, Markdown`
      };
    }

    // Check file extension matches MIME type
    const extensionMap: { [key: string]: string[] } = {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
      'text/markdown': ['.md', '.markdown']
    };

    const allowedExtensions = extensionMap[file.type] || [];
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    
    if (!allowedExtensions.includes(fileExtension)) {
      return {
        valid: false,
        error: `File extension ${fileExtension} does not match file type ${file.type}`
      };
    }

    return { valid: true };
  },

  // NEW: Get presigned URL from backend
  getPresignedUrl: async (file: File): Promise<PresignedUrlResponse> => {
    console.group('🔑 getPresignedUrl API Call');
    console.log('File details:', {
      name: file.name,
      type: file.type,
      size: file.size,
      lastModified: file.lastModified
    });
    
    try {
      const requestData = {
        fileName: file.name,
        mimeType: file.type,
        fileSize: file.size
      };
      console.log('Request data:', requestData);
      
      const response = await apiClient.post<DataResponse<PresignedUrlResponse>>('/documents/presigned-url', requestData);
      console.log('Presigned URL response:', response.data);
      console.log('Presigned URL data:', response.data.data);
      console.groupEnd();
      return response.data.data;
    } catch (error) {
      console.error('Error getting presigned URL:', error);
      console.groupEnd();
      throw error;
    }
  },

  // NEW: Register uploaded document with backend
  registerUpload: async (uploadData: RegisterUploadRequest): Promise<Document> => {
    console.group('📝 registerUpload API Call');
    console.log('Upload data:', uploadData);
    
    try {
      const response = await apiClient.post<DataResponse<Document>>('/documents/register-upload', uploadData);
      console.log('Register upload response:', response.data);
      console.log('Registered document:', response.data.data);
      console.groupEnd();
      return response.data.data;
    } catch (error) {
      console.error('Error registering upload:', error);
      console.groupEnd();
      throw error;
    }
  },

  // ENHANCED: Upload with R2 support
  uploadDocuments: async (
    files: File[],
    onProgress?: MultipleUploadProgressCallback | UploadProgressCallback
  ): Promise<UploadResponse> => {
    console.group('📤 uploadDocuments - Starting Document Upload Process');
    console.log('Files to upload:', files.map(f => ({
      name: f.name,
      type: f.type,
      size: f.size
    })));
    console.log('Total files:', files.length);
    
    const documents: Document[] = [];
    const errors: { file: string; error: string }[] = [];

    // Validate all files first
    console.log('🔍 Validating files...');
    for (const file of files) {
      console.log(`Validating file: ${file.name}`);
      const validation = documentAPI.validateFile(file);
      console.log(`Validation result for ${file.name}:`, validation);
      
      if (!validation.valid) {
        const error = {
          file: file.name,
          error: validation.error || 'Unknown validation error'
        };
        errors.push(error);
        console.error(`❌ Validation failed for ${file.name}:`, validation.error);
      } else {
        console.log(`✅ Validation passed for ${file.name}`);
      }
    }

    // If there are validation errors, throw them
    if (errors.length > 0) {
      const errorMessage = `Validation failed for ${errors.length} file(s):\n` +
        errors.map(e => `- ${e.file}: ${e.error}`).join('\n');
      console.error('❌ Upload validation failed:', errorMessage);
      console.groupEnd();
      throw new Error(errorMessage);
    }

    // Process each file
    console.log('🚀 Starting file upload process...');
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      console.log(`📁 Processing file ${i + 1}/${files.length}: ${file.name}`);
      
      try {
        // Step 1: Get presigned URL from backend
        console.log(`🔑 Step 1: Getting presigned URL for ${file.name}...`);
        const presignedData = await documentAPI.getPresignedUrl(file);
        // Validate the response structure
        if (!presignedData.uploadUrl || !presignedData.fileKey ||
            !presignedData.documentId || !presignedData.publicUrl) {
          throw new Error('Invalid presigned URL response: missing required fields');
        }

        // Validate uploadUrl is a string and has reasonable length
        if (typeof presignedData.uploadUrl !== 'string' || presignedData.uploadUrl.length === 0) {
          throw new Error('Invalid presigned URL: uploadUrl is not a valid string');
        }

        console.log(`✅ Presigned URL obtained for ${file.name}:`, {
          documentId: presignedData.documentId,
          fileKey: presignedData.fileKey,
          uploadUrlLength: presignedData.uploadUrl.length,
          publicUrl: presignedData.publicUrl
        });
        
        // Step 2: Upload directly to R2
        console.log(`⬆️ Step 2: Uploading ${file.name} to R2 storage...`);
        await uploadToR2(file, presignedData.uploadUrl, onProgress);
        console.log(`✅ Successfully uploaded ${file.name} to R2`);
        
        // Step 3: Register with backend
        console.log(`📝 Step 3: Registering ${file.name} with backend...`);
        const document = await documentAPI.registerUpload({
          documentId: presignedData.documentId,
          fileName: file.name,
          fileKey: presignedData.fileKey,
          publicUrl: presignedData.publicUrl,
          fileSize: file.size,
          mimeType: file.type
        });
        console.log(`✅ Successfully registered ${file.name} with backend:`, document);
        
        documents.push(document);
        console.log(`📊 Upload progress: ${documents.length}/${files.length} files completed`);
      } catch (error) {
        console.error(`❌ Upload failed for ${file.name}:`, error);
        console.error('Error details:', {
          name: error instanceof Error ? error.name : 'Unknown',
          message: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : 'No stack trace available'
        });
        console.groupEnd();
        throw new Error(`Failed to upload ${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    console.log(`🎉 All files uploaded successfully! Total: ${documents.length} documents`);
    console.groupEnd();
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
  console.group('☁️ uploadToR2 - Direct Upload to Cloudflare R2');
  console.log('File details:', {
    name: file.name,
    type: file.type,
    size: file.size,
    lastModified: file.lastModified
  });
  console.log('Upload URL:', uploadUrl);
  console.log('Upload URL length:', uploadUrl.length);
  
  // Parse upload URL to extract key information for logging
  try {
    const uploadUrlObj = new URL(uploadUrl);
    const bucket = uploadUrlObj.hostname;
    const key = uploadUrlObj.pathname.substring(1); // Remove leading slash
    console.log('🗂️ Upload target analysis:');
    console.log(`  - Bucket/Host: ${bucket}`);
    console.log(`  - File key: ${key}`);
    console.log(`  - URL params: ${uploadUrlObj.search}`);
  } catch (e) {
    console.warn('⚠️ Could not parse upload URL:', e);
  }
  
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const startTime = Date.now();
    
    xhr.upload.addEventListener('progress', (e) => {
      // Add defensive checks for progress event
      if (!e) {
        console.warn('⚠️ Progress event is null or undefined');
        return;
      }
      
      if (e.lengthComputable && onProgress && e.loaded !== undefined && e.total !== undefined) {
        const progress = Math.round((e.loaded / e.total) * 100);
        const elapsedTime = Date.now() - startTime;
        const uploadSpeed = e.loaded / (elapsedTime / 1000); // bytes per second
        
        console.log(`📊 Upload progress for ${file.name}: ${progress}% (${e.loaded}/${e.total} bytes)`);
        console.log(`⚡ Upload speed: ${(uploadSpeed / 1024 / 1024).toFixed(2)} MB/s`);
        
        if (typeof onProgress === 'function') {
          (onProgress as UploadProgressCallback)(progress);
        }
      } else {
        console.warn('⚠️ Progress event not lengthComputable or missing data:', {
          lengthComputable: e?.lengthComputable,
          loaded: e?.loaded,
          total: e?.total
        });
      }
    });
    
    xhr.addEventListener('load', () => {
      const elapsedTime = Date.now() - startTime;
      console.log(`✅ Upload completed for ${file.name} in ${elapsedTime}ms`);
      console.log('Response status:', xhr.status);
      console.log('Response status text:', xhr.statusText);
      console.log('Response headers:', xhr.getAllResponseHeaders());
      
      // Log response body if available
      try {
        if (xhr.responseText) {
          console.log('Response body:', xhr.responseText);
        }
      } catch (e) {
        console.warn('Could not read response body:', e);
      }
      
      if (xhr.status === 200) {
        console.log(`🎉 Successfully uploaded ${file.name} to R2`);
        console.log('📊 Upload summary:');
        console.log(`  - File size: ${(file.size / 1024 / 1024).toFixed(2)} MB`);
        console.log(`  - Upload time: ${(elapsedTime / 1000).toFixed(2)} seconds`);
        console.log(`  - Average speed: ${(file.size / (elapsedTime / 1000) / 1024 / 1024).toFixed(2)} MB/s`);
        console.groupEnd();
        resolve();
      } else {
        console.error(`❌ Upload failed for ${file.name} with status ${xhr.status}`);
        console.error('Response text:', xhr.responseText);
        console.groupEnd();
        reject(new Error(`Upload failed with status ${xhr.status}: ${xhr.statusText}`));
      }
    });
    
    xhr.addEventListener('error', () => {
      const elapsedTime = Date.now() - startTime;
      console.error(`❌ Network error during upload of ${file.name} after ${elapsedTime}ms`);
      console.error('XHR readyState:', xhr.readyState);
      console.error('XHR status:', xhr.status);
      console.error('XHR status text:', xhr.statusText);
      console.groupEnd();
      reject(new Error('Network error during upload'));
    });
    
    xhr.addEventListener('abort', () => {
      console.warn(`⚠️ Upload of ${file.name} was aborted`);
      console.groupEnd();
      reject(new Error('Upload was aborted'));
    });
    
    xhr.addEventListener('timeout', () => {
      console.error(`⏰ Upload of ${file.name} timed out`);
      console.groupEnd();
      reject(new Error('Upload timed out'));
    });
    
    console.log(`🚀 Starting upload of ${file.name} to R2...`);
    console.log('📋 Upload configuration:');
    console.log(`  - Method: PUT`);
    console.log(`  - Content-Type: ${file.type}`);
    console.log(`  - Timeout: 10 minutes`);
    
    xhr.open('PUT', uploadUrl);
    xhr.setRequestHeader('Content-Type', file.type);
    
    // Set timeout to 10 minutes
    xhr.timeout = 10 * 60 * 1000;
    
    xhr.send(file);
  });
};
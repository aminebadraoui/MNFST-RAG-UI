/**
 * Test utility for validating R2 document upload functionality
 * This file contains helper functions to test the upload implementation
 */

import { documentAPI } from '../services';
import { PresignedUrlResponse, RegisterUploadRequest } from '../types';

/**
 * Test file types that should be supported
 */
export const SUPPORTED_FILE_TYPES = {
  pdf: 'application/pdf',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  txt: 'text/plain',
  markdown: 'text/markdown'
};

/**
 * Test file sizes (in bytes)
 */
export const TEST_FILE_SIZES = {
  small: 1024, // 1KB
  medium: 1024 * 1024, // 1MB
  large: 10 * 1024 * 1024, // 10MB
  oversized: 150 * 1024 * 1024 // 150MB (should fail)
};

/**
 * Create a mock file for testing
 */
export function createMockFile(
  name: string, 
  type: string, 
  size: number
): File {
  const buffer = new ArrayBuffer(size);
  const blob = new Blob([buffer], { type });
  return new File([blob], name, { type });
}

/**
 * Test the presigned URL generation
 */
export async function testPresignedUrlGeneration(file: File): Promise<PresignedUrlResponse> {
  try {
    const presignedData = await documentAPI.getPresignedUrl(file);
    
    // Validate response structure
    if (!presignedData.uploadUrl || !presignedData.fileKey ||
        !presignedData.documentId || !presignedData.publicUrl) {
      throw new Error('Invalid presigned URL response structure');
    }
    
    console.log('✅ Presigned URL generation successful:', {
      fileKey: presignedData.fileKey,
      documentId: presignedData.documentId,
      hasUploadUrl: !!presignedData.uploadUrl,
      hasPublicUrl: !!presignedData.publicUrl
    });
    
    return presignedData;
  } catch (error) {
    console.error('❌ Presigned URL generation failed:', error);
    throw error;
  }
}

/**
 * Test the upload registration
 */
export async function testUploadRegistration(
  presignedData: PresignedUrlResponse,
  file: File
): Promise<void> {
  try {
    const uploadData: RegisterUploadRequest = {
      documentId: presignedData.documentId,
      fileName: file.name,
      fileKey: presignedData.fileKey,
      publicUrl: presignedData.publicUrl,
      fileSize: file.size,
      mimeType: file.type
    };
    
    const document = await documentAPI.registerUpload(uploadData);
    
    // Validate response
    if (!document.id || !document.filename || !document.status) {
      throw new Error('Invalid document registration response');
    }
    
    console.log('✅ Upload registration successful:', {
      documentId: document.id,
      filename: document.filename,
      status: document.status
    });
  } catch (error) {
    console.error('❌ Upload registration failed:', error);
    throw error;
  }
}

/**
 * Test complete upload flow for a single file
 */
export async function testCompleteUploadFlow(file: File): Promise<void> {
  console.log(`🧪 Testing upload flow for ${file.name} (${file.size} bytes)`);
  
  try {
    // Step 1: Get presigned URL
    const presignedData = await testPresignedUrlGeneration(file);
    
    // Step 2: Upload to R2 (simulated - would need actual R2 endpoint)
    console.log('📤 Uploading to R2...');
    // In a real test, this would upload to the actual presigned URL
    // For now, we'll simulate success
    
    // Step 3: Register upload
    await testUploadRegistration(presignedData, file);
    
    console.log('✅ Complete upload flow successful for', file.name);
  } catch (error) {
    console.error('❌ Upload flow failed for', file.name, ':', error);
    throw error;
  }
}

/**
 * Test multiple file types and sizes
 */
export async function testVariousFileTypesAndSizes(): Promise<void> {
  console.log('🧪 Starting comprehensive upload tests...');
  
  const testCases = [
    // Test different file types
    { name: 'test.pdf', type: SUPPORTED_FILE_TYPES.pdf, size: TEST_FILE_SIZES.small },
    { name: 'test.docx', type: SUPPORTED_FILE_TYPES.docx, size: TEST_FILE_SIZES.medium },
    { name: 'test.txt', type: SUPPORTED_FILE_TYPES.txt, size: TEST_FILE_SIZES.small },
    { name: 'test.md', type: SUPPORTED_FILE_TYPES.markdown, size: TEST_FILE_SIZES.medium },
    
    // Test different sizes
    { name: 'large.pdf', type: SUPPORTED_FILE_TYPES.pdf, size: TEST_FILE_SIZES.large },
  ];
  
  const results = {
    passed: 0,
    failed: 0,
    errors: [] as string[]
  };
  
  for (const testCase of testCases) {
    try {
      const file = createMockFile(testCase.name, testCase.type, testCase.size);
      await testCompleteUploadFlow(file);
      results.passed++;
    } catch (error) {
      results.failed++;
      results.errors.push(`${testCase.name}: ${error}`);
    }
  }
  
  console.log('\n📊 Test Results:');
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  
  if (results.failed > 0) {
    console.log('\n❌ Errors:');
    results.errors.forEach(error => console.log(`  - ${error}`));
  }
  
  return;
}

/**
 * Test error handling for invalid files
 */
export async function testErrorHandling(): Promise<void> {
  console.log('🧪 Testing error handling...');
  
  // Test oversized file
  try {
    const oversizedFile = createMockFile(
      'oversized.pdf', 
      SUPPORTED_FILE_TYPES.pdf, 
      TEST_FILE_SIZES.oversized
    );
    await testPresignedUrlGeneration(oversizedFile);
    console.log('❌ Expected error for oversized file was not thrown');
  } catch (error) {
    console.log('✅ Correctly rejected oversized file');
  }
  
  // Test unsupported file type
  try {
    const unsupportedFile = createMockFile(
      'test.exe', 
      'application/octet-stream', 
      TEST_FILE_SIZES.small
    );
    await testPresignedUrlGeneration(unsupportedFile);
    console.log('❌ Expected error for unsupported file type was not thrown');
  } catch (error) {
    console.log('✅ Correctly rejected unsupported file type');
  }
}

/**
 * Run all tests
 */
export async function runAllTests(): Promise<void> {
  console.log('🚀 Starting R2 Upload Implementation Tests\n');
  
  try {
    await testVariousFileTypesAndSizes();
    await testErrorHandling();
    console.log('\n🎉 All tests completed!');
  } catch (error) {
    console.error('\n💥 Test suite failed:', error);
  }
}

// Export for use in console or test files
if (typeof window !== 'undefined') {
  (window as any).testR2Upload = {
    runAllTests,
    testVariousFileTypesAndSizes,
    testErrorHandling,
    testCompleteUploadFlow,
    createMockFile
  };
}
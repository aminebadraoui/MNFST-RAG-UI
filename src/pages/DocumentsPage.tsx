import React, { useState, useEffect, useMemo } from 'react';
import {
  DocumentTextIcon,
  ArrowUpTrayIcon,
  TrashIcon,
  EyeIcon,
  DocumentIcon,
  ChevronUpDownIcon
} from '@heroicons/react/24/outline';
import { documentAPI } from '../services';
import { Document } from '../types';

type SortField = 'name' | 'uploadedAt' | 'type';
type SortOrder = 'asc' | 'desc';

const DocumentsPage: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [sortField, setSortField] = useState<SortField>('uploadedAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  // Fetch documents on component mount
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const documents = await documentAPI.getDocuments();
        // Ensure we always set an array
        setDocuments(Array.isArray(documents) ? documents : []);
      } catch (err: any) {
        setError(err.message || 'Failed to load documents');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.includes('pdf')) {
      return <DocumentTextIcon className="h-8 w-8 text-red-500 dark:text-red-400" />;
    } else if (mimeType.includes('word') || mimeType.includes('document')) {
      return <DocumentIcon className="h-8 w-8 text-blue-500 dark:text-blue-400" />;
    } else if (mimeType.includes('text')) {
      return <DocumentIcon className="h-8 w-8 text-light-text-tertiary dark:text-dark-text-tertiary" />;
    } else if (mimeType.includes('markdown')) {
      return <DocumentIcon className="h-8 w-8 text-purple-500 dark:text-purple-400" />;
    } else {
      return <DocumentIcon className="h-8 w-8 text-light-text-quaternary dark:text-dark-text-quaternary" />;
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const sortedDocuments = useMemo(() => {
    const sorted = [...documents].sort((a, b) => {
      let aValue: string | Date;
      let bValue: string | Date;

      switch (sortField) {
        case 'name':
          aValue = a.originalName.toLowerCase();
          bValue = b.originalName.toLowerCase();
          break;
        case 'uploadedAt':
          aValue = a.uploadedAt;
          bValue = b.uploadedAt;
          break;
        case 'type':
          aValue = a.mimeType;
          bValue = b.mimeType;
          break;
        default:
          aValue = a.originalName.toLowerCase();
          bValue = b.originalName.toLowerCase();
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [documents, sortField, sortOrder]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files) as File[];
    if (files.length === 0) return;
    
    await handleFileUpload(files);
  };

  const handleFileUpload = async (files: File[]) => {
    try {
      setError(null);
      
      // Upload all files using the R2-based flow
      await documentAPI.uploadDocuments(files, (progress: number) => {
        // For now, we'll just log progress - could be enhanced with UI progress bar
        console.log(`Upload progress: ${progress}%`);
      });
      
      // Refresh documents list
      const documents = await documentAPI.getDocuments();
      // Ensure we always set an array
      setDocuments(Array.isArray(documents) ? documents : []);
    } catch (err: any) {
      // Enhanced error handling for R2-specific errors
      if (err.message.includes('Validation failed')) {
        setError(err.message);
      } else if (err.message.includes('presigned')) {
        setError('Failed to get upload permission. Please try again.');
      } else if (err.message.includes('status 4')) {
        setError('File upload failed. Please check the file format and size.');
      } else if (err.message.includes('network') || err.message.includes('timeout')) {
        setError('Network error during upload. Please check your connection and try again.');
      } else {
        setError(err.message || 'Failed to upload documents');
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    handleFileUpload(Array.from(files));
  };

  const handleDeleteDocument = async (documentId: string) => {
    try {
      await documentAPI.deleteDocument(documentId);
      // Refresh documents list
      const documents = await documentAPI.getDocuments();
      // Ensure we always set an array
      setDocuments(Array.isArray(documents) ? documents : []);
    } catch (err: any) {
      setError(err.message || 'Failed to delete document');
    }
  };

  const handleViewDocument = (publicUrl: string) => {
    if (publicUrl) {
      window.open(publicUrl, '_blank');
    } else {
      setError('Document URL not available');
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-light-text-primary dark:text-dark-text-primary">Document Management</h1>
        <p className="mt-1 text-sm text-light-text-secondary dark:text-dark-text-secondary">
          Upload and manage documents for your RAG system.
        </p>
      </div>

      {/* Upload Area */}
      <div className="mb-6">
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragOver
              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900'
              : 'border-light-border-primary dark:border-dark-border-primary hover:border-light-border-secondary dark:hover:border-dark-border-secondary'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <ArrowUpTrayIcon className="mx-auto h-12 w-12 text-light-text-quaternary dark:text-dark-text-quaternary" />
          <p className="mt-2 text-sm text-light-text-secondary dark:text-dark-text-secondary">
            Drag and drop your documents here, or{' '}
            <label htmlFor="file-upload" className="font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300 cursor-pointer">
              click to browse
            </label>
          </p>
          <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary mt-1">
            Supports PDF, DOCX, TXT, and Markdown files up to 10MB
          </p>
          <input
            id="file-upload"
            type="file"
            multiple
            accept=".pdf,.docx,.txt,.md,.markdown,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain,text/markdown"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <p className="mt-2 text-light-text-secondary dark:text-dark-text-secondary">Loading documents...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-md mb-6">
          {error}
        </div>
      )}

      {/* Documents List */}
      {!isLoading && !error && (
        <div className="bg-light-bg-secondary dark:bg-dark-bg-secondary shadow rounded-lg border border-light-border-primary dark:border-dark-border-primary">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-light-text-primary dark:text-dark-text-primary">Uploaded Documents</h3>
              <span className="text-sm text-light-text-tertiary dark:text-dark-text-tertiary">Total: {documents.length}</span>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-light-border-primary dark:divide-dark-border-primary">
                <thead className="bg-light-bg-tertiary dark:bg-dark-bg-tertiary">
                  <tr>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-light-text-quaternary dark:text-dark-text-quaternary uppercase tracking-wider cursor-pointer hover:bg-light-bg-quaternary dark:hover:bg-dark-bg-quaternary"
                      onClick={() => handleSort('name')}
                    >
                      <div className="flex items-center">
                        Name
                        <ChevronUpDownIcon className="ml-1 h-4 w-4" />
                      </div>
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-light-text-quaternary dark:text-dark-text-quaternary uppercase tracking-wider cursor-pointer hover:bg-light-bg-quaternary dark:hover:bg-dark-bg-quaternary"
                      onClick={() => handleSort('type')}
                    >
                      <div className="flex items-center">
                        Kind
                        <ChevronUpDownIcon className="ml-1 h-4 w-4" />
                      </div>
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-light-text-quaternary dark:text-dark-text-quaternary uppercase tracking-wider cursor-pointer hover:bg-light-bg-quaternary dark:hover:bg-dark-bg-quaternary"
                      onClick={() => handleSort('uploadedAt')}
                    >
                      <div className="flex items-center">
                        Uploaded
                        <ChevronUpDownIcon className="ml-1 h-4 w-4" />
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-light-text-quaternary dark:text-dark-text-quaternary uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-light-bg-secondary dark:bg-dark-bg-secondary divide-y divide-light-border-primary dark:divide-dark-border-primary">
                  {sortedDocuments.map((doc) => (
                    <tr key={doc.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            {getFileIcon(doc.mimeType)}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">{doc.originalName}</div>
                            <div className="text-sm text-light-text-tertiary dark:text-dark-text-tertiary">
                              Status: <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                doc.status === 'processed' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200' :
                                doc.status === 'processing' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200' :
                                doc.status === 'error' ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200' :
                                'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                              }`}>
                                {doc.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-light-text-tertiary dark:text-dark-text-tertiary">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-light-bg-tertiary dark:bg-dark-bg-tertiary text-light-text-secondary dark:text-dark-text-secondary">
                          {doc.mimeType.split('/')[1]?.toUpperCase() || 'UNKNOWN'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-light-text-tertiary dark:text-dark-text-tertiary">
                        {doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString() :
                         (doc as any).created_at ? new Date((doc as any).created_at).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            className="text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-300"
                            onClick={() => handleViewDocument(doc.publicUrl || '')}
                            title="View Document"
                          >
                            <EyeIcon className="h-5 w-5" />
                          </button>
                          <button
                            className="text-red-600 hover:text-red-900 dark:hover:text-red-400"
                            onClick={() => handleDeleteDocument(doc.id)}
                            title="Delete Document"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {!isLoading && !error && documents.length === 0 && (
              <div className="text-center py-12">
                <p className="text-light-text-tertiary dark:text-dark-text-tertiary">No documents found.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentsPage;
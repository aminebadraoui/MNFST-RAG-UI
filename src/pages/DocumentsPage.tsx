import React, { useState, useMemo } from 'react';
import {
  DocumentTextIcon,
  ArrowUpTrayIcon,
  TrashIcon,
  EyeIcon,
  DocumentIcon,
  ChevronUpDownIcon
} from '@heroicons/react/24/outline';

interface Document {
  id: string;
  name: string;
  type: 'pdf' | 'docx' | 'txt' | 'md';
  size: number;
  uploadedAt: Date;
  pages?: number;
}

type SortField = 'name' | 'uploadedAt' | 'type';
type SortOrder = 'asc' | 'desc';

const DocumentsPage: React.FC = () => {
  const [documents] = useState<Document[]>([
    {
      id: '1',
      name: 'Product_Manual_2024.pdf',
      type: 'pdf',
      size: 2457600,
      uploadedAt: new Date('2024-01-15T10:30:00'),
      pages: 45,
    },
    {
      id: '2',
      name: 'Technical_Specifications.docx',
      type: 'docx',
      size: 1024000,
      uploadedAt: new Date('2024-01-14T14:20:00'),
      pages: 23,
    },
    {
      id: '3',
      name: 'Meeting_Notes_January.txt',
      type: 'txt',
      size: 25600,
      uploadedAt: new Date('2024-01-13T09:15:00'),
      pages: 3,
    },
    {
      id: '4',
      name: 'API_Documentation.md',
      type: 'md',
      size: 512000,
      uploadedAt: new Date('2024-01-12T16:45:00'),
    },
    {
      id: '5',
      name: 'User_Research_Findings.pdf',
      type: 'pdf',
      size: 3072000,
      uploadedAt: new Date('2024-01-11T11:30:00'),
    },
  ]);

  const [isDragOver, setIsDragOver] = useState(false);
  const [sortField, setSortField] = useState<SortField>('uploadedAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <DocumentTextIcon className="h-8 w-8 text-red-500" />;
      case 'docx':
        return <DocumentIcon className="h-8 w-8 text-blue-500" />;
      case 'txt':
        return <DocumentIcon className="h-8 w-8 text-gray-500" />;
      case 'md':
        return <DocumentIcon className="h-8 w-8 text-purple-500" />;
      default:
        return <DocumentIcon className="h-8 w-8 text-gray-400" />;
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
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'uploadedAt':
          aValue = a.uploadedAt;
          bValue = b.uploadedAt;
          break;
        case 'type':
          aValue = a.type;
          bValue = b.type;
          break;
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
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

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    // In a real app, this would handle file upload
    console.log('Files dropped:', e.dataTransfer.files);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Document Management</h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Upload and manage documents for your RAG system.
        </p>
      </div>

      {/* Upload Area */}
      <div className="mb-6">
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragOver
              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900'
              : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <ArrowUpTrayIcon className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Drag and drop your documents here, or{' '}
            <button className="font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300">
              click to browse
            </button>
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Supports PDF, DOCX, TXT, and Markdown files up to 10MB
          </p>
        </div>
      </div>

      {/* Documents List */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Uploaded Documents</h3>
            <span className="text-sm text-gray-500 dark:text-gray-400">Total: {documents.length}</span>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center">
                      Name
                      <ChevronUpDownIcon className="ml-1 h-4 w-4" />
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                    onClick={() => handleSort('type')}
                  >
                    <div className="flex items-center">
                      Kind
                      <ChevronUpDownIcon className="ml-1 h-4 w-4" />
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                    onClick={() => handleSort('uploadedAt')}
                  >
                    <div className="flex items-center">
                      Uploaded
                      <ChevronUpDownIcon className="ml-1 h-4 w-4" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {sortedDocuments.map((doc) => (
                  <tr key={doc.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          {getFileIcon(doc.type)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{doc.name}</div>
                          {doc.pages && (
                            <div className="text-sm text-gray-500 dark:text-gray-400">{doc.pages} pages</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                        {doc.type.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {doc.uploadedAt.toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-300">
                          <EyeIcon className="h-5 w-5" />
                        </button>
                        <button className="text-red-600 hover:text-red-900 dark:hover:text-red-400">
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentsPage;
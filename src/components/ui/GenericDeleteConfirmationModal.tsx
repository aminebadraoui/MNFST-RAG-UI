import * as React from 'react';
import { useState } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';

interface GenericDeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText: string;
  cancelText?: string;
  isDeleting?: boolean;
}

const GenericDeleteConfirmationModal: React.FC<GenericDeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  cancelText = 'Cancel',
  isDeleting = false
}) => {
  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await onConfirm();
      onClose();
    } catch (error: any) {
      console.error('Delete operation failed:', error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" title={title}>
      <form onSubmit={handleConfirm} className="space-y-4">
        <div className="text-center py-4">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900 mb-4">
            <svg className="h-6 w-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-light-text-primary dark:text-dark-text-primary mb-2">
            {title}
          </h3>
          <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mb-4">
            {message}
          </p>
        </div> 

        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
          <h4 className="font-medium text-red-800 dark:text-red-200 mb-2">Warning: This action cannot be undone</h4>
          <p className="text-sm text-red-700 dark:text-red-300">
            Please confirm that you want to proceed with this deletion.
          </p>
        </div> 

        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isDeleting}
          >
            {cancelText}
          </Button>
          <Button
            type="submit"
            variant="danger"
            loading={isDeleting}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : confirmText}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export { GenericDeleteConfirmationModal };
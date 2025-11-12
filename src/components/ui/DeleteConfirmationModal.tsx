import * as React from 'react';
import { useState } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { Input } from './Input';
import { Tenant } from '../../types';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  tenant: Tenant | null;
  isDeleting?: boolean;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  tenant,
  isDeleting = false
}) => {
  const [confirmationText, setConfirmationText] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Reset form when modal opens/closes
  React.useEffect(() => {
    if (isOpen) {
      setConfirmationText('');
      setError(null);
    }
  }, [isOpen]);

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!tenant) {
      return;
    }

    // Verify user typed the tenant name exactly
    if (confirmationText !== tenant.name) {
      setError('Please type the tenant name exactly as shown to confirm deletion');
      return;
    }

    try {
      await onConfirm();
      onClose();
    } catch (error: any) {
      setError(error.message || 'Failed to delete tenant');
    }
  };

  const handleTextChange = (value: string) => {
    setConfirmationText(value);
    if (error) {
      setError(null);
    }
  };

  if (!tenant) {
    return null;
  }

  const isConfirmDisabled = confirmationText !== tenant.name || isDeleting;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" title="Delete Tenant">
      <form onSubmit={handleConfirm} className="space-y-4">
        <div className="text-center py-4">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900 mb-4">
            <svg className="h-6 w-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-light-text-primary dark:text-dark-text-primary mb-2">
            Delete Tenant: {tenant.name}
          </h3>
          <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mb-4">
            This action cannot be undone. This will permanently delete the tenant and all associated data.
          </p>
        </div>

        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
          <h4 className="font-medium text-red-800 dark:text-red-200 mb-2">Warning: This will delete:</h4>
          <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
            <li>• The tenant "{tenant.name}"</li>
            <li>• All users associated with this tenant</li>
            <li>• All documents uploaded by users in this tenant</li>
            <li>• All social links and other tenant-specific data</li>
          </ul>
        </div>

        <div className="bg-light-bg-secondary dark:bg-dark-bg-secondary rounded-md p-4">
          <h4 className="font-medium text-light-text-primary dark:text-dark-text-primary mb-2">Tenant Information:</h4>
          <div className="text-sm text-light-text-secondary dark:text-dark-text-secondary space-y-1">
            <p><strong>Name:</strong> {tenant.name}</p>
            <p><strong>Slug:</strong> {tenant.slug}</p>
            <p><strong>Users:</strong> {tenant.userCount || 0}</p>
            <p><strong>Documents:</strong> {tenant.documentCount || 0}</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-2">
            To confirm deletion, type <span className="font-mono bg-light-bg-tertiary dark:bg-dark-bg-tertiary px-2 py-1 rounded">{tenant.name}</span> below:
          </label>
          <Input
            value={confirmationText}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleTextChange(e.target.value)}
            placeholder="Type tenant name to confirm"
            disabled={isDeleting}
          />
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="danger"
            loading={isDeleting}
            disabled={isConfirmDisabled}
          >
            {isDeleting ? 'Deleting...' : 'Delete Tenant'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export { DeleteConfirmationModal };
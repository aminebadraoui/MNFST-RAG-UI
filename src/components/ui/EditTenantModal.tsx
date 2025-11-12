import * as React from 'react';
import { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { Input } from './Input';
import { tenantAPI } from '../../services';
import { Tenant, UpdateTenantRequest } from '../../types';

interface EditTenantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (tenant: Tenant) => void;
  tenant: Tenant | null;
}

interface FormErrors {
  name?: string;
  slug?: string;
  general?: string;
}

const EditTenantModal: React.FC<EditTenantModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  tenant
}) => {
  const [formData, setFormData] = useState({
    name: '',
    slug: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [updatedTenant, setUpdatedTenant] = useState<Tenant | null>(null);

  // Initialize form data when tenant changes
  useEffect(() => {
    if (tenant) {
      setFormData({
        name: tenant.name,
        slug: tenant.slug
      });
    } else {
      setFormData({
        name: '',
        slug: ''
      });
    }
    setErrors({});
    setIsSuccess(false);
    setUpdatedTenant(null);
  }, [tenant, isOpen]);

  const generateSlugFromName = (name: string): string => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .trim();
  };

  const handleNameChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      name: value,
      slug: generateSlugFromName(value)
    }));
    // Clear errors when user starts typing
    if (errors.name) {
      setErrors(prev => ({ ...prev, name: undefined }));
    }
    if (errors.slug) {
      setErrors(prev => ({ ...prev, slug: undefined }));
    }
  };

  const handleSlugChange = (value: string) => {
    setFormData(prev => ({ ...prev, slug: value }));
    // Clear error when user starts typing
    if (errors.slug) {
      setErrors(prev => ({ ...prev, slug: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Tenant name is required';
    }

    if (!formData.slug.trim()) {
      newErrors.slug = 'Tenant slug is required';
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug = 'Slug can only contain lowercase letters, numbers, and hyphens';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !tenant) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      // Only include fields that have changed
      const updateData: UpdateTenantRequest = {};
      if (formData.name !== tenant.name) {
        updateData.name = formData.name;
      }
      if (formData.slug !== tenant.slug) {
        updateData.slug = formData.slug;
      }

      // If nothing changed, just close the modal
      if (Object.keys(updateData).length === 0) {
        onClose();
        return;
      }

      const response = await tenantAPI.updateTenant(tenant.id, updateData);
      setUpdatedTenant(response);
      setIsSuccess(true);
      onSuccess(response);
    } catch (error: any) {
      console.error('Error updating tenant:', error);
      let errorMessage = 'Failed to update tenant. Please try again.';
      
      if (error.message) {
        if (error.message.includes('already exists')) {
          if (error.message.includes('slug')) {
            errorMessage = 'A tenant with this slug already exists. Please choose a different slug.';
          } else {
            errorMessage = error.message;
          }
        } else {
          errorMessage = error.message;
        }
      }
      
      setErrors({
        general: errorMessage
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  if (!tenant) {
    return null;
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="md" title="Edit Tenant">
      {isSuccess && updatedTenant ? (
        <div className="text-center py-6">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 mb-4">
            <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-light-text-primary dark:text-dark-text-primary mb-2">
            Tenant Updated Successfully!
          </h3>
          <div className="mt-4 p-4 bg-light-bg-secondary dark:bg-dark-bg-secondary rounded-md text-left">
            <h4 className="font-medium text-light-text-primary dark:text-dark-text-primary mb-2">Updated Details:</h4>
            <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
              <strong>Name:</strong> {updatedTenant.name}
            </p>
            <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
              <strong>Slug:</strong> {updatedTenant.slug}
            </p>
          </div>
          <div className="mt-6 flex justify-center">
            <Button onClick={handleClose}>
              Done
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {errors.general && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-md">
              {errors.general}
            </div>
          )}

          <div>
            <Input
              label="Tenant Name"
              value={formData.name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleNameChange(e.target.value)}
              error={errors.name}
              placeholder="Enter tenant name"
              disabled={isSubmitting}
            />
            <p className="mt-1 text-sm text-light-text-tertiary dark:text-dark-text-tertiary">
              This is the display name for the tenant
            </p>
          </div>

          <div>
            <Input
              label="Admin Email"
              value={tenant?.adminUser?.email || ''}
              disabled={true}
              placeholder="No admin email available"
            />
            <p className="mt-1 text-sm text-light-text-tertiary dark:text-dark-text-tertiary">
              Email of the tenant admin (read-only)
            </p>
          </div>

          <div>
            <Input
              label="Tenant Slug"
              value={formData.slug}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSlugChange(e.target.value)}
              error={errors.slug}
              placeholder="tenant-slug"
              disabled={isSubmitting}
            />
            <p className="mt-1 text-sm text-light-text-tertiary dark:text-dark-text-tertiary">
              URL-safe identifier for the tenant. Only lowercase letters, numbers, and hyphens are allowed.
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={isSubmitting}
              disabled={isSubmitting || (formData.name === tenant.name && formData.slug === tenant.slug)}
            >
              {isSubmitting ? 'Updating...' : 'Update Tenant'}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};

export { EditTenantModal };
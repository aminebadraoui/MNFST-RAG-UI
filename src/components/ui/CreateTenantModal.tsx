import * as React from 'react';
import { useState } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { Input } from './Input';
import { tenantAPI } from '../../services';
import { CreateTenantRequest, CreateTenantResponse } from '../../types';

interface CreateTenantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (tenant: CreateTenantResponse) => void;
}

interface FormData {
  adminFirstName: string;
  adminLastName: string;
  adminEmail: string;
}

interface FormErrors {
  adminFirstName?: string;
  adminLastName?: string;
  adminEmail?: string;
  general?: string;
}

const CreateTenantModal: React.FC<CreateTenantModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [formData, setFormData] = useState<FormData>({
    adminFirstName: '',
    adminLastName: '',
    adminEmail: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [createdTenant, setCreatedTenant] = useState<CreateTenantResponse | null>(null);

  const generateTenantNameAndSlug = (firstName: string, lastName: string): { name: string; slug: string } => {
    // Generate tenant name from admin name
    const tenantName = `${firstName} ${lastName}`;
    
    // Generate URL-safe slug from tenant name
    const slug = tenantName
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .trim();
    
    return { name: tenantName, slug };
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.adminFirstName.trim()) {
      newErrors.adminFirstName = 'First name is required';
    }

    if (!formData.adminLastName.trim()) {
      newErrors.adminLastName = 'Last name is required';
    }

    if (!formData.adminEmail.trim()) {
      newErrors.adminEmail = 'Admin email is required';
    } else if (!validateEmail(formData.adminEmail)) {
      newErrors.adminEmail = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const { name: tenantName, slug: tenantSlug } = generateTenantNameAndSlug(
        formData.adminFirstName,
        formData.adminLastName
      );
      
      console.log('Creating tenant with data:', {
        name: tenantName,
        slug: tenantSlug,
        admin_email: formData.adminEmail,
        admin_name: `${formData.adminFirstName} ${formData.adminLastName}`,
        admin_password: 'admin'
      });
      
      const tenantRequest: CreateTenantRequest = {
        name: tenantName,
        slug: tenantSlug,
        adminEmail: formData.adminEmail,
        adminName: `${formData.adminFirstName} ${formData.adminLastName}`,
        adminPassword: 'Admin123!' // Default password
      };

      const response = await tenantAPI.createTenant(tenantRequest);
      setCreatedTenant(response);
      setIsSuccess(true);
      onSuccess(response);
    } catch (error: any) {
      console.error('Error creating tenant:', error);
      let errorMessage = 'Failed to create tenant. Please try again.';
      
      if (error.message) {
        if (error.message.includes('already exists')) {
          if (error.message.includes('slug')) {
            errorMessage = 'A tenant with this identifier already exists. Please try different names.';
          } else if (error.message.includes('email')) {
            errorMessage = 'A user with this email already exists.';
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
      // Reset form state
      setFormData({
        adminFirstName: '',
        adminLastName: '',
        adminEmail: ''
      });
      setErrors({});
      setIsSuccess(false);
      setCreatedTenant(null);
      onClose();
    }
  };

  const handleCreateAnother = () => {
    setFormData({
      adminFirstName: '',
      adminLastName: '',
      adminEmail: ''
    });
    setErrors({});
    setIsSuccess(false);
    setCreatedTenant(null);
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="md" title="Create New Tenant">
      {isSuccess && createdTenant ? (
        <div className="text-center py-6">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 mb-4">
            <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-light-text-primary dark:text-dark-text-primary mb-2">
            Tenant Created Successfully!
          </h3>
          <div className="mt-4 p-4 bg-light-bg-secondary dark:bg-dark-bg-secondary rounded-md text-left">
            <h4 className="font-medium text-light-text-primary dark:text-dark-text-primary mb-2">Tenant Details:</h4>
            <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
              <strong>Name:</strong> {createdTenant.name}
            </p>
            <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
              <strong>Slug:</strong> {createdTenant.slug}
            </p>
            <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
              <strong>Admin Email:</strong> {createdTenant.adminUser?.email || 'N/A'}
            </p>
          </div>
          <div className="mt-6 flex gap-3 justify-center">
            <Button variant="secondary" onClick={handleCreateAnother}>
              Create Another
            </Button>
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
            <h3 className="text-lg font-medium text-light-text-primary dark:text-dark-text-primary mb-4">Admin User Information</h3>
            <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mb-4">
              The tenant name and slug will be automatically generated from the admin user's name.
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First Name"
                value={formData.adminFirstName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('adminFirstName', e.target.value)}
                error={errors.adminFirstName}
                placeholder="John"
                disabled={isSubmitting}
              />
              <Input
                label="Last Name"
                value={formData.adminLastName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('adminLastName', e.target.value)}
                error={errors.adminLastName}
                placeholder="Doe"
                disabled={isSubmitting}
              />
            </div>

            <div className="mt-4">
              <Input
                label="Email"
                type="email"
                value={formData.adminEmail}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('adminEmail', e.target.value)}
                error={errors.adminEmail}
                placeholder="admin@example.com"
                disabled={isSubmitting}
              />
            </div>

            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
              <p className="text-sm text-blue-700 dark:text-blue-400">
                <strong>Note:</strong> The admin user will be created with a default password of "Admin123!".
                The tenant should be instructed to change this password upon first login.
              </p>
            </div>
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
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create Tenant'}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};

export { CreateTenantModal };
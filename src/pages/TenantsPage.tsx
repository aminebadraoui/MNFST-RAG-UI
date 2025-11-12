import * as React from 'react';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { tenantAPI } from '../services';
import { Tenant, CreateTenantResponse } from '../types';
import { BuildingOfficeIcon } from '@heroicons/react/24/outline';
import { CreateTenantModal, EditTenantModal, DeleteConfirmationModal } from '../components/ui';

const TenantsPage: React.FC = () => {
  const { user } = useAuth();
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadTenants = async () => {
    try {
      setLoading(true);
      setError(null);
      const tenants = await tenantAPI.getTenants();
      setTenants(tenants);
    } catch (err: any) {
      setError(err.message || 'Failed to load tenants');
      setTenants([]); // Ensure tenants is always an array
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTenants();
  }, []);

  const handleCreateTenant = () => {
    setIsCreateModalOpen(true);
  };

  const handleTenantCreated = (tenant: CreateTenantResponse) => {
    // Refresh the tenants list to include the new tenant
    loadTenants();
  };

  const handleCloseModal = () => {
    setIsCreateModalOpen(false);
  };

  const handleEditTenant = (tenant: Tenant) => {
    setSelectedTenant(tenant);
    setIsEditModalOpen(true);
  };

  const handleDeleteTenant = (tenant: Tenant) => {
    setSelectedTenant(tenant);
    setIsDeleteModalOpen(true);
  };

  const handleTenantUpdated = (updatedTenant: Tenant) => {
    // Update the tenant in the list
    setTenants(prevTenants =>
      prevTenants.map(tenant =>
        tenant.id === updatedTenant.id ? updatedTenant : tenant
      )
    );
    setIsEditModalOpen(false);
    setSelectedTenant(null);
  };

  const handleCloseEditModal = () => {
    if (!isDeleting) {
      setIsEditModalOpen(false);
      setSelectedTenant(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedTenant) return;
    
    setIsDeleting(true);
    try {
      await tenantAPI.deleteTenant(selectedTenant.id);
      // Remove the tenant from the list
      setTenants(prevTenants =>
        prevTenants.filter(tenant => tenant.id !== selectedTenant.id)
      );
      setIsDeleteModalOpen(false);
      setSelectedTenant(null);
    } catch (error: any) {
      console.error('Error deleting tenant:', error);
      setError(error.message || 'Failed to delete tenant');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCloseDeleteModal = () => {
    if (!isDeleting) {
      setIsDeleteModalOpen(false);
      setSelectedTenant(null);
    }
  };

  if (user?.role !== 'superadmin') {
    return (
      <div className="min-h-screen bg-light-bg-primary dark:bg-dark-bg-primary flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-light-text-primary dark:text-dark-text-primary">Access Denied</h1>
          <p className="mt-2 text-light-text-secondary dark:text-dark-text-secondary">
            You don't have permission to access this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light-bg-primary dark:bg-dark-bg-primary">
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-light-text-primary dark:text-dark-text-primary">Tenant Management</h1>
            <button
              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              onClick={handleCreateTenant}
            >
              Create Tenant
            </button>
          </div>

          {loading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <p className="mt-2 text-light-text-secondary dark:text-dark-text-secondary">Loading tenants...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-md mb-6">
              {error}
            </div>
          )}

          {!loading && !error && tenants.length > 0 && (
            <div className="bg-light-bg-secondary dark:bg-dark-bg-secondary shadow overflow-hidden sm:rounded-md">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-light-border-primary dark:divide-dark-border-primary">
                  <thead className="bg-light-bg-tertiary dark:bg-dark-bg-tertiary">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-light-text-quaternary dark:text-dark-text-quaternary uppercase tracking-wider">
                        Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-light-text-quaternary dark:text-dark-text-quaternary uppercase tracking-wider">
                        Slug
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-light-text-quaternary dark:text-dark-text-quaternary uppercase tracking-wider">
                        Admin Email
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-light-text-quaternary dark:text-dark-text-quaternary uppercase tracking-wider">
                        Users
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-light-text-quaternary dark:text-dark-text-quaternary uppercase tracking-wider">
                        Documents
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-light-text-quaternary dark:text-dark-text-quaternary uppercase tracking-wider">
                        Created
                      </th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-light-bg-secondary dark:bg-dark-bg-secondary divide-y divide-light-border-primary dark:divide-dark-border-primary">
                    {tenants.map((tenant) => (
                      <tr key={tenant.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                          {tenant.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-light-text-tertiary dark:text-dark-text-tertiary">
                          {tenant.slug}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-light-text-tertiary dark:text-dark-text-tertiary">
                          {tenant.adminUser?.email || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-light-text-tertiary dark:text-dark-text-tertiary">
                          {tenant.userCount || 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-light-text-tertiary dark:text-dark-text-tertiary">
                          {tenant.documentCount || 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-light-text-tertiary dark:text-dark-text-tertiary">
                          {new Date(tenant.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                            onClick={() => handleEditTenant(tenant)}
                          >
                            Edit
                          </button>
                          <button
                            className="ml-2 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                            onClick={() => handleDeleteTenant(tenant)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {!loading && !error && tenants.length === 0 && (
            <div className="bg-light-bg-secondary dark:bg-dark-bg-secondary shadow overflow-hidden sm:rounded-md">
              <div className="text-center py-12">
                <div className="flex justify-center mb-4">
                  <BuildingOfficeIcon className="h-12 w-12 text-light-text-quaternary dark:text-dark-text-quaternary" />
                </div>
                <h3 className="text-lg font-medium text-light-text-primary dark:text-dark-text-primary mb-2">No tenants found</h3>
                <p className="text-light-text-tertiary dark:text-dark-text-tertiary mb-4">Get started by creating your first tenant.</p>
                <button
                  className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                  onClick={handleCreateTenant}
                >
                  Create Tenant
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <CreateTenantModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseModal}
        onSuccess={handleTenantCreated}
      />
      
      <EditTenantModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onSuccess={handleTenantUpdated}
        tenant={selectedTenant}
      />
      
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        tenant={selectedTenant}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default TenantsPage;
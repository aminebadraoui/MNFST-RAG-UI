import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { tenantAPI } from '../services';
import { Tenant } from '../types';

const TenantsPage: React.FC = () => {
  const { user } = useAuth();
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTenants = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await tenantAPI.getTenants();
        setTenants(response.data);
      } catch (err: any) {
        setError(err.message || 'Failed to load tenants');
      } finally {
        setLoading(false);
      }
    };

    loadTenants();
  }, []);

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
              onClick={() => {/* TODO: Open create tenant modal */}}
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

          {!loading && !error && (
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
                            onClick={() => {/* TODO: Edit tenant */}}
                          >
                            Edit
                          </button>
                          <button
                            className="ml-2 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                            onClick={() => {/* TODO: Delete tenant */}}
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
            <div className="text-center py-12">
              <p className="text-light-text-tertiary dark:text-dark-text-tertiary">No tenants found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TenantsPage;
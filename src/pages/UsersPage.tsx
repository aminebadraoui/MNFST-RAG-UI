import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services';
import { User, UserRole } from '../types';

const UsersPage: React.FC = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await userAPI.getUsers();
        setUsers(response.data);
      } catch (err: any) {
        setError(err.message || 'Failed to load users');
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  if (user?.role !== 'superadmin' && user?.role !== 'tenant_admin') {
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
            <h1 className="text-2xl font-semibold text-light-text-primary dark:text-dark-text-primary">
              User Management {user?.role === 'tenant_admin' && '(Tenant)'}
            </h1>
            <button
              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              onClick={() => {/* TODO: Open create user modal */}}
            >
              Create User
            </button>
          </div>

          {loading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <p className="mt-2 text-light-text-secondary dark:text-dark-text-secondary">Loading users...</p>
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
                        Email
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-light-text-quaternary dark:text-dark-text-quaternary uppercase tracking-wider">
                        Role
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-light-text-quaternary dark:text-dark-text-quaternary uppercase tracking-wider">
                        Tenant
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-light-text-quaternary dark:text-dark-text-quaternary uppercase tracking-wider">
                        Created
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-light-text-quaternary dark:text-dark-text-quaternary uppercase tracking-wider">
                        Last Login
                      </th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-light-bg-secondary dark:bg-dark-bg-secondary divide-y divide-light-border-primary dark:divide-dark-border-primary">
                    {users.map((userItem) => (
                      <tr key={userItem.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                          {userItem.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-light-text-tertiary dark:text-dark-text-tertiary">
                          {userItem.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            userItem.role === 'superadmin' ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200' :
                            userItem.role === 'tenant_admin' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200' :
                            'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
                          }`}>
                            {userItem.role === 'superadmin' ? 'Superadmin' :
                             userItem.role === 'tenant_admin' ? 'Tenant Admin' :
                             'User'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-light-text-tertiary dark:text-dark-text-tertiary">
                          {userItem.tenantId || 'System'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-light-text-tertiary dark:text-dark-text-tertiary">
                          {new Date(userItem.createdAt || '').toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-light-text-tertiary dark:text-dark-text-tertiary">
                          {userItem.lastLogin ? new Date(userItem.lastLogin).toLocaleDateString() : 'Never'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                            onClick={() => {/* TODO: Edit user */}}
                          >
                            Edit
                          </button>
                          <button
                            className="ml-2 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                            onClick={() => {/* TODO: Delete user */}}
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

          {!loading && !error && users.length === 0 && (
            <div className="text-center py-12">
              <p className="text-light-text-tertiary dark:text-dark-text-tertiary">No users found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UsersPage;
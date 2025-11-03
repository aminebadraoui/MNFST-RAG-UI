import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { UserRole } from '../types';

const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const { theme, setTheme } = useSettings();
  const [activeTab, setActiveTab] = useState<'api' | 'profile' | 'security' | 'appearance'>('appearance' as const);

  const tabs = [
    { id: 'appearance', name: 'Appearance', roles: ['superadmin', 'tenant_admin', 'user'] },
    { id: 'api', name: 'API Configuration', roles: ['superadmin', 'tenant_admin'] },
    { id: 'profile', name: 'Profile', roles: ['superadmin', 'tenant_admin', 'user'] },
    { id: 'security', name: 'Security', roles: ['superadmin', 'tenant_admin', 'user'] },
  ];

  const availableTabs = tabs.filter(tab =>
    !tab.roles || tab.roles.includes(user?.role as UserRole)
  );

  const handleThemeToggle = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="min-h-screen bg-light-bg-primary dark:bg-dark-bg-primary">
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-semibold text-light-text-primary dark:text-dark-text-primary">Settings</h1>
          <p className="mt-1 text-sm text-light-text-secondary dark:text-dark-text-secondary">
            Manage your account and application settings.
          </p>
          
          {/* Tab Navigation */}
          <div className="mt-6 border-b border-light-border-primary dark:border-dark-border-primary">
            <nav className="-mb-px flex space-x-8">
              {availableTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as 'api' | 'profile' | 'security')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                      : 'border-transparent text-light-text-tertiary hover:text-light-text-primary hover:border-light-border-secondary dark:text-dark-text-tertiary dark:hover:text-dark-text-primary'
                  }`}
                >
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="mt-6">
            {activeTab === 'appearance' && (
              <div className="bg-light-bg-primary dark:bg-dark-bg-secondary shadow rounded-lg border border-light-border-primary dark:border-dark-border-primary">
                <div className="px-4 py-5 sm:p-6">
                  <h2 className="text-lg font-medium text-light-text-primary dark:text-dark-text-primary mb-4">Appearance Settings</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-3">
                        Theme
                      </label>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <input
                            type="radio"
                            id="light-theme"
                            name="theme"
                            value="light"
                            checked={theme === 'light'}
                            onChange={() => setTheme('light')}
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-light-border-primary dark:border-dark-border-primary"
                          />
                          <label htmlFor="light-theme" className="ml-3 flex items-center cursor-pointer">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-light-bg-primary dark:bg-dark-bg-primary border-2 border-light-border-primary dark:border-dark-border-primary mr-3">
                              <div className="w-4 h-4 rounded-full bg-yellow-400"></div>
                            </div>
                            <span className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">Light Mode</span>
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="radio"
                            id="dark-theme"
                            name="theme"
                            value="dark"
                            checked={theme === 'dark'}
                            onChange={() => setTheme('dark')}
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-light-border-primary dark:border-dark-border-primary"
                          />
                          <label htmlFor="dark-theme" className="ml-3 flex items-center cursor-pointer">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-dark-bg-tertiary border-2 border-dark-border-primary mr-3">
                              <div className="w-4 h-4 rounded-full bg-gray-300"></div>
                            </div>
                            <span className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">Dark Mode</span>
                          </label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-light-border-primary dark:border-dark-border-primary">
                      <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                        Choose your preferred theme for the application. Your selection will be saved and applied the next time you log in.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'api' && (
              <div className="bg-light-bg-primary dark:bg-dark-bg-secondary shadow rounded-lg border border-light-border-primary dark:border-dark-border-primary">
                <div className="px-4 py-5 sm:p-6">
                  <h2 className="text-lg font-medium text-light-text-primary dark:text-dark-text-primary mb-4">API Configuration</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary">
                        API Base URL
                      </label>
                      <input
                        type="url"
                        className="mt-1 block w-full border-light-border-primary dark:border-dark-border-primary rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-bg-tertiary dark:text-dark-text-primary"
                        defaultValue={import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}
                        readOnly
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary">
                        Environment
                      </label>
                      <select
                        className="mt-1 block w-full border-light-border-primary dark:border-dark-border-primary rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-bg-tertiary dark:text-dark-text-primary"
                        defaultValue={import.meta.env.MODE || 'development'}
                      >
                        <option value="development">Development</option>
                        <option value="staging">Staging</option>
                        <option value="production">Production</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary">
                        Mock API
                      </label>
                      <div className="mt-1">
                        <label className="inline-flex items-center">
                          <input
                            type="checkbox"
                            className="rounded border-light-border-primary dark:border-dark-border-primary text-primary-600 shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-bg-tertiary dark:text-dark-text-primary"
                            defaultChecked={import.meta.env.VITE_USE_MOCK_API === 'true'}
                            readOnly
                          />
                          <span className="ml-2 text-sm text-light-text-secondary dark:text-dark-text-secondary">
                            Use mock API for development
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="bg-light-bg-primary dark:bg-dark-bg-secondary shadow rounded-lg border border-light-border-primary dark:border-dark-border-primary">
                <div className="px-4 py-5 sm:p-6">
                  <h2 className="text-lg font-medium text-light-text-primary dark:text-dark-text-primary mb-4">Profile Information</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary">
                        Name
                      </label>
                      <input
                        type="text"
                        className="mt-1 block w-full border-light-border-primary dark:border-dark-border-primary rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-bg-tertiary dark:text-dark-text-primary"
                        defaultValue={user?.name || ''}
                        readOnly
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary">
                        Email
                      </label>
                      <input
                        type="email"
                        className="mt-1 block w-full border-light-border-primary dark:border-dark-border-primary rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-bg-tertiary dark:text-dark-text-primary"
                        defaultValue={user?.email || ''}
                        readOnly
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary">
                        Role
                      </label>
                      <input
                        type="text"
                        className="mt-1 block w-full border-light-border-primary dark:border-dark-border-primary rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-bg-tertiary dark:text-dark-text-primary"
                        value={user?.role || ''}
                        readOnly
                      />
                    </div>

                    {user?.tenantId && (
                      <div>
                        <label className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary">
                          Tenant ID
                        </label>
                        <input
                          type="text"
                          className="mt-1 block w-full border-light-border-primary dark:border-dark-border-primary rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-bg-tertiary dark:text-dark-text-primary"
                          value={user.tenantId}
                          readOnly
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="bg-light-bg-primary dark:bg-dark-bg-secondary shadow rounded-lg border border-light-border-primary dark:border-dark-border-primary">
                <div className="px-4 py-5 sm:p-6">
                  <h2 className="text-lg font-medium text-light-text-primary dark:text-dark-text-primary mb-4">Security Settings</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <button className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-600 bg-light-bg-primary dark:bg-dark-bg-secondary hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                        Change Password
                      </button>
                    </div>

                    <div>
                      <button className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-600 bg-light-bg-primary dark:bg-dark-bg-secondary hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                        Enable Two-Factor Authentication
                      </button>
                    </div>

                    <div className="pt-4">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded border-light-border-primary dark:border-dark-border-primary text-primary-600 shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-bg-tertiary dark:text-dark-text-primary"
                          defaultChecked={true}
                        />
                        <label className="ml-2 text-sm text-light-text-secondary dark:text-dark-text-secondary">
                          Email notifications for security alerts
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
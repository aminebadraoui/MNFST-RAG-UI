import React from 'react';

const SettingsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
          <p className="mt-1 text-sm text-gray-600">
            Configure your application settings and API endpoints.
          </p>
          
          <div className="mt-6">
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="text-center text-gray-500">
                  <p>Settings page coming soon...</p>
                  <p className="mt-2 text-sm">This page will contain API configuration and application settings.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
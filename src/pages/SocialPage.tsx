import React, { useState } from 'react';
import {
  ShareIcon,
  PlusIcon,
  PencilIcon
} from '@heroicons/react/24/outline';

interface SocialAccount {
  id: string;
  platform: 'twitter' | 'linkedin' | 'facebook' | 'instagram';
  username: string;
  connected: boolean;
}

const SocialPage: React.FC = () => {
  const [accounts] = useState<SocialAccount[]>([
    {
      id: '1',
      platform: 'twitter',
      username: '@ragchat',
      connected: true,
    },
    {
      id: '2',
      platform: 'linkedin',
      username: 'RAG Chat Company',
      connected: true,
    },
    {
      id: '3',
      platform: 'facebook',
      username: 'RAGChat',
      connected: false,
    },
    {
      id: '4',
      platform: 'instagram',
      username: '@ragchat_ai',
      connected: true,
    },
  ]);

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'twitter':
        return <div className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center text-white font-bold text-sm">X</div>;
      case 'linkedin':
        return <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-sm">in</div>;
      case 'facebook':
        return <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center text-white font-bold text-sm">f</div>;
      case 'instagram':
        return <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">ig</div>;
      default:
        return <ShareIcon className="h-8 w-8 text-gray-400" />;
    }
  };


  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Social Media Management</h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Manage social media accounts and schedule posts for your RAG system.
        </p>
      </div>

      {/* Connected Accounts */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Connected Accounts</h3>
            <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-primary-600 dark:text-primary-400 bg-primary-100 dark:bg-primary-900 hover:bg-primary-200 dark:hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
              <PlusIcon className="h-4 w-4 mr-1" />
              Add Account
            </button>
          </div>
          <div className="space-y-3">
            {accounts.map((account) => (
              <div key={account.id} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex items-center">
                  <div className="flex-shrink-0 mr-3">
                    {getPlatformIcon(account.platform)}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{account.username}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">{account.platform}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {account.connected ? (
                    <>
                      <span className="px-2 py-1 text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full">Connected</span>
                      <button className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400">
                        <PencilIcon className="h-4 w-4" />
                      </button>
                    </>
                  ) : (
                    <button className="px-3 py-1 text-xs font-medium text-primary-600 dark:text-primary-400 bg-primary-100 dark:bg-primary-900 hover:bg-primary-200 dark:hover:bg-primary-800 rounded-full">
                      Connect
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialPage;
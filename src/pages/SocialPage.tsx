import React, { useState, useEffect } from 'react';
import {
  ShareIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { socialAPI } from '../services';
import { SocialLink } from '../types';

const SocialPage: React.FC = () => {
  const [links, setLinks] = useState<SocialLink[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch social links on component mount
  useEffect(() => {
    const fetchLinks = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await socialAPI.getLinks();
        setLinks(response.links);
      } catch (err: any) {
        setError(err.message || 'Failed to load social links');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLinks();
  }, []);

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'twitter':
        return <div className="w-8 h-8 bg-blue-400 dark:bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">X</div>;
      case 'linkedin':
        return <div className="w-8 h-8 bg-blue-600 dark:bg-blue-700 rounded flex items-center justify-center text-white font-bold text-sm">in</div>;
      case 'facebook':
        return <div className="w-8 h-8 bg-blue-500 dark:bg-blue-600 rounded flex items-center justify-center text-white font-bold text-sm">f</div>;
      case 'instagram':
        return <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 dark:from-purple-600 dark:to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-sm">ig</div>;
      case 'youtube':
        return <div className="w-8 h-8 bg-red-600 dark:bg-red-700 rounded flex items-center justify-center text-white font-bold text-sm">YT</div>;
      default:
        return <ShareIcon className="h-8 w-8 text-light-text-quaternary dark:text-dark-text-quaternary" />;
    }
  };

  const handleAddLink = async (url: string) => {
    try {
      await socialAPI.addLink(url);
      // Refresh links list
      const response = await socialAPI.getLinks();
      setLinks(response.links);
    } catch (err: any) {
      setError(err.message || 'Failed to add social link');
    }
  };

  const handleRemoveLink = async (linkId: string) => {
    try {
      await socialAPI.removeLink(linkId);
      // Refresh links list
      const response = await socialAPI.getLinks();
      setLinks(response.links);
    } catch (err: any) {
      setError(err.message || 'Failed to remove social link');
    }
  };


  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-light-text-primary dark:text-dark-text-primary">Social Media Management</h1>
        <p className="mt-1 text-sm text-light-text-secondary dark:text-dark-text-secondary">
          Manage social media accounts and schedule posts for your RAG system.
        </p>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <p className="mt-2 text-light-text-secondary dark:text-dark-text-secondary">Loading social links...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-md mb-6">
          {error}
        </div>
      )}

      {/* Connected Accounts */}
      {!isLoading && !error && (
        <div className="bg-light-bg-secondary dark:bg-dark-bg-secondary shadow rounded-lg border border-light-border-primary dark:border-dark-border-primary">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-light-text-primary dark:text-dark-text-primary">Social Links</h3>
              <button
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-primary-600 dark:text-primary-400 bg-primary-100 dark:bg-primary-900 hover:bg-primary-200 dark:hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                onClick={() => {
                  const url = prompt('Enter social media URL:');
                  if (url) handleAddLink(url);
                }}
              >
                <PlusIcon className="h-4 w-4 mr-1" />
                Add Link
              </button>
            </div>
            <div className="space-y-3">
              {links.map((link) => (
                <div key={link.id} className="flex items-center justify-between p-3 border border-light-border-primary dark:border-dark-border-primary rounded-lg">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 mr-3">
                      {getPlatformIcon(link.platform)}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">{link.url}</div>
                      <div className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary capitalize">{link.platform}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-1 text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-full">Connected</span>
                    <button
                      className="text-red-600 hover:text-red-900 dark:hover:text-red-400"
                      onClick={() => handleRemoveLink(link.id)}
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            {!isLoading && !error && links.length === 0 && (
              <div className="text-center py-12">
                <p className="text-light-text-tertiary dark:text-dark-text-tertiary">No social links found.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SocialPage;
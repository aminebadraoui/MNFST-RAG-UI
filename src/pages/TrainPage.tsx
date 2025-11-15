import React, { useState, useEffect } from 'react';
import {
  DocumentTextIcon,
  ShareIcon,
  PlayIcon,
  PhotoIcon,
  PlusIcon,
  ArrowUpTrayIcon,
  CogIcon,
  TrashIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { documentAPI } from '../services';
import { socialAPI } from '../services/socialAPI';
import { Document, XProfile, InstagramProfile, YouTubeChannel, YouTubePlaylist } from '../types';

type TabType = 'documents' | 'x' | 'instagram' | 'youtube';

const TrainPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('documents');
  const [documents, setDocuments] = useState<Document[]>([]);
  const [xProfiles, setXProfiles] = useState<XProfile[]>([]);
  const [instagramProfiles, setInstagramProfiles] = useState<InstagramProfile[]>([]);
  const [youtubeChannels, setYoutubeChannels] = useState<YouTubeChannel[]>([]);
  const [youtubePlaylists, setYoutubePlaylists] = useState<YouTubePlaylist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get the active tab from URL query parameter
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tab = urlParams.get('tab') as TabType;
    if (tab && ['documents', 'x', 'instagram', 'youtube'].includes(tab)) {
      setActiveTab(tab);
    }
  }, []);

  // Fetch data based on active tab
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        switch (activeTab) {
          case 'documents':
            const docs = await documentAPI.getDocuments();
            setDocuments(Array.isArray(docs) ? docs : []);
            break;
          case 'x':
            const xProfiles = await socialAPI.getXProfiles();
            setXProfiles(xProfiles);
            break;
          case 'instagram':
            const igProfiles = await socialAPI.getInstagramProfiles();
            setInstagramProfiles(igProfiles);
            break;
          case 'youtube':
            const [channels, playlists] = await Promise.all([
              socialAPI.getYouTubeChannels(),
              socialAPI.getYouTubePlaylists()
            ]);
            setYoutubeChannels(channels);
            setYoutubePlaylists(playlists);
            break;
        }
      } catch (err: any) {
        setError(err.message || `Failed to load ${activeTab} data`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [activeTab]);

  const tabs = [
    { id: 'documents', name: 'Documents', icon: DocumentTextIcon },
    { id: 'x', name: 'X (Twitter)', icon: ShareIcon },
    { id: 'instagram', name: 'Instagram', icon: PhotoIcon },
    { id: 'youtube', name: 'YouTube', icon: PlayIcon },
  ];

  const handleTabChange = (tabId: TabType) => {
    setActiveTab(tabId);
    // Update URL without page reload
    const url = new URL(window.location.href);
    url.searchParams.set('tab', tabId);
    window.history.pushState({}, '', url.toString());
  };

  const renderDocumentsTab = () => (
    <div className="space-y-6">
      <div className="bg-light-bg-secondary dark:bg-dark-bg-secondary rounded-lg border border-light-border-primary dark:border-dark-border-primary p-6">
        <h3 className="text-lg font-medium text-light-text-primary dark:text-dark-text-primary mb-4">Document Upload</h3>
        <p className="text-light-text-secondary dark:text-dark-text-secondary mb-4">
          Upload documents to train your AI models. Supports PDF, DOCX, TXT, and Markdown files.
        </p>
        <div className="border-2 border-dashed border-light-border-primary dark:border-dark-border-primary rounded-lg p-8 text-center">
          <ArrowUpTrayIcon className="mx-auto h-12 w-12 text-light-text-quaternary dark:text-dark-text-quaternary" />
          <p className="mt-2 text-sm text-light-text-secondary dark:text-dark-text-secondary">
            Drag and drop your documents here, or{' '}
            <label className="font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300 cursor-pointer">
              click to browse
            </label>
          </p>
          <input
            type="file"
            multiple
            accept=".pdf,.docx,.txt,.md,.markdown"
            className="hidden"
            onChange={(e) => {
              // Handle file upload
              console.log('File upload:', e.target.files);
            }}
          />
        </div>
      </div>

      <div className="bg-light-bg-secondary dark:bg-dark-bg-secondary rounded-lg border border-light-border-primary dark:border-dark-border-primary">
        <div className="px-6 py-4 border-b border-light-border-primary dark:border-dark-border-primary">
          <h3 className="text-lg font-medium text-light-text-primary dark:text-dark-text-primary">
            Uploaded Documents ({documents.length})
          </h3>
        </div>
        <div className="divide-y divide-light-border-primary dark:divide-dark-border-primary">
          {documents.map((doc) => (
            <div key={doc.id} className="px-6 py-4 flex items-center justify-between">
              <div className="flex items-center">
                <DocumentTextIcon className="h-8 w-8 text-light-text-tertiary dark:text-dark-text-tertiary mr-3" />
                <div>
                  <p className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">{doc.originalName}</p>
                  <p className="text-xs text-light-text-quaternary dark:text-dark-text-quaternary">
                    Status: <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      doc.status === 'processed' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200' :
                      doc.status === 'processing' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200' :
                      'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                    }`}>
                      {doc.status}
                    </span>
                  </p>
                </div>
              </div>
              <button className="text-red-600 hover:text-red-900 dark:hover:text-red-400">
                <TrashIcon className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderXTab = () => (
    <div className="space-y-6">
      <div className="bg-light-bg-secondary dark:bg-dark-bg-secondary rounded-lg border border-light-border-primary dark:border-dark-border-primary p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-light-text-primary dark:text-dark-text-primary">X (Twitter) Profiles</h3>
          <button className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-lg text-primary-600 dark:text-primary-400 bg-primary-100 dark:bg-primary-900/30 hover:bg-primary-200 dark:hover:bg-primary-800/50">
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Profile
          </button>
        </div>
        <p className="text-light-text-secondary dark:text-dark-text-secondary mb-4">
          Add X profiles to monitor and transform tweets into training data.
        </p>
        
        {xProfiles.length === 0 ? (
          <div className="text-center py-8">
            <ShareIcon className="mx-auto h-12 w-12 text-light-text-quaternary dark:text-dark-text-quaternary" />
            <h3 className="mt-2 text-sm font-medium text-light-text-primary dark:text-dark-text-primary">No X profiles connected</h3>
            <p className="mt-1 text-sm text-light-text-quaternary dark:text-dark-text-quaternary">
              Add your first X profile to start monitoring tweets
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {xProfiles.map((profile) => (
              <div key={profile.id} className="flex items-center justify-between p-4 border border-light-border-primary dark:border-dark-border-primary rounded-lg">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-400 dark:bg-blue-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                    X
                  </div>
                  <div>
                    <p className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">@{profile.username}</p>
                    <p className="text-xs text-light-text-quaternary dark:text-dark-text-quaternary">
                      {profile.followersCount} followers • Last sync: {profile.lastSyncAt ? new Date(profile.lastSyncAt).toLocaleDateString() : 'Never'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-light-text-tertiary dark:text-dark-text-tertiary hover:text-light-text-primary dark:hover:text-dark-text-primary">
                    <ArrowPathIcon className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-light-text-tertiary dark:text-dark-text-tertiary hover:text-light-text-primary dark:hover:text-dark-text-primary">
                    <CogIcon className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-red-600 hover:text-red-900 dark:hover:text-red-400">
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderInstagramTab = () => (
    <div className="space-y-6">
      <div className="bg-light-bg-secondary dark:bg-dark-bg-secondary rounded-lg border border-light-border-primary dark:border-dark-border-primary p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-light-text-primary dark:text-dark-text-primary">Instagram Profiles</h3>
          <button className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-lg text-primary-600 dark:text-primary-400 bg-primary-100 dark:bg-primary-900/30 hover:bg-primary-200 dark:hover:bg-primary-800/50">
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Profile
          </button>
        </div>
        <p className="text-light-text-secondary dark:text-dark-text-secondary mb-4">
          Add Instagram profiles to monitor and transform reels into text transcripts for training.
        </p>
        
        {instagramProfiles.length === 0 ? (
          <div className="text-center py-8">
            <PhotoIcon className="mx-auto h-12 w-12 text-light-text-quaternary dark:text-dark-text-quaternary" />
            <h3 className="mt-2 text-sm font-medium text-light-text-primary dark:text-dark-text-primary">No Instagram profiles connected</h3>
            <p className="mt-1 text-sm text-light-text-quaternary dark:text-dark-text-quaternary">
              Add your first Instagram profile to start monitoring reels
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {instagramProfiles.map((profile) => (
              <div key={profile.id} className="flex items-center justify-between p-4 border border-light-border-primary dark:border-dark-border-primary rounded-lg">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 dark:from-purple-600 dark:to-pink-600 rounded-full flex items-center justify-center text-white font-bold mr-3">
                    IG
                  </div>
                  <div>
                    <p className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">@{profile.username}</p>
                    <p className="text-xs text-light-text-quaternary dark:text-dark-text-quaternary">
                      {profile.followersCount} followers • Last sync: {profile.lastSyncAt ? new Date(profile.lastSyncAt).toLocaleDateString() : 'Never'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-light-text-tertiary dark:text-dark-text-tertiary hover:text-light-text-primary dark:hover:text-dark-text-primary">
                    <ArrowPathIcon className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-light-text-tertiary dark:text-dark-text-tertiary hover:text-light-text-primary dark:hover:text-dark-text-primary">
                    <CogIcon className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-red-600 hover:text-red-900 dark:hover:text-red-400">
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderYouTubeTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* YouTube Channels */}
        <div className="bg-light-bg-secondary dark:bg-dark-bg-secondary rounded-lg border border-light-border-primary dark:border-dark-border-primary p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-light-text-primary dark:text-dark-text-primary">YouTube Channels</h3>
            <button className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-lg text-primary-600 dark:text-primary-400 bg-primary-100 dark:bg-primary-900/30 hover:bg-primary-200 dark:hover:bg-primary-800/50">
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Channel
            </button>
          </div>
          <p className="text-light-text-secondary dark:text-dark-text-secondary mb-4">
            Sync YouTube channels to transform videos into text transcripts.
          </p>
          
          {youtubeChannels.length === 0 ? (
            <div className="text-center py-8">
              <PlayIcon className="mx-auto h-12 w-12 text-light-text-quaternary dark:text-dark-text-quaternary" />
              <h3 className="mt-2 text-sm font-medium text-light-text-primary dark:text-dark-text-primary">No channels connected</h3>
              <p className="mt-1 text-sm text-light-text-quaternary dark:text-dark-text-quaternary">
                Add your first YouTube channel to start syncing videos
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {youtubeChannels.map((channel) => (
                <div key={channel.id} className="flex items-center justify-between p-4 border border-light-border-primary dark:border-dark-border-primary rounded-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-red-600 dark:bg-red-700 rounded flex items-center justify-center text-white font-bold mr-3">
                      YT
                    </div>
                    <div>
                      <p className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">{channel.channelName}</p>
                      <p className="text-xs text-light-text-quaternary dark:text-dark-text-quaternary">
                        {channel.subscriberCount} subscribers • Last sync: {channel.lastSyncAt ? new Date(channel.lastSyncAt).toLocaleDateString() : 'Never'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-light-text-tertiary dark:text-dark-text-tertiary hover:text-light-text-primary dark:hover:text-dark-text-primary">
                      <ArrowPathIcon className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-red-600 hover:text-red-900 dark:hover:text-red-400">
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* YouTube Playlists */}
        <div className="bg-light-bg-secondary dark:bg-dark-bg-secondary rounded-lg border border-light-border-primary dark:border-dark-border-primary p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-light-text-primary dark:text-dark-text-primary">YouTube Playlists</h3>
            <button className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-lg text-primary-600 dark:text-primary-400 bg-primary-100 dark:bg-primary-900/30 hover:bg-primary-200 dark:hover:bg-primary-800/50">
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Playlist
            </button>
          </div>
          <p className="text-light-text-secondary dark:text-dark-text-secondary mb-4">
            Sync playlists and choose to keep them updated with new videos.
          </p>
          
          {youtubePlaylists.length === 0 ? (
            <div className="text-center py-8">
              <PlayIcon className="mx-auto h-12 w-12 text-light-text-quaternary dark:text-dark-text-quaternary" />
              <h3 className="mt-2 text-sm font-medium text-light-text-primary dark:text-dark-text-primary">No playlists connected</h3>
              <p className="mt-1 text-sm text-light-text-quaternary dark:text-dark-text-quaternary">
                Add your first YouTube playlist to start syncing videos
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {youtubePlaylists.map((playlist) => (
                <div key={playlist.id} className="flex items-center justify-between p-4 border border-light-border-primary dark:border-dark-border-primary rounded-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-red-600 dark:bg-red-700 rounded flex items-center justify-center text-white font-bold mr-3">
                      YT
                    </div>
                    <div>
                      <p className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">{playlist.title}</p>
                      <p className="text-xs text-light-text-quaternary dark:text-dark-text-quaternary">
                        {playlist.videoCount} videos • {playlist.keepSynced ? 'Auto-sync enabled' : 'Manual sync'} • Last sync: {playlist.lastSyncAt ? new Date(playlist.lastSyncAt).toLocaleDateString() : 'Never'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-light-text-tertiary dark:text-dark-text-tertiary hover:text-light-text-primary dark:hover:text-dark-text-primary">
                      <ArrowPathIcon className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-light-text-tertiary dark:text-dark-text-tertiary hover:text-light-text-primary dark:hover:text-dark-text-primary">
                      <CogIcon className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-red-600 hover:text-red-900 dark:hover:text-red-400">
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Video Upload Section */}
      <div className="bg-light-bg-secondary dark:bg-dark-bg-secondary rounded-lg border border-light-border-primary dark:border-dark-border-primary p-6">
        <h3 className="text-lg font-medium text-light-text-primary dark:text-dark-text-primary mb-4">Upload Specific Video</h3>
        <p className="text-light-text-secondary dark:text-dark-text-secondary mb-4">
          Upload a specific YouTube video to transform it into text transcript.
        </p>
        <div className="border-2 border-dashed border-light-border-primary dark:border-dark-border-primary rounded-lg p-8 text-center">
          <ArrowUpTrayIcon className="mx-auto h-12 w-12 text-light-text-quaternary dark:text-dark-text-quaternary" />
          <p className="mt-2 text-sm text-light-text-secondary dark:text-dark-text-secondary">
            Enter YouTube video URL or upload video file
          </p>
          <div className="mt-4">
            <input
              type="text"
              placeholder="https://youtube.com/watch?v=..."
              className="w-full px-3 py-2 border border-light-border-primary dark:border-dark-border-primary rounded-md bg-light-bg-primary dark:bg-dark-bg-primary text-light-text-primary dark:text-dark-text-primary"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'documents':
        return renderDocumentsTab();
      case 'x':
        return renderXTab();
      case 'instagram':
        return renderInstagramTab();
      case 'youtube':
        return renderYouTubeTab();
      default:
        return renderDocumentsTab();
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-light-text-primary dark:text-dark-text-primary">Training Data</h1>
        <p className="mt-1 text-sm text-light-text-secondary dark:text-dark-text-secondary">
          Manage and sync data sources to train your AI models.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-light-border-primary dark:border-dark-border-primary mb-6">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id as TabType)}
                className={`
                  group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors
                  ${activeTab === tab.id
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-light-text-tertiary dark:text-dark-text-tertiary hover:text-light-text-primary dark:hover:text-dark-text-primary hover:border-light-border-secondary dark:hover:border-dark-border-secondary'
                  }
                `}
              >
                <Icon className="mr-2 h-5 w-5" />
                {tab.name}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <p className="mt-2 text-light-text-secondary dark:text-dark-text-secondary">Loading {activeTab} data...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-md mb-6">
          {error}
        </div>
      )}

      {/* Tab Content */}
      {!isLoading && !error && renderTabContent()}
    </div>
  );
};

export default TrainPage;
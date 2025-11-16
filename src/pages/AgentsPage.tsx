import * as React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { PlusIcon, ChatBubbleLeftRightIcon, CogIcon } from '@heroicons/react/24/outline';
import { chatAPI } from '../services';
import { Chat } from '../types';
import { useAuth } from '../context';
import { AgentWizard } from '../components/ui';

const AgentsPage: React.FC = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [selectedChatForConfig, setSelectedChatForConfig] = useState<Chat | null>(null);
  
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await chatAPI.getChats();
        setChats(response);
      } catch (error) {
        console.error('Failed to fetch chats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChats();
  }, []);

  // Check if we should open wizard for creating a new agent
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    if (urlParams.get('create') === 'true') {
      handleChatConfig(null);
      // Clean up URL
      navigate('/build', { replace: true });
    }
  }, [location.search, navigate]);

  const handleChatClick = (chatId: string) => {
    // In Build category, clicking an agent opens wizard for editing
    const chat = chats.find(c => c.id === chatId);
    if (chat) {
      handleChatConfig(chat);
    }
  };

  const handleChatConfig = (chat: Chat | null) => {
    setSelectedChatForConfig(chat);
    setIsWizardOpen(true);
  };

  const handleChatConfigSave = async (updatedChat: Chat) => {
    setIsWizardOpen(false);
    setSelectedChatForConfig(null);
    
    try {
      const response = await chatAPI.getChats();
      setChats(response);
    } catch (error) {
      console.error('Failed to refresh chats:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-light-bg-primary dark:bg-dark-bg-primary overflow-hidden">
      {/* Header */}
      <div className="px-6 py-8 border-b border-light-border-primary dark:border-dark-border-primary">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary">Build Agents</h1>
            <p className="mt-2 text-light-text-secondary dark:text-dark-text-secondary">
              Create and configure your agents
            </p>
          </div>
          {user?.role === 'tenant_admin' && (
            <button
              onClick={() => handleChatConfig(null)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-primary-600 dark:text-primary-400 bg-primary-100 dark:bg-primary-900/30 hover:bg-primary-200 dark:hover:bg-primary-800/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              New Agent
            </button>
          )}
        </div>
      </div>

      {/* Agents List */}
      <div className="px-4 md:px-6 py-6 md:py-8">
        {chats.length === 0 ? (
          <div className="text-center py-12">
            <ChatBubbleLeftRightIcon className="mx-auto h-12 w-12 text-light-text-quaternary dark:text-dark-text-quaternary" />
            <h3 className="mt-2 text-sm font-medium text-light-text-primary dark:text-dark-text-primary">No agents available</h3>
            <p className="mt-1 text-sm text-light-text-quaternary dark:text-dark-text-quaternary">
              {user?.role === 'tenant_admin'
                ? 'Create your first agent to get started'
                : 'Contact your administrator to add agents'
              }
            </p>
            {user?.role === 'tenant_admin' && (
              <button
                onClick={() => handleChatConfig(null)}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-primary-600 dark:text-primary-400 bg-primary-100 dark:bg-primary-900/30 hover:bg-primary-200 dark:hover:bg-primary-800/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Create Your First Agent
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {chats.map((chat) => (
              <div
                key={chat.id}
                className="bg-light-bg-secondary dark:bg-dark-bg-secondary rounded-lg border border-light-border-primary dark:border-dark-border-primary hover:shadow-md transition-shadow duration-200 cursor-pointer"
                onClick={() => handleChatClick(chat.id)}
              >
                <div className="px-4 py-3 flex items-center">
                  <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center mr-3">
                    <ChatBubbleLeftRightIcon className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                      {chat.name}
                    </h3>
                    <p className="text-xs text-light-text-quaternary dark:text-dark-text-quaternary">
                      Click to edit configuration
                    </p>
                  </div>
                  {user?.role === 'tenant_admin' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleChatConfig(chat);
                      }}
                      className="p-2 rounded-md hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary transition-colors"
                    >
                      <CogIcon className="h-4 w-4 text-light-text-quaternary dark:text-dark-text-quaternary" />
                    </button>
                  )}
                  <div className="w-2 h-2 bg-green-500 rounded-full ml-2"></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Agent Wizard */}
      {isWizardOpen && (
        <AgentWizard
          isOpen={isWizardOpen}
          onClose={() => setIsWizardOpen(false)}
          onSuccess={handleChatConfigSave}
          chat={selectedChatForConfig}
          source="build"
        />
      )}
    </div>
  );
};

export default AgentsPage;
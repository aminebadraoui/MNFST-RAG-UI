import * as React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusIcon, ChatBubbleLeftRightIcon, CogIcon } from '@heroicons/react/24/outline';
import { chatAPI } from '../services';
import { Chat } from '../types';
import { useAuth } from '../context';
import { ChatConfigurationModal } from '../components/ui';

const ChatBotsPage: React.FC = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [selectedChatForConfig, setSelectedChatForConfig] = useState<Chat | null>(null);
  
  const { user } = useAuth();
  const navigate = useNavigate();

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

  const handleChatClick = (chatId: string) => {
    navigate(`/chat/${chatId}`);
  };

  const handleChatConfig = (chat: Chat | null) => {
    setSelectedChatForConfig(chat);
    setIsConfigModalOpen(true);
  };

  const handleChatConfigSave = async (updatedChat: Chat) => {
    setIsConfigModalOpen(false);
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
            <h1 className="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary">Chat Bots</h1>
            <p className="mt-2 text-light-text-secondary dark:text-dark-text-secondary">
              Select a chat bot to start a conversation
            </p>
          </div>
          {user?.role === 'tenant_admin' && (
            <button
              onClick={() => handleChatConfig(null)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-primary-600 dark:text-primary-400 bg-primary-100 dark:bg-primary-900/30 hover:bg-primary-200 dark:hover:bg-primary-800/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              New Bot
            </button>
          )}
        </div>
      </div>

      {/* Chat Bots Grid */}
      <div className="px-4 md:px-6 py-6 md:py-8">
        {chats.length === 0 ? (
          <div className="text-center py-12">
            <ChatBubbleLeftRightIcon className="mx-auto h-12 w-12 text-light-text-quaternary dark:text-dark-text-quaternary" />
            <h3 className="mt-2 text-sm font-medium text-light-text-primary dark:text-dark-text-primary">No chat bots available</h3>
            <p className="mt-1 text-sm text-light-text-quaternary dark:text-dark-text-quaternary">
              {user?.role === 'tenant_admin' 
                ? 'Create your first chat bot to get started'
                : 'Contact your administrator to add chat bots'
              }
            </p>
            {user?.role === 'tenant_admin' && (
              <button
                onClick={() => handleChatConfig(null)}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-primary-600 dark:text-primary-400 bg-primary-100 dark:bg-primary-900/30 hover:bg-primary-200 dark:hover:bg-primary-800/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Create Your First Bot
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {chats.map((chat) => (
              <div
                key={chat.id}
                className="relative bg-light-bg-secondary dark:bg-dark-bg-secondary rounded-lg border border-light-border-primary dark:border-dark-border-primary hover:shadow-lg transition-shadow duration-200 cursor-pointer group"
                onClick={() => handleChatClick(chat.id)}
              >
                <div className="p-4 md:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center group-hover:bg-primary-200 dark:group-hover:bg-primary-800/50 transition-colors">
                      <ChatBubbleLeftRightIcon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                    </div>
                    {user?.role === 'tenant_admin' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleChatConfig(chat);
                        }}
                        className="p-2 rounded-md hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <CogIcon className="h-4 w-4 text-light-text-quaternary dark:text-dark-text-quaternary" />
                      </button>
                    )}
                  </div>
                  
                  <h3 className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary mb-2 truncate">
                    {chat.name}
                  </h3>
                  
                  <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary line-clamp-3">
                    {chat.systemPrompt || 'No description available'}
                  </p>
                </div>
                
                <div className="px-4 md:px-6 py-3 bg-light-bg-tertiary dark:bg-dark-bg-tertiary border-t border-light-border-primary dark:border-dark-border-primary rounded-b-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-light-text-quaternary dark:text-dark-text-quaternary">
                      Click to start chatting
                    </span>
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Chat Configuration Modal */}
      {isConfigModalOpen && (
        <ChatConfigurationModal
          isOpen={isConfigModalOpen}
          onClose={() => setIsConfigModalOpen(false)}
          onSuccess={handleChatConfigSave}
          chat={selectedChatForConfig}
        />
      )}
    </div>
  );
};

export default ChatBotsPage;
import * as React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import { chatAPI } from '../services';
import { Chat } from '../types';
import { useAuth } from '../context';
import { AgentWizard } from '../components/ui';

const TestPage: React.FC = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  
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

  const handleCreateNew = () => {
    // Open wizard directly from test page
    setIsWizardOpen(true);
  };

  const handleWizardClose = () => {
    setIsWizardOpen(false);
  };

  const handleWizardSuccess = async (updatedChat: Chat) => {
    setIsWizardOpen(false);
    
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
            <h1 className="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary">Test Agents</h1>
            <p className="mt-2 text-light-text-secondary dark:text-dark-text-secondary">
              Select an agent to start testing
            </p>
          </div>
        </div>
      </div>

      {/* Agents List */}
      <div className="px-4 md:px-6 py-6 md:py-8">
        {chats.length === 0 ? (
          <div className="text-center py-12">
            <ChatBubbleLeftRightIcon className="mx-auto h-12 w-12 text-light-text-quaternary dark:text-dark-text-quaternary" />
            <h3 className="mt-2 text-sm font-medium text-light-text-primary dark:text-dark-text-primary">No agents available for testing</h3>
            <p className="mt-1 text-sm text-light-text-quaternary dark:text-dark-text-quaternary">
              Create your first agent to start testing
            </p>
            <button
              onClick={handleCreateNew}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-primary-600 dark:text-primary-400 bg-primary-100 dark:bg-primary-900/30 hover:bg-primary-200 dark:hover:bg-primary-800/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Create Your First Bot
            </button>
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
                      Click to start testing
                    </p>
                  </div>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
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
          onClose={handleWizardClose}
          onSuccess={handleWizardSuccess}
          chat={null}
          source="test"
        />
      )}
    </div>
  );
};

export default TestPage;
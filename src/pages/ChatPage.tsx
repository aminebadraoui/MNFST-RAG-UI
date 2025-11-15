import React, { useState, useEffect, useRef } from 'react';
import { ChatBubbleLeftRightIcon, UserIcon, PaperAirplaneIcon, PlusIcon, CogIcon, TrashIcon } from '@heroicons/react/24/outline';
import { chatAPI } from '../services';
import { Session, Message, StreamChunk, Chat } from '../types';
import { useAuth } from '../context';
import { ChatConfigurationModal, GenericDeleteConfirmationModal } from '../components/ui';
import { generateMessageId } from '../utils/uuid';

const ChatPage: React.FC = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [streamingMessageId, setStreamingMessageId] = useState<string>('');
  const [streamingContent, setStreamingContent] = useState<string>('');
  const [isStreaming, setIsStreaming] = useState(false);
  
  // New state for chats
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string>('');
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [selectedChatForConfig, setSelectedChatForConfig] = useState<Chat | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedChatForDelete, setSelectedChatForDelete] = useState<Chat | null>(null);
  
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch chats on component mount
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await chatAPI.getChats();
        setChats(response);
        if (response.length > 0 && !currentChatId) {
          setCurrentChatId(response[0].id);
        }
      } catch (error) {
        console.error('Failed to fetch chats:', error);
      }
    };

    fetchChats();
  }, []);

  // Fetch sessions when current chat changes
  useEffect(() => {
    if (!currentChatId) return;

    const fetchSessions = async () => {
      try {
        const response = await chatAPI.getChatSessions(currentChatId);
        setSessions(response);
        // Always select the first session if available, or clear if no sessions
        if (response.length > 0) {
          if (!currentSessionId) {
            setCurrentSessionId(response[0].id);
          }
        } else {
          setCurrentSessionId('');
        }
      } catch (error) {
        console.error('Failed to fetch sessions:', error);
        setSessions([]);
        setCurrentSessionId('');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSessions();
  }, [currentChatId]);

  // Fetch messages when current session changes
  useEffect(() => {
    if (!currentSessionId) return;

    const fetchMessages = async () => {
      try {
        const response = await chatAPI.getMessages(currentSessionId);
        setMessages(response);
      } catch (error) {
        console.error('Failed to fetch messages:', error);
        setMessages([]);
      }
    };

    fetchMessages();
  }, [currentSessionId]);

  // Auto-scroll to bottom when messages change or streaming content updates
  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingContent]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const currentSession = sessions.find(s => s.id === currentSessionId);
  const currentChat = chats.find(c => c.id === currentChatId);

  const handleSendMessage = async () => {
    if (newMessage.trim() && currentSessionId) {
      try {
        setIsStreaming(true);
        setStreamingContent('');
        setStreamingMessageId('');
        
        // Create a temporary ID for the locally added user message
        const tempUserId = `temp-user-${Date.now()}`;
        
        // Add user message immediately to the UI with temporary ID
        const userMessage: Message = {
          id: tempUserId, // Use temporary ID
          content: newMessage,
          role: 'user',
          timestamp: new Date().toISOString()
        };
        
        setMessages(prev => [...prev, userMessage]);
        setNewMessage('');
        
        // Start streaming the assistant response
        const stream = await chatAPI.sendMessageStream(
          currentSessionId,
          {
            content: newMessage,
            role: 'user'
          },
          (chunk: StreamChunk) => {
            if (chunk.type === 'start') {
              setStreamingMessageId(chunk.messageId || '');
              console.log('Streaming started for message:', chunk.messageId);
            } else if (chunk.type === 'token' && chunk.content) {
              setStreamingContent(prev => prev + chunk.content);
              console.log('Streaming token:', chunk.content);
            } else if (chunk.type === 'end') {
              console.log('Streaming ended for message:', chunk.messageId);
              // Streaming completed
              setIsStreaming(false);
              // Pass the temporary user ID to remove it during refresh
              refreshMessagesAfterStreaming(tempUserId);
            } else if (chunk.type === 'error') {
              console.error('Streaming error:', chunk.error);
              setIsStreaming(false);
              setStreamingContent('');
              setStreamingMessageId('');
            }
          }
        );
        
        // Process the stream
        const reader = stream.getReader();
        const decoder = new TextDecoder();
        
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            // The chunk processing is handled by the onChunk callback above
          }
        } catch (error) {
          console.error('Stream reading error:', error);
          setIsStreaming(false);
          setStreamingContent('');
          setStreamingMessageId('');
        }
      } catch (error) {
        console.error('Failed to send message:', error);
        setIsStreaming(false);
        setStreamingContent('');
        setStreamingMessageId('');
      }
    }
  };

  const refreshMessagesAfterStreaming = async (tempUserId?: string) => {
    try {
      // If we have a temporary user ID, filter it out first
      if (tempUserId) {
        setMessages(prev => prev.filter(msg => msg.id !== tempUserId));
      }
      
      // Then refresh messages to get both user and assistant messages from backend
      const response = await chatAPI.getMessages(currentSessionId);
      setMessages(response);
      
      // Then clear streaming state
      setStreamingContent('');
      setStreamingMessageId('');
      
      // Finally refresh sessions to get updated timestamps
      const sessionsResponse = await chatAPI.getChatSessions(currentChatId);
      setSessions(sessionsResponse);
    } catch (error) {
      console.error('Failed to refresh messages after streaming:', error);
      // Still clear streaming state even if refresh fails
      setStreamingContent('');
      setStreamingMessageId('');
    }
  };

  const handleNewSession = async () => {
    if (!currentChatId) return;
    
    try {
      const newSession = await chatAPI.createSession({
        title: 'New Chat Session',
        chat_id: currentChatId
      });
      // Refresh sessions list
      const response = await chatAPI.getChatSessions(currentChatId);
      setSessions(response);
      setCurrentSessionId(newSession.id);
    } catch (error) {
      console.error('Failed to create session:', error);
    }
  };

  const handleChatConfig = (chat: Chat | null) => {
    setSelectedChatForConfig(chat);
    setIsConfigModalOpen(true);
  };

  const handleChatConfigSave = async (updatedChat: Chat) => {
    // This function is now only used for closing the modal after successful creation/update
    // The actual creation/update logic is handled inside ChatConfigurationModal
    setIsConfigModalOpen(false);
    setSelectedChatForConfig(null);
    
    // Refresh chats list to show newly created/updated chat
    try {
      const response = await chatAPI.getChats();
      setChats(response);
      
      // If this was a new chat creation (no original chat), select the new chat
      if (!selectedChatForConfig) {
        setCurrentChatId(updatedChat.id);
      }
    } catch (error) {
      console.error('Failed to refresh chats:', error);
    }
  };

  const handleDeleteChat = (chat: Chat) => {
    setSelectedChatForDelete(chat);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedChatForDelete) return;
    
    try {
      await chatAPI.deleteChat(selectedChatForDelete.id);
      
      // Refresh chats list
      const response = await chatAPI.getChats();
      setChats(response);
      
      // If deleted chat was current, clear selection
      if (selectedChatForDelete.id === currentChatId) {
        setCurrentChatId('');
        setCurrentSessionId('');
        setMessages([]);
        setSessions([]);
      }
      
      setIsDeleteModalOpen(false);
      setSelectedChatForDelete(null);
    } catch (error) {
      console.error('Failed to delete chat:', error);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setSelectedChatForDelete(null);
  };

  return (
    <div className="h-screen flex">
      {/* Chats Panel - 20% width */}
      <div className="w-1/5 bg-light-bg-primary dark:bg-dark-bg-secondary border-r border-light-border-primary dark:border-dark-border-primary flex flex-col">
        <div className="p-4 border-b border-light-border-primary dark:border-dark-border-primary flex-shrink-0">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary">Chat Bots</h2>
            {user?.role === 'tenant_admin' && (
              <button
                onClick={() => handleChatConfig(null)}
                className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-primary-600 dark:text-primary-400 bg-primary-100 dark:bg-primary-900/30 hover:bg-primary-200 dark:hover:bg-primary-800/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <PlusIcon className="h-4 w-4 mr-1" />
                New Bot
              </button>
            )}
          </div>
        </div>
        
        {/* Chats List */}
        <div className="flex-1 overflow-y-auto p-2">
          {chats.map((chat) => (
            <div
              key={chat.id}
              className={`mb-2 rounded-lg ${
                currentChatId === chat.id
                  ? 'bg-primary-100 dark:bg-primary-900/30 border-l-4 border-l-primary-500 shadow-sm'
                  : 'hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary'
              }`}
            >
              <button
                onClick={() => setCurrentChatId(chat.id)}
                className="w-full text-left px-3 py-2"
              >
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary truncate">{chat.name}</div>
                  {user?.role === 'tenant_admin' && (
                    <div className="flex space-x-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleChatConfig(chat);
                        }}
                        className="p-1 rounded hover:bg-light-bg-quaternary dark:hover:bg-dark-bg-quaternary"
                      >
                        <CogIcon className="h-4 w-4 text-light-text-quaternary dark:text-dark-text-quaternary" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteChat(chat);
                        }}
                        className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/30"
                      >
                        <TrashIcon className="h-4 w-4 text-red-600 dark:text-red-400" />
                      </button>
                    </div>
                  )}
                </div>
                <div className="text-xs text-light-text-quaternary dark:text-dark-text-quaternary mt-1 truncate">
                  {chat.systemPrompt || 'No system prompt configured'}
                </div>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Sessions Panel - 25% width */}
      <div className="w-1/4 bg-light-bg-primary dark:bg-dark-bg-secondary border-r border-light-border-primary dark:border-dark-border-primary flex flex-col">
        <div className="p-4 border-b border-light-border-primary dark:border-dark-border-primary flex-shrink-0">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary">Sessions</h2>
            <button
              onClick={handleNewSession}
              className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-primary-600 dark:text-primary-400 bg-primary-100 dark:bg-primary-900/30 hover:bg-primary-200 dark:hover:bg-primary-800/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              New
            </button>
          </div>
        </div>
        
        {/* Sessions List with independent scrolling */}
        <div className="flex-1 overflow-y-auto p-2">
          {sessions.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-light-text-quaternary dark:text-dark-text-quaternary mb-4">
                No sessions found for this chat
              </div>
              <button
                onClick={handleNewSession}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded text-primary-600 dark:text-primary-400 bg-primary-100 dark:bg-primary-900/30 hover:bg-primary-200 dark:hover:bg-primary-800/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Create Your First Session
              </button>
            </div>
          ) : (
            sessions.map((session) => (
              <button
                key={session.id}
                onClick={() => setCurrentSessionId(session.id)}
                className={`w-full text-left px-3 py-3 mb-2 rounded-lg ${
                  currentSessionId === session.id
                    ? 'bg-primary-100 dark:bg-primary-900/30 border-l-4 border-l-primary-500 shadow-sm'
                    : 'hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary'
                }`}
              >
                <div className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary truncate">{session.title}</div>
                <div className="text-xs text-light-text-quaternary dark:text-dark-text-quaternary mt-1">
                  {messages.length} messages • {new Date(session.createdAt).toLocaleDateString()}
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Chat Area - 55% width */}
      <div className="flex-1 flex flex-col bg-light-bg-primary dark:bg-dark-bg-secondary">
        {currentSession ? (
          <>
            {/* Chat Header */}
            <div className="px-6 py-4 border-b border-light-border-primary dark:border-dark-border-primary flex-shrink-0">
              <h3 className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary">{currentSession.title}</h3>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start space-x-3 ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.role === 'assistant' && (
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center shadow-lg shadow-primary-600/30">
                        <ChatBubbleLeftRightIcon className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  )}
                  <div
                    className={`max-w-lg px-4 py-2 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20'
                        : 'bg-light-bg-tertiary dark:bg-dark-bg-tertiary text-light-text-primary dark:text-dark-text-primary'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className={`text-xs mt-1 ${
                      message.role === 'user' ? 'text-primary-200' : 'text-light-text-quaternary dark:text-dark-text-quaternary'
                    }`}>
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                  {message.role === 'user' && (
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-light-bg-quaternary dark:bg-dark-bg-quaternary rounded-full flex items-center justify-center">
                        <UserIcon className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
              
              {/* Streaming message */}
              {isStreaming && streamingContent && (
                <div className="flex items-start space-x-3 justify-start">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center shadow-lg shadow-primary-600/30">
                      <ChatBubbleLeftRightIcon className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <div className="max-w-lg px-4 py-2 rounded-lg bg-light-bg-tertiary dark:bg-dark-bg-tertiary text-light-text-primary dark:text-dark-text-primary">
                    <p className="text-sm">{streamingContent}</p>
                    <div className="flex items-center mt-1">
                      <div className="animate-pulse flex space-x-1">
                        <div className="w-1 h-1 bg-light-text-quaternary dark:bg-dark-text-quaternary rounded-full"></div>
                        <div className="w-1 h-1 bg-light-text-quaternary dark:bg-dark-text-quaternary rounded-full"></div>
                        <div className="w-1 h-1 bg-light-text-quaternary dark:bg-dark-text-quaternary rounded-full"></div>
                      </div>
                      <span className="text-xs text-light-text-quaternary dark:text-dark-text-quaternary ml-2">Streaming...</span>
                    </div>
                  </div>
                </div>
              )}
              {/* Auto-scroll anchor */}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="px-6 py-4 border-t border-light-border-primary dark:border-dark-border-primary flex-shrink-0">
              <div className="flex items-center space-x-3">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !isStreaming && handleSendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 border border-light-border-primary dark:border-dark-border-primary bg-light-bg-primary dark:bg-dark-bg-tertiary text-light-text-primary dark:text-dark-text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={isStreaming}
                  className={`px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 shadow-lg shadow-primary-600/20 ${
                    isStreaming
                      ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                      : 'bg-primary-600 text-white hover:bg-primary-700'
                  }`}
                >
                  <PaperAirplaneIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <ChatBubbleLeftRightIcon className="mx-auto h-12 w-12 text-light-text-quaternary dark:text-dark-text-quaternary" />
              <h3 className="mt-2 text-sm font-medium text-light-text-primary dark:text-dark-text-primary">No session selected</h3>
              <p className="mt-1 text-sm text-light-text-quaternary dark:text-dark-text-quaternary">Select a session from the left or create a new one</p>
            </div>
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
      
      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && selectedChatForDelete && (
        <GenericDeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={handleCancelDelete}
          onConfirm={handleConfirmDelete}
          title="Delete Chat"
          message={`Are you sure you want to delete "${selectedChatForDelete.name}"? This will also delete all sessions and messages associated with this chat.`}
          confirmText="Delete Chat"
          cancelText="Cancel"
        />
      )}
    </div>
  );
};

export default ChatPage;
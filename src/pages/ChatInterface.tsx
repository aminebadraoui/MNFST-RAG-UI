import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChatBubbleLeftRightIcon, UserIcon, PaperAirplaneIcon, PlusIcon, ArrowLeftIcon, Bars3Icon } from '@heroicons/react/24/outline';
import { chatAPI } from '../services';
import { Session, Message, StreamChunk, Chat } from '../types';
import { useAuth } from '../context';
import { GenericDeleteConfirmationModal } from '../components/ui';
import { generateMessageId } from '../utils/uuid';

const ChatInterface: React.FC = () => {
  const { chatId } = useParams<{ chatId: string }>();
  const navigate = useNavigate();
  
  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [streamingMessageId, setStreamingMessageId] = useState<string>('');
  const [streamingContent, setStreamingContent] = useState<string>('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [chat, setChat] = useState<Chat | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSessionForDelete, setSelectedSessionForDelete] = useState<Session | null>(null);
  const [isMobileSessionsOpen, setIsMobileSessionsOpen] = useState(false);
  
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch chat details on component mount
  useEffect(() => {
    if (!chatId) return;

    const fetchChat = async () => {
      try {
        const response = await chatAPI.getChat(chatId);
        setChat(response);
      } catch (error) {
        console.error('Failed to fetch chat:', error);
        navigate('/chat');
      }
    };

    fetchChat();
  }, [chatId, navigate]);

  // Fetch sessions when chat changes
  useEffect(() => {
    if (!chatId) return;

    const fetchSessions = async () => {
      try {
        const response = await chatAPI.getChatSessions(chatId);
        setSessions(response);
        if (response.length > 0 && !currentSessionId) {
          setCurrentSessionId(response[0].id);
        }
      } catch (error) {
        console.error('Failed to fetch sessions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSessions();
  }, [chatId, currentSessionId]);

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
          id: tempUserId,
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
            } else if (chunk.type === 'token' && chunk.content) {
              setStreamingContent(prev => prev + chunk.content);
            } else if (chunk.type === 'end') {
              setIsStreaming(false);
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
        
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
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
      if (tempUserId) {
        setMessages(prev => prev.filter(msg => msg.id !== tempUserId));
      }
      
      const response = await chatAPI.getMessages(currentSessionId);
      setMessages(response);
      
      setStreamingContent('');
      setStreamingMessageId('');
      
      const sessionsResponse = await chatAPI.getChatSessions(chatId!);
      setSessions(sessionsResponse);
    } catch (error) {
      console.error('Failed to refresh messages after streaming:', error);
      setStreamingContent('');
      setStreamingMessageId('');
    }
  };

  const handleNewSession = async () => {
    if (!chatId) return;
    
    try {
      const newSession = await chatAPI.createSession({
        title: 'New Chat Session',
        chat_id: chatId
      });
      const response = await chatAPI.getChatSessions(chatId);
      setSessions(response);
      setCurrentSessionId(newSession.id);
    } catch (error) {
      console.error('Failed to create session:', error);
    }
  };

  const handleDeleteSession = (session: Session) => {
    setSelectedSessionForDelete(session);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedSessionForDelete) return;
    
    try {
      await chatAPI.deleteSession(selectedSessionForDelete.id);
      
      const response = await chatAPI.getChatSessions(chatId!);
      setSessions(response);
      
      if (selectedSessionForDelete.id === currentSessionId) {
        if (response.length > 0) {
          setCurrentSessionId(response[0].id);
        } else {
          setCurrentSessionId('');
          setMessages([]);
        }
      }
      
      setIsDeleteModalOpen(false);
      setSelectedSessionForDelete(null);
    } catch (error) {
      console.error('Failed to delete session:', error);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setSelectedSessionForDelete(null);
  };

  const handleBackToBots = () => {
    navigate('/chat');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!chat) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-light-text-secondary dark:text-dark-text-secondary">Chat not found</p>
          <button
            onClick={handleBackToBots}
            className="mt-4 text-primary-600 dark:text-primary-400 hover:underline"
          >
            Back to Chat Bots
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-light-bg-primary dark:bg-dark-bg-primary relative overflow-hidden">
      {/* Mobile Sessions Overlay */}
      {isMobileSessionsOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden bg-dark-bg-quaternary bg-opacity-50"
          onClick={() => setIsMobileSessionsOpen(false)}
        />
      )}

      {/* Sessions Panel - Responsive */}
      <div className={`
        ${isMobileSessionsOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:relative fixed top-0 left-0 h-full z-50 md:z-auto
        w-[80%] max-w-[320px] md:w-[30%] md:min-w-[280px] md:max-w-[400px]
        bg-light-bg-secondary dark:bg-dark-bg-secondary border-r border-light-border-primary dark:border-dark-border-primary
        flex flex-col transition-transform duration-300 ease-in-out
      `}>
        {/* Header */}
        <div className="p-4 border-b border-light-border-primary dark:border-dark-border-primary flex-shrink-0">
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={handleBackToBots}
              className="inline-flex items-center text-sm text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text-primary dark:hover:text-dark-text-primary transition-colors"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-1" />
              Back to Bots
            </button>
            <button
              onClick={() => setIsMobileSessionsOpen(false)}
              className="md:hidden p-1 rounded hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary truncate">
              {chat.name}
            </h2>
            <button
              onClick={handleNewSession}
              className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-primary-600 dark:text-primary-400 bg-primary-100 dark:bg-primary-900/30 hover:bg-primary-200 dark:hover:bg-primary-800/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              New
            </button>
          </div>
        </div>
        
        {/* Sessions List */}
        <div className="flex-1 overflow-y-auto p-2">
          {sessions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-light-text-quaternary dark:text-dark-text-quaternary">No sessions yet</p>
              <button
                onClick={handleNewSession}
                className="mt-2 text-sm text-primary-600 dark:text-primary-400 hover:underline"
              >
                Create your first session
              </button>
            </div>
          ) : (
            sessions.map((session) => (
              <div
                key={session.id}
                className={`mb-2 rounded-lg group ${
                  currentSessionId === session.id
                    ? 'bg-primary-100 dark:bg-primary-900/30 border-l-4 border-l-primary-500 shadow-sm'
                    : 'hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary'
                }`}
              >
                <button
                  onClick={() => setCurrentSessionId(session.id)}
                  className="w-full text-left px-3 py-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary truncate">
                        {session.title}
                      </div>
                      <div className="text-xs text-light-text-quaternary dark:text-dark-text-quaternary mt-1">
                        {new Date(session.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteSession(session);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/30 transition-all"
                    >
                      <svg className="h-4 w-4 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Area - Responsive */}
      <div className="flex-1 flex flex-col md:relative h-full">
        {/* Mobile Header */}
        <div className="md:hidden px-4 py-3 border-b border-light-border-primary dark:border-dark-border-primary flex items-center justify-between bg-light-bg-primary dark:bg-dark-bg-primary flex-shrink-0">
          <button
            onClick={() => setIsMobileSessionsOpen(true)}
            className="p-2 rounded hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary"
          >
            <Bars3Icon className="h-5 w-5 text-light-text-primary dark:text-dark-text-primary" />
          </button>
          <h3 className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary truncate">
            {chat?.name}
          </h3>
          <button
            onClick={handleBackToBots}
            className="p-2 rounded hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary"
          >
            <ArrowLeftIcon className="h-4 w-4 text-light-text-primary dark:text-dark-text-primary" />
          </button>
        </div>
        {currentSession ? (
          <>
            {/* Desktop Chat Header */}
            <div className="hidden md:block px-6 py-4 border-b border-light-border-primary dark:border-dark-border-primary flex-shrink-0 bg-light-bg-primary dark:bg-dark-bg-primary">
              <h3 className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary">{currentSession.title}</h3>
              <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mt-1">Chat with {chat.name}</p>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 space-y-4 bg-light-bg-primary dark:bg-dark-bg-primary min-h-0">
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
                    className={`max-w-[85%] md:max-w-lg px-3 md:px-4 py-2 rounded-lg ${
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
                  <div className="max-w-[85%] md:max-w-lg px-3 md:px-4 py-2 rounded-lg bg-light-bg-tertiary dark:bg-dark-bg-tertiary text-light-text-primary dark:text-dark-text-primary">
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
            <div className="px-4 md:px-6 py-4 border-t border-light-border-primary dark:border-dark-border-primary flex-shrink-0 bg-light-bg-primary dark:bg-dark-bg-primary">
              <div className="flex items-center space-x-2 md:space-x-3">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !isStreaming && handleSendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 border border-light-border-primary dark:border-dark-border-primary bg-light-bg-secondary dark:bg-dark-bg-tertiary text-light-text-primary dark:text-dark-text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
          <div className="flex-1 flex items-center justify-center bg-light-bg-primary dark:bg-dark-bg-primary min-h-0">
            <div className="text-center">
              <ChatBubbleLeftRightIcon className="mx-auto h-12 w-12 text-light-text-quaternary dark:text-dark-text-quaternary" />
              <h3 className="mt-2 text-sm font-medium text-light-text-primary dark:text-dark-text-primary">No session selected</h3>
              <p className="mt-1 text-sm text-light-text-quaternary dark:text-dark-text-quaternary">Select a session from the left or create a new one</p>
              <button
                onClick={handleNewSession}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-primary-600 dark:text-primary-400 bg-primary-100 dark:bg-primary-900/30 hover:bg-primary-200 dark:hover:bg-primary-800/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Create New Session
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && selectedSessionForDelete && (
        <GenericDeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={handleCancelDelete}
          onConfirm={handleConfirmDelete}
          title="Delete Session"
          message={`Are you sure you want to delete "${selectedSessionForDelete.title}"? This will also delete all messages in this session.`}
          confirmText="Delete Session"
          cancelText="Cancel"
        />
      )}
    </div>
  );
};

export default ChatInterface;
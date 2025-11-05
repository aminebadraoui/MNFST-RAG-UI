import React, { useState, useEffect } from 'react';
import { ChatBubbleLeftRightIcon, UserIcon, PaperAirplaneIcon, PlusIcon } from '@heroicons/react/24/outline';
import { chatAPI } from '../services';
import { Session, Message, StreamChunk } from '../types';

const ChatPage: React.FC = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [streamingMessageId, setStreamingMessageId] = useState<string>('');
  const [streamingContent, setStreamingContent] = useState<string>('');
  const [isStreaming, setIsStreaming] = useState(false);

  // Fetch sessions on component mount
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await chatAPI.getSessions();
        setSessions(response.sessions);
        if (response.sessions.length > 0 && !currentSessionId) {
          setCurrentSessionId(response.sessions[0].id);
        }
      } catch (error) {
        console.error('Failed to fetch sessions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSessions();
  }, [currentSessionId]);

  // Fetch messages when current session changes
  useEffect(() => {
    if (!currentSessionId) return;

    const fetchMessages = async () => {
      try {
        const response = await chatAPI.getMessages(currentSessionId);
        setMessages(response.messages);
      } catch (error) {
        console.error('Failed to fetch messages:', error);
        setMessages([]);
      }
    };

    fetchMessages();
  }, [currentSessionId]);

  const currentSession = sessions.find(s => s.id === currentSessionId);

  const handleSendMessage = async () => {
    if (newMessage.trim() && currentSessionId) {
      try {
        setIsStreaming(true);
        setStreamingContent('');
        setStreamingMessageId('');
        
        // Add user message immediately to the UI
        const userMessage: Message = {
          id: `user-${Date.now()}`,
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
              // Streaming completed
              setIsStreaming(false);
              // Refresh messages to get the complete message
              setTimeout(async () => {
                const response = await chatAPI.getMessages(currentSessionId);
                setMessages(response.messages);
                setStreamingContent('');
                setStreamingMessageId('');
                
                // Refresh sessions to get updated timestamps
                const sessionsResponse = await chatAPI.getSessions();
                setSessions(sessionsResponse.sessions);
              }, 500);
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

  const handleNewSession = async () => {
    try {
      const newSession = await chatAPI.createSession('New Chat Session');
      // Refresh sessions list
      const response = await chatAPI.getSessions();
      setSessions(response.sessions);
      setCurrentSessionId(newSession.id);
    } catch (error) {
      console.error('Failed to create session:', error);
    }
  };

  return (
    <div className="h-screen flex">
      {/* Sessions Panel - 30% width */}
      <div className="w-1/3 bg-light-bg-primary dark:bg-dark-bg-secondary border-r border-light-border-primary dark:border-dark-border-primary flex flex-col">
        <div className="p-4 border-b border-light-border-primary dark:border-dark-border-primary flex-shrink-0">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary">Chat Sessions</h2>
            <button
              onClick={handleNewSession}
              className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-primary-600 dark:text-primary-400 bg-primary-100 dark:bg-primary-900/30 hover:bg-primary-200 dark:hover:bg-primary-800/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              New Session
            </button>
          </div>
        </div>
        
        {/* Sessions List with independent scrolling */}
        <div className="flex-1 overflow-y-auto p-2">
          {sessions.map((session) => (
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
          ))}
        </div>
      </div>

      {/* Chat Area - 70% width */}
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
    </div>
  );
};

export default ChatPage;
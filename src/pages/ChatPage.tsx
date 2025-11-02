import React, { useState } from 'react';
import { ChatBubbleLeftRightIcon, UserIcon, PaperAirplaneIcon, PlusIcon } from '@heroicons/react/24/outline';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
}

const ChatPage: React.FC = () => {
  const [sessions] = useState<ChatSession[]>([
    {
      id: '1',
      title: 'Getting started with RAG',
      createdAt: new Date('2024-01-15T10:30:00'),
      messages: [
        {
          id: 'm1',
          content: 'What is RAG and how does it work?',
          sender: 'user',
          timestamp: new Date('2024-01-15T10:30:00'),
        },
        {
          id: 'm2',
          content: 'RAG (Retrieval-Augmented Generation) is a technique that combines retrieval-based methods with generative AI. It works by first retrieving relevant information from a knowledge base, then using that information to generate more accurate and context-aware responses.',
          sender: 'assistant',
          timestamp: new Date('2024-01-15T10:30:15'),
        },
        {
          id: 'm3',
          content: 'Can you give me an example of when to use RAG?',
          sender: 'user',
          timestamp: new Date('2024-01-15T10:31:00'),
        },
        {
          id: 'm4',
          content: 'RAG is particularly useful when you need AI to answer questions about specific documents, recent information, or proprietary knowledge. For example, customer support chatbots that need to reference product documentation, or research assistants that need to cite specific papers.',
          sender: 'assistant',
          timestamp: new Date('2024-01-15T10:31:20'),
        },
      ],
    },
    {
      id: '2',
      title: 'Document analysis workflow',
      createdAt: new Date('2024-01-14T14:20:00'),
      messages: [
        {
          id: 'm5',
          content: 'How do I analyze multiple documents at once?',
          sender: 'user',
          timestamp: new Date('2024-01-14T14:20:00'),
        },
        {
          id: 'm6',
          content: 'You can upload multiple documents to the system and they will be automatically indexed. Once indexed, you can ask questions that span across all documents, and the system will retrieve relevant information from each document as needed.',
          sender: 'assistant',
          timestamp: new Date('2024-01-14T14:20:15'),
        },
      ],
    },
  ]);

  const [currentSessionId, setCurrentSessionId] = useState<string>('1');
  const [newMessage, setNewMessage] = useState('');

  const currentSession = sessions.find(s => s.id === currentSessionId);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // In a real app, this would send the message to the API
      console.log('Sending message:', newMessage);
      setNewMessage('');
    }
  };

  const handleNewSession = () => {
    // In a real app, this would create a new session
    const newSessionId = (sessions.length + 1).toString();
    const newSession: ChatSession = {
      id: newSessionId,
      title: `New Chat ${newSessionId}`,
      messages: [],
      createdAt: new Date(),
    };
    // In a real implementation, you would add this to the sessions array
    console.log('Creating new session:', newSession);
    setCurrentSessionId(newSessionId);
  };

  return (
    <div className="h-screen flex">
      {/* Sessions Panel - 30% width */}
      <div className="w-1/3 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Chat Sessions</h2>
            <button
              onClick={handleNewSession}
              className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-primary-600 dark:text-primary-400 bg-primary-100 dark:bg-primary-900 hover:bg-primary-200 dark:hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
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
                  ? 'bg-primary-100 dark:bg-primary-900 border-l-4 border-l-primary-500'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <div className="text-sm font-medium text-gray-900 dark:text-white truncate">{session.title}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {session.messages.length} messages • {session.createdAt.toLocaleDateString()}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area - 70% width */}
      <div className="flex-1 flex flex-col bg-white dark:bg-gray-800">
        {currentSession ? (
          <>
            {/* Chat Header */}
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{currentSession.title}</h3>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {currentSession.messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start space-x-3 ${
                    message.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.sender === 'assistant' && (
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                        <ChatBubbleLeftRightIcon className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  )}
                  <div
                    className={`max-w-lg px-4 py-2 rounded-lg ${
                      message.sender === 'user'
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className={`text-xs mt-1 ${
                      message.sender === 'user' ? 'text-primary-200' : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                  {message.sender === 'user' && (
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
                        <UserIcon className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
              <div className="flex items-center space-x-3">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <button
                  onClick={handleSendMessage}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                >
                  <PaperAirplaneIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <ChatBubbleLeftRightIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No session selected</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Select a session from the left or create a new one</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
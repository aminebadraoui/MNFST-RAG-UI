import { 
  Message, 
  Session, 
  CreateSessionRequest, 
  SendMessageRequest, 
  GetMessagesResponse, 
  GetSessionsResponse,
  StreamChunk
} from '../../types';
import { mockApiClient } from './mockApiClient';
import { MockDataGenerator } from './mockDataGenerator';

// Store mock data in memory for consistency
let mockSessions: Session[] = MockDataGenerator.generateSessions();
let mockMessages: Record<string, Message[]> = {};

// Initialize messages for existing sessions
mockSessions.forEach(session => {
  mockMessages[session.id] = MockDataGenerator.generateMessages(session.id);
});

export const mockChatAPI = {
  getSessions: async (): Promise<GetSessionsResponse> => {
    // Sort sessions by updatedAt in descending order (most recent first)
    const sortedSessions = [...mockSessions].sort((a, b) =>
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
    return mockApiClient.get({ sessions: sortedSessions });
  },

  createSession: async (title: string): Promise<Session> => {
    const newSession: Session = {
      id: MockDataGenerator.generateId(),
      title,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    mockSessions.unshift(newSession);
    mockMessages[newSession.id] = [];
    
    return mockApiClient.post(newSession);
  },

  getMessages: async (sessionId: string): Promise<GetMessagesResponse> => {
    const messages = mockMessages[sessionId] || [];
    return mockApiClient.get({ messages });
  },

  sendMessage: async (sessionId: string, message: SendMessageRequest): Promise<Message> => {
    const userMessage: Message = {
      id: MockDataGenerator.generateId(),
      content: message.content,
      role: 'user',
      timestamp: new Date().toISOString()
    };

    // Add user message
    if (!mockMessages[sessionId]) {
      mockMessages[sessionId] = [];
    }
    mockMessages[sessionId].push(userMessage);

    // Generate assistant response
    const assistantResponses = [
      "That's an interesting question. Based on the documents I've analyzed, I can provide you with the following insights...",
      "I've processed your request and found relevant information in the knowledge base. Here's what I discovered...",
      "After reviewing the available data, I can tell you that...",
      "According to the information I have access to, the answer would be..."
    ];

    const assistantMessage: Message = {
      id: MockDataGenerator.generateId(),
      content: assistantResponses[Math.floor(Math.random() * assistantResponses.length)],
      role: 'assistant',
      timestamp: new Date().toISOString()
    };

    mockMessages[sessionId].push(assistantMessage);

    // Update session
    const session = mockSessions.find(s => s.id === sessionId);
    if (session) {
      session.updatedAt = new Date().toISOString();
    }

    return mockApiClient.post(userMessage, 1000);
  },

  // Streaming message method
  sendMessageStream: async (
    sessionId: string, 
    message: SendMessageRequest,
    onChunk?: (chunk: StreamChunk) => void
  ): Promise<ReadableStream<StreamChunk>> => {
    // Add user message immediately
    const userMessage: Message = {
      id: MockDataGenerator.generateId(),
      content: message.content,
      role: 'user',
      timestamp: new Date().toISOString()
    };

    if (!mockMessages[sessionId]) {
      mockMessages[sessionId] = [];
    }
    mockMessages[sessionId].push(userMessage);

    // Generate streaming response
    const assistantMessageId = MockDataGenerator.generateId();
    const fullResponse = "I'm processing your request and generating a comprehensive response based on the available knowledge. This is a simulated streaming response that demonstrates how the real LLM would provide information in chunks, allowing for a more interactive user experience.";
    
    const words = fullResponse.split(' ');
    const chunks: string[] = [];
    
    // Create chunks of 1-3 words each
    for (let i = 0; i < words.length; i += Math.floor(Math.random() * 3) + 1) {
      chunks.push(words.slice(i, i + Math.floor(Math.random() * 3) + 1).join(' '));
    }

    // Create stream
    const stream = mockApiClient.createStreamResponse(chunks,
      onChunk ? (chunk: string) => {
        onChunk({
          type: 'token',
          content: chunk,
          messageId: assistantMessageId
        });
      } : undefined,
      150
    );

    // Store the complete message when done
    setTimeout(() => {
      const assistantMessage: Message = {
        id: assistantMessageId,
        content: fullResponse,
        role: 'assistant',
        timestamp: new Date().toISOString()
      };
      
      mockMessages[sessionId].push(assistantMessage);
      
      // Update session
      const session = mockSessions.find(s => s.id === sessionId);
      if (session) {
        session.updatedAt = new Date().toISOString();
      }
    }, chunks.length * 150);

    return stream;
  }
};
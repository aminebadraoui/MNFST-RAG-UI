import { 
  Chat,
  CreateChatRequest,
  UpdateChatRequest,
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
let mockChats: Chat[] = MockDataGenerator.generateChats();
let mockSessions: Session[] = MockDataGenerator.generateSessions();
let mockMessages: Record<string, Message[]> = {};

// Initialize messages for existing sessions
mockSessions.forEach(session => {
  mockMessages[session.id] = MockDataGenerator.generateMessages(session.id);
});

// Define DataResponse interface for type safety
interface DataResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const mockChatAPI = {
  // Chat endpoints
  getChats: async (): Promise<Chat[]> => {
    const response = await mockApiClient.get<DataResponse<Chat[]>>({
      success: true,
      data: mockChats,
      message: "Chats retrieved successfully"
    });
    return response.data;
  },

  createChat: async (data: CreateChatRequest): Promise<Chat> => {
    const newChat: Chat = {
      id: MockDataGenerator.generateId(),
      name: data.name,
      systemPrompt: data.systemPrompt,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tenantId: 'mock-tenant-id',
      sessionCount: 0
    };
    
    mockChats.unshift(newChat);
    
    const response = await mockApiClient.post<DataResponse<Chat>>({
      success: true,
      data: newChat,
      message: "Chat created successfully"
    });
    return response.data;
  },

  getChat: async (chatId: string): Promise<Chat> => {
    const chat = mockChats.find(c => c.id === chatId);
    if (!chat) {
      throw new Error('Chat not found');
    }
    
    const response = await mockApiClient.get<DataResponse<Chat>>({
      success: true,
      data: chat,
      message: "Chat retrieved successfully"
    });
    return response.data;
  },

  updateChat: async (chatId: string, data: UpdateChatRequest): Promise<Chat> => {
    const chatIndex = mockChats.findIndex(c => c.id === chatId);
    if (chatIndex === -1) {
      throw new Error('Chat not found');
    }
    
    mockChats[chatIndex] = {
      ...mockChats[chatIndex],
      ...data,
      updatedAt: new Date().toISOString()
    };
    
    const response = await mockApiClient.get<DataResponse<Chat>>({
      success: true,
      data: mockChats[chatIndex],
      message: "Chat updated successfully"
    });
    return response.data;
  },

  deleteChat: async (chatId: string): Promise<void> => {
    const chatIndex = mockChats.findIndex(c => c.id === chatId);
    if (chatIndex === -1) {
      throw new Error('Chat not found');
    }
    
    mockChats.splice(chatIndex, 1);
    
    // Also delete associated sessions and messages
    mockSessions = mockSessions.filter(s => s.chatId !== chatId);
    Object.keys(mockMessages).forEach(messageId => {
      const session = mockSessions.find(s => s.id === messageId);
      if (!session || session.chatId === chatId) {
        delete mockMessages[messageId];
      }
    });
  },

  // Session endpoints
  getChatSessions: async (chatId: string): Promise<Session[]> => {
    const sessions = mockSessions.filter(s => s.chatId === chatId);
    const response = await mockApiClient.get<DataResponse<Session[]>>({
      success: true,
      data: sessions,
      message: "Sessions retrieved successfully"
    });
    return response.data;
  },

  createSession: async (data: CreateSessionRequest): Promise<Session> => {
    const newSession: Session = {
      id: MockDataGenerator.generateId(),
      title: data.title,
      chatId: data.chat_id,
      userId: 'mock-user-id',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    mockSessions.unshift(newSession);
    mockMessages[newSession.id] = [];
    
    const response = await mockApiClient.post<DataResponse<Session>>({
      success: true,
      data: newSession,
      message: "Session created successfully"
    });
    return response.data;
  },

  deleteSession: async (sessionId: string): Promise<void> => {
    const sessionIndex = mockSessions.findIndex(s => s.id === sessionId);
    if (sessionIndex === -1) {
      throw new Error('Session not found');
    }
    
    mockSessions.splice(sessionIndex, 1);
    delete mockMessages[sessionId];
  },

  // Message endpoints
  getMessages: async (sessionId: string): Promise<Message[]> => {
    const messages = mockMessages[sessionId] || [];
    const response = await mockApiClient.get<DataResponse<Message[]>>({
      success: true,
      data: messages,
      message: "Messages retrieved successfully"
    });
    return response.data;
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

    const response = await mockApiClient.post<DataResponse<Message>>({
      success: true,
      data: userMessage,
      message: "Message sent successfully"
    });
    return response.data;
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
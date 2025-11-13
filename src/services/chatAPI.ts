import { apiClient } from './apiClient';
import {
  Chat,
  CreateChatRequest,
  UpdateChatRequest,
  Session,
  CreateSessionRequest,
  Message,
  SendMessageRequest,
  StreamChunk
} from '../types';

// Define DataResponse interface for type safety
interface DataResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const chatAPI = {
  // Chat endpoints
  getChats: async (): Promise<Chat[]> => {
    const response = await apiClient.get<DataResponse<Chat[]>>('/chats');
    return response.data.data;
  },

  createChat: async (data: CreateChatRequest): Promise<Chat> => {
    const response = await apiClient.post<DataResponse<Chat>>('/chats', data);
    return response.data.data;
  },

  getChat: async (chatId: string): Promise<Chat> => {
    const response = await apiClient.get<DataResponse<Chat>>(`/chats/${chatId}`);
    return response.data.data;
  },

  updateChat: async (chatId: string, data: UpdateChatRequest): Promise<Chat> => {
    const response = await apiClient.put<DataResponse<Chat>>(`/chats/${chatId}`, data);
    return response.data.data;
  },

  deleteChat: async (chatId: string): Promise<void> => {
    await apiClient.delete(`/chats/${chatId}`);
  },

  // Session endpoints
  getChatSessions: async (chatId: string): Promise<Session[]> => {
    const response = await apiClient.get<DataResponse<Session[]>>(`/sessions?chat_id=${chatId}`);
    return response.data.data;
  },

  createSession: async (data: CreateSessionRequest): Promise<Session> => {
    const response = await apiClient.post<DataResponse<Session>>('/sessions', data);
    return response.data.data;
  },

  deleteSession: async (sessionId: string): Promise<void> => {
    await apiClient.delete(`/sessions/${sessionId}`);
  },

  // Message endpoints
  getMessages: async (sessionId: string): Promise<Message[]> => {
    const response = await apiClient.get<DataResponse<Message[]>>(`/sessions/${sessionId}/messages`);
    return response.data.data;
  },

  sendMessage: async (sessionId: string, message: SendMessageRequest): Promise<Message> => {
    const response = await apiClient.post<DataResponse<Message>>(`/sessions/${sessionId}/messages`, message);
    return response.data.data;
  },

  // Streaming message method
  sendMessageStream: async (
    sessionId: string,
    message: SendMessageRequest,
    onChunk?: (chunk: StreamChunk) => void
  ): Promise<ReadableStream<StreamChunk>> => {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api'}/sessions/${sessionId}/messages/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        'Accept': 'text/event-stream',
        'Cache-Control': 'no-cache',
      },
      body: JSON.stringify(message)
    });

    if (!response.ok) {
      throw new Error(`Failed to send message: ${response.statusText}`);
    }

    return new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        if (!reader) {
          controller.close();
          return;
        }

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || ''; // Keep the last incomplete line in buffer

            for (const line of lines) {
              if (line.trim() === '') continue; // Skip empty lines
              
              if (line.startsWith('data: ')) {
                try {
                  const data = JSON.parse(line.slice(6));
                  if (onChunk) onChunk(data);
                  controller.enqueue(data);
                } catch (e) {
                  console.error('Failed to parse SSE data:', line, e);
                }
              }
            }
          }
          
          // Process any remaining data in buffer
          if (buffer.trim() && buffer.startsWith('data: ')) {
            try {
              const data = JSON.parse(buffer.slice(6));
              if (onChunk) onChunk(data);
              controller.enqueue(data);
            } catch (e) {
              console.error('Failed to parse final SSE data:', buffer, e);
            }
          }
        } catch (error) {
          console.error('Stream reading error:', error);
          controller.error(error);
        } finally {
          controller.close();
        }
      }
    });
  }
};
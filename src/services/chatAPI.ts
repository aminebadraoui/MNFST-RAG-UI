import { apiClient } from './apiClient';
import {
  Message,
  Session,
  CreateSessionRequest,
  SendMessageRequest,
  GetMessagesResponse,
  GetSessionsResponse,
  StreamChunk
} from '../types';

export const chatAPI = {
  getSessions: async (): Promise<GetSessionsResponse> => {
    const response = await apiClient.get<GetSessionsResponse>('/sessions');
    return response.data;
  },

  createSession: async (title: string): Promise<Session> => {
    const response = await apiClient.post<Session>('/sessions', { title });
    return response.data;
  },

  getMessages: async (sessionId: string): Promise<GetMessagesResponse> => {
    const response = await apiClient.get<GetMessagesResponse>(`/sessions/${sessionId}/messages`);
    return response.data;
  },

  sendMessage: async (sessionId: string, message: SendMessageRequest): Promise<Message> => {
    const response = await apiClient.post<Message>(`/sessions/${sessionId}/messages`, message);
    return response.data;
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
      },
      body: JSON.stringify(message)
    });

    if (!response.ok) {
      throw new Error('Failed to send message');
    }

    return new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (!reader) {
          controller.close();
          return;
        }

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            const lines = chunk.split('\n');

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                try {
                  const data = JSON.parse(line.slice(6));
                  if (onChunk) onChunk(data);
                  controller.enqueue(data);
                } catch (e) {
                  console.error('Failed to parse SSE data:', e);
                }
              }
            }
          }
        } catch (error) {
          controller.error(error);
        } finally {
          controller.close();
        }
      }
    });
  }
};
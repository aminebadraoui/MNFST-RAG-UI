import { apiClient } from './apiClient';
import { 
  Message, 
  Session, 
  CreateSessionRequest, 
  SendMessageRequest, 
  GetMessagesResponse, 
  GetSessionsResponse 
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
};
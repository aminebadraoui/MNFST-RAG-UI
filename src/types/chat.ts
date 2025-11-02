export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: string;
}

export interface Session {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messageCount: number;
}

export interface CreateSessionRequest {
  title: string;
}

export interface SendMessageRequest {
  content: string;
  role: 'user';
}

export interface GetMessagesResponse {
  messages: Message[];
}

export interface GetSessionsResponse {
  sessions: Session[];
}
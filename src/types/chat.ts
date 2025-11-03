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
}

export interface CreateSessionRequest {
  title: string;
}

export interface SendMessageRequest {
  content: string;
  role: 'user';
  stream?: boolean; // Optional flag to request streaming
}

export interface StreamMessageRequest {
  content: string;
  role: 'user';
}

export interface StreamChunk {
  type: 'start' | 'token' | 'end' | 'error';
  messageId?: string;
  content?: string;
  complete?: boolean;
  error?: string;
}

export interface StreamResponse {
  getReader(): ReadableStreamDefaultReader<StreamChunk>;
  cancel(): void;
}

export interface GetMessagesResponse {
  messages: Message[];
}

export interface GetSessionsResponse {
  sessions: Session[];
}
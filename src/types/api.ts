export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}

export interface ApiError {
  error: string;
  message: string;
  details?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface MockConfig {
  enabled: boolean;
  delay: {
    min: number;
    max: number;
  };
  errorRate: number; // 0-1, probability of simulated errors
}

export interface MockResponse<T> {
  data: T;
  delay?: number;
  error?: boolean;
}
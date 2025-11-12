import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

class APIClient {
  private client: AxiosInstance;
  private baseURL: string;

  constructor(baseURL: string = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api') {
    this.baseURL = baseURL;
    this.client = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor to add auth token and transform data
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('accessToken');
        console.log('Request interceptor - token:', token);
        console.log('Request interceptor - URL:', config.url);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
          console.log('Request interceptor - Authorization header set');
        } else {
          console.log('Request interceptor - No token found');
        }
        
        // Convert camelCase to snake_case in request data
        if (config.data) {
          config.data = this.transformKeysToSnakeCase(config.data);
        }
        
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor to handle token refresh and data transformation
    this.client.interceptors.response.use(
      (response) => {
        // Convert snake_case to camelCase in response data
        if (response.data) {
          response.data = this.transformKeysToCamelCase(response.data);
        }
        return response;
      },
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken && refreshToken !== 'undefined') {
              console.log('Attempting to refresh token');
              // Use a plain axios call without auth headers for refresh
              const response = await axios.post(`${this.baseURL}/auth/refresh`, {
                refresh_token: refreshToken,
              }, {
                headers: {
                  'Content-Type': 'application/json',
                },
              });

              console.log('Refresh response:', response.data);

              // Handle the nested response structure from the backend
              // The backend returns: { data: { data: { access_token, expires_in }, message } }
              const responseData = this.transformKeysToCamelCase(response.data);
              if (responseData && responseData.data && responseData.data.accessToken) {
                const { accessToken } = responseData.data;
                localStorage.setItem('accessToken', accessToken);

                // Retry the original request with new token
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return this.client(originalRequest);
              } else {
                console.error('Invalid response format from refresh endpoint:', responseData);
                throw new Error('Invalid response format from refresh endpoint');
              }
            }
          } catch (refreshError) {
            console.error('Token refresh failed:', refreshError);
            // Refresh failed, logout user
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('userData');
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  updateBaseURL(newURL: string) {
    this.baseURL = newURL;
    this.client.defaults.baseURL = newURL;
  }

  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.get(url, config);
  }

  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.post(url, data, config);
  }

  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.put(url, data, config);
  }

  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.delete(url, config);
  }

  // Special method for file uploads
  upload<T = any>(url: string, formData: FormData, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.post(url, formData, {
      ...config,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...config?.headers,
      },
    });
  }

  /**
   * Recursively converts object keys from snake_case to camelCase
   */
  private transformKeysToCamelCase(obj: any): any {
    if (obj === null || obj === undefined) {
      return obj;
    }

    if (Array.isArray(obj)) {
      return obj.map(item => this.transformKeysToCamelCase(item));
    }

    if (typeof obj === 'object') {
      const transformed: any = {};
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          // Convert snake_case to camelCase
          const camelCaseKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
          transformed[camelCaseKey] = this.transformKeysToCamelCase(obj[key]);
        }
      }
      return transformed;
    }

    return obj;
  }

  /**
   * Recursively converts object keys from camelCase to snake_case
   */
  private transformKeysToSnakeCase(obj: any): any {
    if (obj === null || obj === undefined) {
      return obj;
    }

    if (Array.isArray(obj)) {
      return obj.map(item => this.transformKeysToSnakeCase(item));
    }

    if (typeof obj === 'object') {
      const transformed: any = {};
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          // Convert camelCase to snake_case
          const snakeCaseKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
          transformed[snakeCaseKey] = this.transformKeysToSnakeCase(obj[key]);
        }
      }
      return transformed;
    }

    return obj;
  }
}

export const apiClient = new APIClient();
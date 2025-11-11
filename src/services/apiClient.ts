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
    // Request interceptor to add auth token
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
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor to handle token refresh
    this.client.interceptors.response.use(
      (response) => response,
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
              const responseData = response.data;
              if (responseData && responseData.data && responseData.data.access_token) {
                const { access_token } = responseData.data;
                localStorage.setItem('accessToken', access_token);

                // Retry the original request with new token
                originalRequest.headers.Authorization = `Bearer ${access_token}`;
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
}

export const apiClient = new APIClient();
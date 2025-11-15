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
        
        // Enhanced logging for debugging
        console.group(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
        console.log('Full URL:', `${this.baseURL}${config.url}`);
        console.log('Method:', config.method?.toUpperCase());
        console.log('Headers:', config.headers);
        console.log('Request Data:', config.data);
        console.log('Params:', config.params);
        console.log('Token present:', !!token);
        console.log('Token (first 10 chars):', token ? token.substring(0, 10) + '...' : 'N/A');
        console.groupEnd();
        
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        
        // Convert camelCase to snake_case in request data
        if (config.data) {
          const originalData = JSON.parse(JSON.stringify(config.data));
          config.data = this.transformKeysToSnakeCase(config.data);
          
          // Log the transformation
          if (JSON.stringify(originalData) !== JSON.stringify(config.data)) {
            console.group('🔄 Request Data Transformation');
            console.log('Original (camelCase):', originalData);
            console.log('Transformed (snake_case):', config.data);
            console.groupEnd();
          }
        }
        
        return config;
      },
      (error) => {
        console.group('❌ Request Interceptor Error');
        console.error('Error:', error);
        console.groupEnd();
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle token refresh and data transformation
    this.client.interceptors.response.use(
      (response) => {
        // Enhanced response logging
        console.group(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`);
        console.log('Status:', response.status);
        console.log('Status Text:', response.statusText);
        console.log('Response Headers:', response.headers);
        console.log('Response Data:', response.data);
        
        // Log redirects specifically
        if (response.request?.responseURL && response.request.responseURL !== `${this.baseURL}${response.config.url}`) {
          console.warn('🔄 Redirect detected:');
          console.warn('  Original URL:', `${this.baseURL}${response.config.url}`);
          console.warn('  Final URL:', response.request.responseURL);
        }
        
        // Convert snake_case to camelCase in response data
        if (response.data) {
          const originalData = JSON.parse(JSON.stringify(response.data));
          response.data = this.transformKeysToCamelCase(response.data);
          
          // Log the transformation
          if (JSON.stringify(originalData) !== JSON.stringify(response.data)) {
            console.group('🔄 Response Data Transformation');
            console.log('Original (snake_case):', originalData);
            console.log('Transformed (camelCase):', response.data);
            console.groupEnd();
          }
        }
        
        console.groupEnd();
        return response;
      },
      async (error) => {
        const originalRequest = error.config;
        
        // Enhanced error logging
        console.group(`❌ API Error: ${originalRequest?.method?.toUpperCase()} ${originalRequest?.url}`);
        console.log('Error Message:', error.message);
        console.log('Error Code:', error.code);
        
        if (error.response) {
          console.log('Response Status:', error.response.status);
          console.log('Response Status Text:', error.response.statusText);
          console.log('Response Headers:', error.response.headers);
          console.log('Response Data:', error.response.data);
          
          // Special logging for 422 validation errors
          if (error.response.status === 422) {
            console.error('🚨 422 Validation Error Details:');
            console.error('Request Data:', originalRequest?.data);
            console.error('Validation Errors:', error.response.data);
          }
          
          // Special logging for 307 redirects
          if (error.response.status === 307) {
            console.warn('🔄 307 Redirect Detected:');
            console.warn('Location Header:', error.response.headers.location);
          }
        } else if (error.request) {
          console.log('No response received. Request:', error.request);
        } else {
          console.log('Error setting up request:', error.message);
        }
        console.groupEnd();

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken && refreshToken !== 'undefined') {
              console.log('🔄 Attempting to refresh token');
              // Use a plain axios call without auth headers for refresh
              const response = await axios.post(`${this.baseURL}/auth/refresh`, {
                refresh_token: refreshToken,
              }, {
                headers: {
                  'Content-Type': 'application/json',
                },
              });

              console.log('✅ Refresh response:', response.data);

              // Handle the nested response structure from the backend
              // The backend returns: { data: { data: { access_token, expires_in }, message } }
              const responseData = this.transformKeysToCamelCase(response.data);
              if (responseData && responseData.data && responseData.data.accessToken) {
                const { accessToken } = responseData.data;
                localStorage.setItem('accessToken', accessToken);

                // Retry the original request with new token
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                console.log('🔄 Retrying original request with new token');
                return this.client(originalRequest);
              } else {
                console.error('❌ Invalid response format from refresh endpoint:', responseData);
                throw new Error('Invalid response format from refresh endpoint');
              }
            }
          } catch (refreshError) {
            console.error('❌ Token refresh failed:', refreshError);
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

    if (typeof obj === 'object' && obj.constructor === Object) {
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

    if (typeof obj === 'object' && obj.constructor === Object) {
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
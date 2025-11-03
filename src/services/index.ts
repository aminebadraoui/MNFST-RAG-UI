export * from './apiClient';
export * from './authAPI';
export * from './chatAPI';
export * from './documentAPI';
export * from './socialAPI';
export * from './tenantAPI';
export * from './userAPI';
export * from './mock/mockConfig';

// Export the configured APIs from the factory
export { authAPI, chatAPI, documentAPI, socialAPI, tenantAPI, userAPI } from './apiServiceFactory';
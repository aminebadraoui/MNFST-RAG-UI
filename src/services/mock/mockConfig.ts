import { MockConfig } from '../../types/api';

export const mockConfig: MockConfig = {
  enabled: import.meta.env.VITE_USE_MOCK_API === 'true',
  services: {
    auth: import.meta.env.VITE_USE_MOCK_AUTH !== 'false', // Default to true unless explicitly set to false
    chat: import.meta.env.VITE_USE_MOCK_CHAT !== 'false',
    document: import.meta.env.VITE_USE_MOCK_DOCUMENT !== 'false',
    social: import.meta.env.VITE_USE_MOCK_SOCIAL !== 'false',
    tenant: import.meta.env.VITE_USE_MOCK_TENANT !== 'false',
    user: import.meta.env.VITE_USE_MOCK_USER !== 'false'
  },
  delay: {
    min: parseInt(import.meta.env.VITE_MOCK_DELAY_MIN || '500'),
    max: parseInt(import.meta.env.VITE_MOCK_DELAY_MAX || '2000')
  },
  errorRate: parseFloat(import.meta.env.VITE_MOCK_ERROR_RATE || '0.1')
};
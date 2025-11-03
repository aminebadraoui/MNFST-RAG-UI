import { MockConfig } from '../../types/api';

export const mockConfig: MockConfig = {
  enabled: import.meta.env.VITE_USE_MOCK_API === 'true',
  delay: {
    min: parseInt(import.meta.env.VITE_MOCK_DELAY_MIN || '500'),
    max: parseInt(import.meta.env.VITE_MOCK_DELAY_MAX || '2000')
  },
  errorRate: parseFloat(import.meta.env.VITE_MOCK_ERROR_RATE || '0.1')
};
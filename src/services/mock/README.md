# Mock API Services

This directory contains mock implementations of all API services for the RAG Chat application. These mock services enable frontend development and testing without requiring a backend implementation.

## Files

- [`mockApiClient.ts`](./mockApiClient.ts) - Core mock API client with network simulation
- [`mockAuthAPI.ts`](./mockAuthAPI.ts) - Mock authentication service
- [`mockChatAPI.ts`](./mockChatAPI.ts) - Mock chat service with streaming support
- [`mockDocumentAPI.ts`](./mockDocumentAPI.ts) - Mock document service with multiple upload support
- [`mockSocialAPI.ts`](./mockSocialAPI.ts) - Mock social media service
- [`mockConfig.ts`](./mockConfig.ts) - Mock configuration management
- [`mockDataGenerator.ts`](./mockDataGenerator.ts) - Realistic mock data generation

## Usage

### Enabling Mock API

Set `VITE_USE_MOCK_API=true` in your `.env` file to enable mock services:

```bash
# .env
VITE_USE_MOCK_API=true
VITE_MOCK_DELAY_MIN=500
VITE_MOCK_DELAY_MAX=2000
VITE_MOCK_ERROR_RATE=0.1
```

### Configuration Options

- `VITE_USE_MOCK_API`: Enable/disable mock services (true/false)
- `VITE_MOCK_DELAY_MIN`: Minimum simulated network delay in milliseconds
- `VITE_MOCK_DELAY_MAX`: Maximum simulated network delay in milliseconds
- `VITE_MOCK_ERROR_RATE`: Probability of simulated errors (0.0-1.0)

### Authentication

Mock authentication uses these credentials:
- Email: `user@example.com`
- Password: `password`

```typescript
import { authAPI } from '../services';

try {
  const response = await authAPI.login('user@example.com', 'password');
  console.log('Login successful:', response.user);
} catch (error) {
  console.error('Login failed:', error.message);
}
```

### Chat with Streaming

```typescript
import { chatAPI } from '../services';

// Regular message
const message = await chatAPI.sendMessage(sessionId, {
  content: 'Hello, how can you help me?',
  role: 'user'
});

// Streaming message
const stream = await chatAPI.sendMessageStream(sessionId, {
  content: 'Explain quantum computing',
  role: 'user'
}, (chunk) => {
  console.log('Received chunk:', chunk);
});

const reader = stream.getReader();
while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  console.log('Stream chunk:', value);
}
```

### Document Uploads

```typescript
import { documentAPI } from '../services';

// Single file upload
const file = document.querySelector('input[type="file"]').files[0];
const uploadedDoc = await documentAPI.uploadDocument(file, (progress) => {
  console.log(`Upload progress: ${progress}%`);
});

// Multiple file upload
const files = Array.from(document.querySelector('input[type="file"]').files);
const uploadResponse = await documentAPI.uploadMultipleDocuments(files, (progress) => {
  progress.forEach(({ fileId, progress }) => {
    console.log(`File ${fileId}: ${progress}%`);
  });
});

// Check upload status
const status = await documentAPI.getUploadStatus(uploadResponse.uploadId);
console.log('Upload status:', status);
```

### Social Media Links

```typescript
import { socialAPI } from '../services';

// Get all links
const { links } = await socialAPI.getLinks();

// Add new link
const newLink = await socialAPI.addLink('https://twitter.com/example');

// Remove link
await socialAPI.removeLink(linkId);
```

## Features

### Realistic Data Generation

The mock services generate realistic test data:
- User profiles with proper structure
- Chat sessions with varied message counts
- Messages with realistic content and timestamps
- Documents with different file types and processing statuses
- Social media links for various platforms

### Network Simulation

- Configurable network delays (500-2000ms by default)
- Simulated error rates (10% by default)
- Progress tracking for file uploads
- Streaming responses for chat messages

### State Management

- In-memory storage maintains consistent state during testing
- Data persists across API calls within a session
- Realistic state transitions (uploaded → processing → processed)

### Error Handling

- Configurable error rates for testing edge cases
- Proper error messages and types
- Graceful fallbacks for invalid operations

## Testing Scenarios

The mock API enables testing various scenarios:

1. **Happy Path**: Normal operation with realistic delays
2. **Error Scenarios**: Network errors, validation failures
3. **Loading States**: Long-running operations with progress
4. **Streaming**: Real-time chat experience
5. **Multiple Uploads**: Concurrent file upload progress
6. **Empty States**: No data scenarios
7. **Pagination**: Large datasets with pagination

## Development Benefits

- 🚀 No backend dependency for initial development
- 🔄 Instant feedback on UI changes
- 🧪 Easy testing of loading and error states
- 📊 Realistic data for design validation
- 🎯 Consistent test data across runs
- ⚡ Fast test execution without network calls

## Switching to Real API

To switch from mock to real API:

1. Set `VITE_USE_MOCK_API=false` in your `.env` file
2. Ensure your backend server is running at the specified URL
3. All API calls will automatically use the real backend

The API service factory handles the switching automatically based on the configuration.
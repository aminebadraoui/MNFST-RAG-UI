import { MockConfig } from '../../types/api';

export class MockApiClient {
  private config: MockConfig;

  constructor(config: Partial<MockConfig> = {}) {
    this.config = {
      enabled: true,
      delay: { min: 500, max: 2000 },
      errorRate: 0.1,
      ...config
    };
  }

  private async delay(ms?: number): Promise<void> {
    const delayMs = ms ?? Math.floor(
      Math.random() * (this.config.delay.max - this.config.delay.min) + this.config.delay.min
    );
    return new Promise(resolve => setTimeout(resolve, delayMs));
  }

  private async simulateError(): Promise<void> {
    if (Math.random() < this.config.errorRate) {
      throw new Error('Simulated API error');
    }
  }

  async get<T>(data: T, customDelay?: number): Promise<T> {
    await this.delay(customDelay);
    await this.simulateError();
    return data;
  }

  async post<T>(data: T, customDelay?: number): Promise<T> {
    await this.delay(customDelay);
    await this.simulateError();
    return data;
  }

  async put<T>(data: T, customDelay?: number): Promise<T> {
    await this.delay(customDelay);
    await this.simulateError();
    return data;
  }

  async delete(customDelay?: number): Promise<void> {
    await this.delay(customDelay);
    await this.simulateError();
  }

  // Special method for file uploads with progress
  async upload<T>(
    data: T, 
    onProgress?: (progress: number) => void,
    customDelay?: number
  ): Promise<T> {
    const totalSteps = 10;
    const stepDelay = (customDelay ?? 1500) / totalSteps;
    
    for (let i = 1; i <= totalSteps; i++) {
      await this.delay(stepDelay);
      if (onProgress) {
        onProgress(Math.floor((i / totalSteps) * 100));
      }
    }
    
    await this.simulateError();
    return data;
  }

  // Special method for multiple file uploads with individual progress
  async uploadMultiple<T>(
    data: T,
    fileCount: number,
    onProgress?: (progress: { fileId: string; progress: number }[]) => void,
    customDelay?: number
  ): Promise<T> {
    const totalSteps = 10;
    const stepDelay = (customDelay ?? 2000) / totalSteps;
    
    for (let i = 1; i <= totalSteps; i++) {
      await this.delay(stepDelay);
      if (onProgress) {
        const progress = Array.from({ length: fileCount }, (_, index) => ({
          fileId: `file_${index}`,
          progress: Math.floor((i / totalSteps) * 100)
        }));
        onProgress(progress);
      }
    }
    
    await this.simulateError();
    return data;
  }

  // Special method for streaming responses
  createStreamResponse(
    chunks: string[],
    onChunk?: (chunk: string) => void,
    chunkDelay?: number
  ): ReadableStream {
    return new ReadableStream({
      async start(controller) {
        try {
          for (const chunk of chunks) {
            if (onChunk) onChunk(chunk);
            controller.enqueue(chunk);
            await new Promise(resolve => setTimeout(resolve, chunkDelay ?? 100));
          }
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      }
    });
  }
}

export const mockApiClient = new MockApiClient();
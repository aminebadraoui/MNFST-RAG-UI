import { User, Session, Message, Document, SocialLink, UserRole } from '../../types';

export class MockDataGenerator {
  private static idCounter = 1;

  static generateId(): string {
    return `mock_${MockDataGenerator.idCounter++}_${Date.now()}`;
  }

  static generateUser(role: UserRole = 'user', tenantId?: string): User {
    return {
      id: this.generateId(),
      email: role === 'superadmin' ? 'superadmin@ragchat.com' :
             role === 'tenant_admin' ? 'admin@tenant.com' : 'user@tenant.com',
      name: role === 'superadmin' ? 'Super Admin' :
             role === 'tenant_admin' ? 'Tenant Admin' : 'Regular User',
      role,
      tenantId: role !== 'superadmin' ? (tenantId || this.generateId()) : undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  static generateSessions(count: number = 5): Session[] {
    const sessions = Array.from({ length: count }, (_, i) => ({
      id: this.generateId(),
      title: `Chat Session ${i + 1}`,
      createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - i * 12 * 60 * 60 * 1000).toISOString()
    }));
    
    // Sort sessions by updatedAt in descending order (most recent first)
    return sessions.sort((a, b) =>
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }

  static generateMessages(sessionId: string, count: number = 10): Message[] {
    const messages: Message[] = [];
    const userMessages = [
      "What is the capital of France?",
      "Explain quantum computing",
      "How does photosynthesis work?",
      "What are the benefits of renewable energy?",
      "Can you help me understand machine learning?"
    ];
    
    const assistantMessages = [
      "The capital of France is Paris. It's known for its art, fashion, gastronomy and culture.",
      "Quantum computing is a revolutionary computing paradigm that uses quantum mechanics phenomena...",
      "Photosynthesis is the process by which plants convert sunlight, water, and carbon dioxide...",
      "Renewable energy offers numerous benefits including reduced greenhouse gas emissions...",
      "Machine learning is a subset of artificial intelligence that enables systems to learn..."
    ];

    for (let i = 0; i < count; i++) {
      const isUser = i % 2 === 0;
      messages.push({
        id: this.generateId(),
        content: isUser 
          ? userMessages[Math.floor(Math.random() * userMessages.length)]
          : assistantMessages[Math.floor(Math.random() * assistantMessages.length)],
        role: isUser ? 'user' : 'assistant',
        timestamp: new Date(Date.now() - (count - i) * 5 * 60 * 1000).toISOString()
      });
    }
    
    return messages;
  }

  static generateDocuments(count: number = 5): Document[] {
    const fileTypes = [
      { name: 'document.pdf', mimeType: 'application/pdf', size: 1024000 },
      { name: 'report.docx', mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', size: 2048000 },
      { name: 'presentation.pptx', mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation', size: 3072000 },
      { name: 'spreadsheet.xlsx', mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', size: 1536000 },
      { name: 'image.png', mimeType: 'image/png', size: 512000 }
    ];

    const statuses: Array<'uploaded' | 'processing' | 'processed' | 'error'> = ['uploaded', 'processing', 'processed', 'error'];

    return Array.from({ length: count }, () => {
      const fileType = fileTypes[Math.floor(Math.random() * fileTypes.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      
      return {
        id: this.generateId(),
        filename: `${this.generateId()}_${fileType.name}`,
        originalName: fileType.name,
        size: fileType.size + Math.floor(Math.random() * 100000),
        mimeType: fileType.mimeType,
        status,
        uploadedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        ...(status === 'processed' && { processedAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString() }),
        ...(status === 'error' && { error: 'Processing failed due to corrupted file' })
      };
    });
  }

  static generateSocialLinks(count: number = 3): SocialLink[] {
    const platforms: Array<'twitter' | 'facebook' | 'linkedin' | 'instagram' | 'youtube' | 'other'> = 
      ['twitter', 'facebook', 'linkedin', 'instagram', 'youtube', 'other'];
    
    const urls = [
      'https://twitter.com/example',
      'https://facebook.com/example',
      'https://linkedin.com/company/example',
      'https://instagram.com/example',
      'https://youtube.com/c/example'
    ];

    return Array.from({ length: count }, (_, i) => ({
      id: this.generateId(),
      url: urls[i % urls.length],
      platform: platforms[i % platforms.length],
      addedAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString()
    }));
  }
}
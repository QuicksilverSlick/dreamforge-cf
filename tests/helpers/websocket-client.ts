/**
 * WebSocket Test Client
 * Provides utilities for testing WebSocket connections
 */

import { vi } from 'vitest';

export interface WebSocketMessage {
  type: string;
  progress?: number;
  phase?: string;
  error?: string;
  timestamp: string;
  [key: string]: unknown;
}

export class TestWebSocketClient {
  private ws: WebSocket | null = null;
  private messages: WebSocketMessage[] = [];
  private messageCallbacks: Array<(message: WebSocketMessage) => void> = [];
  private closeCallback: (() => void) | null = null;
  private errorCallback: ((error: Event) => void) | null = null;

  constructor(
    private url: string,
    private authToken: string
  ) {}

  /**
   * Connect to WebSocket
   */
  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      const wsUrl = this.url.replace('http://', 'ws://').replace('https://', 'wss://');
      const fullUrl = `${wsUrl}?token=${this.authToken}`;

      this.ws = new WebSocket(fullUrl);

      this.ws.onopen = () => {
        console.log('WebSocket connected:', fullUrl);
        resolve();
      };

      this.ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data as string) as WebSocketMessage;
          this.messages.push(message);

          // Trigger callbacks
          this.messageCallbacks.forEach(callback => callback(message));
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        if (this.errorCallback) {
          this.errorCallback(error);
        }
        reject(error);
      };

      this.ws.onclose = () => {
        console.log('WebSocket closed');
        if (this.closeCallback) {
          this.closeCallback();
        }
      };
    });
  }

  /**
   * Register message callback
   */
  onMessage(callback: (message: WebSocketMessage) => void): void {
    this.messageCallbacks.push(callback);
  }

  /**
   * Register close callback
   */
  onClose(callback: () => void): void {
    this.closeCallback = callback;
  }

  /**
   * Register error callback
   */
  onError(callback: (error: Event) => void): void {
    this.errorCallback = callback;
  }

  /**
   * Wait for analysis to complete
   */
  async waitForCompletion(timeoutMs: number = 30000): Promise<boolean> {
    return new Promise((resolve) => {
      const timeout = setTimeout(() => {
        console.warn('WebSocket completion timeout');
        resolve(false);
      }, timeoutMs);

      this.onMessage((message) => {
        if (message.type === 'complete' || message.progress === 100) {
          clearTimeout(timeout);
          resolve(true);
        }
        if (message.type === 'error') {
          clearTimeout(timeout);
          resolve(false);
        }
      });
    });
  }

  /**
   * Get all received messages
   */
  getMessages(): WebSocketMessage[] {
    return [...this.messages];
  }

  /**
   * Get latest message
   */
  getLatestMessage(): WebSocketMessage | null {
    return this.messages.length > 0 ? this.messages[this.messages.length - 1] : null;
  }

  /**
   * Close connection
   */
  close(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  /**
   * Send message to server
   */
  send(message: Record<string, unknown>): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      throw new Error('WebSocket is not connected');
    }
  }
}

/**
 * Create WebSocket client for testing
 */
export async function createWebSocketClient(
  analysisId: string,
  authToken: string
): Promise<TestWebSocketClient> {
  const wsUrl = `http://example.com/api/byop/ws/${analysisId}`;
  const client = new TestWebSocketClient(wsUrl, authToken);
  await client.connect();
  return client;
}

/**
 * Mock WebSocket for unit tests
 */
export function createMockWebSocket() {
  const mockWs = {
    readyState: WebSocket.OPEN,
    send: vi.fn(),
    close: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    onopen: null as ((event: Event) => void) | null,
    onmessage: null as ((event: MessageEvent) => void) | null,
    onerror: null as ((event: Event) => void) | null,
    onclose: null as ((event: CloseEvent) => void) | null,

    // Test utilities
    simulateMessage: (data: WebSocketMessage) => {
      if (mockWs.onmessage) {
        mockWs.onmessage(new MessageEvent('message', { data: JSON.stringify(data) }));
      }
    },
    simulateOpen: () => {
      if (mockWs.onopen) {
        mockWs.onopen(new Event('open'));
      }
    },
    simulateClose: () => {
      if (mockWs.onclose) {
        mockWs.onclose(new CloseEvent('close'));
      }
    },
    simulateError: (error: Event) => {
      if (mockWs.onerror) {
        mockWs.onerror(error);
      }
    }
  };

  return mockWs;
}

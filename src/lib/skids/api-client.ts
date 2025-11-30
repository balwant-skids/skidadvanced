/**
 * SKIDS API Client
 * Handles communication with SKIDS platform
 */

export interface SKIDSConfig {
  baseUrl: string;
  apiKey: string;
  timeout: number;
}

export interface SKIDSChild {
  id: string;
  name: string;
  dateOfBirth: Date;
  parentId: string;
  healthConditions?: string[];
  medications?: string[];
  allergies?: string[];
  lastUpdated: Date;
}

export interface SKIDSHealthData {
  childId: string;
  metrics: {
    height?: number;
    weight?: number;
    bmi?: number;
    bloodPressure?: string;
    heartRate?: number;
  };
  conditions: string[];
  medications: string[];
  lastUpdated: Date;
}

export interface SKIDSAppointment {
  id: string;
  childId: string;
  providerId: string;
  providerName: string;
  scheduledAt: Date;
  type: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
}

export class SKIDSAPIClient {
  private config: SKIDSConfig;

  constructor(config: SKIDSConfig) {
    this.config = config;
  }

  /**
   * Fetch children for a parent
   */
  async getChildren(parentId: string): Promise<SKIDSChild[]> {
    try {
      const response = await this.request<SKIDSChild[]>(`/parents/${parentId}/children`);
      return response;
    } catch (error) {
      console.error('Error fetching children from SKIDS:', error);
      throw new Error('Failed to fetch children from SKIDS');
    }
  }

  /**
   * Fetch health data for a child
   */
  async getHealthData(childId: string): Promise<SKIDSHealthData> {
    try {
      const response = await this.request<SKIDSHealthData>(`/children/${childId}/health-data`);
      return response;
    } catch (error) {
      console.error('Error fetching health data from SKIDS:', error);
      throw new Error('Failed to fetch health data from SKIDS');
    }
  }

  /**
   * Fetch appointments for a child
   */
  async getAppointments(childId: string): Promise<SKIDSAppointment[]> {
    try {
      const response = await this.request<SKIDSAppointment[]>(`/children/${childId}/appointments`);
      return response;
    } catch (error) {
      console.error('Error fetching appointments from SKIDS:', error);
      throw new Error('Failed to fetch appointments from SKIDS');
    }
  }

  /**
   * Send development progress to SKIDS
   */
  async sendDevelopmentProgress(childId: string, progressData: any): Promise<void> {
    try {
      await this.request(`/children/${childId}/development-progress`, {
        method: 'POST',
        body: JSON.stringify(progressData),
      });
    } catch (error) {
      console.error('Error sending progress to SKIDS:', error);
      throw new Error('Failed to send progress to SKIDS');
    }
  }

  /**
   * Generic request handler with retry logic
   */
  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const url = `${this.config.baseUrl}${endpoint}`;
    const maxRetries = 3;
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const response = await fetch(url, {
          ...options,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.config.apiKey}`,
            ...options?.headers,
          },
          signal: AbortSignal.timeout(this.config.timeout),
        });

        if (!response.ok) {
          throw new Error(`SKIDS API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return data as T;
      } catch (error) {
        lastError = error as Error;
        
        // Don't retry on 4xx errors
        if (error instanceof Error && error.message.includes('4')) {
          throw error;
        }

        // Wait before retry (exponential backoff)
        if (attempt < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
        }
      }
    }

    throw lastError || new Error('SKIDS API request failed');
  }
}

// Singleton instance
let skidsClient: SKIDSAPIClient | null = null;

export function getSKIDSClient(): SKIDSAPIClient {
  if (!skidsClient) {
    skidsClient = new SKIDSAPIClient({
      baseUrl: process.env.SKIDS_API_URL || 'https://api.skids.example.com',
      apiKey: process.env.SKIDS_API_KEY || '',
      timeout: 10000, // 10 seconds
    });
  }
  return skidsClient;
}
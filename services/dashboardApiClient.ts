/**
 * API client for communicating with xTab-dashboard backend
 */

import { getConfig } from '../lib/config';
import type {
  CreatePostRequest,
  CreatePostResponse,
  UploadAttachmentRequest,
  UploadAttachmentResponse,
  HealthCheckResponse,
  DashboardApiError,
  PostData,
} from '../lib/types';

/**
 * Base API client class for xTab-dashboard integration
 */
export class DashboardApiClient {
  private baseUrl: string;
  private apiKey: string;

  constructor(baseUrl?: string, apiKey?: string) {
    const config = getConfig();
    this.baseUrl = baseUrl || config.dashboard.apiUrl;
    this.apiKey = apiKey || config.dashboard.apiKey;
  }

  /**
   * Make an authenticated API request
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(this.apiKey && { 'X-API-Key': this.apiKey }),
      ...(options.headers || {}),
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorData: DashboardApiError = await response.json().catch(() => ({
          error: 'API Error',
          message: `Request failed with status ${response.status}`,
          statusCode: response.status,
        }));
        throw new Error(errorData.message || `API request failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unexpected error occurred while communicating with the dashboard');
    }
  }

  /**
   * Check if the dashboard is available and responding
   */
  async healthCheck(): Promise<HealthCheckResponse> {
    try {
      return await this.request<HealthCheckResponse>('/health', {
        method: 'GET',
      });
    } catch (error) {
      return {
        status: 'error',
        timestamp: Date.now(),
      };
    }
  }

  /**
   * Create a new post in the dashboard
   */
  async createPost(postData: CreatePostRequest): Promise<CreatePostResponse> {
    return await this.request<CreatePostResponse>('/posts', {
      method: 'POST',
      body: JSON.stringify(postData),
    });
  }

  /**
   * Upload an image attachment for a post
   */
  async uploadAttachment(
    attachmentData: UploadAttachmentRequest
  ): Promise<UploadAttachmentResponse> {
    return await this.request<UploadAttachmentResponse>('/attachments', {
      method: 'POST',
      body: JSON.stringify(attachmentData),
    });
  }

  /**
   * Save a complete post with images to the dashboard
   * This is a high-level method that handles both post creation and image uploads
   */
  async savePost(postData: PostData): Promise<CreatePostResponse> {
    // Create the post first
    const createRequest: CreatePostRequest = {
      title: postData.title,
      content: postData.content,
      platforms: postData.platforms,
      status: postData.status,
      scheduledAt: postData.scheduledAt?.toISOString(),
      tags: postData.tags,
    };

    const postResponse = await this.createPost(createRequest);

    if (!postResponse.success) {
      throw new Error(postResponse.message || 'Failed to create post');
    }

    // Upload images as attachments
    if (postData.images && postData.images.length > 0) {
      const uploadPromises = postData.images.map((imageData, index) => {
        // Extract mime type and base64 data from data URL
        const dataUrlMatch = imageData.match(/^data:([^;]+);base64,(.+)$/);
        const mimeType = dataUrlMatch?.[1] || 'image/png';
        const base64Data = dataUrlMatch?.[2] || imageData;
        
        return this.uploadAttachment({
          postId: postResponse.postId,
          imageData: base64Data,
          filename: `image-${index + 1}.png`,
          mimeType,
        });
      });

      try {
        await Promise.all(uploadPromises);
      } catch (uploadError) {
        console.error('Failed to upload some attachments:', uploadError);
        // Continue even if some uploads fail
      }
    }

    return postResponse;
  }

  /**
   * Test the connection with custom settings
   */
  async testConnection(apiUrl: string, apiKey: string): Promise<boolean> {
    const testClient = new DashboardApiClient(apiUrl, apiKey);
    const health = await testClient.healthCheck();
    return health.status === 'ok';
  }
}

// Export a singleton instance
let apiClientInstance: DashboardApiClient | null = null;

/**
 * Get the shared API client instance
 */
export const getDashboardApiClient = (): DashboardApiClient => {
  if (!apiClientInstance) {
    apiClientInstance = new DashboardApiClient();
  }
  return apiClientInstance;
};

/**
 * Reset the API client instance (useful for testing or when settings change)
 */
export const resetDashboardApiClient = (): void => {
  apiClientInstance = null;
};

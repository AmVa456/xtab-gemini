/**
 * TypeScript types for xTab-dashboard API integration
 */

// Platform types that xTab-dashboard supports
export type Platform = 'reddit' | 'twitter' | 'linkedin' | 'medium' | 'facebook' | 'instagram';

// Post status
export type PostStatus = 'draft' | 'scheduled' | 'published';

// Connection status
export type ConnectionStatus = 'connected' | 'disconnected' | 'checking' | 'error';

/**
 * Request to create a new post in xTab-dashboard
 */
export interface CreatePostRequest {
  title: string;
  content?: string;
  platforms: Platform[];
  status: PostStatus;
  scheduledAt?: string; // ISO 8601 date string
  tags?: string[];
  categories?: string[];
}

/**
 * Response from creating a post
 */
export interface CreatePostResponse {
  success: boolean;
  postId: string;
  message: string;
  postUrl?: string;
}

/**
 * Request to upload an image attachment
 */
export interface UploadAttachmentRequest {
  postId: string;
  imageData: string; // base64 encoded image
  filename: string;
  mimeType: string;
}

/**
 * Response from uploading an attachment
 */
export interface UploadAttachmentResponse {
  success: boolean;
  attachmentId: string;
  url: string;
  message: string;
}

/**
 * Response from dashboard health check
 */
export interface HealthCheckResponse {
  status: 'ok' | 'error';
  version?: string;
  timestamp: number;
}

/**
 * Dashboard API error
 */
export interface DashboardApiError {
  error: string;
  message: string;
  statusCode: number;
}

/**
 * Complete post data for saving to dashboard
 */
export interface PostData {
  title: string;
  content: string;
  platforms: Platform[];
  status: PostStatus;
  scheduledAt?: Date;
  tags: string[];
  images: string[]; // Array of base64 encoded images
}

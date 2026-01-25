# xTab-Dashboard Integration Guide

This guide provides detailed instructions for integrating xtab-gemini with [xTab-dashboard](https://github.com/AmVa456/xTab-dashboard).

## Table of Contents

1. [Overview](#overview)
2. [Operating Modes](#operating-modes)
3. [Setup Instructions](#setup-instructions)
4. [Configuration](#configuration)
5. [API Documentation](#api-documentation)
6. [Usage Examples](#usage-examples)
7. [Embedding in xTab-Dashboard](#embedding-in-xtab-dashboard)
8. [Troubleshooting](#troubleshooting)
9. [Security Considerations](#security-considerations)

## Overview

xtab-gemini is a flexible AI-powered design studio that can operate both independently and as an integrated component of xTab-dashboard. When integrated, users can:

- Generate AI-powered images and videos
- Save generated content directly as posts in xTab-dashboard
- Manage content across multiple social media platforms
- Schedule posts for future publication
- Organize content with tags and categories

## Operating Modes

### 1. Standalone Mode (Default)

The app runs independently without any backend connection.

**Use Case:** Quick image generation without needing to save to a dashboard

**Configuration:**
```env
VITE_DASHBOARD_ENABLED=false
VITE_MODE=standalone
```

**Features:**
- Full image/video generation capabilities
- Local gallery storage
- No external dependencies

### 2. Integrated Mode

The app connects to a running xTab-dashboard instance via API.

**Use Case:** Generate content and save it as posts in your dashboard

**Configuration:**
```env
VITE_DASHBOARD_ENABLED=true
VITE_DASHBOARD_API_URL=http://localhost:5000/api
VITE_DASHBOARD_API_KEY=your_api_key_here
VITE_MODE=integrated
```

**Features:**
- All standalone features
- Connection status indicator
- Save to Dashboard functionality
- Post metadata management
- Multi-platform publishing

### 3. Embedded Mode

The app is embedded directly within xTab-dashboard as a component.

**Use Case:** Seamless in-dashboard content creation experience

**Configuration:**
```env
VITE_DASHBOARD_ENABLED=true
VITE_DASHBOARD_API_URL=http://localhost:5000/api
VITE_MODE=embedded
```

**Features:**
- All integrated mode features
- Optimized UI for embedding
- PostMessage communication support
- Shared authentication context

## Setup Instructions

### Prerequisites

- Node.js 18 or higher
- Google Gemini API key
- (Optional) Running xTab-dashboard instance

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Configure Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` with your configuration:
   ```env
   # Required: Your Gemini API key
   GEMINI_API_KEY=your_gemini_api_key_here
   
   # Optional: Enable dashboard integration
   VITE_DASHBOARD_ENABLED=true
   VITE_DASHBOARD_API_URL=http://localhost:5000/api
   VITE_DASHBOARD_API_KEY=your_dashboard_api_key
   VITE_MODE=integrated
   ```

### Step 3: Start the Application

```bash
npm run dev
```

The app will start on `http://localhost:5173` (or the next available port).

### Step 4: Verify Dashboard Connection

If you enabled dashboard integration:

1. Look for the connection status indicator in the header
2. Click on it to see connection details
3. Click "Test Connection" to verify connectivity
4. The indicator should show "Connected" in green

## Configuration

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `GEMINI_API_KEY` | Yes | - | Google Gemini API key |
| `VITE_DASHBOARD_ENABLED` | No | `false` | Enable dashboard integration |
| `VITE_DASHBOARD_API_URL` | No | `http://localhost:5000/api` | Dashboard API base URL |
| `VITE_DASHBOARD_API_KEY` | No | - | API key for dashboard authentication |
| `VITE_MODE` | No | `standalone` | App mode: `standalone`, `integrated`, or `embedded` |

### Runtime Configuration

You can also configure dashboard settings at runtime through the UI:

1. Click the connection status indicator in the header
2. Click the settings icon
3. Update API URL and API key
4. Save and test the connection

Settings are persisted in `localStorage` and will override environment variables.

## API Documentation

### Dashboard API Client

The `DashboardApiClient` class provides methods for interacting with xTab-dashboard.

#### Health Check

```typescript
const client = getDashboardApiClient();
const health = await client.healthCheck();
// Returns: { status: 'ok' | 'error', version?: string, timestamp: number }
```

#### Create Post

```typescript
const response = await client.createPost({
  title: 'My Generated Image',
  content: 'Created with AI',
  platforms: ['twitter', 'reddit'],
  status: 'draft',
  tags: ['ai', 'design'],
});
// Returns: { success: boolean, postId: string, message: string, postUrl?: string }
```

#### Upload Attachment

```typescript
const response = await client.uploadAttachment({
  postId: 'post-123',
  imageData: 'base64-encoded-image',
  filename: 'image.png',
  mimeType: 'image/png',
});
// Returns: { success: boolean, attachmentId: string, url: string, message: string }
```

#### Save Complete Post (Convenience Method)

```typescript
const response = await client.savePost({
  title: 'My AI Creation',
  content: 'Generated using Gemini',
  platforms: ['twitter', 'linkedin'],
  status: 'draft',
  tags: ['ai', 'creative'],
  images: ['data:image/png;base64,...'],
});
// Automatically creates post and uploads all images
```

### API Endpoints

xtab-gemini expects the following endpoints to be available on xTab-dashboard:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check endpoint |
| `/posts` | POST | Create a new post |
| `/attachments` | POST | Upload an image attachment |

### Request/Response Types

All types are defined in `lib/types.ts`:

- `Platform`: Supported social media platforms
- `PostStatus`: Post publication status
- `CreatePostRequest`: Request body for creating posts
- `CreatePostResponse`: Response from post creation
- `UploadAttachmentRequest`: Request body for uploading images
- `UploadAttachmentResponse`: Response from image upload
- `HealthCheckResponse`: Health check response

## Usage Examples

### Example 1: Generate and Save an Image

1. Navigate to the "Generate" mode
2. Enter a prompt: "A futuristic cityscape at sunset"
3. Click "Generate"
4. Wait for the AI to generate images
5. Click the cloud upload icon on your favorite image
6. Fill in the post details:
   - Title: "Futuristic Cityscape"
   - Platforms: Twitter, Reddit
   - Status: Draft
   - Tags: ai, cityscape, futuristic
7. Click "Save to Dashboard"
8. View success notification with link to the post

### Example 2: Batch Save Multiple Images

1. Generate multiple images
2. Save them to your gallery
3. Go to Gallery mode
4. Click the cloud upload icon on each image you want to save
5. Fill in post details for each one
6. All images will be uploaded to xTab-dashboard

### Example 3: Schedule a Post

1. Generate an image
2. Click "Save to Dashboard"
3. Fill in post details:
   - Title: "Morning Inspiration"
   - Status: Scheduled
   - Schedule Date: Select tomorrow at 9 AM
   - Platforms: Twitter, LinkedIn
4. Click "Save to Dashboard"
5. The post will be created with the scheduled time

## Embedding in xTab-Dashboard

### Building the Library

To use xtab-gemini as an embedded component in xTab-dashboard:

```bash
npm run build:lib
```

This creates library bundles in `dist/`:
- `xtab-gemini.es.js` - ES module format
- `xtab-gemini.umd.js` - UMD format

### Importing in xTab-Dashboard

#### ES Module Import

```javascript
import XtabGemini from './path/to/xtab-gemini.es.js';
import React from 'react';
import ReactDOM from 'react-dom';

// Render the component
ReactDOM.render(
  <XtabGemini />,
  document.getElementById('gemini-container')
);
```

#### UMD Import

```html
<script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
<script src="./path/to/xtab-gemini.umd.js"></script>

<script>
  ReactDOM.render(
    React.createElement(XtabGemini),
    document.getElementById('gemini-container')
  );
</script>
```

### Configuration for Embedded Mode

Set environment variables at build time:

```env
VITE_MODE=embedded
VITE_DASHBOARD_ENABLED=true
VITE_DASHBOARD_API_URL=/api
```

Or configure programmatically:

```javascript
// Configure before importing
window.__XTAB_GEMINI_CONFIG__ = {
  dashboardApiUrl: '/api',
  dashboardApiKey: 'your-key',
  mode: 'embedded'
};
```

## Troubleshooting

### Connection Issues

**Problem:** Connection status shows "Error" or "Disconnected"

**Solutions:**
1. Verify xTab-dashboard is running and accessible
2. Check the API URL is correct (include `/api` path)
3. Verify the API key is valid
4. Check CORS configuration on xTab-dashboard
5. Look for errors in browser console

**Testing:**
```bash
# Test if dashboard is responding
curl http://localhost:5000/api/health
```

### CORS Errors

**Problem:** Browser console shows CORS policy errors

**Solution:** Configure CORS on xTab-dashboard server:

```javascript
// Example for Express.js
app.use(cors({
  origin: 'http://localhost:5173', // xtab-gemini dev server
  credentials: true,
  allowedHeaders: ['Content-Type', 'X-API-Key']
}));
```

### API Key Authentication Failing

**Problem:** Requests return 401 Unauthorized

**Solutions:**
1. Verify the API key is correct
2. Check the header name matches what xTab-dashboard expects
3. Ensure the API key has proper permissions

### Images Not Uploading

**Problem:** Post created but images don't appear

**Solutions:**
1. Check image size limits on xTab-dashboard
2. Verify base64 encoding is correct
3. Check server logs for upload errors
4. Ensure `mimeType` is supported by dashboard

### Connection Status Not Updating

**Problem:** Status indicator doesn't reflect actual state

**Solutions:**
1. Manually click "Test Connection"
2. Refresh the page
3. Check browser console for errors
4. Clear localStorage and reconfigure

## Security Considerations

### API Key Protection

- **Never commit API keys** to version control
- Use environment variables (`.env.local`) for local development
- Use secure environment variable storage in production
- Rotate API keys regularly

### CORS Configuration

- Only allow trusted origins
- Don't use wildcard (`*`) origins in production
- Validate API keys on the server side

### Data Validation

- All post data is validated before sending
- Image data is sanitized
- XSS protection through React's built-in escaping

### HTTPS in Production

- Always use HTTPS for API communication in production
- Enforce HTTPS redirects on both apps
- Use secure headers (HSTS, CSP, etc.)

### Rate Limiting

Consider implementing rate limiting on xTab-dashboard to prevent abuse:

```javascript
// Example rate limiting (adjust based on your needs)
const rateLimit = {
  maxRequests: 100,
  windowMs: 15 * 60 * 1000, // 15 minutes
};
```

### Input Sanitization

All user inputs are sanitized before being sent to the API:
- HTML entities are escaped
- File uploads are validated
- Malicious patterns are filtered

## Support

For issues, questions, or feature requests:

1. Check this documentation first
2. Search existing GitHub issues
3. Create a new issue with:
   - Your configuration (without sensitive data)
   - Steps to reproduce
   - Expected vs actual behavior
   - Browser console errors
   - Network request details

## Additional Resources

- [xTab-dashboard Repository](https://github.com/AmVa456/xTab-dashboard)
- [Google Gemini API Documentation](https://ai.google.dev/docs)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)

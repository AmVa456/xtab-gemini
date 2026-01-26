# GitHub Copilot Instructions for xtab-gemini

## Repository Overview

xtab-gemini is an AI-powered design studio built with React, TypeScript, and Vite that integrates with Google's Gemini AI API for image generation, editing, and video creation. The app can operate in three modes:

1. **Standalone** - Independent web application
2. **Integrated** - Connected to xTab-dashboard via API
3. **Embedded** - Component embedded within xTab-dashboard

## Tech Stack

- **Frontend Framework**: React 19.1.1 with TypeScript
- **Build Tool**: Vite 6.2.0
- **AI Integration**: Google Gemini API (@google/genai)
- **Deployment**: GitHub Pages (automated via GitHub Actions)
- **Node Version**: 18.0.0 or higher

## Project Structure

```
├── components/          # React components
│   ├── ApiKeySettings.tsx
│   ├── ChatInput.tsx
│   ├── DashboardConnection.tsx
│   ├── Gallery.tsx
│   ├── ImageEditor.tsx
│   ├── VideoGenerator.tsx
│   └── ...
├── hooks/              # Custom React hooks
├── services/           # API clients and service layers
├── lib/                # Utility functions and types
├── App.tsx             # Main application component
├── index.tsx           # Application entry point
└── vite.config.ts      # Vite configuration
```

## Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production (standalone)
npm run build

# Build as library (for embedding)
npm run build:lib

# Preview production build
npm run preview
```

## Environment Configuration

Required environment variables (create `.env.local`):

```env
# Required
GEMINI_API_KEY=your_gemini_api_key_here

# Optional - xTab-Dashboard Integration
VITE_DASHBOARD_ENABLED=false
VITE_DASHBOARD_API_URL=http://localhost:5000/api
VITE_DASHBOARD_API_KEY=
VITE_MODE=standalone
```

## Coding Standards

### TypeScript

- Use TypeScript for all new files
- Enable strict type checking
- Define interfaces for component props
- Use type imports: `import type { ComponentProps } from 'react'`
- Path aliases: Use `@/*` for imports (configured in tsconfig.json)

### React Conventions

- Use functional components with hooks
- Use React 19 features (no legacy patterns)
- Component files use `.tsx` extension
- Export components as default exports
- Use `react-jsx` transform (no need to import React)
- Prefer composition over inheritance

### File Naming

- Components: PascalCase (e.g., `ImageEditor.tsx`)
- Utilities: camelCase (e.g., `apiClient.ts`)
- Types: PascalCase for interfaces and types

### Code Style

- Use 2 spaces for indentation
- Single quotes for strings
- Semicolons are optional (follow existing patterns)
- Use destructuring for props
- Keep components focused and small

## API Integration Patterns

### Gemini API

```typescript
import { GoogleGenerativeAI } from '@google/genai';

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
```

### Dashboard API Client

When `VITE_DASHBOARD_ENABLED=true`, use the dashboard API client:

```typescript
import { getDashboardApiClient } from '@/services/dashboardApi';

const client = getDashboardApiClient();
await client.healthCheck();
await client.createPost({ title, content, platforms, status, tags });
```

## State Management

- Use React hooks (`useState`, `useEffect`, `useCallback`, `useMemo`)
- Keep state close to where it's used
- Lift state up when needed for sharing
- Use localStorage for persisting user preferences

## Component Development

### Creating New Components

1. Create component file in `/components` directory
2. Define TypeScript interface for props
3. Implement component with proper typing
4. Export as default
5. Import in parent component

Example:

```typescript
interface MyComponentProps {
  title: string;
  onAction: () => void;
}

export default function MyComponent({ title, onAction }: MyComponentProps) {
  return (
    <div>
      <h2>{title}</h2>
      <button onClick={onAction}>Action</button>
    </div>
  );
}
```

## Error Handling

- Use try-catch blocks for async operations
- Display user-friendly error messages
- Log errors to console for debugging
- Handle API errors gracefully
- Validate user inputs before API calls

## Security Best Practices

- Never commit API keys to version control
- Use environment variables for sensitive data
- Validate and sanitize user inputs
- Use React's built-in XSS protection
- Implement proper CORS for API integration
- Keep dependencies updated

## Build Outputs

### Standalone Build (`npm run build`)
- Output: `dist/` directory
- Single-page application
- Deployed to GitHub Pages

### Library Build (`npm run build:lib`)
- Output: `dist/xtab-gemini.es.js` (ES module)
- Output: `dist/xtab-gemini.umd.js` (UMD)
- For embedding in other applications

## Testing Guidance

Currently no automated tests are configured. When adding tests:
- Use a testing framework compatible with Vite (e.g., Vitest)
- Test components in isolation
- Mock API calls
- Test user interactions
- Test error states

## Deployment

Automatic deployment via GitHub Actions (`.github/workflows/deploy.yml`):
- Triggers on push to `main` branch
- Runs `npm run build`
- Deploys to GitHub Pages
- Available at: https://amva456.github.io/xtab-gemini/

## Common Tasks

### Adding a New Feature

1. Create components in `/components`
2. Add services/API integration in `/services`
3. Update types in `/lib/types.ts` if needed
4. Import and integrate in `App.tsx`
5. Test locally with `npm run dev`
6. Build with `npm run build` to verify

### Integrating with xTab-Dashboard

See `INTEGRATION.md` for detailed integration guide:
- Configure environment variables
- Use `DashboardApiClient` for API calls
- Handle connection status
- Test with `npm run build:lib`

### Adding UI Components

- Keep components reusable
- Use TypeScript interfaces for props
- Handle loading and error states
- Make responsive for different screen sizes
- Follow existing UI patterns

## Troubleshooting

### Build Issues
- Check Node.js version (>= 18.0.0)
- Clear `node_modules` and reinstall: `rm -rf node_modules package-lock.json && npm install`
- Check for TypeScript errors: `tsc --noEmit`

### API Issues
- Verify `GEMINI_API_KEY` is set correctly
- Check API quota and limits
- Review browser console for errors
- Test API endpoint connectivity

### Dashboard Integration Issues
- Verify dashboard is running
- Check CORS configuration
- Validate API key
- Test connection with health check endpoint

## Additional Resources

- [Project README](../README.md) - Setup and usage
- [Integration Guide](../INTEGRATION.md) - xTab-dashboard integration
- [Google Gemini API Docs](https://ai.google.dev/docs)
- [React 19 Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)

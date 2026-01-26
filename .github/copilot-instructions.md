# GitHub Copilot Instructions for xtab-gemini

## Project Overview

xtab-gemini is a React + TypeScript application that provides an AI-powered design studio using Google's Gemini AI. The app enables users to generate images, edit images, create videos, and interact with an AI design assistant. It can operate in three modes:

1. **Standalone Mode** - Works independently without backend
2. **Integrated Mode** - Connects to xTab-dashboard via API to save posts
3. **Embedded Mode** - Can be embedded within xTab-dashboard as a component

## Tech Stack

- **Frontend**: React 19.1.1 with TypeScript 5.8
- **Build Tool**: Vite 6.2.0
- **AI Integration**: Google Gemini AI (`@google/genai` v1.14.0)
- **Styling**: CSS modules and inline styles
- **State Management**: React hooks (no external state management library)
- **Node Version**: >= 18.0.0

## Project Structure

```
/
├── .github/              # GitHub configuration and workflows
│   └── workflows/        # GitHub Actions CI/CD
├── components/           # React components
│   ├── ApiKeySettings.tsx       # API key management
│   ├── ChatInput.tsx            # Chat interface
│   ├── CodeInput.tsx            # Code editor component
│   ├── DashboardConnection.tsx  # Dashboard connectivity UI
│   ├── FeedbackDisplay.tsx      # Feedback messages
│   ├── Gallery.tsx              # Image gallery
│   ├── Header.tsx               # App header
│   ├── ImageEditor.tsx          # Image editing interface
│   ├── Loader.tsx               # Loading spinner
│   ├── SaveToPostDialog.tsx     # Save to dashboard dialog
│   └── VideoGenerator.tsx       # Video generation UI
├── hooks/                # Custom React hooks
│   └── useDashboardConnection.tsx  # Dashboard connection logic
├── lib/                  # Core library code
│   ├── config.ts         # Configuration management
│   └── types.ts          # TypeScript type definitions
├── services/             # Service layer
│   ├── dashboardApiClient.ts  # API client for xTab-dashboard
│   └── geminiService.ts       # Gemini AI service wrapper
├── App.tsx               # Main application component
├── index.tsx             # Application entry point
├── lib.tsx               # Library export (for embedded mode)
├── constants.ts          # Application constants
└── vite.config.ts        # Vite configuration

```

## Code Conventions

### TypeScript

- **Always use TypeScript** - No JavaScript files in the codebase
- **Strict typing** - Avoid `any` types; use proper type definitions
- **Type definitions** are located in `lib/types.ts` for shared types
- **Interface over type** for object shapes, but be flexible
- Use explicit return types for exported functions
- Enable `experimentalDecorators` and `jsx: react-jsx` settings

### React

- **Function components only** - No class components
- **Hooks** for state and side effects
- **Component file naming**: PascalCase matching component name (e.g., `ApiKeySettings.tsx`)
- **Props interface**: Define props as an interface named `ComponentNameProps`
- **Default exports** for components
- Use **React 19** features - updated hooks and APIs

### Environment Variables

- **Build-time variables**: Prefix with `VITE_` for client-side access
- **API keys**: Support multiple sources with priority:
  1. User-provided (localStorage)
  2. Build-time environment variables
- **Never commit** `.env.local` or `.env` files with real keys
- Use `.env.example` as template for required variables

### File Organization

- **Services** (`/services`): External API interactions and complex logic
- **Components** (`/components`): UI components, each in its own file
- **Hooks** (`/hooks`): Custom React hooks
- **Lib** (`/lib`): Core utilities, configuration, and types
- **One component per file** - no multiple exports of components

### Naming Conventions

- **Files**: PascalCase for components, camelCase for utilities
- **Variables/Functions**: camelCase
- **Constants**: UPPER_SNAKE_CASE
- **Types/Interfaces**: PascalCase
- **CSS Classes**: kebab-case

## Development Workflow

### Setup

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local

# Edit .env.local with your API key
# GEMINI_API_KEY=your_key_here

# Start development server
npm run dev
```

### Build Commands

```bash
# Standalone build (default)
npm run build

# Library build (for embedding in xTab-dashboard)
npm run build:lib

# Preview production build
npm run preview
```

### Build Modes

- **Standalone mode** (default): Builds full SPA with base path `/xtab-gemini/`
- **Library mode** (`--mode library`): Builds ES and UMD modules for embedding

### Environment Configuration

Key environment variables:

- `GEMINI_API_KEY` - Google Gemini API key (required)
- `VITE_DASHBOARD_ENABLED` - Enable dashboard integration (true/false)
- `VITE_DASHBOARD_API_URL` - Dashboard API endpoint
- `VITE_DASHBOARD_API_KEY` - Dashboard authentication key
- `VITE_MODE` - App mode: standalone/integrated/embedded

## Architecture Patterns

### Configuration Management

- Centralized in `lib/config.ts`
- Runtime configuration overrides environment variables
- Settings persisted in localStorage
- Use `getConfig()` to access configuration

### API Integration

- **Gemini Service** (`services/geminiService.ts`): Wraps Google Gemini API
  - Handles API key from multiple sources
  - Provides methods for image generation, video generation, and chat
  - Manages Operation polling for async tasks

- **Dashboard API Client** (`services/dashboardApiClient.ts`): Communicates with xTab-dashboard
  - Singleton pattern: Use `getDashboardApiClient()`
  - Methods: `healthCheck()`, `createPost()`, `uploadAttachment()`, `savePost()`
  - All methods return typed responses

### State Management

- **Local state**: `useState` for component-specific state
- **Side effects**: `useEffect` for API calls and subscriptions
- **Custom hooks**: Extract complex logic (e.g., `useDashboardConnection`)
- **No global state library** - props and context when needed

### Error Handling

- Display user-friendly error messages
- Log errors to console for debugging
- Graceful degradation when features unavailable
- Validate API responses before using

## Testing

Currently, there is **no test infrastructure** in this project. When adding tests:

- Use a React testing library (e.g., Vitest + React Testing Library)
- Test user interactions and component rendering
- Mock external API calls (Gemini, Dashboard)
- Avoid testing implementation details

## Common Patterns

### API Key Management

```typescript
// Get API key from multiple sources
import { getApiKey, saveApiKey, isApiKeyConfigured } from './services/geminiService';

// Check if configured
if (!isApiKeyConfigured()) {
  // Show API key settings
}

// Save user-provided key
saveApiKey(userProvidedKey);
```

### Dashboard Integration

```typescript
// Check if dashboard is enabled
import { isDashboardEnabled } from './lib/config';

if (isDashboardEnabled()) {
  // Show dashboard features
}

// Use the API client
import { getDashboardApiClient } from './services/dashboardApiClient';

const client = getDashboardApiClient();
const response = await client.savePost({
  title: 'My Post',
  content: 'Content here',
  platforms: ['twitter'],
  status: 'draft',
  images: [imageDataUrl],
});
```

### Image Handling

- Images stored as base64 data URLs
- Format: `data:image/png;base64,<encoded_data>`
- Use for both gallery storage and API uploads

## Important Notes

### Security

- **Never expose API keys** in client code or commits
- **Validate all user inputs** before sending to APIs
- **Sanitize HTML** if displaying user-generated content
- **CORS configuration** required for dashboard integration

### Performance

- **Lazy load** large components when possible
- **Debounce** user inputs for API calls
- **Cache** API responses when appropriate
- **Optimize images** before upload (size, format)

### Browser Compatibility

- Modern browsers only (ES2022 features)
- No IE11 support
- Service Workers not currently used

### Embedded Mode

- Component exports through `lib.tsx`
- React and ReactDOM marked as external dependencies
- PostMessage communication for cross-origin scenarios
- Detects iframe context automatically

## Common Pitfalls

1. **API Key Priority**: User-provided keys (localStorage) override environment variables
2. **Base Path**: Standalone builds use `/xtab-gemini/` base path for GitHub Pages
3. **Environment Variables**: Must prefix with `VITE_` for client-side access
4. **Vite Config**: Different behavior in `library` mode vs default mode
5. **React 19**: Uses new JSX transform (`react-jsx`), not legacy `React.createElement`

## Deployment

### GitHub Pages (Automatic)

- Deployed automatically on push to `main` branch
- Workflow: `.github/workflows/deploy.yml`
- URL: `https://amva456.github.io/xtab-gemini/`
- Build command: `npm run build`

### Manual Deployment

Push to `main` branch and GitHub Actions handles the rest.

## Related Projects

- **xTab-dashboard**: https://github.com/AmVa456/xTab-dashboard
- Integration guide: `INTEGRATION.md`

## Resources

- Google Gemini API: https://ai.google.dev/
- React Documentation: https://react.dev/
- Vite Documentation: https://vitejs.dev/
- TypeScript Handbook: https://www.typescriptlang.org/docs/

## Questions or Issues?

- Check `README.md` for setup instructions
- Check `INTEGRATION.md` for dashboard integration details
- Search existing GitHub issues
- Create a new issue with details about your question or problem

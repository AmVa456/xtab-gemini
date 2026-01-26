# GitHub Copilot Instructions for xtab-gemini

## Project Overview

**xtab-gemini** is a React + TypeScript application that provides an AI-powered design studio powered by Google's Gemini API. The app offers multiple creative capabilities including image generation, image editing, video generation, design chat, and inspiration discovery.

### Key Features
- **Image Generation** - Generate creative images using Google's Imagen 4.0 model
- **Image Editing** - AI-powered image transformations with mask-based editing
- **Video Generation** - Create videos from text prompts using Veo 2.0
- **Design Chat** - Interactive AI assistant for design feedback and brainstorming
- **Inspiration** - Get design ideas with web search integration
- **Gallery Management** - Save and organize generated content locally
- **xTab-Dashboard Integration** - Optional integration for saving posts to external dashboard

## Tech Stack

### Core Technologies
- **React 19.1.1** - UI framework with latest features
- **TypeScript 5.8.2** - Type-safe development
- **Vite 6.2.0** - Build tool and dev server
- **@google/genai 1.14.0** - Official Google Generative AI SDK

### Testing
- **Vitest 3.0.5** - Unit testing framework
- **@testing-library/react 16.1.0** - React component testing
- **@testing-library/jest-dom 6.6.3** - DOM matchers
- **jsdom 25.0.1** - DOM implementation for tests

### Development
- **Node.js >= 18.0.0** - Required runtime version

## Architecture

### Application Modes
The app supports three operational modes:
1. **Standalone Mode** (default) - Independent operation without backend
2. **Integrated Mode** - Connects to xTab-dashboard for saving posts
3. **Embedded Mode** - Can be embedded within xTab-dashboard iframe

### Directory Structure
```
/
├── components/          # React components
├── services/           # API and external service integrations
├── lib/                # Utilities and configuration
├── hooks/              # Custom React hooks
└── .github/            # GitHub configuration
```

## Key Patterns and Conventions

### Component Structure
- Components are functional components using React hooks
- Use TypeScript interfaces for props
- Export component as default export
- Keep components focused and single-responsibility

### API Key Management
The app uses a multi-tier API key system:
1. **User-provided key** (highest priority) - Stored in localStorage via `gemini-api-key`
2. **Build-time environment variables** - `GEMINI_API_KEY` or `API_KEY`
3. **Validation** - Always validate API key before making API calls

### Error Handling
- Use try-catch blocks for async operations
- Log errors to console with contextual prefixes like `[Image Generation]`
- Provide user-friendly error messages with actionable guidance
- Include helpful tips for common error scenarios (permissions, quota, model availability)

### State Management
- Use React useState and useRef for local state
- Use custom hooks for shared logic (e.g., `useDashboardConnection`)
- Store persistent data in localStorage with appropriate keys:
  - `gemini-api-key` - User's API key
  - `gemini-design-gallery` - Saved gallery items
  - `xtab-dashboard-settings` - Dashboard connection settings

### Styling
- Use Tailwind CSS utility classes (configured via inline styles)
- Follow the dark theme color scheme:
  - Primary: Sky blue (`sky-400`, `sky-600`)
  - Background: Slate dark (`slate-900`, `slate-800`)
  - Borders: `slate-700`, `slate-800`
- Maintain consistent spacing and rounded corners

## Service Layer

### geminiService.ts
Main service for interacting with Google Gemini API:

**Key Functions:**
- `generateImages(prompt: string)` - Generate images using Imagen 4.0
- `editImage(base64Image, base64Mask, prompt)` - Edit images with mask
- `generateVideo(prompt: string)` - Initiate video generation with Veo 2.0
- `checkVideoStatus(operation)` - Poll for video generation completion
- `getInspiration(prompt: string)` - Get design ideas with web search
- `createDesignChat()` - Create design assistant chat session

**API Key Functions:**
- `saveApiKey(apiKey: string)` - Save user's API key
- `clearApiKey()` - Remove API key
- `isApiKeyConfigured()` - Check if key exists
- `getCurrentApiKey()` - Get current key (use with caution)

### dashboardApiClient.ts
Handles integration with xTab-dashboard for saving posts.

### config.ts
Centralized configuration management:
- Environment variable parsing
- Dashboard settings persistence
- App mode detection (standalone/integrated/embedded)

## Testing Guidelines

### Test Structure
- Place tests next to the code they test (e.g., `geminiService.test.ts`)
- Use descriptive test names with `it('should...')`
- Group related tests with `describe()` blocks

### Mocking
- Mock `localStorage` for browser API tests
- Use `vi.mock()` for module mocking
- Use `vi.spyOn()` for function spies

### Coverage Focus
- API key management and validation
- Configuration loading and persistence
- Component rendering and user interactions
- Error handling scenarios

### Running Tests
```bash
npm test          # Run all tests with vitest
npm run build     # Verify production build
npm run dev       # Start development server
```

## Common Tasks and Workflows

### Adding a New Feature
1. Create component in `/components` if UI is needed
2. Add service function in `/services` if API interaction is needed
3. Update types in `/lib/types.ts` if new data structures are needed
4. Add tests for new functionality
5. Update error handling with specific error messages
6. Test in all three app modes if relevant

### Debugging Image Generation Issues
1. Check console logs with `[Image Generation]` prefix
2. Verify API key is configured: `isApiKeyConfigured()`
3. Check error message for specific scenario:
   - API key errors → User needs to configure key
   - Permission errors → API key needs Imagen API access
   - Model errors → Check current model name in docs
   - Quota errors → User exceeded API limits
4. Test with a simple prompt first
5. Verify network connectivity

### Adding Environment Variables
1. Add to `.env.example` with documentation
2. Update `lib/config.ts` to parse the variable
3. Document in README.md
4. Consider both build-time (`VITE_`) and runtime needs

### Handling API Changes
1. Update service layer functions
2. Add error handling for backwards compatibility
3. Update tests to reflect API changes
4. Document changes in comments
5. Consider adding feature flags for gradual rollout

## Code Quality Standards

### TypeScript
- Enable strict mode
- Define interfaces for all props and data structures
- Avoid `any` type - use `unknown` if needed
- Use proper generic types for operations

### Error Messages
- Be specific about what went wrong
- Provide actionable next steps
- Include relevant context (model name, API, etc.)
- Use console logging for debugging details

### Performance
- Lazy load heavy components if needed
- Use React.memo() for expensive renders
- Debounce user input for API calls
- Clean up effects and timeouts properly

### Security
- Never log API keys
- Validate and sanitize user input
- Use HTTPS for API calls
- Follow CORS and CSP best practices

## Integration with xTab-Dashboard

When working on dashboard integration:
- Check `isDashboardEnabled()` before showing features
- Use `getDashboardApiClient()` for API calls
- Handle connection status (connected/disconnected/checking)
- Test in both standalone and integrated modes
- Consider embedded mode iframe constraints

## Useful Resources

- [Google Gemini API Documentation](https://ai.google.dev/gemini-api/docs)
- [Imagen API Models](https://ai.google.dev/gemini-api/docs/models)
- [React 19 Documentation](https://react.dev/)
- [Vite Documentation](https://vite.dev/)
- [Vitest Documentation](https://vitest.dev/)

## Notes for AI Assistants

- Always validate API keys before making Gemini API calls
- Provide detailed error messages with context
- Test both success and failure scenarios
- Consider all three app modes when making changes
- Maintain backwards compatibility when possible
- Follow the existing code style and patterns
- Add tests for new functionality
- Update documentation when adding features

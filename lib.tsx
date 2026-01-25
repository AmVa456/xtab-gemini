/**
 * Library entry point for embedding xtab-gemini in other applications
 * This exports the main App component without rendering it
 */

export { default } from './App';
export { default as App } from './App';

// Export types for external use
export type { Platform, PostStatus, ConnectionStatus } from './lib/types';
export type { AppMode, AppConfig } from './lib/config';

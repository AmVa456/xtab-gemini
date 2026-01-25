/**
 * Centralized configuration management for xtab-gemini
 * Handles environment variables and runtime configuration
 */

export type AppMode = 'standalone' | 'integrated' | 'embedded';

export interface AppConfig {
  geminiApiKey: string;
  mode: AppMode;
  dashboard: {
    enabled: boolean;
    apiUrl: string;
    apiKey: string;
  };
}

/**
 * Get the application configuration from environment variables
 */
export const getConfig = (): AppConfig => {
  const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.GEMINI_API_KEY || '';
  const dashboardEnabled = import.meta.env.VITE_DASHBOARD_ENABLED === 'true';
  const dashboardApiUrl = import.meta.env.VITE_DASHBOARD_API_URL || 'http://localhost:5000/api';
  const dashboardApiKey = import.meta.env.VITE_DASHBOARD_API_KEY || '';
  const mode = (import.meta.env.VITE_MODE || 'standalone') as AppMode;

  return {
    geminiApiKey,
    mode,
    dashboard: {
      enabled: dashboardEnabled,
      apiUrl: dashboardApiUrl,
      apiKey: dashboardApiKey,
    },
  };
};

/**
 * Check if dashboard integration is enabled and configured
 */
export const isDashboardEnabled = (): boolean => {
  const config = getConfig();
  return config.dashboard.enabled && !!config.dashboard.apiUrl;
};

/**
 * Get the current app mode
 */
export const getAppMode = (): AppMode => {
  return getConfig().mode;
};

/**
 * Check if running in embedded mode (within iframe)
 */
export const isEmbedded = (): boolean => {
  try {
    return window.self !== window.top;
  } catch {
    // If we can't access window.top due to cross-origin, we're likely embedded
    return true;
  }
};

/**
 * Save dashboard connection settings to localStorage
 */
export const saveDashboardSettings = (apiUrl: string, apiKey: string, enabled: boolean): void => {
  const settings = {
    apiUrl,
    apiKey,
    enabled,
    timestamp: Date.now(),
  };
  localStorage.setItem('xtab-dashboard-settings', JSON.stringify(settings));
};

/**
 * Load dashboard connection settings from localStorage
 */
export const loadDashboardSettings = (): { apiUrl: string; apiKey: string; enabled: boolean } | null => {
  try {
    const stored = localStorage.getItem('xtab-dashboard-settings');
    if (stored) {
      const settings = JSON.parse(stored);
      return {
        apiUrl: settings.apiUrl || '',
        apiKey: settings.apiKey || '',
        enabled: settings.enabled || false,
      };
    }
  } catch (error) {
    console.error('Failed to load dashboard settings:', error);
  }
  return null;
};

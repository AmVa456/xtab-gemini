import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getConfig, isDashboardEnabled, getAppMode, saveDashboardSettings, loadDashboardSettings } from './config';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

describe('config', () => {
  beforeEach(() => {
    localStorageMock.clear();
    // Reset import.meta.env mocks
    vi.stubEnv('VITE_GEMINI_API_KEY', '');
    vi.stubEnv('GEMINI_API_KEY', '');
    vi.stubEnv('VITE_DASHBOARD_ENABLED', '');
    vi.stubEnv('VITE_DASHBOARD_API_URL', '');
    vi.stubEnv('VITE_DASHBOARD_API_KEY', '');
    vi.stubEnv('VITE_MODE', '');
  });

  describe('getConfig', () => {
    it('should return default config when no environment variables are set', () => {
      const config = getConfig();
      
      expect(config.geminiApiKey).toBe('');
      expect(config.mode).toBe('standalone');
      expect(config.dashboard.enabled).toBe(false);
      expect(config.dashboard.apiUrl).toBe('http://localhost:5000/api');
      expect(config.dashboard.apiKey).toBe('');
    });

    it('should return config with environment variables when set', () => {
      vi.stubEnv('VITE_GEMINI_API_KEY', 'test-api-key');
      vi.stubEnv('VITE_DASHBOARD_ENABLED', 'true');
      vi.stubEnv('VITE_DASHBOARD_API_URL', 'https://example.com/api');
      vi.stubEnv('VITE_MODE', 'integrated');
      
      const config = getConfig();
      
      expect(config.geminiApiKey).toBe('test-api-key');
      expect(config.mode).toBe('integrated');
      expect(config.dashboard.enabled).toBe(true);
      expect(config.dashboard.apiUrl).toBe('https://example.com/api');
    });
  });

  describe('isDashboardEnabled', () => {
    it('should return false when dashboard is not enabled', () => {
      expect(isDashboardEnabled()).toBe(false);
    });

    it('should return true when dashboard is enabled and configured', () => {
      vi.stubEnv('VITE_DASHBOARD_ENABLED', 'true');
      vi.stubEnv('VITE_DASHBOARD_API_URL', 'https://example.com/api');
      
      expect(isDashboardEnabled()).toBe(true);
    });
  });

  describe('getAppMode', () => {
    it('should return standalone by default', () => {
      expect(getAppMode()).toBe('standalone');
    });

    it('should return configured mode', () => {
      vi.stubEnv('VITE_MODE', 'embedded');
      
      expect(getAppMode()).toBe('embedded');
    });
  });

  describe('saveDashboardSettings', () => {
    it('should save dashboard settings to localStorage', () => {
      saveDashboardSettings('https://test.com/api', 'test-key', true);
      
      const stored = localStorageMock.getItem('xtab-dashboard-settings');
      expect(stored).toBeTruthy();
      
      const parsed = JSON.parse(stored!);
      expect(parsed.apiUrl).toBe('https://test.com/api');
      expect(parsed.apiKey).toBe('test-key');
      expect(parsed.enabled).toBe(true);
      expect(parsed.timestamp).toBeDefined();
    });
  });

  describe('loadDashboardSettings', () => {
    it('should return null when no settings are stored', () => {
      expect(loadDashboardSettings()).toBeNull();
    });

    it('should load dashboard settings from localStorage', () => {
      saveDashboardSettings('https://test.com/api', 'test-key', true);
      
      const settings = loadDashboardSettings();
      expect(settings).toBeTruthy();
      expect(settings?.apiUrl).toBe('https://test.com/api');
      expect(settings?.apiKey).toBe('test-key');
      expect(settings?.enabled).toBe(true);
    });
  });
});

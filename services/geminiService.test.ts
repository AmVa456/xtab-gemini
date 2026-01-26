import { describe, it, expect, beforeEach, vi } from 'vitest';
import { 
  saveApiKey, 
  clearApiKey, 
  isApiKeyConfigured,
  getCurrentApiKey 
} from './geminiService';

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

describe('geminiService - API Key Management', () => {
  beforeEach(() => {
    localStorageMock.clear();
    // Clear environment variables for consistent testing
    delete process.env.GEMINI_API_KEY;
    delete process.env.API_KEY;
  });

  describe('saveApiKey', () => {
    it('should save API key to localStorage', () => {
      const testKey = 'test-api-key-123';
      saveApiKey(testKey);
      
      expect(localStorageMock.getItem('gemini-api-key')).toBe(testKey);
    });
  });

  describe('clearApiKey', () => {
    it('should remove API key from localStorage', () => {
      const testKey = 'test-api-key-123';
      saveApiKey(testKey);
      expect(localStorageMock.getItem('gemini-api-key')).toBe(testKey);
      
      clearApiKey();
      expect(localStorageMock.getItem('gemini-api-key')).toBeNull();
    });
  });

  describe('isApiKeyConfigured', () => {
    it('should return true when API key exists in localStorage', () => {
      saveApiKey('test-key');
      expect(isApiKeyConfigured()).toBe(true);
    });

    it('should return false when no API key is configured', () => {
      expect(isApiKeyConfigured()).toBe(false);
    });
  });

  describe('getCurrentApiKey', () => {
    it('should return API key from localStorage if available', () => {
      const testKey = 'localStorage-key';
      saveApiKey(testKey);
      
      expect(getCurrentApiKey()).toBe(testKey);
    });

    it('should return empty string when no API key is configured', () => {
      expect(getCurrentApiKey()).toBe('');
    });
  });

  describe('API Key Validation', () => {
    it('should throw error when API key is not configured', async () => {
      // Import generateImages to test validation
      const { generateImages } = await import('./geminiService');
      
      await expect(generateImages('test prompt')).rejects.toThrow(
        'Failed to generate images'
      );
    });
  });
});

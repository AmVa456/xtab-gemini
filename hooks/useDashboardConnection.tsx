/**
 * React hook for managing xTab-dashboard connection
 */

import { useState, useEffect, useCallback } from 'react';
import { getDashboardApiClient, resetDashboardApiClient } from '../services/dashboardApiClient';
import { isDashboardEnabled, saveDashboardSettings, loadDashboardSettings } from '../lib/config';
import type { ConnectionStatus } from '../lib/types';

export interface DashboardConnectionState {
  status: ConnectionStatus;
  isEnabled: boolean;
  apiUrl: string;
  lastChecked: number | null;
  error: string | null;
}

export interface UseDashboardConnectionReturn extends DashboardConnectionState {
  checkConnection: () => Promise<void>;
  updateSettings: (apiUrl: string, apiKey: string, enabled: boolean) => void;
  testConnection: (apiUrl: string, apiKey: string) => Promise<boolean>;
}

/**
 * Hook to manage dashboard connection state
 */
export const useDashboardConnection = (): UseDashboardConnectionReturn => {
  const [state, setState] = useState<DashboardConnectionState>({
    status: 'disconnected',
    isEnabled: isDashboardEnabled(),
    apiUrl: '',
    lastChecked: null,
    error: null,
  });

  /**
   * Check connection to the dashboard
   */
  const checkConnection = useCallback(async () => {
    if (!state.isEnabled) {
      setState(prev => ({ ...prev, status: 'disconnected' }));
      return;
    }

    setState(prev => ({ ...prev, status: 'checking', error: null }));

    try {
      const client = getDashboardApiClient();
      const health = await client.healthCheck();
      
      if (health.status === 'ok') {
        setState(prev => ({
          ...prev,
          status: 'connected',
          lastChecked: Date.now(),
          error: null,
        }));
      } else {
        setState(prev => ({
          ...prev,
          status: 'error',
          lastChecked: Date.now(),
          error: 'Dashboard is not responding correctly',
        }));
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Connection failed';
      setState(prev => ({
        ...prev,
        status: 'error',
        lastChecked: Date.now(),
        error: errorMessage,
      }));
    }
  }, [state.isEnabled]);

  /**
   * Update dashboard settings
   */
  const updateSettings = useCallback((apiUrl: string, apiKey: string, enabled: boolean) => {
    saveDashboardSettings(apiUrl, apiKey, enabled);
    resetDashboardApiClient();
    
    setState(prev => ({
      ...prev,
      isEnabled: enabled,
      apiUrl,
      status: enabled ? 'disconnected' : 'disconnected',
    }));

    // Check connection with new settings if enabled
    if (enabled) {
      setTimeout(() => checkConnection(), 100);
    }
  }, [checkConnection]);

  /**
   * Test connection with custom settings without saving
   */
  const testConnection = useCallback(async (apiUrl: string, apiKey: string): Promise<boolean> => {
    try {
      const client = getDashboardApiClient();
      return await client.testConnection(apiUrl, apiKey);
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }, []);

  /**
   * Initialize connection state on mount
   */
  useEffect(() => {
    const savedSettings = loadDashboardSettings();
    if (savedSettings) {
      setState(prev => ({
        ...prev,
        isEnabled: savedSettings.enabled,
        apiUrl: savedSettings.apiUrl,
      }));

      if (savedSettings.enabled) {
        checkConnection();
      }
    } else if (isDashboardEnabled()) {
      checkConnection();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * Periodic connection check (every 30 seconds if enabled)
   */
  useEffect(() => {
    if (!state.isEnabled || state.status !== 'connected') {
      return;
    }

    const interval = setInterval(() => {
      checkConnection();
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [state.isEnabled, state.status, checkConnection]);

  return {
    ...state,
    checkConnection,
    updateSettings,
    testConnection,
  };
};

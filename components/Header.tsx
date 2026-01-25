import React from 'react';
import DashboardConnection from './DashboardConnection';
import { getAppMode } from '../lib/config';
import type { ConnectionStatus } from '../lib/types';

const PaletteIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    {...props}
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <circle cx="13.5" cy="6.5" r=".5" fill="currentColor"></circle>
    <circle cx="17.5" cy="10.5" r=".5" fill="currentColor"></circle>
    <circle cx="8.5" cy="7.5" r=".5" fill="currentColor"></circle>
    <circle cx="6.5" cy="12.5" r=".5" fill="currentColor"></circle>
    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.667 0-.422-.02-.833-.052-1.234-.4-3.14 1.89-6.42 5.04-6.42h.01c2.29 0 4.37 1.56 4.37 4.37 0 1.43-1.09 2.1-1.09 2.1"></path>
  </svg>
);

const SettingsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);

export interface HeaderProps {
  connectionStatus?: ConnectionStatus;
  dashboardApiUrl?: string;
  isDashboardEnabled?: boolean;
  onCheckConnection?: () => void;
  onOpenSettings?: () => void;
  onOpenApiKeySettings?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  connectionStatus,
  dashboardApiUrl = '',
  isDashboardEnabled = false,
  onCheckConnection,
  onOpenSettings,
  onOpenApiKeySettings,
}) => {
  const appMode = getAppMode();
  
  return (
    <header className="bg-slate-900/70 backdrop-blur-sm sticky top-0 z-10 border-b border-slate-800">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <PaletteIcon className="w-8 h-8 text-sky-400" />
            <div>
              <h1 className="text-2xl font-bold text-slate-50 tracking-tight">
                Gemini Design Studio
              </h1>
              {appMode !== 'standalone' && (
                <p className="text-xs text-slate-400">
                  {appMode === 'embedded' ? 'Embedded Mode' : 'Integrated Mode'}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* API Key Settings Button */}
            {onOpenApiKeySettings && (
              <button
                onClick={onOpenApiKeySettings}
                className="flex items-center gap-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-900"
                title="API Key Settings"
              >
                <SettingsIcon />
                <span className="hidden sm:inline text-sm font-medium">API Settings</span>
              </button>
            )}
            
            {/* Dashboard Connection */}
            {connectionStatus && onCheckConnection && (
              <DashboardConnection
                status={connectionStatus}
                apiUrl={dashboardApiUrl}
                isEnabled={isDashboardEnabled}
                onCheckConnection={onCheckConnection}
                onOpenSettings={onOpenSettings}
              />
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
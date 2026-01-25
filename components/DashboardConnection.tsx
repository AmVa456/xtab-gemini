/**
 * Dashboard connection status indicator component
 */

import React, { useState } from 'react';
import type { ConnectionStatus } from '../lib/types';

const CheckCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const XCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="15" y1="9" x2="9" y2="15" />
    <line x1="9" y1="9" x2="15" y2="15" />
  </svg>
);

const LoaderIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

const MinusCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="8" y1="12" x2="16" y2="12" />
  </svg>
);

const SettingsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export interface DashboardConnectionProps {
  status: ConnectionStatus;
  apiUrl: string;
  isEnabled: boolean;
  onCheckConnection: () => void;
  onOpenSettings?: () => void;
}

const DashboardConnection: React.FC<DashboardConnectionProps> = ({
  status,
  apiUrl,
  isEnabled,
  onCheckConnection,
  onOpenSettings,
}) => {
  const [showDetails, setShowDetails] = useState(false);

  const getStatusConfig = () => {
    switch (status) {
      case 'connected':
        return {
          icon: CheckCircleIcon,
          text: 'Connected',
          color: 'text-green-400',
          bgColor: 'bg-green-900/30',
          borderColor: 'border-green-700/50',
        };
      case 'disconnected':
        return {
          icon: MinusCircleIcon,
          text: 'Disconnected',
          color: 'text-slate-400',
          bgColor: 'bg-slate-800/30',
          borderColor: 'border-slate-700/50',
        };
      case 'checking':
        return {
          icon: LoaderIcon,
          text: 'Checking...',
          color: 'text-blue-400',
          bgColor: 'bg-blue-900/30',
          borderColor: 'border-blue-700/50',
          animate: true,
        };
      case 'error':
        return {
          icon: XCircleIcon,
          text: 'Error',
          color: 'text-red-400',
          bgColor: 'bg-red-900/30',
          borderColor: 'border-red-700/50',
        };
    }
  };

  if (!isEnabled) {
    return null;
  }

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <div className="relative">
      <button
        onClick={() => setShowDetails(!showDetails)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${config.bgColor} ${config.borderColor} border ${config.color} hover:opacity-80`}
      >
        <Icon className={config.animate ? 'animate-spin' : ''} />
        <span className="hidden sm:inline">{config.text}</span>
      </button>

      {showDetails && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowDetails(false)}
          />
          <div className="absolute right-0 top-full mt-2 z-50 w-72 bg-slate-800 border border-slate-700 rounded-lg shadow-xl p-4">
            <h3 className="text-sm font-semibold text-slate-200 mb-3">
              Dashboard Connection
            </h3>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Status:</span>
                <span className={config.color}>{config.text}</span>
              </div>
              
              {apiUrl && (
                <div className="flex items-start justify-between gap-2">
                  <span className="text-slate-400 flex-shrink-0">URL:</span>
                  <span className="text-slate-300 text-right text-xs break-all">
                    {apiUrl}
                  </span>
                </div>
              )}
            </div>

            <div className="flex gap-2 mt-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onCheckConnection();
                }}
                disabled={status === 'checking'}
                className="flex-1 px-3 py-1.5 bg-sky-600 hover:bg-sky-700 disabled:bg-slate-700 disabled:text-slate-500 text-white text-sm rounded-md transition-colors"
              >
                Test Connection
              </button>
              
              {onOpenSettings && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDetails(false);
                    onOpenSettings();
                  }}
                  className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm rounded-md transition-colors"
                >
                  <SettingsIcon />
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardConnection;

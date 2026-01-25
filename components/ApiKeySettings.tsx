import React, { useState, useEffect } from 'react';
import { saveApiKey, clearApiKey, isApiKeyConfigured } from '../services/geminiService';

interface ApiKeySettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

const ApiKeySettings: React.FC<ApiKeySettingsProps> = ({ isOpen, onClose }) => {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsSaved(isApiKeyConfigured());
  }, [isOpen]);

  const handleSave = () => {
    if (!apiKey.trim()) {
      setError('Please enter an API key');
      return;
    }

    try {
      saveApiKey(apiKey.trim());
      setIsSaved(true);
      setError(null);
      setTimeout(() => {
        onClose();
        // Reload to reinitialize services with new key
        window.location.reload();
      }, 1000);
    } catch (err) {
      setError('Failed to save API key');
    }
  };

  const handleClear = () => {
    clearApiKey();
    setApiKey('');
    setIsSaved(false);
    setError(null);
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-2xl max-w-lg w-full mx-4 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-sky-600 to-blue-600 px-6 py-4">
          <h2 className="text-2xl font-bold text-white">API Key Settings</h2>
          <p className="text-sky-100 text-sm mt-1">Configure your Gemini API key</p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Status */}
          {isSaved && (
            <div className="bg-green-900/30 border border-green-700 text-green-300 px-4 py-3 rounded-lg">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">API key is configured</span>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-4">
            <h3 className="font-semibold text-slate-200 mb-2">How to get your API key:</h3>
            <ol className="list-decimal list-inside space-y-1 text-sm text-slate-300">
              <li>Visit <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:text-sky-300 underline">Google AI Studio</a></li>
              <li>Sign in with your Google account</li>
              <li>Click "Get API Key" or "Create API Key"</li>
              <li>Copy your API key and paste it below</li>
            </ol>
          </div>

          {/* API Key Input */}
          <div className="space-y-2">
            <label htmlFor="api-key" className="block text-sm font-medium text-slate-300">
              Gemini API Key
            </label>
            <div className="relative">
              <input
                id="api-key"
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your API key..."
                className="w-full px-4 py-2 pr-20 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 text-xs text-slate-400 hover:text-slate-200 transition-colors"
              >
                {showKey ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          {/* Security Note */}
          <div className="bg-amber-900/20 border border-amber-700/50 text-amber-300 px-4 py-3 rounded-lg text-sm">
            <div className="flex items-start gap-2">
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="font-medium">Security Notice</p>
                <p className="mt-1">Your API key will be stored in your browser's localStorage. It will not be sent to any server except Google's Gemini API.</p>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-900/30 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-700/30 px-6 py-4 flex justify-end gap-3">
          {isSaved && (
            <button
              onClick={handleClear}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-slate-800"
            >
              Clear Key
            </button>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-slate-200 font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-800"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!apiKey.trim()}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-800"
          >
            Save & Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApiKeySettings;

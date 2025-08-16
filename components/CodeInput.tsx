
import React from 'react';
import { SUPPORTED_LANGUAGES } from '../constants';

interface CodeInputProps {
  code: string;
  setCode: (code: string) => void;
  language: string;
  setLanguage: (lang: string) => void;
  onReview: () => void;
  isLoading: boolean;
}

const CodeInput: React.FC<CodeInputProps> = ({
  code,
  setCode,
  language,
  setLanguage,
  onReview,
  isLoading,
}) => {
  return (
    <div className="bg-slate-800/50 rounded-lg border border-slate-700 shadow-lg">
      <div className="p-4 border-b border-slate-700 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-slate-200">Your Code</h2>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="bg-slate-700 border border-slate-600 text-slate-200 text-sm rounded-md focus:ring-sky-500 focus:border-sky-500 block w-40 p-2"
        >
          {SUPPORTED_LANGUAGES.map((lang) => (
            <option key={lang.value} value={lang.value}>
              {lang.label}
            </option>
          ))}
        </select>
      </div>
      <div className="p-4">
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Paste your code snippet here..."
          className="w-full h-64 bg-slate-900 text-slate-300 font-mono text-sm p-3 rounded-md border border-slate-700 focus:ring-2 focus:ring-sky-500 focus:outline-none resize-y"
          spellCheck="false"
        />
      </div>
      <div className="p-4 border-t border-slate-700 flex justify-end">
        <button
          onClick={onReview}
          disabled={isLoading || !code.trim()}
          className="px-6 py-2.5 bg-sky-600 text-white font-semibold rounded-md shadow-md hover:bg-sky-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors duration-200 flex items-center"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Reviewing...
            </>
          ) : (
            'Review Code'
          )}
        </button>
      </div>
    </div>
  );
};

export default CodeInput;

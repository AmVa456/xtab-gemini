
import React from 'react';
import Loader from './Loader';

// Add type definition for window.marked for TypeScript to use the CDN-loaded library.
declare global {
  interface Window {
    marked: {
      parse: (markdown: string, options?: object) => string;
    };
  }
}

interface Message {
  role: 'user' | 'model';
  content: string;
}

interface FeedbackDisplayProps {
  messages: Message[];
  isLoading: boolean;
}

const SparkleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L14.09 8.26L20 10L14.09 11.74L12 18L9.91 11.74L4 10L9.91 8.26L12 2z" /></svg>
);

const UserIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
);


const getSanitizedHtml = (markdown: string): string => {
  if (window.marked) {
    return window.marked.parse(markdown);
  }
  return `<pre style="white-space: pre-wrap; word-wrap: break-word;">${markdown.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</pre>`;
};

const FeedbackDisplay: React.FC<FeedbackDisplayProps> = ({ messages, isLoading }) => {
  if (isLoading) {
    return <Loader />;
  }

  if (messages.length === 0) {
    return (
      <div className="mt-8 text-center text-slate-500 p-8 bg-slate-800/50 rounded-lg border border-dashed border-slate-700">
        <p>Your code review feedback will appear here.</p>
        <p className="text-sm">Paste your code, select the language, and click "Review Code" to start.</p>
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-6">
      {messages.map((msg, index) => (
        <div key={index} className={`flex items-start gap-4 ${msg.role === 'user' ? 'justify-end' : ''}`}>
           {msg.role === 'model' && <div className="p-2 bg-sky-900/50 rounded-full"><SparkleIcon className="w-6 h-6 text-sky-400" /></div>}
          
           <div className={`w-full max-w-2xl rounded-lg border ${
                msg.role === 'user' 
                ? 'bg-slate-700/30 border-slate-600' 
                : 'bg-slate-800/50 border-slate-700 shadow-inner'
            }`}>
              <div
                className="p-4 sm:p-6 text-slate-300 prose prose-invert prose-sm sm:prose-base max-w-none prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-700 prose-pre:rounded-md prose-code:text-sky-300 prose-a:text-sky-400 hover:prose-a:text-sky-300"
                dangerouslySetInnerHTML={{ __html: getSanitizedHtml(msg.content) }}
              />
          </div>

          {msg.role === 'user' && <div className="p-2 bg-slate-600/50 rounded-full"><UserIcon className="w-6 h-6 text-slate-300"/></div>}
        </div>
      ))}
    </div>
  );
};

export default FeedbackDisplay;


import React from 'react';
import Loader from './Loader';
import type { GroundingChunk } from '../services/geminiService';

// Add type definition for window.marked for TypeScript to use the CDN-loaded library.
declare global {
  interface Window {
    marked: {
      parse: (markdown: string, options?: object) => string;
    };
  }
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  images?: string[]; // array of base64 image urls
  videos?: string[]; // array of base64 video urls
  sources?: GroundingChunk[];
}

interface FeedbackDisplayProps {
  messages: Message[];
  isLoading: boolean;
  onSaveItem: (itemUrl: string) => void;
  savedItemUrls: string[];
  loadingStatus?: string;
}

const SparkleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L14.09 8.26L20 10L14.09 11.74L12 18L9.91 11.74L4 10L9.91 8.26L12 2z" /></svg>
);

const UserIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
);

const DownloadIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" /></svg>
);

const SaveIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></svg>
);

const CheckIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
);


const getSanitizedHtml = (markdown: string): string => {
  if (window.marked) {
    return window.marked.parse(markdown, { gfm: true, breaks: true });
  }
  return `<pre style="white-space: pre-wrap; word-wrap: break-word;">${markdown.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</pre>`;
};

const MediaGallery: React.FC<{ items: string[], prompt: string, onSaveItem: (itemUrl: string) => void, savedItemUrls: string[] }> = ({ items, prompt, onSaveItem, savedItemUrls }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
      {items.map((itemSrc, index) => {
        const isSaved = savedItemUrls.includes(itemSrc);
        const isVideo = itemSrc.startsWith('data:video/');
        const fileType = isVideo ? 'video' : 'image';
        const extension = isVideo ? 'mp4' : 'png';
        
        return (
            <div key={index} className="relative group rounded-lg overflow-hidden border border-slate-700 aspect-square">
                {isVideo ? (
                    <video src={itemSrc} controls className="w-full h-full object-cover bg-black" />
                ) : (
                    <img src={itemSrc} alt={`${prompt} - result ${index + 1}`} className="w-full h-full object-cover" />
                )}
                <div className="absolute bottom-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={() => onSaveItem(itemSrc)}
                        disabled={isSaved}
                        className="p-2 bg-slate-900/70 text-slate-200 rounded-full disabled:text-sky-400 disabled:cursor-not-allowed"
                        aria-label={isSaved ? `${fileType} saved` : `Save ${fileType}`}
                    >
                       {isSaved ? <CheckIcon className="w-5 h-5" /> : <SaveIcon className="w-5 h-5" />}
                    </button>
                    <a
                        href={itemSrc}
                        download={`gemini-design-${prompt.slice(0, 20).replace(/\s/g, '_')}-${index + 1}.${extension}`}
                        className="p-2 bg-slate-900/70 text-slate-200 rounded-full"
                        aria-label={`Download ${fileType}`}
                    >
                        <DownloadIcon className="w-5 h-5" />
                    </a>
                </div>
            </div>
        )
      })}
    </div>
  );
};


const FeedbackDisplay: React.FC<FeedbackDisplayProps> = ({ messages, isLoading, onSaveItem, savedItemUrls, loadingStatus }) => {
  if (isLoading && messages.length === 0) {
    return <Loader text={loadingStatus} />;
  }

  if (messages.length === 0) {
    return (
      <div className="flex-grow flex flex-col justify-center items-center text-center text-slate-500 p-8 bg-slate-800/50 rounded-lg border border-dashed border-slate-700">
        <SparkleIcon className="w-16 h-16 text-slate-600 mb-4" />
        <h2 className="text-xl font-semibold text-slate-300">Welcome to the Design Studio</h2>
        <p className="max-w-md mt-2">Generate an image, ask a design question, or search for new inspiration. What masterpiece will we create today?</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-4">
      {messages.map((msg) => (
        <div key={msg.id} className={`flex items-start gap-4 ${msg.role === 'user' ? 'justify-end' : ''}`}>
           {msg.role === 'model' && <div className="p-2 bg-sky-900/50 rounded-full self-start"><SparkleIcon className="w-6 h-6 text-sky-400" /></div>}
          
           <div className={`w-full max-w-2xl rounded-lg border ${
                msg.role === 'user' 
                ? 'bg-slate-700/30 border-slate-600' 
                : 'bg-slate-800/50 border-slate-700 shadow-inner'
            }`}>
              <div
                className="prose prose-invert prose-sm sm:prose-base max-w-none prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-700 prose-pre:rounded-md prose-code:text-sky-300 prose-a:text-sky-400 hover:prose-a:text-sky-300 p-4 sm:p-6"
                dangerouslySetInnerHTML={{ __html: getSanitizedHtml(msg.text) }}
              />
              {(msg.images || msg.videos) && (
                <div className="p-4 sm:p-6 pt-0">
                  <MediaGallery items={[...(msg.images || []), ...(msg.videos || [])]} prompt={msg.text} onSaveItem={onSaveItem} savedItemUrls={savedItemUrls} />
                </div>
              )}
              {msg.sources && msg.sources.length > 0 && (
                <div className="p-4 sm:p-6 border-t border-slate-700">
                  <h4 className="text-sm font-semibold text-slate-400 mb-2">Sources</h4>
                  <ul className="space-y-2">
                    {/* Fix: Check for `source.web.uri` and provide a fallback for the link text. */}
                    {msg.sources.map((source, i) => source.web?.uri && (
                      <li key={i} className="truncate text-sm">
                        <a href={source.web.uri} target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:text-sky-300 underline-offset-2 hover:underline">
                         {source.web.title || source.web.uri}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
          </div>

          {msg.role === 'user' && <div className="p-2 bg-slate-600/50 rounded-full self-start"><UserIcon className="w-6 h-6 text-slate-300"/></div>}
        </div>
      ))}
       {isLoading && messages[messages.length - 1]?.role === 'user' && (
         <div className="flex items-start gap-4">
            <div className="p-2 bg-sky-900/50 rounded-full self-start"><SparkleIcon className="w-6 h-6 text-sky-400" /></div>
            <div className="w-full max-w-2xl rounded-lg border bg-slate-800/50 border-slate-700 shadow-inner p-4 sm:p-6">
                <Loader text={loadingStatus} />
            </div>
         </div>
       )}
    </div>
  );
};

export default FeedbackDisplay;

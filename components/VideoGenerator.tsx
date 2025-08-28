
import React, { useState } from 'react';
import Loader from './Loader';

const VideoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 8-6 4 6 4V8Z" /><rect width="14" height="12" x="2" y="6" rx="2" ry="2" /></svg>
);
const SendIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></svg>
);

interface VideoGeneratorProps {
    onGenerate: (prompt: string) => void;
    isLoading: boolean;
    loadingStatus: string;
}

const VideoGenerator: React.FC<VideoGeneratorProps> = ({ onGenerate, isLoading, loadingStatus }) => {
    const [prompt, setPrompt] = useState('');

    const handleGenerateClick = () => {
        if (prompt.trim()) {
            onGenerate(prompt);
        }
    };

    if (isLoading) {
        return <div className="flex-grow flex items-center justify-center"><Loader text={loadingStatus} /></div>;
    }

    return (
        <div className="flex-grow flex flex-col justify-center items-center">
            <div className="w-full max-w-lg text-center p-8 bg-slate-800/50 rounded-lg border border-dashed border-slate-700">
                <VideoIcon className="mx-auto w-16 h-16 text-slate-600 mb-4" />
                <h2 className="text-xl font-semibold text-slate-300">Generate a Video</h2>
                <p className="text-slate-500 mt-2 mb-6">Describe the video you want to create. Note: Video generation can take several minutes.</p>
                
                <div className="relative bg-slate-800/70 rounded-lg border border-slate-700 shadow-xl">
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="e.g., A high-speed drone fly-through of a futuristic city..."
                        rows={2}
                        className="w-full bg-transparent text-slate-200 p-4 pr-16 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none"
                    />
                    <button
                        onClick={handleGenerateClick}
                        disabled={!prompt.trim()}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-sky-600 text-white hover:bg-sky-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors"
                        aria-label="Generate video"
                    >
                       <SendIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VideoGenerator;

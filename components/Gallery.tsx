
import React from 'react';

const DownloadIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" /></svg>
);

const TrashIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" /></svg>
);

const ImageIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" /></svg>
);


interface GalleryProps {
    items: string[];
    onRemove: (itemUrl: string) => void;
}

const Gallery: React.FC<GalleryProps> = ({ items, onRemove }) => {
    if (items.length === 0) {
        return (
             <div className="flex-grow flex flex-col justify-center items-center text-center text-slate-500 p-8 bg-slate-800/50 rounded-lg border border-dashed border-slate-700">
                <ImageIcon className="w-16 h-16 text-slate-600 mb-4" />
                <h2 className="text-xl font-semibold text-slate-300">Your Gallery is Empty</h2>
                <p className="max-w-md mt-2">Generate or edit images and videos. You can save your favorites here to view them later.</p>
            </div>
        );
    }
    
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-4">
            {items.map((itemSrc, index) => {
                const isVideo = itemSrc.startsWith('data:video/');
                const extension = isVideo ? 'mp4' : 'png';
                return (
                    <div key={index} className="relative group rounded-lg overflow-hidden border border-slate-700 aspect-square bg-slate-800">
                        {isVideo ? (
                             <video src={itemSrc} controls className="w-full h-full object-cover" />
                        ) : (
                             <img src={itemSrc} alt={`Saved item ${index + 1}`} className="w-full h-full object-cover" />
                        )}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                             <button
                                onClick={() => onRemove(itemSrc)}
                                className="p-3 bg-red-900/80 text-red-200 rounded-full hover:bg-red-800"
                                aria-label="Remove item"
                            >
                                <TrashIcon className="w-6 h-6" />
                            </button>
                             <a
                                href={itemSrc}
                                download={`gemini-gallery-${index + 1}.${extension}`}
                                className="p-3 bg-sky-800/80 text-sky-200 rounded-full hover:bg-sky-700"
                                aria-label="Download item"
                            >
                                <DownloadIcon className="w-6 h-6" />
                            </a>
                        </div>
                    </div>
                )
            })}
        </div>
    );
};

export default Gallery;


import React, { useState, useRef, useEffect, useCallback } from 'react';
import Loader from './Loader';

const UploadIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" x2="12" y1="3" y2="15" /></svg>
);
const EditIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /><path d="m15 5 4 4" /></svg>
);
const SendIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-up"><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></svg>
);

interface ImageEditorProps {
  onGenerate: (base64Image: string, base64Mask: string, prompt: string) => void;
  isLoading: boolean;
  loadingStatus: string;
}

const ImageEditor: React.FC<ImageEditorProps> = ({ onGenerate, isLoading, loadingStatus }) => {
  const [image, setImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isDrawing, setIsDrawing] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };
  
  const getCanvasContext = () => canvasRef.current?.getContext('2d');

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const imageEl = imageRef.current;
    if (canvas && imageEl) {
      canvas.width = imageEl.clientWidth;
      canvas.height = imageEl.clientHeight;
    }
  }, [image]);

  useEffect(() => {
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [resizeCanvas]);

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    if ('touches' in e) {
      return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
    }
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    const coords = getCoordinates(e);
    if (!coords) return;
    const ctx = getCanvasContext();
    if (!ctx) return;
    setIsDrawing(true);
    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    e.preventDefault();
    const coords = getCoordinates(e);
    if (!coords) return;
    const ctx = getCanvasContext();
    if (!ctx) return;
    ctx.lineTo(coords.x, coords.y);
    ctx.strokeStyle = 'rgba(255, 255, 255, 1)';
    ctx.lineWidth = 20;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
  };
  
  const stopDrawing = () => {
    const ctx = getCanvasContext();
    if(!ctx) return;
    ctx.closePath();
    setIsDrawing(false);
  };
  
  const clearMask = () => {
    const canvas = canvasRef.current;
    const ctx = getCanvasContext();
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const handleGenerateClick = () => {
      if (!image || !canvasRef.current) return;
      
      const naturalWidth = imageRef.current?.naturalWidth;
      const naturalHeight = imageRef.current?.naturalHeight;

      if (!naturalWidth || !naturalHeight) return;

      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = naturalWidth;
      tempCanvas.height = naturalHeight;
      const tempCtx = tempCanvas.getContext('2d');
      if (!tempCtx) return;

      tempCtx.drawImage(canvasRef.current, 0, 0, naturalWidth, naturalHeight);
      const maskData = tempCanvas.toDataURL('image/png');

      onGenerate(image, maskData, prompt);
  };

  if (isLoading) {
    return <div className="flex-grow flex items-center justify-center"><Loader text={loadingStatus} /></div>;
  }

  if (!image) {
    return (
      <div className="flex-grow flex flex-col justify-center items-center">
        <div className="w-full max-w-lg text-center p-8 bg-slate-800/50 rounded-lg border border-dashed border-slate-700">
          <UploadIcon className="mx-auto w-16 h-16 text-slate-600 mb-4" />
          <h2 className="text-xl font-semibold text-slate-300">Edit an Image</h2>
          <p className="text-slate-500 mt-2 mb-4">Upload an image to start. You'll be able to mask an area and tell the AI what to change.</p>
          <label className="bg-sky-600 text-white font-semibold px-4 py-2 rounded-md hover:bg-sky-700 cursor-pointer transition-colors">
            Upload Image
            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
          </label>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-grow flex flex-col items-center gap-4 overflow-y-auto custom-scrollbar pr-2 pb-4">
      <div className="w-full max-w-2xl mx-auto flex flex-col gap-4">
        <div className="relative border-2 border-slate-700 rounded-lg overflow-hidden">
            <img ref={imageRef} src={image} onLoad={resizeCanvas} alt="User upload" className="w-full h-auto" />
            <canvas
              ref={canvasRef}
              className="absolute top-0 left-0 w-full h-full cursor-crosshair"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
            />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button 
                onClick={clearMask} 
                className="w-full text-center bg-slate-700/50 text-slate-300 hover:bg-slate-700 font-semibold py-2 px-4 rounded-md transition-colors"
            >
                Clear Mask
            </button>
            <label className="w-full text-center bg-slate-700/50 text-slate-300 hover:bg-slate-700 font-semibold py-2 px-4 rounded-md transition-colors cursor-pointer">
                Change Image
                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
            </label>
        </div>
        <div className="relative bg-slate-800/70 backdrop-blur-md rounded-lg border border-slate-700 shadow-xl">
             <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., Add a small, red backpack"
                rows={1}
                className="w-full bg-transparent text-slate-200 p-4 pr-16 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none"
                disabled={isLoading}
            />
            <button
                onClick={handleGenerateClick}
                disabled={isLoading || !prompt.trim()}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-sky-600 text-white hover:bg-sky-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors"
                aria-label="Generate edit"
            >
               <SendIcon className="w-5 h-5" />
            </button>
        </div>
      </div>
    </div>
  );
};

export default ImageEditor;

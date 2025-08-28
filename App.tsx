
import React, { useState, useCallback, useRef, useEffect } from 'react';
// Fix: Add GenerateVideosResponse type to the import to use with Operation.
import { Chat, Operation, GenerateVideosResponse } from '@google/genai';
import Header from './components/Header';
import FeedbackDisplay, { Message } from './components/FeedbackDisplay';
import ChatInput from './components/ChatInput'; 
import Gallery from './components/Gallery';
import ImageEditor from './components/ImageEditor';
import VideoGenerator from './components/VideoGenerator';
import { createDesignChat, generateImages, getInspiration, editImage, generateVideo, checkVideoStatus } from './services/geminiService';

type Mode = 'generate' | 'chat' | 'inspiration' | 'gallery' | 'edit' | 'video';

const ModeSelector: React.FC<{ mode: Mode, setMode: (mode: Mode) => void, isLoading: boolean }> = ({ mode, setMode, isLoading }) => {
    const modes: { id: Mode, label: string }[] = [
        { id: 'generate', label: 'Generate' },
        { id: 'edit', label: 'Edit Image' },
        { id: 'video', label: 'Generate Video' },
        { id: 'chat', label: 'Design Chat' },
        { id: 'inspiration', label: 'Inspiration' },
        { id: 'gallery', label: 'Gallery' },
    ];
    
    const baseClasses = "px-3 sm:px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-sky-500 disabled:opacity-50";
    const activeClasses = "bg-sky-600 text-white";
    const inactiveClasses = "bg-slate-700/50 text-slate-300 hover:bg-slate-700";

    return (
        <div className="flex justify-center my-6">
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-1 flex flex-wrap justify-center gap-1">
                {modes.map(m => (
                    <button 
                        key={m.id}
                        onClick={() => setMode(m.id)}
                        disabled={isLoading}
                        className={`${baseClasses} ${mode === m.id ? activeClasses : inactiveClasses}`}
                        aria-pressed={mode === m.id}
                    >
                        {m.label}
                    </button>
                ))}
            </div>
        </div>
    );
};


const App: React.FC = () => {
  const [mode, setMode] = useState<Mode>('generate');
  const [messages, setMessages] = useState<Message[]>([]);
  const [galleryItems, setGalleryItems] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingStatus, setLoadingStatus] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  
  const chatSessionRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollingTimeoutRef = useRef<number | undefined>();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    try {
        const savedItems = localStorage.getItem('gemini-design-gallery');
        if (savedItems) {
            setGalleryItems(JSON.parse(savedItems));
        }
    } catch (e) {
        console.error("Failed to load items from gallery:", e);
    }
    
    return () => clearTimeout(pollingTimeoutRef.current);
  }, []);

  const handleSaveItem = useCallback((itemUrl: string) => {
    setGalleryItems(prev => {
        if (prev.includes(itemUrl)) return prev; // Avoid duplicates
        const newGallery = [itemUrl, ...prev];
        localStorage.setItem('gemini-design-gallery', JSON.stringify(newGallery));
        return newGallery;
    });
  }, []);

  const handleRemoveItem = useCallback((itemUrl: string) => {
    setGalleryItems(prev => {
        const newGallery = prev.filter(url => url !== itemUrl);
        localStorage.setItem('gemini-design-gallery', JSON.stringify(newGallery));
        return newGallery;
    });
  }, []);

  const addMessage = (message: Message) => {
    setMessages(prev => [...prev, message]);
  };
  
  const handleEditImage = useCallback(async (base64Image: string, base64Mask: string, prompt: string) => {
    setIsLoading(true);
    setLoadingStatus('Your AI assistant is editing the image...');
    setError(null);
    setMessages([]);

    const userMessage: Message = { id: Date.now().toString(), role: 'user', text: `Edit request: "${prompt}"` };
    addMessage(userMessage);

    try {
      const { text, images } = await editImage(base64Image, base64Mask, prompt);
      const modelMessage: Message = {
          id: Date.now().toString() + '-model',
          role: 'model',
          text: text || `Here is the edited image based on your request: "${prompt}".`,
          images: images,
      };
      addMessage(modelMessage);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unexpected error occurred during image editing.';
      setError(errorMessage);
      setMessages([]);
    } finally {
      setIsLoading(false);
      setLoadingStatus('');
    }
  }, []);
  
  const handleGenerateVideo = useCallback(async (prompt: string) => {
    setIsLoading(true);
    setError(null);
    setMessages([]);
    const userMessage: Message = { id: Date.now().toString(), role: 'user', text: `Video request: "${prompt}"` };
    addMessage(userMessage);

    const statusUpdates = [
        "Warming up the virtual cameras...",
        "Conceptualizing scenes...",
        "Rendering keyframes...",
        "Adding cinematic motion...",
        "Finalizing the visual effects...",
        "This is taking a bit longer than usual, but creativity can't be rushed!",
        "Almost there, adding the final touches..."
    ];
    let statusIndex = 0;
    setLoadingStatus(statusUpdates[statusIndex]);
    const statusInterval = setInterval(() => {
        statusIndex = (statusIndex + 1) % statusUpdates.length;
        setLoadingStatus(statusUpdates[statusIndex]);
    }, 7000);

    try {
        const initialOperation = await generateVideo(prompt);

        // Fix: Add GenerateVideosResponse type argument to Operation generic type.
        const poll = async (operation: Operation<GenerateVideosResponse>): Promise<void> => {
            const updatedOp = await checkVideoStatus(operation);
            if (updatedOp.done) {
                clearInterval(statusInterval);
                const videoUri = updatedOp.response?.generatedVideos?.[0]?.video?.uri;
                if(videoUri) {
                    const response = await fetch(`${videoUri}&key=${process.env.API_KEY}`);
                    const blob = await response.blob();
                    const reader = new FileReader();
                    reader.onload = () => {
                      const base64Video = reader.result as string;
                       const modelMessage: Message = {
                          id: Date.now().toString() + '-model',
                          role: 'model',
                          text: `Here is the video I generated for "${prompt}".`,
                          videos: [base64Video],
                      };
                      addMessage(modelMessage);
                      setIsLoading(false);
                    };
                    reader.readAsDataURL(blob);
                } else {
                     throw new Error("Video generation completed, but no video URI was found.");
                }
            } else {
                pollingTimeoutRef.current = window.setTimeout(() => poll(updatedOp), 10000);
            }
        };

        await poll(initialOperation);

    } catch (e) {
        clearInterval(statusInterval);
        const errorMessage = e instanceof Error ? e.message : 'An unexpected error occurred during video generation.';
        setError(errorMessage);
        setMessages([]);
        setIsLoading(false);
    }
  }, []);


  const handleSendMessage = useCallback(async (prompt: string) => {
    setIsLoading(true);
    setLoadingStatus('Your AI assistant is thinking...');
    setError(null);

    const userMessage: Message = { id: Date.now().toString(), role: 'user', text: prompt };
    addMessage(userMessage);

    try {
        if (mode === 'generate') {
            const imageUrls = await generateImages(prompt);
            const modelMessage: Message = {
                id: Date.now().toString() + '-model',
                role: 'model',
                text: `Here are the images I generated for "${prompt}". You can save your favorites to the gallery.`,
                images: imageUrls,
            };
            addMessage(modelMessage);
        } else if (mode === 'inspiration') {
            const { text, sources } = await getInspiration(prompt);
             const modelMessage: Message = {
                id: Date.now().toString() + '-model',
                role: 'model',
                text,
                sources,
            };
            addMessage(modelMessage);
        } else { // mode === 'chat'
            if (!chatSessionRef.current) {
                chatSessionRef.current = createDesignChat();
            }
            const stream = await chatSessionRef.current.sendMessageStream({ message: prompt });
            
            let modelResponse = '';
            const modelMessageId = Date.now().toString() + '-model';
            addMessage({ id: modelMessageId, role: 'model', text: '' });

            for await (const chunk of stream) {
                modelResponse += chunk.text;
                setMessages(prev => prev.map(msg => 
                    msg.id === modelMessageId ? { ...msg, text: modelResponse } : msg
                ));
            }
        }
    } catch (e) {
        const errorMessage = e instanceof Error ? e.message : 'An unexpected error occurred.';
        setError(errorMessage);
        setMessages(prev => prev.filter(msg => msg.id !== userMessage.id)); 
    } finally {
        setIsLoading(false);
        setLoadingStatus('');
    }
  }, [mode]);
  
  const handleModeChange = (newMode: Mode) => {
    if (isLoading) return;
    setMode(newMode);
    setError(null);
    setMessages([]);
  };

  const renderContent = () => {
    if (mode === 'gallery') {
        return <Gallery items={galleryItems} onRemove={handleRemoveItem} />;
    }
    if (mode === 'edit') {
        return <ImageEditor onGenerate={handleEditImage} isLoading={isLoading} loadingStatus={loadingStatus} />;
    }
    if (mode === 'video') {
        return <VideoGenerator onGenerate={handleGenerateVideo} isLoading={isLoading} loadingStatus={loadingStatus} />;
    }
    
    // Default chat/generate/inspiration view
    return (
      <>
        <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar">
            <FeedbackDisplay
              messages={messages}
              isLoading={isLoading && messages.length === 0}
              onSaveItem={handleSaveItem}
              savedItemUrls={galleryItems}
              loadingStatus={loadingStatus}
            />
            <div ref={messagesEndRef} />
        </div>
        {error && (
            <div className="mt-4 p-3 bg-red-900/50 border border-red-700 text-red-300 rounded-lg">
              <strong>Error:</strong> {error}
            </div>
        )}
        {['generate', 'chat', 'inspiration'].includes(mode) && <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} mode={mode as 'generate' | 'chat' | 'inspiration'} />}
      </>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans flex flex-col">
      <Header />
      <main className="container mx-auto px-4 flex-grow flex flex-col overflow-hidden">
        <ModeSelector mode={mode} setMode={handleModeChange} isLoading={isLoading}/>
        {renderContent()}
      </main>
    </div>
  );
};

export default App;

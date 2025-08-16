
import React, { useState } from 'react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const SendIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
);


const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="mt-6 mb-4 sticky bottom-4">
      <div className="relative bg-slate-800/70 backdrop-blur-md rounded-lg border border-slate-700 shadow-xl">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a follow-up question..."
          rows={1}
          className="w-full bg-transparent text-slate-200 p-4 pr-16 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none"
          disabled={isLoading}
        />
        <button
          onClick={handleSend}
          disabled={isLoading || !message.trim()}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-sky-600 text-white hover:bg-sky-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors"
          aria-label="Send message"
        >
            {isLoading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            ) : (
                <SendIcon className="w-5 h-5" />
            )}
        </button>
      </div>
    </div>
  );
};

export default ChatInput;

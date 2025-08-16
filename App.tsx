
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Chat } from '@google/genai';
import Header from './components/Header';
import CodeInput from './components/CodeInput';
import FeedbackDisplay from './components/FeedbackDisplay';
import ChatInput from './components/ChatInput'; 
import { createChat } from './services/geminiService';
import { SUPPORTED_LANGUAGES } from './constants';

interface Message {
  role: 'user' | 'model';
  content: string;
}

const App: React.FC = () => {
  const [code, setCode] = useState<string>('function fibonacci(num) {\n  var a = 1, b = 0, temp;\n\n  while (num >= 0){\n    temp = a;\n    a = a + b;\n    b = temp;\n    num--;\n  }\n\n  return b;\n}');
  const [language, setLanguage] = useState<string>(SUPPORTED_LANGUAGES[0].value);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const chatSessionRef = useRef<Chat | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to the bottom of the chat display when messages change
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleReview = useCallback(async () => {
    if (!code.trim()) {
      setError('Please enter some code to review.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setMessages([]); // Start a new conversation

    try {
      chatSessionRef.current = createChat();
      const userPrompt = `Please review the following ${language} code:\n\n\`\`\`${language}\n${code}\n\`\`\``;
      
      setMessages([{ role: 'user', content: userPrompt }]);
      
      const stream = await chatSessionRef.current.sendMessageStream({ message: userPrompt });
      
      let modelResponse = '';
      setMessages(prev => [...prev, { role: 'model', content: '' }]);

      for await (const chunk of stream) {
        modelResponse += chunk.text;
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = { role: 'model', content: modelResponse };
          return newMessages;
        });
      }

    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unexpected error occurred.';
      setError(errorMessage);
      console.error(e);
      setMessages([]); // Clear messages on error
    } finally {
      setIsLoading(false);
    }
  }, [code, language]);

  const handleSendMessage = useCallback(async (message: string) => {
    if (!chatSessionRef.current) return;

    setIsLoading(true);
    setError(null);

    const userMessage: Message = { role: 'user', content: message };
    setMessages(prev => [...prev, userMessage]);

    try {
      const stream = await chatSessionRef.current.sendMessageStream({ message });
      
      let modelResponse = '';
      setMessages(prev => [...prev, { role: 'model', content: '' }]);
      
      for await (const chunk of stream) {
        modelResponse += chunk.text;
        setMessages(prev => {
           const newMessages = [...prev];
           newMessages[newMessages.length - 1] = { role: 'model', content: modelResponse };
           return newMessages;
        });
      }
    } catch (e) {
        const errorMessage = e instanceof Error ? e.message : 'An unexpected error occurred.';
        setError(errorMessage);
        console.error(e);
    } finally {
        setIsLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans flex flex-col">
      <Header />
      <main className="container mx-auto px-4 py-8 flex-grow flex flex-col overflow-hidden">
        <div className="max-w-4xl w-full mx-auto flex flex-col flex-grow">
          <CodeInput
            code={code}
            setCode={setCode}
            language={language}
            setLanguage={setLanguage}
            onReview={handleReview}
            isLoading={isLoading && messages.length === 0} // Only show loader on initial review
          />
          {error && (
            <div className="mt-4 p-3 bg-red-900/50 border border-red-700 text-red-300 rounded-lg">
              <strong>Error:</strong> {error}
            </div>
          )}
          <div ref={chatContainerRef} className="flex-grow overflow-y-auto">
            <FeedbackDisplay
              messages={messages}
              isLoading={isLoading && messages.length === 0}
            />
          </div>
          {messages.length > 0 && (
              <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;

import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, X, Sparkles, MessageSquare } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { useLanguage } from '../context/LanguageContext';
import { ApiDefinition } from '../types';

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
}

interface AiTutorProps {
  apiDefinition: ApiDefinition;
  lastResponse: any;
  lastStatus: number | null;
  isError: boolean;
}

export const AiTutor: React.FC<AiTutorProps> = ({ apiDefinition, lastResponse, lastStatus, isError }) => {
  const { t, language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  // Initial greeting
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 'welcome',
          role: 'model',
          text: t('ai_welcome')
        }
      ]);
    }
  }, [t]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: input
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // Construct context about the current API state
      const apiContext = `
        Current API: ${apiDefinition.name}
        Description: ${apiDefinition.description}
        Endpoint: ${apiDefinition.endpoint}
        User Language: ${language === 'pt' ? 'Portuguese (Brazil)' : 'English'}
        
        Last Request Status: ${lastStatus || 'Not run yet'}
        Was Error: ${isError}
        Last Response Data: ${lastResponse ? JSON.stringify(lastResponse).slice(0, 1000) : 'No response data yet'}
      `;

      const systemInstruction = `
        You are an enthusiastic, patient, and helpful Coding Tutor specializing in REST APIs.
        Your goal is to help the student understand the ${apiDefinition.name} API.
        
        Rules:
        1. Keep answers concise and encouraging.
        2. If the user encountered an error (status 4xx/5xx), explain why it happened based on the HTTP status code.
        3. If there is JSON response data in the context, help the user interpret the structure (e.g., "The 'weather' key is an array...").
        4. If the user asks for code, provide short, clean JavaScript examples using 'fetch'.
        5. Answer in ${language === 'pt' ? 'Portuguese' : 'English'}.
        6. Do not mention that you are an AI or LLM, just act as a tutor.
      `;

      const prompt = `
        CONTEXT:
        ${apiContext}

        USER QUESTION:
        ${userMessage.text}
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          systemInstruction: systemInstruction,
        }
      });

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: response.text || 'Sorry, I could not generate a response.'
      };

      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      console.error("Gemini Error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: language === 'pt' ? 'Desculpe, tive um problema ao conectar com meu cérebro. Tente novamente.' : 'Sorry, I had trouble connecting to my brain. Please try again.'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-5 py-3 rounded-full shadow-xl transition-all hover:scale-105 animate-in fade-in slide-in-from-bottom-4 duration-500"
      >
        <Sparkles size={20} className="animate-pulse" />
        <span className="font-bold">{t('ai_tutor_title')}</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-40 w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-800 flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300" style={{ height: '500px' }}>
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4 flex justify-between items-center text-white">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-white/20 rounded-full">
            <Bot size={18} />
          </div>
          <div>
            <h3 className="font-bold text-sm">{t('ai_tutor_title')}</h3>
            <span className="text-xs text-purple-200 flex items-center gap-1">
               <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span> Gemini 2.5 Flash
            </span>
          </div>
        </div>
        <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white transition-colors">
          <X size={20} />
        </button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-slate-950/50">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div 
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                msg.role === 'user' 
                  ? 'bg-purple-600 text-white rounded-tr-none' 
                  : 'bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-800 dark:text-gray-200 rounded-tl-none shadow-sm'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
             <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <Sparkles size={12} className="animate-spin text-purple-500" /> {t('ai_thinking')}
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={t('ai_placeholder')}
            className="w-full pl-4 pr-12 py-3 rounded-full border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 dark:text-white"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="absolute right-2 top-2 p-1.5 bg-purple-600 text-white rounded-full hover:bg-purple-700 disabled:opacity-50 disabled:hover:bg-purple-600 transition-colors"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

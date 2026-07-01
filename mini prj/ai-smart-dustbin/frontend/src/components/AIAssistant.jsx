import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, X, Bot, User, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';
import axios from 'axios';

export default function AIAssistant({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    { id: 1, role: 'ai', content: "Hi there! I am Nexus AI Core. I can help you with critical node monitoring, fleet logistics, and sustainability projections. How can I assist you today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const endOfMessagesRef = useRef(null);

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMsg = { id: Date.now(), role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await axios.post('http://localhost:8000/api/ai/chat', { message: userMsg.content });
      setMessages(prev => [...prev, { id: Date.now(), role: 'ai', content: res.data.reply }]);
    } catch (error) {
      setMessages(prev => [...prev, { id: Date.now(), role: 'ai', content: "System connection issues. Failed to reach the synaptic uplink." }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={cn(
      "absolute top-0 right-0 h-full w-[420px] glass-panel border-l border-white/10 flex flex-col z-50 transform transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] shadow-[-30px_0_60px_rgba(0,0,0,0.3)] dark:shadow-[-30px_0_60px_rgba(0,0,0,0.7)]",
      isOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
    )}>
      {/* Header */}
      <div className="h-24 px-8 bg-gradient-to-r from-indigo-600/10 via-purple-600/10 to-indigo-600/10 dark:from-indigo-600/20 dark:to-purple-600/20 backdrop-blur-3xl text-slate-800 dark:text-white flex items-center justify-between border-b border-slate-200 dark:border-white/5 shrink-0 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
        <div className="flex items-center">
          <div className="bg-indigo-500/10 dark:bg-indigo-500/20 p-3 rounded-2xl mr-4 border border-indigo-500/20 shadow-lg drop-shadow-[0_0_15px_rgba(99,102,241,0.2)]">
            <Sparkles className="h-6 w-6 text-indigo-600 dark:text-indigo-400 animate-pulse" />
          </div>
          <div>
            <h2 className="font-black text-[11px] uppercase tracking-[0.3em] flex items-center italic mb-0.5">
              Nexus AI Core
              <span className="ml-3 h-1.5 w-1.5 bg-emerald-500 rounded-full animate-ping shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
            </h2>
            <p className="text-[9px] text-slate-500 dark:text-slate-400 font-black uppercase tracking-widest opacity-80">Link Status: Optimal</p>
          </div>
        </div>
        <button 
          onClick={onClose} 
          className="p-3 bg-slate-100 dark:bg-white/5 hover:bg-slate-900 dark:hover:bg-white text-slate-600 dark:text-slate-400 hover:text-white dark:hover:text-slate-900 rounded-2xl transition-all hover:rotate-90 shadow-sm border border-slate-200 dark:border-white/5 active:scale-90"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar bg-white/40 dark:bg-slate-950/20">
        {messages.map(m => (
          <div key={m.id} className={cn("flex max-w-[94%] animate-in fade-in slide-in-from-bottom-6 duration-700", m.role === 'user' ? "ml-auto" : "mr-auto")}>
            {m.role === 'ai' && (
              <div className="h-10 w-10 rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center mr-4 shrink-0 shadow-lg group">
                <Bot className="h-5 w-5 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform" />
              </div>
            )}
            <div className={cn(
              "px-6 py-4 rounded-[28px] text-[13px] leading-[1.6] font-medium shadow-2xl backdrop-blur-md transition-all duration-300",
              m.role === 'user' 
                ? "bg-indigo-600 dark:bg-indigo-600/30 text-white dark:text-indigo-100 border border-indigo-500/30 rounded-tr-none shadow-indigo-500/20 hover:scale-[1.02] origin-right" 
                : "bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 rounded-tl-none shadow-black/5 hover:scale-[1.02] origin-left"
            )}>
              {m.content}
            </div>
            {m.role === 'user' && (
              <div className="h-10 w-10 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center ml-4 shrink-0 shadow-md">
                <User className="h-5 w-5 text-slate-500 dark:text-slate-400" />
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex mr-auto max-w-[90%] animate-pulse">
            <div className="h-10 w-10 rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center mr-4 shrink-0">
                <Bot className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div className="px-7 py-4 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[28px] rounded-tl-none flex items-center space-x-2 text-slate-500 shadow-xl">
              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce delay-75"></span>
              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce delay-150"></span>
            </div>
          </div>
        )}
        <div ref={endOfMessagesRef} />
      </div>

      {/* Input Area */}
      <div className="p-8 bg-white dark:bg-white/5 border-t border-slate-200 dark:border-white/5 backdrop-blur-3xl shrink-0">
        <div className="relative flex items-center gap-4">
          <div className="relative flex-1 group">
            <input
              type="text"
              className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-[22px] py-5 pl-7 pr-16 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all font-bold shadow-inner"
              placeholder="Query synaptic network..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
            />
            <button 
              onClick={handleSend}
              className={cn(
                "absolute right-2.5 top-2.5 bottom-2.5 px-5 rounded-[18px] transition-all flex items-center justify-center border active:scale-90",
                input.trim() 
                  ? "bg-indigo-600 border-transparent text-white shadow-xl shadow-indigo-600/40 scale-100 hover:bg-indigo-500" 
                  : "bg-slate-200 dark:bg-white/5 border-transparent text-slate-400 dark:text-slate-600 scale-95 opacity-50 cursor-not-allowed"
              )}
              disabled={!input.trim()}
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between mt-8 px-2">
          <p className="text-[9px] text-slate-500 dark:text-slate-600 font-black uppercase tracking-[0.3em] opacity-60 italic">
            Neural v4.1
          </p>
          <p className="text-[9px] text-slate-500 dark:text-slate-600 font-black uppercase tracking-[0.3em] opacity-30">
            Groq Adaptive LLM
          </p>
        </div>
      </div>
    </div>
  );
}

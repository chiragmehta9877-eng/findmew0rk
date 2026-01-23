'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MessageSquare, X, Send, Sparkles, Zap, Bot } from 'lucide-react';

export default function Chatbot() {
  const router = useRouter(); 
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Hi! 👋 Need help finding a job?' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if(isOpen) messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, isOpen]);

  const handleSend = async (msg: string = input) => {
    if (!msg.trim()) return;

    const userMsg = { role: 'user', text: msg };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg }),
      });
      const data = await res.json();
      
      setTimeout(() => {
        setMessages((prev) => [...prev, { role: 'bot', text: data.reply }]);
        setIsTyping(false);

        if (data.action === 'search' && data.query) {
            setTimeout(() => {
                setIsOpen(false); 
                router.push(`/x-jobs?search=${encodeURIComponent(data.query)}`); 
            }, 1500);
        }

      }, 600);

    } catch (error) {
      setTimeout(() => {
        setMessages((prev) => [...prev, { role: 'bot', text: "Connection error." }]);
        setIsTyping(false);
      }, 1000);
    }
  };

  const suggestions = ["Remote Jobs", "Internships", "Freelance"];

  return (
    // 🔥 FIX: Dynamic Z-Index (Open hone par hi sabse upar ayega)
    <div className={`fixed bottom-5 right-5 flex flex-col items-end font-sans transition-all ${isOpen ? 'z-[9999]' : 'z-30'}`}>
      
      {/* 🟢 CHAT WINDOW */}
      <div 
        className={`
          transition-all duration-300 ease-in-out transform origin-bottom-right 
          ${isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4 pointer-events-none'} 
          mb-3
        `}
      >
        <div className="bg-white dark:bg-slate-900 w-[280px] md:w-[300px] h-[380px] rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 flex flex-col overflow-hidden">
          
          {/* HEADER */}
          <div className="bg-teal-600 p-3 flex justify-between items-center text-white shadow-sm">
            <div className="flex items-center gap-2">
              <div className="bg-white/20 p-1 rounded-lg">
                <Bot size={16} className="text-white" />
              </div>
              <div>
                <h3 className="font-bold text-xs tracking-wide">FindMeWork AI</h3>
                <div className="flex items-center gap-1 opacity-90">
                  <span className="w-1.5 h-1.5 bg-green-300 rounded-full animate-pulse"></span>
                  <p className="text-[10px] font-medium">Online</p>
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => setIsOpen(false)} 
              className="hover:bg-white/20 p-1.5 rounded-full transition-all active:scale-95"
            >
              <X size={16} />
            </button>
          </div>

          {/* MESSAGES */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-slate-50 dark:bg-slate-950/50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-1 duration-200`}>
                {msg.role === 'bot' && (
                   <div className="w-6 h-6 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center mr-2 mt-auto shrink-0">
                     <Sparkles size={12} className="text-teal-600 dark:text-teal-400" />
                   </div>
                )}
                <div className={`max-w-[85%] px-3 py-2 text-xs shadow-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-teal-600 text-white rounded-2xl rounded-br-none' 
                    : 'bg-white dark:bg-slate-800 border border-gray-100 dark:border-gray-700 text-slate-700 dark:text-slate-200 rounded-2xl rounded-bl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start items-center animate-in fade-in duration-200">
                 <div className="w-6 h-6 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center mr-2"><Sparkles size={12} className="text-teal-600" /></div>
                 <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-gray-700 px-3 py-2 rounded-2xl rounded-bl-none shadow-sm flex gap-1 items-center">
                    <span className="w-1 h-1 bg-slate-400 rounded-full animate-bounce"></span>
                    <span className="w-1 h-1 bg-slate-400 rounded-full animate-bounce delay-75"></span>
                    <span className="w-1 h-1 bg-slate-400 rounded-full animate-bounce delay-150"></span>
                 </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* INPUT */}
          <div className="p-3 bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-gray-800">
            {messages.length < 3 && (
                <div className="flex gap-2 overflow-x-auto no-scrollbar mb-2">
                {suggestions.map((s, i) => (
                    <button key={i} onClick={() => handleSend(s)} className="whitespace-nowrap px-2.5 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-[10px] font-medium text-slate-600 dark:text-slate-300 hover:bg-teal-50 hover:text-teal-700 transition-colors">
                    {s}
                    </button>
                ))}
                </div>
            )}
            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 p-1 pl-3 rounded-full border border-gray-200 dark:border-gray-700 focus-within:border-teal-500 transition-all">
              <input className="flex-1 bg-transparent text-xs outline-none text-slate-800 dark:text-white placeholder:text-slate-400" placeholder="Ask me..." value={input} onChange={(e) => setInput(e.target.value)} />
              <button type="submit" disabled={!input.trim() || isTyping} className="bg-teal-600 text-white p-1.5 rounded-full hover:bg-teal-700 active:scale-95 disabled:opacity-50 transition-all">
                {input.trim() ? <Send size={14} /> : <Zap size={14} />}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* 🟣 BUTTON */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`
            relative group flex items-center justify-center w-12 h-12 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 
            ${isOpen ? 'bg-slate-800 rotate-90 scale-90' : 'bg-teal-600 hover:-translate-y-1'}
        `}
      >
        {!isOpen && (
          <span className="absolute top-0 right-0 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border-2 border-white"></span>
          </span>
        )}
        <div className="text-white">
            {isOpen ? <X size={20} /> : <MessageSquare size={20} />}
        </div>
      </button>
    </div>
  );
}
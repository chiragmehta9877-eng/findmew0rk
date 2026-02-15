'use client';

import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Bot, ArrowRight, Minus, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

// 🤖 CHATBOT LOGIC (Updated with more conversations)
const getBotResponse = (input: string): { text: string; link?: string; linkText?: string } => {
  const lowerInput = input.toLowerCase();

  // 1. GREETINGS & CASUAL
  if (lowerInput.match(/\b(hi|hello|hey|greetings|sup)\b/)) {
    return { text: "Hello! I'm FindMeWork AI. Ready to hunt some jobs?" };
  }
  if (lowerInput.includes("how are you") || lowerInput.includes("how r u")) {
    return { text: "I'm just code, but I'm feeling fantastic! Thanks for asking. How can I help your career today?" };
  }
  if (lowerInput.match(/\b(lol|lmao|haha|rofl)\b/)) {
    return { text: "Glad I could make you smile! Job hunting is serious, but we can still have fun." };
  }
  if (lowerInput.match(/\b(bye|goodbye|cya|night|gn)\b/)) {
    return { text: "Goodbye! Good luck with the job hunt. I'll be here if you need me again!" };
  }
  if (lowerInput.match(/\b(thanks|thank you|thx)\b/)) {
    return { text: "You're very welcome! Let's land that dream job." };
  }

  // 2. SITE NAVIGATION
if (lowerInput.includes("privacy") || lowerInput.includes("policy")) {
    return { 
      text: "Your data is safe with us. We don't sell your info.", 
      link: "/privacy-policy",
      linkText: "Read Privacy Policy"
    };
  }
  
  
  if (lowerInput.includes("support") || lowerInput.includes("help") || lowerInput.includes("contact")) {
    return { 
      text: "Need a human? Our support team is ready to assist.", 
      link: "/contact", 
      linkText: "Contact SupportS"
    };
  }
  if (lowerInput.includes("cost") || lowerInput.includes("free") || lowerInput.includes("pricing")) {
    return { text: "FindMeWork is 100% Free for job seekers! No hidden fees." };
  }

  // 3. JOB RELATED
  if (lowerInput.includes("job") || lowerInput.includes("work") || lowerInput.includes("hiring")) {
    return { text: "I can help! Use the search bar for specific roles like 'React' or 'Data'. Or browse the latest drops below." };
  }

  // 4. FALLBACK
  return { text: "I'm still learning! Try asking 'How are you?', or just say 'Hi'." };
};

// 💡 QUICK SUGGESTIONS
const SUGGESTIONS = [
  "Find me a job",
  "How are you?",
  "Is this free?",
  "Privacy Policy",
  "Bye!"
];

type Message = {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  link?: string;
  linkText?: string;
};

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Hi! I'm your AI Recruiter. How can I help?", sender: 'bot' }
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, isOpen]);

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    const newUserMsg: Message = { id: Date.now(), text: text, sender: 'user' };
    setMessages(prev => [...prev, newUserMsg]);
    setInputText("");
    setIsTyping(true);

    setTimeout(() => {
      const response = getBotResponse(text);
      const newBotMsg: Message = { 
        id: Date.now() + 1, 
        text: response.text, 
        sender: 'bot',
        link: response.link,
        linkText: response.linkText
      };
      setMessages(prev => [...prev, newBotMsg]);
      setIsTyping(false);
    }, 1000); 
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-4 font-sans">
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            // 🔥 COMPACT MOBILE SIZE
            className="w-[85vw] sm:w-[360px] h-[450px] sm:h-[500px] bg-white dark:bg-[#0A192F] rounded-2xl shadow-2xl border border-gray-200 dark:border-white/10 flex flex-col overflow-hidden"
          >
            {/* HEADER */}
            <div className="bg-slate-900 p-3 sm:p-4 flex justify-between items-center border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="relative">
                   <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-tr from-teal-500 to-teal-700 rounded-full flex items-center justify-center shadow-lg">
                      <Bot size={18} className="text-white" />
                   </div>
                   <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-slate-900 rounded-full"></span>
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">FindMeWork Bot</h3>
                  <p className="text-[10px] sm:text-xs text-slate-400">Online & Ready</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                 <Minus size={20} />
              </button>
            </div>

            {/* MESSAGES */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 bg-gray-50 dark:bg-[#0A192F]/50 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`
                    max-w-[85%] p-3 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-sm
                    ${msg.sender === 'user' 
                      ? 'bg-teal-600 text-white rounded-br-none' // 🔥 GREEN THEME FOR USER
                      : 'bg-white dark:bg-[#112240] text-slate-700 dark:text-gray-200 border border-gray-200 dark:border-white/5 rounded-bl-none'}
                  `}>
                    {msg.text}
                    {msg.link && (
                      <Link href={msg.link} className="mt-2 block">
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 px-3 py-2 rounded-lg hover:bg-teal-100 dark:hover:bg-teal-900/50 transition-colors w-full justify-center border border-teal-100 dark:border-teal-500/20">
                           {msg.linkText} <ArrowRight size={12} />
                        </span>
                      </Link>
                    )}
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                   <div className="bg-white dark:bg-[#112240] border border-gray-200 dark:border-white/5 p-3 rounded-2xl rounded-bl-none flex gap-1.5 shadow-sm">
                      <motion.span animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0 }} className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                      <motion.span animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }} className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                      <motion.span animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }} className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                   </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* INPUT */}
            <div className="p-3 bg-white dark:bg-[#0A192F] border-t border-gray-100 dark:border-white/10">
              <div className="flex gap-2 overflow-x-auto pb-2 mb-1 scrollbar-hide">
                 {SUGGESTIONS.map((chip, idx) => (
                    <button 
                      key={idx}
                      onClick={() => handleSendMessage(chip)}
                      className="whitespace-nowrap px-3 py-1 bg-gray-100 dark:bg-white/5 hover:bg-teal-50 dark:hover:bg-teal-900/20 text-slate-600 dark:text-slate-300 text-[10px] sm:text-xs font-medium rounded-full border border-gray-200 dark:border-white/10 transition-colors"
                    >
                      {chip}
                    </button>
                 ))}
              </div>

              <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(inputText); }} className="flex items-center gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 bg-gray-50 dark:bg-[#112240] text-slate-900 dark:text-white text-xs sm:text-sm rounded-xl px-3 sm:px-4 py-2 sm:py-3 focus:outline-none focus:ring-2 focus:ring-teal-500/50 border border-gray-200 dark:border-white/10"
                />
                <button 
                  type="submit"
                  disabled={!inputText.trim() || isTyping}
                  className="bg-teal-600 hover:bg-teal-500 text-white p-2 sm:p-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-teal-600/20"
                >
                  <Send size={16} className="sm:w-[18px] sm:h-[18px]" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🔥 FLOATING BUTTON (Green Theme + Compact) */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative w-12 h-12 sm:w-14 sm:h-14 bg-teal-600 hover:bg-teal-500 text-white rounded-full flex items-center justify-center shadow-2xl shadow-teal-900/30 transition-colors z-50 group"
      >
        {isOpen ? <X size={22} /> : <MessageCircle size={24} />}
        
        {!isOpen && (
            <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 border-2 border-white dark:border-[#0A192F] rounded-full animate-pulse"></span>
        )}

        
      </motion.button>
    </div>
  );
}
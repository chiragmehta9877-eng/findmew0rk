'use client';
import React, { useState, useEffect } from 'react';
import { Search, ArrowRight } from 'lucide-react';

const phrases = [
  "Next.js Developer...",
  "Startup Founder...",
  "Remote Jobs...",
  "$100k+ Salary...",
  "Twitter Hiring..."
];

// 🔥 Added Prop Interface
interface HeroSearchProps {
  onSearch?: (query: string) => void;
}

export default function HeroSearch({ onSearch }: HeroSearchProps) {
  // Animation State
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);

  // 🔥 Functional State (User Input)
  const [query, setQuery] = useState('');

  // 1. Typing Animation Logic (Design Intact)
  useEffect(() => {
    const handleType = () => {
      const i = loopNum % phrases.length;
      const fullText = phrases[i];

      setText(isDeleting 
        ? fullText.substring(0, text.length - 1) 
        : fullText.substring(0, text.length + 1)
      );

      setTypingSpeed(isDeleting ? 50 : 150);

      if (!isDeleting && text === fullText) {
        setTimeout(() => setIsDeleting(true), 2000); 
      } 
      else if (isDeleting && text === '') {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
      }
    };

    const timer = setTimeout(handleType, typingSpeed);
    return () => clearTimeout(timer);
  }, [text, isDeleting, loopNum, typingSpeed]);

  // 🔥 2. Search Handlers
  const handleSearchTrigger = () => {
    if (query.trim() && onSearch) {
        onSearch(query);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
        handleSearchTrigger();
    }
  };

  return (
    <div className="relative w-full max-w-xl mb-8 group z-20">
      
      {/* 1. Glowing Background */}
      <div className="absolute -inset-1 bg-gradient-to-r from-teal-500 via-blue-500 to-purple-500 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-200 animate-gradient-x"></div>
      
      {/* 2. Main Search Bar */}
      <div className="relative flex items-center bg-white dark:bg-[#112240] border border-gray-200 dark:border-white/10 rounded-2xl p-2 shadow-xl transition-colors">
        
        {/* Search Icon */}
        <div className="pl-4 text-gray-400 group-focus-within:text-teal-500 transition-colors">
          <Search size={22} />
        </div>

        {/* 3. Input with Animated Placeholder */}
        <div className="flex-1 relative h-12 ml-3">
          <input 
            type="text" 
            value={query} // 🔥 Connected State
            onChange={(e) => setQuery(e.target.value)} // 🔥 Capture Input
            onKeyDown={handleKeyDown} // 🔥 Handle Enter Key
            placeholder={`Search for ${text}|`} 
            className="w-full h-full bg-transparent text-lg text-slate-800 dark:text-white outline-none placeholder-gray-400 dark:placeholder-gray-500 font-medium font-mono tracking-tight"
          />
        </div>

        {/* Action Button */}
        <button 
            onClick={handleSearchTrigger} // 🔥 Handle Click
            className="bg-teal-600 hover:bg-teal-700 text-white dark:bg-teal-400 dark:text-[#0A192F] dark:hover:bg-white p-3 rounded-xl transition-all shadow-md transform active:scale-95"
        >
           <ArrowRight size={20} />
        </button>

      </div>
    </div>
  );
}
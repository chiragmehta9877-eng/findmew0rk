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

interface HeroSearchProps {
  onSearch?: (query: string) => void;
}

export default function HeroSearch({ onSearch }: HeroSearchProps) {
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);
  const [query, setQuery] = useState('');

  // Typing Effect Logic
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
  }, [text, isDeleting, loopNum, typingSpeed]); // Dependencies fixed

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
    <div className="relative w-full max-w-xl mb-8 group z-20 px-4 sm:px-0">
      
      {/* Main Search Bar Container */}
      <div className="relative flex items-center bg-white dark:bg-[#112240] border border-gray-200 dark:border-white/10 rounded-2xl p-1.5 sm:p-2 shadow-xl transition-colors w-full">
        
        {/* Search Icon - Flex shrink prevent shrinking */}
        <div className="pl-2 sm:pl-4 text-gray-400 group-focus-within:text-teal-500 transition-colors flex-shrink-0">
          <Search className="w-5 h-5 sm:w-[22px] sm:h-[22px]" />
        </div>

        {/* 🔥 FIX HERE: 
            1. min-w-0: Prevents flex item from overflowing 
            2. flex-1: Takes remaining space 
        */}
        <div className="flex-1 relative h-10 sm:h-12 ml-2 sm:ml-3 min-w-0">
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Search for ${text}|`} 
            // 🔥 FIX: text-sm on mobile, truncate to handle overflow
            className="w-full h-full bg-transparent text-sm sm:text-lg text-slate-800 dark:text-white outline-none placeholder-gray-400 dark:placeholder-gray-500 font-medium font-mono tracking-tight truncate"
          />
        </div>

        {/* Action Button - Flex shrink prevent shrinking */}
        <button 
            onClick={handleSearchTrigger}
            className="flex-shrink-0 bg-teal-600 hover:bg-teal-700 text-white dark:bg-teal-400 dark:text-[#0A192F] dark:hover:bg-white p-2.5 sm:p-3 rounded-xl transition-all shadow-md transform active:scale-95 ml-2"
        >
            <ArrowRight className="w-5 h-5 sm:w-[20px] sm:h-[20px]" />
        </button>

      </div>
    </div>
  );
}
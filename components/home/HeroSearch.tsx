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

export default function HeroSearch() {
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);

  useEffect(() => {
    const handleType = () => {
      const i = loopNum % phrases.length;
      const fullText = phrases[i];

      // Logic: Agar delete kar raha hai toh text kam karo, nahi toh badhao
      setText(isDeleting 
        ? fullText.substring(0, text.length - 1) 
        : fullText.substring(0, text.length + 1)
      );

      // Speed control: Deleting fast hoti hai (50ms), Typing normal (150ms)
      setTypingSpeed(isDeleting ? 50 : 150);

      // Logic: Jab pura type ho jaye
      if (!isDeleting && text === fullText) {
        // 2 second wait karo fir delete start karo
        setTimeout(() => setIsDeleting(true), 2000); 
      } 
      // Logic: Jab pura delete ho jaye
      else if (isDeleting && text === '') {
        setIsDeleting(false);
        setLoopNum(loopNum + 1); // Next phrase pe jao
      }
    };

    const timer = setTimeout(handleType, typingSpeed);
    return () => clearTimeout(timer);
  }, [text, isDeleting, loopNum, typingSpeed]);

  return (
    <div className="relative w-full max-w-xl mb-8 group z-20">
      
      {/* 1. Glowing Background (Animated Gradient) */}
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
            // 🔥 Magic yahan hai: Dynamic Text + Blinking Cursor '|'
            placeholder={`Search for ${text}|`} 
            className="w-full h-full bg-transparent text-lg text-slate-800 dark:text-white outline-none placeholder-gray-400 dark:placeholder-gray-500 font-medium font-mono tracking-tight"
          />
        </div>

        {/* Action Button */}
        <button className="bg-teal-600 hover:bg-teal-700 text-white dark:bg-teal-400 dark:text-[#0A192F] dark:hover:bg-white p-3 rounded-xl transition-all shadow-md transform active:scale-95">
           <ArrowRight size={20} />
        </button>

      </div>
    </div>
  );
}
'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, ArrowRight, Zap, CheckCircle, Search, Linkedin, Twitter, Sparkles } from 'lucide-react';

// Data for the 3 States (LinkedIn -> Twitter -> FindMeWork)
const slides = [
  {
    id: 'linkedin',
    company: 'Microsoft',
    role: 'Senior React Developer',
    location: 'Redmond, WA (Hybrid)',
    tags: ['React', 'Azure', 'TypeScript'],
    source: 'LinkedIn',
    sourceColor: 'text-[#0a66c2]',
    icon: <Linkedin size={14} />,
    match: '92%',
    desc: 'Posted on LinkedIn Jobs 2 hours ago. High priority role.',
    theme: 'blue'
  },
  {
    id: 'twitter',
    company: 'Stealth AI Startup',
    role: 'Founding Engineer',
    location: 'Remote / Global',
    tags: ['Next.js', 'OpenAI', 'Supabase'],
    source: 'X (Twitter)',
    sourceColor: 'text-black dark:text-white',
    icon: <Twitter size={14} />,
    match: '98%',
    desc: 'Found in a thread by @TechFounder. Hiring immediately.',
    theme: 'gray'
  },
  {
    id: 'findmework',
    company: 'Spotify',
    role: 'Lead Product Designer',
    location: 'New York / Remote',
    tags: ['Figma', 'UX/UI', 'Design Systems'],
    source: 'FindMeWork', // 🔥 Tera Platform
    sourceColor: 'text-teal-600 dark:text-teal-400',
    icon: <Sparkles size={14} />, // Premium Icon
    match: '99% Match',
    desc: 'Exclusive opportunity curated by FindMeWork AI algorithms.',
    theme: 'teal'
  }
];

export default function JobHologram() {
  const [index, setIndex] = useState(0);

  // Loop Logic: Change slide every 3.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 3500); 
    return () => clearInterval(timer);
  }, []);

  const currentSlide = slides[index];

  return (
    <div className="relative w-full max-w-md mx-auto transform hover:scale-105 transition-transform duration-500">
      
      {/* Background Animated Blobs (Color Changes based on Card) */}
      <div className={`absolute top-0 -left-4 w-80 h-80 rounded-full blur-3xl animate-pulse transition-colors duration-1000 
        ${currentSlide.theme === 'teal' ? 'bg-teal-500/30' : currentSlide.theme === 'blue' ? 'bg-blue-500/30' : 'bg-purple-500/20'}`}>
      </div>
      <div className="absolute bottom-0 -right-4 w-72 h-72 bg-purple-500/30 rounded-full blur-3xl animate-pulse delay-700"></div>

      {/* 3D Floating Container */}
      <motion.div 
        animate={{ 
          y: [0, -15, 0],
          rotateX: [0, 3, 0],
          rotateY: [0, -3, 0]
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="relative z-10 bg-white dark:bg-[#112240] rounded-2xl border border-gray-200 dark:border-white/10 shadow-2xl overflow-hidden backdrop-blur-sm min-h-[280px]"
      >
        {/* Scanning Line Effect */}
        <motion.div 
          animate={{ top: ['-10%', '110%'] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
          className="absolute left-0 w-full h-2 bg-gradient-to-r from-transparent via-teal-400 to-transparent opacity-30 z-30"
        />

        {/* Content Switching with Flash Effect */}
        <AnimatePresence mode='wait'>
          <motion.div
            key={currentSlide.id}
            initial={{ opacity: 0, filter: 'blur(10px)', scale: 0.95 }}
            animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
            exit={{ opacity: 0, filter: 'blur(5px)', scale: 1.05 }}
            transition={{ duration: 0.4 }}
            className="h-full flex flex-col"
          >
             {/* Card Header */}
            <div className="p-7 border-b border-gray-100 dark:border-white/5">
              <div className="flex justify-between items-start mb-4">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg transition-colors duration-500
                    ${currentSlide.theme === 'blue' ? 'bg-[#0a66c2]' : currentSlide.theme === 'gray' ? 'bg-black dark:bg-white dark:text-black' : 'bg-teal-600'}`}>
                  {currentSlide.company[0]}
                </div>
                <span className={`px-3 py-1 text-xs font-bold uppercase rounded-full tracking-wide transition-colors
                    ${currentSlide.theme === 'teal' ? 'bg-teal-100 text-teal-700 dark:bg-teal-500/20 dark:text-teal-400' : 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400'}`}>
                  {currentSlide.match}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                {currentSlide.role}
              </h3>
              <p className="text-sm font-medium text-slate-500 dark:text-gray-400">{currentSlide.company} • {currentSlide.location}</p>
            </div>

            {/* Card Body */}
            <div className="p-7 space-y-5 flex-1">
              <div className="flex flex-wrap gap-2">
                {currentSlide.tags.map((tag, i) => (
                  <span key={i} className="text-xs font-semibold px-3 py-1.5 bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-gray-300 rounded-md">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-gray-400 bg-slate-50 dark:bg-[#0A192F] p-4 rounded-xl border border-gray-100 dark:border-white/5">
                 <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0
                    ${currentSlide.theme === 'teal' ? 'bg-teal-100 text-teal-600 dark:bg-teal-500/20 dark:text-teal-400' : 'bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400'}`}>
                   <Zap size={16} fill="currentColor" />
                 </div>
                 <p className="leading-relaxed">
                   {currentSlide.desc}
                 </p>
              </div>
            </div>

            {/* Card Footer */}
            <div className="p-5 bg-slate-50 dark:bg-[#0A192F]/50 border-t border-gray-100 dark:border-white/5 flex items-center justify-between mt-auto">
              <div>
                <p className="text-[10px] uppercase text-gray-400 font-bold tracking-wider mb-0.5">Source</p>
                <p className={`text-sm font-bold flex items-center gap-1.5 ${currentSlide.sourceColor}`}>
                  {currentSlide.icon} {currentSlide.source}
                </p>
              </div>
              
              <button className={`px-5 py-2.5 rounded-xl text-xs font-bold shadow-lg flex items-center gap-2 transition-all transform hover:scale-105
                  ${currentSlide.theme === 'teal' 
                    ? 'bg-teal-600 text-white shadow-teal-500/30' 
                    : 'bg-slate-900 dark:bg-white text-white dark:text-[#0A192F] shadow-blue-500/20'}`}>
                Apply Now <ArrowRight size={14} />
              </button>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Flash Overlay Effect */}
        <motion.div
           key={index + "-flash"}
           initial={{ opacity: 0.6 }}
           animate={{ opacity: 0 }}
           transition={{ duration: 0.5 }}
           className="absolute inset-0 bg-white pointer-events-none z-40 mix-blend-overlay"
        />

      </motion.div>

      {/* Floating Status Badge */}
      <motion.div 
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 4, repeat: Infinity, delay: 1 }}
        className="absolute -right-8 top-24 bg-white dark:bg-[#112240] p-4 rounded-xl shadow-xl border border-gray-100 dark:border-white/10 flex items-center gap-3 z-20"
      >
         <div className="relative">
           <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-ping"></span>
           <Search size={20} className="text-slate-400" />
         </div>
         <div>
           <p className="text-[10px] text-gray-400 font-bold uppercase">System</p>
           <p className="text-xs font-bold text-teal-500">Scanning...</p>
         </div>
      </motion.div>

    </div>
  );
}
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion'; 
import { X, Megaphone, ArrowRight, Zap, Radio } from 'lucide-react';

export default function FeedbackPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    // 🔥 Updated: 1 Minute delay (60000 milliseconds)
    const timer = setTimeout(() => {
        // Agar aap chahte hain ki user ko sirf ek baar dikhe session me, 
        // toh neeche wali lines uncomment kar dena:
        
        // const hasSeen = sessionStorage.getItem('feedbackSeen');
        // if (!hasSeen) {
            setIsVisible(true);
        // }
    }, 60000); // <--- Yahan 60000 kar diya hai (1 Minute)

    return () => clearTimeout(timer);
  }, []);

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsVisible(false);
    // sessionStorage.setItem('feedbackSeen', 'true'); 
  };

  if (!isMounted) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        // OVERLAY
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm"
        >
          
          {/* POSTER CARD CONTAINER */}
          <motion.div 
            // 🔥 OPTIMIZED FOR MOBILE
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 30,    
                mass: 1         
            }}
            style={{ willChange: "transform, opacity" }} 
            className="relative group w-full max-w-3xl"
          >
            
            {/* Glow Effect behind */}
            <div className="absolute -inset-1 bg-gradient-to-r from-teal-500 via-blue-600 to-purple-600 rounded-[1.3rem] blur-lg opacity-30 group-hover:opacity-50 transition duration-1000"></div>
            
            {/* Main Content Container */}
            <div className="relative bg-white dark:bg-[#0f172a] rounded-2xl overflow-hidden shadow-2xl border border-white/20 dark:border-white/10">
                
                {/* Close Button */}
                <button 
                    onClick={handleClose}
                    className="absolute top-4 right-4 z-30 p-2 bg-black/5 dark:bg-white/10 text-slate-500 dark:text-slate-400 hover:bg-red-500 hover:text-white rounded-full backdrop-blur-md transition-all duration-300 active:scale-90"
                >
                    <X size={20} />
                </button>

                {/* CLICKABLE AREA */}
                <Link href="/contact" onClick={() => setIsVisible(false)}>
                    <div className="flex flex-col md:flex-row cursor-pointer group/card">
                        
                        {/* ================= LEFT SIDE: GRAPHIC ART ================= */}
                        <div className="w-full md:w-5/12 h-56 md:h-auto bg-[#0A192F] relative overflow-hidden flex items-center justify-center p-6">
                            
                            {/* Optimized Cyber Grid */}
                            <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
                            
                            {/* Abstract Glows */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-teal-500/20 rounded-full blur-[40px] animate-pulse-slow"></div>

                            {/* 3D Icon Composition */}
                            <div className="relative z-10 flex flex-col items-center text-center transform group-hover/card:scale-105 transition-transform duration-500">
                                <div className="relative">
                                    {/* Megaphone Icon inside a glowing circle */}
                                    <div className="w-20 h-20 bg-gradient-to-tr from-teal-400 to-blue-600 rounded-2xl rotate-6 flex items-center justify-center shadow-lg shadow-teal-500/30 relative z-20 border border-white/20">
                                        <Megaphone size={40} className="text-white -rotate-6" />
                                    </div>
                                    {/* Signal Waves */}
                                    <Radio size={32} className="absolute -top-4 -right-6 text-teal-300 animate-ping-slow opacity-70" />
                                </div>
                                <p className="text-teal-200 font-bold text-xs tracking-[0.2em] uppercase mt-6 bg-white/10 px-3 py-1 rounded-full border border-white/10">Help Shape The Future</p>
                            </div>
                        </div>

                        {/* ================= RIGHT SIDE: CONTENT ================= */}
                        <div className="w-full md:w-7/12 p-8 md:p-10 bg-white dark:bg-[#0f172a] relative flex flex-col justify-center">
                            
                            <div className="relative z-10 space-y-4">
                                <div className="inline-flex items-center gap-1.5 text-teal-600 dark:text-teal-400 font-bold text-xs uppercase tracking-wider bg-teal-50 dark:bg-teal-900/30 px-3 py-1 rounded-full w-fit">
                                    <Zap size={14} fill="currentColor" /> Community Focus
                                </div>
                                
                                <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
                                    Your Feedback is our <br/>
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-blue-600 dark:from-teal-400 dark:to-purple-400">Secret Weapon.</span>
                                </h3>
                                
                                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm md:text-base pr-4">
                                    Encountered a glitch? Have a brilliant idea? We're building this directly from user suggestions.
                                </p>

                                <div className="pt-4">
                                    {/* Premium Button */}
                                    <div className="group/btn relative inline-flex w-full md:w-auto overflow-hidden rounded-xl p-[1px] focus:outline-none">
                                        <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#14b8a6_0%,#0f172a_50%,#14b8a6_100%)] dark:bg-[conic-gradient(from_90deg_at_50%_50%,#14b8a6_0%,#ffffff_50%,#14b8a6_100%)]" />
                                        <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-xl bg-slate-950 px-6 py-3 text-sm font-bold text-white backdrop-blur-3xl transition-all group-hover/btn:bg-slate-900 gap-2">
                                          Share Your Thoughts <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform"/>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </Link>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
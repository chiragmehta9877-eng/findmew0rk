'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion'; 
import { X, Coffee, Heart, Sparkles, ArrowRight } from 'lucide-react';

export default function SupportPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    // 🔥 3 Minutes Delay (3 * 60 * 1000 = 180000ms)
    const timer = setTimeout(() => {
        // Agar check karna ho ki user ne pehle close kiya h ya nahi
        // const hasClosed = sessionStorage.getItem('supportBannerSeen');
        // if (!hasClosed) {
            setIsVisible(true);
        // }
    }, 180000); 

    return () => clearTimeout(timer);
  }, []);

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsVisible(false);
    // sessionStorage.setItem('supportBannerSeen', 'true'); 
  };

  if (!isMounted) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-6 right-6 z-[90] w-[90%] md:w-auto max-w-sm"
        >
            {/* Glow Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-2xl blur opacity-30 animate-pulse"></div>

            <div className="relative bg-white dark:bg-[#0f172a] rounded-xl shadow-2xl border border-gray-100 dark:border-white/10 overflow-hidden p-5">
                
                {/* Close Button */}
                <button 
                    onClick={handleClose}
                    className="absolute top-2 right-2 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white bg-transparent hover:bg-slate-100 dark:hover:bg-white/10 rounded-full transition-colors"
                >
                    <X size={16} />
                </button>

                <div className="flex gap-4">
                    {/* Icon Box */}
                    <div className="shrink-0">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 flex items-center justify-center border border-yellow-200 dark:border-yellow-700/30">
                            <Coffee className="text-yellow-600 dark:text-yellow-400" size={24} />
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 pt-1">
                        <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            Enjoying the content? <Sparkles size={14} className="text-yellow-500 fill-yellow-500" />
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                            If this platform helped you find a job, consider fueling our servers (and us) with a coffee!
                        </p>

                        <div className="mt-4 flex items-center gap-3">
                            <Link href="/support" onClick={() => setIsVisible(false)} className="flex-1">
                                <button className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold py-2.5 rounded-lg hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-500/20">
                                    <Heart size={14} className="text-red-500 fill-red-500" /> Buy us a Coffee
                                </button>
                            </Link>
                            <button 
                                onClick={handleClose}
                                className="px-3 py-2.5 text-xs font-bold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white transition-colors"
                            >
                                Later
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
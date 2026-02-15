'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import BuyCoffee from '@/components/BuyCoffee';
import { motion } from 'framer-motion';
import { Server, Code, Heart, Zap, Coffee } from 'lucide-react';

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0A192F] text-slate-900 dark:text-white font-sans transition-colors duration-300">
      <Navbar />

      <main className="container mx-auto px-4 py-16 max-w-6xl">
        
        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-100 border border-yellow-200 text-yellow-700 dark:bg-yellow-900/20 dark:border-yellow-700/30 dark:text-yellow-400 text-xs font-bold uppercase tracking-widest mb-4">
               <Coffee size={14} /> Fuel the Mission
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">
              Keep the <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-blue-600">Engine Running.</span>
            </h1>
           <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto">
  We run real-time crawlers and AI models 24×7.<br />
  Your support keeps the platform fast and reliable.
</p>
          </motion.div>
        </div>

       {/* CENTERED STANDALONE PAYMENT WIDGET */}
        <div className="flex justify-center items-center w-full px-4 py-2 pb-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="w-full max-w-md flex justify-center"
          >
            <div className="relative w-full flex justify-center">
                
                {/* 🔥 MAC OPTIMIZED: Premium Soft Glows with transform-gpu & will-change */}
                <div className="absolute -top-6 -left-4 w-64 h-64 bg-teal-500/30 dark:bg-teal-600/20 rounded-full blur-3xl opacity-70 animate-blob transform-gpu will-change-transform"></div>
                <div className="absolute -top-6 -right-4 w-64 h-64 bg-cyan-500/30 dark:bg-cyan-600/20 rounded-full blur-3xl opacity-70 animate-blob animation-delay-2000 transform-gpu will-change-transform"></div>
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-64 h-64 bg-amber-500/30 dark:bg-amber-500/20 rounded-full blur-3xl opacity-70 animate-blob animation-delay-4000 transform-gpu will-change-transform"></div>
                
                {/* 🔥 MAC OPTIMIZED: Main Widget Wrapper with transform-gpu to prevent paint thrashing */}
                <div className="relative z-10 w-full bg-white dark:bg-slate-900/95 dark:backdrop-blur-sm border border-gray-100 dark:border-amber-500/20 rounded-2xl p-6 md:p-8 shadow-[0_0_40px_rgba(245,158,11,0.05)] dark:shadow-[0_0_50px_rgba(245,158,11,0.08)] hover:shadow-[0_0_50px_rgba(245,158,11,0.1)] dark:hover:shadow-[0_0_70px_rgba(245,158,11,0.15)] transition-all duration-500 text-center transform-gpu">
                    
                    {/* Header with Lucide Coffee Icon */}
                    <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-3 flex items-center justify-center gap-2">
                        <span className="text-yellow-500 dark:text-yellow-400 flex items-center">
                            <Coffee size={24} strokeWidth={2.5} />
                        </span>
                        Buy us a Coffee
                    </h3>
                    
                    {/* Tagline */}
                    <div className="inline-block bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-500/30 px-4 py-2 rounded-full mb-7 mt-1">
                        <p className="text-xs md:text-sm font-bold text-amber-700 dark:text-amber-400 tracking-wide">
                            1 Cup of Coffee = 1 Week of Infrastructure Cost
                        </p>
                    </div>

                    {/* QR Code Section */}
                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-5 mb-6 border border-slate-100 dark:border-amber-500/10 flex flex-col items-center transition-colors group">
                        <div className="p-1 bg-white rounded-xl shadow-sm dark:shadow-amber-500/10 dark:group-hover:shadow-amber-500/30 transition-shadow">
                             <img 
                                 src="/qr-code.png" 
                                 alt="Scan QR to Pay" 
                                 className="w-36 h-36 object-contain rounded-lg pointer-events-none"
                             />
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 uppercase tracking-widest font-bold mt-4">
                            Scan to Pay
                        </p>
                    </div>

                    {/* Secure Checkout Badge */}
                    <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-6 font-medium">
                        <svg className="w-4 h-4 text-emerald-500 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                        </svg>
                        Secure Checkout
                    </div>

                    {/* Action Button */}
                    <a 
                        href="https://buymeacoffee.com/findmew0rk" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full py-4 px-4 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-slate-900 font-extrabold rounded-xl transition-all duration-300 shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 dark:shadow-amber-500/10 dark:hover:shadow-amber-500/30 active:scale-[0.98] text-sm uppercase tracking-wider"
                    >
                        <Coffee size={18} strokeWidth={2.5} /> Support Us
                    </a>

                </div>
            </div>
          </motion.div>
        </div>

        {/* Footer Note */}
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center mt-10 pt-6 border-t border-slate-200 dark:border-white/10"
        >
            <p className="text-slate-500 dark:text-slate-400 text-sm flex items-center justify-center gap-2">
               
                If FindMeWork helped you find real opportunities help keep it running.
            </p>
        </motion.div>

      </main>
    </div>
  );
}

// Small Helper Component for the Cards on the Left
function SupportCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
    return (
        <div className="flex gap-5 p-6 bg-white dark:bg-[#112240] rounded-2xl border border-slate-100 dark:border-white/5 shadow-sm hover:shadow-md transition-shadow">
            <div className="shrink-0 mt-1 p-3 bg-slate-50 dark:bg-black/20 rounded-xl h-fit">
                {icon}
            </div>
            <div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">{title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{desc}</p>
            </div>
        </div>
    );
}
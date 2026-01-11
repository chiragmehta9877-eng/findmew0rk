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
            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
              FindMeWork is built by developers, for developers. Your support helps us cover server costs, API fees, and keeps the platform ad-free.
            </p>
          </motion.div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* LEFT: Why Support Cards */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <SupportCard 
              icon={<Server className="text-blue-500" size={24} />}
              title="Server & Database Costs"
              desc="Running AI models and real-time scrapers 24/7 isn't cheap. Your coffee keeps the lights on."
            />
            <SupportCard 
              icon={<Code className="text-teal-500" size={24} />}
              title="Active Development"
              desc="We ship updates weekly. Your support allows us to dedicate more hours to coding new features."
            />
            <SupportCard 
              icon={<Heart className="text-red-500" size={24} />}
              title="Community First"
              desc="We believe in open access to jobs. No paywalls for applying, ever. Just pure value."
            />
          </motion.div>

          {/* RIGHT: Payment Widget */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex justify-center lg:justify-end"
          >
            <div className="relative w-full max-w-sm">
                {/* Decorative Glow behind the card */}
                <div className="absolute top-0 -left-4 w-72 h-72 bg-teal-500/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-500/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-20 w-72 h-72 bg-yellow-500/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
                
                <div className="relative">
                    <BuyCoffee />
                </div>
            </div>
          </motion.div>

        </div>

        {/* Footer Note */}
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center mt-20 pt-10 border-t border-slate-200 dark:border-white/10"
        >
            <p className="text-slate-500 dark:text-slate-400 text-sm flex items-center justify-center gap-2">
                <Zap size={16} className="text-yellow-500" fill="currentColor"/> 
                Big thanks to everyone who has supported us so far!
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
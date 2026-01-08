'use client';
import React from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Lock, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProtectedOverlay({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const router = useRouter();

  // Loading state mein kuch mat dikhao ya skeleton dikhao
  if (status === "loading") return null;

  // Agar user LOGGED IN hai, toh normal content dikhao
  if (status === "authenticated") {
    return <>{children}</>;
  }

  // Agar user LOGGED OUT hai, toh Blur + Lock Overlay dikhao
  return (
    <div className="relative w-full h-full">
      
      {/* 1. BLURRED CONTENT (Pointer events band taaki click na ho) */}
      <div className="filter blur-xl select-none pointer-events-none opacity-50 overflow-hidden h-screen overflow-y-hidden">
        {children}
      </div>

      {/* 2. LOCK OVERLAY (Iske upar aayega) */}
      <div className="absolute inset-0 z-50 flex flex-col items-center justify-center p-4 top-[20vh]">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative max-w-md w-full"
        >
            {/* Background Glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-teal-500 to-blue-600 rounded-2xl blur opacity-30"></div>
            
            {/* Glass Card */}
            <div className="relative bg-white/90 dark:bg-[#0A192F]/90 backdrop-blur-2xl border border-gray-200 dark:border-white/10 p-8 rounded-2xl shadow-2xl text-center">
              
              <div className="w-16 h-16 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-900 dark:text-white">
                <Lock size={32} />
              </div>

              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Unlock Hidden Jobs
              </h2>
              
              <p className="text-slate-500 dark:text-gray-400 mb-8">
                Join <span className="font-bold text-teal-600 dark:text-teal-400">FindMeWork</span> to view full job details, direct links, and founder contacts.
              </p>

              <button 
                onClick={() => router.push('/login')}
                className="w-full py-3.5 px-6 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-[#0A192F] font-bold text-lg hover:scale-[1.02] active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <Zap size={20} fill="currentColor" /> Login to View
              </button>

              <p className="mt-4 text-xs text-slate-400">
                It takes 10 seconds to create an account.
              </p>
            </div>
        </motion.div>
      </div>

      {/* 3. Bottom Fade (Taaki page abruptly na kate) */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#f8f9fa] dark:from-[#0A192F] to-transparent z-40"></div>
    </div>
  );
}
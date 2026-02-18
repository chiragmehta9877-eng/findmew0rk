'use client';

import React, { useEffect, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation'; // 🔥 URL se redirect pakdne ke liye
import { motion } from 'framer-motion';
import { Zap, ArrowLeft, Chrome } from 'lucide-react';

// 🔥 Main Content Component
function LoginContent() {
  const searchParams = useSearchParams();
  
  // 🚀 MAGIC FIX: Agar URL me 'callbackUrl' hai (jaise /x-jobs), toh wahin wapas bhejo.
  // Nahi toh default '/' (Home) par bhejo.
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  // 🔥 Check Dark Mode on Page Load
  useEffect(() => {
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const handleLogin = (provider: string) => {
    // ✅ Ab ye user ko wapas wahin bhejega jahan se wo aaya tha (jaise x-jobs)
    signIn(provider, { callbackUrl: callbackUrl });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-[#0A192F] relative overflow-hidden font-sans transition-colors duration-300">
      
      {/* --- Background Effects --- */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-teal-500/20 rounded-full blur-[120px] animate-pulse transform-gpu will-change-transform"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] animate-pulse delay-1000 transform-gpu will-change-transform"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md p-8 mx-4"
      >
        <Link href="/" className="absolute -top-12 left-0 flex items-center gap-2 text-slate-500 dark:text-gray-400 hover:text-teal-600 dark:hover:text-white transition-colors text-sm font-medium">
          <ArrowLeft size={16} /> Back to Home
        </Link>

        <div className="bg-white/80 dark:bg-[#112240]/60 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-3xl shadow-2xl p-8 md:p-10">
          
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-teal-500 to-blue-600 text-white shadow-lg shadow-teal-500/30 mb-6">
              <Zap size={28} fill="currentColor" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">Welcome Back</h1>
            <p className="text-slate-500 dark:text-gray-400 text-sm">
              Login to access hidden job opportunities.
            </p>
          </div>

          <div className="space-y-4">
            <button 
              onClick={() => handleLogin('google')}
              className="w-full flex items-center justify-center gap-3 bg-white dark:bg-white/5 text-slate-700 dark:text-white font-bold py-3.5 px-4 rounded-xl border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/10 transition-all transform hover:scale-[1.02] shadow-sm group"
            >
              <Chrome size={20} className="text-red-500 group-hover:text-red-600" />
              <span>Continue with Google</span>
            </button>
          </div>

          <div className="my-8 flex items-center gap-4">
            <div className="h-px bg-gray-200 dark:bg-white/10 flex-1"></div>
            <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">Secure Access</span>
            <div className="h-px bg-gray-200 dark:bg-white/10 flex-1"></div>
          </div>

          <p className="text-center text-xs text-slate-500 dark:text-gray-400 mt-6">
            By continuing, you agree to our{' '}
            <Link 
              href="/privacy-policy" 
              className="font-semibold text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 hover:underline transition-colors"
            >
              Privacy Policy
            </Link>.
          </p>

        </div>
      </motion.div>
    </div>
  );
}

// 🔥 Suspense Wrapper (Next.js 13+ me SearchParams use karne ke liye zaroori hai)
export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#0A192F] text-white">Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}
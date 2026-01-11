'use client';
import React from 'react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { motion } from 'framer-motion';
// 🔥 'Linkedin' import hata diya
import { Zap, ArrowLeft, Chrome } from 'lucide-react';

export default function LoginPage() {
  
  const handleLogin = (provider: string) => {
    signIn(provider, { callbackUrl: '/' });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-[#0A192F] relative overflow-hidden font-sans">
      
      {/* --- Background Effects (Futuristic Glows) --- */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-teal-500/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] animate-pulse delay-1000"></div>
      </div>

      {/* --- Main Card --- */}
      <motion.div 
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md p-8 mx-4"
      >
        {/* Back Button */}
        <Link href="/" className="absolute -top-12 left-0 flex items-center gap-2 text-slate-500 dark:text-gray-400 hover:text-teal-600 dark:hover:text-white transition-colors text-sm font-medium">
          <ArrowLeft size={16} /> Back to Home
        </Link>

        {/* Glass Container */}
        <div className="bg-white/80 dark:bg-[#112240]/60 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-3xl shadow-2xl p-8 md:p-10">
          
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-teal-500 to-blue-600 text-white shadow-lg shadow-teal-500/30 mb-6">
              <Zap size={28} fill="currentColor" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">Welcome Back</h1>
            <p className="text-slate-500 dark:text-gray-400 text-sm">
              Login to access hidden job opportunities.
            </p>
          </div>

          {/* Login Buttons */}
          <div className="space-y-4">
            
            {/* Google Button */}
            <button 
              onClick={() => handleLogin('google')}
              className="w-full flex items-center justify-center gap-3 bg-white dark:bg-white text-slate-700 font-bold py-3.5 px-4 rounded-xl border border-gray-200 hover:bg-gray-50 transition-all transform hover:scale-[1.02] shadow-sm group"
            >
              <Chrome size={20} className="text-red-500 group-hover:text-red-600" />
              <span>Continue with Google</span>
            </button>

            {/* 🔥 LinkedIn Button Removed Here */}

          </div>

          {/* Divider */}
          <div className="my-8 flex items-center gap-4">
            <div className="h-px bg-gray-200 dark:bg-white/10 flex-1"></div>
            <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">Secure Access</span>
            <div className="h-px bg-gray-200 dark:bg-white/10 flex-1"></div>
          </div>

          {/* Footer Text */}
          <p className="text-center text-xs text-slate-400 dark:text-gray-500">
            By continuing, you agree to our <span className="underline cursor-pointer hover:text-teal-500">Terms</span> and <span className="underline cursor-pointer hover:text-teal-500">Privacy Policy</span>.
          </p>

        </div>
      </motion.div>
    </div>
  );
}
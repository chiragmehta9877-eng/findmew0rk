'use client';

import React from 'react';
import { LayoutDashboard, Chrome, ArrowLeft } from 'lucide-react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';

export default function AuthPopup() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-50/60 dark:bg-[#0B1120]/60 backdrop-blur-xl transition-all duration-300">
      
      {/* ✨ Modal Container */}
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-gray-200 dark:border-white/10 bg-white/90 dark:bg-[#0F172A]/90 shadow-2xl animate-in zoom-in-95 duration-300">
        
        {/* Decorative Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-teal-500/10 dark:bg-teal-500/20 blur-[60px] rounded-full pointer-events-none"></div>

        <div className="relative z-10 p-8 flex flex-col items-center text-center">
          
          {/* Icon - Friendly Dashboard Icon instead of Shield */}
          <div className="mb-6 p-4 rounded-full bg-teal-50 dark:bg-teal-500/10 border border-teal-100 dark:border-teal-500/20 shadow-sm">
             <LayoutDashboard size={32} className="text-teal-600 dark:text-teal-400" />
          </div>

          {/* Professional Headline */}
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-3 tracking-tight">
            Access Your Dashboard
          </h2>
          
          {/* Value Proposition Text */}
          <p className="text-slate-600 dark:text-slate-400 mb-8 text-sm leading-relaxed max-w-xs mx-auto">
            Login to save interesting jobs, track your applications, and manage your professional profile in one place.
          </p>

          {/* Login Button */}
          <button
            onClick={() => signIn('google')}
            className="w-full py-3.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-sm shadow-lg shadow-slate-200/50 dark:shadow-none hover:opacity-90 transition-all transform hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2.5 mb-5"
          >
            <Chrome size={18} className="text-current" />
            Continue with Google
          </button>

          {/* Back to Home */}
          <Link 
            href="/"
            className="text-slate-400 dark:text-slate-500 text-xs font-semibold hover:text-slate-700 dark:hover:text-slate-300 flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft size={14} /> Back to Home Page
          </Link>

        </div>
      </div>
    </div>
  );
}
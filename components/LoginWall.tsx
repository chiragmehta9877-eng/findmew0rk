'use client';

import React from 'react';
import { Lock } from 'lucide-react';
import { signIn } from 'next-auth/react';

export default function LoginWall() {
  return (
    <div className="relative w-full py-20 mt-6 mb-12 overflow-hidden rounded-3xl border border-gray-200 dark:border-emerald-500/30 bg-white/80 dark:bg-[#0B1120]/90 backdrop-blur-xl flex flex-col items-center justify-center text-center shadow-2xl shadow-gray-200/50 dark:shadow-[0_0_50px_-12px_rgba(16,185,129,0.2)]">
      
      {/* ✨ Top Spotlight Glow Effect */}
      <div className="absolute top-[-50%] left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/10 dark:bg-emerald-500/20 blur-[100px] rounded-full pointer-events-none"></div>
      
      {/* ✨ Bottom Subtle Gradient */}
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-emerald-50/50 dark:from-emerald-900/10 to-transparent pointer-events-none"></div>

      <div className="relative z-10 flex flex-col items-center gap-5 px-6 animate-in fade-in zoom-in duration-500">
        
        {/* 🔒 Lock Icon with Intense Glow */}
        <div className="relative group">
            {/* Glow behind icon */}
            <div className="absolute inset-0 bg-emerald-400/30 dark:bg-emerald-500/40 blur-2xl rounded-full group-hover:bg-emerald-400/50 transition-all duration-500"></div>
            
            <div className="relative p-5 rounded-full bg-white dark:bg-[#0F172A] border border-emerald-100 dark:border-emerald-500/30 shadow-xl shadow-emerald-200/50 dark:shadow-none">
               <Lock size={36} className="text-emerald-600 dark:text-emerald-400" />
            </div>
        </div>

        <div className="space-y-2">
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Unlock Unlimited Jobs
            </h3>
            <p className="text-slate-600 dark:text-slate-300 max-w-md text-base leading-relaxed">
            You've viewed your free preview limit. Login to access hundreds of hidden opportunities posted directly by founders.
            </p>
        </div>

        <button
          onClick={() => signIn('google')}
          className="mt-4 px-10 py-4 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-lg shadow-xl shadow-emerald-500/20 dark:shadow-emerald-500/40 transition-all transform hover:-translate-y-1 active:scale-95 flex items-center gap-2 border border-emerald-400/20"
        >
          Login with Google
        </button>
        
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-widest mt-2">
            No Fees. No Limits.
        </p>
      </div>
    </div>
  );
}
'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signIn, signOut } from "next-auth/react";
import { Menu, X, Zap, Linkedin, Twitter, Sun, Moon, Info, LogOut, User } from 'lucide-react';

export default function Navbar() {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
      setIsDark(true);
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 dark:bg-[#0A192F]/90 backdrop-blur-md border-b border-gray-200 dark:border-white/10 transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* LOGO */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white shadow-lg shadow-teal-500/30 group-hover:scale-105 transition-transform">
              <Zap size={18} fill="currentColor" />
            </div>
            <span className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              FindMeWork
            </span>
          </Link>

          {/* DESKTOP LINKS */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm font-medium text-slate-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors">Home</Link>
            <Link href="/linkedin-jobs" className="text-sm font-medium text-slate-600 dark:text-gray-300 hover:text-[#0a66c2] transition-colors flex items-center gap-1.5"><Linkedin size={16} /> LinkedIn Feeds</Link>
            <Link href="/twitter-jobs" className="text-sm font-medium text-slate-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors flex items-center gap-1.5"><Twitter size={16} /> Twitter Feeds</Link>
            <Link href="/about" className="text-sm font-medium text-slate-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors flex items-center gap-1.5"><Info size={16} /> About Us</Link>
          </div>

          {/* RIGHT SIDE (Desktop) */}
          <div className="hidden md:flex items-center gap-4">
            <button onClick={toggleTheme} className="p-2 rounded-lg bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-yellow-400 hover:bg-slate-200 dark:hover:bg-white/20 transition-colors">
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {status === "authenticated" ? (
              <div className="flex items-center gap-3">
                 <div className="text-right hidden lg:block">
                    <p className="text-xs text-slate-500 dark:text-gray-400">Welcome,</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{session.user?.name}</p>
                 </div>
                 {session.user?.image ? (
                   <img src={session.user.image} alt="User" className="w-9 h-9 rounded-full border border-gray-200 dark:border-white/10" />
                 ) : (
                   <div className="w-9 h-9 rounded-full bg-teal-600 flex items-center justify-center text-white"><User size={18}/></div>
                 )}
                 <button onClick={() => signOut()} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" title="Logout">
                   <LogOut size={20} />
                 </button>
              </div>
            ) : (
              <button onClick={() => signIn()} className="bg-slate-900 dark:bg-white text-white dark:text-[#0A192F] px-5 py-2 rounded-lg text-sm font-bold hover:opacity-90 transition-opacity shadow-md">
                Get Started
              </button>
            )}
          </div>

          {/* MOBILE MENU TOGGLE */}
          <div className="md:hidden flex items-center gap-4">
             <button onClick={toggleTheme} className="p-2 rounded-lg bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-yellow-400">
               {isDark ? <Sun size={20} /> : <Moon size={20} />}
             </button>
             <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-slate-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg transition-colors">
               {isOpen ? <X size={24} /> : <Menu size={24} />}
             </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU DROPDOWN */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-[#0A192F] border-b border-gray-200 dark:border-white/10 shadow-xl">
          <div className="px-4 pt-2 pb-6 space-y-2">
            <Link href="/" onClick={() => setIsOpen(false)} className="block px-4 py-3 rounded-lg text-base font-medium text-slate-700 dark:text-gray-200 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-teal-600">Home</Link>
            <Link href="/linkedin-jobs" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium text-slate-700 dark:text-gray-200 hover:bg-slate-50 dark:hover:bg-white/5"><Linkedin size={18} /> LinkedIn Feeds</Link>
            <Link href="/twitter-jobs" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium text-slate-700 dark:text-gray-200 hover:bg-slate-50 dark:hover:bg-white/5"><Twitter size={18} /> Twitter Feeds</Link>
            <Link href="/about" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium text-slate-700 dark:text-gray-200 hover:bg-slate-50 dark:hover:bg-white/5"><Info size={18} /> About Us</Link>

            <div className="pt-4 mt-2 border-t border-gray-100 dark:border-white/5">
               {status === "authenticated" ? (
                 <>
                   {/* 🔥 MOBILE PROFILE SECTION */}
                   <div className="flex items-center gap-3 px-2 mb-4">
                      {session.user?.image ? (
                        <img src={session.user.image} alt="User" className="w-10 h-10 rounded-full border border-gray-200 dark:border-white/10" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-teal-600 flex items-center justify-center text-white"><User size={20}/></div>
                      )}
                      <div>
                        <p className="text-xs text-slate-500 dark:text-gray-400 font-medium">Signed in as</p>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">{session.user?.name}</p>
                      </div>
                   </div>
                   
                   <button onClick={() => signOut()} className="w-full bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500 hover:text-white py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2">
                     <LogOut size={18} /> Sign Out
                   </button>
                 </>
               ) : (
                 <button onClick={() => signIn()} className="w-full bg-teal-600 text-white py-3 rounded-xl font-bold shadow-lg shadow-teal-500/20">Get Started / Login</button>
               )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
'use client';
import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useSession, signIn, signOut } from "next-auth/react";
import { Menu, Zap, Sun, Moon, Info, LogOut, User, LayoutDashboard, MessageSquare, GraduationCap, Coffee, X as CloseIcon } from 'lucide-react';

const XLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export default function Navbar() {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [completion, setCompletion] = useState(20);

  useEffect(() => {
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // 🔥 CORE FUNCTION: Strict Sync with Dashboard
  const fetchAndCalculateProfile = useCallback(() => {
    if (status === 'authenticated' && session?.user?.email) {
      fetch(`/api/auth/sync?t=${Date.now()}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: session.user.email })
      })
      .then(res => res.json())
      .then(data => {
          if(data.success && data.user) {
             const user = data.user;
             const isFilled = (val: string | undefined | null) => val && val.trim().length > 0;
             let score = 20; 
             if(isFilled(user.headline)) score += 15;
             if(isFilled(user.location)) score += 10;
             if(isFilled(user.lookingFor)) score += 15;
             if(isFilled(user.linkedin)) score += 15;
             if(isFilled(user.x_handle)) score += 15;
             if(isFilled(user.instagram)) score += 10;
             setCompletion(Math.min(score, 100));
          }
      })
      .catch(err => console.error("❌ Sync Failed:", err));
    }
  }, [session, status]);

  useEffect(() => {
    fetchAndCalculateProfile();
    const onFocus = () => fetchAndCalculateProfile();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [fetchAndCalculateProfile]);

  useEffect(() => {
    const handleProfileUpdate = () => {
        console.log("🔄 Navbar updating...");
        setTimeout(() => fetchAndCalculateProfile(), 500);
    };
    window.addEventListener('profileUpdated', handleProfileUpdate);
    return () => window.removeEventListener('profileUpdated', handleProfileUpdate);
  }, [fetchAndCalculateProfile]);

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
    <nav className="sticky top-0 z-50 w-full bg-white dark:bg-[#0A192F] border-b border-gray-200 dark:border-white/10 transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* LOGO */}
          <Link href="/" className="flex items-center gap-2.5 group select-none">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-teal-600 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-teal-500/30 group-hover:rotate-12 transition-transform duration-300">
              <Zap size={18} fill="currentColor" />
            </div>
            <span className="text-xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center">
              FindMeW
              <span className="relative flex items-center justify-center w-6 h-6 mx-[1px] group-hover:scale-110 transition-transform duration-300">
                  <span className="absolute inset-0 border-[2.5px] border-teal-500 rounded-full opacity-90"></span>
                  <GraduationCap 
                    size={14} 
                    className="text-teal-600 dark:text-teal-400 relative z-10 -mt-0.5 -ml-[0.5px] group-hover:-rotate-12 transition-transform duration-300" 
                    strokeWidth={2.5} 
                    fill="currentColor"
                    fillOpacity={0.2} 
                  />
              </span>
              rk
            </span>
          </Link>

        {/* DESKTOP LINKS - CENTER LOCKED */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <Link href="/" className="text-sm font-medium text-slate-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
              Home
            </Link>
            <Link href="/x-jobs" className="text-sm font-medium text-slate-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors flex items-center gap-1.5">
                <XLogo className="w-4 h-4" /> Feeds
            </Link>
            <Link href="/contact" className="text-sm font-medium text-slate-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors flex items-center gap-1.5">
              <MessageSquare size={16} /> Contact Us
            </Link>
          </div>
          
          {/* RIGHT SIDE */}
          <div className="hidden md:flex items-center gap-4">
            <Link 
              href="/support" 
              className="p-2 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-100 dark:hover:bg-yellow-900/40 transition-colors border border-yellow-200 dark:border-yellow-700/30"
              title="Buy me a coffee"
            >
              <Coffee size={20} />
            </Link>

            <button onClick={toggleTheme} className="p-2 rounded-lg bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-yellow-400 hover:bg-slate-200 dark:hover:bg-white/20 transition-colors">
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {status === "authenticated" ? (
              <div className="flex items-center gap-3">
                  <Link href="/dashboard" className="hidden lg:flex items-center gap-1 bg-purple-50 text-purple-600 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-purple-100 transition-colors">
                      <LayoutDashboard size={14}/> Dashboard
                  </Link>

                  <div className="text-right hidden lg:block">
                      <p className="text-xs text-slate-500 dark:text-gray-400">Welcome,</p>
                      <p className="text-sm font-bold text-slate-900 dark:text-white max-w-[100px] truncate">{session.user?.name}</p>
                  </div>
                  
                  {/* 🔥 PROFILE PICTURE NOW LINKS TO DASHBOARD */}
                  <Link href="/dashboard" className="relative group cursor-pointer block">
                    <div 
                        className="absolute -inset-[3px] rounded-full z-0 transition-all duration-500"
                        style={{
                            background: `conic-gradient(from 0deg, #14b8a6 ${completion}%, ${isDark ? '#334155' : '#e2e8f0'} 0deg)`
                        }}
                    ></div>
                    <div className="relative z-10 bg-white dark:bg-[#0A192F] p-[2px] rounded-full hover:scale-105 transition-transform">
                        {session.user?.image ? (
                            <img src={session.user.image} alt="User" className="w-9 h-9 rounded-full object-cover" />
                        ) : (
                            <div className="w-9 h-9 rounded-full bg-teal-600 flex items-center justify-center text-white"><User size={18}/></div>
                        )}
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-slate-900 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full border border-white dark:border-slate-800 shadow-sm z-20">
                        {completion}%
                    </div>
                  </Link>
                  
                  <button onClick={() => signOut()} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors ml-1" title="Logout">
                    <LogOut size={20} />
                  </button>
              </div>
            ) : (
              <button onClick={() => signIn()} className="bg-slate-900 dark:bg-white text-white dark:text-[#0A192F] px-5 py-2 rounded-lg text-sm font-bold hover:opacity-90 transition-opacity shadow-md">
                Get Started
              </button>
            )}
          </div>

          {/* MOBILE TOGGLE */}
          <div className="md:hidden flex items-center gap-4">
              <Link href="/support" className="p-2 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-700/30"><Coffee size={20} /></Link>
              <button onClick={toggleTheme} className="p-2 rounded-lg bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-yellow-400">
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-slate-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg transition-colors">
                {isOpen ? <CloseIcon size={24} /> : <Menu size={24} />}
              </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-[#0A192F] border-b border-gray-200 dark:border-white/10 shadow-xl animate-in slide-in-from-top-5 duration-200">
          <div className="px-4 pt-2 pb-6 space-y-2">
            <Link href="/" onClick={() => setIsOpen(false)} className="block px-4 py-3 rounded-lg text-base font-medium text-slate-700 dark:text-gray-200 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-teal-600">Home</Link>
            <Link href="/x-jobs" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium text-slate-700 dark:text-gray-200 hover:bg-slate-50 dark:hover:bg-white/5"><XLogo className="w-5 h-5" /> Feeds</Link>
            <Link href="/contact" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium text-slate-700 dark:text-gray-200 hover:bg-slate-50 dark:hover:bg-white/5"><MessageSquare size={18} /> Contact Us</Link>
            <Link href="/about" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium text-slate-700 dark:text-gray-200 hover:bg-slate-50 dark:hover:bg-white/5"><Info size={18} /> About Us</Link>
            <Link href="/support" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium text-yellow-700 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/10 hover:bg-yellow-100"><Coffee size={18} /> Buy me a Coffee</Link>

            <div className="pt-4 mt-2 border-t border-gray-100 dark:border-white/5">
               {status === "authenticated" ? (
                 <>
                   {/* 🔥 MOBILE PROFILE ALSO LINKS TO DASHBOARD */}
                   <Link href="/dashboard" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-2 mb-4 group cursor-pointer">
                     <div className="relative">
                         <div className="absolute -inset-[2px] rounded-full z-0" style={{ background: `conic-gradient(from 0deg, #14b8a6 ${completion}%, ${isDark ? '#334155' : '#e2e8f0'} 0deg)` }}></div>
                         <div className="relative z-10 bg-white dark:bg-[#0A192F] p-[2px] rounded-full group-hover:scale-105 transition-transform">
                             {session.user?.image ? (
                               <img src={session.user.image} alt="User" className="w-10 h-10 rounded-full object-cover" />
                             ) : (
                               <div className="w-10 h-10 rounded-full bg-teal-600 flex items-center justify-center text-white"><User size={20}/></div>
                             )}
                         </div>
                     </div>
                     <div>
                       <p className="text-xs text-slate-500 dark:text-gray-400 font-medium">Signed in as</p>
                       <p className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                           {session.user?.name} 
                           <span className="text-[10px] bg-teal-100 text-teal-700 px-1.5 rounded-md">{completion}% complete</span>
                       </p>
                     </div>
                   </Link>
                   
                   <Link href="/dashboard" onClick={() => setIsOpen(false)} className="flex items-center justify-center gap-2 w-full bg-purple-50 text-purple-700 py-3 rounded-xl font-bold mb-3 hover:bg-purple-100 transition-colors">
                      <LayoutDashboard size={18} /> Go to Dashboard
                   </Link>
                   <button onClick={() => signOut()} className="w-full bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-50 hover:text-white py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2">
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
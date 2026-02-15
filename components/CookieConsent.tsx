'use client';
import { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import { BiCookie } from 'react-icons/bi';

export default function CookieConsent() {
  // 1. 'isVisible' controls if the component is in the DOM
  const [isVisible, setIsVisible] = useState(false);
  // 2. 'animate' controls the CSS transition (opacity/slide)
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    // Check localStorage
    const consent = localStorage.getItem('cookieConsent');
    
    if (!consent) {
      setIsVisible(true);
      // Thoda delay taaki browser render kar le, fir animation trigger kare
      setTimeout(() => setAnimate(true), 100);
    }
  }, []);

  const handleResponse = (accepted: boolean) => {
    // 1. Save logic
    localStorage.setItem('cookieConsent', String(accepted));
    
    // 🔥 LOCATION BLOCK LOGIC: Emit event so other components know immediately
    window.dispatchEvent(new CustomEvent('cookieConsentChanged', { detail: accepted }));
    
    // Agar user ne reject kiya hai, toh location ka data turant clear kar do
    if (!accepted) {
      localStorage.removeItem('userLocation');
      sessionStorage.removeItem('userLocation');
    }

    // 2. Animate Out (Smoothly disappear)
    setAnimate(false);
    
    // 3. Remove from DOM after animation finishes (500ms match CSS duration)
    setTimeout(() => {
      setIsVisible(false);
    }, 500);
  };

  if (!isVisible) return null;

  return (
    <div 
      className={`
        fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:w-[420px] z-[100]
        transition-all duration-700 cubic-bezier(0.175, 0.885, 0.32, 1.275) transform
        ${animate ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-20 opacity-0 scale-95'}
      `}
    >
      {/* CARD DESIGN (Added dark mode support) */}
      <div className="bg-white/90 dark:bg-[#112240]/95 backdrop-blur-md border border-purple-100 dark:border-white/10 rounded-[2rem] shadow-2xl shadow-purple-900/10 dark:shadow-black/50 p-6 relative overflow-hidden">
        
        {/* Decorative Blob */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-200/30 dark:bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Close Button */}
        <button 
          onClick={() => handleResponse(false)} 
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-white bg-white dark:bg-transparent hover:bg-gray-50 dark:hover:bg-white/5 p-1.5 rounded-full transition-all border border-transparent hover:border-gray-100 dark:hover:border-white/10"
        >
          <FiX size={18} />
        </button>

        {/* Content Section */}
        <div className="flex items-start gap-4 mb-6">
          {/* 🔥 ICON CHOTA KIYA (Size aur Padding kam kar di) */}
          <div className="p-3 bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 rounded-xl shrink-0 shadow-inner">
            <BiCookie size={22} />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-slate-800 dark:text-white tracking-tight">Cookies & Privacy</h3>
            <p className="text-sm text-slate-600 dark:text-gray-300 mt-2 leading-relaxed font-medium">
              We use cookies to ensure you get the best experience on our website. 🍪
            </p>
          </div>
        </div>

        {/* Buttons Section */}
        <div className="flex flex-col sm:flex-row gap-3 mt-2">
          <button 
            onClick={() => handleResponse(false)}
            className="flex-1 px-6 py-3 rounded-xl border-2 border-slate-200 dark:border-white/10 text-slate-600 dark:text-gray-300 font-bold text-sm hover:bg-slate-50 dark:hover:bg-white/5 hover:border-slate-300 dark:hover:border-white/20 transition-all"
          >
            Decline
          </button>
          
          <button 
            onClick={() => handleResponse(true)}
            className="flex-1 px-6 py-3 rounded-xl bg-slate-900 dark:bg-teal-600 text-white font-bold text-sm hover:bg-slate-800 dark:hover:bg-teal-500 transition-all shadow-lg shadow-slate-900/20 dark:shadow-teal-900/20 active:scale-95"
          >
            Accept All
          </button>
        </div>
        {/* Link */}
        <div className="mt-5 text-center">
            <a href="/privacy-policy" className="text-xs text-slate-500 font-medium hover:text-purple-600 transition-colors border-b border-slate-200 hover:border-purple-300 pb-0.5">
              Read our Privacy Policy
            </a>
        </div>

      </div>
    </div>
  );
}
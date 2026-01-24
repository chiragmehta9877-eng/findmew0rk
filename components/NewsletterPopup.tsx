'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { X, Mail, Briefcase, ArrowRight, CheckCircle2, ShieldCheck, Lock } from 'lucide-react';

export default function NewsletterPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [preference, setPreference] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  useEffect(() => {
    // 🔥 1 Minute Timer (60,000 ms)
    const timer = setTimeout(() => {
      const hasSeen = sessionStorage.getItem('newsletterSeen');
      if (!hasSeen) {
        setIsVisible(true);
      }
    }, 60000); 

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    sessionStorage.setItem('newsletterSeen', 'true');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !preference || !agreed) return;

    setStatus('loading');

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, preference }), 
      });

      if (res.ok) {
        setStatus('success');
        setTimeout(() => {
          handleClose();
          setStatus('idle');
        }, 3000);
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-slate-900/60 backdrop-blur-sm"
        >
          {/* ✨ CARD CONTAINER */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative w-full max-w-4xl flex flex-col md:flex-row overflow-hidden rounded-2xl bg-white shadow-2xl shadow-slate-200/50"
          >
            
            {/* CLOSE BUTTON */}
            <button 
              onClick={handleClose}
              className="absolute top-4 right-4 z-20 p-2 text-slate-400 hover:text-slate-600 bg-white hover:bg-slate-100 rounded-full transition-colors border border-slate-100 shadow-sm"
            >
              <X size={20} />
            </button>

            {/* ================= LEFT SIDE: IMAGE (Desktop Only) ================= */}
            <div className="hidden md:flex md:w-5/12 relative bg-slate-50 overflow-hidden items-center justify-center">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-center"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent"></div>
                
                <div className="relative z-10 p-8 text-left bottom-0 w-full mt-auto">
                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-semibold mb-3 border border-white/20">
                        <Lock size={12} /> Privacy First
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2 leading-tight">Your Next Role <br/> is Waiting.</h3>
                    <p className="text-slate-300 text-sm opacity-90">Let opportunities find you while you sleep.</p>
                </div>
            </div>

            {/* ================= RIGHT SIDE: FORM ================= */}
            <div className="w-full md:w-7/12 p-6 md:p-12 flex flex-col justify-center bg-white relative">
              
              <div className="mb-6 md:mb-8">
                <div className="inline-block md:hidden mb-3 text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  🚀 Get Notified
                </div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-2 tracking-tight leading-tight">
                  Never Miss a <span className="text-indigo-600">Hidden Gem.</span>
                </h2>
                <p className="text-slate-500 text-sm md:text-base leading-relaxed">
                  Get personalized job alerts delivered straight to your inbox. No spam, just relevant opportunities.
                </p>
              </div>

              {status === 'success' ? (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-green-50 border border-green-100 rounded-xl p-6 text-center"
                >
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-slate-900 font-bold text-lg">You're on the list! 🎉</h3>
                  <p className="text-slate-500 text-sm">Keep an eye on your inbox.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
                  
                  {/* Job Preference */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5 ml-1">Dream Role</label>
                    <div className="relative group">
                        <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                        <input 
                        type="text" 
                        placeholder="e.g. React Developer" 
                        value={preference}
                        onChange={(e) => setPreference(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-11 pr-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium text-sm md:text-base"
                        required
                        />
                    </div>
                  </div>

                  {/* Email Input */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5 ml-1">Email Address</label>
                    <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                        <input 
                        type="email" 
                        placeholder="you@example.com" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-11 pr-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium text-sm md:text-base"
                        required
                        />
                    </div>
                  </div>

                  {/* ✅ Privacy Checkbox (Opens in New Tab) */}
                  <div className="flex items-start gap-3 mt-2">
                    <div className="relative flex items-center">
                      <input 
                        type="checkbox" 
                        id="privacy-check"
                        checked={agreed}
                        onChange={(e) => setAgreed(e.target.checked)}
                        className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-slate-300 transition-all checked:border-indigo-600 checked:bg-indigo-600 hover:border-indigo-500"
                      />
                      <span className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                      </span>
                    </div>
                    <label htmlFor="privacy-check" className="text-xs text-slate-500 cursor-pointer select-none leading-relaxed">
                      I agree to the <Link href="/privacy-policy" target="_blank" className="text-indigo-600 underline hover:text-indigo-700 font-medium" onClick={(e) => e.stopPropagation()}>Privacy Policy</Link> and consent to receive job alerts.
                    </label>
                  </div>

                  {/* BUTTON */}
                  <button 
                    type="submit"
                    disabled={status === 'loading' || !agreed}
                    className="w-full bg-slate-900 hover:bg-indigo-600 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-slate-900/20 hover:shadow-indigo-600/30 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm uppercase tracking-wide"
                  >
                     {status === 'loading' ? 'Processing...' : 'Get Daily Alerts'}
                     {!status.includes('loading') && <ArrowRight size={16} />}
                  </button>
                  
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
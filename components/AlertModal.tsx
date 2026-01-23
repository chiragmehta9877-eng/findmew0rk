'use client';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom'; 
import { X, Bell, CheckCircle, Loader, Mail, Briefcase, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// 🔥 1. Yahan 'onSuccess' add kiya hai interface me
interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void; 
}

export default function AlertModal({ isOpen, onClose, onSuccess }: AlertModalProps) {
  const [email, setEmail] = useState('');
  const [preference, setPreference] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
        setStatus('idle');
        setErrorMessage('');
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [isOpen]);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, preference })
      });
      const data = await res.json();
      
      if (data.success) {
        setStatus('success');
        
        // 🔥 2. Yahan Page ko signal bhej rahe hain ki "Ho Gaya!"
        if (onSuccess) {
            onSuccess();
        }

        setTimeout(() => {
           onClose();
           setEmail('');
           setPreference('');
           setStatus('idle');
        }, 2500);
      } else {
        setStatus('error');
        setErrorMessage(data.error || "Subscription failed. Please try again.");
      }
    } catch (error) {
        setStatus('error');
        setErrorMessage("Network error. Please check your connection.");
    }
    setLoading(false);
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 font-sans">
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-all"
          />

          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-white/20 ring-1 ring-black/5"
          >
            
            <button 
                onClick={onClose} 
                className="absolute top-4 right-4 p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white transition-all z-10"
            >
              <X size={18} />
            </button>

            <div className="p-8">
              
              {status === 'success' ? (
                <div className="py-8 flex flex-col items-center text-center animate-in zoom-in duration-300">
                  <div className="w-20 h-20 bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-green-500/20">
                    <CheckCircle size={40} className="animate-bounce" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">You're Subscribed! 🎉</h2>
                  <p className="text-slate-500 dark:text-slate-400">
                    We'll email you as soon as we find <b>{preference}</b> jobs.
                  </p>
                </div>
              ) : (
                <>
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-teal-100 dark:bg-teal-900/40 text-teal-600 dark:text-teal-400 rounded-2xl mb-4 shadow-lg shadow-teal-500/20">
                      <Bell size={28} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Never Miss a Job</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">
                      Get instant alerts for hidden opportunities sent directly to your inbox.
                    </p>
                  </div>

                  <form onSubmit={handleSubscribe} className="space-y-5">
                    
                    <div className="group">
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 ml-1">
                        Looking For
                      </label>
                      <div className="relative">
                        <div className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-teal-500 transition-colors">
                            <Briefcase size={20} />
                        </div>
                        <input 
                          type="text" 
                          placeholder="e.g. React Developer, Founder's Office" 
                          value={preference}
                          onChange={(e) => setPreference(e.target.value)}
                          className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 transition-all text-slate-800 dark:text-white placeholder:text-slate-400 font-medium"
                          required
                        />
                      </div>
                    </div>

                    <div className="group">
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 ml-1">
                        Your Email
                      </label>
                      <div className="relative">
                        <div className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-teal-500 transition-colors">
                            <Mail size={20} />
                        </div>
                        <input 
                          type="email" 
                          placeholder="you@example.com" 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 transition-all text-slate-800 dark:text-white placeholder:text-slate-400 font-medium"
                          required
                        />
                      </div>
                    </div>

                    {status === 'error' && (
                        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-lg text-red-600 dark:text-red-300 text-xs font-medium text-center animate-pulse">
                            {errorMessage}
                        </div>
                    )}

                    <button 
                      type="submit" 
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-teal-500/30 active:scale-[0.98] transition-all flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group"
                    >
                      {loading ? (
                        <Loader className="animate-spin" size={20} />
                      ) : (
                        <>
                          Activate Alerts <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </button>
                  </form>

                  <p className="text-[10px] text-slate-400 text-center mt-6">
                    No spam ever. Unsubscribe with 1-click.
                  </p>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
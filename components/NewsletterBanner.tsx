'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Mail, Briefcase, ArrowRight, CheckCircle2, Zap } from 'lucide-react';

export default function NewsletterBanner() {
  const [email, setEmail] = useState('');
  const [preference, setPreference] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !preference) return;

    setStatus('loading');

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, preference }),
      });

      if (res.ok) {
        setStatus('success');
        setEmail('');
        setPreference('');
        setTimeout(() => setStatus('idle'), 5000);
      } else {
        console.error("Subscription failed");
        setStatus('error');
        setTimeout(() => setStatus('idle'), 3000);
      }
    } catch (error) {
      console.error(error);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <section className="py-12 lg:py-24 relative z-20 overflow-visible bg-gray-50">
      <div className="container mx-auto px-4 md:px-8 relative">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          // 🔥 Mobile Padding Reduced: px-6 py-8 for mobile, larger for desktop
          className="relative bg-gradient-to-r from-teal-900 via-slate-900 to-blue-900 rounded-[2rem] lg:rounded-[2.5rem] shadow-2xl border border-white/10 overflow-visible"
        >
          
          <div className="absolute top-0 left-1/4 w-1/2 h-1 bg-gradient-to-r from-transparent via-teal-400 to-transparent opacity-50 blur-sm"></div>

          {/* DESKTOP IMAGE (Hidden on Mobile) */}
          <div className="hidden lg:block absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-[850px] h-[700px] z-10 pointer-events-none">
            <Image
              src="/girl.findmew0rk.png"
              alt="Job Hunter"
              fill
              className="object-contain object-bottom drop-shadow-[0_20px_50px_rgba(0,0,0,0.6)]"
              priority
              sizes="(max-width: 768px) 100vw, 850px"
            />
          </div>

          <div className="flex flex-col lg:flex-row items-center justify-between px-6 py-10 lg:px-12 lg:py-20 relative z-20">

            {/* 1. LEFT TEXT */}
            <div className="w-full lg:w-4/12 text-center lg:text-left relative z-30">
              <div className="inline-flex items-center gap-2 bg-teal-500/20 text-teal-300 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-4 border border-teal-500/20 shadow-lg shadow-teal-500/10">
                <Zap size={12} className="fill-current" /> Daily Drops
              </div>
              
              {/* Responsive Text Size */}
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-[1.1] mb-3">
                Don't Miss the <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-400">Next Big Move.</span>
              </h2>
              
              <p className="text-slate-400 text-sm leading-relaxed max-w-sm mx-auto lg:mx-0 mb-6 lg:mb-0">
                Get the top 1% of hidden job opportunities delivered straight to your inbox every morning.
              </p>
            </div>

            {/* SPACER (Desktop Only) */}
            <div className="hidden lg:block lg:w-4/12 h-10"></div>

            {/* 🔥 2. MOBILE IMAGE (Visible only on Mobile - Centered between Text & Form) */}
            {/* Logic: Height fixed, negative margin bottom to pull form UP over the image */}
            <div className="lg:hidden relative w-full h-[220px] z-10 pointer-events-none -mb-12">
               <Image
                  src="/girl.findmew0rk.png"
                  alt="Job Hunter"
                  fill
                  className="object-contain object-bottom drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]"
               />
            </div>

            {/* 3. RIGHT FORM */}
            <div className="w-full lg:w-4/12 relative z-30">
              {status === 'success' ? (
                // Added backdrop-blur-xl specifically for mobile layering look
                <div className="bg-teal-500/20 border border-teal-400/30 rounded-2xl p-8 text-center backdrop-blur-xl h-[280px] flex flex-col justify-center items-center shadow-2xl">
                  <CheckCircle2 className="w-12 h-12 text-teal-300 mx-auto mb-4" />
                  <h3 className="text-white font-bold text-2xl">You're on the list! 🚀</h3>
                  <p className="text-teal-200/80 mt-2 text-sm">Check your inbox soon.</p>
                </div>
              ) : (
                // 🔥 Added backdrop-blur-xl to glassmorphism so the girl behind looks blurred nicely
                <form onSubmit={handleSubmit} className="bg-slate-900/40 lg:bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-xl shadow-2xl flex flex-col gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 ml-1 uppercase mb-1.5 block tracking-wider">Your Target</label>
                    <div className="relative group">
                        <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-teal-400 transition-colors" size={18} />
                        <input
                          type="text"
                          placeholder="e.g. Founder, React Dev"
                          value={preference}
                          onChange={(e) => setPreference(e.target.value)}
                          className="w-full bg-slate-900/60 border border-slate-700/60 rounded-xl py-3 pl-11 pr-4 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/50 transition-all"
                          required
                        />
                     </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 ml-1 uppercase mb-1.5 block tracking-wider">Your Email</label>
                    <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={18} />
                        <input
                          type="email"
                          placeholder="name@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-slate-900/60 border border-slate-700/60 rounded-xl py-3 pl-11 pr-4 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                          required
                        />
                     </div>
                  </div>

                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-400 hover:to-blue-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-teal-500/20 active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2 text-sm uppercase tracking-wide mt-1"
                  >
                    {status === 'loading' ? 'Joining...' : 'Get Instant Access'}
                    {!status.includes('loading') && <ArrowRight size={16} />}
                  </button>

                  {/* Error Message */}
                  {status === 'error' && (
                    <p className="text-red-400 text-xs text-center mt-2">Something went wrong. Try again.</p>
                  )}
                </form>
              )}
            </div>

          </div>

          {/* Note: Purana mobile image div hata diya hai kyunki ab humne usse beech mein move kar diya hai */}

        </motion.div>
      </div>
    </section>
  );
}
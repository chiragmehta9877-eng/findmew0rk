'use client';
import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform, Variants } from 'framer-motion';
import { Briefcase, Bell, Globe, Cpu, Target, Shield, Layers, ArrowRight, CheckCircle, Zap } from 'lucide-react';
import Navbar from '@/components/Navbar'; 
import JobHologram from '@/components/home/JobHologram';
import HeroSearch from '@/components/home/HeroSearch'; 
import { useSession } from 'next-auth/react'; // 🔥 Import added

// --- Animation Variants ---
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 }, 
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } } 
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1 
    }
  }
};

export default function HomePage() {
  
  // 🔥 Auth Check
  const { status } = useSession();

  // --- Parallax Setup ---
  const ref = useRef(null);
  
  // Mobile Check to disable heavy scroll listeners
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    if (window.innerWidth < 768) setIsMobile(true);
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"]
  });

  // Desktop only parallax
  const yBackground = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  return (
    <div ref={ref} className="min-h-screen transition-colors duration-300 bg-slate-50 text-slate-900 dark:bg-[#0A192F] dark:text-white font-sans overflow-x-hidden selection:bg-teal-400 selection:text-[#0A192F]">
      
      <Navbar />

      {/* =========================================
          HERO SECTION (Animated)
      ========================================= */}
      <section className="relative pt-10 pb-20 lg:pt-20 lg:pb-32 overflow-hidden border-b border-gray-200 dark:border-white/5">
        
        {/* Glows: Hidden on Mobile */}
        <motion.div 
          animate={{ x: [0, 50, 0], y: [0, -50, 0], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="hidden md:block absolute top-0 right-0 w-[600px] h-[600px] bg-teal-400/20 dark:bg-teal-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none"
        />
        <motion.div 
          animate={{ x: [0, -50, 0], y: [0, 50, 0], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="hidden md:block absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-400/20 dark:bg-blue-600/10 rounded-full blur-[120px] translate-y-1/3 -translate-x-1/3 pointer-events-none"
        />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            
            {/* Left: Text Content */}
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="lg:w-1/2 text-center lg:text-left flex flex-col items-center lg:items-start"
            >
              
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100/50 border border-teal-200 text-teal-700 dark:bg-teal-400/5 dark:border-teal-400/20 dark:text-teal-400 text-xs font-bold uppercase tracking-widest mb-8 backdrop-blur-sm">
                {/* Ping removed on mobile to save battery */}
                <span className="w-2 h-2 bg-teal-600 dark:bg-teal-400 rounded-full md:animate-ping"></span>
                <span className="w-2 h-2 bg-teal-600 dark:bg-teal-400 rounded-full absolute md:hidden"></span>
                System Online: Scanning Feeds
              </motion.div>
              
              <motion.h1 variants={fadeInUp} className="text-5xl lg:text-7xl font-bold text-slate-900 dark:text-white leading-[1.1] tracking-tight mb-6">
                Find work <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 via-blue-600 to-indigo-600 dark:from-teal-400 dark:via-blue-400 dark:to-purple-500 animate-gradient-x">
                  Hidden in the Noise.
                </span>
              </motion.h1>
              
              <motion.p variants={fadeInUp} className="text-lg text-slate-600 dark:text-gray-400 max-w-xl mb-8 leading-relaxed">
                FindMeWork uses AI to filter through chaotic Twitter & LinkedIn posts, extracting real job opportunities.
              </motion.p>

              <motion.div variants={fadeInUp} className="w-full">
                <HeroSearch />
              </motion.div>

              <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 w-full lg:w-auto mt-6">
                <Link href="/twitter-jobs" className="w-full sm:w-auto px-8 py-4 bg-teal-600 hover:bg-teal-700 text-white dark:bg-teal-400 dark:text-[#0A192F] font-bold rounded-xl dark:hover:bg-white transition-all transform hover:-translate-y-1 shadow-xl shadow-teal-500/20 flex items-center justify-center gap-2">
                  <Briefcase size={20} /> Find Work Now
                </Link>
                
                <button className="w-full sm:w-auto px-8 py-4 bg-white border border-gray-200 text-slate-700 hover:border-teal-500 hover:text-teal-600 dark:bg-[#112240] dark:border-white/10 dark:text-white dark:hover:border-teal-400/50 font-bold rounded-xl transition-all flex items-center justify-center gap-2 group shadow-sm dark:shadow-none">
                  <Bell size={20} className="text-slate-400 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors" /> Get Daily Alerts
                </button>
              </motion.div>

              {/* Stats */}
              <motion.div variants={fadeInUp} className="mt-12 flex justify-center lg:justify-start items-center gap-8 border-t border-gray-200 dark:border-white/5 pt-8 w-full">
                 <div>
                    <span className="block text-2xl font-bold text-slate-900 dark:text-white font-mono">300+</span>
                    <span className="text-xs text-slate-500 dark:text-gray-500 uppercase tracking-wider">Daily Posts</span>
                 </div>
                 <div className="w-px h-8 bg-gray-300 dark:bg-white/10"></div>
                 <div>
                    <span className="block text-2xl font-bold text-slate-900 dark:text-white font-mono">98%</span>
                    <span className="text-xs text-slate-500 dark:text-gray-500 uppercase tracking-wider">AI Accuracy</span>
                 </div>
              </motion.div>
            </motion.div>

            {/* Right: Hologram (PC Only) */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="hidden lg:flex lg:w-1/2 w-full items-center justify-center relative perspective-1000"
            >
               <JobHologram />
            </motion.div>

          </div>
        </div>
      </section>

      {/* =========================================
          🔥 SECTION: THE ENGINE
      ========================================= */}
      <section className="py-24 relative bg-white dark:bg-[#0B1C36] overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }} // Margin kam kiya
            variants={fadeInUp}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-sm font-bold text-teal-600 dark:text-teal-400 uppercase tracking-widest mb-2">The Intelligence Engine</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">How we find what others miss.</h3>
            <p className="text-slate-600 dark:text-gray-400">Traditional job boards are crowded. We go where the founders are.</p>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-20px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {/* Step 1 */}
            <motion.div variants={fadeInUp} className="group relative p-8 rounded-3xl bg-slate-50 dark:bg-[#112240] border border-gray-200 dark:border-white/5 hover:border-teal-500/30 transition-all duration-300">
              <div className="absolute top-0 right-0 p-6 opacity-10 text-9xl font-bold text-slate-900 dark:text-white select-none pointer-events-none">1</div>
              <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-6">
                <Globe size={28} />
              </div>
              <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Global Scan</h4>
              <p className="text-sm text-slate-600 dark:text-gray-400 leading-relaxed">
                Our bots monitor millions of tweets, LinkedIn posts, and threads 24/7. We listen for keywords like "Hiring", "DM me", and "Founding Engineer".
              </p>
            </motion.div>

            {/* Step 2 */}
            <motion.div variants={fadeInUp} className="group relative p-8 rounded-3xl bg-slate-50 dark:bg-[#112240] border border-gray-200 dark:border-white/5 hover:border-teal-500/30 transition-all duration-300">
              <div className="absolute top-0 right-0 p-6 opacity-10 text-9xl font-bold text-slate-900 dark:text-white select-none pointer-events-none">2</div>
              <div className="w-14 h-14 rounded-2xl bg-teal-100 dark:bg-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-6">
                <Cpu size={28} />
              </div>
              <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-3">AI Context Extraction</h4>
              <p className="text-sm text-slate-600 dark:text-gray-400 leading-relaxed">
                Raw text is messy. Our LLM parses the noise to extract Role, Tech Stack, Salary, and Application Method automatically.
              </p>
            </motion.div>

            {/* Step 3 */}
            <motion.div variants={fadeInUp} className="group relative p-8 rounded-3xl bg-slate-50 dark:bg-[#112240] border border-gray-200 dark:border-white/5 hover:border-teal-500/30 transition-all duration-300">
              <div className="absolute top-0 right-0 p-6 opacity-10 text-9xl font-bold text-slate-900 dark:text-white select-none pointer-events-none">3</div>
              <div className="w-14 h-14 rounded-2xl bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-6">
                <Target size={28} />
              </div>
              <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Direct Connect</h4>
              <p className="text-sm text-slate-600 dark:text-gray-400 leading-relaxed">
                No middleman. We give you the direct link to the Tweet or LinkedIn post so you can DM the founder immediately.
              </p>
            </motion.div>
          </motion.div>

        </div>
      </section>

      {/* =========================================
          🔥 SECTION: WHY US (Optimized Parallax)
      ========================================= */}
     <section className="py-24 bg-slate-50 dark:bg-[#0A192F] relative overflow-hidden">
        {/* Parallax Background - ONLY DESKTOP */}
        <motion.div 
          style={{ y: isMobile ? 0 : yBackground }} 
          className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"
        ></motion.div>

        {/* FIX 1: Max-width 7xl aur px-6/12 add kiya taaki content screen edges se door rahe */}
        <div className="container mx-auto px-6 md:px-12 lg:px-8 max-w-7xl relative z-10">
          
          {/* FIX 2: Gap badhaya (gap-12 se gap-16/24) taaki Text aur Cards alag-alag dikhein */}
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">
            
            {/* Left Column */}
            <motion.div 
               initial={{ opacity: 0, x: -20 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.5 }}
               className="lg:w-1/2" 
            >
              <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-8 leading-tight">
                Stop applying to <br/> 
                <span className="text-red-500 decoration-red-500/30 underline decoration-wavy underline-offset-4">ghost jobs.</span>
              </h2>
              <p className="text-lg text-slate-600 dark:text-gray-300 mb-10 max-w-lg leading-relaxed">
                Most job boards are graveyards. FindMeWork connects you to opportunities that are alive, urgent, and often unlisted.
              </p>
              
              <ul className="space-y-6"> {/* List items ke beech space badhaya */}
                {[
                  "Real-time updates every 15 minutes",
                  "Filter by Tech Stack (React, Node, Python)",
                  "Direct access to Hiring Managers",
                  "Verified 'Hiring' status via AI"
                ].map((item, i) => (
                  <motion.li 
                    key={i} 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-4 text-slate-700 dark:text-gray-300 font-medium text-lg"
                  >
                    <CheckCircle size={22} className="text-teal-500 flex-shrink-0" /> {item}
                  </motion.li>
                ))}
              </ul>

              <button className="mt-10 px-10 py-4 rounded-full border border-slate-300 dark:border-white/10 hover:border-teal-500 dark:hover:border-teal-400 text-slate-900 dark:text-white font-bold transition-colors flex items-center gap-3 group">
                Explore Features <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>

            {/* Right Column: Cards */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              // FIX 3: Grid gap badhaya (gap-4 se gap-6) taaki cards apas me na chipkein
              className="lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-6"
            >
               <div className="p-8 bg-white dark:bg-[#112240] rounded-2xl shadow-xl border border-gray-100 dark:border-white/5">
                  <Shield size={32} className="text-teal-500 mb-4" />
                  <h4 className="font-bold text-xl dark:text-white mb-3">Zero Spam</h4>
                  <p className="text-sm text-slate-500 dark:text-gray-400 leading-relaxed">We auto-block recruiters and agencies. Only direct company posts.</p>
               </div>
               
               {/* Margin Top badhaya staggered look ke liye */}
               <div className="p-8 bg-white dark:bg-[#112240] rounded-2xl shadow-xl border border-gray-100 dark:border-white/5 sm:mt-12">
                  <Layers size={32} className="text-blue-500 mb-4" />
                  <h4 className="font-bold text-xl dark:text-white mb-3">Smart Sorting</h4>
                  <p className="text-sm text-slate-500 dark:text-gray-400 leading-relaxed">Jobs are categorized by skill level: Junior, Senior, and Founder.</p>
               </div>
               
               <div className="p-8 bg-white dark:bg-[#112240] rounded-2xl shadow-xl border border-gray-100 dark:border-white/5">
                  <Zap size={32} className="text-yellow-500 mb-4" />
                  <h4 className="font-bold text-xl dark:text-white mb-3">Lightning Fast</h4>
                  <p className="text-sm text-slate-500 dark:text-gray-400 leading-relaxed">Be the first to apply. Alerts are sent the moment a tweet goes live.</p>
               </div>
               
               <div className="p-8 bg-white dark:bg-[#112240] rounded-2xl shadow-xl border border-gray-100 dark:border-white/5 sm:mt-12">
                  <Briefcase size={32} className="text-purple-500 mb-4" />
                  <h4 className="font-bold text-xl dark:text-white mb-3">Contract Work</h4>
                  <p className="text-sm text-slate-500 dark:text-gray-400 leading-relaxed">Special filters for Freelancers and Fractional roles.</p>
               </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* =========================================
          🔥 SECTION: CTA (Pulse Removed on Mobile)
      ========================================= */}
      <section className="py-20 bg-teal-600 dark:bg-teal-900/30 relative overflow-hidden">
         {/* Static BG for Mobile, Animated for Desktop */}
         <div className="absolute inset-0 bg-teal-600 dark:bg-teal-900/30 backdrop-blur-3xl opacity-50 md:hidden"></div>
         <motion.div 
           animate={{ scale: [1, 1.2, 1], rotate: [0, 5, 0] }}
           transition={{ duration: 20, repeat: Infinity }}
           className="hidden md:block absolute inset-0 bg-teal-600 dark:bg-teal-900/30 backdrop-blur-3xl opacity-50"
         />
         
         <div className="container mx-auto px-4 relative z-10 text-center">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-3xl md:text-5xl font-bold text-white mb-6"
            >
              Ready to hunt?
            </motion.h2>
            <p className="text-teal-100 mb-10 max-w-xl mx-auto text-lg">
              Join 5,000+ developers who stopped searching and started finding.
            </p>
            
            <div className="inline-block hover:scale-105 transition-transform">
              <Link 
                href={status === 'authenticated' ? "/x-jobs" : "/login"} 
                className="px-10 py-4 bg-white text-teal-700 font-bold rounded-xl shadow-xl hover:bg-gray-100 transition-colors w-full sm:w-auto inline-flex items-center gap-2"
              >
                {status === 'authenticated' ? "Browse Jobs" : "Get Started for Free"} <Zap size={20} className="fill-current" />
              </Link>
            </div>
         </div>
      </section>

    </div>
  );
}
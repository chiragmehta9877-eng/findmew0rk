'use client';
import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; 
import { motion, useScroll, useTransform, Variants } from 'framer-motion';
import { Briefcase, Bell, Globe, Cpu, Target, Shield, Layers, ArrowRight, CheckCircle, Zap } from 'lucide-react';
import Navbar from '@/components/Navbar'; 
import JobHologram from '@/components/home/JobHologram';
import HeroSearch from '@/components/home/HeroSearch'; 
import { useSession } from 'next-auth/react'; 
import AlertModal from '@/components/AlertModal';
import NewsletterBanner from "@/components/NewsletterBanner";

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
  
  // 🔥 Auth Check & Router
  const { status } = useSession();
  const router = useRouter(); 

  // 🔥 ADDED STATE HERE
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false); // ✅ New State for UI Change

  // --- Parallax Setup ---
  const ref = useRef(null);
  
  // Mobile Check
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

  // 🔥 Handle Search and Redirect
  const handleHomeSearch = (query: string) => {
    if (query.trim()) {
      router.push(`/x-jobs?search=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div ref={ref} className="min-h-screen transition-colors duration-300 bg-slate-50 text-slate-900 dark:bg-[#0A192F] dark:text-white font-sans overflow-x-hidden selection:bg-teal-400 selection:text-[#0A192F]">
      
      <Navbar />

      {/* =========================================
          HERO SECTION (Animated)
      ========================================= */}
      <section className="relative pt-10 pb-20 lg:pt-20 lg:pb-32 overflow-hidden border-b border-gray-200 dark:border-white/5">
        
        {/* 🔥 3JS-STYLE PARTICLE BACKGROUND */}
        <div className="absolute inset-0 z-0 pointer-events-none">
            <ParticleBackground />
        </div>

        {/* Glows: Hidden on Mobile - 🔥 MAC OPTIMIZED: transform-gpu */}
        <motion.div 
          animate={{ x: [0, 50, 0], y: [0, -50, 0], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="hidden md:block absolute top-0 right-0 w-[600px] h-[600px] bg-teal-400/20 dark:bg-teal-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none will-change-transform transform-gpu"
        />
        <motion.div 
          animate={{ x: [0, -50, 0], y: [0, 50, 0], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="hidden md:block absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-400/20 dark:bg-blue-600/10 rounded-full blur-[120px] translate-y-1/3 -translate-x-1/3 pointer-events-none will-change-transform transform-gpu"
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
                <span className="w-2 h-2 bg-teal-600 dark:bg-teal-400 rounded-full md:animate-ping"></span>
                <span className="w-2 h-2 bg-teal-600 dark:bg-teal-400 rounded-full absolute md:hidden"></span>
                Live Job Posts Detected in Real Time
              </motion.div>
              
              <motion.h1 
                variants={fadeInUp} 
                className="text-4xl lg:text-6xl font-extrabold text-slate-900 dark:text-white leading-tight tracking-tight mb-6"
              >
                Connect Directly with Hiring Managers
                <span className="block mt-3 text-xl lg:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-600 via-blue-600 to-indigo-600 dark:from-teal-400 dark:via-blue-400 dark:to-purple-500 animate-gradient-x pb-2 leading-normal">
                  No Portals. No Easy Apply. No Middlemen.
                </span>
              </motion.h1>
              
              <motion.p 
                variants={fadeInUp} 
                className="text-lg md:text-xl text-slate-700 dark:text-gray-300 max-w-lg mt-0 mb-6 leading-snug"
              >
                FindMeWork scans Twitter (X) for real job posts shared by founders, recruiters, and hiring managers, then lets you submit your profile straight to them.
              </motion.p>

              <motion.div variants={fadeInUp} className="w-full">
                <HeroSearch onSearch={handleHomeSearch} />
              </motion.div>

              <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 w-full lg:w-auto mt-6">
                <Link href="/x-jobs" className="w-full sm:w-auto px-8 py-4 bg-teal-600 hover:bg-teal-700 text-white dark:bg-teal-400 dark:text-[#0A192F] font-bold rounded-xl dark:hover:bg-white transition-all transform hover:-translate-y-1 shadow-xl shadow-teal-500/20 flex items-center justify-center gap-2">
                  <Briefcase size={20} /> Find Work Now
                </Link>
                
                {/* 🔥 UPDATED BUTTON */}
                <button 
                  onClick={() => !isSubscribed && setIsAlertOpen(true)}
                  disabled={isSubscribed} 
                  className={`w-full sm:w-auto px-8 py-4 border font-bold rounded-xl transition-all flex items-center justify-center gap-2 group shadow-sm dark:shadow-none
                    ${isSubscribed 
                      ? "bg-green-50 border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400 cursor-default" 
                      : "bg-white border-gray-200 text-slate-700 hover:border-teal-500 hover:text-teal-600 dark:bg-[#112240] dark:border-white/10 dark:text-white dark:hover:border-teal-400/50"
                    }
                  `}
                >
                  {isSubscribed ? (
                    <>
                      <CheckCircle size={20} className="text-green-600 dark:text-green-400" />
                      Subscribed
                    </>
                  ) : (
                    <>
                      <Bell size={20} className="text-slate-400 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors" /> 
                      Get Daily Alerts
                    </>
                  )}
                </button>

                <AlertModal 
                  isOpen={isAlertOpen} 
                  onClose={() => setIsAlertOpen(false)} 
                  onSuccess={() => setIsSubscribed(true)} 
                />
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
            viewport={{ once: true, margin: "-50px" }} 
            variants={fadeInUp}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-sm font-bold text-teal-600 dark:text-teal-400 uppercase tracking-widest mb-2">The Intelligence Engine</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">How we find jobs before they hit job boards!</h3>
            <p className="text-slate-600 dark:text-gray-400">
              Traditional job boards are overcrowded. <br />
              FindMeWork tracks where hiring actually happens, in public posts by founders and hiring managers.
            </p>
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
                FindMeWork monitor public hiring posts across Twitter (X) in real time.
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
                Most hiring posts are unstructured and easy to miss. FindMeWork's Al automatically extracts the role, required skills, location, salary (when mentioned), and contact details.
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
                No recruiters, tracking system & redirects. You get the original post and contact path, so you can reach the hiring manager directly.
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

        <div className="container mx-auto px-6 md:px-12 lg:px-8 max-w-7xl relative z-10">
          
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
                Stop Applying to <br/> 
                <span className="text-red-500 decoration-red-500/30 ">Ghost Jobs</span>
              </h2>
              <p className="text-lg text-slate-600 dark:text-gray-300 mb-10 max-w-lg leading-relaxed">
                FindMeWork shows only jobs that are real, and posted by the people actually hiring.
              </p>
              
              <ul className="space-y-6"> 
                {[
                  "New hiring posts detected every hour.",
                  "Direct access to hiring managers",
                  "Filter by real tech stacks",
                  "Al-verified hiring intent"
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

             <Link 
              href="/x-jobs" 
              className="mt-10 px-10 py-4 w-fit inline-flex items-center gap-3 rounded-full border border-slate-300 dark:border-white/10 hover:border-teal-500 dark:hover:border-teal-400 text-slate-900 dark:text-white font-bold transition-colors group"
             >
              Explore Features <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
             </Link>
            </motion.div>

            {/* Right Column: Cards */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-6"
            >
              <div className="p-8 bg-white dark:bg-[#112240] rounded-2xl shadow-xl border border-gray-100 dark:border-white/5 flex flex-col items-center text-center justify-center">
                 <Shield size={56} className="text-teal-500 mb-4" strokeWidth={2} />
                 <h4 className="font-bold text-2xl dark:text-white">Zero Spam</h4>
              </div>
              
              <div className="p-8 bg-white dark:bg-[#112240] rounded-2xl shadow-xl border border-gray-100 dark:border-white/5 flex flex-col items-center text-center justify-center sm:mt-12">
                 <Layers size={56} className="text-blue-500 mb-4" strokeWidth={2} />
                 <h4 className="font-bold text-2xl dark:text-white">Smart Sorting</h4>
              </div>
              
              <div className="p-8 bg-white dark:bg-[#112240] rounded-2xl shadow-xl border border-gray-100 dark:border-white/5 flex flex-col items-center text-center justify-center">
                 <Zap size={56} className="text-yellow-500 mb-4" strokeWidth={2} />
                 <h4 className="font-bold text-2xl dark:text-white">Lightning Fast</h4>
              </div>
              
              <div className="p-8 bg-white dark:bg-[#112240] rounded-2xl shadow-xl border border-gray-100 dark:border-white/5 flex flex-col items-center text-center justify-center sm:mt-12">
                 <Briefcase size={56} className="text-purple-500 mb-4" strokeWidth={2} />
                 <h4 className="font-bold text-2xl dark:text-white">Contract Work</h4>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 🔥 ADDED: Newsletter Banner */}
      <NewsletterBanner />

      {/* =========================================
          🔥 SECTION: CTA (Pulse Removed on Mobile)
      ========================================= */}
      <section className="py-20 bg-teal-600 dark:bg-teal-900/30 relative overflow-hidden">
         {/* Static BG for Mobile, Animated for Desktop */}
         <div className="absolute inset-0 bg-teal-600 dark:bg-teal-900/30 backdrop-blur-3xl opacity-50 md:hidden"></div>
         {/* 🔥 MAC OPTIMIZED: transform-gpu */}
         <motion.div 
           animate={{ scale: [1, 1.2, 1], rotate: [0, 5, 0] }}
           transition={{ duration: 20, repeat: Infinity }}
           className="hidden md:block absolute inset-0 bg-teal-600 dark:bg-teal-900/30 backdrop-blur-3xl opacity-50 will-change-transform transform-gpu"
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

// ----------------------------------------------------
// 🔥 SEXY GLOWING PARTICLE NETWORK (MAC OPTIMIZED)
// ----------------------------------------------------
function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: Particle[] = [];
    let animationFrameId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      baseColor: string;

      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height;
        this.vx = (Math.random() - 0.5) * 0.3; 
        this.vy = (Math.random() - 0.5) * 0.3;
        this.size = Math.random() * 2.5 + 0.5;
        const colors = ['#2DD4BF', '#0EA5E9', '#6366F1']; 
        this.baseColor = colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas!.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas!.height) this.vy *= -1;
      }

      draw() {
        if(!ctx) return;
        // ✅ APPLE OPTIMIZED FAKE GLOW (No shadowBlur!)
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = this.baseColor;
        ctx.globalAlpha = 0.15; 
        ctx.fill();

        // Core Solid Particle
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.globalAlpha = 1.0; 
        ctx.fill();
      }
    }

    const initParticles = () => {
      particles = [];
      const count = window.innerWidth < 768 ? 40 : 100;
      for (let i = 0; i < count; i++) {
        particles.push(new Particle());
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        mouseRef.current = { 
            x: e.clientX - rect.left, 
            y: e.clientY - rect.top 
        };
    };

    const animate = () => {
      if(!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((p, index) => {
        p.update();
        p.draw();
        
        for (let j = index + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 120) {
            ctx.beginPath();
            ctx.strokeStyle = p.baseColor; // Safari optimized styling
            ctx.globalAlpha = Math.max(0, 0.15 - distance / 800); // Prevent negative alpha bugs
            ctx.lineWidth = 0.5;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }

        const dxMouse = p.x - mouseRef.current.x;
        const dyMouse = p.y - mouseRef.current.y;
        const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);

        if (distMouse < 200) {
            ctx.beginPath();
            ctx.strokeStyle = "#0EA5E9"; // Blue highlight
            ctx.globalAlpha = Math.max(0, 0.4 - distMouse / 500);
            ctx.lineWidth = 0.8;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouseRef.current.x, mouseRef.current.y);
            ctx.stroke();
        }
        ctx.globalAlpha = 1.0; // Reset alpha
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);
    
    resize();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full opacity-60" />;
}
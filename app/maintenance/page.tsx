'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
// 👇 Added 'Variants' to import
import { motion, Variants } from 'framer-motion'; 
import { Twitter, RefreshCw, Zap, ArrowRight, CheckCircle2, Linkedin, Layers, Rocket } from 'lucide-react';
import MaintenanceListener from '@/components/MaintenanceListener';

// --- Animation Variants ---
// 👇 Added ': Variants' type annotation here
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 }, 
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } } 
};

export default function MaintenancePage() {
  return (
    <div className="min-h-screen relative flex items-center justify-center bg-[#020617] text-white overflow-hidden font-sans selection:bg-teal-500/30">
      
      {/* 1. Auto-Redirect Listener */}
      <MaintenanceListener />

      {/* =========================================
          🔥 OPTIMIZED BACKGROUND
      ========================================= */}
      <div className="absolute inset-0 z-0 pointer-events-none">
          <ParticleBackground />
      </div>
      
      {/* Vignette Overlay for Depth */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#020617_95%)] pointer-events-none z-0"></div>

      {/* =========================================
          MAIN CONTAINER
      ========================================= */}
      <div className="relative z-10 container mx-auto px-6 max-w-6xl flex flex-col md:flex-row items-center gap-16 md:gap-24">
        
        {/* 🔥 LEFT: ADVERTISING CONTENT */}
        <motion.div 
          initial="hidden" 
          animate="visible" 
          variants={fadeInUp} 
          className="flex-1 text-center md:text-left z-20"
        >
             {/* Status Badge */}
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
                </span>
                System Upgrade In Progress
            </div>

            {/* ✅ NEW ADVERTISING HEADLINE */}
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight mb-6 drop-shadow-2xl">
              The Next Evolution of <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-blue-400 to-purple-400">
                FindMeWork.
              </span>
            </h1>
            
          <p className="text-lg text-slate-400 mb-8 leading-relaxed max-w-lg mx-auto md:mx-0">
  We're currently upgrading FindMeWork to serve you better.
  <span className="block md:inline">
    {" "}We'll be back online shortly.
  </span>
</p>

            {/* Social Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                {/* LinkedIn Button */}
                <Link 
                    href="https://linkedin.com/company/findmework" 
                    target="_blank"
                    className="flex items-center justify-center gap-3 px-8 py-3.5 bg-[#0A66C2] hover:bg-[#004182] border border-transparent text-white font-bold rounded-xl transition-all shadow-lg group hover:-translate-y-0.5"
                >
                    <Linkedin size={20} className="fill-current" />
                    <span>LinkedIn</span>
                </Link>

                {/* X Button */}
                <Link 
                    href="https://twitter.com/findmew0rk" 
                    target="_blank"
                    className="flex items-center justify-center gap-3 px-8 py-3.5 bg-slate-800/50 border border-slate-700 hover:bg-[#1DA1F2]/10 hover:border-[#1DA1F2]/50 hover:text-white text-slate-300 font-bold rounded-xl transition-all group backdrop-blur-md hover:-translate-y-0.5"
                >
                    <Twitter size={20} className="text-[#1DA1F2]" />
                    <span>Follow Updates</span>
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>
        </motion.div>


        {/* 🔥 RIGHT: THE SMOOTH CARD (Hidden on Mobile) */}
        <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden md:block flex-1 w-full max-w-md relative perspective-1000 z-20"
        >
             {/* Glow Behind Card */}
             <div className="absolute inset-0 bg-teal-500/20 blur-[80px] rounded-full pointer-events-none"></div>

             {/* THE FLOATING WRAPPER (No Overflow Hidden Here) */}
             <motion.div 
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} 
                className="relative"
            >
                {/* 🟢 STATUS BADGE (Outside the card so it isn't clipped) */}
                <motion.div 
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-4 right-8 bg-white px-3 py-1.5 rounded-lg shadow-xl border border-teal-100 flex items-center gap-2 z-50 ring-1 ring-black/5"
                >
                    <RefreshCw size={12} className="text-teal-600 animate-spin" />
                    <span className="text-[10px] font-extrabold text-teal-700 tracking-wide uppercase">System Upgrading</span>
                </motion.div>

                {/* THE ACTUAL CARD (Overflow Hidden applies HERE to clip the laser) */}
                <div className="relative bg-white/95 backdrop-blur-xl rounded-[2rem] p-6 shadow-2xl overflow-hidden border border-slate-200">
                    
                    {/* 🚀 SCANNING LASER (Now properly clipped inside) */}
                    <motion.div 
                        initial={{ top: "-20%" }}
                        animate={{ top: "120%" }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        className="absolute left-0 w-full h-32 bg-gradient-to-b from-transparent via-teal-500/10 to-transparent z-10 pointer-events-none border-b border-teal-500/50"
                    />

                    {/* Card Header */}
                    <div className="relative z-30 flex justify-between items-start mb-6">
                        <div className="w-14 h-14 bg-black rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-md ring-4 ring-slate-50">
                            S
                        </div>
                        <div className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full border border-green-200 flex items-center gap-1">
                            <CheckCircle2 size={12} /> 98% MATCH
                        </div>
                    </div>

                    {/* Job Details */}
                    <div className="relative z-30 space-y-1 mb-6">
                        <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">Founding Engineer</h3>
                        <p className="text-slate-500 font-medium text-sm flex items-center gap-2">
                            <Layers size={14} /> Stealth AI Startup • Remote
                        </p>
                    </div>

                    {/* Tags */}
                    <div className="relative z-30 flex flex-wrap gap-2 mb-6">
                        {['Next.js', 'OpenAI', 'Python'].map((tag) => (
                            <span key={tag} className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-lg border border-slate-200">
                                {tag}
                            </span>
                        ))}
                    </div>

                    {/* AI Insight */}
                    <div className="relative z-30 bg-blue-50 p-4 rounded-xl border border-blue-100 mb-6 flex gap-3 items-start shadow-sm">
                        <div className="p-1.5 bg-blue-500 rounded-full mt-0.5 shrink-0">
                            <Zap size={12} className="text-white fill-white" />
                        </div>
                        <p className="text-xs text-blue-800 leading-relaxed font-medium">
                            <strong>AI Insight:</strong> Found in a thread by @TechFounder. Hiring immediately for 0-1 build.
                        </p>
                    </div>

                    {/* Card Footer: Source X */}
                    <div className="relative z-30 flex items-center justify-between pt-4 border-t border-slate-100">
                        <div className="flex items-center gap-2 text-slate-500">
                            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current text-slate-900" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
                            <span className="text-sm font-bold text-slate-900">Source: X</span>
                        </div>
                        <button className="px-5 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20">
                            Apply Now
                        </button>
                    </div>
                </div>

            </motion.div>
        </motion.div>

      </div>

      {/* Footer Status */}
      <div className="absolute bottom-6 flex items-center gap-2 text-[10px] font-mono text-teal-500/40 uppercase tracking-widest z-20">
         ● Auto-Reload Enabled
      </div>

    </div>
  );
}


// ----------------------------------------------------
// 🔥 OPTIMIZED PARTICLE NETWORK (Smooth 60FPS)
// ----------------------------------------------------
function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: Particle[] = [];
    let animationFrameId: number;

    const resize = () => {
      // Handle High DPI Screens for Sharpness
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      
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
        this.x = Math.random() * window.innerWidth;
        this.y = Math.random() * window.innerHeight;
        // Smoother, slower velocity
        this.vx = (Math.random() - 0.5) * 0.4; 
        this.vy = (Math.random() - 0.5) * 0.4;
        this.size = Math.random() * 2 + 1;
        this.baseColor = '#14b8a6'; // Teal color
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Wrap around screen (Infinite effect)
        if (this.x < 0) this.x = window.innerWidth;
        if (this.x > window.innerWidth) this.x = 0;
        if (this.y < 0) this.y = window.innerHeight;
        if (this.y > window.innerHeight) this.y = 0;
      }

      draw() {
        if(!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.baseColor;
        ctx.fill();
      }
    }

    const initParticles = () => {
      particles = [];
      // Adjust density based on screen size
      const count = window.innerWidth < 768 ? 40 : 80; 
      for (let i = 0; i < count; i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      if(!ctx) return;
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      
      particles.forEach((p, index) => {
        p.update();
        p.draw();
        
        // Draw Connections (Constellation Effect)
        for (let j = index + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          // Connection Distance
          if (distance < 120) {
            ctx.beginPath();
            // Fade out line based on distance
            ctx.strokeStyle = `rgba(20, 184, 166, ${0.15 - distance / 800})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resize);
    resize();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="block absolute inset-0 w-full h-full" />;
}
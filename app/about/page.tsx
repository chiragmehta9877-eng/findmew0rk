'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Twitter, Zap, Target, Users } from 'lucide-react';
import Navbar from '@/components/Navbar';
import ParticleBackground from '@/components/about/ParticleBackground';

// Animation Variants
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0A192F] text-slate-900 dark:text-white font-sans overflow-hidden">
      <Navbar />

      {/* --- SECTION 1: HERO & SITE INFO --- */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        
        {/* 3D Background */}
        <ParticleBackground />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div variants={fadeInUp} className="inline-block mb-4">
               <span className="px-4 py-2 rounded-full bg-teal-100/50 dark:bg-teal-500/10 text-teal-700 dark:text-teal-400 text-sm font-bold uppercase tracking-widest border border-teal-200 dark:border-teal-500/20 backdrop-blur-sm">
                 The Revolution
               </span>
            </motion.div>
            
            <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-extrabold mb-8 tracking-tight">
              We Don't Find Jobs. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 via-blue-500 to-purple-600">
                We Hunt Opportunities.
              </span>
            </motion.h1>

            <motion.p variants={fadeInUp} className="text-lg md:text-xl text-slate-600 dark:text-gray-300 leading-relaxed mb-12">
              The traditional job search is broken. While you scroll through outdated listings, 
              the best opportunities are being discussed in real-time on <span className="font-bold text-teal-500">Twitter Threads</span> and <span className="font-bold text-blue-500">LinkedIn Posts</span>. 
              <br /><br />
              **FindMeWork** is an AI-powered intelligence engine that scans the noise of social media 
              to extract hidden, high-value career opportunities before they even hit the job boards.
            </motion.p>
          </motion.div>

          {/* Feature Grid with Glassmorphism */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16"
          >
            {[
              { icon: <Zap size={32} />, title: "Real-Time AI Scanning", desc: "Our bots monitor thousands of tech influencers & founders 24/7." },
              { icon: <Target size={32} />, title: "Precision Matching", desc: "We don't just keyword match; we understand context & stack requirements." },
              { icon: <Users size={32} />, title: "Direct Founder Access", desc: "Apply directly to decision-makers via social DMs, bypassing HR filters." }
            ].map((feature, i) => (
              <motion.div 
                key={i} 
                variants={fadeInUp}
                className="p-8 rounded-3xl bg-white/40 dark:bg-[#112240]/40 backdrop-blur-md border border-white/20 dark:border-white/5 hover:border-teal-500/50 transition-colors shadow-xl"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-400 to-blue-600 flex items-center justify-center text-white mb-6 shadow-lg shadow-teal-500/20">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-slate-600 dark:text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* --- SECTION 2: THE TEAM --- */}
      {/* --- SECTION 2: THE TEAM --- */}
      <section className="relative py-32 bg-slate-100 dark:bg-[#060f1e]">
        <div className="container mx-auto px-4">
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Meet the Minds</h2>
            <div className="w-24 h-1 bg-teal-500 mx-auto rounded-full"></div>
            <p className="mt-4 text-slate-500 dark:text-gray-400">Building the future of recruitment.</p>
          </motion.div>

          {/* 👇 CHANGE HERE: Grid hata kar Flex kar diya aur justify-center laga diya */}
          <div className="flex flex-wrap justify-center gap-12 max-w-6xl mx-auto">
            
            {/* --- MEMBER 1: CHIRAG --- */}
            {/* Wrapper div lagaya taaki card ki width control rahe */}
            <div className="w-full max-w-2xl">
                <TeamCard 
                name="Chirag Mehta"
                role="Co-Founder & CTO"
                image="/chirag-mehta.jpg" 
                desc="The architect behind the AI core. Chirag specializes in Full-Stack Development and Generative AI. He built the scraping engine that powers FindMeWork's real-time feeds."
                socials={{ github: "#", linkedin: "#", twitter: "#" }}
                delay={0.2}
                />
            </div>

            {/* Agar future mein 'Jay' ko wapas lana ho, toh bas yahan niche same wrapper ke saath copy paste kar dena */}

          </div>
        </div>
      </section>
            
        

    </div>
  );
}

// --- Helper Component for Team Cards ---
function TeamCard({ name, role, image, desc, socials, delay }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: delay, ease: "easeOut" }}
      className="group relative"
    >
      {/* Background Glow Effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-500 to-blue-600 rounded-[2rem] opacity-30 group-hover:opacity-100 blur transition duration-500"></div>
      
      <div className="relative bg-white dark:bg-[#0A192F] rounded-[1.9rem] p-8 md:p-10 flex flex-col md:flex-row gap-8 items-center md:items-start h-full transform transition hover:-translate-y-2 duration-300">
        
        {/* Profile Image with Fancy Border */}
        <div className="shrink-0 relative">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden border-4 border-white dark:border-[#112240] shadow-xl">
            <img src={image} alt={name} className="w-full h-full object-cover transform group-hover:scale-110 transition duration-500" />
          </div>
          {/* Floating Icon */}
          <div className="absolute -bottom-3 -right-3 bg-teal-500 text-white p-2 rounded-lg shadow-lg">
            <Zap size={20} />
          </div>
        </div>

        {/* Content */}
        <div className="text-center md:text-left">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{name}</h3>
          <p className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-blue-500 mb-4 uppercase tracking-wide">
            {role}
          </p>
          <p className="text-slate-600 dark:text-gray-400 text-sm leading-relaxed mb-6">
            {desc}
          </p>

          {/* Social Icons */}
          <div className="flex items-center justify-center md:justify-start gap-4">
            {socials.github && (
              <a href={socials.github} className="p-2 bg-slate-100 dark:bg-white/5 rounded-full hover:bg-slate-200 dark:hover:bg-white/20 hover:text-teal-600 transition-colors">
                <Github size={18} />
              </a>
            )}
            {socials.linkedin && (
              <a href={socials.linkedin} className="p-2 bg-slate-100 dark:bg-white/5 rounded-full hover:bg-slate-200 dark:hover:bg-white/20 hover:text-[#0a66c2] transition-colors">
                <Linkedin size={18} />
              </a>
            )}
            {socials.twitter && (
              <a href={socials.twitter} className="p-2 bg-slate-100 dark:bg-white/5 rounded-full hover:bg-slate-200 dark:hover:bg-white/20 hover:text-black dark:hover:text-white transition-colors">
                <Twitter size={18} />
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
'use client';

import Link from 'next/link';
import { Zap, Linkedin, Mail, Heart, GraduationCap } from 'lucide-react';

// 🔥 OFFICIAL X LOGO COMPONENT
const XLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-[#020c1b] border-t border-gray-200 dark:border-white/5 pt-16 pb-8 transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* TOP SECTION: Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* COLUMN 1: Brand & Desc */}
          <div className="space-y-4">
            
            {/* 🔥 LOGO - FindMeW0rk (Sexy Student Style) */}
            <Link href="/" className="flex items-center gap-2 group select-none">
                <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white shadow-lg shadow-teal-500/30 group-hover:scale-110 transition-transform duration-300">
                  <Zap size={18} fill="currentColor" />
                </div>
                
                <span className="text-xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center">
                  FindMeW
                  {/* ✨ THE SEXY '0' WITH STUDENT CAP ✨ */}
                  <span className="relative flex items-center justify-center w-6 h-6 mx-[1px] group-hover:scale-110 transition-transform duration-300">
                     <span className="absolute inset-0 border-[2px] border-teal-500 rounded-full opacity-90"></span>
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

          
            
            {/* Social Icons (Twitter Removed -> X Added) */}
            <div className="flex items-center gap-4 pt-2">
              <SocialLink href="https://linkedin.com/company/findmework" icon={<Linkedin size={18} />} label="LinkedIn" />
              
              {/* 🔥 X LOGO ADDED HERE */}
              <a 
                href="https://x.com/findmework" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="X (Twitter)"
                className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 flex items-center justify-center hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all shadow-sm"
              >
                <XLogo className="w-4 h-4" />
              </a>

              <SocialLink href="mailto:support@findmework.com" icon={<Mail size={18} />} label="Email" />
            </div>
          </div>

          {/* COLUMN 2: Company */}
          <div>
            <h3 className="text-slate-900 dark:text-white font-bold mb-4">Company</h3>
            <ul className="space-y-3 text-sm text-slate-500 dark:text-slate-400">
              <li><FooterLink href="/about">About Us</FooterLink></li>
              <li><FooterLink href="mailto:support@findmework.com">Contact Support</FooterLink></li>
            </ul>
          </div>

          {/* COLUMN 3: Resources */}
          <div>
            <h3 className="text-slate-900 dark:text-white font-bold mb-4">Jobs</h3>
            <ul className="space-y-3 text-sm text-slate-500 dark:text-slate-400">
              <li><FooterLink href="/x-jobs">Verified Feeds</FooterLink></li>
              <li><FooterLink href="/dashboard">Dashboard</FooterLink></li>
            </ul>
          </div>

          {/* COLUMN 4: Legal */}
          <div>
            <h3 className="text-slate-900 dark:text-white font-bold mb-4">Legal</h3>
            <ul className="space-y-3 text-sm text-slate-500 dark:text-slate-400">
              <li><FooterLink href="/privacy-policy">Privacy Policy</FooterLink></li>
            </ul>
          </div>

        </div>

        {/* DIVIDER */}
        <div className="border-t border-gray-100 dark:border-white/5 my-8"></div>

        {/* BOTTOM SECTION */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500 dark:text-slate-500">
          <p>© {currentYear} FindMeWork Inc. All rights reserved.</p>
          
          <div className="flex items-center gap-2">
            <span>Made with</span>
            <Heart size={14} className="text-red-500 fill-red-500 animate-pulse" />
            <span>for job seekers</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ✨ Helper Component for Links (Hover Effect)
function FooterLink({ href, children }: { href: string, children: React.ReactNode }) {
  return (
    <Link 
      href={href} 
      className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors duration-200 block w-fit"
    >
      {children}
    </Link>
  );
}

// ✨ Helper Component for Social Icons (Generic)
function SocialLink({ href, icon, label }: { href: string, icon: React.ReactNode, label: string }) {
  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer"
      aria-label={label}
      className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 flex items-center justify-center hover:bg-teal-600 hover:text-white dark:hover:bg-teal-500 dark:hover:text-white transition-all shadow-sm"
    >
      {icon}
    </a>
  );
}
'use client';

import React, { useState, useEffect, useRef, Suspense, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { MapPin, ArrowRight, Filter, ChevronLeft, ChevronRight, X, CheckCircle, ChevronDown, ChevronUp, Zap, Sparkles, List, Navigation } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar'; 
import JobHero from '@/components/JobHero'; 
import { useSession } from 'next-auth/react';
import LoginWall from '@/components/LoginWall'; 

const TourGuide = ({ onComplete }: { onComplete: () => void }) => {
  const { data: session, status } = useSession();
  const [step, setStep] = useState(0);
  const [rect, setRect] = useState({ top: 0, left: 0, width: 0, height: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRunTour, setShouldRunTour] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // 🔥 Performance Optimization: RequestAnimationFrame Lock
  const ticking = useRef(false);

  const steps = [
    { 
      id: 'tour-filters', 
      title: 'Smart Filters', 
      icon: <Filter size={18} className="text-[#34D399]" />,
      desc: 'Refine your search by Category, Source (Twitter), or Job Type right here.',
    },
    { 
      id: 'tour-feed', 
      title: 'Verified Job Feed', 
      icon: <List size={18} className="text-[#34D399]" />,
      desc: 'Browse hundreds of verified jobs. We verify the source so you dont have to.',
    },
    { 
      id: 'tour-spotlight', 
      title: 'Spotlight Jobs', 
      icon: <Zap size={18} className="text-[#34D399] fill-[#34D399]" />,
      desc: 'Look for the Green Glow! These are premium, high-priority hiring alerts.',
    },
    { 
      id: 'tour-navbar', 
      title: 'Navigation Hub', 
      icon: <Navigation size={18} className="text-[#34D399]" />,
      desc: 'Access Home, Contact, and Profile settings from here.',
    }
  ];

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.email) {
      const storageKey = `findmework_tour_seen_${session.user.email}`;
      const hasSeenTour = localStorage.getItem(storageKey);
      if (!hasSeenTour) {
        const timer = setTimeout(() => setShouldRunTour(true), 1500);
        return () => clearTimeout(timer);
      } else {
        onComplete();
      }
    }
  }, [status, session, onComplete]);

  const finishTour = () => {
    if (session?.user?.email) {
      localStorage.setItem(`findmework_tour_seen_${session.user.email}`, 'true');
    }
    setIsVisible(false);
    setShouldRunTour(false);
    onComplete();
  };

  // ==========================================
  // LOGIC 1: GPU OPTIMIZED TRACKER (Manual Scroll)
  // ==========================================
  const updateRectOnly = useCallback(() => {
    if (isTransitioning) return; 

    // 🔥 Optimization: Agar calculation pehle se queue me hai to dubara mat karo
    if (!ticking.current) {
      window.requestAnimationFrame(() => {
        let targetId = steps[step].id;
        if (targetId === 'tour-filters') {
           targetId = window.innerWidth < 1024 ? 'tour-filters-mobile' : 'tour-filters-desktop';
        }
        const element = document.getElementById(targetId);
        if (element) {
          const newRect = element.getBoundingClientRect();
          setRect({
            top: newRect.top + window.scrollY,
            left: newRect.left + window.scrollX,
            width: newRect.width,
            height: newRect.height
          });
        }
        ticking.current = false; // Lock release karo
      });
      ticking.current = true; // Lock laga do
    }
  }, [step, isTransitioning]);

  useEffect(() => {
    if (!shouldRunTour) return;
    window.addEventListener('scroll', updateRectOnly, { passive: true }); // passive: true is CRUCIAL for mobile
    window.addEventListener('resize', updateRectOnly);
    return () => {
      window.removeEventListener('scroll', updateRectOnly);
      window.removeEventListener('resize', updateRectOnly);
    };
  }, [updateRectOnly, shouldRunTour]);

  // ==========================================
  // LOGIC 2: SMOOTH STEP CHANGE
  // ==========================================
  const handleStepChange = () => {
    if (!shouldRunTour) return;

    setIsTransitioning(true); 
    setIsVisible(false);      

    let targetId = steps[step].id;
    if (targetId === 'tour-filters') {
       targetId = window.innerWidth < 1024 ? 'tour-filters-mobile' : 'tour-filters-desktop';
    }

    setTimeout(() => {
      const element = document.getElementById(targetId);
      if (element) {
        const elementRect = element.getBoundingClientRect();
        const absoluteTop = elementRect.top + window.scrollY;

        let scrollTarget = absoluteTop - 150; 
        if (step === 1) scrollTarget = absoluteTop - 250; 
        if (step === 3) scrollTarget = 0; 

        window.scrollTo({ top: scrollTarget, behavior: 'smooth' });

        setTimeout(() => {
          const newRect = element.getBoundingClientRect();
          setRect({
            top: newRect.top + window.scrollY,
            left: newRect.left + window.scrollX,
            width: newRect.width,
            height: newRect.height
          });
          setIsVisible(true);
          setIsTransitioning(false); 
        }, 800); 

      } else {
         if (step < steps.length - 1) setStep(s => s + 1);
         else finishTour();
      }
    }, 100);
  };

  useEffect(() => {
    if (shouldRunTour) {
      handleStepChange();
    }
  }, [step, shouldRunTour]);

  const handleNext = () => {
    if (step < steps.length - 1) setStep(step + 1);
    else finishTour();
  };

  if (!shouldRunTour) return null;

  // ==========================================
  // 🎨 POPUP PLACEMENT
  // ==========================================
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;
  let tooltipTop = 0;
  let tooltipLeft = 0;
  const tooltipWidth = 384; 

  if (isMobile) {
    const spaceBelow = window.innerHeight - (rect.top - window.scrollY + rect.height);
    const showAbove = spaceBelow < 280; 
    tooltipTop = showAbove ? rect.top - 240 : rect.top + rect.height + 20;
    tooltipLeft = (window.innerWidth / 2) - (Math.min(window.innerWidth * 0.9, 384) / 2);
  } else {
    if (step === 0) { 
      tooltipTop = rect.top; 
      tooltipLeft = rect.left + rect.width + 20; 
    } 
    else if (step === 1) { 
      tooltipTop = rect.top - 190; 
      tooltipLeft = rect.left + (rect.width / 2) - (tooltipWidth / 2);
    } 
    else if (step === 2) { 
      tooltipTop = rect.top - 120; 
      tooltipLeft = rect.left + rect.width - 100; 
    } 
    else { 
      tooltipTop = rect.top + rect.height + 20;
      tooltipLeft = rect.left + (rect.width / 2) - (tooltipWidth / 2);
    }
  }

  if (tooltipLeft + tooltipWidth > window.innerWidth) tooltipLeft = window.innerWidth - tooltipWidth - 20;
  if (tooltipLeft < 20) tooltipLeft = 20;
  if (tooltipTop < window.scrollY + 20) tooltipTop = window.scrollY + 20;

  return (
    <div className="absolute inset-0 z-[9999] pointer-events-none h-full w-full overflow-hidden">
      
      <AnimatePresence>
        {isVisible && (
          <motion.div 
            className="absolute rounded-xl border-4 border-[#10B981] z-50 transform-gpu shadow-[0_0_30px_rgba(16,185,129,0.3)]"
            layoutId="tour-highlight"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ 
                opacity: 1, 
                scale: 1, 
                top: rect.top - 6, 
                left: rect.left - 6, 
                width: rect.width + 12, 
                height: rect.height + 12 
            }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: isTransitioning ? 100 : 800, damping: isTransitioning ? 20 : 50 }}
            style={{ 
              boxShadow: "0 0 0 99999px rgba(0, 0, 0, 0.75)",
              willChange: "top, left, width, height" 
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isVisible && (
          <motion.div 
            className="absolute z-[10000] w-[90vw] max-w-sm pointer-events-auto"
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1, top: tooltipTop, left: tooltipLeft }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 120, damping: 15 }}
            style={{ willChange: "top, left" }} 
          >
            <div className="bg-[#0f172a] border border-[#10B981] p-6 rounded-2xl shadow-2xl relative overflow-hidden group">
               <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#10B981]/20 blur-3xl rounded-full pointer-events-none transition-all group-hover:bg-[#10B981]/30"></div>
              
              <div className="relative z-10">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    {steps[step].icon}
                    {steps[step].title}
                  </h3>
                  <span className="text-[10px] font-bold tracking-wider text-[#34D399] bg-[#064e3b]/50 px-2 py-1 rounded border border-[#10B981]/20">
                    STEP {step + 1}/{steps.length}
                  </span>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-6 font-medium">{steps[step].desc}</p>
                <button 
                  onClick={handleNext}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#10B981] to-[#059669] hover:from-[#059669] hover:to-[#047857] text-white font-bold text-sm shadow-lg shadow-[#064e3b]/50 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  {step === steps.length - 1 ? 'Finish Tour' : 'Next Step →'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- EXISTING COMPONENTS & DATA ---

const XLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const SUB_CATEGORIES = [
  { name: "All", value: "all" },
  { name: "IT & Software", value: "software" }, 
  { name: "Finance & Accounting", value: "finance" },
  { name: "Business & Management", value: "management" },
  { name: "Human Resources", value: "hr" },
  { name: "Sales & Marketing", value: "marketing" },
  { name: "ESG & Sustainability", value: "esg" },
  { name: "E-Commerce", value: "commerce" },
  { name: "Design & Architecture", value: "design" },
  { name: "Research & Analytics", value: "research" },
  { name: "Others", value: "other" }
];

const MAIN_FILTERS = [
  { id: 'job', label: 'Jobs', hasSub: true },
  { id: 'internship', label: 'Internships', hasSub: true },
  { id: 'freelance', label: 'Freelance', hasSub: false }
];

const ITEMS_PER_PAGE = 12;

// 🔥 SAFE LAYOUT EFFECT TO PREVENT NEXT.JS SSR WARNINGS
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? React.useLayoutEffect : React.useEffect;

function XJobsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession(); 
  
  const [jobs, setJobs] = useState<any[]>([]); 

  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  
  const [activeMainFilter, setActiveMainFilter] = useState(searchParams.get('main') || "job"); 
  const [activeSubFilter, setActiveSubFilter] = useState(searchParams.get('sub') || "all"); 
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || ""); 
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get('page')) || 1);
  
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(true);

  const [showTour, setShowTour] = useState(false);
  const viewedJobs = useRef<Set<string>>(new Set());
  const jobsHeadingRef = useRef<HTMLDivElement>(null);

  // =========================================================
  // 🔥 FIX: 0-MILLISECOND FLASH SCROLL (SYNC LAYOUT EFFECT)
  // =========================================================
  useIsomorphicLayoutEffect(() => {
    if (typeof window !== 'undefined') {
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'manual';
      }
      // Paint hone se pehle seedha jump karega!
      if (jobsHeadingRef.current) {
        const yOffset = -120;
        const elementY = jobsHeadingRef.current.getBoundingClientRect().top + window.scrollY + yOffset;
        window.scrollTo({ top: elementY, behavior: 'auto' });
      }
    }
  }, []); // Only run once exactly when component mounts

  // 🔥 Smooth Scroll for Pagination & Filters ONLY
  const isInitialMount = useRef(true);
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (!loading && jobsHeadingRef.current) {
      const yOffset = -120;
      const elementY = jobsHeadingRef.current.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: elementY, behavior: 'smooth' });
    }
  }, [currentPage, activeMainFilter, activeSubFilter]);
  // =========================================================

  useEffect(() => {
    if (status === 'loading') return;
    if (status === 'unauthenticated') {
          sessionStorage.removeItem('tour_seen_v8');
    }
    if (status === 'authenticated') {
        const hasSeen = sessionStorage.getItem('tour_seen_v8');
        if (!hasSeen) setTimeout(() => setShowTour(true), 1500); 
    }
  }, [status]);

  const handleTourComplete = () => {
    sessionStorage.setItem('tour_seen_v8', 'true');
    setShowTour(false);
  };

  const handleJobClick = (jobId: string) => {
    setActiveId(jobId);
    // ❌ API call removed (Duplicate count fix)
  };

  const handleApplyClick = (e: React.MouseEvent, jobId: string, url: string) => {
    e.stopPropagation(); 
    handleJobClick(jobId);
    // ❌ API call removed 
  };

  const updateUrl = useCallback((updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [searchParams, pathname, router]);

  const handleSearch = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
    updateUrl({ search: val, page: '1' });
  };

  useEffect(() => {
    const checkIsMobile = () => setIsMobile(window.innerWidth < 768);
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  const fetchJobs = () => {
    setLoading(true);
    fetch(`/api/jobs?limit=10000&t=${Date.now()}`) 
      .then(res => res.json())
      .then(data => {
         if(data.success) {
            const sortedJobs = data.data.sort((a: any, b: any) => {
               const aSpot = !!a.isSpotlight;
               const bSpot = !!b.isSpotlight;
               if (aSpot && !bSpot) return -1;
               if (!aSpot && bSpot) return 1;
               return 0; 
            });
            setJobs(sortedJobs);
         }
         setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const filteredJobs = useMemo(() => {
    let result = jobs;

    if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        result = result.filter(job => 
            (job.job_title && job.job_title.toLowerCase().includes(query)) ||
            (job.employer_name && job.employer_name.toLowerCase().includes(query)) ||
            (job.text && job.text.toLowerCase().includes(query)) ||
            (job.work_mode && job.work_mode.toLowerCase().includes(query)) ||
            (job.country && job.country.toLowerCase().includes(query))
        );
    }

    const getJobText = (job: any) => (job.text + " " + job.job_title + " " + job.category).toLowerCase();
    const internshipKeywords = ['intern', 'internship', 'trainee', 'stipend', 'training period'];
    const freelanceKeywords = ['freelance', 'contractor', 'gig', 'upwork', 'fiverr'];

    if (activeMainFilter === 'internship') {
        result = result.filter(job => {
            const isDbIntern = job.category && job.category.toLowerCase().includes('intern');
            const hasKeyword = internshipKeywords.some(k => getJobText(job).includes(k));
            return isDbIntern || hasKeyword;
        });
    } 
    else if (activeMainFilter === 'freelance') {
        result = result.filter(job => {
            const isDbFreelance = job.category && job.category.toLowerCase().includes('freelance');
            const hasKeyword = freelanceKeywords.some(k => getJobText(job).includes(k));
            return isDbFreelance || hasKeyword;
        });
    }
    else if (activeMainFilter === 'job') {
        result = result.filter(job => {
            const text = getJobText(job);
            if (job.category && (job.category.toLowerCase().includes('intern') || job.category.toLowerCase().includes('freelance'))) return false;
            const isIntern = internshipKeywords.some(k => text.includes(k));
            const isFreelance = freelanceKeywords.some(k => text.includes(k));
            return !isIntern && !isFreelance;
        });
    }

    if (activeSubFilter !== 'all') {
        result = result.filter(job => {
            if (job.category && job.category !== 'General' && job.category !== 'job' && job.category !== 'internship') {
                const dbCat = job.category.toLowerCase();
                const filterCat = activeSubFilter.toLowerCase();
                return dbCat.includes(filterCat) || filterCat.includes(dbCat);
            }
            const subKey = activeSubFilter.toLowerCase();
            const keywords: Record<string, string[]> = {
                'software': ['software', 'developer', 'engineer', 'java', 'python', 'react', 'node', 'frontend', 'backend', 'full stack', 'data scientist', 'ai', 'cloud', 'devops'],
                'finance': ['finance', 'accountant', 'accounting', 'audit', 'tax', 'treasury', 'banking', 'investment', 'credit analyst', 'cfo'],
                'management': ['manager', 'management', 'business analyst', 'project manager', 'product manager', 'consultant', 'strategy', 'operations', 'executive'],
                'hr': ['hr', 'human resources', 'recruiter', 'talent', 'hiring', 'payroll', 'learning', 'compensation'],
                'marketing': ['marketing', 'sales', 'brand', 'content', 'seo', 'social media', 'growth', 'advertising', 'pr', 'digital marketing'],
                'esg': ['esg', 'sustainability', 'climate', 'carbon', 'environment', 'green', 'energy', 'csr', 'net zero'],
                'commerce': ['e-commerce', 'ecommerce', 'shopify', 'marketplace', 'amazon', 'logistics', 'supply chain'],
                'design': ['design', 'designer', 'ui', 'ux', 'graphic', 'creative', 'architect', 'interior', 'visual'],
                'research': ['research', 'analyst', 'data analyst', 'economist', 'scientist', 'policy', 'market research'],
                'other': ['admin', 'support', 'customer service', 'legal', 'compliance', 'office', 'assistant']
            };
            const targetWords = keywords[subKey] || [subKey];
            return targetWords.some(word => getJobText(job).includes(word));
        });
    }

    return result;
  }, [searchQuery, jobs, activeMainFilter, activeSubFilter]);

  const toggleExpand = (e: React.MouseEvent, id: string) => {
    e.preventDefault(); 
    e.stopPropagation(); 
    setExpandedId(expandedId === id ? null : id);
  };

  const handleMainFilterClick = (id: string) => {
    setActiveMainFilter(id);
    setActiveSubFilter('all'); 
    setCurrentPage(1);
    updateUrl({ main: id, sub: 'all', page: '1' });
  };

  const handleSubFilterClick = (id: string) => {
    setActiveSubFilter(id);
    setCurrentPage(1);
    updateUrl({ sub: id, page: '1' });
  };

  // 🔥 LOGIN WALL LOGIC 🔥
  // Check if user is logged out (and not loading)
  const showLoginWall = status === 'unauthenticated';
  
  // If Wall is active, show only top 6 jobs from the entire list.
  // Otherwise, use standard pagination logic.
  const jobsToRender = showLoginWall 
      ? filteredJobs.slice(0, 6) 
      : filteredJobs.slice((currentPage - 1) * ITEMS_PER_PAGE, (currentPage - 1) * ITEMS_PER_PAGE + ITEMS_PER_PAGE);

  const totalPages = Math.ceil(filteredJobs.length / ITEMS_PER_PAGE);

  const goToNextPage = () => { 
      if (currentPage < totalPages) {
          setCurrentPage(curr => curr + 1); 
          updateUrl({ page: String(currentPage + 1) });
      }
  };
  const goToPrevPage = () => { 
      if (currentPage > 1) {
          setCurrentPage(curr => curr - 1); 
          updateUrl({ page: String(currentPage - 1) });
      }
  };

  return (
    <>
          {showTour && <TourGuide onComplete={handleTourComplete} />}

          <div id="tour-navbar" className="sticky top-0 z-50">
             <Navbar />
          </div>

          <JobHero 
              title="X Community Jobs" 
              subtitle="Find Jobs Posted Directly by the People Hiring."
              placeholder="Search 'Remote', 'Email', or 'Hiring'..."
              themeColor="#ffffff" 
              onSearch={handleSearch}
          />

          <div className="container mx-auto px-4 pb-20 flex flex-col lg:flex-row gap-8 min-h-screen">
            
            <aside id="tour-filters-desktop" className="w-full lg:w-72 shrink-0 hidden lg:block">
              <div className="bg-white dark:bg-[#112240] rounded-xl border border-gray-200 dark:border-white/5 shadow-sm sticky top-24 overflow-hidden">
                  <div className="p-5 border-b border-gray-100 dark:border-white/10 flex justify-between items-center bg-gray-50 dark:bg-white/5">
                      <h3 className="font-bold text-base flex items-center gap-2"><Filter size={16} /> Filters</h3>
                      <span className="text-xs text-blue-600 cursor-pointer hover:underline" onClick={() => { setActiveMainFilter("job"); setActiveSubFilter("all"); setSearchQuery(""); updateUrl({ main: 'job', sub: 'all', search: '', page: '1' }); }}>Reset</span>
                  </div>
                  <div className="p-4 space-y-2">
                    {MAIN_FILTERS.map((main) => {
                        const isActive = activeMainFilter === main.id;
                        return (
                            <div key={main.id} className="rounded-lg overflow-hidden">
                                <button 
                                    onClick={() => handleMainFilterClick(main.id)}
                                    className={`w-full flex items-center justify-between p-3 text-sm font-medium transition-colors rounded-lg ${isActive ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' : 'text-slate-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'}`}
                                >
                                    {main.label}
                                    {isActive && main.hasSub ? <ChevronUp size={16} /> : (main.hasSub ? <ChevronDown size={16} className="opacity-50" /> : null)}
                                </button>

                                <AnimatePresence>
                                    {isActive && main.hasSub && (
                                        <motion.div 
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="pl-4 pr-2 py-2 space-y-1 border-l-2 border-blue-100 dark:border-white/10 ml-4 mt-1">
                                                {SUB_CATEGORIES.map((sub) => (
                                                    <button
                                                        key={sub.value}
                                                        onClick={() => handleSubFilterClick(sub.value)}
                                                        className={`w-full text-left px-3 py-1.5 text-xs rounded-md transition-all ${activeSubFilter === sub.value ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 font-bold' : 'text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5'}`}
                                                    >
                                                        {sub.name}
                                                    </button>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    })}
                  </div>
              </div>
            </aside>

            <main id="tour-feed" className="flex-1">
               <button 
                  id="tour-filters-mobile"
                  onClick={() => setIsFilterOpen(true)}
                  className="lg:hidden w-full mb-6 flex items-center justify-center gap-2 bg-white dark:bg-[#112240] border border-gray-200 dark:border-white/10 p-4 rounded-xl font-bold text-slate-700 dark:text-white hover:bg-gray-50 transition-colors shadow-sm"
               >
                  <Filter size={20} className="text-black dark:text-white" /> 
                  {activeMainFilter.toUpperCase()} {activeSubFilter !== 'all' && `> ${activeSubFilter}`}
               </button>

               {/* 🔥 REF ASSIGNED HERE */}
               <div ref={jobsHeadingRef} className="flex items-center justify-between mb-6 pt-2">
                  <h1 className="text-2xl font-bold flex items-center gap-2 uppercase tracking-tight">
                    <XLogo className="w-6 h-6 text-black dark:text-white" /> 
                    {searchQuery ? `Results: "${searchQuery}"` : `${activeMainFilter} Feed`}
                  </h1>
                  <p className="text-slate-500 dark:text-gray-400 text-sm">
                    {loading ? "Scanning..." : `${filteredJobs.length} posts found`}
                  </p>
               </div>

               {loading ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                   {[1,2,3,4,5,6,7,8,9].map(i => <div key={i} className="h-64 bg-gray-200 dark:bg-[#112240] rounded-xl animate-pulse"></div>)}
                 </div>
               ) : (
                 <>
                   {filteredJobs.length === 0 ? (
                       <div className="text-center py-20">
                           <p className="text-slate-500 text-lg">No jobs found matching your filters.</p>
                           <button onClick={() => {setSearchQuery(""); setActiveSubFilter("all"); updateUrl({ search: '', sub: 'all' }); }} className="mt-4 text-blue-600 font-bold hover:underline">Clear Filters</button>
                       </div>
                   ) : (
                   <div className="relative">
                       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-start">
                          {jobsToRender.map((job, index) => {
                              const isActive = activeId === job.job_id;
                              const isExpanded = expandedId === job.job_id;
                              const isSpotlight = !!job.isSpotlight;
                              const tourId = index === 0 ? 'tour-feed-start' : (isSpotlight ? 'tour-spotlight' : undefined);

                              return (
                                <motion.div 
                                  key={job.job_id} 
                                  id={tourId}
                                  layout={!isMobile} 
                                  
                                  style={{ WebkitTransform: "translateZ(0)" }}
                                  
                                  whileHover={!isMobile ? { 
                                      scale: 1.02, 
                                      y: -5, 
                                      boxShadow: isSpotlight 
                                        ? "0px 10px 30px rgba(16, 185, 129, 0.4)" 
                                        : "0px 10px 20px rgba(0,0,0,0.1)" 
                                  } : {}}
                                  
                                  whileTap={{ scale: 0.98 }}
                                  
                                  onClick={() => {
                                    sessionStorage.setItem('instant_job_data', JSON.stringify(job));
                                    handleJobClick(job.job_id);
                                    router.push(`/x-jobs/${job.job_id}`);
                                  }}
                                  
                                  animate={isActive ? { 
                                      borderColor: isSpotlight ? "#10B981" : "#0a66c2", 
                                      boxShadow: isSpotlight 
                                        ? "0px 0px 20px rgba(16, 185, 129, 0.4)" 
                                        : "0px 0px 15px rgba(10, 102, 194, 0.2)" 
                                  } : { 
                                      borderColor: isSpotlight ? "#34D399" : "rgba(255,255,255,0.05)", 
                                      y: 0, 
                                      boxShadow: isSpotlight ? "0px 4px 15px rgba(16, 185, 129, 0.15)" : "none" 
                                  }}
                                  
                                  className={`
                                    rounded-xl border p-5 cursor-pointer flex flex-col relative overflow-hidden transition-colors
                                    ${isSpotlight 
                                        ? 'bg-gradient-to-br from-emerald-50 via-white to-emerald-50 dark:from-emerald-950/30 dark:via-[#112240] dark:to-emerald-950/10 border-emerald-400 dark:border-emerald-500/50' 
                                        : 'bg-white dark:bg-[#112240] border-gray-200 dark:border-white/5'}
                                    ${isActive ? 'z-10' : ''}
                                  `}
                                >
                                  
                                  {isSpotlight && (
                                    <div className="absolute top-0 right-0 z-20">
                                        <div className="bg-emerald-500 text-white text-[9px] font-extrabold px-3 py-1 rounded-bl-xl shadow-sm flex items-center gap-1 tracking-wider">
                                            <Zap size={10} fill="currentColor" /> SPOTLIGHT
                                        </div>
                                    </div>
                                  )}

                                  <div className="flex justify-between items-start mb-4">
                                      <img 
                                          src={job.employer_logo || "https://upload.wikimedia.org/wikipedia/commons/c/ce/X_logo_2023.svg"} 
                                          alt="Logo" 
                                          className="w-10 h-10 rounded-full shadow-sm object-contain bg-white p-1" 
                                      />
                                      <div className={`flex flex-col items-end gap-1 ${isSpotlight ? 'mt-6' : ''}`}>
                                        <span className="text-[10px] font-bold px-2 py-1 rounded uppercase bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                                          {job.category || "Job"}
                                        </span>
                                        <span className="text-[9px] flex items-center gap-0.5 text-green-600 dark:text-green-400 font-bold uppercase tracking-tighter">
                                          <CheckCircle size={10} /> Email Included
                                        </span>
                                      </div>
                                  </div>
                                  
                                  <h3 className={`font-bold text-lg leading-tight mb-1 flex items-center gap-2 ${isSpotlight ? 'text-emerald-800 dark:text-emerald-100' : 'text-slate-900 dark:text-white'}`}>
                                    {job.job_title}
                                    {isSpotlight && <Sparkles size={14} className="text-emerald-500 fill-emerald-500 animate-pulse" />}
                                  </h3>
                                  <p className="text-sm font-medium text-slate-600 dark:text-gray-300 mb-3">@{job.employer_name || "Hiring Manager"}</p>
                                  
                                  <div className="flex flex-wrap gap-2 mb-4">
                                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-[11px] font-bold uppercase tracking-wide ${isSpotlight ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200' : 'bg-gray-100 dark:bg-white/5 text-slate-500 dark:text-gray-400'}`}>
                                      <MapPin size={10} /> {job.work_mode || "Remote"} / {job.country || "Global"}
                                    </span>
                                  </div>
                                  
                                  <div className="text-xs text-slate-500 dark:text-gray-400 mb-4 relative">
                                    <p className={isExpanded ? "whitespace-pre-wrap" : "line-clamp-3"}>{job.text}</p>
                                    {job.text && job.text.length > 100 && (
                                      <button onClick={(e) => toggleExpand(e, job.job_id)} className="text-[#0a66c2] font-bold mt-1 hover:underline focus:outline-none">
                                        {isExpanded ? "Show less" : "Read thread..."}
                                      </button>
                                    )}
                                  </div>

                                  <div className={`mt-auto pt-4 border-t flex items-center justify-between ${isSpotlight ? 'border-emerald-200 dark:border-emerald-800/30' : 'border-gray-100 dark:border-white/5'}`}>
                                      <div>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase">Source</p>
                                        <p className="text-xs font-bold text-teal-600 dark:text-teal-400 flex items-center gap-1">Verified Community</p>
                                      </div>
                                      <button 
                                          onClick={(e) => {
                                              e.stopPropagation(); 
                                              handleApplyClick(e, job.job_id, job.apply_link);
                                              sessionStorage.setItem('instant_job_data', JSON.stringify(job));
                                              router.push(`/x-jobs/${job.job_id}`);
                                          }}
                                          className={`${isSpotlight ? 'bg-emerald-600 text-white hover:bg-emerald-500' : 'bg-[#0A192F] dark:bg-white text-white dark:text-[#0A192F]'} px-4 py-2 rounded-lg text-xs font-bold hover:opacity-90 transition-opacity flex items-center gap-1 shadow-sm`}
                                      >
                                            Apply Direct <ArrowRight size={12} />
                                      </button>
                                  </div>
                                </motion.div>
                              );
                          })}
                       </div>

                        {/* 🔥 LOGIN WALL RENDER 🔥 */}
                        {showLoginWall && (
                            <div className="relative mt-8">
                                <div className="absolute -top-32 left-0 w-full h-40 bg-gradient-to-b from-transparent to-[#f8f9fa] dark:to-[#0A192F] pointer-events-none z-10"></div>
                                <LoginWall />
                            </div>
                        )}
                   </div>
                   )}

                   {/* Hide pagination if Wall is shown */}
                   {!showLoginWall && filteredJobs.length > ITEMS_PER_PAGE && (
                     <div className="flex justify-center items-center gap-4 mt-10">
                        <button onClick={goToPrevPage} disabled={currentPage === 1} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white dark:bg-[#112240] border border-gray-200 dark:border-white/10 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 font-medium text-sm"><ChevronLeft size={16} /> Previous</button>
                        <span className="text-sm font-bold text-slate-600 dark:text-gray-400">Page {currentPage} of {totalPages}</span>
                        <button onClick={goToNextPage} disabled={currentPage === totalPages} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white dark:bg-[#112240] border border-gray-200 dark:border-white/10 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 font-medium text-sm">Next <ChevronRight size={16} /></button>
                     </div>
                   )}
                 </>
               )}
            </main>
          </div>

          <AnimatePresence>
            {isFilterOpen && (
              <>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsFilterOpen(false)} className="fixed inset-0 bg-black/60 z-[60] lg:hidden" />
                <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "tween", duration: 0.3 }} className="fixed right-0 top-0 bottom-0 w-[85%] max-w-sm bg-white dark:bg-[#0A192F] z-[70] shadow-2xl lg:hidden flex flex-col">
                   <div className="p-5 border-b border-gray-100 dark:border-white/10 flex justify-between items-center bg-gray-50 dark:bg-white/5">
                      <h3 className="font-bold text-lg uppercase tracking-tighter">Filter Jobs</h3>
                      <button onClick={() => setIsFilterOpen(false)} className="p-2 bg-gray-200 dark:bg-white/10 rounded-full"><X size={20} /></button>
                   </div>
                   <div className="p-6 overflow-y-auto flex-1">
                      {MAIN_FILTERS.map((main) => {
                          const isActive = activeMainFilter === main.id;
                          return (
                            <div key={main.id} className="mb-4">
                                <button 
                                    onClick={() => handleMainFilterClick(main.id)}
                                    className={`w-full flex items-center justify-between p-4 text-base font-bold rounded-xl transition-all ${isActive ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20' : 'bg-gray-50 dark:bg-white/5 text-slate-700 dark:text-white'}`}
                                >
                                    {main.label}
                                    {isActive && main.hasSub ? <ChevronUp size={20} /> : (main.hasSub ? <ChevronDown size={20} /> : null)}
                                </button>
                                
                                <AnimatePresence>
                                    {isActive && main.hasSub && (
                                        <motion.div 
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="mt-2 ml-4 space-y-2 border-l-2 border-gray-200 dark:border-white/10 pl-4">
                                                {SUB_CATEGORIES.map((sub) => (
                                                    <button
                                                        key={sub.value}
                                                        onClick={() => { handleSubFilterClick(sub.value); setIsFilterOpen(false); }}
                                                        className={`block w-full text-left py-2 px-3 rounded-lg text-sm ${activeSubFilter === sub.value ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 font-bold' : 'text-slate-600 dark:text-gray-400'}`}
                                                    >
                                                        {sub.name}
                                                    </button>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                          );
                      })}
                   </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
    </>
  );
}

export default function XJobsPage() {
  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#0A192F] text-slate-900 dark:text-white font-sans relative">
      <Suspense fallback={<div className="text-center py-20 text-white">Loading Search...</div>}>
         <XJobsContent />
      </Suspense>
    </div>
  );
}
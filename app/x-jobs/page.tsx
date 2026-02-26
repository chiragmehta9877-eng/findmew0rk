'use client';

import React, { useState, useEffect, useLayoutEffect, useRef, Suspense, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { MapPin, ArrowRight, Filter, ChevronLeft, ChevronRight, X, CheckCircle, ChevronDown, ChevronUp, Zap, Sparkles, List, Navigation, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar'; 
import JobHero from '@/components/JobHero'; 
import { useSession } from 'next-auth/react';
import LoginWall from '@/components/LoginWall'; 

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

const DOMAINS_MAP: Record<string, string> = { 
  'za':'South Africa', 'uk':'UK', 'in':'India', 'au':'Australia', 'sg':'Singapore', 'ae':'UAE', 
  'ng':'Nigeria', 'ke':'Kenya', 'id':'Indonesia', 'nl':'Netherlands', 'de':'Germany', 'fr':'France', 
  'it':'Italy', 'es':'Spain', 'ca':'Canada', 'nz':'New Zealand', 'my':'Malaysia', 'ph':'Philippines', 
  'pk':'Pakistan', 'bd':'Bangladesh', 'lk':'Sri Lanka', 'np':'Nepal', 'gh':'Ghana', 'ug':'Uganda', 
  'tz':'Tanzania', 'zm':'Zambia', 'ie': 'Ireland', 'ch': 'Switzerland', 'se': 'Sweden', 'no': 'Norway', 
  'fi': 'Finland', 'dk': 'Denmark', 'pl': 'Poland', 'be': 'Belgium', 'pt': 'Portugal', 'at': 'Austria',
  'gr': 'Greece', 'cz': 'Czech Republic', 'hu': 'Hungary', 'ro': 'Romania', 'tr': 'Turkey', 'eg': 'Egypt', 
  'ma': 'Morocco', 'br': 'Brazil', 'mx': 'Mexico', 'ar': 'Argentina', 'cl': 'Chile' 
};

const PHONE_CODES_MAP: Record<string, string> = { 
  '+44':'UK', '+91':'India', '+61':'Australia', '+65':'Singapore', '+971':'UAE', '+234':'Nigeria', 
  '+254':'Kenya', '+27':'South Africa', '+62':'Indonesia', '+31':'Netherlands', '+49':'Germany', 
  '+33':'France', '+39':'Italy', '+34':'Spain', '+64':'New Zealand', '+60':'Malaysia', '+63':'Philippines', 
  '+92':'Pakistan', '+880':'Bangladesh', '+94':'Sri Lanka', '+977':'Nepal', '+233':'Ghana', '+256':'Uganda', 
  '+255':'Tanzania', '+260':'Zambia', '+353':'Ireland', '+41':'Switzerland', '+46':'Sweden', '+47':'Norway', 
  '+45':'Denmark', '+358':'Finland', '+32':'Belgium', '+351':'Portugal', '+43':'Austria', '+30':'Greece',
  '+420':'Czech', '+36':'Hungary', '+40':'Romania', '+90':'Turkey', '+20':'Egypt', '+212':'Morocco',
  '+55':'Brazil', '+52':'Mexico', '+54':'Argentina', '+56':'Chile', '+57':'Colombia'
};

const COUNTRY_DICT: Record<string, string[]> = {
  "USA": ["usa", "united states", "new york", "nyc", "san francisco", "sf", "bay area", "silicon valley", "california", "texas", "seattle", "chicago", "boston", "austin", "miami", "florida", "washington", "colorado", "remote us"],
  "UK": ["uk", "united kingdom", "london", "manchester", "birmingham", "edinburgh", "england", "scotland", "wales", "remote uk"],
  "India": ["india", "ind", "panindia", "pan india", "bangalore", "bengaluru", "delhi", "new delhi", "ncr", "noida", "gurugram", "gurgaon", "mumbai", "pune", "hyderabad", "chennai", "kolkata", "ahmedabad", "maharashtra", "karnataka", "tamil nadu", "gujarat", "kerala", "haryana", "punjab"],
  "Canada": ["canada", "toronto", "vancouver", "montreal", "calgary", "ontario", "bc", "british columbia", "alberta"],
  "Australia": ["australia", "sydney", "melbourne", "brisbane", "perth", "nsw", "victoria", "queensland"],
  "Germany": ["germany", "berlin", "munich", "hamburg", "frankfurt", "deutschland"],
  "Netherlands": ["netherlands", "amsterdam", "rotterdam", "dutch"],
  "France": ["france", "paris", "lyon", "marseille"],
  "Spain": ["spain", "madrid", "barcelona", "valencia"],
  "Italy": ["italy", "rome", "milan", "milano", "naples"],
  "Belgium": ["belgium", "brussels", "antwerp"],
  "Portugal": ["portugal", "lisbon", "porto"],
  "Austria": ["austria", "vienna"],
  "Switzerland": ["switzerland", "zurich", "geneva"],
  "Ireland": ["ireland", "dublin"],
  "Sweden": ["sweden", "stockholm"],
  "Norway": ["norway", "oslo"],
  "Denmark": ["denmark", "copenhagen"],
  "Finland": ["finland", "helsinki"],
  "Poland": ["poland", "warsaw", "krakow"],
  "Greece": ["greece", "athens"],
  "Singapore": ["singapore", "sg"],
  "UAE": ["uae", "united arab emirates", "dubai", "abu dhabi"],
  "Saudi Arabia": ["saudi arabia", "riyadh", "jeddah", "ksa"],
  "Qatar": ["qatar", "doha"],
  "Nigeria": ["nigeria", "lagos", "abuja", "vi, lagos"],
  "Kenya": ["kenya", "nairobi", "mombasa"],
  "South Africa": ["south africa", "capetown", "johannesburg", "pretoria", "durban", "rsa"],
  "Egypt": ["egypt", "cairo", "alexandria"],
  "Morocco": ["morocco", "casablanca"],
  "Indonesia": ["indonesia", "jakarta", "bali", "surabaya", "makassar", "kirim lamaran", "loker"],
  "Malaysia": ["malaysia", "kuala lumpur", "kl"],
  "Philippines": ["philippines", "manila", "makati", "cebu"],
  "Pakistan": ["pakistan", "karachi", "lahore", "islamabad"],
  "Bangladesh": ["bangladesh", "dhaka"],
  "New Zealand": ["new zealand", "auckland", "wellington", "nz"],
  "Mexico": ["mexico", "mexico city"],
  "Brazil": ["brazil", "sao paulo", "rio de janeiro"],
  "Argentina": ["argentina", "buenos aires"],
  "Colombia": ["colombia", "bogota"],
  "Chile": ["chile", "santiago"],
  "Japan": ["japan", "tokyo", "osaka"],
  "South Korea": ["south korea", "seoul"],
  "Europe": ["europe", "eu"]
};

const PRECOMPILED_COUNTRY_REGEXES = Object.entries(COUNTRY_DICT).map(([country, keywords]) => ({
  country,
  regex: new RegExp(`\\b(${keywords.join('|')})\\b`, 'i')
}));


const TourGuide = ({ onComplete }: { onComplete: () => void }) => {
  const { data: session, status } = useSession();
  const [step, setStep] = useState(0);
  const [rect, setRect] = useState({ top: 0, left: 0, width: 0, height: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRunTour, setShouldRunTour] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
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

  const updateRectOnly = useCallback(() => {
    if (isTransitioning) return; 
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
        ticking.current = false; 
      });
      ticking.current = true; 
    }
  }, [step, isTransitioning]);

  useEffect(() => {
    if (!shouldRunTour) return;
    window.addEventListener('scroll', updateRectOnly, { passive: true }); 
    window.addEventListener('resize', updateRectOnly);
    return () => {
      window.removeEventListener('scroll', updateRectOnly);
      window.removeEventListener('resize', updateRectOnly);
    };
  }, [updateRectOnly, shouldRunTour]);

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
            animate={{ opacity: 1, scale: 1, top: rect.top - 6, left: rect.left - 6, width: rect.width + 12, height: rect.height + 12 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: isTransitioning ? 100 : 800, damping: isTransitioning ? 20 : 50 }}
            style={{ boxShadow: "0 0 0 99999px rgba(0, 0, 0, 0.75)", willChange: "top, left, width, height" }}
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
                <button onClick={handleNext} className="w-full py-3 rounded-xl bg-gradient-to-r from-[#10B981] to-[#059669] hover:from-[#059669] hover:to-[#047857] text-white font-bold text-sm shadow-lg shadow-[#064e3b]/50 transition-all active:scale-95 flex items-center justify-center gap-2">
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

const XLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const SUB_CATEGORIES = [
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

const CustomCheckbox = ({ checked }: { checked: boolean }) => (
  <div className={`w-4 h-4 rounded-[4px] flex items-center justify-center shrink-0 transition-colors ${checked ? 'bg-[#0a66c2] border-transparent text-white shadow-sm' : 'border-[1.5px] border-slate-300 dark:border-slate-600 bg-transparent'}`}>
    {checked && <Check size={12} strokeWidth={4} />}
  </div>
);

function XJobsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession(); 
  
  const [isMounted, setIsMounted] = useState(false);
  const [jobs, setJobs] = useState<any[]>(() => {
      if (typeof window !== 'undefined') {
          try {
              const cached = sessionStorage.getItem('xjobs_data_cache_v1');
              if (cached) return JSON.parse(cached);
          } catch(e) {}
      }
      return [];
  }); 
  const [loading, setLoading] = useState(() => jobs.length === 0);
  
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeMainFilter, setActiveMainFilter] = useState(searchParams.get('main') || "job"); 
  const [activeSubFilters, setActiveSubFilters] = useState<string[]>(searchParams.get('sub')?.split(',').filter(Boolean) || []); 
  const [activeCountries, setActiveCountries] = useState<string[]>(searchParams.get('country')?.split(',').filter(Boolean) || []); 
  const [activeWorkModes, setActiveWorkModes] = useState<string[]>(searchParams.get('mode')?.split(',').filter(Boolean) || []); 
  const [isSpotlightOnly, setIsSpotlightOnly] = useState(searchParams.get('spotlight') === 'true');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || ""); 
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get('page')) || 1);

  const [isWorkModeExpanded, setIsWorkModeExpanded] = useState(false);
  const [isLocationExpanded, setIsLocationExpanded] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(true);

  const [showTour, setShowTour] = useState(false);
  const jobsHeadingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setActiveMainFilter(searchParams.get('main') || "job");
    setActiveSubFilters(searchParams.get('sub')?.split(',').filter(Boolean) || []);
    setActiveCountries(searchParams.get('country')?.split(',').filter(Boolean) || []);
    setActiveWorkModes(searchParams.get('mode')?.split(',').filter(Boolean) || []);
    setIsSpotlightOnly(searchParams.get('spotlight') === 'true');
    setSearchQuery(searchParams.get('search') || "");
    setCurrentPage(Number(searchParams.get('page')) || 1);
  }, [searchParams]);

  useIsomorphicLayoutEffect(() => {
      setIsMounted(true);
  }, []);

  useIsomorphicLayoutEffect(() => {
    if (isMounted && !loading && typeof window !== 'undefined') {
      if (sessionStorage.getItem('scroll_to_feed') === 'true') {
        
        const snapAggressively = () => {
          if (jobsHeadingRef.current) {
            const yOffset = -120;
            const elementY = jobsHeadingRef.current.getBoundingClientRect().top + window.scrollY + yOffset;
            window.scrollTo({ top: elementY, left: 0, behavior: 'auto' }); 
          }
        };

        snapAggressively();
        
        requestAnimationFrame(() => {
          snapAggressively();
          setTimeout(() => {
            snapAggressively();
            sessionStorage.removeItem('scroll_to_feed');
          }, 10);
        });
      }
    }
  }, [isMounted, loading]);

  const scrollToFeed = useCallback((instant = false) => {
      if (jobsHeadingRef.current) {
          const yOffset = -120;
          const elementY = jobsHeadingRef.current.getBoundingClientRect().top + window.scrollY + yOffset;
          window.scrollTo({ top: elementY, behavior: instant ? 'auto' : 'smooth' });
      }
  }, []);

  useEffect(() => {
    if (status === 'loading') return;
    if (status === 'unauthenticated') sessionStorage.removeItem('tour_seen_v8');
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
  };

  const handleApplyClick = (e: React.MouseEvent, jobId: string, url: string) => {
    e.stopPropagation(); 
    handleJobClick(jobId);
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
    scrollToFeed();
  };

  useEffect(() => {
    const checkIsMobile = () => setIsMobile(window.innerWidth < 768);
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  const fetchJobs = useCallback((hasCache = false) => {
    if (!hasCache) setLoading(true);
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
            setLoading(false);
            try { sessionStorage.setItem('xjobs_data_cache_v1', JSON.stringify(sortedJobs)); } catch(e){}
         } else {
             setLoading(false);
         }
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (isMounted) {
       let hasCache = false;
       try {
           const cached = sessionStorage.getItem('xjobs_data_cache_v1');
           if (cached) {
               const parsed = JSON.parse(cached);
               if (parsed && parsed.length > 0) hasCache = true;
           }
       } catch(e) {}

       const timer = setTimeout(() => {
           fetchJobs(hasCache);
       }, 50);

       return () => clearTimeout(timer);
    }
  }, [isMounted, fetchJobs]);

  const getLocation = useCallback((job: any) => {
      if (!job) return "Other";
      const genericRegex = /^(global|anywhere|remote|wfh|any|unspecified)$/i;
      
      const scanTextForCountry = (txt: string) => {
          if (!txt) return null;
          const lowerTxt = txt.toLowerCase();

          const domainMatch = lowerTxt.match(/\.([a-z]{2})\b/);
          if (domainMatch && DOMAINS_MAP[domainMatch[1]]) return DOMAINS_MAP[domainMatch[1]];

          for (const code in PHONE_CODES_MAP) {
              if (txt.includes(code)) return PHONE_CODES_MAP[code];
          }
          if (txt.includes('+1 ') || txt.includes('+1-') || txt.includes('+1(')) return "USA";

          const cleanTxt = lowerTxt
              .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/gi, '')
              .replace(/https?:\/\/[^\s]+/gi, '');

          for (const { country, regex } of PRECOMPILED_COUNTRY_REGEXES) {
              if (regex.test(cleanTxt)) {
                  return country;
              }
          }
          
          return null;
      };

      const dbCountry = job.country ? job.country.trim() : "";
      if (dbCountry && !genericRegex.test(dbCountry)) {
          const mapped = scanTextForCountry(dbCountry);
          if (mapped) return mapped;
          return dbCountry.charAt(0).toUpperCase() + dbCountry.slice(1).toLowerCase();
      }

      const dbCity = job.job_city ? job.job_city.trim() : "";
      if (dbCity && !genericRegex.test(dbCity)) {
          const mapped = scanTextForCountry(dbCity);
          if (mapped) return mapped;
          return dbCity.charAt(0).toUpperCase() + dbCity.slice(1).toLowerCase();
      }

      const fullText = (job.text + " " + (job.job_title || "")).toLowerCase();
      const textMatch = scanTextForCountry(fullText);
      if (textMatch) return textMatch;

      return "Other"; 
  }, []);

  const getWorkMode = useCallback((job: any) => {
      const txt = (job.text + " " + (job.job_title || "") + " " + (job.work_mode || "")).toLowerCase();
      if(txt.match(/\b(remote|wfh|work from home|telecommute|anywhere)\b/)) return "Remote";
      if(txt.match(/\b(hybrid)\b/)) return "Hybrid";
      if(txt.match(/\b(onsite|on-site|in-office|in office|office)\b/)) return "Onsite";
      return "Unspecified";
  }, []);

  const uniqueCountries = useMemo(() => {
      const locations = new Set<string>();
      jobs.forEach(job => {
          const loc = getLocation(job);
          if (loc && loc !== 'Other') {
              locations.add(loc);
          }
      });
      return [...Array.from(locations).sort(), "Other"];
  }, [jobs, getLocation]);

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

    if (isSpotlightOnly) {
        result = result.filter(job => job.isSpotlight);
    }

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

    if (activeSubFilters.length > 0) {
        result = result.filter(job => {
            const dbCat = (job.category || "").toLowerCase();
            const textToScan = (job.text + " " + (job.job_title || "")).toLowerCase();
            
            const cleanText = textToScan
                .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/gi, '')
                .replace(/https?:\/\/[^\s]+/gi, '');

            return activeSubFilters.some(subKey => {
                const s = subKey.toLowerCase();
                let regex: RegExp;

                switch (s) {
                    case 'software': regex = /\b(software|it|developer|engineer|java|python|react|node|frontend|backend|full stack|data scientist|ai|cloud|devops)\b/i; break;
                    case 'finance': regex = /\b(finance|accountant|accounting|audit|taxation|treasury|banking|investment|cfa|ca|cpa|bookkeeper)\b/i;
                    const hasCurrencyOnly = /\b(inr|usd|gbp|eur|salary|stipend)\b/i.test(cleanText);
                    const hasCoreFinanceRole = /\b(accountant|audit|tax|banking|cfa|treasury)\b/i.test(cleanText);
                    if (hasCurrencyOnly && !hasCoreFinanceRole && !/\bfinance\b/i.test(cleanText)) {
                        return false;
                    }
                    break;
                    case 'management': regex = /\b(manager|management|business analyst|project manager|product manager|consultant|strategy|operations|executive)\b/i; break;
                    case 'hr': regex = /\b(hr|human resources|recruiter|talent acquisition|hiring manager)\b/i;
                    const isSalaryHr = /\d+\s*\/hr|\d+\s*\/hour/i.test(cleanText);
                    if (isSalaryHr && !/\b(human resources|recruiter)\b/i.test(cleanText)) {
                        return false;
                    }
                    break;
                    case 'marketing': regex = /\b(marketing|sales|brand|content|seo|social media|growth|advertising|pr|digital marketing)\b/i; break;
                    case 'esg': regex = /\b(esg|sustainability|climate|carbon|environment|green|energy|csr|net zero)\b/i; break;
                    case 'commerce': regex = /\b(e-commerce|ecommerce|shopify|marketplace|amazon|logistics|supply chain)\b/i; break;
                    case 'design': regex = /\b(design|designer|ui|ux|graphic|creative|architect|interior|visual|graphics)\b/i; break;
                    case 'research': regex = /\b(research|analyst|data analyst|economist|scientist|policy|market research)\b/i; break;
                    case 'other': regex = /\b(admin|support|customer service|legal|compliance|office|assistant)\b/i; break;
                    default: regex = new RegExp(`\\b${s}\\b`, 'i');
                }

                const isStrongDbCat = dbCat && !['general', 'job', 'internship', 'other', 'unspecified'].includes(dbCat);

                if (isStrongDbCat) {
                    if (regex.test(dbCat) || dbCat.includes(s) || s.includes(dbCat)) return true;
                    return false; 
                }

                return regex.test(cleanText);
            });
        });
    }

    if (activeCountries.length > 0) {
        result = result.filter(job => activeCountries.includes(getLocation(job)));
    }

    if (activeWorkModes.length > 0) {
        result = result.filter(job => activeWorkModes.includes(getWorkMode(job)));
    }

    return result;
  }, [searchQuery, jobs, activeMainFilter, activeSubFilters, activeCountries, activeWorkModes, isSpotlightOnly, getLocation, getWorkMode]);

  const toggleArraySelection = (currentArray: string[], setter: React.Dispatch<React.SetStateAction<string[]>>, val: string, paramKey: string) => {
      let next: string[]; 
      if (val === 'all') {
          next = [];
      } else {
          if (currentArray.includes(val)) next = currentArray.filter(item => item !== val);
          else next = [...currentArray, val];
      }
      
      setter(next);
      setCurrentPage(1);
      updateUrl({ [paramKey]: next.join(','), page: '1' });
      scrollToFeed();
  };

  const handleCountryToggle = (val: string) => toggleArraySelection(activeCountries, setActiveCountries, val, 'country');
  const handleWorkModeToggle = (val: string) => toggleArraySelection(activeWorkModes, setActiveWorkModes, val, 'mode');
  const handleSubFilterToggle = (val: string) => toggleArraySelection(activeSubFilters, setActiveSubFilters, val, 'sub');

  const handleSpotlightToggle = () => {
    const newVal = !isSpotlightOnly;
    setIsSpotlightOnly(newVal);
    setCurrentPage(1);
    updateUrl({ spotlight: newVal ? 'true' : '', page: '1' });
    scrollToFeed();
  };

  const handleMainFilterClick = (id: string) => {
    setActiveMainFilter(id);
    setActiveSubFilters([]); 
    setCurrentPage(1);
    updateUrl({ main: id, sub: '', page: '1' });
    scrollToFeed();
  };

  const resetAllFilters = () => {
    setActiveMainFilter("job"); 
    setActiveSubFilters([]); 
    setActiveCountries([]);
    setActiveWorkModes([]);
    setIsSpotlightOnly(false);
    searchParams.get('search') ? updateUrl({ main: 'job', sub: '', country: '', mode: '', spotlight: '', page: '1' }) : updateUrl({ main: 'job', sub: '', country: '', mode: '', spotlight: '', search: '', page: '1' });
    scrollToFeed();
  };

  const showLoginWall = status === 'unauthenticated';
  
  const jobsToRender = showLoginWall 
      ? filteredJobs.slice(0, 6) 
      : filteredJobs.slice((currentPage - 1) * ITEMS_PER_PAGE, (currentPage - 1) * ITEMS_PER_PAGE + ITEMS_PER_PAGE);

  const totalPages = Math.ceil(filteredJobs.length / ITEMS_PER_PAGE);

  const goToNextPage = () => { 
    if (currentPage < totalPages) {
        const nextPage = currentPage + 1;
        setCurrentPage(nextPage);
        updateUrl({ page: String(nextPage) });

        // wait for DOM update then smooth scroll
        setTimeout(() => {
            scrollToFeed(false); // smooth
        }, 50);
    }
};

const goToPrevPage = () => { 
    if (currentPage > 1) {
        const prevPage = currentPage - 1;
        setCurrentPage(prevPage);
        updateUrl({ page: String(prevPage) });

        setTimeout(() => {
            scrollToFeed(false); // smooth
        }, 50);
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
                      <button onClick={resetAllFilters} className="text-xs text-blue-600 cursor-pointer hover:underline focus:outline-none">Reset</button>
                  </div>
                  
                  <div className="p-4 space-y-2">
                    
                    <label className="flex items-center gap-3 p-3 mb-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-xl cursor-pointer border border-emerald-100 dark:border-emerald-800/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/20 transition-colors group">
                        <div className="relative flex items-center justify-center w-4 h-4">
                            <input type="checkbox" checked={isSpotlightOnly} onChange={handleSpotlightToggle} className="peer appearance-none w-4 h-4 border-[1.5px] border-emerald-400 dark:border-emerald-600 rounded bg-white dark:bg-black/20 checked:bg-emerald-500 checked:border-emerald-500 transition-all cursor-pointer" />
                            <Check size={12} strokeWidth={4} className="text-white absolute pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" />
                        </div>
                        <span className="text-sm font-extrabold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                            <Zap size={16} className="fill-emerald-500 text-emerald-500" /> Spotlight Jobs
                        </span>
                    </label>

                    <div className="h-px w-full bg-gray-100 dark:bg-white/5 mb-4"></div>

                    <div className="rounded-lg overflow-hidden mb-2">
                        <button 
                            onClick={() => setIsLocationExpanded(!isLocationExpanded)}
                            className={`w-full flex items-center justify-between p-3 text-sm font-medium transition-colors rounded-lg ${activeCountries.length > 0 ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' : 'text-slate-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'}`}
                        >
                            Location {activeCountries.length > 0 && <span className="ml-1 text-[10px] font-bold px-1.5 py-0.5 bg-blue-100 dark:bg-blue-800/50 rounded-md">{activeCountries.length}</span>}
                            {isLocationExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} className="opacity-50" />}
                        </button>
                        <AnimatePresence>
                            {isLocationExpanded && (
                                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                    <div className="pl-4 pr-2 py-2 space-y-1 border-l-2 border-blue-100 dark:border-white/10 ml-4 mt-1 max-h-48 overflow-y-auto custom-scrollbar">
                                        <button onClick={() => handleCountryToggle('all')} className={`w-full text-left px-3 py-2 text-xs rounded-md transition-all flex items-center gap-3 ${activeCountries.length === 0 ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 font-bold' : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5'}`}>
                                            <CustomCheckbox checked={activeCountries.length === 0} /> All Locations
                                        </button>
                                        {uniqueCountries.map(loc => (
                                            <button key={loc} onClick={() => handleCountryToggle(loc)} className={`w-full text-left px-3 py-2 text-xs rounded-md transition-all flex items-center gap-3 ${activeCountries.includes(loc) ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 font-bold' : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5'}`}>
                                                <CustomCheckbox checked={activeCountries.includes(loc)} /> <span className="truncate">{loc}</span>
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="rounded-lg overflow-hidden mb-2">
                        <button 
                            onClick={() => setIsWorkModeExpanded(!isWorkModeExpanded)}
                            className={`w-full flex items-center justify-between p-3 text-sm font-medium transition-colors rounded-lg ${activeWorkModes.length > 0 ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' : 'text-slate-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'}`}
                        >
                            Work Mode {activeWorkModes.length > 0 && <span className="ml-1 text-[10px] font-bold px-1.5 py-0.5 bg-blue-100 dark:bg-blue-800/50 rounded-md">{activeWorkModes.length}</span>}
                            {isWorkModeExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} className="opacity-50" />}
                        </button>
                        <AnimatePresence>
                            {isWorkModeExpanded && (
                                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                    <div className="pl-4 pr-2 py-2 space-y-1 border-l-2 border-blue-100 dark:border-white/10 ml-4 mt-1">
                                        <button onClick={() => handleWorkModeToggle('all')} className={`w-full text-left px-3 py-2 text-xs rounded-md transition-all flex items-center gap-3 ${activeWorkModes.length === 0 ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 font-bold' : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5'}`}>
                                            <CustomCheckbox checked={activeWorkModes.length === 0} /> All Modes
                                        </button>
                                        {['Remote', 'Hybrid', 'Onsite'].map(mode => (
                                            <button key={mode} onClick={() => handleWorkModeToggle(mode)} className={`w-full text-left px-3 py-2 text-xs rounded-md transition-all flex items-center gap-3 ${activeWorkModes.includes(mode) ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 font-bold' : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5'}`}>
                                                <CustomCheckbox checked={activeWorkModes.includes(mode)} /> {mode}
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="h-px w-full bg-gray-100 dark:bg-white/5 my-4"></div>

                    <div className="space-y-2">
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
                                                    <button onClick={() => handleSubFilterToggle('all')} className={`w-full text-left px-3 py-2 text-xs rounded-md transition-all flex items-center gap-3 ${activeSubFilters.length === 0 ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 font-bold' : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5'}`}>
                                                        <CustomCheckbox checked={activeSubFilters.length === 0} /> All Categories
                                                    </button>
                                                    {SUB_CATEGORIES.map((sub) => (
                                                        <button
                                                            key={sub.value}
                                                            onClick={() => handleSubFilterToggle(sub.value)}
                                                            className={`w-full text-left px-3 py-2 text-xs rounded-md transition-all flex items-center gap-3 ${activeSubFilters.includes(sub.value) ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 font-bold' : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5'}`}
                                                        >
                                                            <CustomCheckbox checked={activeSubFilters.includes(sub.value)} /> <span className="truncate">{sub.name}</span>
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
              </div>
            </aside>

            <main id="tour-feed" className="flex-1">
               <button 
                  id="tour-filters-mobile"
                  onClick={() => setIsFilterOpen(true)}
                  className="lg:hidden w-full mb-6 flex items-center justify-center gap-2 bg-white dark:bg-[#112240] border border-gray-200 dark:border-white/10 p-4 rounded-xl font-bold text-slate-700 dark:text-white hover:bg-gray-50 transition-colors shadow-sm"
               >
                  <Filter size={20} className="text-black dark:text-white" /> 
                  Filters {(activeCountries.length > 0 || activeWorkModes.length > 0 || activeSubFilters.length > 0 || isSpotlightOnly) && <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-xs font-black">Active</span>}
               </button>

               <div ref={jobsHeadingRef} className="flex items-center justify-between mb-6 pt-2">
                  <h1 className="text-2xl font-bold flex items-center gap-2 uppercase tracking-tight">
                    <XLogo className="w-6 h-6 text-black dark:text-white" /> 
                    {searchQuery ? `Results: "${searchQuery}"` : `${activeMainFilter} Feed`}
                  </h1>
                  <p className="text-slate-500 dark:text-gray-400 text-sm">
                    {(!isMounted || loading) ? "Scanning..." : `${filteredJobs.length} posts found`}
                  </p>
               </div>

               {(!isMounted || loading) ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                   {[1,2,3,4,5,6,7,8,9].map(i => <div key={i} className="h-64 bg-gray-200 dark:bg-[#112240] rounded-xl animate-pulse"></div>)}
                 </div>
               ) : (
                 <>
                   {filteredJobs.length === 0 ? (
                       <div className="text-center py-20">
                           <p className="text-slate-500 text-lg">No jobs found matching your filters.</p>
                           <button onClick={resetAllFilters} className="mt-4 text-blue-600 font-bold hover:underline">Clear Filters</button>
                       </div>
                   ) : (
                   <div className="relative">
                       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-start">
                          {jobsToRender.map((job, index) => {
                              const isActive = activeId === job.job_id;
                              const isSpotlight = !!job.isSpotlight;
                              const tourId = index === 0 ? 'tour-feed-start' : (isSpotlight ? 'tour-spotlight' : undefined);
                              
                              const displayLocation = getLocation(job);
                              const displayMode = getWorkMode(job);

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
                                    router.push(`/x-jobs/${job.job_id}`, { scroll: true });
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
                                      <MapPin size={10} /> 
                                      {displayMode !== 'Unspecified' && <span className="text-blue-600 dark:text-blue-400">{displayMode} • </span>} 
                                      {displayLocation}
                                    </span>
                                  </div>
                                  
                                  <div className="text-xs text-slate-500 dark:text-gray-400 mb-4 relative">
                                    <p className="line-clamp-3 whitespace-pre-wrap">{job.text}</p>
                                    {job.text && job.text.length > 100 && (
                                      <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            sessionStorage.setItem('instant_job_data', JSON.stringify(job));
                                            handleJobClick(job.job_id);
                                            router.push(`/x-jobs/${job.job_id}`, { scroll: true });
                                        }} 
                                        className="text-[#0a66c2] font-bold mt-1 hover:underline focus:outline-none"
                                      >
                                        Read thread...
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
                                              router.push(`/x-jobs/${job.job_id}`, { scroll: true });
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

                        {showLoginWall && (
                            <div className="relative mt-8">
                                <div className="absolute -top-32 left-0 w-full h-40 bg-gradient-to-b from-transparent to-[#f8f9fa] dark:to-[#0A192F] pointer-events-none z-10"></div>
                                <LoginWall />
                            </div>
                        )}
                   </div>
                   )}

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
                      <button onClick={resetAllFilters} className="text-xs text-blue-600 cursor-pointer hover:underline focus:outline-none">Reset</button>
                   </div>
                   <div className="p-6 overflow-y-auto flex-1 space-y-4">
                      
                      <label className="flex items-center gap-3 p-4 mb-2 bg-emerald-50 dark:bg-emerald-900/10 rounded-xl cursor-pointer border border-emerald-100 dark:border-emerald-800/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/20 transition-colors group">
                          <div className="relative flex items-center justify-center w-5 h-5">
                              <input type="checkbox" checked={isSpotlightOnly} onChange={handleSpotlightToggle} className="peer appearance-none w-5 h-5 border-[1.5px] border-emerald-400 dark:border-emerald-600 rounded bg-white dark:bg-black/20 checked:bg-emerald-500 checked:border-emerald-500 transition-all cursor-pointer" />
                              <Check size={14} strokeWidth={4} className="text-white absolute pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" />
                          </div>
                          <span className="text-base font-extrabold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                              <Zap size={18} className="fill-emerald-500 text-emerald-500" /> Spotlight Jobs
                          </span>
                      </label>

                      <div className="h-px w-full bg-gray-100 dark:bg-white/5"></div>

                      <div className="mb-2">
                          <button 
                              onClick={() => setIsLocationExpanded(!isLocationExpanded)}
                              className={`w-full flex items-center justify-between p-4 text-base font-bold rounded-xl transition-all ${activeCountries.length > 0 ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20' : 'bg-gray-50 dark:bg-white/5 text-slate-700 dark:text-white'}`}
                          >
                              Location {activeCountries.length > 0 && <span className="ml-1 text-[10px] font-bold px-1.5 py-0.5 bg-blue-100 dark:bg-blue-800/50 rounded-md">{activeCountries.length}</span>}
                              {isLocationExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                          </button>
                          <AnimatePresence>
                              {isLocationExpanded && (
                                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                      <div className="mt-2 ml-4 space-y-2 border-l-2 border-gray-200 dark:border-white/10 pl-4 max-h-60 overflow-y-auto custom-scrollbar">
                                          <button onClick={() => handleCountryToggle('all')} className={`w-full text-left py-2 px-3 rounded-lg text-sm flex items-center gap-3 ${activeCountries.length === 0 ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 font-bold' : 'text-slate-600 dark:text-gray-400'}`}>
                                              <CustomCheckbox checked={activeCountries.length === 0} /> All Locations
                                          </button>
                                          {uniqueCountries.map(loc => (
                                              <button key={loc} onClick={() => handleCountryToggle(loc)} className={`w-full text-left py-2 px-3 rounded-lg text-sm flex items-center gap-3 ${activeCountries.includes(loc) ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 font-bold' : 'text-slate-600 dark:text-gray-400'}`}>
                                                  <CustomCheckbox checked={activeCountries.includes(loc)} /> {loc}
                                              </button>
                                          ))}
                                      </div>
                                  </motion.div>
                              )}
                          </AnimatePresence>
                      </div>

                      <div className="mb-2">
                          <button 
                              onClick={() => setIsWorkModeExpanded(!isWorkModeExpanded)}
                              className={`w-full flex items-center justify-between p-4 text-base font-bold rounded-xl transition-all ${activeWorkModes.length > 0 ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20' : 'bg-gray-50 dark:bg-white/5 text-slate-700 dark:text-white'}`}
                          >
                              Work Mode {activeWorkModes.length > 0 && <span className="ml-1 text-[10px] font-bold px-1.5 py-0.5 bg-blue-100 dark:bg-blue-800/50 rounded-md">{activeWorkModes.length}</span>}
                              {isWorkModeExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                          </button>
                          <AnimatePresence>
                              {isWorkModeExpanded && (
                                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                      <div className="mt-2 ml-4 space-y-2 border-l-2 border-gray-200 dark:border-white/10 pl-4">
                                          <button onClick={() => handleWorkModeToggle('all')} className={`w-full text-left py-2 px-3 rounded-lg text-sm flex items-center gap-3 ${activeWorkModes.length === 0 ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 font-bold' : 'text-slate-600 dark:text-gray-400'}`}>
                                            <CustomCheckbox checked={activeWorkModes.length === 0} /> All Modes
                                          </button>
                                          {['Remote', 'Hybrid', 'Onsite'].map(mode => (
                                              <button key={mode} onClick={() => handleWorkModeToggle(mode)} className={`w-full text-left py-2 px-3 rounded-lg text-sm flex items-center gap-3 ${activeWorkModes.includes(mode) ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 font-bold' : 'text-slate-600 dark:text-gray-400'}`}>
                                                  <CustomCheckbox checked={activeWorkModes.includes(mode)} /> {mode}
                                              </button>
                                          ))}
                                      </div>
                                  </motion.div>
                              )}
                          </AnimatePresence>
                      </div>

                      <div className="h-px w-full bg-gray-100 dark:bg-white/5"></div>

                      <div className="space-y-2">
                        {MAIN_FILTERS.map((main) => {
                            const isActive = activeMainFilter === main.id;
                            return (
                              <div key={main.id} className="mb-2">
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
                                                  <button onClick={() => handleSubFilterToggle('all')} className={`w-full text-left py-2 px-3 rounded-lg text-sm flex items-center gap-3 ${activeSubFilters.length === 0 ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 font-bold' : 'text-slate-600 dark:text-gray-400'}`}>
                                                      <CustomCheckbox checked={activeSubFilters.length === 0} /> All Categories
                                                  </button>
                                                  {SUB_CATEGORIES.map((sub) => (
                                                      <button
                                                          key={sub.value}
                                                          onClick={() => handleSubFilterToggle(sub.value)}
                                                          className={`w-full text-left py-2 px-3 rounded-lg text-sm flex items-center gap-3 ${activeSubFilters.includes(sub.value) ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 font-bold' : 'text-slate-600 dark:text-gray-400'}`}
                                                      >
                                                          <CustomCheckbox checked={activeSubFilters.includes(sub.value)} /> <span className="truncate">{sub.name}</span>
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
                   <div className="p-4 border-t border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-white/5">
                      <button onClick={() => { setIsFilterOpen(false); scrollToFeed(); }} className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold py-3 rounded-xl">Apply Filters</button>
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
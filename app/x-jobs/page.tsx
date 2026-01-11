'use client';
import React, { useState, useEffect, useRef, Suspense } from 'react'; // Suspense added
import Link from 'next/link';
import { useSearchParams } from 'next/navigation'; // 🔥 Import added for URL reading
import { MapPin, ArrowRight, Filter, ChevronLeft, ChevronRight, X, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar'; 
import JobHero from '@/components/JobHero'; 
import ProtectedOverlay from '@/components/ProtectedOverlay'; 

// OFFICIAL X LOGO COMPONENT
const XLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const filterSections = [
  { 
    title: "Job Category", 
    items: [
      { name: "All Jobs", value: "job" },
      { name: "Internships", value: "internship" },
      { name: "Freelance", value: "freelance" },
      { name: "Software Engineer", value: "Developer" },
      { name: "Data Science & AI", value: "Data" },
    ] 
  }
];

const ITEMS_PER_PAGE = 12;

// 🔥 Content Component (Separated for Suspense)
function XJobsContent() {
  const searchParams = useSearchParams(); // 🔥 URL Parameters Hook
  
  const [jobs, setJobs] = useState<any[]>([]); 
  const [filteredJobs, setFilteredJobs] = useState<any[]>([]); 

  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  
  const [selectedCategory, setSelectedCategory] = useState("job");
  const [searchQuery, setSearchQuery] = useState(""); 
  
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(true);

  // 1. URL CHECK ON LOAD
  useEffect(() => {
    const queryFromUrl = searchParams.get('search');
    if (queryFromUrl) {
        setSearchQuery(queryFromUrl); // 🔥 Agar URL me search hai, toh state update karo
    }
  }, [searchParams]);

  useEffect(() => {
    const checkIsMobile = () => setIsMobile(window.innerWidth < 768);
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);
  
  const jobsHeadingRef = useRef<HTMLDivElement>(null);

  // 2. FETCH API
  const fetchJobs = (category: string) => {
    setLoading(true);
    setCurrentPage(1);
    // Note: Hum yahan searchQuery reset nahi kar rahe taaki URL wala search bana rahe
    
    fetch(`/api/jobs?source=twitter&category=${category}`)
      .then(res => res.json())
      .then(data => {
         if(data.success) {
            setJobs(data.data);
            setFilteredJobs(data.data); 
         }
         setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchJobs(selectedCategory);
  }, [selectedCategory]);


  // 3. FILTER LOGIC (Triggered by searchQuery change)
  useEffect(() => {
    if (searchQuery.trim() === "") {
        setFilteredJobs(jobs);
    } else {
        const query = searchQuery.toLowerCase();
        const filtered = jobs.filter(job => 
            (job.job_title && job.job_title.toLowerCase().includes(query)) ||
            (job.employer_name && job.employer_name.toLowerCase().includes(query)) ||
            (job.text && job.text.toLowerCase().includes(query)) ||
            (job.work_mode && job.work_mode.toLowerCase().includes(query)) ||
            (job.country && job.country.toLowerCase().includes(query))
        );
        setFilteredJobs(filtered);
    }
    setCurrentPage(1);
  }, [searchQuery, jobs]);


  useEffect(() => {
    if (jobsHeadingRef.current) {
      jobsHeadingRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [currentPage]);

  const toggleExpand = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); 
    setExpandedId(expandedId === id ? null : id);
  };

  const totalPages = Math.ceil(filteredJobs.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentJobs = filteredJobs.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const goToNextPage = () => { if (currentPage < totalPages) setCurrentPage(curr => curr + 1); };
  const goToPrevPage = () => { if (currentPage > 1) setCurrentPage(curr => curr - 1); };

  return (
    <ProtectedOverlay>
          <JobHero 
              title="X Community Jobs" 
              subtitle="Verified hiring posts with direct email application."
              placeholder="Search 'Remote', 'Email', or 'Hiring'..."
              themeColor="#ffffff" 
              // 🔥 Set initial value from state (which came from URL)
              // Note: JobHero input needs value={searchQuery} support ideally, 
              // but purely onSearch works if user types new things.
              onSearch={(val: string) => setSearchQuery(val)}
          />

          <div className="container mx-auto px-4 pb-20 flex flex-col lg:flex-row gap-8">
            <aside className="w-full lg:w-72 shrink-0 hidden lg:block">
              <div className="bg-white dark:bg-[#112240] rounded-xl border border-gray-200 dark:border-white/5 shadow-sm sticky top-24 overflow-hidden">
                  <div className="p-5 border-b border-gray-100 dark:border-white/5 flex justify-between items-center bg-gray-50 dark:bg-white/5">
                     <h3 className="font-bold text-base flex items-center gap-2"><Filter size={16} /> Filters</h3>
                     <span className="text-xs text-blue-600 cursor-pointer hover:underline" onClick={() => { setSelectedCategory("job"); setSearchQuery(""); }}>Reset</span>
                  </div>
                  <div className="p-5 space-y-3">
                    {filterSections[0].items.map((item, i) => (
                        <label key={i} className="flex items-center gap-3 cursor-pointer group">
                           <input type="radio" name="category" checked={selectedCategory === item.value} onChange={() => setSelectedCategory(item.value)} className="w-4 h-4 accent-[#0a66c2]" />
                           <span className={`text-sm group-hover:text-[#0a66c2] transition-colors flex-1 ${selectedCategory === item.value ? 'font-bold text-[#0a66c2]' : 'text-slate-600 dark:text-gray-400'}`}>{item.name}</span>
                        </label>
                    ))}
                  </div>
              </div>
            </aside>

            <main className="flex-1">
               <button 
                  onClick={() => setIsFilterOpen(true)}
                  className="lg:hidden w-full mb-6 flex items-center justify-center gap-2 bg-white dark:bg-[#112240] border border-gray-200 dark:border-white/10 p-4 rounded-xl font-bold text-slate-700 dark:text-white hover:bg-gray-50 transition-colors shadow-sm"
               >
                  <Filter size={20} className="text-black dark:text-white" /> 
                  Filter Jobs ({selectedCategory})
               </button>

               <div ref={jobsHeadingRef} className="flex items-center justify-between mb-6 pt-2">
                  <h1 className="text-2xl font-bold flex items-center gap-2 uppercase tracking-tight">
                    <XLogo className="w-6 h-6 text-black dark:text-white" /> 
                    {searchQuery ? `Results for "${searchQuery}"` : `${selectedCategory} Threads`}
                  </h1>
                  <p className="text-slate-500 dark:text-gray-400 text-sm">
                    {loading ? "Loading..." : `${filteredJobs.length} results found`}
                  </p>
               </div>

               {loading ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                   {[1,2,3,4,5,6].map(i => <div key={i} className="h-64 bg-gray-200 dark:bg-[#112240] rounded-xl animate-pulse"></div>)}
                 </div>
               ) : (
                 <>
                   {filteredJobs.length === 0 ? (
                       <div className="text-center py-20">
                           <p className="text-slate-500 text-lg">No jobs found matching "{searchQuery}" in this category.</p>
                           <button onClick={() => setSearchQuery("")} className="mt-4 text-blue-600 font-bold hover:underline">Clear Search</button>
                       </div>
                   ) : (
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-start">
                      {currentJobs.map((job) => {
                          const isActive = activeId === job.job_id;
                          const isExpanded = expandedId === job.job_id;
                          
                          return (
                            <motion.div 
                              key={job.job_id} 
                              layout={!isMobile} 
                              whileHover={!isMobile ? { scale: 1.02, y: -5, boxShadow: "0px 10px 20px rgba(0,0,0,0.1)" } : {}}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => setActiveId(job.job_id)}
                              animate={isActive ? { borderColor: "#0a66c2", boxShadow: "0px 0px 15px rgba(10, 102, 194, 0.2)" } : { borderColor: "rgba(255,255,255,0.05)", y: 0, boxShadow: "none" }}
                              className={`bg-white dark:bg-[#112240] rounded-xl border p-5 cursor-pointer flex flex-col relative overflow-hidden transition-colors ${isActive ? 'z-10 border-[#0a66c2]' : 'border-gray-200 dark:border-white/5'}`}
                            >
                              <div className="flex justify-between items-start mb-4">
                                  <img 
                                     src={job.employer_logo || "https://upload.wikimedia.org/wikipedia/commons/c/ce/X_logo_2023.svg"} 
                                     alt="Logo" 
                                     className="w-10 h-10 rounded-full shadow-sm object-contain bg-white p-1" 
                                  />
                                  <div className="flex flex-col items-end gap-1">
                                    <span className="text-[10px] font-bold px-2 py-1 rounded uppercase bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                                      {job.category || "Job"}
                                    </span>
                                    <span className="text-[9px] flex items-center gap-0.5 text-green-600 dark:text-green-400 font-bold uppercase tracking-tighter">
                                      <CheckCircle size={10} /> Email Verified
                                    </span>
                                  </div>
                              </div>
                              
                              <h3 className="font-bold text-slate-900 dark:text-white text-lg leading-tight mb-1">{job.job_title}</h3>
                              <p className="text-sm font-medium text-slate-600 dark:text-gray-300 mb-3">@{job.employer_name || "Hiring Manager"}</p>
                              
                              <div className="flex flex-wrap gap-2 mb-4">
                                <span className="inline-flex items-center gap-1 bg-gray-100 dark:bg-white/5 px-2 py-1 rounded text-[11px] font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wide">
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

                              <div className="mt-auto pt-4 border-t border-gray-100 dark:border-white/5 flex items-center justify-between">
                                  <div>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase">Source</p>
                                    <p className="text-xs font-bold text-teal-600 dark:text-teal-400 flex items-center gap-1">Verified Community</p>
                                  </div>
                                  <Link href={`/x-jobs/${job.job_id}`}>
                                    <button className="bg-[#0A192F] dark:bg-white text-white dark:text-[#0A192F] px-4 py-2 rounded-lg text-xs font-bold hover:opacity-90 transition-opacity flex items-center gap-1 shadow-sm">
                                      Apply Direct <ArrowRight size={12} />
                                    </button>
                                  </Link>
                              </div>
                            </motion.div>
                          );
                      })}
                   </div>
                   )}

                   {filteredJobs.length > ITEMS_PER_PAGE && (
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
                <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "tween", duration: 0.3 }} className="fixed right-0 top-0 bottom-0 w-[80%] max-w-sm bg-white dark:bg-[#0A192F] z-[70] shadow-2xl lg:hidden flex flex-col">
                   <div className="p-5 border-b border-gray-100 dark:border-white/10 flex justify-between items-center bg-gray-50 dark:bg-white/5">
                      <h3 className="font-bold text-lg uppercase tracking-tighter">Filter Jobs</h3>
                      <button onClick={() => setIsFilterOpen(false)} className="p-2 bg-gray-200 dark:bg-white/10 rounded-full"><X size={20} /></button>
                   </div>
                   <div className="p-6 overflow-y-auto flex-1">
                      <div className="space-y-3">
                        {filterSections[0].items.map((item, i) => (
                           <label key={i} className="flex items-center gap-4 cursor-pointer p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 border border-transparent hover:border-gray-200 transition-all">
                              <input type="radio" name="mobile-category" checked={selectedCategory === item.value} onChange={() => { setSelectedCategory(item.value); setIsFilterOpen(false); }} className="w-5 h-5 accent-[#0a66c2]" />
                              <span className={`text-base font-medium ${selectedCategory === item.value ? 'text-[#0a66c2] font-bold' : 'text-slate-700 dark:text-gray-300'}`}>{item.name}</span>
                           </label>
                        ))}
                      </div>
                   </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
    </ProtectedOverlay>
  );
}

// 🔥 Wrap in Suspense (Mandatory for useSearchParams in Next.js)
export default function XJobsPage() {
  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#0A192F] text-slate-900 dark:text-white font-sans relative">
      <Navbar />
      <Suspense fallback={<div className="text-center py-20 text-white">Loading Search...</div>}>
         <XJobsContent />
      </Suspense>
    </div>
  );
}
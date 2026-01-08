'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
// 👇 'X' icon add kiya close button ke liye
import { MapPin, Linkedin, ArrowRight, Filter, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar'; 
import JobHero from '@/components/JobHero'; 
import ProtectedOverlay from '@/components/ProtectedOverlay'; 

const filterSections = [
  { 
    title: "Job Category", 
    items: [
      { name: "ESG & Sustainability", value: "ESG" },
      { name: "Software Engineer", value: "Developer" },
      { name: "Internships & Trainee", value: "Internship" },
      { name: "Product Management", value: "Product" },
      { name: "Data Science & AI", value: "Data" },
      { name: "Business & Sales", value: "Business" },
      { name: "Marketing & Growth", value: "Marketing" }
    ] 
  }
];

const ITEMS_PER_PAGE = 12;

export default function LinkedInJobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("ESG");
  const [currentPage, setCurrentPage] = useState(1);
  
  // 👇 New State for Mobile Filter Drawer
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const jobsHeadingRef = useRef<HTMLDivElement>(null);

  const fetchJobs = (category: string) => {
    setLoading(true);
    setCurrentPage(1);
    fetch(`/api/jobs?source=linkedin&category=${category}`)
      .then(res => res.json())
      .then(data => {
         if(data.success) setJobs(data.data);
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

  useEffect(() => {
    if (jobsHeadingRef.current) {
      jobsHeadingRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [currentPage]);

  const toggleExpand = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); 
    setExpandedId(expandedId === id ? null : id);
  };

  const totalPages = Math.ceil(jobs.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentJobs = jobs.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const goToNextPage = () => { if (currentPage < totalPages) setCurrentPage(curr => curr + 1); };
  const goToPrevPage = () => { if (currentPage > 1) setCurrentPage(curr => curr - 1); };

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#0A192F] text-slate-900 dark:text-white font-sans relative">
      <Navbar />
      
      <ProtectedOverlay>

          <JobHero 
             title="LinkedIn Opportunities" 
             subtitle="Find Internships, Full-time roles & Contracts."
             placeholder="Search 'Internship', 'React', or 'Remote'..."
             themeColor="#0a66c2" 
          />

          <div className="container mx-auto px-4 pb-20 flex flex-col lg:flex-row gap-8">
            
            {/* --- DESKTOP SIDEBAR (Hidden on Mobile) --- */}
            <aside className="w-full lg:w-72 shrink-0 hidden lg:block">
              <div className="bg-white dark:bg-[#112240] rounded-xl border border-gray-200 dark:border-white/5 shadow-sm sticky top-24 overflow-hidden">
                 <div className="p-5 border-b border-gray-100 dark:border-white/5 flex justify-between items-center bg-gray-50 dark:bg-white/5">
                    <h3 className="font-bold text-base flex items-center gap-2"><Filter size={16} /> Filters</h3>
                    <span className="text-xs text-blue-600 cursor-pointer hover:underline" onClick={() => setSelectedCategory("ESG")}>Reset</span>
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

            {/* --- MAIN CONTENT --- */}
            <main className="flex-1">
               
               {/* 🔥 MOBILE FILTER BUTTON (Visible only on Mobile) */}
               <button 
                  onClick={() => setIsFilterOpen(true)}
                  className="lg:hidden w-full mb-6 flex items-center justify-center gap-2 bg-white dark:bg-[#112240] border border-gray-200 dark:border-white/10 p-4 rounded-xl font-bold shadow-sm text-slate-700 dark:text-white hover:bg-gray-50 transition-colors"
               >
                  <Filter size={20} className="text-[#0a66c2]" /> 
                  Filter Jobs ({selectedCategory})
               </button>

               <div ref={jobsHeadingRef} className="flex items-center justify-between mb-6 pt-2">
                  <h1 className="text-2xl font-bold flex items-center gap-2"><Linkedin className="text-[#0a66c2]" /> {selectedCategory} Jobs</h1>
                  <p className="text-slate-500 dark:text-gray-400 text-sm">
                    {loading ? "Scanning..." : `Showing ${startIndex + 1}-${Math.min(startIndex + ITEMS_PER_PAGE, jobs.length)} of ${jobs.length} jobs`}
                  </p>
               </div>

               {loading ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                   {[1,2,3,4,5,6].map(i => <div key={i} className="h-64 bg-gray-200 dark:bg-white/5 rounded-xl animate-pulse"></div>)}
                 </div>
               ) : (
                 <>
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-start">
                      {currentJobs.map((job) => {
                          const isActive = activeId === job.job_id;
                          const isExpanded = expandedId === job.job_id;
                          
                          return (
                            <motion.div 
                              layout 
                              key={job.job_id} 
                              onClick={() => setActiveId(job.job_id)}
                              whileHover={{ scale: 1.01, y: -2 }}
                              animate={isActive ? { borderColor: "#0a66c2", boxShadow: "0px 0px 20px rgba(10, 102, 194, 0.3)" } : { borderColor: "rgba(255,255,255,0.05)", boxShadow: "0px 2px 4px rgba(0,0,0,0.05)", y: 0 }}
                              className={`bg-white dark:bg-[#112240] rounded-xl border p-5 cursor-pointer flex flex-col relative overflow-hidden transition-colors ${isActive ? 'z-10 border-[#0a66c2]' : 'border-gray-200 dark:border-white/5'}`}
                            >
                              <div className="flex justify-between items-start mb-4">
                                  <img src={job.employer_logo || "https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png"} alt="Logo" className="w-10 h-10 rounded shadow-sm object-cover bg-white p-1" onError={(e) => (e.currentTarget.src = "https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png")}/>
                                  <span className="text-[10px] font-bold px-2 py-1 rounded uppercase bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">{job.category || "General"}</span>
                              </div>
                              <h3 className="font-bold text-slate-900 dark:text-white text-lg leading-tight mb-1">{job.job_title}</h3>
                              <p className="text-sm font-medium text-slate-600 dark:text-gray-300 mb-3">{job.employer_name}</p>
                              <div className="mb-4"><span className="inline-flex items-center gap-1 bg-gray-100 dark:bg-white/5 px-2 py-1 rounded text-xs font-medium text-slate-500 dark:text-gray-400"><MapPin size={10} /> {job.job_city || "Remote"}</span></div>
                              
                              <div className="text-xs text-slate-500 dark:text-gray-400 mb-4 relative">
                                <p className={isExpanded ? "" : "line-clamp-3"}>{job.text}</p>
                                {job.text && job.text.length > 100 && (
                                  <button onClick={(e) => toggleExpand(e, job.job_id)} className="text-[#0a66c2] font-bold mt-1 hover:underline focus:outline-none">
                                    {isExpanded ? "Show less" : "Read more..."}
                                  </button>
                                )}
                              </div>

                              <div className="mt-auto pt-4 border-t border-gray-100 dark:border-white/5 flex items-center justify-between">
                                  <div>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase">Source</p>
                                    <p className="text-xs font-bold text-teal-600 dark:text-teal-400">FindMeWork</p>
                                  </div>
                                  <Link href={`/linkedin-jobs/${job.job_id}`}>
                                    <button className="bg-[#0A192F] dark:bg-white text-white dark:text-[#0A192F] px-4 py-2 rounded-lg text-xs font-bold hover:opacity-90 transition-opacity flex items-center gap-1 shadow-md">View Details <ArrowRight size={12} /></button>
                                  </Link>
                              </div>
                            </motion.div>
                          );
                      })}
                   </div>

                   {jobs.length > ITEMS_PER_PAGE && (
                     <div className="flex justify-center items-center gap-4 mt-10">
                        <button onClick={goToPrevPage} disabled={currentPage === 1} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white dark:bg-[#112240] border border-gray-200 dark:border-white/10 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-white/5 transition-colors font-medium text-sm"><ChevronLeft size={16} /> Previous</button>
                        <span className="text-sm font-bold text-slate-600 dark:text-gray-400">Page {currentPage} of {totalPages}</span>
                        <button onClick={goToNextPage} disabled={currentPage === totalPages} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white dark:bg-[#112240] border border-gray-200 dark:border-white/10 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-white/5 transition-colors font-medium text-sm">Next <ChevronRight size={16} /></button>
                     </div>
                   )}
                 </>
               )}

               {!loading && jobs.length === 0 && (
                 <div className="text-center py-20 bg-white dark:bg-[#112240] rounded-xl border border-dashed border-gray-300 dark:border-white/10">
                   <h3 className="text-xl font-bold text-gray-400 mb-2">No jobs found.</h3>
                   <p className="text-gray-500 text-sm">Try changing the category filter.</p>
                 </div>
               )}
            </main>
          </div>

          {/* 🔥 MOBILE FILTER DRAWER (SLIDE OVER) */}
          <AnimatePresence>
            {isFilterOpen && (
              <>
                {/* Backdrop */}
                <motion.div 
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   exit={{ opacity: 0 }}
                   onClick={() => setIsFilterOpen(false)}
                   className="fixed inset-0 bg-black/60 z-[60] lg:hidden backdrop-blur-sm"
                />
                
                {/* Drawer */}
                <motion.div 
                   initial={{ x: "100%" }}
                   animate={{ x: 0 }}
                   exit={{ x: "100%" }}
                   transition={{ type: "spring", damping: 25, stiffness: 200 }}
                   className="fixed right-0 top-0 bottom-0 w-[80%] max-w-sm bg-white dark:bg-[#0A192F] z-[70] shadow-2xl lg:hidden flex flex-col"
                >
                   <div className="p-5 border-b border-gray-100 dark:border-white/10 flex justify-between items-center bg-gray-50 dark:bg-white/5">
                      <h3 className="font-bold text-lg">Filter Jobs</h3>
                      <button onClick={() => setIsFilterOpen(false)} className="p-2 bg-gray-200 dark:bg-white/10 rounded-full hover:bg-red-100 hover:text-red-600 transition-colors">
                        <X size={20} />
                      </button>
                   </div>
                   
                   <div className="p-6 overflow-y-auto flex-1">
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Select Category</h4>
                      <div className="space-y-3">
                        {filterSections[0].items.map((item, i) => (
                           <label key={i} className="flex items-center gap-4 cursor-pointer p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 border border-transparent hover:border-gray-200 transition-all">
                              <input 
                                type="radio" 
                                name="mobile-category" 
                                checked={selectedCategory === item.value} 
                                onChange={() => {
                                  setSelectedCategory(item.value);
                                  setIsFilterOpen(false); // Auto-close on selection
                                }} 
                                className="w-5 h-5 accent-[#0a66c2]" 
                              />
                              <span className={`text-base font-medium ${selectedCategory === item.value ? 'text-[#0a66c2] font-bold' : 'text-slate-700 dark:text-gray-300'}`}>{item.name}</span>
                           </label>
                        ))}
                      </div>
                   </div>
                   
                   <div className="p-5 border-t border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-white/5">
                      <button 
                        onClick={() => setIsFilterOpen(false)}
                        className="w-full py-3 bg-[#0a66c2] text-white rounded-xl font-bold shadow-lg shadow-blue-500/30 active:scale-95 transition-transform"
                      >
                        Show Results
                      </button>
                   </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

      </ProtectedOverlay>
    </div>
  );
}
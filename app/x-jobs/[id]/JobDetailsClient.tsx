'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react'; 
import Navbar from '@/components/Navbar';
import { 
  ArrowLeft, MapPin, Calendar, CheckCircle, ExternalLink, 
  Mail, Building, Bookmark, Share2, Copy, Loader2, Send
} from 'lucide-react';

export default function JobDetailsClient() {
  // 🔥 Params hum wapas client se hi nikalenge (Zero Error)
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession(); 

  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
   
  const [isSaved, setIsSaved] = useState(false);
  const [checkingBookmark, setCheckingBookmark] = useState(true);
  const [copied, setCopied] = useState(false);

  const getBaseId = (id: any) => {
      if (!id) return "";
      let str = Array.isArray(id) ? id[0] : String(id);
      str = decodeURIComponent(str);
      str = str.replace(/^tw-/, '').replace(/^li-/, '');
      return str.includes('__') ? str.split('__')[0].trim() : str.trim();
  };

  // 1. Fetch Job
  useEffect(() => {
    if (params?.id) {
      const fetchId = Array.isArray(params.id) ? params.id[0] : params.id;
      let isInstantlyLoaded = false;

      try {
          const cachedData = sessionStorage.getItem('instant_job_data');
          if (cachedData) {
              const parsedJob = JSON.parse(cachedData);
              if (getBaseId(parsedJob.job_id) === getBaseId(fetchId) || getBaseId(parsedJob._id) === getBaseId(fetchId)) {
                  setJob(parsedJob);
                  setLoading(false);
                  isInstantlyLoaded = true;
              }
          }
      } catch (e) {}

      fetch(`/api/jobs/${fetchId}`) 
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setJob(data.data);
          }
          if (!isInstantlyLoaded) setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching job:", err);
          if (!isInstantlyLoaded) setLoading(false);
        });
    }
  }, [params?.id]);

  // 2. Bookmark Checker
  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated" || !params?.id) {
        setCheckingBookmark(false);
        return;
    }
    const currentParamId = Array.isArray(params.id) ? params.id[0] : params.id;

    fetch(`/api/bookmarks?t=${Date.now()}`)
      .then(res => res.json())
      .then((data) => {
         if (data.success && Array.isArray(data.data)) {
            const found = data.data.some((item: any) => {
               return (
                   item.jobId === currentParamId || 
                   item.job_id === currentParamId ||
                   item.jobData?.job_id === currentParamId
               );
            });
            setIsSaved(found);
         }
      })
      .catch(err => console.error("Bookmark check failed", err))
      .finally(() => setCheckingBookmark(false));
  }, [params?.id, status, job]); 

  // 3. Handle Bookmark
  const handleBookmark = async () => {
    if (!session) { alert("Please login to save jobs!"); return; }
    const currentParamId = Array.isArray(params?.id) ? params.id[0] : params?.id;
    const previousState = isSaved;
    setIsSaved(!isSaved); 
    try {
        const res = await fetch('/api/bookmarks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ jobId: currentParamId, jobData: job })
        });
        if (!res.ok) throw new Error("Failed");
    } catch (err) { setIsSaved(previousState); alert("Failed to save job."); }
  };

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
      return (
        <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#0A192F] text-slate-900 dark:text-white font-sans">
          <Navbar />
          <div className="container mx-auto px-4 py-10 max-w-4xl">
            <div className="w-24 h-6 bg-gray-200 dark:bg-white/10 rounded-md animate-pulse mb-6"></div>
            <div className="bg-white dark:bg-[#112240] rounded-2xl shadow-sm border border-gray-200 dark:border-white/5 overflow-hidden">
              <div className="p-8 border-b border-gray-100 dark:border-white/5 flex flex-col md:flex-row gap-6">
                 <div className="w-20 h-20 bg-gray-200 dark:bg-white/10 rounded-xl animate-pulse shrink-0"></div>
                 <div className="flex-1 space-y-4 w-full">
                    <div className="flex gap-2">
                        <div className="w-16 h-6 bg-gray-200 dark:bg-white/10 rounded-full animate-pulse"></div>
                        <div className="w-24 h-6 bg-gray-200 dark:bg-white/10 rounded-full animate-pulse"></div>
                    </div>
                    <div className="w-3/4 h-10 bg-gray-200 dark:bg-white/10 rounded-lg animate-pulse"></div>
                    <div className="w-1/2 h-5 bg-gray-200 dark:bg-white/10 rounded-md animate-pulse"></div>
                 </div>
              </div>
              <div className="p-8 space-y-4">
                 <div className="w-full h-4 bg-gray-200 dark:bg-white/10 rounded-md animate-pulse"></div>
                 <div className="w-full h-4 bg-gray-200 dark:bg-white/10 rounded-md animate-pulse"></div>
                 <div className="w-5/6 h-4 bg-gray-200 dark:bg-white/10 rounded-md animate-pulse"></div>
                 <div className="w-4/6 h-4 bg-gray-200 dark:bg-white/10 rounded-md animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      );
  }

  if (!job) return <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8f9fa] dark:bg-[#0A192F] text-slate-600 dark:text-gray-400"><h2 className="text-2xl font-bold mb-4">Job Not Found</h2><button onClick={() => router.back()} className="text-blue-500 hover:underline">Go Back</button></div>;

  const baseTweetId = getBaseId(job.job_id);
  const rawUsername = job.username || job.handle || job.screen_name || job.employer_name || 'i';
  const safeUsername = String(rawUsername).replace('@', '').replace(/[^a-zA-Z0-9_]/g, '');

  const validLink = job.apply_link || job.job_url || job.url || job.link;
  const finalExternalLink = validLink && validLink.startsWith('http') 
    ? validLink 
    : `https://x.com/${safeUsername}/status/${baseTweetId}`;

  const extractEmail = (text: string) => {
      if (!text) return null;
      const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
      return text.match(emailRegex)?.[0] || null;
  };

  let displayEmail = job.contact_email || job.email || extractEmail(job.text);
   
  if (!displayEmail && job.apply_link && job.apply_link.startsWith('mailto:')) {
      displayEmail = job.apply_link.replace('mailto:', '');
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#0A192F] text-slate-900 dark:text-white font-sans">
      <Navbar />
       
      <div className="container mx-auto px-4 py-10 max-w-4xl">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-500 dark:text-gray-400 hover:text-[#0a66c2] mb-6 transition-colors font-medium">
          <ArrowLeft size={18} /> Back to Jobs
        </button>

        <div className="bg-white dark:bg-[#112240] rounded-2xl shadow-sm border border-gray-200 dark:border-white/5 overflow-hidden">
           
          <div className="p-8 border-b border-gray-100 dark:border-white/5 relative">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <img src={job.employer_logo || "https://upload.wikimedia.org/wikipedia/commons/c/ce/X_logo_2023.svg"} alt="Logo" className="w-20 h-20 rounded-xl shadow-md bg-white p-2 object-contain" />
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <span className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">{job.category || "Job"}</span>
                  {displayEmail && <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wide bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1 rounded-full"><CheckCircle size={12} /> Direct Email</span>}
                </div>
                <h1 className="text-3xl font-bold mb-2 leading-tight">{job.job_title}</h1>
                <div className="flex flex-wrap items-center gap-4 text-slate-600 dark:text-gray-300 text-sm font-medium">
                  <span className="flex items-center gap-1"><Building size={16} /> @{safeUsername}</span>
                  <span className="flex items-center gap-1"><MapPin size={16} /> {job.job_city || "Remote"}</span>
                  <span className="flex items-center gap-1"><Calendar size={16} /> Posted {new Date(job.posted_at).toLocaleDateString()}</span>
                </div>
              </div>
              <button onClick={handleCopyLink} className="hidden md:flex items-center gap-2 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors" title="Copy Page Link">
                {copied ? <CheckCircle size={20} className="text-green-500" /> : <Share2 size={20} />}
              </button>
            </div>
          </div>

          <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">Job Description</h3>
                <div className="bg-gray-50 dark:bg-black/20 p-6 rounded-xl border border-gray-100 dark:border-white/5">
                  <p className="whitespace-pre-wrap text-base leading-relaxed text-slate-700 dark:text-gray-300">{job.text}</p>
                </div>
              </div>

              {displayEmail && (
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-xl border border-blue-100 dark:border-blue-500/20 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Mail size={100} />
                  </div>
                  <div className="relative z-10">
                    <h4 className="flex items-center gap-2 font-bold text-blue-900 dark:text-blue-300 mb-2 text-lg">
                      <Mail size={20} /> Apply via Email
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-gray-400 mb-6 max-w-md">
                      The recruiter has provided a direct email. We recommend sending your <strong>CV & Portfolio</strong> with a clear subject line.
                    </p>
                    
                    <div className="flex items-center gap-2 sm:gap-3 w-full">
                      <a 
                        href={`mailto:${displayEmail}?subject=Application for ${job?.job_title || 'Job'} via FindMeWork`} 
                        className="flex-1 inline-flex items-center justify-center gap-2 bg-[#0a66c2] text-white px-4 sm:px-6 py-3 rounded-lg font-bold hover:bg-[#004182] transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-sm sm:text-base whitespace-nowrap"
                      >
                        <Send size={18} /> Send Application
                      </a>
                      <button 
                        type="button"
                        onClick={() => { 
                          navigator.clipboard.writeText(displayEmail || ""); 
                          alert("Email copied: " + displayEmail); 
                        }} 
                        className="flex-none p-3 sm:px-4 sm:py-3 rounded-lg border-2 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 font-semibold hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors flex items-center justify-center" 
                        title="Copy Email Address"
                      >
                        <Copy size={20} />
                      </button>
                    </div>

                    <div className="mt-4 pt-4 border-t border-blue-200/50 dark:border-blue-700/30 text-xs text-slate-500 dark:text-slate-400">
                      Email to: <span className="font-mono bg-white dark:bg-black/30 px-2 py-1 rounded select-all break-all">{displayEmail}</span>
                    </div>
                  </div>
                </div>
              )}

            </div> 

            <div className="space-y-6">
              <div className="p-6 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#112240] shadow-sm space-y-3 sticky top-24">
                <h3 className="font-bold mb-2 text-sm uppercase text-slate-400">Quick Actions</h3>
                
                <button 
                  onClick={handleBookmark} 
                  disabled={checkingBookmark} 
                  className={`w-full flex items-center justify-center gap-2 font-bold py-3 rounded-lg transition-all ${isSaved ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900" : "border-2 border-slate-200 dark:border-white/10 text-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-white/5"} ${checkingBookmark ? "opacity-70 cursor-wait" : ""}`}
                >
                  {checkingBookmark ? <Loader2 size={18} className="animate-spin" /> : <Bookmark size={18} fill={isSaved ? "currentColor" : "none"} />}
                  {checkingBookmark ? "Checking..." : isSaved ? "Saved" : "Save Job"}
                </button>
                  
                <button 
                  onClick={handleCopyLink} 
                  className="md:hidden w-full flex items-center justify-center gap-2 border-2 border-slate-200 dark:border-white/10 text-slate-700 dark:text-white font-bold py-3 rounded-lg hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                >
                  {copied ? <CheckCircle size={18} className="text-green-500" /> : <Copy size={18} />} 
                  {copied ? "Link Copied" : "Copy Link"}
                </button>

                <a href={finalExternalLink} target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-2 bg-black text-white font-bold py-3 rounded-lg hover:bg-gray-800 transition-colors">
                  View Original Post <ExternalLink size={16} />
                </a>

                {!displayEmail && <div className="mt-4 p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-100 dark:border-yellow-500/20"><p className="text-xs text-yellow-800 dark:text-yellow-200/70 text-center">No direct email found. Use the "View Original Post" button to apply via X (Twitter).</p></div>}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
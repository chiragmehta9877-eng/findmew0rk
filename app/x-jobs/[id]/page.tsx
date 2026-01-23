'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react'; 
import Navbar from '@/components/Navbar';
import { 
  ArrowLeft, MapPin, Calendar, CheckCircle, ExternalLink, 
  Mail, Building, Bookmark, Share2, Copy, Loader2 
} from 'lucide-react';

export default function JobDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession(); 

  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [isSaved, setIsSaved] = useState(false);
  const [checkingBookmark, setCheckingBookmark] = useState(true);
  const [copied, setCopied] = useState(false);

  // 🔥 ID Cleaner: '123__slug' -> '123'
  const getBaseId = (id: any) => {
      if (!id) return "";
      let str = Array.isArray(id) ? id[0] : String(id);
      str = decodeURIComponent(str);
      return str.includes('__') ? str.split('__')[0].trim() : str.trim();
  };

  // 1. Fetch Job
  useEffect(() => {
    if (params.id) {
      fetch(`/api/jobs?id=${params.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setJob(data.data);
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching job:", err);
          setLoading(false);
        });
    }
  }, [params.id]);

  // 2. 🔥 FIX: Universal Bookmark Checker
  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated" || !params.id) {
        setCheckingBookmark(false);
        return;
    }

    const currentBaseId = getBaseId(params.id);
    const loadedJobId = job?.job_id ? getBaseId(job.job_id) : null;

    console.log("🔍 Checking Bookmark for ID:", currentBaseId);

    fetch(`/api/bookmarks?t=${Date.now()}`)
      .then(res => res.json())
      .then((data) => {
         if (data.success && Array.isArray(data.data)) {
            
            const found = data.data.some((item: any) => {
               // 🔥 Collect ALL possible IDs from the saved item
               // Kyunki API kabhi Job object bhej sakti hai, kabhi Wrapper
               const possibleIds = [
                   item.job_id,           // Scenario A: Item is the Job Object (Dashboard style)
                   item.jobId,            // Scenario B: Item is Bookmark Wrapper
                   item.jobData?.job_id,  // Scenario C: Item has nested Job Data
                   item._id               // Scenario D: Mongo ID match
               ];

               // Check if ANY of the saved item's IDs match our Current URL ID or Loaded Job ID
               return possibleIds.some(savedId => {
                   if (!savedId) return false;
                   const cleanSaved = getBaseId(savedId);
                   return cleanSaved === currentBaseId || (loadedJobId && cleanSaved === loadedJobId);
               });
            });
            
            console.log("✅ Bookmark Status:", found);
            setIsSaved(found);
         }
      })
      .catch(err => console.error("Bookmark check failed", err))
      .finally(() => setCheckingBookmark(false));
  }, [params.id, status, job]); 

  // 3. Handle Bookmark
  const handleBookmark = async () => {
    if (!session) {
        alert("Please login to save jobs!");
        return;
    }

    const previousState = isSaved;
    setIsSaved(!isSaved); // Optimistic Update

    try {
        const res = await fetch('/api/bookmarks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                jobId: params.id, // Send URL ID to ensure consistency
                jobData: job 
            })
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Server Error");

    } catch (err: any) {
        console.error("Bookmark failed:", err);
        setIsSaved(previousState);
        alert("Failed to save job.");
    }
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
      <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#0A192F] flex items-center justify-center">
        <Loader2 size={40} className="animate-spin text-blue-600" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#0A192F] flex flex-col items-center justify-center text-slate-600 dark:text-gray-400">
        <h2 className="text-2xl font-bold mb-4">Job Not Found 😕</h2>
        <button onClick={() => router.back()} className="text-blue-500 hover:underline">Go Back</button>
      </div>
    );
  }

  const baseTweetId = getBaseId(job.job_id);
  const username = job.employer_name ? job.employer_name.replace('@', '') : 'user';
  const finalExternalLink = job.link && job.link.startsWith('http') 
    ? job.link 
    : `https://x.com/${username}/status/${baseTweetId}`;

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#0A192F] text-slate-900 dark:text-white font-sans">
      <Navbar />
      
      <div className="container mx-auto px-4 py-10 max-w-4xl">
        <button 
          onClick={() => router.back()} 
          className="flex items-center gap-2 text-slate-500 dark:text-gray-400 hover:text-[#0a66c2] mb-6 transition-colors font-medium"
        >
          <ArrowLeft size={18} /> Back to Jobs
        </button>

        <div className="bg-white dark:bg-[#112240] rounded-2xl shadow-sm border border-gray-200 dark:border-white/5 overflow-hidden">
          
          <div className="p-8 border-b border-gray-100 dark:border-white/5 relative">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <img 
                src={job.employer_logo || "https://upload.wikimedia.org/wikipedia/commons/c/ce/X_logo_2023.svg"} 
                alt="Logo" 
                className="w-20 h-20 rounded-xl shadow-md bg-white p-2 object-contain"
              />
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <span className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                    {job.category || "Job"}
                  </span>
                  <span className="flex items-center gap-1 text-green-600 dark:text-green-400 text-xs font-bold uppercase tracking-wide bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded-full">
                    <CheckCircle size={12} /> Email Verified
                  </span>
                </div>
                
                <h1 className="text-3xl font-bold mb-2 leading-tight">{job.job_title}</h1>
                
                <div className="flex flex-wrap items-center gap-4 text-slate-600 dark:text-gray-300 text-sm font-medium">
                  <span className="flex items-center gap-1"><Building size={16} /> @{username}</span>
                  <span className="flex items-center gap-1"><MapPin size={16} /> {job.job_city || "Remote"}</span>
                  <span className="flex items-center gap-1"><Calendar size={16} /> Posted {new Date(job.posted_at).toLocaleDateString()}</span>
                </div>
              </div>

              <button 
                onClick={handleCopyLink}
                className="hidden md:flex items-center gap-2 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
                title="Copy Link"
              >
                {copied ? <CheckCircle size={20} className="text-green-500" /> : <Share2 size={20} />}
              </button>
            </div>
          </div>

          <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-10">
            
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">Job Details</h3>
                <div className="bg-gray-50 dark:bg-black/20 p-6 rounded-xl border border-gray-100 dark:border-white/5">
                  <p className="whitespace-pre-wrap text-base leading-relaxed text-slate-700 dark:text-gray-300">
                    {job.text}
                  </p>
                </div>
              </div>

              {job.email && (
                <div className="bg-blue-50 dark:bg-blue-900/10 p-6 rounded-xl border border-blue-100 dark:border-blue-500/20">
                  <h4 className="font-bold text-blue-800 dark:text-blue-300 mb-2">Apply via Email</h4>
                  <p className="text-sm text-slate-600 dark:text-gray-400 mb-4">
                    Send your CV/Portfolio directly to the recruiter. Mention this post in the subject line.
                  </p>
                  <a 
                    href={`mailto:${job.email}?subject=Application for ${job.job_title}`}
                    className="inline-flex items-center gap-2 bg-[#0a66c2] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#004182] transition-colors w-full sm:w-auto justify-center"
                  >
                    <Mail size={18} /> Send Email to {job.email}
                  </a>
                </div>
              )}
            </div>

            <div className="space-y-6">
              
              <div className="p-6 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#112240] shadow-sm space-y-3">
                <h3 className="font-bold mb-2 text-sm uppercase text-slate-400">Actions</h3>
                
                <button 
                  onClick={handleBookmark}
                  disabled={checkingBookmark}
                  className={`w-full flex items-center justify-center gap-2 font-bold py-3 rounded-lg transition-all ${
                    isSaved 
                    ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900" 
                    : "border-2 border-slate-200 dark:border-white/10 text-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-white/5"
                  } ${checkingBookmark ? "opacity-70 cursor-wait" : ""}`}
                >
                  {checkingBookmark ? (
                     <Loader2 size={18} className="animate-spin" />
                  ) : (
                     <Bookmark size={18} fill={isSaved ? "currentColor" : "none"} />
                  )}
                  {checkingBookmark ? "Checking..." : isSaved ? "Saved" : "Save Job"}
                </button>

                <button 
                  onClick={handleCopyLink}
                  className="md:hidden w-full flex items-center justify-center gap-2 border-2 border-slate-200 dark:border-white/10 text-slate-700 dark:text-white font-bold py-3 rounded-lg hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                >
                  {copied ? <CheckCircle size={18} className="text-green-500" /> : <Copy size={18} />}
                  {copied ? "Link Copied" : "Copy Link"}
                </button>

                <a 
                  href={finalExternalLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-black text-white font-bold py-3 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  View on X (Twitter) <ExternalLink size={16} />
                </a>
              </div>

              <div className="p-6 rounded-xl bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-100 dark:border-yellow-500/20">
                  <h4 className="font-bold text-yellow-700 dark:text-yellow-400 text-sm mb-2">⚠️ Application Tip</h4>
                  <p className="text-xs text-yellow-800 dark:text-yellow-200/70">
                    Always attach your Resume and a short Cover Letter when emailing via X job posts.
                  </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
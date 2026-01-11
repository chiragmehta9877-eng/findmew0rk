'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react'; // Session hook
import Navbar from '@/components/Navbar';
import { 
  ArrowLeft, MapPin, Calendar, CheckCircle, ExternalLink, 
  Mail, Building, Bookmark, Share2, Copy 
} from 'lucide-react';

export default function JobDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession(); // Auth check ke liye

  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Logic States
  const [isSaved, setIsSaved] = useState(false);
  const [copied, setCopied] = useState(false);

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

  // 2. Check Bookmark Status
  useEffect(() => {
    if (!params.id || !session) return;

    fetch('/api/bookmarks')
      .then(async (res) => {
         const contentType = res.headers.get("content-type");
         if (!contentType || !contentType.includes("application/json")) return { success: false, data: [] };
         return res.json();
      })
      .then((data) => {
         if (data.success && Array.isArray(data.data)) {
            // Check if current job ID exists in bookmarks
            const found = data.data.some((savedJob: any) => 
               (savedJob.jobData?.job_id === params.id) || (savedJob._id === params.id)
            );
            setIsSaved(found);
         }
      })
      .catch(err => console.error("Bookmark check failed", err));
  }, [params.id, session]);

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
                jobId: job.job_id,
                jobData: job // Pura job object bhej rahe hain taaki DB me save ho
            })
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Server Error");

    } catch (err: any) {
        console.error("Bookmark failed:", err);
        setIsSaved(previousState); // Revert on error
        alert("Failed to save job.");
    }
  };

  // 4. Handle Copy Link
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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

  // Smart Link Logic
  const originalTweetId = job.job_id.includes('__') ? job.job_id.split('__')[0] : job.job_id;
  const username = job.employer_name ? job.employer_name.replace('@', '') : 'user';
  const finalExternalLink = job.link && job.link.startsWith('http') 
    ? job.link 
    : `https://x.com/${username}/status/${originalTweetId}`;

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
          
          {/* Header */}
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
                    {job.category}
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

              {/* 🔥 COPY LINK BUTTON (Desktop Top Right) */}
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
            
            {/* Description */}
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

            {/* Sidebar Actions */}
            <div className="space-y-6">
              
              {/* 🔥 ACTIONS CARD (Bookmark & Copy) */}
              <div className="p-6 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#112240] shadow-sm space-y-3">
                <h3 className="font-bold mb-2 text-sm uppercase text-slate-400">Actions</h3>
                
                {/* Bookmark Button */}
                <button 
                  onClick={handleBookmark}
                  className={`w-full flex items-center justify-center gap-2 font-bold py-3 rounded-lg transition-all ${
                    isSaved 
                    ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900" 
                    : "border-2 border-slate-200 dark:border-white/10 text-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-white/5"
                  }`}
                >
                  <Bookmark size={18} fill={isSaved ? "currentColor" : "none"} />
                  {isSaved ? "Saved" : "Save Job"}
                </button>

                {/* Mobile Copy Button (Only shows on mobile) */}
                <button 
                  onClick={handleCopyLink}
                  className="md:hidden w-full flex items-center justify-center gap-2 border-2 border-slate-200 dark:border-white/10 text-slate-700 dark:text-white font-bold py-3 rounded-lg hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                >
                  {copied ? <CheckCircle size={18} className="text-green-500" /> : <Copy size={18} />}
                  {copied ? "Link Copied" : "Copy Link"}
                </button>

                {/* View on X Button */}
                <a 
                  href={finalExternalLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-black text-white font-bold py-3 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  View on X (Twitter) <ExternalLink size={16} />
                </a>
              </div>

              {/* Tip Box */}
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
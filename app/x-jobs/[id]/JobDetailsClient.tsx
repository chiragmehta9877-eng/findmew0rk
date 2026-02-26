'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react'; 
import Navbar from '@/components/Navbar';
import { ArrowLeft, MapPin, Calendar, CheckCircle, ExternalLink, Mail, Building, Bookmark, Share2, Copy, Loader2, Send } from 'lucide-react';

export default function JobDetailsClient() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession(); 

  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [checkingBookmark, setCheckingBookmark] = useState(true);
  const [copied, setCopied] = useState(false);
  const hasViewed = useRef(false);

  // 🔥 UPDATE: Set flag before going back so Main Page knows it needs to scroll
  const handleBack = useCallback(() => {
    sessionStorage.setItem('scroll_to_feed', 'true');
    if (window.history.length > 2) {
      router.back();
    } else {
      router.push('/x-jobs');
    }
  }, [router]);

  const getBaseId = (id: any) => {
      if (!id) return "";
      let str = Array.isArray(id) ? id[0] : String(id);
      str = decodeURIComponent(str);
      str = str.replace(/^tw-/, '').replace(/^li-/, '');
      return str.includes('__') ? str.split('__')[0].trim() : str.trim();
  };

  // 🔥 THE ULTIMATE MEGA LOCATION ENGINE (Synced with Main Page)
  const getLocation = useCallback((jobData: any) => {
      if (!jobData) return "Other";
      const genericRegex = /^(global|anywhere|remote|wfh|any|unspecified)$/i;
      
      const scanTextForCountry = (txt: string) => {
          if (!txt) return null;
          const lowerTxt = txt.toLowerCase();

          // 1. 🌐 DOMAIN PARSER (Extracts country directly from email or link)
          const domainMatch = lowerTxt.match(/\.([a-z]{2})\b/);
          if (domainMatch) {
             const ext = domainMatch[1];
             const domains: any = { 
                 'za':'South Africa', 'uk':'UK', 'in':'India', 'au':'Australia', 'sg':'Singapore', 'ae':'UAE', 
                 'ng':'Nigeria', 'ke':'Kenya', 'id':'Indonesia', 'nl':'Netherlands', 'de':'Germany', 'fr':'France', 
                 'it':'Italy', 'es':'Spain', 'ca':'Canada', 'nz':'New Zealand', 'my':'Malaysia', 'ph':'Philippines', 
                 'pk':'Pakistan', 'bd':'Bangladesh', 'lk':'Sri Lanka', 'np':'Nepal', 'gh':'Ghana', 'ug':'Uganda', 
                 'tz':'Tanzania', 'zm':'Zambia', 'ie': 'Ireland', 'ch': 'Switzerland', 'se': 'Sweden', 'no': 'Norway', 
                 'fi': 'Finland', 'dk': 'Denmark', 'pl': 'Poland', 'be': 'Belgium', 'pt': 'Portugal', 'at': 'Austria',
                 'gr': 'Greece', 'cz': 'Czech Republic', 'hu': 'Hungary', 'ro': 'Romania', 'tr': 'Turkey', 'eg': 'Egypt', 
                 'ma': 'Morocco', 'br': 'Brazil', 'mx': 'Mexico', 'ar': 'Argentina', 'cl': 'Chile', 'co': 'Colombia'
             };
             if (domains[ext]) return domains[ext];
          }

          // 2. 📞 PHONE CODE PARSER
          const phoneCodes: any = { 
              '+44':'UK', '+91':'India', '+61':'Australia', '+65':'Singapore', '+971':'UAE', '+234':'Nigeria', 
              '+254':'Kenya', '+27':'South Africa', '+62':'Indonesia', '+31':'Netherlands', '+49':'Germany', 
              '+33':'France', '+39':'Italy', '+34':'Spain', '+64':'New Zealand', '+60':'Malaysia', '+63':'Philippines', 
              '+92':'Pakistan', '+880':'Bangladesh', '+94':'Sri Lanka', '+977':'Nepal', '+233':'Ghana', '+256':'Uganda', 
              '+255':'Tanzania', '+260':'Zambia', '+353':'Ireland', '+41':'Switzerland', '+46':'Sweden', '+47':'Norway', 
              '+45':'Denmark', '+358':'Finland', '+32':'Belgium', '+351':'Portugal', '+43':'Austria', '+30':'Greece',
              '+420':'Czech Republic', '+36':'Hungary', '+40':'Romania', '+90':'Turkey', '+20':'Egypt', '+212':'Morocco',
              '+55':'Brazil', '+52':'Mexico', '+54':'Argentina', '+56':'Chile', '+57':'Colombia'
          };
          for (const code in phoneCodes) {
              if (txt.includes(code)) return phoneCodes[code];
          }
          if (txt.includes('+1 ') || txt.includes('+1-') || txt.includes('+1(')) return "USA";

          // 3. 🛡️ CLEAN TEXT
          const cleanTxt = lowerTxt
              .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/gi, '')
              .replace(/https?:\/\/[^\s]+/gi, '');

          // 4. 🗺️ DYNAMIC COUNTRY DICTIONARY
          const countryDict: Record<string, string[]> = {
              "USA": ["usa", "united states", "new york", "nyc", "san francisco", "sf", "bay area", "silicon valley", "california", "texas", "seattle", "chicago", "boston", "austin", "miami", "florida", "washington", "colorado", "remote us"],
              "UK": ["uk", "united kingdom", "london", "manchester", "birmingham", "edinburgh", "england", "scotland", "wales", "remote uk"],
              "India": ["india", "ind", "bangalore", "bengaluru", "delhi", "new delhi", "ncr", "noida", "gurugram", "gurgaon", "mumbai", "pune", "hyderabad", "chennai", "kolkata", "ahmedabad", "maharashtra", "karnataka", "tamil nadu", "gujarat", "kerala", "haryana", "punjab"],
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

          for (const [country, keywords] of Object.entries(countryDict)) {
              const regex = new RegExp(`\\b(${keywords.join('|')})\\b`, 'i');
              if (regex.test(cleanTxt)) {
                  return country;
              }
          }
          
          return null;
      };

      const dbCountry = jobData.country ? jobData.country.trim() : "";
      if (dbCountry && !genericRegex.test(dbCountry)) {
          const mapped = scanTextForCountry(dbCountry);
          if (mapped) return mapped;
          return dbCountry.charAt(0).toUpperCase() + dbCountry.slice(1).toLowerCase();
      }

      const dbCity = jobData.job_city ? jobData.job_city.trim() : "";
      if (dbCity && !genericRegex.test(dbCity)) {
          const mapped = scanTextForCountry(dbCity);
          if (mapped) return mapped;
          return dbCity.charAt(0).toUpperCase() + dbCity.slice(1).toLowerCase();
      }

      const fullText = (jobData.text + " " + (jobData.job_title || "")).toLowerCase();
      const textMatch = scanTextForCountry(fullText);
      if (textMatch) return textMatch;

      return "Other"; 
  }, []);

  const getWorkMode = useCallback((jobData: any) => {
      if (!jobData) return "Unspecified";
      const txt = (jobData.text + " " + (jobData.job_title || "") + " " + (jobData.work_mode || "")).toLowerCase();
      if(txt.match(/\b(remote|wfh|work from home|telecommute|anywhere)\b/)) return "Remote";
      if(txt.match(/\b(hybrid)\b/)) return "Hybrid";
      if(txt.match(/\b(onsite|on-site|in-office|in office|office)\b/)) return "Onsite";
      return "Unspecified";
  }, []);

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
            if (!hasViewed.current) {
                hasViewed.current = true;
                fetch('/api/jobs', {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action: 'view', job_id: fetchId })
                }).catch(err => console.error("View increment failed", err));
            }
          }
          if (!isInstantlyLoaded) setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching job:", err);
          if (!isInstantlyLoaded) setLoading(false);
        });
    }
  }, [params?.id]);

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated" || !params?.id) { setCheckingBookmark(false); return; }
    const currentParamId = Array.isArray(params.id) ? params.id[0] : params.id;
    fetch(`/api/bookmarks?t=${Date.now()}`)
      .then(res => res.json())
      .then((data) => {
         if (data.success && Array.isArray(data.data)) {
            const found = data.data.some((item: any) => item.jobId === currentParamId || item.job_id === currentParamId || item.jobData?.job_id === currentParamId);
            setIsSaved(found);
         }
      })
      .catch(err => console.error("Bookmark check failed", err))
      .finally(() => setCheckingBookmark(false));
  }, [params?.id, status, job]); 

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

  const handleMobileShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: job?.job_title || 'Job Opportunity',
          text: `Check out this job opening at ${job?.employer_name || 'FindMeWork'}`,
          url: window.location.href,
        });
      } catch (error) { console.log('Error sharing:', error); }
    } else handleCopyLink();
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
                    <div className="flex gap-2"><div className="w-16 h-6 bg-gray-200 dark:bg-white/10 rounded-full animate-pulse"></div><div className="w-24 h-6 bg-gray-200 dark:bg-white/10 rounded-full animate-pulse"></div></div>
                    <div className="w-3/4 h-10 bg-gray-200 dark:bg-white/10 rounded-lg animate-pulse"></div>
                    <div className="w-1/2 h-5 bg-gray-200 dark:bg-white/10 rounded-md animate-pulse"></div>
                 </div>
              </div>
              <div className="p-8 space-y-4">
                 <div className="w-full h-4 bg-gray-200 dark:bg-white/10 rounded-md animate-pulse"></div>
                 <div className="w-full h-4 bg-gray-200 dark:bg-white/10 rounded-md animate-pulse"></div>
                 <div className="w-5/6 h-4 bg-gray-200 dark:bg-white/10 rounded-md animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      );
  }

  if (!job) return <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8f9fa] dark:bg-[#0A192F] text-slate-600 dark:text-gray-400"><h2 className="text-2xl font-bold mb-4">Job Not Found</h2><button onClick={() => router.push('/x-jobs')} className="text-blue-500 hover:underline">Go Back</button></div>;

  const baseTweetId = getBaseId(job.job_id);
  const safeUsername = String(job.username || job.handle || job.screen_name || job.employer_name || 'i').replace('@', '').replace(/[^a-zA-Z0-9_]/g, '');
  const validLink = job.apply_link || job.job_url || job.url || job.link;
  const finalExternalLink = validLink && validLink.startsWith('http') ? validLink : `https://x.com/${safeUsername}/status/${baseTweetId}`;

  let displayEmail = job.contact_email || job.email || (job.text ? job.text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)?.[0] : null);
  if (!displayEmail && job.apply_link && job.apply_link.startsWith('mailto:')) displayEmail = job.apply_link.replace('mailto:', '');

  const displayLocation = getLocation(job);
  const displayMode = getWorkMode(job);

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#0A192F] text-slate-900 dark:text-white font-sans">
      <Navbar />
      <div className="container mx-auto px-4 py-10 max-w-4xl">
        <button onClick={handleBack} className="flex items-center gap-2 text-slate-500 dark:text-gray-400 hover:text-[#0a66c2] mb-6 transition-colors font-medium">
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
                  <span className="flex items-center gap-1"><MapPin size={16} /> {displayMode !== 'Unspecified' && <span className="text-blue-600 dark:text-blue-400">{displayMode} • </span>} {displayLocation}</span>
                  <span className="flex items-center gap-1"><Calendar size={16} /> Posted {new Date(job.posted_at).toLocaleDateString()}</span>
                </div>
              </div>
              <button onClick={handleCopyLink} className="hidden md:flex items-center gap-2 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors" title="Copy Link">{copied ? <CheckCircle size={20} className="text-green-500" /> : <Share2 size={20} />}</button>
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
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><Mail size={100} /></div>
                  <div className="relative z-10">
                    <h4 className="flex items-center gap-2 font-bold text-blue-900 dark:text-blue-300 mb-2 text-lg"><Mail size={20} /> Apply via Email</h4>
                    <p className="text-sm text-slate-600 dark:text-gray-400 mb-6 max-w-md">The recruiter has provided a direct email. We recommend sending your <strong>CV & Portfolio</strong> with a clear subject line.</p>
                    <div className="flex items-center gap-2 sm:gap-3 w-full">
                      <a href={`mailto:${displayEmail}?subject=Application for ${job?.job_title || 'Job'} via FindMeWork`} className="flex-1 inline-flex items-center justify-center gap-2 bg-[#0a66c2] text-white px-4 sm:px-6 py-3 rounded-lg font-bold hover:bg-[#004182] transition-all shadow-md hover:-translate-y-0.5 whitespace-nowrap"><Send size={18} /> Send Application</a>
                      <button onClick={() => { navigator.clipboard.writeText(displayEmail || ""); alert("Email copied: " + displayEmail); }} className="flex-none p-3 sm:px-4 sm:py-3 rounded-lg border-2 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 font-semibold hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors flex items-center justify-center" title="Copy Email"><Copy size={20} /></button>
                    </div>
                    <div className="mt-4 pt-4 border-t border-blue-200/50 dark:border-blue-700/30 text-xs text-slate-500 dark:text-slate-400">Email to: <span className="font-mono bg-white dark:bg-black/30 px-2 py-1 rounded select-all break-all">{displayEmail}</span></div>
                  </div>
                </div>
              )}
            </div> 

            <div className="space-y-6">
              <div className="p-6 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#112240] shadow-sm space-y-3 sticky top-24">
                <h3 className="font-bold mb-2 text-sm uppercase text-slate-400">Quick Actions</h3>
                <button onClick={handleBookmark} disabled={checkingBookmark} className={`w-full flex items-center justify-center gap-2 font-bold py-3 rounded-lg transition-all ${isSaved ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900" : "border-2 border-slate-200 dark:border-white/10 text-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-white/5"} ${checkingBookmark ? "opacity-70 cursor-wait" : ""}`}>
                  {checkingBookmark ? <Loader2 size={18} className="animate-spin" /> : <Bookmark size={18} fill={isSaved ? "currentColor" : "none"} />}
                  {checkingBookmark ? "Checking..." : isSaved ? "Saved" : "Save Job"}
                </button>
                <button onClick={handleMobileShare} className="md:hidden w-full flex items-center justify-center gap-2 border-2 border-slate-200 dark:border-white/10 text-slate-700 dark:text-white font-bold py-3 rounded-lg hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                  {copied ? <CheckCircle size={18} className="text-green-500" /> : <Share2 size={18} />} {copied ? "Link Copied" : "Share Job"}
                </button>
                <a href={finalExternalLink} target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-2 bg-black text-white font-bold py-3 rounded-lg hover:bg-gray-800 transition-colors">View Original Post <ExternalLink size={16} /></a>
                {!displayEmail && <div className="mt-4 p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-100 dark:border-yellow-500/20"><p className="text-xs text-yellow-800 dark:text-yellow-200/70 text-center">No direct email found. Use the "View Original Post" button to apply via X (Twitter).</p></div>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
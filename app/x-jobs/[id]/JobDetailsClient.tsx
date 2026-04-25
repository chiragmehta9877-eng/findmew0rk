'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react'; 
import Navbar from '@/components/Navbar';
import { ArrowLeft, MapPin, Calendar, CheckCircle, ExternalLink, Mail, Building, Bookmark, Share2, Copy, Loader2, Send, Sparkles, Zap, RefreshCw } from 'lucide-react';

// 🔥 1. SYNCED LOCATION MAPS FROM MAIN PAGE
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


export default function JobDetailsClient({ initialData, jobId: propJobId }: { initialData?: any, jobId?: string }) {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession(); 

  const [job, setJob] = useState<any>(initialData || null);
  const [loading, setLoading] = useState(!initialData);
  const [isSaved, setIsSaved] = useState(false);
  const [checkingBookmark, setCheckingBookmark] = useState(true);
  const [copied, setCopied] = useState(false);
  const [verifying, setVerifying] = useState(false); 
  const hasViewed = useRef(false);

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

  // 🔥 2. EXACT SAME LOCATION LOGIC AS MAIN PAGE
  const getLocation = useCallback((jobData: any) => {
      if (!jobData) return "Other";
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

  const handleVerifyJob = async () => {
    if (!session?.user?.email) {
        alert("🔒 Please Login To Verify!");
        return;
    }
    
    setVerifying(true);
    try {
      const targetId = job.job_id || propJobId || job._id;
      const response = await fetch('https://chiragmehta.app.n8n.cloud/webhook/6ec30106-4154-4fcf-b1c1-6d235fe6ad34', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            jobId: targetId,
            userEmail: session.user.email,
            text: `Job Title: ${job.job_title}\n\nDescription: ${job.text}`
        }),
      });

      if (response.ok) {
        sessionStorage.removeItem('xjobs_data_cache_v1');
        alert("✨ AI Deep Scan Started! The page will automatically refresh.");
        setTimeout(() => window.location.reload(), 5000);
      } else {
        alert("Verification failed to connect to AI Agent.");
        setVerifying(false);
      }
    } catch (error) {
      alert("Error connecting to AI service. Make sure n8n workflow is active.");
      setVerifying(false);
    }
  };

  useEffect(() => {
    const fetchId = propJobId || (Array.isArray(params?.id) ? params.id[0] : params?.id);
    if (fetchId && !initialData) {
      fetch(`/api/jobs/${fetchId}`).then(res => res.json()).then(data => {
          if (data.success) setJob(data.data);
          setLoading(false);
      }).catch(() => setLoading(false));
    }
  }, [params?.id, initialData, propJobId]);

  const handleBookmark = async () => {
    if (!session) return alert("Please login!");
    const previousState = isSaved;
    setIsSaved(!isSaved); 
    try {
        await fetch('/api/bookmarks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ jobId: job.job_id || job._id, jobData: job })
        });
    } catch (err) { setIsSaved(previousState); }
  };

  if (loading) return <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#0A192F]"><Navbar /><div className="container mx-auto px-4 py-10 max-w-4xl animate-pulse"><div className="h-64 bg-gray-200 dark:bg-white/10 rounded-2xl"></div></div></div>;
  if (!job) return <div className="min-h-screen flex flex-col items-center justify-center text-white bg-[#0A192F]"><h2>Job Not Found</h2></div>;

  const baseTweetId = getBaseId(job.job_id);
  const safeUsername = String(job.username || job.employer_name || 'hiring').replace('@', '');
  const finalExternalLink = job.apply_link?.startsWith('http') ? job.apply_link : `https://x.com/${safeUsername}/status/${baseTweetId}`;
  const displayEmail = job.contact_email || (job.text ? job.text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)?.[0] : null);

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#0A192F] text-slate-900 dark:text-white font-sans">
      <Navbar />
      <div className="container mx-auto px-4 py-10 max-w-4xl">
        <button onClick={handleBack} className="flex items-center gap-2 text-slate-500 dark:text-gray-400 hover:text-blue-500 mb-6 font-medium">
          <ArrowLeft size={18} /> Back to Jobs
        </button>

        <div className="bg-white dark:bg-[#112240] rounded-2xl shadow-sm border border-gray-200 dark:border-white/5 overflow-hidden">
          <div className="p-8 border-b border-gray-100 dark:border-white/5">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <img src={job.employer_logo || "https://upload.wikimedia.org/wikipedia/commons/c/ce/X_logo_2023.svg"} alt="Logo" className="w-20 h-20 rounded-xl shadow-md bg-white p-2 object-contain" />
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <span className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 px-3 py-1 rounded-full text-xs font-bold uppercase">{job.category || "Job"}</span>
                  {displayEmail && <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1 rounded-full"><CheckCircle size={12} /> Direct Email</span>}
                </div>
                <h1 className="text-3xl font-bold mb-2">{job.job_title}</h1>
                <div className="flex flex-wrap items-center gap-4 text-slate-600 dark:text-gray-300 text-sm font-medium">
                  <span className="flex items-center gap-1"><Building size={16} /> @{safeUsername}</span>
                  <span className="flex items-center gap-1"><MapPin size={16} /> {getWorkMode(job)} • {getLocation(job)}</span>
                  <span className="flex items-center gap-1" suppressHydrationWarning><Calendar size={16} /> Posted {new Date(job.posted_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* 🔥 3. ENHANCED AI VERIFICATION BUTTON ANIMATIONS */}
            <div className="mt-8 p-5 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
               {job.verifiedBy?.includes(session?.user?.email) ? (
                 <>
                   <div className="flex items-center gap-4">
                     <div className={`p-3 rounded-xl ${job.badgeType === 'blue' ? 'bg-blue-100 text-blue-600' : 'bg-slate-200 text-slate-600'}`}>
                        <Sparkles size={24} />
                     </div>
                     <div>
                        <p className="text-xs font-black uppercase text-slate-500 tracking-widest">AI Status</p>
                        <h4 className="font-bold text-lg flex items-center gap-2">
                           {job.badgeType === 'blue' ? 'Premium Verified' : 'Standard Verified'} 
                           <span className="text-blue-500 text-sm">({job.trustScore}/10 Score)</span>
                        </h4>
                     </div>
                   </div>
                   {/* Styled Re-Verify Button */}
                   <button 
                     onClick={handleVerifyJob} 
                     disabled={verifying} 
                     className={`flex items-center gap-2 text-xs font-bold transition-all px-3 py-1.5 rounded-lg ${
                       verifying 
                         ? 'bg-blue-100 text-blue-600 cursor-wait' 
                         : 'text-slate-500 hover:bg-white dark:hover:bg-black/20 hover:text-blue-500'
                     }`}
                   >
                      <RefreshCw size={14} className={verifying ? 'animate-spin' : ''} /> 
                      {verifying ? 'Scanning...' : 'Re-run Deep Scan'}
                   </button>
                 </>
               ) : (
                 <>
                   <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600">
                        <Zap size={20} fill="currentColor" />
                     </div>
                     <p className="text-sm font-bold text-slate-600 dark:text-gray-300">Unverified Post. Run AI analysis?</p>
                   </div>
                   {/* Styled Main Verify Button with Glowing Pulse */}
                   <button 
                     onClick={handleVerifyJob} 
                     disabled={verifying} 
                     className={`px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg transition-all flex items-center gap-2 ${
                       verifying 
                         ? 'bg-purple-800 text-purple-200 cursor-not-allowed animate-pulse shadow-purple-900/50 opacity-90' 
                         : 'bg-purple-600 text-white hover:bg-purple-700 hover:shadow-purple-600/40 hover:-translate-y-0.5'
                     }`}
                   >
                      {verifying ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />} 
                      {verifying ? 'Verifying Data...' : 'Verify with AI'}
                   </button>
                 </>
               )}
            </div>
          </div>

          <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h3 className="text-xl font-bold mb-4">Job Description</h3>
                <div className="bg-gray-50 dark:bg-black/20 p-6 rounded-xl border border-gray-100 dark:border-white/5">
                  <p className="whitespace-pre-wrap text-base leading-relaxed text-slate-700 dark:text-gray-300">{job.text}</p>
                </div>
              </div>
              
              {displayEmail && (
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 p-6 rounded-xl border border-blue-100 dark:border-blue-500/20 relative overflow-hidden group">
                  <div className="relative z-10">
                    <h4 className="flex items-center gap-2 font-bold text-blue-900 dark:text-blue-300 mb-2 text-lg"><Mail size={20} /> Apply via Email</h4>
                    <div className="flex items-center gap-3 mt-4">
                      <a href={`mailto:${displayEmail}?subject=Application for ${job.job_title}`} className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold text-center hover:bg-blue-700 transition-all flex items-center justify-center gap-2"><Send size={18} /> Send Application</a>
                      <button onClick={() => { navigator.clipboard.writeText(displayEmail || ""); alert("Copied!"); }} className="p-3.5 rounded-xl border-2 border-blue-200 dark:border-blue-800 text-blue-600"><Copy size={20} /></button>
                    </div>
                  </div>
                </div>
              )}
            </div> 

            <div className="space-y-6">
              <div className="p-6 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#112240] shadow-sm space-y-3 sticky top-24">
                <h3 className="font-bold mb-2 text-xs uppercase text-slate-400">Quick Actions</h3>
                <button onClick={handleBookmark} className={`w-full flex items-center justify-center gap-2 font-bold py-3 rounded-lg transition-all ${isSaved ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900" : "border-2 border-slate-200 dark:border-white/10 text-slate-700 dark:text-white"}`}>
                  <Bookmark size={18} fill={isSaved ? "currentColor" : "none"} /> {isSaved ? "Saved" : "Save Job"}
                </button>
                <a href={finalExternalLink} target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-2 bg-black text-white font-bold py-3 rounded-lg hover:bg-gray-800 transition-colors">View Original Post <ExternalLink size={16} /></a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
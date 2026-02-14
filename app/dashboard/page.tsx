'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { 
  User, Bookmark, Trash2, 
  MapPin, Building2, Loader2, Home, Calendar, ArrowRight,
  Edit3, Linkedin, Instagram, CheckCircle, Plus, X, Save, Briefcase, ExternalLink, Target, ChevronLeft, ChevronRight 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Custom X Logo
const XLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [savedJobs, setSavedJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const JOBS_PER_PAGE = 5;

  // PROFILE STATES
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);
  
  const [profileData, setProfileData] = useState<any>({
    headline: '',
    location: '',
    detectedLocation: '', 
    lookingFor: '', 
    linkedin: '',
    x_handle: '',
    instagram: '',
  });
  
  const [completion, setCompletion] = useState(20);

  // AUTH CHECK
  useEffect(() => {
    if (status === 'unauthenticated') router.push('/'); 
  }, [status, router]);

  // FETCH DATA
  useEffect(() => {
    if (status === 'authenticated') {
        fetch(`/api/user/profile?t=${Date.now()}`)
            .then(res => res.json())
            .then(data => {
                if(data.success) {
                    setProfileData((prev: any) => ({ ...prev, ...data.data }));
                }
            })
            .catch(err => console.error("Profile Error:", err));

        fetch('/api/bookmarks')
            .then(res => res.json())
            .then(data => {
                if (data.success && Array.isArray(data.data)) {
                    const validJobs = data.data.filter((j: any) => j && (j.job_id || j._id));
                    setSavedJobs(validJobs);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error("Jobs Error:", err);
                setLoading(false);
            });
    }
  }, [status]);

  // CALCULATION LOGIC
  useEffect(() => {
    const isFilled = (val: string | null | undefined) => val && val.toString().trim().length > 0;

    let score = 20; 
    if (isFilled(profileData.headline)) score += 15;
    if (isFilled(profileData.location) || isFilled(profileData.detectedLocation)) score += 10;
    if (isFilled(profileData.lookingFor)) score += 15;
    if (isFilled(profileData.linkedin)) score += 15;
    if (isFilled(profileData.x_handle)) score += 15;
    if (isFilled(profileData.instagram)) score += 10;
    
    setCompletion(Math.min(score, 100));
  }, [profileData]);

  // PAGINATION
  const indexOfLastJob = currentPage * JOBS_PER_PAGE;
  const indexOfFirstJob = indexOfLastJob - JOBS_PER_PAGE;
  const currentJobs = savedJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(savedJobs.length / JOBS_PER_PAGE);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) setCurrentPage(totalPages);
  }, [savedJobs.length, totalPages, currentPage]);

  // 🔥 DELETE FUNCTION
  const removeBookmark = async (e: React.MouseEvent, idToDelete: string) => {
    e.preventDefault(); 
    e.stopPropagation(); // Parent click stop karega
    
    const previousJobs = [...savedJobs];

    setSavedJobs((prev) => prev.filter((job) => {
        const currentId = job.job_id || job._id;
        return currentId.toString() !== idToDelete.toString();
    }));

    try {
        const res = await fetch('/api/bookmarks', {
            method: 'POST', // Toggle logic
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ jobId: idToDelete })
        });

        if (!res.ok) throw new Error("Failed");
    } catch (err) {
        console.error("Delete failed:", err);
        setSavedJobs(previousJobs);
        alert("Failed to delete. Please try again.");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
      setIsSaving(true);
      try {
          const res = await fetch('/api/user/profile', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(profileData)
          });
          if (res.ok) {
              window.dispatchEvent(new Event('profileUpdated'));
              setIsEditing(false);
              setShowToast(true);
              setTimeout(() => setShowToast(false), 3000);
          } else {
              alert("Failed to save profile!");
          }
      } catch (error) {
          console.error("Save Error:", error);
      } finally {
          setIsSaving(false);
      }
  };

  if (status === 'loading') return <div className="min-h-screen bg-slate-50 dark:bg-[#0A192F] flex items-center justify-center"><Loader2 className="animate-spin text-teal-500" size={40} /></div>;
  if (!session) return null; 

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0A192F] text-slate-900 dark:text-white font-sans transition-colors duration-300 pb-20">
      <Navbar />

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        
        {/* BACK BTN */}
        <div className="mb-8">
            <Link href="/" className="inline-flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 font-medium transition-colors">
                <div className="p-2 bg-white dark:bg-[#112240] rounded-full border border-gray-200 dark:border-white/5 shadow-sm"><Home size={18} /></div>
                Back to Home
            </Link>
        </div>

        <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h1 className="text-3xl md:text-4xl font-extrabold mb-2 tracking-tight">User Dashboard</h1>
                <p className="text-slate-500 dark:text-slate-400">Welcome back, {session.user?.name?.split(' ')[0]}! Manage your career profile.</p>
            </div>
            <div className="hidden md:block">
                 <span className="inline-flex items-center gap-2 px-4 py-2 bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300 rounded-lg text-sm font-bold border border-teal-100 dark:border-teal-800/30">
                    <Calendar size={16}/> {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                 </span>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* --- LEFT: PROFILE CARD --- */}
            <div className="lg:col-span-1 space-y-6">
                <div className="bg-white dark:bg-[#112240] rounded-3xl p-8 border border-gray-200 dark:border-white/5 shadow-xl shadow-slate-200/50 dark:shadow-black/20 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gray-100 dark:bg-white/5">
                        <motion.div 
                            className="h-full bg-gradient-to-r from-teal-400 to-teal-600 shadow-[0_0_10px_#2dd4bf]"
                            initial={{ width: 0 }} animate={{ width: `${completion}%` }} transition={{ duration: 1 }}
                        />
                    </div>

                    <div className="flex flex-col items-center text-center mt-2">
                        <motion.div 
                            className={`relative w-28 h-28 rounded-full p-1 bg-white dark:bg-[#112240] border-4 transition-all duration-500 ${completion === 100 ? 'border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.4)]' : 'border-teal-500/20'}`}
                            animate={{ scale: completion === 100 ? [1, 1.05, 1] : 1 }}
                        >
                            {session.user?.image ? (
                                <img src={session.user.image} alt="Profile" className="w-full h-full rounded-full object-cover" />
                            ) : (
                                <div className="w-full h-full rounded-full bg-slate-100 dark:bg-[#0A192F] flex items-center justify-center text-teal-600"><User size={48} /></div>
                            )}
                            <motion.div 
                                className={`absolute bottom-0 right-0 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border-2 border-white dark:border-[#112240] ${completion === 100 ? 'bg-green-500' : 'bg-slate-900 dark:bg-slate-700'}`}
                                key={completion} initial={{ scale: 0 }} animate={{ scale: 1 }}
                            >
                                {completion}%
                            </motion.div>
                        </motion.div>
                        
                        <h2 className="text-2xl font-bold mt-4">{session.user?.name}</h2>
                        <p className="text-sm font-medium text-teal-600 dark:text-teal-400 mb-1">
                            {profileData.headline || "Add your role..."}
                        </p>
                        
                        {profileData.lookingFor && (
                            <p className="text-[11px] font-semibold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 px-2 py-0.5 rounded mb-2">
                                Open to: {profileData.lookingFor}
                            </p>
                        )}

                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 flex items-center gap-1 justify-center">
                            <MapPin size={12}/> 
                            {profileData.location ? profileData.location : (profileData.detectedLocation ? `${profileData.detectedLocation} (Auto)` : "Add Location")}
                        </p>

                        <button onClick={() => setIsEditing(true)} className="w-full mb-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg active:scale-95">
                            <Edit3 size={16} /> {completion === 100 ? "Edit Profile" : "Complete Profile"}
                        </button>

                        <div className="w-full bg-slate-50 dark:bg-[#0A192F] rounded-xl p-4 grid grid-cols-2 gap-4 border border-gray-100 dark:border-white/5">
                             <div className="text-center">
                                 <span className="block text-2xl font-extrabold text-teal-600 dark:text-teal-400">{savedJobs.length}</span>
                                 <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Saved</span>
                             </div>
                             <div className="text-center border-l border-gray-200 dark:border-white/10">
                                 <span className="block text-2xl font-extrabold text-purple-600 dark:text-purple-400">Active</span>
                                 <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Status</span>
                             </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-[#112240] rounded-3xl p-6 border border-gray-200 dark:border-white/5 shadow-sm">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2">Social Profiles</h3>
                    <div className="space-y-3">
                        <SocialLinkRow icon={<Linkedin size={18} />} label="LinkedIn" url={profileData.linkedin} colorClass="text-blue-600 bg-blue-100" onClick={() => setIsEditing(true)} />
                        <SocialLinkRow icon={<XLogo className="w-[18px] h-[18px]" />} label="X Profile" url={profileData.x_handle} colorClass="text-black dark:text-white bg-gray-200 dark:bg-white/10" onClick={() => setIsEditing(true)} />
                        <SocialLinkRow icon={<Instagram size={18} />} label="Instagram" url={profileData.instagram} colorClass="text-pink-600 bg-pink-100" onClick={() => setIsEditing(true)} />
                    </div>
                </div>
            </div>

            {/* --- RIGHT: SAVED JOBS --- */}
            <div className="lg:col-span-2">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        <Bookmark className="text-teal-500 fill-teal-500" size={20} /> Saved Opportunities
                    </h3>
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 bg-white dark:bg-[#112240] px-3 py-1.5 rounded-full border border-gray-200 dark:border-white/5">
                        {savedJobs.length} Items
                    </span>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20"><Loader2 className="animate-spin text-teal-500" size={30} /></div>
                ) : savedJobs.length > 0 ? (
                    <div className="flex flex-col gap-4">
                        <AnimatePresence mode="popLayout">
                            {currentJobs.map((job, index) => {
                                // ID Logic
                                const uniqueKey = job._id || job.job_id || index; 
                                const idForAction = job.job_id || job._id; 
                                const jobUrl = job.source === 'twitter' ? `/x-jobs/${idForAction}` : `/linkedin-jobs/${idForAction}`;
                                
                                return (
                                <motion.div 
                                    layout 
                                    initial={{ opacity: 0, scale: 0.95 }} 
                                    animate={{ opacity: 1, scale: 1 }} 
                                    exit={{ opacity: 0, scale: 0.9 }} 
                                    key={uniqueKey} 
                                    onClick={() => router.push(jobUrl)} 
                                    className="group relative bg-white dark:bg-[#112240] p-5 rounded-2xl border border-gray-200 dark:border-white/5 hover:border-teal-500/50 dark:hover:border-teal-500/50 transition-all shadow-sm hover:shadow-lg cursor-pointer"
                                >
                                    {/* 🔥 ABSOLUTE DELETE BUTTON (Won't be blocked by text) */}
                                    <button 
                                        onClick={(e) => removeBookmark(e, idForAction)} 
                                        className="absolute top-4 right-4 z-50 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 bg-white/50 dark:bg-black/20 rounded-lg transition-all"
                                        title="Remove"
                                    >
                                        <Trash2 size={18} />
                                    </button>

                                    <div className="flex items-start gap-4 relative z-10">
                                        <div className="w-16 h-16 rounded-xl bg-slate-50 dark:bg-white p-2 flex items-center justify-center border border-gray-100 dark:border-white/5 shrink-0">
                                            <img src={job.employer_logo || "/fallback-job.png"} className="w-full h-full object-contain" onError={(e) => (e.currentTarget.src = "/fallback-job.png")} />
                                        </div>
                                        
                                        <div className="flex-1 min-w-0">
                                            {/* Padding right added so text doesn't go under delete button */}
                                            <div className="pr-12"> 
                                                <h4 className="font-bold text-lg text-slate-900 dark:text-white truncate">{job.job_title || "Unknown Title"}</h4>
                                            </div>

                                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500 dark:text-slate-400 mt-1">
                                                <span className="flex items-center gap-1 font-medium"><Building2 size={14}/> {job.employer_name}</span>
                                                <span className="flex items-center gap-1"><MapPin size={14}/> {job.job_city || "Remote"}</span>
                                            </div>
                                            
                                            <div className="mt-3 flex items-center gap-2">
                                                <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wide border ${
                                                    job.source === 'twitter' 
                                                    ? 'bg-black/5 text-black border-black/10 dark:bg-white dark:text-black dark:border-white' 
                                                    : 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800'
                                                }`}>
                                                    {job.source === 'twitter' ? <XLogo className="w-3 h-3" /> : <Linkedin size={12} />}
                                                    {job.source || 'LinkedIn'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )})}
                        </AnimatePresence>

                        {savedJobs.length > JOBS_PER_PAGE && (
                            <div className="flex justify-center items-center gap-4 mt-6 pt-6 border-t border-gray-100 dark:border-white/5">
                                <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="p-2 rounded-lg bg-white dark:bg-[#112240] border border-gray-200 dark:border-white/10 text-slate-600 dark:text-slate-300 disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-white/5"><ChevronLeft size={20} /></button>
                                <span className="text-sm font-bold text-slate-500 dark:text-slate-400">Page {currentPage} of {totalPages}</span>
                                <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="p-2 rounded-lg bg-white dark:bg-[#112240] border border-gray-200 dark:border-white/10 text-slate-600 dark:text-slate-300 disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-white/5"><ChevronRight size={20} /></button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white dark:bg-[#112240] rounded-3xl border border-dashed border-gray-300 dark:border-white/10">
                        <div className="w-16 h-16 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400"><Bookmark size={30} /></div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Saved Jobs Yet</h3>
                        <Link href="/x-jobs" className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-6 py-2.5 rounded-xl font-bold mt-4">Browse Jobs <ArrowRight size={18}/></Link>
                    </div>
                )}
            </div>
        </div>
      </main>

      {/* TOAST */}
      <AnimatePresence>
        {showToast && (
            <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} className="fixed bottom-8 right-8 bg-slate-900 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 z-[100]">
                <CheckCircle className="text-green-400" size={20} /> <span className="font-bold">Profile Updated!</span>
            </motion.div>
        )}
      </AnimatePresence>

      {/* EDIT MODAL */}
      <AnimatePresence>
        {isEditing && (
            <>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsEditing(false)} className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm" />
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: 20 }} 
                        animate={{ opacity: 1, scale: 1, y: 0 }} 
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="w-full max-w-md bg-white dark:bg-[#112240] rounded-3xl shadow-2xl border border-gray-200 dark:border-white/10 flex flex-col max-h-[85vh] pointer-events-auto"
                    >
                        <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-white/5 flex-shrink-0">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Update Profile</h2>
                            <button onClick={() => setIsEditing(false)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10"><X size={20}/></button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6 space-y-5">
                            <div className="space-y-4">
                                <InputField label="Headline" icon={<Briefcase size={18} />} name="headline" value={profileData.headline} onChange={handleInputChange} placeholder="e.g. Frontend Developer" />
                                <InputField label="What are you looking for?" icon={<Target size={18} />} name="lookingFor" value={profileData.lookingFor} onChange={handleInputChange} placeholder="e.g. Full-time SDE, Internship" />
                                <InputField label="Location" icon={<MapPin size={18} />} name="location" value={profileData.location} onChange={handleInputChange} placeholder="e.g. New Delhi" />
                            </div>
                            <div className="h-px bg-gray-100 dark:bg-white/10"></div>
                            <p className="text-xs font-bold text-slate-400 uppercase">Social Links</p>
                            <SocialInput icon={<Linkedin size={18} />} color="text-blue-600 bg-blue-100" name="linkedin" value={profileData.linkedin} onChange={handleInputChange} placeholder="LinkedIn URL" />
                            <SocialInput icon={<XLogo className="w-[18px] h-[18px]" />} color="text-black bg-gray-200" name="x_handle" value={profileData.x_handle} onChange={handleInputChange} placeholder="X Profile URL" />
                            <SocialInput icon={<Instagram size={18} />} color="text-pink-600 bg-pink-100" name="instagram" value={profileData.instagram} onChange={handleInputChange} placeholder="Instagram URL" />
                        </div>
                        <div className="p-6 border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-black/20 rounded-b-3xl flex-shrink-0">
                            <button onClick={handleSaveProfile} disabled={isSaving} className="w-full bg-teal-600 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-teal-500/20 hover:bg-teal-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95">
                                {isSaving ? <Loader2 className="animate-spin" size={20}/> : <Save size={20} />} {isSaving ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    </motion.div>
                </div>
            </>
        )}
      </AnimatePresence>
    </div>
  );
}

function SocialLinkRow({ icon, label, url, colorClass, onClick }: any) {
    return (
        <div onClick={onClick} className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${url ? 'bg-white dark:bg-[#0A192F] border-teal-200 dark:border-teal-900/50' : 'bg-slate-50 dark:bg-[#0A192F] border-gray-100 dark:border-white/5 hover:border-gray-300'}`}>
            <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${colorClass}`}>{icon}</div>
                <span className="text-sm font-medium text-slate-600 dark:text-slate-300">{label}</span>
            </div>
            {url ? (
                <a href={url} target="_blank" rel="noreferrer" className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full text-teal-600 transition-colors" onClick={(e) => e.stopPropagation()}><ExternalLink size={16}/></a>
            ) : <Plus size={16} className="text-slate-400" />}
        </div>
    );
}

function InputField({ label, icon, name, value, onChange, placeholder }: any) {
    return (
        <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">{label}</label>
            <div className="relative">
                <div className="absolute left-3 top-3.5 text-slate-400">{icon}</div>
                <input name={name} value={value || ""} onChange={onChange} placeholder={placeholder} className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 focus:border-teal-500 outline-none transition-all font-medium text-slate-900 dark:text-white" />
            </div>
        </div>
    );
}

function SocialInput({ icon, color, name, value, onChange, placeholder }: any) {
    return (
        <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg shrink-0 ${color}`}>{icon}</div>
            <input name={name} value={value || ""} onChange={onChange} placeholder={placeholder} className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 text-sm focus:border-teal-500 outline-none text-slate-900 dark:text-white" />
        </div>
    );
}
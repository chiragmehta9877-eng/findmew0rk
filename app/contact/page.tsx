'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Mail, User, MessageSquare, Send, CheckCircle2, Loader2, MapPin, HelpCircle } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSuccess(true);
        setFormData({ name: '', email: '', message: '' });
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      {/* 🔥 CUSTOM ANIMATION STYLES */}
      <style jsx global>{`
        @keyframes soothePop {
          0% { opacity: 0; transform: scale(0.95) translateY(30px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-soothe {
          opacity: 0; /* Initially hidden */
          animation: soothePop 1s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }
        .delay-100 { animation-delay: 100ms; }
        .delay-200 { animation-delay: 200ms; }
        .delay-300 { animation-delay: 300ms; }
        .delay-500 { animation-delay: 500ms; }
      `}</style>

      <div className="min-h-screen bg-slate-50 dark:bg-[#0A192F] transition-colors duration-300 overflow-hidden">
        
        {/* HEADER SECTION (First to Pop) */}
        <div className="bg-white dark:bg-[#112240] border-b border-gray-200 dark:border-white/5 py-12 md:py-20 animate-soothe">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <div className="inline-flex items-center justify-center p-2 bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400 rounded-full mb-6 px-4 text-xs font-bold uppercase tracking-wider border border-teal-100 dark:border-teal-800/50">
                    We'd love to hear from you
                </div>
                
                {/* UPDATED HEADING: Adjusted sizes and added max-w-4xl mx-auto for perfect wrapping */}
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-6 leading-tight max-w-4xl mx-auto">
                    Questions, Feedback, or a Hiring Post We Should <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-cyan-500 dark:from-teal-400 dark:to-cyan-300">Track?</span>
                </h1>
                
                {/* UPDATED PARAGRAPH */}
                <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
                    Reach Out - We Read Every Message!
                </p>
            </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                
                {/* LEFT SIDE: Contact Info (Second to Pop) */}
                <div className="space-y-8 lg:col-span-1 animate-soothe delay-200">
                    <div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Contact Info</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 leading-relaxed">
                            Fill up the form and our team will get back to you within 24 hours.
                        </p>
                    </div>

                    <div className="space-y-5">
                        <ContactCard 
                            icon={<Mail className="text-teal-600 dark:text-teal-400"/>}
                            title="Email Support"
                            value="support@findmework.com"
                            desc="We reply within 2 hours"
                        />
                        <ContactCard 
                            icon={<MapPin className="text-teal-600 dark:text-teal-400"/>}
                            title="Headquarters"
                            value="Remote First"
                            desc="Operating Worldwide"
                        />
                    </div>

                    {/* FAQ Mini Card */}
                    <div className="bg-gradient-to-br from-teal-50 to-white dark:from-teal-900/20 dark:to-[#0A192F] p-6 rounded-3xl border border-teal-100 dark:border-teal-800/30 shadow-sm mt-8">
                        <div className="flex items-start gap-3">
                            <HelpCircle className="text-teal-600 dark:text-teal-400 mt-1 shrink-0" size={24} />
                            <div>
                                <h4 className="font-bold text-slate-900 dark:text-teal-100 text-base">Need fast answers?</h4>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                                    Check out our FAQ section to find answers to the most common questions.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT SIDE: Form (Third to Pop) */}
                <div className="lg:col-span-2 animate-soothe delay-300">
                    <div className="bg-white dark:bg-[#112240] rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-black/20 border border-gray-100 dark:border-white/5 p-8 md:p-12 relative overflow-hidden">
                        
                        {/* Decorative Blob inside form */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full blur-3xl pointer-events-none"></div>

                        {success ? (
                            <div className="flex flex-col items-center justify-center text-center py-16 animate-soothe">
                                <div className="w-20 h-20 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center text-green-500 dark:text-green-400 mb-6 shadow-sm">
                                    <CheckCircle2 size={40} />
                                </div>
                                <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">Message Sent!</h3>
                                <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                                    Thank you for reaching out. We have received your message and will get back to you shortly.
                                </p>
                                <button 
                                    onClick={() => setSuccess(false)}
                                    className="mt-8 px-8 py-3 bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-200 font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
                                >
                                    Send Another
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Name Input */}
                                    <div className="space-y-3">
                                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Full Name</label>
                                        <div className={`flex items-center border rounded-2xl px-4 py-3.5 bg-slate-50 dark:bg-[#0A192F] transition-all duration-300 ${focused === 'name' ? 'border-teal-500 shadow-[0_0_0_4px_rgba(20,184,166,0.1)]' : 'border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600'}`}>
                                            <User size={20} className={`mr-3 transition-colors ${focused === 'name' ? 'text-teal-500' : 'text-slate-400'}`} />
                                            <input 
                                                type="text" 
                                                required
                                                placeholder="John Doe"
                                                className="bg-transparent w-full outline-none text-slate-900 dark:text-white placeholder:text-slate-400 text-sm font-medium"
                                                value={formData.name}
                                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                                onFocus={() => setFocused('name')}
                                                onBlur={() => setFocused(null)}
                                            />
                                        </div>
                                    </div>

                                    {/* Email Input */}
                                    <div className="space-y-3">
                                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Email Address</label>
                                        <div className={`flex items-center border rounded-2xl px-4 py-3.5 bg-slate-50 dark:bg-[#0A192F] transition-all duration-300 ${focused === 'email' ? 'border-teal-500 shadow-[0_0_0_4px_rgba(20,184,166,0.1)]' : 'border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600'}`}>
                                            <Mail size={20} className={`mr-3 transition-colors ${focused === 'email' ? 'text-teal-500' : 'text-slate-400'}`} />
                                            <input 
                                                type="email" 
                                                required
                                                placeholder="john@example.com"
                                                className="bg-transparent w-full outline-none text-slate-900 dark:text-white placeholder:text-slate-400 text-sm font-medium"
                                                value={formData.email}
                                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                                onFocus={() => setFocused('email')}
                                                onBlur={() => setFocused(null)}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Message Input */}
                                <div className="space-y-3">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Your Message</label>
                                    <div className={`border rounded-2xl px-4 py-3.5 bg-slate-50 dark:bg-[#0A192F] transition-all duration-300 ${focused === 'message' ? 'border-teal-500 shadow-[0_0_0_4px_rgba(20,184,166,0.1)]' : 'border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600'}`}>
                                        <textarea 
                                            required
                                            rows={5}
                                            placeholder="Tell us about your project or inquiry..."
                                            className="bg-transparent w-full outline-none text-slate-900 dark:text-white placeholder:text-slate-400 text-sm font-medium resize-none"
                                            value={formData.message}
                                            onChange={(e) => setFormData({...formData, message: e.target.value})}
                                            onFocus={() => setFocused('message')}
                                            onBlur={() => setFocused(null)}
                                        ></textarea>
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <button 
                                        type="submit" 
                                        disabled={loading}
                                        className="w-full bg-slate-900 dark:bg-teal-600 text-white font-bold text-lg py-4 rounded-2xl hover:bg-slate-800 dark:hover:bg-teal-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl hover:-translate-y-1 active:scale-95"
                                    >
                                        {loading ? <Loader2 size={22} className="animate-spin" /> : <Send size={22} />}
                                        {loading ? 'Sending Message...' : 'Send Message'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
      </div>
    </>
  );
}

// ✨ Helper Component: Contact Card
function ContactCard({ icon, title, value, desc }: any) {
    return (
        <div className="flex items-start gap-4 p-5 rounded-2xl hover:bg-white dark:hover:bg-[#112240] transition-all duration-300 border border-transparent hover:border-gray-100 dark:hover:border-white/5 hover:shadow-lg hover:-translate-y-1 cursor-default group bg-white/50 dark:bg-white/5 backdrop-blur-sm">
            <div className="mt-1 p-3 bg-white dark:bg-white/10 rounded-xl shrink-0 group-hover:bg-teal-50 dark:group-hover:bg-teal-900/20 transition-colors shadow-sm">
                {icon}
            </div>
            <div>
                <p className="text-base font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">{title}</p>
                <p className="text-sm font-medium text-teal-600 dark:text-teal-400 mt-0.5">{value}</p>
                <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">{desc}</p>
            </div>
        </div>
    );
}
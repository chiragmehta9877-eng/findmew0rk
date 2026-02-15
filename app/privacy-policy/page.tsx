'use client'; // Client component zaroori hai animations ke liye

import React from "react";
import Navbar from '@/components/Navbar'; 

// 🔥 Dono imports ko combine kar diya gaya hai taaki koi duplicate error na aaye
import { 
  Target, Briefcase, BookOpen, Database, Cookie, Server, Minimize, 
  Globe, Share2, Lock, Shield, AlertTriangle, Archive, UserCheck, 
  RefreshCw, Eye, Mail, FileText, CheckCircle2, ExternalLink 
} from 'lucide-react';

export default function PrivacyPolicyPage() {
  // आज की तारीख या डायनामिक डेट
  const lastUpdated = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <>
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

      <div className="min-h-screen bg-slate-50 dark:bg-[#0A192F] transition-colors duration-300 overflow-hidden relative font-sans selection:bg-teal-500/30 selection:text-teal-900 dark:selection:text-teal-100">
          
          <Navbar />
          
        {/* 🔥 AMBIENT BACKGROUND BLOBS */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-teal-500/20 dark:bg-teal-500/10 rounded-full blur-[120px] -z-10 pointer-events-none mix-blend-multiply dark:mix-blend-soft-light animate-pulse-slow"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-500/20 dark:bg-purple-500/10 rounded-full blur-[120px] -z-10 pointer-events-none mix-blend-multiply dark:mix-blend-soft-light animate-pulse-slow animation-delay-2000"></div>

        {/* --- MAIN CONTAINER --- */}
        <main className="max-w-4xl mx-auto px-4 sm:px-6 py-16 md:py-24 relative z-10">
          
          {/* 🔥 HERO SECTION (First Pop) */}
          <div className="text-center mb-16 animate-soothe">
              <div className="inline-flex items-center justify-center p-4 bg-white dark:bg-white/5 rounded-2xl shadow-xl shadow-teal-500/10 dark:shadow-teal-500/5 border border-gray-100 dark:border-white/10 mb-6 backdrop-blur-md">
                  <Shield size={40} className="text-teal-600 dark:text-teal-400" />
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6">
                  We Value Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-cyan-500 dark:from-teal-400 dark:to-cyan-300">Privacy</span>
              </h1>
              <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
                  Transparency is key. This document explains in plain English how we handle your data at FindMeWork.
              </p>
              <div className="inline-block mt-6 px-4 py-2 rounded-full bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300 text-sm font-bold border border-teal-100 dark:border-teal-800/50">
                  Last Updated: February 16, 2026
              </div>
          </div>

        {/* 🔥 CONTENT CARDS (Second Pop - Delayed) */}
<div className="space-y-8 animate-soothe delay-200">

    {/* 1. Objective */}
    <SectionCard 
        icon={<Target size={24} />} 
        title="1. Objective"
    >
        <p className="mb-4">
            FindMeWork is committed to establishing and maintaining a robust framework to ensure the lawful, fair, and transparent collection, processing, storage, and management of personal and organisational data. The Company recognises that data is a vital asset and must be protected with the highest standards of integrity, confidentiality, and security.
        </p>
        <p>
            This Policy aims to safeguard the privacy rights of all data principals, including clients, their representatives, employees, vendors, and visitors to project sites, in accordance with applicable data protection and privacy laws and regulations.
        </p>
    </SectionCard>

    {/* 2. Purpose & Applicability */}
    <SectionCard 
        icon={<Briefcase size={24} />} 
        title="2. Purpose & Applicability"
    >
        <p>
            This Policy applies to all personal data collected by the Company through its website, email, other electronic communications, or in-person interactions. It is applicable to all employees or vendors who handle or process such data on behalf of the Company.
        </p>
    </SectionCard>

    {/* 3. Definition */}
    <SectionCard 
        icon={<BookOpen size={24} />} 
        title="3. Definition"
    >
        <ul className="space-y-4">
            <ListItem title='"PERSONAL DATA"'>
                Means data about a living individual that can be used to identify them, either directly or indirectly.
            </ListItem>
            <ListItem title='"USAGE DATA"'>
                Means data collected automatically when using a service. This includes details such as pages visited, time spent on pages, browser type, IP address, and other diagnostic data generated through interaction with the website or app.
            </ListItem>
            <ListItem title='"COOKIES"'>
                Are small files stored on your device (computer or mobile device).
            </ListItem>
            <ListItem title='"USER"'>
                Means the individual using the service or website.
            </ListItem>
            <ListItem title='"EFFECTIVE DATE"'>
                Means the date from which the terms of the policy or document become active and enforceable.
            </ListItem>
        </ul>
    </SectionCard>

    {/* 4. Information Collection and Use */}
    <SectionCard 
        icon={<Database size={24} />} 
        title="4. Information Collection and Use"
    >
        <p className="mb-4">
            The Company may collect certain personally identifiable information ("Personal Data") that can be used to identify or contact an individual, as well as certain technical and usage related data ("Usage Data") collected through cookies, analytics tools, or similar technologies, for the purpose of enhancing user experience and improving services.
        </p>
        <p className="mb-4 font-semibold text-gray-800 dark:text-gray-200">The Company may collect the following categories of information:</p>
        <ul className="space-y-4">
            <ListItem title="4.1 Personal Data">
                Information that can identify you directly or indirectly, such as name, email address, phone number & postal address.
            </ListItem>
            <ListItem title="4.2 Usage Data">
                Information collected automatically when you visit the website, including IP address, browser type, operating system, device identifiers, referring website URLs, Pages visited, time spent, and other usage statistics.
            </ListItem>
        </ul>
    </SectionCard>

    {/* 5. Tracking & Cookies Data */}
    <SectionCard 
        icon={<Cookie size={24} />} 
        title="5. Tracking & Cookies Data"
    >
        <p>
            The Company’s website uses cookies and similar technologies to enable essential site functionality, remember user preferences, and analyse website usage and traffic trends. Users may manage or disable cookies through their browser settings, however, doing so may limit the functionality or availability of certain website features.
        </p>
    </SectionCard>

    {/* 6. Use of Information */}
    <SectionCard 
        icon={<Server size={24} />} 
        title="6. Use of Information"
    >
        <p className="mb-4">The Company uses the collected information for purposes including:</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CheckItem>Providing, operating, and improving the Company’s website and services.</CheckItem>
            <CheckItem>Responding to customer inquiries and providing support.</CheckItem>
            <CheckItem>Sending service updates and communications, and promotional content only where consent has been obtained.</CheckItem>
            <CheckItem>Analysing website performance and usage trends to enhance functionality.</CheckItem>
            <CheckItem>Complying with applicable legal and regulatory requirements.</CheckItem>
        </div>
    </SectionCard>

    {/* 7. Data Minimization & Purpose Limitation */}
    <SectionCard 
        icon={<Minimize size={24} />} 
        title="7. Data Minimization & Purpose Limitation"
    >
        <p className="mb-4">The Company is committed to the principles of data minimisation and purpose limitation in the collection and processing of Personal Data. Accordingly, the Company shall:</p>
        <div className="grid grid-cols-1 gap-4 mb-4">
            <CheckItem>Collect only such Personal Data as is necessary, relevant, and proportionate to fulfil the specific purposes outlined in this Policy.</CheckItem>
            <CheckItem>Process Personal Data solely for the purposes for which it was collected, unless further processing is required or permitted under applicable law.</CheckItem>
            <CheckItem>Avoid the collection or retention of excessive, redundant, or irrelevant data.</CheckItem>
            <CheckItem>Periodically review the categories of Personal Data collected to ensure continued relevance and necessity.</CheckItem>
            <CheckItem>Ensure that Personal Data is not repurposed in a manner that is incompatible with the original purpose of collection, without a lawful basis or appropriate consent.</CheckItem>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">These principles are applied across all data handling activities to reduce privacy risks and ensure responsible data governance.</p>
    </SectionCard>

    {/* 8. Transfer of Personal Data */}
    <SectionCard 
        icon={<Globe size={24} />} 
        title="8. Transfer of Personal Data"
    >
        <p className="mb-4">
            Users’ information, including Personal Data, may be transferred to and processed on servers or systems located outside the jurisdiction in which the data subject resides, where data protection laws may differ. Where such transfers occur, the Company will take reasonable steps to ensure that Personal Data is handled securely and in accordance with this Policy.
        </p>
        <p>
            Any cross-border transfer of Personal Data shall be undertaken only where appropriate safeguards are in place, and in compliance with applicable data protection and privacy laws. By accessing the Company’s services and submitting information, users acknowledge that such transfers may occur, where permitted by law.
        </p>
    </SectionCard>

    {/* 9. Disclosure of Personal Data */}
    <SectionCard 
        icon={<Share2 size={24} />} 
        title="9. Disclosure of Personal Data"
    >
        <ul className="space-y-4 mb-4">
            <ListItem title="9.1 Law Enforcement">
                Under certain circumstances, the Company may be required to disclose users’ Personal Data where such disclosure is mandated by applicable law or made in response to valid and lawful requests from competent public authorities.
            </ListItem>
        </ul>
        <p className="mb-4 font-semibold text-gray-800 dark:text-gray-200">9.2 Other Legal Requirements</p>
        <p className="mb-4">The Company may disclose users’ personal data in good faith when such action is necessary to:</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CheckItem>Comply with a legal obligation.</CheckItem>
            <CheckItem>Protect and defend the rights or property of the Company.</CheckItem>
            <CheckItem>Prevent or investigate possible wrongdoing in connection with the Company’s services.</CheckItem>
            <CheckItem>Protect the personal safety of users of the service or the public.</CheckItem>
            <CheckItem>Protect against legal liability.</CheckItem>
        </div>
    </SectionCard>

    {/* 10. Data Security (Kept the special teal box design from previous section 3) */}
    <SectionCard 
        icon={<Lock size={24} />} 
        title="10. Data Security"
    >
        <div className="p-6 bg-teal-50/50 dark:bg-teal-900/20 rounded-xl border border-teal-100 dark:border-teal-800/50 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-teal-500"></div>
            <h4 className="text-lg font-bold text-teal-800 dark:text-teal-200 flex items-center gap-2 mb-2">
                <Shield size={20} className="inline"/> Security Commitment
            </h4>
            <p className="text-teal-700 dark:text-teal-300 font-medium leading-relaxed">
                The Company takes appropriate technical and organisational measures to protect users’ Personal Data against unauthorised access, alteration, disclosure, or destruction. Despite these measures, no system is completely secure, and the Company cannot guarantee absolute security of information transmitted electronically.
            </p>
        </div>
    </SectionCard>

    {/* 11. Data Breach Management & Notification */}
    <SectionCard 
        icon={<AlertTriangle size={24} />} 
        title="11. Data Breach Management & Notification"
    >
        <p className="mb-4">The Company maintains procedures to identify, respond to, and manage any actual or suspected data security incidents, including unauthorised access, disclosure, loss, or misuse of Personal Data (“Data Breach”). In the event of a Data Breach, the Company shall:</p>
        <div className="grid grid-cols-1 gap-4">
            <CheckItem>Take prompt and reasonable steps to assess the nature and scope of the incident and to contain and mitigate any potential adverse impacts.</CheckItem>
            <CheckItem>Initiate appropriate internal incident management and investigation procedures to determine root causes and prevent recurrence.</CheckItem>
            <CheckItem>Implement corrective and preventive measures, as necessary, to strengthen data security controls.</CheckItem>
            <CheckItem>Notify affected data principals, regulators, or other authorities where such notification is required under applicable law.</CheckItem>
            <CheckItem>Ensure all Data Breaches and response actions are documented in accordance with internal governance.</CheckItem>
        </div>
    </SectionCard>

    {/* 12. Data Retention */}
    <SectionCard 
        icon={<Archive size={24} />} 
        title="12. Data Retention"
    >
        <p>
            The Company retains users’ information only for as long as necessary to fulfil the purposes for which it was collected, or as required by applicable law. Once no longer required, such data is securely deleted or anonymised.
        </p>
    </SectionCard>

    {/* 13. Users’ Rights */}
    <SectionCard 
        icon={<UserCheck size={24} />} 
        title="13. Users’ Rights"
    >
        <p className="mb-4">Depending on applicable law, users’ may have the right to:</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <CheckItem>Access, update, or correct their Personal Data.</CheckItem>
            <CheckItem>Withdraw consent for data processing, where applicable.</CheckItem>
            <CheckItem>Request deletion of Personal Data, subject to limitations.</CheckItem>
        </div>
        <p className="text-sm font-medium">To exercise these rights, please contact us using the details provided below.</p>
    </SectionCard>

    {/* 14. Changes to This Policy */}
    <SectionCard 
        icon={<RefreshCw size={24} />} 
        title="14. Changes to This Policy"
    >
        <p>
            The Company may update this Privacy Policy from time to time. Any revisions will be posted on the website with an updated “Effective Date.” Continued use of the website following such changes constitutes acknowledgement of the revised Policy.
        </p>
    </SectionCard>
    

              {/* 🔥 CONTACT SECTION (Third Pop - More Delayed) */}
              <div className="mt-16 pt-8 border-t border-gray-200 dark:border-white/10 text-center animate-soothe delay-300">
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center justify-center gap-3 mb-4">
                      <Mail className="text-teal-500"/> Still have questions?
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300 mb-6">
                        If you have any questions or concerns about this Privacy Policy, please contact us.
                    </p>
                    <a href="mailto:support@findmew0rk.com">
                      <button className="group relative inline-flex items-center justify-center px-8 py-3.5 font-bold text-white rounded-full bg-gradient-to-r from-teal-600 to-cyan-500 dark:from-teal-500 dark:to-cyan-400 shadow-lg shadow-teal-500/30 hover:shadow-xl hover:shadow-teal-500/40 transition-all active:scale-95 overflow-hidden">
                          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
                          <Mail size={18} className="mr-2"/> Contact Support
                      </button>
                    </a>
              </div>

                {/* Footer Note */}
              <div className="text-center mt-12 text-slate-500 dark:text-slate-400 text-sm font-medium animate-soothe delay-500">
                  &copy; {new Date().getFullYear()} FindMeWork. Built with trust.
              </div>

          </div>
        </main>
      </div>
    </>
  );
}

// ==========================================
// 👇 SUB-COMPONENTS (SAME AS BEFORE)
// ==========================================

function SectionCard({ icon, title, children }: { icon: React.ReactNode, title: string, children: React.ReactNode }) {
    return (
        <section className="bg-white/80 dark:bg-[#112240]/80 backdrop-blur-lg rounded-3xl p-8 md:p-10 shadow-xl shadow-slate-200/50 dark:shadow-black/30 border border-gray-100 dark:border-white/5 transition-all hover:shadow-2xl hover:-translate-y-1 group relative overflow-hidden">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-teal-500/0 via-teal-500/10 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            
            <h2 className="flex items-center gap-4 text-2xl font-bold text-slate-900 dark:text-white mb-6 relative z-10">
                <div className="p-3 bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 rounded-2xl group-hover:scale-110 transition-transform shadow-sm">
                    {icon}
                </div>
                {title}
            </h2>
            <div className="text-slate-600 dark:text-slate-300 leading-relaxed text-base md:text-lg space-y-4 relative z-10">
                {children}
            </div>
        </section>
    );
}

function ListItem({ title, children }: { title: string, children: React.ReactNode }) {
    return (
        <li className="flex gap-4 items-start">
            <div className="mt-1.5 p-1 bg-teal-100 dark:bg-teal-900/50 rounded-full shrink-0">
                <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
            </div>
            <div>
                <strong className="block text-slate-900 dark:text-white font-bold mb-1">{title}</strong>
                <span className="text-slate-600 dark:text-slate-400">{children}</span>
            </div>
        </li>
    );
}

function CheckItem({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/5">
            <CheckCircle2 size={20} className="text-teal-500 shrink-0" />
            <span className="text-slate-700 dark:text-slate-200 font-medium">{children}</span>
        </div>
    );
}
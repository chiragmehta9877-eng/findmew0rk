'use client';

import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { ShieldAlert, Lock } from 'lucide-react';

export default function BlockedPopup() {
  const { data: session } = useSession();
  const [isBlocked, setIsBlocked] = useState(false);
  const pathname = usePathname(); // Jab bhi page badlega, check hoga

  useEffect(() => {
    if (session?.user) {
      checkStatus();
    }
  }, [session, pathname]); // Session ya Route change hone par check karo

  const checkStatus = async () => {
    try {
      const res = await fetch('/api/auth/status');
      const data = await res.json();
      
      if (data.isActive === false) {
        setIsBlocked(true);
      }
    } catch (error) {
      console.error("Status check failed", error);
    }
  };

  if (!isBlocked) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-slate-900/90 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 text-center border-4 border-red-100 animate-in fade-in zoom-in duration-300">
        
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldAlert className="text-red-500 w-10 h-10" />
        </div>

        <h2 className="text-2xl font-black text-slate-900 mb-3">Access Revoked</h2>
        
        <p className="text-slate-600 font-medium mb-8 leading-relaxed">
          Your account has been <span className="text-red-600 font-bold">BLOCKED</span> due to suspicious or malicious activity. You can no longer access jobs or apply.
        </p>

        <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-8 text-left flex items-start gap-3">
             <Lock className="text-red-500 mt-1 shrink-0" size={18} />
             <div>
                 <p className="text-xs font-bold text-red-800 uppercase tracking-wide mb-1">Admin Notice:</p>
                 <p className="text-xs text-red-600 font-semibold">Contact support if you believe this is a mistake.</p>
             </div>
        </div>

        <button 
            onClick={() => signOut({ callbackUrl: '/' })}
            className="w-full py-3.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-black transition-all shadow-lg shadow-slate-200"
        >
            Sign Out Immediately
        </button>

      </div>
    </div>
  );
}
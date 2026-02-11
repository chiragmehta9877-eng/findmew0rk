'use client';

import { usePathname } from 'next/navigation';
import MaintenancePage from '@/app/maintenance/page'; 
import { useEffect, useState } from 'react';

interface Props {
  children: React.ReactNode;
  initialStatus: boolean; 
}

export default function MaintenanceWrapper({ children, initialStatus }: Props) {
  const pathname = usePathname();
  
  // 1. Initial State: Server ne jo bola wo maan lo
  const [isMaintenance, setIsMaintenance] = useState(initialStatus);

  useEffect(() => {
    // 2. Agar Admin route hai, toh check mat karo
    if (pathname.startsWith('/admin')) return;

    // 3. Browser Check (Client Side)
    const checkStatus = async () => {
      try {
        const res = await fetch(`/api/settings/check?t=${Date.now()}`, { 
          cache: 'no-store' 
        });
        const data = await res.json();
        
        // Agar status change hua hai, tabhi update karo
        setIsMaintenance(prev => {
             if (prev !== data.isMaintenance) return data.isMaintenance;
             return prev;
        });

      } catch (err) {
        console.error("Check Failed", err);
      }
    };

    // Sirf page load hone par check karo (Interval hata diya flash rokne ke liye)
    checkStatus();

    // Safety: Har 10 second mein silently check karo (optional)
    const interval = setInterval(checkStatus, 10000);
    return () => clearInterval(interval);

  }, []); // 👈 Dependency array KHAAALI rakho []

  // 🔴 ADMIN SAFEGUARD
  if (pathname.startsWith('/admin')) {
    return <>{children}</>;
  }

  // 🔴 MAINTENANCE CHECK (Sirf tab dikhao jab sure ho)
  // Agar initialStatus False tha, aur state bhi False hai -> Toh mat dikhao
  if (isMaintenance) {
    return <MaintenancePage />;
  }

  // 🟢 NORMAL SITE
  return <>{children}</>;
}
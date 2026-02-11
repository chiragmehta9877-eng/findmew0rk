'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export default function MaintenanceListener() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Admin routes ko disturb mat karo
    if (pathname.startsWith('/admin')) return;

    const checkStatus = async () => {
      try {
        // Timestamp lagaya taaki browser cache na kare
        const res = await fetch(`/api/settings/check?t=${Date.now()}`, { cache: 'no-store' });
        const data = await res.json();
        
        const isMaintenance = data.isMaintenance;
        const isOnMaintenancePage = pathname === '/maintenance';

        console.log(`Listener Check: Mode=${isMaintenance}, CurrentPage=${pathname}`);

        // 🔴 CASE 1: Maintenance ON hai, lekin user abhi andar hai -> Bahar pheko
        if (isMaintenance && !isOnMaintenancePage) {
           console.warn("⛔ Redirecting to Maintenance...");
           window.location.href = "/maintenance"; 
        }

        // 🟢 CASE 2: Maintenance OFF hai, lekin user abhi bhi Maintenance page par atka hai -> Wapis lao
        if (!isMaintenance && isOnMaintenancePage) {
           console.log("✅ Site is Back! Redirecting Home...");
           window.location.href = "/"; // Force Reload to clear UI states
        }

      } catch (error) {
        console.error("Listener Error:", error);
      }
    };

    // Har 2 second mein check karo
    const interval = setInterval(checkStatus, 2000);
    
    return () => clearInterval(interval);
  }, [pathname, router]);

  return null;
}
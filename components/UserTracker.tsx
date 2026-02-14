'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';

export default function UserTracker() {
  const { data: session } = useSession();

  useEffect(() => {
    // 1. Check if session and user exist
    if (session?.user) {
      // @ts-ignore
      const userId = session.user.id || session.user._id;

      // 🔥 2. Get Cookie Consent status from localStorage
      const consent = localStorage.getItem('cookieConsent');
      const isConsentGiven = consent === 'true'; // Agar 'true' string hai toh true, warna false

      console.log("🔍 Tracker Debug:", {
        email: session.user.email,
        consent: isConsentGiven ? "Accepted ✅" : "Rejected 🛑"
      });

      if (!userId) {
        console.error("❌ User ID missing in Session! Check NextAuth callbacks.");
        return;
      }

      // 3. Send request to tracking API
      fetch('/api/auth/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId, 
          cookieConsent: isConsentGiven // 🔥 Bhejna zaroori hai backend logic ke liye
        }),
      })
      .then(res => res.json())
      .then(data => {
          if(data.success) {
              if (data.location) {
                console.log("✅ Location Tracked Successfully:", data.location);
              } else {
                console.log("ℹ️ Login Recorded (Tracking skipped per privacy settings)");
              }
          } else {
              console.error("❌ Tracking API Error:", data.message);
          }
      })
      .catch(err => console.error("❌ Network Error in Tracker", err));
    }
  }, [session]);

  return null;
}
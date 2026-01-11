'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';

export default function UserTracker() {
  const { data: session } = useSession();

  useEffect(() => {
    // Check karo session load hua ya nahi
    if (session?.user) {
      // @ts-ignore
      const userId = session.user.id || session.user._id;

      console.log("🔍 Tracker Trying to Track:", session.user.email); // Debug Log 1

      if (!userId) {
        console.error("❌ User ID missing in Session! Check NextAuth callbacks.");
        return;
      }

      fetch('/api/auth/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      })
      .then(res => res.json())
      .then(data => {
          if(data.success) {
              console.log("✅ Location Tracked Successfully:", data.location);
          } else {
              console.error("❌ Tracking API Error:", data.message);
          }
      })
      .catch(err => console.error("❌ Network Error in Tracker", err));
    }
  }, [session]);

  return null;
}
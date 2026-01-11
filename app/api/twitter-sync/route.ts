// 1. Caching Disable karne ke liye
export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { NextResponse } from 'next/server';

// ... (Interfaces same as before) ...
interface CleanJobPost {
  category: 'Internship' | 'Job' | 'Freelance';
  email: string;
  workMode: 'Remote' | 'Hybrid' | 'Onsite';
  location: string;
  text: string;
}

// ... (Helper functions: extractEmail, isHiringPost, detectCategory etc. same as before) ...
// (Space bachane ke liye functions repeat nahi kar raha, wo same rahenge)

function extractEmail(text: string): string | null {
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
  const match = text.match(emailRegex);
  return match ? match[0] : null;
}

// ... other helper functions ...

export async function POST(req: Request) {
  try {
    const { tweets } = await req.json();

    if (!tweets || !Array.isArray(tweets)) {
      return NextResponse.json({ success: false, message: "No tweets provided" }, { status: 400 });
    }

    // TIMESTAMP LOG: Console me check karna ki request abhi ki hai ya purani
    console.log(`Processing new request at: ${new Date().toISOString()}`);

    const cleanedJobs: CleanJobPost[] = [];
    
    // Logic same as before...
    // (extractEmail, filtering logic here)
    // ...

    // Response me headers set karo taki browser bhi cache na kare
    return NextResponse.json(
      { success: true, timestamp: new Date().toISOString(), count: cleanedJobs.length, data: cleanedJobs },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      }
    );

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
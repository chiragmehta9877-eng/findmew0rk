export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const maxDuration = 60;

import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import Job from "@/models/Job";
import axios from "axios";

// 🔑 KEYS & CONFIG
const RAPID_API_KEY = '15ecf5c2e1msha76c0e9843b9e44p10032bjsn8fc2c9cbe2d8';
const TWITTER_HOST = 'twitter-api45.p.rapidapi.com';

const MAX_API_CALLS = 12;
const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;

// 🔥 CORS Setup
function setCorsHeaders(res: NextResponse) {
  res.headers.set('Access-Control-Allow-Origin', '*');
  res.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return res;
}

export async function OPTIONS() {
  return setCorsHeaders(NextResponse.json({}, { status: 200 }));
}

// Queries
function getExpandedQuery(category: string): string {
  const c = category.toLowerCase();
  if (c === 'job' || c === 'all jobs') return '("Hiring" OR "Vacancy" OR "Job Opening" OR "Urgent" OR "Role" OR "Opportunity")';
  if (c.includes('software') || c.includes('developer')) return '("Software Engineer" OR "SDE" OR "React" OR "Node.js" OR "Backend" OR "Full Stack" OR "Python")';
  if (c.includes('data')) return '("Data Scientist" OR "Data Analyst" OR "Machine Learning" OR "AI Engineer")';
  if (c.includes('marketing')) return '("Marketing" OR "SEO" OR "Social Media")';
  if (c.includes('intern')) return '("Internship" OR "Summer Intern" OR "Intern")';
  if (c.includes('freelance')) return '("Freelance" OR "Freelancer" OR "Contract")';
  return `"${category}"`; 
}

// Helpers
function inferWorkType(text: string): string {
  const t = text.toLowerCase();
  if (t.includes('intern')) return 'Internship';
  if (t.includes('freelance') || t.includes('contract')) return 'Freelance';
  return 'Full-time';
}

function inferLocation(text: string): string {
  const t = text.toLowerCase();
  if (t.includes('remote') || t.includes('wfh')) return 'Remote';
  return 'Global';
}

function getSmartDbQuery(source: string, category: string) {
    let query: any = { source: source };
    const c = category.toLowerCase();

    if (c.includes('data')) query.category = { $regex: /data|scientist|ai|ml/i };
    else if (c.includes('software') || c.includes('developer')) query.category = { $regex: /software|developer|engineer/i };
    else if (c.includes('intern')) query.category = { $regex: /intern/i };
    else if (c.includes('freelance')) query.category = { $regex: /freelance/i };
    else if (c !== 'job' && c !== 'all jobs') query.category = { $regex: new RegExp(category, 'i') };
    
    return query;
}

export async function GET(req: Request) {
  try {
    await connectToDB();
    const { searchParams } = new URL(req.url);
    
    if (searchParams.get('wipe_db') === 'true') {
        await Job.deleteMany({});
        return setCorsHeaders(NextResponse.json({ message: "DB Cleared" }));
    }

    const source = searchParams.get("source") || "twitter";
    const category = searchParams.get("category") || "job";
    const refresh = searchParams.get("refresh") === 'true';
    const limitParam = searchParams.get("limit"); 
    const TARGET_JOB_COUNT = limitParam ? parseInt(limitParam) : 40;
    const specificId = searchParams.get("id");

    if (specificId) {
        const job = await Job.findOne({ job_id: specificId });
        return setCorsHeaders(NextResponse.json({ success: true, data: job }));
    }

    const dbQuery = getSmartDbQuery(source, category);

    // 1️⃣ INITIAL FETCH (No Refresh)
    if (!refresh) {
      // 🔥 UPDATED: Limit set to 1000
      const jobs = await Job.find(dbQuery).sort({ createdAt: -1 }).limit(1000);
      return setCorsHeaders(NextResponse.json({ success: true, total: jobs.length, data: jobs }));
    }

    // 🔥 Count Before Fetch
    const countBefore = await Job.countDocuments(dbQuery);

    // 2️⃣ FETCH FRESH DATA
    console.log(`🚀 Fetching ${TARGET_JOB_COUNT} NEW Jobs for: ${category}`);

    let fetchedJobs: any[] = [];
    const seenIds = new Set(); 
    let cursor = '';
    let calls = 0;

    while (fetchedJobs.length < TARGET_JOB_COUNT && calls < MAX_API_CALLS) {
      calls++;
      const apiUrl = `https://${TWITTER_HOST}/search.php`;
      const searchTerms = getExpandedQuery(category);
      const twitterQuery = `${searchTerms} ("hiring" OR "looking for") ("mail at" OR "send cv" OR "email") -filter:retweets`;

      try {
        const response = await axios.get(apiUrl, {
          params: { query: twitterQuery, search_type: 'Latest', cursor: cursor },
          headers: { 'X-RapidAPI-Key': RAPID_API_KEY, 'X-RapidAPI-Host': TWITTER_HOST }
        });

        const rawData = response.data.timeline || [];
        if (response.data.next_cursor) cursor = response.data.next_cursor;
        else if (rawData.length === 0) break; 

        for (const item of rawData) {
          if (seenIds.has(item.tweet_id)) continue;
          
          const text = item.text || "";
          const emailMatch = text.match(emailRegex);
          const isSpam = text.toLowerCase().includes('course') || text.toLowerCase().includes('crypto');

          if (emailMatch && !isSpam) {
              const isTextDuplicate = fetchedJobs.some(j => j.text === text);
              if (!isTextDuplicate) {
                  const workType = inferWorkType(text);
                  const location = inferLocation(text);
                  
                  const safeCategory = category.replace(/\s+/g, '_').toLowerCase();
                  const uniqueJobId = `${item.tweet_id}__${safeCategory}`;

                  fetchedJobs.push({
                      job_id: uniqueJobId, 
                      job_title: category === 'job' 
                          ? `Hiring Opportunity (${workType})` 
                          : `${category} Role (${workType})`,
                      employer_name: item.screen_name ? `@${item.screen_name}` : "Recruiter",
                      employer_logo: "https://upload.wikimedia.org/wikipedia/commons/c/ce/X_logo_2023.svg",
                      link: item.url,
                      text: text,
                      source: source,
                      category: category,
                      job_city: location,
                      email: emailMatch[0],
                      posted_at: new Date()
                  });
                  seenIds.add(item.tweet_id);
              }
          }
        }
      } catch (error) { console.error("API Error"); }
      await new Promise(r => setTimeout(r, 500)); 
    }

    if (fetchedJobs.length > 0) {
      for (const job of fetchedJobs) {
           await Job.updateOne(
             { job_id: job.job_id }, 
             { $set: job }, 
             { upsert: true }
           );
      }
    }

    // 🔥 Count After Fetch & Calc Added
    const countAfter = await Job.countDocuments(dbQuery);
    const actualAdded = countAfter - countBefore;

    // Final Fetch
    // 🔥 UPDATED: Limit set to 1000
    const finalJobs = await Job.find(dbQuery)
                           .sort({ createdAt: -1 })
                           .limit(1000); 

    return setCorsHeaders(NextResponse.json({ 
        success: true, 
        added: actualAdded,  
        total: countAfter,    
        data: finalJobs 
    }));

  } catch (err: any) {
    if (err.code === 11000) {
        return setCorsHeaders(NextResponse.json({ success: true, message: "Partial Update" }));
    }
    return setCorsHeaders(NextResponse.json({ success: false, error: err.message }, { status: 500 }));
  }
}
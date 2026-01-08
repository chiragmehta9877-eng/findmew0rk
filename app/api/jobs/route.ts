import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import Job from "@/models/Job";
import axios from "axios";

// 🔑 KEYS & CONFIG
const RAPID_API_KEY = '15ecf5c2e1msha76c0e9843b9e44p10032bjsn8fc2c9cbe2d8';
const GOOGLE_HOST = 'google-search74.p.rapidapi.com';
const TWITTER_HOST = 'twitter-api45.p.rapidapi.com';

// 🔥 Helper Functions
function getDateFilter() {
  const date = new Date();
  date.setMonth(date.getMonth() - 1);
  return date.toISOString().split('T')[0];
}

function getKeywords(category: string) {
  if (category === 'ESG') return '("ESG" OR "Sustainability" OR "Climate" OR "Green Energy")';
  if (category === 'Developer') return '("Developer" OR "Software Engineer" OR "React" OR "Full Stack")';
  if (category === 'Internship') return '("Intern" OR "Internship" OR "Trainee" OR "Summer Analyst" OR "Fresher")';
  if (category === 'Product') return '("Product Manager" OR "Product Owner" OR "PM")';
  if (category === 'Data') return '("Data Scientist" OR "Data Analyst" OR "Machine Learning" OR "AI Engineer")';
  if (category === 'Business') return '("Business Analyst" OR "Sales" OR "BDM" OR "Consultant")';
  if (category === 'Marketing') return '("Marketing" OR "SEO" OR "Social Media" OR "Content Writer")';
  return `"${category}"`;
}

// ✅ GET Handler
export async function GET(req: Request) {
  try {
    await connectToDB();

    // Query Params nikalne ka tarika Next.js mein
    const { searchParams } = new URL(req.url);
    const source = searchParams.get("source") || "linkedin";
    const category = searchParams.get("category") || "ESG";
    const refresh = searchParams.get("refresh");

    let jobs: any[] = [];

    // 1. Agar refresh nahi hai, toh DB check karo
    if (refresh !== 'true') {
      jobs = await Job.find({
        source: source,
        category: { $regex: new RegExp(category, "i") }
      }).sort({ date_added: -1 }).limit(40);
    }

    // 2. Agar DB empty hai ya refresh manga hai, toh API call karo
    if (jobs.length === 0 || refresh === 'true') {
      console.log(`⚡ Fetching Live Data for ${category} (${source})...`);
      
      const dateStr = getDateFilter();
      const searchTerms = getKeywords(category);

      const apiUrl = source === 'linkedin' ? `https://${GOOGLE_HOST}/` : `https://${TWITTER_HOST}/search.php`;
      const apiHost = source === 'linkedin' ? GOOGLE_HOST : TWITTER_HOST;

      const apiParams = source === 'linkedin'
        ? { query: `site:linkedin.com/posts ${searchTerms} ("hiring" OR "vacancy") after:${dateStr}`, limit: '30' }
        : { query: `${searchTerms} ("hiring" OR "jobs") -filter:retweets`, search_type: 'Latest' };

      const response = await axios.get(apiUrl, {
        params: apiParams,
        headers: { 'X-RapidAPI-Key': RAPID_API_KEY, 'X-RapidAPI-Host': apiHost }
      });

      // Data Cleaning Logic
      const rawData = source === 'linkedin' ? (response.data.results || []) : (response.data.timeline || []);

      const newJobs = rawData.map((item: any) => ({
        job_id: source === 'linkedin' ? Math.random().toString(36).substr(2, 9) : item.tweet_id,
        
        job_title: source === 'linkedin'
          ? (item.title || "Hiring Opportunity").substring(0, 100)
          : (item.text ? item.text.substring(0, 60) + "..." : "New Tweet Opportunity"),

        employer_name: source === 'linkedin' ? "LinkedIn" : "Twitter User",
        employer_logo: source === 'linkedin' ? "https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png" : "https://upload.wikimedia.org/wikipedia/commons/c/ce/X_logo_2023.svg",
        link: source === 'linkedin' ? (item.url || item.link) : `https://x.com/${item.screen_name}/status/${item.tweet_id}`,
        text: source === 'linkedin' ? (item.description || item.snippet || "No description") : item.text,
        source: source,
        category: category,
        job_city: "Remote/Hybrid"
      })).filter((j: any) => j.link);

      // Bulk Upsert (Save to DB)
      for (let job of newJobs) {
        await Job.updateOne({ link: job.link }, { $set: job }, { upsert: true });
      }

      // Fetch fresh data from DB
      jobs = await Job.find({ source: source, category: category }).sort({ date_added: -1 }).limit(40);
    }

    return NextResponse.json({ success: true, data: jobs });

  } catch (err: any) {
    console.error("Backend Error:", err);
    return NextResponse.json({ success: false, error: err.message || "Fetching Failed" }, { status: 500 });
  }
}

// 🗑️ DELETE Handler (To clear DB)
export async function DELETE() {
  try {
    await connectToDB();
    await Job.deleteMany({});
    return NextResponse.json({ message: "Database Cleared" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to clear DB" }, { status: 500 });
  }
}
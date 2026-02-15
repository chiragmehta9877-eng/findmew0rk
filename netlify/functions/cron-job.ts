import { schedule } from '@netlify/functions';
import mongoose from 'mongoose';
import axios from 'axios';

// ⚠️ Ensure paths are correct based on your project structure
import { connectToDB } from '../../lib/mongodb'; 
import Job from '../../models/Job';

// 🔑 KEYS
const RAPID_API_KEY = process.env.RAPID_API_KEY || '15ecf5c2e1msha76c0e9843b9e44p10032bjsn8fc2c9cbe2d8';
const TWITTER_HOST = 'twitter-api45.p.rapidapi.com';

// 🔥 FRONTEND MATCHING CATEGORIES (Name + Value + Search Query)
const CATEGORIES = [
  { 
    name: "IT & Software", 
    value: "software", 
    query: '("Software Engineer" OR "Web Developer" OR "Frontend" OR "Backend" OR "Full Stack" OR "DevOps")' 
  },
  { 
    name: "Finance & Accounting", 
    value: "finance", 
    query: '("Accountant" OR "Finance Manager" OR "Audit" OR "Tax" OR "Banking" OR "CFA")' 
  },
  { 
    name: "Business & Management", 
    value: "management", 
    query: '("Business Analyst" OR "Project Manager" OR "Product Manager" OR "Consultant" OR "MBA")' 
  },
  { 
    name: "Human Resources", 
    value: "hr", 
    query: '("HR Manager" OR "Recruiter" OR "Talent Acquisition" OR "Human Resources")' 
  },
  { 
    name: "Sales & Marketing", 
    value: "marketing", 
    query: '("Marketing Manager" OR "SEO" OR "Social Media" OR "Sales Executive" OR "Digital Marketing")' 
  },
  { 
    name: "ESG & Sustainability", 
    value: "esg", 
    query: '("ESG" OR "Sustainability" OR "Climate Change" OR "Carbon" OR "Environmental")' 
  },
  { 
    name: "E-Commerce", 
    value: "commerce", 
    query: '("E-commerce" OR "Shopify" OR "Amazon" OR "Supply Chain" OR "Logistics")' 
  },
  { 
    name: "Design & Architecture", 
    value: "design", 
    query: '("Graphic Designer" OR "UI/UX" OR "Architect" OR "Interior Design" OR "Creative Director")' 
  },
  { 
    name: "Research & Analytics", 
    value: "research", 
    query: '("Data Analyst" OR "Research Analyst" OR "Scientist" OR "Economist")' 
  },
  { 
    name: "All Jobs", 
    value: "all", 
    query: '("Hiring" OR "Vacancy" OR "Job Opening" OR "Urgent")' 
  },
  { 
    name: "Others", 
    value: "other", 
    query: '("Admin" OR "Customer Support" OR "Receptionist" OR "Assistant" OR "Legal")' 
  }
];

// --- HELPERS ---
const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;

// ✅ FIX 1: Added ': string' type to text
function inferWorkType(text: string) {
    const t = text.toLowerCase();
    if (t.includes('intern')) return 'Internship';
    if (t.includes('freelance') || t.includes('contract')) return 'Freelance';
    return 'Full-time';
}

// ✅ FIX 2: Added ': string' type to text
function inferLocation(text: string) {
    const t = text.toLowerCase();
    if (t.includes('remote') || t.includes('wfh')) return 'Remote';
    return 'Global';
}

// --- MAIN LOGIC ---
// ✅ FIX 3: Added ': any' type to event
const cronHandler = async (event: any) => {
    console.log("⏰ [Cloud Cron] Started 3-Day Job Fetch (Limit: 100)...");
    
    // 1. Connect DB
    if (mongoose.connection.readyState === 0) {
        await connectToDB();
    }

    let totalAdded = 0;

    // 2. Loop Categories
    for (const cat of CATEGORIES) {
        console.log(`📡 Fetching for: ${cat.name} (${cat.value})`);
        
        try {
            // Construct Query: Keywords + Hiring Intent + Email + No Retweets
            const finalQuery = `${cat.query} ("hiring" OR "email" OR "send cv") -filter:retweets`;
            
            // Call Twitter API
            const response = await axios.get(`https://${TWITTER_HOST}/search.php`, {
                params: { query: finalQuery, search_type: 'Latest' },
                headers: {
                    'X-RapidAPI-Key': RAPID_API_KEY,
                    'X-RapidAPI-Host': TWITTER_HOST
                }
            });

            // Handle different object structures from RapidAPI
            const tweets = response.data.timeline || response.data.tweets || response.data || [];
            
            // 🔥 Limit: 100 posts
            const latestTweets = tweets.slice(0, 100);

            for (const item of latestTweets) {
                // Fetching full text perfectly
                const text = item.text || item.full_text || "";
                const emailMatch = text.match(emailRegex);
                
                // Only save if Email is present (Quality Filter)
                if (emailMatch) {
                    
                    // Generate Unique ID based on Category too
                    const uniqueJobId = `tw-${item.tweet_id || item.id}__${cat.value}`;

                    // Smart Profile Logic (Name and Avatar)
                    const employerName = item.user_info?.name || item.screen_name || "X User";
                    const employerLogo = item.user_info?.avatar || "https://upload.wikimedia.org/wikipedia/commons/c/ce/X_logo_2023.svg";

                    // Upsert to DB
                    await Job.updateOne(
                        { job_id: uniqueJobId },
                        { 
                            $set: {
                                job_id: uniqueJobId,
                                job_title: `${cat.name.split('&')[0].trim()} Role`, 
                                employer_name: employerName,
                                employer_logo: employerLogo,
                                link: item.url,
                                text: text,
                                source: "twitter",
                                category: cat.value, 
                                job_city: inferLocation(text),
                                email: emailMatch[0],
                                work_mode: inferWorkType(text),
                                posted_at: new Date()
                            }
                        },
                        { upsert: true }
                    );
                    totalAdded++;
                }
            }
        // ✅ FIX 4 & 5: Added ': any' to error so TS doesn't complain about 'unknown' type
        } catch (error: any) {
            console.error(`❌ Error in ${cat.name}:`, error?.response?.data || error.message);
        }
        
        // Wait 2s to respect API rate limits between categories
        await new Promise(r => setTimeout(r, 2000));
    }

    console.log(`✅ [Cloud Cron] Finished. Added/Updated: ${totalAdded} jobs.`);
    
    return {
        statusCode: 200,
        body: JSON.stringify({ message: "Cron executed successfully", added: totalAdded }),
    };
};

// 🔥 SCHEDULE: Runs at 8:00 AM IST (2:30 AM UTC) every 3rd day
// Cron format: (Minute Hour DayOfMonth Month DayOfWeek)
export const handler = schedule("30 2 */3 * *", cronHandler);
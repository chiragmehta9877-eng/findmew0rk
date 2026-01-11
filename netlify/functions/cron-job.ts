import { schedule } from '@netlify/functions';
import mongoose from 'mongoose';
import axios from 'axios';

// ⚠️ Ensure these paths are correct based on your folder structure
// Since this file is in 'netlify/functions/', we go up two levels to reach 'lib' and 'models'
import { connectToDB } from '../../lib/mongodb'; 
import Job from '../../models/Job';

// 🔑 KEYS
const RAPID_API_KEY = process.env.RAPID_API_KEY || '15ecf5c2e1msha76c0e9843b9e44p10032bjsn8fc2c9cbe2d8';
const TWITTER_HOST = 'twitter-api45.p.rapidapi.com';

const CATEGORIES = [
  "Software Engineer",
  "Data Science & AI",
  "Internships",
  "Freelance",
  "All Jobs"
];

// --- HELPERS ---
const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;

function getQuery(category: string) {
  const c = category.toLowerCase();
  if (c === 'job' || c === 'all jobs') return '("Hiring" OR "Vacancy" OR "Job Opening") ("email" OR "mail at") -filter:retweets';
  if (c.includes('data')) return '("Data Scientist" OR "AI Engineer") ("hiring" OR "email") -filter:retweets';
  if (c.includes('intern')) return '("Internship" OR "Summer Intern") ("hiring" OR "email") -filter:retweets';
  if (c.includes('freelance')) return '("Freelance" OR "Contract") ("hiring" OR "email") -filter:retweets';
  return `"${category}" ("hiring" OR "email") -filter:retweets`;
}

function inferWorkType(text: string) {
    if (text.toLowerCase().includes('intern')) return 'Internship';
    if (text.toLowerCase().includes('freelance')) return 'Freelance';
    return 'Full-time';
}

function inferLocation(text: string) {
    if (text.toLowerCase().includes('remote')) return 'Remote';
    return 'Global';
}

// --- MAIN LOGIC ---
const cronHandler = async (event: any) => {
    console.log("⏰ [Cloud Cron] Started Hourly Job Fetch...");
    
    // 1. Connect DB
    if (mongoose.connection.readyState === 0) {
        await connectToDB();
    }

    let totalAdded = 0;

    // 2. Loop All Categories
    for (const category of CATEGORIES) {
        console.log(`📡 Fetching 10 jobs for: ${category}`);
        
        try {
            const query = getQuery(category);
            
            // Call Twitter API
            const response = await axios.get(`https://${TWITTER_HOST}/search.php`, {
                params: { query: query, search_type: 'Latest' },
                headers: {
                    'X-RapidAPI-Key': RAPID_API_KEY,
                    'X-RapidAPI-Host': TWITTER_HOST
                }
            });

            const tweets = response.data.timeline || [];
            
            // Limit to 10 processing
            const latestTweets = tweets.slice(0, 10);

            for (const item of latestTweets) {
                const text = item.text || "";
                const emailMatch = text.match(emailRegex);
                
                if (emailMatch) {
                    const safeCategory = category === "All Jobs" ? "job" : category;
                    const safeCatId = safeCategory.replace(/\s+/g, '_').toLowerCase();
                    const uniqueJobId = `${item.tweet_id}__${safeCatId}`;

                    // Upsert to DB
                    await Job.updateOne(
                        { job_id: uniqueJobId },
                        { 
                            $set: {
                                job_id: uniqueJobId,
                                job_title: `${category} Role (${inferWorkType(text)})`,
                                employer_name: item.screen_name ? `@${item.screen_name}` : "Recruiter",
                                employer_logo: "https://upload.wikimedia.org/wikipedia/commons/c/ce/X_logo_2023.svg",
                                link: item.url,
                                text: text,
                                source: "twitter",
                                category: safeCategory,
                                job_city: inferLocation(text),
                                email: emailMatch[0],
                                posted_at: new Date()
                            }
                        },
                        { upsert: true }
                    );
                    totalAdded++;
                }
            }
        } catch (error) {
            console.error(`❌ Error in ${category}:`, error);
        }
        
        // Wait 2s to respect API rate limits
        await new Promise(r => setTimeout(r, 2000));
    }

    console.log(`✅ [Cloud Cron] Finished. Added/Updated: ${totalAdded} jobs.`);
    
    return {
        statusCode: 200,
        body: JSON.stringify({ message: "Cron executed", added: totalAdded }),
    };
};

// 🔥🔥 FIX: Wrap the handler with 'schedule' before exporting
// "@hourly" means it runs once every hour.
export const handler = schedule("@hourly", cronHandler);
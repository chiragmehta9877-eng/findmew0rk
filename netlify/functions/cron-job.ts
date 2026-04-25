import { schedule } from '@netlify/functions';
import mongoose from 'mongoose';
import axios from 'axios';

// ⚠️ Ensure paths are correct based on your project structure
import { connectToDB } from '../../lib/mongodb'; 
import Job from '../../models/Job';

// 🔑 KEYS
const RAPID_API_KEY = process.env.RAPID_API_KEY || '15ecf5c2e1msha76c0e9843b9e44p10032bjsn8fc2c9cbe2d8';
const TWITTER_HOST = 'twitter-api45.p.rapidapi.com';

// 🛑 N8N WEBHOOK URL (Testing ke liye)
const N8N_WEBHOOK_URL = 'https://chiragmehta.app.n8n.cloud/webhook-test/6ec30106-4154-4fcf-b1c1-6d235fe6ad34'; 

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

function inferWorkType(text: string) {
    const t = text.toLowerCase();
    if (t.includes('intern')) return 'Internship';
    if (t.includes('freelance') || t.includes('contract')) return 'Freelance';
    return 'Full-time';
}

function inferLocation(text: string) {
    const t = text.toLowerCase();
    if (t.includes('remote') || t.includes('wfh')) return 'Remote';
    return 'Global';
}

// --- MAIN LOGIC ---
const cronHandler = async (event: any) => {
    console.log("⏰ [Cloud Cron] Started 3-Day Job Fetch (Limit: 100)...");
    
    // 1. Connect DB (Aage ki pipeline ke liye connect rakhna achha hai)
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

                    // 🔥 NAYA CODE: Payload banakar n8n ko bhejna
                    const jobPayload = {
                        job_id: uniqueJobId,
                        job_title: `${cat.name.split('&')[0].trim()} Role`, 
                        employer_name: employerName,
                        employer_logo: employerLogo,
                        link: item.url || `https://x.com/i/web/status/${item.tweet_id || item.id}`,
                        text: text, 
                        source: "twitter",
                        category: cat.value, 
                        job_city: inferLocation(text),
                        email: emailMatch[0],
                        work_mode: inferWorkType(text),
                        posted_at: new Date()
                    };

                    try {
                        // POST data to n8n Webhook
                        await axios.post(N8N_WEBHOOK_URL, jobPayload);
                        console.log(`📤 Sent to n8n verifier: ${jobPayload.job_title}`);
                        totalAdded++;
                    } catch (webhookError: any) {
                        console.error(`❌ Failed to send to n8n:`, webhookError.message);
                    }
                }
            }
        } catch (error: any) {
            console.error(`❌ Error in ${cat.name}:`, error?.response?.data || error.message);
        }
        
        // Wait 2s to respect API rate limits between categories
        await new Promise(r => setTimeout(r, 2000));
    }

    console.log(`✅ [Cloud Cron] Finished. Added/Updated: ${totalAdded} jobs to n8n.`);
    
    return {
        statusCode: 200,
        body: JSON.stringify({ message: "Cron executed successfully", jobsSentToN8N: totalAdded }),
    };
};

// 🔥 SCHEDULE: Runs at 8:00 AM IST (2:30 AM UTC) every 3rd day
export const handler = schedule("30 2 */3 * *", cronHandler);

// 🔥 TESTING KE LIYE (Terminal mein turant run karne ke liye)
// ⚠️ DHYAN RAHE: Jab live server par deploy karein, toh is line ko hata dein ya comment kar dein!
cronHandler(null);
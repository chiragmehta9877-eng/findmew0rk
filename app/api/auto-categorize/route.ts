import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import Job from "@/models/Job";

// 🔥 POWERFUL KEYWORD MAP (Priority Wise)
const CATEGORY_RULES: any = {
  software: ['developer', 'engineer', 'java', 'python', 'react', 'node', 'full stack', 'backend', 'frontend', 'cloud', 'devops', 'api', 'coding', 'programmer', 'tech lead', 'cto', 'software'],
  esg: ['esg', 'sustainability', 'climate', 'carbon', 'environment', 'green energy', 'csr', 'net zero', 'renewable', 'biodiversity', 'ghg'],
  finance: ['finance', 'accountant', 'audit', 'tax', 'banking', 'investment', 'wealth', 'portfolio', 'credit', 'cfo', 'financial', 'ledger', 'equity'],
  hr: ['hr', 'human resources', 'recruitment', 'talent', 'hiring', 'payroll', 'learning and development', 'l&d', 'compensation'],
  marketing: ['marketing', 'seo', 'social media', 'brand', 'content', 'growth', 'advertising', 'pr', 'copywriter', 'digital marketing'],
  design: ['design', 'ui/ux', 'graphic', 'architect', 'interior', 'visual', 'creative', 'art director', '3d', 'motion'],
  commerce: ['e-commerce', 'shopify', 'marketplace', 'amazon', 'logistics', 'supply chain', 'merchandising', 'procurement', 'inventory'],
  research: ['research', 'analyst', 'economist', 'scientist', 'policy', 'market research', 'quantitative', 'qualitative'],
  management: ['business analyst', 'project manager', 'product manager', 'consultant', 'strategy', 'operations', 'program manager', 'executive', 'director'],
};

export async function GET(req: Request) {
  try {
    await connectToDB();
    const jobs = await Job.find({}); // Fetch all jobs
    
    let updatedCount = 0;

    for (const job of jobs) {
      const text = (job.job_title + " " + job.text).toLowerCase();
      let bestCategory = 'other';
      let maxMatches = 0;

      // Check which category has the most keyword matches
      for (const [cat, keywords] of Object.entries(CATEGORY_RULES)) {
        // @ts-ignore
        const matches = keywords.filter(k => text.includes(k)).length;
        if (matches > maxMatches) {
          maxMatches = matches;
          bestCategory = cat;
        }
      }

      // Priority Override: Agar title me hi 'ESG' hai to ESG hi hoga
      if (job.job_title.toLowerCase().includes('esg')) bestCategory = 'esg';
      if (job.job_title.toLowerCase().includes('software')) bestCategory = 'software';

      // Update in DB
      if (bestCategory !== job.category) {
        await Job.findByIdAndUpdate(job._id, { category: bestCategory });
        updatedCount++;
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: `✅ Classification Complete! Moved ${updatedCount} jobs to correct categories.` 
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
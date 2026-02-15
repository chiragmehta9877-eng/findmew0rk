import { MetadataRoute } from 'next';
import { connectToDB } from '@/lib/mongodb';
import Job from '@/models/Job';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://findmew0rk.com';

  // 1. Static Pages
  const staticPages = [
    { url: `${baseUrl}`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 1.0 },
    { url: `${baseUrl}/x-jobs`, lastModified: new Date(), changeFrequency: 'hourly' as const, priority: 0.9 },
    { url: `${baseUrl}/support`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.5 },
  ];

  try {
    await connectToDB();
    // 2. Dynamic Job Pages (Latest 500 jobs ko sitemap me daalo)
    const jobs = await Job.find({}).sort({ posted_at: -1 }).limit(500).select('job_id posted_at').lean() as any[];

    const jobPages = jobs.map((job) => ({
      url: `${baseUrl}/x-jobs/${job.job_id}`,
      lastModified: job.posted_at || new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    }));

    return [...staticPages, ...jobPages];
  } catch (error) {
    console.error("Sitemap Generation Error:", error);
    return staticPages;
  }
}
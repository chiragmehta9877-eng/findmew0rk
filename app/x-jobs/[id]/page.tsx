import { Metadata } from 'next';
import JobDetailsClient from './JobDetailsClient';
import { connectToDB } from '@/lib/mongodb';
import Job from '@/models/Job'; 

type Props = {
  params: Promise<{ id: string }> | any; 
}

// 1. 🚀 DYNAMIC SEO METADATA
export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params; 
  const id = params.id;
  
  try {
    await connectToDB();
    const job = await Job.findOne({ $or: [{ job_id: id }, { _id: id }] }).lean() as any;

    if (!job) {
      return { title: 'Job Not Found | FindMeWork', description: 'The job does not exist.' }
    }

    const rawUsername = job.username || job.handle || job.screen_name || job.employer_name || 'Hiring Manager';
    const company = String(rawUsername).startsWith('@') ? String(rawUsername) : `@${rawUsername}`;
    const cleanDesc = job.text ? job.text.substring(0, 150).replace(/\n/g, ' ') + '...' : `Apply for the ${job.job_title} role at ${company}.`;

    // 🔥 FIX: Ab hum Twitter ke logo ka risk nahi lenge. 
    // Hamesha apna 100% working banner use karenge!
    const defaultBanner = 'https://findmew0rk.com/og-image.png';

    return {
      title: `${job.job_title} at ${company} | FindMeWork`,
      description: cleanDesc,
      keywords: [job.category, job.job_city, 'Hiring', 'Jobs', 'FindMeWork', company.replace('@', '')],
      openGraph: {
        title: `Hiring: ${job.job_title} at ${company}`,
        description: cleanDesc,
        type: 'website',
        url: `https://findmew0rk.com/x-jobs/${id}`,
        images: [
          {
            url: defaultBanner, // 🔥 Hamesha apka designer banner aayega!
            width: 1200,
            height: 630,
            alt: `FindMeWork Job Search`,
          }
        ], 
      },
      twitter: {
        card: 'summary_large_image',
        title: `${job.job_title} at ${company}`,
        description: cleanDesc,
        images: [defaultBanner], // 🔥 Yahan bhi apka banner
      }
    }
  } catch (error) {
    return { title: 'Job Details | FindMeWork', description: 'View job details on FindMeWork.' }
  }
}

// 2. 🚀 SERVER COMPONENT (Generates Google Jobs Widget Schema)
export default async function JobDetailsPage(props: Props) {
  const params = await props.params;
  const id = params.id;

  try {
    await connectToDB();
    const job = await Job.findOne({ $or: [{ job_id: id }, { _id: id }] }).lean() as any;

    if (job) {
      const rawUsername = job.username || job.handle || job.screen_name || job.employer_name || 'Hiring Manager';
      const company = String(rawUsername).replace('@', '');
      
      // 🔥 GOOGLE JOBS BRAHMASTRA (JSON-LD SCHEMA)
      const jsonLd = {
        '@context': 'https://schema.org/',
        '@type': 'JobPosting',
        'title': job.job_title || 'Job Opportunity',
        'description': job.text || 'Job opportunity available now.',
        'datePosted': job.posted_at ? new Date(job.posted_at).toISOString() : new Date().toISOString(),
        'validThrough': new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString(), // 1 month validity
        'employmentType': job.category?.toLowerCase().includes('intern') ? 'INTERN' : job.category?.toLowerCase().includes('freelance') ? 'CONTRACTOR' : 'FULL_TIME',
        'hiringOrganization': {
          '@type': 'Organization',
          'name': company,
          'logo': job.employer_logo || 'https://findmew0rk.com/og-image.png'
        },
        'jobLocation': {
          '@type': 'Place',
          'address': {
            '@type': 'PostalAddress',
            'addressLocality': job.job_city && job.job_city !== 'Remote' ? job.job_city : 'Anywhere',
            'addressCountry': 'US' // Defaulting to US for broad reach, Google handles 'Remote' smartly
          }
        },
        'applicantLocationRequirements': {
          '@type': 'Country',
          'name': 'Worldwide' // Tells Google it's remote-friendly
        }
      };

      return (
        <>
          {/* Inject Schema into the Head of the document */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
          <JobDetailsClient />
        </>
      );
    }
  } catch (e) {
    console.error("Schema Error", e);
  }

  // Fallback if no job found
  return <JobDetailsClient />;
}
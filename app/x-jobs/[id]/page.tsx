import { Metadata } from 'next';
import JobDetailsClient from './JobDetailsClient';
import { connectToDB } from '@/lib/mongodb';
import Job from '@/models/Job'; 
import { isValidObjectId } from 'mongoose';

type Props = {
  params: Promise<{ id: string }>; 
}

const getCleanCountry = (text: string, dbLocation: string) => {
  const txt = (text + " " + dbLocation).toLowerCase();
  if (txt.match(/\b(usa|united states|us|ny|nyc|sf|california|texas)\b/i)) return "USA";
  if (txt.match(/\b(uk|united kingdom|london|manchester|england)\b/i)) return "UK";
  if (txt.match(/\b(india|ind|bangalore|delhi|mumbai|pune)\b/i)) return "India";
  return dbLocation || "Remote";
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params; 
  const id = params.id;
  try {
    await connectToDB();
    const query = isValidObjectId(id) ? { $or: [{ job_id: id }, { _id: id }] } : { job_id: id };
    const job = await Job.findOne(query).lean() as any;
    if (!job) return { title: 'Job Not Found | FindMeWork' };
    const cleanCountry = getCleanCountry(job.text || "", job.job_city || "");
    return { title: `${job.job_title} at ${job.employer_name} (${cleanCountry})` };
  } catch (error) { return { title: 'Job Details' }; }
}

export default async function JobDetailsPage(props: Props) {
  const params = await props.params;
  const id = params.id;

  try {
    await connectToDB();
    const query = isValidObjectId(id) ? { $or: [{ job_id: id }, { _id: id }] } : { job_id: id };
    const jobDoc = await Job.findOne(query).lean();
    
    // 🔥 Pura job object pass kar rahe hain (including badgeType, trustScore, verifiedBy)
    const job = jobDoc ? JSON.parse(JSON.stringify(jobDoc)) : null;

    if (job) {
      return (
        <JobDetailsClient initialData={job} jobId={id} />
      );
    }
  } catch (e) { console.error(e); }
  return <JobDetailsClient jobId={id} />;
}
import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  job_id: { type: String, unique: true },
  job_title: String,
  employer_name: String,
  employer_logo: String,
  job_city: String,
  link: { type: String, unique: true },
  text: String,
  source: String,
  category: String,
  date_added: { type: Date, default: Date.now }
});

// Next.js mein model overwrite error se bachne ke liye ye syntax zaroori hai
const Job = mongoose.models.Job || mongoose.model("Job", jobSchema);

export default Job;
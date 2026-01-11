import mongoose, { Schema, Model } from "react";

const TwitterJobSchema = new Schema({
  job_title: { type: String, required: true },
  employer_name: { type: String },
  text: { type: String, required: true }, // Full Tweet text
  email: { type: String, required: true }, // Mandatory field
  category: { type: String, enum: ['internship', 'job', 'freelance'], required: true },
  work_mode: { type: String, enum: ['remote', 'hybrid', 'onsite'], default: 'remote' },
  country: { type: String, default: 'Global' },
  source: { type: String, default: 'twitter' },
  isVerified: { type: Boolean, default: true }
}, { timestamps: true });

const TwitterJob: Model<any> = mongoose.models.TwitterJob || mongoose.model("TwitterJob", TwitterJobSchema);
export default TwitterJob;
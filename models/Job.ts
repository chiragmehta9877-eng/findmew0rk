import mongoose, { Schema, models, model } from "mongoose";

const JobSchema = new Schema(
  {
    // 🔥 CRITICAL FIX: Explicitly defining _id as String to match external IDs
    _id: { type: String, required: true },
    
    // Explicitly define job_id to ensure queries like findOne({ job_id: ... }) work fast with an index
    job_id: { type: String }, 

    job_title: { type: String, required: true },
    employer_name: { type: String },
    employer_logo: { type: String },
    job_city: { type: String },
    job_country: { type: String },
    apply_link: { type: String },
    description: { type: String },
    source: { type: String },
    posted_at: { type: Date },

    // 🔥 SPOTLIGHT FEATURE
    isSpotlight: { type: Boolean, default: false }, 

    // 🔥 NEW ANALYTICS FIELDS (Required for View/Click tracking)
    views: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    _id: false, // 👈 Tells Mongoose not to auto-generate an ObjectId
    strict: false // 👈 Allows saving extra fields (flexible schema)
  }
);

// Prevent model overwrite error during Next.js hot reload
const Job = models.Job || model("Job", JobSchema);

export default Job;
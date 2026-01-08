import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import Job from "@/models/Job";

export async function GET(
  request: Request,
  // 👇 Fix: Type ko thoda flexible banaya hai aur 'props' use kiya hai
  props: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDB();

    // ⚠️ CRITICAL FIX: Params ko await karna zaroori hai Next.js 15+ mein
    const params = await props.params;
    const jobId = params.id;

    console.log("🔍 Looking for Job ID:", jobId);

    if (!jobId) {
      return NextResponse.json(
        { success: false, error: "Job ID missing" }, 
        { status: 400 }
      );
    }

    // 1. Pehle 'job_id' (Twitter/LinkedIn ID string) se dhundo
    let job = await Job.findOne({ job_id: jobId });

    // 2. Agar nahi mila, toh '_id' (MongoDB ObjectId) se try karo
    if (!job) {
      // Sirf tab try karo agar ID 24 characters ki ho (Mongo ID format)
      if (jobId.length === 24) {
        try {
           job = await Job.findById(jobId);
        } catch (e) {
           console.log("Not a valid Mongo ID, skipping...");
        }
      }
    }

    if (!job) {
      console.log("❌ Job Not Found in DB for ID:", jobId);
      return NextResponse.json(
        { success: false, error: "Job not found" }, 
        { status: 404 }
      );
    }

    // console.log("✅ Job Found:", job.job_title);
    return NextResponse.json({ success: true, data: job }, { status: 200 });

  } catch (error: any) {
    console.error("🔥 Server Error:", error);
    return NextResponse.json(
      { success: false, error: "Server Error" }, 
      { status: 500 }
    );
  }
}
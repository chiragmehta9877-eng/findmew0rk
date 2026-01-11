import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { connectToDB } from "@/lib/mongodb";
import User from "@/models/User";
import { authOptions } from "@/lib/auth"; 

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await connectToDB();
    
    // Type casting 'any' here avoids TS conflict with old ObjectId definition
    const user: any = await User.findOne({ email: session.user.email });

    // Debug Log
    console.log(`GET Bookmarks for ${session.user.email}:`, user?.bookmarks?.length || 0);

    return NextResponse.json({ success: true, data: user?.bookmarks?.reverse() || [] });

  } catch (error: any) {
    console.error("GET Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// 🔥 DEBUG POST HANDLER
export async function POST(req: Request) {
  console.log("🔥 POST Request Received");

  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      console.log("❌ Unauthorized Request");
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { jobId, jobData } = await req.json();
    console.log("📦 Payload:", { jobId, hasJobData: !!jobData });

    if (!jobId) {
        console.log("❌ Job ID Missing");
        return NextResponse.json({ success: false, message: "ID required" }, { status: 400 });
    }

    await connectToDB();
    console.log("✅ DB Connected");

    // 🔥 Fix Type Error: Cast user to 'any' to allow pushing Objects instead of ObjectIds
    const user: any = await User.findOne({ email: session.user.email });
    
    if (!user) {
        console.log("❌ User Not Found in DB");
        return NextResponse.json({ success: false }, { status: 404 });
    }

    console.log("👤 User Found:", user.email);

    // Initialize if missing
    if (!Array.isArray(user.bookmarks)) {
        console.log("⚠️ Bookmarks was not an array, resetting...");
        user.bookmarks = [];
    }

    // 🔥 LOGIC UPDATE: Use 'job_id' to match instead of '_id'
    const existingIndex = user.bookmarks.findIndex((b: any) => {
        // Support both old structure (string ID) and new structure (object with job_id)
        const savedId = b.job_id || b.toString(); 
        return savedId === jobId.toString();
    });

    let isSaved = false;

    if (existingIndex > -1) {
      console.log("🗑️ Removing Job:", jobId);
      user.bookmarks.splice(existingIndex, 1);
      isSaved = false;
    } else {
      console.log("➕ Adding Job:", jobId);
      
      // 🔥 NEW STRUCTURE: Matches your updated User Model
      const newBookmark = {
        job_id: jobId.toString(), // Store External ID here
        job_title: jobData?.job_title || "Unknown Title",
        employer_name: jobData?.employer_name || "Unknown Company",
        employer_logo: jobData?.employer_logo || "",
        job_city: jobData?.job_city || "Remote",
        source: jobData?.source || "linkedin",
        apply_link: jobData?.apply_link || "",
        createdAt: new Date()
      };

      user.bookmarks.push(newBookmark);
      isSaved = true;
    }

    // 🔥 CRITICAL: Force Mongoose to recognize change
    user.markModified('bookmarks');
    
    // Attempt Save
    const savedUser = await user.save();
    console.log("💾 Save Result - Bookmarks Count:", savedUser.bookmarks.length);

    return NextResponse.json({ 
      success: true, 
      isSaved: isSaved, 
      message: isSaved ? "Added to bookmarks" : "Removed from bookmarks" 
    });

  } catch (error: any) {
    console.error("❌ POST Save Error:", error);
    return NextResponse.json({ success: false, message: "Server Error: " + error.message }, { status: 500 });
  }
}
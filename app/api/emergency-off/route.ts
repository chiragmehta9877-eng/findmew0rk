import { NextResponse } from 'next/server';
import { connectToDB } from "@/lib/mongodb";
import Setting from "@/models/Setting";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    await connectToDB();

    // Force update Localhost to TRUE (Maintenance ON)
    const updated = await Setting.findOneAndUpdate({}, {
      $set: { "status.localhost": true }
    }, { new: true, upsert: true });

    console.log("🔥 FORCED MAINTENANCE ON:", updated.status);

    return NextResponse.json({ 
      success: true, 
      message: "Maintenance Mode is now FORCED ON (True)",
      status: updated.status 
    });

  } catch (error) {
    return NextResponse.json({ error: error.message });
  }
}
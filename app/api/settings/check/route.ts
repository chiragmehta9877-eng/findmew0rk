import { NextResponse } from 'next/server';
import { connectToDB } from "@/lib/mongodb";
import Setting from "@/models/Setting";

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

export async function GET(req: Request) {
  try {
    await connectToDB();
    const settings = await Setting.findOne().lean();

    // 🕵️‍♂️ Domain Detect karo (Request Headers se)
    const host = req.headers.get('host') || "";
    
    let isMaintenance = false;

    // Same Logic yahan bhi lagao
    if (host.includes("localhost")) {
        // @ts-ignore
        isMaintenance = settings?.status?.localhost;
    } 
    else if (host.includes("netlify.app")) {
        // @ts-ignore
        isMaintenance = settings?.status?.netlify;
    } 
    else {
        // Production
        // @ts-ignore
        isMaintenance = settings?.status?.production;
    }

    return NextResponse.json(
      { isMaintenance: isMaintenance || false }, 
      { 
        status: 200, 
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
          'Pragma': 'no-cache'
        }
      }
    );

  } catch (error) {
    return NextResponse.json({ isMaintenance: false }, { status: 200 });
  }
}
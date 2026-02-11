import { NextResponse } from 'next/server';
import { connectToDB } from "@/lib/mongodb";
import Setting from "@/models/Setting"; // Ensure ye sahi path ho

// 🔥 Caching Disable (Admin Panel hamesha fresh data dikhaye)
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// 1. GET Request: Admin Panel ko current settings bhejne ke liye
export async function GET() {
  try {
    await connectToDB();
    
    // DB se settings nikalo
    let settings = await Setting.findOne();

    // Agar settings exist nahi karti, toh default bana do
    if (!settings) {
        settings = await Setting.create({
            status: { production: false, netlify: false, localhost: false },
            maintenanceMessage: "We are currently upgrading."
        });
    }

    // ✅ FIXED: Sidha object return kar rahe hain (Mixed logic hata diya)
    return NextResponse.json({ 
        success: true, 
        status: settings.status, 
        maintenanceMessage: settings.maintenanceMessage 
    });

  } catch (error) {
    console.error("GET Settings Error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch" }, { status: 500 });
  }
}

// 2. POST Request: Settings Save karne ke liye
export async function POST(req: Request) {
    try {
        await connectToDB();
        const body = await req.json();

        console.log("📝 Update Request:", body);

        // CASE A: Environment Toggle (Example: localhost ON/OFF)
        if (body.environment) {
            const updateField = `status.${body.environment}`; // e.g., 'status.localhost'
            
            // MongoDB update query (Ab hum status field ko target kar rahe hain)
            const updated = await Setting.findOneAndUpdate({}, {
                $set: { [updateField]: body.isEnabled }
            }, { new: true, upsert: true });

            console.log(`✅ DB Updated: ${body.environment} = ${body.isEnabled}`);
            return NextResponse.json({ success: true, status: updated.status });
        }

        // CASE B: Message Update
        if (body.type === 'message') {
            await Setting.findOneAndUpdate({}, {
                $set: { maintenanceMessage: body.maintenanceMessage }
            }, { upsert: true });
            
            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ success: false, error: "Invalid Request" }, { status: 400 });

    } catch (error) {
        console.error("POST Settings Error:", error);
        
        // ✅ FIXED: Safely extract error message for TypeScript
        const errorMessage = error instanceof Error ? error.message : "Unknown Error";
        
        return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
    }
}
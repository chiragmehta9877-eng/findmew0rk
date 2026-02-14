import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    // 🔥 UPDATE: Frontend se 'cookieConsent' ka status bhi receive karo
    const { userId, cookieConsent } = await req.json();
    
    if (!userId) {
        return NextResponse.json({ success: false, message: "No User ID" });
    }

    await connectToDB();

    // ==============================================================
    // 🛑 PRIVACY CHECK: Agar user ne Reject All kiya hai
    // ==============================================================
    if (cookieConsent === false || cookieConsent === "false") {
        console.log("🛑 Privacy Active: User rejected cookies. Skipping IP & Location fetch.");
        
        // Sirf lastLogin update karo, IP aur Location track mat karo
        await User.findByIdAndUpdate(userId, {
            $set: { lastLogin: new Date() }
        });

        return NextResponse.json({ 
            success: true, 
            message: "Tracking skipped due to privacy choices.",
            location: null,
            ip: null
        });
    }

    // ==============================================================
    // ✅ TRACKING LOGIC: Agar user ne Accept kiya hai (Tabhi chalega)
    // ==============================================================

    // 1. Asli IP Address Nikalo
    let ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    
    if (ip.includes(",")) {
        ip = ip.split(",")[0].trim();
    }

    if (process.env.NODE_ENV === "development") {
        if (ip === "::1" || ip === "127.0.0.1" || ip.includes("::ffff:")) {
            console.log("🛠️ Dev Mode: Using Mock Indian IP");
            ip = "110.224.1.1"; 
        }
    }

    // 2. IP se Location Pata karo
    let location = "Unknown";
    try {
        const geoRes = await fetch(`http://ip-api.com/json/${ip}`);
        const geoData = await geoRes.json();
        if (geoData.status === "success") {
            location = `${geoData.city}, ${geoData.country}`;
        }
    } catch (e) {
        console.error("GeoIP Error:", e);
    }

    // 3. User Update (IP + Location + Date)
    await User.findByIdAndUpdate(userId, {
        $set: {
            ip: ip,
            detectedLocation: location, 
            lastLogin: new Date()
        }
    });

    return NextResponse.json({ success: true, location, ip });

  } catch (error) {
    console.error("Tracking Error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
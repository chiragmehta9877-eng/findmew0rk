import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    const { userId } = await req.json();
    
    if (!userId) {
        return NextResponse.json({ success: false, message: "No User ID" });
    }

    await connectToDB();

    // 1. Asli IP Address Nikalo
    let ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    
    // Agar comma separated IPs hain (kabhi kabhi proxy se aati hain), to pehli wali uthao
    if (ip.includes(",")) {
        ip = ip.split(",")[0].trim();
    }

    // 🔥 SMART LOGIC:
    // Sirf agar hum DEVELOPMENT mode me hain (Localhost), tabhi Fake IP use karo.
    // Production me ye code skip ho jayega aur Real IP use hogi.
    if (process.env.NODE_ENV === "development") {
        if (ip === "::1" || ip === "127.0.0.1" || ip.includes("::ffff:")) {
            console.log("🛠️ Dev Mode: Using Mock Indian IP");
            ip = "110.224.1.1"; // Airtel Delhi IP (Sirf testing ke liye)
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

    // 3. User Update
    // 🔥 UPDATE: Ab hum 'detectedLocation' field me save karenge
    // Taaki user ka manually enter kiya hua 'location' overwrite na ho
    await User.findByIdAndUpdate(userId, {
        $set: {
            ip: ip,
            detectedLocation: location, // 🔥 CHANGED FROM 'location' TO 'detectedLocation'
            lastLogin: new Date()
        }
    });

    return NextResponse.json({ success: true, location, ip });

  } catch (error) {
    console.error("Tracking Error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
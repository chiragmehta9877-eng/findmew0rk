import { connectToDB } from "@/lib/mongodb";
import Setting from "@/models/Setting";
import { headers } from 'next/headers'; // 👈 Headers import karo domain check karne ke liye

export async function getMaintenanceStatus() {
  try {
    await connectToDB();
    const settings = await Setting.findOne().lean();
    
    if (!settings) return false;

    // 🕵️‍♂️ Domain Detect karo
    const headersList = headers();
    const domain = headersList.get('host') || "";

    // Logic: Domain ke hisab se sahi key uthao
    let isMaintenance = false;

    if (domain.includes("localhost")) {
        // @ts-ignore
        isMaintenance = settings.status.localhost;
    } 
    else if (domain.includes("netlify.app")) { // Netlify domain pattern
        // @ts-ignore
        isMaintenance = settings.status.netlify;
    } 
    else {
        // Baki sab (Assuming Production) e.g., findmework.com
        // @ts-ignore
        isMaintenance = settings.status.production;
    }

    return isMaintenance || false;

  } catch (error) {
    return false;
  }
}
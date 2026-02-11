import { connectToDB } from "@/lib/mongodb";
import Setting from "@/models/Setting";
import { headers } from 'next/headers'; 

export async function getMaintenanceStatus() {
  try {
    await connectToDB();
    const settings = await Setting.findOne().lean();
    
    if (!settings) return false;

    // 👇 FIXED: Added 'await' here because headers() is a Promise now
    const headersList = await headers();
    const domain = headersList.get('host') || "";

    let isMaintenance = false;

    if (domain.includes("localhost")) {
        // @ts-ignore
        isMaintenance = settings.status.localhost;
    } 
    else if (domain.includes("netlify.app")) { 
        // @ts-ignore
        isMaintenance = settings.status.netlify;
    } 
    else {
        // @ts-ignore
        isMaintenance = settings.status.production;
    }

    return isMaintenance || false;

  } catch (error) {
    return false;
  }
}
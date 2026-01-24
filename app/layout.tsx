import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/SessionProvider";
import { connectToDB } from "@/lib/mongodb";
import Setting from "@/models/Setting";
import FeedbackPopup from "@/components/FeedbackPopup";
import SupportPopup from "@/components/SupportPopup"; 
import NewsletterPopup from "@/components/NewsletterPopup"; // ✅ Imported New Popup
import MaintenanceListener from "@/components/MaintenanceListener";
import CookieConsent from "@/components/CookieConsent";
import Footer from "@/components/Footer";
import UserTracker from "@/components/UserTracker";
import BlockedPopup from "@/components/BlockedPopup";
import Chatbot from "@/components/Chatbot";

const inter = Inter({ subsets: ["latin"] });

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "FindMeWork",
  description: "Find jobs hidden in the noise.",
  // 🔥 NOTE: 'icons' section hata diya hai.
  // Jab file 'app/favicon.ico' mein hoti hai, Next.js AUTOMATICALLY use detect kar leta hai.
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  // 1. Check DB Status
  let isMaintenanceMode = false;
  try {
    await connectToDB();
    const setting = await Setting.findOne({ name: "maintenance_mode" });
    if (setting?.isEnabled) isMaintenanceMode = true;
  } catch (error) {
    console.error("DB Error:", error);
  }

  // 🛑 SCENARIO A: MAINTENANCE MODE (Site Down)
  if (isMaintenanceMode) {
    return (
      <html lang="en">
        <body className={inter.className}>
          <MaintenanceListener currentStatus={true} />
          <div className="flex flex-col items-center justify-center h-screen bg-[#0A192F] text-white text-center p-6">
            <div className="text-7xl mb-6 animate-bounce">🚧</div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-yellow-400 tracking-tight">
              Under Maintenance
            </h1>
            <p className="text-lg text-slate-300 max-w-lg mx-auto leading-relaxed">
              We are currently upgrading <strong>FindMeWork</strong>.
              <br /> Please wait, the page will reload automatically when we are back!
            </p>
          </div>
        </body>
      </html>
    );
  }

  // ✅ SCENARIO B: NORMAL SITE (Site Live)
  return (
    <html lang="en">
      <body className={inter.className}>
        <MaintenanceListener currentStatus={false} />
        <AuthProvider>
          <UserTracker />
          <BlockedPopup />
          <div className="flex flex-col min-h-screen">
             <div className="flex-grow">
                {children}
             </div>
             <Footer />
          </div>
          <Chatbot />
        </AuthProvider>
        
        {/* 🔥 Global Popups */}
        <FeedbackPopup />
        <NewsletterPopup /> {/* ✅ Added Newsletter Here */}
        <SupportPopup />
        <CookieConsent />
        
      </body>
    </html>
  );
}
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/SessionProvider";
import UserTracker from "@/components/UserTracker";
import BlockedPopup from "@/components/BlockedPopup";
import FooterWrapper from "@/components/FooterWrapper";
import GlobalUiWrapper from "@/components/GlobalUiWrapper";
import MaintenanceWrapper from "@/components/MaintenanceWrapper"; // 👈 YE IMPORT KARO
import { getMaintenanceStatus } from "@/lib/getMaintenanceStatus"; // 👈 DB CHECK

const inter = Inter({ subsets: ["latin"] });

// 🔥 Force Dynamic zaroori hai taaki har request pe DB check ho
export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "FindMeWork",
  description: "Find jobs hidden in the noise.",
};

// ✅ ASYNC FUNCTION (Server Side Logic)
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  // 1. Server Side Check (Zero Lag)
  const isMaintenance = await getMaintenanceStatus();

  return (
    <html lang="en">
      <body className={inter.className}>
        
        {/* 🔥 MAINTENANCE WRAPPER (The Guard)
            Ye pure app ko lapet lega.
            - Agar Maintenance ON hai -> Sirf Maintenance Page dikhayega.
            - Agar Admin hai -> Children dikhayega.
            - Agar OFF hai -> Normal site dikhayega.
        */}
        <MaintenanceWrapper initialStatus={isMaintenance}>
            
            <AuthProvider>
              <UserTracker />
              <BlockedPopup />
              
              <div className="flex flex-col min-h-screen">
                  {/* Main Content */}
                  <div className="flex-grow">
                    {children}
                  </div>
                  
                  {/* Footer ab Wrapper ke andar hai, to Maintenance me nahi dikhega */}
                  <FooterWrapper />
              </div>
              
              {/* Global UI (Chatbot etc) bhi hide ho jayega */}
              <GlobalUiWrapper />

            </AuthProvider>

        </MaintenanceWrapper>
        
      </body>
    </html>
  );
}
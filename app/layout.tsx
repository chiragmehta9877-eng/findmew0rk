import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/SessionProvider";
import UserTracker from "@/components/UserTracker";
import BlockedPopup from "@/components/BlockedPopup";
import FooterWrapper from "@/components/FooterWrapper";
import GlobalUiWrapper from "@/components/GlobalUiWrapper";
import MaintenanceWrapper from "@/components/MaintenanceWrapper";
import { getMaintenanceStatus } from "@/lib/getMaintenanceStatus";

const inter = Inter({ subsets: ["latin"] });

// 🔥 Force Dynamic zaroori hai taaki har request pe DB check ho
export const dynamic = "force-dynamic";
export const revalidate = 0;

// ==========================================
// 🚀 KILLER SEO METADATA (For Rank #1)
// ==========================================
export const metadata: Metadata = {
  // 🔥 BASE URL: Ye us warning ko hamesha ke liye khatam kar dega
  metadataBase: new URL('https://findmew0rk.com'), 
  
  // 🔥 TITLE & DESCRIPTION
  title: {
    default: 'FindMeWork | Find Hidden Jobs Directly from Hiring Managers',
    template: '%s | FindMeWork' // Ye sub-pages (jaise job details) ke liye kaam aayega
  },
  description: 'Stop applying to ghost jobs. FindMeWork (findmew0rk) scans Twitter (X) to find real, hidden job opportunities posted directly by founders and recruiters. Apply with zero middlemen.',
  
  // 🔥 KEYWORDS
  keywords: [
    'FindMeWork', 
    'findmew0rk', 
    'find me work', 
    'twitter jobs', 
    'direct hiring', 
    'remote jobs', 
    'hidden tech jobs',
    'startup jobs'
  ],

  // 🔥 1. SITE-WIDE LOGO (Browser tab aur Google search me dikhne ke liye)
  icons: {
    icon: '/icon.png', 
    shortcut: '/favicon.ico',
    apple: '/icon.png',
  },

  // 🔥 2. SITE-WIDE BANNER (WhatsApp, LinkedIn, Facebook sharing)
  openGraph: {
    title: 'FindMeWork | Direct Jobs from Hiring Managers',
    description: 'Find jobs hidden in the noise. Connect directly with founders and recruiters.',
    url: 'https://findmew0rk.com',
    siteName: 'FindMeWork',
    images: [
      {
        url: 'https://findmew0rk.com/og-image.png', // 🔥 ABSOLUTE URL: WhatsApp ko yahi chahiye!
        width: 1200,
        height: 630,
        alt: 'FindMeWork Platform Preview',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },

  // 🔥 TWITTER CARDS
  twitter: {
    card: 'summary_large_image',
    title: 'FindMeWork - Find Hidden Jobs',
    description: 'Get hired directly by founders. No portals, no middlemen.',
    images: ['https://findmew0rk.com/og-image.png'], // 🔥 ABSOLUTE URL HERE TOO
  },

  // 🔥 GOOGLE ROBOTS
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // 🔥 CANONICAL URL
  alternates: {
    canonical: 'https://findmew0rk.com',
  },
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
        
        {/* 🔥 MAINTENANCE WRAPPER */}
        <MaintenanceWrapper initialStatus={isMaintenance}>
            
            <AuthProvider>
              <UserTracker />
              <BlockedPopup />
              
              <div className="flex flex-col min-h-screen">
                  {/* Main Content */}
                  <div className="flex-grow">
                    {children}
                  </div>
                  
                  {/* Footer ab Wrapper ke andar hai */}
                  <FooterWrapper />
              </div>
              
              {/* Global UI (Chatbot etc) */}
              <GlobalUiWrapper />

            </AuthProvider>

        </MaintenanceWrapper>
        
      </body>
    </html>
  );
}
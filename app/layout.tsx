import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/SessionProvider"; // Import add kiya

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FindMeWork",
  description: "Find jobs hidden in the noise.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* AuthProvider se wrap kiya */}
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
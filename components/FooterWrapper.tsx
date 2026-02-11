'use client';

import { usePathname } from "next/navigation";
import Footer from "@/components/Footer";

export default function FooterWrapper() {
  const pathname = usePathname();

  // 🔥 MAINTENANCE CHECK: If we are on /maintenance, return NULL (No Footer)
  if (pathname === "/maintenance") {
    return null;
  }

  // Otherwise, render the Footer normally
  return <Footer />;
}
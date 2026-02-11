'use client';

import { usePathname } from "next/navigation";
import CookieConsent from "@/components/CookieConsent";
import FeedbackPopup from "@/components/FeedbackPopup";
import SupportPopup from "@/components/SupportPopup"; 
import NewsletterPopup from "@/components/NewsletterPopup"; 
import Chatbot from "@/components/Chatbot"; // Chatbot bhi yahin daal diya

export default function GlobalUiWrapper() {
  const pathname = usePathname();

  // 🔥 AGAR Maintenance Page hai, toh KUCH MAT DIKHAO (Return Null)
  if (pathname === "/maintenance") {
    return null;
  }

  // ✅ Baki sab pages par ye sab dikhao
  return (
    <>
      <CookieConsent />
      <FeedbackPopup />
      <NewsletterPopup />
      <SupportPopup />
      <Chatbot />
    </>
  );
}
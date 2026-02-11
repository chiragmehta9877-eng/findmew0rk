'use client';

import { usePathname } from "next/navigation";
import Chatbot from "@/components/Chatbot";

export default function ChatbotWrapper() {
  const pathname = usePathname();

  // 🔥 Agar Maintenance page par ho, toh Chatbot mat dikhao
  if (pathname === "/maintenance") {
    return null;
  }

  // Baaki jagah dikhao
  return <Chatbot />;
}
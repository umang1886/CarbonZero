"use client";

import { useAuthStore } from "@/store/authStore";
import dynamic from "next/dynamic";

// Dynamically import to avoid SSR issues with Framer Motion
const ChatBot = dynamic(() => import("./ChatBot"), { ssr: false });

export default function ChatBotWrapper() {
  const { user, loading } = useAuthStore();

  // Only render for authenticated users once session is resolved
  if (loading || !user) return null;

  return <ChatBot />;
}

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { Leaf, Loader2 } from "lucide-react";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  // Show a full-screen loader while Firebase resolves the session
  if (loading || !user) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-6 bg-[#0D1117]"
      >
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, #2D6A4F, #52B788)" }}
        >
          <Leaf className="w-7 h-7 text-white" />
        </div>
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="w-5 h-5 text-[#52B788] animate-spin" />
          <p className="text-sm font-medium" style={{ color: "rgba(240,246,252,0.5)" }}>
            Verifying your session…
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

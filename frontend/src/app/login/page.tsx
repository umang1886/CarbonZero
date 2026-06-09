"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Leaf } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative" style={{ background: "#0D1117" }}>
      {/* Background decoration */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-[120px] opacity-20 pointer-events-none" style={{ background: "#52B788" }} />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-[120px] opacity-20 pointer-events-none" style={{ background: "#40916C" }} />
      
      <div className="w-full max-w-md card-glass p-8 rounded-3xl relative z-10 shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl mx-auto flex items-center justify-center mb-4"
            style={{ background: "linear-gradient(135deg, #2D6A4F, #52B788)" }}>
            <Leaf className="w-6 h-6 text-white" />
          </div>
          <h1 className="font-display text-3xl font-black text-white">Welcome Back</h1>
          <p className="text-sm mt-2" style={{ color: "rgba(240,246,252,0.6)" }}>Log in to access your dashboard</p>
        </div>

        {error && (
          <div className="p-3 mb-6 rounded-lg text-sm text-red-200" style={{ background: "rgba(230,57,70,0.1)", border: "1px solid rgba(230,57,70,0.2)" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white mb-1.5">Email Address</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="bg-black/20 border-white/10 text-white placeholder:text-white/30 h-11"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-1.5">Password</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="bg-black/20 border-white/10 text-white placeholder:text-white/30 h-11"
            />
          </div>
          
          <Button
            type="submit"
            disabled={loading}
            className="w-full h-11 mt-4 font-bold rounded-xl btn-primary text-white"
          >
            {loading ? "Signing in..." : "Log In"}
          </Button>
        </form>

        <p className="text-center text-sm mt-6" style={{ color: "rgba(240,246,252,0.6)" }}>
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-semibold text-white hover:underline decoration-[#52B788] underline-offset-4">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Leaf, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/authStore";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

const navLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/calculator", label: "Calculator" },
  { href: "/log", label: "Log Activity" },
  { href: "/insights", label: "AI Insights" },
  { href: "/community", label: "Community" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, loading } = useAuthStore();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0D1117]/90 backdrop-blur-xl shadow-2xl shadow-black/50"
          : "bg-transparent"
      }`}
      style={scrolled ? { borderBottom: "1px solid rgba(255,255,255,0.05)" } : {}}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center group-hover:shadow-lg transition-all duration-300"
              style={{ background: "linear-gradient(135deg, #2D6A4F, #52B788)" }}>
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="font-display text-xl font-bold text-white">
              Carbon<span style={{ color: "#52B788" }}>Zero</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {user && navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 text-[#F0F6FC]/60"
                onMouseEnter={e => { (e.target as HTMLElement).style.color = "#52B788"; (e.target as HTMLElement).style.background = "rgba(82,183,136,0.05)"; }}
                onMouseLeave={e => { (e.target as HTMLElement).style.color = "rgba(240,246,252,0.6)"; (e.target as HTMLElement).style.background = "transparent"; }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3">
            {!loading && user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium" style={{ color: "rgba(240,246,252,0.8)" }}>
                  {user.displayName || user.email}
                </span>
                <button
                  onClick={() => signOut(auth)}
                  className="p-2 rounded-xl text-white transition-all hover:bg-white/5"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : !loading ? (
              <>
                <Link href="/login" className="px-4 py-2 text-sm font-medium text-white hover:text-[#52B788] transition-colors">
                  Log In
                </Link>
                <Link
                  href="/register"
                  className="px-5 py-2.5 text-sm font-bold rounded-xl text-white transition-all"
                  style={{ background: "linear-gradient(135deg, #2D6A4F, #40916C)" }}
                  onMouseEnter={e => { (e.target as HTMLElement).style.background = "linear-gradient(135deg, #40916C, #52B788)"; }}
                  onMouseLeave={e => { (e.target as HTMLElement).style.background = "linear-gradient(135deg, #2D6A4F, #40916C)"; }}
                >
                  Start Free →
                </Link>
              </>
            ) : null}
          </div>

          {/* Mobile Menu */}
          <div className="lg:hidden">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger
                aria-label="Open menu"
                className="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition-all"
              >
                <Menu className="w-5 h-5" />
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-72"
                style={{ background: "#0D1117", borderLeft: "1px solid rgba(255,255,255,0.05)" }}
              >
                <div className="flex flex-col gap-6 pt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ background: "linear-gradient(135deg, #2D6A4F, #52B788)" }}>
                      <Leaf className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-display font-bold text-white">
                      Carbon<span style={{ color: "#52B788" }}>Zero</span>
                    </span>
                  </div>
                  <nav className="flex flex-col gap-1">
                    {user && navLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className="px-4 py-3 text-sm font-medium rounded-lg transition-all"
                        style={{ color: "rgba(240,246,252,0.7)" }}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </nav>
                  
                  <div className="mt-4 pt-4 border-t border-white/5 flex flex-col gap-3">
                    {!loading && user ? (
                      <button
                        onClick={() => { signOut(auth); setMobileOpen(false); }}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold rounded-xl text-white bg-red-500/10 hover:bg-red-500/20 text-red-400"
                      >
                        <LogOut className="w-4 h-4" /> Log Out
                      </button>
                    ) : !loading ? (
                      <>
                        <Link
                          href="/login"
                          onClick={() => setMobileOpen(false)}
                          className="w-full text-center px-4 py-3 text-sm font-bold rounded-xl text-white bg-white/5"
                        >
                          Log In
                        </Link>
                        <Link
                          href="/register"
                          onClick={() => setMobileOpen(false)}
                          className="w-full text-center px-4 py-3 text-sm font-bold rounded-xl text-white"
                          style={{ background: "linear-gradient(135deg, #2D6A4F, #40916C)" }}
                        >
                          Start Free →
                        </Link>
                      </>
                    ) : null}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </motion.header>
  );
}

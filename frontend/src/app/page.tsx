"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useInView, useMotionTemplate, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Leaf, BarChart3, Zap, Users, Shield, Globe, ArrowRight,
  Car, Home, Utensils, ShoppingBag, TrendingDown, Award,
  MessageCircle, Target, CheckCircle2, Star, ChevronRight,
  RefreshCcw, Sparkles
} from "lucide-react";

/* ─── Animated Counter ─────────────────────────────────── */
function Counter({ from = 0, to, suffix = "", duration = 2 }: { from?: number; to: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(from);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = from, startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * (to - from) + from));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, from, to, duration]);

  // Handle updates when `to` prop changes (for the live demo)
  useEffect(() => {
    if (inView && to !== count) {
      let startTime: number | null = null;
      const startVal = count;
      const step = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / 500, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setCount(Math.floor(eased * (to - startVal) + startVal));
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }
  }, [to]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

/* ─── Fade-in Section ───────────────────────────────────── */
function FadeInSection({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── Floating Orb ──────────────────────────────────────── */
function FloatingOrb({ className }: { className: string }) {
  return (
    <div className={`absolute rounded-full blur-[80px] opacity-30 pointer-events-none ${className}`} />
  );
}

/* ─── 3D Tilt Card ──────────────────────────────────────── */
function TiltCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateY, rotateX, transformStyle: "preserve-3d" }}
      className={className}
    >
      <div style={{ transform: "translateZ(30px)" }}>{children}</div>
    </motion.div>
  );
}

/* ─── Spotlight Card ────────────────────────────────────── */
function SpotlightCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <div
      className={`relative group overflow-hidden rounded-2xl ${className}`}
      onMouseMove={handleMouseMove}
      style={{ border: "1px solid rgba(82,183,136,0.15)" }}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              400px circle at ${mouseX}px ${mouseY}px,
              rgba(82, 183, 136, 0.15),
              transparent 80%
            )
          `,
        }}
      />
      <div className="relative h-full z-10">{children}</div>
    </div>
  );
}

/* ─── DATA ──────────────────────────────────────────────── */
const features = [
  {
    icon: BarChart3, color: "#52B788", bg: "rgba(82,183,136,0.1)",
    title: "Carbon Calculator",
    desc: "Precise CO₂e calculations using IPCC-validated emission factors across transport, diet, energy, and shopping.",
  },
  {
    icon: Zap, color: "#74C0FC", bg: "rgba(116,192,252,0.1)",
    title: "AI Insights (Gemini)",
    desc: "Weekly personalized report cards, anomaly detection, and 'What If' scenario simulators powered by Gemini 1.5.",
  },
  {
    icon: MessageCircle, color: "#40916C", bg: "rgba(64,145,108,0.1)",
    title: "GreenBot AI Chat",
    desc: "Log activities via natural language. Ask anything about your footprint. Get motivational eco-challenges.",
  },
  {
    icon: Target, color: "#F4A261", bg: "rgba(244,162,97,0.1)",
    title: "Goal Tracking",
    desc: "Set monthly CO₂ targets, earn milestone badges, and get smart goal suggestions based on your profile.",
  },
  {
    icon: Users, color: "#6B4226", bg: "rgba(107,66,38,0.1)",
    title: "Community Leaderboard",
    desc: "Anonymous city, country, and global rankings. Join 30-day group challenges and share your eco badges.",
  },
  {
    icon: Globe, color: "#E63946", bg: "rgba(230,57,70,0.1)",
    title: "Eco-Actions Marketplace",
    desc: "50+ curated actions with exact kg CO₂e saved estimates. Filter by Easy/Medium/Hard and track progress.",
  },
];

const stats = [
  { value: 15, suffix: "%", label: "Avg. reduction in 30 days" },
  { value: 50, suffix: "+", label: "Eco-actions available" },
  { value: 4800, suffix: "kg", label: "Global avg. CO₂e/year" },
  { value: 2000, suffix: "kg", label: "Paris Agreement target" },
];

const steps = [
  {
    num: "01", icon: BarChart3, color: "#52B788",
    title: "Calculate Your Baseline",
    desc: "Complete a 5-minute assessment covering your transport, diet, energy use, and shopping habits.",
  },
  {
    num: "02", icon: Zap, color: "#74C0FC",
    title: "Get AI-Powered Insights",
    desc: "Gemini analyzes your data and delivers personalized weekly report cards with ranked recommendations.",
  },
  {
    num: "03", icon: TrendingDown, color: "#40916C",
    title: "Track & Reduce",
    desc: "Log daily activities, earn badges, join challenges, and watch your carbon footprint shrink over time.",
  },
];

const personas = [
  { emoji: "🌱", title: "Eco Beginner", desc: "Newly aware of climate change and looking for an easy starting point to understand their impact." },
  { emoji: "🔬", title: "Data Enthusiast", desc: "Loves granular dashboards, charts, and detailed metrics to track every gram of CO₂." },
  { emoji: "👨‍👩‍👧", title: "Family Planner", desc: "Parents wanting to build sustainable habits and teach eco-consciousness to their children." },
  { emoji: "🏢", title: "Remote Worker", desc: "WFH professionals tracking home energy consumption and virtual commute emissions." },
];

const categories = [
  { icon: Car, label: "Transport", value: 1500, color: "#52B788" },
  { icon: Utensils, label: "Diet", value: 1700, color: "#74C0FC" },
  { icon: Home, label: "Energy", value: 900, color: "#F4A261" },
  { icon: ShoppingBag, label: "Shopping", value: 400, color: "#E63946" },
];

const marqueeItems = [
  "🌱 Arjun saved 120kg CO₂ by biking to work this month.",
  "⚡ Priya switched to a renewable energy provider.",
  "🥗 David joined the 7-Day Plant-Based Challenge.",
  "🏆 Sarah reached the top 10 on the global leaderboard.",
  "♻️ Maria logged a zero-waste grocery trip.",
  "💡 Kevin installed LED lighting throughout his home.",
  "🚄 Aiko replaced a domestic flight with a train ride.",
];

export default function LandingPage() {
  const totalSample = categories.reduce((a, c) => a + c.value, 0);

  // Playable Demo State
  const [demoState, setDemoState] = useState({ ev: false, vegan: false, solar: false });
  const demoBase = 5200;
  const demoSavings = (demoState.ev ? 1800 : 0) + (demoState.vegan ? 950 : 0) + (demoState.solar ? 1400 : 0);
  const currentDemoEmissions = demoBase - demoSavings;

  return (
    <div className="min-h-screen overflow-x-hidden font-sans selection:bg-[#52B788] selection:text-white" style={{ background: "#0D1117", color: "#F0F6FC" }}>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll 40s linear infinite;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}} />

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 pb-16 px-4 overflow-hidden">
        {/* Orbs */}
        <FloatingOrb className="w-[600px] h-[600px] bg-[#2D6A4F] -top-40 -left-40" />
        <FloatingOrb className="w-[400px] h-[400px] bg-[#52B788] top-1/2 -right-20" />
        <FloatingOrb className="w-[300px] h-[300px] bg-[#40916C] bottom-0 left-1/3" />

        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "linear-gradient(rgba(82,183,136,1) 1px, transparent 1px), linear-gradient(90deg, rgba(82,183,136,1) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8 mt-12">
          {/* Badge */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm shadow-[0_0_15px_rgba(82,183,136,0.2)]"
              style={{ background: "rgba(82,183,136,0.1)", border: "1px solid rgba(82,183,136,0.3)", color: "#52B788" }}>
              <span className="w-2 h-2 rounded-full bg-[#52B788] animate-pulse" />
              AI-Powered Carbon Intelligence Platform
            </span>
          </motion.div>

          {/* Headline */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}>
            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-none tracking-tight">
              <span className="text-white">Know Your</span>
              <br />
              <span className="green-gradient-text drop-shadow-[0_0_30px_rgba(82,183,136,0.3)]">Carbon Story.</span>
              <br />
              <span className="text-white">Change It.</span>
            </h1>
          </motion.div>

          {/* Subtitle */}
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed"
            style={{ color: "rgba(240,246,252,0.65)" }}>
            CarbonZero uses Google Gemini AI to help you understand, track, and dramatically reduce your personal carbon footprint — with actionable insights, not guilt.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/calculator">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center bg-[#52B788] text-[#0D1117] px-8 py-5 text-lg font-bold rounded-2xl w-full sm:w-auto shadow-[0_0_20px_rgba(82,183,136,0.4)] hover:shadow-[0_0_30px_rgba(82,183,136,0.6)] transition-shadow">
                Calculate My Footprint <ArrowRight className="ml-2 w-5 h-5" />
              </motion.button>
            </Link>
            <Link href="/dashboard">
              <motion.button whileHover={{ scale: 1.05, backgroundColor: "rgba(82,183,136,0.1)" }} whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center px-8 py-5 text-lg font-semibold rounded-2xl w-full sm:w-auto transition-colors backdrop-blur-sm"
                style={{ border: "2px solid rgba(82,183,136,0.3)", color: "#52B788", background: "rgba(82,183,136,0.05)" }}>
                View Demo Dashboard
              </motion.button>
            </Link>
          </motion.div>

          {/* Trust badges */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7, delay: 0.5 }}
            className="flex flex-wrap justify-center gap-6 pt-4">
            {["Firebase", "Gemini AI", "Cloud Run", "IPCC Validated"].map((badge) => (
              <span key={badge} className="flex items-center gap-1.5 text-sm font-medium tracking-wide" style={{ color: "rgba(240,246,252,0.4)" }}>
                <CheckCircle2 className="w-4 h-4 text-[#52B788]" />
                {badge}
              </span>
            ))}
          </motion.div>
        </div>

        {/* 3D Tilt Sample Footprint Card */}
        <motion.div
          initial={{ opacity: 0, y: 80, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, delay: 0.6, type: "spring" }}
          className="relative z-10 mt-16 w-full max-w-4xl mx-auto perspective-[1000px] px-4"
        >
          <TiltCard>
            <div className="card-glass rounded-3xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl border border-white/10" style={{ background: "linear-gradient(145deg, rgba(30,40,50,0.8), rgba(15,20,25,0.9))" }}>
              <div className="flex flex-col md:flex-row gap-8 items-center">
                {/* Total */}
                <div className="text-center md:text-left md:w-1/3">
                  <p className="text-sm font-medium mb-2 uppercase tracking-wider text-[#52B788]">Estimated Footprint</p>
                  <p className="font-display text-5xl font-black text-white drop-shadow-md">
                    {totalSample.toLocaleString()} <span className="text-xl font-normal" style={{ color: "rgba(240,246,252,0.5)" }}>kg CO₂e/yr</span>
                  </p>
                  <div className="mt-4 flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-xs" style={{ color: "rgba(240,246,252,0.4)" }}>
                      <span className="w-2 h-2 rounded-full bg-red-500" /> Global avg: 4,800 kg
                    </div>
                    <div className="flex items-center gap-2 text-xs" style={{ color: "rgba(240,246,252,0.4)" }}>
                      <span className="w-2 h-2 rounded-full bg-[#52B788]" /> Paris target: 2,000 kg
                    </div>
                  </div>
                </div>
                {/* Bars */}
                <div className="flex-1 w-full space-y-4">
                  {categories.map((cat, idx) => (
                    <div key={cat.label} className="group flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform group-hover:scale-110" style={{ background: `${cat.color}20` }}>
                        <cat.icon className="w-4 h-4" style={{ color: cat.color }} />
                      </div>
                      <span className="text-sm font-medium w-20 shrink-0" style={{ color: "rgba(240,246,252,0.8)" }}>{cat.label}</span>
                      <div className="flex-1 h-3 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)", boxShadow: "inset 0 1px 3px rgba(0,0,0,0.5)" }}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(cat.value / totalSample) * 100}%` }}
                          transition={{ duration: 1.5, delay: 1 + idx * 0.15, ease: [0.22, 1, 0.36, 1] }}
                          className="h-full rounded-full relative"
                          style={{ background: `linear-gradient(90deg, ${cat.color}80, ${cat.color})` }}
                        >
                          <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "linear-gradient(45deg, rgba(255,255,255,0.2) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.2) 75%, transparent 75%, transparent)", backgroundSize: "1rem 1rem" }} />
                        </motion.div>
                      </div>
                      <span className="text-sm font-bold w-16 text-right shrink-0" style={{ color: cat.color }}>{cat.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TiltCard>
        </motion.div>
      </section>

      {/* ── MARQUEE ──────────────────────────────────────── */}
      <div className="relative flex overflow-x-hidden bg-[#0D1117] py-6" style={{ borderTop: "1px solid rgba(82,183,136,0.1)", borderBottom: "1px solid rgba(82,183,136,0.1)", background: "linear-gradient(90deg, rgba(13,17,23,1) 0%, rgba(26,46,36,0.3) 50%, rgba(13,17,23,1) 100%)" }}>
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#0D1117] to-transparent z-10" />
        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#0D1117] to-transparent z-10" />
        <div className="animate-scroll whitespace-nowrap flex items-center shrink-0 w-max cursor-default">
          {[...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, i) => (
            <div key={i} className="mx-6 text-sm font-medium tracking-wide flex items-center gap-2" style={{ color: "rgba(240,246,252,0.7)" }}>
              {i % 2 === 0 ? <Star className="w-3 h-3 text-[#52B788]" /> : <Zap className="w-3 h-3 text-[#74C0FC]" />}
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* ── STATS BAR ────────────────────────────────────── */}
      <section className="relative overflow-hidden py-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s, i) => (
              <FadeInSection key={i} delay={i * 0.1} className="text-center group">
                <p className="font-display text-5xl font-black transition-transform group-hover:scale-110 group-hover:text-white text-[#52B788]">
                  <Counter to={s.value} suffix={s.suffix} />
                </p>
                <p className="text-sm mt-3 font-medium uppercase tracking-widest" style={{ color: "rgba(240,246,252,0.4)" }}>{s.label}</p>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── PLAYABLE DEMO (REPLACED STATIC SHOWCASE) ─────── */}
      <section className="py-24 px-4 relative">
        <FloatingOrb className="w-[800px] h-[800px] bg-[#74C0FC] top-0 right-[-200px] opacity-10" />
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <FadeInSection>
              <Badge className="mb-4 px-4 py-1.5 text-sm" style={{ background: "rgba(116,192,252,0.1)", color: "#74C0FC", border: "1px solid rgba(116,192,252,0.3)" }}>
                Interactive Sandbox
              </Badge>
              <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
                See the Impact<br />
                <span className="text-[#74C0FC]">Instantly.</span>
              </h2>
              <p className="text-lg mb-8 leading-relaxed text-[#F0F6FC]/60">
                Wondering how much difference a single lifestyle change makes? Toggle the scenarios to see your projected emissions drop in real-time.
              </p>
              
              <div className="space-y-4">
                {[
                  { key: "ev" as const, icon: Car, label: "Switch to an EV", save: "~1,800 kg CO₂e / yr", color: "#52B788", shadow: "rgba(82,183,136,0.5)" },
                  { key: "vegan" as const, icon: Utensils, label: "Adopt a Vegan Diet", save: "~950 kg CO₂e / yr", color: "#74C0FC", shadow: "rgba(116,192,252,0.5)" },
                  { key: "solar" as const, icon: Home, label: "Install Solar Panels", save: "~1,400 kg CO₂e / yr", color: "#F4A261", shadow: "rgba(244,162,97,0.5)" },
                ].map(({ key, icon: Icon, label, save, color, shadow }) => {
                  const active = demoState[key];
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setDemoState(s => ({ ...s, [key]: !s[key] }))}
                      className="w-full card-glass p-5 rounded-2xl flex items-center justify-between transition-all hover:bg-white/5 cursor-pointer text-left"
                      style={{ border: `1px solid ${active ? color + "50" : "rgba(255,255,255,0.05)"}`, boxShadow: active ? `0 0 20px ${shadow}30` : "none" }}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300" style={{ background: active ? color + "25" : "rgba(255,255,255,0.05)", boxShadow: active ? `0 0 15px ${shadow}` : "none" }}>
                          <Icon className="w-6 h-6 transition-colors duration-300" style={{ color: active ? color : "rgba(255,255,255,0.4)" }} />
                        </div>
                        <div>
                          <h4 className="font-bold text-white text-lg">{label}</h4>
                          <p className="text-sm" style={{ color: "rgba(240,246,252,0.5)" }}>Save {save}</p>
                        </div>
                      </div>
                      {/* Custom toggle pill */}
                      <div className="relative w-12 h-6 rounded-full transition-all duration-300 shrink-0" style={{ background: active ? color : "rgba(255,255,255,0.1)", boxShadow: active ? `0 0 10px ${shadow}` : "none" }}>
                        <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300" style={{ transform: active ? "translateX(24px)" : "translateX(0)" }} />
                      </div>
                    </button>
                  );
                })}
              </div>
            </FadeInSection>

            <FadeInSection delay={0.2} className="relative mt-8 lg:mt-0">
              <div className="relative w-full aspect-square max-w-md mx-auto">
                <motion.div 
                  animate={{ rotate: 360 }} 
                  transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 rounded-full border border-dashed border-white/20" 
                />
                <motion.div 
                  animate={{ rotate: -360 }} 
                  transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-4 rounded-full border border-dotted border-[#74C0FC]/30" 
                />
                
                <div className="absolute inset-8 rounded-full card-glass backdrop-blur-xl flex flex-col items-center justify-center shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                  <Sparkles className="w-8 h-8 mb-4 text-[#74C0FC]" />
                  <p className="text-sm font-medium uppercase tracking-widest text-white/50 mb-2">Projected Emissions</p>
                  <motion.div 
                    key={currentDemoEmissions}
                    initial={{ scale: 1.1, color: "#fff" }}
                    animate={{ scale: 1, color: currentDemoEmissions < 2500 ? "#52B788" : "#74C0FC" }}
                    className="font-display text-7xl font-black drop-shadow-lg"
                  >
                    <Counter to={currentDemoEmissions} duration={1} />
                  </motion.div>
                  <p className="text-xl text-white/60 mt-2">kg CO₂e</p>

                  <AnimatePresence>
                    {demoSavings > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute bottom-12 px-4 py-2 rounded-full bg-[#52B788]/20 border border-[#52B788]/40 text-[#52B788] text-sm font-bold flex items-center gap-2"
                      >
                        <TrendingDown className="w-4 h-4" />
                        Saving {demoSavings} kg!
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* ── FEATURES SPOTLIGHT ───────────────────────────── */}
      <section className="py-24 px-4 max-w-7xl mx-auto relative">
        <FadeInSection className="text-center mb-16">
          <Badge className="mb-4 px-4 py-1.5 text-sm" style={{ background: "rgba(82,183,136,0.1)", color: "#52B788", border: "1px solid rgba(82,183,136,0.3)" }}>
            Platform Features
          </Badge>
          <h2 className="font-display text-4xl md:text-5xl font-black text-white mb-4">
            Everything You Need to<br />
            <span className="green-gradient-text drop-shadow-sm">Go Carbon Neutral</span>
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: "rgba(240,246,252,0.55)" }}>
            Combining cutting-edge AI with behavioral science to make sustainability measurable, rewarding, and actually achievable.
          </p>
        </FadeInSection>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <FadeInSection key={f.title} delay={i * 0.05}>
              <SpotlightCard className="card-glass p-8 h-full">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-inner" style={{ background: f.bg, border: `1px solid ${f.color}30` }}>
                  <f.icon className="w-7 h-7" style={{ color: f.color }} />
                </div>
                <h3 className="font-display text-2xl font-bold text-white mb-3 tracking-tight">{f.title}</h3>
                <p className="text-base leading-relaxed text-[#F0F6FC]/60">{f.desc}</p>
              </SpotlightCard>
            </FadeInSection>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────── */}
      <section className="py-24 px-4 relative overflow-hidden" style={{ background: "rgba(45,106,79,0.05)" }}>
        <FloatingOrb className="w-[500px] h-[500px] bg-[#40916C] top-1/4 -left-64 opacity-20" />
        <div className="max-w-6xl mx-auto relative z-10">
          <FadeInSection className="text-center mb-20">
            <Badge className="mb-4 px-4 py-1.5 text-sm" style={{ background: "rgba(64,145,108,0.1)", color: "#40916C", border: "1px solid rgba(64,145,108,0.3)" }}>
              How It Works
            </Badge>
            <h2 className="font-display text-4xl md:text-5xl font-black text-white">
              Three Steps to a <span className="green-gradient-text drop-shadow-sm">Greener You</span>
            </h2>
          </FadeInSection>

          <div className="grid md:grid-cols-3 gap-12 relative">
            {/* connector line */}
            <div className="hidden md:block absolute top-12 left-1/4 right-1/4 h-[2px] opacity-20" style={{ backgroundImage: "linear-gradient(90deg, #52B788 50%, transparent 50%)", backgroundSize: "15px 100%" }} />

            {steps.map((s, i) => (
              <FadeInSection key={s.title} delay={i * 0.15}>
                <div className="text-center space-y-6 group">
                  <div className="relative inline-block">
                    <div className="w-24 h-24 rounded-3xl flex items-center justify-center mx-auto transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-lg"
                      style={{ background: `${s.color}15`, border: `2px solid ${s.color}40`, backdropFilter: "blur(10px)" }}>
                      <s.icon className="w-10 h-10 transition-colors duration-500" style={{ color: s.color }} />
                    </div>
                    <span className="absolute -top-4 -right-4 w-10 h-10 rounded-full flex items-center justify-center text-sm font-black shadow-[0_0_15px_rgba(0,0,0,0.5)]"
                      style={{ background: s.color, color: "#0D1117" }}>{s.num}</span>
                  </div>
                  <h3 className="font-display text-2xl font-bold text-white tracking-tight">{s.title}</h3>
                  <p className="text-base leading-relaxed px-4" style={{ color: "rgba(240,246,252,0.55)" }}>{s.desc}</p>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHO IT'S FOR ─────────────────────────────────── */}
      <section className="py-24 px-4 max-w-7xl mx-auto">
        <FadeInSection className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl font-black text-white mb-4">
            Built for <span className="green-gradient-text">Every Eco-Mindset</span>
          </h2>
          <p className="text-lg" style={{ color: "rgba(240,246,252,0.5)" }}>Whether you&apos;re just starting out or a dedicated sustainability champion.</p>
        </FadeInSection>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {personas.map((p, i) => (
            <FadeInSection key={p.title} delay={i * 0.1}>
              <div className="card-glass p-8 rounded-3xl text-center h-full transition-transform hover:-translate-y-2 border border-white/5 hover:border-white/20">
                <div className="text-6xl mb-6 drop-shadow-xl">{p.emoji}</div>
                <h3 className="font-display text-xl font-bold text-white mb-3">{p.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(240,246,252,0.55)" }}>{p.desc}</p>
              </div>
            </FadeInSection>
          ))}
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <FadeInSection>
            <div className="relative overflow-hidden rounded-[2.5rem] p-12 md:p-16 text-center shadow-[0_30px_60px_rgba(0,0,0,0.5)] border border-white/10"
              style={{ background: "linear-gradient(135deg, #1B4332 0%, #2D6A4F 50%, #40916C 100%)" }}>
              <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[100px] opacity-30" style={{ background: "#52B788", transform: "translate(30%, -30%)" }} />
              <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full blur-[80px] opacity-20" style={{ background: "#74C0FC", transform: "translate(-30%, 30%)" }} />
              
              <div className="relative z-10 space-y-8">
                <div className="flex justify-center">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="w-20 h-20 rounded-3xl bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/20 shadow-xl"
                  >
                    <Leaf className="w-10 h-10 text-white" />
                  </motion.div>
                </div>
                <h2 className="font-display text-4xl md:text-6xl font-black text-white leading-tight">
                  Start Your Green Journey<br/>Today.
                </h2>
                <p className="text-xl text-white/80 max-w-2xl mx-auto font-medium">
                  Join thousands calculating, tracking, and reducing their carbon footprint with AI-powered guidance. It takes less than 5 minutes.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  <Link href="/calculator">
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                      className="px-10 py-5 text-xl font-bold rounded-2xl bg-white text-[#2D6A4F] shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] w-full sm:w-auto flex items-center justify-center transition-shadow">
                      Calculate Free <ArrowRight className="ml-2 w-6 h-6" />
                    </motion.button>
                  </Link>
                  <Link href="/dashboard">
                    <motion.button whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.15)" }} whileTap={{ scale: 0.95 }}
                      className="px-10 py-5 text-xl font-bold rounded-2xl border-2 border-white/30 text-white w-full sm:w-auto backdrop-blur-sm transition-colors">
                      View Demo
                    </motion.button>
                  </Link>
                </div>
              </div>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────── */}
      <footer className="py-12 px-4 bg-[#0D1117] relative z-20" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2D6A4F] to-[#52B788] flex items-center justify-center shadow-lg">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <span className="font-display text-xl font-black tracking-tight text-white">Carbon<span style={{ color: "#52B788" }}>Zero</span></span>
            </div>
            <p className="text-sm text-center font-medium" style={{ color: "rgba(240,246,252,0.4)" }}>
              Built by Umang Vaghela · PromptWars Challenge 3 · Powered by Google Gemini AI & Firebase
            </p>
            <div className="flex gap-8">
              {["Dashboard", "Calculator", "Community"].map(l => (
                <Link key={l} href={`/${l.toLowerCase()}`} className="text-sm font-medium hover:text-[#52B788] transition-colors" style={{ color: "rgba(240,246,252,0.5)" }}>{l}</Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

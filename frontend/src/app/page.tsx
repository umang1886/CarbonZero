"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useInView, useAnimation } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Leaf, BarChart3, Zap, Users, Shield, Globe, ArrowRight,
  Car, Home, Utensils, ShoppingBag, TrendingDown, Award,
  MessageCircle, Target, CheckCircle2, Star, ChevronRight
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

export default function LandingPage() {
  const totalSample = categories.reduce((a, c) => a + c.value, 0);

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: "#0D1117", color: "#F0F6FC" }}>

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 pb-16 px-4 overflow-hidden">
        {/* Orbs */}
        <FloatingOrb className="w-[600px] h-[600px] bg-[#2D6A4F] -top-40 -left-40" />
        <FloatingOrb className="w-[400px] h-[400px] bg-[#52B788] top-1/2 -right-20" />
        <FloatingOrb className="w-[300px] h-[300px] bg-[#40916C] bottom-0 left-1/3" />

        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "linear-gradient(rgba(82,183,136,1) 1px, transparent 1px), linear-gradient(90deg, rgba(82,183,136,1) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8">
          {/* Badge */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
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
              <span className="green-gradient-text">Carbon Story.</span>
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
              <Button size="lg" className="btn-primary text-white px-8 py-6 text-lg font-bold rounded-2xl glow-green w-full sm:w-auto">
                Calculate My Footprint <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline" className="px-8 py-6 text-lg font-semibold rounded-2xl w-full sm:w-auto"
                style={{ borderColor: "rgba(82,183,136,0.3)", color: "#52B788", background: "rgba(82,183,136,0.05)" }}>
                View Demo Dashboard
              </Button>
            </Link>
          </motion.div>

          {/* Trust badges */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7, delay: 0.5 }}
            className="flex flex-wrap justify-center gap-6 pt-4">
            {["Firebase", "Gemini AI", "Cloud Run", "IPCC Validated"].map((badge) => (
              <span key={badge} className="flex items-center gap-1.5 text-sm" style={{ color: "rgba(240,246,252,0.4)" }}>
                <CheckCircle2 className="w-4 h-4" style={{ color: "#52B788" }} />
                {badge}
              </span>
            ))}
          </motion.div>
        </div>

        {/* Sample Footprint Card - floating */}
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.6 }}
          className="relative z-10 mt-16 w-full max-w-3xl mx-auto"
        >
          <div className="card-glass rounded-2xl p-6 animate-float" style={{ border: "1px solid rgba(82,183,136,0.15)" }}>
            <div className="flex flex-col md:flex-row gap-6 items-center">
              {/* Total */}
              <div className="text-center md:text-left">
                <p className="text-sm font-medium mb-1" style={{ color: "#52B788" }}>Your estimated footprint</p>
                <p className="font-display text-4xl font-black text-white">
                  {totalSample.toLocaleString()} <span className="text-lg font-normal" style={{ color: "rgba(240,246,252,0.5)" }}>kg CO₂e/yr</span>
                </p>
                <p className="text-sm mt-1" style={{ color: "rgba(240,246,252,0.4)" }}>Global avg: 4,800 kg • Paris target: 2,000 kg</p>
              </div>
              {/* Bars */}
              <div className="flex-1 w-full space-y-3">
                {categories.map((cat) => (
                  <div key={cat.label} className="flex items-center gap-3">
                    <cat.icon className="w-4 h-4 shrink-0" style={{ color: cat.color }} />
                    <span className="text-xs w-16 shrink-0" style={{ color: "rgba(240,246,252,0.6)" }}>{cat.label}</span>
                    <div className="flex-1 h-2 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(cat.value / totalSample) * 100}%` }}
                        transition={{ duration: 1.2, delay: 0.8 + categories.indexOf(cat) * 0.1, ease: "easeOut" }}
                        className="h-2 rounded-full"
                        style={{ background: `linear-gradient(90deg, ${cat.color}80, ${cat.color})` }}
                      />
                    </div>
                    <span className="text-xs w-16 text-right shrink-0" style={{ color: "rgba(240,246,252,0.6)" }}>{cat.value} kg</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── STATS BAR ────────────────────────────────────── */}
      <section style={{ background: "rgba(82,183,136,0.04)", borderTop: "1px solid rgba(82,183,136,0.1)", borderBottom: "1px solid rgba(82,183,136,0.1)" }}>
        <div className="max-w-5xl mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s, i) => (
              <FadeInSection key={i} delay={i * 0.1} className="text-center">
                <p className="font-display text-4xl font-black" style={{ color: "#52B788" }}>
                  <Counter to={s.value} suffix={s.suffix} />
                </p>
                <p className="text-sm mt-1" style={{ color: "rgba(240,246,252,0.5)" }}>{s.label}</p>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────── */}
      <section className="py-24 px-4 max-w-7xl mx-auto">
        <FadeInSection className="text-center mb-16">
          <Badge className="mb-4 px-4 py-1.5 text-sm" style={{ background: "rgba(82,183,136,0.1)", color: "#52B788", border: "1px solid rgba(82,183,136,0.3)" }}>
            Platform Features
          </Badge>
          <h2 className="font-display text-4xl md:text-5xl font-black text-white mb-4">
            Everything You Need to<br />
            <span className="green-gradient-text">Go Carbon Neutral</span>
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: "rgba(240,246,252,0.55)" }}>
            Combining cutting-edge AI with behavioral science to make sustainability measurable, rewarding, and actually achievable.
          </p>
        </FadeInSection>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <FadeInSection key={f.title} delay={i * 0.08}>
              <div className="feature-card card-glass p-6 rounded-2xl h-full cursor-pointer">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: f.bg }}>
                  <f.icon className="w-6 h-6" style={{ color: f.color }} />
                </div>
                <h3 className="font-display text-lg font-bold text-white mb-2">{f.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(240,246,252,0.55)" }}>{f.desc}</p>
              </div>
            </FadeInSection>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────── */}
      <section className="py-24 px-4" style={{ background: "rgba(45,106,79,0.05)" }}>
        <div className="max-w-5xl mx-auto">
          <FadeInSection className="text-center mb-16">
            <Badge className="mb-4 px-4 py-1.5 text-sm" style={{ background: "rgba(64,145,108,0.1)", color: "#40916C", border: "1px solid rgba(64,145,108,0.3)" }}>
              How It Works
            </Badge>
            <h2 className="font-display text-4xl md:text-5xl font-black text-white">
              Three Steps to a <span className="green-gradient-text">Greener You</span>
            </h2>
          </FadeInSection>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* connector line */}
            <div className="hidden md:block absolute top-10 left-1/4 right-1/4 h-[2px] step-line opacity-30" />

            {steps.map((s, i) => (
              <FadeInSection key={s.title} delay={i * 0.15}>
                <div className="text-center space-y-4 p-6">
                  <div className="relative inline-block">
                    <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto"
                      style={{ background: `${s.color}15`, border: `2px solid ${s.color}30` }}>
                      <s.icon className="w-9 h-9" style={{ color: s.color }} />
                    </div>
                    <span className="absolute -top-3 -right-3 w-8 h-8 rounded-full flex items-center justify-center text-xs font-black"
                      style={{ background: s.color, color: "#0D1117" }}>{s.num}</span>
                  </div>
                  <h3 className="font-display text-xl font-bold text-white">{s.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "rgba(240,246,252,0.55)" }}>{s.desc}</p>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHO IT'S FOR ─────────────────────────────────── */}
      <section className="py-24 px-4 max-w-7xl mx-auto">
        <FadeInSection className="text-center mb-12">
          <h2 className="font-display text-4xl md:text-5xl font-black text-white mb-4">
            Built for <span className="green-gradient-text">Every Eco-Mindset</span>
          </h2>
          <p className="text-lg" style={{ color: "rgba(240,246,252,0.5)" }}>Whether you're just starting out or a dedicated sustainability champion.</p>
        </FadeInSection>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {personas.map((p, i) => (
            <FadeInSection key={p.title} delay={i * 0.1}>
              <div className="feature-card card-glass p-6 rounded-2xl text-center h-full">
                <div className="text-5xl mb-4">{p.emoji}</div>
                <h3 className="font-display font-bold text-white mb-2">{p.title}</h3>
                <p className="text-sm" style={{ color: "rgba(240,246,252,0.55)" }}>{p.desc}</p>
              </div>
            </FadeInSection>
          ))}
        </div>
      </section>

      {/* ── DESIGN SYSTEM SHOWCASE ───────────────────────── */}
      <section className="py-24 px-4" style={{ background: "rgba(26,26,46,0.5)" }}>
        <div className="max-w-5xl mx-auto">
          <FadeInSection className="text-center mb-12">
            <h2 className="font-display text-4xl font-black text-white mb-4">Your Emissions at a <span className="green-gradient-text">Glance</span></h2>
          </FadeInSection>
          <FadeInSection>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Gauge card */}
              <div className="card-glass p-8 rounded-2xl">
                <p className="text-sm font-medium mb-6" style={{ color: "#52B788" }}>Annual Carbon Footprint</p>
                <div className="flex items-end gap-4 mb-6">
                  <p className="font-display text-5xl font-black text-white">4,500</p>
                  <p className="text-lg mb-1.5" style={{ color: "rgba(240,246,252,0.4)" }}>kg CO₂e</p>
                </div>
                <div className="space-y-4">
                  {[
                    { label: "vs. Global Avg (4,800 kg)", pct: 94, color: "#52B788" },
                    { label: "vs. India Avg (1,900 kg)", pct: 100, color: "#F4A261" },
                    { label: "vs. Paris Target (2,000 kg)", pct: 100, color: "#E63946" },
                  ].map((b) => (
                    <div key={b.label} className="space-y-1.5">
                      <div className="flex justify-between text-xs" style={{ color: "rgba(240,246,252,0.5)" }}>
                        <span>{b.label}</span><span style={{ color: b.color }}>{b.pct}%</span>
                      </div>
                      <div className="h-2 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
                        <div className="h-2 rounded-full transition-all" style={{ width: `${b.pct}%`, background: b.color }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Tips card */}
              <div className="card-glass p-8 rounded-2xl">
                <p className="text-sm font-medium mb-6 flex items-center gap-2" style={{ color: "#52B788" }}>
                  <Zap className="w-4 h-4" /> GreenBot AI Recommendations
                </p>
                <div className="space-y-4">
                  {[
                    { label: "Switch to an EV", save: "1,200 kg CO₂", impact: "High", color: "#52B788" },
                    { label: "Reduce meat to 3x/week", save: "600 kg CO₂", impact: "Medium", color: "#74C0FC" },
                    { label: "Install LED lighting", save: "200 kg CO₂", impact: "Easy", color: "#F4A261" },
                  ].map((tip, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)" }}>
                      <div>
                        <p className="text-sm font-medium text-white">{tip.label}</p>
                        <p className="text-xs mt-0.5" style={{ color: "rgba(240,246,252,0.4)" }}>Save ~{tip.save}/year</p>
                      </div>
                      <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ background: `${tip.color}15`, color: tip.color }}>
                        {tip.impact}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 rounded-xl flex items-start gap-3" style={{ background: "rgba(82,183,136,0.08)", border: "1px solid rgba(82,183,136,0.15)" }}>
                  <MessageCircle className="w-4 h-4 mt-0.5 shrink-0" style={{ color: "#52B788" }} />
                  <p className="text-xs" style={{ color: "rgba(240,246,252,0.7)" }}>
                    "Your transport emissions spiked 40% this week. Consider carpooling on Tuesdays to offset this! 🚗"
                  </p>
                </div>
              </div>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <FadeInSection>
            <div className="relative overflow-hidden rounded-3xl p-12 text-center"
              style={{ background: "linear-gradient(135deg, #1B4332 0%, #2D6A4F 50%, #40916C 100%)" }}>
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-20" style={{ background: "#52B788" }} />
              <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full blur-3xl opacity-15" style={{ background: "#74C0FC" }} />
              <div className="relative z-10 space-y-6">
                <div className="flex justify-center">
                  <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center">
                    <Leaf className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h2 className="font-display text-4xl md:text-5xl font-black text-white">
                  Start Your Green Journey Today
                </h2>
                <p className="text-lg text-white/70 max-w-2xl mx-auto">
                  Join thousands calculating, tracking, and reducing their carbon footprint with AI-powered guidance. It takes less than 5 minutes.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/calculator">
                    <Button size="lg" className="px-8 py-6 text-lg font-bold rounded-2xl bg-white text-[#2D6A4F] hover:bg-white/90 w-full sm:w-auto">
                      Calculate Free <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                  <Link href="/dashboard">
                    <Button size="lg" variant="outline" className="px-8 py-6 text-lg font-semibold rounded-2xl border-white/30 text-white hover:bg-white/10 w-full sm:w-auto">
                      View Demo
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────── */}
      <footer className="py-12 px-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#2D6A4F] to-[#52B788] flex items-center justify-center">
                <Leaf className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-bold text-white">Carbon<span style={{ color: "#52B788" }}>Zero</span></span>
            </div>
            <p className="text-sm text-center" style={{ color: "rgba(240,246,252,0.35)" }}>
              Built by Umang Vaghela · PromptWars Challenge 3 · Powered by Google Gemini AI & Firebase
            </p>
            <div className="flex gap-6">
              {["Dashboard", "Calculator", "Community"].map(l => (
                <Link key={l} href={`/${l.toLowerCase()}`} className="text-sm transition-colors" style={{ color: "rgba(240,246,252,0.4)" }}>{l}</Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

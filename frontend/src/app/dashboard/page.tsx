"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { API_URL } from "@/config";
import { useFootprintStore } from "@/store/footprintStore";
import { useAuthStore } from "@/store/authStore";
import ProtectedRoute from "@/components/ProtectedRoute";
import { motion } from "framer-motion";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, BarChart, Bar
} from "recharts";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Car, Utensils, Home, ShoppingBag, TrendingDown, Zap,
  Award, Leaf, ArrowRight, Target, Calendar, ChevronRight
} from "lucide-react";

const COLORS = ["#52B788", "#74C0FC", "#F4A261", "#E63946"];
const CAT_ICONS = { transport: Car, diet: Utensils, energy: Home, shopping: ShoppingBag };
const CAT_COLORS = { transport: "#52B788", diet: "#74C0FC", energy: "#F4A261", shopping: "#E63946" };

function StatCard({ label, value, sub, color, icon: Icon }: { label: string; value: string; sub: string; color: string; icon: any }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="p-5 rounded-2xl"
      style={{ background: "#161B22", border: "1px solid rgba(255,255,255,0.06)" }}
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-xs font-medium uppercase tracking-wider" style={{ color: "rgba(240,246,252,0.4)" }}>{label}</span>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${color}15` }}>
          <Icon className="w-4 h-4" style={{ color }} />
        </div>
      </div>
      <p className="font-display text-3xl font-black text-white">{value}</p>
      <p className="text-xs mt-1" style={{ color: "rgba(240,246,252,0.4)" }}>{sub}</p>
    </motion.div>
  );
}

const WEEKLY_DATA = [
  { week: "W1", transport: 88, diet: 118, energy: 60, shopping: 20 },
  { week: "W2", transport: 72, diet: 118, energy: 55, shopping: 0 },
  { week: "W3", transport: 95, diet: 118, energy: 58, shopping: 35 },
  { week: "W4", transport: 65, diet: 118, energy: 52, shopping: 10 },
  { week: "W5", transport: 80, diet: 118, energy: 50, shopping: 0 },
  { week: "W6", transport: 60, diet: 118, energy: 48, shopping: 15 },
];

const ECO_TIPS = [
  { label: "Switch to EV", save: 1200, impact: "High", done: false, color: "#52B788" },
  { label: "Reduce meat 3x/week", save: 600, impact: "Medium", done: true, color: "#74C0FC" },
  { label: "Install LED lighting", save: 200, impact: "Easy", done: false, color: "#F4A261" },
  { label: "Take train vs. car", save: 400, impact: "Medium", done: false, color: "#40916C" },
];

export default function DashboardPage() {
  const { footprint, setFootprint } = useFootprintStore();
  const { user, loading: authLoading } = useAuthStore();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"weekly" | "category">("weekly");
  const [fetching, setFetching] = useState(false);
  const fetchedRef = useRef(false); // prevent double-fetch

  useEffect(() => {
    if (authLoading) return;          // wait for Firebase to resolve
    if (!user) { router.replace("/login"); return; }
    if (footprint) return;            // already have data
    if (fetchedRef.current) return;   // already fetched once this session

    fetchedRef.current = true;
    setFetching(true);

    user.getIdToken()
      .then((token) => {
        return fetch(`${API_URL}/api/v1/footprint/latest`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      })
      .then(async (res) => {
        if (res.ok) {
          const data = await res.json();
          setFootprint(data);
        } else {
          // No saved footprint - stay on dashboard to show empty state
        }
      })
      .catch(() => {
        // Stay on dashboard to show empty state
      })
      .finally(() => setFetching(false));
  }, [authLoading, user, footprint, router, setFootprint]);

  if (authLoading || fetching) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: "#0D1117" }}>
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center animate-pulse"
          style={{ background: "linear-gradient(135deg, #2D6A4F, #52B788)" }}>
          <Leaf className="w-6 h-6 text-white" />
        </div>
        <p className="text-sm font-medium" style={{ color: "rgba(240,246,252,0.5)" }}>Loading your dashboard…</p>
      </div>
    );
  }

  if (!footprint) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen pt-20 pb-12 px-4 flex flex-col items-center justify-center gap-6 text-center" style={{ background: "#0D1117" }}>
          <div className="w-20 h-20 rounded-3xl flex items-center justify-center shadow-lg"
            style={{ background: "linear-gradient(135deg, #2D6A4F, #52B788)" }}>
            <Leaf className="w-10 h-10 text-white" />
          </div>
          <div>
            <h1 className="font-display text-4xl font-black text-white mb-3">Welcome to CarbonZero</h1>
            <p className="text-base max-w-md mx-auto" style={{ color: "rgba(240,246,252,0.6)" }}>
              You haven't calculated your carbon footprint yet. Find out your environmental impact in just a few minutes.
            </p>
          </div>
          <Link href="/calculator">
            <Button className="btn-primary text-white rounded-xl text-lg h-14 px-8 mt-2 font-bold gap-2 hover:scale-105 transition-transform">
              Calculate Your Footprint <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </ProtectedRoute>
    );
  }

  const breakdown = footprint.breakdown as Record<string, number>;
  const total = footprint.total_kg_co2e;
  const globalAvg = footprint.comparison?.global_avg ?? 4800;
  const parisTarget = footprint.comparison?.paris_target ?? 2000;
  const pctVsGlobal = Math.round((total / globalAvg) * 100);
  const pctVsParis = Math.min(Math.round((total / parisTarget) * 100), 200);

  const pieData = Object.entries(breakdown).map(([name, value]) => ({ name, value }));

  return (
    <ProtectedRoute>
    <div className="min-h-screen pt-20 pb-12 px-4" style={{ background: "#0D1117" }}>
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4">
          <div>
            <h1 className="font-display text-3xl font-black text-white">Your Carbon Dashboard</h1>
            <p className="text-sm mt-1" style={{ color: "rgba(240,246,252,0.4)" }}>Based on your latest footprint assessment</p>
          </div>
          <div className="flex gap-3">
            <Link href="/calculator">
              <Button variant="outline" className="rounded-xl text-sm gap-2" style={{ borderColor: "rgba(82,183,136,0.3)", color: "#52B788" }}>
                Recalculate
              </Button>
            </Link>
            <Link href="/log">
              <Button className="btn-primary text-white rounded-xl text-sm gap-2">
                Log Activity <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Top Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Annual Footprint" value={`${total.toLocaleString()} kg`} sub="CO₂ equivalent" color="#52B788" icon={Leaf} />
          <StatCard label="vs Global Avg" value={`${pctVsGlobal}%`} sub={`Global avg: ${globalAvg.toLocaleString()} kg`} color={pctVsGlobal < 100 ? "#52B788" : "#F4A261"} icon={TrendingDown} />
          <StatCard label="vs Paris Target" value={`${pctVsParis}%`} sub="2,000 kg target" color={pctVsParis <= 100 ? "#52B788" : "#E63946"} icon={Target} />
          <StatCard label="Biggest Category" value={Object.entries(breakdown).sort((a,b)=>b[1]-a[1])[0]?.[0] ?? "—"} sub={`${Math.max(...Object.values(breakdown)).toLocaleString()} kg CO₂e`} color="#74C0FC" icon={Award} />
        </div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-5 gap-6">
          {/* Donut */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="lg:col-span-2 p-6 rounded-2xl" style={{ background: "#161B22", border: "1px solid rgba(255,255,255,0.06)" }}>
            <h2 className="font-display font-bold text-white mb-1">Category Breakdown</h2>
            <p className="text-xs mb-4" style={{ color: "rgba(240,246,252,0.4)" }}>Annual CO₂e by source</p>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="value" stroke="none">
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: "#1C2128", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, color: "#F0F6FC", fontSize: 12 }}
                    formatter={(v: any) => [`${v.toLocaleString()} kg CO₂e`, ""]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 mt-2">
              {pieData.map((item, i) => {
                const Icon = CAT_ICONS[item.name as keyof typeof CAT_ICONS];
                const color = COLORS[i % COLORS.length];
                return (
                  <div key={item.name} className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: color }} />
                    {Icon && <Icon className="w-3.5 h-3.5 shrink-0" style={{ color }} />}
                    <span className="text-xs capitalize flex-1 text-white">{item.name}</span>
                    <span className="text-xs font-medium" style={{ color }}>{item.value.toLocaleString()} kg</span>
                    <span className="text-xs" style={{ color: "rgba(240,246,252,0.4)" }}>({Math.round((item.value / total) * 100)}%)</span>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Area Chart */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            className="lg:col-span-3 p-6 rounded-2xl" style={{ background: "#161B22", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-display font-bold text-white">Weekly Trend</h2>
                <p className="text-xs" style={{ color: "rgba(240,246,252,0.4)" }}>Emissions by category per week</p>
              </div>
              <div className="flex gap-1">
                {(["weekly", "category"] as const).map(t => (
                  <button key={t} onClick={() => setActiveTab(t)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize"
                    style={{ background: activeTab === t ? "rgba(82,183,136,0.15)" : "transparent", color: activeTab === t ? "#52B788" : "rgba(240,246,252,0.4)", border: activeTab === t ? "1px solid rgba(82,183,136,0.3)" : "1px solid transparent" }}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                {activeTab === "weekly" ? (
                  <AreaChart data={WEEKLY_DATA}>
                    <defs>
                      {[["transport","#52B788"],["diet","#74C0FC"],["energy","#F4A261"],["shopping","#E63946"]].map(([key, color]) => (
                        <linearGradient key={key} id={`g-${key}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                          <stop offset="95%" stopColor={color} stopOpacity={0} />
                        </linearGradient>
                      ))}
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                    <XAxis dataKey="week" tick={{ fill: "rgba(240,246,252,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "rgba(240,246,252,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: "#1C2128", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, color: "#F0F6FC", fontSize: 12 }} />
                    {[["transport","#52B788"],["diet","#74C0FC"],["energy","#F4A261"],["shopping","#E63946"]].map(([key, color]) => (
                      <Area key={key} type="monotone" dataKey={key} stroke={color} strokeWidth={2} fill={`url(#g-${key})`} />
                    ))}
                  </AreaChart>
                ) : (
                  <BarChart data={pieData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                    <XAxis dataKey="name" tick={{ fill: "rgba(240,246,252,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "rgba(240,246,252,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: "#1C2128", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, color: "#F0F6FC", fontSize: 12 }} />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                      {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Bar>
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Progress + Tips */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Reduction Progress */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="p-6 rounded-2xl" style={{ background: "#161B22", border: "1px solid rgba(255,255,255,0.06)" }}>
            <h2 className="font-display font-bold text-white mb-1">Footprint vs. Benchmarks</h2>
            <p className="text-xs mb-5" style={{ color: "rgba(240,246,252,0.4)" }}>How you compare to global standards</p>
            {[
              { label: "Your footprint", value: total, max: 8000, color: "#52B788" },
              { label: "India average", value: 1900, max: 8000, color: "#74C0FC" },
              { label: "Global average", value: 4800, max: 8000, color: "#F4A261" },
              { label: "Paris 2030 target", value: 2000, max: 8000, color: "#E63946" },
            ].map(b => (
              <div key={b.label} className="mb-4">
                <div className="flex justify-between text-xs mb-1.5">
                  <span style={{ color: "rgba(240,246,252,0.6)" }}>{b.label}</span>
                  <span className="font-medium" style={{ color: b.color }}>{b.value.toLocaleString()} kg CO₂e</span>
                </div>
                <div className="h-2 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(b.value / b.max) * 100}%` }}
                    transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
                    className="h-2 rounded-full"
                    style={{ background: b.color }}
                  />
                </div>
              </div>
            ))}
          </motion.div>

          {/* AI Eco Tips */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="p-6 rounded-2xl" style={{ background: "#161B22", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-4 h-4" style={{ color: "#52B788" }} />
              <h2 className="font-display font-bold text-white">AI-Recommended Actions</h2>
            </div>
            <div className="space-y-3">
              {ECO_TIPS.map((tip, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all`}
                    style={{ borderColor: tip.done ? tip.color : "rgba(255,255,255,0.15)", background: tip.done ? `${tip.color}20` : "transparent" }}>
                    {tip.done && <div className="w-2.5 h-2.5 rounded-full" style={{ background: tip.color }} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${tip.done ? "line-through" : ""} text-white`}>{tip.label}</p>
                    <p className="text-xs" style={{ color: "rgba(240,246,252,0.4)" }}>Save ~{tip.save.toLocaleString()} kg CO₂/yr</p>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full font-medium shrink-0" style={{ background: `${tip.color}15`, color: tip.color }}>
                    {tip.impact}
                  </span>
                </div>
              ))}
            </div>
            <Link href="/insights" className="mt-4 flex items-center gap-1 text-sm font-medium" style={{ color: "#52B788" }}>
              View all AI Insights <ChevronRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
    </ProtectedRoute>
  );
}

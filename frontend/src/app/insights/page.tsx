"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Zap, TrendingDown, Leaf, Target, MessageCircle, RefreshCcw, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFootprintStore } from "@/store/footprintStore";
import ProtectedRoute from "@/components/ProtectedRoute";

const AI_INSIGHTS = [
  {
    id: "commute",
    type: "recommendation",
    icon: TrendingDown, color: "#52B788",
    title: "Switch Your Commute",
    body: "Switching from petrol to transit 3x/week saves 520 kg CO₂e/yr. Equivalent to 24 trees! 🚌",
    save: "520 kg CO₂e/yr",
    colSpan: "col-span-12 md:col-span-8",
    rowSpan: "row-span-1",
  },
  {
    id: "diet",
    type: "positive",
    icon: Leaf, color: "#40916C",
    title: "Great Diet Choices!",
    body: "Your diet choices save 800 kg CO₂e per year compared to average. 🌿",
    save: "800 kg saved",
    colSpan: "col-span-12 md:col-span-4",
    rowSpan: "row-span-1",
  },
  {
    id: "energy",
    type: "alert",
    icon: Zap, color: "#F4A261",
    title: "Energy Spike Detected",
    body: "Home energy is 18% above your 6-week average. Try AC at 24°C instead of 20°C.",
    save: "80 kg/mo",
    colSpan: "col-span-12 md:col-span-5",
    rowSpan: "row-span-1",
  },
  {
    id: "fact",
    type: "fun_fact",
    icon: MessageCircle, color: "#E63946",
    title: "🌍 Fun Fact",
    body: "A single return flight Mumbai to London generates ~1.5 tonnes CO₂e (75% of Paris target).",
    save: null,
    colSpan: "col-span-12 md:col-span-7",
    rowSpan: "row-span-1",
  },
];

const WEEKLY_DATA = [45, 52, 49, 60, 55, 42, 38]; // Example data for sparkline

export default function InsightsPage() {
  const footprint = useFootprintStore(s => s.footprint);
  const [refreshing, setRefreshing] = useState(false);
  
  // Interactive "What If" states
  const [wfhDays, setWfhDays] = useState(2);
  const [veganDays, setVeganDays] = useState(3);
  const [evPct, setEvPct] = useState(50);

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise(r => setTimeout(r, 1200));
    setRefreshing(false);
  };

  // Sparkline calculation
  const maxData = Math.max(...WEEKLY_DATA);
  const minData = Math.min(...WEEKLY_DATA);
  const range = maxData - minData;

  return (
    <ProtectedRoute>
      <div className="min-h-screen pt-24 pb-20 px-4 relative" style={{ background: "#0D1117" }}>
        {/* Glow Effects */}
        <div className="absolute top-20 right-0 w-[500px] h-[500px] rounded-full blur-[150px] pointer-events-none opacity-10" style={{ background: "#74C0FC" }} />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full blur-[120px] pointer-events-none opacity-10" style={{ background: "#52B788" }} />

        <div className="relative z-10 max-w-5xl mx-auto space-y-8">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <h1 className="font-display text-4xl sm:text-5xl font-black text-white mb-2">AI Insights</h1>
              <div className="flex items-center gap-2 text-sm text-white/50">
                <span className="w-2 h-2 rounded-full bg-[#74C0FC] animate-pulse" />
                Powered by Gemini 1.5 Flash AI
              </div>
            </div>
            <Button 
              onClick={handleRefresh} disabled={refreshing}
              className="rounded-xl gap-2 h-10 border border-white/10 hover:bg-white/5 bg-[#161B22]/80 backdrop-blur-md text-white transition-all shadow-lg"
            >
              <RefreshCcw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
              {refreshing ? "Analyzing Patterns..." : "Refresh Insights"}
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column: Bento Grid */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Weekly Report Hero Card */}
              <div className="p-6 sm:p-8 rounded-3xl relative overflow-hidden" style={{ background: "linear-gradient(135deg, rgba(82,183,136,0.15), rgba(45,106,79,0.05))", border: "1px solid rgba(82,183,136,0.3)", boxShadow: "0 20px 40px rgba(0,0,0,0.4)" }}>
                <div className="absolute right-0 top-0 w-64 h-64 bg-[#52B788]/10 blur-[80px] rounded-full" />
                
                <div className="flex justify-between items-start mb-8 relative z-10">
                  <div>
                    <h2 className="font-display font-bold text-white text-xl flex items-center gap-2 mb-1">
                      <TrendingDown className="w-5 h-5 text-[#52B788]" /> Weekly Report
                    </h2>
                    <p className="text-sm text-white/50">Your emissions are trending downwards.</p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-black text-white">87.4 <span className="text-sm font-medium text-white/50">kg CO₂e</span></p>
                    <p className="text-sm font-bold text-[#52B788]">-5% vs last week</p>
                  </div>
                </div>

                {/* SVG Sparkline */}
                <div className="h-24 w-full relative z-10 flex items-end gap-2">
                  {WEEKLY_DATA.map((val, i) => {
                    const heightPct = ((val - minData + 5) / (range + 10)) * 100;
                    return (
                      <div key={i} className="flex-1 flex flex-col justify-end group">
                        <motion.div 
                          initial={{ height: 0 }} animate={{ height: `${heightPct}%` }} transition={{ duration: 0.8, delay: i * 0.1, type: "spring" }}
                          className="w-full rounded-t-sm relative transition-colors group-hover:bg-[#52B788]"
                          style={{ background: i === WEEKLY_DATA.length - 1 ? "#52B788" : "rgba(82,183,136,0.3)" }}
                        >
                          <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-[#161B22] border border-white/10 text-xs font-bold text-white px-2 py-1 rounded shadow-lg transition-opacity pointer-events-none">
                            {val}kg
                          </div>
                        </motion.div>
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-between text-[10px] text-white/30 mt-2 uppercase font-bold tracking-widest relative z-10">
                  <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Today</span>
                </div>
              </div>

              {/* Bento Grid for Insights */}
              <div className="grid grid-cols-12 gap-4">
                {AI_INSIGHTS.map((insight, i) => (
                  <motion.div 
                    key={insight.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.1 }}
                    className={`${insight.colSpan} ${insight.rowSpan} p-6 rounded-3xl transition-all hover:scale-[1.02] cursor-default`}
                    style={{ background: "rgba(22,27,34,0.6)", backdropFilter: "blur(12px)", border: `1px solid ${insight.color}30`, boxShadow: `0 10px 30px rgba(0,0,0,0.2)` }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${insight.color}20` }}>
                        <insight.icon className="w-5 h-5" style={{ color: insight.color }} />
                      </div>
                      {insight.save && (
                        <span className="text-xs font-bold px-3 py-1 rounded-full border" style={{ background: `${insight.color}10`, color: insight.color, borderColor: `${insight.color}30` }}>
                          {insight.save}
                        </span>
                      )}
                    </div>
                    <h3 className="font-display font-bold text-white text-lg mb-2">{insight.title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: "rgba(240,246,252,0.6)" }}>{insight.body}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Right Column: Interactive What-If Scenarios */}
            <div className="lg:col-span-4 space-y-6">
              <div className="p-6 rounded-3xl h-full flex flex-col" style={{ background: "linear-gradient(180deg, #161B22, #0D1117)", border: "1px solid rgba(116,192,252,0.2)", boxShadow: "0 20px 40px rgba(0,0,0,0.4)" }}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#74C0FC]/20">
                    <Target className="w-5 h-5 text-[#74C0FC]" />
                  </div>
                  <div>
                    <h2 className="font-display font-bold text-white text-xl">What-If Scenarios</h2>
                    <p className="text-xs text-[#74C0FC]/80">Adjust sliders to see potential savings</p>
                  </div>
                </div>

                <div className="space-y-8 flex-1">
                  {/* WFH Slider */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-end">
                      <label className="text-sm font-medium text-white/80">Work From Home</label>
                      <span className="font-display font-bold text-white">{wfhDays} <span className="text-xs text-white/40">days/wk</span></span>
                    </div>
                    <input 
                      type="range" min={0} max={5} value={wfhDays} onChange={e => setWfhDays(Number(e.target.value))}
                      className="w-full h-2 rounded-lg appearance-none cursor-pointer focus:outline-none"
                      style={{ background: `linear-gradient(to right, #74C0FC ${(wfhDays/5)*100}%, rgba(255,255,255,0.1) ${(wfhDays/5)*100}%)` }}
                    />
                    <style jsx>{`
                      input[type=range]::-webkit-slider-thumb {
                        -webkit-appearance: none; appearance: none; width: 16px; height: 16px; border-radius: 50%;
                        background: #fff; border: 2px solid #74C0FC; cursor: pointer; box-shadow: 0 0 10px #74C0FC80;
                      }
                    `}</style>
                    <p className="text-xs font-bold text-[#74C0FC] text-right bg-[#74C0FC]/10 px-2 py-1 rounded inline-block float-right">
                      -{wfhDays * 120} kg/yr
                    </p>
                    <div className="clear-both" />
                  </div>

                  {/* Vegan Slider */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-end">
                      <label className="text-sm font-medium text-white/80">Vegan Diet</label>
                      <span className="font-display font-bold text-white">{veganDays} <span className="text-xs text-white/40">days/wk</span></span>
                    </div>
                    <input 
                      type="range" min={0} max={7} value={veganDays} onChange={e => setVeganDays(Number(e.target.value))}
                      className="w-full h-2 rounded-lg appearance-none cursor-pointer focus:outline-none"
                      style={{ background: `linear-gradient(to right, #52B788 ${(veganDays/7)*100}%, rgba(255,255,255,0.1) ${(veganDays/7)*100}%)` }}
                    />
                    <style jsx>{`
                      input[type=range]::-webkit-slider-thumb { border-color: #52B788; box-shadow: 0 0 10px #52B78880; }
                    `}</style>
                    <p className="text-xs font-bold text-[#52B788] text-right bg-[#52B788]/10 px-2 py-1 rounded inline-block float-right">
                      -{veganDays * 150} kg/yr
                    </p>
                    <div className="clear-both" />
                  </div>

                  {/* EV Adoption Slider */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-end">
                      <label className="text-sm font-medium text-white/80">Switch to EV</label>
                      <span className="font-display font-bold text-white">{evPct}% <span className="text-xs text-white/40">of driving</span></span>
                    </div>
                    <input 
                      type="range" min={0} max={100} step={10} value={evPct} onChange={e => setEvPct(Number(e.target.value))}
                      className="w-full h-2 rounded-lg appearance-none cursor-pointer focus:outline-none"
                      style={{ background: `linear-gradient(to right, #F4A261 ${(evPct/100)*100}%, rgba(255,255,255,0.1) ${(evPct/100)*100}%)` }}
                    />
                    <style jsx>{`
                      input[type=range]::-webkit-slider-thumb { border-color: #F4A261; box-shadow: 0 0 10px #F4A26180; }
                    `}</style>
                    <p className="text-xs font-bold text-[#F4A261] text-right bg-[#F4A261]/10 px-2 py-1 rounded inline-block float-right">
                      -{Math.round((evPct/100) * 800)} kg/yr
                    </p>
                    <div className="clear-both" />
                  </div>
                </div>

                {/* Total Potential Savings */}
                <div className="mt-8 pt-6 border-t border-white/10">
                  <p className="text-xs uppercase tracking-widest font-bold text-white/40 mb-1">Total Potential Savings</p>
                  <div className="flex items-center justify-between">
                    <span className="font-display text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#74C0FC] to-[#52B788]">
                      {(wfhDays * 120) + (veganDays * 150) + Math.round((evPct/100) * 800)} <span className="text-sm font-medium text-white/50">kg/yr</span>
                    </span>
                    <Button variant="ghost" className="rounded-full w-10 h-10 p-0 bg-white/5 hover:bg-white/10 text-white">
                      <ArrowRight className="w-5 h-5" />
                    </Button>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Trophy, Users, Target, Zap, Globe, CheckCircle2, Star, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const LEADERBOARD = [
  { rank: 1, name: "Arjun S.", city: "Bangalore", saved: 1840, badge: "🏆", streak: 42, color: "#FFD700" },
  { rank: 2, name: "Priya M.", city: "Mumbai", saved: 1620, badge: "🥈", streak: 38, color: "#C0C0C0" },
  { rank: 3, name: "Rohan K.", city: "Delhi", saved: 1480, badge: "🥉", streak: 31, color: "#CD7F32" },
  { rank: 4, name: "Sneha P.", city: "Pune", saved: 1350, badge: "🌱", streak: 27 },
  { rank: 5, name: "Dev T.", city: "Chennai", saved: 1290, badge: "⚡", streak: 24 },
  { rank: 6, name: "Kavya R.", city: "Hyderabad", saved: 1150, badge: "🌿", streak: 19 },
  { rank: 7, name: "You", city: "Your City", saved: 980, badge: "🎯", streak: 12, isYou: true },
];

const CHALLENGES = [
  {
    id: 1, title: "Team Zero — June Challenge", icon: "🌍", color: "#52B788",
    desc: "Reduce your transport emissions by 20% this month",
    participants: 847, target: 1000, daysLeft: 22, joined: false,
  },
  {
    id: 2, title: "Plant-Based Week", icon: "🥗", color: "#40916C",
    desc: "Go vegetarian for 7 consecutive days",
    participants: 1203, target: 1500, daysLeft: 5, joined: true,
  },
  {
    id: 3, title: "No-Car November", icon: "🚶", color: "#74C0FC",
    desc: "Avoid car trips entirely for one month",
    participants: 432, target: 1000, daysLeft: 30, joined: false,
  },
  {
    id: 4, title: "Energy Saver Sprint", icon: "⚡", color: "#F4A261",
    desc: "Cut home energy usage by 15% this week",
    participants: 689, target: 1000, daysLeft: 3, joined: false,
  },
];

const BADGES = [
  { name: "First Step", icon: "🌱", desc: "Calculated first footprint", earned: true },
  { name: "Logger", icon: "📋", desc: "Logged 7 days in a row", earned: true },
  { name: "Eco Warrior", icon: "⚔️", desc: "Saved 500 kg CO₂e", earned: false },
  { name: "Challenge Accepted", icon: "🎯", desc: "Joined 3 challenges", earned: false },
  { name: "Streak Master", icon: "🔥", desc: "30-day logging streak", earned: false },
  { name: "Green Champion", icon: "🏆", desc: "Top 10 leaderboard", earned: false },
];

export default function CommunityPage() {
  const [tab, setTab] = useState<"leaderboard" | "challenges" | "badges">("leaderboard");
  const [joined, setJoined] = useState<Set<number>>(new Set([2]));

  const tabs = [
    { id: "leaderboard", label: "Leaderboard", icon: Trophy },
    { id: "challenges", label: "Challenges", icon: Target },
    { id: "badges", label: "My Badges", icon: Star },
  ] as const;

  const top3 = [LEADERBOARD[1], LEADERBOARD[0], LEADERBOARD[2]]; // Silver, Gold, Bronze order
  const restOfBoard = LEADERBOARD.slice(3);

  return (
    <ProtectedRoute>
      <div className="min-h-screen pt-24 pb-20 px-4 relative bg-[#0D1117]">
        {/* Glow Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-[500px] rounded-full blur-[150px] pointer-events-none opacity-20" style={{ background: "linear-gradient(to right, #52B788, #74C0FC)" }} />

        <div className="relative z-10 max-w-4xl mx-auto space-y-10">
          
          {/* Header & Global Stats */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
            <div className="text-center md:text-left">
              <h1 className="font-display text-4xl sm:text-5xl font-black text-white mb-2 tracking-tight">Community</h1>
              <p className="text-base text-white/50">Compete, collaborate, and celebrate sustainability.</p>
            </div>
            
            <div className="flex gap-4 p-4 rounded-3xl bg-[#161B22]/60 backdrop-blur-md border border-white/10">
              <div className="text-center px-4 border-r border-white/10">
                <Users className="w-4 h-4 mx-auto mb-1 text-[#52B788]" />
                <p className="font-display font-bold text-white text-lg">12.8k</p>
                <p className="text-[10px] uppercase tracking-wider text-white/40">Members</p>
              </div>
              <div className="text-center px-4 border-r border-white/10">
                <Globe className="w-4 h-4 mx-auto mb-1 text-[#74C0FC]" />
                <p className="font-display font-bold text-white text-lg">94</p>
                <p className="text-[10px] uppercase tracking-wider text-white/40">Cities</p>
              </div>
              <div className="text-center px-4">
                <Zap className="w-4 h-4 mx-auto mb-1 text-[#F4A261]" />
                <p className="font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#F4A261] to-[#E63946] text-lg">2.4M</p>
                <p className="text-[10px] uppercase tracking-wider text-white/40">kg Saved</p>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2 p-1.5 rounded-2xl bg-[#161B22]/80 backdrop-blur-md border border-white/10 max-w-lg mx-auto">
            {tabs.map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id as typeof tab)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold transition-all relative overflow-hidden"
                style={{
                  color: tab === t.id ? "#fff" : "rgba(240,246,252,0.4)",
                }}
              >
                {tab === t.id && (
                  <motion.div layoutId="community-tab-indicator" className="absolute inset-0 rounded-xl bg-white/10 border border-white/20 shadow-lg" />
                )}
                <t.icon className={`w-4 h-4 relative z-10 ${tab === t.id ? "text-[#52B788]" : ""}`} />
                <span className="relative z-10 hidden sm:inline">{t.label}</span>
              </button>
            ))}
          </div>

          {/* Leaderboard View */}
          {tab === "leaderboard" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              
              {/* Top 3 Podium */}
              <div className="flex items-end justify-center gap-2 sm:gap-6 pt-10 pb-6">
                {top3.map((user, i) => {
                  const isGold = user.rank === 1;
                  const height = isGold ? "h-48" : user.rank === 2 ? "h-36" : "h-28";
                  return (
                    <motion.div 
                      key={user.rank} initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1, type: "spring", stiffness: 100 }}
                      className="flex flex-col items-center w-28 sm:w-36"
                    >
                      <div className="text-center mb-3">
                        <div className="text-3xl mb-1 filter drop-shadow-[0_0_10px_currentColor]" style={{ color: user.color }}>{user.badge}</div>
                        <p className="font-bold text-white text-sm">{user.name}</p>
                        <p className="text-xs text-white/50">{user.saved} kg</p>
                      </div>
                      <div 
                        className={`w-full rounded-t-2xl flex items-start justify-center pt-4 relative overflow-hidden ${height}`}
                        style={{ 
                          background: `linear-gradient(to bottom, ${user.color}40, rgba(22,27,34,0.8))`,
                          borderTop: `2px solid ${user.color}`, borderLeft: `1px solid ${user.color}40`, borderRight: `1px solid ${user.color}40`
                        }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
                        <span className="font-display font-black text-3xl opacity-50" style={{ color: user.color }}>{user.rank}</span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Rest of Leaderboard */}
              <div className="space-y-3 bg-[#161B22]/40 p-4 rounded-3xl border border-white/5">
                {restOfBoard.map((user, i) => (
                  <motion.div
                    key={user.rank} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.05 }}
                    className="flex items-center gap-4 p-4 rounded-2xl transition-all hover:bg-white/5 group"
                    style={{
                      background: user.isYou ? "linear-gradient(to right, rgba(82,183,136,0.1), rgba(22,27,34,0))" : "transparent",
                      border: user.isYou ? "1px solid rgba(82,183,136,0.3)" : "1px solid transparent",
                    }}
                  >
                    <span className="font-display font-black text-xl w-8 text-center text-white/30 group-hover:text-white/60 transition-colors">#{user.rank}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="font-bold text-white text-base">{user.name}</p>
                        {user.isYou && <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider bg-[#52B788]/20 text-[#52B788] border border-[#52B788]/30">You</span>}
                      </div>
                      <p className="text-xs text-white/40 flex items-center gap-2">
                        <span>📍 {user.city}</span> <span>🔥 {user.streak} day streak</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-display font-black text-lg text-[#52B788]">{user.saved.toLocaleString()}</p>
                      <p className="text-[10px] uppercase tracking-wider text-white/30">kg saved</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Challenges View */}
          {tab === "challenges" && (
            <div className="grid sm:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {CHALLENGES.map((c, i) => {
                const isJoined = joined.has(c.id);
                const progressPct = Math.min((c.participants / c.target) * 100, 100);
                
                return (
                  <motion.div 
                    key={c.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                    className="p-6 rounded-3xl relative overflow-hidden group" 
                    style={{ 
                      background: isJoined ? "rgba(22,27,34,0.8)" : "rgba(22,27,34,0.4)",
                      border: `1px solid ${isJoined ? c.color : 'rgba(255,255,255,0.1)'}`,
                      boxShadow: isJoined ? `0 10px 30px ${c.color}15` : "none"
                    }}
                  >
                    {/* Top Right Glow if joined */}
                    {isJoined && <div className="absolute top-0 right-0 w-32 h-32 blur-[60px] rounded-full pointer-events-none" style={{ background: c.color, opacity: 0.2 }} />}
                    
                    <div className="flex justify-between items-start mb-4 relative z-10">
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-inner" style={{ background: `${c.color}15`, border: `1px solid ${c.color}30` }}>
                        {c.icon}
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold px-3 py-1 rounded-full border bg-black/40 text-white/70 border-white/10 flex items-center gap-1">
                          <Target className="w-3 h-3" /> {c.daysLeft} days left
                        </span>
                      </div>
                    </div>
                    
                    <h3 className="font-display font-bold text-white text-xl mb-2 relative z-10">{c.title}</h3>
                    <p className="text-sm text-white/60 mb-6 relative z-10 line-clamp-2">{c.desc}</p>
                    
                    {/* Progress Bar */}
                    <div className="mb-6 relative z-10">
                      <div className="flex justify-between text-xs font-medium mb-2 text-white/50">
                        <span>{c.participants.toLocaleString()} joined</span>
                        <span>Goal: {c.target}</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-black/40 overflow-hidden border border-white/5">
                        <motion.div 
                          className="h-full rounded-full relative" 
                          style={{ background: c.color }}
                          initial={{ width: 0 }} animate={{ width: `${progressPct}%` }} transition={{ duration: 1, ease: "easeOut" }}
                        >
                          <div className="absolute inset-0 bg-white/20 w-full" style={{ animation: "shimmer 2s infinite" }} />
                        </motion.div>
                      </div>
                    </div>

                    <Button
                      onClick={() => {
                        const next = new Set(joined);
                        isJoined ? next.delete(c.id) : next.add(c.id);
                        setJoined(next);
                      }}
                      className="w-full rounded-xl h-12 font-bold transition-all hover:scale-[1.02] relative z-10"
                      style={isJoined ? {
                        background: "transparent", border: `1px solid ${c.color}50`, color: c.color,
                      } : {
                        background: c.color, color: "#000",
                      }}
                    >
                      {isJoined ? <><CheckCircle2 className="w-5 h-5 mr-2" /> Joined Challenge</> : "Join Challenge"}
                    </Button>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Badges View */}
          {tab === "badges" && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 animate-in fade-in zoom-in-95 duration-500">
              {BADGES.map((badge, i) => (
                <motion.div 
                  key={badge.name} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
                  className="group relative p-6 rounded-3xl text-center flex flex-col items-center justify-center min-h-[200px]"
                  style={{
                    background: badge.earned ? "rgba(22,27,34,0.8)" : "rgba(22,27,34,0.3)",
                    border: badge.earned ? "1px solid rgba(82,183,136,0.4)" : "1px dashed rgba(255,255,255,0.1)",
                    boxShadow: badge.earned ? "inset 0 0 40px rgba(82,183,136,0.05), 0 10px 30px rgba(0,0,0,0.2)" : "none",
                  }}
                >
                  {badge.earned && (
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl pointer-events-none" 
                         style={{ background: "radial-gradient(circle at center, rgba(82,183,136,0.15) 0%, transparent 70%)" }} />
                  )}
                  
                  <div className={`text-6xl mb-4 transition-transform duration-500 ${badge.earned ? "group-hover:scale-110 group-hover:-rotate-12 filter drop-shadow-[0_10px_20px_rgba(82,183,136,0.4)]" : "grayscale opacity-20"}`}>
                    {badge.icon}
                  </div>
                  
                  <h3 className={`font-display font-bold text-lg mb-1 ${badge.earned ? "text-white" : "text-white/40"}`}>{badge.name}</h3>
                  <p className="text-xs text-white/50 mb-3 px-2">{badge.desc}</p>
                  
                  {badge.earned ? (
                    <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#52B788]/20 text-[#52B788] flex items-center gap-1 border border-[#52B788]/30">
                      <Star className="w-3 h-3 fill-current" /> Earned
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-white/5 text-white/30 flex items-center gap-1 border border-white/10">
                      Locked
                    </span>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}

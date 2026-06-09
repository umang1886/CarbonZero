"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useFootprintStore } from "@/store/footprintStore";
import { Car, Utensils, Home, Bike, Zap, Plus, CheckCircle2, Loader2, Leaf, Clock, X } from "lucide-react";

const QUICK_ACTIONS = [
  { id: "car_trip", label: "Car Trip", icon: Car, color: "#52B788", unit: "km", factor: 0.21, cat: "transport", max: 200, step: 1 },
  { id: "bus_ride", label: "Bus Ride", icon: Bike, color: "#74C0FC", unit: "km", factor: 0.089, cat: "transport", max: 100, step: 1 },
  { id: "meal", label: "Meat Meal", icon: Utensils, color: "#F4A261", unit: "meal", factor: 2.5, cat: "diet", max: 5, step: 1 },
  { id: "electricity", label: "Electricity", icon: Zap, color: "#E63946", unit: "kWh", factor: 0.82, cat: "energy", max: 50, step: 1 },
  { id: "veg_meal", label: "Veg Meal", icon: Leaf, color: "#40916C", unit: "meal", factor: 0.7, cat: "diet", max: 5, step: 1 },
  { id: "home_energy", label: "Home Energy", icon: Home, color: "#6B4226", unit: "kWh", factor: 0.82, cat: "energy", max: 50, step: 1 },
];

interface LogEntry { id: string; label: string; value: number; unit: string; kg: number; cat: string; time: string; color: string; }

export default function LogPage() {
  const [selected, setSelected] = useState<typeof QUICK_ACTIONS[0] | null>(null);
  const [value, setValue] = useState(1);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [logging, setLogging] = useState(false);
  const [success, setSuccess] = useState(false);
  const addActivity = useFootprintStore(s => s.addActivity);

  const handleLog = async () => {
    if (!selected) return;
    setLogging(true);
    await new Promise(r => setTimeout(r, 600));
    const entry: LogEntry = {
      id: Date.now().toString(),
      label: selected.label,
      value: value,
      unit: selected.unit,
      kg: Math.round(value * selected.factor * 100) / 100,
      cat: selected.cat,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      color: selected.color,
    };
    setLogs(l => [entry, ...l]);
    addActivity(entry);
    setLogging(false);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setSelected(null);
      setValue(1);
    }, 1500);
  };

  const todayTotal = logs.reduce((s, l) => s + l.kg, 0);
  const dailyBudget = 10; // e.g., 10 kg CO2e per day
  const progressPct = Math.min((todayTotal / dailyBudget) * 100, 100);

  return (
    <ProtectedRoute>
      <div className="min-h-screen pt-24 pb-20 px-4 relative" style={{ background: "#0D1117" }}>
        {/* Background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-96 rounded-full blur-[120px] pointer-events-none opacity-20" style={{ background: "linear-gradient(to bottom, #2D6A4F, transparent)" }} />

        <div className="relative z-10 max-w-3xl mx-auto space-y-8">
          <div className="text-center mb-10">
            <h1 className="font-display text-4xl font-black text-white mb-2">Log Activity</h1>
            <p className="text-sm" style={{ color: "rgba(240,246,252,0.5)" }}>Track your daily emissions instantly.</p>
          </div>

          {/* Daily Progress Ring & Stats */}
          <div className="p-6 sm:p-8 rounded-3xl flex flex-col sm:flex-row items-center gap-8" style={{ background: "rgba(22,27,34,0.6)", backdropFilter: "blur(20px)", border: "1px solid rgba(82,183,136,0.2)", boxShadow: "0 20px 40px rgba(0,0,0,0.3)" }}>
            
            {/* SVG Circular Progress */}
            <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" strokeLinecap="round" />
                <motion.circle 
                  cx="50" cy="50" r="40" fill="none" stroke="#52B788" strokeWidth="8" strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  initial={{ strokeDashoffset: 2 * Math.PI * 40 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 40 * (1 - progressPct / 100) }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="font-display text-3xl font-black text-white leading-none">{todayTotal.toFixed(1)}</span>
                <span className="text-[10px] font-bold uppercase tracking-wider mt-1" style={{ color: "#52B788" }}>kg CO₂e</span>
              </div>
            </div>

            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-sm font-bold uppercase tracking-wider mb-1" style={{ color: "rgba(240,246,252,0.5)" }}>Today's Impact</h2>
              <p className="text-base text-white/80 leading-relaxed mb-4">
                You've used <strong className="text-white">{progressPct.toFixed(0)}%</strong> of your suggested daily carbon budget ({dailyBudget} kg).
              </p>
              <div className="flex flex-wrap justify-center sm:justify-start gap-4">
                <div className="bg-black/20 rounded-xl px-4 py-2 border border-white/5">
                  <p className="text-xs text-white/40 mb-0.5">Entries Logged</p>
                  <p className="font-display text-xl font-bold text-white">{logs.length}</p>
                </div>
                <div className="bg-black/20 rounded-xl px-4 py-2 border border-white/5">
                  <p className="text-xs text-white/40 mb-0.5">Status</p>
                  <p className="font-display text-xl font-bold" style={{ color: progressPct > 100 ? "#E63946" : "#52B788" }}>
                    {progressPct > 100 ? "Over Limit" : "On Track"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions Grid */}
          <div>
            <h2 className="font-display font-bold text-white mb-4 text-lg">What did you do?</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {QUICK_ACTIONS.map(action => {
                const isSelected = selected?.id === action.id;
                return (
                  <button
                    key={action.id}
                    onClick={() => { setSelected(isSelected ? null : action); setValue(1); }}
                    className={`p-4 rounded-2xl text-left transition-all duration-300 relative overflow-hidden group hover:scale-[1.02]`}
                    style={{
                      background: isSelected ? `linear-gradient(135deg, ${action.color}20, ${action.color}05)` : "rgba(255,255,255,0.02)",
                      border: isSelected ? `1px solid ${action.color}50` : "1px solid rgba(255,255,255,0.05)",
                      boxShadow: isSelected ? `0 10px 30px ${action.color}15` : "none"
                    }}
                  >
                    {/* Hover Glow */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity" style={{ background: action.color }} />
                    
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110" style={{ background: `${action.color}20`, border: `1px solid ${action.color}40` }}>
                      <action.icon className="w-5 h-5" style={{ color: action.color }} />
                    </div>
                    <p className="text-sm font-bold text-white mb-1">{action.label}</p>
                    <p className="text-xs" style={{ color: "rgba(240,246,252,0.4)" }}>{action.factor} kg / {action.unit}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive Input Slider Overlay */}
          <AnimatePresence>
            {selected && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                className="p-6 rounded-3xl relative overflow-hidden" 
                style={{ background: "#161B22", border: `1px solid ${selected.color}40`, boxShadow: `0 20px 40px ${selected.color}15` }}
              >
                <div className="absolute top-0 left-0 w-full h-1" style={{ background: `linear-gradient(90deg, ${selected.color}00, ${selected.color}, ${selected.color}00)` }} />
                
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${selected.color}20` }}>
                      <selected.icon className="w-5 h-5" style={{ color: selected.color }} />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-white text-lg">{selected.label}</h3>
                      <p className="text-xs text-white/50">Adjust the {selected.unit} amount</p>
                    </div>
                  </div>
                  <button onClick={() => setSelected(null)} className="p-2 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="bg-black/30 p-5 rounded-2xl mb-6 border border-white/5">
                  <div className="flex justify-between items-end mb-4">
                    <span className="font-display text-4xl font-black text-white">{value} <span className="text-lg text-white/40">{selected.unit}</span></span>
                    <div className="text-right">
                      <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Estimated CO₂e</p>
                      <p className="font-display text-2xl font-bold" style={{ color: selected.color }}>
                        {(value * selected.factor).toFixed(2)} kg
                      </p>
                    </div>
                  </div>
                  <input
                    type="range" min={selected.step} max={selected.max} step={selected.step} value={value}
                    onChange={e => setValue(Number(e.target.value))}
                    className="w-full h-2 rounded-lg appearance-none cursor-pointer focus:outline-none"
                    style={{ background: `linear-gradient(to right, ${selected.color} ${(value / selected.max) * 100}%, rgba(255,255,255,0.1) ${(value / selected.max) * 100}%)` }}
                  />
                  <style jsx>{`
                    input[type=range]::-webkit-slider-thumb {
                      -webkit-appearance: none; appearance: none;
                      width: 20px; height: 20px; border-radius: 50%;
                      background: #fff; border: 2px solid ${selected.color};
                      cursor: pointer; box-shadow: 0 0 15px ${selected.color}60;
                    }
                  `}</style>
                </div>

                <Button 
                  onClick={handleLog} disabled={logging || success} 
                  className="w-full h-12 rounded-xl text-white font-bold text-base transition-all hover:scale-[1.02]"
                  style={{ background: success ? "#52B788" : `linear-gradient(135deg, ${selected.color}, ${selected.color}dd)` }}
                >
                  {logging ? <Loader2 className="w-5 h-5 animate-spin" /> : success ? <><CheckCircle2 className="w-5 h-5 mr-2" /> Logged Successfully!</> : <><Plus className="w-5 h-5 mr-2" /> Log Activity</>}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Activity Feed Timeline */}
          <div>
            <h2 className="font-display font-bold text-white mb-6 text-lg flex items-center gap-2">
              <Clock className="w-5 h-5 text-white/50" /> Today's Timeline
            </h2>
            {logs.length > 0 ? (
              <div className="space-y-4 pl-2 relative">
                {/* Timeline vertical line */}
                <div className="absolute left-6 top-4 bottom-4 w-px bg-white/10" />

                <AnimatePresence>
                  {logs.map((log, i) => (
                    <motion.div 
                      key={log.id} initial={{ opacity: 0, x: -20, height: 0 }} animate={{ opacity: 1, x: 0, height: "auto" }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.3 }}
                      className="relative pl-12"
                    >
                      <div className="absolute left-[7px] top-4 w-3 h-3 rounded-full border-2 border-[#0D1117] shadow-[0_0_10px_currentColor]" style={{ background: log.color, color: log.color }} />
                      
                      <div className="p-4 rounded-2xl bg-[#161B22]/80 backdrop-blur-sm border border-white/5 flex items-center gap-4 hover:bg-[#161B22] transition-colors">
                        <div className="flex-1">
                          <p className="text-base font-bold text-white mb-0.5">{log.label}</p>
                          <p className="text-xs text-white/40">{log.value} {log.unit} • {log.time}</p>
                        </div>
                        <div className="text-right px-3 py-1.5 rounded-lg bg-black/20 border border-white/5">
                          <span className="font-display font-black text-sm" style={{ color: log.color }}>+{log.kg} kg</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="text-center py-16 rounded-3xl bg-[#161B22]/50 border border-white/5 border-dashed">
                <Leaf className="w-12 h-12 mx-auto mb-4 text-white/20" />
                <p className="text-white/60 font-medium">Your timeline is empty</p>
                <p className="text-sm text-white/40 mt-1">Select an activity above to start tracking</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

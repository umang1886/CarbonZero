"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useFootprintStore } from "@/store/footprintStore";
import { useAuthStore } from "@/store/authStore";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Leaf, Car, Utensils, Home, ShoppingBag, CheckCircle2, ArrowLeft, ArrowRight, Loader2, Minus, Plus } from "lucide-react";

/* ── Emission factor calculations (IPCC-validated) ── */
function calculateFootprint(data: FormData) {
  const t = data.transport;
  const transport =
    t.carPetrolKmWeek * 52 * 0.21 +
    t.carElectricKmWeek * 52 * 0.07 +
    t.flightsPerYear * 1800 * 0.255 +
    t.busKmWeek * 52 * 0.089 +
    t.trainKmWeek * 52 * 0.035;

  const dietMap: Record<string, number> = { vegan: 1500, vegetarian: 1700, omnivore: 2500, heavy_meat: 3300 };
  const diet = dietMap[data.dietType] ?? 2500;

  const energy =
    data.energy.electricityKwhMonth * 12 * 0.82 +
    data.energy.naturalGasM3Month * 12 * 2.04;

  const shopping =
    data.shopping.clothingItemsYear * 12.0 +
    data.shopping.electronicsPerYear * 70;

  const total = transport + diet + energy + shopping;
  return {
    total_kg_co2e: Math.round(total),
    breakdown: {
      transport: Math.round(transport),
      diet: Math.round(diet),
      energy: Math.round(energy),
      shopping: Math.round(shopping),
    },
    comparison: { india_avg: 1900, global_avg: 4800, paris_target: 2000 },
  };
}

interface FormData {
  transport: { carPetrolKmWeek: number; carElectricKmWeek: number; flightsPerYear: number; busKmWeek: number; trainKmWeek: number };
  dietType: string;
  energy: { electricityKwhMonth: number; naturalGasM3Month: number };
  shopping: { clothingItemsYear: number; electronicsPerYear: number };
}

const defaultData: FormData = {
  transport: { carPetrolKmWeek: 100, carElectricKmWeek: 0, flightsPerYear: 2, busKmWeek: 0, trainKmWeek: 0 },
  dietType: "omnivore",
  energy: { electricityKwhMonth: 200, naturalGasM3Month: 0 },
  shopping: { clothingItemsYear: 10, electronicsPerYear: 1 },
};

const steps = [
  { id: 1, label: "Transport", icon: Car, color: "#52B788" },
  { id: 2, label: "Diet", icon: Utensils, color: "#74C0FC" },
  { id: 3, label: "Energy", icon: Home, color: "#F4A261" },
  { id: 4, label: "Shopping", icon: ShoppingBag, color: "#E63946" },
];

function SliderInput({ label, value, min = 0, max, unit, onChange, color }: any) {
  return (
    <div className="space-y-3 p-4 rounded-2xl transition-all" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
      <div className="flex justify-between items-end">
        <Label className="text-sm font-medium" style={{ color: "rgba(240,246,252,0.8)" }}>{label}</Label>
        <div className="text-right">
          <span className="font-display text-xl font-bold text-white">{value}</span>
          <span className="text-xs ml-1" style={{ color: "rgba(240,246,252,0.4)" }}>{unit}</span>
        </div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 rounded-lg appearance-none cursor-pointer focus:outline-none"
        style={{
          background: `linear-gradient(to right, ${color} ${(value / max) * 100}%, rgba(255,255,255,0.1) ${(value / max) * 100}%)`,
        }}
      />
      <style jsx>{`
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #fff;
          border: 2px solid ${color};
          cursor: pointer;
          box-shadow: 0 0 10px ${color}80;
        }
      `}</style>
    </div>
  );
}

function StepperInput({ label, value, min = 0, max = 999, unit, onChange, color }: any) {
  return (
    <div className="flex items-center justify-between p-4 rounded-2xl transition-all" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
      <div>
        <Label className="text-sm font-medium" style={{ color: "rgba(240,246,252,0.8)" }}>{label}</Label>
        <div className="text-xs mt-0.5" style={{ color: "rgba(240,246,252,0.4)" }}>{unit}</div>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={() => onChange(Math.max(min, value - 1))}
          className="w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-white/10"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
        >
          <Minus className="w-4 h-4 text-white" />
        </button>
        <span className="font-display text-xl font-bold text-white w-10 text-center">{value}</span>
        <button
          onClick={() => onChange(Math.min(max, value + 1))}
          className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
          style={{ background: `${color}20`, border: `1px solid ${color}50` }}
        >
          <Plus className="w-4 h-4 text-white" />
        </button>
      </div>
    </div>
  );
}

function SummaryPanel({ data }: { data: FormData }) {
  const result = calculateFootprint(data);
  const total = result.total_kg_co2e;
  const bd = result.breakdown;

  return (
    <div className="sticky top-24 p-8 rounded-3xl" style={{ background: "linear-gradient(145deg, rgba(22,27,34,0.8), rgba(13,17,23,0.9))", backdropFilter: "blur(20px)", border: "1px solid rgba(82,183,136,0.15)", boxShadow: "0 20px 40px rgba(0,0,0,0.4)" }}>
      <div className="flex items-center gap-2 mb-8">
        <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "rgba(82,183,136,0.15)" }}>
          <Leaf className="w-4 h-4 text-[#52B788]" />
        </div>
        <h3 className="font-display font-bold text-white text-lg">Live Estimation</h3>
      </div>
      
      <div className="mb-10">
        <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "rgba(240,246,252,0.4)" }}>Annual Footprint</p>
        <div className="flex items-baseline gap-2">
          <motion.span 
            key={total}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="font-display text-6xl font-black text-transparent bg-clip-text"
            style={{ backgroundImage: "linear-gradient(135deg, #52B788, #74C0FC)" }}
          >
            {total.toLocaleString()}
          </motion.span>
          <span className="text-sm font-medium" style={{ color: "rgba(240,246,252,0.5)" }}>kg CO₂e</span>
        </div>
      </div>

      <div className="space-y-5">
        <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "rgba(240,246,252,0.4)" }}>Breakdown</p>
        {steps.map(s => {
          const val = bd[s.label.toLowerCase() as keyof typeof bd] || 0;
          const pct = total > 0 ? (val / total) * 100 : 0;
          return (
            <div key={s.id} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="flex items-center gap-2 text-white font-medium">
                  <s.icon className="w-4 h-4" style={{ color: s.color }}/> {s.label}
                </span>
                <span className="font-bold" style={{ color: s.color }}>{val.toLocaleString()} <span className="text-xs font-normal opacity-70">kg</span></span>
              </div>
              <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                <motion.div 
                  className="h-full rounded-full"
                  style={{ background: `linear-gradient(90deg, ${s.color}80, ${s.color})` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ type: "spring", stiffness: 100 }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function CalculatorPage() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<FormData>(defaultData);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const setFootprint = useFootprintStore(s => s.setFootprint);
  const { user } = useAuthStore();

  const updateTransport = (key: keyof typeof data.transport, val: number) =>
    setData(d => ({ ...d, transport: { ...d.transport, [key]: val } }));
  const updateEnergy = (key: keyof typeof data.energy, val: number) =>
    setData(d => ({ ...d, energy: { ...d.energy, [key]: val } }));
  const updateShopping = (key: keyof typeof data.shopping, val: number) =>
    setData(d => ({ ...d, shopping: { ...d.shopping, [key]: val } }));

  const handleCalculate = async () => {
    setLoading(true);
    try {
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (user) {
        const token = await user.getIdToken();
        headers["Authorization"] = `Bearer ${token}`;
      }

      const res = await fetch("http://localhost:5000/api/v1/footprint/calculate", {
        method: "POST",
        headers,
        body: JSON.stringify(data),
      }).catch(() => null);
      
      const result = res?.ok ? await res.json() : calculateFootprint(data);
      setFootprint(result);
      router.push("/dashboard");
    } catch {
      setFootprint(calculateFootprint(data));
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const currentStep = steps[step - 1];

  return (
    <ProtectedRoute>
      <div className="min-h-screen pt-24 px-4 pb-12 relative" style={{ background: "#0D1117" }}>
        {/* Decorative Background Orbs */}
        <div className="absolute top-20 left-10 w-96 h-96 rounded-full blur-[120px] pointer-events-none opacity-20" style={{ background: "#2D6A4F" }} />
        <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full blur-[120px] pointer-events-none opacity-10" style={{ background: "#74C0FC" }} />

        <div className="relative z-10 max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-10">
            <h1 className="font-display text-4xl sm:text-5xl font-black text-white mb-3 tracking-tight">Your Carbon Profile</h1>
            <p className="text-base" style={{ color: "rgba(240,246,252,0.6)" }}>Adjust the dials below to calculate your annual environmental impact.</p>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
            
            {/* Left Column: Form */}
            <div className="lg:col-span-7 xl:col-span-8">
              
              {/* Step Navigation Bar */}
              <div className="flex items-center gap-2 mb-8 bg-black/20 p-2 rounded-2xl border border-white/5 backdrop-blur-sm">
                {steps.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => s.id < step && setStep(s.id)}
                    disabled={s.id > step}
                    className={`flex items-center justify-center sm:justify-start gap-2 flex-1 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${step === s.id ? "text-white shadow-lg" : s.id < step ? "text-white/70 hover:bg-white/5" : "text-white/30"}`}
                    style={{ 
                      background: step === s.id ? `linear-gradient(135deg, ${s.color}20, ${s.color}40)` : "transparent", 
                      border: step === s.id ? `1px solid ${s.color}50` : "1px solid transparent",
                    }}
                  >
                    {step > s.id ? <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: s.color }} /> : <s.icon className="w-4 h-4 shrink-0" />}
                    <span className="hidden sm:inline">{s.label}</span>
                  </button>
                ))}
              </div>

              {/* Form Card */}
              <div className="rounded-3xl p-6 sm:p-8 relative overflow-hidden" style={{ background: "rgba(22,27,34,0.6)", backdropFilter: "blur(12px)", border: `1px solid ${currentStep.color}30`, boxShadow: `0 0 40px ${currentStep.color}10` }}>
                
                {/* Accent glow line at top */}
                <div className="absolute top-0 left-0 w-full h-1" style={{ background: `linear-gradient(90deg, transparent, ${currentStep.color}, transparent)` }} />

                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner" style={{ background: `linear-gradient(135deg, ${currentStep.color}30, ${currentStep.color}10)`, border: `1px solid ${currentStep.color}40` }}>
                    <currentStep.icon className="w-6 h-6" style={{ color: currentStep.color }} />
                  </div>
                  <div>
                    <h2 className="font-display text-2xl font-bold text-white">{currentStep.label}</h2>
                    <p className="text-sm" style={{ color: "rgba(240,246,252,0.5)" }}>Step {step} of {steps.length}</p>
                  </div>
                </div>

                <div className="min-h-[320px]">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={step}
                      initial={{ opacity: 0, x: 15 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -15 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="space-y-6"
                    >
                      {step === 1 && (
                        <>
                          <SliderInput color={currentStep.color} label="Car (petrol/diesel) travel" value={data.transport.carPetrolKmWeek} max={1000} unit="km/week" onChange={(v: number) => updateTransport("carPetrolKmWeek", v)} />
                          <SliderInput color={currentStep.color} label="Car (electric) travel" value={data.transport.carElectricKmWeek} max={1000} unit="km/week" onChange={(v: number) => updateTransport("carElectricKmWeek", v)} />
                          <StepperInput color={currentStep.color} label="Flights per year" value={data.transport.flightsPerYear} max={20} unit="round trips" onChange={(v: number) => updateTransport("flightsPerYear", v)} />
                          <div className="grid sm:grid-cols-2 gap-6">
                            <SliderInput color={currentStep.color} label="Bus travel" value={data.transport.busKmWeek} max={500} unit="km/week" onChange={(v: number) => updateTransport("busKmWeek", v)} />
                            <SliderInput color={currentStep.color} label="Train travel" value={data.transport.trainKmWeek} max={500} unit="km/week" onChange={(v: number) => updateTransport("trainKmWeek", v)} />
                          </div>
                        </>
                      )}
                      {step === 2 && (
                        <div className="space-y-4">
                          <Label className="text-base font-medium block mb-2" style={{ color: "rgba(240,246,252,0.9)" }}>What best describes your typical diet?</Label>
                          <div className="grid sm:grid-cols-2 gap-4">
                            {[
                              { value: "vegan", label: "Vegan", desc: "No animal products", color: "#52B788" },
                              { value: "vegetarian", label: "Vegetarian", desc: "No meat, but dairy/eggs", color: "#74C0FC" },
                              { value: "omnivore", label: "Omnivore", desc: "Average meat & plant mix", color: "#F4A261" },
                              { value: "heavy_meat", label: "Heavy Meat", desc: "Meat with most meals", color: "#E63946" },
                            ].map(opt => (
                              <button
                                key={opt.value}
                                onClick={() => setData(d => ({ ...d, dietType: opt.value }))}
                                className={`w-full flex flex-col items-start p-5 rounded-2xl transition-all duration-200 hover:scale-[1.02]`}
                                style={{
                                  background: data.dietType === opt.value ? `linear-gradient(135deg, ${opt.color}15, ${opt.color}05)` : "rgba(255,255,255,0.02)",
                                  border: data.dietType === opt.value ? `1px solid ${opt.color}60` : "1px solid rgba(255,255,255,0.05)",
                                  boxShadow: data.dietType === opt.value ? `0 10px 20px ${opt.color}10` : "none"
                                }}
                              >
                                <div className="flex items-center gap-3 mb-2">
                                  <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-colors"
                                    style={{ border: `2px solid ${data.dietType === opt.value ? opt.color : "rgba(255,255,255,0.2)"}` }}>
                                    {data.dietType === opt.value && <motion.div layoutId="diet-dot" className="w-2.5 h-2.5 rounded-full" style={{ background: opt.color }} />}
                                  </div>
                                  <span className="font-display font-bold text-lg text-white">{opt.label}</span>
                                </div>
                                <span className="text-sm ml-8" style={{ color: "rgba(240,246,252,0.5)" }}>{opt.desc}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                      {step === 3 && (
                        <div className="space-y-6">
                          <SliderInput color={currentStep.color} label="Monthly electricity usage" value={data.energy.electricityKwhMonth} max={1500} unit="kWh/mo" onChange={(v: number) => updateEnergy("electricityKwhMonth", v)} />
                          <SliderInput color={currentStep.color} label="Monthly natural gas usage" value={data.energy.naturalGasM3Month} max={300} unit="m³/mo" onChange={(v: number) => updateEnergy("naturalGasM3Month", v)} />
                          <div className="p-4 rounded-2xl text-sm flex items-start gap-3" style={{ background: "rgba(116,192,252,0.06)", border: "1px solid rgba(116,192,252,0.15)", color: "rgba(116,192,252,0.8)" }}>
                            <span className="text-xl">💡</span>
                            <p>India's grid emission factor is approximately 0.82 kg CO₂e per kWh. You can check your recent electricity bill to find your exact monthly usage.</p>
                          </div>
                        </div>
                      )}
                      {step === 4 && (
                        <div className="space-y-6">
                          <StepperInput color={currentStep.color} label="Clothing items bought per year" value={data.shopping.clothingItemsYear} max={100} unit="items" onChange={(v: number) => updateShopping("clothingItemsYear", v)} />
                          <StepperInput color={currentStep.color} label="Electronic devices bought per year" value={data.shopping.electronicsPerYear} max={20} unit="devices" onChange={(v: number) => updateShopping("electronicsPerYear", v)} />
                          
                          <div className="p-6 rounded-2xl text-center mt-4" style={{ background: "linear-gradient(135deg, rgba(82,183,136,0.1), rgba(64,145,108,0.1))", border: "1px dashed rgba(82,183,136,0.3)" }}>
                            <Leaf className="w-8 h-8 mx-auto mb-3 text-[#52B788]" />
                            <h3 className="text-white font-medium mb-1">Ready to see your dashboard?</h3>
                            <p className="text-sm mb-4" style={{ color: "rgba(240,246,252,0.6)" }}>Your complete profile will be saved and benchmarked against global goals.</p>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Footer Navigation */}
                <div className="flex justify-between items-center mt-10 pt-6" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                  <Button
                    variant="ghost"
                    onClick={() => setStep(s => s - 1)}
                    disabled={step === 1}
                    className="rounded-xl gap-2 hover:bg-white/5 disabled:opacity-0 transition-all text-white/70 hover:text-white"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back
                  </Button>
                  
                  {step < 4 ? (
                    <Button 
                      onClick={() => setStep(s => s + 1)} 
                      className="rounded-xl gap-2 px-8 h-12 text-white font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105"
                      style={{ background: `linear-gradient(135deg, ${currentStep.color}, ${currentStep.color}dd)` }}
                    >
                      Next Step <ArrowRight className="w-4 h-4" />
                    </Button>
                  ) : (
                    <Button 
                      onClick={handleCalculate} 
                      disabled={loading} 
                      className="rounded-xl gap-2 px-8 h-12 text-white font-bold shadow-[0_0_20px_rgba(82,183,136,0.4)] hover:shadow-[0_0_30px_rgba(82,183,136,0.6)] transition-all hover:scale-105"
                      style={{ background: "linear-gradient(135deg, #2D6A4F, #52B788)" }}
                    >
                      {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Saving...</> : <>Complete Profile <CheckCircle2 className="w-5 h-5" /></>}
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Live Summary */}
            <div className="hidden lg:block lg:col-span-5 xl:col-span-4">
              <SummaryPanel data={data} />
            </div>
            
            {/* Mobile sticky summary */}
            <div className="lg:hidden fixed bottom-0 left-0 w-full p-4 z-20 pointer-events-none">
              <div className="bg-[#161B22]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex items-center justify-between shadow-2xl pointer-events-auto">
                <div>
                  <p className="text-xs text-white/50 uppercase font-bold tracking-wider mb-0.5">Live Estimate</p>
                  <div className="flex items-baseline gap-1">
                    <span className="font-display font-black text-2xl text-[#52B788]">{calculateFootprint(data).total_kg_co2e.toLocaleString()}</span>
                    <span className="text-xs text-white/50">kg CO₂e</span>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#52B788]/20 border border-[#52B788]/30">
                  <Leaf className="w-5 h-5 text-[#52B788]" />
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

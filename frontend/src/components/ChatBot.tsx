"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Leaf, Bot, User, Loader2, Minimize2 } from "lucide-react";
import { useFootprintStore } from "@/store/footprintStore";
import { useAuthStore } from "@/store/authStore";

interface Message {
  role: "user" | "assistant";
  content: string;
  ts: number;
}

const SUGGESTED = [
  "What's my biggest source of emissions?",
  "How can I reduce my transport footprint?",
  "Is my footprint above average?",
  "Give me 3 quick wins this week",
];

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "👋 Hi! I'm **CarbonBot**, your AI sustainability assistant powered by Gemini.\n\nI can analyze your carbon footprint data and answer any questions about reducing your environmental impact. What would you like to know?",
      ts: Date.now(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const footprint = useFootprintStore((s) => s.footprint);
  const { user } = useAuthStore();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 300);
  }, [open]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: Message = { role: "user", content: text.trim(), ts: Date.now() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const history = messages.map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        content: m.content,
      }));

      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${API_URL}/api/v1/chat/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text.trim(),
          footprint: footprint ?? null,
          history,
        }),
      });

      const data = await res.json();
      const reply = res.ok
        ? data.reply
        : "Sorry, I couldn't connect to the AI right now. Please make sure your `GEMINI_API_KEY` is set in the backend `.env` file.";

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: reply, ts: Date.now() },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "⚠️ Network error. Make sure the Flask backend is running on port 5000.",
          ts: Date.now(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  // Simple markdown-ish renderer for bold and bullets
  const renderContent = (text: string) =>
    text
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\n•\s/g, "\n&#8226; ")
      .split("\n")
      .map((line, i) => (
        <span key={i}>
          <span dangerouslySetInnerHTML={{ __html: line }} />
          <br />
        </span>
      ));

  return (
    <>
      {/* Floating trigger button */}
      <AnimatePresence>
        {!open && (
          <motion.button
            key="trigger"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl group"
            style={{ background: "linear-gradient(135deg, #2D6A4F, #52B788)" }}
          >
            <MessageCircle className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
            {/* Pulse ring */}
            <span className="absolute inset-0 rounded-full animate-ping opacity-20"
              style={{ background: "#52B788" }} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="chat"
            initial={{ opacity: 0, scale: 0.85, y: 40, originX: 1, originY: 1 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 40 }}
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
            className="fixed bottom-6 right-6 z-50 flex flex-col rounded-2xl overflow-hidden shadow-2xl"
            style={{
              width: "min(420px, calc(100vw - 24px))",
              height: "min(600px, calc(100vh - 100px))",
              background: "#0D1117",
              border: "1px solid rgba(82,183,136,0.25)",
              boxShadow: "0 25px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(82,183,136,0.1)",
            }}
          >
            {/* Header */}
            <div
              className="flex items-center gap-3 px-4 py-3 shrink-0"
              style={{ background: "linear-gradient(135deg, #1a3028, #1e3d2f)", borderBottom: "1px solid rgba(82,183,136,0.15)" }}
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: "linear-gradient(135deg, #2D6A4F, #52B788)" }}
              >
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-display font-bold text-white text-sm">CarbonBot</p>
                <p className="text-xs" style={{ color: "rgba(82,183,136,0.8)" }}>
                  Powered by Google Gemini · {footprint ? "Data loaded ✓" : "No footprint yet"}
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/5 transition-colors"
              >
                <X className="w-4 h-4" style={{ color: "rgba(240,246,252,0.5)" }} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                >
                  {/* Avatar */}
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                    style={{
                      background: msg.role === "user"
                        ? "linear-gradient(135deg, #40916C, #52B788)"
                        : "rgba(82,183,136,0.15)",
                      border: msg.role === "assistant" ? "1px solid rgba(82,183,136,0.3)" : "none",
                    }}
                  >
                    {msg.role === "user"
                      ? <User className="w-3.5 h-3.5 text-white" />
                      : <Leaf className="w-3.5 h-3.5" style={{ color: "#52B788" }} />
                    }
                  </div>

                  {/* Bubble */}
                  <div
                    className="max-w-[78%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed"
                    style={
                      msg.role === "user"
                        ? {
                          background: "linear-gradient(135deg, #2D6A4F, #40916C)",
                          color: "white",
                          borderBottomRightRadius: "4px",
                        }
                        : {
                          background: "#161B22",
                          color: "rgba(240,246,252,0.9)",
                          border: "1px solid rgba(255,255,255,0.05)",
                          borderBottomLeftRadius: "4px",
                        }
                    }
                  >
                    {renderContent(msg.content)}
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {loading && (
                <div className="flex gap-2.5">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: "rgba(82,183,136,0.15)", border: "1px solid rgba(82,183,136,0.3)" }}
                  >
                    <Leaf className="w-3.5 h-3.5" style={{ color: "#52B788" }} />
                  </div>
                  <div
                    className="rounded-2xl px-4 py-3 flex items-center gap-1.5"
                    style={{ background: "#161B22", border: "1px solid rgba(255,255,255,0.05)" }}
                  >
                    {[0, 1, 2].map((d) => (
                      <motion.div
                        key={d}
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ repeat: Infinity, duration: 1.2, delay: d * 0.2 }}
                        className="w-2 h-2 rounded-full"
                        style={{ background: "#52B788" }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Suggestions (only for first message) */}
              {messages.length === 1 && (
                <div className="grid grid-cols-2 gap-2 pt-1">
                  {SUGGESTED.map((s) => (
                    <button
                      key={s}
                      onClick={() => sendMessage(s)}
                      className="text-left text-xs px-3 py-2.5 rounded-xl transition-all"
                      style={{
                        background: "rgba(82,183,136,0.06)",
                        border: "1px solid rgba(82,183,136,0.2)",
                        color: "rgba(240,246,252,0.75)",
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div
              className="px-3 py-3 shrink-0"
              style={{ borderTop: "1px solid rgba(255,255,255,0.05)", background: "#0D1117" }}
            >
              <div
                className="flex items-end gap-2 rounded-xl px-3 py-2"
                style={{ background: "#161B22", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about your footprint…"
                  rows={1}
                  className="flex-1 bg-transparent resize-none text-sm text-white placeholder:text-white/30 outline-none max-h-28"
                  style={{ lineHeight: "1.5" }}
                />
                <button
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim() || loading}
                  className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all disabled:opacity-30"
                  style={{ background: "linear-gradient(135deg, #2D6A4F, #52B788)" }}
                >
                  {loading
                    ? <Loader2 className="w-3.5 h-3.5 text-white animate-spin" />
                    : <Send className="w-3.5 h-3.5 text-white" />
                  }
                </button>
              </div>
              <p className="text-center text-xs mt-2" style={{ color: "rgba(240,246,252,0.2)" }}>
                Enter to send · Shift+Enter for new line
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

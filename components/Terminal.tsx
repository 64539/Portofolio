"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Send, Terminal as TerminalIcon, X } from "lucide-react";
import dynamic from "next/dynamic";
import { createSupabaseBrowserClient } from "@/lib/supabaseBrowser";

const AdminConsole = dynamic(() => import("./AdminConsole"), { ssr: false });

type TerminalProps = {
  isExpanded: boolean;
  onCollapse: () => void;
  onExpand?: () => void;
};

export default function Terminal({ isExpanded, onCollapse, onExpand }: TerminalProps) {
  const [command, setCommand] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [adminStep, setAdminStep] = useState<"idle" | "awaiting_password">("idle");
  const [adminKey, setAdminKey] = useState<string | null>(null);
  const [userSession] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    const existing = window.localStorage.getItem("user_session");
    const next = existing ?? crypto.randomUUID();
    window.localStorage.setItem("user_session", next);
    return next;
  });

  const [showVerification, setShowVerification] = useState(false);
  const [pendingMessage, setPendingMessage] = useState("");
  const [userDetails, setUserDetails] = useState({ name: "", email: "" });

  const typingTimerRef = useRef<number | null>(null);
  const typingIndexRef = useRef<number>(-1);
  const collapsedRef = useRef<HTMLDivElement | null>(null);
  const [maxLines, setMaxLines] = useState(18);

  const supabase = useMemo(() => {
    try {
      return createSupabaseBrowserClient();
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    const el = collapsedRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;

    const ro = new ResizeObserver((entries) => {
      const h = entries[0]?.contentRect?.height ?? 0;
      const next = Math.max(10, Math.floor((h - 84) / 16));
      setMaxLines(next);
    });

    ro.observe(el);
    return () => {
      ro.disconnect();
    };
  }, []);

  const typeLine = useCallback((prefix: string, content: string) => {
    if (typingTimerRef.current) window.clearInterval(typingTimerRef.current);

    setHistory((prev) => {
      typingIndexRef.current = prev.length;
      return [...prev, ""];
    });

    const full = `${prefix}${content}`;
    let i = 0;
    typingTimerRef.current = window.setInterval(() => {
      i += 2;
      setHistory((prev) =>
        prev.map((line, idx) => (idx === typingIndexRef.current ? full.slice(0, Math.min(i, full.length)) : line))
      );

      if (i >= full.length && typingTimerRef.current) {
        window.clearInterval(typingTimerRef.current);
        typingTimerRef.current = null;
      }
    }, 14);
  }, []);

  useEffect(() => {
    if (!supabase || !userSession) return;

    const channel = supabase
      .channel(`messages:${userSession}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `user_session=eq.${userSession}` },
        (payload) => {
          const row = payload.new as { user_session: string; content: string; is_from_admin: boolean };
          if (!row.is_from_admin) return;
          typeLine(`[ADMIN] `, row.content);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, typeLine, userSession]);

  useEffect(() => {
    return () => {
      if (typingTimerRef.current) window.clearInterval(typingTimerRef.current);
    };
  }, []);

  const handleVerificationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userDetails.name || !userDetails.email) return;
    
    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userDetails.email)) {
      setHistory((prev) => [...prev, `[SYSTEM] Invalid email format.`]);
      return;
    }

    setShowVerification(false);
    
    // Construct JSON content
    const contentPayload = JSON.stringify({
      text: pendingMessage,
      name: userDetails.name,
      email: userDetails.email,
      timestamp: new Date().toISOString()
    });

    setHistory((prev) => [...prev, `> ${pendingMessage}`, `[SYSTEM] Verifying identity... OK`, `[SYSTEM] Transmitting...`]);
    
    void sendMessage(contentPayload);
    setPendingMessage("");
  };

  const sendMessage = async (content: string) => {
    try {
      const session = userSession ?? window.localStorage.getItem("user_session");
      if (!session) {
        setHistory((prev) => [...prev, `[SYSTEM] Missing session. Reboot terminal.`]);
        return;
      }

      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_session: session, content }),
      });

      if (!res.ok) {
        setHistory((prev) => [...prev, `[SYSTEM] Transmission failed. Try again.`]);
        return;
      }

      setHistory((prev) => [...prev, `[SYSTEM] Message sent successfully. ID: ${crypto.randomUUID().slice(0, 8)}`]);
    } catch {
      setHistory((prev) => [...prev, `[SYSTEM] Network fault. Retry.`]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!command.trim()) return;

    const outgoing = command.trim();
    setCommand("");

    // Handle logout/exit
    if (adminKey && outgoing === "exit") {
      setAdminKey(null);
      setAdminStep("idle");
      onCollapse();
      return;
    }

    if (adminKey) {
      // Admin sending command/message logic (if any specific CLI commands needed)
      // For now, just echo
      setHistory((prev) => [...prev, `> ${outgoing}`, `[SYSTEM] Root terminal active. Type "exit" to logout.`]);
      return;
    }

    if (adminStep === "idle") {
      const normalized = outgoing.toLowerCase();
      
      // Admin login trigger
      if (normalized === "admin" || normalized === "sudo login" || normalized === "admin --access") {
        setHistory((prev) => [...prev, `> ${outgoing}`, `[SYSTEM] Enter Admin Password:`]);
        setAdminStep("awaiting_password");
        return;
      }
      
      // Regular user sending message -> Trigger verification
      setPendingMessage(outgoing);
      setShowVerification(true);
      return;
    }

    if (adminStep === "awaiting_password") {
      setHistory((prev) => [...prev, `> ${"*".repeat(Math.min(outgoing.length, 24))}`, `[SYSTEM] Verifying credentials...`]);

      // Hardcoded password check as per requirement
      if (outgoing === "23112311") {
        setHistory((prev) => [...prev, `[SYSTEM] ACCESS GRANTED. WELCOME ADMINISTRATOR.`]);
        setAdminKey(outgoing); // Use password as key for now, or fetch real key if needed
        setAdminStep("idle");
        onExpand?.();
      } else {
        setHistory((prev) => [...prev, `[SYSTEM] ACCESS DENIED. INCORRECT PASSWORD.`]);
        setAdminStep("idle");
      }
      return;
    }
  };

  return (
    <div className="relative">
      <AnimatePresence>
        {isExpanded && adminKey ? (
          typeof document !== "undefined" && createPortal(
            <motion.div
              key="terminal-expanded"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[9999]"
            >
              <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ duration: 0.4, type: "spring", bounce: 0.25 }}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(95vw,1200px)] h-[min(90vh,900px)] rounded-xl overflow-hidden border border-amber-400/50 bg-black/95 shadow-[0_0_50px_rgba(251,191,36,0.2)]"
              >
                <div className="bg-black/90 px-4 py-3 border-b border-amber-400/30 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <TerminalIcon className="w-5 h-5 text-amber-400" />
                    <span className="text-sm font-mono font-bold text-amber-400 tracking-wider">ROOT ACCESS // SYSTEM OVERRIDE</span>
                  </div>
                  <button
                    type="button"
                    onClick={onCollapse}
                    aria-label="Close Terminal"
                    className="p-2 rounded hover:bg-amber-400/10 transition-colors"
                  >
                    <X className="w-5 h-5 text-amber-400" />
                  </button>
                </div>
                <div className="p-0 h-[calc(100%-53px)]">
                  <AdminConsole adminKey={adminKey} />
                </div>
              </motion.div>
            </motion.div>,
            document.body
          )
        ) : (
          <motion.div
            key="terminal-collapsed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className={
              "relative z-10 w-full lg:w-[400px] h-[300px] rounded-lg overflow-hidden border shadow-[0_0_18px_rgba(0,0,0,0.35)] " +
              (adminKey ? "border-amber-400/35" : "border-cyber-blue/30")
            }
          >
            <div
              className={
                "px-3 py-2 flex items-center justify-between border-b " +
                (adminKey ? "bg-black/85 border-amber-400/20" : "bg-black/85 border-white/10")
              }
            >
              <div className="flex items-center gap-2">
                <TerminalIcon className={"w-4 h-4 " + (adminKey ? "text-amber-300" : "text-gray-400")} />
                <span className={"text-xs font-mono " + (adminKey ? "text-amber-300" : "text-gray-400")}>
                  {adminKey ? "Root@Admin" : "Guest@Jabriel"}
                </span>
              </div>
              {adminKey ? (
                <button
                  type="button"
                  onClick={onExpand}
                  aria-label="Expand Terminal"
                  className="text-[10px] font-mono px-2 py-1 rounded border border-amber-400/30 text-amber-300 hover:bg-amber-500/10"
                >
                  OPEN
                </button>
              ) : null}
            </div>

            <div ref={collapsedRef} className="p-3 h-[calc(300px-40px)] bg-black/80 font-mono text-xs flex flex-col">
              <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                {history.length === 0 ? (
                  <div className="text-gray-600">Type message or run secret command.</div>
                ) : (
                  history.slice(-maxLines).map((line, i) => (
                    <div
                      key={i}
                      className={
                        line.startsWith(">") ? "text-gray-200" : adminKey ? "text-amber-200" : "text-cyber-blue"
                      }
                    >
                      {line}
                    </div>
                  ))
                )}
              </div>
              <form onSubmit={handleSubmit} className="mt-2 flex items-center gap-2">
                <span className={adminKey ? "text-amber-300" : "text-cyber-cyan"}>{`>`}</span>
                <input
                  type={adminStep === "awaiting_password" ? "password" : "text"}
                  value={command}
                  onChange={(e) => setCommand(e.target.value)}
                  className="flex-1 bg-transparent border-none outline-none text-gray-200 placeholder-gray-600"
                  placeholder={adminStep === "awaiting_password" ? "Enter Password..." : "Enter command..."}
                />
                <button
                  type="submit"
                  aria-label="Send Command"
                  className={adminKey ? "text-amber-300 hover:text-amber-200" : "text-cyber-blue hover:text-white"}
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>

              {/* Verification Modal for Regular Users */}
              <AnimatePresence>
                {showVerification && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-20 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
                  >
                    <div className="w-full max-w-sm border border-cyber-blue/30 bg-black/80 rounded p-4 shadow-[0_0_20px_rgba(59,130,246,0.2)]">
                      <div className="text-cyber-blue font-mono text-xs mb-4 border-b border-cyber-blue/20 pb-2">
                        IDENTITY VERIFICATION REQUIRED
                      </div>
                      <form onSubmit={handleVerificationSubmit} className="space-y-3">
                        <div>
                          <label className="block text-[10px] font-mono text-gray-400 mb-1">CODENAME / NAME</label>
                          <input
                            type="text"
                            required
                            value={userDetails.name}
                            onChange={(e) => setUserDetails(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full bg-black/50 border border-cyber-blue/20 rounded px-2 py-1 text-xs text-white focus:border-cyber-blue/60 outline-none"
                            placeholder="Enter your name"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-mono text-gray-400 mb-1">SECURE UPLINK / EMAIL</label>
                          <input
                            type="email"
                            required
                            value={userDetails.email}
                            onChange={(e) => setUserDetails(prev => ({ ...prev, email: e.target.value }))}
                            className="w-full bg-black/50 border border-cyber-blue/20 rounded px-2 py-1 text-xs text-white focus:border-cyber-blue/60 outline-none"
                            placeholder="name@example.com"
                          />
                        </div>
                        <div className="flex gap-2 pt-2">
                          <button
                            type="button"
                            onClick={() => {
                              setShowVerification(false);
                              setPendingMessage("");
                            }}
                            className="flex-1 py-1 rounded border border-red-500/30 text-red-400 text-xs hover:bg-red-500/10"
                          >
                            ABORT
                          </button>
                          <button
                            type="submit"
                            className="flex-1 py-1 rounded bg-cyber-blue/20 border border-cyber-blue/50 text-cyber-blue text-xs hover:bg-cyber-blue/30"
                          >
                            TRANSMIT
                          </button>
                        </div>
                      </form>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Github, Instagram, Mail, Send, Terminal, X } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabaseBrowser";
import dynamic from "next/dynamic";

const AdminConsole = dynamic(() => import("./AdminConsole"), { ssr: false });

export default function ContactHub() {
  const [command, setCommand] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [adminStep, setAdminStep] = useState<"idle" | "awaiting_secret">("idle");
  const [adminKey, setAdminKey] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [userSession] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    const existing = window.localStorage.getItem("user_session");
    const next = existing ?? crypto.randomUUID();
    window.localStorage.setItem("user_session", next);
    return next;
  });
  const typingTimerRef = useRef<number | null>(null);
  const typingIndexRef = useRef<number>(-1);

  const supabase = useMemo(() => {
    try {
      return createSupabaseBrowserClient();
    } catch {
      return null;
    }
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
        prev.map((line, idx) =>
          idx === typingIndexRef.current ? full.slice(0, Math.min(i, full.length)) : line
        )
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
          const row = payload.new as {
            user_session: string;
            content: string;
            is_from_admin: boolean;
          };

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!command.trim()) return;

    const outgoing = command.trim();
    setCommand("");

    if (adminKey) {
      setHistory((prev) => [...prev, `> ${outgoing}`, `[SYSTEM] Root terminal active. Type "exit" to minimize.`]);
      if (outgoing.toLowerCase() === "exit") {
        setExpanded(false);
      }
      return;
    }

    if (adminStep === "idle") {
      const normalized = outgoing.toLowerCase();
      if (normalized === "sudo login" || normalized === "admin --access") {
        setHistory((prev) => [...prev, `> ${outgoing}`, `[SYSTEM] Enter Secret Key:`]);
        setAdminStep("awaiting_secret");
        return;
      }
    }

    if (adminStep === "awaiting_secret") {
      setHistory((prev) => [...prev, `> ${"*".repeat(Math.min(outgoing.length, 24))}`, `[SYSTEM] Verifying...`]);
      void (async () => {
        const res = await fetch("/api/admin/auth", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ secretKey: outgoing }),
        });
        const json = (await res.json()) as { ok?: boolean };
        if (!res.ok || !json.ok) {
          setHistory((prev) => [...prev, `[SYSTEM] ACCESS_DENIED`]);
          setAdminStep("idle");
          return;
        }
        setHistory((prev) => [...prev, `[SYSTEM] ROOT_ACCESS_GRANTED`]);
        setAdminKey(outgoing);
        setAdminStep("idle");
        setExpanded(true);
      })();
      return;
    }

    setHistory((prev) => [...prev, `> ${outgoing}`, `[SYSTEM] Transmitting...`]);

    void (async () => {
      try {
        const session = userSession ?? window.localStorage.getItem("user_session");
        if (!session) {
          setHistory((prev) => [...prev, `[SYSTEM] Missing session. Reboot terminal.`]);
          return;
        }

        const res = await fetch("/api/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_session: session, content: outgoing }),
        });

        if (!res.ok) {
          setHistory((prev) => [...prev, `[SYSTEM] Transmission failed. Try again.`]);
          return;
        }

        setHistory((prev) => [...prev, `[SYSTEM] Delivered.`]);
      } catch {
        setHistory((prev) => [...prev, `[SYSTEM] Network fault. Retry.`]);
      }
    })();
  };

  return (
    <section id="contact" className="py-20 relative z-10 pb-32">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-heading font-bold mb-4">
              SECURE <span className="text-cyber-blue">UPLINK</span>
            </h2>
            <p className="text-gray-400">
              Establish an encrypted connection with the operator.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="glass-panel p-6 rounded-lg">
                <h3 className="text-xl font-mono font-bold text-cyber-cyan mb-6">COMMUNICATION CHANNELS</h3>
                <div className="space-y-4">
                  <a
                    href="https://github.com/64539"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 rounded bg-black/40 border border-white/5 hover:border-cyber-blue/50 hover:bg-cyber-blue/10 transition-all group"
                  >
                    <Github className="w-6 h-6 text-gray-400 group-hover:text-cyber-blue" />
                    <span className="font-mono text-gray-300 group-hover:text-white">github.com/64539</span>
                  </a>
                  <a
                    href="https://www.instagram.com/codex24434?igsh=MTYxZXV6djR6c2NmMA=="
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 rounded bg-black/40 border border-white/5 hover:border-pink-500/50 hover:bg-pink-500/10 transition-all group"
                  >
                    <Instagram className="w-6 h-6 text-gray-400 group-hover:text-pink-500" />
                    <span className="font-mono text-gray-300 group-hover:text-white">@codex24434</span>
                  </a>
                  <a
                    href="mailto:jabrielsrizkiarjati2311@gmail.com"
                    className="flex items-center gap-4 p-4 rounded bg-black/40 border border-white/5 hover:border-cyber-cyan/50 hover:bg-cyber-cyan/10 transition-all group"
                  >
                    <Mail className="w-6 h-6 text-gray-400 group-hover:text-cyber-cyan" />
                    <span className="font-mono text-gray-300 group-hover:text-white">jabrielsrizkiarjati2311...</span>
                  </a>
                </div>
              </div>

              <div className="glass-panel p-6 rounded-lg">
                <div className="font-mono text-xs text-gray-500 mb-2">QUICK COMMAND</div>
                <div className="font-mono text-sm text-gray-300">
                  Terminal tersedia di pojok kanan bawah untuk kirim pesan cepat.
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {expanded && adminKey ? (
          <motion.div
            key="terminal-expanded"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70]"
          >
            <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />
            <motion.div
              layoutId="terminal"
              transition={{ type: "spring", stiffness: 260, damping: 30 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vh] glass-panel rounded-xl overflow-hidden border border-amber-400/30"
            >
              <div className="bg-black/85 px-3 py-2 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-amber-300" />
                  <span className="text-xs font-mono text-amber-300">Root@Admin</span>
                </div>
                <button
                  type="button"
                  onClick={() => setExpanded(false)}
                  className="p-2 rounded border border-amber-400/20 hover:border-amber-400/40"
                >
                  <X className="w-4 h-4 text-amber-200" />
                </button>
              </div>
              <div className="p-4 h-[calc(80vh-44px)]">
                <AdminConsole adminKey={adminKey} />
              </div>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="terminal-collapsed"
            layoutId="terminal"
            transition={{ type: "spring", stiffness: 260, damping: 30 }}
            className={
              "fixed bottom-6 right-20 z-50 w-[330px] h-[220px] rounded-lg overflow-hidden border shadow-[0_0_18px_rgba(0,0,0,0.35)] " +
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
                <Terminal className={"w-4 h-4 " + (adminKey ? "text-amber-300" : "text-gray-400")} />
                <span className={"text-xs font-mono " + (adminKey ? "text-amber-300" : "text-gray-400")}>
                  {adminKey ? "Root@Admin" : "Guest@Jabriel"}
                </span>
              </div>
              {adminKey ? (
                <button
                  type="button"
                  onClick={() => setExpanded(true)}
                  className="text-[10px] font-mono px-2 py-1 rounded border border-amber-400/30 text-amber-300 hover:bg-amber-500/10"
                >
                  OPEN
                </button>
              ) : null}
            </div>

            <div className={"p-3 h-[calc(220px-40px)] bg-black/80 font-mono text-xs flex flex-col"}>
              <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                {history.length === 0 ? (
                  <div className="text-gray-600">Type message or run secret command.</div>
                ) : (
                  history.slice(-18).map((line, i) => (
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
                  type={adminStep === "awaiting_secret" ? "password" : "text"}
                  value={command}
                  onChange={(e) => setCommand(e.target.value)}
                  className="flex-1 bg-transparent border-none outline-none text-gray-200 placeholder-gray-600"
                  placeholder={adminStep === "awaiting_secret" ? "Secret Key" : "Enter command..."}
                />
                <button
                  type="submit"
                  className={adminKey ? "text-amber-300 hover:text-amber-200" : "text-cyber-blue hover:text-white"}
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-4">
        <motion.a
          href="https://github.com/64539"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.1 }}
          className="p-3 rounded-full bg-black/80 border border-cyber-blue/50 text-cyber-blue hover:bg-cyber-blue hover:text-black transition-colors shadow-[0_0_15px_rgba(59,130,246,0.3)]"
        >
          <Github className="w-6 h-6" />
        </motion.a>
        <motion.a
          href="https://www.instagram.com/codex24434?igsh=MTYxZXV6djR6c2NmMA=="
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.1 }}
          className="p-3 rounded-full bg-black/80 border border-cyber-blue/30 text-white hover:bg-white hover:text-black transition-colors shadow-[0_0_15px_rgba(255,255,255,0.12)]"
        >
          <Instagram className="w-6 h-6" />
        </motion.a>
        <motion.a
          href="mailto:jabrielsrizkiarjati2311@gmail.com"
          whileHover={{ scale: 1.1 }}
          className="p-3 rounded-full bg-black/80 border border-cyber-cyan/50 text-cyber-cyan hover:bg-cyber-cyan hover:text-black transition-colors shadow-[0_0_15px_rgba(6,182,212,0.3)]"
        >
          <Mail className="w-6 h-6" />
        </motion.a>
      </div>
    </section>
  );
}

"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Send, Terminal as TerminalIcon, X } from "lucide-react";
import dynamic from "next/dynamic";
import { createSupabaseBrowserClient } from "@/lib/supabaseBrowser";

const AdminConsole = dynamic(() => import("./AdminConsole"), { ssr: false });

export default function Terminal() {
  const expectedAdminKey = process.env.NEXT_PUBLIC_ADMIN_SECRET_KEY ?? "23112311";

  const [command, setCommand] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [adminStep, setAdminStep] = useState<"idle" | "awaiting_password">("idle");
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

  useEffect(() => {
    console.log("[AdminAccess] NEXT_PUBLIC_ADMIN_SECRET_KEY present:", Boolean(process.env.NEXT_PUBLIC_ADMIN_SECRET_KEY));
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!command.trim()) return;

    const outgoing = command.trim();
    setCommand("");

    if (adminKey) {
      if (outgoing === "exit") {
        setExpanded(false);
      } else {
        setHistory((prev) => [...prev, `> ${outgoing}`, `[SYSTEM] Root terminal active. Type "exit" to minimize.`]);
      }
      return;
    }

    if (adminStep === "idle") {
      const normalized = outgoing.toLowerCase();
      if (normalized === "sudo login" || normalized === "admin --access") {
        setHistory((prev) => [...prev, `> ${outgoing}`, `[SYSTEM] Enter Secret Key:`]);
        setAdminStep("awaiting_password");
        return;
      }
    }

    if (adminStep === "awaiting_password") {
      setHistory((prev) => [...prev, `> ${"*".repeat(Math.min(outgoing.length, 24))}`, `[SYSTEM] Verifying...`]);

      if (outgoing === expectedAdminKey) {
        setHistory((prev) => [...prev, `[SYSTEM] ROOT_ACCESS_GRANTED`]);
        setAdminKey(outgoing);
        setAdminStep("idle");
        setExpanded(true);
      } else {
        setHistory((prev) => [...prev, `[SYSTEM] ACCESS_DENIED`]);
        setAdminStep("idle");
      }
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
    <div className="relative">
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
                  <TerminalIcon className="w-4 h-4 text-amber-300" />
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
              "w-full h-[320px] rounded-lg overflow-hidden border shadow-[0_0_18px_rgba(0,0,0,0.35)] " +
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
                  onClick={() => setExpanded(true)}
                  className="text-[10px] font-mono px-2 py-1 rounded border border-amber-400/30 text-amber-300 hover:bg-amber-500/10"
                >
                  OPEN
                </button>
              ) : null}
            </div>

            <div className="p-3 h-[calc(320px-40px)] bg-black/80 font-mono text-xs flex flex-col">
              <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                {history.length === 0 ? (
                  <div className="text-gray-600">Type message or run secret command.</div>
                ) : (
                  history.slice(-20).map((line, i) => (
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
                  placeholder={adminStep === "awaiting_password" ? "Secret Key" : "Enter command..."}
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
    </div>
  );
}


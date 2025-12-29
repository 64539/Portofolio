"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { createSupabaseBrowserClient } from "@/lib/supabaseBrowser";
import { Send } from "lucide-react";

type MessageRow = {
  id: string;
  created_at: string;
  user_session: string;
  content: string;
  is_from_admin: boolean;
};

export default function AdminConsole({ adminKey }: { adminKey: string }) {
  const [sessions, setSessions] = useState<string[]>([]);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [messages, setMessages] = useState<MessageRow[]>([]);
  const [input, setInput] = useState("");
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const logRef = useRef<HTMLDivElement | null>(null);

  const supabase = useMemo(() => {
    try {
      return createSupabaseBrowserClient();
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      setLoadingSessions(true);
      try {
        const res = await fetch("/api/admin/messages", {
          headers: { "x-admin-key": adminKey },
        });
        const json = (await res.json()) as { ok: boolean; sessions?: string[] };
        if (!res.ok || !json.ok) {
          if (!cancelled) setSessions([]);
          return;
        }
        const list = json.sessions ?? [];
        if (!cancelled) {
          setSessions(list);
          setSelectedSession((prev) => prev ?? list[0] ?? null);
        }
      } finally {
        if (!cancelled) setLoadingSessions(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [adminKey]);

  useEffect(() => {
    if (!selectedSession) {
      setMessages([]);
      return;
    }

    let cancelled = false;

    void (async () => {
      setLoadingMessages(true);
      try {
        const res = await fetch(`/api/admin/messages?session=${encodeURIComponent(selectedSession)}`,
          { headers: { "x-admin-key": adminKey } }
        );
        const json = (await res.json()) as { ok: boolean; messages?: MessageRow[] };
        if (!res.ok || !json.ok) {
          if (!cancelled) setMessages([]);
          return;
        }
        if (!cancelled) setMessages(json.messages ?? []);
      } finally {
        if (!cancelled) setLoadingMessages(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [adminKey, selectedSession]);

  useEffect(() => {
    if (!supabase) return;

    const channel = supabase
      .channel("admin:messages")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          const row = payload.new as MessageRow;
          setSessions((prev) => {
            const next = [row.user_session, ...prev.filter((s) => s !== row.user_session)];
            return next;
          });
          setMessages((prev) => {
            if (selectedSession && row.user_session !== selectedSession) return prev;
            if (!selectedSession) return prev;
            if (prev.some((m) => m.id === row.id)) return prev;
            return [...prev, row];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedSession, supabase]);

  useEffect(() => {
    const el = logRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages.length, loadingMessages]);

  const sendReply = async () => {
    const content = input.trim();
    if (!content || !selectedSession) return;
    setInput("");

    const optimistic: MessageRow = {
      id: `optimistic:${crypto.randomUUID()}`,
      created_at: new Date().toISOString(),
      user_session: selectedSession,
      content,
      is_from_admin: true,
    };

    setMessages((prev) => [...prev, optimistic]);

    const res = await fetch("/api/admin/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-key": adminKey },
      body: JSON.stringify({ user_session: selectedSession, content }),
    });

    if (!res.ok) {
      setMessages((prev) => prev.filter((m) => m.id !== optimistic.id));
    }
  };

  const listVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.03 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 6 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 h-full">
      <div className="lg:col-span-2 glass-panel rounded-lg overflow-hidden">
        <div className="px-4 py-3 bg-black/70 border-b border-white/10">
          <div className="font-mono text-xs text-amber-300">SESSIONS</div>
        </div>
        <div className="p-2 h-[calc(80vh-180px)] lg:h-[calc(80vh-140px)] overflow-y-auto">
          {loadingSessions ? (
            <div className="p-4 font-mono text-xs text-gray-500">Downloading session index...</div>
          ) : (
            <motion.div variants={listVariants} initial="hidden" animate="show" className="space-y-2">
              {sessions.map((s) => (
                <motion.button
                  key={s}
                  variants={itemVariants}
                  type="button"
                  onClick={() => setSelectedSession(s)}
                  className={
                    "w-full text-left px-3 py-2 rounded border font-mono text-xs transition-colors " +
                    (s === selectedSession
                      ? "bg-amber-500/15 border-amber-400/40 text-amber-200"
                      : "bg-black/40 border-white/10 text-gray-400 hover:text-gray-200 hover:border-amber-400/25")
                  }
                >
                  {s}
                </motion.button>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      <div className="lg:col-span-3 glass-panel rounded-lg overflow-hidden flex flex-col">
        <div className="px-4 py-3 bg-black/70 border-b border-white/10 flex items-center justify-between">
          <div className="font-mono text-xs text-amber-300">CONSOLE</div>
          <div className="font-mono text-[10px] text-gray-500">{selectedSession ? `user_session=${selectedSession}` : "no session"}</div>
        </div>

        <div ref={logRef} className="flex-1 p-4 bg-black/70 overflow-y-auto font-mono text-sm">
          {loadingMessages ? (
            <div className="text-gray-500 text-xs">Syncing conversation log...</div>
          ) : messages.length === 0 ? (
            <div className="text-gray-500 text-xs">No messages.</div>
          ) : (
            <motion.div variants={listVariants} initial="hidden" animate="show" className="space-y-3">
              {messages.map((m) => (
                <motion.div key={m.id} variants={itemVariants} className="leading-relaxed">
                  <div className="text-[10px] text-gray-500">
                    {new Date(m.created_at).toLocaleString()} · {m.is_from_admin ? "ADMIN" : "USER"}
                  </div>
                  <div className={m.is_from_admin ? "text-amber-200" : "text-cyber-blue"}>{m.content}</div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            void sendReply();
          }}
          className="border-t border-white/10 bg-black/80 p-3 flex items-center gap-2"
        >
          <span className="text-amber-300 font-mono text-sm">{`>`}</span>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-gray-200 placeholder:text-gray-600 font-mono text-sm"
            placeholder={selectedSession ? "Reply as admin..." : "Select a session..."}
            disabled={!selectedSession}
          />
          <button
            type="submit"
            className="p-2 rounded border border-amber-400/30 text-amber-300 hover:bg-amber-500/10 disabled:opacity-40"
            disabled={!selectedSession || !input.trim()}
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}


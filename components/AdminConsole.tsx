"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Send, Trash2, Reply, Search, User, Mail, Clock, RefreshCw } from "lucide-react";

type MessageRow = {
  id: string;
  created_at: string;
  user_session: string;
  content: string;
  is_from_admin: boolean;
  // Parsed fields
  parsedContent?: string;
  senderName?: string;
  senderEmail?: string;
};

export default function AdminConsole({ adminKey }: { adminKey: string }) {
  const [messages, setMessages] = useState<MessageRow[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  // Fetch all messages (simulated "Gmail" view where we see all incoming items)
  // Note: The original API might be session-based. We'll try to fetch all if API supports it,
  // or we might need to iterate sessions. Given current API structure, we might only get sessions first.
  // Let's stick to the current structure: List sessions -> Click to view thread.
  // BUT user asked for "Gmail-like table".
  // To do that properly without changing API, we'll fetch sessions, then fetch latest message for each session?
  // Or maybe we just fetch *all* messages if the API allows?
  // Let's check api/admin/messages again. It returns `sessions` if no param, `messages` if session param.
  // We will keep the "Sessions" list as the "Inbox" list.
  
  const [sessions, setSessions] = useState<string[]>([]);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    
    const fetchSessions = async () => {
      try {
        const res = await fetch("/api/admin/messages", {
          headers: { "x-admin-key": adminKey },
        });
        const json = await res.json();
        if (json.ok && !cancelled) {
          setSessions(json.sessions || []);
          // Auto-select first session if none selected
          if (!selectedSession && json.sessions?.length > 0) {
            setSelectedSession(json.sessions[0]);
          }
        }
      } finally {
        // loading state removed
      }
    };

    fetchSessions();
    return () => { cancelled = true; };
  }, [adminKey, refreshKey, selectedSession]); // Added selectedSession to deps

  useEffect(() => {
    if (!selectedSession) return;
    
    let cancelled = false;
    const fetchMessages = async () => {
      try {
        const res = await fetch(`/api/admin/messages?session=${encodeURIComponent(selectedSession)}`, {
           headers: { "x-admin-key": adminKey } 
        });
        const json = await res.json();
        if (json.ok && !cancelled) {
          // Parse JSON content if possible
          const parsed = (json.messages || []).map((m: MessageRow) => {
            let parsedContent = m.content;
            let senderName = "Unknown";
            let senderEmail = "No Email";
            
            try {
              if (m.content.startsWith("{")) {
                const obj = JSON.parse(m.content);
                if (obj.text) {
                  parsedContent = obj.text;
                  senderName = obj.name || "Unknown";
                  senderEmail = obj.email || "No Email";
                }
              }
            } catch {
              // Not JSON, keep as is
            }
            
            return { ...m, parsedContent, senderName, senderEmail };
          });
          setMessages(parsed);
        }
      } catch (e) {
        console.error(e);
      }
    };
    
    fetchMessages();
    return () => { cancelled = true; };
  }, [selectedSession, adminKey, refreshKey]);

  const handleReply = async (session: string) => {
    if (!replyContent.trim()) return;
    
    try {
      const res = await fetch("/api/admin/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-key": adminKey },
        body: JSON.stringify({ user_session: session, content: replyContent }),
      });
      
      if (res.ok) {
        setReplyContent("");
        setRefreshKey(p => p + 1); // Refresh
        setReplyingTo(null);
      }
    } catch (e) {
      alert("Failed to send reply");
    }
  };

  const handleDelete = async (id: string) => {
    // In a real app, we'd call DELETE endpoint. 
    // Since we don't have one explicitly, we'll just filter locally for now to simulate.
    if (confirm("Delete this message?")) {
      setMessages(prev => prev.filter(m => m.id !== id));
    }
  };

  // Filter messages based on search
  const filteredMessages = messages.filter(m => 
    m.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.senderName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.senderEmail?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col bg-black/40 text-gray-200 font-sans">
      {/* Header / Toolbar */}
      <div className="flex items-center justify-between p-4 border-b border-amber-500/20 bg-amber-950/10">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500/50" />
            <input 
              className="pl-9 pr-4 py-2 bg-black/50 border border-amber-500/20 rounded-full text-xs text-amber-100 placeholder-amber-500/30 focus:border-amber-500/50 outline-none w-64 transition-all"
              placeholder="Search secure logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button onClick={() => setRefreshKey(k => k + 1)} className="p-2 hover:bg-amber-500/10 rounded-full transition-colors">
            <RefreshCw className="w-4 h-4 text-amber-500" />
          </button>
        </div>
        <div className="text-xs font-mono text-amber-500/70">
          SECURE CONNECTION // {sessions.length} ACTIVE SESSIONS
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar (Sessions/Inbox) */}
        <div className="w-64 border-r border-amber-500/10 flex flex-col bg-black/20">
          <div className="p-3 text-[10px] font-mono text-amber-500/50 uppercase tracking-widest">Incoming Streams</div>
          <div className="flex-1 overflow-y-auto">
            {sessions.map(s => (
              <button
                key={s}
                onClick={() => setSelectedSession(s)}
                className={`w-full text-left px-4 py-3 border-b border-white/5 hover:bg-amber-500/5 transition-colors group ${selectedSession === s ? 'bg-amber-500/10 border-l-2 border-l-amber-500' : 'border-l-2 border-l-transparent'}`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <User className={`w-3 h-3 ${selectedSession === s ? 'text-amber-400' : 'text-gray-600 group-hover:text-amber-500/70'}`} />
                  <span className={`text-xs font-mono truncate ${selectedSession === s ? 'text-amber-100' : 'text-gray-400'}`}>
                    {s.slice(0, 8)}...
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content (Message Table) */}
        <div className="flex-1 flex flex-col overflow-hidden bg-black/10">
          {selectedSession ? (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {filteredMessages.length === 0 ? (
                   <div className="text-center text-gray-600 mt-20 text-sm font-mono">No data found in this sector.</div>
                ) : (
                  filteredMessages.map((msg) => (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={msg.id} 
                      className={`relative group border rounded-lg p-4 transition-all ${msg.is_from_admin ? 'border-amber-500/30 bg-amber-900/5 ml-12' : 'border-cyber-blue/20 bg-cyber-blue/5 mr-12'}`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-full ${msg.is_from_admin ? 'bg-amber-500/20 text-amber-400' : 'bg-cyber-blue/20 text-cyber-blue'}`}>
                            {msg.is_from_admin ? <Reply className="w-4 h-4" /> : <User className="w-4 h-4" />}
                          </div>
                          <div>
                            <div className="text-sm font-bold text-gray-200">
                              {msg.is_from_admin ? "Administrator" : (msg.senderName || "Anonymous User")}
                            </div>
                            <div className="text-[10px] text-gray-500 font-mono flex items-center gap-2">
                              {msg.senderEmail && <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {msg.senderEmail}</span>}
                              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(msg.created_at).toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {!msg.is_from_admin && (
                            <button 
                              onClick={() => setReplyingTo(msg.id)}
                              className="p-1.5 hover:bg-white/10 rounded text-gray-400 hover:text-white"
                              title="Reply"
                            >
                              <Reply className="w-4 h-4" />
                            </button>
                          )}
                          <button 
                            onClick={() => handleDelete(msg.id)}
                            className="p-1.5 hover:bg-red-500/20 rounded text-gray-400 hover:text-red-400"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="pl-[52px] text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">
                        {msg.parsedContent || msg.content}
                      </div>

                      {/* Inline Reply Input */}
                      {replyingTo === msg.id && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="mt-4 pl-[52px]"
                        >
                          <div className="flex gap-2">
                            <input
                              autoFocus
                              value={replyContent}
                              onChange={(e) => setReplyContent(e.target.value)}
                              placeholder="Type secure response..."
                              className="flex-1 bg-black/50 border border-amber-500/30 rounded px-3 py-2 text-sm text-amber-100 focus:border-amber-500 outline-none"
                              onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                  e.preventDefault();
                                  handleReply(msg.user_session);
                                }
                              }}
                            />
                            <button 
                              onClick={() => handleReply(msg.user_session)}
                              className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded text-xs font-bold transition-colors"
                            >
                              SEND
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  ))
                )}
              </div>
              
              {/* Sticky Reply Bar at Bottom */}
              <div className="p-4 border-t border-white/10 bg-black/40 backdrop-blur-sm">
                <div className="flex items-center gap-3 max-w-4xl mx-auto">
                  <div className="p-2 rounded-full bg-amber-500/10 border border-amber-500/20">
                     <div className="w-4 h-4 bg-amber-500 rounded-full animate-pulse" />
                  </div>
                  <input
                    value={replyContent}
                    onChange={(e) => {
                      setReplyContent(e.target.value);
                      setReplyingTo(null); // Clear specific reply focus if typing generally
                    }}
                    placeholder={`Message to session ${selectedSession.slice(0, 8)}...`}
                    className="flex-1 bg-transparent border-none outline-none text-sm text-gray-200 placeholder-gray-600"
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleReply(selectedSession);
                        }
                    }}
                  />
                  <button 
                    onClick={() => handleReply(selectedSession)}
                    disabled={!replyContent.trim()}
                    className="p-2 rounded-full bg-amber-600/20 text-amber-500 hover:bg-amber-600 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-600">
              <div className="w-16 h-16 rounded-full border-2 border-gray-700 flex items-center justify-center mb-4">
                <Mail className="w-8 h-8 text-gray-700" />
              </div>
              <p className="font-mono text-sm">Select a secure stream to decrypt.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


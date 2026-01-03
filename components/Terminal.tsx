"use client";

import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal as TerminalIcon, ChevronUp, ChevronDown } from "lucide-react";
import { useTerminalLogic } from "@/hooks/useTerminalLogic";

export default function Terminal() {
  const {
    mode,
    setMode,
    view,
    setView,
    inputBuffer,
    setInputBuffer,
    history,
    addToHistory,
    processCommand,
    messages,
    selectedMessage,
    setSelectedMessage,
    stats,
    receiptData,
    setReceiptData,
    navigateHistory,
    suggestions,
    isProcessing,
    setAdminKey
  } = useTerminalLogic();

  const [userDetails, setUserDetails] = useState({ name: "", email: "" });
  const [showVerification, setShowVerification] = useState(false);
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [isOutputExpanded, setIsOutputExpanded] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll history
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      navigateHistory('up');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      navigateHistory('down');
    } else if (e.key === 'Tab') {
      e.preventDefault();
      if (suggestions.length > 0) {
        setInputBuffer(suggestions[0]);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputBuffer.trim()) return;

    const cmd = inputBuffer.trim();
    setInputBuffer("");
    
    // Check for public message vs command
    if (mode === 'public' && !cmd.startsWith('sudo') && !cmd.startsWith('clear')) {
      // Treat as message attempt
      setShowVerification(true);
      return;
    }

    // Process as command
    await processCommand(cmd);
  };

  const handleVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userDetails.name || !userDetails.email) return;

    setShowVerification(false);
    setIsTransmitting(true);
    
    // Simulate transmission
    await new Promise(r => setTimeout(r, 1500));
    
    // Send to API
    try {
      const contentPayload = JSON.stringify({
        text: inputBuffer || "Message via Terminal", // Use buffer or default
        name: userDetails.name,
        email: userDetails.email,
        timestamp: new Date().toISOString()
      });

      const session = window.localStorage.getItem("user_session") || crypto.randomUUID();
      window.localStorage.setItem("user_session", session);

      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_session: session, content: contentPayload }),
      });

      if (res.ok) {
        setReceiptData({
          id: crypto.randomUUID().slice(0, 8).toUpperCase(),
          timestamp: new Date().toLocaleTimeString(),
          name: userDetails.name,
          status: "SENT TO SECURE VAULT"
        });
        setView('receipt');
        addToHistory(`> Message transmitted successfully.`);
      } else {
        addToHistory(`> Transmission failed.`);
      }
    } catch {
      addToHistory(`> Network error.`);
    } finally {
      setIsTransmitting(false);
      setInputBuffer("");
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputBuffer === "23112311") {
      setAdminKey("23112311"); // Set auth token immediately
      setMode('admin');
      setView('dashboard');
      setInputBuffer("");
      addToHistory("> Access Granted. Welcome Administrator.");
    } else {
      addToHistory("> Access Denied.");
      setView('input');
      setInputBuffer("");
    }
  };

  // --- RENDERERS ---

  const renderReceipt = () => (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-4 border border-cyber-cyan/50 rounded bg-cyber-cyan/5 font-mono text-xs text-cyber-cyan relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-cyber-cyan/30 animate-scanline" />
      <div className="flex justify-between border-b border-cyber-cyan/30 pb-2 mb-2">
        <span>DIGITAL RECEIPT</span>
        <span>[ENCRYPTED]</span>
      </div>
      <div className="space-y-1">
        <div className="flex justify-between">
          <span className="opacity-70">TICKET ID:</span>
          <span>{receiptData?.id}</span>
        </div>
        <div className="flex justify-between">
          <span className="opacity-70">TIMESTAMP:</span>
          <span>{receiptData?.timestamp}</span>
        </div>
        <div className="flex justify-between">
          <span className="opacity-70">SENDER:</span>
          <span>{receiptData?.name}</span>
        </div>
        <div className="mt-4 pt-2 border-t border-cyber-cyan/30 text-center font-bold animate-pulse">
          STATUS: {receiptData?.status}
        </div>
      </div>
      <button 
        onClick={() => setView('input')}
        className="mt-4 w-full py-1 border border-cyber-cyan/30 hover:bg-cyber-cyan/20 transition-colors text-center"
      >
        CLOSE RECEIPT
      </button>
    </motion.div>
  );

  const renderAdminDashboard = () => (
    <div className="flex flex-col h-full text-amber-500 font-mono text-xs relative">
      {/* Header */}
      <div className="flex items-center justify-between p-2 border-b border-amber-500/30 bg-amber-900/10 flex-shrink-0">
        <div className="flex gap-4">
          <span>TOTAL: {stats.total}</span>
          <span>UNREAD: {stats.unread}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span>DB: CONNECTED</span>
        </div>
      </div>

      {/* Split View */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-1/3 border-r border-amber-500/30 overflow-y-auto bg-black/40">
          {messages.map(msg => (
            <button
              key={msg.id}
              onClick={() => setSelectedMessage(msg)}
              className={`w-full text-left p-3 border-b border-amber-500/10 hover:bg-amber-500/10 transition-colors ${selectedMessage?.id === msg.id ? 'bg-amber-500/20' : ''}`}
            >
              <div className="flex justify-between mb-1">
                <span className="font-bold truncate">{msg.sender_name || "Unknown"}</span>
                {!msg.is_read && <span className="text-[10px] bg-amber-500 text-black px-1 rounded">NEW</span>}
              </div>
              <div className="opacity-60 truncate text-[10px]">{msg.content}</div>
            </button>
          ))}
        </div>

        {/* Main Panel */}
        <div className="w-2/3 p-4 overflow-y-auto bg-black/20">
          {selectedMessage ? (
            <div className="border border-amber-500/30 p-4 rounded relative">
              <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-amber-500" />
              <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-amber-500" />
              <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-amber-500" />
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-amber-500" />
              
              <h3 className="text-lg font-bold mb-4 border-b border-amber-500/30 pb-2">MESSAGE DECRYPTED</h3>
              <div className="grid grid-cols-[100px_1fr] gap-2 mb-4">
                <span className="opacity-60">FROM:</span>
                <span>{selectedMessage.sender_name} &lt;{selectedMessage.sender_email}&gt;</span>
                
                <span className="opacity-60">SENT:</span>
                <span>{new Date(selectedMessage.created_at).toLocaleString()}</span>
                
                <span className="opacity-60">ID:</span>
                <span>{selectedMessage.id}</span>
              </div>
              <div className="p-3 border border-amber-500/20 bg-black/40 rounded min-h-[100px] whitespace-pre-wrap">
                {selectedMessage.content}
              </div>
              
              <div className="mt-4 flex justify-end gap-2">
                <button 
                  onClick={() => {/* Implement reply logic */}}
                  className="px-3 py-1 border border-amber-500/30 hover:bg-amber-500/20"
                >
                  REPLY
                </button>
                <button 
                  onClick={() => {/* Implement delete logic */}}
                  className="px-3 py-1 border border-red-500/30 text-red-400 hover:bg-red-500/10"
                >
                  DELETE
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center opacity-40">
              SELECT A MESSAGE TO DECRYPT
            </div>
          )}
        </div>
      </div>
      
      {/* Expandable Command Output Area */}
      <motion.div 
        initial={{ height: "40px" }}
        animate={{ height: isOutputExpanded ? "200px" : "40px" }}
        className="border-t border-amber-500/30 bg-black/90 flex flex-col flex-shrink-0 transition-all duration-300 ease-in-out"
      >
        <div className="flex items-center justify-between px-2 bg-amber-900/20 h-[40px]">
          <div className="flex items-center gap-2 flex-1">
            <span className="text-amber-500">admin@root:~$</span>
            <input 
              value={inputBuffer}
              onChange={(e) => setInputBuffer(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  processCommand(inputBuffer);
                  setIsOutputExpanded(true); // Auto expand on command
                } else {
                  handleKeyDown(e);
                }
              }}
              className="flex-1 bg-transparent border-none outline-none text-amber-500 w-full"
              placeholder="Type 'help' for commands..."
              autoFocus
            />
          </div>
          <button 
            onClick={() => setIsOutputExpanded(!isOutputExpanded)}
            className="p-1 hover:bg-amber-500/20 rounded text-amber-500"
          >
            {isOutputExpanded ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
          </button>
        </div>
        
        {/* Output Scroll Area */}
        <div className="flex-1 overflow-y-auto p-2 font-mono text-[11px] space-y-1 bg-black/50 border-t border-amber-500/10" ref={scrollRef}>
          {history.map((line, i) => (
            <div key={i} className={`${line.startsWith('>') ? 'text-amber-300 font-bold' : 'text-amber-500/70'}`}>
              {line}
            </div>
          ))}
          {isProcessing && (
             <div className="animate-pulse text-amber-500">
               &gt; PROCESSING COMMAND...
             </div>
          )}
        </div>
      </motion.div>
    </div>
  );

  // --- MAIN RENDER ---

  const themeColor = mode === 'admin' ? 'text-amber-500 border-amber-500' : 'text-cyber-cyan border-cyber-cyan';
  const glowClass = mode === 'admin' ? 'shadow-[0_0_20px_rgba(245,158,11,0.2)]' : 'shadow-[0_0_20px_rgba(6,182,212,0.2)]';

  if (view === 'dashboard' && mode === 'admin') {
    return (
      <div className={`w-full h-[600px] bg-black/90 rounded-lg border border-amber-500 overflow-hidden relative ${glowClass}`}>
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_2px,3px_100%]" />
        {renderAdminDashboard()}
      </div>
    );
  }

  return (
    <div className={`w-full h-[400px] bg-black/90 rounded-lg border ${themeColor} overflow-hidden relative flex flex-col ${glowClass}`}>
      {/* Scanlines Effect */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_2px,3px_100%]" />
      
      {/* Header */}
      <div className={`flex justify-between items-center p-2 border-b ${mode === 'admin' ? 'border-amber-500/30 bg-amber-900/10' : 'border-cyber-cyan/30 bg-cyber-cyan/10'}`}>
        <div className="flex items-center gap-2">
          <TerminalIcon className="w-4 h-4" />
          <span className="font-mono text-xs font-bold">{mode === 'admin' ? 'ROOT_ACCESS // ADMIN' : 'GUEST_ACCESS // PUBLIC'}</span>
        </div>
        <div className="flex gap-1">
          <div className={`w-2 h-2 rounded-full ${mode === 'admin' ? 'bg-amber-500' : 'bg-cyber-cyan'} animate-pulse`} />
          <div className={`w-2 h-2 rounded-full ${mode === 'admin' ? 'bg-amber-500' : 'bg-cyber-cyan'} opacity-50`} />
          <div className={`w-2 h-2 rounded-full ${mode === 'admin' ? 'bg-amber-500' : 'bg-cyber-cyan'} opacity-25`} />
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-4 font-mono text-xs overflow-y-auto relative" ref={scrollRef}>
        {view === 'receipt' ? renderReceipt() : (
          <div className="space-y-1">
            {history.map((line, i) => (
              <div key={i} className={`
                ${line.startsWith('>') ? 'opacity-100 font-bold' : 'opacity-70'}
                ${line.includes('Access Granted') ? 'text-green-500 font-bold animate-pulse' : ''}
                ${line.includes('Access Denied') || line.includes('EXPIRED') ? 'text-red-500 font-bold' : ''}
              `}>
                {line}
              </div>
            ))}
            
            {isTransmitting && (
              <div className="animate-pulse text-cyber-cyan">
                &gt; TRANSMITTING DATA PACKETS...
              </div>
            )}

            {isProcessing && (
              <div className="animate-pulse text-amber-500">
                &gt; PROCESSING COMMAND...
              </div>
            )}

            {/* Input Line */}
            {!isTransmitting && !isProcessing && (
              <div className="flex gap-2 mt-2 relative">
                <span className="font-bold">&gt;</span>
                <form onSubmit={view === 'login' ? handleLoginSubmit : handleSubmit} className="flex-1" autoComplete="off">
                  <input
                    type={view === 'login' ? 'password' : 'text'}
                    value={inputBuffer}
                    onChange={(e) => setInputBuffer(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className={`w-full bg-transparent border-none outline-none ${mode === 'admin' ? 'text-amber-500 placeholder-amber-800' : 'text-cyber-cyan placeholder-cyber-cyan/30'}`}
                    placeholder={view === 'login' ? 'Enter Password' : "Type message or 'sudo login'..."}
                    autoFocus
                  />
                </form>
                {/* Autocomplete Suggestions */}
                {suggestions.length > 0 && inputBuffer && view !== 'login' && (
                  <div className={`absolute left-4 bottom-full mb-1 border ${mode === 'admin' ? 'border-amber-500 bg-black' : 'border-cyber-cyan bg-black'} p-1`}>
                    {suggestions.map(s => (
                      <div key={s} className="opacity-70 px-1">{s}</div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Verification Modal Overlay */}
      <AnimatePresence>
        {showVerification && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-20 bg-black/90 backdrop-blur-sm flex items-center justify-center"
          >
            <div className={`w-3/4 max-w-sm border ${themeColor} bg-black p-4 shadow-[0_0_30px_rgba(0,0,0,0.8)]`}>
              <div className={`text-center font-bold border-b ${mode === 'admin' ? 'border-amber-500/30' : 'border-cyber-cyan/30'} pb-2 mb-4`}>
                IDENTITY VERIFICATION
              </div>
              <form onSubmit={handleVerificationSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] opacity-70 mb-1">CODENAME / NAME</label>
                  <input
                    required
                    value={userDetails.name}
                    onChange={e => setUserDetails({...userDetails, name: e.target.value})}
                    className={`w-full bg-transparent border ${mode === 'admin' ? 'border-amber-500/50' : 'border-cyber-cyan/50'} p-1 outline-none`}
                  />
                </div>
                <div>
                  <label className="block text-[10px] opacity-70 mb-1">SECURE UPLINK / EMAIL</label>
                  <input
                    required
                    type="email"
                    value={userDetails.email}
                    onChange={e => setUserDetails({...userDetails, email: e.target.value})}
                    className={`w-full bg-transparent border ${mode === 'admin' ? 'border-amber-500/50' : 'border-cyber-cyan/50'} p-1 outline-none`}
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button 
                    type="button" 
                    onClick={() => setShowVerification(false)}
                    className="flex-1 border border-red-500/50 text-red-500 hover:bg-red-900/20 py-1"
                  >
                    ABORT
                  </button>
                  <button 
                    type="submit"
                    className={`flex-1 border ${mode === 'admin' ? 'border-amber-500' : 'border-cyber-cyan'} hover:bg-white/10 py-1 font-bold`}
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
  );
}

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
    setAdminKey,
    filter,
    setFilter,
    filteredMessages,
    openMessage
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
      // Per Requirement 3: Strict JSON Structure
      const messageId = crypto.randomUUID();
      const timestamp = new Date().toISOString();
      
      const contentPayload = JSON.stringify({
        id: messageId,
        from: userDetails.name,
        email: userDetails.email,
        timestamp: timestamp,
        text: inputBuffer || "Message via Terminal",
        status: "UNREAD"
      });

      const session = window.localStorage.getItem("user_session") || crypto.randomUUID();
      window.localStorage.setItem("user_session", session);

      // We still send sender_name and sender_email to columns for easy querying, 
      // but the 'content' field will strictly follow the requested JSON format.
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          user_session: session, 
          content: contentPayload,
          sender_name: userDetails.name,
          sender_email: userDetails.email
        }),
      });

      if (res.ok) {
        setReceiptData({
          id: messageId.slice(0, 8).toUpperCase(),
          timestamp: new Date(timestamp).toLocaleTimeString(),
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

  const handleReplyClick = () => {
    if (selectedMessage) {
      setInputBuffer(`reply ${selectedMessage.id} `);
      // Logic to focus input is handled by autoFocus prop and re-render
    }
  };

  const handleDeleteClick = () => {
    if (selectedMessage) {
      if (confirm("DELETE MESSAGE: Are you sure? This action cannot be undone.")) {
        processCommand(`delete ${selectedMessage.id}`);
      }
    }
  };

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
        <div className="w-1/3 border-r border-amber-500/30 overflow-y-auto bg-black/40 flex flex-col">
          {/* Filter Tabs */}
          <div className="flex border-b border-amber-500/30 text-[10px]">
            {(['ALL', 'UNREAD', 'READ'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`flex-1 py-2 hover:bg-amber-500/10 transition-colors ${filter === f ? 'bg-amber-500/20 text-amber-300 font-bold' : 'opacity-60'}`}
              >
                {f}
              </button>
            ))}
          </div>
          {/* Message List */}
          <div className="flex-1 overflow-y-auto">
            {filteredMessages.map(msg => (
              <button
                key={msg.id}
                onClick={() => openMessage(msg)}
                className={`w-full text-left p-3 border-b border-amber-500/10 hover:bg-amber-500/10 transition-colors ${selectedMessage?.id === msg.id ? 'bg-amber-500/20' : ''}`}
              >
                <div className="flex justify-between mb-1">
                  <span className="font-bold truncate">{msg.sender_name || "Unknown"}</span>
                  {!msg.is_read && <span className="text-[10px] bg-amber-500 text-black px-1 rounded font-bold">NEW</span>}
                </div>
                <div className="opacity-60 truncate text-[10px]">{msg.content}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Main Panel */}
        <div className="w-2/3 p-4 overflow-y-auto bg-black/20">
          {selectedMessage ? (
            <div className="border border-amber-500/30 p-4 rounded relative bg-black/40">
              <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-amber-500" />
              <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-amber-500" />
              <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-amber-500" />
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-amber-500" />
              
              <div className="flex justify-between items-start border-b border-amber-500/30 pb-4 mb-4">
                <div>
                  <h3 className="text-lg font-bold text-amber-300">MESSAGE DECRYPTED</h3>
                  <div className="text-[10px] opacity-60 mt-1 font-mono">ID: {selectedMessage.id}</div>
                </div>
                <div className={`px-2 py-1 rounded text-[10px] font-bold border ${selectedMessage.is_read ? 'border-amber-500/30 text-amber-500/50' : 'border-green-500 text-green-500'}`}>
                  {selectedMessage.is_read ? 'STATUS: READ' : 'STATUS: UNREAD'}
                </div>
              </div>

              <div className="grid grid-cols-[80px_1fr] gap-y-2 mb-6 text-xs">
                <span className="opacity-60">FROM:</span>
                <span className="font-bold text-amber-100">{selectedMessage.sender_name || "Anonymous"}</span>
                
                <span className="opacity-60">EMAIL:</span>
                <span className="text-amber-200">{selectedMessage.sender_email || "N/A"}</span>
                
                <span className="opacity-60">SENT:</span>
                <span>{new Date(selectedMessage.created_at).toLocaleString()}</span>
              </div>

              <div className="p-4 border border-amber-500/20 bg-black/60 rounded min-h-[150px] whitespace-pre-wrap text-sm leading-relaxed text-amber-100 shadow-inner">
                {selectedMessage.content}
              </div>
              
              <div className="mt-6 flex justify-end gap-3">
                <button 
                  onClick={handleReplyClick}
                  className="px-4 py-2 border border-amber-500 hover:bg-amber-500 hover:text-black transition-all font-bold text-xs flex items-center gap-2"
                >
                  <TerminalIcon size={14} /> REPLY
                </button>
                <button 
                  onClick={handleDeleteClick}
                  className="px-4 py-2 border border-red-500/50 text-red-400 hover:bg-red-500 hover:text-white transition-all font-bold text-xs"
                >
                  DELETE
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center opacity-40">
              <TerminalIcon size={48} className="mb-4 opacity-50" />
              <div className="text-sm tracking-widest">SELECT A DATA STREAM</div>
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
                    placeholder="name@example.com"
                    value={userDetails.email}
                    onChange={e => setUserDetails({...userDetails, email: e.target.value})}
                    className={`w-full bg-transparent border ${mode === 'admin' ? 'border-amber-500/50' : 'border-cyber-cyan/50'} p-1 outline-none placeholder-opacity-30 placeholder-current`}
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

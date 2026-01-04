"use client";

import { useRef, useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal as TerminalIcon, ChevronUp, ChevronDown } from "lucide-react";
import { useTerminalLogic, Message } from "@/hooks/useTerminalLogic";

// Separate component for clean detail view
const MessageDetailView = ({ message, onReply, onDelete }: { message: Message, onReply: () => void, onDelete: () => void }) => {
  // Parse content if it's JSON string
  const parsedContent = useMemo(() => {
    try {
      const obj = JSON.parse(message.content);
      return obj.message || obj.text || message.content;
    } catch {
      return message.content;
    }
  }, [message.content]);

  const timestamp = new Date(message.created_at).toLocaleString('en-GB', { 
    day: '2-digit', month: '2-digit', year: 'numeric', 
    hour: '2-digit', minute: '2-digit' 
  });

  return (
    <div className="border border-amber-500/30 p-6 rounded relative bg-black/40 h-full flex flex-col">
      {/* Decorative corners */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-amber-500" />
      <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-amber-500" />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-amber-500" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-amber-500" />
      
      {/* Header */}
      <div className="border-b border-amber-500/20 pb-4 mb-4 flex justify-between items-start">
        <div>
           <h2 className="text-xl font-bold text-amber-500 tracking-wider">DECRYPTED MESSAGE</h2>
           <div className="text-xs text-amber-500/40 mt-1 font-mono">SECURE UPLINK #{message.index}</div>
        </div>
        <div className={`px-3 py-1 text-[10px] font-bold border rounded tracking-widest ${message.is_read ? 'border-amber-900/50 text-amber-700' : 'border-green-500 text-green-500 animate-pulse'}`}>
          {message.is_read ? 'ARCHIVED' : 'INCOMING'}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 space-y-4 font-mono text-sm overflow-y-auto pr-2">
        <div className="grid grid-cols-[100px_1fr] gap-2 items-baseline">
          <span className="text-amber-500/50 text-xs">[SENDER]</span>
          <span className="text-amber-100 font-bold">{message.sender_name || "Unknown"}</span>
        </div>
        <div className="grid grid-cols-[100px_1fr] gap-2 items-baseline">
          <span className="text-amber-500/50 text-xs">[CONTACT]</span>
          <span className="text-amber-200">{message.sender_email || "N/A"}</span>
        </div>
        <div className="grid grid-cols-[100px_1fr] gap-2 items-baseline">
          <span className="text-amber-500/50 text-xs">[TIMESTAMP]</span>
          <span className="text-amber-500/70">{timestamp}</span>
        </div>
        
        <div className="mt-6">
          <div className="text-amber-500/50 text-xs mb-2">[MESSAGE]</div>
          <div className="p-4 bg-amber-950/20 border border-amber-500/10 rounded text-amber-50 whitespace-pre-wrap leading-relaxed shadow-inner">
            {parsedContent}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6 pt-4 border-t border-amber-500/20 flex justify-end gap-3">
        <button 
          onClick={onReply}
          className="px-4 py-2 bg-amber-500/10 hover:bg-amber-500 hover:text-black border border-amber-500/50 text-amber-500 transition-all font-bold text-xs flex items-center gap-2 group"
        >
          <TerminalIcon size={14} className="group-hover:animate-bounce" /> REPLY
        </button>
        <button 
          onClick={onDelete}
          className="px-4 py-2 bg-red-900/10 hover:bg-red-500 hover:text-white border border-red-500/50 text-red-400 transition-all font-bold text-xs group"
        >
          DELETE
        </button>
      </div>
    </div>
  );
};

export default function Terminal() {

  // Helper for message cleaning
  const parseMessage = (content: string) => {
    try {
      const obj = JSON.parse(content);
      return obj.message || obj.text || content;
    } catch {
      return "[CORRUPTED DATA] " + content;
    }
  };
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
  const listRef = useRef<HTMLDivElement>(null);

  // Auto-scroll history
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  // Keyboard navigation for Admin Message List
  useEffect(() => {
    if (mode !== 'admin' || !listRef.current) return;

    const handleListNavigation = (e: KeyboardEvent) => {
      // Only handle if input buffer is not focused (or maybe always? let's stick to global if input empty)
      // But we have an input field always focused. Let's make it work via special keys or focus management.
      // Simplest: Check if active element is input, if input empty, allow navigation? 
      // Or use Ctrl+Up/Down?
      // Requirement says "Up/Down: select message". This conflicts with history navigation if input focused.
      // Let's assume history nav is for command line, message nav is for list.
      // We'll implement: if Input is focused, Up/Down does history. 
      // IF we want message nav, maybe we need to focus the list?
      // "Navigasi dengan keyboard" usually implies focus management.
      
      // However, to keep it simple as per "Cyberpunk Terminal" feel:
      // Let's map Alt+Up/Down for list navigation if input focused?
      // Or just standard Up/Down if input is empty?
      // Let's try: If Input is empty, Up/Down moves list selection.
      // If Input has text, Up/Down does nothing or history? History usually works even with text.
      
      // Better approach for dual usage:
      // Since history is less used in GUI mode, let's prioritize Message List navigation 
      // when in Dashboard view, UNLESS user explicitly focused command line?
      // Actually, command line `input` has `autoFocus`.
      
      // Let's add a listener to the window/document when in Dashboard mode.
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
         // We'll implement this logic inside the component render or a specific handler
      }
    };
    
    // window.addEventListener('keydown', handleListNavigation);
    // return () => window.removeEventListener('keydown', handleListNavigation);
  }, [mode]);

  // Enhanced handleKeyDown to support List Navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Admin Dashboard Navigation
    if (mode === 'admin' && view === 'dashboard' && filteredMessages.length > 0) {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        const currentIndex = selectedMessage ? filteredMessages.findIndex(m => m.id === selectedMessage.id) : -1;
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : filteredMessages.length - 1;
        openMessage(filteredMessages[prevIndex]);
        return;
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const currentIndex = selectedMessage ? filteredMessages.findIndex(m => m.id === selectedMessage.id) : -1;
        const nextIndex = currentIndex < filteredMessages.length - 1 ? currentIndex + 1 : 0;
        openMessage(filteredMessages[nextIndex]);
        return;
      }
      if (e.key === 'Enter' && e.ctrlKey) { // Ctrl+Enter to reply
        e.preventDefault();
        handleReplyClick();
        return;
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        processCommand('exit');
        return;
      }
    }

    // Default History Navigation
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

  // --- GUEST VIEW LOGIC ---
  const [isTerminalReady, setIsTerminalReady] = useState(false);
  const [welcomeText, setWelcomeText] = useState("");
  const FULL_WELCOME_TEXT = "System Online. Type your message to initiate contact...";

  useEffect(() => {
    // Initial loading animation
    const timer = setTimeout(() => {
      let i = 0;
      const typeWriter = setInterval(() => {
        setWelcomeText(FULL_WELCOME_TEXT.substring(0, i + 1));
        i++;
        if (i === FULL_WELCOME_TEXT.length) {
          clearInterval(typeWriter);
          setIsTerminalReady(true);
        }
      }, 50); // Typing speed
      return () => clearInterval(typeWriter);
    }, 1000); // Initial delay
    return () => clearTimeout(timer);
  }, []);

  const [errorMessage, setErrorMessage] = useState("");
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'retry' | 'error'>('connected');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(""); // Clear error
    
    if (!inputBuffer.trim()) return;
    
    // Command handling
    const cmd = inputBuffer.trim();
    if (cmd.startsWith('sudo') || cmd.startsWith('clear')) {
       setInputBuffer("");
       await processCommand(cmd);
       return;
    }

    // Guest Message Validation
    if (cmd.length < 10) {
      setErrorMessage("Minimum 10 characters required.");
      // Trigger shake animation via class
      return;
    }

    setShowVerification(true);
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
        name: userDetails.name,
        email: userDetails.email,
        message: inputBuffer, // Dynamic message from input
        timestamp: timestamp
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
      setInputBuffer(`reply ${selectedMessage.index} `);
    }
  };

  const handleDeleteClick = () => {
    if (selectedMessage) {
      if (confirm("DELETE MESSAGE: Are you sure? This action cannot be undone.")) {
        processCommand(`delete ${selectedMessage.index}`);
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
            {filteredMessages.map((msg, idx) => {
              const isActive = selectedMessage?.id === msg.id;
              return (
                <button
                  key={msg.id}
                  onClick={() => openMessage(msg)}
                  className={`w-full text-left p-3 border-b border-amber-500/10 hover:bg-amber-500/10 transition-colors ${isActive ? 'bg-amber-500/20 border-l-4 border-l-amber-500' : ''}`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex-1 min-w-0">
                      <div className={`font-mono text-sm truncate ${isActive ? 'text-amber-400 font-bold' : 'text-amber-500'}`}>
                         <span className="opacity-50 mr-2 text-xs">[{msg.index}]</span>
                         {msg.sender_name || "Unknown"} &lt;{msg.sender_email || "No Email"}&gt;
                      </div>
                      <div className="text-xs text-amber-500/50 truncate mt-1">
                        {parseMessage(msg.content)}
                      </div>
                    </div>
                    {!msg.is_read && <span className="text-[10px] bg-amber-500 text-black px-1 rounded font-bold ml-2">NEW</span>}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Panel */}
        <div className="w-2/3 p-4 overflow-y-auto bg-black/20">
          {selectedMessage ? (
            <MessageDetailView message={selectedMessage} onReply={handleReplyClick} onDelete={handleDeleteClick} />
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
          <div className="text-amber-500/70 text-[10px] mb-2 border-b border-amber-500/20 pb-1">
             ↑↓ to navigate | Enter to reply | ESC to exit
          </div>
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
            {/* Welcome Message */}
            <div className="text-cyber-cyan/80 mb-4 h-6">
              {welcomeText}
              {!isTerminalReady && <span className="animate-pulse">_</span>}
            </div>

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
            {!isTransmitting && !isProcessing && isTerminalReady && (
              <div className="flex gap-2 mt-2 relative">
                <span className="font-bold">&gt;</span>
                <form onSubmit={view === 'login' ? handleLoginSubmit : handleSubmit} className="flex-1" autoComplete="off">
                  <input
                    type={view === 'login' ? 'password' : 'text'}
                    value={inputBuffer}
                    onChange={(e) => setInputBuffer(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className={`w-full bg-transparent border-none outline-none font-mono text-sm ${
                      mode === 'admin' 
                        ? 'text-amber-500 placeholder-amber-800' 
                        : 'text-cyber-cyan placeholder-cyber-cyan/30 focus:border-b-2 focus:border-cyber-cyan'
                    } ${errorMessage ? 'animate-shake border-b-2 border-red-500 text-red-500' : ''}`}
                    placeholder={view === 'login' ? 'Enter Password' : "Type your message here..."}
                    autoFocus
                  />
                  {errorMessage && (
                    <div className="absolute top-full left-0 text-red-500 text-[10px] mt-1 font-bold animate-pulse">
                      [ERROR] {errorMessage}
                    </div>
                  )}
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

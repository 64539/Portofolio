"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Github, Instagram, Mail, Send, Terminal } from "lucide-react";
import CyberButton from "./ui/CyberButton";

export default function ContactHub() {
  const [command, setCommand] = useState("");
  const [history, setHistory] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!command.trim()) return;

    const newHistory = [...history, `> ${command}`];
    
    // Simulate processing
    setTimeout(() => {
      setHistory((prev) => [...prev, `[SYSTEM] Message encrypted and sent to Jabriel.`]);
    }, 500);

    setHistory(newHistory);
    setCommand("");
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Direct Links */}
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
            </motion.div>

            {/* Terminal Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="glass-panel rounded-lg overflow-hidden h-full flex flex-col">
                <div className="bg-black/80 p-2 flex items-center gap-2 border-b border-white/10">
                  <Terminal className="w-4 h-4 text-gray-500" />
                  <span className="text-xs font-mono text-gray-500">QUICK_COMMAND.exe</span>
                </div>
                <div className="p-4 flex-1 bg-black/60 font-mono text-sm overflow-y-auto min-h-[300px] flex flex-col">
                  <div className="text-gray-500 mb-4">
                    Type your message below to send a direct transmission.
                  </div>
                  <div className="flex-1 space-y-2 mb-4">
                    {history.map((line, i) => (
                      <div key={i} className={line.startsWith(">") ? "text-white" : "text-cyber-blue"}>
                        {line}
                      </div>
                    ))}
                  </div>
                  <form onSubmit={handleSubmit} className="flex gap-2 items-center mt-auto">
                    <span className="text-cyber-cyan">{`>`}</span>
                    <input
                      type="text"
                      value={command}
                      onChange={(e) => setCommand(e.target.value)}
                      className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-600 focus:ring-0"
                      placeholder="Enter transmission..."
                      autoFocus
                    />
                    <button type="submit" className="text-cyber-blue hover:text-white">
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Floating Hub (Mobile/Desktop persistent) */}
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

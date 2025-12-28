"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Terminal, MessageSquare, Cpu, Activity, Brain } from "lucide-react";
import { cn } from "@/lib/utils";

export default function DualEngineShowcase() {
  const [activeTab, setActiveTab] = useState<"logic" | "chat">("logic");

  return (
    <section className="py-20 relative z-10">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-cyber-cyan/30 bg-cyber-cyan/10 text-cyber-cyan mb-4">
            <Cpu className="w-4 h-4" />
            <span className="text-xs font-mono uppercase tracking-widest">Advanced AI Architecture</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            DUAL-ENGINE <span className="text-cyber-blue">INTELLIGENCE</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            A hybrid system combining low-level OS control with high-level conversational capabilities.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Visual Representation */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute inset-0 bg-cyber-blue/20 blur-3xl rounded-full" />
            <div className="relative glass-panel rounded-xl overflow-hidden border border-cyber-blue/30">
              <div className="flex border-b border-white/10 bg-black/50">
                <button
                  onClick={() => setActiveTab("logic")}
                  className={cn(
                    "flex-1 py-4 text-sm font-mono uppercase tracking-wider transition-colors flex items-center justify-center gap-2",
                    activeTab === "logic"
                      ? "bg-cyber-blue/20 text-cyber-blue border-b-2 border-cyber-blue"
                      : "text-gray-500 hover:text-gray-300"
                  )}
                >
                  <Terminal className="w-4 h-4" />
                  Terminal Logic
                </button>
                <button
                  onClick={() => setActiveTab("chat")}
                  className={cn(
                    "flex-1 py-4 text-sm font-mono uppercase tracking-wider transition-colors flex items-center justify-center gap-2",
                    activeTab === "chat"
                      ? "bg-cyber-cyan/20 text-cyber-cyan border-b-2 border-cyber-cyan"
                      : "text-gray-500 hover:text-gray-300"
                  )}
                >
                  <MessageSquare className="w-4 h-4" />
                  Cloud LLM
                </button>
              </div>

              <div className="h-[400px] bg-black/80 p-6 font-mono text-sm overflow-hidden relative">
                {activeTab === "logic" ? (
                  <div className="space-y-2">
                    <div className="text-green-500">$ init_system_core.py</div>
                    <div className="text-gray-400">[INFO] Loading neural modules...</div>
                    <div className="text-gray-400">[INFO] Connecting to local OS kernel...</div>
                    <div className="text-cyber-blue">[SUCCESS] Root access granted.</div>
                    <div className="text-gray-400 pl-4">
                      {`> Executing task: optimize_memory()`}
                      <br />
                      {`> Analyzing process tree...`}
                      <br />
                      {`> Terminating idle daemons...`}
                    </div>
                    <div className="text-cyber-blue">[DONE] Memory efficiency increased by 45%.</div>
                    <div className="animate-pulse text-green-500 mt-4">$ _</div>
                  </div>
                ) : (
                  <div className="flex flex-col h-full justify-end space-y-4">
                    <div className="flex justify-end">
                      <div className="bg-cyber-blue/20 text-cyber-blue px-4 py-2 rounded-lg rounded-tr-none max-w-[80%]">
                        Analyze current security posture and suggest improvements.
                      </div>
                    </div>
                    <div className="flex justify-start">
                      <div className="bg-cyber-cyan/20 text-cyber-cyan px-4 py-2 rounded-lg rounded-tl-none max-w-[80%]">
                        <div className="flex items-center gap-2 mb-1 text-xs opacity-70">
                          <Brain className="w-3 h-3" />
                          AI Agent
                        </div>
                        Scanning network topology... Detected potential vulnerability in port 8080. Suggesting implementation of rate limiting and WAF rules. Generative response ready.
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Description */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="glass-panel p-6 rounded-lg relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
                <Terminal className="w-24 h-24" />
              </div>
              <h3 className="text-xl font-bold text-cyber-blue mb-2">OS Manual Control</h3>
              <p className="text-gray-400 mb-4">
                Direct integration with operating system kernels allowing for automated system maintenance, security auditing, and resource optimization. Executes Python scripts for complex local tasks.
              </p>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-green-500" />
                  Real-time System Monitoring
                </li>
                <li className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-green-500" />
                  Automated Security Patches
                </li>
              </ul>
            </div>

            <div className="glass-panel p-6 rounded-lg relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
                <Brain className="w-24 h-24" />
              </div>
              <h3 className="text-xl font-bold text-cyber-cyan mb-2">Cloud LLM Intelligence</h3>
              <p className="text-gray-400 mb-4">
                Powered by advanced Large Language Models to process natural language, generate code, and analyze complex datasets. Acts as the cognitive interface for the system.
              </p>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-cyber-cyan" />
                  Natural Language Processing
                </li>
                <li className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-cyber-cyan" />
                  Context-Aware Problem Solving
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

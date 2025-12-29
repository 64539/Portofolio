"use client";

import { motion } from "framer-motion";
import { Bot, Braces, TestTubeDiagonal, Sparkles } from "lucide-react";

export default function DualEngineShowcase() {
  return (
    <section className="py-20 relative z-10">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-cyber-blue/30 bg-cyber-blue/10 text-cyber-blue mb-4">
            <Sparkles className="w-4 h-4" />
            <span className="text-xs font-mono uppercase tracking-widest">Human // AI_Synergy</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            HUMAN <span className="text-cyber-blue">{"//"}</span> AI_SYNERGY
          </h2>
          <p className="text-gray-400 max-w-3xl mx-auto">
            Clean analytical engineering meets automation for speed, quality, and security.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-panel p-6 rounded-lg"
          >
            <div className="flex items-center gap-3 mb-4">
              <Braces className="w-6 h-6 text-cyber-blue" />
              <h3 className="text-xl font-mono font-bold text-white">HUMAN LOGIC</h3>
            </div>
            <p className="text-gray-400 mb-6">
              Analytical thinking, clean code, and structured security-first architecture.
            </p>
            <div className="space-y-3 font-mono text-sm">
              <div className="flex items-center justify-between border border-white/5 bg-black/40 rounded p-3">
                <span className="text-gray-300">Design Patterns</span>
                <span className="text-cyber-blue">ACTIVE</span>
              </div>
              <div className="flex items-center justify-between border border-white/5 bg-black/40 rounded p-3">
                <span className="text-gray-300">Security Review</span>
                <span className="text-cyber-blue">ENFORCED</span>
              </div>
              <div className="flex items-center justify-between border border-white/5 bg-black/40 rounded p-3">
                <span className="text-gray-300">Clean Interfaces</span>
                <span className="text-cyber-blue">STRICT</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-panel p-6 rounded-lg flex items-center justify-center"
          >
            <motion.svg
              width="220"
              height="220"
              viewBox="0 0 220 220"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="max-w-full"
            >
              <defs>
                <linearGradient id="dna" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>

              <motion.g
                animate={{ rotate: 360 }}
                style={{ transformOrigin: "110px 110px" }}
                transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
              >
                <motion.path
                  d="M60 30 C 110 60, 110 160, 60 190"
                  fill="none"
                  stroke="url(#dna)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray="6 10"
                  animate={{ strokeDashoffset: [0, -80] }}
                  transition={{ duration: 4.5, repeat: Infinity, ease: "linear" }}
                />
                <motion.path
                  d="M160 30 C 110 60, 110 160, 160 190"
                  fill="none"
                  stroke="url(#dna)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray="6 10"
                  animate={{ strokeDashoffset: [0, 80] }}
                  transition={{ duration: 4.5, repeat: Infinity, ease: "linear" }}
                />
              </motion.g>

              {Array.from({ length: 10 }).map((_, i) => {
                const y = 40 + i * 16;
                const x1 = 72 + (i % 2 === 0 ? 10 : -6);
                const x2 = 148 + (i % 2 === 0 ? -10 : 6);

                return (
                  <motion.line
                    key={i}
                    x1={x1}
                    y1={y}
                    x2={x2}
                    y2={y}
                    stroke="url(#dna)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    initial={{ opacity: 0.2 }}
                    animate={{ opacity: [0.15, 0.75, 0.15] }}
                    transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.08 }}
                  />
                );
              })}

              <motion.circle
                cx="110"
                cy="110"
                r="86"
                fill="none"
                stroke="rgba(59,130,246,0.25)"
                strokeWidth="2"
                animate={{ opacity: [0.2, 0.45, 0.2] }}
                transition={{ duration: 2.2, repeat: Infinity }}
              />
            </motion.svg>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-panel p-6 rounded-lg"
          >
            <div className="flex items-center gap-3 mb-4">
              <Bot className="w-6 h-6 text-cyber-cyan" />
              <h3 className="text-xl font-mono font-bold text-white">AI AUTOMATION</h3>
            </div>
            <p className="text-gray-400 mb-6">
              Fast iteration through assisted coding, automation, and system-wide optimization.
            </p>
            <div className="space-y-3 font-mono text-sm">
              <div className="flex items-center justify-between border border-white/5 bg-black/40 rounded p-3">
                <span className="text-gray-300">Refactors</span>
                <span className="text-cyber-cyan">ACCELERATED</span>
              </div>
              <div className="flex items-center justify-between border border-white/5 bg-black/40 rounded p-3">
                <span className="text-gray-300">Automated Testing</span>
                <span className="text-cyber-cyan flex items-center gap-2">
                  <TestTubeDiagonal className="w-4 h-4" />
                  RUNNING
                </span>
              </div>
              <div className="flex items-center justify-between border border-white/5 bg-black/40 rounded p-3">
                <span className="text-gray-300">Latency</span>
                <span className="text-cyber-cyan">LOW</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

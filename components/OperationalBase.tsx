"use client";

import { motion } from "framer-motion";
import { MapPin, Radar } from "lucide-react";
import Terminal from "./Terminal";

function SystemDiagnosticRadar() {
  return (
    <div className="glass-panel rounded-lg overflow-hidden border border-cyber-blue/25 h-[320px] flex flex-col">
      <div className="px-4 py-3 bg-black/70 border-b border-white/10 flex items-center justify-between">
        <div className="font-mono text-xs text-cyber-blue">SYSTEM DIAGNOSTIC</div>
        <div className="flex items-center gap-2 text-cyber-blue animate-pulse">
          <Radar className="w-4 h-4" />
          <span className="font-mono text-[10px]">SCANNING</span>
        </div>
      </div>

      <div className="flex-1 bg-black/70 p-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="relative h-full flex items-center justify-center">
          <svg viewBox="0 0 200 200" className="w-full max-w-[240px]">
            <defs>
              <radialGradient id="ob_rg" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.28" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
              </radialGradient>
            </defs>

            <circle cx="100" cy="100" r="90" fill="url(#ob_rg)" />
            <circle cx="100" cy="100" r="90" fill="none" stroke="rgba(59,130,246,0.35)" strokeWidth="2" />
            <circle cx="100" cy="100" r="60" fill="none" stroke="rgba(59,130,246,0.22)" strokeWidth="1" />
            <circle cx="100" cy="100" r="30" fill="none" stroke="rgba(59,130,246,0.18)" strokeWidth="1" />

            <g className="radar-sweep" style={{ transformOrigin: "100px 100px" }}>
              <path d="M100 100 L100 10 A90 90 0 0 1 160 28 Z" fill="rgba(6,182,212,0.28)" />
              <line x1="100" y1="100" x2="100" y2="10" stroke="#06b6d4" strokeWidth="2" />
            </g>

            <circle cx="100" cy="100" r="2" fill="#06b6d4" />

            <circle cx="62" cy="78" r="2" className="radar-pulse" fill="#60a5fa" opacity="0.9" />
            <circle cx="138" cy="116" r="2" className="radar-pulse" fill="#06b6d4" opacity="0.9" />
            <circle cx="112" cy="58" r="2" className="radar-pulse" fill="#60a5fa" opacity="0.9" />
          </svg>
        </div>

        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between font-mono text-[10px] text-gray-500">
          <div>MODE: DIAGNOSTIC</div>
          <div className="text-cyber-blue">SIGNAL: OK</div>
        </div>
      </div>
    </div>
  );
}

export default function OperationalBase() {
  return (
    <section className="py-20 relative z-10">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-8 flex items-center justify-between"
        >
          <h2 className="text-3xl font-heading font-bold flex items-center gap-3">
            <MapPin className="text-cyber-blue" />
            <span className="text-white">OPERATIONAL BASE</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start"
        >
          <div className="lg:col-span-2">
            <SystemDiagnosticRadar />
          </div>
          <div className="lg:col-span-3">
            <Terminal />
          </div>
        </motion.div>
      </div>
    </section>
  );
}


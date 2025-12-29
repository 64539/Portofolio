"use client";

import { motion } from "framer-motion";
import { MapPin, Radar } from "lucide-react";
import dynamic from "next/dynamic";

const MapComponent = dynamic(() => import("./MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-black/80 text-cyber-blue font-mono animate-pulse">
      Loading Satellite Data...
    </div>
  ),
});

export default function CyberMap() {
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
          <div className="flex items-center gap-2 text-cyber-blue animate-pulse">
            <Radar className="w-5 h-5" />
            <span className="font-mono text-sm">SCANNING AREA</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative w-full h-[500px] rounded-lg overflow-hidden border border-cyber-blue/30 shadow-[0_0_20px_rgba(59,130,246,0.2)]"
        >
          <div className="absolute inset-0 z-10 pointer-events-none border-[20px] border-black/20" />
          <div className="absolute top-4 left-4 z-20 bg-black/80 backdrop-blur border border-cyber-blue/50 p-2 rounded text-xs font-mono text-cyber-blue">
            LAT: -6.1115<br />
            LNG: 106.8926
          </div>

          <div className="absolute top-4 right-4 z-20 glass-panel rounded-lg p-3">
            <svg viewBox="0 0 120 120" className="w-20 h-20">
              <defs>
                <radialGradient id="rg" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
                </radialGradient>
              </defs>
              <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(59,130,246,0.35)" strokeWidth="2" />
              <circle cx="60" cy="60" r="36" fill="none" stroke="rgba(59,130,246,0.25)" strokeWidth="1" />
              <circle cx="60" cy="60" r="18" fill="none" stroke="rgba(59,130,246,0.2)" strokeWidth="1" />
              <circle cx="60" cy="60" r="54" fill="url(#rg)" />
              <g className="radar-sweep">
                <path d="M60 60 L60 6 A54 54 0 0 1 96 18 Z" fill="rgba(6,182,212,0.35)" />
                <line x1="60" y1="60" x2="60" y2="6" stroke="#06b6d4" strokeWidth="2" />
              </g>
              <circle cx="60" cy="60" r="2" fill="#06b6d4" />
            </svg>
          </div>

          <MapComponent />
          
          <div className="absolute inset-0 z-10 pointer-events-none bg-[linear-gradient(rgba(59,130,246,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.1)_1px,transparent_1px)] bg-[size:50px_50px] opacity-20" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          <div className="glass-panel rounded-lg p-4 lg:col-span-1">
            <div className="font-mono text-xs text-gray-500">SECTOR</div>
            <div className="mt-2 font-mono text-sm text-gray-300">
              North Jakarta / Kebon Bawang
              <div className="mt-2 text-cyber-blue">CORE EDUCATION SECTOR: SMKN 12</div>
            </div>
          </div>
          <div className="glass-panel rounded-lg p-4 lg:col-span-2 overflow-hidden">
            <div className="font-mono text-xs text-gray-500 mb-2">SYSTEM LOG</div>
            <div className="system-log-wrap">
              <div className="system-log">
                <span className="text-cyber-blue">[OK]</span> Satellite link established // 
                <span className="text-cyber-cyan">[PING]</span> SMKN12 pulse online // 
                <span className="text-cyber-blue">[SCAN]</span> Sector sweep active // 
                <span className="text-cyber-cyan">[LOCK]</span> Secure channel verified // 
                <span className="text-cyber-blue">[OK]</span> Rendering tiles //
              </div>
              <div className="system-log" aria-hidden="true">
                <span className="text-cyber-blue">[OK]</span> Satellite link established // 
                <span className="text-cyber-cyan">[PING]</span> SMKN12 pulse online // 
                <span className="text-cyber-blue">[SCAN]</span> Sector sweep active // 
                <span className="text-cyber-cyan">[LOCK]</span> Secure channel verified // 
                <span className="text-cyber-blue">[OK]</span> Rendering tiles //
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

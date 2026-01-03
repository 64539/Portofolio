"use client";

import { motion } from "framer-motion";
import { Component, type ReactNode, useMemo, useState } from "react";
import { MapPin } from "lucide-react";
import dynamic from "next/dynamic";
import Terminal from "./Terminal";

const MapComponent = dynamic(() => import("./MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 z-0 flex items-center justify-center bg-black/80 text-cyber-blue font-mono text-xs animate-pulse">
      Loading Satellite Data...
    </div>
  ),
});

class PanelErrorBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { hasError: boolean }> {
  constructor(props: { fallback: ReactNode; children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

function RadarOverlay() {
  return (
    <div className="absolute top-5 right-5 z-20 w-[200px] h-[200px] glass-panel rounded-lg overflow-hidden border border-cyber-blue/30">
      <div className="h-full bg-black/70 p-3 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="relative h-full flex items-center justify-center">
          <svg viewBox="0 0 200 200" className="w-full h-full">
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
      </div>
    </div>
  );
}

export default function OperationalBase() {
  const [isExpanded, setIsExpanded] = useState(false);
  const mapFallback = useMemo(
    () => (
      <div className="absolute inset-0 z-0 flex items-center justify-center bg-black/80">
        <div className="font-mono text-xs text-gray-500">Satellite feed unavailable.</div>
      </div>
    ),
    []
  );

  return (
    <section id="base" className="py-20 relative z-10 mb-[30px]">
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
          className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_400px] gap-[15px] items-start"
        >
          <div
            className="relative rounded-lg overflow-hidden border border-cyber-blue/30 shadow-[0_0_20px_rgba(59,130,246,0.18)]"
            style={{ aspectRatio: "16 / 9" }}
          >
            <div className="absolute inset-0 z-10 pointer-events-none border-[18px] border-black/20" />
            <PanelErrorBoundary fallback={mapFallback}>
              <MapComponent />
            </PanelErrorBoundary>
            <div className="absolute inset-0 z-10 pointer-events-none bg-[linear-gradient(rgba(59,130,246,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.1)_1px,transparent_1px)] bg-[size:50px_50px] opacity-20" />
            <RadarOverlay />
          </div>

          <div className="flex lg:justify-end">
            <PanelErrorBoundary
              fallback={
                <div className="w-full lg:w-[400px] h-[300px] rounded-lg border border-white/10 bg-black/70 flex items-center justify-center">
                  <div className="font-mono text-xs text-gray-500">Terminal offline.</div>
                </div>
              }
            >
              <Terminal isExpanded={isExpanded} onExpand={() => setIsExpanded(true)} onCollapse={() => setIsExpanded(false)} />
            </PanelErrorBoundary>
          </div>
        </motion.div>
      </div>
    </section>
  );
}


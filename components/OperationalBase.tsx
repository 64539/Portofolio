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
          className="flex flex-col lg:flex-row gap-6 items-stretch"
        >
          <div
            className="flex-1 relative rounded-lg overflow-hidden border border-cyber-blue/30 shadow-[0_0_20px_rgba(59,130,246,0.18)] h-[400px] lg:h-[500px]"
          >
            <div className="absolute inset-0 z-10 pointer-events-none border-[18px] border-black/20" />
            <PanelErrorBoundary fallback={mapFallback}>
              <MapComponent />
            </PanelErrorBoundary>
            <div className="absolute inset-0 z-10 pointer-events-none bg-[linear-gradient(rgba(59,130,246,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.1)_1px,transparent_1px)] bg-[size:50px_50px] opacity-20" />
          </div>

          <div className="w-full lg:w-[400px] flex-shrink-0">
            <PanelErrorBoundary
              fallback={
                <div className="w-full h-[400px] lg:h-[500px] rounded-lg border border-white/10 bg-black/70 flex items-center justify-center">
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


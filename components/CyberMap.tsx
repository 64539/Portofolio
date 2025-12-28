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
          <MapComponent />
          
          {/* Overlay Grid */}
          <div className="absolute inset-0 z-10 pointer-events-none bg-[linear-gradient(rgba(59,130,246,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.1)_1px,transparent_1px)] bg-[size:50px_50px] opacity-20" />
        </motion.div>
      </div>
    </section>
  );
}

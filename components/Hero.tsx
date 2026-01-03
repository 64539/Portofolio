"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import GlitchText from "./ui/GlitchText";
import CyberButton from "./ui/CyberButton";
import NeuralBackground from "./NeuralBackground";
import { Shield, Cpu } from "lucide-react";

const SystemDiagnosticModal = dynamic(() => import("./SystemDiagnosticModal"), {
  ssr: false,
});

export default function Hero() {
  const [diagnosticOpen, setDiagnosticOpen] = useState(false);

  return (
    <section id="home" className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden pt-20">
      <NeuralBackground />

      <SystemDiagnosticModal open={diagnosticOpen} onClose={() => setDiagnosticOpen(false)} />
      
      <div className="z-10 container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-6 inline-flex items-center space-x-2 border border-cyber-blue/30 bg-black/50 backdrop-blur-sm px-4 py-1 rounded-full"
        >
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs font-mono text-cyber-blue tracking-widest uppercase">
            System Online // Security Protocols Active
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8"
        >
          <GlitchText
            text="JABRIEL SRIZKI ARJATI"
            as="h1"
            className="text-4xl md:text-6xl lg:text-7xl font-bold font-heading tracking-tight text-white mb-4"
          />
          <h2 className="text-xl md:text-2xl font-mono text-gray-400 mt-4 flex flex-col md:flex-row justify-center items-center gap-4">
            <span className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-cyber-blue" />
              Secure Fullstack Developer
            </span>
            <span className="hidden md:inline text-cyber-blue/50">|</span>
            <span className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-cyber-cyan" />
              AI Integrator
            </span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="max-w-2xl mx-auto mb-12"
        >
          <div className="glass-panel p-6 rounded-lg text-left font-mono text-sm text-gray-300 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyber-blue to-cyber-cyan" />
            <p className="mb-2">
              <span className="text-cyber-blue">root@jabriel:~$</span> cat user_profile.json
            </p>
            <pre className="whitespace-pre-wrap text-xs md:text-sm overflow-x-auto">
{`{
  "base": "North Jakarta, Indonesia (6.1115° S, 106.8926° E)",
  "education": "SMKN 12 Jakarta (Kebon Bawang)",
  "experience": [
    "Game Modding (2021)",
    "Red Hat Security",
    "Fullstack Dev & AI"
  ],
  "status": "Ready for Deployment"
}`}
            </pre>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-wrap justify-center gap-4"
        >
          <CyberButton onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
            Initiate Contact
          </CyberButton>
          <CyberButton variant="secondary" onClick={() => setDiagnosticOpen(true)}>
            View Protocol
          </CyberButton>
        </motion.div>
      </div>
      
      <div className="absolute bottom-10 left-10 hidden md:block">
        <div className="text-[10px] font-mono text-cyber-blue/50">
          <div>SYS.ID: 64539</div>
          <div>MEM: 32GB // OPTIMIZED</div>
        </div>
      </div>
    </section>
  );
}

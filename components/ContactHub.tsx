"use client";

import { motion } from "framer-motion";
import { Github, Instagram, Mail } from "lucide-react";

export default function ContactHub() {
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

          <div className="grid grid-cols-1 gap-8">
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

              <div className="glass-panel p-6 rounded-lg">
                <div className="font-mono text-xs text-gray-500 mb-2">QUICK COMMAND</div>
                <div className="font-mono text-sm text-gray-300">
                  Terminal tersedia di section OPERATIONAL BASE untuk kirim pesan cepat.
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

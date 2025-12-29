"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useEffect } from "react";

interface SystemDiagnosticModalProps {
  open: boolean;
  onClose: () => void;
}

export default function SystemDiagnosticModal({ open, onClose }: SystemDiagnosticModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center px-4"
        >
          <button
            type="button"
            aria-label="Close modal"
            onClick={onClose}
            className="absolute inset-0 bg-black/80"
          />
          <motion.div
            initial={{ y: 18, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 18, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-3xl glass-panel rounded-xl overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 py-3 bg-black/70 border-b border-white/10">
              <div className="font-mono text-xs text-gray-400">SYSTEM_DIAGNOSTIC.modal</div>
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded border border-white/10 bg-black/40 hover:border-cyber-blue/40"
                aria-label="Close"
              >
                <X className="w-4 h-4 text-gray-300" />
              </button>
            </div>
            <div className="p-6 bg-black/70 font-mono text-sm">
              <div className="text-cyber-blue mb-4">root@jabriel:~$ cat CV.sys</div>
              <div className="rounded-lg border border-white/10 bg-black/60 p-4 text-gray-300">
                <pre className="whitespace-pre-wrap leading-relaxed text-xs md:text-sm">{`{
  "name": "Jabriel Srizki Arjati",
  "role": "Secure Fullstack Developer & AI Integrator",
  "base": "North Jakarta, Indonesia (6.1115° S, 106.8926° E)",
  "core_education_sector": "SMKN 12 Jakarta (Kebon Bawang)",
  "timeline": [
    { "year": 2021, "age": 13, "focus": "Game Modding" },
    { "year": 2022, "focus": "Red Hat Security" },
    { "year": 2023, "focus": "Fullstack Engineering" },
    { "year": 2024, "focus": "AI Integration" }
  ],
  "strengths": [
    "Security-first architecture",
    "Low-latency UI engineering",
    "API design & integration",
    "AI-driven automation workflows"
  ],
  "status": "Open for collaboration"
}`}</pre>
              </div>
              <div className="mt-4 text-gray-500 text-xs">Press ESC to close.</div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}


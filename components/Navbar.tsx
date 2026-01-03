"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Terminal, Shield, Cpu, Globe, Mail } from "lucide-react";
import Link from "next/link";

const navItems = [
  { name: "HOME", href: "#home", icon: Terminal },
  { name: "SKILLS", href: "#skills", icon: Cpu },
  { name: "PROJECTS", href: "#projects", icon: Globe },
  { name: "BASE", href: "#base", icon: Shield },
  { name: "CONTACT", href: "#contact", icon: Mail },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-black/80 backdrop-blur-md border-b border-white/10" : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded bg-cyber-blue/10 border border-cyber-blue/50 flex items-center justify-center group-hover:bg-cyber-blue/20 transition-colors">
                <span className="font-mono font-bold text-cyber-blue">J</span>
              </div>
              <span className="font-heading font-bold text-lg tracking-wider text-white group-hover:text-cyber-blue transition-colors">
                JABRIEL<span className="text-cyber-blue">.DEV</span>
              </span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="font-mono text-xs text-gray-400 hover:text-cyber-blue transition-colors flex items-center gap-2 group"
                >
                  <item.icon className="w-3 h-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300 text-cyber-blue" />
                  {item.name}
                </Link>
              ))}
              <a
                href="/cv.pdf" // Placeholder CV link
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-1.5 rounded border border-cyber-blue/30 text-xs font-mono text-cyber-blue hover:bg-cyber-blue/10 transition-colors"
              >
                RESUME
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-gray-300 hover:text-white"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="fixed top-16 left-0 right-0 z-40 bg-black/95 backdrop-blur-xl border-b border-white/10 md:hidden overflow-hidden"
          >
            <div className="container mx-auto px-4 py-6 flex flex-col gap-4">
              {navItems.map((item, i) => (
                <motion.div
                  key={item.name}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/5 transition-colors group"
                  >
                    <div className="p-2 rounded bg-white/5 group-hover:bg-cyber-blue/10 group-hover:text-cyber-blue transition-colors text-gray-400">
                      <item.icon className="w-5 h-5" />
                    </div>
                    <span className="font-mono text-sm text-gray-300 group-hover:text-white">
                      {item.name}
                    </span>
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="pt-4 border-t border-white/10"
              >
                <a
                  href="/cv.pdf"
                  className="flex items-center justify-center w-full py-3 rounded border border-cyber-blue/30 text-sm font-mono text-cyber-blue hover:bg-cyber-blue/10 transition-colors"
                >
                  DOWNLOAD RESUME
                </a>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

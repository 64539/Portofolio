"use client";

import { motion } from "framer-motion";
import { Github, Mail, Instagram, ArrowUpRight } from "lucide-react";
import Terminal from "./Terminal";

export default function ContactHub() {
  const socials = [
    {
      name: "GitHub",
      icon: <Github className="w-6 h-6" />,
      href: "https://github.com/64539",
      color: "hover:text-purple-400",
      bg: "group-hover:bg-purple-500/10",
      border: "group-hover:border-purple-500/50"
    },
    {
      name: "Instagram",
      icon: <Instagram className="w-6 h-6" />,
      href: "https://www.instagram.com/codex24434?igsh=MTYxZXV6djR6c2NmMA==",
      color: "hover:text-pink-400",
      bg: "group-hover:bg-pink-500/10",
      border: "group-hover:border-pink-500/50"
    },
    {
      name: "Email",
      icon: <Mail className="w-6 h-6" />,
      href: "mailto:jabrielsrizkiarjati2311@gmail.com",
      color: "hover:text-blue-400",
      bg: "group-hover:bg-blue-500/10",
      border: "group-hover:border-blue-500/50"
    }
  ];

  return (
    <section className="py-20 relative overflow-hidden" id="contact">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {socials.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`group flex flex-col items-center justify-center p-8 border border-cyber-blue/20 bg-black/40 backdrop-blur-sm rounded-lg transition-all duration-300 hover:border-opacity-100 ${social.border} ${social.bg}`}
              >
                <div className={`mb-4 transition-colors duration-300 ${social.color}`}>
                  {social.icon}
                </div>
                <h3 className={`text-lg font-mono font-bold mb-2 transition-colors duration-300 ${social.color}`}>
                  {social.name}
                </h3>
                <div className="text-xs font-mono text-gray-500 group-hover:text-gray-300 flex items-center gap-1">
                  CONNECT <ArrowUpRight className="w-3 h-3" />
                </div>
              </a>
            ))}
          </div>

          <div className="mt-16">
            <Terminal />
          </div>
        </div>
      </div>
    </section>
  );
}

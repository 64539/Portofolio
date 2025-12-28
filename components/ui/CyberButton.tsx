"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface CyberButtonProps extends HTMLMotionProps<"button"> {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
}

export default function CyberButton({ children, className, variant = "primary", ...props }: CyberButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "relative px-6 py-2 font-mono text-sm font-bold uppercase tracking-wider transition-all duration-300",
        "border border-cyber-blue/50 hover:border-cyber-cyan hover:text-cyber-cyan hover:shadow-[0_0_15px_rgba(6,182,212,0.5)]",
        "bg-black/50 backdrop-blur-sm",
        "before:absolute before:top-0 before:left-0 before:w-2 before:h-2 before:border-t-2 before:border-l-2 before:border-cyber-blue before:transition-all before:duration-300 group-hover:before:border-cyber-cyan",
        "after:absolute after:bottom-0 after:right-0 after:w-2 after:h-2 after:border-b-2 after:border-r-2 after:border-cyber-blue after:transition-all after:duration-300 group-hover:after:border-cyber-cyan",
        variant === "primary" ? "text-cyber-blue" : "text-gray-400",
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}

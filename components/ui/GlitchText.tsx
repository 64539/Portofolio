"use client";

import { cn } from "@/lib/utils";
import React from "react";

interface GlitchTextProps {
  text: string;
  className?: string;
  as?: React.ElementType;
}

export default function GlitchText({ text, className, as: Component = "h1" }: GlitchTextProps) {
  return (
    <Component className={cn("relative inline-block group", className)}>
      <span className="relative z-10">{text}</span>
      <span className="absolute top-0 left-0 -z-10 w-full h-full text-cyber-blue opacity-0 group-hover:opacity-100 group-hover:animate-glitch translate-x-[2px]">
        {text}
      </span>
      <span className="absolute top-0 left-0 -z-10 w-full h-full text-cyber-cyan opacity-0 group-hover:opacity-100 group-hover:animate-glitch translate-x-[-2px] delay-100">
        {text}
      </span>
    </Component>
  );
}

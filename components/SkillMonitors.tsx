"use client";

import { motion } from "framer-motion";
import { Monitor, Code, Database, Brain, Lock } from "lucide-react";

const skills = [
  {
    category: "Frontend Architecture",
    icon: Monitor,
    color: "text-blue-400",
    items: [
      { name: "Next.js", level: 85 },
      { name: "React", level: 90 },
      { name: "Tailwind CSS", level: 95 },
      { name: "Bootstrap", level: 85 },
    ],
  },
  {
    category: "Backend Systems",
    icon: Database,
    color: "text-green-400",
    items: [
      { name: "Node.js", level: 90 },
      { name: "Express", level: 85 },
      { name: "REST API", level: 90 },
    ],
  },
  {
    category: "AI Integration",
    icon: Brain,
    color: "text-purple-400",
    items: [
      { name: "Dual-Engine AI", level: 70 },
      { name: "PyTorch", level: 75 },
      { name: "OS Control", level: 65 },
    ],
  },
  {
    category: "Security Protocols",
    icon: Lock,
    color: "text-red-400",
    items: [
      { name: "Hardened Arch", level: 79 },
      { name: "Vuln Research", level: 65 },
      { name: "Red Hat Sec", level: 70 },
    ],
  },
];

const SegmentedBar = ({ level, colorClass }: { level: number; colorClass: string }) => {
  const segments = 20;
  const filledSegments = Math.round((level / 100) * segments);

  return (
    <div className="flex gap-1">
      {Array.from({ length: segments }).map((_, i) => (
        <div
          key={i}
          className={`h-2 w-full rounded-sm transition-all duration-300 ${
            i < filledSegments
              ? `bg-current ${colorClass} shadow-[0_0_5px_currentColor]`
              : "bg-gray-800"
          }`}
        />
      ))}
    </div>
  );
};

export default function SkillMonitors() {
  return (
    <section id="skills" className="py-20 relative z-10">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="text-3xl font-heading font-bold mb-2 flex items-center gap-3">
            <Code className="text-cyber-blue" />
            <span className="text-white">SYSTEM CAPABILITIES</span>
          </h2>
          <div className="h-px w-full bg-gradient-to-r from-cyber-blue to-transparent opacity-50" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {skills.map((skill, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass-panel p-6 rounded-lg border-l-4 border-l-cyber-blue"
            >
              <div className="flex items-center gap-3 mb-6">
                <skill.icon className={`w-6 h-6 ${skill.color}`} />
                <h3 className="text-xl font-mono font-bold uppercase tracking-wider">
                  {skill.category}
                </h3>
              </div>

              <div className="space-y-6">
                {skill.items.map((item, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-sm font-mono mb-2">
                      <span className="text-gray-300">{item.name}</span>
                      <span className={skill.color}>{item.level}%</span>
                    </div>
                    <div className={skill.color}>
                      <SegmentedBar level={item.level} colorClass={skill.color} />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

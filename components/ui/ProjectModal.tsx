'use client';

import { useEffect, useRef, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X, ExternalLink, Activity, Shield, Sparkles } from 'lucide-react';
import { cn } from './Button';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Button } from './Button';

export interface ProjectData {
  id: number;
  title: string;
  description: string;
  tags: string[];
  image: string;
  link: string;
  bullets: { label: string; text: string }[];
  detailed: {
    problem: string;
    solution: string;
    result: string;
  };
  performance: {
    lighthouse: number;
    accessibility: number;
    bestPractices: number;
  };
}

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: ProjectData | null;
}

export function ProjectModal({ isOpen, onClose, project }: ProjectModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) {
      onClose();
    }
  };

  if (!isOpen || !project) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div
          ref={overlayRef}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 md:p-6"
          onClick={handleOverlayClick}
          aria-modal="true"
          role="dialog"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative w-full max-w-4xl rounded-2xl border border-gray-800 bg-[#0B0F14] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header / Close Button */}
            <div className="absolute top-4 right-4 z-10">
              <button
                onClick={onClose}
                className="rounded-full bg-black/50 p-2 text-gray-400 hover:bg-white/10 hover:text-white transition-colors backdrop-blur-sm border border-white/10"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            <div className="overflow-y-auto custom-scrollbar">
              {/* Image Section */}
              <div className="relative w-full aspect-[16/9] bg-neutral-900 overflow-hidden">
                <Image
                  src={project.image}
                  alt={`${project.title} Preview`}
                  fill
                  className="object-contain"
                  priority
                />
                
                {/* Title Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F14] via-transparent to-transparent opacity-80" />
                
                {/* Title Overlay */}
                <div className="absolute bottom-0 left-0 p-6 md:p-10 w-full">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="flex flex-wrap gap-2 mb-3">
                      {project.tags.map(tag => (
                        <span key={tag} className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/20 text-primary border border-primary/20 backdrop-blur-sm">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">{project.title}</h2>
                  </motion.div>
                </div>
              </div>

              <div className="p-6 md:p-10 space-y-10">
                {/* Summary & Performance */}
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="md:col-span-2 space-y-6">
                    <p className="text-gray-300 text-lg leading-relaxed">
                      {project.description}
                    </p>
                    
                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="block">
                      <Button size="lg" className="w-full md:w-auto gap-2 group">
                        Visit Live Website
                        <ExternalLink size={18} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      </Button>
                    </a>
                  </div>

                  <div className="bg-[#151A21] rounded-xl border border-gray-800 p-5 space-y-4 h-fit">
                    <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Performance</h4>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-gray-300">
                        <Activity size={16} className="text-success" />
                        <span>Lighthouse</span>
                      </div>
                      <span className="text-xl font-bold text-success">{project.performance.lighthouse}%</span>
                    </div>
                    
                    <div className="w-full bg-gray-800 rounded-full h-1.5">
                      <div className="bg-success h-1.5 rounded-full" style={{ width: `${project.performance.lighthouse}%` }}></div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-gray-300">
                        <Shield size={16} className="text-primary" />
                        <span>Best Practices</span>
                      </div>
                      <span className="text-xl font-bold text-primary">{project.performance.bestPractices}%</span>
                    </div>
                    
                    <div className="w-full bg-gray-800 rounded-full h-1.5">
                      <div className="bg-primary h-1.5 rounded-full" style={{ width: `${project.performance.bestPractices}%` }}></div>
                    </div>
                  </div>
                </div>

                {/* Problem / Solution / Result Grid */}
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-[#151A21]/50 p-6 rounded-xl border border-gray-800/50 hover:border-gray-700 transition-colors">
                    <div className="mb-4 inline-flex p-2.5 rounded-lg bg-red-500/10 text-red-400">
                      <Activity size={20} />
                    </div>
                    <h4 className="text-lg font-bold text-white mb-2">The Problem</h4>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {project.detailed.problem}
                    </p>
                  </div>

                  <div className="bg-[#151A21]/50 p-6 rounded-xl border border-gray-800/50 hover:border-gray-700 transition-colors">
                    <div className="mb-4 inline-flex p-2.5 rounded-lg bg-blue-500/10 text-blue-400">
                      <Sparkles size={20} />
                    </div>
                    <h4 className="text-lg font-bold text-white mb-2">The Solution</h4>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {project.detailed.solution}
                    </p>
                  </div>

                  <div className="bg-[#151A21]/50 p-6 rounded-xl border border-gray-800/50 hover:border-gray-700 transition-colors">
                    <div className="mb-4 inline-flex p-2.5 rounded-lg bg-green-500/10 text-green-400">
                      <Activity size={20} />
                    </div>
                    <h4 className="text-lg font-bold text-white mb-2">The Result</h4>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {project.detailed.result}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}

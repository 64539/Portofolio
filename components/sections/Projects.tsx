'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/Card';
import { ExternalLink, Zap } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ProjectModal, ProjectData } from '@/components/ui/ProjectModal';

const projects: ProjectData[] = [
  {
    id: 1,
    title: "Anak Kampoeng",
    description: "A robust internal content management system for managing automotive education and gallery content.",
    tags: ["Next.js", "Drizzle ORM", "UploadThing"],
    image: "/images/anak-kampoeng.png",
    link: "https://anak-kampoeng.vercel.app/",
    bullets: [], // Keeping for compatibility but moving detailed text to 'detailed' prop
    detailed: {
      problem: "The client struggled with inefficient multimedia management and data desynchronization between the admin panel and public site, causing content to be outdated.",
      solution: "I built a dual-mode upload system with real-time server-side revalidation using Next.js Server Actions, ensuring instant updates without complex infrastructure.",
      result: "Achieved zero-refresh content updates and streamlined the mobile workflow, allowing admins to manage the gallery from anywhere."
    },
    performance: {
      lighthouse: 98,
      accessibility: 100,
      bestPractices: 100
    }
  },
  {
    id: 2,
    title: "Synthesize Axonova",
    description: "A high-performance digital ecosystem for a C-Suite startup with immersive neural navigation.",
    tags: ["Next.js", "Framer Motion", "TypeScript"],
    image: "/images/synthesize-axonova.png",
    link: "https://synthesize-axonova.vercel.app/",
    bullets: [],
    detailed: {
      problem: "The startup needed a unique digital identity that reflected their high-tech nature, but complex animations were causing layout clipping and poor performance.",
      solution: "Implemented a responsive neural flow interface with fluid typography and optimized Framer Motion animations to maintain 60fps across devices.",
      result: "Delivered a pixel-perfect, immersive user journey with an optimized 2s load time, significantly enhancing brand credibility."
    },
    performance: {
      lighthouse: 96,
      accessibility: 95,
      bestPractices: 100
    }
  }
];

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (project: ProjectData) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <section id="projects" className="section-padding bg-surface/30">
      <div className="container-custom">
        <div className="mb-16 md:mb-24 text-center max-w-2xl mx-auto">
          <h2 className="heading-lg mb-4 text-white">Featured Projects</h2>
          <p className="text-body mx-auto">
            Real-world solutions delivering tangible business results.
          </p>
        </div>

        <div className="space-y-32">
          {projects.map((project, index) => (
            <div 
              key={project.id} 
              className={`flex flex-col lg:flex-row gap-8 md:gap-16 items-center group ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
            >
              
              {/* Project Image (60%) */}
              <div className="w-full lg:w-[60%] relative">
                <div 
                  className="relative aspect-[16/10] rounded-xl overflow-hidden shadow-2xl border border-gray-800 bg-gray-900 transition-transform duration-500 group-hover:scale-[1.02] cursor-pointer"
                  onClick={() => openModal(project)}
                >
                  <Image 
                    src={project.image} 
                    alt={`${project.title} Preview`}
                    fill
                    className="object-cover"
                    priority={index === 0}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 800px"
                  />
                  
                  {/* Overlay for hover effect */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                  
                  {/* View Details Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button variant="secondary" className="shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      View Details
                    </Button>
                  </div>
                </div>

                {/* Floating Lighthouse Badge */}
                <div className="absolute -bottom-5 -right-5 bg-[#0B0F14] border border-gray-800 p-3 rounded-lg shadow-xl flex items-center gap-3 z-10 animate-in fade-in slide-in-from-bottom-2 duration-700 delay-300">
                   <div className="bg-success/10 p-1.5 rounded-full text-success">
                      <Zap size={18} fill="currentColor" />
                   </div>
                   <div>
                      <div className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Performance</div>
                      <div className="text-lg font-bold text-white leading-none">{project.performance.lighthouse}%</div>
                   </div>
                </div>
              </div>

              {/* Project Details (40%) */}
              <div className="w-full lg:w-[40%] space-y-6">
                <div>
                  <h3 className="text-3xl font-bold text-white mb-3 group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed text-lg mb-6">
                    {project.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-8">
                    {project.tags.map(tag => (
                      <span key={tag} className="text-sm font-medium px-3 py-1.5 rounded bg-gray-900 text-gray-300 border border-gray-800">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <Button 
                  onClick={() => openModal(project)} 
                  variant="outline" 
                  className="w-full md:w-auto gap-2 group border-gray-700 hover:border-gray-500"
                >
                  View Case Study 
                  <ExternalLink size={16} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ProjectModal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        project={selectedProject} 
      />
    </section>
  );
}

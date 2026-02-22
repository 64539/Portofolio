import Hero from '@/components/sections/Hero';
import Projects from '@/components/sections/Projects';
import Services from '@/components/sections/Services';
import Process from '@/components/sections/Process';
import WhyChooseMe from '@/components/sections/WhyChooseMe';
import Contact from '@/components/sections/Contact';
import { Github, Instagram, Mail } from 'lucide-react';

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      <Hero />
      <Projects />
      <Services />
      <Process />
      <WhyChooseMe />
      <Contact />
      
      {/* Simple Footer */}
      <footer className="py-12 border-t border-gray-800/50 mt-auto bg-surface/20">
        <div className="container-custom flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-sm text-gray-500">
            <p>&copy; {new Date().getFullYear()} Jabriel Srizki Arjati. All rights reserved.</p>
          </div>
          
          <div className="flex items-center gap-6">
            <a 
              href="mailto:jabrielsrizkiarjati2311@gmail.com" 
              className="text-gray-400 hover:text-primary transition-colors flex items-center gap-2 text-sm"
            >
              <Mail size={16} />
              <span>jabrielsrizkiarjati2311@gmail.com</span>
            </a>
            
            <div className="h-4 w-[1px] bg-gray-800 hidden md:block"></div>
            
            <div className="flex gap-4">
              <a 
                href="https://github.com/64539" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="GitHub"
              >
                <Github size={20} />
              </a>
              <a 
                href="https://www.instagram.com/codex24434" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

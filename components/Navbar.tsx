import Link from 'next/link';
import { Button } from './ui/Button';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-md border-b border-white/5">
      <div className="container-custom flex items-center justify-between h-16">
        <Link href="/" className="text-xl font-bold tracking-tight text-white">
          Jabriel<span className="text-primary">.dev</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-8">
          <Link href="#projects" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
            Projects
          </Link>
          <Link href="#services" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
            Services
          </Link>
          <Link href="#process" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
            Process
          </Link>
          <Link href="#contact">
            <Button variant="primary" size="sm">
              Start Project
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}

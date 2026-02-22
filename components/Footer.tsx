import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-background py-12">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <Link href="/" className="text-lg font-bold text-white">
              Jabriel<span className="text-primary">.dev</span>
            </Link>
            <p className="mt-2 text-sm text-gray-500">
              © {new Date().getFullYear()} Jabriel Srizki Arjati. All rights reserved.
            </p>
          </div>
          
          <div className="flex gap-6">
            <Link href="https://github.com/64539" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
              GitHub
            </Link>
            <Link href="https://www.instagram.com/codex24434" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
              Instagram
            </Link>
            <Link href="mailto:jabrielsrizkiarjati2311@gmail.com" className="text-gray-400 hover:text-white transition-colors">
              Email
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

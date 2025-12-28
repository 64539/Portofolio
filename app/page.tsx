import Hero from "@/components/Hero";
import SkillMonitors from "@/components/SkillMonitors";
import DualEngineShowcase from "@/components/DualEngineShowcase";
import CyberMap from "@/components/CyberMap";
import ContactHub from "@/components/ContactHub";

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-x-hidden">
      <Hero />
      <SkillMonitors />
      <DualEngineShowcase />
      <CyberMap />
      <ContactHub />
      
      <footer className="py-8 text-center text-xs font-mono text-gray-600 relative z-10 bg-black">
        <div className="container mx-auto px-4">
          <p>© {new Date().getFullYear()} JABRIEL SRIZKI ARJATI. ALL RIGHTS RESERVED.</p>
          <p className="mt-2">SYSTEM_VERSION: 2.0.45 // SECURE_CONNECTION</p>
        </div>
      </footer>
    </main>
  );
}

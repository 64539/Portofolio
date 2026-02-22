import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ArrowRight, Github, Instagram, Code2, Layers, Zap } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative min-h-[95vh] flex items-center pt-24 pb-20 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
      
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/10 rounded-full blur-[120px] -z-10 opacity-50" />
      
      <div className="container-custom grid lg:grid-cols-2 gap-12 lg:gap-20 items-center relative z-10">
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm text-primary backdrop-blur-sm">
            <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse shadow-[0_0_10px_#00BFFF]"></span>
            Available for new projects
          </div>
          
          <div className="relative">
             <div className="absolute -inset-x-4 -inset-y-4 bg-primary/5 blur-2xl rounded-full opacity-0 lg:opacity-100 transition-opacity duration-1000"></div>
             <h1 className="heading-xl text-white relative">
               I Build <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary animate-gradient">Fast</span> and <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-success">Secure</span> Websites
             </h1>
          </div>
          
          <p className="text-body text-lg md:text-xl">
            Transform your business with high-converting landing pages and robust fullstack applications. 
            <span className="text-gray-200 font-medium"> Secure, scalable, and ready to launch.</span>
          </p>
          
          <div className="flex flex-wrap gap-4 pt-4">
            <Link href="#contact">
              <Button size="lg" className="group shadow-[0_0_20px_rgba(0,191,255,0.3)] hover:shadow-[0_0_30px_rgba(0,191,255,0.5)] transition-shadow">
                Start Your Project
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="#projects">
              <Button variant="outline" size="lg" className="bg-transparent backdrop-blur-sm">
                View My Work
              </Button>
            </Link>
          </div>

          <div className="flex items-center gap-8 pt-10 border-t border-gray-800/50">
            <div className="flex flex-col gap-1">
               <span className="text-2xl font-bold text-white">2+</span>
               <span className="text-xs text-gray-500 uppercase tracking-wider">Production Projects</span>
            </div>
            <div className="w-[1px] h-10 bg-gray-800"></div>
            <div className="flex flex-col gap-1">
               <span className="text-2xl font-bold text-white">3+</span>
               <span className="text-xs text-gray-500 uppercase tracking-wider">Years Coding</span>
            </div>
            <div className="w-[1px] h-10 bg-gray-800"></div>
            <div className="flex flex-col gap-1">
               <span className="text-2xl font-bold text-success">98%</span>
               <span className="text-xs text-gray-500 uppercase tracking-wider">Lighthouse Score</span>
            </div>
          </div>
        </div>

        {/* Animated Visual */}
        <div className="relative flex items-center justify-center min-h-[400px] lg:min-h-[600px] animate-in fade-in zoom-in duration-1000 delay-200">
          
          {/* Animated Gradient Orb */}
          <div className="absolute w-[300px] h-[300px] lg:w-[500px] lg:h-[500px] bg-gradient-to-br from-primary/20 via-secondary/10 to-purple-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
          
          {/* Central Visual */}
          <div className="relative z-10 w-full max-w-md aspect-square relative">
             <div className="absolute inset-0 border border-gray-700/30 rounded-full animate-[spin_60s_linear_infinite]"></div>
             <div className="absolute inset-[10%] border border-gray-700/30 rounded-full animate-[spin_40s_linear_infinite_reverse]"></div>
             <div className="absolute inset-[20%] border border-gray-700/30 rounded-full animate-[spin_20s_linear_infinite]"></div>
             
             {/* Floating Badges */}
             <div className="absolute top-1/4 -right-4 lg:-right-12 bg-[#151A21] border border-gray-800 p-4 rounded-xl shadow-2xl backdrop-blur-md animate-[float_6s_ease-in-out_infinite]">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-primary/20 rounded-lg text-primary">
                      <Code2 size={24} />
                   </div>
                   <div>
                      <div className="text-xs text-gray-400">Stack</div>
                      <div className="font-bold text-white">Next.js + TS</div>
                   </div>
                </div>
             </div>

             <div className="absolute bottom-1/4 -left-4 lg:-left-12 bg-[#151A21] border border-gray-800 p-4 rounded-xl shadow-2xl backdrop-blur-md animate-[float_8s_ease-in-out_infinite_reverse]">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-success/20 rounded-lg text-success">
                      <Zap size={24} />
                   </div>
                   <div>
                      <div className="text-xs text-gray-400">Speed</div>
                      <div className="font-bold text-white">Lightning Fast</div>
                   </div>
                </div>
             </div>

             <div className="absolute bottom-0 right-10 bg-[#151A21] border border-gray-800 p-4 rounded-xl shadow-2xl backdrop-blur-md animate-[float_7s_ease-in-out_infinite_1s]">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-secondary/20 rounded-lg text-secondary">
                      <Layers size={24} />
                   </div>
                   <div>
                      <div className="text-xs text-gray-400">Architecture</div>
                      <div className="font-bold text-white">Scalable</div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}

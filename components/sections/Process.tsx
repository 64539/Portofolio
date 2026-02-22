import { MessageSquare, PenTool, Code2, Rocket } from 'lucide-react';

const steps = [
  {
    id: 1,
    title: 'Discussion',
    description: 'We meet to discuss your goals, target audience, and requirements to ensure we are a perfect fit.',
    icon: <MessageSquare className="h-6 w-6 text-primary" />
  },
  {
    id: 2,
    title: 'Design',
    description: 'I create modern, conversion-focused mockups that align with your brand identity.',
    icon: <PenTool className="h-6 w-6 text-secondary" />
  },
  {
    id: 3,
    title: 'Development',
    description: 'I build your site using the latest secure technologies like Next.js and TypeScript.',
    icon: <Code2 className="h-6 w-6 text-success" />
  },
  {
    id: 4,
    title: 'Deployment',
    description: 'We launch your site to the world, ensuring everything runs smoothly and fast.',
    icon: <Rocket className="h-6 w-6 text-white" />
  }
];

export default function Process() {
  return (
    <section className="section-padding bg-surface/30 border-y border-gray-800/50">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="heading-lg mb-4 text-white">How We Work Together</h2>
          <p className="text-body mx-auto">
            A simple, transparent process designed to get your project live without the headaches.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden lg:block absolute top-12 left-0 w-full h-0.5 bg-gray-800 -z-10" />

          {steps.map((step, index) => (
            <div key={step.id} className="relative flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-[#0B0F14] border-4 border-gray-800 flex items-center justify-center mb-6 z-10 transition-colors hover:border-primary/50">
                <div className="w-16 h-16 rounded-full bg-gray-900 flex items-center justify-center">
                  {step.icon}
                </div>
              </div>
              
              <div className="absolute top-8 right-0 -mr-[50%] hidden lg:block text-gray-800">
                 {/* Arrow placeholder if needed, currently using simple line */}
              </div>

              <h3 className="text-xl font-bold text-white mb-3">
                <span className="text-primary mr-2">0{step.id}.</span>
                {step.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed max-w-[250px]">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

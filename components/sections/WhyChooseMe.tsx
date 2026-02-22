import { Card } from '@/components/ui/Card';
import { Clock, ShieldCheck, Code2 } from 'lucide-react';

export default function WhyChooseMe() {
  return (
    <section className="section-padding bg-surface/10">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="heading-lg mb-4 text-white">Why Work With Me</h2>
          <p className="text-body mx-auto">
            I don't just write code; I deliver reliable business solutions.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="bg-[#151A21]/50 border-gray-800 p-8 hover:border-primary/30 transition-all duration-300 group">
            <div className="mb-6 inline-flex p-4 rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform duration-300">
              <Clock className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Fast Delivery</h3>
            <p className="text-gray-400 leading-relaxed mb-4">
              I value your time. Expect responses within 24 hours and strict adherence to project timelines.
            </p>
            <div className="text-sm font-semibold text-primary">
              Average delivery time: 2 weeks
            </div>
          </Card>

          <Card className="bg-[#151A21]/50 border-gray-800 p-8 hover:border-secondary/30 transition-all duration-300 group">
            <div className="mb-6 inline-flex p-4 rounded-xl bg-secondary/10 text-secondary group-hover:scale-110 transition-transform duration-300">
              <ShieldCheck className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Secure Architecture</h3>
            <p className="text-gray-400 leading-relaxed mb-4">
              Security isn't an afterthought. I build with best practices to protect your data and your customers.
            </p>
            <div className="text-sm font-semibold text-secondary">
              100% Secure Auth & Database
            </div>
          </Card>

          <Card className="bg-[#151A21]/50 border-gray-800 p-8 hover:border-success/30 transition-all duration-300 group">
            <div className="mb-6 inline-flex p-4 rounded-xl bg-success/10 text-success group-hover:scale-110 transition-transform duration-300">
              <Code2 className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Clean Code Standards</h3>
            <p className="text-gray-400 leading-relaxed mb-4">
              Maintainable, scalable code that doesn't break when you need to grow. Built for the long term.
            </p>
            <div className="text-sm font-semibold text-success">
              98+ Lighthouse Performance Score
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}

'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Check, ArrowRight, Code, Layout, Globe, Server } from 'lucide-react';
import Link from 'next/link';
import { PACKAGES, formatCurrency } from '@/lib/packages';

// Map icons to package IDs for display
const icons = {
  'umkm-starter': <Layout className="h-8 w-8 text-primary" />,
  'business-website': <Globe className="h-8 w-8 text-secondary" />,
  'fullstack-app': <Code className="h-8 w-8 text-success" />,
  'custom-engineering': <Server className="h-8 w-8 text-purple-500" />
};

export default function Services() {
  const [selectedService, setSelectedService] = useState<typeof PACKAGES[0] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (service: typeof PACKAGES[0]) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedService(null), 200);
  };

  return (
    <section id="services" className="section-padding">
      <div className="container-custom">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="heading-lg mb-4 text-white">Services & Pricing</h2>
          <p className="text-body mx-auto">
            Transparent pricing ladder designed for businesses of all sizes.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PACKAGES.map((service) => (
            <Card key={service.id} className="flex flex-col h-full hover:border-primary/30 transition-colors bg-[#151A21]/40 border-gray-800">
              <div className="mb-6 p-3 rounded-lg bg-gray-900 w-fit border border-gray-800">
                {icons[service.id as keyof typeof icons]}
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2">{service.title}</h3>
              <div className="text-sm text-gray-400 mb-6">
                Starting from <span className="text-white font-bold block text-lg">{formatCurrency(service.startingPrice)}</span>
              </div>
              
              <div className="space-y-3 mb-8 flex-grow">
                {service.scope.slice(0, 4).map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3 text-sm text-gray-300">
                    <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>{benefit}</span>
                  </div>
                ))}
                {service.scope.length > 4 && (
                   <div className="text-xs text-gray-500 pl-7">+ {service.scope.length - 4} more features</div>
                )}
              </div>

              <div className="mt-auto pt-6 border-t border-gray-800">
                <Button 
                  variant="primary" 
                  className="w-full mb-3"
                  onClick={() => openModal(service)}
                >
                  View Details
                </Button>
                <Link href={`/#contact?package=${service.id}`} className="block w-full">
                   <Button variant="outline" className="w-full text-xs h-9">
                      Select Plan
                   </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={selectedService?.title || 'Service Details'}
      >
        {selectedService && (
          <div className="space-y-6">
            <div>
              <div className="bg-gray-900/50 p-4 rounded border border-gray-800 mb-6">
                <span className="block text-gray-500 text-xs mb-1 uppercase tracking-wider">Starting Investment</span>
                <span className="text-2xl font-bold text-primary">{formatCurrency(selectedService.startingPrice)}</span>
                <p className="text-xs text-gray-500 mt-2">Final price depends on specific requirements and timeline.</p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">What's Included</h4>
              <ul className="space-y-3">
                {selectedService.scope.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                    <div className="h-1.5 w-1.5 rounded-full bg-secondary mt-1.5 shrink-0"></div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4 mt-6 border-t border-gray-800">
              <Link href={`/#contact?package=${selectedService.id}`} onClick={closeModal} className="block w-full">
                <Button className="w-full gap-2" size="lg">
                  Get Started <ArrowRight size={16} />
                </Button>
              </Link>
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
}

'use client';

import { useState, useEffect, Suspense, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Card } from '@/components/ui/Card';
import { Terminal, Send, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { PACKAGES } from '@/lib/packages';
import { AdminAccessModal } from '@/components/ui/AdminAccessModal';

function ContactForm() {
  const searchParams = useSearchParams();
  const packageId = searchParams.get('package');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    packageType: 'general-inquiry'
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  
  // Hidden Admin Trigger State
  const [clickCount, setClickCount] = useState(0);
  const [firstClickTime, setFirstClickTime] = useState<number | null>(null);
  const [showAdminModal, setShowAdminModal] = useState(false);

  // Handle Package Prefill
  useEffect(() => {
    if (packageId) {
      const pkg = PACKAGES.find(p => p.id === packageId);
      if (pkg) {
        setFormData(prev => ({
          ...prev,
          packageType: pkg.id,
          message: `I'm interested in the ${pkg.title} package. \n\nMy project requirements are: \n`
        }));
        
        // Scroll to form
        const contactSection = document.getElementById('contact');
        if (contactSection) {
            contactSection.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  }, [packageId]);

  // Reset admin trigger if time expires
  useEffect(() => {
    if (clickCount > 0 && firstClickTime) {
      const timer = setTimeout(() => {
        setClickCount(0);
        setFirstClickTime(null);
      }, 2000); // 2 second window
      return () => clearTimeout(timer);
    }
  }, [clickCount, firstClickTime]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check for Hidden Admin Trigger Condition
    // All fields must be empty (or default)
    const isEmpty = 
      !formData.name.trim() && 
      !formData.email.trim() && 
      !formData.message.trim() && 
      formData.packageType === 'general-inquiry';

    if (isEmpty) {
      const now = Date.now();
      
      if (clickCount === 0 || !firstClickTime) {
        setFirstClickTime(now);
        setClickCount(1);
      } else {
        // If within 2 seconds
        if (now - firstClickTime < 2000) {
          const newCount = clickCount + 1;
          setClickCount(newCount);
          
          if (newCount >= 5) {
            setShowAdminModal(true);
            setClickCount(0);
            setFirstClickTime(null);
            return; // Stop submission
          }
        } else {
          // Reset if time passed
          setFirstClickTime(now);
          setClickCount(1);
        }
      }
      return; // Stop submission for empty form
    }

    // Normal Submission Flow
    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setStatus('success');
      setFormData({ name: '', email: '', message: '', packageType: 'general-inquiry' });
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Failed to send message');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="p-6 md:p-8 bg-[#0B0F14]/80 backdrop-blur">
      <AdminAccessModal 
        isOpen={showAdminModal} 
        onClose={() => setShowAdminModal(false)} 
      />

      {status === 'success' ? (
        <div className="flex flex-col items-center justify-center py-12 text-center animate-in fade-in zoom-in duration-500">
          <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center text-success mb-4">
            <CheckCircle size={32} />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Message Sent!</h3>
          <p className="text-gray-400 mb-6">Thank you for reaching out. I'll be in touch shortly.</p>
          <Button onClick={() => setStatus('idle')} variant="outline">
            Send Another Message
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-gray-300">
                Name
              </label>
              <Input
                id="name"
                name="name"
                placeholder="John Doe"
                // Remove required to allow empty submission trigger
                value={formData.name}
                onChange={handleChange}
                className="bg-[#151A21]/50 border-gray-800 focus:border-primary/50"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-300">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="john@example.com"
                // Remove required to allow empty submission trigger
                value={formData.email}
                onChange={handleChange}
                className="bg-[#151A21]/50 border-gray-800 focus:border-primary/50"
              />
            </div>
          </div>
          
          <div className="space-y-2">
             <label htmlFor="packageType" className="text-sm font-medium text-gray-300">
                Interested Package
             </label>
             <div className="relative">
                <select
                  id="packageType"
                  name="packageType"
                  value={formData.packageType}
                  onChange={handleChange}
                  className="w-full h-12 rounded-md border border-gray-800 bg-[#151A21]/50 px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 appearance-none"
                >
                   <option value="general-inquiry">General Inquiry</option>
                   {PACKAGES.map(pkg => (
                      <option key={pkg.id} value={pkg.id}>{pkg.title} - Starting {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(pkg.startingPrice)}</option>
                   ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                   <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
             </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="message" className="text-sm font-medium text-gray-300">
              Project Description
            </label>
            <Textarea
              id="message"
              name="message"
              placeholder="Tell me about your project, timeline, and goals..."
              // Remove required to allow empty submission trigger
              minLength={10}
              value={formData.message}
              onChange={handleChange}
              className="bg-[#151A21]/50 border-gray-800 focus:border-primary/50 min-h-[150px]"
            />
          </div>

          {status === 'error' && (
            <div className="flex items-center gap-2 text-red-400 text-sm bg-red-950/20 p-3 rounded-md border border-red-900/50">
              <AlertCircle size={16} />
              <p>{errorMessage}</p>
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full md:w-auto min-w-[150px]"
            disabled={status === 'loading'}
          >
            {status === 'loading' ? (
              <>
                <Loader2 size={18} className="mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                Send Message
                <Send size={18} className="ml-2" />
              </>
            )}
          </Button>
        </form>
      )}
    </div>
  );
}

export default function Contact() {
  return (
    <section id="contact" className="section-padding pb-32">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="heading-lg mb-4 text-white">Let's Build Something Great</h2>
            <p className="text-body mx-auto">
              Ready to start your project? Fill out the form below and I'll get back to you within 24 hours.
            </p>
          </div>

          <Card className="relative overflow-hidden border-0 bg-transparent p-0">
            {/* Terminal Wrapper Styling */}
            <div className="rounded-xl border border-gray-800 bg-[#0B0F14] shadow-2xl overflow-hidden">
              <div className="flex items-center gap-2 border-b border-gray-800 bg-[#151A21] px-4 py-3">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-500/50"></div>
                  <div className="h-3 w-3 rounded-full bg-yellow-500/50"></div>
                  <div className="h-3 w-3 rounded-full bg-green-500/50"></div>
                </div>
                <div className="ml-4 flex items-center gap-2 text-xs font-mono text-gray-500">
                  <Terminal size={12} />
                  <span>contact-form.tsx</span>
                </div>
              </div>

              <Suspense fallback={<div className="p-8 text-center text-gray-500">Loading form...</div>}>
                 <ContactForm />
              </Suspense>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}

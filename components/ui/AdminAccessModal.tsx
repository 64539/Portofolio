'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { X, Lock, Loader2, AlertCircle } from 'lucide-react';
import { Button } from './Button';
import { Input } from './Input';
import { cn } from './Button';

interface AdminAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdminAccessModal({ isOpen, onClose }: AdminAccessModalProps) {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const overlayRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
      // Auto focus input
      setTimeout(() => inputRef.current?.focus(), 100);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) {
      onClose();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        router.replace('/internal-dashboard');
        onClose();
        setPassword('');
      } else {
        setError(data.error || 'Access Denied');
      }
    } catch (err) {
      setError('Connection failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (error) setError('');
  };

  if (!isOpen) return null;

  return createPortal(
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={handleOverlayClick}
      aria-modal="true"
      role="dialog"
    >
      <div className="relative w-full max-w-md rounded-xl border border-gray-800 bg-[#0B0F14] shadow-2xl p-6 md:p-8 animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mb-4 border border-red-500/20">
            <Lock size={24} />
          </div>
          <h2 className="text-xl font-bold text-white">Restricted Access</h2>
          <p className="text-sm text-gray-400 mt-2">
            This area is protected. Please enter your access credentials.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="admin-password" className="sr-only">
              Password
            </label>
            <Input
              ref={inputRef}
              id="admin-password"
              type="password"
              placeholder="Enter Access Key"
              value={password}
              onChange={handleInputChange}
              className={cn(
                "bg-[#151A21] border-gray-800 focus:border-red-500/50 text-center tracking-widest",
                error && "border-red-500/50 focus:border-red-500"
              )}
              autoComplete="off"
            />
          </div>

          {error && (
            <div className="flex items-center justify-center gap-2 text-red-400 text-sm animate-in slide-in-from-top-2">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white border-none"
            disabled={loading || !password}
          >
            {loading ? (
              <>
                <Loader2 size={18} className="mr-2 animate-spin" />
                Verifying...
              </>
            ) : (
              'Unlock System'
            )}
          </Button>
        </form>
      </div>
    </div>,
    document.body
  );
}

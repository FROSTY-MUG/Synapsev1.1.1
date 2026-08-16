"use client";

import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { CheckCircle2, X } from 'lucide-react';

interface EnhancedFormProps {
  onSubmit: (data: any) => Promise<boolean>;
}

export function EnhancedForm({ onSubmit }: EnhancedFormProps) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    // Basic validation
    if (!email || !email.includes('@')) {
      setError("Please enter a valid email address.");
      setIsSubmitting(false);
      return;
    }

    try {
      const success = await onSubmit({ email });
      if (success) {
        setShowSuccessModal(true);
        setEmail('');
      } else {
        setError("Something went wrong. Please try again.");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="email" className="block text-xs font-black tracking-wider uppercase mb-2 text-zinc-400">Email Address</label>
          <input 
            id="email"
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full px-4 py-3 border rounded-xl bg-black/40 text-white transition-all focus:outline-none focus:ring-2 ${
              error 
                ? 'border-red-500 focus:ring-red-500/50' 
                : 'border-white/10 focus:border-cyan-400 focus:ring-cyan-400/30'
            }`}
            placeholder="you@company.com"
          />
          {error && (
            <p className="mt-2 text-xs font-bold text-red-400 uppercase tracking-wide">{error}</p>
          )}
        </div>
        
        <button 
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 bg-cyan-600 hover:bg-cyan-500 text-white font-black uppercase tracking-widest rounded-xl transition-all shadow-[0_0_20px_rgba(8,145,178,0.4)] hover:shadow-[0_0_30px_rgba(8,145,178,0.6)] disabled:opacity-50 disabled:hover:scale-100"
        >
          {isSubmitting ? 'PROCESSING...' : 'JOIN WAITLIST'}
        </button>
      </form>

      <Dialog.Root open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 animate-in fade-in" />
          <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 macos-glass rounded-3xl p-10 max-w-sm w-full z-50 animate-in fade-in zoom-in-95 border border-white/20">
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-cyan-500/20 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(8,145,178,0.3)] border border-cyan-400/30">
                <CheckCircle2 className="h-10 w-10 text-cyan-400" />
              </div>
              <Dialog.Title className="text-2xl font-black uppercase tracking-wider mb-2">Access Granted</Dialog.Title>
              <Dialog.Description className="text-zinc-400 font-medium mb-8">
                Your request is in our system. A Synapse representative will contact you shortly.
              </Dialog.Description>
              <Dialog.Close asChild>
                <button className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl font-bold uppercase tracking-widest w-full transition-all">
                  CLOSE
                </button>
              </Dialog.Close>
            </div>
            <Dialog.Close asChild>
              <button className="absolute top-5 right-5 text-zinc-500 hover:text-white transition-colors">
                <X className="h-5 w-5" />
              </button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}

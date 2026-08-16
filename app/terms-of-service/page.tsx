import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | Synapse',
  alternates: {
    canonical: '/terms-of-service',
  }
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen py-24 px-6 md:px-12 max-w-4xl mx-auto relative z-10">
      <div className="macos-glass rounded-3xl p-10 md:p-14">
        <h1 className="text-3xl md:text-5xl font-black mb-4 uppercase tracking-widest text-white">Terms of Service</h1>
        <p className="text-sm text-cyan-400 font-mono mb-12 uppercase tracking-widest">Last Updated: {new Date().toLocaleDateString()}</p>
        
        <div className="space-y-8 text-zinc-300 font-medium leading-relaxed">
          <p>Welcome to Synapse. By accessing or using our platform, you agree to be bound by these Terms of Service.</p>
          
          <div>
            <h2 className="text-xl font-black text-white uppercase tracking-wider mb-3">1. Use of the Service</h2>
            <p>You agree to use the Synapse platform only for lawful purposes and in accordance with these Terms.</p>
          </div>
          
          <div>
            <h2 className="text-xl font-black text-white uppercase tracking-wider mb-3">2. Intellectual Property</h2>
            <p>The Service and its original content, features, and functionality are and will remain the exclusive property of Synapse and its licensors.</p>
          </div>
          
          <div>
            <h2 className="text-xl font-black text-white uppercase tracking-wider mb-3">3. Limitation of Liability</h2>
            <p>In no event shall Synapse be liable for any indirect, incidental, special, consequential or punitive damages.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

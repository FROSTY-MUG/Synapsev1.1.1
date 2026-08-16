import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Synapse',
  alternates: {
    canonical: '/privacy-policy',
  }
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen py-24 px-6 md:px-12 max-w-4xl mx-auto relative z-10">
      <div className="macos-glass rounded-3xl p-10 md:p-14">
        <h1 className="text-3xl md:text-5xl font-black mb-4 uppercase tracking-widest text-white">Privacy Policy</h1>
        <p className="text-sm text-cyan-400 font-mono mb-12 uppercase tracking-widest">Last Updated: {new Date().toLocaleDateString()}</p>
        
        <div className="space-y-8 text-zinc-300 font-medium leading-relaxed">
          <p>Your privacy is important to us. This Privacy Policy explains how we collect, use, and share your personal information.</p>
          
          <div>
            <h2 className="text-xl font-black text-white uppercase tracking-wider mb-3">1. Information We Collect</h2>
            <p>We collect information you provide directly to us, such as when you create an account, fill out a form, or communicate with us.</p>
          </div>
          
          <div>
            <h2 className="text-xl font-black text-white uppercase tracking-wider mb-3">2. How We Use Your Information</h2>
            <p>We use the information we collect to provide, maintain, and improve our services, and to communicate with you.</p>
          </div>
          
          <div>
            <h2 className="text-xl font-black text-white uppercase tracking-wider mb-3">3. Cookies and Tracking Technologies</h2>
            <p>We use cookies and similar tracking technologies to track the activity on our Service and hold certain information.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

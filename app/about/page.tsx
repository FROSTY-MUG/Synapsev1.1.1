import React from 'react';
import { Metadata } from 'next';
import { RichTooltip } from '@/components/ui/RichTooltip';
import { CopyButton } from '@/components/ui/CopyButton';
import { FaqAccordion } from '@/components/ui/FaqAccordion';

export const metadata: Metadata = {
  title: 'About Synapse | Our Story',
  description: 'Learn about the story behind Synapse, the AI-Native CFO Operating System.',
  alternates: {
    canonical: '/about',
  }
};

export default function AboutPage() {
  return (
    <div className="min-h-screen py-24 px-6 md:px-12 max-w-4xl mx-auto relative z-10">
      <h1 className="text-4xl md:text-5xl font-black mb-8 uppercase tracking-widest text-white text-center">About <span className="text-cyan-400">Synapse</span></h1>
      
      <div className="space-y-6 text-lg text-zinc-300 font-medium leading-relaxed">
        <p>
          <strong className="text-white">Our Story:</strong> Synapse was born out of a simple observation: finance teams are overwhelmed with data, yet starved for actionable insights.
        </p>
        <p>
          We realized that traditional financial software was built for a different era. An era of manual entry, slow reporting, and reactive decision-making. We wanted to build something different. Something intelligent, predictive, and autonomous.
        </p>
        <p>
          Our mission is to empower CFOs and finance teams with an AI-native operating system that acts not just as a system of record, but as a system of intelligence. 
          <RichTooltip content="Contact us at hello@synapse.dev for more details.">
            <span className="underline cursor-help ml-1 text-cyan-400 hover:text-cyan-300 transition-colors">Synapse connects the dots</span>
          </RichTooltip> across your entire financial landscape.
        </p>
        
        <div className="mt-8 flex items-center space-x-3 macos-glass p-4 rounded-xl">
          <span className="font-mono text-sm text-cyan-300">hello@synapse.dev</span>
          <CopyButton textToCopy="hello@synapse.dev" />
        </div>
        
        <div className="mt-12 p-8 macos-glass rounded-3xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-3xl rounded-full" />
          <h2 className="text-2xl font-black mb-4 uppercase tracking-widest text-white">Our Guarantee</h2>
          <p className="relative z-10">
            We stand by the transformative power of Synapse. If our platform does not significantly reduce your manual reporting time and increase the accuracy of your financial forecasts within the first 90 days, we will refund your initial implementation fee in full.
          </p>
        </div>

        <div className="mt-16">
          <FaqAccordion />
        </div>
      </div>
    </div>
  );
}

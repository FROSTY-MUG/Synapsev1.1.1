import React from 'react';
import { Metadata } from 'next';

type Props = {
  params: Promise<{ action: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { action } = await params;
  return {
    title: `${action.charAt(0).toUpperCase() + action.slice(1)} Services | Synapse`,
    alternates: {
      canonical: `/services/${action}`,
    },
  };
}

import { EnhancedForm } from '@/components/ui/EnhancedForm';

export default async function ServiceActionPage({ params }: Props) {
  const { action } = await params;
  const formattedAction = action.charAt(0).toUpperCase() + action.slice(1).replace(/-/g, ' ');

  const handleFormSubmit = async (data: any) => {
    'use server';
    // Simulate server action
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log(`Lead submitted for ${action}:`, data);
    return true; // Simulate success rate mapping
  };

  return (
    <div className="min-h-screen py-24 px-6 md:px-12 max-w-4xl mx-auto relative z-10">
      <h1 className="text-4xl md:text-5xl font-black mb-6 text-center tracking-tight text-white uppercase">
        <span className="text-cyan-400">{formattedAction}</span> Services
      </h1>
      <p className="text-xl text-center text-zinc-300 font-medium mb-12">
        High-performance AI solutions tailored for your specific financial operations.
      </p>

      <div className="macos-glass rounded-3xl p-8 max-w-lg mx-auto">
        <h2 className="text-2xl font-black mb-6 uppercase tracking-widest text-center">Request Access</h2>
        <EnhancedForm onSubmit={handleFormSubmit} />
      </div>
    </div>
  );
}

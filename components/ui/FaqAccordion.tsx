"use client";

import React from 'react';
import * as Accordion from '@radix-ui/react-accordion';
import { ChevronDown } from 'lucide-react';

const faqs = [
  { question: "What is Synapse OS?", answer: "Synapse OS is an AI-Native CFO Operating System designed to automate and enhance financial intelligence for modern enterprises." },
  { question: "How does the AI Engine work?", answer: "Our AI engine integrates directly with your ERP, CRM, and bank feeds to autonomously categorize, reconcile, and forecast data in real-time." },
  { question: "Is my data secure?", answer: "Yes, we employ bank-grade encryption, SOC2 compliant infrastructure, and never train public models on your proprietary data." },
  { question: "How long does implementation take?", answer: "Implementation typically takes between 2 to 4 weeks depending on the complexity of your existing tech stack." },
  { question: "Can I connect Synapse to NetSuite?", answer: "Absolutely. We offer native two-way sync with NetSuite, Quickbooks, Xero, and over 50 other platforms." },
  { question: "What is your refund guarantee?", answer: "If you don't see a significant reduction in manual reporting time within 90 days, we'll refund your implementation fee." },
  { question: "Do you offer custom integrations?", answer: "Yes, our enterprise plan includes dedicated engineering support for bespoke integrations." },
  { question: "How much does it cost?", answer: "Pricing scales based on your transaction volume and entity count. Contact sales for a custom quote." }
];

export function FaqAccordion() {
  return (
    <div className="w-full max-w-3xl mx-auto my-12 relative z-10">
      <h2 className="text-3xl font-black mb-8 text-center uppercase tracking-widest text-white">Frequently Asked Questions</h2>
      <Accordion.Root type="single" collapsible className="space-y-4">
        {faqs.map((faq, index) => (
          <Accordion.Item 
            key={index} 
            value={`item-${index}`}
            className="macos-glass rounded-2xl overflow-hidden transition-all hover:shadow-[0_0_20px_rgba(8,145,178,0.2)]"
          >
            <Accordion.Header className="flex">
              <Accordion.Trigger className="flex flex-1 items-center justify-between py-5 px-6 text-left font-bold uppercase tracking-wider text-sm transition-all hover:bg-white/5 [&[data-state=open]>svg]:rotate-180 text-white">
                {faq.question}
                <ChevronDown className="h-5 w-5 text-cyan-400 transition-transform duration-300" />
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content className="overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
              <div className="pb-6 px-6 text-zinc-300 font-medium leading-relaxed">
                {faq.answer}
              </div>
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </div>
  );
}

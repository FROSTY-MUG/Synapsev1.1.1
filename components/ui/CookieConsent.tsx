"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('synapse_cookie_consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('synapse_cookie_consent', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-24 left-0 right-0 p-4 z-[500] animate-in slide-in-from-bottom-5">
      <div className="max-w-4xl mx-auto macos-glass rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.85),0_0_2px_1px_rgba(255,255,255,0.2)]">
        <p className="text-sm md:text-base text-zinc-300 font-medium max-w-2xl">
          We use cookies to improve your experience, track UTM performance, and ensure site accessibility. 
          By continuing to use our site, you agree to our <Link href="/privacy-policy" className="text-cyan-400 hover:text-cyan-300 underline font-bold">Privacy Policy</Link> and <Link href="/terms-of-service" className="text-cyan-400 hover:text-cyan-300 underline font-bold">Terms of Service</Link>.
        </p>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <button 
            onClick={acceptCookies}
            className="flex-1 md:flex-none px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-black uppercase tracking-widest rounded-xl transition-all shadow-[0_0_20px_rgba(8,145,178,0.4)] hover:shadow-[0_0_30px_rgba(8,145,178,0.6)]"
          >
            Accept
          </button>
          <button 
            onClick={() => setIsVisible(false)}
            className="p-3 text-zinc-500 hover:text-white transition-colors"
            aria-label="Dismiss cookie notice"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

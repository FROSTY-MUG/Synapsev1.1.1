"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { ThemeToggle } from '../ui/ThemeToggle';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-cyan-600 text-white px-4 py-2 z-50 rounded-lg font-bold"
      >
        Skip to Content
      </a>

      <header className="sticky top-0 z-40 w-full macos-menu-glass border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-black tracking-widest text-white uppercase flex items-center gap-2">
                SYNAPSE <span className="text-cyan-400">OS</span>
              </Link>
            </div>
            
            <nav className="hidden md:flex space-x-8 items-center">
              <Link href="/about" className="text-xs font-bold uppercase tracking-wider text-gray-300 hover:text-cyan-300 transition-colors">About</Link>
              <Link href="/services/forecasting" className="text-xs font-bold uppercase tracking-wider text-gray-300 hover:text-cyan-300 transition-colors">Services</Link>
            </nav>

            <div className="flex items-center md:hidden space-x-4">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-300 hover:text-cyan-300 p-2"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden border-t border-white/10 bg-[#07070a]/90 backdrop-blur-xl">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link href="/about" className="block px-3 py-2 text-xs font-bold uppercase tracking-wider text-gray-300 hover:text-cyan-300 hover:bg-white/5 rounded-md">About</Link>
              <Link href="/services/forecasting" className="block px-3 py-2 text-xs font-bold uppercase tracking-wider text-gray-300 hover:text-cyan-300 hover:bg-white/5 rounded-md">Services</Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}

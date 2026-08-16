'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Wifi, 
  Search, 
  Sliders, 
  Mic, 
  Battery, 
  Lock,
  Sparkles,
  Info,
  Layers,
  ChevronDown
} from 'lucide-react';
import Link from 'next/link';

interface MacOSMenuBarProps {
  activeAppName: string;
  onOpenSpotlight: () => void;
  onToggleControlCenter: () => void;
  isControlCenterOpen: boolean;
  onOpenVoiceAssistant: () => void;
  onLock: () => void;
  onSignOut: () => void;
  user: any;
}

type MenuKey = 'FILE' | 'EDIT' | 'VIEW' | 'ANALYTICS' | 'AGENTS' | 'HELP' | null;

const menuItems: Record<string, { label: string; action?: string; href?: string; separator?: boolean }[]> = {
  FILE: [
    { label: 'About Synapse', href: '/about' },
    { label: '---', separator: true },
    { label: 'Services', href: '/services/forecasting' },
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'Terms of Service', href: '/terms-of-service' },
  ],
  EDIT: [
    { label: 'Undo', action: 'undo' },
    { label: 'Redo', action: 'redo' },
    { label: '---', separator: true },
    { label: 'Cut', action: 'cut' },
    { label: 'Copy', action: 'copy' },
    { label: 'Paste', action: 'paste' },
  ],
  VIEW: [
    { label: 'Zoom In', action: 'zoomin' },
    { label: 'Zoom Out', action: 'zoomout' },
    { label: '---', separator: true },
    { label: 'Full Screen', action: 'fullscreen' },
    { label: 'Toggle Dark Mode', action: 'darkmode' },
  ],
  ANALYTICS: [
    { label: 'Open Dashboard', action: 'open_dashboard' },
    { label: 'Open InvestIQ', action: 'open_investiq' },
    { label: 'Open FP&A Studio', action: 'open_fpnastudio' },
    { label: '---', separator: true },
    { label: 'Export Report', action: 'export_report' },
  ],
  AGENTS: [
    { label: 'Open Velyra AI', action: 'open_aibrain' },
    { label: 'Open Assistant', action: 'open_assistant' },
    { label: '---', separator: true },
    { label: 'Voice Engine', action: 'voice' },
  ],
  HELP: [
    { label: 'About Synapse', href: '/about' },
    { label: '---', separator: true },
    { label: 'View FAQs', href: '/about#faq' },
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'Terms of Service', href: '/terms-of-service' },
  ],
};

export default function MacOSMenuBar({
  activeAppName,
  onOpenSpotlight,
  onToggleControlCenter,
  isControlCenterOpen,
  onOpenVoiceAssistant,
  onLock,
  onSignOut,
  user
}: MacOSMenuBarProps) {
  const [time, setTime] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [openMenu, setOpenMenu] = useState<MenuKey>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setDate(now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' }).toUpperCase());
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleMenuAction = (action: string) => {
    setOpenMenu(null);
    if (action === 'voice') {
      onOpenVoiceAssistant();
      return;
    }
    if (action === 'fullscreen') {
      if (!document.fullscreenElement) document.documentElement.requestFullscreen();
      else document.exitFullscreen();
      return;
    }
    if (action.startsWith('open_')) {
      const appId = action.replace('open_', '');
      window.dispatchEvent(new CustomEvent('open-app', { detail: { appId } }));
      return;
    }
  };

  return (
    <div
      ref={menuRef}
      className="fixed top-0 left-0 right-0 h-10 select-none z-[200] macos-menu-glass text-white flex items-center justify-between px-2 sm:px-4 font-bold tracking-wide shadow-md max-w-full overflow-hidden"
    >
      {/* Left Menu Section */}
      <div className="flex items-center gap-1 sm:gap-2 truncate">
        {/* Synapse Logo Badge */}
        <div
          onClick={onOpenSpotlight}
          className="flex items-center gap-1.5 sm:gap-2 cursor-pointer px-2 sm:px-2.5 py-1 rounded-xl bg-cyan-500/20 border border-cyan-400/40 hover:bg-cyan-500/30 transition-all text-white shrink-0"
        >
          <Sparkles size={15} className="text-cyan-400 animate-pulse" />
          <span className="font-black tracking-widest text-xs sm:text-sm text-cyan-300 uppercase">SYNAPSE</span>
        </div>

        {/* Active Application Name */}
        <span className="font-extrabold text-white text-xs sm:text-sm uppercase px-1.5 sm:px-2 py-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer tracking-wider truncate">
          {activeAppName ? activeAppName.toUpperCase() : 'DESKTOP'}
        </span>

        {/* Dropdown Menu Items */}
        <div className="hidden lg:flex items-center gap-0.5 text-zinc-300 text-xs font-bold uppercase tracking-wider">
          {(Object.keys(menuItems) as MenuKey[]).filter(Boolean).map((item) => (
            <div key={item} className="relative">
              <button
                onClick={() => setOpenMenu(openMenu === item ? null : item)}
                className={`px-2 py-1.5 rounded-lg flex items-center gap-0.5 transition-colors ${
                  openMenu === item ? 'bg-white/20 text-white' : 'hover:bg-white/10 hover:text-white'
                }`}
              >
                {item}
              </button>

              {openMenu === item && (
                <div className="absolute top-full left-0 mt-1 w-52 macos-glass rounded-xl py-1.5 shadow-2xl z-[300] border border-white/20 overflow-hidden">
                  {menuItems[item as string].map((menuItem, idx) =>
                    menuItem.separator ? (
                      <div key={idx} className="h-px bg-white/10 my-1 mx-3" />
                    ) : menuItem.href ? (
                      <Link
                        key={idx}
                        href={menuItem.href}
                        onClick={() => setOpenMenu(null)}
                        className="block px-4 py-2 text-xs font-bold uppercase tracking-wider text-zinc-200 hover:bg-white/10 hover:text-cyan-300 transition-colors"
                      >
                        {menuItem.label}
                      </Link>
                    ) : (
                      <button
                        key={idx}
                        onClick={() => menuItem.action && handleMenuAction(menuItem.action)}
                        className="w-full text-left px-4 py-2 text-xs font-bold uppercase tracking-wider text-zinc-200 hover:bg-white/10 hover:text-cyan-300 transition-colors"
                      >
                        {menuItem.label}
                      </button>
                    )
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Right Controls Section */}
      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        {/* Voice AI Trigger Button */}
        <button
          onClick={onOpenVoiceAssistant}
          className="flex items-center gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 border border-cyan-300/40 hover:scale-105 active:scale-95 text-white font-black text-[10px] sm:text-xs uppercase tracking-wider transition-all shadow-md"
          title="SYNAPSE VOICE ENGINE"
        >
          <Mic size={14} className="text-white animate-pulse" />
          <span className="hidden sm:inline">VOICE ENGINE</span>
        </button>

        {/* Spotlight Search */}
        <button
          onClick={onOpenSpotlight}
          className="p-1.5 sm:p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/15 text-white hover:text-cyan-300 transition-all"
          title="SPOTLIGHT SEARCH (⌘SPACE)"
        >
          <Search size={15} />
        </button>

        {/* Control Center Toggle */}
        <button
          onClick={onToggleControlCenter}
          className={`p-1.5 sm:p-2 rounded-xl border transition-all ${
            isControlCenterOpen
              ? 'bg-cyan-500/30 border-cyan-400 text-white shadow-lg'
              : 'bg-white/5 border-white/10 hover:bg-white/15 text-white'
          }`}
          title="CONTROL CENTER"
        >
          <Sliders size={15} />
        </button>

        {/* System Indicators */}
        <div className="hidden sm:flex items-center gap-1.5 px-1 text-white">
          <Wifi size={15} className="text-cyan-400" />
          <Battery size={16} className="text-emerald-400" />
        </div>

        {/* Live Date & Time */}
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-xl bg-white/5 border border-white/10 text-[10px] sm:text-xs font-black tracking-wider text-white">
          <span className="text-cyan-300 hidden md:inline">{date}</span>
          <span>{time}</span>
        </div>

        {/* Lock Screen */}
        <button
          onClick={onLock}
          className="p-1.5 sm:p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-red-500/20 hover:border-red-500/40 text-zinc-300 hover:text-red-300 transition-all"
          title="LOCK SESSION"
        >
          <Lock size={14} />
        </button>
      </div>
    </div>
  );
}

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, useDragControls } from 'motion/react';
import { X, Minus, Maximize2, Sparkles } from 'lucide-react';
import { AppDefinition } from './AppRegistry';

interface AppWindowProps {
  app: AppDefinition;
  isActive: boolean;
  isMaximized: boolean;
  zIndex: number;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onFocus: () => void;
  children: React.ReactNode;
}

export default function AppWindow({ 
  app, 
  isActive, 
  isMaximized, 
  zIndex,
  onClose, 
  onMinimize, 
  onMaximize, 
  onFocus,
  children 
}: AppWindowProps) {
  const dragControls = useDragControls();
  const [hoverLights, setHoverLights] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [controlPosition, setControlPosition] = useState<'left' | 'right'>('left');
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkScreen = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  const handleHeaderMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!headerRef.current) return;
    const rect = headerRef.current.getBoundingClientRect();
    const relativeX = e.clientX - rect.left;
    const isRightHalf = relativeX > rect.width / 2;
    setControlPosition(isRightHalf ? 'right' : 'left');
  };

  const renderWindowControls = () => (
    <div 
      className="flex items-center gap-2 sm:gap-2.5 px-1 py-0.5"
      onMouseEnter={() => setHoverLights(true)}
      onMouseLeave={() => setHoverLights(false)}
    >
      {/* Close (Cross) */}
      <button
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        className={`w-4 h-4 rounded-full flex items-center justify-center transition-all ${
          isActive ? 'bg-[#ff5f56] hover:bg-[#ff3b30] hover:scale-125 shadow-md shadow-red-500/40' : 'bg-zinc-600'
        }`}
        title="CLOSE (✕)"
      >
        <X size={10} className={`text-black font-extrabold transition-opacity ${hoverLights ? 'opacity-100' : 'opacity-70'}`} />
      </button>

      {/* Minimize */}
      <button
        onClick={(e) => { e.stopPropagation(); onMinimize(); }}
        className={`w-4 h-4 rounded-full flex items-center justify-center transition-all ${
          isActive ? 'bg-[#ffbd2e] hover:bg-[#ffcc00] hover:scale-125 shadow-md shadow-amber-500/40' : 'bg-zinc-600'
        }`}
        title="MINIMIZE (−)"
      >
        <Minus size={10} className={`text-black font-extrabold transition-opacity ${hoverLights ? 'opacity-100' : 'opacity-70'}`} />
      </button>

      {/* Extend / Maximize */}
      <button
        onClick={(e) => { e.stopPropagation(); onMaximize(); }}
        className={`w-4 h-4 rounded-full flex items-center justify-center transition-all ${
          isActive ? 'bg-[#27c93f] hover:bg-[#34c759] hover:scale-125 shadow-md shadow-emerald-500/40' : 'bg-zinc-600'
        }`}
        title="EXTEND / MAXIMIZE (⤢)"
      >
        <Maximize2 size={9} className={`text-black font-extrabold transition-opacity ${hoverLights ? 'opacity-100' : 'opacity-70'}`} />
      </button>
    </div>
  );

  return (
    <motion.div
      drag={!isMaximized && !isMobile}
      dragMomentum={false}
      dragControls={dragControls}
      dragListener={false}
      initial={{ opacity: 0, scale: 0.88, y: 40, filter: 'blur(8px)' }}
      animate={{ 
        opacity: 1, 
        scale: 1, 
        y: 0,
        filter: 'blur(0px)',
        zIndex: zIndex,
        width: isMaximized || isMobile ? '100vw' : '84vw',
        height: isMaximized || isMobile ? 'calc(100vh - 40px)' : 'calc(100vh - 175px)',
        top: isMaximized || isMobile ? '40px' : '55px',
        left: isMaximized || isMobile ? '0px' : '8vw',
        borderRadius: isMaximized || isMobile ? 0 : 22
      }}
      exit={{ opacity: 0, scale: 0.88, y: 40, filter: 'blur(8px)' }}
      transition={{ 
        type: 'tween',
        duration: 0.18,
        ease: 'easeOut'
      }}
      className={`absolute macos-glass macos-window-shadow flex flex-col overflow-hidden pointer-events-auto border-2 transition-all duration-300 ${
        isActive 
          ? 'border-white/35 ring-2 ring-cyan-400/30 shadow-[0_40px_90px_rgba(0,0,0,0.9)]' 
          : 'border-white/10 opacity-95'
      }`}
      onClick={onFocus}
    >
      {/* Smart Window Header Bar */}
      <div 
        ref={headerRef}
        className={`h-11 flex items-center justify-between px-4 select-none cursor-default border-b-2 transition-colors relative ${
          isActive ? 'bg-white/15 border-white/20' : 'bg-white/5 border-white/10'
        }`}
        onMouseMove={handleHeaderMouseMove}
        onPointerDown={(e) => {
          if (!isMobile) dragControls.start(e);
        }}
      >
        {/* Left Side Container */}
        <div className="flex items-center w-28">
          {controlPosition === 'left' ? (
            <div>{renderWindowControls()}</div>
          ) : (
            <div className="w-28" />
          )}
        </div>

        {/* Application Title */}
        <div className="flex items-center gap-2.5 flex-1 justify-center h-full truncate px-2">
          <app.icon size={18} className={isActive ? 'text-cyan-300 animate-pulse' : 'text-zinc-400'} />
          <span className={`text-xs font-black uppercase tracking-wider truncate ${isActive ? 'text-white' : 'text-zinc-400'}`}>
            {app.name}
          </span>
        </div>

        {/* Right Side Container */}
        <div className="flex items-center justify-end w-28">
          {controlPosition === 'right' ? (
            <div>{renderWindowControls()}</div>
          ) : (
            <div className="w-28" />
          )}
        </div>
      </div>

      {/* Glass Body Content */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-6 custom-scrollbar bg-black/40 backdrop-blur-2xl text-white font-medium text-sm sm:text-base">
        {children}
      </div>
    </motion.div>
  );
}

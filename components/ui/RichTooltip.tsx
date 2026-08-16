"use client";

import React from 'react';
import * as Tooltip from '@radix-ui/react-tooltip';

interface RichTooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
}

export function RichTooltip({ children, content }: RichTooltipProps) {
  return (
    <Tooltip.Provider delayDuration={200}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          {children}
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            className="z-50 max-w-sm rounded-lg bg-gray-900 px-4 py-3 text-sm text-white shadow-xl animate-in fade-in zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=closed]:zoom-out-95 dark:bg-gray-100 dark:text-black"
            sideOffset={5}
          >
            {content}
            <Tooltip.Arrow className="fill-gray-900 dark:fill-gray-100" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}

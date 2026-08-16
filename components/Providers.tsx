"use client";

import { useUtmTracking } from '@/hooks/useUtmTracking';
import { CookieConsent } from './ui/CookieConsent';

export function ClientProviders() {
  useUtmTracking();
  
  return (
    <CookieConsent />
  );
}

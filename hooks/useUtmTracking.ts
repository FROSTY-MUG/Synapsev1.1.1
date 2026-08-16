"use client";

import { useEffect } from 'react';

export function useUtmTracking() {
  useEffect(() => {
    // Only run on client
    if (typeof window === 'undefined') return;

    const urlParams = new URLSearchParams(window.location.search);
    const utmParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
    
    let hasUtm = false;
    const trackedData: Record<string, string> = {};

    utmParams.forEach(param => {
      const value = urlParams.get(param);
      if (value) {
        trackedData[param] = value;
        hasUtm = true;
      }
    });

    if (hasUtm) {
      // Save to localStorage or send to analytics endpoint
      sessionStorage.setItem('synapse_utm_data', JSON.stringify(trackedData));
      console.log('UTM parameters tracked:', trackedData);
    }
  }, []);
}

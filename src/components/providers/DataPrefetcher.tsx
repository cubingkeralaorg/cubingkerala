'use client'

import { useEffect } from 'react'
import { getCompetitionsCache } from '@/lib/competition/cache'
import { fetchCompetitions } from '@/lib/competition/api'

/**
 * DataPrefetcher component
 * Prefetches heavy data like competitions in the background if not cached.
 */
export function DataPrefetcher() {
  useEffect(() => {
    const prefetch = async () => {
      // Check if competitions are already cached
      const cache = getCompetitionsCache();
      
      if (!cache) {
        console.log('[DataPrefetcher] Cache empty, prefetching competitions in background...');
        // Fetch in background without blocking
        // We don't await here to keep it truly "background" and let the app load
        fetchCompetitions(false).catch(err => {
          console.error('[DataPrefetcher] Failed to prefetch competitions:', err);
        });
      }
    };

    // Small delay to prioritize initial page load
    const timer = setTimeout(prefetch, 2000);
    return () => clearTimeout(timer);
  }, []);

  return null;
}

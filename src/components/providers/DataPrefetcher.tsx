'use client'

import { useEffect } from 'react'
import { getCompetitionsCache } from '@/lib/competition/cache'
import { fetchCompetitions } from '@/lib/competition/api'
import { fetchMultiplePersonsData } from '@/services/wca.api'

/**
 * DataPrefetcher component
 * Prefetches heavy data like competitions and member results in the background.
 */
export function DataPrefetcher() {
  useEffect(() => {
    const prefetch = async () => {
      // 1. Prefetch Competitions
      const compCache = getCompetitionsCache();
      if (!compCache) {
        console.log('[DataPrefetcher] Cache empty, prefetching competitions in background...');
        fetchCompetitions(false).catch(err => {
          console.error('[DataPrefetcher] Failed to prefetch competitions:', err);
        });
      }

      // 2. Prefetch Member WCA Data
      try {
        console.log('[DataPrefetcher] Prefetching member WCA IDs...');
        const response = await fetch('/api/get-member-wcaids');
        if (response.ok) {
          const members = await response.json();
          const wcaIds = members.map((m: any) => m.wcaid).filter(Boolean);
          
          if (wcaIds.length > 0) {
            console.log(`[DataPrefetcher] Triggering incremental fetch for ${wcaIds.length} members...`);
            // This is strictly incremental and throttled by default
            fetchMultiplePersonsData(wcaIds).catch(err => {
              console.error('[DataPrefetcher] Failed to prefetch member data:', err);
            });
          }
        }
      } catch (err) {
        console.error('[DataPrefetcher] Failed to fetch member IDs for prefetch:', err);
      }
    };

    // Delay to prioritize initial page load (FCP/LCP)
    const timer = setTimeout(prefetch, 3000);
    return () => clearTimeout(timer);
  }, []);

  return null;
}

"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition, type MouseEvent } from "react";
import { flushSync } from "react-dom";

/**
 * Intercepts a Link click and navigates inside a transition so the
 * destination route's `loading.tsx` fallback renders on the same click
 * instead of waiting for the RSC payload to arrive.
 *
 * The overlay flag is a plain state update flushed synchronously before
 * the transition starts, rather than relying solely on useTransition's
 * `isPending`. `isPending` is scheduled as part of the same low-priority
 * transition as `router.push`, so when the navigation resolves fast enough
 * (e.g. a prefetched route in production), React can commit both the
 * pending and settled states together and skip painting the overlay in
 * between — the old page's title flashes for a frame before the loader
 * (or the destination) appears. Flushing a plain state update first
 * guarantees the overlay paints on the very next frame regardless of how
 * quickly the transition resolves.
 */
export function useInstantNavigation() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isNavigating, setIsNavigating] = useState(false);

  const handleNavigate = (
    event: MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }
    event.preventDefault();
    flushSync(() => {
      setIsNavigating(true);
    });
    startTransition(() => {
      router.push(href);
    });
  };

  return { isPending: isPending || isNavigating, handleNavigate };
}

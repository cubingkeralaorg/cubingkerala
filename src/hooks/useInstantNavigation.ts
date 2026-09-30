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
 * (e.g. a prefetched route, or a route whose data is already cached),
 * React can commit both the pending and settled states together within
 * the same synchronous/microtask batch — with no macrotask in between to
 * force the browser to paint — and skip painting the overlay entirely.
 * That let the previous page's content flash right up until the final
 * content swap, on routes/timings fast enough to stay inside one batch.
 *
 * flushSync guarantees the overlay's DOM update commits synchronously,
 * but a commit isn't a paint: the browser can still coalesce it with
 * whatever comes right after into a single frame. Waiting two animation
 * frames before starting the transition is the standard guarantee that a
 * paint has actually happened in between (the first rAF is queued for the
 * upcoming frame that contains the flushed update; the second one only
 * runs after that frame has painted) — so the overlay is on screen before
 * `router.push` ever runs, regardless of how fast the navigation resolves.
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
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        startTransition(() => {
          router.push(href);
        });
      });
    });
  };

  return { isPending: isPending || isNavigating, handleNavigate };
}

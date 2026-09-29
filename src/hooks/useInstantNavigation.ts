"use client";

import { useRouter } from "next/navigation";
import { useTransition, type MouseEvent } from "react";

/**
 * Intercepts a Link click and navigates inside a transition so the
 * destination route's `loading.tsx` fallback renders on the same click
 * instead of waiting for the RSC payload to arrive.
 */
export function useInstantNavigation() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleNavigate = (
    event: MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }
    event.preventDefault();
    startTransition(() => {
      router.push(href);
    });
  };

  return { isPending, handleNavigate };
}

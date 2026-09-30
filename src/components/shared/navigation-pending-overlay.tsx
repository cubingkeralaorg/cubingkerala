"use client";

import { createPortal } from "react-dom";
import Loading from "@/components/shared/loading";

/**
 * Full-viewport loader shown the instant a table link is clicked.
 *
 * Portaled to document.body so it is not clipped by the data grid
 * (`overflow-hidden` + radius). Opaque so the current page heading cannot
 * show through for a frame before the destination `loading.tsx` spinner.
 * Rendered during the click's flushSync, so it must not wait for an effect.
 */
export function NavigationPendingOverlay() {
  if (typeof document === "undefined") return null;

  return createPortal(
    <div data-navigation-overlay="" className="contents">
      <Loading className="fixed inset-0 z-[9999] min-h-0 bg-background" />
    </div>,
    document.body,
  );
}

"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion, type Transition } from "framer-motion";

type ScrollRevealProps = {
  children: ReactNode;
  className?: string;
  /** Stagger follow-up blocks within the same section. */
  delay?: number;
};

export const SCROLL_REVEAL_INITIAL = { opacity: 0, y: 14, scale: 0.985 };
export const SCROLL_REVEAL_ANIMATE = { opacity: 1, y: 0, scale: 1 };
export const SCROLL_REVEAL_VIEWPORT = { once: true, amount: 0.3 };

export function getScrollRevealTransition(delay = 0): Transition {
  return { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] };
}

/**
 * Fades a block in while it rises and scales up slightly as it enters the
 * viewport. Skips the motion entirely for prefers-reduced-motion.
 */
export function ScrollReveal({
  children,
  className,
  delay = 0,
}: ScrollRevealProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={SCROLL_REVEAL_INITIAL}
      whileInView={SCROLL_REVEAL_ANIMATE}
      viewport={SCROLL_REVEAL_VIEWPORT}
      transition={getScrollRevealTransition(delay)}
    >
      {children}
    </motion.div>
  );
}

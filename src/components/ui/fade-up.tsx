"use client";

import {
  createContext,
  useContext,
  Children,
  type ReactNode,
} from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

/** Refined ease — calm, professional deceleration */
export const REVEAL_EASE = [0.22, 1, 0.36, 1] as const;

/** Primary content lift (headings, sections) */
export const FADE_UP_Y = 6;

/** Table rows and grid tiles — even lighter */
export const FADE_UP_ROW_Y = 4;

export const fadeUpItem: Variants = {
  hidden: { opacity: 0, y: FADE_UP_Y },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: REVEAL_EASE },
  },
};

export const fadeUpRowItem: Variants = {
  hidden: { opacity: 0, y: FADE_UP_ROW_Y },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: REVEAL_EASE },
  },
};

export const StaggerContext = createContext(false);

type MotionTag = "div" | "h1" | "h2" | "h3" | "p" | "span";

const motionTags = {
  div: motion.div,
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  p: motion.p,
  span: motion.span,
} as const;

interface StaggerRevealProps {
  children: ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
}

export function StaggerReveal({
  children,
  className,
  stagger = 0.05,
  delay = 0.03,
}: StaggerRevealProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <StaggerContext.Provider value={true}>
      <motion.div
        className={className}
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: { staggerChildren: stagger, delayChildren: delay },
          },
        }}
      >
        {children}
      </motion.div>
    </StaggerContext.Provider>
  );
}

interface FadeUpProps {
  children: ReactNode;
  className?: string;
  as?: MotionTag;
}

export function FadeUp({ children, className, as = "div" }: FadeUpProps) {
  const shouldReduceMotion = useReducedMotion();
  const inStagger = useContext(StaggerContext);
  const MotionComponent = motionTags[as];

  if (shouldReduceMotion) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  const motionProps = inStagger
    ? { variants: fadeUpItem }
    : {
        initial: "hidden" as const,
        animate: "visible" as const,
        variants: fadeUpItem,
      };

  return (
    <MotionComponent {...motionProps} className={cn(className)}>
      {children}
    </MotionComponent>
  );
}

interface FadeInProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
}

export function FadeIn({
  children,
  className,
  delay = 0,
  duration = 0.8,
}: FadeInProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration, delay, ease: REVEAL_EASE }}
    >
      {children}
    </motion.div>
  );
}

export function PageReveal({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <StaggerReveal className={className} delay={0.02} stagger={0.045}>
      {children}
    </StaggerReveal>
  );
}

/** Staggered grid cells (learn videos, cards, etc.) */
export function RevealGrid({
  children,
  className,
  stagger = 0.035,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
}) {
  return (
    <StaggerReveal className={className} stagger={stagger} delay={0.02}>
      {Children.toArray(children).map((child, index) => (
        <FadeUp key={index}>{child}</FadeUp>
      ))}
    </StaggerReveal>
  );
}

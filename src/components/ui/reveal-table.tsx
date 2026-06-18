"use client";

import { useContext, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
  fadeUpRowItem,
  StaggerContext,
} from "@/components/ui/fade-up";

const TABLE_ROW_STAGGER = 0.022;
const TABLE_ROW_DELAY = 0.008;

interface AnimatedTableBodyProps {
  children: ReactNode;
  className?: string;
}

export function AnimatedTableBody({
  children,
  className,
}: AnimatedTableBodyProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <tbody className={cn("[&_tr:last-child]:border-0", className)}>{children}</tbody>;
  }

  return (
    <StaggerContext.Provider value={true}>
      <motion.tbody
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: TABLE_ROW_STAGGER,
              delayChildren: TABLE_ROW_DELAY,
            },
          },
        }}
        className={cn("[&_tr:last-child]:border-0", className)}
      >
        {children}
      </motion.tbody>
    </StaggerContext.Provider>
  );
}

interface AnimatedTableRowProps {
  children: ReactNode;
  className?: string;
}

export function AnimatedTableRow({
  children,
  className,
}: AnimatedTableRowProps) {
  const shouldReduceMotion = useReducedMotion();
  const inStagger = useContext(StaggerContext);

  if (shouldReduceMotion || !inStagger) {
    return (
      <TableRow className={className}>
        {children}
      </TableRow>
    );
  }

  return (
    <motion.tr
      variants={fadeUpRowItem}
      className={cn(
        "border-b border-border transition-[background-color] data-[state=selected]:bg-muted",
        className,
      )}
    >
      {children}
    </motion.tr>
  );
}

/** Wraps a table block so search + table enter together on streamed pages */
export function RevealTableSection({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

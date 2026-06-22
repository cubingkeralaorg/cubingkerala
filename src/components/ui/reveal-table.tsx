"use client";

import {
  Children,
  cloneElement,
  isValidElement,
  useContext,
  type ReactElement,
  type ReactNode,
} from "react";
import { motion, useReducedMotion } from "framer-motion";
import { TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
  fadeUpTableCellItem,
  fadeUpTableRowItem,
  StaggerContext,
} from "@/components/ui/fade-up";

const TABLE_ROW_STAGGER = 0.02;
const TABLE_ROW_DELAY = 0.01;

function wrapCellContent(children: ReactNode) {
  return Children.map(children, (child) => {
    if (!isValidElement(child)) return child;

    const cell = child as ReactElement<{ children?: ReactNode }>;

    return cloneElement(cell, {
      children: (
        <motion.span
          variants={fadeUpTableCellItem}
          className="block w-full will-change-[transform,opacity]"
        >
          {cell.props.children}
        </motion.span>
      ),
    });
  });
}

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
      variants={fadeUpTableRowItem}
      className={cn(
        "border-b border-border transition-[background-color] data-[state=selected]:bg-muted",
        className,
      )}
    >
      {wrapCellContent(children)}
    </motion.tr>
  );
}

/** Layout wrapper for streamed table sections (row stagger handles reveal) */
export function RevealTableSection({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={className}>{children}</div>;
}

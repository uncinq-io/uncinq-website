"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  id?: string;
  /** Stagger offset in seconds — use for items in a row or grid. */
  delay?: number;
  /** Travel distance in px before settling. */
  y?: number;
  as?: "div" | "li" | "article" | "span";
};

/**
 * Scroll-triggered fade-and-rise. This is the site's single motion primitive —
 * everything that animates on scroll goes through it so timing stays uniform.
 * Respects prefers-reduced-motion by rendering the final state immediately.
 */
export function Reveal({
  children,
  className,
  id,
  delay = 0,
  y = 24,
  as = "div",
}: RevealProps) {
  const reduceMotion = useReducedMotion();
  const MotionTag = motion[as];

  return (
    <MotionTag
      id={id}
      className={cn(className)}
      initial={reduceMotion ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: 0.7,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </MotionTag>
  );
}

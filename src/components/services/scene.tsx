"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

/**
 * Framed stage for a per-service animated illustration. Provides the dark
 * rounded surface, a faint blueprint grid and a soft accent glow so every
 * scene reads consistently against the page. Children are the scene content.
 */
export function Scene({ children, label }: { children: ReactNode; label: string }) {
  return (
    <div
      role="img"
      aria-label={label}
      className="surface relative aspect-[4/3] w-full overflow-hidden rounded-2xl"
    >
      {/* blueprint grid */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />
      {/* soft accent glow */}
      <div
        aria-hidden
        className="absolute left-1/2 top-1/2 h-2/3 w-2/3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-600/15 blur-[80px]"
      />
      <div className="absolute inset-0">{children}</div>
    </div>
  );
}

/** Shared easing + a helper that returns static children when reduced motion. */
export function useSceneMotion() {
  const reduceMotion = useReducedMotion();
  const loop = (duration: number, delay = 0) => ({
    transition: { duration, delay, repeat: Infinity, ease: "easeInOut" as const },
  });
  return { reduceMotion, loop, motion };
}

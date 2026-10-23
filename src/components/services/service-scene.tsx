"use client";

import { motion, useReducedMotion } from "motion/react";
import { Scene } from "./scene";

/**
 * Maps a service id to a bespoke looping animated illustration shown in the
 * left column of the services page. All motion respects prefers-reduced-motion
 * by rendering the settled end-state.
 */
export function ServiceScene({ id, title }: { id: string; title: string }) {
  switch (id) {
    case "startup-software-development":
      return <StartupScene label={title} />;
    case "web-application-development":
      return <WebScene label={title} />;
    case "mobile-app-development":
      return <MobileScene label={title} />;
    case "ui-ux-design":
      return <DesignScene label={title} />;
    case "ai-data-solutions":
      return <AiScene label={title} />;
    case "e-commerce-development":
      return <CommerceScene label={title} />;
    case "cloud-devops":
      return <CloudScene label={title} />;
    default:
      return <Scene label={title}>{null}</Scene>;
  }
}

const EASE = [0.16, 1, 0.3, 1] as const;

/* ------------------------------------------------------------------ */
/* Startup: a window assembles, then a rocket lifts off with exhaust.  */
/* ------------------------------------------------------------------ */
function StartupScene({ label }: { label: string }) {
  const reduce = useReducedMotion();
  return (
    <Scene label={label}>
      {/* browser window */}
      <div className="absolute left-1/2 top-[16%] h-[46%] w-[62%] -translate-x-1/2 rounded-lg border border-white/15 bg-ink-900/80">
        <div className="flex items-center gap-1.5 border-b border-white/10 px-3 py-2">
          <span className="h-2 w-2 rounded-full bg-white/20" />
          <span className="h-2 w-2 rounded-full bg-white/20" />
          <span className="h-2 w-2 rounded-full bg-accent-500/70" />
        </div>
        <div className="space-y-2 p-3">
          <motion.div
            className="h-2 w-3/4 rounded bg-white/15"
            animate={reduce ? undefined : { opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <motion.div
            className="h-2 w-1/2 rounded bg-white/10"
            animate={reduce ? undefined : { opacity: [0.2, 0.9, 0.2] }}
            transition={{ duration: 3, delay: 0.4, repeat: Infinity }}
          />
          <motion.div
            className="mt-3 h-8 w-1/3 rounded bg-accent-500/40"
            animate={reduce ? undefined : { opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 3, delay: 0.8, repeat: Infinity }}
          />
        </div>
      </div>

      {/* rocket */}
      <motion.div
        className="absolute left-1/2 top-[30%] -translate-x-1/2"
        animate={reduce ? undefined : { y: [0, -6, 0] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg width="56" height="96" viewBox="0 0 56 96" fill="none">
          <path d="M28 4c8 8 12 20 12 32l8 14H8l8-14C16 24 20 12 28 4Z" fill="rgba(150,190,240,0.25)" stroke="rgba(150,190,240,0.8)" strokeWidth="1.5"/>
          <circle cx="28" cy="30" r="6" fill="rgba(74,138,196,0.6)" stroke="rgba(180,215,250,0.9)" strokeWidth="1.5"/>
          <path d="M20 52h16l-3 10H23l-3-10Z" fill="rgba(150,190,240,0.35)"/>
          {/* flame */}
          <motion.path
            d="M28 62c3 6 3 12 0 20-3-8-3-14 0-20Z"
            fill="rgba(111,176,226,0.9)"
            animate={reduce ? undefined : { scaleY: [1, 1.5, 0.8, 1.3, 1], opacity: [0.8, 1, 0.7, 1, 0.8] }}
            transition={{ duration: 0.9, repeat: Infinity }}
            style={{ transformOrigin: "28px 62px" }}
          />
        </svg>
      </motion.div>

      {/* rising dots = exhaust particles */}
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.span
          key={i}
          className="absolute bottom-[6%] h-1 w-1 rounded-full bg-accent-400/70"
          style={{ left: `${42 + i * 4}%` }}
          animate={reduce ? undefined : { y: [0, 26], opacity: [0.9, 0], scale: [1, 0.4] }}
          transition={{ duration: 1.4, delay: i * 0.22, repeat: Infinity, ease: "easeOut" }}
        />
      ))}
    </Scene>
  );
}

/* ------------------------------------------------------------------ */
/* Web: a browser window with a cursor that moves and "clicks" blocks. */
/* ------------------------------------------------------------------ */
function WebScene({ label }: { label: string }) {
  const reduce = useReducedMotion();
  return (
    <Scene label={label}>
      <div className="absolute left-1/2 top-1/2 h-[64%] w-[74%] -translate-x-1/2 -translate-y-1/2 rounded-lg border border-white/15 bg-ink-900/80">
        {/* chrome */}
        <div className="flex items-center gap-1.5 border-b border-white/10 px-3 py-2">
          <span className="h-2 w-2 rounded-full bg-white/20" />
          <span className="h-2 w-2 rounded-full bg-white/20" />
          <span className="h-2 w-2 rounded-full bg-white/20" />
          <span className="ml-2 h-3 flex-1 rounded bg-white/8 px-2 text-[7px] leading-3 text-ink-500">uncinq.io</span>
        </div>
        {/* content blocks that light up as the cursor "clicks" them */}
        <div className="grid grid-cols-3 gap-2 p-3">
          <motion.div className="col-span-3 h-6 rounded bg-white/12"
            animate={reduce ? undefined : { backgroundColor: ["rgba(255,255,255,0.12)", "rgba(74,138,196,0.45)", "rgba(255,255,255,0.12)"] }}
            transition={{ duration: 4, times: [0, 0.1, 0.3], repeat: Infinity }} />
          <motion.div className="h-10 rounded bg-white/8"
            animate={reduce ? undefined : { backgroundColor: ["rgba(255,255,255,0.08)", "rgba(74,138,196,0.4)", "rgba(255,255,255,0.08)"] }}
            transition={{ duration: 4, times: [0.3, 0.4, 0.6], repeat: Infinity }} />
          <motion.div className="h-10 rounded bg-white/8"
            animate={reduce ? undefined : { backgroundColor: ["rgba(255,255,255,0.08)", "rgba(74,138,196,0.4)", "rgba(255,255,255,0.08)"] }}
            transition={{ duration: 4, times: [0.5, 0.6, 0.8], repeat: Infinity }} />
          <motion.div className="h-10 rounded bg-white/8"
            animate={reduce ? undefined : { backgroundColor: ["rgba(255,255,255,0.08)", "rgba(74,138,196,0.4)", "rgba(255,255,255,0.08)"] }}
            transition={{ duration: 4, times: [0.7, 0.8, 1], repeat: Infinity }} />
        </div>
      </div>

      {/* cursor travelling between click targets */}
      <motion.div
        className="absolute left-0 top-0 z-10"
        animate={
          reduce
            ? undefined
            : {
                x: ["38%", "60%", "42%", "68%", "38%"],
                y: ["38%", "52%", "66%", "60%", "38%"],
              }
        }
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M4 3l14 8-6 2-3 6L4 3Z" fill="white" stroke="rgba(0,0,0,0.4)" strokeWidth="1" />
        </svg>
        {/* click ripple */}
        <motion.span
          className="absolute -left-1 -top-1 h-6 w-6 rounded-full border border-accent-300"
          animate={reduce ? undefined : { scale: [0.3, 1.3], opacity: [0.9, 0] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut" }}
        />
      </motion.div>
    </Scene>
  );
}

/* ------------------------------------------------------------------ */
/* Mobile: a phone; an app sheet slides up from the bottom.            */
/* ------------------------------------------------------------------ */
function MobileScene({ label }: { label: string }) {
  const reduce = useReducedMotion();
  return (
    <Scene label={label}>
      {/* phone frame */}
      <div className="absolute left-1/2 top-1/2 h-[80%] w-[38%] -translate-x-1/2 -translate-y-1/2 rounded-[1.6rem] border border-white/15 bg-ink-900/90 p-1.5">
        <div className="relative h-full w-full overflow-hidden rounded-[1.2rem] bg-ink-850">
          {/* notch */}
          <div className="absolute left-1/2 top-1.5 h-3 w-16 -translate-x-1/2 rounded-full bg-black/70" />
          {/* home screen dots */}
          <div className="absolute inset-x-0 top-[16%] grid grid-cols-4 gap-2 px-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <span key={i} className="aspect-square rounded-md bg-white/10" />
            ))}
          </div>
          {/* app sheet sliding up */}
          <motion.div
            className="absolute inset-x-0 bottom-0 h-[62%] rounded-t-2xl border-t border-accent-500/30 bg-gradient-to-b from-ink-800 to-ink-900"
            animate={reduce ? undefined : { y: ["100%", "0%", "0%", "100%"] }}
            transition={{ duration: 4.5, times: [0, 0.25, 0.75, 1], repeat: Infinity, ease: EASE }}
          >
            <div className="mx-auto mt-2 h-1 w-10 rounded-full bg-white/20" />
            <div className="space-y-2 p-4">
              <div className="h-2.5 w-2/3 rounded bg-accent-500/50" />
              <div className="h-2 w-full rounded bg-white/12" />
              <div className="h-2 w-5/6 rounded bg-white/12" />
              <div className="mt-3 h-9 w-full rounded-lg bg-accent-500/60" />
            </div>
          </motion.div>
        </div>
      </div>
    </Scene>
  );
}

/* ------------------------------------------------------------------ */
/* Design: a pen draws a wireframe that resolves into a filled frame.  */
/* ------------------------------------------------------------------ */
function DesignScene({ label }: { label: string }) {
  const reduce = useReducedMotion();
  const path =
    "M30 40 H170 M30 40 V160 M170 40 V160 M30 160 H170 M48 62 H120 M48 82 H150 M48 104 H100";
  return (
    <Scene label={label}>
      <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full">
        <motion.path
          d={path}
          fill="none"
          stroke="rgba(150,190,240,0.85)"
          strokeWidth="2"
          strokeLinecap="round"
          initial={reduce ? false : { pathLength: 0 }}
          animate={reduce ? undefined : { pathLength: [0, 1, 1, 0] }}
          transition={{ duration: 6, times: [0, 0.5, 0.8, 1], repeat: Infinity, ease: "easeInOut" }}
        />
        {/* accent block that fades in once drawn */}
        <motion.rect
          x="48" y="124" width="60" height="18" rx="4"
          fill="rgba(74,138,196,0.5)"
          animate={reduce ? undefined : { opacity: [0, 0, 1, 1, 0] }}
          transition={{ duration: 6, times: [0, 0.45, 0.6, 0.85, 1], repeat: Infinity }}
        />
        {/* pen tip */}
        <motion.circle
          r="4"
          fill="rgba(180,215,250,1)"
          animate={reduce ? undefined : { opacity: [1, 1, 0] }}
          transition={{ duration: 6, times: [0, 0.5, 0.6], repeat: Infinity }}
        >
          <animateMotion dur="6s" repeatCount="indefinite" path={path} />
        </motion.circle>
      </svg>
    </Scene>
  );
}

/* ------------------------------------------------------------------ */
/* AI & Data: nodes pulse and connect into a network; a pulse travels. */
/* ------------------------------------------------------------------ */
function AiScene({ label }: { label: string }) {
  const reduce = useReducedMotion();
  const nodes = [
    { x: 100, y: 40 }, { x: 55, y: 80 }, { x: 145, y: 80 },
    { x: 40, y: 130 }, { x: 100, y: 120 }, { x: 160, y: 130 }, { x: 100, y: 165 },
  ];
  const links = [[0,1],[0,2],[1,3],[1,4],[2,4],[2,5],[4,6],[3,6],[5,6],[4,3],[4,5]];
  return (
    <Scene label={label}>
      <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full">
        {links.map(([a, b], i) => (
          <motion.line
            key={i}
            x1={nodes[a].x} y1={nodes[a].y} x2={nodes[b].x} y2={nodes[b].y}
            stroke="rgba(111,176,226,0.5)" strokeWidth="1"
            animate={reduce ? undefined : { opacity: [0.15, 0.7, 0.15] }}
            transition={{ duration: 2.4, delay: i * 0.2, repeat: Infinity }}
          />
        ))}
        {nodes.map((n, i) => (
          <motion.circle
            key={i}
            cx={n.x} cy={n.y} r="5"
            fill={i === 0 ? "rgba(111,176,226,1)" : "rgba(74,138,196,0.8)"}
            animate={reduce ? undefined : { scale: [1, 1.4, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, delay: i * 0.25, repeat: Infinity }}
            style={{ transformOrigin: `${n.x}px ${n.y}px` }}
          />
        ))}
        {/* travelling pulse from the centre node */}
        <motion.circle r="3" fill="white"
          animate={reduce ? undefined : { opacity: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity }}>
          <animateMotion dur="2s" repeatCount="indefinite"
            path={`M100 120 L100 40 L145 80 L160 130 L100 165 L40 130 L55 80 Z`} />
        </motion.circle>
      </svg>
    </Scene>
  );
}

/* ------------------------------------------------------------------ */
/* E-commerce: a product card; items drop into a cart that checks out. */
/* ------------------------------------------------------------------ */
function CommerceScene({ label }: { label: string }) {
  const reduce = useReducedMotion();
  return (
    <Scene label={label}>
      {/* product cards */}
      {[0, 1].map((i) => (
        <motion.div
          key={i}
          className="absolute top-[18%] h-[30%] w-[26%] rounded-lg border border-white/12 bg-ink-900/80 p-2"
          style={{ left: `${16 + i * 30}%` }}
          animate={reduce ? undefined : { y: [0, -4, 0] }}
          transition={{ duration: 2.6, delay: i * 0.4, repeat: Infinity }}
        >
          <div className="h-1/2 rounded bg-white/10" />
          <div className="mt-2 h-1.5 w-3/4 rounded bg-white/15" />
          <div className="mt-1 h-1.5 w-1/2 rounded bg-accent-500/50" />
        </motion.div>
      ))}

      {/* falling item into the cart */}
      <motion.div
        className="absolute left-[62%] top-[22%] h-5 w-5 rounded bg-accent-400/90"
        animate={reduce ? undefined : { y: [0, 90], opacity: [0, 1, 1, 0], rotate: [0, 12] }}
        transition={{ duration: 2.2, times: [0, 0.15, 0.7, 1], repeat: Infinity, ease: "easeIn" }}
      />

      {/* cart */}
      <div className="absolute bottom-[14%] left-1/2 -translate-x-1/2">
        <svg width="72" height="48" viewBox="0 0 72 48" fill="none">
          <path d="M6 6h8l6 24h34l6-16H20" stroke="rgba(180,215,250,0.9)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <motion.circle cx="26" cy="40" r="4" fill="rgba(111,176,226,0.9)"
            animate={reduce ? undefined : { scale: [1, 1.3, 1] }} transition={{ duration: 2.2, repeat: Infinity }} style={{ transformOrigin: "26px 40px" }} />
          <motion.circle cx="46" cy="40" r="4" fill="rgba(111,176,226,0.9)"
            animate={reduce ? undefined : { scale: [1, 1.3, 1] }} transition={{ duration: 2.2, delay: 0.2, repeat: Infinity }} style={{ transformOrigin: "46px 40px" }} />
        </svg>
        {/* checkout check flash */}
        <motion.span
          className="absolute -right-3 -top-3 grid h-6 w-6 place-items-center rounded-full bg-accent-500 text-[11px] font-bold text-white"
          animate={reduce ? undefined : { scale: [0, 0, 1.2, 1, 0], opacity: [0, 0, 1, 1, 0] }}
          transition={{ duration: 2.2, times: [0, 0.6, 0.7, 0.9, 1], repeat: Infinity }}
        >
          ✓
        </motion.span>
      </div>
    </Scene>
  );
}

/* ------------------------------------------------------------------ */
/* Cloud & DevOps: a cloud; upload arrows rise into it; bars pulse.    */
/* ------------------------------------------------------------------ */
function CloudScene({ label }: { label: string }) {
  const reduce = useReducedMotion();

  return (
    <Scene label={label}>
      <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full">
        {/* cloud, gently bobbing */}
        <motion.path
          d="M62 116a20 20 0 0 1 4-39.6 27 27 0 0 1 52-7 18 18 0 0 1 22 18.6 16 16 0 0 1-4 28Z"
          fill="rgba(74,138,196,0.16)"
          stroke="rgba(150,190,240,0.7)"
          strokeWidth="1.5"
          strokeLinejoin="round"
          animate={reduce ? undefined : { y: [0, -5, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* upload arrows rising into the cloud */}
        {[0, 1, 2].map((i) => (
          <motion.path
            key={i}
            d={`M${82 + i * 18} 168 v-12 m-4 4 l4-4 4 4`}
            stroke="rgba(150,190,240,0.8)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            animate={reduce ? undefined : { opacity: [0, 1, 0], y: [4, -6] }}
            transition={{ duration: 2, delay: i * 0.4, repeat: Infinity }}
          />
        ))}
      </svg>

      {/* status bars */}
      <div className="absolute bottom-[9%] left-1/2 flex -translate-x-1/2 items-end gap-1.5">
        {[0.5, 0.8, 0.65, 1, 0.75].map((h, i) => (
          <motion.span
            key={i}
            className="w-2 origin-bottom rounded-sm bg-accent-500/60"
            style={{ height: 10 }}
            animate={reduce ? undefined : { scaleY: [h, 1, h] }}
            transition={{ duration: 1.6, delay: i * 0.15, repeat: Infinity }}
          />
        ))}
      </div>
    </Scene>
  );
}

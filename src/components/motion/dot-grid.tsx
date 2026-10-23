"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

type DotGridProps = {
  className?: string;
  /** Grid spacing in px (DeepSeek uses 90). */
  spacing?: number;
  /** Cursor repulsion radius in px (DeepSeek uses 140). */
  repelRadius?: number;
  /** Base dot size in px. */
  dotSize?: number;
  lineColor?: string; // rgba prefix, e.g. "rgba(60, 100, 160,"
  dotColor?: string;
  lineOpacity?: number;
  dotOpacity?: number;
  /** If true, render a static grid with no pointer interaction. */
  isStatic?: boolean;
  /** If true, dots gently drift on their own even without cursor input. */
  idle?: boolean;
  /**
   * "grid" = uniform full-bleed lattice (hero). "cluster" = an organic blob of
   * dots concentrated toward the centre with radial density falloff, like
   * DeepSeek's "Join the DSH plugin ecosystem" background.
   */
  variant?: "grid" | "cluster";
  /** Cluster mode: horizontal/vertical radius of the blob as a fraction of
   *  the canvas (0–1). */
  clusterRadiusX?: number;
  clusterRadiusY?: number;
};

type Dot = {
  restX: number;
  restY: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  /** Base opacity multiplier (1 = full). Used by the cluster falloff. */
  alpha: number;
};

/**
 * Interactive dotted grid, ported from the DeepSeek Harness hero overlay.
 * Dots sit on a square lattice; near neighbours are joined with faint lines.
 * Within a radius of the cursor, dots are pushed away with a spring return
 * and briefly grow / brighten. Purely decorative; disabled for coarse
 * pointers and when the user prefers reduced motion.
 */
export function DotGrid({
  className,
  spacing = 72,
  repelRadius = 140,
  dotSize = 1.8,
  lineColor = "rgba(96, 140, 200,",
  dotColor = "rgba(120, 165, 225,",
  lineOpacity = 0.12,
  dotOpacity = 0.28,
  isStatic = false,
  idle = false,
  variant = "grid",
  clusterRadiusX = 0.34,
  clusterRadiusY = 0.4,
}: DotGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    // Skip entirely on touch devices (matches DeepSeek's behaviour).
    if (window.matchMedia("(hover: none), (pointer: coarse)").matches) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let dots: Dot[] = [];
    let cols = 0;
    let rows = 0;
    let w = 0;
    let h = 0;
    let running = true;
    let sleeping = false;
    let raf = 0;
    let resizeTimer: ReturnType<typeof setTimeout> | null = null;
    const mouse = { x: NaN, y: NaN };

    function build() {
      dots = [];
      if (variant === "cluster") {
        // Jittered lattice trimmed to an organic centre-weighted blob.
        const cx = w / 2;
        const cy = h / 2;
        const rx = w * clusterRadiusX;
        const ry = h * clusterRadiusY;
        cols = Math.ceil(w / spacing) + 1;
        rows = Math.ceil(h / spacing) + 1;
        const ox = (w - (cols - 1) * spacing) / 2;
        const oy = (h - (rows - 1) * spacing) / 2;
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            // jitter so it reads organic, not machined
            const x = ox + spacing * c + (Math.random() - 0.5) * spacing * 0.7;
            const y = oy + spacing * r + (Math.random() - 0.5) * spacing * 0.7;
            const ndx = (x - cx) / rx;
            const ndy = (y - cy) / ry;
            const dNorm = Math.sqrt(ndx * ndx + ndy * ndy); // 0 centre → 1 edge
            if (dNorm > 1) continue; // outside the blob
            // Density falloff: keep almost all centre dots, drop toward edge.
            if (Math.random() < dNorm * dNorm * 0.9) continue;
            const alpha = Math.max(0.15, 1 - dNorm * dNorm);
            dots.push({ restX: x, restY: y, x, y, vx: 0, vy: 0, alpha });
          }
        }
        return;
      }

      // Uniform grid.
      cols = Math.ceil(w / spacing) + 1;
      rows = Math.ceil(h / spacing) + 1;
      const ox = (w - (cols - 1) * spacing) / 2;
      const oy = (h - (rows - 1) * spacing) / 2;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = ox + spacing * c;
          const y = oy + spacing * r;
          dots.push({ restX: x, restY: y, x, y, vx: 0, vy: 0, alpha: 1 });
        }
      }
    }

    function measure() {
      w = canvas!.clientWidth;
      h = canvas!.clientHeight;
      canvas!.width = w * dpr;
      canvas!.height = h * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
    }

    function wake() {
      if (sleeping) {
        sleeping = false;
        raf = requestAnimationFrame(frame);
      }
    }

    function onMove(e: MouseEvent) {
      if (isStatic) return;
      const r = canvas!.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
      wake();
    }

    // ~30fps cap, like the original.
    let last = 0;
    const frameInterval = 1000 / 30;

    function frame(now: number) {
      if (!running) return;
      if (now - last < frameInterval) {
        raf = requestAnimationFrame(frame);
        return;
      }
      last = now - ((now - last) % frameInterval);

      const cw = canvas!.clientWidth;
      const ch = canvas!.clientHeight;
      if (cw !== w || ch !== h) {
        measure();
        if (resizeTimer) clearTimeout(resizeTimer);
        resizeTimer = setTimeout(build, 150);
      }

      ctx!.clearRect(0, 0, w, h);
      const mx = mouse.x;
      const my = mouse.y;
      let maxV = 0;

      // Physics: repel from cursor, spring back to rest, damped.
      const tSec = now / 1000;
      for (let i = 0; i < dots.length; i++) {
        const d = dots[i];

        // Gentle autonomous drift so the field reads as "alive" without input.
        if (idle) {
          d.vx += Math.sin(tSec * 0.6 + d.restY * 0.02 + i * 0.13) * 0.012;
          d.vy += Math.cos(tSec * 0.5 + d.restX * 0.02 + i * 0.11) * 0.012;
        }

        const dx = d.x - mx;
        const dy = d.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < repelRadius && dist > 0.1) {
          const f = (1 - dist / repelRadius) * 30;
          d.vx += (dx / dist) * f * 0.1;
          d.vy += (dy / dist) * f * 0.1;
        }
        d.vx += 0.05 * (d.restX - d.x);
        d.vy += 0.05 * (d.restY - d.y);
        d.vx *= 0.85;
        d.vy *= 0.85;
        d.x += d.vx;
        d.y += d.vy;
        const speed = Math.abs(d.vx) + Math.abs(d.vy);
        if (speed > maxV) maxV = speed;
      }

      // Connecting lines. Grid: join lattice neighbours. Cluster: join by
      // proximity (the lattice indices no longer imply adjacency after drops).
      ctx!.strokeStyle = `${lineColor} ${lineOpacity})`;
      ctx!.lineWidth = 0.5;
      if (variant === "cluster") {
        const maxLink = spacing * 1.6;
        for (let i = 0; i < dots.length; i++) {
          const a = dots[i];
          for (let j = i + 1; j < dots.length; j++) {
            const b = dots[j];
            const dx = b.x - a.x;
            const dy = b.y - a.y;
            const d2 = dx * dx + dy * dy;
            if (d2 > maxLink * maxLink) continue;
            const len = Math.sqrt(d2);
            if (len < 1) continue;
            const ux = dx / len;
            const uy = dy / len;
            // Fade the line with the dimmer of the two ends.
            ctx!.globalAlpha = Math.min(a.alpha, b.alpha);
            ctx!.beginPath();
            ctx!.moveTo(a.x + 6 * ux, a.y + 6 * uy);
            ctx!.lineTo(b.x - 6 * ux, b.y - 6 * uy);
            ctx!.stroke();
          }
        }
        ctx!.globalAlpha = 1;
      } else {
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols - 1; c++) {
            const a = dots[r * cols + c];
            const b = dots[r * cols + c + 1];
            link(a, b);
          }
        }
        for (let c = 0; c < cols; c++) {
          for (let r = 0; r < rows - 1; r++) {
            const a = dots[r * cols + c];
            const b = dots[(r + 1) * cols + c];
            link(a, b);
          }
        }
      }

      function link(a: Dot, b: Dot) {
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const len = Math.sqrt(dx * dx + dy * dy);
        if (len < 20) return; // too close — skip to avoid a blob
        const ux = dx / len;
        const uy = dy / len;
        ctx!.beginPath();
        ctx!.moveTo(a.x + 10 * ux, a.y + 10 * uy);
        ctx!.lineTo(b.x - 10 * ux, b.y - 10 * uy);
        ctx!.stroke();
      }

      // Dots; grow + brighten near the cursor, scaled by per-dot base alpha.
      ctx!.fillStyle = `${dotColor} ${dotOpacity})`;
      for (let i = 0; i < dots.length; i++) {
        const d = dots[i];
        let size = dotSize;
        let alpha = dotOpacity * d.alpha;
        if (!isNaN(mx) && !isNaN(my)) {
          const dx = d.x - mx;
          const dy = d.y - my;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const boost = Math.max(0, 1 - dist / repelRadius);
          size = dotSize + 2 * boost;
          alpha = (dotOpacity + 0.4 * boost) * d.alpha;
        }
        ctx!.globalAlpha = alpha;
        const s2 = size * 2;
        ctx!.fillRect(d.x - size, d.y - size, s2, s2);
      }
      ctx!.globalAlpha = 1;

      // Sleep when everything settles (saves battery) — unless idle drift
      // keeps it alive by design.
      if (maxV < 0.01 && !idle) {
        sleeping = true;
        return;
      }
      raf = requestAnimationFrame(frame);
    }

    measure();
    if (reduceMotion || isStatic) {
      // Draw once, no loop.
      drawStatic();
    } else {
      window.addEventListener("mousemove", onMove, { passive: true });
      raf = requestAnimationFrame(frame);
    }

    function drawStatic() {
      ctx!.clearRect(0, 0, w, h);
      ctx!.strokeStyle = `${lineColor} ${lineOpacity})`;
      ctx!.lineWidth = 0.5;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols - 1; c++) {
          const a = dots[r * cols + c];
          const b = dots[r * cols + c + 1];
          ctx!.beginPath();
          ctx!.moveTo(a.x, a.y);
          ctx!.lineTo(b.x, b.y);
          ctx!.stroke();
        }
      }
      ctx!.fillStyle = `${dotColor} ${dotOpacity})`;
      for (const d of dots) {
        ctx!.fillRect(d.x - dotSize, d.y - dotSize, dotSize * 2, dotSize * 2);
      }
    }

    const io = new IntersectionObserver(
      (entries) => {
        running = entries[0].isIntersecting;
        if (running && !reduceMotion && !isStatic) {
          sleeping = false;
          wake();
        }
      },
      { threshold: 0 },
    );
    io.observe(canvas);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      if (resizeTimer) clearTimeout(resizeTimer);
      window.removeEventListener("mousemove", onMove);
      io.disconnect();
    };
  }, [reduceMotion, spacing, repelRadius, dotSize, lineColor, dotColor, lineOpacity, dotOpacity, isStatic, idle, variant, clusterRadiusX, clusterRadiusY]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        background: "transparent",
      }}
    />
  );
}

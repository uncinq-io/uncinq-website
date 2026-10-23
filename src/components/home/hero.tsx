"use client";

import { motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { HeroGradient } from "@/components/home/hero-gradient";
import { DotGrid } from "@/components/motion/dot-grid";

export function Hero() {
  const reduceMotion = useReducedMotion();

  // Blur-fade rise entrance, matching the DeepSeek harness hero timing.
  const rise = (delay: number) => ({
    initial: reduceMotion
      ? false
      : { opacity: 0, y: 24, filter: "blur(10px)" },
    animate: { opacity: 1, y: 0, filter: "blur(0px)" },
    transition: { duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] as const },
  });

  return (
    <section className="relative isolate overflow-hidden pb-24 pt-40 lg:pb-32 lg:pt-52">
      {/* Full animated WebGL gradient, fading to black toward the bottom. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          maskImage:
            "linear-gradient(#000000fc 0%, #000000e8 8.98%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(#000000fc 0%, #000000e8 8.98%, transparent 100%)",
        }}
      >
        <HeroGradient />
      </div>

      {/* Interactive dotted "world map" grid, layered over the gradient and
          faded out toward the bottom — the DeepSeek hero texture. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-[5]"
        style={{
          maskImage:
            "linear-gradient(#000000fc 0%, #000000e8 8.98%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(#000000fc 0%, #000000e8 8.98%, transparent 100%)",
        }}
      >
        <DotGrid spacing={80} lineOpacity={0.06} dotOpacity={0.18} />
      </div>

      <Container>
        <div className="max-w-4xl">
          <motion.span {...rise(0)} className="eyebrow">
            Washington DC · Kigali
          </motion.span>

          <h1 className="mt-8 font-display text-[2.75rem] font-bold leading-[1.03] tracking-[-0.03em] sm:text-6xl lg:text-[5.25rem]">
            <motion.span {...rise(0.08)} className="block">
              Reliable. Efficient.
            </motion.span>
            <motion.span {...rise(0.18)} className="block text-accent-400">
              Built to last.
            </motion.span>
          </h1>

          <motion.p
            {...rise(0.32)}
            className="mt-9 max-w-2xl text-lg leading-relaxed text-ink-300 sm:text-xl"
          >
            The software studio behind products your users rely on every day. We
            design, build and run — end to end.
          </motion.p>

          <motion.div
            {...rise(0.42)}
            className="mt-11 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <ButtonLink href="/contact" size="lg" className="group">
              Start a project
              <ArrowRight
                size={17}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </ButtonLink>
            <ButtonLink href="/work" size="lg" variant="secondary">
              See our work
            </ButtonLink>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

"use client";

import { motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
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
      <HeroBackdrop />

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

/**
 * Dark backdrop in three layers: a faint large lattice, an ambient blue wash
 * rising from the lower centre, and a drifting cluster of particles that part
 * around the cursor. Deliberately avoids any large continuous shape — earlier
 * gradient-based versions resolved into faces or clustered holes.
 */
function HeroBackdrop() {
  const edgeFade =
    "radial-gradient(ellipse 85% 75% at 50% 35%, #000 35%, transparent 78%)";

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
      {/* Faint lattice, fading out toward the edges. */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(to right, white 1px, transparent 1px)," +
            "linear-gradient(to bottom, white 1px, transparent 1px)",
          backgroundSize: "164px 164px",
          maskImage: edgeFade,
          WebkitMaskImage: edgeFade,
        }}
      />

      {/* Ambient blue, strongest low and centre-right. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 75% 55% at 52% 102%, rgba(43,108,158,0.40), transparent 72%)," +
            "radial-gradient(ellipse 48% 42% at 80% 52%, rgba(32,86,134,0.26), transparent 72%)",
        }}
      />

      {/* Particle cluster, offset right so it does not sit under the copy. */}
      <div className="absolute inset-y-0 left-[26%] right-0">
        <DotGrid
          variant="cluster"
          idle
          entrance
          spacing={46}
          dotSize={1.4}
          repelRadius={150}
          lineColor="rgba(130, 180, 230,"
          dotColor="rgba(170, 208, 242,"
          lineOpacity={0.07}
          dotOpacity={0.5}
          clusterRadiusX={0.44}
          clusterRadiusY={0.46}
        />
      </div>

      {/* Settle back into the page background. */}
      <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-ink-950 to-transparent" />
    </div>
  );
}

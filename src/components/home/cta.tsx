import { site } from "@/lib/site";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/motion/reveal";
import { DotGrid } from "@/components/motion/dot-grid";

export function CallToAction() {
  return (
    <section className="relative isolate overflow-hidden border-t border-white/10 py-28 lg:py-36">
      {/* Soft accent glow rising from the bottom. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_80%_at_50%_100%,var(--color-accent-700)/25,transparent_70%)]"
      />
      {/* Organic cluster of dots, like DeepSeek's "Join the DSH plugin
          ecosystem" background — centre-weighted, drifting gently. */}
      <DotGrid
        className="-z-[5]"
        variant="cluster"
        spacing={42}
        dotSize={1.7}
        lineOpacity={0.16}
        dotOpacity={0.6}
        lineColor="rgba(110, 155, 220,"
        dotColor="rgba(150, 190, 240,"
        idle
      />

      <Container>
        <Reveal className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-4xl font-bold tracking-[-0.03em] sm:text-5xl lg:text-6xl">
            Ship something that lasts.
          </h2>

          <div className="mt-10">
            <a
              href={`mailto:${site.email}`}
              className="inline-flex h-13 items-center justify-center rounded-xl bg-white px-8 text-[0.95rem] font-medium text-ink-950 transition-transform duration-300 ease-[var(--ease-out-quint)] hover:scale-[1.03]"
            >
              {site.email}
            </a>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

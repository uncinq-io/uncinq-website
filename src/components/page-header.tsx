import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/motion/reveal";

export function PageHeader({
  eyebrow,
  title,
  lede,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden border-b border-white/10 pb-20 pt-36 lg:pb-24 lg:pt-48">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_70%_100%_at_50%_0%,var(--color-accent-700)/18,transparent_70%)]"
      />
      <Container>
        <Reveal className="max-w-3xl">
          {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
          <h1 className="mt-6 font-display text-4xl font-semibold leading-[1.08] sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          {lede ? (
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-300">
              {lede}
            </p>
          ) : null}
        </Reveal>
      </Container>
    </section>
  );
}

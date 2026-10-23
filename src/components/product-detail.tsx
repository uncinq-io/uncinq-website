import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import type { Project } from "@/lib/projects";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

export function ProductDetail({ project }: { project: Project }) {
  const detail = project.detail;
  if (!detail) return null;

  const heroImage = detail.heroImage ?? project.image;
  const heroPosition = detail.heroImage
    ? detail.heroImagePosition
    : project.imagePosition;

  return (
    <article>
      <header className="pb-14 pt-36 lg:pt-48">
        <Container>
          <Link
            href="/work"
            className="inline-flex items-center gap-2 text-sm text-ink-400 transition-colors hover:text-white"
          >
            <ArrowLeft size={15} /> All work
          </Link>

          <Reveal className="mt-10 max-w-4xl">
            <span className="font-mono text-xs uppercase tracking-[0.18em] text-accent-500">
              {project.category}
            </span>
            <h1 className="mt-5 font-display text-5xl font-bold leading-[1.03] tracking-[-0.03em] sm:text-6xl lg:text-7xl">
              {project.name}
            </h1>
            <p className="mt-6 max-w-2xl text-xl leading-relaxed text-ink-300">
              {detail.tagline}
            </p>
          </Reveal>
        </Container>
      </header>

      {heroImage ? (
        <Container>
          <Reveal className="relative aspect-16/9 w-full overflow-hidden rounded-2xl border border-white/10">
            <Image
              src={heroImage}
              alt={`${project.name} interface`}
              fill
              priority
              sizes="(min-width: 1280px) 1216px, 100vw"
              className={cn(
                "object-cover",
                heroPosition === "top" ? "object-top" : "object-center",
              )}
            />
          </Reveal>
        </Container>
      ) : null}

      <Container className="py-20 lg:py-28">
        <div className="grid gap-14 lg:grid-cols-[1fr_1.6fr] lg:gap-20">
          <Reveal>
            <dl className="flex flex-col gap-8">
              <div>
                <dt className="font-mono text-xs uppercase tracking-[0.18em] text-ink-500">
                  Platform
                </dt>
                <dd className="mt-2 text-ink-200">{detail.platform}</dd>
              </div>
              <div>
                <dt className="font-mono text-xs uppercase tracking-[0.18em] text-ink-500">
                  What we did
                </dt>
                <dd className="mt-3 flex flex-wrap gap-2">
                  {detail.role.map((role) => (
                    <span
                      key={role}
                      className="rounded-full border border-white/12 px-3 py-1.5 text-xs text-ink-300"
                    >
                      {role}
                    </span>
                  ))}
                </dd>
              </div>
            </dl>
          </Reveal>

          <Reveal
            delay={0.1}
            className="space-y-6 text-lg leading-relaxed text-ink-300"
          >
            {detail.overview.map((paragraph) => (
              <p key={paragraph.slice(0, 40)}>{paragraph}</p>
            ))}
          </Reveal>
        </div>
      </Container>

      <section className="border-y border-white/10 bg-ink-900/40 py-20 lg:py-28">
        <Container>
          <Reveal>
            <span className="eyebrow">What it does</span>
          </Reveal>

          <div className="mt-12 grid gap-x-16 md:grid-cols-2">
            {detail.features.map((feature, i) => (
              <Reveal key={feature.title} delay={(i % 2) * 0.08}>
                <div className="border-t border-white/10 py-7">
                  <h2 className="font-display text-lg font-bold">
                    {feature.title}
                  </h2>
                  <p className="mt-2 text-[0.95rem] leading-relaxed text-ink-400">
                    {feature.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <Container className="py-20 lg:py-28">
        <Reveal>
          <span className="eyebrow">Screens</span>
          <h2 className="mt-5 font-display text-3xl font-bold tracking-[-0.03em] sm:text-4xl">
            Inside the app
          </h2>
        </Reveal>

        <ul className="mt-14 grid grid-cols-2 gap-6 md:grid-cols-3 lg:gap-8">
          {detail.gallery.map((shot, i) => (
            <Reveal key={shot.src} as="li" delay={(i % 3) * 0.08}>
              <figure>
                <div className="relative aspect-1/2 overflow-hidden rounded-2xl border border-white/10 bg-ink-900">
                  <Image
                    src={shot.src}
                    alt={shot.alt}
                    fill
                    sizes="(min-width: 768px) 30vw, 45vw"
                    className="object-contain"
                  />
                </div>
                <figcaption className="mt-4 text-sm leading-relaxed text-ink-500">
                  {shot.caption}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </ul>
      </Container>
    </article>
  );
}

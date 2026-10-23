import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { projects } from "@/lib/projects";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/motion/reveal";
import { ProjectCard } from "@/components/project-card";

export function Projects() {
  return (
    <Section id="work">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <Reveal>
          <h2 className="font-display text-4xl font-bold tracking-[-0.03em] sm:text-5xl">
            Our work
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <Link
            href="/work"
            className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-accent-500 transition-colors hover:text-accent-300"
          >
            All case studies
            <ArrowRight
              size={14}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </Reveal>
      </div>

      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        {projects.map((project, i) => (
          <Reveal key={project.slug} delay={(i % 2) * 0.1} as="article">
            <ProjectCard project={project} />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

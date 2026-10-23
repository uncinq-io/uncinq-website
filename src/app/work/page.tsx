import type { Metadata } from "next";
import { projects } from "@/lib/projects";
import { getAllWork } from "@/lib/content";
import { PageHeader } from "@/components/page-header";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/motion/reveal";
import { ProjectCard } from "@/components/project-card";
import { WorkCard } from "@/components/work-card";
import { CallToAction } from "@/components/home/cta";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Products Uncinq has designed, built and shipped — fintech, travel, faith and social apps.",
  alternates: { canonical: "/work" },
};

export default function WorkPage() {
  const caseStudies = getAllWork();

  return (
    <>
      <PageHeader
        eyebrow="Work"
        title="Products we have designed, built and shipped"
        lede="Each of these started as a problem someone described to us. We took them from first sketch through to something running in front of real users."
      />

      <Container className="py-20 lg:py-28">
        <div className="grid gap-6 lg:grid-cols-2">
          {projects.map((project, i) => (
            <Reveal key={project.slug} delay={(i % 2) * 0.1} as="article">
              <ProjectCard project={project} />
            </Reveal>
          ))}
        </div>

        {caseStudies.length > 0 ? (
          <div className="mt-28">
            <Reveal>
              <span className="eyebrow">Written up</span>
              <h2 className="mt-5 font-display text-3xl font-bold tracking-[-0.03em] sm:text-4xl">
                Case studies
              </h2>
              <p className="mt-4 max-w-2xl leading-relaxed text-ink-300">
                The longer story on a few of these — the constraint we worked
                against, the approach, and what the client measured.
              </p>
            </Reveal>

            <div className="mt-12 grid gap-6 lg:grid-cols-2">
              {caseStudies.map((entry, i) => (
                <Reveal key={entry.slug} delay={(i % 2) * 0.1}>
                  <WorkCard entry={entry} />
                </Reveal>
              ))}
            </div>
          </div>
        ) : null}
      </Container>

      <CallToAction />
    </>
  );
}

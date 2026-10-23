import type { Metadata } from "next";
import { site } from "@/lib/site";
import { PageHeader } from "@/components/page-header";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/motion/reveal";
import { CallToAction } from "@/components/home/cta";

export const metadata: Metadata = {
  title: "About",
  description: `${site.name} is a software studio with teams in Washington DC, Maryland, and Kigali.`,
  alternates: { canonical: "/about" },
};

const commitments = [
  {
    title: "Say the inconvenient thing early",
    body: "If a deadline is unrealistic or a feature is not worth building, you hear it while it is still cheap to change.",
  },
  {
    title: "Senior people on the actual work",
    body: "The engineers in your kickoff are the engineers writing the code. No bait-and-switch staffing.",
  },
  {
    title: "Leave it better documented than we found it",
    body: "Handover is part of delivery. You should never be hostage to us knowing something you do not.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        title="A small studio that builds software properly"
        lede="Development and implementation happen in Kigali, with some of the strongest engineering talent in the region. Discovery, engineering leadership, and deployment run out of Washington DC and Maryland. One team, one contract, one set of people who answer for the outcome."
      />

      <Container className="py-20 lg:py-24">
        <Reveal className="max-w-2xl space-y-6 text-lg leading-relaxed text-ink-300">
          <p>
            Most organisations do not have a technology problem. They have a
            problem technology could solve, wrapped in constraints that generic
            advice ignores — a budget, a regulator, a team that has to keep the
            existing system running while the new one is built.
          </p>
          <p>
            We stay small on purpose so that the people who understand your
            problem are the ones writing the code.
          </p>
        </Reveal>

        <div className="mt-20 grid gap-6 md:grid-cols-3">
          {commitments.map((commitment, i) => (
            <Reveal key={commitment.title} delay={i * 0.09}>
              <div className="surface h-full p-8">
                <h2 className="text-lg font-semibold">{commitment.title}</h2>
                <p className="mt-4 text-[0.95rem] leading-relaxed text-ink-400">
                  {commitment.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>

      <CallToAction />
    </>
  );
}

import { Section, SectionHeading } from "@/components/ui/section";
import { Reveal } from "@/components/motion/reveal";

const steps = [
  {
    title: "Understand",
    body: "We start with the problem, not the stack. A short paid discovery gets us to a shared picture of what is broken and what it costs you.",
  },
  {
    title: "Scope",
    body: "A written plan with phases, prices, and the assumptions behind them. If the honest answer is that you need less than you asked for, we say so.",
  },
  {
    title: "Build",
    body: "Two-week increments, a working demo at the end of each, and access to the engineers doing the work. No account manager in the middle.",
  },
  {
    title: "Hand over",
    body: "Documentation, runbooks, and time with your team. Our aim is that you could take this in-house tomorrow — even if you choose not to.",
  },
];

export function Process() {
  return (
    <Section>
      <SectionHeading
        eyebrow="How we work"
        title="A process designed to be easy to leave"
        lede="Lock-in is a business model, not an engineering practice. We would rather earn the next phase than trap you in it."
        align="center"
      />

      <ol className="mt-18 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, i) => (
          <Reveal key={step.title} delay={i * 0.09} as="li">
            <div className="surface h-full p-8">
              <div className="flex items-baseline gap-3">
                <span className="font-display text-3xl font-semibold text-accent-500/90">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="text-lg font-semibold">{step.title}</h3>
              </div>
              <p className="mt-4 text-[0.95rem] leading-relaxed text-ink-400">
                {step.body}
              </p>
            </div>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}

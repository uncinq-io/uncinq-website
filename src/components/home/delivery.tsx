import { Section, SectionHeading } from "@/components/ui/section";
import { Reveal } from "@/components/motion/reveal";

const points = [
  {
    title: "Discovery and engineering — DC and Maryland",
    body: "Scoping, architecture, and the stakeholder conversations that shape the build run out of Washington DC and Maryland, in your timezone.",
  },
  {
    title: "Development and implementation — Kigali",
    body: "The build happens in Kigali with some of the strongest developers in the region. It is how a senior team stays genuinely affordable.",
  },
  {
    title: "Deployment and support — DC and Maryland",
    body: "Releases, handover, and everything after go-live come back to the US side, so there is always someone accountable in your working hours.",
  },
];

/**
 * The DC/Kigali split is the most distinctive thing about the company, so it
 * gets a full section rather than a line in the footer.
 */
export function Delivery() {
  return (
    <Section className="border-y border-white/10 bg-ink-900/40">
      <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
        <div>
          <SectionHeading
            eyebrow="How we are built"
            title="Two offices, six hours apart, on purpose"
            lede="Uncinq is not an offshore vendor with a sales office, and not a US shop with a hidden subcontractor. It is one team, deliberately split — and Kigali mornings overlap your afternoons."
          />
        </div>

        <div className="flex flex-col gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10">
          {points.map((point, i) => (
            <Reveal
              key={point.title}
              delay={i * 0.1}
              className="bg-ink-850 p-8 lg:p-10"
            >
              <span className="font-display text-sm text-accent-500">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-4 text-lg font-semibold">{point.title}</h3>
              <p className="mt-3 text-[0.95rem] leading-relaxed text-ink-400">
                {point.body}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}

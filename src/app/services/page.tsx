import type { Metadata } from "next";
import { services } from "@/lib/services";
import { PageHeader } from "@/components/page-header";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/motion/reveal";
import { ServiceScene } from "@/components/services/service-scene";
import { Process } from "@/components/home/process";
import { CallToAction } from "@/components/home/cta";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Product engineering, cloud and platform, AI integration, and product design — one senior team that designs, builds and runs the software.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Services"
        title="We write the software ourselves"
        lede="From an agreed brief to a working product, we bring design, development, testing and launch preparation together. The people who scope your project are the people who build it, and the same team keeps it running once it is live."
      />

      <Container className="py-20 lg:py-28">
        <div className="flex flex-col gap-20 lg:gap-28">
          {services.map((service, i) => (
            <Reveal
              key={service.id}
              id={service.id}
              className="group grid scroll-mt-28 gap-10 lg:grid-cols-[1fr_1.3fr] lg:gap-20"
            >
              <div>
                {/* Icon chip + number + title on one row at the top. The row is
                    a fixed height so the scene below — and the description in
                    the right column — always start at the same offset. */}
                <div className="flex h-12 items-center gap-4">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-accent-500/25 bg-accent-500/10 text-accent-400 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:border-accent-500/50 group-hover:text-accent-300">
                    <service.icon size={22} strokeWidth={1.75} />
                  </span>
                  <span className="font-display text-sm text-ink-600">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h2 className="text-3xl font-semibold leading-tight">
                    {service.title}
                  </h2>
                </div>

                {/* The animated scene fills the space below. */}
                <div className="mt-7">
                  <ServiceScene id={service.id} title={service.title} />
                </div>
              </div>

              {/* Offset matches the left header (h-12) + gap (mt-7) so the
                  description starts level with the top of the scene. */}
              <div className="lg:mt-[76px]">
                <p className="text-lg leading-relaxed text-ink-300">
                  {service.description}
                </p>
                <ul className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2">
                  {service.items.map((item) => (
                    <li
                      key={item}
                      className="bg-ink-850 px-6 py-5 text-[0.95rem] text-ink-200 transition-colors duration-300 hover:bg-ink-800"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>

      <Process />
      <CallToAction />
    </>
  );
}

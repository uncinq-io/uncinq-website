import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { services } from "@/lib/services";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/motion/reveal";

export function Services() {
  return (
    <Section id="services">
      <Reveal className="max-w-3xl">
        <span className="eyebrow">Our expertise</span>
        <h2 className="mt-6 font-display text-3xl font-bold leading-[1.12] tracking-[-0.03em] sm:text-4xl lg:text-[2.75rem]">
          One team, end to end — from first sketch to production.
        </h2>
      </Reveal>

      <ol className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service, i) => (
          <Reveal
            key={service.id}
            as="li"
            delay={(i % 3) * 0.08 + Math.floor(i / 3) * 0.04}
          >
            <Link
              href={`/services#${service.id}`}
              className="group surface surface-hover relative flex h-full flex-col p-7 transition-all duration-300 ease-[var(--ease-out-quint)] hover:-translate-y-1 hover:shadow-[0_16px_48px_-16px_rgba(74,138,196,0.25)]"
            >
              <span className="grid h-11 w-11 place-items-center rounded-xl border border-accent-500/25 bg-accent-500/10 text-accent-400 transition-colors duration-300 group-hover:border-accent-500/50 group-hover:text-accent-300">
                <service.icon size={20} strokeWidth={1.75} />
              </span>

              <span className="mt-6 flex items-start justify-between gap-3">
                <span className="block font-display text-lg font-bold leading-snug transition-colors duration-300 group-hover:text-accent-300">
                  {service.title}
                </span>
                <ArrowUpRight
                  size={18}
                  className="mt-0.5 shrink-0 text-ink-600 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent-400"
                />
              </span>

              <span className="mt-2.5 block text-[0.95rem] leading-relaxed text-ink-400">
                {service.short}
              </span>
            </Link>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { WorkEntry } from "@/lib/content";

export function WorkCard({ entry }: { entry: WorkEntry }) {
  return (
    <Link
      href={`/work/${entry.slug}`}
      className="group block overflow-hidden rounded-2xl border border-white/10 bg-ink-850 transition-colors duration-300 hover:border-accent-500/40"
    >
      <div className="relative aspect-16/10 overflow-hidden bg-ink-800">
        {entry.cover ? (
          <Image
            src={entry.cover}
            alt=""
            fill
            sizes="(min-width: 1024px) 45vw, 100vw"
            className="object-cover transition-transform duration-700 ease-[var(--ease-out-quint)] group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-ink-700 via-ink-800 to-ink-850" />
        )}

        {/* Hover overlay — Deon-style reveal on the portfolio grid */}
        <div className="absolute inset-0 flex items-end bg-gradient-to-t from-ink-950/95 via-ink-950/40 to-transparent p-7 opacity-0 transition-opacity duration-400 group-hover:opacity-100">
          <span className="inline-flex items-center gap-2 text-sm font-medium text-white">
            Read the case study
            <ArrowUpRight size={16} />
          </span>
        </div>

        {entry.draft ? (
          <span className="absolute left-4 top-4 rounded-full bg-amber-500/90 px-2.5 py-1 text-[0.7rem] font-medium uppercase tracking-wider text-ink-950">
            Draft
          </span>
        ) : null}
      </div>

      <div className="p-7 lg:p-8">
        <div className="flex items-center gap-3 text-xs uppercase tracking-[0.14em] text-ink-500">
          <span>{entry.client}</span>
          <span className="h-1 w-1 rounded-full bg-ink-600" />
          <span>{entry.year}</span>
        </div>

        <h3 className="mt-4 text-xl font-semibold transition-colors duration-300 group-hover:text-accent-300">
          {entry.title}
        </h3>
        <p className="mt-3 text-[0.95rem] leading-relaxed text-ink-400">
          {entry.summary}
        </p>

        {entry.metrics.length > 0 ? (
          <dl className="mt-7 flex flex-wrap gap-x-10 gap-y-4 border-t border-white/8 pt-6">
            {entry.metrics.slice(0, 3).map((metric) => (
              <div key={metric.label}>
                <dt className="text-xs text-ink-500">{metric.label}</dt>
                <dd className="mt-1 font-display text-lg font-semibold text-white">
                  {metric.value}
                </dd>
              </div>
            ))}
          </dl>
        ) : null}
      </div>
    </Link>
  );
}

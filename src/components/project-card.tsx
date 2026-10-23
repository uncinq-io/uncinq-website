import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/projects";
import { cn } from "@/lib/utils";

export function ProjectCard({ project }: { project: Project }) {
  const hasPage = Boolean(project.detail);

  const card = (
    <div className="group h-full rounded-2xl border border-white/10 bg-gradient-to-b from-ink-850 to-ink-900 p-7 transition-colors duration-300 hover:border-accent-500/60 lg:p-8">
      <div className="flex items-start justify-between gap-4">
        <h3 className="flex items-center gap-2 font-display text-2xl font-bold tracking-tight">
          {project.name}
          {hasPage ? (
            <ArrowUpRight
              size={18}
              className="text-ink-600 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent-400"
            />
          ) : null}
        </h3>
        <span className="mt-1 shrink-0 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-accent-500">
          {project.category}
        </span>
      </div>

      <p className="mt-3 text-[0.95rem] leading-relaxed text-ink-300">
        {project.summary}
      </p>

      <div className="relative mt-7 aspect-16/9 overflow-hidden rounded-xl border border-white/10">
        {project.image ? (
          <Image
            src={project.image}
            alt={`${project.name} screens`}
            fill
            sizes="(min-width: 1024px) 45vw, 100vw"
            className={cn(
              "object-cover transition-transform duration-700 ease-[var(--ease-out-quint)] group-hover:scale-[1.03]",
              project.imagePosition === "top" ? "object-top" : "object-center",
            )}
          />
        ) : (
          <ScreensPlaceholder label={`${project.slug} screens`} />
        )}
      </div>
    </div>
  );

  return hasPage ? (
    <Link href={`/work/${project.slug}`} className="block h-full">
      {card}
    </Link>
  ) : (
    card
  );
}

/** Striped stand-in shown until real product screenshots are dropped in. */
function ScreensPlaceholder({ label }: { label: string }) {
  return (
    <div className="absolute inset-0 grid place-items-center bg-ink-800/40">
      <div
        aria-hidden
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, rgba(255,255,255,0.045) 0 2px, transparent 2px 12px)",
        }}
      />
      <span className="relative font-mono text-xs text-ink-500">{label}</span>
    </div>
  );
}

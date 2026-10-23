import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { ArrowLeft } from "lucide-react";
import { getProject, getProjectsWithPages } from "@/lib/projects";
import { getAllWork, getWorkBySlug, type WorkEntry } from "@/lib/content";
import { Container } from "@/components/ui/container";
import { mdxComponents } from "@/components/mdx-components";
import { ProductDetail } from "@/components/product-detail";
import { CallToAction } from "@/components/home/cta";

/**
 * This route serves two kinds of page: product pages defined in lib/projects,
 * and long-form case studies written as MDX. Products win on a slug clash.
 */
export function generateStaticParams() {
  return [
    ...getProjectsWithPages().map((project) => ({ slug: project.slug })),
    ...getAllWork().map((entry) => ({ slug: entry.slug })),
  ];
}

export async function generateMetadata({
  params,
}: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;

  const project = getProject(slug);
  if (project?.detail) {
    return {
      title: project.name,
      description: project.summary,
      alternates: { canonical: `/work/${project.slug}` },
      openGraph: {
        title: `${project.name} — ${project.detail.tagline}`,
        description: project.summary,
        images: project.image ? [{ url: project.image }] : undefined,
      },
    };
  }

  const entry = getWorkBySlug(slug);
  if (!entry) return {};

  return {
    title: entry.title,
    description: entry.summary,
    alternates: { canonical: `/work/${entry.slug}` },
    openGraph: {
      title: entry.title,
      description: entry.summary,
      images: entry.cover ? [{ url: entry.cover }] : undefined,
    },
    robots: entry.draft ? { index: false, follow: false } : undefined,
  };
}

export default async function WorkDetailPage({
  params,
}: PageProps<"/work/[slug]">) {
  const { slug } = await params;

  const project = getProject(slug);
  if (project?.detail) {
    return (
      <>
        <ProductDetail project={project} />
        <CallToAction />
      </>
    );
  }

  const entry = getWorkBySlug(slug);
  if (!entry) notFound();

  return (
    <>
      <CaseStudy entry={entry} />
      <CallToAction />
    </>
  );
}

function CaseStudy({ entry }: { entry: WorkEntry }) {
  return (
    <article>
      <header className="border-b border-white/10 pb-16 pt-36 lg:pt-48">
        <Container>
          <Link
            href="/work"
            className="inline-flex items-center gap-2 text-sm text-ink-400 transition-colors hover:text-white"
          >
            <ArrowLeft size={15} /> All work
          </Link>

          <div className="mt-10 max-w-4xl">
            <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.14em] text-ink-500">
              <span>{entry.client}</span>
              <span className="h-1 w-1 rounded-full bg-ink-600" />
              <span>{entry.year}</span>
            </div>

            <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.08] sm:text-5xl lg:text-[3.5rem]">
              {entry.title}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-300">
              {entry.summary}
            </p>

            <ul className="mt-8 flex flex-wrap gap-2">
              {entry.services.map((service) => (
                <li
                  key={service}
                  className="rounded-full border border-white/12 px-3.5 py-1.5 text-xs text-ink-300"
                >
                  {service}
                </li>
              ))}
            </ul>
          </div>

          {entry.metrics.length > 0 ? (
            <dl className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-3">
              {entry.metrics.map((metric) => (
                <div key={metric.label} className="bg-ink-850 p-8">
                  <dt className="text-sm text-ink-500">{metric.label}</dt>
                  <dd className="mt-2 font-display text-4xl font-semibold text-white">
                    {metric.value}
                  </dd>
                </div>
              ))}
            </dl>
          ) : null}
        </Container>
      </header>

      {entry.cover ? (
        <div className="relative aspect-21/9 w-full">
          <Image
            src={entry.cover}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
      ) : null}

      <Container className="py-20 lg:py-28">
        <div className="prose prose-invert mx-auto max-w-3xl prose-headings:font-display prose-headings:tracking-tight prose-p:text-ink-300 prose-li:text-ink-300 prose-strong:text-white prose-a:text-accent-400">
          <MDXRemote source={entry.body} components={mdxComponents} />
        </div>
      </Container>
    </article>
  );
}

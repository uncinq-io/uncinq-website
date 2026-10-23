import type { MDXComponents } from "mdx/types";

/**
 * Components available inside every case-study MDX file without importing.
 */
export const mdxComponents: MDXComponents = {
  Metrics: ({ items }: { items: { label: string; value: string }[] }) => (
    <dl className="not-prose my-10 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-3">
      {items.map((item) => (
        <div key={item.label} className="bg-ink-850 p-6">
          <dt className="text-sm text-ink-500">{item.label}</dt>
          <dd className="mt-2 font-display text-3xl font-semibold text-white">
            {item.value}
          </dd>
        </div>
      ))}
    </dl>
  ),

  Callout: ({ children }: { children: React.ReactNode }) => (
    <div className="not-prose my-8 rounded-xl border-l-2 border-accent-500 bg-accent-500/8 p-6 leading-relaxed text-ink-200">
      {children}
    </div>
  ),
};

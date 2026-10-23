import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";

const WORK_DIR = path.join(process.cwd(), "src/content/work");

const metricSchema = z.object({
  label: z.string(),
  value: z.string(),
});

const workFrontmatterSchema = z.object({
  title: z.string(),
  client: z.string(),
  summary: z.string(),
  year: z.number(),
  services: z.array(z.string()).min(1),
  /** Path under /public, e.g. "/work/acme-cover.jpg" */
  cover: z.string().optional(),
  metrics: z.array(metricSchema).default([]),
  /**
   * Draft entries render in `next dev` but are excluded from production
   * builds. New case studies start as drafts so nothing unverified ships.
   */
  draft: z.boolean().default(false),
  order: z.number().default(0),
});

export type WorkFrontmatter = z.infer<typeof workFrontmatterSchema>;
export type WorkEntry = WorkFrontmatter & { slug: string; body: string };

function readWorkFile(filename: string): WorkEntry {
  const slug = filename.replace(/\.mdx?$/, "");
  const raw = fs.readFileSync(path.join(WORK_DIR, filename), "utf8");
  const { data, content } = matter(raw);

  const parsed = workFrontmatterSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error(
      `Invalid frontmatter in src/content/work/${filename}:\n${z.prettifyError(parsed.error)}`,
    );
  }

  return { ...parsed.data, slug, body: content };
}

export function getAllWork(): WorkEntry[] {
  if (!fs.existsSync(WORK_DIR)) return [];

  const includeDrafts = process.env.NODE_ENV === "development";

  return fs
    .readdirSync(WORK_DIR)
    .filter((file) => /\.mdx?$/.test(file))
    .map(readWorkFile)
    .filter((entry) => includeDrafts || !entry.draft)
    .sort((a, b) => b.order - a.order || b.year - a.year);
}

export function getWorkBySlug(slug: string): WorkEntry | undefined {
  return getAllWork().find((entry) => entry.slug === slug);
}

import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { getAllWork } from "@/lib/content";
import { getProjectsWithPages } from "@/lib/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/services", "/work", "/about", "/contact"].map(
    (route) => ({
      url: `${site.url}${route}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: route === "" ? 1 : 0.8,
    }),
  );

  const productRoutes = getProjectsWithPages().map((project) => ({
    url: `${site.url}/work/${project.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const caseStudyRoutes = getAllWork()
    .filter((entry) => !entry.draft)
    .map((entry) => ({
      url: `${site.url}/work/${entry.slug}`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.7,
    }));

  return [...staticRoutes, ...productRoutes, ...caseStudyRoutes];
}

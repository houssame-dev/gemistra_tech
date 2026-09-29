import type { MetadataRoute } from "next";
import { projects } from "@/lib/projects";
import { routing } from "@/i18n/routing";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://gemistratech.com";

  const homeEntries: MetadataRoute.Sitemap = routing.locales.map((locale) => ({
    url: `${base}/${locale}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 1,
  }));

  const projectEntries: MetadataRoute.Sitemap = routing.locales.flatMap(
    (locale) =>
      projects.map((p) => ({
        url: `${base}/${locale}/projects/${p.slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.7,
      }))
  );

  return [...homeEntries, ...projectEntries];
}

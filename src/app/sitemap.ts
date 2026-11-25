import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { works } from "@/content/work";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/work", "/gallery", "/about", "/contact", "/blog"].map((path) => ({
    url: `${site.url}${path}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const workRoutes = works.map((work) => ({
    url: `${site.url}/work/${work.slug}`,
    lastModified: new Date(),
    changeFrequency: "yearly" as const,
    priority: 0.7,
  }));

  return [...routes, ...workRoutes];
}

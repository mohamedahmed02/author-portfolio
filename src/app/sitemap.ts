import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";
import { absoluteUrl } from "@/lib/utils";
import { locales } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await prisma.post.findMany({
    where: { status: "PUBLISHED" },
    select: { slug: true, updatedAt: true },
  });

  const staticPaths = ["", "/writing", "/about", "/contact"];
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const path of staticPaths) {
      entries.push({
        url: absoluteUrl(`/${locale}${path}`),
        lastModified: new Date(),
        changeFrequency: path === "" ? "weekly" : "monthly",
        priority: path === "" ? 1 : 0.7,
      });
    }
    for (const post of posts) {
      entries.push({
        url: absoluteUrl(`/${locale}/writing/${post.slug}`),
        lastModified: post.updatedAt,
        changeFrequency: "monthly",
        priority: 0.8,
      });
    }
  }

  return entries;
}

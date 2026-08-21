import { Prisma, PostStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import type { Locale } from "@/lib/i18n";

export async function getSiteSettings() {
  let settings = await prisma.siteSettings.findUnique({
    where: { id: "site" },
    include: { heroImage: true, aboutImage: true },
  });

  if (!settings) {
    settings = await prisma.siteSettings.create({
      data: { id: "site" },
      include: { heroImage: true, aboutImage: true },
    });
  }

  return settings;
}

export async function getPublishedPosts(options: {
  locale?: Locale;
  q?: string;
  category?: string;
  sort?: "newest" | "oldest";
  page?: number;
  pageSize?: number;
  featuredOnly?: boolean;
}) {
  const page = options.page ?? 1;
  const pageSize = options.pageSize ?? 12;
  const sort = options.sort ?? "newest";

  const where: Prisma.PostWhereInput = {
    status: PostStatus.PUBLISHED,
    ...(options.featuredOnly ? { featured: true } : {}),
    ...(options.category
      ? { category: { slug: options.category } }
      : {}),
    ...(options.q
      ? {
          OR: [
            { titleEn: { contains: options.q, mode: "insensitive" } },
            { titleId: { contains: options.q, mode: "insensitive" } },
            { excerptEn: { contains: options.q, mode: "insensitive" } },
            { excerptId: { contains: options.q, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const [items, total] = await Promise.all([
    prisma.post.findMany({
      where,
      include: {
        category: true,
        featuredImage: true,
        tags: { include: { tag: true } },
      },
      orderBy: { publishedAt: sort === "oldest" ? "asc" : "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.post.count({ where }),
  ]);

  return {
    items,
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  };
}

export async function getFeaturedPosts(limit = 6) {
  return prisma.post.findMany({
    where: { status: PostStatus.PUBLISHED, featured: true },
    include: { category: true, featuredImage: true },
    orderBy: { publishedAt: "desc" },
    take: limit,
  });
}

export async function getPostBySlug(slug: string) {
  return prisma.post.findFirst({
    where: { slug, status: PostStatus.PUBLISHED },
    include: {
      category: true,
      featuredImage: true,
      tags: { include: { tag: true } },
    },
  });
}

export async function getAdjacentPosts(publishedAt: Date, slug: string) {
  const [previous, next] = await Promise.all([
    prisma.post.findFirst({
      where: {
        status: PostStatus.PUBLISHED,
        OR: [
          { publishedAt: { lt: publishedAt } },
          { publishedAt, slug: { lt: slug } },
        ],
      },
      orderBy: [{ publishedAt: "desc" }, { slug: "desc" }],
      select: { slug: true, titleEn: true, titleId: true },
    }),
    prisma.post.findFirst({
      where: {
        status: PostStatus.PUBLISHED,
        OR: [
          { publishedAt: { gt: publishedAt } },
          { publishedAt, slug: { gt: slug } },
        ],
      },
      orderBy: [{ publishedAt: "asc" }, { slug: "asc" }],
      select: { slug: true, titleEn: true, titleId: true },
    }),
  ]);

  return { previous, next };
}

export async function getRelatedPosts(postId: string, categoryId?: string | null, limit = 3) {
  return prisma.post.findMany({
    where: {
      status: PostStatus.PUBLISHED,
      id: { not: postId },
      ...(categoryId ? { categoryId } : {}),
    },
    include: { category: true, featuredImage: true },
    orderBy: { publishedAt: "desc" },
    take: limit,
  });
}

export async function getCategories() {
  return prisma.category.findMany({
    orderBy: { nameEn: "asc" },
    include: {
      _count: {
        select: { posts: { where: { status: PostStatus.PUBLISHED } } },
      },
    },
  });
}

export async function logActivity(
  action: string,
  entity?: string,
  entityId?: string,
  meta?: unknown,
) {
  await prisma.activityLog.create({
    data: {
      action,
      entity,
      entityId,
      meta: meta ? JSON.stringify(meta) : null,
    },
  });
}

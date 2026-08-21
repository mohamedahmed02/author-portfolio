import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { PostForm } from "@/components/admin/post-form";

export default async function EditWritingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [post, categories] = await Promise.all([
    prisma.post.findUnique({ where: { id } }),
    prisma.category.findMany({
      orderBy: { nameEn: "asc" },
      select: { id: true, nameEn: true },
    }),
  ]);

  if (!post) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Edit writing</h1>
        <p className="mt-1 text-sm text-zinc-500">{post.titleEn}</p>
      </div>
      <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
        <PostForm
          categories={categories}
          post={{
            id: post.id,
            titleEn: post.titleEn,
            titleId: post.titleId,
            slug: post.slug,
            excerptEn: post.excerptEn,
            excerptId: post.excerptId,
            bodyEn: post.bodyEn,
            bodyId: post.bodyId,
            categoryId: post.categoryId,
            featuredImageId: post.featuredImageId,
            readingTime: post.readingTime,
            featured: post.featured,
            status: post.status,
            seoTitleEn: post.seoTitleEn,
            seoTitleId: post.seoTitleId,
            seoDescriptionEn: post.seoDescriptionEn,
            seoDescriptionId: post.seoDescriptionId,
          }}
        />
      </div>
    </div>
  );
}

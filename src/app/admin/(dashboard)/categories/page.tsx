import { prisma } from "@/lib/db";
import { CategoriesManager } from "@/components/admin/categories-manager";

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { nameEn: "asc" },
    include: { _count: { select: { posts: true } } },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Categories</h1>
        <p className="mt-1 text-sm text-zinc-500">Manage bilingual category names and slugs.</p>
      </div>
      <CategoriesManager categories={categories} />
    </div>
  );
}

import { prisma } from "@/lib/db";
import { PostForm } from "@/components/admin/post-form";

export default async function NewWritingPage() {
  const categories = await prisma.category.findMany({
    orderBy: { nameEn: "asc" },
    select: { id: true, nameEn: true },
  });

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">New writing</h1>
        <p className="mt-1 text-sm text-zinc-500">Draft or publish a bilingual post.</p>
      </div>
      <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
        <PostForm categories={categories} />
      </div>
    </div>
  );
}

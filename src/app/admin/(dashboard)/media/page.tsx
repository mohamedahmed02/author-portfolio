import { prisma } from "@/lib/db";
import { MediaManager } from "@/components/admin/media-manager";

export default async function MediaAdminPage() {
  const items = await prisma.media.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Media</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Upload images and copy their IDs into writings or homepage settings.
        </p>
      </div>
      <MediaManager initialItems={items} />
    </div>
  );
}

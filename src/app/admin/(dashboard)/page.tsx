import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { PostStatus } from "@prisma/client";
import { prisma } from "@/lib/db";

export default async function AdminDashboardPage() {
  const [total, published, drafts, categories, activity] = await Promise.all([
    prisma.post.count(),
    prisma.post.count({ where: { status: PostStatus.PUBLISHED } }),
    prisma.post.count({ where: { status: PostStatus.DRAFT } }),
    prisma.category.count(),
    prisma.activityLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 12,
    }),
  ]);

  const stats = [
    { label: "Total writings", value: total, href: "/admin/writings" },
    { label: "Published", value: published, href: "/admin/writings" },
    { label: "Drafts", value: drafts, href: "/admin/writings" },
    { label: "Categories", value: categories, href: "/admin/categories" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Dashboard</h1>
        <p className="mt-1 text-sm text-zinc-500">Overview of your content.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm transition hover:border-zinc-300"
          >
            <p className="text-sm text-zinc-500">{stat.label}</p>
            <p className="mt-2 text-3xl font-semibold tabular-nums text-zinc-900">
              {stat.value}
            </p>
          </Link>
        ))}
      </div>

      <section className="rounded-lg border border-zinc-200 bg-white shadow-sm">
        <div className="border-b border-zinc-200 px-4 py-3">
          <h2 className="text-sm font-semibold text-zinc-900">Recent activity</h2>
        </div>
        {activity.length === 0 ? (
          <p className="px-4 py-8 text-sm text-zinc-500">No activity yet.</p>
        ) : (
          <ul className="divide-y divide-zinc-100">
            {activity.map((item) => (
              <li key={item.id} className="flex items-start justify-between gap-4 px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-zinc-900">{item.action}</p>
                  <p className="text-xs text-zinc-500">
                    {[item.entity, item.entityId].filter(Boolean).join(" · ") || "—"}
                  </p>
                </div>
                <time className="shrink-0 text-xs text-zinc-400">
                  {formatDistanceToNow(item.createdAt, { addSuffix: true })}
                </time>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

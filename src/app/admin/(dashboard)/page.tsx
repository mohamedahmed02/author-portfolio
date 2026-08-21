import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { PostStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import {
  ArrowUpRight,
  BookOpen,
  FileEdit,
  FolderOpen,
  PenLine,
  Sparkles,
} from "lucide-react";

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
    {
      label: "Total writings",
      value: total,
      href: "/admin/writings",
      icon: BookOpen,
      description: "All your writings",
    },
    {
      label: "Published",
      value: published,
      href: "/admin/writings",
      icon: PenLine,
      description: "Live on your website",
    },
    {
      label: "Drafts",
      value: drafts,
      href: "/admin/writings",
      icon: FileEdit,
      description: "Waiting to be published",
    },
    {
      label: "Categories",
      value: categories,
      href: "/admin/categories",
      icon: FolderOpen,
      description: "Content categories",
    },
  ];

  return (
    <div className="space-y-10">
      {/* Header */}
      <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-zinc-400 dark:text-zinc-500">
            <Sparkles className="size-3.5" strokeWidth={1.7} />
            Overview
          </div>

          <h1 className="text-3xl font-semibold tracking-[-0.04em] text-zinc-950 dark:text-zinc-100 md:text-4xl">
            Dashboard
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-500 dark:text-zinc-400">
            A quick overview of your publication and recent activity.
          </p>
        </div>

        <Link
          href="/admin/writings"
          className="group inline-flex w-fit items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3.5 py-2.5 text-sm font-medium text-zinc-700 shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-all hover:border-zinc-300 hover:text-zinc-950 dark:border-zinc-800 dark:bg-[#141416] dark:text-zinc-300 dark:shadow-none dark:hover:border-zinc-700 dark:hover:text-zinc-100"
        >
          Manage writings
          <ArrowUpRight
            className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            strokeWidth={1.8}
          />
        </Link>
      </header>

      {/* Stats */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <Link
              key={stat.label}
              href={stat.href}
              className="group rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-all duration-200 hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-[#141416] dark:shadow-none dark:hover:border-zinc-700"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex size-9 items-center justify-center rounded-xl bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-300">
                  <Icon className="size-4" strokeWidth={1.7} />
                </div>

                <ArrowUpRight
                  className="size-4 text-zinc-300 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-zinc-600 dark:text-zinc-700 dark:group-hover:text-zinc-300"
                  strokeWidth={1.7}
                />
              </div>

              <div className="mt-7">
                <p className="text-xs font-medium uppercase tracking-[0.12em] text-zinc-400 dark:text-zinc-500">
                  {stat.label}
                </p>

                <p className="mt-1.5 text-3xl font-semibold tracking-[-0.04em] tabular-nums text-zinc-950 dark:text-zinc-100">
                  {stat.value}
                </p>

                <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">
                  {stat.description}
                </p>
              </div>
            </Link>
          );
        })}
      </section>

      {/* Activity */}
      <section className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-zinc-800 dark:bg-[#141416] dark:shadow-none">
        <div className="flex items-center justify-between border-b border-zinc-200/80 px-5 py-4 dark:border-zinc-800 md:px-6">
          <div>
            <h2 className="text-sm font-semibold tracking-[-0.01em] text-zinc-900 dark:text-zinc-100">
              Recent activity
            </h2>

            <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">
              The latest changes across your CMS.
            </p>
          </div>

          <div className="flex size-8 items-center justify-center rounded-lg bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
            <Sparkles className="size-3.5" strokeWidth={1.7} />
          </div>
        </div>

        {activity.length === 0 ? (
          <div className="flex min-h-[220px] flex-col items-center justify-center px-6 text-center">
            <div className="mb-4 flex size-11 items-center justify-center rounded-full bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500">
              <BookOpen className="size-4" strokeWidth={1.6} />
            </div>

            <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              No activity yet
            </p>

            <p className="mt-1 max-w-sm text-xs leading-5 text-zinc-400 dark:text-zinc-500">
              Activity from your content management actions will appear here.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
            {activity.map((item) => (
              <li
                key={item.id}
                className="group flex items-start justify-between gap-5 px-5 py-4 transition-colors hover:bg-zinc-50/70 dark:hover:bg-zinc-900/50 md:px-6"
              >
                <div className="flex min-w-0 items-start gap-3.5">
                  <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                    <FileEdit className="size-3.5" strokeWidth={1.7} />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-zinc-800 dark:text-zinc-200">
                      {item.action}
                    </p>

                    <p className="mt-1 truncate text-xs text-zinc-400 dark:text-zinc-500">
                      {[item.entity, item.entityId]
                        .filter(Boolean)
                        .join(" · ") || "—"}
                    </p>
                  </div>
                </div>

                <time className="shrink-0 pt-1 text-[11px] text-zinc-400 dark:text-zinc-600">
                  {formatDistanceToNow(item.createdAt, {
                    addSuffix: true,
                  })}
                </time>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
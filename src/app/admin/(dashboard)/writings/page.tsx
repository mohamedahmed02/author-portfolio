import Link from "next/link";
import { format } from "date-fns";
import { prisma } from "@/lib/db";
import {
  deletePost,
  publishPost,
  unpublishPost,
} from "@/app/admin/actions/posts";
import {
  ArrowUpRight,
  BookOpen,
  CheckCircle2,
  CircleDot,
  FileEdit,
  MoreHorizontal,
  PenLine,
  Plus,
  Star,
  Trash2,
} from "lucide-react";

export default async function WritingsPage() {
  const posts = await prisma.post.findMany({
    include: { category: true },
    orderBy: [{ updatedAt: "desc" }],
  });

  const publishedCount = posts.filter(
    (post) => post.status === "PUBLISHED",
  ).length;

  const draftCount = posts.filter((post) => post.status === "DRAFT").length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-zinc-400 dark:text-zinc-500">
            <BookOpen className="size-3.5" strokeWidth={1.7} />
            Content
          </div>

          <h1 className="text-3xl font-semibold tracking-[-0.04em] text-zinc-950 dark:text-zinc-100 md:text-4xl">
            Writings
          </h1>

          <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
            Create, edit, and manage your published work.
          </p>
        </div>

        <Link
          href="/admin/writings/new"
          className="inline-flex w-fit items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
        >
          <Plus className="size-4" strokeWidth={2} />
          New writing
        </Link>
      </header>

      {/* Quick overview */}
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-zinc-200/80 bg-white px-4 py-3.5 dark:border-zinc-800 dark:bg-[#141416]">
          <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-zinc-400 dark:text-zinc-500">
            All writings
          </p>
          <p className="mt-1 text-xl font-semibold tracking-[-0.03em] text-zinc-900 dark:text-zinc-100">
            {posts.length}
          </p>
        </div>

        <div className="rounded-xl border border-zinc-200/80 bg-white px-4 py-3.5 dark:border-zinc-800 dark:bg-[#141416]">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="size-3.5 text-emerald-500" />
            <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-zinc-400 dark:text-zinc-500">
              Published
            </p>
          </div>

          <p className="mt-1 text-xl font-semibold tracking-[-0.03em] text-zinc-900 dark:text-zinc-100">
            {publishedCount}
          </p>
        </div>

        <div className="rounded-xl border border-zinc-200/80 bg-white px-4 py-3.5 dark:border-zinc-800 dark:bg-[#141416]">
          <div className="flex items-center gap-2">
            <CircleDot className="size-3.5 text-amber-500" />
            <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-zinc-400 dark:text-zinc-500">
              Drafts
            </p>
          </div>

          <p className="mt-1 text-xl font-semibold tracking-[-0.03em] text-zinc-900 dark:text-zinc-100">
            {draftCount}
          </p>
        </div>
      </div>

      {/* Writings table */}
      <section className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-zinc-800 dark:bg-[#141416] dark:shadow-none">
        {posts.length === 0 ? (
          <div className="flex min-h-[320px] flex-col items-center justify-center px-6 text-center">
            <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500">
              <PenLine className="size-5" strokeWidth={1.5} />
            </div>

            <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
              No writings yet
            </p>

            <p className="mt-1 max-w-sm text-xs leading-5 text-zinc-400 dark:text-zinc-500">
              Start your collection by creating your first piece of writing.
            </p>

            <Link
              href="/admin/writings/new"
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-3.5 py-2 text-xs font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
            >
              <Plus className="size-3.5" />
              Create writing
            </Link>
          </div>
        ) : (
          <>
            {/* Table header */}
            <div className="flex items-center justify-between border-b border-zinc-200/80 px-5 py-4 dark:border-zinc-800 md:px-6">
              <div>
                <h2 className="text-sm font-semibold tracking-[-0.01em] text-zinc-900 dark:text-zinc-100">
                  All writings
                </h2>

                <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">
                  {posts.length}{" "}
                  {posts.length === 1 ? "piece" : "pieces"} in your library
                </p>
              </div>

              <div className="flex size-8 items-center justify-center rounded-lg bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                <MoreHorizontal className="size-4" strokeWidth={1.7} />
              </div>
            </div>

            {/* Desktop table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-zinc-200/80 bg-zinc-50/70 dark:border-zinc-800 dark:bg-[#111112]">
                  <tr>
                    <th className="px-6 py-3.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-400 dark:text-zinc-500">
                      Title
                    </th>

                    <th className="px-4 py-3.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-400 dark:text-zinc-500">
                      Status
                    </th>

                    <th className="px-4 py-3.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-400 dark:text-zinc-500">
                      Featured
                    </th>

                    <th className="px-4 py-3.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-400 dark:text-zinc-500">
                      Updated
                    </th>

                    <th className="px-6 py-3.5 text-right text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-400 dark:text-zinc-500">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
                  {posts.map((post) => (
                    <tr
                      key={post.id}
                      className="group align-middle transition-colors hover:bg-zinc-50/60 dark:hover:bg-zinc-900/40"
                    >
                      {/* Title */}
                      <td className="max-w-[420px] px-6 py-4">
                        <Link
                          href={`/admin/writings/${post.id}`}
                          className="group/title block"
                        >
                          <div className="flex items-start gap-3">
                            <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                              <FileEdit
                                className="size-3.5"
                                strokeWidth={1.7}
                              />
                            </div>

                            <div className="min-w-0">
                              <p className="truncate font-medium text-zinc-900 transition-colors group-hover/title:text-zinc-600 dark:text-zinc-100 dark:group-hover/title:text-zinc-300">
                                {post.titleEn}
                              </p>

                              <p className="mt-1 truncate text-xs text-zinc-400 dark:text-zinc-500">
                                /{post.slug}
                              </p>

                              {post.category ? (
                                <p className="mt-1.5 text-[11px] text-zinc-400 dark:text-zinc-600">
                                  {post.category.nameEn}
                                </p>
                              ) : null}
                            </div>
                          </div>
                        </Link>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-4">
                        {post.status === "PUBLISHED" ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-400">
                            <span className="size-1.5 rounded-full bg-emerald-500" />
                            Published
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-medium text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-400">
                            <span className="size-1.5 rounded-full bg-amber-500" />
                            Draft
                          </span>
                        )}
                      </td>

                      {/* Featured */}
                      <td className="px-4 py-4">
                        {post.featured ? (
                          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-700 dark:text-zinc-300">
                            <Star
                              className="size-3.5 fill-current text-amber-500"
                              strokeWidth={1.5}
                            />
                            Featured
                          </span>
                        ) : (
                          <span className="text-xs text-zinc-400 dark:text-zinc-600">
                            —
                          </span>
                        )}
                      </td>

                      {/* Updated */}
                      <td className="whitespace-nowrap px-4 py-4 text-xs text-zinc-500 dark:text-zinc-500">
                        {format(post.updatedAt, "MMM d, yyyy")}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            href={`/admin/writings/${post.id}`}
                            className="rounded-md px-2.5 py-1.5 text-xs font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                          >
                            Edit
                          </Link>

                          {post.status === "PUBLISHED" ? (
                            <form
                              action={unpublishPost.bind(null, post.id)}
                            >
                              <button
                                type="submit"
                                className="rounded-md px-2.5 py-1.5 text-xs font-medium text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-500 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
                              >
                                Unpublish
                              </button>
                            </form>
                          ) : (
                            <form action={publishPost.bind(null, post.id)}>
                              <button
                                type="submit"
                                className="rounded-md px-2.5 py-1.5 text-xs font-medium text-zinc-600 transition-colors hover:bg-emerald-50 hover:text-emerald-700 dark:text-zinc-400 dark:hover:bg-emerald-950/30 dark:hover:text-emerald-400"
                              >
                                Publish
                              </button>
                            </form>
                          )}

                          <form action={deletePost.bind(null, post.id)}>
                            <button
                              type="submit"
                              className="rounded-md p-1.5 text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:text-zinc-600 dark:hover:bg-red-950/30 dark:hover:text-red-400"
                              title="Delete writing"
                            >
                              <Trash2 className="size-3.5" />
                            </button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="divide-y divide-zinc-100 dark:divide-zinc-800/80 md:hidden">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="p-4 transition-colors hover:bg-zinc-50/60 dark:hover:bg-zinc-900/40"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                      <FileEdit className="size-4" strokeWidth={1.7} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <Link href={`/admin/writings/${post.id}`}>
                        <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
                          {post.titleEn}
                        </p>
                      </Link>

                      <p className="mt-1 truncate text-xs text-zinc-400 dark:text-zinc-500">
                        /{post.slug}
                      </p>

                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        {post.status === "PUBLISHED" ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-400">
                            <span className="size-1.5 rounded-full bg-emerald-500" />
                            Published
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-400">
                            <span className="size-1.5 rounded-full bg-amber-500" />
                            Draft
                          </span>
                        )}

                        {post.featured ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-zinc-500 dark:text-zinc-400">
                            <Star className="size-3 fill-current text-amber-500" />
                            Featured
                          </span>
                        ) : null}

                        <span className="text-[10px] text-zinc-400 dark:text-zinc-600">
                          {format(post.updatedAt, "MMM d, yyyy")}
                        </span>
                      </div>

                      {post.category ? (
                        <p className="mt-2 text-[10px] text-zinc-400 dark:text-zinc-600">
                          {post.category.nameEn}
                        </p>
                      ) : null}

                      <div className="mt-4 flex flex-wrap items-center gap-1">
                        <Link
                          href={`/admin/writings/${post.id}`}
                          className="rounded-md bg-zinc-100 px-2.5 py-1.5 text-[11px] font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                        >
                          Edit
                        </Link>

                        {post.status === "PUBLISHED" ? (
                          <form
                            action={unpublishPost.bind(null, post.id)}
                          >
                            <button
                              type="submit"
                              className="rounded-md px-2.5 py-1.5 text-[11px] font-medium text-zinc-500 hover:bg-zinc-100 dark:text-zinc-500 dark:hover:bg-zinc-800"
                            >
                              Unpublish
                            </button>
                          </form>
                        ) : (
                          <form action={publishPost.bind(null, post.id)}>
                            <button
                              type="submit"
                              className="rounded-md px-2.5 py-1.5 text-[11px] font-medium text-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/30"
                            >
                              Publish
                            </button>
                          </form>
                        )}

                        <form action={deletePost.bind(null, post.id)}>
                          <button
                            type="submit"
                            className="rounded-md p-1.5 text-zinc-400 hover:bg-red-50 hover:text-red-600 dark:text-zinc-600 dark:hover:bg-red-950/30 dark:hover:text-red-400"
                            title="Delete writing"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
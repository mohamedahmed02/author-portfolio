import Link from "next/link";
import { format } from "date-fns";
import { prisma } from "@/lib/db";
import {
  deletePost,
  publishPost,
  unpublishPost,
} from "@/app/admin/actions/posts";

export default async function WritingsPage() {
  const posts = await prisma.post.findMany({
    include: { category: true },
    orderBy: [{ updatedAt: "desc" }],
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Writings</h1>
          <p className="mt-1 text-sm text-zinc-500">Create and manage posts.</p>
        </div>
        <Link
          href="/admin/writings/new"
          className="rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white hover:bg-zinc-800"
        >
          New writing
        </Link>
      </div>

      <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm">
        {posts.length === 0 ? (
          <p className="px-4 py-10 text-center text-sm text-zinc-500">No writings yet.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-zinc-200 bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500">
              <tr>
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Featured</th>
                <th className="px-4 py-3 font-medium">Updated</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {posts.map((post) => (
                <tr key={post.id} className="align-top">
                  <td className="px-4 py-3">
                    <p className="font-medium text-zinc-900">{post.titleEn}</p>
                    <p className="text-xs text-zinc-500">/{post.slug}</p>
                    {post.category ? (
                      <p className="mt-1 text-xs text-zinc-400">{post.category.nameEn}</p>
                    ) : null}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        post.status === "PUBLISHED"
                          ? "rounded bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700"
                          : "rounded bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700"
                      }
                    >
                      {post.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-zinc-600">{post.featured ? "Yes" : "—"}</td>
                  <td className="px-4 py-3 text-zinc-500">
                    {format(post.updatedAt, "MMM d, yyyy")}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <Link
                        href={`/admin/writings/${post.id}`}
                        className="text-zinc-700 underline-offset-2 hover:underline"
                      >
                        Edit
                      </Link>
                      {post.status === "PUBLISHED" ? (
                        <form action={unpublishPost.bind(null, post.id)}>
                          <button type="submit" className="text-zinc-700 underline-offset-2 hover:underline">
                            Unpublish
                          </button>
                        </form>
                      ) : (
                        <form action={publishPost.bind(null, post.id)}>
                          <button type="submit" className="text-zinc-700 underline-offset-2 hover:underline">
                            Publish
                          </button>
                        </form>
                      )}
                      <form action={deletePost.bind(null, post.id)}>
                        <button
                          type="submit"
                          className="text-red-600 underline-offset-2 hover:underline"
                        >
                          Delete
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

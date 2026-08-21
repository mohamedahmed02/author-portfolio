"use client";

import { useActionState } from "react";
import {
  createCategory,
  updateCategory,
  deleteCategory,
  type CategoryActionState,
} from "@/app/admin/actions/categories";

const fieldClass =
  "mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500";

type CategoryRow = {
  id: string;
  nameEn: string;
  nameId: string;
  slug: string;
  _count: { posts: number };
};

function CreateCategoryForm() {
  const [state, formAction, pending] = useActionState<CategoryActionState, FormData>(
    createCategory,
    {},
  );

  return (
    <form action={formAction} className="grid gap-3 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm sm:grid-cols-4">
      {state?.error ? (
        <p className="sm:col-span-4 text-sm text-red-600">{state.error}</p>
      ) : null}
      {state?.success ? (
        <p className="sm:col-span-4 text-sm text-emerald-700">{state.success}</p>
      ) : null}
      <div>
        <label className="text-xs font-medium text-zinc-600" htmlFor="nameEn">
          Name EN
        </label>
        <input id="nameEn" name="nameEn" required className={fieldClass} />
      </div>
      <div>
        <label className="text-xs font-medium text-zinc-600" htmlFor="nameId">
          Name ID
        </label>
        <input id="nameId" name="nameId" required className={fieldClass} />
      </div>
      <div>
        <label className="text-xs font-medium text-zinc-600" htmlFor="slug">
          Slug
        </label>
        <input id="slug" name="slug" required className={fieldClass} pattern="^[a-z0-9]+(?:-[a-z0-9]+)*$" />
      </div>
      <div className="flex items-end">
        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-60"
        >
          {pending ? "Adding…" : "Add category"}
        </button>
      </div>
    </form>
  );
}

function EditCategoryForm({ category }: { category: CategoryRow }) {
  const bound = updateCategory.bind(null, category.id);
  const [state, formAction, pending] = useActionState<CategoryActionState, FormData>(
    bound,
    {},
  );

  return (
    <tr className="align-top">
      <td className="px-4 py-3" colSpan={4}>
        <form action={formAction} className="grid gap-2 sm:grid-cols-4">
          {state?.error ? (
            <p className="sm:col-span-4 text-sm text-red-600">{state.error}</p>
          ) : null}
          {state?.success ? (
            <p className="sm:col-span-4 text-sm text-emerald-700">{state.success}</p>
          ) : null}
          <input name="nameEn" defaultValue={category.nameEn} required className={fieldClass} />
          <input name="nameId" defaultValue={category.nameId} required className={fieldClass} />
          <input name="slug" defaultValue={category.slug} required className={fieldClass} />
          <div className="flex flex-wrap gap-2">
            <button
              type="submit"
              disabled={pending}
              className="rounded-md bg-zinc-900 px-3 py-2 text-sm text-white hover:bg-zinc-800 disabled:opacity-60"
            >
              Save
            </button>
            <button
              formAction={deleteCategory.bind(null, category.id)}
              type="submit"
              className="rounded-md px-3 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              Delete
            </button>
            <span className="self-center text-xs text-zinc-400">
              {category._count.posts} posts
            </span>
          </div>
        </form>
      </td>
    </tr>
  );
}

export function CategoriesManager({ categories }: { categories: CategoryRow[] }) {
  return (
    <div className="space-y-6">
      <CreateCategoryForm />
      <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm">
        {categories.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-zinc-500">No categories yet.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-zinc-200 bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500">
              <tr>
                <th className="px-4 py-3 font-medium" colSpan={4}>
                  Existing categories
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {categories.map((category) => (
                <EditCategoryForm key={category.id} category={category} />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

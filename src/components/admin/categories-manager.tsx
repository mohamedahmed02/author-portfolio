"use client";

import { useActionState } from "react";
import {
  createCategory,
  updateCategory,
  deleteCategory,
  type CategoryActionState,
} from "@/app/admin/actions/categories";
import {
  Check,
  FolderOpen,
  Loader2,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const fieldClass =
  "mt-2 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2.5 text-sm text-zinc-900 outline-none transition-all placeholder:text-zinc-400 hover:border-zinc-300 focus:border-zinc-400 focus:bg-white focus:ring-4 focus:ring-zinc-100 dark:border-zinc-700 dark:bg-[#19191b] dark:text-zinc-100 dark:placeholder:text-zinc-600 dark:hover:border-zinc-600 dark:focus:border-zinc-500 dark:focus:bg-[#1c1c1f] dark:focus:ring-zinc-800";

const labelClass =
  "block text-xs font-medium text-zinc-600 dark:text-zinc-400";

const cardClass =
  "rounded-2xl border border-zinc-200/80 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-zinc-800 dark:bg-[#141416] dark:shadow-none";

type CategoryRow = {
  id: string;
  nameEn: string;
  nameId: string;
  slug: string;
  _count: {
    posts: number;
  };
};

function ActionMessage({
  state,
}: {
  state: CategoryActionState;
}) {
  if (state?.error) {
    return (
      <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300">
        <span className="mt-1 size-2 shrink-0 rounded-full bg-red-500" />
        <p>{state.error}</p>
      </div>
    );
  }

  if (state?.success) {
    return (
      <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-300">
        <Check className="mt-0.5 size-4 shrink-0" />
        <p>{state.success}</p>
      </div>
    );
  }

  return null;
}

function CreateCategoryForm() {
  const [state, formAction, pending] = useActionState<
    CategoryActionState,
    FormData
  >(createCategory, {});

  return (
    <div className={cardClass}>
      <div className="border-b border-zinc-200/80 px-5 py-4 dark:border-zinc-800 md:px-6">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-xl bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-300">
            <Plus className="size-4" strokeWidth={1.8} />
          </div>

          <div>
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Add category
            </h2>

            <p className="mt-0.5 text-xs text-zinc-400 dark:text-zinc-500">
              Create a category for organizing your writings.
            </p>
          </div>
        </div>
      </div>

      <form action={formAction} className="p-5 md:p-6">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label
              className={labelClass}
              htmlFor="nameEn"
            >
              Name EN
            </label>

            <input
              id="nameEn"
              name="nameEn"
              required
              className={fieldClass}
              placeholder="Technology"
            />
          </div>

          <div>
            <label
              className={labelClass}
              htmlFor="nameId"
            >
              Name ID
            </label>

            <input
              id="nameId"
              name="nameId"
              required
              className={fieldClass}
              placeholder="Teknologi"
            />
          </div>

          <div>
            <label
              className={labelClass}
              htmlFor="slug"
            >
              Slug
            </label>

            <input
              id="slug"
              name="slug"
              required
              pattern="^[a-z0-9]+(?:-[a-z0-9]+)*$"
              className={fieldClass}
              placeholder="technology"
            />

            <p className="mt-1.5 text-[11px] text-zinc-400 dark:text-zinc-600">
              Lowercase letters, numbers and hyphens.
            </p>
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={pending}
              className="group inline-flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-900 bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:bg-zinc-800 hover:shadow-md active:translate-y-0 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60 dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white dark:hover:shadow-lg"
            >
              {pending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Adding…
                </>
              ) : (
                <>
                  <Plus className="size-4 transition-transform duration-150 group-hover:rotate-90" />
                  Add category
                </>
              )}
            </button>
          </div>
        </div>

        {state?.error || state?.success ? (
          <div className="mt-5">
            <ActionMessage state={state} />
          </div>
        ) : null}
      </form>
    </div>
  );
}

function EditCategoryForm({
  category,
}: {
  category: CategoryRow;
}) {
  const bound = updateCategory.bind(
    null,
    category.id,
  );

  const [state, formAction, pending] =
    useActionState<CategoryActionState, FormData>(
      bound,
      {},
    );

  return (
    <tr className="group border-b border-zinc-100 align-top last:border-0 dark:border-zinc-800">
      <td
        className="px-4 py-4 md:px-5 md:py-5"
        colSpan={4}
      >
        <form action={formAction}>
          <div className="grid gap-4 lg:grid-cols-[1fr_1fr_1fr_auto] lg:items-end">
            <div>
              <label className={labelClass}>
                Name EN
              </label>

              <input
                name="nameEn"
                defaultValue={category.nameEn}
                required
                className={fieldClass}
              />
            </div>

            <div>
              <label className={labelClass}>
                Name ID
              </label>

              <input
                name="nameId"
                defaultValue={category.nameId}
                required
                className={fieldClass}
              />
            </div>

            <div>
              <label className={labelClass}>
                Slug
              </label>

              <input
                name="slug"
                defaultValue={category.slug}
                required
                pattern="^[a-z0-9]+(?:-[a-z0-9]+)*$"
                className={fieldClass}
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="submit"
                disabled={pending}
                className="group inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-900 bg-zinc-900 px-3.5 py-2.5 text-sm font-medium text-white shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:bg-zinc-800 hover:shadow-md active:translate-y-0 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-60 dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
              >
                {pending ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <Save className="size-3.5 transition-transform duration-150 group-hover:-translate-y-0.5" />
                )}

                {pending ? "Saving…" : "Save"}
              </button>

              <button
                formAction={deleteCategory.bind(
                  null,
                  category.id,
                )}
                type="submit"
                className="group inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm font-medium text-red-600 shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:border-red-300 hover:bg-red-100 hover:shadow-md active:translate-y-0 active:scale-[0.97] dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-400 dark:hover:border-red-800 dark:hover:bg-red-950/50"
              >
                <Trash2 className="size-3.5 transition-transform duration-150 group-hover:scale-110" />
                Delete
              </button>

              <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-100 px-2.5 py-1 text-[11px] font-medium text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                <FolderOpen className="size-3" />

                {category._count.posts}{" "}
                {category._count.posts === 1
                  ? "post"
                  : "posts"}
              </span>
            </div>
          </div>

          {state?.error || state?.success ? (
            <div className="mt-4">
              <ActionMessage state={state} />
            </div>
          ) : null}
        </form>
      </td>
    </tr>
  );
}

export function CategoriesManager({
  categories,
}: {
  categories: CategoryRow[];
}) {
  return (
    <div className="space-y-6">
      <CreateCategoryForm />

      <div className={cardClass}>
        {categories.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500">
              <FolderOpen className="size-5" />
            </div>

            <h3 className="mt-4 text-sm font-semibold text-zinc-800 dark:text-zinc-200">
              No categories yet
            </h3>

            <p className="mt-1 max-w-sm text-xs leading-5 text-zinc-400 dark:text-zinc-500">
              Create your first category above to start
              organizing your writings.
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between border-b border-zinc-200/80 px-5 py-4 dark:border-zinc-800 md:px-6">
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-xl bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-300">
                  <FolderOpen
                    className="size-4"
                    strokeWidth={1.8}
                  />
                </div>

                <div>
                  <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    Existing categories
                  </h2>

                  <p className="mt-0.5 text-xs text-zinc-400 dark:text-zinc-500">
                    Manage your writing categories.
                  </p>
                </div>
              </div>

              <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-[11px] font-medium text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                {categories.length}{" "}
                {categories.length === 1
                  ? "category"
                  : "categories"}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="border-b border-zinc-100 bg-zinc-50/70 dark:border-zinc-800 dark:bg-[#111112]">
                  <tr>
                    <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-400 dark:text-zinc-600">
                      Category details
                    </th>

                    <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-400 dark:text-zinc-600">
                      Name ID
                    </th>

                    <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-400 dark:text-zinc-600">
                      Slug
                    </th>

                    <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-400 dark:text-zinc-600">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {categories.map((category) => (
                    <EditCategoryForm
                      key={category.id}
                      category={category}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
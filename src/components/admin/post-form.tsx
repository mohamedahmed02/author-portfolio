"use client";

import { useActionState, useState } from "react";
import slugify from "slugify";
import {
  createPost,
  updatePost,
  type PostActionState,
} from "@/app/admin/actions/posts";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { cn } from "@/lib/utils";

type CategoryOption = {
  id: string;
  nameEn: string;
};

type PostFormValues = {
  id?: string;
  titleEn?: string;
  titleId?: string;
  slug?: string;
  excerptEn?: string;
  excerptId?: string;
  bodyEn?: string;
  bodyId?: string;
  categoryId?: string | null;
  featuredImageId?: string | null;
  readingTime?: number;
  featured?: boolean;
  status?: "DRAFT" | "PUBLISHED";
  seoTitleEn?: string | null;
  seoTitleId?: string | null;
  seoDescriptionEn?: string | null;
  seoDescriptionId?: string | null;
};

type PostFormProps = {
  categories: CategoryOption[];
  post?: PostFormValues;
};

const fieldClass =
  "mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500";
const labelClass = "block text-sm font-medium text-zinc-700";

export function PostForm({ categories, post }: PostFormProps) {
  const postId = post?.id;
  const isEdit = Boolean(postId);
  const action = postId
    ? updatePost.bind(null, postId)
    : createPost;
  const [state, formAction, pending] = useActionState<PostActionState, FormData>(
    action,
    {},
  );

  const [locale, setLocale] = useState<"en" | "id">("en");
  const [titleEn, setTitleEn] = useState(post?.titleEn ?? "");
  const [titleId, setTitleId] = useState(post?.titleId ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(post?.slug));
  const [excerptEn, setExcerptEn] = useState(post?.excerptEn ?? "");
  const [excerptId, setExcerptId] = useState(post?.excerptId ?? "");
  const [bodyEn, setBodyEn] = useState(post?.bodyEn ?? "");
  const [bodyId, setBodyId] = useState(post?.bodyId ?? "");

  const syncSlugFromTitle = (enTitle: string) => {
    if (slugTouched) return;
    setSlug(
      slugify(enTitle, { lower: true, strict: true, trim: true }) || "",
    );
  };

  return (
    <form action={formAction} className="space-y-8">
      {state?.error ? (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      ) : null}

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setLocale("en")}
          className={cn(
            "rounded-md px-3 py-1.5 text-sm font-medium",
            locale === "en"
              ? "bg-zinc-900 text-white"
              : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200",
          )}
        >
          English
        </button>
        <button
          type="button"
          onClick={() => setLocale("id")}
          className={cn(
            "rounded-md px-3 py-1.5 text-sm font-medium",
            locale === "id"
              ? "bg-zinc-900 text-white"
              : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200",
          )}
        >
          Indonesian
        </button>
      </div>

      <div className={locale === "en" ? "space-y-4" : "hidden"}>
        <div>
          <label className={labelClass} htmlFor="titleEn">
            Title (EN)
          </label>
          <input
            id="titleEn"
            name="titleEn"
            required
            className={fieldClass}
            value={titleEn}
            onChange={(e) => {
              setTitleEn(e.target.value);
              syncSlugFromTitle(e.target.value);
            }}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="excerptEn">
            Excerpt (EN)
          </label>
          <textarea
            id="excerptEn"
            name="excerptEn"
            required
            rows={3}
            className={fieldClass}
            value={excerptEn}
            onChange={(e) => setExcerptEn(e.target.value)}
          />
        </div>
        <div>
          <span className={labelClass}>Body (EN)</span>
          <div className="mt-1">
            <RichTextEditor value={bodyEn} onChange={setBodyEn} placeholder="Write in English…" />
          </div>
          <input type="hidden" name="bodyEn" value={bodyEn} />
        </div>
        <div>
          <label className={labelClass} htmlFor="seoTitleEn">
            SEO title (EN)
          </label>
          <input
            id="seoTitleEn"
            name="seoTitleEn"
            className={fieldClass}
            defaultValue={post?.seoTitleEn ?? ""}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="seoDescriptionEn">
            SEO description (EN)
          </label>
          <textarea
            id="seoDescriptionEn"
            name="seoDescriptionEn"
            rows={2}
            className={fieldClass}
            defaultValue={post?.seoDescriptionEn ?? ""}
          />
        </div>
      </div>

      <div className={locale === "id" ? "space-y-4" : "hidden"}>
        <div>
          <label className={labelClass} htmlFor="titleId">
            Title (ID)
          </label>
          <input
            id="titleId"
            name="titleId"
            required
            className={fieldClass}
            value={titleId}
            onChange={(e) => setTitleId(e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="excerptId">
            Excerpt (ID)
          </label>
          <textarea
            id="excerptId"
            name="excerptId"
            required
            rows={3}
            className={fieldClass}
            value={excerptId}
            onChange={(e) => setExcerptId(e.target.value)}
          />
        </div>
        <div>
          <span className={labelClass}>Body (ID)</span>
          <div className="mt-1">
            <RichTextEditor value={bodyId} onChange={setBodyId} placeholder="Tulis dalam Bahasa Indonesia…" />
          </div>
          <input type="hidden" name="bodyId" value={bodyId} />
        </div>
        <div>
          <label className={labelClass} htmlFor="seoTitleId">
            SEO title (ID)
          </label>
          <input
            id="seoTitleId"
            name="seoTitleId"
            className={fieldClass}
            defaultValue={post?.seoTitleId ?? ""}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="seoDescriptionId">
            SEO description (ID)
          </label>
          <textarea
            id="seoDescriptionId"
            name="seoDescriptionId"
            rows={2}
            className={fieldClass}
            defaultValue={post?.seoDescriptionId ?? ""}
          />
        </div>
      </div>

      <div className="grid gap-4 border-t border-zinc-200 pt-6 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className={labelClass} htmlFor="slug">
            Slug
          </label>
          <input
            id="slug"
            name="slug"
            required
            className={fieldClass}
            value={slug}
            onChange={(e) => {
              setSlugTouched(true);
              setSlug(e.target.value);
            }}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="categoryId">
            Category
          </label>
          <select
            id="categoryId"
            name="categoryId"
            className={fieldClass}
            defaultValue={post?.categoryId ?? ""}
          >
            <option value="">None</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nameEn}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass} htmlFor="featuredImageId">
            Featured image ID
          </label>
          <input
            id="featuredImageId"
            name="featuredImageId"
            className={fieldClass}
            placeholder="Media record id"
            defaultValue={post?.featuredImageId ?? ""}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="readingTime">
            Reading time (minutes)
          </label>
          <input
            id="readingTime"
            name="readingTime"
            type="number"
            min={1}
            max={120}
            className={fieldClass}
            defaultValue={post?.readingTime ?? 5}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="status">
            Status
          </label>
          <select
            id="status"
            name="status"
            className={fieldClass}
            defaultValue={post?.status ?? "DRAFT"}
          >
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
          </select>
        </div>
        <div className="flex items-end pb-2">
          <label className="inline-flex items-center gap-2 text-sm text-zinc-700">
            <input
              type="checkbox"
              name="featured"
              defaultChecked={post?.featured ?? false}
              className="size-4 rounded border-zinc-300"
            />
            Featured
          </label>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-60"
        >
          {pending ? "Saving…" : isEdit ? "Update writing" : "Create writing"}
        </button>
      </div>
    </form>
  );
}

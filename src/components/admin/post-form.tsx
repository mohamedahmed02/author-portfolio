"use client";

import { useActionState, useState } from "react";
import slugify from "slugify";
import {
  Check,
  ChevronDown,
  FileText,
  Globe2,
  ImageIcon,
  Languages,
  Loader2,
  Save,
  Search,
  Sparkles,
} from "lucide-react";
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

const inputClass =
  "mt-2 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2.75 text-sm text-zinc-900 outline-none transition-all placeholder:text-zinc-400 hover:border-zinc-300 focus:border-zinc-400 focus:bg-white focus:ring-4 focus:ring-zinc-100 dark:border-zinc-700 dark:bg-[#19191b] dark:text-zinc-100 dark:placeholder:text-zinc-600 dark:hover:border-zinc-600 dark:focus:border-zinc-500 dark:focus:bg-[#1c1c1f] dark:focus:ring-zinc-800";

const textareaClass =
  "mt-2 w-full resize-y rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-3 text-sm leading-6 text-zinc-900 outline-none transition-all placeholder:text-zinc-400 hover:border-zinc-300 focus:border-zinc-400 focus:bg-white focus:ring-4 focus:ring-zinc-100 dark:border-zinc-700 dark:bg-[#19191b] dark:text-zinc-100 dark:placeholder:text-zinc-600 dark:hover:border-zinc-600 dark:focus:border-zinc-500 dark:focus:bg-[#1c1c1f] dark:focus:ring-zinc-800";

const labelClass =
  "block text-xs font-medium text-zinc-600 dark:text-zinc-400";

const sectionClass =
  "rounded-2xl border border-zinc-200/80 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-zinc-800 dark:bg-[#141416] dark:shadow-none";

export function PostForm({ categories, post }: PostFormProps) {
  const postId = post?.id;
  const isEdit = Boolean(postId);

  const action = postId
    ? updatePost.bind(null, postId)
    : createPost;

  const [state, formAction, pending] = useActionState<
    PostActionState,
    FormData
  >(action, {});

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
      slugify(enTitle, {
        lower: true,
        strict: true,
        trim: true,
      }) || "",
    );
  };

  return (
    <form action={formAction} className="space-y-6">
      {/* Error */}
      {state?.error ? (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300">
          <span className="mt-1 size-2 shrink-0 rounded-full bg-red-500" />
          <p>{state.error}</p>
        </div>
      ) : null}

      {/* Language switcher */}
      <div className={sectionClass}>
        <div className="flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between md:px-6">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-xl bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-300">
              <Languages className="size-4" strokeWidth={1.7} />
            </div>

            <div>
              <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                Content language
              </p>

              <p className="mt-0.5 text-xs text-zinc-400 dark:text-zinc-500">
                Manage both versions of your writing.
              </p>
            </div>
          </div>

          <div className="flex rounded-xl bg-zinc-100 p-1 dark:bg-[#1b1b1d]">
            <button
              type="button"
              onClick={() => setLocale("en")}
              className={cn(
                "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-all",
                locale === "en"
                  ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-zinc-100"
                  : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-500 dark:hover:text-zinc-300",
              )}
            >
              <Globe2 className="size-3.5" />
              English

              {locale === "en" ? (
                <Check className="size-3" />
              ) : null}
            </button>

            <button
              type="button"
              onClick={() => setLocale("id")}
              className={cn(
                "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-all",
                locale === "id"
                  ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-zinc-100"
                  : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-500 dark:hover:text-zinc-300",
              )}
            >
              <Globe2 className="size-3.5" />
              Indonesian

              {locale === "id" ? (
                <Check className="size-3" />
              ) : null}
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className={sectionClass}>
        <div className="border-b border-zinc-200/80 px-5 py-4 dark:border-zinc-800 md:px-6">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-xl bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-300">
              <FileText className="size-4" strokeWidth={1.7} />
            </div>

            <div>
              <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                {locale === "en" ? "English content" : "Indonesian content"}
              </h2>

              <p className="mt-0.5 text-xs text-zinc-400 dark:text-zinc-500">
                Write and optimize your article.
              </p>
            </div>
          </div>
        </div>

        {/* English */}
        <div
          className={cn(
            "space-y-6 p-5 md:p-6",
            locale === "en" ? "block" : "hidden",
          )}
        >
          <div>
            <label className={labelClass} htmlFor="titleEn">
              Title
            </label>

            <input
              id="titleEn"
              name="titleEn"
              required
              className={`${inputClass} px-4 py-3.5 text-base font-medium`}
              placeholder="Give your writing a clear title..."
              value={titleEn}
              onChange={(e) => {
                setTitleEn(e.target.value);
                syncSlugFromTitle(e.target.value);
              }}
            />
          </div>

          <div>
            <label className={labelClass} htmlFor="excerptEn">
              Excerpt
            </label>

            <textarea
              id="excerptEn"
              name="excerptEn"
              required
              rows={3}
              className={textareaClass}
              placeholder="A short introduction that will appear in previews..."
              value={excerptEn}
              onChange={(e) => setExcerptEn(e.target.value)}
            />

            <p className="mt-1.5 text-[11px] text-zinc-400 dark:text-zinc-600">
              Keep this concise. It should quickly tell readers what the piece
              is about.
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className={labelClass}>Body</label>

              <span className="text-[10px] uppercase tracking-[0.12em] text-zinc-400 dark:text-zinc-600">
                English
              </span>
            </div>

            <div className="mt-2">
              <RichTextEditor
                value={bodyEn}
                onChange={setBodyEn}
                placeholder="Write in English…"
              />
            </div>

            <input type="hidden" name="bodyEn" value={bodyEn} />
          </div>

          {/* SEO */}
          <div className="rounded-xl border border-zinc-200/80 bg-zinc-50/70 p-4 dark:border-zinc-800 dark:bg-[#111112]">
            <div className="mb-4 flex items-center gap-2">
              <Search className="size-3.5 text-zinc-400 dark:text-zinc-500" />

              <div>
                <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                  Search optimization
                </p>

                <p className="mt-0.5 text-[10px] text-zinc-400 dark:text-zinc-600">
                  Optional metadata for search engines.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className={labelClass} htmlFor="seoTitleEn">
                  SEO title
                </label>

                <input
                  id="seoTitleEn"
                  name="seoTitleEn"
                  className={inputClass}
                  placeholder="Search-friendly title..."
                  defaultValue={post?.seoTitleEn ?? ""}
                />
              </div>

              <div>
                <label className={labelClass} htmlFor="seoDescriptionEn">
                  SEO description
                </label>

                <textarea
                  id="seoDescriptionEn"
                  name="seoDescriptionEn"
                  rows={2}
                  className={textareaClass}
                  placeholder="A short description for search results..."
                  defaultValue={post?.seoDescriptionEn ?? ""}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Indonesian */}
        <div
          className={cn(
            "space-y-6 p-5 md:p-6",
            locale === "id" ? "block" : "hidden",
          )}
        >
          <div>
            <label className={labelClass} htmlFor="titleId">
              Title
            </label>

            <input
              id="titleId"
              name="titleId"
              required
              className={`${inputClass} px-4 py-3.5 text-base font-medium`}
              placeholder="Tulis judul artikel..."
              value={titleId}
              onChange={(e) => setTitleId(e.target.value)}
            />
          </div>

          <div>
            <label className={labelClass} htmlFor="excerptId">
              Excerpt
            </label>

            <textarea
              id="excerptId"
              name="excerptId"
              required
              rows={3}
              className={textareaClass}
              placeholder="Tulis ringkasan singkat..."
              value={excerptId}
              onChange={(e) => setExcerptId(e.target.value)}
            />

            <p className="mt-1.5 text-[11px] text-zinc-400 dark:text-zinc-600">
              Keep this concise and easy to understand.
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className={labelClass}>Body</label>

              <span className="text-[10px] uppercase tracking-[0.12em] text-zinc-400 dark:text-zinc-600">
                Indonesian
              </span>
            </div>

            <div className="mt-2">
              <RichTextEditor
                value={bodyId}
                onChange={setBodyId}
                placeholder="Tulis dalam Bahasa Indonesia…"
              />
            </div>

            <input type="hidden" name="bodyId" value={bodyId} />
          </div>

          {/* SEO */}
          <div className="rounded-xl border border-zinc-200/80 bg-zinc-50/70 p-4 dark:border-zinc-800 dark:bg-[#111112]">
            <div className="mb-4 flex items-center gap-2">
              <Search className="size-3.5 text-zinc-400 dark:text-zinc-500" />

              <div>
                <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                  Search optimization
                </p>

                <p className="mt-0.5 text-[10px] text-zinc-400 dark:text-zinc-600">
                  Optional metadata for search engines.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className={labelClass} htmlFor="seoTitleId">
                  SEO title
                </label>

                <input
                  id="seoTitleId"
                  name="seoTitleId"
                  className={inputClass}
                  placeholder="Judul untuk mesin pencari..."
                  defaultValue={post?.seoTitleId ?? ""}
                />
              </div>

              <div>
                <label className={labelClass} htmlFor="seoDescriptionId">
                  SEO description
                </label>

                <textarea
                  id="seoDescriptionId"
                  name="seoDescriptionId"
                  rows={2}
                  className={textareaClass}
                  placeholder="Deskripsi singkat untuk hasil pencarian..."
                  defaultValue={post?.seoDescriptionId ?? ""}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Publishing settings */}
      <div className={sectionClass}>
        <div className="border-b border-zinc-200/80 px-5 py-4 dark:border-zinc-800 md:px-6">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-xl bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-300">
              <Sparkles className="size-4" strokeWidth={1.7} />
            </div>

            <div>
              <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Publishing
              </h2>

              <p className="mt-0.5 text-xs text-zinc-400 dark:text-zinc-500">
                Configure how and where this writing appears.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-5 p-5 md:grid-cols-2 md:p-6">
          {/* Slug */}
          <div className="md:col-span-2">
            <label className={labelClass} htmlFor="slug">
              Slug
            </label>

            <input
              id="slug"
              name="slug"
              required
              className={inputClass}
              value={slug}
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(e.target.value);
              }}
            />

            <p className="mt-1.5 text-[11px] text-zinc-400 dark:text-zinc-600">
              This becomes part of the public URL.
            </p>
          </div>

          {/* Category */}
          <div>
            <label className={labelClass} htmlFor="categoryId">
              Category
            </label>

            <div className="relative">
              <select
                id="categoryId"
                name="categoryId"
                className={`${inputClass} appearance-none pr-10`}
                defaultValue={post?.categoryId ?? ""}
              >
                <option value="">None</option>

                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.nameEn}
                  </option>
                ))}
              </select>

              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400 dark:text-zinc-600" />
            </div>
          </div>

          {/* Featured image */}
          <div>
            <label className={labelClass} htmlFor="featuredImageId">
              Featured image ID
            </label>

            <div className="relative">
              <ImageIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400 dark:text-zinc-600" />

              <input
                id="featuredImageId"
                name="featuredImageId"
                className={`${inputClass} pl-9`}
                placeholder="Media record id"
                defaultValue={post?.featuredImageId ?? ""}
              />
            </div>
          </div>

          {/* Reading time */}
          <div>
            <label className={labelClass} htmlFor="readingTime">
              Reading time
            </label>

            <div className="relative">
              <input
                id="readingTime"
                name="readingTime"
                type="number"
                min={1}
                max={120}
                className={`${inputClass} pr-16`}
                defaultValue={post?.readingTime ?? 5}
              />

              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400 dark:text-zinc-600">
                minutes
              </span>
            </div>
          </div>

          {/* Status */}
          <div>
            <label className={labelClass} htmlFor="status">
              Status
            </label>

            <div className="relative">
              <select
                id="status"
                name="status"
                className={`${inputClass} appearance-none pr-10`}
                defaultValue={post?.status ?? "DRAFT"}
              >
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
              </select>

              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400 dark:text-zinc-600" />
            </div>
          </div>

          {/* Featured */}
          <div className="md:col-span-2">
            <label className="group flex cursor-pointer items-center gap-3 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 transition-colors hover:bg-zinc-100 dark:border-zinc-800 dark:bg-[#111112] dark:hover:bg-[#18181a]">
              <input
                type="checkbox"
                name="featured"
                defaultChecked={post?.featured ?? false}
                className="size-4 rounded border-zinc-300 accent-zinc-900 dark:border-zinc-600 dark:accent-zinc-100"
              />

              <div>
                <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                  Feature this writing
                </p>

                <p className="mt-0.5 text-[11px] text-zinc-400 dark:text-zinc-600">
                  Highlight this piece in featured content areas.
                </p>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="sticky bottom-4 z-10 flex items-center justify-between gap-4 rounded-2xl border border-zinc-200/80 bg-white/95 px-4 py-3 shadow-lg shadow-zinc-900/5 backdrop-blur dark:border-zinc-800 dark:bg-[#141416]/95 dark:shadow-black/20">
        <div className="hidden items-center gap-2 sm:flex">
          <div className="flex size-7 items-center justify-center rounded-lg bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500">
            <FileText className="size-3.5" />
          </div>

          <p className="text-xs text-zinc-500 dark:text-zinc-500">
            {isEdit
              ? "Changes are ready to be saved."
              : "Your writing is ready to be created."}
          </p>
        </div>

        <button
          type="submit"
          disabled={pending}
          className="ml-auto inline-flex min-w-[150px] items-center justify-center gap-2 rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
        >
          {pending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Saving…
            </>
          ) : (
            <>
              <Save className="size-4" />
              {isEdit ? "Update writing" : "Create writing"}
            </>
          )}
        </button>
      </div>
    </form>
  );
}
"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useTransition } from "react";
import type { Locale } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionary";
import { cn } from "@/lib/utils";

export function WritingFilters({
  locale,
  dict,
  categories,
  current,
}: {
  locale: Locale;
  dict: Dictionary;
  categories: { slug: string; name: string; count: number }[];
  current: { q: string; category: string; sort: string };
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function push(next: { q?: string; category?: string; sort?: string }) {
    const params = new URLSearchParams();
    const q = next.q ?? current.q;
    const category = next.category ?? current.category;
    const sort = next.sort ?? current.sort;
    if (q) params.set("q", q);
    if (category) params.set("category", category);
    if (sort && sort !== "newest") params.set("sort", sort);
    const qs = params.toString();
    startTransition(() => {
      router.push(`/${locale}/writing${qs ? `?${qs}` : ""}`);
    });
  }

  function onSearch(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    push({ q: String(data.get("q") || "") });
  }

  return (
    <div className={cn("mt-10 space-y-5", pending && "opacity-70")}>
      <form onSubmit={onSearch} className="flex flex-col gap-3 sm:flex-row">
        <label className="sr-only" htmlFor="writing-search">
          {dict.writing.search}
        </label>
        <input
          id="writing-search"
          name="q"
          defaultValue={current.q}
          placeholder={dict.writing.searchPlaceholder}
          className="w-full border border-[var(--border-strong)] bg-[var(--bg-elevated)] px-4 py-3 text-sm outline-none focus:border-[var(--accent)] sm:max-w-md"
        />
        <button
          type="submit"
          className="inline-flex h-11 items-center justify-center border border-[var(--border-strong)] px-4 text-sm transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
        >
          {dict.writing.search}
        </button>
        <div className="flex gap-2 sm:ml-auto">
          <button
            type="button"
            onClick={() => push({ sort: "newest" })}
            className={cn(
              "h-11 px-3 text-sm",
              current.sort === "newest" ? "text-[var(--accent)]" : "text-[var(--fg-muted)]",
            )}
          >
            {dict.writing.sortNewest}
          </button>
          <button
            type="button"
            onClick={() => push({ sort: "oldest" })}
            className={cn(
              "h-11 px-3 text-sm",
              current.sort === "oldest" ? "text-[var(--accent)]" : "text-[var(--fg-muted)]",
            )}
          >
            {dict.writing.sortOldest}
          </button>
        </div>
      </form>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => push({ category: "" })}
          className={cn(
            "border px-3 py-1.5 text-xs uppercase tracking-[0.12em] transition",
            !current.category
              ? "border-[var(--accent)] text-[var(--accent)]"
              : "border-[var(--border)] text-[var(--fg-muted)] hover:border-[var(--border-strong)]",
          )}
        >
          {dict.writing.allCategories}
        </button>
        {categories.map((cat) => (
          <button
            key={cat.slug}
            type="button"
            onClick={() => push({ category: cat.slug })}
            className={cn(
              "border px-3 py-1.5 text-xs uppercase tracking-[0.12em] transition",
              current.category === cat.slug
                ? "border-[var(--accent)] text-[var(--accent)]"
                : "border-[var(--border)] text-[var(--fg-muted)] hover:border-[var(--border-strong)]",
            )}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  );
}

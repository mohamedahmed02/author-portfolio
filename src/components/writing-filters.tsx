"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useTransition } from "react";
import type { Locale } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionary";
import { cn } from "@/lib/utils";
import { Search, ArrowDownUp } from "lucide-react";

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

    push({
      q: String(data.get("q") || ""),
    });
  }

  return (
    <div
      className={cn(
        "mt-12 space-y-6 transition-opacity duration-200",
        pending && "opacity-60",
      )}
    >
      {/* Search + sorting */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <form
          onSubmit={onSearch}
          className="flex w-full max-w-xl items-center"
        >
          <label className="sr-only" htmlFor="writing-search">
            {dict.writing.search}
          </label>

          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--fg-subtle)]" />

            <input
              id="writing-search"
              name="q"
              defaultValue={current.q}
              placeholder={dict.writing.searchPlaceholder}
              className="h-12 w-full rounded-full border border-[var(--border)] bg-[var(--bg-elevated)] pl-11 pr-4 text-sm text-[var(--fg)] outline-none transition-all placeholder:text-[var(--fg-subtle)] hover:border-[var(--border-strong)] focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent-soft)]"
            />
          </div>

          <button
            type="submit"
            className="ml-2 inline-flex h-12 items-center justify-center rounded-full bg-[var(--fg)] px-5 text-sm font-medium text-[var(--bg)] transition-all hover:-translate-y-0.5 hover:bg-[var(--accent)] hover:text-[var(--accent-fg)]"
          >
            {dict.writing.search}
          </button>
        </form>

        {/* Sort */}
        <div className="flex items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--bg-elevated)] p-1">
          <span className="flex items-center gap-1.5 px-3 text-[var(--fg-subtle)]">
            <ArrowDownUp className="h-3.5 w-3.5" />
          </span>

          <button
            type="button"
            onClick={() => push({ sort: "newest" })}
            className={cn(
              "rounded-full px-4 py-2 text-xs font-medium transition",
              current.sort === "newest"
                ? "bg-[var(--fg)] text-[var(--bg)]"
                : "text-[var(--fg-muted)] hover:text-[var(--fg)]",
            )}
          >
            {dict.writing.sortNewest}
          </button>

          <button
            type="button"
            onClick={() => push({ sort: "oldest" })}
            className={cn(
              "rounded-full px-4 py-2 text-xs font-medium transition",
              current.sort === "oldest"
                ? "bg-[var(--fg)] text-[var(--bg)]"
                : "text-[var(--fg-muted)] hover:text-[var(--fg)]",
            )}
          >
            {dict.writing.sortOldest}
          </button>
        </div>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => push({ category: "" })}
          className={cn(
            "rounded-full border px-4 py-2 text-xs font-medium transition-all",
            !current.category
              ? "border-[var(--fg)] bg-[var(--fg)] text-[var(--bg)]"
              : "border-[var(--border)] text-[var(--fg-muted)] hover:border-[var(--border-strong)] hover:text-[var(--fg)]",
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
              "rounded-full border px-4 py-2 text-xs font-medium transition-all",
              current.category === cat.slug
                ? "border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-fg)]"
                : "border-[var(--border)] text-[var(--fg-muted)] hover:border-[var(--border-strong)] hover:text-[var(--fg)]",
            )}
          >
            {cat.name}

            <span className="ml-1.5 opacity-50">
              {cat.count}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
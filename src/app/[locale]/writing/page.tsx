import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PostCard } from "@/components/post-card";
import { WritingFilters } from "@/components/writing-filters";
import { getDictionary } from "@/lib/dictionary";
import { getCategories, getPublishedPosts, getSiteSettings } from "@/lib/content";
import { getLocalized, isLocale, type Locale } from "@/lib/i18n";
import { absoluteUrl } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return {};
  const locale = raw as Locale;
  const dict = getDictionary(locale);
  const settings = await getSiteSettings();
  const title = dict.writing.title;
  return {
    title,
    description: dict.writing.intro,
    alternates: {
      canonical: absoluteUrl(`/${locale}/writing`),
      languages: {
        en: absoluteUrl("/en/writing"),
        id: absoluteUrl("/id/writing"),
      },
    },
    openGraph: {
      title: `${title} · ${getLocalized(settings, locale, "siteName")}`,
      description: dict.writing.intro,
    },
  };
}

export default async function WritingPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string; category?: string; sort?: string; page?: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const sp = await searchParams;
  const dict = getDictionary(locale);
  const page = Math.max(1, Number(sp.page || 1) || 1);
  const sort = sp.sort === "oldest" ? "oldest" : "newest";

  const [categories, result] = await Promise.all([
    getCategories(),
    getPublishedPosts({
      locale,
      q: sp.q,
      category: sp.category,
      sort,
      page,
      pageSize: 10,
    }),
  ]);

  const hasFilters = Boolean(sp.q || sp.category);

  return (
    <div className="container-page py-14 md:py-20">
      <header className="max-w-2xl">
        <p className="text-xs uppercase tracking-[0.16em] text-[var(--fg-subtle)]">
          {dict.nav.writing}
        </p>
        <h1 className="mt-3 font-serif text-4xl tracking-tight md:text-5xl">
          {dict.writing.title}
        </h1>
        <p className="mt-4 text-base leading-relaxed text-[var(--fg-muted)] md:text-lg">
          {dict.writing.intro}
        </p>
      </header>

      <WritingFilters
        locale={locale}
        dict={dict}
        categories={categories.map((c) => ({
          slug: c.slug,
          name: getLocalized(c, locale, "name"),
          count: c._count.posts,
        }))}
        current={{
          q: sp.q || "",
          category: sp.category || "",
          sort,
        }}
      />

      <div className="mt-10">
        {result.items.length === 0 ? (
          <p className="border-t border-[var(--border)] py-16 text-[var(--fg-muted)]">
            {hasFilters ? dict.writing.noResults : dict.writing.empty}
          </p>
        ) : (
          result.items.map((post) => (
            <PostCard key={post.id} post={post} locale={locale} dict={dict} />
          ))
        )}
      </div>

      {result.totalPages > 1 ? (
        <nav className="mt-10 flex items-center justify-between border-t border-[var(--border)] pt-6 text-sm" aria-label="Pagination">
          {page > 1 ? (
            <a
              href={`?${new URLSearchParams({
                ...(sp.q ? { q: sp.q } : {}),
                ...(sp.category ? { category: sp.category } : {}),
                ...(sort !== "newest" ? { sort } : {}),
                page: String(page - 1),
              }).toString()}`}
              className="link-underline"
            >
              ←
            </a>
          ) : (
            <span />
          )}
          <span className="text-[var(--fg-muted)]">
            {page} / {result.totalPages}
          </span>
          {page < result.totalPages ? (
            <a
              href={`?${new URLSearchParams({
                ...(sp.q ? { q: sp.q } : {}),
                ...(sp.category ? { category: sp.category } : {}),
                ...(sort !== "newest" ? { sort } : {}),
                page: String(page + 1),
              }).toString()}`}
              className="link-underline"
            >
              →
            </a>
          ) : (
            <span />
          )}
        </nav>
      ) : null}
    </div>
  );
}

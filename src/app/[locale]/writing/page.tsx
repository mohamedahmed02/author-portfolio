import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PostCard } from "@/components/post-card";
import { WritingFilters } from "@/components/writing-filters";
import { getDictionary } from "@/lib/dictionary";
import {
  getCategories,
  getPublishedPosts,
  getSiteSettings,
} from "@/lib/content";
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
  const siteName = getLocalized(settings, locale, "siteName");

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
      title: `${title} · ${siteName}`,
      description: dict.writing.intro,
    },
  };
}

export default async function WritingPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    q?: string;
    category?: string;
    sort?: string;
    page?: string;
  }>;
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

  function buildPageUrl(nextPage: number) {
    const params = new URLSearchParams();

    if (sp.q) params.set("q", sp.q);
    if (sp.category) params.set("category", sp.category);
    if (sort !== "newest") params.set("sort", sort);

    params.set("page", String(nextPage));

    return `?${params.toString()}`;
  }

  return (
    <main>
      {/* =========================================================
          PAGE INTRO
      ========================================================= */}

      <section className="border-b border-[var(--border)]">
        <div className="container-page py-16 md:py-24 lg:py-28">
          <div className="max-w-3xl">

            <div className="mb-6 flex items-center gap-3">
              <span className="h-px w-8 bg-[var(--accent)]" />

              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--fg-subtle)]">
                {dict.nav.writing}
              </p>
            </div>

            <h1 className="font-serif text-5xl leading-[0.98] tracking-[-0.055em] sm:text-6xl md:text-7xl">
              {dict.writing.title}
            </h1>

            <p className="mt-7 max-w-2xl text-base leading-8 text-[var(--fg-muted)] md:text-lg">
              {dict.writing.intro}
            </p>

          </div>
        </div>
      </section>

      {/* =========================================================
          FILTERS
      ========================================================= */}

      <section className="container-page pt-8 md:pt-10">
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
      </section>

      {/* =========================================================
          RESULTS
      ========================================================= */}

      <section className="container-page pb-20 pt-10 md:pb-28 md:pt-14">

        {/* Result count / state */}
        <div className="mb-6 flex items-center justify-between text-xs uppercase tracking-[0.15em] text-[var(--fg-subtle)]">
          <span>
            {result.items.length > 0
              ? `${result.items.length} ${
                  result.items.length === 1 ? "article" : "articles"
                }`
              : "0 articles"}
          </span>

          {hasFilters ? (
            <span className="text-[var(--accent)]">
              {sp.q
                ? `"${sp.q}"`
                : sp.category
                  ? sp.category
                  : null}
            </span>
          ) : null}
        </div>

        {result.items.length === 0 ? (
          <div className="border-t border-[var(--border)] py-20 text-center md:py-28">
            <p className="font-serif text-3xl tracking-tight">
              {hasFilters
                ? dict.writing.noResults
                : dict.writing.empty}
            </p>

            <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-[var(--fg-muted)]">
              {hasFilters
                ? "Try adjusting your search or selecting another category."
                : "New writing will appear here once it is published."}
            </p>
          </div>
        ) : (
          <div>
            {result.items.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                locale={locale}
                dict={dict}
              />
            ))}
          </div>
        )}
      </section>

      {/* =========================================================
          PAGINATION
      ========================================================= */}

      {result.totalPages > 1 ? (
        <section className="border-t border-[var(--border)]">
          <div className="container-page flex items-center justify-between py-7">

            {page > 1 ? (
              <a
                href={buildPageUrl(page - 1)}
                className="group inline-flex items-center gap-2 text-sm text-[var(--fg-muted)] transition-colors hover:text-[var(--fg)]"
              >
                <span className="transition-transform duration-300 group-hover:-translate-x-1">
                  ←
                </span>

                <span>Previous</span>
              </a>
            ) : (
              <span />
            )}

            <div className="text-sm text-[var(--fg-muted)]">
              <span className="font-medium text-[var(--fg)]">
                {page}
              </span>

              <span className="mx-2 text-[var(--fg-subtle)]">
                /
              </span>

              <span>{result.totalPages}</span>
            </div>

            {page < result.totalPages ? (
              <a
                href={buildPageUrl(page + 1)}
                className="group inline-flex items-center gap-2 text-sm text-[var(--fg-muted)] transition-colors hover:text-[var(--fg)]"
              >
                <span>Next</span>

                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </a>
            ) : (
              <span />
            )}

          </div>
        </section>
      ) : null}
    </main>
  );
}
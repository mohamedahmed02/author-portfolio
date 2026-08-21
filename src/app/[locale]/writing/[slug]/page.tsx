import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ShareActions } from "@/components/share-actions";
import { PostCard } from "@/components/post-card";
import { getDictionary } from "@/lib/dictionary";
import {
  getAdjacentPosts,
  getPostBySlug,
  getRelatedPosts,
  getSiteSettings,
} from "@/lib/content";
import { getLocalized, isLocale, type Locale } from "@/lib/i18n";
import { absoluteUrl, formatDate } from "@/lib/utils";
import { sanitizeRichText } from "@/lib/sanitize";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  if (!isLocale(raw)) return {};
  const locale = raw as Locale;
  const post = await getPostBySlug(slug);
  if (!post) return {};

  const title =
    getLocalized(post, locale, "seoTitle") || getLocalized(post, locale, "title");
  const description =
    getLocalized(post, locale, "seoDescription") ||
    getLocalized(post, locale, "excerpt");
  const url = absoluteUrl(`/${locale}/writing/${post.slug}`);

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        en: absoluteUrl(`/en/writing/${post.slug}`),
        id: absoluteUrl(`/id/writing/${post.slug}`),
      },
    },
    openGraph: {
      type: "article",
      title,
      description,
      url,
      images: post.featuredImage ? [{ url: post.featuredImage.url }] : undefined,
      publishedTime: post.publishedAt?.toISOString(),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: post.featuredImage ? [post.featuredImage.url] : undefined,
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: raw, slug } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const dict = getDictionary(locale);
  const [post, settings] = await Promise.all([getPostBySlug(slug), getSiteSettings()]);
  if (!post || !post.publishedAt) notFound();

  const [adjacent, related] = await Promise.all([
    getAdjacentPosts(post.publishedAt, post.slug),
    getRelatedPosts(post.id, post.categoryId, 3),
  ]);

  const title = getLocalized(post, locale, "title");
  const excerpt = getLocalized(post, locale, "excerpt");
  const body = sanitizeRichText(getLocalized(post, locale, "body"));
  const categoryName = post.category
    ? getLocalized(post.category, locale, "name")
    : null;
  const url = absoluteUrl(`/${locale}/writing/${post.slug}`);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: excerpt,
    datePublished: post.publishedAt.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: {
      "@type": "Person",
      name: settings.authorName,
    },
    mainEntityOfPage: url,
    image: post.featuredImage?.url,
  };

  return (
    <article className="pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header className="container-page max-w-3xl py-14 md:py-20">
        <Link
          href={`/${locale}/writing`}
          className="text-sm text-[var(--fg-muted)] link-underline"
        >
          {dict.article.backToWriting}
        </Link>
        <div className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs uppercase tracking-[0.14em] text-[var(--fg-subtle)]">
          {categoryName ? <span>{categoryName}</span> : null}
          <time dateTime={post.publishedAt.toISOString()}>
            {formatDate(post.publishedAt, locale)}
          </time>
          <span>
            {dict.writing.minRead.replace("{minutes}", String(post.readingTime))}
          </span>
        </div>
        <h1 className="mt-5 font-serif text-4xl leading-[1.1] tracking-tight md:text-5xl lg:text-[3.4rem]">
          {title}
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-[var(--fg-muted)] md:text-xl">
          {excerpt}
        </p>
        <p className="mt-6 text-sm text-[var(--fg-muted)]">
          {dict.article.by} {settings.authorName}
        </p>
      </header>

      {post.featuredImage ? (
        <div className="container-page mb-12">
          <div className="relative aspect-[16/9] overflow-hidden border border-[var(--border)]">
            <Image
              src={post.featuredImage.url}
              alt={getLocalized(post.featuredImage, locale, "alt") || title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1120px) 100vw, 1120px"
            />
          </div>
        </div>
      ) : null}

      <div className="container-page">
        <div
          className="prose-article mx-auto"
          dangerouslySetInnerHTML={{ __html: body }}
        />

        <div className="mx-auto mt-12 max-w-[var(--prose-width)] border-t border-[var(--border)] pt-8">
          <ShareActions locale={locale} dict={dict} url={url} title={title} />
        </div>

        <nav className="mx-auto mt-12 grid max-w-[var(--prose-width)] gap-6 border-t border-[var(--border)] pt-8 md:grid-cols-2">
          {adjacent.previous ? (
            <Link href={`/${locale}/writing/${adjacent.previous.slug}`} className="group">
              <p className="text-xs uppercase tracking-[0.14em] text-[var(--fg-subtle)]">
                {dict.article.previous}
              </p>
              <p className="mt-2 font-serif text-xl tracking-tight group-hover:text-[var(--accent)]">
                {getLocalized(adjacent.previous, locale, "title")}
              </p>
            </Link>
          ) : (
            <span />
          )}
          {adjacent.next ? (
            <Link
              href={`/${locale}/writing/${adjacent.next.slug}`}
              className="group md:text-right"
            >
              <p className="text-xs uppercase tracking-[0.14em] text-[var(--fg-subtle)]">
                {dict.article.next}
              </p>
              <p className="mt-2 font-serif text-xl tracking-tight group-hover:text-[var(--accent)]">
                {getLocalized(adjacent.next, locale, "title")}
              </p>
            </Link>
          ) : null}
        </nav>
      </div>

      {related.length > 0 ? (
        <section className="container-page mt-20 border-t border-[var(--border)] pt-14">
          <h2 className="font-serif text-3xl tracking-tight">{dict.article.related}</h2>
          <div className="mt-8">
            {related.map((item) => (
              <PostCard key={item.id} post={item} locale={locale} dict={dict} />
            ))}
          </div>
        </section>
      ) : null}
    </article>
  );
}

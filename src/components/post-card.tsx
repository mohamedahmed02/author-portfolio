import Link from "next/link";
import Image from "next/image";
import type { Category, Media, Post } from "@prisma/client";
import type { Locale } from "@/lib/i18n";
import { getLocalized } from "@/lib/i18n";
import { formatDate } from "@/lib/utils";
import type { Dictionary } from "@/lib/dictionary";
import { ArrowUpRight } from "lucide-react";

type PostCardPost = Post & {
  category: Category | null;
  featuredImage: Media | null;
};

export function PostCard({
  post,
  locale,
  dict,
  priority = false,
}: {
  post: PostCardPost;
  locale: Locale;
  dict: Dictionary;
  priority?: boolean;
}) {
  const title = getLocalized(post, locale, "title");
  const excerpt = getLocalized(post, locale, "excerpt");

  const categoryName = post.category
    ? getLocalized(post.category, locale, "name")
    : null;

  const alt = post.featuredImage
    ? getLocalized(post.featuredImage, locale, "alt") || title
    : title;

  return (
    <article className="group border-t border-[var(--border)] py-8 md:py-10">
      <Link
        href={`/${locale}/writing/${post.slug}`}
        className="grid gap-7 md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] md:items-center md:gap-12"
      >
        {/* Image */}
        <div className="order-1 overflow-hidden rounded-[1rem] bg-[var(--bg-elevated)]">
          {post.featuredImage ? (
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src={post.featuredImage.url}
                alt={alt}
                fill
                priority={priority}
                sizes="(max-width: 768px) 100vw, 45vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]"
              />

              <div className="pointer-events-none absolute inset-0 bg-black/[0.02] transition group-hover:bg-black-0" />
            </div>
          ) : (
            <div className="flex aspect-[4/3] items-center justify-center bg-[var(--bg-elevated)]">
              <span className="font-serif text-2xl text-[var(--fg-subtle)]">
                {title}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="order-2">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[var(--fg-subtle)]">
            {categoryName ? <span>{categoryName}</span> : null}

            {categoryName && post.publishedAt ? (
              <span className="h-1 w-1 rounded-full bg-[var(--border-strong)]" />
            ) : null}

            {post.publishedAt ? (
              <time dateTime={post.publishedAt.toISOString()}>
                {formatDate(post.publishedAt, locale)}
              </time>
            ) : null}

            <span>
              {dict.writing.minRead.replace(
                "{minutes}",
                String(post.readingTime),
              )}
            </span>

            {post.featured ? (
              <>
                <span className="h-1 w-1 rounded-full bg-[var(--accent)]" />
                <span className="text-[var(--accent)]">
                  {dict.writing.featured}
                </span>
              </>
            ) : null}
          </div>

          <h3 className="mt-4 max-w-2xl font-serif text-2xl font-medium leading-[1.12] tracking-[-0.025em] md:text-4xl">
            {title}
          </h3>

          <p className="mt-5 max-w-xl text-[0.95rem] leading-7 text-[var(--fg-muted)] md:text-base">
            {excerpt}
          </p>

          <div className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-[var(--fg)]">
            <span className="link-underline">
              {dict.home.readArticle}
            </span>

            <ArrowUpRight
              className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </div>
        </div>
      </Link>
    </article>
  );
}
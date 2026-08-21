import Link from "next/link";
import Image from "next/image";
import type { Category, Media, Post } from "@prisma/client";
import type { Locale } from "@/lib/i18n";
import { getLocalized } from "@/lib/i18n";
import { formatDate } from "@/lib/utils";
import type { Dictionary } from "@/lib/dictionary";

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
    <article className="group grid gap-4 border-t border-[var(--border)] py-8 first:border-t-0 first:pt-0 md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] md:gap-10 md:py-10">
      <div className="order-2 md:order-1">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs uppercase tracking-[0.14em] text-[var(--fg-subtle)]">
          {categoryName ? <span>{categoryName}</span> : null}
          {post.publishedAt ? (
            <time dateTime={post.publishedAt.toISOString()}>
              {formatDate(post.publishedAt, locale)}
            </time>
          ) : null}
          <span>{dict.writing.minRead.replace("{minutes}", String(post.readingTime))}</span>
          {post.featured ? (
            <span className="text-[var(--accent)]">{dict.writing.featured}</span>
          ) : null}
        </div>
        <h3 className="mt-3 font-serif text-2xl leading-snug tracking-tight md:text-[1.75rem]">
          <Link
            href={`/${locale}/writing/${post.slug}`}
            className="link-underline transition-colors group-hover:text-[var(--accent)]"
          >
            {title}
          </Link>
        </h3>
        <p className="mt-3 max-w-xl text-[0.975rem] leading-relaxed text-[var(--fg-muted)]">
          {excerpt}
        </p>
        <Link
          href={`/${locale}/writing/${post.slug}`}
          className="mt-5 inline-flex text-sm text-[var(--fg)] link-underline"
        >
          {dict.home.readArticle}
        </Link>
      </div>

      {post.featuredImage ? (
        <div className="order-1 overflow-hidden border border-[var(--border)] md:order-2">
          <div className="relative aspect-[4/3]">
            <Image
              src={post.featuredImage.url}
              alt={alt}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
              sizes="(max-width: 768px) 100vw, 40vw"
              priority={priority}
            />
          </div>
        </div>
      ) : (
        <div className="order-1 hidden border border-dashed border-[var(--border)] bg-[var(--bg-elevated)] md:order-2 md:block">
          <div className="aspect-[4/3]" />
        </div>
      )}
    </article>
  );
}

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { NewsletterForm } from "@/components/newsletter-form";
import { PostCard } from "@/components/post-card";
import { getDictionary } from "@/lib/dictionary";
import { getFeaturedPosts, getSiteSettings } from "@/lib/content";
import { getLocalized, isLocale, type Locale } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const dict = getDictionary(locale);
  const [settings, featured] = await Promise.all([
    getSiteSettings(),
    getFeaturedPosts(6),
  ]);

  const eyebrow = getLocalized(settings, locale, "heroEyebrow");
  const headline = getLocalized(settings, locale, "heroHeadline");
  const description = getLocalized(settings, locale, "heroDescription");
  const cta = getLocalized(settings, locale, "heroCtaLabel");
  const ctaHref = settings.heroCtaHref?.startsWith("/")
    ? `/${locale}${settings.heroCtaHref}`
    : `/${locale}/writing`;
  const aboutTitle = getLocalized(settings, locale, "homeAboutTitle");
  const aboutDesc = getLocalized(settings, locale, "homeAboutDescription");
  const heroAlt = settings.heroImage
    ? getLocalized(settings.heroImage, locale, "alt") || settings.authorName
    : settings.authorName;

  return (
    <>
      <section className="container-page grid items-center gap-10 py-14 md:grid-cols-[1.05fr_0.95fr] md:gap-16 md:py-24">
        <div className="fade-in">
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--fg-subtle)]">{eyebrow}</p>
          <h1 className="mt-5 max-w-xl font-serif text-[2.6rem] leading-[1.08] tracking-tight md:text-[3.6rem]">
            {headline}
          </h1>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-[var(--fg-muted)] md:text-lg">
            {description}
          </p>
          <div className="mt-8">
            <Link
              href={ctaHref}
              className="inline-flex h-11 items-center bg-[var(--fg)] px-6 text-sm text-[var(--bg)] transition hover:bg-[var(--accent)] hover:text-[var(--accent-fg)]"
            >
              {cta}
            </Link>
          </div>
        </div>

        <div className="reveal-image relative aspect-[4/5] overflow-hidden border border-[var(--border)] bg-[var(--bg-elevated)]">
          {settings.heroImage ? (
            <Image
              src={settings.heroImage.url}
              alt={heroAlt}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 45vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-end bg-[linear-gradient(160deg,#ececec_0%,#d7d7d7_45%,#bcbcbc_100%)] p-6 dark:bg-[linear-gradient(160deg,#1a1a1d_0%,#121214_55%,#0c0c0d_100%)]">
              <p className="font-serif text-3xl text-[var(--fg)]/80">{settings.authorName}</p>
            </div>
          )}
        </div>
      </section>

      <section className="container-page border-t border-[var(--border)] py-16 md:py-24">
        <div className="mb-10 flex flex-col gap-3 md:mb-14 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-[var(--fg-subtle)]">
              {dict.home.featured}
            </p>
            <h2 className="mt-3 font-serif text-3xl tracking-tight md:text-4xl">
              {dict.home.featuredIntro}
            </h2>
          </div>
          <Link
            href={`/${locale}/writing`}
            className="text-sm text-[var(--fg-muted)] link-underline hover:text-[var(--fg)]"
          >
            {dict.home.viewAll}
          </Link>
        </div>

        <div>
          {featured.length === 0 ? (
            <p className="text-[var(--fg-muted)]">{dict.writing.empty}</p>
          ) : (
            featured.map((post, i) => (
              <PostCard key={post.id} post={post} locale={locale} dict={dict} priority={i === 0} />
            ))
          )}
        </div>
      </section>

      <section className="container-page grid gap-8 border-t border-[var(--border)] py-16 md:grid-cols-[0.9fr_1.1fr] md:py-24">
        <h2 className="font-serif text-3xl tracking-tight md:text-4xl">{aboutTitle}</h2>
        <div>
          <p className="max-w-xl text-base leading-relaxed text-[var(--fg-muted)] md:text-lg">
            {aboutDesc}
          </p>
          <Link
            href={`/${locale}/about`}
            className="mt-6 inline-flex text-sm link-underline"
          >
            {dict.home.aboutCta}
          </Link>
        </div>
      </section>

      <NewsletterForm
        locale={locale}
        dict={dict}
        title={getLocalized(settings, locale, "newsletterTitle")}
        description={getLocalized(settings, locale, "newsletterDescription")}
      />
    </>
  );
}

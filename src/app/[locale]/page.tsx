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
      {/* =========================================================
          HERO
      ========================================================= */}

      <section className="container-page py-16 md:py-24 lg:py-32">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-24">

          {/* Copy */}
          <div className="fade-in">

            <div className="mb-7 flex items-center gap-3">
              <span className="h-px w-10 bg-[var(--accent)]" />

              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--fg-subtle)]">
                {eyebrow}
              </p>
            </div>

            <h1 className="max-w-4xl font-serif text-[3.2rem] leading-[0.96] tracking-[-0.055em] sm:text-[4.2rem] md:text-[5rem] lg:text-[5.8rem]">
              {headline}
            </h1>

            <p className="mt-8 max-w-xl text-base leading-8 text-[var(--fg-muted)] md:text-lg">
              {description}
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-5">
              <Link
                href={ctaHref}
                className="group inline-flex h-12 items-center gap-4 rounded-full bg-[var(--fg)] px-7 text-sm font-medium text-[var(--bg)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[var(--accent)] hover:text-[var(--accent-fg)]"
              >
                <span>{cta}</span>

                <span className="text-base transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>

              <Link
                href={`/${locale}/about`}
                className="group inline-flex items-center gap-2 text-sm text-[var(--fg-muted)] transition-colors hover:text-[var(--fg)]"
              >
                <span>{dict.home.aboutCta}</span>
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </div>
          </div>

          {/* Image */}
          <div className="reveal-image relative mx-auto w-full max-w-[500px] lg:ml-auto">

            <div className="relative aspect-[4/5] overflow-hidden rounded-[2.25rem] bg-[var(--bg-elevated)] shadow-[0_25px_80px_rgba(0,0,0,0.08)]">

              {settings.heroImage ? (
                <Image
                  src={settings.heroImage.url}
                  alt={heroAlt}
                  fill
                  priority
                  className="object-cover transition-transform duration-1000 hover:scale-[1.025]"
                  sizes="(max-width: 768px) 100vw, 45vw"
                />
              ) : (
                <div className="absolute inset-0 flex items-end bg-[linear-gradient(145deg,#ededed_0%,#d8d8d8_50%,#bdbdbd_100%)] p-8 dark:bg-[linear-gradient(145deg,#1c1c1f_0%,#131316_55%,#0b0b0d_100%)]">
                  <p className="font-serif text-4xl text-[var(--fg)]/80">
                    {settings.authorName}
                  </p>
                </div>
              )}
            </div>

            {/* Decorative shape */}
            <div className="pointer-events-none absolute -bottom-8 -left-8 -z-10 h-32 w-32 rounded-full bg-[var(--accent-soft)] blur-3xl" />

            <div className="pointer-events-none absolute -right-5 -top-5 -z-10 h-20 w-20 rounded-full border border-[var(--border)]" />
          </div>
        </div>
      </section>

      {/* =========================================================
          FEATURED WRITINGS
      ========================================================= */}

      <section className="border-t border-[var(--border)]">
        <div className="container-page py-20 md:py-28">

          <div className="mb-12 flex flex-col gap-6 md:mb-16 md:flex-row md:items-end md:justify-between">

            <div>
              <div className="mb-5 flex items-center gap-3">
                <span className="h-px w-7 bg-[var(--accent)]" />

                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--fg-subtle)]">
                  {dict.home.featured}
                </p>
              </div>

              <h2 className="max-w-2xl font-serif text-4xl leading-tight tracking-[-0.045em] md:text-5xl">
                {dict.home.featuredIntro}
              </h2>
            </div>

            <Link
              href={`/${locale}/writing`}
              className="group inline-flex shrink-0 items-center gap-2 text-sm text-[var(--fg-muted)] transition-colors hover:text-[var(--fg)]"
            >
              <span>{dict.home.viewAll}</span>

              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>

          <div>
            {featured.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[var(--border-strong)] px-6 py-14 text-center">
                <p className="text-sm text-[var(--fg-muted)]">
                  {dict.writing.empty}
                </p>
              </div>
            ) : (
              featured.map((post, i) => (
                <PostCard
                  key={post.id}
                  post={post}
                  locale={locale}
                  dict={dict}
                  priority={i === 0}
                />
              ))
            )}
          </div>
        </div>
      </section>

      {/* =========================================================
          ABOUT
      ========================================================= */}

      <section className="border-t border-[var(--border)]">
        <div className="container-page py-20 md:py-32">

          <div className="grid gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:gap-24">

            <div>
              <div className="flex items-center gap-3">
                <span className="h-px w-7 bg-[var(--accent)]" />

                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--fg-subtle)]">
                  About
                </span>
              </div>

              <h2 className="mt-6 max-w-md font-serif text-4xl leading-[1.05] tracking-[-0.045em] md:text-5xl lg:text-6xl">
                {aboutTitle}
              </h2>
            </div>

            <div className="flex flex-col items-start">

              <p className="max-w-2xl text-lg leading-8 text-[var(--fg-muted)] md:text-xl md:leading-9">
                {aboutDesc}
              </p>

              <Link
                href={`/${locale}/about`}
                className="group mt-9 inline-flex items-center gap-3 rounded-full border border-[var(--border-strong)] px-6 py-3 text-sm font-medium transition-all duration-300 hover:border-[var(--fg)] hover:bg-[var(--fg)] hover:text-[var(--bg)]"
              >
                <span>{dict.home.aboutCta}</span>

                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>

            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          NEWSLETTER
      ========================================================= */}

      <NewsletterForm
        locale={locale}
        dict={dict}
        title={getLocalized(settings, locale, "newsletterTitle")}
        description={getLocalized(
          settings,
          locale,
          "newsletterDescription",
        )}
      />
    </>
  );
}
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getDictionary } from "@/lib/dictionary";
import { getSiteSettings } from "@/lib/content";
import { getLocalized, isLocale, type Locale } from "@/lib/i18n";
import { absoluteUrl } from "@/lib/utils";
import { SocialLinks } from "@/components/social-links";

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

  return {
    title: dict.about.title,
    description: getLocalized(settings, locale, "aboutShort"),
    alternates: {
      canonical: absoluteUrl(`/${locale}/about`),
      languages: {
        en: absoluteUrl("/en/about"),
        id: absoluteUrl("/id/about"),
      },
    },
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;

  if (!isLocale(raw)) notFound();

  const locale = raw as Locale;
  const dict = getDictionary(locale);
  const settings = await getSiteSettings();

  const shortBio = getLocalized(settings, locale, "aboutShort");
  const longBio = getLocalized(settings, locale, "aboutLong");

  const philosophy = getLocalized(
    settings,
    locale,
    "aboutPhilosophy",
  );

  const interests = getLocalized(
    settings,
    locale,
    "aboutInterests",
  )
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const publications = getLocalized(
    settings,
    locale,
    "aboutPublications",
  );

  return (
    <div className="container-page py-16 md:py-24 lg:py-28">

      {/* ─────────────────────────────────────────────
          INTRO
      ───────────────────────────────────────────── */}

      <div className="grid gap-14 md:grid-cols-[0.8fr_1.2fr] md:gap-20 lg:gap-28">

        {/* Portrait */}
        <div className="fade-in">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-[480px] overflow-hidden rounded-[1.5rem] bg-[var(--bg-elevated)] md:mx-0">
            {settings.aboutImage ? (
              <Image
                src={settings.aboutImage.url}
                alt={
                  getLocalized(
                    settings.aboutImage,
                    locale,
                    "alt",
                  ) || settings.authorName
                }
                fill
                className="object-cover transition-transform duration-1000 hover:scale-[1.02]"
                sizes="(max-width: 768px) 100vw, 40vw"
                priority
              />
            ) : (
              <div className="absolute inset-0 bg-[linear-gradient(160deg,#ececec,#cfcfcf)] dark:bg-[linear-gradient(160deg,#1c1c1f,#101012)]" />
            )}
          </div>

          <div className="mt-7 border-t border-[var(--border)] pt-5">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--fg-subtle)]">
              {dict.about.connect}
            </p>

            <SocialLinks
              settings={settings}
              className="mt-4"
            />
          </div>
        </div>

        {/* Main introduction */}
        <div className="fade-in md:pt-2">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-[var(--accent)]" />

            <p className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--fg-subtle)]">
              {dict.about.title}
            </p>
          </div>

          <h1 className="mt-6 max-w-3xl font-serif text-[3.2rem] leading-[0.98] tracking-[-0.045em] sm:text-[4rem] md:text-[4.75rem]">
            {settings.authorName}
          </h1>

          <p className="mt-8 max-w-2xl text-lg leading-8 text-[var(--fg-muted)] md:text-xl md:leading-9">
            {shortBio}
          </p>

          <div className="prose-article mt-10 !max-w-none">
            {longBio
              .split(/\n\n+/)
              .map((para, i) => (
                <p key={i}>{para}</p>
              ))}
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────
          PHILOSOPHY
      ───────────────────────────────────────────── */}

      {philosophy ? (
        <section className="mt-20 border-t border-[var(--border)] pt-14 md:mt-28 md:pt-20">
          <div className="grid gap-8 md:grid-cols-[0.8fr_1.2fr] md:gap-20">
            <div>
              <div className="flex items-center gap-3">
                <span className="h-px w-6 bg-[var(--accent)]" />

                <h2 className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--fg-subtle)]">
                  {dict.about.philosophy}
                </h2>
              </div>
            </div>

            <p className="max-w-3xl font-serif text-2xl leading-relaxed tracking-[-0.02em] md:text-3xl md:leading-relaxed">
              {philosophy}
            </p>
          </div>
        </section>
      ) : null}

      {/* ─────────────────────────────────────────────
          INTERESTS
      ───────────────────────────────────────────── */}

      {interests.length ? (
        <section className="mt-16 border-t border-[var(--border)] pt-12 md:mt-20 md:pt-16">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <h2 className="font-serif text-3xl tracking-[-0.03em] md:text-4xl">
              {dict.about.interests}
            </h2>

            <ul className="flex max-w-2xl flex-wrap gap-2">
              {interests.map((item) => (
                <li
                  key={item}
                  className="rounded-full border border-[var(--border)] px-4 py-2 text-sm text-[var(--fg-muted)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--fg)]"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {/* ─────────────────────────────────────────────
          PUBLICATIONS
      ───────────────────────────────────────────── */}

      {publications.trim() ? (
        <section className="mt-16 border-t border-[var(--border)] pt-12 md:mt-20 md:pt-16">
          <div className="grid gap-8 md:grid-cols-[0.8fr_1.2fr] md:gap-20">
            <h2 className="font-serif text-3xl tracking-[-0.03em] md:text-4xl">
              {dict.about.publications}
            </h2>

            <ul className="max-w-2xl space-y-4">
              {publications
                .split("\n")
                .map((line) => line.trim())
                .filter(Boolean)
                .map((line) => (
                  <li
                    key={line}
                    className="border-l-2 border-[var(--accent)] pl-5 text-base leading-7 text-[var(--fg-muted)]"
                  >
                    {line}
                  </li>
                ))}
            </ul>
          </div>
        </section>
      ) : null}
    </div>
  );
}
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
      languages: { en: absoluteUrl("/en/about"), id: absoluteUrl("/id/about") },
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
  const philosophy = getLocalized(settings, locale, "aboutPhilosophy");
  const interests = getLocalized(settings, locale, "aboutInterests")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const publications = getLocalized(settings, locale, "aboutPublications");

  return (
    <div className="container-page py-14 md:py-20">
      <div className="grid gap-12 md:grid-cols-[0.85fr_1.15fr] md:gap-16">
        <div>
          <div className="relative aspect-[4/5] overflow-hidden border border-[var(--border)] bg-[var(--bg-elevated)]">
            {settings.aboutImage ? (
              <Image
                src={settings.aboutImage.url}
                alt={
                  getLocalized(settings.aboutImage, locale, "alt") ||
                  settings.authorName
                }
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 40vw"
                priority
              />
            ) : (
              <div className="absolute inset-0 bg-[linear-gradient(160deg,#ececec,#cfcfcf)] dark:bg-[linear-gradient(160deg,#1c1c1f,#101012)]" />
            )}
          </div>
          <div className="mt-6">
            <p className="text-sm text-[var(--fg-muted)]">{dict.about.connect}</p>
            <SocialLinks settings={settings} className="mt-3" />
          </div>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-[var(--fg-subtle)]">
            {dict.about.title}
          </p>
          <h1 className="mt-3 font-serif text-4xl tracking-tight md:text-5xl">
            {settings.authorName}
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-[var(--fg-muted)]">{shortBio}</p>
          <div className="prose-article mt-10 !max-w-none">
            {longBio.split(/\n\n+/).map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>

          {philosophy ? (
            <section className="mt-12 border-t border-[var(--border)] pt-10">
              <h2 className="font-serif text-2xl tracking-tight">
                {dict.about.philosophy}
              </h2>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-[var(--fg-muted)]">
                {philosophy}
              </p>
            </section>
          ) : null}

          {interests.length ? (
            <section className="mt-12 border-t border-[var(--border)] pt-10">
              <h2 className="font-serif text-2xl tracking-tight">
                {dict.about.interests}
              </h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {interests.map((item) => (
                  <li
                    key={item}
                    className="border border-[var(--border)] px-3 py-1.5 text-sm text-[var(--fg-muted)]"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {publications.trim() ? (
            <section className="mt-12 border-t border-[var(--border)] pt-10">
              <h2 className="font-serif text-2xl tracking-tight">
                {dict.about.publications}
              </h2>
              <ul className="mt-4 space-y-2 text-[var(--fg-muted)]">
                {publications
                  .split("\n")
                  .map((line) => line.trim())
                  .filter(Boolean)
                  .map((line) => (
                    <li key={line} className="border-l-2 border-[var(--border)] pl-4">
                      {line}
                    </li>
                  ))}
              </ul>
            </section>
          ) : null}
        </div>
      </div>
    </div>
  );
}

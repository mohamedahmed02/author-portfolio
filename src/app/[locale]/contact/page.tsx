import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { SocialLinks } from "@/components/social-links";
import { getDictionary } from "@/lib/dictionary";
import { getSiteSettings } from "@/lib/content";
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

  return {
    title: dict.contact.title,
    description: dict.contact.title,
    alternates: {
      canonical: absoluteUrl(`/${locale}/contact`),
      languages: {
        en: absoluteUrl("/en/contact"),
        id: absoluteUrl("/id/contact"),
      },
    },
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;

  if (!isLocale(raw)) notFound();

  const locale = raw as Locale;
  const dict = getDictionary(locale);
  const settings = await getSiteSettings();

  return (
    <div className="container-page py-16 md:py-24 lg:py-28">
      <div className="grid gap-14 md:grid-cols-[0.8fr_1.2fr] md:gap-20 lg:gap-28">

        {/* Intro */}
        <div className="fade-in">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-[var(--accent)]" />

            <p className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--fg-subtle)]">
              {dict.contact.title}
            </p>
          </div>

          <h1 className="mt-6 max-w-lg font-serif text-[3.2rem] leading-[0.98] tracking-[-0.045em] sm:text-[4rem] md:text-[4.5rem]">
            {dict.contact.title}
          </h1>

          <p className="mt-7 max-w-md text-base leading-8 text-[var(--fg-muted)] md:text-lg">
            {getLocalized(settings, locale, "contactIntro")}
          </p>

          <div className="mt-10 border-t border-[var(--border)] pt-6">
            {settings.contactEmail ? (
              <a
                href={`mailto:${settings.contactEmail}`}
                className="inline-flex text-sm font-medium link-underline"
              >
                {settings.contactEmail}
              </a>
            ) : null}

            <SocialLinks
              settings={settings}
              className="mt-5"
            />
          </div>
        </div>

        {/* Form */}
        <div className="fade-in md:pt-2">
          <ContactForm
            locale={locale}
            dict={dict}
            successMessage={getLocalized(
              settings,
              locale,
              "contactSuccess",
            )}
          />
        </div>
      </div>
    </div>
  );
}
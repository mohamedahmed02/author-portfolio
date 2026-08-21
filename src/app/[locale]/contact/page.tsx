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
    <div className="container-page py-14 md:py-20">
      <div className="grid gap-12 md:grid-cols-[0.9fr_1.1fr] md:gap-16">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-[var(--fg-subtle)]">
            {dict.contact.title}
          </p>
          <h1 className="mt-3 font-serif text-4xl tracking-tight md:text-5xl">
            {dict.contact.title}
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-[var(--fg-muted)] md:text-lg">
            {getLocalized(settings, locale, "contactIntro")}
          </p>
          {settings.contactEmail ? (
            <a
              href={`mailto:${settings.contactEmail}`}
              className="mt-6 inline-flex text-sm link-underline"
            >
              {settings.contactEmail}
            </a>
          ) : null}
          <SocialLinks settings={settings} className="mt-8" />
        </div>

        <ContactForm
          locale={locale}
          dict={dict}
          successMessage={getLocalized(settings, locale, "contactSuccess")}
        />
      </div>
    </div>
  );
}

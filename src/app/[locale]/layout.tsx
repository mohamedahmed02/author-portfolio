import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { getDictionary } from "@/lib/dictionary";
import { isLocale, type Locale, getLocalized } from "@/lib/i18n";
import { getSiteSettings } from "@/lib/content";
import { absoluteUrl } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  return [{ locale: "en" }, { locale: "id" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return {};
  const locale = raw as Locale;
  const settings = await getSiteSettings();
  const title =
    getLocalized(settings, locale, "defaultSeoTitle") ||
    getLocalized(settings, locale, "siteName");
  const description =
    getLocalized(settings, locale, "defaultSeoDescription") ||
    getLocalized(settings, locale, "heroDescription");

  return {
    title: {
      default: title,
      template: `%s · ${getLocalized(settings, locale, "siteName")}`,
    },
    description,
    alternates: {
      canonical: absoluteUrl(`/${locale}`),
      languages: {
        en: absoluteUrl("/en"),
        id: absoluteUrl("/id"),
      },
    },
    openGraph: {
      title,
      description,
      url: absoluteUrl(`/${locale}`),
      siteName: getLocalized(settings, locale, "siteName"),
      locale: locale === "id" ? "id_ID" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const dict = getDictionary(locale);
  const settings = await getSiteSettings();
  const siteName = getLocalized(settings, locale, "siteName");

  return (
    <div className="flex min-h-screen flex-col" lang={locale}>
      <SiteHeader locale={locale} siteName={siteName} dict={dict} />
      <main className="flex-1">{children}</main>
      <SiteFooter locale={locale} siteName={siteName} dict={dict} />
    </div>
  );
}
